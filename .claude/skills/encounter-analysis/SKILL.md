---
name: encounter-analysis
description: Analyze how balanced a PF2e session's fights actually were by reverse-engineering each creature's REAL HP/AC from the Foundry roll log and transcript, instead of trusting bestiary stat blocks. Also covers per-PC damage contribution, buff/debuff value (counted as flipped rolls), in-combat vs downtime healing, dice-luck and save-luck analysis. Use when the user asks "how balanced were the fights", "encounter analysis", "were they that weak", "how hard was that fight", "how much did my buffs matter", "was I unlucky", or wants damage-contribution / threat / difficulty math for a session.
---

# Encounter Analysis

Judge how hard a session's encounters actually were — from the dice that were rolled, not the stat blocks. This method exists because **bestiary HP is unreliable**: GMs scale AP creatures (especially for 5-player tables), reskin them, and run bosses far tougher than their glossary entry. The only ground truth is what happened at the table.

## Foundational principle: measure, don't trust

> **The bestiary is a *reference*, not the answer. Derive each creature's real toughness from the damage it actually took before dying.**

The failure mode this guards against (observed): a "boss" whose glossary entry was a low-level / low-HP block, but who absorbed 3× that HP and cast spells above its listed level — clearly run as a scaled boss. "Mook" creatures listed at ~45 HP that took 100+ damage **from single-target hits while still standing** — i.e. ~110-HP creatures, not 45. And typically only the *imported generic monster* in a fight matches its book HP, while the AP-custom creatures are scaled up. Trusting the glossary in that situation produced a "Trivial" verdict for what was actually a Severe–Extreme fight. Don't repeat that — verify every HP against the rolls.

**The opposite failure mode is just as real (observed, RotR-Cody S5, 2026-08-08): over-distrusting the book.** A mythic boss "cleared ~407 vs book 320" and got called *scaled ×1.27* — but the same JSON's unread fields held `mythic resistance 14` and `regeneration 25`, which fully explained the gap: the real HP was book + Elite. Four "scaled ×1.2–1.5" mooks were clean Elites whose **targeted floors** (243/188/234/202 vs Elite 260) already said so — the inflated claim came from quoting overkill-padded applied totals instead of the floors this skill itself prescribes. *Measure, don't trust — in either direction.* Before declaring "scaled," name the printed field (resistance, regeneration, Elite math) that fails to explain the gap.

## Inputs

- **Foundry roll log:** the campaign's roll-log dump (in this project, `/home/nhanp/dnd-campaign-management/rolls.txt` — the global dump the user pastes each session; check `git status`). The primary source.
- **Cleaned transcript:** `/tmp/transcript-cleaned-<campaign>-s<N>.txt` (from process-session) — for death timing, who-did-what, initiative, and DM commentary.
- **Bestiary (reference only):** ⚠️ **AP bestiaries are NOT in the pf2e-lookup search index** — `pf2e-search.js "<AP creature>"` returns *No results found* even when the JSON exists. **Glob the AP folder directly** (`pf2e/<adventure-path>-bestiary/book-N-*/*.json`) and read the **FULL JSON**, not a summary: `system.attributes.hp.max` **and `hp.details` (regeneration lives there)**, `ac`, `saves`, **`resistances` (including `type: "mythic"` — flat all-damage resistance)**, `weaknesses`, the `items[]` ability list, and the top prepared/spontaneous spell rank. `pf2e-search.js` works for generic Monster Core creatures only. Use all of this for the *starting* chassis, then verify HP against the rolls.
- **Party HP pool:** sum the PCs' max HP from the campaign's character sheet(s) + `dynamics.md`. This is the yardstick for the threat axis.

## The core technique: targeted-hit HP floor

The trick that makes this work:

> **A single-target attack only lands on a *living* creature.** You cannot make a Strike / single-target spell-attack land on a corpse. An **area** effect (burst spell, line, emanation) *can* clip a downed token still in the area.

So for each creature, the **highest running damage total reached by a *targeted* hit is a hard floor on its real HP.** If a "45-HP" creature gets hit by a single-target attack while at a running total of 84, it is not a 45-HP creature. Area damage above that floor may be overkill or may be real HP — bracket it: `HP ∈ [last targeted run, final run]`.

