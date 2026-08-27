/* ============================================================================
   FOUNDRY CHAT LOG EXPORT — EXPERIMENT / NARROW WINDOW
   Scratch version of foundry-export.js. Do NOT use this for the real session
   dump; it exists so we can iterate on new extractors against a small slice
   of the log instead of re-dumping four hours every time.

   ---------------------------------------------------------------------------
   WHAT WE LEARNED (2026-08-23, verified against the S12 log)
   ---------------------------------------------------------------------------
   `Target has:` and `(Has potential!)` in rolls.txt are NOT Foundry output.
   Both come from the module **pf2e-modifiers-matter** (shemetz). Its en.json:
       "TargetHas":    "Target has:"
       "HasPotential": "(Has potential!)"

   That module answers, per modifier, "did this actually change the outcome?":
       ESSENTIAL   (strong green) - removing THIS ALONE downgrades the result
       HELPFUL     (weak green)   - not needed alone, but the group was needed
       DETRIMENTAL (red)          - ESSENTIAL, in the penalty direction
       HARMFUL     (orange)       - HELPFUL, in the penalty direction
       NONE                       - changed nothing
   Significance is judged from the ROLLER's point of view. On an ENEMY's attack
   roll, DETRIMENTAL/HARMFUL is what the party's debuffs bought; ESSENTIAL on
   an enemy roll means something helped the ENEMY.

   TWO WAYS TO GET IT, AND ONLY ONE WORKS ON OLD MESSAGES:

   1. window.pf2eMm.getSignificantModifiersOfMessage(msg)  -- LIVE ONLY.
      It recomputes, and the DC-side half reads the target's CURRENT state:
          targetedActor.system.attributes.ac.modifiers
      Once the fight ends and conditions drop off (or the token is deleted),
      off-guard / frightened / sickened are gone, so it under-reports. On the
      S12 T-rex window it returned 4 ESSENTIAL and 0 HELPFUL, while the live
      chat cards had shown olive chips all over that same fight.

   2. The message's stored flavor HTML  -- RETROACTIVE, authoritative.
      The module hooks preCreateChatMessage and writes its verdict INTO the
      message via updateSource({flavor}), as CSS classes:
          roll-side: <span class="tag ... pf2emm-highlight pf2emm-is-ESSENTIAL">
          DC-side:   <span class="pf2emm-suffix pf2emm-is-HELPFUL">Off-Guard -2</span>
      Those classes are persisted. foundry-export.js strips all HTML, which is
      exactly the information we spent a day reconstructing from AC pairs.

   So: parse the flavor HTML. The API call is kept below only as a control.

   ---------------------------------------------------------------------------
   HOW
     1. F12 -> Console in Foundry.
     2. Set FROM / TO below to the slice you want.
     3. Paste, Enter, then paste the clipboard wherever you're testing.

   CAVEATS
     - Non-stacking modifiers are hidden by PF2e before the module sees them
       (author's own note). A creature that is both Frightened 1 and Sickened 1
       reports only one. MM counts are a FLOOR.
     - DC-side suffix spans drop the condition value: "Frightened 3" renders as
       "Frightened -3", so the name loses its number. The value is in the text.
     - `pf2emm-is-NONE` suffixes only appear if the GM enabled the module's
       'always-show-defense-conditions' setting.
   ========================================================================== */

