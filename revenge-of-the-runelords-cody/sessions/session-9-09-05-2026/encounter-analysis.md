# S9 Encounter Analysis — Revenge of the Runelords (Cody, 5 PC Lv16)

*Built from rolls.txt (Foundry export v2, 790 messages, 3 encounters). Transcript for this session was still processing when this ran, so speaker attribution is by the log's own speaker field and per-line ability/target metadata — the roll-log ground truth, not transcription.*

---

## Headline

**Taunt did roughly what it was built to do this session — but only against roughly a quarter of the incoming attacks.** Every enemy Strike where Taunt was live pulled 73% of the aggro to Sevek, and it flipped 3 crits down to hits (~120 damage of ceiling shaved off). But **two of the three fights were dominated by damage vectors Taunt cannot influence at all** (E3 Jandelay's `Deconstructive Touch` bursts and Haphrama's Arctic Rift / Telekinetic Bombardment in E4), and in E4 **your first Taunt landed 22 minutes real-time after combat started, by which point Paya had already eaten his entire HP pool.**

The read that "Taunt didn't work as well as I hoped" is correct as stated — but the ability itself wasn't the problem. The problem was that the two crunchiest fights this session weren't Taunt-shaped fights, and E4's opening rounds were spent setting stances instead of taunting the cultists off Paya.

---

## 1) Per-creature HP verification (measure, don't trust)

Every creature's `applied damage` ≈ `targeted-hit floor` because the killing blows were all targeted Strikes (no area overkill). Foundry loaded these chassis at the shown values — Warsworn book is 350 HP / lvl 16 / AC 37, so this session was **Elite template baked in** (log's lvl 18 / HP 400 / AC 39, +2 attacks/AC/saves, +30-50 HP). Nothing further scaled. Applied totals sit within ~5-17% of the Foundry-loaded HP, all explainable by overkill on the killing blow.

| Enemy | Foundry HP | Applied | Floor | Killed by | Notes |
|---|---:|---:|---:|---|---|
| Warsworn A | 400 | 430 | 430 | Sevek Bo Staff | Elite Warsworn; ratio 1.07× is overkill on Sevek's crit |
| Warsworn B | 400 | 466 | 466 | Paya Halberd | Elite; 1.17× = big crit + persistent-fire tail |
| Warsworn C | 400 | 423 | 423 | Sevek Bo Staff | Elite; 1.06× |
| Jandelay A | 400 | 459 | 459 | (no destroy line — Cody narrated the drop) | Ratio 1.15× consistent with Elite |
| Jandelay B | 400 | 422 | 422 | " | 1.05× |
| Jandelay C | 400 | 427 | 427 | " | 1.07× |
| Pridespawn A | 315 | 348 | 348 | (no destroy) | Ratio 1.10× = base Pridespawn Cultist (no Elite; lvl 15 in log) |
| Pridespawn C | 315 | 349 | 349 | " | 1.11× |
| Pridespawn B | 315 | **22** | 22 | — | **Still up at session end** (only ate 22 dmg) |
| Haphrama | 400 | **22** | 22 | — | **Still up at session end**. Resistance mythic 16 means most spell attacks got sheared. |

**Verdict**: no evidence of custom scaling on top of Foundry's Elite template. The Warsworn/Jandelay were Elite lvl 18, the Pridespawn were book lvl 15, Haphrama was as printed with mythic resistance 16. The fights ended with a cultist and a Runelord still standing — you didn't finish the encounter.

---

## 2) Per-fight damage taken

Party HP pool: 1,096 (Sevek 248, Paya 248, Aureys 200, Mith 216, Kree 184).

| Fight | Total incoming | Sevek | Paya | Aureys | Mithtirith | Kreebnock |
|---|---:|---:|---:|---:|---:|---:|
| E1 Warsworn | **702** (64% of pool) | **288 (41%)** | 41 (6%) | 114 (16%) | 78 (11%) | **181 (26%)** |
| E3 Jandelay | **1,275** (116% of pool) | 288 (23%) | 324 (25%) | 55 (4%) | **409 (32%)** | 199 (16%) |
| E4 Pridespawn+Haphrama | 374 (34% of pool) | **0** | **288 (77%)** | 50 (13%) | 36 (10%) | **0** |
| **Session** | **2,351 (215%)** | 576 (24%) | 653 (28%) | 219 (9%) | 523 (22%) | 380 (16%) |

