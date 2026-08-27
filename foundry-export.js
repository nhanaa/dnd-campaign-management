/* ============================================================================
   FOUNDRY CHAT LOG EXPORT  (v2)
   Paste into the browser console at SESSION END, then paste clipboard into
   the campaign's rolls.txt (or wherever that campaign keeps its roll log).

   Works for any Foundry game. The v2 extractors are PF2e-specific and simply
   emit nothing on other systems.
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

   ---------------------------------------------------------------------------
   WHAT'S NEW IN v2  (2026-08-23)
   ---------------------------------------------------------------------------
   v1 emitted one line per message, built from rendered text. Everything below
   comes from message FLAGS instead, and is exact rather than reconstructed.
   The v1 lines are unchanged, so old parsers keep working; v2 data arrives as
   indented `KEY ::` sub-lines, same as the existing SAVE lines.

     CTX  :: roll type, the REAL DC used, outcome, natural die, total, margin,
             encounter round/turn, Foundry's own threat rating, reroll flag
     HP   :: the roller's live HP, printed only when it changes. Combined with
             hp-percent this yields each creature's TRUE max HP directly --
             which retires the whole "targeted-hit HP floor" reconstruction.
     COND :: every condition on self / target / origin AT ROLL TIME, with
             values (frightened:2, sickened:1). No more inferring from AC.
     MOD  :: status/circumstance modifiers with their type, and critically any
             modifier PF2e SUPPRESSED for non-stacking (marked IGNORED) --
             the one thing the modifiers-matter highlight cannot show you.
     MM   :: pf2e-modifiers-matter's verdict per modifier:
               ESSENTIAL   - removing THIS ALONE downgrades the result
               HELPFUL     - not needed alone, but the group was needed
               DETRIMENTAL - ESSENTIAL, in the penalty direction
               HARMFUL     - HELPFUL, in the penalty direction
             Judged from the ROLLER's view: on an ENEMY roll, the party's
             debuffs show up as DETRIMENTAL/HARMFUL, not ESSENTIAL.
     DMG  :: the exact HP delta actually applied, and REVERTED applications
             (the GM undid them) which v1 silently counted as real damage.
     ORIG :: the spell behind a roll, with its cast rank -- lets an AoE damage
             roll be paired to its caster and to every application.
     HEAL :: healer -> patient, amount, degree (from the Treat Wounds module).
     CREATURE :: real HP/AC/saves/level and the elite|weak template, read from
             the token actors, for THE SCENES THIS SESSION TOUCHED ONLY.

   ⚠️ SCENE FILTER — DO NOT REMOVE
   The creature roster is deliberately restricted to scenes referenced by this
   session's messages. Walking every scene in the world dumps the entire
   remaining adventure path -- unplayed encounters, boss stat blocks, scene
   names -- straight into the log. That is a spoiler leak, and for an AP being
   played fresh it is the single most damaging thing this script could do.

   CAVEATS
     - Only messages YOUR client can see. GM blind rolls are excluded.
     - Foundry prunes old messages. Export at session end, not days later.
     - CHECK FOR DOUBLE-PASTE. Two `#` header blocks means you pasted twice.
     - Sessions are auto-detected by time gap (GAP_HOURS, default 8); clusters
       under MIN_MESSAGES are treated as strays and skipped. SESSION = 0
       exports the latest, 1 the one before; the header lists what was found.
     - SAVE lines need the **pf2e-toolbelt** module; MM lines need
       **pf2e-modifiers-matter**. Both degrade to silence if absent.
     - `game.combats` is usually EMPTY (combats get deleted after a fight), so
       round/turn come from context options instead.
     - Token actors in a scene may be pristine copies that were never fought.
       Trust the HP lines (live, per-roll) over the CREATURE roster's `hp`.
   ========================================================================== */


/* ============================== EXPORT ==================================== */

