/**
 * Reactions — private chat prompts when a reaction's trigger happens
 * ==================================================================
 *
 * WHY: Reactions get missed because the trigger scrolls past in chat. This
 * watches the game and, when something matches a reaction your character has,
 * whispers you a chat prompt with Use / Dismiss buttons. Use does the reaction.
 *
 * PLAYER-ONLY: runs in your browser and only touches characters you own. The
 * GM doesn't need to run anything. A newer prompt for the same reaction
 * replaces an older unanswered one.
 *
 * REACTIONS:
 *   - Bounce Away (Pearl Dragonet)
 *     Trigger: a melee Strike's damage card targeting you includes bludgeoning.
 *     Skipped while "Bounce Away (Used)" is on you.
 *     Use → posts its card, adds "Bounce Away (Used)" (10 minutes), and turns on
 *     the "bounce-away" toggle (resistance = level to bludgeoning). The toggle
 *     turns itself off once your HP changes, or at the next turn.
 *     Apply the damage AFTER clicking Use.
 *   - Absorb Magic (Living Nexus)
 *     Trigger (simplified): any other creature casts a spell. Range is on you.
 *     Skipped while you're overflowing.
 *     Use → posts its card and applies Effect: Overflowing (1 minute).
 *   - Ferocious Will (Dragonet)
 *     Trigger: you succeed (or critically succeed) at a save against a magical
 *     mental effect — rolled from a Toolbelt save button or a normal save card.
 *     Skipped while "Ferocious Will (Used)" is on you.
 *     Use → posts its card (roll the damage from it) and adds
 *     "Ferocious Will (Used)" (1 hour).
 *   - Wooden Double (spell)
 *     Trigger: an attack roll critically hits you.
 *     Skipped when you have no spell slot (or innate use) left to cast it.
 *     Use → casts it from its spellcasting entry, spending the slot.
 *   - Spell Riposte (spell)
 *     Trigger: another creature's spell card lists you as a target, and the
 *     spell has no area (area spells can't be riposted). A spell attack cast
 *     with no target is caught on its attack roll card instead (once per cast).
 *     Skipped when you have no slot left. The prompt shows your counteract
 *     chance: counteract modifier (spellcasting attribute + proficiency, no item
 *     bonus) vs the caster's spell DC, with the rank rule applied.
 *     Use → casts it (spending the slot) and rolls the counteract check.
 *   - Drop Dead (spell, on yourself)
 *     Trigger: your HP drops below 30% of max (still above 0) and an enemy
 *     attack hit you this turn (or in the last minute outside combat).
 *     Skipped when you have no slot left.
 *     Use → casts it (spending the slot) and adds a "Drop Dead" effect
 *     (1 minute, grants Invisible). At rank 5 it ends if you use a hostile action.
 *   - Foretell Harm (Oracle) — a reminder, not a reaction
 *     Trigger: your own non-cantrip spell rolls damage (once per cast).
 *     The prompt updates live as Toolbelt saves come in: each target shows
 *     "took damage", "critically saved — no damage", or "save not rolled yet",
 *     and the header reads waiting / damage dealt / requirement not met
 *     (RAW the spell must have dealt damage to someone).
 *     Use → targets the creatures on that damage card and runs the
 *     "Foretell Harm" macro.
 *   - Prevailing Position (Monk)
 *     Trigger, narrowed: an attack CRITICALLY hits you while you're in a stance,
 *     and the +4 would knock it down to a hit or miss. Leaving the stance drops
 *     its circumstance bonus to AC, and circumstance bonuses don't stack, so the
 *     new AC is: card AC − best circumstance bonus + max(4, best non-stance
 *     circumstance bonus). Natural 20/1 are accounted for.
 *     Use → posts its card and removes your stance effects.
 *   - Rippling Spin (Monk)
 *     Trigger: a physical melee attack hits you while in Reflective Ripple
 *     Stance (fused counts) — except crits that Prevailing Position would fix.
 *     Use → posts its card; do the Step and Trip/Disarm yourself.
 *   - Ascended Celestial reroll (destiny)
 *     Trigger: you fail or critically fail a Will save.
 *     Skipped while "Ascended Celestial Reroll (Used)" is on you.
 *     Use → posts the dedication card and adds the (Used) effect for 1 hour.
 *   - That's My Number (Lucky Number)
 *     Trigger: your d20 shows your lucky number (the badge on Spell Effect:
 *     Lucky Number) on a non-secret attack roll, save, or skill check — and
 *     the roll failed or critically failed. Saves from Toolbelt buttons count.
 *     Skipped when there's no active Lucky Number.
 *     Use → posts its card, ends Spell Effect: Lucky Number, and adds
 *     "Lucky Number Immunity" (delete it at your next daily preparations).
 *     Reroll yourself — the same number again is a critical failure.
 *   - Eat Fire (cantrip)
 *     Trigger: a damage card aimed at you includes fire. Skipped if Eat Fire's
 *     resistance wouldn't beat the fire resistance you already have, while
 *     Spell Effect: Eat Fire is up, or while cursebound with Curse of Engulfing
 *     Flames (it suppresses fire resistance).
 *     Use → casts it and applies Spell Effect: Eat Fire. When the turn moves on,
 *     the resistance is stripped (RAW: this turn only) and the effect stays as
 *     "Spell Effect: Eat Fire (Belch Smoke)" for Foundry's duration.
 *   - Reactive Strike (fighter and others)
 *     Trigger, while a combat is running: an enemy leaves any square within your
 *     reach while moving (every square along its path is checked), or posts a
 *     manipulate spell/action or a ranged attack from within your reach. Reach
 *     comes from your ready Strikes. One prompt per move or per card — it doesn't
 *     track whether you've already reacted this round. Elevation isn't considered.
 *     Use → posts its card; make the Strike yourself.
 *   - Ankle Bite (goblin)
 *     Trigger: a foe's Grapple check against you succeeds (grabbed) or
 *     critically succeeds (restrained). Monster Grab abilities that grab on a
 *     hit without a Grapple check don't prompt.
 *     Use → posts its card and rolls your Jaws Strike at no MAP (target the
 *     grabber first).
 *
 * USAGE:
 *   Run once per session (and again after reloading the tab). Re-running
 *   replaces the listener, so it never stacks. Prompt buttons only work while
 *   the listener is running.
 *
 * WITHOUT PF2E TOOLBELT (nothing errors; some triggers see less):
 *   - Save spells and area damage don't list targets on their cards, so these
 *     only work off attacks/Strikes: Eat Fire, Spell Riposte (spell attacks only),
 *     and Foretell Harm's target list and save tracking (the prompt says so).
 *   - Everything else uses PF2e's own card data, token movement, or
 *     HP, and works the same.
 *
 * ONE MACRO, MANY CHARACTERS:
 *   - A reaction only runs for a character whose sheet has that feat/action/spell
 *     (matched by slug), so each table only prompts what that character has.
 *   - Each reaction is isolated: if one throws on some character, it's logged to
 *     the console and the rest keep working.
 *
 * NOTES:
 *   - Only sees what your browser receives — blind/private GM rolls won't prompt.
 *   - Watches your own characters (any character you own). As GM it only
 *     watches the tokens you have selected.
 *   - Cooldowns are visible effects on your character. Delete one to make the
 *     reaction available again.
 */

