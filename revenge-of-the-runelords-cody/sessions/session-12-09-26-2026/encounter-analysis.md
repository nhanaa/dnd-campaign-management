# Session 12 — Encounter Analysis & Roll Luck

**Sources**: `rolls.txt` (foundry-export v2, one header, no double-paste), the S12 transcript, and the full pack JSON for `dream-aethusa`, `elder-shantak`, `trinity-star` (RotR book 2) and `mirage-dragon-ancient` (Monster Core). Level benchmarks are medians over ~1,400 local NPC blocks. **Party**: five PCs, level 17, HP pool **1,162** (Sevek 263 · Paya 263 · Mithtirith 229 · Aureys 212 · Kreebnock 195). Enemy modifiers are **visible** in this log, so enemy luck is measured, not assumed.

---

## Headline

1. **The Aethusa fight was the dangerous one.** The party absorbed **~99% of its HP pool** across the dragon, Aethusa and the Trinity Star, and **needed 701 points of in-combat healing** to finish with nobody down. Paya alone took **434 in one fight, 165% of his max HP**.
2. **The Shantak fight was the most scaled encounter of the night, but it played easy.** The book creatures are level 15 (Trivial–Low on budget). They were run at roughly **level 19**: HP ×1.57, +4 to hit, damage ×1.37, Screech DC +4/+5. That prices well past Extreme, yet it cost the party only **28% of its pool in three rounds**. Two things did it: **action denial** (Trips, the blind, Taunt) and **the Shantaks blocking their own Screech cones**.
3. **Luck was mixed and mostly came out in the party's favour.**
   - **Party saves ran hot**: mean natural 12.0, z +1.73, p ≈ 0.04. That was worth **~420 fewer raw damage** than a world where everyone rolls a 10.
   - **Party attacks ran cold**: 34 hits against 37.1 expected, 8 crits against 10.9. Almost all of that shortfall is **Aureys**.
   - **Enemy attacks ran hot** (13 hits against 10.0 expected); **enemy saves ran slightly cold** (about +66 damage for the party).

---

## 1. Creatures — defence (book → as run)

| Creature | Book lvl | HP | AC (clean, from CTX + conditions) | Saves F / R / W | Perception | Notes |
|---|---|---|---|---|---|---|
| **Dream Aethusa** | 18 | 330 + **mythic resist 18** → **500 exact**, **resistance never applied** | 41 → **43** | 29/33/35 → **31**/33/35 | 33 → **36** | Mythic Resilience (Will) worked as printed: Agitate's raw fail became a success |
| **Mirage Dragon (ancient)** | 18 | 345 → **450 exact** | 41 → **42** | 28/29/33 → 28/29/— | 33 → 33 | Book block, no resistances |
| **Elder Shantak ×3** | 15 | 255 → **400 exact** | 37 → **39** | 29/23/27 → **31/26/30** | 27 → **31** | Resist cold/sonic 15 never tested |
| **Trinity Star** (hazard) | 18 | 120 / hardness 30 / AC 42 → same | — | — | — | Weapons bounced, as the book says |

