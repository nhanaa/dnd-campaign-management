# Session 16 — Encounter Analysis

**Source**: `rolls.txt` (Foundry export v2, single paste, 764 messages, 12:52–16:44), the cleaned transcript, and the pack JSONs (`pf2e/revenge-of-the-runelords-bestiary/book-3-into-the-apocalypse-archive/abysium-sentinel.json`, `malfunctioning-perfumery-freestanding.json`, `malfunctioning-perfumery-eastern.json`). Enemy attack modifiers are **visible** in this log (checked: `Attack Poison Modifier +36`), so enemy luck is measured. Sentinel and perfumery max HP are Foundry's own numbers from the export header (`exact, observed at 100%`). Level benchmarks are medians across every NPC JSON in the local packs (levels 14–24).

**Party**: five level-19 PCs, HP pool **1,294** (Sevek 293, Paya 293, Mithtirith 255, Aureys 236, Kreebnock 217).

---

## The headline

- **Cody played it straight on defence and turned up the damage, again.** The Abysium Sentinels were exactly their printed level-18 defences (333 HP, AC 42, book saves) with **attacks raised +2 / +4 and damage +3 / +4**. The perfumery kept its printed DCs (45) and AC, but **every damage action was roughly doubled** (Sillage 10d6 → 22d6).
- **He also cut the perfumery's grind to a quarter.** The book hazard is **four workbenches (3 × 150 HP, 1 × 170 HP, hardness 39–41), and destroying one counts as one of four disable successes**. Cody ran **one 150-HP object** that lost an action at each quarter of its HP. Shorter fight, hotter fight.
- **That trade put the damage on whoever the d6 picked.** The perfumery did **884** to the party in seven rounds, and **428 of it (48%) landed on Mithtirith**, 168% of his max HP. He bottomed at **8 HP**. At book dice the same rolls deal about **480**. The damage boost was worth ~400 HP, and most of it fell on the cleric.
- **The Sentinels were a Severe fight that played Severe**: 915 damage (71% of the pool) spread across all five PCs, nobody below 38%. About a third of that damage came from the above-book attack line.
- **Sevek did 38.6% of the Sentinel damage.** Part of the reason is mechanical: **the Sentinels have physical resistance 15 except adamantine, and Foundry treated his staff as adamantine**, so none of his nine damage rolls paid it. Paya's and Aureys' 21 rolls paid ~315.
- **Aureys' fear was the control package.** Frightened was the single biggest lever on party attacks (10 of Foundry's own ESSENTIAL tags), and the Sentinels rolled a mean natural **4.2** on six saves against her Majestic Presence.
- **The Sentinels' Green Glow aura never fired.** It is a printed Fortitude DC 37 sickened/enfeebled aura on every Sentinel. Not one save was rolled all fight.

---

## 1. Per-creature tables

### Defence: book → as run

| Creature | Level (book) | HP | AC | Saves | Resist / immune | Notes |
|---|---|---|---|---|---|---|
| **Abysium Sentinel** ×6 | 18 | 333 → **333** | 42 → **42** | F +33 / R +30 / W +28 → **same** (Ref +30 and Will +28 seen on saves) | **physical 15 except adamantine** (as printed); unaffected by spirit (Cody, as constructs) | Book defences exactly. |
| **Malfunctioning Perfumery** | 22 (complex hazard) | **620 across four workbenches** (3 × 150, 1 × 170) → **one 150-HP object** | 48 → **48** | F +43 / R +39 → Ref seen at +39 | hardness 39 (41 eastern) → hardness as printed; immune to crits and precision | Destroying a workbench was a disable success in the book; Cody replaced that with action loss at each HP quarter. |

### Offence: book → as run

