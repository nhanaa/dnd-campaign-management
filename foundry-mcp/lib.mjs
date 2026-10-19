// Core logic for driving a local Foundry VTT world through a headless GM client.
// Foundry has no server-side document API: every write goes through a logged-in
// client's socket. So we run our own headless Chrome, join the world as a GM user,
// and call the Foundry / PF2e APIs inside that page.

import { spawn } from "node:child_process";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright-core";

const HOME = os.homedir();
export const CONFIG = {
  url: process.env.FOUNDRY_URL ?? "http://localhost:30000",
  user: process.env.FOUNDRY_USER ?? "Gamemaster",
  password: process.env.FOUNDRY_PASSWORD ?? "",
  appMain: process.env.FOUNDRY_APP ?? path.join(HOME, "foundryvtt/resources/app/main.js"),
  dataPath: process.env.FOUNDRY_DATA ?? path.join(HOME, "foundrydata"),
  world: process.env.FOUNDRY_WORLD ?? "sovael-testing",
  chrome: process.env.CHROME_PATH ?? path.join(HOME, ".agent-browser/browsers/chrome-154.0.8037.57/chrome"),
};

const port = () => Number(new URL(CONFIG.url).port || 80);

function portOpen(p) {
  return new Promise((resolve) => {
    const s = net.connect(p, "127.0.0.1");
    s.once("connect", () => { s.end(); resolve(true); });
    s.once("error", () => resolve(false));
  });
}

/** Start the Foundry server (detached) if nothing is listening on its port. */
export async function ensureServer() {
  if (await portOpen(port())) return { started: false };
  const child = spawn(process.execPath, [CONFIG.appMain, `--dataPath=${CONFIG.dataPath}`, `--world=${CONFIG.world}`, `--port=${port()}`, "--noupdate"], { detached: true, stdio: "ignore" });
  child.unref();
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await portOpen(port())) { await new Promise((r) => setTimeout(r, 3000)); return { started: true, pid: child.pid }; }
  }
  throw new Error("Foundry server did not open its port within 60s");
}

let browser = null;
let page = null;