- **Targeted** (won't hit a corpse): melee/ranged Strikes, single-target attack-roll spells, touch spells, single-target focus spells, maneuvers that require a living target.
- **Area** (can clip the dead): bursts, lines, emanations, and any save-based AoE.

Classify each ability in the roll log into one of these two buckets for the system you're analyzing.

## Adjustments to apply

1. **Fast Healing / Regeneration** inflates damage-to-kill. `damage_to_kill ≈ base_HP + (FastHealing × rounds_alive)`. Several Fast-Healing creatures over a long fight add a large block of "phantom HP" the party had to re-clear — back it out before estimating base HP / level. Count only the ticks that actually healed (`is healed for N`) — "already at full health" lines are no-ops.
2. **Flat resistance reads as phantom HP.** A creature with resistance-to-all (e.g. War of Immortals `mythic resistance N`, or golem-style physical resistance) sheds N from *every applicable hit*, and the roll log shows only the post-resistance applied damage on some tables — or the pre-resistance roll on others. Either way, `applied_total ≈ base_HP + (resistance × hits that paid it)`. If the pack JSON lists a flat resistance, back it out **before** comparing to book HP; a ×1.2–1.3 "inflation" on a 10-hit kill is often just resistance math.
3. **Overkill** on the killing blow (and area effects landing past death) inflates the raw total — that's why the *targeted floor* is the trustworthy number, not the raw sum. **Quote the floors in the report, not the applied totals** — big-crit tables (100+ point killing blows) pad applied totals far past the death line, and floors are what falsify or confirm an Elite/scaled hypothesis.
3. **Party debuffs lower the AC you observe.** If a creature was **Frightened** (e.g. a no-save fear aura), **off-guard** (taunt / flanking / blinded / dazzled), or otherwise penalized when it was hit, the attack totals that connected landed against an AC already reduced. So the AC you infer from hit-totals is a *floor* on the creature's true AC — it was tankier on defense than the raw hits suggest. Check the transcript for which buffs/debuffs were active.
4. **Hidden enemy rolls.** Enemy attack rolls are often logged with the modifier hidden (e.g. `1d20 + ??`), so you **cannot** count incoming crits or the DM's luck from the log. You *can* measure the players' luck (their modifiers are shown). State this limit explicitly; don't claim the DM "ran hot" from the log alone.

## Step-by-step

### 1. Pull the stat blocks (reference) — FULL JSON, before any ledger work
Identify the creatures from the user's initiative order + the transcript. Glob the **AP bestiary first** (the search index won't find AP creatures — see Inputs), then Monster Core. Per creature, dump a chassis row: level / HP **+ regeneration (in `hp.details`)** / AC / saves / **resistances (flat & mythic!)** / weaknesses / the full ability list / top spell rank / **the printed Strike bonuses and damage dice**. Treat HP as provisional — but carry the resistances and regeneration into step 4's math, and keep the ability list and damage dice for the checks below. Doing this *first* is what stops resistance and regen from being misread as scaled HP later.

**Glob the whole folder for name variants before assuming a roster.** An enemy *team* often has one JSON per member. Check whether they are actually different: in S12 the eight named members of a rival team (`golarions-finest-*.json`) were **byte-identical chassis** — same level, HP, AC and saves — so "seven distinct fighters" was really one statblock ×7. Conversely, Foundry tokens named `X A`–`X G` may hide genuinely different creatures. **Compare the JSONs; don't infer from token names in either direction.**

**Check for Weak as well as Elite.** Analysts reflexively look for the Elite template (+2 attack/AC/DCs/saves, +HP by level) and forget the **Weak** template (−2 across the board, −HP). Both are common, and a GM may apply *both in the same fight*:

