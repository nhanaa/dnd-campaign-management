---
name: encounter-analysis
description: Analyze how balanced a PF2e session's fights actually were by reverse-engineering each creature's REAL HP/AC from the Foundry roll log and transcript, instead of trusting bestiary stat blocks. Use when the user asks "how balanced were the fights", "encounter analysis", "were they that weak", "how hard was that fight", or wants damage-contribution / threat / difficulty math for a session.
---

# Encounter Analysis

Judge how hard a session's encounters actually were — from the dice that were rolled, not the stat blocks. This method exists because **bestiary HP is unreliable**: GMs scale AP creatures (especially for 5-player tables), reskin them, and run bosses far tougher than their glossary entry. The only ground truth is what happened at the table.

## Foundational principle: measure, don't trust

> **The bestiary is a *reference*, not the answer. Derive each creature's real toughness from the damage it actually took before dying.**

The failure mode this guards against (observed): a "boss" whose glossary entry was a low-level / low-HP block, but who absorbed 3× that HP and cast spells above its listed level — clearly run as a scaled boss. "Mook" creatures listed at ~45 HP that took 100+ damage **from single-target hits while still standing** — i.e. ~110-HP creatures, not 45. And typically only the *imported generic monster* in a fight matches its book HP, while the AP-custom creatures are scaled up. Trusting the glossary in that situation produced a "Trivial" verdict for what was actually a Severe–Extreme fight. Don't repeat that — verify every HP against the rolls.

## Inputs

- **Foundry roll log:** the campaign's roll-log dump (in this project, `/home/nhanp/dnd-campaign-management/rolls.txt` — the global dump the user pastes each session; check `git status`). The primary source.
- **Cleaned transcript:** `/tmp/transcript-cleaned-<campaign>-s<N>.txt` (from process-session) — for death timing, who-did-what, initiative, and DM commentary.
- **Bestiary (reference only):** via the `pf2e-lookup` skill. Run `node pf2e-lookup/pf2e-search.js "<name>" -d --no-desc` from the repo root. **Always check the AP-specific bestiary first** (`pf2e/<adventure-path>-bestiary/book-N-*/`) — that's the actual stat block, not the generic Monster Core glossary. Use these for *starting* AC/saves/abilities, then verify HP against the rolls.
- **Party HP pool:** sum the PCs' max HP from the campaign's character sheet(s) + `dynamics.md`. This is the yardstick for the threat axis.

## The core technique: targeted-hit HP floor

The trick that makes this work:

> **A single-target attack only lands on a *living* creature.** You cannot make a Strike / single-target spell-attack land on a corpse. An **area** effect (burst spell, line, emanation) *can* clip a downed token still in the area.

So for each creature, the **highest running damage total reached by a *targeted* hit is a hard floor on its real HP.** If a "45-HP" creature gets hit by a single-target attack while at a running total of 84, it is not a 45-HP creature. Area damage above that floor may be overkill or may be real HP — bracket it: `HP ∈ [last targeted run, final run]`.

