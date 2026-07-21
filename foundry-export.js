/* ============================================================================
   FOUNDRY CHAT LOG EXPORT
   Paste into the browser console at SESSION END, then paste clipboard into
   the campaign's rolls.txt (or wherever that campaign keeps its roll log).

   Works for any Foundry game, any system. Nothing here is campaign-specific.
   ============================================================================

   WHY THIS EXISTS
   Copy-pasting the Foundry chat pane loses the speaker name and the roll
   modifiers (modifiers live in collapsed tooltips that aren't in the DOM).
   Without the speaker you cannot attribute damage to a PC, and the whole
   encounter-analysis pipeline degrades to guesswork. This dump keeps
   everything the client received.

   HOW
     1. In Foundry, press F12 -> Console.
     2. Paste EXPORT (below), Enter.
     3. It prints `undefined`. That is NORMAL — copy() always returns undefined.
     4. Paste the clipboard into rolls.txt (replace the whole file).

   WHAT YOU GET
     # Foundry export — 1043 of 5210 messages
     # 19/07/2026, 13:02:36  ->  19/07/2026, 17:14:22   (window: 6h)

     === ENCOUNTER 6 ===
     [21:14:07] Sattva :: Initiative: Perception Modifier +22 :: 1d20 + 22 = 31
     [21:16:52] Ferrok :: Melee Strike: +2 Greater Striking Bastard Sword
                Target: Kannitri (AC 35 31) Result: Hit by +7
                Strength +5 Expert +15 Weapon Potency +2 :: 1d20 + 22 = 39 :: 39
     [21:16:58] Kannitri :: Kannitri takes 20 damage. They are destroyed.

   Which yields, without ever opening a bestiary:
     - speaker on every line (damage attribution, kill credit)
     - target's REAL AC, and its reduced AC when off-guard/frightened
     - hit/miss margin ("Hit by +7") -> exact accuracy stats
     - full modifier fingerprint -> tells you WHO rolled when names collide
     - damage by type, and "They are destroyed" kill confirmations
     - enemy attack bonuses, Perception (from initiative), and save modifiers
       -> reverse-engineer creature level without the stat block
     - wall-clock timestamps -> align the log to a session recording/transcript
     - === ENCOUNTER N === splits, auto-detected from initiative clusters
     - SAVE lines: every target's saving throw vs your spells --
           SAVE :: Sand Monk D :: reflex vs DC 30 :: nat 1 = 26 :: criticalFailure
           SAVE :: Sand Monk E :: reflex vs DC 30 :: nat 11 = 31 :: success :: Frightened 2 -2
       natural die, total, degree of success, AND the modifier breakdown --
       which shows exactly what your debuffs (Frightened, Sickened) bought.

   CAVEATS
     - Only messages YOUR client can see. GM blind rolls are excluded.
     - Foundry prunes old messages. Export at session end, not days later.
     - CHECK FOR DOUBLE-PASTE. The 2026-07-19 log contained encounters 1-3
       twice, which silently doubled every HP estimate until caught. The two
       `#` header lines make this obvious now — if you see two headers, or the
       message count doesn't match the body, you pasted twice.
     - Sessions are auto-detected by time gap (GAP_HOURS, default 8); clusters
       under MIN_MESSAGES are treated as strays and skipped, so a token healed
       the next day can't anchor the window. SESSION = 0 exports the latest,
       1 the one before, and the header lists every session found.
     - Foundry loads chat incrementally. If you WANT older sessions, scroll the
       chat pane to the top first to force them into game.messages, then pick
       one with SESSION (the header lists what's available).
     - SAVE lines come from the **pf2e-toolbelt** module, which persists
       per-target save data in message flags. Tables not running that module
       won't produce them; everything else still works. The saves are NOT in
       the visible chat text -- only in flags -- which is why a plain copy of
       the chat pane loses them entirely.
   ========================================================================== */


/* ============================== EXPORT ==================================== */

