/**
 * Sevek's Taunt / Group Taunt — fixed-origin macro
 * =================================================
 *
 * WHY: Foundry's PF2e Effect: Taunt has three real problems in play:
 *   1. When the GM drags the effect onto an enemy (instead of the PC's own
 *      client applying it), `flags.pf2e.origin.signature` is often blank.
 *      That breaks the attack-roll penalty predicate (silently applies the
 *      −1 to attacks on the taunter itself, because `target:signature` !=
 *      `{item|origin.signature}` when origin is blank), AND it breaks
 *      Bodyguard's −2 upgrade predicate (which specifically looks for
 *      `origin:effect:taunt:{item|origin.signature}`).
 *   2. The DC-penalty rule element is behind a toggleable RollOption
 *      (`taunt-dc-penalty`) that defaults OFF, so save-based AoE from a
 *      taunted caster never gets the −1 to DC unless somebody clicks the
 *      toggle mid-fight.
 *   3. Group Taunt has zero targeting automation — the feat only appends
 *      text to Taunt's description. You still have to apply the effect
 *      to each target yourself.
 *
 * WHAT THIS DOES:
 *   - Grabs the Sevek actor by name (so it works from any token/context).
 *   - Applies Effect: Taunt to each targeted token (up to 3 for Group).
 *   - Force-writes `flags.pf2e.origin` on the applied effect so
 *     origin.signature = Sevek's signature. This fixes (1) end-to-end.
 *   - Sets `taunt-dc-penalty` RollOption to true by default so (2) works
 *     without a manual click. Toggle it off per-token if a taunted caster
 *     drops an AoE that visibly includes Sevek.
 *   - Optionally clears prior Sevek-origin Taunts on other tokens before
 *     applying new ones, to enforce the "only up to N in effect at once"
 *     rule (1 for base Taunt, 3 for Group Taunt). Set CLEAR_OLD = false
 *     if you prefer to remove old Taunts manually.
 *
 * USAGE:
 *   1. Target 1–3 enemies (Group Taunt) in Foundry (T key on a token).
 *   2. Run this macro from your hotbar.
 *   3. Each target gets Effect: Taunt with origin locked to Sevek and DC
 *      penalty ON. Old Sevek-origin Taunts on other tokens are cleared.
 *
 * NOTES:
 *   - CASTER_NAME is looked up by Actor name. If Sevek's actor is named
 *     differently in your world, change the string.
 *   - Sevek must have the Group Taunt feat for the 3-target extension. The
 *     macro itself doesn't enforce this — it just caps at MAX_TARGETS.
 *     Change MAX_TARGETS to 1 if Sevek somehow loses Group Taunt.
 *   - This macro doesn't spend the action — you still click the Taunt
 *     action on Sevek's sheet to post the chat card and track the action.
 *     The macro is a REPLACEMENT for the "drag effect onto token" step.
 */

(async () => {
    // ---------- Configuration ----------
    const CASTER_NAME = "Sevek";
    const TAUNT_UUID = "Compendium.pf2e.feat-effects.Item.FlyWq9znOHvpISNW";
    const MAX_TARGETS = 3;             // Group Taunt = 3, base Taunt = 1
    const FORCE_DC_PENALTY = true;      // auto-enable the taunt-dc-penalty toggle
    const CLEAR_OLD = true;             // remove prior Sevek-origin Taunts from other tokens
    // -----------------------------------

    const caster = game.actors.getName(CASTER_NAME);
    if (!caster) {
        ui.notifications.error(`Taunt macro: actor "${CASTER_NAME}" not found. Edit CASTER_NAME in the macro.`);
        return;
    }
    const casterSig = caster.signature ?? caster.id;
    const casterUuid = caster.uuid;

    const targets = Array.from(game.user.targets);
    if (targets.length === 0) {
        ui.notifications.warn("Taunt macro: no targets. Press T on 1–3 enemies before running.");
        return;
    }
    if (targets.length > MAX_TARGETS) {
        ui.notifications.warn(`Taunt macro: ${targets.length} targeted, capping at ${MAX_TARGETS} (Group Taunt limit).`);
    }
    const applyTo = targets.slice(0, MAX_TARGETS);

    const effectItem = await fromUuid(TAUNT_UUID);
    if (!effectItem) {
        ui.notifications.error(`Taunt macro: Effect: Taunt not found at ${TAUNT_UUID}.`);
        return;
    }

    // ---------- Optional: clear existing Sevek-origin Taunts on other tokens ----------
    if (CLEAR_OLD) {
        const targetUuids = new Set(applyTo.map(t => t.actor?.uuid).filter(Boolean));
        for (const token of canvas.tokens.placeables) {
            if (!token.actor) continue;
            if (targetUuids.has(token.actor.uuid)) continue;   // keep on new targets; overwrite below
            const stale = token.actor.itemTypes.effect.filter(e => {
                if (e.slug !== "effect-taunt") return false;
                const originSig = e.flags?.pf2e?.origin?.signature;
                return originSig === casterSig;
            });
            if (stale.length > 0) {
                await token.actor.deleteEmbeddedDocuments("Item", stale.map(e => e.id));
            }
        }
    }

    // ---------- Apply Effect: Taunt to each target ----------
    let appliedCount = 0;
    for (const target of applyTo) {
        if (!target.actor) continue;

        // Remove any prior Taunt from Sevek on this token (avoid stacking duplicates)
        const priorFromSevek = target.actor.itemTypes.effect.filter(e =>
            e.slug === "effect-taunt" &&
            e.flags?.pf2e?.origin?.signature === casterSig
        );
        if (priorFromSevek.length > 0) {
            await target.actor.deleteEmbeddedDocuments("Item", priorFromSevek.map(e => e.id));
        }

        // Clone the compendium effect and force origin + DC-penalty state
        const effectData = effectItem.toObject();
        effectData.flags = effectData.flags ?? {};
        effectData.flags.pf2e = effectData.flags.pf2e ?? {};
        effectData.flags.pf2e.origin = {
            actor: casterUuid,
            item: null,
            signature: casterSig,
        };

        // Force the taunt-dc-penalty toggle default to true (fires DC −1 on AoE saves)
        if (FORCE_DC_PENALTY) {
            for (const rule of effectData.system?.rules ?? []) {
                if (rule.key === "RollOption" && rule.option === "taunt-dc-penalty" && rule.toggleable) {
                    rule.value = true;
                }
            }
        }

        await target.actor.createEmbeddedDocuments("Item", [effectData]);
        appliedCount += 1;
    }

    const dcNote = FORCE_DC_PENALTY ? "; DC penalty ON" : "";
    const clearNote = CLEAR_OLD ? "; prior Sevek Taunts cleared" : "";
    ui.notifications.info(
        `Sevek Taunt: applied to ${appliedCount} target(s), origin locked to ${caster.name}${dcNote}${clearNote}.`
    );
})();