- **Targeted** (won't hit a corpse): melee/ranged Strikes, single-target attack-roll spells, touch spells, single-target focus spells, maneuvers that require a living target.
- **Area** (can clip the dead): bursts, lines, emanations, and any save-based AoE.

Classify each ability in the roll log into one of these two buckets for the system you're analyzing.

## Adjustments to apply

1. **Fast Healing / Regeneration** inflates damage-to-kill. `damage_to_kill ≈ base_HP + (FastHealing × rounds_alive)`. Several Fast-Healing creatures over a long fight add a large block of "phantom HP" the party had to re-clear — back it out before estimating base HP / level.
2. **Overkill** on the killing blow (and area effects landing past death) inflates the raw total — that's why the *targeted floor* is the trustworthy number, not the raw sum.
3. **Party debuffs lower the AC you observe.** If a creature was **Frightened** (e.g. a no-save fear aura), **off-guard** (taunt / flanking / blinded / dazzled), or otherwise penalized when it was hit, the attack totals that connected landed against an AC already reduced. So the AC you infer from hit-totals is a *floor* on the creature's true AC — it was tankier on defense than the raw hits suggest. Check the transcript for which buffs/debuffs were active.
4. **Hidden enemy rolls.** Enemy attack rolls are often logged with the modifier hidden (e.g. `1d20 + ??`), so you **cannot** count incoming crits or the DM's luck from the log. You *can* measure the players' luck (their modifiers are shown). State this limit explicitly; don't claim the DM "ran hot" from the log alone.

## Step-by-step

### 1. Pull the stat blocks (reference)
Identify the creatures from the user's initiative order + the transcript. Look each up in the **AP bestiary first**, then Monster Core. Record level / AC / saves / weaknesses / **abilities (esp. Fast Healing, resistances)** — but treat HP as provisional.

### 2. Build the per-creature damage ledger (the heart of it)
Parse the roll log for every `<target> takes <N> damage`, in order, attributing each to a source ability (scan backward for the nearest ability keyword / weapon-dice fingerprint) and tagging targeted vs area. **Build the ability→PC map and the target-name normalizer from the actual party roster and the session's enemies — do not hardcode names.** Skeleton:

```python
import re
L=[l.rstrip() for l in open('<roll-log-path>',encoding='utf-8',errors='replace')]

# ABIL: map ability/weapon keywords -> "<source>·<PC>", tag area abilities with [AREA].
# BUILD THIS from this campaign's roster (character sheets / dynamics.md) + the system's ability names.
ABIL = [
    # ('<single-target ability keyword>', '<Ability>·<PC>'),
    # ('<area ability keyword>',          '<Ability>·<PC>[AREA]'),
    # ... one entry per signature ability/weapon in the party ...
]
def src(idx):
    trad=None
    for j in range(idx, max(idx-55,-1), -1):
        s=L[j].lower()
        if s.strip() in ('divine','arcane','occult','primal') and trad is None: trad=s.strip()
        for pat,who in ABIL:
            if pat in s: return who
        # weapon-dice fingerprints disambiguate plain Strikes between PCs, e.g.:
        # if '<damage dice of PC A weapon>' in s: return 'Weapon·<PC A>'
    return '??'

# norm(target_name) -> canonical enemy name. CHECK THE MOST SPECIFIC NAMES FIRST
# (e.g. a name containing "sentry a" can collide with "clockwork sentry a" — match the
# longer/more-specific string first or you'll merge two different creatures).
```
Emit, per creature: ordered `(line, dmg, source, running_total, [AREA?], [DESTROYED?])`. Then read off the **targeted floor** = max running total reached by a non-`[AREA]` hit.

### 3. Cross-reference the transcript for death timing
Confirm when each creature actually dropped ("it's down", "destroyed", "double kill"). This disambiguates `HP ∈ [floor, final]` and catches reused token names.

### 4. Estimate real HP → effective level
`real_HP ≈ targeted_floor` (single-target kill) or `[floor, final]` (area kill), **minus Fast-Healing clawback**. Map to level via the GMG moderate-HP bands:

| Lvl | HP band | | Lvl | HP band |
|----:|---|---|----:|---|
| 1 | 15–25 | | 9 | 110–155 |
| 3 | 40–55 | | 10 | 125–175 |
| 5 | 60–85 | | 11 | 140–195 |
| 6 | 70–100 | | 12 | 155–215 |
| 7 | 85–120 | | 14 | 180–250 |
| 8 | 95–140 | | 16 | 220–300 |

Flag any creature whose real HP is >1.4× its book HP as **scaled** (and rule out Fast Healing / overkill before concluding).

### 5. The incoming / threat side
Parse the roll log for `<PC> takes <N>` and `<PC> is healed for <N>`, bucketed into fights by line-range (find fight boundaries from each fight's creatures' first/last appearance). Per fight compute: **damage party took**, **healing burned**, **per-PC damage taken** (the tank should dominate — that's the taunt/intercept umbrella working), and **survival margin = (party HP pool + healing) − damage taken**.

### 6. (Optional) Player luck
For every `1d20 + <known N>` (these are mostly PC rolls — enemy rolls hide the modifier), compute the natural die and tally the distribution + nat-20 rate + crit-damage (`2 *`) count. This measures the *players'* luck only.

## The two-axis difficulty verdict

Score each fight on both — they are not the same thing:

- **GRIND (size)** = total enemy effective HP cleared (+ Fast-Healing overhead). How long/big.
- **THREAT (danger)** = damage the party absorbed as a % of its HP pool, *plus concentration* (damage spread across the party is survivable; the same total dumped onto one low-HP PC is near-death) *plus* healing burned. How dangerous.

A fight can be high-grind / low-threat (a big bag of HP that never hurt anyone) or low-grind / high-threat (few bodies, but Fast Healing + focus-fire + crits). Report both, then re-price against the budget using the **empirical** levels.

### PF2e XP budget — N-player, party level L
Per-creature XP by relative level: PL−4 = 10, PL−3 = 15, PL−2 = 20, PL−1 = 30, PL = 40, PL+1 = 60, PL+2 = 80, PL+3 = 120, PL+4 = 160.
Standard 4-player thresholds: Trivial 40 · Low 60 · Moderate 80 · Severe 120 · Extreme 160.
Per *extra* player beyond 4, raise each threshold: Trivial +10 · Low +20 · Moderate +20 · Severe +30 · Extreme +40. (So a 5-player table: Trivial 50 · Low 80 · Moderate 100 · Severe 150 · Extreme 200.)

> **Caveat the budget loudly:** it floors creatures >4 levels under the party and ignores them, so it badly *under*-rates hordes of low-level bodies (action economy + aggregate HP are the real threat there). When a fight is many-on-few, lead with HP + action economy and treat the XP number as secondary.

## Crediting the control package

Difficulty isn't just tuning — it's how much the party's buffs/debuffs bent the math. Quantify where you can:
- **Accuracy buffs** (party +1/+2 to hit) = +1/+2 to the party's hit *and* crit thresholds (≈ +5%/+10% of attacks become hits-or-crits). Matters most against high-AC targets.
- **Defensive buffs** (party +AC/saves) and **enemy debuffs** (frightened/sickened/clumsy → −X to enemy attack/DC) each shave a few % off incoming hits *and* crits — multiply across every enemy turn in a long fight to estimate damage/crits prevented.
- **Taunt / aggro control** = the tank eating the lion's share of incoming (verify via the per-PC damage-taken split) + off-guard on taunted enemies.

A Severe/Extreme-sized fight that ends with a comfortable survival margin and nobody dead usually means the control package converted it — say so, with the margin number.

## Output

A short report: (1) per-creature table — real HP (targeted floor) vs book, scaled?, effective level; (2) per-fight table — grind / threat / healing / margin / rounds; (3) the two-axis verdict + re-priced budget; (4) what the control package (buffs/debuffs + tank + heals) bought. Lead with the honest headline, and flag every estimate's uncertainty (hidden enemy rolls, Fast-Healing back-out, overkill brackets).

## Guardrails

- **Never state bestiary HP as fact.** Always verify against damage-taken; say "book says X, rolls say Y."
- **Targeted floor > raw sum** for HP. Don't let area overkill inflate a creature.
- **Don't claim the DM rolled hot/cold from the log** — enemy modifiers are usually hidden. You can only measure player luck.
- **Back out Fast Healing** before calling a creature "scaled."
- When the math contradicts a stat block (a low-level creature casting high-rank spells, or eating multiples of its book HP), trust the math and say the block was scaled/reskinned.
- Build name maps from the campaign roster each run — never assume a fixed cast.