/** Join the active world as the GM user and wait for game.ready. Reuses the session. */
export async function ensurePage() {
  if (page && !page.isClosed()) {
    const ok = await page.evaluate(() => !!(window.game?.ready)).catch(() => false);
    if (ok) return page;
  }
  await ensureServer();
  browser ??= await chromium.launch({ executablePath: CONFIG.chrome, headless: true, args: ["--no-sandbox"] });
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${CONFIG.url}/join`, { waitUntil: "domcontentloaded" });
  if (new URL(page.url()).pathname.startsWith("/setup")) {
    throw new Error("No world is active (server is on /setup). Launch a world first, or set FOUNDRY_WORLD and restart the server.");
  }
  await page.getByRole("textbox", { name: "Select User" }).fill(CONFIG.user);
  if (CONFIG.password) await page.getByRole("textbox", { name: "User Password" }).fill(CONFIG.password);
  await page.getByRole("button", { name: /join game session/i }).click();
  await page.waitForFunction(() => window.game?.ready === true, null, { timeout: 90_000 });
  await installPromptHandler();
  return page;
}

export async function shutdown() {
  await browser?.close().catch(() => {});
  browser = null; page = null;
}

/**
 * PF2e ChoiceSet rule elements open a PickAThingPrompt and block document creation
 * until answered. This poller answers them from window.__fmcp.answers (keyed by the
 * prompting item's name), falling back to window.__fmcp.hints (labels we expect to
 * see). Anything it can't answer is recorded in window.__fmcp.unanswered and left
 * open; runWithPrompts() then cancels it so nothing hangs.
 */
async function installPromptHandler() {
  await page.evaluate(() => {
    const f = (window.__fmcp ??= { answers: {}, hints: [], log: [], unanswered: [] });
    if (f.timer) clearInterval(f.timer);
    f.timer = setInterval(async () => {
      for (const p of foundry.applications.instances.values()) {
        if (p.constructor.name !== "PickAThingPrompt" || p.__fmcp) continue;
        const key = p.item?.name ?? "?";
        const labels = p.choices.map((c) => c.label);
        const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        // An answer may list several values ("A|B") for items that prompt more than once.
        const pick = (w) => p.choices.find((c) => norm(c.label) === norm(w)) ?? p.choices.find((c) => norm(c.label).includes(norm(w)));
        let want = f.answers[key];
        let choice = null;
        if (want !== undefined) {
          for (const w of String(want).split("|")) { choice = pick(w); if (choice) { want = w; break; } }
        }
        if (!choice) {
          // Hint matching: exact label first, then whole-word containment.
          const hints = f.hints.map(norm).filter(Boolean);
          choice = p.choices.find((c) => hints.includes(norm(c.label)))
            ?? p.choices.find((c) => hints.some((h) => h.length > 2 && (` ${norm(c.label)} `).includes(` ${h} `)))
            ?? p.choices.find((c) => norm(c.label).length > 2 && hints.some((h) => (` ${h} `).includes(` ${norm(c.label)} `)));
        }
        p.__fmcp = true;
        if (!choice) { f.unanswered.push({ item: key, wanted: want ?? null, choices: labels.slice(0, 60) }); continue; }
        p.selection = choice;
        f.log.push(`${key} -> ${choice.label}${want === undefined || norm(choice.label) !== norm(want) && !norm(choice.label).includes(norm(want)) ? " (by hint)" : ""}`);
        await p.close();
      }
    }, 300);
  });
}

/**
 * Run an async in-page operation with prompt answers/hints, never hanging:
 * on timeout, any open prompts are cancelled and reported.
 * `fnSource` is the source of an async function (args) => result, evaluated in the page.
 */
export async function runWithPrompts(fnSource, args = {}, { answers = {}, hints = [], timeoutMs = 60_000 } = {}) {
  const p = await ensurePage();
  await p.evaluate(({ answers, hints }) => {
    const f = window.__fmcp; Object.assign(f.answers, answers); f.hints = hints; f.log = []; f.unanswered = [];
  }, { answers, hints });
  const opId = `op${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  await p.evaluate(({ src, args, opId }) => {
    window.__fmcpOps ??= {};
    window.__fmcpOps[opId] = { done: false };
    const fn = (0, eval)(`(${src})`);
    Promise.resolve().then(() => fn(args)).then(
      (r) => { window.__fmcpOps[opId] = { done: true, result: r }; },
      (e) => { window.__fmcpOps[opId] = { done: true, error: String(e?.stack ?? e) }; });
  }, { src: fnSource, args, opId });
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const st = await p.evaluate((opId) => {
      const op = window.__fmcpOps[opId]; const f = window.__fmcp;
      return { ...op, log: f.log, unanswered: f.unanswered };
    }, opId);
    if (st.done) return { ok: !st.error, result: st.result, error: st.error, prompts: st.log, unanswered: st.unanswered };
    // An unanswered prompt will block forever; stop early and cancel it.
    if (st.unanswered.length) break;
    await new Promise((r) => setTimeout(r, 250));
  }
  const st = await p.evaluate(async (opId) => {
    const f = window.__fmcp;
    for (const a of [...foundry.applications.instances.values()]) if (a.constructor.name === "PickAThingPrompt") await a.close();
    return { log: f.log, unanswered: f.unanswered, partial: window.__fmcpOps[opId] };
  }, opId);
  return { ok: false, timedOut: true, error: "Operation blocked on a choice prompt (or timed out). Re-run with `answers` for the items listed in `unanswered`.", prompts: st.log, unanswered: st.unanswered };
}

/** Evaluate an arbitrary async function body in the page (escape hatch). */
export async function runScript(code, timeoutMs = 60_000) {
  return runWithPrompts(`async () => { ${code} }`, {}, { timeoutMs });
}

// ---------------------------------------------------------------- in-page helpers
// These are passed as source strings so they run inside the Foundry page.

