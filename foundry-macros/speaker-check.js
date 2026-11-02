/**
 * Speaker Check — why do I roll as Bai Jian with no token selected?
 * =================================================================
 *
 * WHY: with nothing selected, Foundry picks the speaker for a roll like this:
 *   1. the first token you have selected, else
 *   2. your user's ASSIGNED CHARACTER (User Configuration → Character).
 * Rolls from an open character sheet always use that sheet's actor. Hotbar
 * macros dragged from a sheet can store a specific actor id, so they roll
 * as that actor whatever you have assigned.
 *
 * WHAT THIS CHECKS (read only, changes nothing):
 *   [1] who your assigned character is
 *   [2] the Bai Jian / Bai Feng actors: ids, your ownership, token link
 *   [3] what ChatMessage.getSpeaker() returns right now
 *   [4] tokens on this scene whose name doesn't match the actor behind them
 *   [5] your hotbar macros that point at Bai Jian
 *   [6] your recent chat messages sent as Bai Jian
 *
 * OUTPUT: a popup only you can see, and the browser console (F12). Also
 * copied to the clipboard if the client allows it. Nothing goes to chat.
 */

(async () => {
    const OLD = "Bai Jian", NEW = "Bai Feng";
    const out = [];
    const say = (s = "") => out.push(s);
    const head = t => { say(); say(`── ${t} ──`); };
    const OWN = Object.fromEntries(Object.entries(CONST.DOCUMENT_OWNERSHIP_LEVELS).map(([k, v]) => [v, k]));
    const ownership = a => OWN[a.getUserLevel?.(game.user) ?? a.ownership?.[game.user.id] ?? a.ownership?.default] ?? "?";
    const label = a => a ? `${a.name} (${a.id})` : "none";

    const findActors = name => game.actors.filter(a => a.name.toLowerCase().includes(name.toLowerCase()));
    const olds = findActors(OLD), news = findActors(NEW);
    const oldIds = new Set(olds.map(a => a.id));

    say(`Speaker Check — user "${game.user.name}", Foundry ${game.version}, PF2e ${game.system.version}`);

    head("[1] Assigned character");
    const assigned = game.user.character;
    say(`game.user.character = ${label(assigned)}`);
    if (!assigned) say("No assigned character: with nothing selected, rolls go out with no actor.");
    else if (oldIds.has(assigned.id)) say(`>>> CAUSE: your assigned character is ${OLD}. With no token selected, Foundry falls back to it.`);
    else if (assigned.name.includes(NEW)) say(`OK: assigned to ${NEW}.`);

    head("[2] Actors");
    for (const a of [...olds, ...news]) {
        const pt = a.prototypeToken;
        say(`${label(a)} — type ${a.type}, your ownership ${ownership(a)}, prototype token "${pt?.name}" linked=${pt?.actorLink}`);
    }
    if (!news.length) say(`No actor named ${NEW} in this world's actor directory.`);
    for (const a of news) {
        if ((a.getUserLevel?.(game.user) ?? 0) < CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)
            say(`>>> ${a.name}: you are not OWNER, so it can't be your assigned character. The GM needs to give you ownership.`);
        if (a.prototypeToken && !a.prototypeToken.actorLink)
            say(`>>> ${a.name}: prototype token is NOT linked. Tokens dropped from it are separate copies.`);
    }

    head("[3] Speaker right now");
    const controlled = canvas?.tokens?.controlled ?? [];
    say(`Selected tokens: ${controlled.map(t => `${t.name} → actor ${label(t.actor)}`).join(", ") || "none"}`);
    const sp = ChatMessage.getSpeaker();
    say(`ChatMessage.getSpeaker() = alias "${sp.alias}", actor ${sp.actor}, token ${sp.token}`);
    say(`With nothing selected this falls back to: ${label(assigned)}`);

    head("[4] Tokens on this scene");
    const toks = canvas?.scene?.tokens?.contents ?? [];
    const relevant = toks.filter(t => [OLD, NEW].some(n => (t.name + " " + (t.actor?.name ?? "")).includes(n)));
    if (!relevant.length) say("No Bai tokens on the current scene.");
    for (const t of relevant) {
        const mismatch = t.actor && t.name !== t.actor.name;
        say(`token "${t.name}" → actor ${label(t.actor)} (base actorId ${t.actorId}), linked=${t.actorLink}${mismatch ? "   >>> NAME MISMATCH" : ""}`);
        if (t.actorId && oldIds.has(t.actorId) && t.name.includes(NEW))
            say(`>>> CAUSE: token "${t.name}" is actually ${OLD}'s actor. Rolls from it are ${OLD}.`);
    }

    head("[5] Hotbar macros pointing at Bai Jian");
    const hotbar = Object.entries(game.user.hotbar ?? {}).map(([slot, id]) => [slot, game.macros.get(id)]).filter(([, m]) => m);
    const needles = [...olds.flatMap(a => [a.id, a.uuid]), OLD];
    let hits = 0;
    for (const [slot, m] of hotbar) {
        const text = `${m.command ?? ""} ${JSON.stringify(m.flags ?? {})}`;
        const found = needles.filter(n => text.includes(n));
        if (found.length) { hits++; say(`slot ${slot}: "${m.name}" mentions ${found.join(", ")}`); }
    }
    say(hits ? `>>> ${hits} hotbar macro(s) are tied to ${OLD}. Delete them and drag fresh ones from ${NEW}'s sheet.`
             : `None of your ${hotbar.length} hotbar macros mention ${OLD}.`);

    head("[6] Your recent messages as Bai Jian");
    const mine = game.messages.contents.filter(m => (m.author ?? m.user)?.id === game.user.id).slice(-60);
    const asOld = mine.filter(m => oldIds.has(m.speaker?.actor) || m.speaker?.alias === OLD);
    say(`${asOld.length} of your last ${mine.length} messages were sent as ${OLD}.`);
    for (const m of asOld.slice(-8)) {
        const flavor = (m.flavor ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 70);
        say(`  ${new Date(m.timestamp).toLocaleString()} — token ${m.speaker?.token ?? "none"} — ${flavor || "(no flavor)"}`);
    }

    const text = out.join("\n");
    console.log(text);
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked; console has it */ }

    const html = `<pre style="white-space:pre-wrap;font-size:12px;max-height:70vh;overflow:auto">${foundry.utils.escapeHTML?.(text) ?? text.replace(/</g, "&lt;")}</pre>`;
    const DV2 = foundry.applications?.api?.DialogV2;
    if (DV2) DV2.prompt({ window: { title: "Speaker Check" }, content: html, position: { width: 720 } });
    else new Dialog({ title: "Speaker Check", content: html, buttons: { ok: { label: "OK" } } }, { width: 720 }).render(true);
})();