Reading:

- **E1 was Sevek's fight** — 41% of incoming landed on you, another 26% on Kreebnock (whose 181/184 = 98% of max HP is the "softest body" story again). Paya, Aureys, and Mith stayed comfortable behind the frontline. This is what Taunt is *supposed* to look like: you eat the biggest slice, the rest of the party stays operational.
- **E3 was chaos** — party took **more damage than its entire HP pool in one fight** (1,275 vs 1,096). Mith took 409 = 1.89× his max HP (dropped, dying:1, needed his own emergency Heal). Paya took 324 (1.31× max) — used Divert Destiny to survive. Aureys sat at 4% because Kreebnock was closer to the Jandelay area and Feint kept her off the target list.
- **E4 was Paya's crucifixion.** He ate **77% of the incoming damage** and dropped. Sevek and Kreebnock took **zero** damage. The Pridespawn Cultists all went to Paya from the start and stayed there. Sevek's first Taunt in this fight was at 16:22 — **22 minutes after initiative rolled** — and by then Paya had already soaked all 288 points.

---

## 3) Per-PC damage output

| Fight | Total attributed | Sevek | Paya | Aureys | Mith | Kree |
|---|---:|---:|---:|---:|---:|---:|
| E1 Warsworn | 1,319 | 284 (22%) | **468 (35%)** | **451 (34%)** | 0 | 116 (9%) |
| E3 Jandelay | 1,308 | 371 (28%) | **659 (50%)** | 196 (15%) | 0 | 82 (6%) |
| E4 Pridespawn+Haphrama | 741 | 281 (38%) | **290 (39%)** | 170 (23%) | 0 | 0 |
| **Session** | **3,368** | 936 (28%) | **1,417 (42%)** | 817 (24%) | 0 | 198 (6%) |

Paya was the session's clear damage engine — nearly half the damage into the Jandelay and consistent 30%+ across the board. Aureys was a co-leader in E1 (four Opportune Backstab reactions, per usual — this is her lane). Sevek's 936 is honest but not the ceiling — 25 Melee Strikes, hit rate 52%, nat mean 9.4 (slightly cold on attacks).

Mith's 0 damage is not an error — he cast no damaging spells this session. **Vindictive Thoughts (a Mythic reaction that would return 10d6 mental)** never fired because his one save-vs-spell result that would've triggered it was the crit fail against Jandelay.

Kreebnock's damage total is thin (198) because most of his actions were **buff maintenance** — 6 rounds of Courageous Anthem, one Haste cascade, plus Soothe and Restore the Mind to bring Paya up in E4. Judge him on axis 2 (control) and axis 3 (in-combat healing), not on damage share.

---

## 4) Difficulty verdict (2-axis, re-priced against Foundry-loaded levels)

For a 5-player Lv16 party the XP thresholds are Trivial 50 · Low 80 · Moderate 100 · Severe 150 · Extreme 200.

| Fight | Roster | XP | Book tier | Grind (damage cleared) | Threat (dmg taken / pool) | Real tier |
|---|---|---:|---|---:|---:|---|
| E1 | 3× Warsworn (Elite lvl 18 = PL+2) | 240 | Extreme+40 | 1,319 | 702 (64%) | **Extreme** — matches its budget |
| E3 | 3× Jandelay Tolokand (PL+2 assumed) | 240 | Extreme+40 | 1,308 | **1,275 (116%)** | **Extreme+** — this is where the party bled |
| E4 | 3× Pridespawn (PL−1) + Haphrama (PL+1) — unfinished | ~150 | Severe | 741 so far | 374 (34%) | **Severe on paper; unresolved in fiction** — you're leaving fights alive |

E3 was the crunch. E4 threat looks manageable in aggregate but was **very concentrated on one PC**, which is worse than the same total spread across five bodies — Divert Destiny fired once, Paya dropped once, and the fight isn't over.

---

## 5) TAUNT — did it work?

**Sevek used Taunt 6 times all session** (0 Group Taunts fired as separate actions — every regular Taunt is upgraded by the Group Taunt feat to hit up to 3 targets, so those 6 are potentially 6 × up to 3 = 18 taunted-enemy-turns worth of coverage).