export const IN_PAGE = String.raw`
const H = {
  actor(ref) {
    const a = game.actors.get(ref) ?? game.actors.getName(ref);
    if (!a) throw new Error("No actor named or with id " + ref);
    return a;
  },
  async compendiumItem(name, pack) {
    const packs = pack ? [game.packs.get(pack)] : ["pf2e.feats-srd","pf2e.classfeatures","pf2e.equipment-srd","pf2e.spells-srd","pf2e.ancestries","pf2e.heritages","pf2e.backgrounds","pf2e.classes","pf2e.ancestryfeatures","pf2e.actionspf2e","pf2e.deities"].map(p => game.packs.get(p)).filter(Boolean);
    const norm = s => s.toLowerCase().replace(/[’']/g, "'").trim();
    for (const p of packs) {
      const e = p.index.find(x => norm(x.name) === norm(name));
      if (e) return (await p.getDocument(e._id)).toObject();
    }
    return null;
  },
  summary(a) {
    const s = a.system;
    const items = a.items.contents;
    const byType = t => items.filter(i => i.type === t);
    const rank = r => ["U","T","E","M","L"][r] ?? r;
    return {
      id: a.id, name: a.name, type: a.type, level: s.details?.level?.value,
      ancestry: a.ancestry?.name, heritage: a.heritage?.name, background: a.background?.name, class: a.class?.name,
      abilities: s.abilities ? Object.fromEntries(Object.entries(s.abilities).map(([k,v]) => [k, v.mod])) : undefined,
      hp: s.attributes?.hp ? { value: s.attributes.hp.value, max: s.attributes.hp.max } : undefined,
      ac: s.attributes?.ac?.value,
      saves: s.saves ? Object.fromEntries(Object.entries(s.saves).map(([k,v]) => [k, v.totalModifier ?? v.value])) : undefined,
      perception: s.perception?.totalModifier ?? s.perception?.mod,
      skills: a.skills ? Object.fromEntries(Object.entries(a.skills).filter(([,v]) => v.rank > 0).map(([k,v]) => [k, rank(v.rank) + " " + (v.mod >= 0 ? "+" : "") + v.mod])) : undefined,
      feats: byType("feat").filter(f => !["classfeature","ancestryfeature"].includes(f.system.category)).map(f => f.name + (f.system.location ? " @" + f.system.location : "")),
      features: byType("feat").filter(f => ["classfeature","ancestryfeature"].includes(f.system.category)).map(f => f.name),
      weapons: byType("weapon").map(w => { const st = (s.actions ?? []).find(x => x.item?.id === w.id); return w.name + (st ? " (" + (st.totalModifier >= 0 ? "+" : "") + st.totalModifier + ")" : ""); }),
      focus: s.resources?.focus ? s.resources.focus.value + "/" + s.resources.focus.max : undefined,
      armor: byType("armor").map(w => w.name),
      spellcasting: byType("spellcastingEntry").map(e => e.name),
      spells: byType("spell").map(sp => sp.name + (sp.system.location?.heightenedLevel ? " (r" + sp.system.location.heightenedLevel + ")" : "")),
      other: items.filter(i => !["feat","weapon","armor","spell","spellcastingEntry","ancestry","heritage","background","class","action","lore"].includes(i.type)).map(i => i.type + ":" + i.name),
      lores: byType("lore").map(l => l.name),
    };
  },
};
`;

/** Wrap an async function body so it has the helpers H in scope. */
export const pageFn = (body) => `async (args) => { ${IN_PAGE}\n${body} }`;

// ---------------------------------------------------------------- operations

export async function status() {
  const p = await ensurePage();
  return p.evaluate(() => ({
    url: location.href, user: game.user.name, isGM: game.user.isGM,
    world: game.world.id, title: game.world.title, system: `${game.system.id} ${game.system.version}`, core: game.version,
    variants: { freeArchetype: game.settings.get("pf2e", "freeArchetypeVariant"), gradualBoosts: game.settings.get("pf2e", "gradualBoostsVariant"), abp: game.settings.get("pf2e", "automaticBonusVariant") },
    actors: game.actors.map((a) => `${a.name} (${a.type})`),
  }));
}

