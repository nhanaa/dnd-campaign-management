/**
 * Anthem Aura — Courageous / Rallying Anthem (with Fortissimo) as an aura
 * =======================================================================
 *
 * WHY: Foundry's composition effects have to be dragged onto every ally, and
 * Fortissimo Composition's effect asks each one "+2 or +3?". PF2e Workbench
 * ships "Aura: Courageous Anthem" / "Aura: Rallying Anthem" (a 60-ft aura that
 * hands allies the spell effect), but nothing for Fortissimo.
 *
 * WHAT THIS DOES (click after casting the composition):
 *   1. Asks: which anthem, and which spellshape you used on it — only one,
 *      since Fortissimo and Lingering Composition are both spellshapes:
 *        none (+1, 1 round) · Fortissimo success (+2, 1 round) ·
 *        Fortissimo critical success (+3, 1 round) ·
 *        Lingering success (+1, 3 rounds) · Lingering critical success (+1, 4 rounds)
 *   2. If Fortissimo landed, puts "Spell Effect: Fortissimo Composition" on you
 *      with the +2/+3 already chosen.
 *   3. Puts "Aura: <Anthem>" on you: 60-ft auditory aura, same as Workbench's,
 *      that gives allies Foundry's anthem spell effect — and, with Fortissimo,
 *      a copy of your pre-chosen Fortissimo effect, so nobody gets asked.
 *
 * HOW THE AURA APPLIES: PF2e's own aura system. Each ally inside gets the
 * effects from their own player's browser (or the GM's if they're offline),
 * and loses them on leaving the area or when the aura ends. No GM macro.
 *
 * NOTES:
 *   - Doesn't cast anything — cast the composition (and roll Fortissimo /
 *     Lingering) from your sheet, then click this.
 *   - Clicking again replaces your previous anthem aura.
 *   - Allies' tokens must be on the same scene.
 */