**The Aethusa HP swap nets out.** Her book block has 330 HP plus **mythic resistance 18 on every hit**. The party landed about 14 damage applications on her, so the book version would have absorbed roughly **330 + 250 ≈ 580 effective HP**. Cody ran her at **500 with no resistance**. That is *not* an HP inflation; if anything she was slightly softer than the book (Sevek's 44-point roll → "takes 44").

## 2. Creatures — offence (book → as run)

| Creature | Strike | Damage per hit (avg) | Save effects |
|---|---|---|---|
| **Dream Aethusa** | Bec de corbin +34 → **+37** | 3d8+13 (26.5) → **~48 per hit** with cold/elec/fire riders (**×1.8**); Blink Charge crit **84** | Spell DC 40 → **43**. Book top rank 9 → **Cataclysm (rank 10)**. **Cataclysm, Eclipse Burst, Arctic Rift, Blink Charge, Sure Strike and Shield are not on her printed list.** She also quickened a rank-7 Eclipse Burst; the book caps Quickened Casting at 6th rank |
| **Mirage Dragon** | Tail +31 → **+35**; jaws +33 → +36 | Tail 3d8+15 (28.5) → **4d10+22 (44), ×1.54** | Hallucinatory Breath 17d6, DC 41 → **42** |
| **Elder Shantak** | Jaws / claw +30 → **+34** | Jaws 3d12+15 (34.5) → **4d12+21 (47)**; claw 3d8+15 (28.5) → **4d8+21 (39)**, **×1.37** | Screech 15d6, DC 33 → **37 / 38**; stuns on a fail |
| **Trinity Star** | — | Routine 6d6 / 11d6 → **10d6 / 20d6 (×1.7)** | Routine DC 42 → **44**. **Starform fired at once**; the book triggers it 10 minutes after death |

### Template verdicts
- **Dream Aethusa**: Elite-plus chassis (+2 AC, +3 attack, DC and Perception), HP traded for the dropped resistance, and a **rebuilt payload** (rank-10 Cataclysm, off-list AoEs, ×1.8 Strike damage). Cody's usual signature: an honest-ish chassis with an upgraded payload.
- **Mirage Dragon**: book defence (+1 AC), HP ×1.3, **offence rebuilt** (+4 to hit, ×1.54 damage).
- **Elder Shantak**: **Elite twice over on every axis**, plus HP ×1.57. The most scaled creature of the session.
- **Trinity Star**: payload up on every axis (+2 DC, ×1.7 damage), and it arrived instantly instead of after the 10-minute delay.

### Per-axis level profile

| Creature | AC reads as | DC reads as | Attack reads as | HP reads as | Book |
|---|---|---|---|---|---|
| Dream Aethusa | L19 | **L20–21** | L20 | L24 (but no resist) | L18 |
| Mirage Dragon | L18 | L20 | L18 | **L22** | L18 |
| Elder Shantak | L16 | L17 | **L18–19** | **L21** | **L15** |

## 3. Per-fight difficulty

| Fight | Enemy HP cleared | Damage taken (% of 1,162 pool) | In-combat healing | Who ate it | Rounds |
|---|---|---|---|---|---|
| **Dragon + Dream Aethusa** | 950 | **973 (84%)** | **701** (Mithtirith 459 · Sevek self 103 · Paya self 103 · Kreebnock self 36) | **Paya 434**, Sevek 252, Kreebnock 120, Mithtirith 104, Aureys 63 | 6 |
| **Trinity Star** | hazard (3 tails) | 181 (16%) | 36 | Paya 69, Sevek 65, Kreebnock 47 | 2 routines |
| **Elder Shantaks** | 1,200 | 324 (28%) | 86 (Mithtirith) | Kreebnock 113, Paya 95, Sevek 88, Mithtirith 28, **Aureys 0** | **3** |

> Includes the damage deducted by hand at the table: Mithtirith's Cataclysm (33) and Kreebnock's Falling Stars (44).

### Two-axis verdict and budget (party level 17, five players: Low 80 · Moderate 100 · Severe 150 · Extreme 200)

| Fight | XP at book levels | XP at as-run levels | Grind | Threat | I believe |
|---|---|---|---|---|---|
| Dragon + Aethusa (+ Trinity Star) | 120 (**Moderate**), 180 with the hazard (**Severe**) | ~200–240 (**Extreme**), more with the hazard | High | **Severe–Extreme**: ~99% of pool, nobody dropped only because of 701 healing | **The empirical side.** It was a real Severe–Extreme fight |
| Elder Shantaks | 60 (**Trivial / Low**) | ~240 (**beyond Extreme**) | High (1,200 HP) | **Moderate**: 28% of pool | **Neither XP number.** It was built Extreme and played Moderate |

**Why the Shantaks underperformed their stat blocks:**
- **They blocked their own breath.** B couldn't Screech without catching its allies, and C had to angle its cone onto only Kreebnock and Mithtirith.
- **A spent its turns standing up.** Sevek crit-tripped it; when it stood, Stand Still blinded it; the blind then cancelled a claw crit on Paya.
- **Taunt went on all three** in round one.
- **The party deleted 1,200 HP in three rounds.** Paya and Aureys each crit on turn one, and Sevek's round-3 turn did 269. Enemy attacks rolled *hot* (see §7) and it didn't matter.

**The crit-fail counterfactual on the biggest AoE, Cataclysm (DC 43 as run vs 40 at her book spell DC).** The chance that at least one of the five critically fails its Reflex save (double damage) is **64% at DC 43 against 31% at DC 40**. The actual roll produced **Aureys on a natural 1** (194 raw), which she converted with **Draconic Salvation**. The +3 DC roughly doubled the odds of someone eating a double Cataclysm.

## 4. Damage contribution (applied, overkill-capped by the HP bars)

| PC | Dragon + Aethusa | Shantaks | Session | Share |
|---|---|---|---|---|
| **Paya** | ~425 | ~306 | **~731** | 34% |
| **Sevek** | ~213 | **~450** | **~663** | 31% |
| **Aureys** | ~253 | ~220 | ~473 | 22% |
| **Mithtirith** | ~30 | ~135 | ~165 | 8% |
| **Kreebnock** | ~30 | ~89 | ~119 | 6% |

Kills: Paya 3 (dragon, Aethusa, Shantak C) · Aureys 2 (Shantaks A and B). Sevek put **269 into Shantak C in one turn**, from 303 down to 34, before Paya's finisher.

Kreebnock's and Mithtirith's shares aren't the measure of their night:
- **Kreebnock**: Falling Sky grounded the dragon, Weight of the World stunned Aethusa, and he cast Haste twice.
- **Mithtirith**: **545 in-combat healing**. His three-action Heal delivered 49 × 5 = 245 in one cast, and Restorative Channel stopped a confused Paya.

## 5. What the control package bought

Foundry's modifier-matters tags record **14 Tier-1 (ESSENTIAL) flips**, meaning rolls whose outcome tier changed because of that one modifier. Annotation coverage is sparse, so treat this as a floor.

| Source | Flips | Notable |
|---|---|---|
| **Off-guard** (flanking, Sevek's trips, Aureys' Feint) | 7 | Includes **Sevek's round-3 crit on Shantak C** and Aureys' opening Opportune Backstab |
| **Frightened** (Aureys' Battle Cry and Majestic Presence) | 3 | **Also on Sevek's round-3 crit.** With off-guard it made the second Flurry strike a crit instead of a hit |
| **Clumsy** (Aureys' Earth to Heavens Strike) | 2 | Turned Paya's exact-AC hit on the dragon (39 vs 39) from a miss into a hit for 44 |
| Reflective Ripple Stance | 1 | Sevek's opening crit Trip on Shantak A |
| Courageous Anthem | 1 | Paya's last Shantak strike |

**The one to remember**: Sevek's big turn crit only because **Aureys had frightened C and Sevek's own Rippling Spin had left it off-guard and prone.** Without both, the 156-point Flurry is a hit+hit worth about 100.

## 6. Roll luck — party (first die on rerolls)

z > 0 means above the expected 10.5. With n under 10, read the direction, not the p.

| PC | Attacks | Maneuvers (Trip / Grapple / Feint / Demoralize / Bon Mot) | **Saves** | Skills (incl. research) | Initiative |
|---|---|---|---|---|---|
| **Sevek** | n18 · 11.2 · z +0.53 | n5 · 10.8 · **5/5 succeeded** | n9 · **13.8 · z +1.71** · two nat 20s | n6 · 11.0 | n3 · 10.0 |
| **Paya** | n22 · 10.7 · z +0.18 | — | n9 · **8.7 · z −0.95** (nat 2, nat 3) | n5 · 12.0 | n3 · 9.0 |
| **Aureys** | n17 · **7.8 · z −1.91 (p .03)** · 0 nat 20s, 2 nat 1s | n5 · 10.4 | n9 · 12.4 · z +1.01 | n11 · 10.5 | n2 · 12.0 |
| **Mithtirith** | n2 · 14.5 | — | n8 · 12.8 · z +1.10 | n5 · **6.8 · z −1.43** | n3 · 13.3 |
| **Kreebnock** | n3 · **4.7** · two crit misses | n2 · 10.0 | n8 · 12.6 · z +1.04 | n5 · 7.2 · z −1.28 | n3 · 13.7 |
| **Party** | n60 · 9.9 · z −0.81 | n12 · 10.5 · z 0.00 | **n43 · 12.0 · z +1.73 (p .04)** | n32 · 9.7 · z −0.77 | n14 · 11.6 |

### Attacks: expected vs actual (same modifiers and effective AC)

| Roller | Hits (expected) | Crits (expected) |
|---|---|---|
| Paya | 15 (14.2) | 5 (4.4) |
| Sevek | 10 (9.4) | 2 (2.2) |
| **Aureys** | **8 (11.6)** | **1 (3.6)** |
| Kreebnock | 1 (2.0) | 0 (0.6) |
| **Party** | **34 (37.1)** | **8 (10.9)** |

- **Paya's "suspicious" rolls were dead on expectation.** Cody's comment came from the back-to-back dragon crits; across the session he hit and crit exactly as often as his modifiers predict.
- **Aureys had the coldest attack dice at the table**: 3.6 hits and 2.6 crits short, with no natural 20 on any attack all session. Her saves ran warm, though, and she still took the least damage.
- **Sevek was on expectation on attacks and hot on everything that protected him.** His saves were the best in the party (mean 13.8), and his maneuvers went 5 for 5. The four-miss turn against the dragon was variance inside an average session.

### Save luck → damage (counterfactual: every save rolled a natural 10, same modifiers and save upgrades)

| PC | Raw damage vs a nat-10 world | Where it came from |
|---|---|---|
| **Mithtirith** | **−123** | Cataclysm success; a natural 20 against Trinity Star routine #2 (avoided 74) |
| **Kreebnock** | **−103** | Natural 20 on Eclipse Burst; successes on Cataclysm and Arctic Rift; offset by Screech (nat 6) and Falling Stars (nat 5) |
| **Sevek** | **−90** | Natural 20 on Falling Stars; both Trinity Star routines saved |
| **Aureys** | **−77** | Nat 20 on Phantasmagoria, crits on Arctic Rift and routine #1; offset by Falling Stars (nat 2). **Separately, her natural 1 on Cataclysm (194 raw) was erased by Draconic Salvation**, not luck |
| **Paya** | **−29** | Cataclysm and routine crits (−154) almost cancelled by **nat 2 on Falling Stars and nat 3 on Arctic Rift (+125)** |
| **Party** | **≈ −420** | About 36% of the party's HP pool that the dice kept off |

**The Trinity Star is where save luck mattered most.** At DC 44 (book 42) almost everyone fails on a natural 10, and failure means 20d6 plus prone. The party's actual rolls turned most of those into successes or crits.

### Other d20 rolls
- **Research mythic rerolls (9)**: 6 improved, 1 unchanged, 2 got worse. Aureys went 6 → 2, and Paya rolled 9 → 9. **Sevek's 8 → 19 is the one that crossed the first threshold.**
- **Dream-travel check**: Sevek natural 16 on Religion (45) was the only success. The other four rolled 29–39.
- **Flat checks**: Dream Aethusa's dazzled targeting for Phantasmagoria failed **2 of 5** (DC 5), which is **double the 20% expectation**. The two failures were **Paya and Kreebnock** (Cody, on-mic: *"Can't target Paya… Can't target Kreebnock"*; the log files both checks under Paya), so neither had to save against a 16d6 mental spell. Shantak A's blind checks went 1 for 2, and the failure **cancelled a claw crit on Paya** (roughly 78 avoided). Aethusa failed her bleed recovery **3 of 3**, for 24 bleed damage off Kreebnock's Weight of the World. Kreebnock's Unexpected Shift flat check failed (took 37).

## 7. Roll luck — enemies

| Enemy | Attacks | Saves vs party effects |
|---|---|---|
| Dream Aethusa | n3 · 14.3 (3 of 3 hit, 1 crit) | n5 · 10.6 |
| Mirage Dragon | n5 · 10.6 (4 of 5 hit) | n2 · 9.5 |
| Elder Shantak A | n2 · 16.5 (both hit, 1 crit) | n4 · 7.5 |
| Elder Shantak B | n4 · 11.5 | n4 · **6.3** (a natural 1 on Majestic Presence) |
| Elder Shantak C | n2 · 13.0 | n5 · 13.0 |
| **All enemies** | **n16 · 12.6 · z +1.43 · 13 hits vs 10.0 expected** | **n20 · 9.6 · z −0.70** |

- **Enemy attacks ran hot**, about 3 more hits than expected, yet the fights still came in at 84% and 28%. That makes both verdicts stronger, not weaker.
- **Enemy saves against party effects**: about **+66 raw damage in the party's favour**. The big swings were **Shantak A's natural 2 against Aureys' Aether Beam** (+60, the kill) and **Shantak B's natural 2 against Arrow Salvo** (+27). Two other rolls went against the party: Electric Arc (−12) and Arrow Salvo on A and C (−27).
- **Condition swings**: Shantak B's **natural 1 against Majestic Presence** meant frightened 4 instead of nothing, and that frightened set up Aureys' killing claw crit. Dream Aethusa's Mythic Resilience turned Agitate's failure into a success.

## 8. What didn't fire

- **Dream Aethusa**:
  - **Recharge** was never used, and neither was her printed arsenal of Confusing Colors, Warp Mind, Phantasmal Calamity and Paralyze.
  - **Only 1 of her 3 Mythic Points was observed spent**: removing prone after Sevek's Rippling Spin. She may have died with two left.
  - Steady Spellcasting was never tested.
- **Mirage Dragon**:
  - Recharged Hallucinatory Breath and **never breathed again**; Falling Sky grounded it and it died two rounds later.
  - **No spells, no Draconic Frenzy, no Lunging Bite.**
- **Elder Shantaks**:
  - **Flying Strafe** was never used.
  - **Screech was blocked by their own positioning** once and angled away from Sevek once.
  - Their cold and sonic resistance never came up.
- **Party**:
  - **Heroic Presence** (still unused).
  - The Bear Hug crit rider (the Grapple was a success, not a crit).
  - Aureys got no Opportune Backstab crits all session.

---

### Caveats
- **Damage figures** are Foundry's applied numbers, plus the two table-deducted amounts noted in §3. Hand-typed damage elsewhere may be missing.
- **Counterfactuals use raw rolled damage**, ignoring Energy Aegis, Scintillating Safeguard and other resistances; they measure luck, not exact HP.
- **Falling Stars** is treated as one packet, although Kreebnock avoided the bludgeoning half.
- **Flip counts cover only rolls Foundry annotated.** Treat 14 as a floor.
- **As-run levels are per-axis readings**, not an official template.