| Creature | Attack | Book | As run | Change |
|---|---|---|---|---|
| Sentinel | Claw | +35, 2d6 poison + 3d6+17 (avg **34.5**) | **+37**, 2d6 poison + 3d6+20 (avg **37.5**) | +2 attack, +3 damage |
| Sentinel | Toxic Bolt | +32, 6d8+8 poison (avg **35**) | **+36**, 6d8+12 (avg **39**) | +4 attack, +4 damage |
| Sentinel | Green Glow (aura, Fort DC 37, sickened → enfeebled) | printed | **never rolled** | omitted |
| Perfumery | Crushing Notes | Fort DC 45, stunned 1/2 | same | — |
| Perfumery | Nozzle Spray | 14d6 poison, basic Fort DC 45 | **20d6** | ×1.43 |
| Perfumery | Sillage | 10d6 mental, basic Will DC 45, slowed 1 | **22d6** | ×2.2 |
| Perfumery | Oil Spill | 10d6 fire + 4d6 persistent | **20d6 + 8d6 persistent** | ×2 / ×2 |
| Perfumery | Boiling Beaker | Will DC 45, confused 1 round (1 minute on crit fail) | same | — |
| Perfumery | Disable | **4 successes**, Crafting DC 52 (legendary) / Thievery or Arcana DC 55 (master) | **5 successes**, DC 47 / 50 | −5 DC, +1 success |

Cody's own summary at the table matches: *"I didn't buff that creature saves-wise… Damage I increased… The DCs for disabling device I all reduced by five."* He didn't mention the change to the workbench structure.

### Template verdicts and per-axis level profile

Benchmarks are pack medians (L18: HP 335, AC 42, save 30, attack 35, Strike dmg 33.5 · L19: 360 / 43 / 32 / 36 / 36 · L20: 380 / 45 / 34 / 38 / 38 · L22: 450 / 48 / 36 / 40 / 42, spell DC 45).

| Creature | AC reads as | Save/DC reads as | HP reads as | Attack reads as | Damage reads as | Verdict |
|---|---|---|---|---|---|---|
| Abysium Sentinel | **L18** | **L18** | **L18** | **L19–20** (+37 claw, +36 bolt) | **L19–20** (37.5 / 39) | **Book chassis, offence-only bump.** Not Elite (Elite would also raise AC, saves and HP). |
| Perfumery | **L22** | **L22** (DC 45) | far *below* book grind (150 of 620) | — | **about double book** | **Compressed and heated**: less to chew through, roughly twice the bite. |

Every boss in S14 and S15 showed the same signature: honest defences, raised payload. S16 fits it.

---

## 2. Per-fight table