> **Observed (S12):** one Ki Adept chassis (AC 33, saves +23, Perception +23, Fist +27) was run as **seven Weak copies** (AC 31, saves +21, Perception +21, Fist +25) plus **one Elite boss** (AC 35, saves +25, Perception +25, Fist +29). The boss's targeted HP floor came in at **exactly** the Elite value. What looked like "a boss +4 above his mooks" was simply **−2 and +2 from the same block** — a clean, legible build, not a custom one. Compute the delta from *book*, not from the other creatures in the fight.

**Check the payload separately from the chassis.** A GM can leave the defensive chassis honest (or even weaken it) while rebuilding the offense. Diff the **printed Strike damage dice and `items[]` ability list** against what actually appeared in the log:

> **Observed (S12):** the same Weak adepts hit with `3d6+13 + 1d6 spirit` where the book says `2d6+11`, and used `Qi Rush`, `Inner Upheaval` (+2d6) and `Harmonize Self` (36 HP) — **none of which are in the printed ability list**. Book average ~18 per punch became ~34, or ~45 with a prone rider. So: *easier to hit than the book, hitting ~2× the book.* This is the signature that produces "the XP said Severe but it felt Extreme," and it is invisible if you only compare HP and AC.

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
`real_HP ≈ targeted_floor − regen_ticks_healed − (flat_resistance × hits_that_paid_it)` (single-target kill), or the same on `[floor, final]` brackets (area kill). Map to level via the GMG moderate-HP bands:

| Lvl | HP band | | Lvl | HP band |
|----:|---|---|----:|---|
| 1 | 15–25 | | 9 | 110–155 |
| 3 | 40–55 | | 10 | 125–175 |
| 5 | 60–85 | | 11 | 140–195 |
| 6 | 70–100 | | 12 | 155–215 |
| 7 | 85–120 | | 14 | 180–250 |
| 8 | 95–140 | | 16 | 220–300 |

Flag any creature whose real HP is >1.4× its book HP as **scaled** — but only after ruling out, in order: overkill (use floors), regeneration ticks, flat/mythic resistance, and the **Elite template** (+2 attacks/AC/DCs, +10–30 HP by level; observed attack = book+2 is the Elite fingerprint). "Scaled" is the residual claim once every printed field has failed to explain the gap. Separately, compare the *spell ranks cast* (from the log) against the block's top rank — **upgraded spell payload on an honest chassis is a distinct, common GM signature** (Cody's, specifically) and explains "Severe frame, Extreme bruises" without any HP inflation.

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

## Crediting the control package — count FLIPS, not vibes

Difficulty isn't just tuning; it's how much the party's buffs/debuffs bent the math. Don't estimate this with percentages — **count the rolls the modifiers actually flipped.** A "flip" is a roll whose *degree of success changed* because of a party-supplied modifier.

### Report three tiers, not one number

A single flip count is always misleading, because on most decisive rolls **several effects were live at once and no one of them is individually "the cause."** Removing any single point flips it back; so does removing any other. Always report:

| Tier | Definition | S12 value |
|---|---|---|
| **1 — Marginal** | Remove *only* the effect being judged, hold everything else. Strictest, lowest number. | Anthem alone: **6** |
| **2 — Package** | Remove *every* party buff and *every* party-caused enemy penalty. What the control package as a whole bought. | **26** (13 miss→hit, 9 hit→crit, 4 critmiss→miss) |
| **3 — Participation** | Package flips the effect contributed points toward. | Anthem in **20** of the 26 |

Also report **the average winning margin and the effect's share of it** — S12's decisive flips were won by 2.77 points on average, of which the +1 accuracy aura supplied 28%. That one line prevents both errors below.

> ⚠️ **Both failure modes are real and both happened on S12.** Reporting only Tier 1 ("your anthem flipped 3 rolls") reads as *your buff was worthless* and is what made Pax hand-count the log. Reporting only Tier 2, or letting the player's eyeball count of "rolls that landed exactly on the printed AC" stand unqualified, credits one +1 for flips that a −2 off-guard did most of the work on. **Neither number is wrong; publishing either one alone is.**

### The boundary rule (get this right or the whole count is wrong)

Foundry reports `Result: <Degree> by <margin>`, where **margin is measured against the effective target number, and a critical is margin ≥ +10**. The margin is authoritative — it is already computed against the AC Foundry actually used, so never recompute it from the printed AC. Test a flip by re-deriving the degree at `margin − <points removed>`:

