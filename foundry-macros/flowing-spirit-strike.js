/**
 * Flowing Spirit Strike — two normal Strike cards, spirit damage when both hit
 * ============================================================================
 *
 * RULES (Exemplar, transcendence, 2 actions): two Strikes with the gleaming
 * blade against the same target, both at your current MAP. The second takes
 * –2 unless the blade is agile. If BOTH hit, their damage is combined and all
 * dealt as spirit damage (resistances/weaknesses once). If only one hits, it
 * deals normal damage. Counts as two attacks for MAP.
 *
 * WHAT THIS DOES:
 *   1. Rolls your gleaming blade Strike twice — normal PF2e Strike cards, the
 *      second with –2 if the weapon isn't agile.
 *   2. If both hit your target, puts "Flowing Spirit Strike (spirit damage)"
 *      on you until the end of your turn. While it's on, the Damage/Critical
 *      buttons on the Strike cards roll spirit damage.
 *   3. Click Damage on both cards, then use pf2e-toolbelt's "Merge with
 *      previous damage message" on the second to combine them.
 *   If only one hits, no effect — click Damage on that card as normal.
 *
 * USAGE: target one enemy (T), select your token, run the macro.
 * Set MAP_STEP below to 1 or 2 for copies of this macro used later in a turn.
 * Without a target it can't tell what hit — it won't add the effect.
 */

(async () => {
    const MAP_STEP = 0; // 0 = first attack, 1 = second (–5/–4 agile), 2 = third
    const EFFECT_NAME = "Flowing Spirit Strike (spirit damage)";
    const EFFECT_IMG = "icons/magic/light/beam-rays-yellow.webp";
    if (this?.update && (!this.img || this.img === (this.constructor?.DEFAULT_ICON ?? "icons/svg/dice-target.svg"))) this.update({ img: EFFECT_IMG }).catch(() => {});

    const actor = canvas.tokens.controlled.find(t => t.actor?.isOwner)?.actor ?? game.user.character;
    if (!actor?.isOwner) return ui.notifications.error("Flowing Spirit Strike: select your token (or assign yourself a character).");

    // Gleaming blade = your melee weapon Strike (not the basic fist)
    const strike = (actor.system.actions ?? []).find(s => s.type === "strike" && s.ready !== false && s.item?.isMelee && s.item?.slug !== "basic-unarmed");
    if (!strike) return ui.notifications.error("Flowing Spirit Strike: no melee weapon Strike available.");
    const variant = strike.variants[MAP_STEP] ?? strike.variants[0];
    const agile = strike.item.system.traits.value.includes("agile");

    // Clear a leftover effect so a miss this time doesn't roll spirit
    const old = actor.itemTypes.effect.find(e => e.name === EFFECT_NAME);
    if (old) await old.delete();

    const options = ["action:flowing-spirit-strike"];
    const r1 = await variant.roll({ options });
    if (!r1) return;
    const r2 = await variant.roll({
        options,
        modifiers: agile ? [] : [new game.pf2e.Modifier({ slug: "flowing-spirit-strike", label: "Flowing Spirit Strike", modifier: -2 })],
    });
    if (!r2) return;

    const d1 = r1.degreeOfSuccess, d2 = r2.degreeOfSuccess;
    if (d1 == null || d2 == null) {
        return ui.notifications.warn("Flowing Spirit Strike: no target, so I can't tell if both hit. If they did, damage is combined as spirit.");
    }
    if (d1 >= 2 && d2 >= 2) {
        await actor.createEmbeddedDocuments("Item", [{
            name: EFFECT_NAME, type: "effect", img: EFFECT_IMG,
            system: {
                description: { value: "<p>Both Flowing Spirit Strikes hit: their damage is all spirit. Roll damage from both Strike cards, then merge them with pf2e-toolbelt. Ends at the end of your turn — or delete it.</p>" },
                duration: { value: 0, unit: "rounds", expiry: "turn-end", sustained: false },
                tokenIcon: { show: true },
                rules: [{ key: "DamageAlteration", mode: "override", property: "damage-type", value: "spirit", selectors: ["strike-damage"] }],
            },
        }]);
        ui.notifications.info("Flowing Spirit Strike: both hit — roll both damages (spirit), then merge them.");
    } else {
        ui.notifications.info("Flowing Spirit Strike: not both — roll damage normally from the Strike that hit.");
    }
})();