copy((() => {
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
  const decode = str => String(str ?? '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  const strip = str => decode(String(str ?? '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ').trim();
  const pf = m => m.flags?.pf2e ?? m.flags?.sf2e ?? {};
  const num = n => (n >= 0 ? '+' : '') + n;

  /* --- scene discovery: ONLY scenes this session actually referenced ------
     Prevents the creature roster from dumping unplayed content. Scene ids are
     embedded in the uuids Foundry stores on every targeted roll.           */
  const sceneIds = new Set();
  const grabScenes = s => { for (const mm of String(s ?? '').matchAll(/Scene\.([A-Za-z0-9]+)/g)) sceneIds.add(mm[1]); };
  for (const m of kept) {
    const c = pf(m).context;
    grabScenes(c?.origin?.token); grabScenes(c?.origin?.actor);
    grabScenes(c?.target?.token); grabScenes(c?.target?.actor);
    grabScenes(pf(m).origin?.uuid);
    for (const t of m.flags?.['pf2e-thaum-vuln']?.targets ?? []) grabScenes(t.tokenUuid);
    for (const t of m.flags?.['pf2e-toolbelt']?.targetHelper?.targets ?? []) grabScenes(t);
  }
  const scenes = [...(game.scenes ?? [])].filter(sc => sceneIds.has(sc.id));

  // token id -> name, for save attribution (scene-filtered)
  const tokenNames = {};
  for (const sc of scenes) for (const t of sc.tokens ?? []) tokenNames[t.id] = t.name;

  /* --- creature roster, scene-filtered ---------------------------------- */
  const roster = [];
  for (const sc of scenes) for (const tk of sc.tokens ?? []) {
    try {
      const a = tk.actor;
      if (!a || a.type !== 'npc') continue;
      const s = a.system ?? {};
      const list = arr => (arr ?? []).map(x => x.value != null ? `${x.type} ${x.value}` : (x.type ?? x)).join(', ');
      roster.push(`CREATURE :: ${tk.name} :: actor=${a.name} lvl=${s.details?.level?.value}` +
        ` ${s.attributes?.adjustment ?? 'normal'} :: HP ${s.attributes?.hp?.max} :: AC ${s.attributes?.ac?.value}` +
        ` :: F${s.saves?.fortitude?.value} R${s.saves?.reflex?.value} W${s.saves?.will?.value}` +
        ` :: Per ${s.perception?.mod ?? s.attributes?.perception?.value}` +
        (list(s.attributes?.weaknesses)  ? ` :: weak[${list(s.attributes.weaknesses)}]`   : '') +
        (list(s.attributes?.resistances) ? ` :: resist[${list(s.attributes.resistances)}]` : '') +
        (list(s.attributes?.immunities)  ? ` :: immune[${list(s.attributes.immunities)}]`  : '') +
        (strip(s.attributes?.hp?.details) ? ` :: ${strip(s.attributes.hp.details)}` : ''));
    } catch (e) { /* no permission on this token; skip quietly */ }
  }
  roster.sort();

  /* --- roll-option parsing ----------------------------------------------- */
  const parseOpts = ctx => {
    const out = { cond: { self: {}, target: {}, origin: {} }, flank: [] };
    for (const o of ctx?.options ?? []) {
      let m;
      if ((m = o.match(/^(self|target|origin):condition:(.+)$/))) {
        const who = m[1]; let name = m[2], val = null;
        const v = name.match(/^(.*):(\d+)$/);
        if (v) { name = v[1]; val = v[2]; }
        // a valued entry supersedes the bare one
        if (out.cond[who][name] == null || val != null) out.cond[who][name] = val;
      }
      else if ((m = o.match(/^(self|target|origin):flanking$/))) out.flank.push(m[1]);
      else if ((m = o.match(/^encounter:round:(\d+)$/)))   out.round  = m[1];
      else if ((m = o.match(/^encounter:turn:(\d+)$/)))    out.turn   = m[1];
      else if ((m = o.match(/^encounter:threat:([a-z]+)$/))) out.threat = m[1];
      else if ((m = o.match(/^hp-remaining:(\d+)$/)))      out.hpNow  = +m[1];
      else if ((m = o.match(/^hp-percent:(\d+)$/)))        out.hpPct  = +m[1];
    }
    for (const p of ctx?.contextualOptions?.postRoll ?? []) {
      let m;
      if ((m = p.match(/^check:total:natural:(\d+)$/)))  out.nat   = m[1];
      else if ((m = p.match(/^check:total:(\d+)$/)))     out.total = m[1];
      else if ((m = p.match(/^check:total:delta:(-?\d+)$/))) out.delta = +m[1];
    }
    return out;
  };
  const condStr = c => {
    const part = w => {
      const ks = Object.keys(c[w]);
      return ks.length ? `${w}: ` + ks.map(k => c[w][k] ? `${k}:${c[w][k]}` : k).join(', ') : '';
    };
    return ['self', 'target', 'origin'].map(part).filter(Boolean).join(' | ');
  };

  /* --- pf2e-modifiers-matter verdict, read from the STORED flavor --------
     The module writes its result into the message via updateSource(), as CSS
     classes. Recomputing live (window.pf2eMm) re-reads CURRENT actor state and
     under-reports badly once conditions have dropped off, so parse, don't call. */
  const mmLines = m => {
    const html = m.flavor ?? '';
    if (!html.includes('pf2emm-is-')) return [];
    const div = document.createElement('div');
    div.innerHTML = html;
    const out = [];
    for (const el of div.querySelectorAll('[class*="pf2emm-is-"]')) {
      const sig  = (String(el.className).match(/pf2emm-is-([A-Z]+)/) || [])[1];
      const side = el.classList.contains('pf2emm-suffix') ? 'dc' : 'roll';
      const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (sig && sig !== 'NONE' && text) out.push(`    MM :: ${sig} :: ${text} :: ${side}`);
    }
    return out;
  };

  /* --- pf2e-toolbelt: per-target saving throws --------------------------- */
  const saveLines = m => {
    const tb = m.flags?.['pf2e-toolbelt']?.targetHelper;
    const out = [];
    for (const v of Object.values(tb?.saveVariants ?? {})) {
      for (const [tid, s] of Object.entries(v?.saves ?? {})) {
        const who  = tokenNames[tid] ?? tid;
        const mods = (s.modifiers ?? []).filter(x => !x.excluded)
          .map(x => `${x.label} ${num(x.modifier)}`).join(', ');
        out.push(`    SAVE :: ${who} :: ${s.statistic} vs DC ${v.dc}` +
                 ` :: nat ${s.die} = ${s.value} :: ${s.success}` + (mods ? ` :: ${mods}` : ''));
      }
    }
    return out;
  };

  /* ------------------------------ build ---------------------------------- */
  const body = [];
  const hpSeen = {};              // alias -> last printed hp, for change-only HP lines
  const hpObs  = {};              // alias -> [[remaining, percent], ...] from CHECK rolls only
  const tally  = { ctx: 0, cond: 0, mm: 0, mod: 0, dmg: 0, reverted: 0, heal: 0, hp: 0, reroll: 0 };

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

    const clock = new Date(m.timestamp).toLocaleTimeString('en-GB', { hour12: false });
    const line  = [who, flavor, rolls, text].filter(Boolean).join(' :: ');
    if (line.replace(/[^a-z0-9]/gi, '').length > 1) body.push(`[${clock}] ${line}`);

    const ctx = pf(m).context;
    const o   = parseOpts(ctx);

    // CTX — the real DC, outcome, natural die, margin, round/turn/threat
    let isCheck = false;
    if (ctx && (ctx.dc || o.nat != null)) {
      isCheck = true;
      const bits = [`    CTX :: ${ctx.type ?? '?'}`];
      if (ctx.dc) bits.push(`dc ${ctx.dc.slug ?? '?'} ${ctx.dc.value}`);
      if (ctx.outcome) bits.push(`outcome ${ctx.outcome}` +
        (ctx.unadjustedOutcome && ctx.unadjustedOutcome !== ctx.outcome ? ` (unadjusted ${ctx.unadjustedOutcome})` : ''));
      if (o.nat != null)   bits.push(`nat ${o.nat} total ${o.total}` + (o.delta != null ? ` delta ${num(o.delta)}` : ''));
      if (o.round)         bits.push(`round ${o.round}${o.turn ? ` turn ${o.turn}` : ''}`);
      if (o.threat)        bits.push(`threat ${o.threat}`);
      if (ctx.mapIncreases) bits.push(`MAP+${ctx.mapIncreases}`);
      if (ctx.isReroll)   { bits.push('REROLL'); tally.reroll++; }
      body.push(bits.join(' :: ')); tally.ctx++;
    }

    /* HP — ONLY from the roller's own check messages.
       ⚠️ On a damage-application message the hp options belong to whoever dealt
       the damage, NOT to the `alias` taking it. Reading them there produced
       nonsense (a T-rex "at 167/350" was actually Clutch's 167/231). Verified
       against S12: check-only observations agree to ±1%, mixed ones scatter. */
    if (isCheck && o.hpNow != null && o.hpPct > 0) {
      (hpObs[who] ??= []).push([o.hpNow, o.hpPct]);
      if (hpSeen[who] !== o.hpNow) {
        hpSeen[who] = o.hpNow;
        body.push(`    HP :: ${who} ${o.hpNow} (${o.hpPct}%)`);
        tally.hp++;
      }
    }

    // COND — conditions on both sides at roll time, with values
    const cs = condStr(o.cond) + (o.flank.length ? `${condStr(o.cond) ? ' | ' : ''}flanking: ${o.flank.join(',')}` : '');
    if (cs) { body.push(`    COND :: ${cs}`); tally.cond++; }

    // MOD — situational modifiers, and anything PF2e SUPPRESSED for non-stacking
    const mods = (pf(m).modifiers ?? []).filter(x =>
      x.type === 'status' || x.type === 'circumstance' || x.ignored === true || x.enabled === false);
    if (mods.length) {
      body.push(`    MOD :: ` + mods.map(x =>
        `${x.label} ${num(x.modifier)} (${x.type}${x.ignored ? ', IGNORED' : ''}${x.enabled === false ? ', disabled' : ''})`
      ).join(' | '));
      tally.mod++;
    }

    // ORIG — the spell and its cast rank (weapon origins add nothing over flavor)
    const og = pf(m).origin;
    if (og?.type === 'spell') body.push(`    ORIG :: spell rank ${og.castRank ?? '?'} :: ${og.uuid ?? ''}`);

    // DMG — the exact delta applied, and reverted applications
    const ad = pf(m).appliedDamage;
    if (ad) {
      const delta = (ad.updates ?? []).filter(u => /hp\.value$/.test(u.path))
        .reduce((a, u) => a + (u.value ?? 0), 0);
      body.push(`    DMG :: ${who} :: ${ad.isHealing ? 'healing' : 'damage'} hp delta ${num(-delta)}` +
                (ad.shield ? ` :: shield ${JSON.stringify(ad.shield)}` : '') +
                (ad.isReverted ? ` :: ** REVERTED — do not count **` : ''));
      tally.dmg++; if (ad.isReverted) tally.reverted++;
    }

    // HEAL — explicit healer -> patient attribution
    const tw = m.flags?.treat_wounds_battle_medicine;
    if (tw && (tw.healing != null || tw.healerId)) {
      body.push(`    HEAL :: healer ${tokenNames[tw.healerId] ?? tw.healerId ?? '?'} -> ${who}` +
                ` :: ${tw.healing ?? '?'}${tw.dos ? ` :: ${tw.dos}` : ''}`);
      tally.heal++;
    }

    body.push(...saveLines(m));
    const mml = mmLines(m);
    body.push(...mml); tally.mm += mml.length;
  }

  /* --- true max HP, by interval intersection -----------------------------
     `hp-percent` is rounded to a whole number, so one observation only bounds
     the max: percent P with R remaining means max lies in
     [100R/(P+0.5), 100R/(P-0.5)]. Intersecting several observations pins it
     tightly. A reading at exactly 100% is exact and wins outright. Anything
     that cannot fit the running interval is counted as a conflict rather than
     silently averaged away — PCs conflict often (temp HP / max changes), most
     creatures don't. */
  const maxLines = [];
  for (const who of Object.keys(hpObs).sort()) {
    const o = hpObs[who];
    let lo = 1, hi = 1e6, bad = 0;
    const exact = o.filter(([, p]) => p === 100).map(([r]) => r);
    for (const [r, p] of o) {
      const a = 100 * r / (p + 0.5), b = 100 * r / (p - 0.5);
      if (b < lo || a > hi) { bad++; continue; }
      lo = Math.max(lo, a); hi = Math.min(hi, b);
    }
    /* A reading at exactly 100% is exact, and makes the interval irrelevant —
       don't report interval noise as a conflict when we have one. TWO distinct
       100% readings is not an error either: max HP legitimately changes when
       the party levels mid-session (S12: every PC gained 12-17 on the 12->13
       level-up). Report the change rather than silently taking one. */
    const uniq = [...new Set(exact)].sort((a, b) => a - b);
    if (uniq.length > 1) {
      maxLines.push(`# max-HP :: ${who} :: ${uniq[uniq.length - 1]}` +
        ` :: CHANGED mid-session ${uniq.join(' -> ')} (level-up or max-HP effect) :: ${o.length} obs`);
    } else if (uniq.length === 1) {
      maxLines.push(`# max-HP :: ${who} :: ${uniq[0]} :: exact (observed at 100%) :: ${o.length} obs`);
    } else {
      maxLines.push(`# max-HP :: ${who} :: ~${Math.round((lo + hi) / 2)}` +
        ` :: estimated [${lo.toFixed(1)}-${hi.toFixed(1)}] from ${o.length} obs` +
        (bad ? `, ${bad} inconsistent` : ''));
    }
  }

  /* ------------------------------ header --------------------------------- */
  const head = [
    `# Foundry export v2 — ${kept.length} messages` +
      ` (session ${pool.length - SESSION} of ${pool.length} detected)`,
    `# ${fmt(kept[0].timestamp)}  ->  ${fmt(kept[kept.length - 1].timestamp)}`,
    `# all sessions found: ` +
      pool.map((c, i) => `[${i + 1}] ${fmt(c[0].timestamp).split(',')[0]} (${c.length})`).join('  '),
    `# extractors: CTX=${tally.ctx} COND=${tally.cond} MOD=${tally.mod} MM=${tally.mm}` +
      ` DMG=${tally.dmg} (reverted ${tally.reverted}) HEAL=${tally.heal} HP=${tally.hp} rerolls=${tally.reroll}`,
    `# scenes touched this session: ${scenes.length}` +
      (scenes.length ? ` — ${scenes.map(s => s.name).join(' | ')}` : ''),
    `# creature roster below is SCENE-FILTERED (unplayed scenes are excluded on purpose)`,
    '',
    ...roster,
    ...(maxLines.length ? ['', '# TRUE max HP, derived from hp-remaining/hp-percent on the creature\'s OWN check rolls:',
      ...maxLines] : []),
    ''
  ];

  return head.concat(body).join('\n');
})());