```python
def deg(m): return 3 if m>=10 else 2 if m>=0 else 1 if m>-10 else 0   # critH, hit, miss, critMiss
flip = deg(margin) > deg(margin - points_removed)
```

> ⚠️ **Observed failure (S12):** testing for the *string* `Critical Hit by +0` to find crit flips. Crit margins start at +10, so that value can never occur and the crit-flip count came back a structural zero. Never pattern-match margin strings — always compare `deg()` before and after.

### Parsing the Foundry export — four traps, all observed in one session

**1. Value-conditions render as `Name <value> <penalty>`, not `Name <penalty>`.**
`Sickened 1 -1` and `Frightened 2 -2` carry the condition's *value* between the name and the modifier. A regex like `([A-Z][A-Za-z ]+) ([+-]\d+)` matches `Off-Guard -2` and `Courageous Anthem +1` fine but **silently drops nearly every frightened and sickened instance** — S12's first pass found 7 Frightened and 2 Sickened where the true counts were **24 and 24**, which is why the report wrongly said sickened never flipped anything. Make the value optional:

```python
MOD = re.compile(r"\b([A-Z][A-Za-z'\-]*(?:\s*\([A-Za-z ]+\))?(?:\s+[A-Za-z'\-]+)*?)(?:\s+\d+)?\s+([+-]\d+)\b")
```

