/* ============================================================================
   FOUNDRY DATA DIAGNOSTIC — what else is recoverable?
   Read-only. Prints a CAPABILITY REPORT plus sample dumps so we can see the
   real field names/shapes instead of guessing, then build extractors against
   what actually exists.

   Paste into the Foundry console (F12). Output goes to the clipboard.
   Nothing is written or modified.

   PROBES
     [1] flags.pf2e.context.options   - condition state at roll time, BOTH sides
     [2] NPC actor stat blocks        - real HP/AC/saves + elite/weak adjustment
     [3] flags.pf2e.appliedDamage     - exact HP delta, and reverted applications
     [4] reroll provenance            - hero point vs other reroll, exactly
     [5] game.combats                 - initiative order + round boundaries
     [6] flags.pf2e.origin            - spell/item behind a damage roll (AoE)
     [7] misc                         - modifiers-matter potential class, actions
   ========================================================================== */

copy((() => {
  const OUT = [];
  const say = (...a) => OUT.push(a.join(' '));
  const rule = t => { OUT.push(''); OUT.push('='.repeat(78)); OUT.push(t); OUT.push('='.repeat(78)); };

  /* ------------------------- compact structure dump --------------------- */
  /* `seen` MUST be per-top-level-call, not module-wide: the same object is
     legitimately previewed by more than one probe, and a shared set would
     report every second sighting as <circular>. Default arg = fresh set. */
  const preview = (v, d = 0, maxD = 5, maxArr = 10, seen = new WeakSet()) => {
    if (v === null || v === undefined) return String(v);
    const t = typeof v;
    if (t === 'string') return JSON.stringify(v.length > 140 ? v.slice(0, 140) + '…' : v);
    if (t !== 'object') return String(v);
    if (seen.has(v)) return '<circular>';
    if (d >= maxD) return Array.isArray(v) ? `[… ${v.length} items]` : `{… ${Object.keys(v).length} keys}`;
    seen.add(v);
    const pad = '  '.repeat(d + 1), close = '  '.repeat(d);
    try {
      if (Array.isArray(v)) {
        if (!v.length) return '[]';
        const items = v.slice(0, maxArr).map(x => pad + preview(x, d + 1, maxD, maxArr, seen));
        if (v.length > maxArr) items.push(pad + `… +${v.length - maxArr} more`);
        return '[\n' + items.join(',\n') + '\n' + close + ']';
      }
      const keys = Object.keys(v);
      if (!keys.length) return '{}';
      const items = keys.slice(0, 45).map(k => pad + k + ': ' + preview(v[k], d + 1, maxD, maxArr, seen));
      if (keys.length > 45) items.push(pad + `… +${keys.length - 45} more keys`);
      return '{\n' + items.join(',\n') + '\n' + close + '}';
    } catch (e) { return `<err ${e.message}>`; }
  };
  const safe = (fn, fallback = '<unavailable>') => { try { return fn(); } catch (e) { return `${fallback} (${e.message})`; } };

  /* ------------------------------ session ------------------------------- */
  const GAP_HOURS = 8, MIN_MESSAGES = 40, SESSION = 0;
  const all = [...game.messages.contents].filter(m => m.timestamp).sort((a, b) => a.timestamp - b.timestamp);
  const clusters = []; let cur = [];
  for (const m of all) {
    if (cur.length && m.timestamp - cur[cur.length - 1].timestamp > GAP_HOURS * 3600e3) { clusters.push(cur); cur = []; }
    cur.push(m);
  }
  if (cur.length) clusters.push(cur);
  const pool = clusters.filter(c => c.length >= MIN_MESSAGES);
  const S = (pool.length ? pool : clusters)[(pool.length ? pool : clusters).length - 1 - SESSION] ?? all;
  const clock = t => new Date(t).toLocaleTimeString('en-GB', { hour12: false });
  const pf2e = m => m.flags?.pf2e ?? m.flags?.sf2e ?? {};

  say(`# FOUNDRY DATA DIAGNOSTIC`);
  say(`# session: ${S.length} messages, ${clock(S[0].timestamp)} .. ${clock(S[S.length - 1].timestamp)}`);
  say(`# foundry ${safe(() => game.version)} | pf2e system ${safe(() => game.system.version)}`);
  say(`# user is GM: ${safe(() => game.user.isGM)}`);

  /* =============== [1] context.options =================================== */
  rule('[1] flags.pf2e.context.options — condition state at roll time');
  const withOpts = S.filter(m => Array.isArray(pf2e(m).context?.options));
  const condOpts = withOpts.filter(m => pf2e(m).context.options.some(o => /:condition:/.test(o)));
  say(`PRESENT on ${withOpts.length}/${S.length} messages; ${condOpts.length} carry a ":condition:" option`);
  if (withOpts.length) {
    const avg = Math.round(withOpts.reduce((a, m) => a + pf2e(m).context.options.length, 0) / withOpts.length);
    say(`average options per message: ${avg}`);
    // vocabulary of condition-ish options across the session — this is the payload
    const vocab = {};
    for (const m of withOpts) for (const o of pf2e(m).context.options)
      if (/:condition:|off-guard|frightened|sickened|prone|flanking|flat-footed/.test(o)) vocab[o] = (vocab[o] ?? 0) + 1;
    const top = Object.entries(vocab).sort((a, b) => b[1] - a[1]);
    say(`distinct condition-ish options: ${top.length}`);
    top.slice(0, 60).forEach(([k, n]) => say(`   ${String(n).padStart(4)}  ${k}`));
    if (top.length > 60) say(`   … +${top.length - 60} more`);
    const ex = condOpts[Math.floor(condOpts.length / 2)] ?? withOpts[0];
    say(``, `FULL OPTIONS for one message  [${clock(ex.timestamp)}] ${ex.alias}:`);
    say(preview(pf2e(ex).context.options, 0, 3, 200));
    say(``, `...and its full context object (minus options):`);
    const { options, ...ctxRest } = pf2e(ex).context;
    say(preview(ctxRest));
  }

  /* =============== [2] NPC stat blocks =================================== */
  rule('[2] NPC actor stat blocks from the scene — real HP/AC/saves, elite/weak');
  const npcs = new Map();
  let tokensSeen = 0, unreadable = 0;
  for (const sc of game.scenes ?? []) for (const tk of sc.tokens ?? []) {
    tokensSeen++;
    const a = safe(() => tk.actor, null);
    if (!a || typeof a === 'string') { unreadable++; continue; }
    if (a.type !== 'npc') continue;
    const key = `${sc.name} :: ${tk.name}`;
    if (npcs.has(key)) continue;
    npcs.set(key, safe(() => ({
      scene: sc.name, token: tk.name, actor: a.name,
      level: a.system?.details?.level?.value,
      adjustment: a.system?.attributes?.adjustment ?? '(none)',
      hp: `${a.system?.attributes?.hp?.value}/${a.system?.attributes?.hp?.max}`,
      ac: a.system?.attributes?.ac?.value,
      saves: `F${a.system?.saves?.fortitude?.value} R${a.system?.saves?.reflex?.value} W${a.system?.saves?.will?.value}`,
      perception: a.system?.perception?.mod ?? a.system?.attributes?.perception?.value,
      immunities: (a.system?.attributes?.immunities ?? []).map(x => x.type ?? x),
      weaknesses: (a.system?.attributes?.weaknesses ?? []).map(x => `${x.type} ${x.value}`),
      resistances: (a.system?.attributes?.resistances ?? []).map(x => `${x.type} ${x.value}`),
      hpDetails: a.system?.attributes?.hp?.details,
    }), '<no permission>'));
  }
  say(`tokens scanned: ${tokensSeen}  | unreadable: ${unreadable}  | distinct NPC tokens: ${npcs.size}`);
  say(npcs.size ? 'PASS — actor data is readable from this client' : 'FAIL — no NPC actor data visible (permissions, or tokens deleted)');
  for (const [k, v] of [...npcs].slice(0, 40)) { say(``, `--- ${k}`); say(preview(v, 0, 3, 20)); }
  if (npcs.size > 40) say(`… +${npcs.size - 40} more NPC tokens`);

  /* =============== [3] appliedDamage ==================================== */
  rule('[3] flags.pf2e.appliedDamage — exact HP delta + reverted applications');
  const applied = S.filter(m => pf2e(m).appliedDamage !== undefined);
  say(`PRESENT on ${applied.length}/${S.length} messages`);
  if (applied.length) {
    const reverted = applied.filter(m => pf2e(m).appliedDamage?.isReverted);
    say(`marked isReverted (would otherwise be DOUBLE-COUNTED): ${reverted.length}`);
    say(``, `sample (first 3):`);
    applied.slice(0, 3).forEach(m => { say(`  [${clock(m.timestamp)}] ${m.alias}`); say(preview(pf2e(m).appliedDamage, 1)); });
    if (reverted.length) { say(``, `a REVERTED one:`); say(preview(pf2e(reverted[0]).appliedDamage, 1)); }
  }

  /* =============== [4] reroll provenance ================================ */
  rule('[4] reroll provenance — hero point vs other reroll');
  const twoD20 = S.filter(m => safe(() => (m.rolls ?? []).some(r =>
    (JSON.stringify(r.terms ?? r).match(/"faces":20/g) ?? []).length > 1), false));
  const flagged = S.filter(m => pf2e(m).context?.isReroll || pf2e(m).context?.rerollType || pf2e(m).context?.reroll);
  say(`messages whose roll contains TWO d20 terms : ${twoD20.length}   (what we currently count)`);
  say(`messages with an explicit reroll flag      : ${flagged.length}`);
  const ctxKeys = new Set();
  for (const m of [...twoD20, ...flagged]) for (const k of Object.keys(pf2e(m).context ?? {})) ctxKeys.add(k);
  say(`context keys seen on those messages: ${[...ctxKeys].sort().join(', ') || '(none)'}`);
  const sample = flagged[0] ?? twoD20[0];
  if (sample) {
    say(``, `sample [${clock(sample.timestamp)}] ${sample.alias} :: ${String(sample.flavor ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90)}`);
    say(`context:`); say(preview(pf2e(sample).context, 1, 4));
    say(`roll options/terms:`); say(preview(safe(() => (sample.rolls ?? [])[0]?.terms), 1, 4, 6));
  }

  /* =============== [5] combats ========================================== */
  rule('[5] game.combats — initiative order + round boundaries');
  const combats = safe(() => [...game.combats.contents], []);
  say(`combats stored: ${Array.isArray(combats) ? combats.length : combats}`);
  if (Array.isArray(combats)) combats.forEach((c, i) => {
    say(``, `--- combat ${i}  scene=${safe(() => c.scene?.name)}  round=${c.round}  turn=${c.turn}  active=${c.active}`);
    say(`    started=${safe(() => c.started)}  combatants=${safe(() => c.combatants.size)}`);
    safe(() => [...c.combatants].sort((a, b) => (b.initiative ?? -99) - (a.initiative ?? -99))
      .forEach(cb => say(`      ${String(cb.initiative ?? '--').padStart(4)}  ${cb.name}${cb.isNPC ? '  (npc)' : ''}${cb.defeated ? '  [defeated]' : ''}`)));
  });
  const roundMsgs = S.filter(m => /round\s*\d+/i.test(String(m.flavor ?? '') + String(m.content ?? '')) && (m.flags?.core?.RollTable === undefined));
  say(``, `messages mentioning "Round N": ${roundMsgs.length}  (fallback if combats were deleted)`);
  roundMsgs.slice(0, 6).forEach(m => say(`   [${clock(m.timestamp)}] ${String(m.content ?? m.flavor).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)}`));

  /* =============== [6] origin (AoE attribution) ========================= */
  rule('[6] flags.pf2e.origin — the spell/item behind a roll (AoE attribution)');
  const withOrigin = S.filter(m => pf2e(m).origin);
  say(`PRESENT on ${withOrigin.length}/${S.length} messages`);
  if (withOrigin.length) {
    const kinds = {};
    for (const m of withOrigin) { const t = pf2e(m).origin?.type ?? '?'; kinds[t] = (kinds[t] ?? 0) + 1; }
    say(`origin.type breakdown: ${Object.entries(kinds).map(([k, v]) => `${k}=${v}`).join('  ')}`);
    const spell = withOrigin.find(m => pf2e(m).origin?.type === 'spell') ?? withOrigin[0];
    say(``, `sample [${clock(spell.timestamp)}] ${spell.alias}:`);
    say(preview(pf2e(spell).origin, 1, 4));
  }
  // does a DAMAGE message know its own targets?
  const dmgWithTargets = S.filter(m => pf2e(m).target || pf2e(m).context?.target);
  say(``, `messages carrying an explicit target in flags: ${dmgWithTargets.length}`);
  if (dmgWithTargets.length) say(preview(pf2e(dmgWithTargets[0]).target ?? pf2e(dmgWithTargets[0]).context.target, 1, 4));

  /* =============== [7] misc ============================================= */
  rule('[7] misc — modifiers-matter potential class, and top-level flag vocabulary');
  const potClasses = {};
  for (const m of S) {
    const mm = String(m.flavor ?? '').match(/class="pf2emm-potential ([^"]+)"/g) ?? [];
    for (const c of mm) potClasses[c] = (potClasses[c] ?? 0) + 1;
  }
  say(`pf2emm-potential classes seen:`);
  Object.entries(potClasses).forEach(([k, v]) => say(`   ${String(v).padStart(4)}  ${k}`));

  const flagVocab = {};
  for (const m of S) for (const ns of Object.keys(m.flags ?? {})) {
    for (const k of Object.keys(m.flags[ns] ?? {})) {
      const key = `${ns}.${k}`; flagVocab[key] = (flagVocab[key] ?? 0) + 1;
    }
  }
  say(``, `every flag path seen this session (namespace.key : count):`);
  Object.entries(flagVocab).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => say(`   ${String(v).padStart(5)}  ${k}`));

  /* =============== full dump of three representative messages =========== */
  rule('[8] FULL flag trees for three representative messages');
  const pick = {
    'STRIKE with a target': S.find(m => pf2e(m).context?.type === 'attack-roll' && (pf2e(m).context?.target || /Target:/.test(String(m.flavor)))),
    'AoE with saves':       S.find(m => m.flags?.['pf2e-toolbelt']?.targetHelper?.saveVariants),
    'DAMAGE application':   applied[0] ?? S.find(m => /takes \d+ damage/.test(String(m.content ?? ''))),
  };
  for (const [label, m] of Object.entries(pick)) {
    say(``, `--------- ${label} ---------`);
    if (!m) { say('  (none found)'); continue; }
    say(`  [${clock(m.timestamp)}] ${m.alias}`);
    say(`  flavor(text): ${String(m.flavor ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)}`);
    say(`  rolls: ${preview(safe(() => (m.rolls ?? []).map(r => ({ formula: r.formula, total: r.total, dice: (r.dice ?? []).map(d => ({ faces: d.faces, results: (d.results ?? []).map(x => x.result) })) }))), 1, 8)}`);
    say(`  flags:`); say(preview(m.flags, 1, 6, 12));
  }

  return OUT.join('\n');
})());