export async function getActor(ref) {
  return runWithPrompts(pageFn(`return H.summary(H.actor(args.ref));`), { ref });
}

/**
 * Add compendium items to an actor, one at a time, in order.
 * items: [{ name, pack?, location?, system? (merged into system) }]
 */
export async function addItems(ref, items, opts = {}) {
  return runWithPrompts(pageFn(`
    const a = H.actor(args.ref); const out = [];
    for (const it of args.items) {
      const src = await H.compendiumItem(it.name, it.pack);
      if (!src) { out.push("MISSING " + it.name); continue; }
      if (it.location !== undefined) src.system.location = it.location;
      if (it.system) foundry.utils.mergeObject(src.system, it.system);
      if (it.answers) Object.assign(window.__fmcp.answers, it.answers);
      try { await a.createEmbeddedDocuments("Item", [src]); out.push("+ " + it.name); }
      catch (e) { out.push("ERR " + it.name + ": " + e.message); }
    }
    return out;`), { ref, items }, opts);
}

// ---------------------------------------------------------------- Pathbuilder import

const STRIKING = { "": 0, striking: 1, greaterStriking: 2, majorStriking: 3 };
const RESILIENT = { "": 0, resilient: 1, greaterResilient: 2, majorResilient: 3 };
const ABIL = { str: "Strength", dex: "Dexterity", con: "Constitution", int: "Intelligence", wis: "Wisdom", cha: "Charisma" };

/** Map a Pathbuilder feat row to a PF2e feat-slot location (or null = bonus feat). */
function featLocation([, , type, level, slot = ""], freeArchetype) {
  if (/ancestry paragon/i.test(slot)) return null;
  if (/free archetype/i.test(slot)) return freeArchetype ? `archetype-${level}` : null;
  const t = { "Ancestry Feat": "ancestry", "Class Feat": "class", "Skill Feat": "skill", "General Feat": "general", "Archetype Feat": "class" }[type];
  return t ? `${t}-${level}` : null;
}

/**
 * Build a PF2e character from a Pathbuilder 2e JSON export.
 * Attributes are set in manual mode (exact final modifiers), so the result does not
 * depend on the world's gradual-boost setting. Free-archetype and ancestry-paragon
 * feats land as bonus feats when the world has no slot for them.
 */