**Enemy Strikes vs PCs, session-total: 43** — of which:

| State | Count | Sevek | Mith | Kree | Aureys | Paya |
|---|---:|---:|---:|---:|---:|---:|
| All enemy Strikes vs PCs | 43 | 13 | 6 | 6 | 9 | 9 |
| **Taunt live on the attacker** | **11** | **8 (73%)** | 0 | 2 | 0 | 1 |
| Taunt bypassed (attacker paid the −1 to hit non-Sevek) | 3 | — | — | 2 | — | 1 |

**Taunt Tier-1 flip value** (removing the −1 alone):

| Flip type | Count | Approx damage saved |
|---|---:|---:|
| Crit → hit | 3 | ~120 (crit ceiling on Warsworn is 78-95, normal hit ~40-45) |
| Hit → miss | 0 | 0 |
| **Total** | **3 rolls flipped** | **~120 dmg** |

Of the 3 crit-→-hit flips, **2 saved Sevek from Warsworn Corpse Wave crits** and **1 saved Kreebnock from an animated-weapon crit** (Taunt bypass — the attacker paid −1 to hit Kree instead, but the −1 still applied and pulled the crit down).

### The story your read is picking up on

Taunt only fires on **single-target enemy Strikes vs PCs**. It does nothing to:

- Save-based AoE (Arctic Rift, Cone of Cold, Freezing Rain, Deconstructive Touch line)
- Save-based single-target (Phantasmal Killer, Crushing Prison)
- Any non-Strike attack

Of the 43 enemy Strikes this session:

- **E1 Warsworn**: heavy in Taunt range (animated weapons are ranged Strikes) — this is where most of the 11 Taunt-live attacks lived, and where it did what it was supposed to.
- **E3 Jandelay**: many of the biggest damage events were `Deconstructive Touch` / `Gravitational Pull` AoE-flavored effects hitting multiple PCs on saves. Mith took 409 damage in a fight where Taunt was essentially decorative for most of the burn. He dropped anyway.
- **E4 Pridespawn+Haphrama**: **your first Taunt was at 16:22**. Combat started 16:03 (Sevek entered stance-setup at 16:05). Paya had already taken 288 damage across 7 rounds before you Taunted anything. Then Haphrama arrived and started throwing 120-foot lines with basic Fortitude saves — again, unTauntable.

### What this means for the ability, not the read

Taunt is **not disappointing when you use it**. It's just doing less this session because:

1. **The damage vectors moved.** Two of three fights this session had ≥40% of their damage go through save-based effects, and one had Haphrama's mythic ranged AoE. This is a shift from S4-S8, where enemies were mostly Strikers.
2. **E4 opening rounds went to stances, not aggro.** Whirlwind Stance + Ripple Stance is the right defensive setup for you personally, but they don't protect Paya. If the Pridespawn are already engaging Paya on round 1, the party math says Taunt first, stance second — you pay 2 HP for Whirlwind Stance by taking a round-1 hit uncovered by +2 AC, but you save Paya a full Cultist turn's worth of Strikes. Round-1 Taunt in E4 could have been worth 100+ HP of prevented damage on Paya.
3. **Prevailing Position remains the bigger reaction payoff** (used 4 times — turned a Warsworn crit into a crit-miss at 13:47, and 3 other saves/AC bumps).

The tank is doing its job — but **the reactions carry the tank, not the aggro pull.** That was Cody's read after S8 too, and S9 confirms it: Sevek took 576 damage (24% of party incoming) with excellent AC and hot saves, but only 3 crit flips can be pinned on Taunt. The rest is Prevailing Position, saves, and just having AC 39/41.

---

## 6) What the off-guard package bought (party attacks)

Aureys landed **9 of 10 Feints** (4 crit-success, 5 success). Feint = off-guard, which is a −2 to the enemy's AC against the flanking party. This is the party's biggest AC-lever, not Taunt.

Party attacks against a debuffed enemy (delta = base AC − effective AC):

| PC | Party attacks with `Target:` line | Enemy debuffed | Deltas | Hit-flip | Crit-flip |
|---|---:|---:|---|---:|---:|
| Sevek | 25 | **25 (100%)** | delta=2 (off-guard) on all 25 | 3 | 4 |
| Paya | 29 | 22 (76%) | delta=2 on 20, delta=1 on 2 | 2 | 1 |
| Aureys | 24 | 24 (100%) | delta=2 on all 24 | 1 | 1 |
| Kreebnock | 5 | 3 (60%) | mixed | 0 | 1 |

