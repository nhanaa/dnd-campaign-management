/**
 * Taunt / Group Taunt — fixed-origin macro (Guardian)
 * ===================================================
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
 *   - Works out the guardian: your selected token if you own it, otherwise
 *     your assigned character. No names to edit — any guardian can use it.
 *   - Target limit comes from the sheet: 3 with the Group Taunt feat, 1 without.
 *   - Applies Effect: Taunt to each targeted token, up to that limit.
 *   - Writes `system.context.origin` on the applied effect so
 *     origin.signature = the guardian's signature. This fixes (1) end-to-end.
 *     (PF2e reads origin from system.context, not from `flags.pf2e.origin` —
 *     writing only the flag leaves the −1 applying to attacks on the guardian.)
 *   - Fixes (2) from targets instead of the toggle. The toggle stays OFF.
 *     A GM-side listener watches the taunted creature's chat cards. Toolbelt's
 *     Target Helper stores a save DC on each card, and the listener rewrites it
 *     whenever the card's targets are set or changed (Template Helper, Set
 *     Targets button, single-target cast):
 *       - targets include an ally of the guardian but NOT the guardian
 *           → DC −1, and "Taunted: Off-Guard" until its next turn starts
 *       - guardian included, or no allies → original DC, off-guard removed
 *     If saves were already rolled when the DC changes, the GM gets a whisper
 *     naming them — results aren't re-graded automatically.
 *   - Optionally clears the guardian's prior Taunts on other tokens before
 *     applying new ones, to enforce the "only up to N in effect at once"
 *     rule (1 for base Taunt, 3 for Group Taunt). Set CLEAR_OLD = false
 *     if you prefer to remove old Taunts manually.
 *
 * GM (required for the DC/off-guard part):
 *   Run this macro once per session with nothing targeted to install the
 *   listener. Needs PF2e Toolbelt with Target Helper enabled. Attack rolls
 *   don't need it — the effect's own predicate handles those.
 *
 * USAGE:
 *   1. Select your guardian's token (or have it as your assigned character).
 *   2. Target the enemies you're taunting (T key on each token).
 *   3. Run this macro from your hotbar.
 *
 * NOTES:
 *   - Writing an effect onto an enemy needs permission to edit that actor.
 *     A player client without it will get a permission error; the GM can run
 *     it for them (select the guardian's token first).
 *   - Posts the sheet's own Taunt chat card (same text, traits, and the
 *     Long-Distance / Group Taunt boxes), with the taunted targets appended
 *     at the bottom. Don't also click Taunt on the sheet — that would post
 *     a second card. The macro doesn't track the action; count it yourself.
 */

