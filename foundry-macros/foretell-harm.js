/**
 * Foretell Harm — every target of the spell, damage card at the start of each target's turn
 * ==========================================================================================
 *
 * WHY: Foretell Harm (Oracle 1, PC2) has no automation in Foundry. The feat
 * posts a card and that's it — somebody has to remember, at the start of each
 * target's next turn, to roll 2 × rank damage and apply it. At setting-sun S14
 * that tick got waved through on Koto Zekora and never entered.
 *
 * PFS NOTE (Player Core 2 pg. 138): Foretell Harm can be used on ALL targets of
 * an area-of-effect spell, not just a single target. This macro takes every
 * token you have targeted.
 *
 * PLAYER-ONLY: this runs entirely in the caster's own browser. The GM doesn't
 * need to run anything, and the macro never writes to an enemy — it only posts
 * chat cards and puts effects on the caster, which a player can always do.
 *
 * WHAT THIS DOES:
 *   1. Works out the caster: your selected token if you own it, otherwise your
 *      assigned character. No names to edit — any oracle can use it.
 *   2. Uses every current target (T on each enemy token).
 *   3. Reads the caster's most recent spell cast from chat and pre-fills the
 *      rank and damage type (override either in the dialog).
 *   4. Posts one Foretell Harm card listing the targets. The pending harm lives
 *      on that card.
 *   5. Installs a turn listener in your browser. When combat reaches a target's
 *      turn, it rolls 2 × rank damage of the spell's type and posts the damage
 *      card with that creature set as the Toolbelt target — the GM applies it.
 *   6. A newer Foretell Harm on a creature replaces any older one still waiting
 *      on it, so a creature never takes two at once. A card only fires in the
 *      combat it was cast in.
 *
 * USAGE:
 *   1. Cast the damaging non-cantrip spell as normal.
 *   2. Target every creature it hit (T), run this macro, confirm rank/type.
 *   3. Leave your browser tab open. Each target's damage card appears at the
 *      start of its turn.
 *
 * NOTES:
 *   - The listener lives in your browser tab. If you reload, run the macro once
 *     (nothing targeted is fine) to pick pending harms back up. Re-running always
 *     replaces the listener, so it never double-fires.
 *   - Only the user who posted a Foretell Harm card fires it. If someone else
 *     also runs this macro, they won't roll your harms.
 *   - Nothing enforces the feat's Requirements, once-per-round frequency,
 *     24-hour immunity, or the cursebound increase — handle those at the table.
 *   - Damage uses a real damage roll, so resistance/weakness to the type
 *     applies when the GM applies it.
 */