copy((() => {
  /* ------------------------------ CONFIG -------------------------------- */
  const SESSION = 0;          // 0 = latest detected session, 1 = previous, ...
  const FROM    = '14:10:00'; // window start, local clock, '' = session start
  const TO      = '14:30:00'; // window end,   local clock, '' = session end
  const DEBUG_N = 2;          // dump raw flavor HTML for the first N MM hits
  const RUN_API = true;       // also call the live API, as a control

  /* Default window is the Tyrannosaurus Imperator fight of 2026-08-23, chosen
     because it contains cards whose colours were verified by screenshot:
       14:24:30 Sovael  -> Tyrannosaurus A, rolled 35  = all chips HELPFUL
       14:26:30 Sattva  -> Tyrannosaurus A, rolled 43  = Anthem + Off-Guard ESSENTIAL
     If the MM lines disagree with those two, the extractor is wrong.        */

  const GAP_HOURS = 8, MIN_MESSAGES = 40;

  /* --------------------------- session select --------------------------- */
  const all = [...game.messages.contents]
    .filter(m => m.timestamp)
    .sort((a, b) => a.timestamp - b.timestamp);
  if (!all.length) return '(no messages loaded)';

  const clusters = [];
  let cur = [];
  for (const m of all) {
    if (cur.length && m.timestamp - cur[cur.length - 1].timestamp > GAP_HOURS * 3600e3) {
      clusters.push(cur); cur = [];
    }
    cur.push(m);
  }
  if (cur.length) clusters.push(cur);
  const real = clusters.filter(c => c.length >= MIN_MESSAGES);
  const pool = real.length ? real : clusters;
  const session = pool[pool.length - 1 - SESSION] ?? pool[pool.length - 1];

  /* ---------------------------- time window ----------------------------- */
  const clockOf = t => new Date(t).toLocaleTimeString('en-GB', { hour12: false });
  const kept = session.filter(m => {
    const c = clockOf(m.timestamp);
    return (!FROM || c >= FROM) && (!TO || c <= TO);
  });

  /* ------------------------------ helpers ------------------------------- */
  const fmt    = t => new Date(t).toLocaleString('en-GB', { hour12: false });
  const decode = s => String(s ?? '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  const strip  = s => decode(String(s ?? '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ').trim();

  const tokenNames = {};
  for (const sc of game.scenes ?? []) for (const t of sc.tokens ?? []) tokenNames[t.id] = t.name;

  // pf2e-toolbelt: per-target saving throws (nat die, total, degree, modifiers)
  const saveLines = m => {
    const tb = m.flags?.['pf2e-toolbelt']?.targetHelper;
    const out = [];
    for (const v of Object.values(tb?.saveVariants ?? {})) {
      for (const [tid, s] of Object.entries(v?.saves ?? {})) {
        const who  = tokenNames[tid] ?? tid;
        const mods = (s.modifiers ?? []).filter(x => !x.excluded)
          .map(x => `${x.label} ${x.modifier >= 0 ? '+' : ''}${x.modifier}`).join(', ');
        out.push(`    SAVE :: ${who} :: ${s.statistic} vs DC ${v.dc}` +
                 ` :: nat ${s.die} = ${s.value} :: ${s.success}` + (mods ? ` :: ${mods}` : ''));
      }
    }
    return out;
  };

  /* ---- PRIMARY: read the verdict the module persisted into the flavor --- */
  const mmTally = {};
  const mmDebug = [];
  const bump = k => { mmTally[k] = (mmTally[k] ?? 0) + 1; };

  const mmLines = m => {
    const html = m.flavor ?? '';
    if (!html.includes('pf2emm-')) return [];
    const div = document.createElement('div');
    div.innerHTML = html;
    const out = [];
    for (const el of div.querySelectorAll('[class*="pf2emm-is-"]')) {
      const sig  = (String(el.className).match(/pf2emm-is-([A-Z]+)/) || [])[1] ?? '?';
      const side = el.classList.contains('pf2emm-suffix') ? 'dc' : 'roll';
      const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      bump(`${sig}`);
      out.push(`    MM :: ${sig.padEnd(11)} :: ${text} :: applied to ${side}`);
    }
    if (out.length && mmDebug.length < DEBUG_N) {
      mmDebug.push(`# ${clockOf(m.timestamp)} ${m.alias} flavor:\n#   ` +
                   html.replace(/\s+/g, ' ').slice(0, 900));
    }
    return out;
  };

  /* ---- CONTROL: the live API. Under-reports on old messages (see header). */
  const mmApi    = globalThis.pf2eMm;
  const apiTally = {};
  const apiLines = m => {
    if (!RUN_API || !mmApi?.getSignificantModifiersOfMessage) return [];
    let mods;
    try { mods = mmApi.getSignificantModifiersOfMessage(m) ?? []; }
    catch (e) { apiTally.ERROR = (apiTally.ERROR ?? 0) + 1; return []; }
    return mods.map(x => {
      apiTally[x.significance] = (apiTally[x.significance] ?? 0) + 1;
      const v = `${x.value >= 0 ? '+' : ''}${x.value}`;
      return `    MMAPI :: ${String(x.significance).padEnd(11)} :: ${x.name} ${v} :: applied to ${x.appliedTo}`;
    });
  };

  /* ------------------------------- build -------------------------------- */
  const body = [];
  let enc = 0, prevWasInit = false;
  for (const m of kept) {
    const who     = m.alias ?? '?';
    const flavor  = strip(m.flavor);
    const rollArr = m.rolls ?? (m.roll ? [m.roll] : []);
    const rolls   = rollArr.map(r => `${r.formula} = ${r.total}`).join(' | ');
    const text    = strip(m.content);

    const isInit = m.flags?.core?.initiativeRoll === true || /^Initiative\b/i.test(flavor);
    if (isInit && !prevWasInit) body.push(`\n=== ENCOUNTER ${++enc} ===`);
    prevWasInit = isInit;

    const line = [who, flavor, rolls, text].filter(Boolean).join(' :: ');
    if (line.replace(/[^a-z0-9]/gi, '').length > 1) body.push(`[${clockOf(m.timestamp)}] ${line}`);
    body.push(...saveLines(m));
    body.push(...mmLines(m));
    body.push(...apiLines(m));
  }

  /* ------------------------------ header -------------------------------- */
  const tallyStr = t => Object.entries(t).filter(([, n]) => n)
    .map(([k, n]) => `${k}=${n}`).join('  ') || 'none';

  const head = [
    `# EXPERIMENT export — ${kept.length} of ${session.length} messages in session` +
      ` (session ${pool.length - SESSION} of ${pool.length} detected)`,
    `# window ${FROM || '(start)'} .. ${TO || '(end)'}` +
      (kept.length ? `   actual ${fmt(kept[0].timestamp)} -> ${fmt(kept[kept.length - 1].timestamp)}` : ''),
    `# SELF-TEST  MM from stored flavor (authoritative) : ${tallyStr(mmTally)}`,
    `# SELF-TEST  MMAPI from live recompute (control)   : ` +
      (mmApi?.getSignificantModifiersOfMessage ? tallyStr(apiTally) : '** pf2eMm API not found **'),
    `#            MMAPI is expected to be LOWER — it re-reads current actor state.`,
    ...(mmDebug.length ? ['# RAW FLAVOR SAMPLES (shape check):', ...mmDebug] : []),
    ''
  ];

  if (!kept.length) {
    head.push(`# window matched 0 messages — session runs ` +
      `${clockOf(session[0].timestamp)} .. ${clockOf(session[session.length - 1].timestamp)}`);
  }

  return head.concat(body).join('\n');
})());


/* ============================== NOTES ======================================

   ITERATION LOOP
     Change one extractor -> re-paste -> eyeball ~150 lines. Only promote a
     change into foundry-export.js once the narrow window looks right.

   VALIDATION TARGETS for the default 14:10..14:30 window
     14:13:42  Clutch  Jaws        -> Tyrannosaurus A  rolled 45, crit
                 expect MM: Courageous Anthem ESSENTIAL (roll)
     14:24:30  Sovael  Divine Spell-> Tyrannosaurus A  rolled 35, hit
                 expect MM: Anthem / Ring of Divine Might HELPFUL (roll),
                            Off-Guard HELPFUL (dc)
                 -- this is the one the live API misses entirely
     14:26:30  Sattva  Bow         -> Tyrannosaurus A  rolled 43, crit
                 expect MM: Anthem ESSENTIAL (roll), Off-Guard ESSENTIAL (dc)
     14:27:44  Clutch  Jaws        -> Tyrannosaurus A  rolled 33, hit
                 expect MM: Anthem ESSENTIAL (roll), Off-Guard ESSENTIAL (dc)
     14:18:17  T-rex B Jaws        -> Clutch           rolled 48, crit
                 enemy roll: Off-Guard on Clutch helped the ENEMY, so it is
                 ESSENTIAL from the roller's view. Not party value.

   IF MM LINES COME BACK EMPTY
     // is the module there, and did it write into old messages?
     game.modules.get('pf2e-modifiers-matter')?.active
     game.messages.contents.filter(m => (m.flavor ?? '').includes('pf2emm-')).length

     // look at one known message's raw flavor
     const m = game.messages.contents.find(x =>
       x.alias === 'Sattva' && new Date(x.timestamp)
         .toLocaleTimeString('en-GB', {hour12:false}) === '14:26:30');
     console.log(m.flavor);

   OTHER THINGS window.pf2eMm EXPOSES (live only, same staleness caveat)
     parsePf2eChatMessageWithRoll(msg)  - dieRoll, deltaFromDc, degree, all mods
     calcSignificantModifiers({...})    - the raw scoring function
     getDcModsAndDcActor({...})         - target-side modifiers + the DC actor
     filterOutIgnoredModifiers(mods)    - drops the labels the module ignores
     IGNORED_MODIFIER_LABELS            - what it deliberately never counts
   ========================================================================= */
