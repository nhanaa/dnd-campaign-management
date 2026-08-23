# Session 7 — Encounter Analysis (2026-08-22)

*Measured from the Foundry export (`rolls.txt`, 282 d20 rolls, 109 damage applications, 23 heals) and the transcript. Book values are the Book 2 *Crypt of Runes* JSONs, read in full. Three PCs, no cleric; party level 15.*

**Headline:** Cody ran the **supporting cast scaled well past Elite** — the kraken callers, Maddenmist, the tsunami, and Quoroc all measure 1.3–2.1× their book HP with attack bonuses 4–9 above book — and ran the **two bosses at or under book on defenses**, with Baolen's mythic resistance switched off. By the party's *empirical* enemy levels, four of the six fights price as **Extreme** for a 3-PC table, and the party cleared all six in ~2h25m of table time with no one dropped. The reason is not dice: the players' attack dice averaged **10.1** (slightly cold) and Cody's averaged **9.5**, with his bad night concentrated entirely in the Baolen fight (mean 7.6, median 5) and in his persistent-damage recovery checks (mean 6.0). What won the day was **control censoring the enemy's best material** — of Baolen's fifteen printed abilities, he used four; Maddenmist never cast a single spell from his printed list.

---

## 1. Per-creature: book vs. measured

| Creature | Book (lvl · HP · AC · atk) | Measured (AC · atk · saves) | HP floor → bracket | Verdict | Eff. level |
|---|---|---|---|---|---|
| **Zutha's Legacy** (hazard) | 18 · 120 HP · AC 45 / hardness 30 · disable DC 45–48, **6 successes** | AC 40 · Stealth +48 · disable **DC 42, 4 successes**; damage through hardness 9/10/18 on ~40-pt swings (hardness ≈ 30 ✓) | 37 dealt (never the plan) | **Run easier than book** — DCs −3 to −6, successes 6→4, routine 4 actions→2 (then 3). Scaled *down* for three PCs. | 18 chassis, ~16 difficulty |
| **Clockwork Whale** | 17 · 315 · AC 40 · Jaws +33 · Gearsong DC 38 · phys. resist 15 | AC 38 · Jaws +31 · DC 36 · 15d6**−2** | targeted **319** alive → dead at 338 → **HP ∈ [319, 338]** | **Weak template on offense/defense** (every number −2, the `−2` damage is the fingerprint) **but HP at or above book** (Weak would be 295). Mixed. | 16–17 |
| **Kraken Caller A/B** (×2, twice) | 11 · 195 · AC 31 · Trident +24 · Jaws +23 · Will +19 · Perc +21 | AC **33–34** · Trident **+29** · Jaws **+28** · Will **+21** · Perc **+25** | floors **272 / 301** (workshop), **297 / 219** (vault; B killed by Aether Beam → [219, 289]) | **Scaled, not Elite.** Elite = AC 33 / +26 / 215 HP. Observed +29 attack and ~290 HP are ×1.5 book. No resistance/regen in the JSON to explain it. | **~14** |
| **Maddenmist** | 14 · 251 · AC 36 · Jaws +26 · spell DC 34 / atk +26 · top rank 7 | AC **39** · Jaws **+31** · spell atk **+30** / DC **37** · Will **+30** | targeted **434** (dead on the 434th point — Paya's 106 crit from 328) → **HP ∈ [329, 434]** | **Scaled ×1.3–1.7 plus an upgraded spell payload**: cast **Desiccate r8** and **Polar Ray r8** — neither is in his book list (top rank 7). Elite would be AC 38 / +28 / 271. | **~17** |
| **Elemental Tsunami** | 11 · 195 · AC 31 · Wave +24 · Surge 5d12+6 · fire resist 10 | AC **38** · Wave **+33** · Surge 5d10+**18** · Perc **+30** · Will +25 | targeted **311** alive → dead at 418 → **HP ∈ [312, 418]** | **Scaled ×1.6–2.1, +7 AC, +9 attack.** This is a level-16 chassis wearing a level-11 name. Fire resistance 10 did apply (Sevek's 116 → 107). | **~16** |
| **Quoroc** | 15 · 270 · AC 37 · Arm/Beak +29 · Will +23 · cold resist 15 | AC **36** · Arm/Beak **+33** · Will +25 · Perc +29 | targeted **336** alive → dead at 367 → **HP ∈ [337, 367]** | **Attacks scaled +4, HP ×1.3, AC actually −1.** Custom, not a template. | ~16 |
| **Baolen** | 18 · 360 · AC 42 · +37 · Fort 35 / Ref 28 / Will 31 · Perc 31 · **mythic resist 9**, cold 10, poison 20 | AC **40** · +34 · Ref **+26** · Will **+29** · Perc +29 · **no resistance applied** (Electric Arc 17 rolled → 17 taken) | alive at **371** targeted; **Undying Myth fired at 388**; then **209 more** to kill → **pre-Myth HP ∈ [372, 388]**, 50% refill ≤ 209 → **max HP ≤ 418** | **Defenses under book (~Weak), resistance off, HP ≈ book+10–28.** The scariest number on his sheet — mythic resistance 9 on every hit — never existed at the table. | 18, run soft |

*Floors are the highest running total reached by a single-target hit; area hits (Electric Arc, Aether Beam) can clip a corpse and are bracketed. Persistent-damage ticks are counted but flagged.*

**The pattern:** everything below boss tier got +4 to +9 on attack and 30–110% more HP; the two bosses were run at or below book. That matches what Cody said at the end of the night almost word for word — *"this is after I buffed things to hell and back… I was expecting more powerful abilities with this guy"* — he buffed the minions, was disappointed in the kraken's printed kit, and the party never let the kraken show it.

---

## 2. Per-fight ledger

| # | Fight | Rounds | Grind (enemy HP cleared) | Party damage taken | Concentration | Healing burned | Notes |
|---|---|---|---|---|---|---|---|
| 1 | Zutha's Legacy | 3 | — (skill hazard; 37 chip) | **136** (Sevek 112 · Paya 24 · Aureys 0) | 82% on Sevek | 168 after (Treat Wounds 54×2, Fresh Produce 60) | Sevek Drained 2 averted only by a mythic reroll; 6 MP spent, all refunded |
| 2 | Clockwork Whale | 2 | 338 | **132** (Paya 72 · Sevek 60) | two crits, both natural 20s | 178 after | Nobody below ~60% |
| 3 | Maddenmist + 2 callers | 5 | **1,007** (272 + 301 + 434) | **448** (Paya 201 · Sevek 180 · Aureys 67) | Sevek ~19 HP before his 96 self-Heal; Paya ate a 70 crit + 61 + 26 + 44 bleed | **446** (96 in-fight + 350 after) | **The dangerous one.** Desiccate 134 across two PCs, Polar Ray 66, Frigid Flurry 61, jaws 106 |
| 4 | Elemental Tsunami | 2 | 418 | **71** (Aureys 44 · Sevek 27) | — | 104 after | Sevek entered Drained 2; Paya never got a second turn |
| 5 | Quoroc + 2 callers | 4 | **953** (367 + 297 + 289) | **233** (Paya 155 · Sevek 78 · Aureys 0) | Paya: 35+37+32+37+12 in two rounds | 314 after (incl. the DC-40 Treat Wounds crit that cleared Drained) | Quoroc never grabbed anyone |
| 6 | Baolen | 4 | **597** (≈380 + 209 post-Myth) | **304** (Paya 176 · Aureys 64 · Sevek 64) | Paya 54 + 80 + 42 with **no healing** after (session called) | 0 | Two 60-ft-reach Reactive Strike crits on the approach |
| | **Session** | 20 | **~3,350 HP** | **1,324** | | **1,210** | |

**Party HP pool (estimated):** Sevek 218 (known) + Paya ~220 + Aureys ~190 ≈ **625**. Healing available: Paya's Kineticist channels (Fresh Produce 8d4+36 every 10 min, Dash of Herbs, Ocean's Balm, Torrent in the Blood), Treat Wounds (legendary, Continual Recovery), Sevek's 1/day Mortal Herald Heal (96). Mithtirith's 99–108 Heals were absent.

**Survival margins:** Fight 3 took **72% of the pool** and was the only fight where a PC was genuinely near the floor (Sevek, before the one-action Heal). Fight 6 took 49% with zero healing after it — Paya ended the session at roughly 176 down. Fights 1, 2, 4 were under 25%; fight 5 was 37% but spread across two bodies. **Nobody was ever dying.**

---

## 3. The two-axis verdict and the re-priced budget

**3-player XP thresholds at party level 15:** Trivial 30 · Low 40 · Moderate 60 · Severe 90 · Extreme 120.

| # | Fight | Book levels → XP → rating | **Empirical** levels → XP → rating | Grind | Threat |
|---|---|---|---|---|---|
| 1 | Zutha's Legacy | complex hazard 18 (PL+3) → 120 → **Extreme** | run at ~16 difficulty (DC 42, 4 succ.) → ~60–80 → **Moderate–Severe** | low | moderate (all on Sevek) |
| 2 | Whale | 17 (PL+2) → 80 → **Moderate+** | 16–17 → 60–80 → **Moderate** | medium | low |
| 3 | Maddenmist + callers | 14 + 11 + 11 → 30+15+15 = 60 → **Moderate** | **17 + 14 + 14 → 80+30+30 = 140 → Extreme+** | **very high** | **high** |
| 4 | Tsunami | 11 (PL−4) → 10 → **Trivial** | **16 → 60 → Moderate** | medium | low |
| 5 | Quoroc + callers | 15 + 11 + 11 → 40+15+15 = 70 → **Moderate** | **16 + 14 + 14 → 60+30+30 = 120 → Extreme** | **very high** | moderate |
| 6 | Baolen | 18 (PL+3) → 120 → **Extreme** | 18 run soft → 120 → **Extreme** (on paper) | high | moderate |

**Verdict:** by the book this was a Moderate day with two Extreme bookends. By what was actually on the table, it was **four Extreme-or-worse fights and two Moderates, back to back, with no long rest and no cleric** — and the party took it at a walk. The budget undersells fights 3 and 5 even at empirical levels, because three bodies with +29 attacks and Shared Feast reactions is an action-economy problem the XP table doesn't see.

What makes this honest rather than flattering: the grind numbers are real (3,350 HP cleared), the threat numbers are real (1,324 taken, 1,210 healed), and the margin was real too. The party was **never** in a state where one more enemy turn ends a character. That's the control package, not the dice.

---

## 4. What the control package bought

- **Taunt.** Enemies put **28 Strikes and spell attacks into Sevek** this session and the log scores **11 as hits (39%)** — two of which Prevailing Position then erased, so 9 landed (32%). The same creatures went **9 for 14 (64%) on Paya** and 2 for 7 on Aureys. Fight 5 is the cleanest picture: **4 of 13 on Sevek** (one of those negated), 4 of 6 on Paya. Taunt didn't make Sevek unhittable — it made him the one being swung at, at AC 40, instead of the fighter at 37. Taunt's off-guard rider also priced three of the session's five biggest hits: Paya's **106** on Maddenmist (47 vs off-guard 37 — a plain hit vs AC 39), **110** on Baolen (49 vs 38 — a plain hit vs 40), and Aureys' Opportune Backstabs.
- **Trip.** Seven attempts, five successes (three critical), one ruled off (water), one crit-fail. **Baolen spent all three mythic points** — two on Remove a Condition to stand, one on Undying Myth after an Electric Arc — and with his points gone spent his last turn attacking from prone: six Strikes, one hit. The whale stood into a Stand Still that missed by 1. Against the callers and Quoroc, Trip was never needed — they died first.
- **Grapple-and-Taunt on the caster.** Sevek's tail grab on Maddenmist (two successes) forced the DC 5 flat check twice — **he passed both** — but it put Polar Ray (66) and the jaws (36) into the tank instead of the fighter who had just eaten 70, and it made the kill a crit.
- **Fear stacking.** Aureys' Battle Cry + Majestic Presence + Frightening Power put Frightened 1–2 on every creature except the whale (mindless) and Maddenmist (crit-saved twice). That's −1/−2 on ~60 enemy attack rolls and saves, and it's the −2 that turned Paya's 86 and Sevek's 103 on Kraken Caller A into crits. Baolen's crit on Paya for 80 came through Frightened 1 — it would have been a crit anyway.
- **Grovel / Distracting Feint.** Off-guard to the whole party on the whale (crit), Quoroc (crit), and two callers; every one of Aureys' sneak attacks on the octopus and kraken came off it.
- **Prevailing Position ×4** turned one crit into a hit (23 instead of ~46), two hits into misses, and padded one Reflex save — roughly **80–100 damage** prevented for the price of four turns out of Whirlwind Stance.
- **Absorb Magic** kept Aureys Overflowing for both Aether Beams (70 crit-fail vaporization; 19 on Baolen) and her fan's +2d4 force on every hit — fed by Sevek's cantrips on request.
- **Healing throughput without a cleric:** 1,210 HP restored, all Paya except Sevek's 96. The gap is *burst*: Fight 3's 448 taken could only be answered after the fight, which is why Sevek's one-action Heal mattered.

---

## 5. What didn't fire (the receipts)

Printed abilities that never appeared in the log — the material the party's kill speed and control censored:

- **Zutha's Legacy:** *Howl of Rage* (the stairwell reaction — never triggered; the party destroyed the haunt first). Book routine is *Vomit Maggot ×3 + Belch* per round — Cody ran two actions, then three.
- **Clockwork Whale:** *Swallow Whole* (Paya was Restrained in its jaws for exactly one turn and Escaped on a mythic point before it could), *Push 15 ft*, the Tail's push. It got **two turns**.
- **Maddenmist:** **every spell on his printed list.** *Warp Mind, Petrify, Wall of Force, Control Water, Wall of Stone, Confusion, Translocate, Hallucination, Fear, Force Barrage, Drain Bonded Item* — none. What he cast (Desiccate r8, Frigid Flurry r7, Polar Ray r8, Disintegrate r6, Shield) is a swapped-in blaster kit. Grabbed for two of his four turns, he never tried to Escape.
- **Elemental Tsunami:** *Drench, Vortex* (difficult terrain — never mentioned), *Mindwarp Ink* (never rolled against Sevek despite the Wave hitting), *Push or Pull*. Two turns.
- **Quoroc:** *Grab* (three arm hits, zero grapple checks), *Constrict*. The toxin fired once (Clumsy 1). Two turns.
- **Baolen:** *Punishing Winds* (r8), *Whirlpool* (r8), *Dominate*, *Ink Cloud*, *Constrict*, *Beak*, *Grab*, *Curse of Flawed History*, *Retrocognitive Ink*, *Recharge*, and **Mythic Resilience** (not applied to any save). He used **Strike / Double Attack, Jet, Remove a Condition, Undying Myth** — four of fifteen. A mythic kraken with two 8th-rank spells and an 80-ft ink cloud spent three of his four turns standing up or flailing from the floor.

That last list is the session's real story. Cody's closing complaint — *"I was expecting more powerful abilities with this guy"* — is true of the printed block; the table never saw them because the kraken's three mythic points and most of his actions were spent on Sevek's Trips.

---

## 6. Damage contribution

### Per PC, per fight (applied damage to enemies)

| PC | E1 | E2 | E3 | E4 | E5 | E6 | **Session** | Share |
|---|---|---|---|---|---|---|---|---|
| **Paya** | 37 | 76 | **553** | 0 | **376** | 266 | **1,308** | 39% |
| **Aureys** | 0 | **175** | 228 | **280** | 358 | **273** | **1,314** | 39% |
| **Sevek** | 0 | 87 | 226 | 138 | 219 | 58 | **728** | 22% |

*Persistent rune damage (2d4 void / 2d10 fire) credited to Paya; Electric Arc's +15 weakness on the whale credited to Sevek. Recap figures differ by a few points where a reaction's damage line was ambiguous; these are the parser's.*

- **Paya** is the burst: five Vicious Swing crits over 100 (108, 110, 106, 120, 110) and a Spear Dancer crit of 86 — 640 of his 1,308 in six swings. Three Reactive Strikes into spellcasting (43, 49, 44) and a 35 into Frigid Flurry. **Fight 4 is a zero** — he missed his one swing and the fight ended before his second turn.
- **Aureys** is the throughput: 38 attack rolls, 66% hit, three crits, and the fearsome/keen/flaming/Overflowing riders on every hit — her *median* landed hit is ~40. Plus 89 off two Aether Beams. Six of nine kills.
- **Sevek** is the enabler: 728 dealt, but he also made **7 Trips, 2 Grapples, 1 Tumble Through, 4 Taunts, 1 Elf Step** and cast Guidance, Electric Arc ×3, Frostbite, Feet to Fins, and a Heal — roughly a third of his actions were not Strikes. His Inner Upheaval flurries: **hit-hit (whale kill), hit-hit (67), crit-hit (107, tsunami kill), hit-miss (45), miss-crit-miss (Baolen).** His one bad turn was the one that mattered most.

### Damage taken

| PC | E1 | E2 | E3 | E4 | E5 | E6 | **Session** |
|---|---|---|---|---|---|---|---|
| **Paya** | 24 | 72 | 201 | 0 | 155 | 176 | **628** |
| **Sevek** | 112 | 60 | 180 | 27 | 78 | 64 | **521** |
| **Aureys** | 0 | 0 | 67 | 44 | 0 | 64 | **175** |

Paya took the most because he charges first into reach (two Baolen Reactive Strike crits, the whale's jaws); Sevek took the haunt and Maddenmist's whole turn by design; Aureys, flying and Feinting from 30 ft, took damage in three of six fights and was hit by a Strike exactly twice all session.

---

## 7. Rolls analysis — party vs GM, attacks vs non-attacks

*Every physical d20 in the export. Mythic rerolls count both dice. Enemy attack modifiers are shown in this export, so GM dice are measurable. SAVE lines for PCs show only the resolved die (the pre-reroll die on a mythic save isn't logged).*

### Attack rolls (Strikes, spell attacks, Trip/Grapple/Escape)

| | n | mean | median | nat 1 | nat 20 | ≤5 | ≥16 | outcomes |
|---|---|---|---|---|---|---|---|---|
| **Party** | 108 | **10.13** | 10 | 4 (3.7%) | 2 (1.9%) | 24 (22%) | 19 (18%) | Hit 56 · Crit 12 · Miss 24 · Crit miss 5 · (maneuvers: S 6 · CS 2 · CF 1) |
| **GM** | 51 | **9.49** | 9 | 2 (3.9%) | 3 (5.9%) | 18 (35%) | 12 (24%) | Hit 16 · Crit 6 · Miss 18 · Crit miss 9 |

Party attack die distribution: `1:4 2:10 3:4 4:2 5:4 6:4 7:4 8:7 9:10 10:7 11:10 12:4 13:7 14:9 15:3 16:4 17:2 18:5 19:6 20:2`
GM attack die distribution: `1:2 2:7 3:2 4:2 5:5 6:3 7:1 8:0 9:5 10:2 11:3 12:4 13:1 14:1 15:1 16:2 17:4 18:1 19:2 20:3`

- **The party's attack dice were slightly cold** (mean 10.1 vs 10.5 expected; nat-20 rate 1.9% vs 5% expected; **ten 2s** in 108). The 11% crit rate came from stacked off-guard/Frightened against scaled-but-not-high-enough ACs, not from the dice. Aureys' "insane" crits were 19s and 20s at +29 with Keen — that's build.
- **Cody's attack dice were cold too, and lumpier**: 35% of his attack dice were 5 or under. But it's **all Baolen**: the kraken's sixteen Strikes averaged **7.56 (median 5)** — four 2s, two 3s, three 5s — against the callers' 10.5 and Maddenmist's 12.6. Fights 2–5 his attacks ran 9.6–12.6, i.e. normal. The whale rolled two natural 20s in five attacks.
- **Per PC attacks:** Paya 10.54 (18% crit, 0 nat 20 — every crit was a 16–19 against a reduced AC), Aureys 10.18 (66% hit rate, the best at the table), **Sevek 9.66** — the coldest roller in the room, with 10 of 35 attack dice ≤5, two nat 1s (the whale Trip crit-fail and the Baolen Rippling Spin before its reroll), and one nat 20.

### Non-attack rolls (saves, skill checks, initiative, flat/recovery checks)

| | n | mean | median | nat 1 | nat 20 | ≤5 | ≥16 |
|---|---|---|---|---|---|---|---|
| **Party — all** | 85 | **11.29** | 11 | 5 (5.9%) | 6 (7.1%) | 19 (22%) | 25 (29%) |
| Party saves | 21 | 12.00 | 12 | 0 | 1 | 3 | 6 |
| Party skills | 37 | 11.73 | 12 | 3 | 2 | 9 | 12 |
| Party initiative | 19 | 10.58 | 8 | 1 | 2 | 4 | 5 |
| Party flat/recovery | 8 | 9.12 | 9.5 | 1 | 1 | 3 | 2 |
| **GM — all** | 45 | **9.42** | 8 | 3 (6.7%) | 1 (2.2%) | 13 (29%) | 9 (20%) |
| GM saves | 26 | 10.04 | 9 | 3 (11.5%) | 1 | 5 | 5 |
| GM initiative | 10 | 10.90 | 8.5 | 0 | 0 | 2 | 4 |
| **GM flat/recovery** | 9 | **6.00** | **4** | 0 | 0 | **6** | 0 |

Party non-attack distribution: `1:5 2:2 3:2 4:5 5:5 6:5 7:3 8:4 9:3 10:5 11:5 12:4 13:0 14:5 15:7 16:2 17:3 18:7 19:7 20:6`
GM non-attack distribution: `1:3 2:3 3:4 4:2 5:1 6:1 7:4 8:5 9:5 10:1 11:1 12:0 13:2 14:1 15:3 16:0 17:2 18:3 19:3 20:1`

- **Party saves: 52% critical successes** (11 of 21). That is legendary Reflex (Aureys), Path to Perfection / Juggernaut, and mythic rerolls doing their job — not the dice, which averaged a fair 12.0 with zero natural 1s. The failures cluster on Sevek's Fortitude (maggots 40 vs 42, belch 35 vs 44, Desiccate 33 vs 37 — three fails on dice of 11, 6, 4 at **+29 total**; the log's "Master +21" is the level-15 proficiency component). Legendary Fort (+31) would have flipped only the maggot save — to a crit, via Path to Perfection — the other two were dice.
- **Party skills** ran warm (11.7): Aureys' Performance and Feints, Paya's Medicine. The three natural 1s are Paya's **two consecutive 1s on Unusual Treatment** (second one with a mythic point) and Aureys' Grovel on Kraken Caller A.
- **GM saves** were average (10.0) but with **three natural 1s in 26**: Quoroc's Will twice (Frightened never lapsed) and Kraken Caller B's Reflex against Aether Beam (the 70-point vaporization).
- **GM persistent-damage recovery checks: mean 6.0, median 4, six of nine were critical failures.** The callers, Maddenmist, and Baolen kept burning and bleeding from Paya's runes and Sevek's staff turn after turn. This, plus Baolen's 7.6 attack mean, is where "after the 20th nat 2" came from — and it's a real streak, not a story.

### Mythic rerolls (12 logged)

| Who | Fight | Roll | First die → reroll | Result |
|---|---|---|---|---|
| Paya | 1 | Occultism | 18 → 19 | success (44) |
| Sevek | 1 | Intimidation | 5 → 9 | fail (34 vs 42) |
| Aureys | 1 | Performance | 9 → 15 | success (49) |
| Aureys | 1 | Fort vs Belch | ? → 16 | crit success |
| Sevek | 1 | Reflex vs Scythe | 2 → 12 | success (26 instead of 91 + Drained 2) |
| Paya | 1 | Performance (Aided +4) | 15 → 10 | fail (39 vs 42) |
| Paya | 2 | Fort vs Gearsong | ? → 18 | crit success |
| Aureys | 2 | Fort vs Gearsong | ? → 14 | crit success |
| Paya | 2 | Escape the whale | 8 → 10 | exact success (42 vs 42) |
| Paya | 3 | Fort vs Disintegrate | ? → 14 | crit success (68 → 0) |
| Sevek | 6 | Initiative | 1 → 6 | 39 |
| Sevek | 6 | Rippling Spin Trip | 1 → 2 | exact success (36 vs 36) |

Four of the twelve rerolls changed the outcome (Sevek's scythe, Paya's Escape, Paya's Disintegrate, Sevek's Trip — two of those by exactly 0). The fight-1 points were all refunded by the mythic hazard.

---

## 8. Uncertainties

- **Party HP pool** is estimated (Paya's and Aureys' max HP aren't on file); the threat percentages are ±5%.
- **Targeted floors** are exact; bracket tops are overkill-padded. The whale's and tsunami's real HP are somewhere inside [319, 338] and [312, 418].
- **Baolen's HP** of 372–388 before Undying Myth assumes the 17-point Electric Arc is what triggered it (the transcript supports this: *"in which he will use Undying Myth"* immediately after the Arc).
- **Scaling verdicts** on the callers, Maddenmist, tsunami, and Quoroc rest on attack bonuses and floors, both directly logged. No printed resistance or regeneration exists on any of them to explain the gap; "scaled" is the residual.
- **Pre-reroll dice on mythic saves** aren't logged, so party save statistics slightly overstate the raw dice.