/* ============================== NOTES ======================================
   Output is long. If the clipboard chokes, comment out sections by wrapping
   them in `if (false) { ... }` and re-run — sections are independent.

   WHAT WE'RE HOPING TO SEE
   [1] a vocabulary like `target:condition:off-guard`, `target:condition:frightened:1`,
       `self:condition:sickened:1`. If the VALUE is included (the trailing :1),
       we get condition intensity for free and can stop inferring it from AC.
   [2] `adjustment: "elite" | "weak" | null` on the Golarion's Finest tokens
       would settle the 7x Weak + 1x Elite hypothesis outright. `hp.max` gives
       the GM's real numbers; `hp.details` holds regeneration text.
   [3] `appliedDamage: { isHealing, isReverted, persistent, updates }` — the
       `updates` array should hold the actual HP delta.
   [4] anything like `isReroll`, `rerollType`, `substitutions` — Foundry's
       keep-higher automation and a hero point should be distinguishable.
   [5] combats are often DELETED after a fight; if `combats: 0` we fall back to
       initiative clustering as we do now.
   [6] `origin: { type:'spell', uuid, castRank, ... }` lets us attribute an AoE
       damage roll to the caster and pair it to every application.

   IF A SECTION ERRORS
   Every probe is wrapped, so a failure prints inline rather than aborting.
   The `# user is GM:` line matters for [2] — a player client may not be able
   to read NPC actor internals at all.
   ========================================================================= */