| Fight | Rounds | Enemy HP cleared | Damage to party | % of pool | In-combat healing | Concentration | Lowest PC |
|---|---|---|---|---|---|---|---|
| **Abysium Sentinels** (6) | 6 | **1,998** (+ ~315 lost to resistance) | **915** | **71%** | **358** | spread: Paya 294, Sevek 210, Mithtirith 174, Aureys 123, Kreebnock 114 | Paya ~110 (38%) |
| **Malfunctioning Perfumery** | 7 | **150** (through hardness) | **884** (+16, Sevek's punch on Paya) | **68%** | **609** | **Mithtirith 428 (48%)**, Kreebnock 266, Aureys 151, Sevek 39, Paya 0 | **Mithtirith 8 HP (3%)** |
| **Session** | 13 | 2,148 | **1,815** | **140%** | **967** | | **nobody dropped** |

> Lowest-HP figures come from the damage ledger. The log's `HP ::` snapshots only update on each PC's own rolls and read high (it shows Mithtirith "100%" for the whole Sentinel fight, during which he took two crits). Pungent Cloud did no damage (sickened Aureys and Paya).

**Where the perfumery's 884 came from**: Oil Spill hits 389 · persistent fire ticks 270 · Nozzle Spray 186 (one critical failure for 150) · Sillage 39. **At book dice: ~195 + 135 + 130 + 18 ≈ 480.**

---

## 3. Two-axis verdict and the re-priced budget

Five-player thresholds at party level 19: Trivial 50 · Low 80 · Moderate 100 · **Severe 150** · **Extreme 200**.

| Fight | XP (book levels) | XP verdict | Grind | Threat | Actually played as |
|---|---|---|---|---|---|
| Sentinels | 6 × L18 (PL−1, 30) = **180** | Severe, near Extreme | High: 2,000 HP of bodies through resistance 15, six of them, 18 actions a round | **71% of pool**, evenly spread; ~358 healed under fire | **Severe.** Re-priced at its offence level (L19–20 = 40–60 XP each) it is 240–360 and over Extreme. Kill speed kept it at Severe: fear-and-flank lowered their AC, Sevek's resistance bypass, two dead in round 2, and the omitted Green Glow aura. |
| Perfumery | L22 complex hazard (PL+3) = **120** | Moderate | **Low by design**: 150 HP, a quarter of the book | **68% of pool, 48% of it on one PC**, the cleric to 8 HP; 609 healed under fire | **Severe on threat, Moderate on grind.** The XP number can't see either change. At book dice it would have been ~480 damage; at book structure it would have been a much longer fight. |

**Why the Sentinels didn't go to Extreme**: not because fear blunted their attacks. Only **10 of 46** Sentinel attacks carried a frightened penalty, averaging −0.8 across the fight, so their attack line stayed well above book. What held it to Severe was **kill speed**: the frightened penalties lowered the Sentinels' **AC** on party attacks (§5), Sevek's attacks skipped the resistance, and two Sentinels died in round 2. Six Sentinels for one round, then four, then three, is a much smaller fight than six for six rounds. The **omitted Green Glow aura** (§8) also kept the frontline free of sickened/enfeebled.

**The above-book attack line, priced**: 46 Sentinel attacks. At book bonuses, **3 hits become misses and 3 crits become hits**; with book damage dice on the remaining hits, that's roughly **~110 + ~115 + ~80 ≈ 300 of the 915**. So about a third of the Sentinel fight's damage came from Cody's offence bump.

**The perfumery's DC was book.** Basic saves at DC 45 against level-19 PCs critically fail on low rolls. Mithtirith's Fortitude (+30 with the Robes) crit-fails on natural 1–5 (25%), which is how one Nozzle Spray became 150. **The DC wasn't raised; the dice behind it were.** At book dice that crit is ~98.

---

## 4. Damage contribution (HP actually removed, overkill capped)

| PC | Sentinels | Perfumery | **Total** | Share | Kills |
|---|---|---|---|---|---|
| **Sevek** | 771 | 42 | **813** | **37.8%** | Sentinels A, C, F; the perfumery |
| **Paya** | 502 | 50 | **552** | 25.7% | Sentinels B, D |
| **Aureys** | 416 | 8 | **424** | 19.7% | Sentinel E |
| **Mithtirith** | 197 | 0 | **197** | 9.2% | — |
| **Kreebnock** | 112 | 50 | **162** | 7.5% | — |
| **Total** | 1,998 | 150 | 2,148 | | |

**Physical resistance 15 shaped the Sentinel column.** Sevek's nine damage rolls on Sentinels show no resistance applied (e.g. 110 rolled → 104 applied, the 6 being spirit the constructs ignore); **Foundry tags his staff adamantine**, and the Sentinels' resistance has an adamantine exception. Paya's 11 and Aureys' 10 damage rolls paid 15 each, **~315 HP absorbed**. Sevek's Flurries also roll both Strikes as one combined damage application, so a two-hit Flurry pays resistance once even where it applies.
**The perfumery column is tiny for everyone** because of hardness 39; only big hits got through. Kreebnock's Telekinetic Projectiles (50) matched Paya's halberd, and **two of them crossed the ½ and ¼ thresholds**, see §5.

---

## 5. What the control package bought

### Foundry's own Tier-1 count (`MM :: ESSENTIAL`, 33 tags)

| Modifier | Tags | Source | Notes |
|---|---|---|---|
| **Frightened** (−2/−3/−4) | **10** | **Aureys** (Majestic Presence) | All on party attacks vs Sentinels. |
| **Off-Guard / flanked** | 6 | flanking, Aureys' Feints | |
| **Courageous Anthem +1** | 9 | Kreebnock | **5 meaningful** against enemies (2 miss→hit and 2 hit→crit on Sentinels, 1 miss→hit on the perfumery). **3 were on confused Paya's swings at Sevek and Sevek's swing at the perfumery: crit-miss → miss, worth nothing.** 1 was on Sevek's punch at Paya. |
| Emotional Surge +2 | 1 | Kreebnock (self) | A Telekinetic Projectile hit on the perfumery. |
| Inner Upheaval +1 | 1 | Sevek (self) | The first Strike of the Flurry that killed C. |
| Sickened −1 | 1 | the perfumery (on Paya) | Sevek's punch. |

### Tier 2 — the whole package (target-side penalties + party buffs removed)

Party attack rolls against the Sentinels: **22 flipped** (14 miss→hit, 8 hit→crit), plus **5 crit-miss→miss** that bought nothing. Two more against the perfumery (Kreebnock, miss→hit). Anthem was on **72 of 109** party attack rolls (66% coverage).

**Valued, overkill capped and combined rolls handled** (a Flurry and an Overwhelming Combination are one damage application; the counterfactual is hit+hit or miss+hit, not crit vs hit): **~540 HP on the Sentinels** plus **40 on the perfumery**, **~580 in all**. The crit flips on near-dead targets were worth little: Paya's kill crit on B (46 left) and Sevek's on F (55 left) would have killed or nearly killed on plain hits. The value sat in the **miss→hit flips and the two Flurry/Combination turns** (Sevek on C ≈ 77; Aureys on B ≈ 60; Aureys on F ≈ 57).

⚠️ **One flip rests on a table error.** Aureys' round-1 Majestic Presence was *critically failed by A and C* and *succeeded by B*, but Foundry put frightened 4 on **B** and C. Paya's 13:44:41 hit on B (margin 0) was only a hit because of that; at frightened 1 it misses (~28 HP). The same mix-up made two of B's claws at Paya miss that would have hit.

**Anthem's flat +1 damage** was small this session (~47 pre-resistance across ~45 damage rolls): the Sentinels' resistance and the perfumery's hardness ate most of it.

### The perfumery's action denial (the support play that doesn't show in a damage column)

Each quarter of HP removed cost the hazard an action, in order: Crushing Notes (Paya's Vicious Swing, R2), **Nozzle Spray** (Kreebnock's Telekinetic Projectile, R3), **Sillage** (Kreebnock's Telekinetic Projectile, R4, an Anthem-flipped hit). **Nozzle Spray had done 186 in its two uses**, including the 150 crit fail. Kreebnock's two projectiles turned it off before it could fire a third time.

### Defence

- **Kreebnock's Instinctive Obfuscation** turned a 70-point Toxic Bolt crit (14:17:18) into a miss on the Sentinel's flat check.
- **Taunt's −1 was wrongly applied to 9 attacks that targeted Sevek** (13:50:03 → 14:10:19). One changed the outcome (D's bolt, a miss by 1) and **Cody overruled it live** (*"that taunt penalty doesn't apply when attacking you"*). S11 had zero of these. **The S11 fix has lapsed.**
- Rippling Spin tripped Sentinel D; Sevek took the least damage of the frontliners (210) behind Taunt.

---

## 6. In-combat healing (downtime excluded)

| Fight | Healer | Method | HP | Main recipients |
|---|---|---|---|---|
| Sentinels | **Kreebnock** | Restore the Mind ×4 | **160** | Paya 80, Sevek 40, Aureys 40 |
| Sentinels | Mithtirith | Heal | 83 | himself 77 |
| Sentinels | Paya | Battle Medicine (crit, Doctor's Visitation) + Ocean's Balm | 115 | Kreebnock 66, himself 49 |
| Perfumery | **Mithtirith** | Heal (121, 96, 124, 8) + three-action Heal (44 × 5) | **569** | himself 337, Kreebnock 96 |
| Perfumery | Kreebnock | Restore the Mind | 40 | Mithtirith (at 8 HP) |
| **Total in combat** | | | **967** | |
| Out of combat | Paya | Treat Wounds (73 / 70 × 4–5), Dash of Herbs, Torrent in the Blood, Ocean's Balm | **~1,000** | everyone |

**Kreebnock was the Sentinel fight's top in-combat healer** (160 to Mithtirith's 83). **Mithtirith's perfumery healing was mostly self-preservation**: he was the hazard's main target and healed himself for 337 of the 428 he took. Paya ran the whole out-of-combat queue.

---

## 7. Roll analysis

### Attack rolls (natural d20)

| | n | Mean | z | Nat 20 | Nat 1 |
|---|---|---|---|---|---|
| **Sevek** | 29 | **11.90** | **+1.30** | **4** | 1 |
| Aureys | 27 | 10.15 | −0.32 | 0 | 1 |
| Paya | 40 | 9.57 | −1.01 | 2 | 3 |
| Kreebnock | 7 | 10.14 | −0.16 | 1 | 0 |
| **Sentinels** | 46 | 10.93 | +0.51 | 1 | 4 |

Sevek ran hot (four natural 20s in 29 swings, including both crits that took C and the MAP −10 on E). Paya ran cold, which is the "miss arc," and his 40 includes ten confused swings at Sevek. **The Sentinels rolled average**: their damage came from the line, not the dice.

### Saves and other checks

| | n | Mean | z |
|---|---|---|---|
| Mithtirith (saves) | 7 | 13.00 | +1.15 |
| Paya (saves) | 9 | 11.44 | +0.49 |
| Aureys (saves) | 6 | 12.17 | +0.71 |
| Kreebnock (saves) | 7 | 11.71 | +0.56 |
| Sevek (saves) | 4 | 8.75 | −0.61 |
| Aureys (skills, mostly Perception/Thievery) | 46 | 10.37 | −0.15 |

**The party saved slightly *above* average against the perfumery.** The 884 was not bad luck. It was 20d6 and 22d6 behind DC 45, and two of the critical failures (Mithtirith's Nozzle Spray on a natural 4, Kreebnock's Oil Spill on a natural 3) landed where the doubled dice did most damage.

### Enemy saves against each PC

| Against | n | Mean natural | z |
|---|---|---|---|
| **Aureys** (Majestic Presence) | 6 | **4.17** | **−2.69** |
| Aureys (Aether Beam) | 4 | 9.75 | −0.26 |
| Mithtirith (Electric Arc, Tempest Surge) | 7 | 10.71 | +0.10 |
| Sevek (Electric Arc) | 4 | 11.25 | +0.26 |
| Kreebnock (Force Rain) | 2 | 10.00 | — |

**Aureys' fear had the luck this session.** Five of six Sentinel Will saves against Majestic Presence were critical failures (frightened 4), against a DC that a +28 save fails only on 1–12. That luck is what produced the Frightened column in §5.

---

## 8. What didn't fire

- **Green Glow** (every Sentinel): a 15-foot aura, Fortitude DC 37 each turn or **sickened 1**, and **enfeebled 1** for anyone already sickened. **Never rolled once** in 46 Sentinel attacks and six rounds. With six of them in melee with Paya, Aureys and Sevek, this would have meant ~3 Fortitude saves per PC per round and stacked sickened/enfeebled on the frontline. It is the biggest single difference between the printed encounter and the one played, and it cut against the offence bump.
- **Security Alert** and **Statue's Head**: narrative (the heads detached as the party walked past).
- **The perfumery fired everything**, including the Pungent Cloud; its disable route was simply never reachable (six attempts, best 49 against DC 50).

---

## Uncertainty notes

- The flip-damage values are estimates: combined damage rolls were split by eye where one Strike of a Flurry or Combination flipped, and normal-hit values for crit flips use half the crit roll minus resistance. Treat **~580** as ±60.
- The book-dice counterfactual for the perfumery scales each action by its dice ratio (14/20, 10/22, 10/20, 4/8); it doesn't re-roll anything.
- Aureys' 19-point persistent fire tick at 15:29:39 appears to be a duplicate application (no new roll). It is included in the 884; the true figure is ~865.
- Enemy modifiers were visible (checked). Sentinel AC was read from `CTX :: dc armor` plus the conditions on each roll; it returns 42 throughout.