(async () => {
    const VERSION = 3;
    const FLAG = "anthemAura";
    const ANTHEMS = {
        "courageous-anthem": {
            name: "Courageous Anthem",
            img: "systems/pf2e/icons/spells/inspire-courage.webp",
            effect: "Compendium.pf2e.spell-effects.Item.beReeFroAx24hj83",
            extra: [{ uuid: "Compendium.pf2e.feat-effects.Item.oXG7eX26FmePmwUF", affects: "allies", predicate: ["feat:discordant-voice"] }],
        },
        "rallying-anthem": {
            name: "Rallying Anthem",
            img: "systems/pf2e/icons/spells/inspire-defense.webp",
            effect: "Compendium.pf2e.spell-effects.Item.DLwTvjjnqs2sNGuG",
            extra: [],
        },
    };
    const FORTISSIMO = "Compendium.pf2e.spell-effects.Item.rAW5o8MjjuIhYhLg";

    const actor = canvas.tokens.controlled.find(t => t.actor?.isOwner)?.actor ?? game.user.character;
    if (!actor?.isOwner) {
        ui.notifications.error("Anthem Aura: select your character's token (or assign yourself a character) first.");
        return;
    }

    // Hotbar icon: use the anthem art the first time (only replaces Foundry's default macro icon).
    if (this?.update && (!this.img || this.img === (this.constructor?.DEFAULT_ICON ?? "icons/svg/dice-target.svg"))) {
        this.update({ img: ANTHEMS["courageous-anthem"].img }).catch(() => {});
    }

    // ---------- Ask ----------
    const known = Object.entries(ANTHEMS).filter(([slug]) => actor.itemTypes.spell.some(s => s.slug === slug));
    const anthemOptions = (known.length ? known : Object.entries(ANTHEMS))
        .map(([slug, a]) => `<option value="${slug}">${a.name}</option>`).join("");
    const choice = await foundry.applications.api.DialogV2.prompt({
        window: { title: "Anthem Aura" },
        content: `
            <div class="form-group"><label>Composition</label><select name="anthem">${anthemOptions}</select></div>
            <div class="form-group"><label>Spellshape</label><select name="spellshape">
                <option value="0|1">None (+1, 1 round)</option>
                <option value="2|1">Fortissimo — success (+2, 1 round)</option>
                <option value="3|1">Fortissimo — critical success (+3, 1 round)</option>
                <option value="0|3">Lingering — success (+1, 3 rounds)</option>
                <option value="0|4">Lingering — critical success (+1, 4 rounds)</option>
            </select></div>
            <p style="font-size:0.9em; opacity:0.8"><em>Fortissimo and Lingering are both spellshapes — only one per composition.</em></p>`,
        ok: {
            label: "Start Aura",
            callback: (event, button) => {
                const [fortissimo, rounds] = button.form.querySelector("[name=spellshape]").value.split("|").map(Number);
                return { anthem: button.form.querySelector("[name=anthem]").value, fortissimo, rounds };
            },
        },
        rejectClose: false,
    });
    if (!choice) return;

    const anthem = ANTHEMS[choice.anthem];
    const duration = { value: choice.rounds, unit: "rounds", expiry: "turn-start", sustained: false };
    const origin = {
        actor: actor.uuid, token: actor.getActiveTokens(true, true)[0]?.uuid ?? null,
        item: null, spellcasting: null, rollOptions: [],
    };

    // ---------- Replace any previous anthem aura ----------
    const previous = actor.itemTypes.effect.filter(e => e.flags?.world?.[FLAG]);
    if (previous.length) await actor.deleteEmbeddedDocuments("Item", previous.map(e => e.id));

    // ---------- Fortissimo, pre-chosen, on you ----------
    let fortissimoUuid = null;
    if (choice.fortissimo) {
        const source = await fromUuid(FORTISSIMO);
        const data = source.toObject();
        data.name = `Spell Effect: Fortissimo Composition (+${choice.fortissimo})`;
        data.system.duration = duration;
        data.system.context = { origin, target: null, roll: null };
        for (const rule of data.system.rules) {
            if (rule.key === "ChoiceSet" && rule.flag === "fortissimoBonus") rule.selection = choice.fortissimo;
        }
        foundry.utils.setProperty(data, "flags.pf2e.rulesSelections.fortissimoBonus", choice.fortissimo);
        foundry.utils.setProperty(data, `flags.world.${FLAG}`, "fortissimo");
        const [created] = await actor.createEmbeddedDocuments("Item", [data]);
        fortissimoUuid = created?.uuid ?? null;
    }

    // ---------- The aura ----------
    const effects = [
        { uuid: anthem.effect, affects: "allies" },
        ...anthem.extra,
        // You already hold the original Fortissimo effect, so the aura only copies it to allies.
        ...(fortissimoUuid ? [{ uuid: fortissimoUuid, affects: "allies", includesSelf: false }] : []),
    ];
    await actor.createEmbeddedDocuments("Item", [{
        type: "effect",
        name: `Aura: ${anthem.name}${choice.fortissimo ? ` (Fortissimo +${choice.fortissimo})` : ""}`,
        img: anthem.img,
        system: {
            level: { value: Math.ceil(actor.level / 2) },
            duration,
            tokenIcon: { show: true },
            description: {
                value: `<p>60-foot aura granting ${anthem.name}${choice.fortissimo ? ` at +${choice.fortissimo} (Fortissimo)` : ""} ` +
                    `to allies inside, for ${choice.rounds} round${choice.rounds === 1 ? "" : "s"}. Made by the Anthem Aura macro v${VERSION}.</p>`,
            },
            rules: [{
                key: "Aura",
                slug: `anthem-aura-${choice.anthem}`,
                radius: 60,
                traits: ["auditory"],
                level: "ceil(@actor.level/2)",
                effects,
            }],
        },
        flags: { world: { [FLAG]: "aura" } },
    }]);

    ui.notifications.info(`Anthem Aura v${VERSION}: ${anthem.name}` +
        `${choice.fortissimo ? ` +${choice.fortissimo}` : ""} for ${choice.rounds} round${choice.rounds === 1 ? "" : "s"}.`);
})();
