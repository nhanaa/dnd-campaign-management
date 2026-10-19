/**
 * Spellstrike — one Strike, one spell, one combined damage card
 * =============================================================
 *
 * WHY: PF2e's Spellstrike action is a text card. At the table you roll the
 * Strike, then cast the spell separately, then add two damage cards together
 * by hand — and nothing tracks whether Spellstrike still needs recharging.
 *
 * RULES (Impossible Magic): cast a 1- or 2-action spell that needs a spell
 * attack roll or a saving throw, imbued into a melee Strike.
 *   - Attack-roll spell: the Strike's result is the spell's result. Hit = both
 *     hit, crit = both crit (spell damage doubles too).
 *   - Save spell: the target saves normally whatever the Strike did, unless the
 *     Strike critically failed — then the spell is disrupted.
 *   - Counts as two attacks for MAP, applied after the Spellstrike.
 *   - Then Spellstrike needs a recharge (1 action, or casting a conflux spell).
 *
 * PLAYER-ONLY: runs in your own client. It rolls your Strike, spends the spell
 * through the system (prepared slot / spontaneous slot / focus point), and
 * posts damage cards. The GM applies damage from the card as usual. The only
 * thing it writes is an effect on YOUR character.
 *
 * WHAT THIS DOES:
 *   1. Works out the magus: your selected token if you own it, else your
 *      assigned character.
 *   2. If "Spellstrike (Expended)" is on you, offers to recharge instead.
 *   3. Dialog: pick the weapon, the MAP step, and the spell. Only spells that
 *      can be Spellstruck are listed (1–2 actions; attack roll or save), each
 *      prepared slot / rank / focus spell separately.
 *   4. Rolls the Strike (your normal check dialog appears).
 *   5. Spends the spell.
 *   6. Attack-roll spell: on a hit or crit, ONE damage card with weapon + spell
 *      damage combined (each damage type kept separate, so resistances and
 *      weaknesses still apply per type). Crit doubles both.
 *      Save spell: weapon damage card on a hit; the spell's own card is posted
 *      for the save (skipped if the Strike critically failed — disrupted).
 *   7. Puts "Spellstrike (Expended)" on you. Delete it, or run this macro and
 *      choose Recharge, when you recharge (incl. via a conflux spell).
 *
 * USAGE: target one enemy (T), run the macro, choose weapon + spell.
 * Without a target the macro asks you whether the Strike hit.
 *
 * NOTES:
 *   - Spell damage with no type (e.g. Gouging Claw: slashing or piercing) uses
 *     the type you pick in the dialog.
 *   - Spellstrike ignores a spell's range: it uses your weapon's reach. The
 *     macro doesn't check reach.
 *   - Arcane Cascade's extra damage is part of your Strike damage already when
 *     the stance is active.
 */