(async () => {
    // Hotbar icon: set once, only while this macro still has Foundry's default icon (a custom icon is kept).
    if (this?.update && (!this.img || this.img === (this.constructor?.DEFAULT_ICON ?? "icons/svg/dice-target.svg"))) this.update({ img: "icons/skills/social/intimidation-impressing.webp" }).catch(() => {});
    // ---------- Configuration ----------
    const TAUNT_UUID = "Compendium.pf2e.feat-effects.Item.FlyWq9znOHvpISNW";
    const GROUP_TAUNT_SLUG = "group-taunt";
    const FORCE_DC_PENALTY = false;     // leave OFF — the GM listener below sets the −1 per cast from targets
    const CLEAR_OLD = true;             // remove this guardian's prior Taunts from other tokens
    const TB = "pf2e-toolbelt";
    const OFF_GUARD_UUID = "Compendium.pf2e.conditionitems.Item.AJh5ex99aV6VTggg";
    // -----------------------------------

    // ================= GM listener: Taunt vs. save DCs, driven by Toolbelt targets =================
    // Toolbelt's Target Helper stores a save DC on each spell/area/check card as a plain number
    // (flags.pf2e-toolbelt.targetHelper.saveVariants.<variant>.dc), captured when the card is posted.
    // Save buttons roll against that number. So whenever a taunted creature's card gets or changes
    // targets, this rewrites that DC per RAW: −1 if the targets include an ally of the guardian but
    // not the guardian, otherwise the original DC. It also applies/removes off-guard to match.
    if (!globalThis.__tauntTargetHook) {
        const isActiveGM = () => game.user.isGM && (game.users.activeGM ?? game.user) === game.user;
        const resolveActor = (uuid) => {
            const doc = uuid ? fromUuidSync(uuid, { strict: false }) : null;
            return doc?.actor ?? doc ?? null;
        };

        const evaluate = async (message) => {
            if (!isActiveGM()) return;
            const th = message.flags?.[TB]?.targetHelper;
            const variants = th?.saveVariants ?? {};
            if (!Object.keys(variants).length) return;

            const author = message.actor ?? resolveActor(th.author);
            const taunts = author?.itemTypes?.effect.filter(e => e.slug === "effect-taunt") ?? [];
            if (!taunts.length) return;

            const targetActors = (th.targets ?? []).map(resolveActor).filter(Boolean);
            const penalized = taunts.some(effect => {
                const guardian = effect.origin;
                if (!guardian || guardian === author) return false;   // no real origin → can't judge
                const includesGuardian = targetActors.some(a => a.uuid === guardian.uuid);
                const includesAlly = targetActors.some(a => a.uuid !== guardian.uuid && a.isAllyOf(guardian));
                return includesAlly && !includesGuardian;
            });

            // Original DC per variant, remembered on first sight. If the old always-on toggle was
            // active when the card was posted, the stored DC already has the −1 baked in.
            const bakedIn = !!author.rollOptions?.all?.["taunt-dc-penalty"];
            const originals = foundry.utils.deepClone(message.flags?.world?.tauntDc ?? {});
            const update = {};
            const rolledEarly = [];
            for (const [id, variant] of Object.entries(variants)) {
                originals[id] ??= variant.dc + (bakedIn ? 1 : 0);
                const want = penalized ? originals[id] - 1 : originals[id];
                if (variant.dc === want) continue;
                update[`flags.${TB}.targetHelper.saveVariants.${id}.dc`] = want;
                for (const tokenId of Object.keys(variant.saves ?? {})) rolledEarly.push(tokenId);
            }
            if (Object.keys(update).length) {
                update["flags.world.tauntDc"] = originals;
                await message.update(update);
                if (rolledEarly.length) {
                    const names = rolledEarly.map(id => canvas.tokens.get(id)?.name ?? id).join(", ");
                    await ChatMessage.create({
                        whisper: ChatMessage.getWhisperRecipients("GM"),
                        content: `<p><strong>Taunt:</strong> ${author.name}'s DC changed after saves were rolled ` +
                            `(${names}). Those results used the old DC — re-check them.</p>`,
                    });
                }
            }

            // Off-guard until the start of the taunted creature's next turn, tied to this card.
            const offGuard = author.itemTypes.effect.find(e => e.flags?.world?.tauntOffGuard === message.id);
            if (penalized && !offGuard) {
                await author.createEmbeddedDocuments("Item", [{
                    type: "effect",
                    name: "Taunted: Off-Guard",
                    img: "systems/pf2e/icons/conditions/off-guard.webp",
                    system: {
                        slug: "taunted-off-guard",
                        duration: { value: 1, unit: "rounds", expiry: "turn-start", sustained: false },
                        tokenIcon: { show: true },
                        description: { value: "<p>Took a hostile action that included the guardian's allies but not the guardian. Off-guard until the start of its next turn.</p>" },
                        rules: [{ key: "GrantItem", uuid: OFF_GUARD_UUID, inMemoryOnly: true }],
                    },
                    flags: { world: { tauntOffGuard: message.id } },
                }]);
            } else if (!penalized && offGuard) {
                await offGuard.delete();
            }
        };

        const run = (message) => evaluate(message).catch(err => console.error("Taunt listener:", err));
        Hooks.on("createChatMessage", run);
        Hooks.on("updateChatMessage", run);
        globalThis.__tauntTargetHook = true;
        if (game.user.isGM) ui.notifications.info("Taunt: target listener installed on this client.");
    }
    if (game.user.isGM && game.user.targets.size === 0) return;   // GM run with no targets = listener-only

    const caster = canvas.tokens.controlled.find(t => t.actor?.isOwner)?.actor ?? game.user.character;
    if (!caster) {
        ui.notifications.error("Taunt: select your guardian's token (or assign yourself a character) first.");
        return;
    }
    const casterSig = caster.signature ?? caster.id;
    const casterUuid = caster.uuid;
    const casterToken = canvas.tokens.controlled.find(t => t.actor === caster)?.document
        ?? caster.getActiveTokens(true, true)[0] ?? null;
    const tauntAction = caster.itemTypes.action.find(a => a.slug === "taunt");
    // An effect is this guardian's Taunt if its context origin (or the legacy flag) points at the guardian.
    const isOwnTaunt = (e) => e.slug === "effect-taunt" &&
        (e.system.context?.origin?.actor === casterUuid || e.flags?.pf2e?.origin?.signature === casterSig);
    const hasGroupTaunt = caster.itemTypes.feat.some(f => f.slug === GROUP_TAUNT_SLUG);
    const MAX_TARGETS = hasGroupTaunt ? 3 : 1;

    const targets = Array.from(game.user.targets).filter(t => t.actor?.uuid !== casterUuid);
    if (targets.length === 0) {
        ui.notifications.warn(`Taunt: no targets. Press T on up to ${MAX_TARGETS} ${MAX_TARGETS === 1 ? "enemy" : "enemies"} before running.`);
        return;
    }
    if (targets.length > MAX_TARGETS) {
        const why = hasGroupTaunt ? "Group Taunt limit" : "no Group Taunt";
        ui.notifications.warn(`Taunt: ${targets.length} targeted, capping at ${MAX_TARGETS} (${why}).`);
    }
    const applyTo = targets.slice(0, MAX_TARGETS);

    const effectItem = await fromUuid(TAUNT_UUID);
    if (!effectItem) {
        ui.notifications.error(`Taunt: Effect: Taunt not found at ${TAUNT_UUID}.`);
        return;
    }

    // ---------- Optional: clear this guardian's existing Taunts on other tokens ----------
    if (CLEAR_OLD) {
        const targetUuids = new Set(applyTo.map(t => t.actor?.uuid).filter(Boolean));
        for (const token of canvas.tokens.placeables) {
            if (!token.actor) continue;
            if (targetUuids.has(token.actor.uuid)) continue;   // keep on new targets; overwrite below
            const stale = token.actor.itemTypes.effect.filter(isOwnTaunt);
            if (stale.length > 0) {
                await token.actor.deleteEmbeddedDocuments("Item", stale.map(e => e.id));
            }
        }
    }

    // ---------- Apply Effect: Taunt to each target ----------
    let appliedCount = 0;
    for (const target of applyTo) {
        if (!target.actor) continue;

        // Remove any prior Taunt from this guardian on this token (avoid stacking duplicates)
        const prior = target.actor.itemTypes.effect.filter(isOwnTaunt);
        if (prior.length > 0) {
            await target.actor.deleteEmbeddedDocuments("Item", prior.map(e => e.id));
        }

        // Clone the compendium effect and force origin + DC-penalty state.
        // PF2e reads an effect's origin from system.context.origin — that's what
        // `{item|origin.signature}` resolves through. With no context, the origin
        // falls back to the effect's own actor (the taunted enemy), so the −1
        // lands on attacks against everyone except that enemy, including the guardian.
        const effectData = effectItem.toObject();
        effectData._stats = { ...effectData._stats, compendiumSource: TAUNT_UUID };
        effectData.system.context = {
            origin: {
                actor: casterUuid,
                token: casterToken?.uuid ?? null,
                item: tauntAction?.uuid ?? null,
                spellcasting: null,
                rollOptions: [
                    ...caster.getSelfRollOptions("origin"),
                    ...(tauntAction?.getRollOptions("origin:item") ?? []),
                ],
            },
            target: { actor: target.actor.uuid, token: target.document.uuid },
            roll: null,
        };
        // Legacy flag, kept so effects applied by older versions of this macro still get cleared.
        effectData.flags = effectData.flags ?? {};
        effectData.flags.pf2e = effectData.flags.pf2e ?? {};
        effectData.flags.pf2e.origin = { actor: casterUuid, item: null, signature: casterSig };

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
    const clearNote = CLEAR_OLD ? `; prior ${caster.name} Taunts cleared` : "";
    ui.notifications.info(
        `Taunt: applied to ${appliedCount} target(s), origin locked to ${caster.name}${dcNote}${clearNote}.`
    );

    // ---------- Chat card: the sheet's own Taunt card, plus who got taunted ----------
    if (appliedCount === 0) return;
    const taunted = applyTo.filter(t => t.actor).map(t => t.name).join(", ");
    const result = `
        <hr>
        <p>${effectItem.toAnchor().outerHTML} → <strong>${taunted}</strong></p>
        <p style="font-size:0.9em; opacity:0.8"><em>Origin: ${caster.name}${FORCE_DC_PENALTY ? " · DC penalty ON" : ""}</em></p>`;

    if (tauntAction) {
        const card = (await tauntAction.toMessage(null, { create: false })).toObject();
        const close = card.content.lastIndexOf("</div>");
        card.content = card.content.slice(0, close) + result + card.content.slice(close);
        await ChatMessage.create(card);
    } else {
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: caster }),
            content: `<h3>Taunt</h3>${result}`,
        });
    }
})();
