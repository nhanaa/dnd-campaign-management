/**
 * Celestial Armaments — replaces Foundry's effect with a corrected one
 * ============================================================================
 *
 * WHY: Foundry's "Effect: Celestial Armaments" has two problems in play:
 *   1. The blind DC comes out one low for a monk. The note is right —
 *      @Check[fortitude|against:class-spell] uses the higher of class DC and
 *      spell DC, as the feat says. The bug is upstream: PF2e 8.5 never raises a
 *      monk's class DC. RAW, Monk Expertise (9th) makes it expert and Graceful
 *      Legend (17th) makes it master, but Foundry leaves it at trained, so the
 *      spell DC wins by default (Sevek at 16: class DC 33 in Foundry vs 35 RAW,
 *      spell DC 34 → the blind save was rolled against 34).
 *   2. The blind reminder only shows on the attack roll card. When you roll
 *      critical damage, it isn't there.
 *
 * WHAT THIS DOES (run once, on the character with the feat):
 *   - Removes Foundry's "Effect: Celestial Armaments" and adds
 *     an identical-looking "Effect: Celestial Armaments" with the same
 *     mechanics, name and note text: torchlight,
 *     +1d8 spirit on the chosen weapon, the weapon's critical specialization.
 *   - The blind note (Fortitude vs the higher of class/spell DC, Blinded 1d4
 *     rounds) appears on the critical HIT card AND the critical DAMAGE card.
 *   - Keeps the weapon chosen on the old effect; otherwise asks which weapon.
 *   - For monks of 9th level or higher, adds "Monk Class DC (Expertise fix)":
 *     class DC expert at 9th, master at 17th. It's a visible effect — delete it
 *     if Foundry ever fixes Monk Expertise itself.
 *
 * NOTES:
 *   - Everything goes on your own character, so a player can run it.
 *   - Re-running replaces the effect (picks up changes to this macro).
 *   - The class DC fix changes every class-DC check on the character, which is
 *     the point, but tell your GM so the change isn't a surprise.
 */