(async () => {
    const VERSION = 1;
    if (this?.update && (!this.img || this.img === (this.constructor?.DEFAULT_ICON ?? "icons/svg/dice-target.svg"))) this.update({ img: "icons/magic/lightning/bolt-strike-blue.webp" }).catch(() => {});
    // ---------- Configuration ----------
    const EXPENDED_NAME = "Spellstrike (Expended)";
    const EXPENDED_IMG = "icons/magic/lightning/bolt-strike-blue.webp";
    const UNTYPED_CHOICES = ["slashing", "piercing", "bludgeoning", "force", "fire", "cold", "electricity", "acid", "sonic"];
    // -----------------------------------

    const DamageRoll = CONFIG.Dice.rolls.find(r => r.name === "DamageRoll");
    const DialogV2 = foundry.applications.api.DialogV2;
    const esc = (s) => foundry.utils.escapeHTML(String(s ?? ""));

    // ================= Magus =================
    const actor = canvas.tokens.controlled.find(t => t.actor?.isOwner)?.actor ?? game.user.character;
    if (!actor?.isOwner) return ui.notifications.error("Spellstrike: select your magus's token (or assign yourself a character).");

    // ================= Recharge state (a visible effect on you) =================
    const expended = actor.itemTypes.effect.find(e => e.name === EXPENDED_NAME);
    if (expended) {
        const choice = await DialogV2.wait({
            window: { title: `Spellstrike v${VERSION}` },
            content: `<p><strong>${esc(actor.name)}</strong>'s Spellstrike is expended.</p>
                      <p>Recharge it (1 action, concentrate — or you just cast a conflux spell)?</p>`,
            buttons: [
                { action: "recharge", label: "Recharge", default: true },
                { action: "anyway", label: "Spellstrike anyway" },
                { action: "cancel", label: "Cancel" },
            ],
            rejectClose: false,
        });
        if (!choice || choice === "cancel") return;
        await expended.delete();
        if (choice === "recharge") {
            await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p><strong>${esc(actor.name)}</strong> recharges Spellstrike.</p>` });
            return;
        }
    }

    // ================= Weapons =================
    const strikes = (actor.system.actions ?? []).filter(s => s.type === "strike" && s.ready !== false && (s.item?.isMelee ?? !s.item?.isRanged));
    if (!strikes.length) return ui.notifications.error("Spellstrike: no melee Strike available.");

    // ================= Spells that can be Spellstruck =================
    const castActions = (spell) => {
        const v = String(spell.system.time?.value ?? "");
        return ["1", "2"].includes(v) || /\b[12]\b/.test(v); // "1", "2", "1 to 3", "2 to 2 rounds" (pick the 1-/2-action version)
    };
    const usable = (spell) => castActions(spell) && (spell.traits.has("attack") || !!spell.system.defense?.save);
    const options = [];
    for (const entry of actor.spellcasting.regular ?? actor.spellcasting.contents) {
        if (entry.isRitual) continue;
        const spells = entry.spells?.contents ?? actor.itemTypes.spell.filter(s => s.system.location.value === entry.id);
        if (entry.isPrepared && !entry.isFlexible) {
            for (const [key, slot] of Object.entries(entry.system.slots ?? {})) {
                const rank = Number(key.replace("slot", ""));
                (slot.prepared ?? []).forEach((p, i) => {
                    const spell = p?.id && actor.items.get(p.id);
                    if (!spell || p.expended || !usable(spell)) return;
                    options.push({ entry, spell, rank: rank || spell.rank, slotId: i, label: `${spell.name} (${rank ? "rank " + rank : "cantrip"}) — ${entry.name}` });
                });
            }
        } else if (entry.isFocusPool) {
            for (const spell of spells) {
                if (!usable(spell)) continue;
                const fp = actor.system.resources?.focus?.value ?? 0;
                if (!spell.isCantrip && fp < 1) continue;
                options.push({ entry, spell, rank: spell.rank, label: `${spell.name} (focus${spell.isCantrip ? " cantrip" : ", 1 FP"}) — ${entry.name}` });
            }
        } else {
            // Spontaneous / flexible / innate: one option per castable rank with something left
            for (const spell of spells) {
                if (!usable(spell)) continue;
                if (spell.isCantrip || spell.atWill) { options.push({ entry, spell, rank: spell.rank, label: `${spell.name} (cantrip) — ${entry.name}` }); continue; }
                if (entry.isInnate) {
                    if ((spell.system.location?.uses?.value ?? 1) > 0) options.push({ entry, spell, rank: spell.rank, label: `${spell.name} (innate) — ${entry.name}` });
                    continue;
                }
                for (let r = spell.baseRank ?? spell.rank; r <= 10; r++) {
                    const slot = entry.system.slots?.[`slot${r}`];
                    if (slot?.max && slot.value > 0) options.push({ entry, spell, rank: r, label: `${spell.name} (rank ${r}) — ${entry.name}` });
                }
            }
        }
    }
    if (!options.length) return ui.notifications.warn("Spellstrike: no spell left that can be Spellstruck (1–2 actions, attack roll or save).");

    // ================= Dialog =================
    const target = Array.from(game.user.targets).find(t => t.actor && t.actor.uuid !== actor.uuid) ?? null;
    const weaponType = (s) => s.item?.system?.damage?.damageType ?? "slashing";
    const content = `
        <p>Magus: <strong>${esc(actor.name)}</strong> · Target: <strong>${target ? esc(target.name) : "none (you'll be asked if it hit)"}</strong></p>
        <div class="form-group"><label>Weapon</label>
            <select name="strike">${strikes.map((s, i) => `<option value="${i}">${esc(s.label)}</option>`).join("")}</select></div>
        <div class="form-group"><label>Attack</label>
            <select name="map">${strikes[0].variants.map((v, i) => `<option value="${i}">${esc(v.label)}</option>`).join("")}</select></div>
        <div class="form-group"><label>Spell</label>
            <select name="spell">${options.map((o, i) => `<option value="${i}">${esc(o.label)}</option>`).join("")}</select></div>
        <div class="form-group"><label>Untyped spell damage as</label>
            <select name="untyped">${UNTYPED_CHOICES.map(t => `<option value="${t}" ${t === weaponType(strikes[0]) ? "selected" : ""}>${t}</option>`).join("")}</select></div>`;
    const picked = await DialogV2.prompt({
        window: { title: `Spellstrike v${VERSION}` },
        content,
        ok: {
            label: "Spellstrike",
            callback: (event, button) => {
                const f = button.form;
                return { strike: strikes[+f.strike.value], map: +f.map.value, opt: options[+f.spell.value], untyped: f.untyped.value };
            },
        },
        rejectClose: false,
    });
    if (!picked) return;
    const { strike, map, opt, untyped } = picked;
    const castRank = opt.spell.computeCastRank?.(opt.rank) ?? opt.rank;
    const spell = opt.rank !== opt.spell.rank ? opt.spell.clone({ "system.location.heightenedLevel": castRank }, { keepId: true }) : opt.spell;
    const isAttackSpell = spell.traits.has("attack");

    // ================= Strike =================
    const variant = strike.variants[map] ?? strike.variants[0];
    const checkRoll = await variant.roll({});
    if (!checkRoll) return; // check dialog cancelled — nothing spent
    let degree = checkRoll.degreeOfSuccess ?? null; // 0 crit miss, 1 miss, 2 hit, 3 crit
    if (degree === null) {
        degree = await DialogV2.wait({
            window: { title: "Spellstrike — no target" },
            content: `<p>Strike total <strong>${checkRoll.total}</strong>. How did it land?</p>`,
            buttons: [
                { action: "3", label: "Critical hit" }, { action: "2", label: "Hit", default: true },
                { action: "1", label: "Miss" }, { action: "0", label: "Critical miss" },
            ],
            rejectClose: false,
        }).then(v => (v === null || v === undefined ? 1 : Number(v)));
    }
    const hit = degree >= 2;
    const crit = degree === 3;
    const disrupted = degree === 0 && !isAttackSpell;

    // ================= Spend the spell =================
    // Save spells post their own card (the target rolls the save from it) unless disrupted.
    await opt.entry.cast(opt.spell, { rank: opt.rank, slotId: opt.slotId, consume: true, message: !isAttackSpell && !disrupted });

    // ================= Damage =================
    const instanceStrings = (roll, double = false) => roll.instances.map(inst => {
        const s = String(inst);                       // e.g. "(2d8 + 7)[slashing]", "5[bleed,persistent]", "5d6"
        const m = s.match(/^(.*)\[([^\]]+)\]$/);
        const expr = m ? m[1] : s;
        const flavor = m ? m[2] : untyped;            // untyped spell damage → chosen type
        return double ? `(2 * (${expr}))[${flavor}]` : `(${expr})[${flavor}]`;
    });

    const flavorBits = [`<strong>Spellstrike</strong>: ${esc(strike.label)} + ${esc(spell.name)}${castRank ? ` (rank ${castRank})` : ""}`];
    const toolbelt = target ? { "pf2e-toolbelt": { targetHelper: { targets: [target.document.uuid] } } } : {};

    if (hit) {
        const weaponRoll = crit ? await strike.critical({ createMessage: false }) : await strike.damage({ createMessage: false });
        if (!weaponRoll) return ui.notifications.warn("Spellstrike: weapon damage was cancelled — the spell is already spent.");
        let parts = instanceStrings(weaponRoll);
        if (isAttackSpell) {
            const dmg = await spell.getDamage?.();
            const spellRoll = dmg?.template?.damage?.roll;
            if (spellRoll) parts = parts.concat(instanceStrings(spellRoll, crit));
            else flavorBits.push(`<em>(${esc(spell.name)} has no damage — apply its effects from the spell's description.)</em>`);
        }
        const combined = await new DamageRoll(`{${parts.join(",")}}`).evaluate();
        flavorBits.push(crit ? "<strong>Critical hit</strong> — weapon and spell both crit." : "Hit.");
        if (!isAttackSpell) flavorBits.push(`${esc(spell.name)} needs a save — its card is posted separately.`);
        await combined.toMessage({
            speaker: ChatMessage.getSpeaker({ actor }),
            flavor: flavorBits.join("<br>"),
            flags: { ...toolbelt },
        });
    } else {
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<p>${flavorBits[0]}</p><p>${degree === 0 ? "Critical miss" : "Miss"}${
                isAttackSpell ? ` — ${esc(spell.name)} misses too and is spent.` : disrupted ? ` — ${esc(spell.name)} is disrupted and spent.` : ` — the target still saves against ${esc(spell.name)} (card above).`}</p>`,
        });
    }

    // MAP reminder + expended effect
    ui.notifications.info("Spellstrike counts as two attacks for your multiple attack penalty.");
    await actor.createEmbeddedDocuments("Item", [{
        name: EXPENDED_NAME, type: "effect", img: EXPENDED_IMG,
        system: {
            description: { value: "<p>Spellstrike is spent. Recharge it with a single action (concentrate) or by casting a conflux spell, then delete this effect (or run the Spellstrike macro and choose Recharge).</p>" },
            duration: { value: -1, unit: "unlimited", expiry: null, sustained: false },
            tokenIcon: { show: true },
        },
    }]);
})();