(async () => {
    const VERSION = 3;   // bump on every change, so the "listener ready" notice shows which code is running
    // Hotbar icon: set once, only while this macro still has Foundry's default icon (a custom icon is kept).
    if (this?.update && (!this.img || this.img === (this.constructor?.DEFAULT_ICON ?? "icons/svg/dice-target.svg"))) this.update({ img: "icons/magic/perception/eye-ringed-glow-angry-red.webp" }).catch(() => {});
    // ---------- Configuration ----------
    const FEAT_SLUG = "foretell-harm";
    const FLAG_SCOPE = "world";
    const DAMAGE_TYPES = [
        "fire", "cold", "electricity", "acid", "sonic", "force", "vitality", "void",
        "mental", "poison", "bleed", "spirit", "bludgeoning", "piercing", "slashing", "untyped",
    ];
    // -----------------------------------

    const DamageRoll = CONFIG.Dice.rolls.find(r => r.name === "DamageRoll");
    const pendingOf = (m) => m.flags?.[FLAG_SCOPE]?.foretellHarm;
    const firedOf = (m) => m.flags?.[FLAG_SCOPE]?.foretellHarmFired;
    // Cards from the single-target version stored one targetTokenUuid; treat that as a one-item list.
    const targetsOf = (d) => d.targets ?? (d.targetTokenUuid ? [{ tokenUuid: d.targetTokenUuid }] : []);
    const hasFired = (messageId, tokenUuid) => game.messages.contents.some(m => {
        const f = firedOf(m);
        return f?.pendingId === messageId && (f.targetTokenUuid ?? tokenUuid) === tokenUuid;
    });

    // ================= Listener (replaced on every run, so it never stacks) =================
    const state = (globalThis.__foretellHarm ??= { hookIds: [] });
    for (const [event, id] of state.hookIds) Hooks.off(event, id);
    const firedLocally = (state.firedLocally ??= new Set());

    const fire = async (combat) => {
        const token = combat.combatant?.token;
        if (!token) return;

        // Only the newest Foretell Harm on this creature counts — a newer card replaces any
        // older one still waiting. Cards cast in a different combat never fire here.
        const message = game.messages.contents
            .filter(m => {
                const d = pendingOf(m);
                return d && d.userId === game.user.id
                    && (!d.combatId || d.combatId === combat.id)
                    && targetsOf(d).some(t => t.tokenUuid === token.uuid);
            })
            .sort((a, b) => a.timestamp - b.timestamp)
            .at(-1);
        if (!message) return;

        {
            const key = `${message.id}|${token.uuid}`;
            if (firedLocally.has(key) || hasFired(message.id, token.uuid)) return;
            firedLocally.add(key);

            const d = pendingOf(message);
            const caster = await fromUuid(d.casterUuid);
            const roll = await new DamageRoll(`${d.damage}[${d.damageType}]`).evaluate();
            await roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: caster ?? undefined }),
                flavor: `<strong>Foretell Harm</strong> — misfortune finds ${token.name} at the start of its turn ` +
                    `(rank ${d.rank}${d.spellName ? ` ${d.spellName}` : ""}, ${d.damage} ${d.damageType})`,
                flags: {
                    // Pin Toolbelt's apply-damage target to the foretold creature. Toolbelt only
                    // falls back to the roller's current targets when a card has none.
                    "pf2e-toolbelt": { targetHelper: { targets: [token.uuid] } },
                    [FLAG_SCOPE]: {
                        foretellHarmFired: { pendingId: message.id, targetTokenUuid: token.uuid },
                    },
                },
            });
        }
    };

    const hookId = Hooks.on("updateCombat", (combat, changed) => {
        if (!combat.started) return;
        if (!("turn" in changed) && !("round" in changed)) return;
        fire(combat).catch(err => console.error("Foretell Harm listener:", err));
    });
    state.hookIds = [["updateCombat", hookId]];

    // ================= Targets =================
    const allTargets = Array.from(game.user.targets);
    if (allTargets.length === 0) {
        ui.notifications.info(`Foretell Harm v${VERSION}: listener ready. Target the creatures your spell hit to foretell harm.`);
        return;
    }

    // ================= Caster =================
    const caster = canvas.tokens.controlled.find(t => t.actor?.isOwner)?.actor ?? game.user.character;
    if (!caster || !caster.isOwner) {
        ui.notifications.error("Foretell Harm: select your oracle's token (or assign yourself a character) first.");
        return;
    }
    const feat = caster.itemTypes.feat.find(f => f.slug === FEAT_SLUG);
    if (!feat) {
        ui.notifications.warn(`Foretell Harm: ${caster.name} doesn't have the Foretell Harm feat — continuing anyway.`);
    }

    const self = allTargets.filter(t => t.actor?.uuid === caster.uuid);
    const targets = allTargets.filter(t => !self.includes(t));
    if (self.length) ui.notifications.warn(`Foretell Harm: skipping ${caster.name} — you targeted yourself.`);
    if (!targets.length) return;

    // ================= Read the caster's last spell =================
    let guess = { rank: 1, damageType: "fire", spellName: "", isCantrip: false };
    const lastSpellMsg = game.messages.contents.slice().reverse().find(m =>
        m.speaker?.actor === caster.id && m.item?.type === "spell"
    );
    if (lastSpellMsg) {
        const spell = lastSpellMsg.item;
        const firstDamage = Object.values(spell.system?.damage ?? {})[0];
        guess = {
            rank: lastSpellMsg.flags?.pf2e?.origin?.castRank ?? spell.rank ?? 1,
            damageType: firstDamage?.type ?? "fire",
            spellName: spell.name,
            isCantrip: !!spell.isCantrip,
        };
    }

    const targetNames = targets.map(t => t.name).join(", ");
    const typeOptions = DAMAGE_TYPES.map(t =>
        `<option value="${t}" ${t === guess.damageType ? "selected" : ""}>${t}</option>`
    ).join("");
    const cantripWarn = guess.isCantrip
        ? `<p style="color:#b33"><strong>Last spell was a cantrip (${guess.spellName}) — Foretell Harm needs a non-cantrip.</strong></p>`
        : "";
    const content = `
        ${cantripWarn}
        <p>Caster: <strong>${caster.name}</strong><br>
           Targets (${targets.length}): <strong>${targetNames}</strong><br>
           Last spell: <strong>${guess.spellName || "none found"}</strong></p>
        <div class="form-group"><label>Spell rank</label>
            <input type="number" name="rank" min="1" max="10" value="${guess.rank}"></div>
        <div class="form-group"><label>Damage type</label>
            <select name="damageType">${typeOptions}</select></div>`;

    const readForm = (root) => ({
        rank: Math.max(1, Math.min(10, Number(root.querySelector("[name=rank]").value) || 1)),
        damageType: root.querySelector("[name=damageType]").value,
    });

    let choice = null;
    const DialogV2 = foundry.applications?.api?.DialogV2;
    if (DialogV2) {
        choice = await DialogV2.prompt({
            window: { title: "Foretell Harm" },
            content,
            ok: { label: "Foretell", callback: (event, button) => readForm(button.form) },
            rejectClose: false,
        });
    } else {
        choice = await new Promise(resolve => new Dialog({
            title: "Foretell Harm",
            content: `<form>${content}</form>`,
            buttons: {
                ok: { label: "Foretell", callback: html => resolve(readForm(html[0])) },
                cancel: { label: "Cancel", callback: () => resolve(null) },
            },
            default: "ok",
            close: () => resolve(null),
        }).render(true));
    }
    if (!choice) return;

    const damage = choice.rank * 2;

    // ================= The card (it carries the pending harm) =================
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: caster }),
        content: `
            <h3>Foretell Harm → ${targetNames}</h3>
            <p><em>Your magic echoes ominously as you glimpse injury in the target's future.</em></p>
            <p>Rank ${choice.rank}${guess.spellName ? ` ${guess.spellName}` : ""} →
               <strong>${damage} ${choice.damageType}</strong> to each target at the start of its next turn.</p>`,
        flags: {
            [FLAG_SCOPE]: {
                foretellHarm: {
                    casterUuid: caster.uuid,
                    userId: game.user.id,
                    combatId: game.combat?.id ?? null,
                    targets: targets.map(t => ({ tokenUuid: t.document.uuid, name: t.name })),
                    rank: choice.rank,
                    damageType: choice.damageType,
                    damage,
                    spellName: guess.spellName,
                },
            },
        },
    });
})();