(() => {
    const VERSION = 16;   // bump on every change, so the "listening" notice shows which code is running
    // Hotbar icon: set once, only while this macro still has Foundry's default icon (a custom icon is kept).
    if (this?.update && (!this.img || this.img === (this.constructor?.DEFAULT_ICON ?? "icons/svg/dice-target.svg"))) this.update({ img: "icons/magic/defensive/shield-barrier-glowing-blue.webp" }).catch(() => {});
    const PROMPT_FLAG = "reactionPrompt";

    const state = (globalThis.__reactions ??= { hookIds: [] });
    for (const [event, id] of state.hookIds) Hooks.off(event, id);
    if (state.clickHandler) document.removeEventListener("click", state.clickHandler, true);
    state.hookIds = [];
    const on = (event, fn) => state.hookIds.push([event, Hooks.on(event, fn)]);

    const myCharacters = () => game.user.isGM
        ? canvas.tokens.controlled.map(t => t.actor).filter(Boolean)
        : game.actors.filter(a => a.type === "character" && a.isOwner);
    const isMine = (actor) => !!actor && myCharacters().some(a => a.uuid === actor.uuid);

    const resolveActor = (uuid) => {
        const doc = uuid ? fromUuidSync(uuid, { strict: false }) : null;
        return doc?.actor ?? doc ?? null;
    };

    // ================= Trigger helpers =================
    // Who a card is aimed at: PF2e's target, else Toolbelt's target list.
    const cardTargets = (message) => {
        const ctxTarget = message.flags?.pf2e?.context?.target;
        const uuids = ctxTarget ? [ctxTarget.token ?? ctxTarget.actor]
            : (message.flags?.["pf2e-toolbelt"]?.targetHelper?.targets ?? []);
        return uuids.map(resolveActor).filter(Boolean);
    };
    const targets = (message, actor) => cardTargets(message).some(a => a.uuid === actor.uuid);
    const damageTypes = (message) => new Set(message.rolls.flatMap(r => r.instances?.map(i => i.type) ?? []));
    const sourceName = (message) =>
        `<strong>${message.speaker?.alias ?? "An enemy"}</strong>'s ${message.item?.name ?? "attack"}`;

    const MAGIC_TRAITS = ["magical", "arcane", "divine", "occult", "primal"];
    // Traits of the effect a save was against: the item on the card, else the roll options.
    const effectTraits = (item, options = []) => {
        const traits = new Set(item?.system?.traits?.value ?? []);
        if (item?.type === "spell") traits.add("magical");
        for (const o of options) {
            const m = /(?:^|:)item:trait:([a-z-]+)$/.exec(o);
            if (m) traits.add(m[1]);
        }
        return traits;
    };
    const isMagicalMental = (traits) => traits.has("mental") && MAGIC_TRAITS.some(t => traits.has(t));
    const SUCCESS = ["success", "criticalSuccess"];
    const FAILURE = ["failure", "criticalFailure"];
    const DEGREES = ["critical failure", "failure", "success", "critical success"];

    // PF2e degree of success, with natural 20/1 shifting one step.
    const degreeOf = (total, dc, die) => {
        let degree = total >= dc + 10 ? 3 : total >= dc ? 2 : total > dc - 10 ? 1 : 0;
        if (die === 20) degree = Math.min(3, degree + 1);
        if (die === 1) degree = Math.max(0, degree - 1);
        return degree;
    };
    const d20Of = (message) => message.rolls[0]?.dice?.find(d => d.faces === 20)?.total;

    // True the first time a key is seen within the window — one prompt per cast/attack.
    const firstTime = (key, ms = 60_000) => {
        const seen = (state.seen ??= new Map());
        if (Date.now() - (seen.get(key) ?? 0) < ms) return false;
        seen.set(key, Date.now());
        return true;
    };

    // Strike cards aimed at this actor by someone else.
    const incomingAttack = (message, actor) => {
        const ctx = message?.flags?.pf2e?.context;
        if (!["attack-roll", "spell-attack-roll"].includes(ctx?.type)) return null;
        if (isMine(message.actor) || !targets(message, actor)) return null;
        return ctx;
    };
    const isMeleeStrike = (message) =>
        message.item?.isMelee ?? (message.flags?.pf2e?.context?.options ?? []).includes("item:melee");
    const PHYSICAL = ["bludgeoning", "piercing", "slashing"];
    const isPhysical = (message) => {
        const rolls = Object.values(message.item?.system?.damageRolls ?? message.item?.system?.damage?.instances ?? {});
        const types = rolls.map(r => r.damageType ?? r.type).filter(Boolean);
        return types.length === 0 || types.some(t => PHYSICAL.includes(t));   // unknown → assume physical
    };

    // Lucky Number: Foundry stores the rolled number as the spell effect's badge value.
    const luckyNumber = (actor) => {
        const effect = actor.itemTypes.effect.find(e => e.slug === "spell-effect-lucky-number");
        const value = Number(effect?.system?.badge?.value);
        return Number.isInteger(value) && value > 0 ? value : null;
    };

    // Grid geometry for reach checks. A token's footprint is the set of grid squares it covers.
    const footprint = ({ x, y, width = 1, height = 1 }) => {
        const { i, j } = canvas.grid.getOffset({ x: x + 1, y: y + 1 });
        const squares = [];
        for (let di = 0; di < Math.max(1, Math.round(height)); di++)
            for (let dj = 0; dj < Math.max(1, Math.round(width)); dj++) squares.push({ i: i + di, j: j + dj });
        return squares;
    };
    // Is any square of `a` within `reach` feet of any square of `b`? Reach 5/10 use PF2e's square counting
    // (10-ft reach covers two squares diagonally); longer reach measures the path.
    const withinReach = (a, b, reach) => {
        const perSquare = canvas.dimensions.distance;
        for (const p of footprint(a)) for (const q of footprint(b)) {
            const squares = Math.max(Math.abs(p.i - q.i), Math.abs(p.j - q.j));
            const feet = reach <= 10 ? squares * perSquare
                : canvas.grid.measurePath([canvas.grid.getCenterPoint(p), canvas.grid.getCenterPoint(q)]).distance;
            if (feet <= reach) return true;
        }
        return false;
    };
    // Every square a moving token LEFT: each square along each straight segment of its path, except where it ended.
    const squaresLeft = (movement, size) => {
        const points = [movement.origin, ...movement.passed.waypoints];
        const left = [];
        for (let k = 0; k < points.length - 1; k++) {
            const path = canvas.grid.getDirectPath([
                { x: points[k].x + 1, y: points[k].y + 1 },
                { x: points[k + 1].x + 1, y: points[k + 1].y + 1 },
            ]);
            for (const offset of path.slice(0, -1)) left.push({ ...size, ...canvas.grid.getTopLeftPoint(offset) });
        }
        return left;
    };
    const tokenOnScene = (actor, scene) => actor.getActiveTokens(true, true).find(t => t.parent?.id === scene?.id) ?? null;
    const reachOf = (actor) => actor.getReach?.({ action: "attack" }) ?? 5;

    // Stances are effects whose slug starts with "stance-".
    const stances = (actor) => actor.itemTypes.effect.filter(e => (e.slug ?? "").startsWith("stance-"));

    // Prevailing Position math: leaving the stance drops its circumstance bonus to AC, and circumstance
    // bonuses don't stack — the +4 replaces the best one, unless a non-stance one (cover) is already higher.
    const prevailingPosition = (message, actor) => {
        const ctx = message.flags.pf2e.context;
        const ac = ctx.dc?.value, total = message.rolls[0]?.total, die = d20Of(message);
        if (typeof ac !== "number" || typeof total !== "number") return null;
        const circ = (actor.armorClass?.modifiers ?? [])
            .filter(m => m.enabled && !m.ignored && m.type === "circumstance" && m.modifier > 0);
        const fromStance = (m) => (m.rule?.item?.slug ?? "").startsWith("stance-");
        const best = (list) => Math.max(0, ...list.map(m => m.modifier));
        const current = best(circ);
        const after = Math.max(4, best(circ.filter(m => !fromStance(m))));
        const newAc = ac - current + after;
        return { ac, newAc, total, before: degreeOf(total, ac, die), after: degreeOf(total, newAc, die) };
    };

    // Run `fn` once, at the first of: the combat turn changes, or (optionally) the actor's HP changes.
    const onceAfter = ({ actor = null, hp = false }, fn) => {
        const done = () => {
            Hooks.off("updateActor", hpHook);
            Hooks.off("updateCombat", turnHook);
            fn();
        };
        const hpHook = Hooks.on("updateActor", (updated, changes) => {
            if (hp && updated.uuid === actor?.uuid && foundry.utils.hasProperty(changes, "system.attributes.hp.value")) done();
        });
        const turnHook = Hooks.on("updateCombat", (combat, changes) => {
            if ("turn" in changes || "round" in changes) done();
        });
    };

    // ================= Effects & resources =================
    const hasEffect = (actor, slug) => actor.itemTypes.effect.some(e => e.slug === slug);
    const startCooldown = (actor, item, minutes, label = item.name) => actor.createEmbeddedDocuments("Item", [{
        type: "effect",
        name: `${label} (Used)`,
        img: item.img,
        system: {
            slug: `${item.slug}-cooldown`,
            level: { value: 1 },
            duration: { value: minutes, unit: "minutes", expiry: "turn-start", sustained: false },
            tokenIcon: { show: true },
            description: { value: `<p>${item.name} was used. Available again when this ends. Delete this effect to reset it.</p>` },
            rules: [],
        },
    }]);
    // Apply a compendium self-effect to the actor, with the actor as its origin.
    const applySelfEffect = async (actor, item, uuid) => {
        const source = await fromUuid(uuid);
        if (!source) return;
        const data = source.toObject();
        data.system.context = {
            origin: { actor: actor.uuid, token: actor.getActiveTokens(true, true)[0]?.uuid ?? null, item: item.uuid, spellcasting: null, rollOptions: [] },
            target: null,
            roll: null,
        };
        await actor.createEmbeddedDocuments("Item", [data]);
    };
    // Can this spell still be cast from its entry (slot, prepared copy, or innate use)?
    const spellAvailable = (actor, spell) => {
        const entry = actor.spellcasting?.get(spell.system.location.value);
        if (!entry) return false;
        if (spell.isCantrip || spell.atWill) return true;
        if (entry.isInnate) return (spell.system.location.uses?.value ?? 0) > 0;
        const slot = entry.system.slots?.[`slot${spell.rank}`];
        if (!slot) return false;
        if (entry.isPrepared && !entry.isFlexible) return slot.prepared.some(p => p.id === spell.id && !p.expended);
        return slot.value > 0;
    };

    // Counteract odds (Remaster): d20 + counteract modifier vs the caster's DC, natural 20/1 shift the degree.
    // Crit success counteracts up to +3 ranks, success up to +1, failure only lower ranks.
    const counteractChance = (modifier, dc, myRank, theirRank) => {
        let hits = 0;
        for (let die = 1; die <= 20; die++) {
            const total = die + modifier;
            let degree = total >= dc + 10 ? 3 : total >= dc ? 2 : total > dc - 10 ? 1 : 0;
            if (die === 20) degree = Math.min(3, degree + 1);
            if (die === 1) degree = Math.max(0, degree - 1);
            const ok = degree === 3 ? theirRank <= myRank + 3
                : degree === 2 ? theirRank <= myRank + 1
                : degree === 1 ? theirRank < myRank
                : false;
            if (ok) hits++;
        }
        return hits * 5;
    };
    const castSpell = async (actor, spell) => {
        const entry = actor.spellcasting.get(spell.system.location.value);
        await entry.cast(spell, { rank: spell.rank });
    };

    // Enemy attacks that hit your characters, so an HP drop can be traced back to one.
    const recentAttacks = (state.recentAttacks = new Map());   // actorUuid → { combatId, round, turn, at }
    const noteAttack = (actor) => recentAttacks.set(actor.uuid, {
        combatId: game.combat?.id ?? null, round: game.combat?.round ?? null, turn: game.combat?.turn ?? null, at: Date.now(),
    });
    const attackedJustNow = (actor) => {
        const a = recentAttacks.get(actor.uuid);
        if (!a) return false;
        if (game.combat?.started && a.combatId === game.combat.id) return a.round === game.combat.round && a.turn === game.combat.turn;
        return Date.now() - a.at < 60_000;
    };
    const DROP_DEAD_THRESHOLD = 0.30;
    const hpCache = (state.hpCache = new Map());

    // ================= Reaction definitions =================
    // matches(event, actor, item) receives one of: { message } (chat card), { save } (Toolbelt save roll),
    // { hpDrop }, or { move } (token movement).
    const REACTIONS = [
        {
            slug: "bounce-away",
            name: "Bounce Away",
            blocked: (actor) => hasEffect(actor, "bounce-away-cooldown"),
            // Trigger: a melee Strike hits you and deals bludgeoning damage.
            matches({ message }, actor) {
                const ctx = message?.flags?.pf2e?.context;
                if (ctx?.type !== "damage-roll" || ctx.sourceType !== "attack") return false;
                const melee = message.item?.isMelee ?? (ctx.options ?? []).includes("item:melee");
                return melee && targets(message, actor) && damageTypes(message).has("bludgeoning");
            },
            describe({ message }, actor) {
                return `<p>${sourceName(message)} hits <strong>${actor.name}</strong> with bludgeoning damage. ` +
                    `<strong>Bounce Away</strong>: resistance ${actor.level} to bludgeoning from this Strike, ` +
                    `then Stride or Fly half your Speed. <em>Apply the damage after clicking Use.</em></p>`;
            },
            async use(actor, item) {
                await item.toMessage(null);
                await startCooldown(actor, item, 10);
                await actor.toggleRollOption("all", "bounce-away", item.id, true);
                // The resistance is only for the triggering Strike: off once the damage lands or the turn moves on.
                onceAfter({ actor, hp: true }, async () => {
                    if (actor.rollOptions.all?.["bounce-away"]) {
                        await actor.toggleRollOption("all", "bounce-away", item.id, false);
                    }
                });
            },
        },
        {
            slug: "absorb-magic",
            name: "Absorb Magic",
            // Requirement: you are not overflowing.
            blocked: (actor) => hasEffect(actor, "effect-overflowing"),
            // Simplified trigger: another creature — ally or enemy — casts a spell.
            matches({ message }, actor) {
                if (message?.flags?.pf2e?.context?.type !== "spell-cast") return false;
                const caster = message.actor;
                return !!caster && caster.uuid !== actor.uuid;
            },
            describe({ message }, actor) {
                return `<p><strong>${message.actor?.name ?? "A creature"}</strong> casts ` +
                    `<strong>${message.item?.name ?? "a spell"}</strong>. <strong>Absorb Magic</strong>: become ` +
                    `overflowing — +${actor.level >= 15 ? 2 : 1} status to saves vs magic for 1 minute.</p>`;
            },
            async use(actor, item) {
                await item.toMessage(null);
                await applySelfEffect(actor, item, item.system.selfEffect?.uuid ?? "Compendium.pf2e.feat-effects.Item.SGM1wyBdYyv9bZBT");
            },
        },
        {
            slug: "ferocious-will",
            name: "Ferocious Will",
            blocked: (actor) => hasEffect(actor, "ferocious-will-cooldown"),
            // Trigger: you succeed at a saving throw against a magical mental effect.
            matches({ message, save }, actor) {
                if (save) {
                    return save.actor?.uuid === actor.uuid && SUCCESS.includes(save.success)
                        && isMagicalMental(effectTraits(save.item));
                }
                const ctx = message?.flags?.pf2e?.context;
                if (ctx?.type !== "saving-throw" || message.actor?.uuid !== actor.uuid) return false;
                const origin = message.flags?.pf2e?.origin;
                const item = origin?.uuid ? fromUuidSync(origin.uuid, { strict: false }) : null;
                return SUCCESS.includes(ctx.outcome)
                    && isMagicalMental(effectTraits(item, [...(ctx.options ?? []), ...(origin?.rollOptions ?? [])]));
            },
            describe({ message, save }, actor) {
                const source = save
                    ? save.sourceName
                    : resolveActor(message?.flags?.pf2e?.origin?.actor)?.name ?? null;
                const effect = save?.item?.name ?? message?.item?.name ?? "a mental effect";
                const dice = Math.ceil(actor.level / 2);   // same as the feat's @Damage[ceil(@actor.level/2)d6]
                return `<p><strong>${actor.name}</strong> saved against <strong>${effect}</strong>` +
                    `${source ? ` from <strong>${source}</strong>` : ""}. <strong>Ferocious Will</strong>: ` +
                    `${dice}d6 mental back at the source (basic Will).</p>`;
            },
            async use(actor, item) {
                await item.toMessage(null);
                await startCooldown(actor, item, 60);
            },
        },
        {
            slug: "wooden-double",
            name: "Wooden Double",
            // Only prompt while there's a slot (or use) left to cast it.
            blocked: (actor, item) => !spellAvailable(actor, item),
            // Trigger: you're critically hit by a Strike or damage-dealing attack.
            matches({ message }, actor) {
                const ctx = message?.flags?.pf2e?.context;
                if (!["attack-roll", "spell-attack-roll"].includes(ctx?.type)) return false;
                return ctx.outcome === "criticalSuccess" && targets(message, actor);
            },
            describe({ message }, actor) {
                return `<p>${sourceName(message)} <strong>critically hits</strong> ${actor.name}. ` +
                    `<strong>Wooden Double</strong>: Step away and a wooden block takes the blow.</p>`;
            },
            async use(actor, item) {
                await castSpell(actor, item);
            },
        },
        {
            slug: "spell-riposte",
            name: "Spell Riposte",
            blocked: (actor, item) => !spellAvailable(actor, item),
            // Trigger: you're the target of a spell. Area spells can't be riposted.
            // Checked on the spell card; for spell attacks cast without a target, on the attack roll card.
            matches({ message }, actor) {
                const type = message?.flags?.pf2e?.context?.type;
                const isCast = type === "spell-cast";
                const isSpellAttack = ["attack-roll", "spell-attack-roll"].includes(type)
                    && message.flags?.pf2e?.origin?.type === "spell";
                if (!isCast && !isSpellAttack) return false;
                const spell = message.item;
                if (!spell || spell.system.area || message.actor?.uuid === actor.uuid) return false;
                // Must actually target something (walls and similar have neither area nor target).
                if (!spell.system.target?.value && !spell.traits.has("attack")) return false;
                if (!targets(message, actor)) return false;
                // One prompt per cast: the attack card of a spell already prompted from its cast card is skipped.
                const key = `${message.flags?.pf2e?.origin?.uuid}|${actor.uuid}`;
                const seen = (state.ripostePrompted ??= new Map());
                if (Date.now() - (seen.get(key) ?? 0) < 60_000) return false;
                seen.set(key, Date.now());
                return true;
            },
            describe({ message }, actor, item) {
                const spell = message.item;
                const theirRank = message.flags?.pf2e?.origin?.castRank ?? spell.rank;
                const dc = spell.spellcasting?.statistic?.dc?.value
                    ?? Object.values(message.flags?.["pf2e-toolbelt"]?.targetHelper?.saveVariants ?? {})[0]?.dc;
                const entry = actor.spellcasting.get(item.system.location.value);
                const modifier = entry?.counteraction?.check?.mod;
                const needs = theirRank < item.rank ? "counteracts even on a failure"
                    : theirRank <= item.rank + 1 ? "needs a success"
                    : theirRank <= item.rank + 3 ? "needs a critical success"
                    : "can't be counteracted";
                const odds = (typeof dc === "number" && typeof modifier === "number")
                    ? ` <strong>${counteractChance(modifier, dc, item.rank, theirRank)}%</strong> to counteract ` +
                      `(+${modifier} vs DC ${dc}; rank ${theirRank} vs your rank ${item.rank} — ${needs}).`
                    : ` Rank ${theirRank} vs your rank ${item.rank} — ${needs}.`;
                return `<p><strong>${message.actor?.name ?? "A creature"}</strong> targets <strong>${actor.name}</strong> ` +
                    `with <strong>${spell.name}</strong>. <strong>Spell Riposte</strong>: on a counteract, it hits the caster instead.${odds}</p>`;
            },
            async use(actor, item) {
                await castSpell(actor, item);
                await item.rollCounteract?.();
            },
        },
        {
            slug: "foretell-harm",
            name: "Foretell Harm",
            // Your own damaging non-cantrip spell just rolled damage.
            matches({ message }, actor) {
                const ctx = message?.flags?.pf2e?.context;
                if (ctx?.type !== "damage-roll" || message.author?.id !== game.user.id) return false;
                if (message.actor?.uuid !== actor.uuid || message.flags?.pf2e?.origin?.type !== "spell") return false;
                const spell = message.item;
                if (!spell || spell.isCantrip) return false;
                return firstTime(`foretell|${message.flags.pf2e.origin.uuid}`);
            },
            extra({ message }) {
                const ctxTarget = message.flags?.pf2e?.context?.target?.token;
                const uuids = message.flags?.["pf2e-toolbelt"]?.targetHelper?.targets ?? (ctxTarget ? [ctxTarget] : []);
                return { tokenUuids: uuids };
            },
            // Re-rendered whenever the damage card changes, so save results show up as they're rolled.
            live: true,
            describe({ message }, actor, item) {
                const { tokenUuids } = this.extra({ message });
                const rank = message.flags?.pf2e?.origin?.castRank ?? message.item?.rank;
                const variants = Object.values(message.flags?.["pf2e-toolbelt"]?.targetHelper?.saveVariants ?? {});
                const hasSave = variants.length > 0;
                const saveFor = (tokenId) => variants.map(v => v.saves?.[tokenId]).find(Boolean);

                // Per target: crit success on the save = no damage; any other result = damaged; no result yet = waiting.
                // Spells without a save only roll damage on a hit, so every target on the card was damaged.
                const rows = tokenUuids.map(uuid => {
                    const token = fromUuidSync(uuid, { strict: false });
                    const save = hasSave ? saveFor(uuid.split(".").pop()) : null;
                    const status = !hasSave ? "damaged"
                        : !save ? "waiting"
                        : save.success === "criticalSuccess" ? "noDamage" : "damaged";
                    return { name: token?.name ?? "?", status, save };
                });
                const LABEL = {
                    damaged: (r) => r.save ? `took damage (${DEGREES[["criticalFailure", "failure", "success", "criticalSuccess"].indexOf(r.save.success)]})` : "took damage",
                    noDamage: () => "critically saved — no damage",
                    waiting: () => "save not rolled yet",
                };
                const anyDamaged = rows.some(r => r.status === "damaged");
                const anyWaiting = rows.some(r => r.status === "waiting");
                const toolbelt = !!game.modules.get("pf2e-toolbelt")?.active;
                const header = !toolbelt && !hasSave && !message.flags?.pf2e?.context?.target
                    ? `<p style="opacity:0.8"><strong>Save results aren't tracked at this table (no PF2e Toolbelt) — check who took damage.</strong></p>`
                    : anyDamaged
                    ? `<p style="color:#2e7d32"><strong>✓ Damage dealt — Foretell Harm is available.</strong></p>`
                    : anyWaiting || rows.length === 0
                        ? `<p style="color:#8a6d00"><strong>⏳ Waiting to see if any damage is dealt…</strong></p>`
                        : `<p style="color:#b33"><strong>✗ No damage dealt — Foretell Harm's requirement isn't met.</strong></p>`;
                const list = rows.length
                    ? `<ul style="margin:2px 0 0 1em; padding:0">${rows.map(r => `<li><strong>${r.name}</strong>: ${LABEL[r.status](r)}</li>`).join("")}</ul>`
                    : `<p><em>No targets on the damage card — it will use your current targets.</em></p>`;
                return `${header}<p><strong>${message.item?.name}</strong> (rank ${rank}) → <strong>Foretell Harm</strong> ` +
                    `(free action, cursebound): ${rank * 2} damage at the start of each target's turn.</p>${list}` +
                    (rows.some(r => r.status === "noDamage")
                        ? `<p style="font-size:0.9em; opacity:0.8"><em>Crit-savers are still targets of the spell RAW — GM's call.</em></p>` : "");
            },
            async use(actor, item, extra) {
                const ids = (extra?.tokenUuids ?? []).map(u => u.split(".").pop()).filter(id => canvas.tokens.get(id));
                if (ids.length) canvas.tokens.setTargets(ids);
                const macro = game.macros.getName("Foretell Harm");
                if (macro) await macro.execute();
                else ui.notifications.error("Reactions: no macro named \"Foretell Harm\" found.");
            },
        },
        {
            slug: "prevailing-position",
            name: "Prevailing Position",
            // Requirement: you're in a stance.
            blocked: (actor) => stances(actor).length === 0,
            // Narrowed on purpose: only a critical hit that the +4 would knock down to a hit or miss.
            matches({ message }, actor) {
                const ctx = incomingAttack(message, actor);
                if (ctx?.outcome !== "criticalSuccess") return false;
                const pp = prevailingPosition(message, actor);
                return !!pp && pp.after < 3;
            },
            describe({ message }, actor) {
                const pp = prevailingPosition(message, actor);
                return `<p>${sourceName(message)} <strong>critically hits</strong> ${actor.name} (${pp.total} vs AC ${pp.ac}). ` +
                    `<strong>Prevailing Position</strong>: leave ${stances(actor).map(s => s.name.replace(/^Stance: /, "")).join(" + ")} ` +
                    `for AC ${pp.newAc} against it → <strong>${DEGREES[pp.after]}</strong>.</p>`;
            },
            async use(actor, item) {
                await item.toMessage(null);
                const left = stances(actor);
                if (left.length) await actor.deleteEmbeddedDocuments("Item", left.map(s => s.id));
            },
        },
        {
            slug: "rippling-spin",
            name: "Rippling Spin",
            // Requirement: you're in Reflective Ripple Stance (fused counts).
            blocked: (actor) => !stances(actor).some(s => s.slug.includes("reflective-ripple")),
            // Trigger: hit by a physical melee attack. Crits the +4 would fix go to Prevailing Position instead.
            matches({ message }, actor) {
                const ctx = incomingAttack(message, actor);
                if (!ctx || !SUCCESS.includes(ctx.outcome) || !isMeleeStrike(message) || !isPhysical(message)) return false;
                if (ctx.outcome === "criticalSuccess") {
                    const pp = prevailingPosition(message, actor);
                    const ppAvailable = !!findItem(actor, "prevailing-position");
                    if (ppAvailable && pp && pp.after < 3) return false;
                }
                return true;
            },
            describe({ message }, actor) {
                return `<p>${sourceName(message)} hits ${actor.name} in melee. <strong>Rippling Spin</strong>: after the attack, ` +
                    `Step (staying in its reach), then Trip or Disarm it.</p>`;
            },
            async use(actor, item) {
                await item.toMessage(null);
            },
        },
        {
            slug: "ascended-celestial-dedication",
            name: "Ascended Celestial Reroll",
            blocked: (actor) => hasEffect(actor, "ascended-celestial-dedication-cooldown"),
            // Once per hour: roll twice on a Will save — used here as a reroll after a failed Will save.
            matches({ message, save }, actor) {
                if (save) return save.actor?.uuid === actor.uuid && save.statistic === "will" && FAILURE.includes(save.success);
                const ctx = message?.flags?.pf2e?.context;
                return ctx?.type === "saving-throw" && message.actor?.uuid === actor.uuid
                    && (ctx.domains ?? []).includes("will") && FAILURE.includes(ctx.outcome);
            },
            describe({ message, save }, actor) {
                const effect = save?.item?.name ?? message?.item?.name ?? "a Will save";
                const outcome = (save?.success ?? message?.flags?.pf2e?.context?.outcome) === "criticalFailure" ? "critically failed" : "failed";
                return `<p><strong>${actor.name}</strong> ${outcome} a Will save against <strong>${effect}</strong>. ` +
                    `<strong>Ascended Celestial</strong> (1/hour): reroll it and keep the higher result.</p>`;
            },
            async use(actor, item) {
                await item.toMessage(null);
                await startCooldown(actor, item, 60, "Ascended Celestial Reroll");
            },
        },
        {
            slug: "thats-my-number",
            name: "That's My Number",
            // Needs an active Lucky Number (the effect's badge holds the number).
            blocked: (actor) => !luckyNumber(actor),
            // Trigger: your d20 shows your lucky number on a non-secret attack, save, or skill check —
            // narrowed to rolls that failed.
            matches({ message, save }, actor) {
                const number = luckyNumber(actor);
                if (save) {
                    return save.actor?.uuid === actor.uuid && save.die === number && FAILURE.includes(save.success);
                }
                const ctx = message?.flags?.pf2e?.context;
                if (!["attack-roll", "spell-attack-roll", "saving-throw", "skill-check"].includes(ctx?.type)) return false;
                if (message.actor?.uuid !== actor.uuid || message.blind) return false;
                return d20Of(message) === number && FAILURE.includes(ctx.outcome);
            },
            describe({ message, save }, actor) {
                const number = luckyNumber(actor);
                const what = save
                    ? `a ${save.statistic ?? ""} save against <strong>${save.item?.name ?? "an effect"}</strong>`
                    : `<strong>${message.flavor?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" (")[0] || "a check"}</strong>`;
                const outcome = (save?.success ?? message?.flags?.pf2e?.context?.outcome) === "criticalFailure" ? "critically failed" : "failed";
                return `<p><strong>${actor.name}</strong> rolled a natural <strong>${number}</strong> — the lucky number — on ${what} and ${outcome}. ` +
                    `<strong>That's My Number</strong>: reroll it. <em>If the reroll is ${number} again, it's a critical failure.</em></p>`;
            },
            async use(actor, item) {
                await item.toMessage(null);
                // The spell ends when the reaction is used, and you're immune until your next daily preparations.
                const spell = actor.itemTypes.effect.find(e => e.slug === "spell-effect-lucky-number");
                if (spell) await spell.delete();
                await actor.createEmbeddedDocuments("Item", [{
                    type: "effect",
                    name: "Lucky Number Immunity",
                    img: spell?.img ?? item.img,
                    system: {
                        slug: "lucky-number-immunity",
                        level: { value: 1 },
                        duration: { value: -1, unit: "unlimited", expiry: null, sustained: false },
                        tokenIcon: { show: false },
                        description: { value: "<p>Used That's My Number. Immune to Lucky Number until your next daily preparations — delete this effect then.</p>" },
                        rules: [],
                    },
                }]);
            },
        },
        {
            slug: "eat-fire",
            name: "Eat Fire",
            effectUuid: "Compendium.pf2e.spell-effects.Item.BGv44XBGtD4zOJBd",   // Spell Effect: Eat Fire
            resistance: (item) => 5 * Math.ceil(item.rank / 3),
            currentFire: (actor) => actor.system.attributes.resistances?.find(r => r.type === "fire")?.value ?? 0,
            // Trigger: you would take fire damage — any damage card aimed at you that includes fire.
            matches({ message }, actor, item) {
                const ctx = message?.flags?.pf2e?.context;
                if (ctx?.type !== "damage-roll" || !targets(message, actor)) return false;
                if (!damageTypes(message).has("fire")) return false;
                // Curse of Engulfing Flames: while cursebound, all fire resistance is suppressed.
                if (actor.hasCondition?.("cursebound") && actor.itemTypes.feat.some(f => f.slug === "curse-of-engulfing-flames")) return false;
                if (actor.itemTypes.effect.some(e => e.slug === "spell-effect-eat-fire")) return false;
                const spell = item ?? findItem(actor, "eat-fire");
                return this.resistance(spell) > this.currentFire(actor);   // no gain over what you already resist → no prompt
            },
            describe({ message }, actor, item) {
                const now = this.currentFire(actor), eat = this.resistance(item);
                return `<p>${sourceName(message)} deals fire damage to <strong>${actor.name}</strong>. ` +
                    `<strong>Eat Fire</strong>: fire resistance ${now} → <strong>${eat}</strong> until the end of this turn, ` +
                    `and Belch Smoke until the end of your next turn. <em>Apply the damage after clicking Use.</em></p>`;
            },
            async use(actor, item) {
                const entry = actor.spellcasting.get(item.system.location.value);
                if (entry) await entry.cast(item, {});
                else await item.toMessage(null);
                const source = await fromUuid(this.effectUuid);
                if (!source) return;
                const data = source.toObject();
                data.system.level.value = item.rank;
                data.system.context = {
                    origin: { actor: actor.uuid, token: actor.getActiveTokens(true, true)[0]?.uuid ?? null, item: item.uuid, spellcasting: null, rollOptions: [] },
                    target: null,
                    roll: null,
                };
                const [effect] = await actor.createEmbeddedDocuments("Item", [data]);
                // RAW the resistance only lasts this turn; the spell (Belch Smoke) lasts to the end of your next turn,
                // which is Foundry's duration. When the turn moves on, keep the effect but strip the resistance.
                onceAfter({}, async () => {
                    const live = actor.items.get(effect?.id);
                    if (live) await live.update({ name: "Spell Effect: Eat Fire (Belch Smoke)", "system.rules": [] });
                });
            },
        },
        {
            slug: "reactive-strike",
            name: "Reactive Strike",
            // Trigger: a creature within your reach uses a manipulate action or a move action, makes a ranged
            // attack, or leaves a square during a move action. Only while a combat is running.
            matches(event, actor) {
                const combat = game.combat;
                if (!combat?.started) return false;

                // Movement: any square the mover left (its origin, then each waypoint but the last) within reach.
                if (event.move) {
                    const { tokenDoc, movement } = event.move;
                    if (!tokenDoc.actor?.isEnemyOf?.(actor)) return false;
                    const mine = tokenOnScene(actor, tokenDoc.parent);
                    if (!mine) return false;
                    const size = { width: tokenDoc.width, height: tokenDoc.height };
                    if (!squaresLeft(movement, size).some(pos => withinReach(pos, mine, reachOf(actor)))) return false;
                    // One prompt per move: a drag that Foundry splits into continued segments shares its first movement id.
                    return firstTime(`reactive|${actor.uuid}|${movement.chain?.[0] ?? movement.id}`);
                }

                // Cards: a manipulate spell/action, or a ranged attack, from an enemy within reach.
                const message = event.message;
                const source = message?.actor, sourceToken = message?.token;
                if (!source || !sourceToken || !source.isEnemyOf?.(actor)) return false;
                const ctx = message.flags?.pf2e?.context;
                const traits = new Set(message.item?.system?.traits?.value ?? []);
                const manipulate = traits.has("manipulate") && (ctx?.type === "spell-cast" || ["action", "feat"].includes(message.item?.type));
                const ranged = ["attack-roll", "spell-attack-roll"].includes(ctx?.type)
                    && (message.item?.isRanged ?? (ctx.options ?? []).includes("item:ranged"));
                if (!manipulate && !ranged) return false;
                const mine = tokenOnScene(actor, sourceToken.parent);
                if (!mine || !withinReach(sourceToken, mine, reachOf(actor))) return false;
                this.lastWhy = manipulate ? `uses a manipulate action (${message.item?.name})` : `makes a ranged attack (${message.item?.name ?? "attack"})`;
                return firstTime(`reactive|${actor.uuid}|${message.id}`);
            },
            describe(event, actor) {
                const who = event.move?.tokenDoc.name ?? event.message?.token?.name ?? "An enemy";
                const why = event.move ? "moves out of a square in your reach" : this.lastWhy;
                return `<p><strong>${who}</strong> ${why}. <strong>Reactive Strike</strong>: make a melee Strike against it ` +
                    `(${reachOf(actor)}-ft reach). A critical hit disrupts a manipulate action.</p>`;
            },
            async use(actor, item) {
                await item.toMessage(null);
            },
        },
        {
            slug: "ankle-bite",
            name: "Ankle Bite",
            // Trigger: a foe gives you the grabbed or restrained condition using a part of its body.
            // Detected from a foe's Grapple check against you that succeeds (grabbed) or critically succeeds (restrained).
            matches({ message }, actor) {
                const ctx = message?.flags?.pf2e?.context;
                if (ctx?.type !== "skill-check" || !(ctx.options ?? []).includes("action:grapple")) return false;
                if (isMine(message.actor) || !targets(message, actor)) return false;
                return SUCCESS.includes(ctx.outcome);
            },
            describe({ message }, actor) {
                const condition = message.flags.pf2e.context.outcome === "criticalSuccess" ? "restrained" : "grabbed";
                return `<p><strong>${message.actor?.name ?? "A foe"}</strong>'s Grapple leaves <strong>${actor.name}</strong> ` +
                    `<strong>${condition}</strong>. <strong>Ankle Bite</strong> (if it grabbed you with its body): jaws Strike ` +
                    `against it — no multiple attack penalty, and it doesn't count toward yours. A critical hit ends the grab. ` +
                    `<em>Target the grabber, then Use.</em></p>`;
            },
            async use(actor, item) {
                await item.toMessage(null);
                const jaws = (actor.system.actions ?? []).find(s => s.item?.slug === "jaws" || /\bjaws\b/i.test(s.label ?? ""));
                if (jaws?.variants?.[0]) await jaws.variants[0].roll({});
                else ui.notifications.warn("Ankle Bite: no Jaws Strike found — roll it from the sheet.");
            },
        },
        {
            slug: "drop-dead",
            name: "Drop Dead",
            blocked: (actor, item) => !spellAvailable(actor, item),
            // Used on yourself: after an enemy attack's damage leaves you below the HP threshold.
            matches({ hpDrop }, actor) {
                return hpDrop?.actor.uuid === actor.uuid;
            },
            describe({ hpDrop }, actor) {
                const pct = Math.round((hpDrop.value / hpDrop.max) * 100);
                return `<p><strong>${actor.name}</strong> is down to <strong>${hpDrop.value}/${hpDrop.max} HP (${pct}%)</strong>. ` +
                    `<strong>Drop Dead</strong> on yourself: turn Invisible and leave an illusory corpse. ` +
                    `<em>Ends if you use a hostile action.</em></p>`;
            },
            async use(actor, item) {
                await castSpell(actor, item);
                await actor.createEmbeddedDocuments("Item", [{
                    type: "effect",
                    name: "Drop Dead",
                    img: item.img,
                    system: {
                        slug: "drop-dead",
                        level: { value: item.rank },
                        duration: { value: 1, unit: "minutes", expiry: "turn-start", sustained: false },
                        tokenIcon: { show: true },
                        description: { value: `<p>Invisible, with an illusory corpse left behind. ` +
                            `${item.rank >= 7 ? "Hostile actions don't end it." : "Ends (corpse too) if you use a hostile action."}</p>` },
                        rules: [{ key: "GrantItem", uuid: "Compendium.pf2e.conditionitems.Item.zJxUflt9np0q4yML", inMemoryOnly: true }],
                    },
                }]);
            },
        },
    ];

    const findItem = (actor, slug) =>
        [...actor.itemTypes.action, ...actor.itemTypes.feat, ...actor.itemTypes.spell].find(i => i.slug === slug);

    // ================= Chat prompts =================
    const promptsFor = (slug, actor) => game.messages.contents.filter(m => {
        const p = m.flags?.world?.[PROMPT_FLAG];
        return m.author?.id === game.user.id && p?.slug === slug && p.actorUuid === actor.uuid;
    });

    const promptContent = (reaction, event, actor, item) => `${reaction.describe(event, actor, item)}
        <div style="display:flex; gap:4px; margin-top:4px">
            <button type="button" data-reaction-prompt="use">Use ${reaction.name}</button>
            <button type="button" data-reaction-prompt="dismiss">Dismiss</button>
        </div>`;

    const postPrompt = async (reaction, event, actor, item) => {
        const old = promptsFor(reaction.slug, actor);
        if (old.length) await ChatMessage.deleteDocuments(old.map(m => m.id));
        await ChatMessage.create({
            whisper: [game.user.id],
            speaker: ChatMessage.getSpeaker({ actor }),
            content: promptContent(reaction, event, actor, item),
            flags: { world: { [PROMPT_FLAG]: {
                slug: reaction.slug, actorUuid: actor.uuid, itemUuid: item.uuid,
                messageId: event.message?.id ?? null,
                extra: reaction.extra?.(event) ?? null,
            } } },
        });
    };

    const check = async (event) => {
        for (const actor of myCharacters()) {
            for (const reaction of REACTIONS) {
                // Each reaction is isolated: one that errors (odd character data, a missing module, a different
                // PF2e version) is logged and skipped without stopping the others or other characters.
                try {
                    const item = findItem(actor, reaction.slug);
                    if (!item || reaction.blocked?.(actor, item)) continue;
                    if (!reaction.matches(event, actor, item)) continue;
                    await postPrompt(reaction, event, actor, item);
                } catch (err) {
                    console.error(`Reactions: ${reaction.name} failed for ${actor.name}:`, err);
                }
            }
        }
    };

    // Prompt buttons: one delegated listener, replaced on every run.
    state.clickHandler = async (clickEvent) => {
        const button = clickEvent.target.closest?.("[data-reaction-prompt]");
        if (!button) return;
        const message = game.messages.get(button.closest("[data-message-id]")?.dataset.messageId);
        const p = message?.flags?.world?.[PROMPT_FLAG];
        if (!p) return;
        clickEvent.preventDefault();
        clickEvent.stopPropagation();

        if (button.dataset.reactionPrompt === "use") {
            const reaction = REACTIONS.find(r => r.slug === p.slug);
            const actor = resolveActor(p.actorUuid);
            const item = fromUuidSync(p.itemUuid);
            if (reaction && actor && item) {
                if (reaction.blocked?.(actor, item)) ui.notifications.warn(`${reaction.name}: not available right now.`);
                else await reaction.use(actor, item, p.extra, { message: game.messages.get(p.messageId) });
            }
        }
        await message.delete();
    };
    document.addEventListener("click", state.clickHandler, true);

    // ================= Listeners =================
    // Chat cards from anyone. Your own cards only matter for your own saves (Ferocious Will).
    on("createChatMessage", (message) => {
        if (message.flags?.world?.[PROMPT_FLAG]) return;
        // Remember enemy attacks that hit your characters (for Drop Dead).
        const ctx = message.flags?.pf2e?.context;
        const enemyAttack = (ctx?.type === "damage-roll" && ctx.sourceType === "attack")
            || (["attack-roll", "spell-attack-roll"].includes(ctx?.type) && SUCCESS.includes(ctx.outcome));
        if (enemyAttack && !isMine(message.actor)) {
            for (const actor of myCharacters()) if (targets(message, actor)) noteAttack(actor);
        }
        // Your own cards only matter for your saves (Ferocious Will, Ascended Celestial), spell damage
        // (Foretell Harm), and your own checks (That's My Number).
        const ownOk = ["saving-throw", "damage-roll", "attack-roll", "spell-attack-roll", "skill-check"]
            .includes(message.flags?.pf2e?.context?.type);
        if (message.author?.id === game.user.id && !ownOk) return;
        check({ message }).catch(err => console.error("Reactions:", err));
    });
    // Live prompts: when the card that triggered a prompt changes (targets set, saves rolled), re-render the prompt.
    on("updateChatMessage", (source) => {
        for (const prompt of game.messages.contents) {
            const p = prompt.flags?.world?.[PROMPT_FLAG];
            if (!p || p.messageId !== source.id || prompt.author?.id !== game.user.id) continue;
            const reaction = REACTIONS.find(r => r.slug === p.slug && r.live);
            const actor = resolveActor(p.actorUuid);
            const item = fromUuidSync(p.itemUuid, { strict: false });
            if (!reaction || !actor || !item) continue;
            const event = { message: source };
            prompt.update({
                content: promptContent(reaction, event, actor, item),
                [`flags.world.${PROMPT_FLAG}.extra`]: reaction.extra?.(event) ?? null,
            }).catch(err => console.error("Reactions:", err));
        }
    });
    // Toolbelt save buttons roll without posting a save card.
    on("pf2e-toolbelt.rollSave", ({ message, target, data }) => {
        const actor = target?.actor;
        if (!isMine(actor)) return;
        const save = {
            actor,
            success: data?.success,
            statistic: data?.statistic,
            die: data?.die,
            item: message?.item ?? null,
            sourceName: message?.actor?.name ?? message?.speaker?.alias ?? null,
        };
        check({ save }).catch(err => console.error("Reactions:", err));
    });

    // Token movement (Reactive Strike).
    on("moveToken", (tokenDoc, movement) => {
        if (!movement?.passed?.waypoints?.length) return;
        check({ move: { tokenDoc, movement } }).catch(err => console.error("Reactions:", err));
    });

    // HP drops: prompt Drop Dead when an enemy attack this turn leaves you under the threshold (but still up).
    for (const actor of myCharacters()) hpCache.set(actor.uuid, actor.hitPoints?.value);
    on("updateActor", (actor, changes) => {
        if (!isMine(actor) || !foundry.utils.hasProperty(changes, "system.attributes.hp.value")) return;
        const { value, max } = actor.hitPoints;
        const before = hpCache.get(actor.uuid) ?? max;
        hpCache.set(actor.uuid, value);
        if (value >= before || value <= 0 || value >= max * DROP_DEAD_THRESHOLD) return;
        if (!attackedJustNow(actor)) return;
        check({ hpDrop: { actor, value, max } }).catch(err => console.error("Reactions:", err));
    });

    const names = REACTIONS.map(r => r.name).join(", ");
    ui.notifications.info(`Reactions v${VERSION}: listening for ${names}.`);
})();