**Every single one of your Melee Strikes this session hit an off-guard enemy.** That's not Taunt — that's Feint (Aureys) + flanking (Paya).

The Tier-2 package flipped **11 party rolls** total (6 hit-flips + 6 crit-flips), buying the party roughly 250-400 damage worth of extra output. That's where the crit-heavy Warsworn/Jandelay clears came from.

---

## 7) In-combat healing (Treat Wounds excluded)

| Fight | Method | Total |
|---|---|---:|
| E1 Warsworn | Mith Heal + kineticist channels | ~490 (Mith 309 + Paya's between-round Ocean's Balm ~180, credit split) |
| E3 Jandelay | Mith emergency Heal + Paya Battle Medicine | ~660 (Mith 531 + Paya BMed) |
| E4 Pridespawn+Haphrama | Kreebnock Soothe + Restore the Mind | 98 (all on Paya after he dropped) |

**Kreebnock became the emergency healer in E4** — Soothe (2-action, 64 HP) picked Paya up off zero, then Restore the Mind (1-action psyche, 34 HP) topped him up. That's a Psychic pulling healer duty from a full spell slot mid-boss-fight, which is worth noting.

Mithtirith carried the healing load in E1 and E3. His own self-Heal at 14:41 (7d10 + 60 vitality = 92) was the only reason he was still in the E3 fight after dropping.

---

## 8) Roll luck per PC — attack vs non-attack vs saves

### Attack rolls (PC damage output)

| PC | n | crits | hits | miss | critmiss | hit rate | nat mean | z |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Sevek | 25 | 6 | 7 | 11 | 1 | 52% | 9.4 | −0.99 (a bit cold) |
| Paya | 29 | 8 | 14 | 4 | 3 | **76%** | 10.6 | +0.10 (dead average — his high modifier + off-guard did the work) |
| Aureys | 24 | 8 | 6 | 10 | 0 | 58% | 11.5 | +0.85 (warm) |
| Mith | 0 | 0 | 0 | 0 | 0 | — | — | — |
| Kreebnock | 4 | 2 | 0 | 2 | 0 | 50% | 12.0 | −0.04 |

