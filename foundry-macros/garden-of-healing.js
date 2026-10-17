/**
 * Garden of Healing — the full minute of healing in one roll (out of combat)
 * =========================================================================
 *
 * Garden of Healing (animist vessel, rank 1, heightened +1d4 per rank) pulses
 * on the cast and on the first Sustain of each later round. Held for its full
 * 1-minute duration that is 10 pulses, so the full heal is 10 × (rank)d4 to
 * every creature in the 10-ft emanation.
 *
 * Rank is half your level, rounded up (focus spells auto-heighten). Posts one
 * healing roll with the normal apply buttons; each player (or the GM) applies
 * it to their own token.
 *
 * Afterwards everyone healed gets +1 circumstance to saves vs emotion for
 * 10 minutes and can't be healed by another casting until that ends.
 */

(async () => {
  const PULSES = 10;
  const actor = (canvas.tokens.controlled[0]?.actor?.isOwner && canvas.tokens.controlled[0].actor) || game.user.character;
  if (!actor) return ui.notifications.warn("Garden of Healing: select your token or assign a character.");

  const rank = Math.ceil(actor.level / 2);
  const DamageRoll = CONFIG.Dice.rolls.find(r => r.name === "DamageRoll");
  const roll = await new DamageRoll(`(${PULSES * rank}d4)[healing]`).evaluate();

  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `<strong>Garden of Healing</strong> (rank ${rank}) — full duration, ${PULSES} pulses of ${rank}d4` +
      `<br><em>Everyone in the 10-ft emanation. Then +1 circ. vs emotion for 10 min; no re-heal from another casting until it ends.</em>`,
  });
})();