export async function importPathbuilder(json, { name, replace = false, answers: extraAnswers = {}, timeoutMs = 180_000 } = {}) {
  const data = typeof json === "string" ? JSON.parse(json) : json;
  const b = data.build ?? data;
  const st = await status();
  const fa = !!st.variants.freeArchetype;
  const actorName = name ?? b.name;
  const mod = (v) => Math.floor((v - 10) / 2);

  // Feats in build order. Granted ones (heritage/awarded/childChoice) arrive via their parent.
  const featRows = b.feats.filter((f) => !["Heritage", "Awarded Feat"].includes(f[2]) && f[5] !== "childChoice");
  const answers = {};
  for (const f of b.feats) {
    if (f[5] === "childChoice" && f[6]) {
      const parent = b.feats.find((p) => p[5] === "parentChoice" && p[4] === f[6]);
      if (parent) answers[`__child:${parent[4]}`] = f[0];
    }
    if (f[1]) answers[f[0]] = f[1]; // e.g. Adopted Ancestry -> Dwarf
  }
  // Labels we may be asked to pick: specials (hybrid study, cause, dragon), key ability, weapons.
  if (b.deity && b.deity !== "Not set") answers["Deity (Champion)"] ??= b.deity;
  Object.assign(answers, extraAnswers);
  const sanct = (b.specials ?? []).includes("Neither") ? ["None"] : [];
  const hints = [...(b.specials ?? []), ...sanct, ABIL[b.keyability], b.deity !== "Not set" && b.deity, ...(b.weapons ?? []).map((w) => w.name), ...(b.feats ?? []).map((f) => f[0])].filter(Boolean);

  const items = featRows.map((f) => {
    const it = { name: f[0], location: featLocation(f, fa) };
    if (f[5] === "parentChoice") {
      const child = answers[`__child:${f[4]}`];
      if (child) it.answers = { [f[0]]: child };
    }
    return it;
  });

  const body = `
    const b = args.b; const log = [];
    let a = game.actors.getName(args.actorName);
    if (a && args.replace) { await a.delete(); a = null; }
    if (a) throw new Error("Actor '" + args.actorName + "' already exists (pass replace: true)");
    a = await Actor.create({ name: args.actorName, type: "character", system: { details: { level: { value: b.level } } } });
    const add = async (name, pack, patch = {}, ans = {}) => {
      const src = await H.compendiumItem(name, pack);
      if (!src) { log.push("MISSING " + name); return null; }
      foundry.utils.mergeObject(src, patch);
      Object.assign(window.__fmcp.answers, ans);
      try { const [d] = await a.createEmbeddedDocuments("Item", [src]); log.push("+ " + name); return d; }
      catch (e) { log.push("ERR " + name + ": " + e.message); return null; }
    };
    // Ancestry / heritage / background / class
    await add(b.ancestry, "pf2e.ancestries");
    await add(b.heritage, "pf2e.heritages");
    await add(b.background, "pf2e.backgrounds");
    await add(b.class, "pf2e.classes");
    // Attributes: manual mode with the export's final scores
    const m = v => Math.floor((v - 10) / 2);
    const ab = b.abilities;
    await a.update({ "system.build.attributes.manual": true,
      ...Object.fromEntries(["str","dex","con","int","wis","cha"].map(k => ["system.abilities." + k + ".mod", m(ab[k])])) });
    // Feats
    for (const it of args.items) await add(it.name, "pf2e.feats-srd", { system: { location: it.location } }, it.answers ?? {});
    // Skills (Pathbuilder: 2/4/6/8 = trained/expert/master/legendary)
    const prof = b.proficiencies ?? {};
    const skillKeys = ["acrobatics","arcana","athletics","crafting","deception","diplomacy","intimidation","medicine","nature","occultism","performance","religion","society","stealth","survival","thievery"];
    const upd = {};
    for (const k of skillKeys) if (prof[k]) upd["system.skills." + k + ".rank"] = Math.max(a.system.skills?.[k]?.rank ?? 0, prof[k] / 2);
    if (Object.keys(upd).length) await a.update(upd);
    for (const [lore, p] of (b.lores ?? [])) {
      if (!a.items.some(i => i.type === "lore" && i.name.toLowerCase() === (lore + " lore").toLowerCase()))
        await a.createEmbeddedDocuments("Item", [{ name: lore + " Lore", type: "lore", system: { proficient: { value: p / 2 } } }]);
    }
    // Weapons & armor with runes
    for (const w of (b.weapons ?? [])) {
      await add(w.name, "pf2e.equipment-srd", { system: { runes: { potency: w.pot ?? 0, striking: args.STRIKING[w.str ?? ""] ?? 0, property: (w.runes ?? []).map(r => r.toLowerCase().replace(/\\s+/g, "")) }, equipped: { carryType: "held", handsHeld: 1 } } });
    }
    for (const ar of (b.armor ?? [])) {
      await add(ar.name, "pf2e.equipment-srd", { system: { runes: { potency: ar.pot ?? 0, resilient: args.RESILIENT[ar.res ?? ""] ?? 0, property: (ar.runes ?? []).map(r => r.toLowerCase()) }, equipped: { carryType: "worn", inSlot: !!ar.worn, invested: true } } });
    }
    // Weapons Pathbuilder treats as proficient but Foundry leaves untrained (e.g. Unconventional
    // Weaponry, which has no rule elements in the system): add a MartialProficiency rule.
    for (const w of (b.weapons ?? [])) {
      const item = a.itemTypes.weapon.find(x => x.name.includes(w.name));
      const strike = a.system.actions?.find(x => x.item?.id === item?.id);
      const untrained = strike?.modifiers?.some(m => m.slug === "proficiency" ? m.modifier === 0 : /untrained/i.test(m.label));
      if (!item || !untrained || !["simple","martial"].includes(w.prof)) continue;
      const host = a.items.find(i => i.name === "Unconventional Weaponry") ?? a.items.find(i => i.type === "class");
      const base = item.system.baseItem ?? item.slug;
      await host.update({ "system.rules": [...host.system.rules, { key: "MartialProficiency", slug: base, label: item.system.baseItem ? w.name : item.name, definition: ["item:base:" + base], sameAs: w.prof }] });
      log.push("proficiency: " + w.name + " as " + w.prof + " (rule on " + host.name + ")");
    }
    // Money
    const m2 = b.money ?? {};
    if (m2.pp || m2.gp || m2.sp || m2.cp) await a.inventory.addCoins({ pp: m2.pp ?? 0, gp: m2.gp ?? 0, sp: m2.sp ?? 0, cp: m2.cp ?? 0 });
    // Spellcasting: one prepared/spontaneous entry per caster, with prepared slots
    for (const c of (b.spellCasters ?? [])) {
      if (c.innate) continue;
      const slots = {};
      (c.perDay ?? []).forEach((n, r) => { if (n) slots["slot" + r] = { max: n, value: n, prepared: [] }; });
      const [entry] = await a.createEmbeddedDocuments("Item", [{ name: c.name + " Spells", type: "spellcastingEntry",
        system: { tradition: { value: c.magicTradition }, prepared: { value: c.spellcastingType }, ability: { value: c.ability }, proficiency: { value: Math.max(1, (c.proficiency ?? 2) / 2) }, slots } }]);
      const want = c.spellcastingType === "prepared" ? (c.prepared ?? []) : (c.spells ?? []);
      const slotUpd = {};
      for (const lvl of want) {
        const ids = [];
        for (const sn of lvl.list) {
          const src = await H.compendiumItem(sn, "pf2e.spells-srd");
          if (!src) { log.push("MISSING spell " + sn); continue; }
          src.system.location = { value: entry.id, heightenedLevel: lvl.spellLevel > 0 ? lvl.spellLevel : null };
          const [sp] = await a.createEmbeddedDocuments("Item", [src]);
          ids.push(sp.id);
        }
        if (c.spellcastingType === "prepared") slotUpd["system.slots.slot" + lvl.spellLevel + ".prepared"] = ids.map(id => ({ id, expended: false }));
      }
      if (Object.keys(slotUpd).length) await entry.update(slotUpd);
      log.push("spellcasting: " + entry.name);
    }
    // Focus spells: one focus entry per tradition/attribute in the export, plus the pool size
    for (const [trad, byAbil] of Object.entries(b.focus ?? {})) {
      for (const [abil, f] of Object.entries(byAbil)) {
        const names = [...(f.focusCantrips ?? []), ...(f.focusSpells ?? [])];
        if (!names.length) continue;
        const [entry] = await a.createEmbeddedDocuments("Item", [{ name: trad[0].toUpperCase() + trad.slice(1) + " Focus Spells", type: "spellcastingEntry",
          system: { tradition: { value: trad }, prepared: { value: "focus" }, ability: { value: abil }, proficiency: { value: Math.max(1, (f.proficiency ?? 2) / 2) } } }]);
        for (const sn of names) {
          if (a.itemTypes.spell.some(sp => sp.name === sn && a.items.get(sp.system.location?.value)?.system?.prepared?.value === "focus")) continue;
          const src = await H.compendiumItem(sn, "pf2e.spells-srd");
          if (!src) { log.push("MISSING focus spell " + sn); continue; }
          src.system.location = { value: entry.id };
          await a.createEmbeddedDocuments("Item", [src]);
        }
        log.push("focus: " + entry.name + " (" + names.join(", ") + ")");
      }
    }
    if (b.focusPoints) await a.update({ "system.resources.focus.max": b.focusPoints, "system.resources.focus.value": b.focusPoints });
    return { log, summary: H.summary(a) };
  `;
  return runWithPrompts(pageFn(body), { b, actorName, replace, items, STRIKING, RESILIENT }, { answers, hints, timeoutMs });
}