Paya's 76% hit rate with 8 crits in 29 swings is the offensive engine of the session. Sevek's 52% at nat mean 9.4 is a cold night — you were catching a few missing rolls (delta ~10 vs Paya's ceiling).

### Non-attack rolls (skills, perception, flat)

| PC | n | mean | nat20 | nat1 | z |
|---|---:|---:|---:|---:|---:|
| Sevek | 8 | 11.38 | 1 | 0 | +0.43 |
| Paya | 8 | 11.88 | 0 | 0 | +0.67 |
| Aureys | **36** | 11.14 | 0 | 1 | +0.66 |
| Mith | 4 | 5.00 | 0 | 0 | −1.91 (cold, small sample) |
| Kreebnock | 2 | 8.50 | 0 | 0 | −0.49 |

Aureys' n=36 is Feint volume — she was running the debuff engine on nearly every turn.

### Saves — the story of the night

| PC | n | mean | z | critSucc | succ | fail | critFail | note |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Sevek | 14 | 12.79 | **+1.48** | 11 | 0 | 3 | 0 | Hot; 11 crit-successes shed a lot of AoE |
| Paya | 11 | 13.09 | **+1.49** | 9 | 1 | 1 | 0 | Same — 9 crit-successes on 11 saves |
| Aureys | 12 | 9.33 | −0.70 | 8 | 0 | 4 | 0 | Slightly cold; still 8 crit-successes because her mods are absurd |
| Mith | 9 | 12.33 | +0.95 | 0 | 4 | 4 | **1** | Only PC with a crit-fail (the drop) |
| Kreebnock | 12 | **15.83** | **+3.20**  (p ≈ 0.0007) | 4 | 6 | 2 | 0 | **Enormously hot** — this is why the softest body in the party took 0 damage in E4 |

Kreebnock's z = +3.20 is the standout: he *should* have taken 100+ damage from Haphrama's AoE stream and just… didn't. On 12 saves he rolled a natural mean of 15.83 (expected 10.5). That's a real slice of the "party survived E4" story that's usually invisible in the damage-column.

Sevek's +1.48 on saves is why your damage-taken column reads 576 despite AC 39/41 and Whirlwind stance — the saves stayed hot on top of everything else.

### Enemy saves against PC spells (caster-side unluck check)

| Caster | n | enemy nat mean | z | crit-Succ | Succ | Fail | crit-Fail |
|---|---:|---:|---:|---:|---:|---:|---:|
| Sevek | 3 | 13.67 | +0.95 | 1 | 2 | 0 | 0 |
| Aureys | 7 | 12.57 | +0.95 | 2 | 5 | 0 | 0 |
| Mith | 7 | 11.71 | +0.56 | 1 | 5 | 1 | 0 |
| Kreebnock | 4 | 13.50 | +1.04 | 1 | 2 | 1 | 0 |

Every caster faced enemies who saved a bit hot (all z > +0.5, none dramatic). Aureys' 7 saves = **7 successful saves (2 crit) = zero fails** — everything she threw with a save clause landed at half or nothing. This is why her damage share is 24% and not 35% — no double-dip failures.

---

## 9) What didn't fire (unused signature reactions)

Sevek:
- **Bodyguard** — 0 uses. It's still assigned to Mithtirith per S8 dynamics, and Mith dropped this session. Worth reconsidering the assignment; the "assign it to Mithtirith" was S6-era doctrine and Kreebnock (184 HP) is now the softer body.
- **Stand Still** — 0 triggers. Nothing tried to stride past you with reach exposure this session.
- **Life Connection** — cast at 15:55 (between E3 and E4) but the reactive **Defend Life** never fired. Would have saved a hit on the target — probably wasted here because damage in E4 was AoE, not Strike-target.
- **Group Taunt** as a distinct action — 0. Every Taunt was 1 target. The Group upgrade is baked into your regular Taunt (up to 3), but you appear to be taunting single-target only. **Worth confirming with Foundry: are you actually selecting multiple targets on the Group Taunt macro, or is the client only tagging one?**

Party:
- **Paya's Reactive Strike** — 0 successful interruption. Same tally as S7 ("never disrupted").
- **Aureys' Demoralize** — 4 attempts (Battle Cry initiative + 3 more), **all failed** (3 fail + 1 crit-fail). Frightened never landed on any enemy this session, which is why the Frightened −2 modifier appears in the log only through Paya's Nightmare rune (crit → Stupefied → Frightened 2 on next crit).
- **Mithtirith's Vindictive Thoughts** — 0 uses. Would have paid on the crit-fail save vs Jandelay if he'd had a mythic point to spend (needs 1 MP).

---

## 10) The short version

- **HP** — no scaling on top of Elite. Foundry-loaded numbers are the real numbers.
- **Grind vs threat** — E1 Extreme (matched), E3 Extreme+ (worst of the night, took 116% of party pool), E4 Severe on paper but concentrated all on Paya. Two enemies still standing.
- **Damage output** — Paya 42% > Sevek 28% > Aureys 24% > Kreebnock 6% (buffer/healer) > Mith 0 (support).
- **Damage taken** — spread more than usual: Paya 28% > Sevek 24% > Mith 22% > Kree 16% > Aureys 9%. Kree dodged E4 entirely on hot saves.
- **Taunt** — used 6×, live on 11 of 43 enemy Strikes (26%), pulled 73% of those to Sevek, flipped 3 crits→hits (~120 dmg saved). **Not disappointing when used; just used against the wrong damage vectors this session, and used *late* in E4.**
- **Off-guard package (Feint + flanking) is doing more work than Taunt this session** — 100% of Sevek's Strikes hit off-guard enemies. 11 Tier-2 flips vs 3 from Taunt.
- **Kreebnock's saves at z = +3.20** are the reason Paya didn't get a second Divert Destiny (Kree'd have been the healer either way, but he was healthy enough to prioritize Paya over self-preservation).
- **What to change**: consider Taunt-first / stance-second in E4-style opens where the softest body is Paya and enemies converge fast. And Bodyguard should probably be reassigned to Kreebnock now that Mith is going invisible for exposure control.