**2. The printed "base" AC is not the creature's clean AC — Foundry bakes some conditions into it.**
On S12, `Golarion's Finest A` printed `AC 30` on every single roll while its six mechanically identical siblings printed `AC 31`: a sickened −1 had been folded into the base and was invisible to AC-pair math. **Derive each creature's clean AC as the modal printed base across the whole session**, and for a group of identical creatures use the group's mode. Any printing *below* the mode is a hidden status penalty (count it); any printing *above* is a target buff like Raise Shield (don't).

```python
clean_AC[creature] = mode(printed_base_AC across session)   # group-mode for identical chassis
target_side_drop   = max(clean_AC - effective_AC, 0)        # effective = 2nd number, else the 1st
```

**3. `Target has:` is unreliable in both directions — never sum it.**
On S12 it disagreed with the actual AC delta on **127 of 159** rolls. It lists conditions already baked into the printed base (double-counting), it double-counts overlapping conditions that don't stack (`Unconscious -4, Off-Guard -2` produced an actual delta of only −2), and **79 rolls showed a −2 drop with nothing itemized at all.** Use it to *name* the sources for the writeup; use the delta against clean AC for the *math*.

**4. Roller-side and target-side modifiers are separated by the word `Result:`.**
Everything between `Target has:` and `Result:` describes the **target's** condition; everything after `Result:` is the **roller's own** modifier stack. Split on `Result:` before parsing or you will credit an enemy's frightened penalty to the PC attacking it.

### Cover ALL four roll types, not just Strikes

A caster's debuffs mostly pay off somewhere other than enemy attack rolls. Check:

| Roll type | Where the party's modifiers show up |
|---|---|
| **Party attack rolls** | enemy AC lowered (off-guard, frightened, sickened) + party accuracy buff |
| **Enemy attack rolls** | enemy frightened/sickened/taunt + PC AC buffs |
| **Enemy saves vs PC spells** | frightened/sickened apply to enemy saves — **this is the caster's main payoff and is the easiest to forget** |
| **Enemy skill checks** (Trip/Grapple/Escape/Athletics) | same penalties; these decide whether a PC gets tripped, grabbed or swallowed |

> ⚠️ **Observed failure (S12):** only Strikes were scanned, so enemy saves and enemy Athletics checks were never examined — and **off-guard, the party's single largest lever, was missed entirely** because it lives in the AC pair rather than in a named modifier. Off-guard/flanking turned out to be present on the majority of the 26 package flips.

### A critical miss is worth the same as a miss

Do **not** report "N enemy critical failures" as if it were value. In PF2e a critical miss on an attack has the same outcome as a plain miss. Attacks at high MAP crit-fail constantly whether or not the party debuffed them. **Only degree changes that alter the outcome count** (hit→miss, crit→hit, fail→crit-fail on a *save* where the spell has a crit-fail rider). Tier-2 counts should list `critmiss→miss` separately and explicitly discount it — 4 of S12's 26 were this and bought nothing.

### Annotation coverage — always state it

Foundry only annotates a modifier when the effect is actually applied to the token, so a buff that was narratively "up all fight" may appear on only some rolls. **Report `provable flips` and `annotated coverage` together**, then extrapolate: `estimated true flips ≈ provable × (total rolls / annotated rolls)`. In S12 the accuracy aura was annotated on 79 of 137 party attack rolls (58%).

### Sanity-check against the statistical expectation
A `+1` should flip about **5% of rolls at the hit boundary and 5% at the crit boundary (~10% total)**. Tier 1 for a +1 over 79 annotated rolls should land near 8; S12 measured 6, which is plausible. **A Tier-1 result far below expectation is a parsing bug until proven otherwise** — that is exactly what the "3" was.

### Cross-check against the player's own count before publishing
Players notice their buffs working and will hand-count. If their number and yours differ by more than the sanity-check band, **assume your parser is broken and find the bug**, then explain which tier each number corresponds to. On S12 the player's 11 hand-counted swings were *all* genuine Tier-2 flips; the analysis had reported 3.

## Healing: separate IN-COMBAT from downtime

**Never report a single healing total.** Out-of-combat healing (Treat Wounds, Medicine-based rest healing, regeneration ticks between fights) is a 10-minute exploration activity and measures a completely different thing from healing delivered under fire.

- Define each fight's window as **first initiative roll → last damage application**, and count only `is healed for N` lines inside it.
- Exclude Treat Wounds by name (it can never be in-combat), plus between-fight regeneration ticks.
- Report **healer → HP**, **method** (Battle Medicine / Heal spell / potions / item), and **recipient** (it should concentrate on the tank and the focus-fire target — if it doesn't, that's a triage finding).

> **Observed (S12):** the party's apparent top healer had 1,438 HP for the session but **1,166 of it was Treat Wounds between fights**. Filtering to combat windows moved the ranking completely and made the *support caster* the party's #1 in-combat healer. The unfiltered number was actively misleading.

## Was the caster unlucky? — the save-luck counterfactual

When a player says "they saved everything" (they are usually right, and it is always checkable):

1. Attribute every `SAVE ::` block to the PC whose effect preceded it.
2. For each save pull **DC, the enemy's save modifier, and the natural die**. The die the enemy *needed* is `DC − modifier`; their true save chance is `(21 − needed) × 5%`.
3. Compare the observed natural rolls to 10.5 and compute a z-score: `z = (mean − 10.5) / (5.766 / √n)`. Report the one-tailed p.
4. **Re-run the damage with every enemy rolling a flat 10** and diff it against what actually applied. Basic saves: crit success 0, success ½, failure full, crit failure ×2.

This converts "I felt unlucky" into a number, and separates two very different claims: *the player's own dice were cold* vs *the enemies rolled hot against that player's DCs specifically*. In S12 the caster's own d20s sat at z = −0.07 (dead average) while enemy saves against his spells ran **z = +3.10, p ≈ 0.001**, costing ~249 damage — a real, defensible grievance that the raw damage column completely hid.

## Roll analysis — split by category, with z-scores

Bucket every PC d20 into **attack/offensive** vs **non-attack (skills + saves)** and report per PC: `n`, mean natural, nat-20 count, nat-1 count, and `z`. Notes:
- PC saves are usually in the indented `SAVE ::` lines with a different format (`nat 13 = 37`) than inline checks (`1d20 + 12 = 28`) — **parse both** or the save column comes back empty.
- On a reroll line (two d20 blocks), take the **first** die for luck purposes.
- Enemy attack modifiers are typically hidden, so this measures **player** luck only — say so.
- Watch for split personalities: a PC can be hot on attacks and freezing on everything else. That's worth reporting; it explains both their damage and their failed checks in one line.

## Judging a support character fairly

Damage share is the wrong yardstick for a buffer/healer/controller, and leading with it produces a false verdict. Report their contribution on **five** axes:

| Axis | How to measure |
|---|---|
| Direct damage | applied-damage ledger |
| **Damage owed to luck** | the save-luck counterfactual above |
| **Control** | flips converted (offensive + defensive), with coverage caveat |
| **In-combat healing** | combat-window filter |
| **Actions spent** | count their attack rolls / damage rolls — damage *per action* often ranks them first even when volume ranks them last |

In S12 the caster was 4th of 5 on raw damage (12.9%) and, once the other four axes were measured, was the party's **#1 in-combat healer, #2 control engine, and highest damage-per-action** — with ~1,760 points of effective contribution against 668 in the damage column.

## Output

A report covering, in this order:

1. **Per-creature table** — real HP (**targeted floor**, never applied total) vs book, template applied (Elite / Weak / neither), payload-vs-book note, effective level.
2. **Per-fight table** — grind / threat / healing / margin / rounds, with damage *concentration* called out (who ate it).
3. **The two-axis verdict + re-priced budget** against the empirical levels.
4. **Per-PC damage contribution** — per fight and session total, with shares.
5. **What the control package bought** — flips converted, split offensive/defensive, credited by source, with annotation coverage stated.
6. **In-combat healing** (downtime excluded) — by healer, by method, by recipient.
7. **Roll analysis** — attack vs non-attack, per PC, with z-scores; plus the **save-luck counterfactual** for any save-based caster.
8. **What didn't fire** — printed abilities that never appeared in the log (panic buttons, signature actions, reaction abilities). Unused signature abilities are analysis gold: they usually mean the party's action-denial or kill speed censored the enemy's best material, and naming them is the concrete receipt.

Lead with the honest headline, and flag every estimate's uncertainty (hidden enemy attack modifiers, regen/resistance back-out, overkill brackets, annotation coverage).

**Tone.** Players often ask for this expecting bad news about themselves ("I didn't do as much as I hoped"). Give them the real number, then give them the *other four axes* — a support PC's damage share is genuinely not the measure of their night, and saying so with receipts is the point of the exercise. Equally: if a call they are proud of didn't actually pay off, say so plainly. Don't flatter and don't manufacture consolation — just measure everything that counted, not only the column that's easy to count.

## Guardrails

- **Never state bestiary HP as fact.** Always verify against damage-taken; say "book says X, rolls say Y."
- **Targeted floor > raw sum** for HP. Don't let area overkill inflate a creature.
- **Don't claim the DM rolled hot/cold from the log** — enemy attack modifiers are usually hidden. You can only measure player luck. (Enemy *saves* against PC spells **are** fully logged with modifiers — those you can and should analyse.)
- **Back out Fast Healing, regeneration, AND flat/mythic resistance** before calling a creature "scaled" — read those fields from the full pack JSON *first* (step 1), don't discover them after publishing a verdict.
- **Compute template deltas from the book, not from the other creatures in the fight** — and check **Weak** as well as Elite.
- **Diff the payload (damage dice + ability list) separately from the chassis (HP/AC/saves).** A GM can leave one honest and rebuild the other.
- When the math contradicts a stat block (a low-level creature casting high-rank spells, or eating multiples of its book HP), trust the math and say the block was scaled/reskinned.
- Build name maps from the campaign roster each run — never assume a fixed cast.
- **Get the crit boundary right before counting any flips**: margin is measured against AC/DC and a crit is margin ≥ +10. Testing for `by +0` finds crit flips that can never exist.
- **Never report a single healing number.** Split in-combat from downtime; Treat Wounds is never in-combat.
- **Never report enemy critical-failure counts as party value** — a crit miss and a miss are the same outcome.
- **Never judge a support PC on damage share alone.** Run all five axes in *Judging a support character fairly*; leading with the damage column produces a verdict that is both wrong and demoralising.
- **State annotation coverage whenever you quote a flip count**, and extrapolate rather than pretending the provable number is the true one.