copy((() => {
  /* --- session selection -------------------------------------------------
     Sessions are detected by TIME GAPS, not a fixed window, because stray
     messages (someone healing a token the next day) would otherwise anchor
     the window and cut the real session out. Clusters smaller than
     MIN_MESSAGES are treated as strays and skipped.                       */
  const GAP_HOURS    = 8;   // a gap this big means a different session
  const MIN_MESSAGES = 40;  // ignore trailing clusters smaller than this
  const SESSION      = 0;   // 0 = latest real session, 1 = the one before, ...

  const all = [...game.messages.contents]
    .filter(m => m.timestamp)
    .sort((a, b) => a.timestamp - b.timestamp);
  if (!all.length) return '(no messages loaded)';

  // split into clusters on large time gaps
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
  const kept = pool[pool.length - 1 - SESSION] ?? pool[pool.length - 1];

  const fmt = t => new Date(t).toLocaleString('en-GB', { hour12: false });
  const decode = str => str
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  const strip = str => decode(String(str ?? '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ').trim();

  const out = [
    `# Foundry export — ${kept.length} messages` +
      ` (session ${pool.length - SESSION} of ${pool.length} detected)`,
    `# ${fmt(kept[0].timestamp)}  ->  ${fmt(kept[kept.length - 1].timestamp)}`,
    `# all sessions found: ` +
      pool.map((c, i) => `[${i + 1}] ${fmt(c[0].timestamp).split(',')[0]} (${c.length})`).join('  '),
    ''
  ];

  // token id -> name, so save results can be attributed
  const tokenNames = {};
  for (const sc of game.scenes ?? []) for (const t of sc.tokens ?? []) tokenNames[t.id] = t.name;

  // pf2e-toolbelt persists per-target saves (nat die, total, degree, modifiers)
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

  let enc = 0, prevWasInit = false;
  for (const m of kept) {
    const who     = m.alias ?? '?';
    const flavor  = strip(m.flavor);
    const rollArr = m.rolls ?? (m.roll ? [m.roll] : []);
    const rolls   = rollArr.map(r => `${r.formula} = ${r.total}`).join(' | ');
    const text    = strip(m.content);

    const isInit = m.flags?.core?.initiativeRoll === true || /^Initiative\b/i.test(flavor);
    if (isInit && !prevWasInit) out.push(`\n=== ENCOUNTER ${++enc} ===`);
    prevWasInit = isInit;

    const clock = new Date(m.timestamp).toLocaleTimeString('en-GB', { hour12: false });
    const body  = [who, flavor, rolls, text].filter(Boolean).join(' :: ');
    if (body.replace(/[^a-z0-9]/gi, '').length > 1) out.push(`[${clock}] ${body}`);
    out.push(...saveLines(m));
  }
  return out.join('\n');
})());


/* ============================ DIAGNOSTICS ================================
   Only needed if the export comes out empty or wrong.

   // 1. Does the client hold this session's messages?
   game.messages.contents.length

   // 2. Do the fields the script needs exist?
   const m = game.messages.contents.at(-1);
   console.log('alias:', m.alias, '| rolls:', m.rolls?.length,
               '| content:', m.content?.slice(0, 80));
   //   alias prints a name   -> speaker attribution works
   //   rolls prints a number -> Foundry v10+, array form correct
   //   rolls is undefined    -> Foundry v9, the m.roll fallback covers it

   // 3. Print the last 10 messages instead of copying, to eyeball the format:
   console.log(game.messages.contents.slice(-10).map(m =>
     [m.alias, (m.flavor ?? '').replace(/<[^>]*>/g,''),
      (m.rolls ?? []).map(r => `${r.formula} = ${r.total}`).join(' | '),
      (m.content ?? '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()
     ].filter(Boolean).join(' :: ')).join('\n'));
   ========================================================================= */


/* ========================= ALTERNATIVE: ask the GM =======================
   Foundry has a built-in GM-side "Export Chat Log" in the chat sidebar's
   context menu. It writes a .txt with speakers and roll results attached, and
   captures blind/GM rolls this script cannot see. Worth asking for if you ever
   want the complete picture.
   ========================================================================= */


/* ============================ API REFERENCE ==============================
   verified against the official docs, 2026-07

   game.messages        singleton ChatMessage collection for the active world
   .contents            array form of a Foundry Collection
   ChatMessage#alias    "recommended String alias" — token name for IC/dice
                        rolls, username for OOC/whispers
   ChatMessage#rolls    ArrayField of rolls (v10+). v9 used singular #roll.
   ChatMessage#timestamp epoch ms
   copy()               browser devtools clipboard helper, NOT a Foundry API

   https://foundryvtt.com/api/v12/interfaces/foundry.types.ChatMessageData.html
   https://foundryvtt.com/api/v11/classes/client.ChatMessage.html
   ========================================================================= */