(async () => {
    const VERSION = 4;
    // Hotbar icon: set once, only while this macro still has Foundry's default icon (a custom icon is kept).
    if (this?.update && (!this.img || this.img === (this.constructor?.DEFAULT_ICON ?? "icons/svg/dice-target.svg"))) this.update({ img: "icons/skills/melee/weapons-crossed-swords-yellow-teal.webp" }).catch(() => {});
    const OLD_SLUG = "effect-celestial-armaments";
    const NEW_SLUG = "celestial-armaments-fixed";   // v1 of this macro; replaced on re-run
    const FIX_SLUG = "monk-class-dc-expertise-fix";
    const BLINDED = "Compendium.pf2e.conditionitems.Item.XgEqL1kFApUbl5Z2";

    const actor = canvas.tokens.controlled.find(t => t.actor?.isOwner)?.actor ?? game.user.character;
    if (!actor?.isOwner) {
        ui.notifications.error("Celestial Armaments: select your character's token (or assign yourself a character) first.");
        return;
    }
    if (!actor.itemTypes.feat.some(f => f.slug === "celestial-armaments")) {
        ui.notifications.warn(`Celestial Armaments: ${actor.name} doesn't have the Celestial Armaments feat — continuing anyway.`);
    }

    // ---------- Weapon: reuse the old effect's choice, else ask ----------
    const existing = actor.itemTypes.effect.filter(e => [OLD_SLUG, NEW_SLUG].includes(e.slug));
    let weaponId = existing.map(e => e.flags?.pf2e?.rulesSelections?.weapon).find(id => id && actor.items.has(id));
    if (!weaponId) {
        const weapons = [
            ...actor.itemTypes.weapon,
            ...actor.itemTypes.equipment.filter(i => i.slug === "handwraps-of-mighty-blows"),
        ];
        if (!weapons.length) {
            ui.notifications.error(`Celestial Armaments: ${actor.name} has no weapon to bless.`);
            return;
        }
        weaponId = weapons.length === 1 ? weapons[0].id : await foundry.applications.api.DialogV2.prompt({
            window: { title: "Celestial Armaments — choose a weapon" },
            content: `<div class="form-group"><label>Weapon</label><select name="weapon">
                ${weapons.map(w => `<option value="${w.id}">${w.name}</option>`).join("")}</select></div>`,
            ok: { label: "Bless", callback: (event, button) => button.form.querySelector("[name=weapon]").value },
            rejectClose: false,
        });
        if (!weaponId) return;
    }

    // ---------- The effect ----------
    const W = "{item|flags.system.rulesSelections.weapon}";
    // Foundry's own note text, word for word. The note's title (the effect name) already labels it.
    const blindNote = `When you critically hit a target with the weapon, the target must succeed at a ` +
        `@Check[fortitude|against:class-spell] or be @UUID[${BLINDED}]{Blinded} for [[/r 1d4 #rounds]]{1d4 rounds}.`;

    const effect = {
        type: "effect",
        name: "Effect: Celestial Armaments",
        img: existing[0]?.img ?? "icons/skills/melee/weapons-crossed-swords-yellow-teal.webp",
        system: {
            slug: OLD_SLUG,
            level: { value: actor.level },
            duration: { value: -1, unit: "unlimited", expiry: null, sustained: false },
            tokenIcon: { show: false },
            // Foundry's own description (Compendium.pf2e.feat-effects.Item.h8BLaHUFnzCDJf5I).
            description: {
                value: "<p>Granted by @UUID[Compendium.pf2e.feats-srd.Item.hSm66XVNVjPdbL2c]{Celestial Armaments}</p>" +
                    "<p>Your weapon sheds light like a torch, deals an additional 1d8 spirit damage, and you gain the weapon's critical specialization.</p>" +
                    "<p>When you critically hit a target with the weapon, the target must succeed at a Fortitude save against " +
                    "your class DC or spell DC (whichever is higher) or be blinded for 1d4 rounds.</p>",
            },
            rules: [
                {
                    key: "ChoiceSet", flag: "weapon", prompt: "PF2E.SpecificRule.Prompt.Weapon",
                    choices: { includeHandwraps: true, ownedItems: true, types: ["weapon"] },
                    selection: weaponId,
                },
                {
                    key: "TokenLight", priority: 90,
                    value: {
                        alpha: 0.2, animation: { intensity: 1, speed: 2, type: "flame" }, attenuation: 0.4,
                        bright: 20, color: "#ffae3d", coloration: 101, dim: 40, shadows: 0.2,
                    },
                },
                { key: "DamageDice", damageType: "spirit", diceNumber: 1, dieSize: "d8", selector: `${W}-damage` },
                { key: "CriticalSpecialization", predicate: [`item:id:${W}`] },
                { key: "Note", outcome: ["criticalSuccess"], selector: `${W}-attack`, title: "{item|name}", text: blindNote },
                { key: "Note", outcome: ["criticalSuccess"], selector: `${W}-damage`, title: "{item|name}", text: blindNote },
            ],
        },
    };

    if (existing.length) await actor.deleteEmbeddedDocuments("Item", existing.map(e => e.id));
    await actor.createEmbeddedDocuments("Item", [effect]);

    // ---------- Monk class DC fix ----------
    let fixNote = "";
    if (actor.class?.slug === "monk" && actor.level >= 9) {
        const before = actor.classDC?.dc?.value;
        const oldFix = actor.itemTypes.effect.filter(e => e.slug === FIX_SLUG);
        if (oldFix.length) await actor.deleteEmbeddedDocuments("Item", oldFix.map(e => e.id));
        await actor.createEmbeddedDocuments("Item", [{
            type: "effect",
            name: "Monk Class DC (Expertise fix)",
            img: "icons/skills/melee/unarmed-punch-fist-yellow-red.webp",
            system: {
                slug: FIX_SLUG,
                level: { value: 1 },
                duration: { value: -1, unit: "unlimited", expiry: null, sustained: false },
                tokenIcon: { show: false },
                description: {
                    value: "<p>PF2e doesn't raise the monk class DC. RAW: expert at 9th (Monk Expertise), " +
                        "master at 17th (Graceful Legend). Delete this if Foundry fixes it.</p>",
                },
                rules: [{
                    key: "ActiveEffectLike", mode: "upgrade",
                    path: "system.proficiencies.classDCs.monk.rank",
                    value: "ternary(gte(@actor.level,17),3,2)",
                }],
            },
        }]);
        const after = actor.classDC?.dc?.value;
        fixNote = ` Class DC ${before ?? "?"} → ${after ?? "?"}.`;
    }

    const weapon = actor.items.get(weaponId);
    ui.notifications.info(`Celestial Armaments v${VERSION}: applied to ${weapon?.name ?? "weapon"}.${fixNote}`);
})();