/* ============================ DIAGNOSTICS ================================
   Only needed if the export comes out empty or wrong.

   // 1. Does the client hold this session's messages?
   game.messages.contents.length

   // 2. Do the v2 flag sources exist?
   const m = game.messages.contents.at(-1);
   console.log('alias:', m.alias, '| rolls:', m.rolls?.length,
               '| context:', !!m.flags?.pf2e?.context,
               '| modifiers:', m.flags?.pf2e?.modifiers?.length,
               '| mm-classes:', (m.flavor ?? '').includes('pf2emm-is-'));

   // 3. Did the scene filter find anything? (empty roster = no scenes matched)
   game.messages.contents.filter(x => x.flags?.pf2e?.context?.target).length

   // 4. Full flag tree for one message — use foundry-diagnostic.js instead,
   //    it prints every flag path used in the session with counts.
   ========================================================================= */


/* ========================= ALTERNATIVE: ask the GM =======================
   Foundry has a built-in GM-side "Export Chat Log" in the chat sidebar's
   context menu. It writes a .txt with speakers and roll results attached, and
   captures blind/GM rolls this script cannot see. Worth asking for if you ever
   want the complete picture.
   ========================================================================= */


/* ============================ API REFERENCE ==============================
   verified against a live PF2e v8.4.1 / Foundry v14 world, 2026-08-23

   game.messages.contents              array form of the ChatMessage collection
   ChatMessage#alias                   token name for IC rolls, username for OOC
   ChatMessage#rolls                   ArrayField of rolls (v10+); v9 used #roll
   ChatMessage#timestamp               epoch ms
   ChatMessage#flavor                  HTML; pf2e-modifiers-matter writes its
                                       verdict here as pf2emm-is-* CSS classes

   flags.pf2e.context                  { type, dc:{slug,value}, outcome,
                                         unadjustedOutcome, options[],
                                         contextualOptions.postRoll[],
                                         origin:{actor,token}, target:{...},
                                         mapIncreases, isReroll, substitutions }
   flags.pf2e.context.options          ~130 strings per roll. Notable families:
                                         <self|target|origin>:condition:<name>[:value]
                                         encounter:round:N / :turn:N / :threat:<tier>
                                         hp-remaining:N / hp-percent:N   (self)
                                         check:total:N, :natural:N, :delta:N (postRoll)
   flags.pf2e.modifiers[]              { slug, label, modifier, type, enabled,
                                         ignored, source, kind }
   flags.pf2e.origin                   { type, uuid, castRank, rollOptions[] }
   flags.pf2e.appliedDamage            { uuid, isHealing, shield, persistent,
                                         updates:[{path,value}], isReverted }
   flags['pf2e-toolbelt'].targetHelper { saveVariants{}, targets[] }
   flags.treat_wounds_battle_medicine  { healerId, healing, dos }
   game.combats                        usually EMPTY — combats are deleted after
                                       a fight; use encounter:round/turn instead

   https://foundryvtt.com/api/v12/interfaces/foundry.types.ChatMessageData.html
   ========================================================================= */
