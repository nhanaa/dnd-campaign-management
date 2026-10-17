# Session 14 — Encounter Analysis

**Source**: `rolls.txt` (Foundry export v2, single paste, 951 messages, 13:24–17:07), the cleaned transcript, and the pack JSONs for all six creature types. Enemy modifiers are visible in this log (checked), so enemy luck is measured. Creature max HP is Foundry's own number from the export header (`exact, observed at 100%`) for every creature.

**Party**: five level-18 PCs, HP pool **1,228** (Sevek 278, Paya 278, Mithtirith 242, Aureys 224, Kreebnock 206). Mithtirith was off the map for the Shoggoth fight after round 1 and for the whole City Gates fight.

---

## The headline

- **The dice were average. The shape was not.** Party d20s: 206 rolls, mean 10.46, z −0.10. But first attacks ran cold (z −1.23), second attacks ran hot (z +1.70), and saves ran hot (z +1.60). The enemies had the same pattern: cold openers, hot follow-ups.
- **Sevek's first swing of the turn was the coldest thing at the table**: 14 rolls at no MAP, mean 7.86, z −1.71. His second swings (mean 12.83) and the party's debuffs carried his damage.
- **The Temple Plaza was priced Low by the book and played Severe.** Four printed level-16 creatures (80 XP) were run with a commander at level-20 offence and 500 HP. It took 60% of the party's HP pool in three rounds.
- **Plaza and Ancient Ones back to back took 1,345 damage — 110% of the pool — across seven rounds with one round between them.** Nobody dropped, on roughly 700 points of in-combat healing.
- **The Ancient Ones were run softer on defence than printed** (AC 43 not 45, and no mythic resistance 20) **and harder on offence** (blade damage ×1.56, a 10th-rank Spirit Song that is not on the printed list).

---

## 1. Per-creature tables

### Defence: book → as run

| Creature | Level (book) | HP | AC | Saves seen | Notes |
|---|---|---|---|---|---|
| **Shoggoth** ×3 | 18 | 275 → **425** | 39 → 39 | Ref +30 (book +30) | Fast healing 20, crit and precision immunity as printed. HP +55%. |
| **Rune Giant** ×2 | 16 | 330 → **375** | 38 → 38 | Ref +26, Will +28 (book) | HP +14%. |
| **Runic Warmaw** ×2 (gates) | 16 | 300 → **350** | 38 → 38 | Ref +28, Will +24 (book) | HP +17%. |
| **Runic Warmaw** (plaza) | 16 | 300 → **370** | 38 → 38 | Will +26 (book +24) | Elite-like: +2 attack and saves. |
| **Knight of Malice** ×2 | 16 | 330 → **350** | 38 → **40** | Ref +30, Will +27 (book +28 / +25) | Elite-like (+2 AC, attack, saves), mental resistance 15 as printed. |
| **Commander Yrasthura** | 16 | 330 → **500** | 38 → **43** | Will +34 (book +28) | +5 AC, +6 Will, HP +52%. |
| **Ancient One** ×2 | 20 | 440 → **470** | 45 → **43** | Fort +35, Ref +33 (book +34 / +33) | ⚠️ **Printed mythic resistance 20 was not applied**: hits landed for their full roll. AC −2. |

AC is derived from the armor DC Foundry used on each attack plus the conditions on the target at that moment; every creature came out at one stable value.

### Offence: book → as run

| Creature | Attack | Damage per hit (average) | DCs and spells |
|---|---|---|---|
| **Shoggoth** | +35 → **+37** | 4d10+18 (40) → **4d10+25 (47)** | Only pseudopod and Grab were used. |
| **Rune Giant** | +33 → +33 | 3d12+17 (36.5) → **3d12+20 (39.5)**, +3d6 fire after Invoke Rune | Invoke Rune DC 37 (book). |
| **Runic Warmaw** (gates) | +32 → **+34** | 3d10+16 (32.5) → **4d10+20 (42)** | Howl of Ash and Ember DC 37 → **39**, 15d6 as printed. |
| **Runic Warmaw** (plaza) | +32 → **+36** | → **4d10+21 (43)** | Howl DC 39. |
| **Knight of Malice** | +32 → **+34** | 3d10+15+1d6 (35) → **3d10+21+1d6 (41)** | — |
| **Commander Yrasthura** | +34 → **+38** | 3d12+17 (36.5) → **4d12+24 (50)**, +3d6 fire | Invoke Rune DC 37 → **43**, 6d12 → **9d12**; Arctic Rift at DC **43** (book casting DC 35). |
| **Ancient One** | +41 → **+40** | 3d8+16+1d6 (33) → **4d8+23+3d6 (51.5)** | Unified Timeline / Vision DC 42 → **40**; **Spirit Song at 10th rank, DC 43** (not on the printed list; printed top is 9th rank at DC 42). |

### Template verdicts and per-axis level profile

Level medians are computed from the local packs (about 1,000 NPCs at levels 15–23): for example level 18 = 335 HP / AC 42 / attack +35 / DC 40; level 20 = 380 / 45 / +38 / 42; level 23 = 480 / 49 / +42 / 46.

| Creature | Verdict | AC reads as | Attack reads as | DC reads as | HP reads as |
|---|---|---|---|---|---|
| Shoggoth | Printed chassis, HP and offence raised | L16 | L19–20 | — | **L21–22** |
| Rune Giant | Book, small HP and damage bump | L15–16 | L17 | L16 | L19–20 |
| Warmaw (gates) | Elite offence, HP bump | L15–16 | L17–18 | L17–18 | L19 |
| Knight of Malice | Clean Elite (+20 HP, +2 across) | L17 | L17–18 | — | L18–19 |
| **Yrasthura** | **Scaled on every axis** | L19 | **L20** | **L20–21** | **above L23** |
| Ancient One | Rebuilt: softer defence, harder offence | L19 | L21 | L20–21 | L22–23 (but no resistance 20) |

Yrasthura is the only creature of the night whose threat axes (attack, damage, DC) were raised as far as her HP. Everything else is mostly grind inflation: more hit points on an honest or lightly raised chassis.

⚠️ **Rules note, separate from tuning.** Yrasthura's vorpal Fortitude save was called on a Wide Swing that was a **natural 17**. The vorpal rune triggers only on a natural 20 that also crits, and her printed greatsword carries the standard rune with no custom text. Sevek failed that save by 1 and survived on a Mythic Point reroll.

---

## 2. Per-fight table

| Fight | Rounds | Enemy HP cleared | Party damage taken | % of pool | Who ate it | In-combat healing |
|---|---|---|---|---|---|---|
| **Shoggoths** | 3 | 1,275 + 40 fast healing | 387 | 32% | Aureys 166, Paya 144, Kreebnock 44, Mithtirith 33, **Sevek 0** | 38 |
| **City Gates** (4 PCs) | 4 | 1,450 | 455 | 46% of the four present | Paya 138, Kreebnock 126, Sevek 123, Aureys 68 | 38 |
| **Temple Plaza** | 3 | 1,255 (Knight B fled at 315) | **736** | **60%** | **Sevek 245**, Mithtirith 167, Paya 157, Aureys 100, Kreebnock 67 | 326 |
| **Ancient Ones** | 4 | about 1,180 (A's second life included) | 609 (60 of it into temporary HP) | 50% | Sevek 187, Mithtirith 127, Paya 121, Kreebnock 116, Aureys 58 | 374 |

- **Concentration.** At the Plaza one enemy turn (Yrasthura, round 1) did 24 + 112 to Sevek and 53 + 104 to Paya: 293 damage in two actions. Mithtirith took two crits for 150 from two different enemies in the same fight. Nobody went below about 30% (Mithtirith 75/242, Sevek 84/278).
- **The gates without a cleric.** 455 taken against 38 healed in combat. The fight was not dangerous round to round, but it is the only one the party left hurt, and all of the recovery was Paya's impulses afterward.
- **Spread, not spike, against the Ancient Ones.** The first Spirit Song hit four PCs for 290 between them. Party saves were hot all night (z +1.60), and that one song was the exception: the four natural dice were 3, 4, 5 and 8.

---

## 3. Two-axis verdict and the re-priced budget

Five players at level 18: Trivial 50 · Low 80 · Moderate 100 · Severe 150 · Extreme 200. (Four players: Low 60 · Moderate 80 · Severe 120.)

| Fight | XP by the book | Book verdict | Grind | Threat | What it actually was |
|---|---|---|---|---|---|
| Shoggoths | 3 × L18 = 120 | Moderate+ | High (1,315 HP) | Low–moderate (32%, Sevek untouched) | **Moderate.** A big bag of HP with one attack and a Grab. |
| City Gates | 4 × L16 = 80 | Moderate for four | High (1,450 HP) | Moderate (46% of four, no healer) | **Moderate**, made to feel worse by the missing cleric. |
| Temple Plaza | 4 × L16 = 80 | **Low** | High | **High** (60% in three rounds, a death save in round 1) | **Severe.** Re-priced with Yrasthura at level 20 and the rest at 17: about 170 XP. |
| Ancient Ones | 2 × L20 = 160 | Severe | High | Moderate–high (50%) | **Severe by the book, Moderate–Severe as run.** See below. |

I believe the empirical side over the budget for the Plaza. The budget prices level, and Yrasthura's level never moved while her attack, damage, DC and HP all did.

**On the Ancient Ones.** Printed, each sheds 20 from every non-mythic hit. The party put roughly 25 separate damage applications into the pair; with that resistance in place they would have absorbed on the order of 500 more damage. Dropping it and lowering AC by 2 is why the first one went from 470 to dead before it had taken a turn. The raised blade damage and the 10th-rank Spirit Song then put the danger back on the other side. Net: easier to kill than the book's version, about as dangerous to stand next to.

**Sequencing mattered more than any single fight.** Plaza into Ancient Ones with one round of prep is effectively one seven-round encounter worth 1,345 damage. The party entered the second half at Sevek 247/278, Paya 221/278, Kreebnock 179/206, with Haste and Legend of Combat still running. That carry-over is part of why it held.

**Area-save counterfactual, Yrasthura's Invoke Rune.** At her table DC 43, Paya (Reflex +31) fails on a natural 11 or lower and Sevek (+30) on a 12 or lower: 55–60% each. At the printed DC 37 those are 25–30%. The critical-failure band barely moves (10–15% against 5%). So the DC raise roughly doubled the chance of taking the full 9d12, and it is the reason Sevek spent Prevailing Position there.

---

## 4. Damage contribution (HP actually removed, overkill capped, persistent credited to its source)

| | Shoggoths | Gates | Plaza | Ancient Ones | **Total** | Share |
|---|---|---|---|---|---|---|
| **Aureys** | 393 | 666 | 461 | 304 | **1,824** | 35% |
| **Paya** | 450 | 333 | 291 | 396 | **1,470** | 29% |
| **Sevek** | 385 | 331 | 253 | 284 | **1,253** | 24% |
| **Kreebnock** | 79 | 118 | 206 | 17 | **420** | 8% |
| **Mithtirith** | 8 | — | 47 | 133 | **188** | 4% |

Kills: Aureys 3, Sevek 3, Paya 2 (plus Ancient One A's first life), Kreebnock 1, Mithtirith 1. Two rune giants fell to persistent damage.

---

## 5. What the control package bought

### Party attack rolls (115, excluding mis-targets on Aureys' spectral dragon)

At least one party-supplied modifier was live on **108 of 115** rolls, so coverage is close to complete.

| Tier | What it measures | Result |
|---|---|---|
| **1 — Marginal** (Foundry's own `ESSENTIAL` tags) | Remove that one modifier and the degree changes | Off-guard **12**, Frightened **8**, Courageous Anthem **4**, Clumsy **2**, Sickened **1** |
| **2 — Package** | Remove every party buff and every party-caused penalty | **31 rolls changed degree**: 14 miss→hit, 13 hit→crit, 4 crit-miss→miss |
| **3 — Participation** in those 31 | Which effects were contributing | Off-guard 26, Frightened 23, Clumsy 12, Anthem 7, Sickened 1 |

- The four crit-miss→miss flips bought nothing. **27 flips changed an outcome**, about one party attack in four.
- By attacker: Aureys 12, Sevek 8, Paya 7.
- ⚠️ Some of the 13 hit→crit flips landed on Shoggoths, which are immune to critical hits. Those are worth nothing either; I have not separated them out.
- **Sources.** Frightened is all Aureys (Battle Cry, Majestic Presence, Frightening Power, Scare to Death). Off-guard is a mix: Aureys' Feints, Sevek's Taunt, flanking, and prone targets. Clumsy is Aureys' Earth to Heavens Strike and Sevek's Greater Crushing crits.
- **Sevek specifically**: 8 of his 29 attack rolls only hit or only crit because of the package (5 miss→hit, 3 hit→crit). With cold first swings, that is a large part of his 1,253.

### Enemy attack rolls (54 logged)

**7 changed degree**: 4 hit→miss and 3 crit→hit.

| Roll | Target | What turned it |
|---|---|---|
| Shoggoth B, natural 3 | Aureys | Frightened 2 and prone (hit→miss) |
| Shoggoth C, natural 18 at MAP −10 | Sevek | Whirlwind Stance and Taunt (hit→miss) |
| Shoggoth C, natural 19 | Aureys | Frightened 2 and Taunt (**crit→hit**) |
| Knight of Malice A, two Strikes | Sevek | Paya's sickened 2 and Whirlwind Stance (hit→miss twice) |
| Ancient One B, natural 9 | Mithtirith | Taunt's −1 (**crit→hit**, about 43 saved) |
| Ancient One B, natural 6 | Sevek | Stance and Mithtirith's Protection (hit→miss) |

On top of that, flat checks cancelled **two hits that had beaten AC**: blind Knight A against Sevek, and the dazzled warmaw's second bite on Mithtirith. Both conditions came from **Glory on High**. And Prevailing Position turned one Wide Swing from a hit into a miss.

### Enemy saves

Fifteen enemy saves carried a party penalty. **One changed degree**: Sevek's Electric Arc on a frightened 2 warmaw went from failure to critical failure (+16). Frightened and sickened paid on attack rolls this session, not on saves.

---

## 6. Sevek's kit on defence

| Fight | Attack rolls aimed at Sevek | Landed | Notes |
|---|---|---|---|
| Shoggoths | 4 | 0 | Shoggoth C spent four pseudopods on him. |
| City Gates | 6, plus Wide Swings | 2 | Warmaw bite (31) and a Reactive Strike he chose to eat (49). A Wide Swing that had hit was erased by Prevailing Position. |
| Temple Plaza | 9, plus Yrasthura's Wide Swings | 2, plus the Wide Swing crit | Knight A before the blind (41) and on a natural 20 (51); Yrasthura's crit (112). |
| Ancient Ones | 3 | 2 | B's opening crit and hit (90 + 39). |

- **About 22 of the 54 logged enemy attack rolls were aimed at him (roughly 40%)**; with Wide Swings it is closer to half.
- He took 555: about 410 from Strikes and about 145 from area effects (two Howls, two Invoke Runes, one Spirit Song).
- **The one expensive moment** was round 1 at the Plaza. Prevailing Position on the rune cone saved 34. It left him at AC 44, where Yrasthura's 55 was a crit by 11 (112 damage and a vorpal save) instead of a hit by 9 at AC 46 (about 56).
- **Where it did not reach**: Mithtirith took 9 attack rolls across the last two fights; 6 beat his AC, 5 landed (one was lost to a dazzled flat check), and 3 of those were crits. Ancient One B got to him by teleporting as a free action.

---

## 7. In-combat healing (downtime excluded)

| Healer | In combat | Method | Recipients |
|---|---|---|---|
| **Mithtirith** | **about 620** in two fights | Heal at ranks 9, 8 and 6 with Communal Healing; one three-action Heal | Sevek 293, Mithtirith 175, Paya 72, Kreebnock 81 |
| **Kreebnock** | **163** | Restore the Mind ×4 (38 each), Soothe (49) | Aureys 38, himself 38, Paya 49, Mithtirith 38 |
| Paya | 0 in combat | — | All of his roughly 820 was between fights or in the prep round. |

- The prep round before the Ancient Ones added Paya's Torrent in the Blood, Kreebnock's Soothe on Sevek (50), Aureys' potion (66) and Sevek's Zealous Conviction (12 temporary HP on five people).
- Triage was sound: more than half of Mithtirith's healing went to Sevek, and the rest to himself, the two main targets of the last two fights.
- Aureys received almost nothing in combat. She took the least damage after the Shoggoths, and she stands in enemy squares where a three-action Heal cannot reach her.

---

## 8. Roll analysis

Natural d20 only. For rerolls the first die is used. z is against a fair d20 (mean 10.5, SD 5.77); with samples this small, anything inside ±1.6 is ordinary.

### Attack rolls, split by multiple attack penalty

| | No MAP | MAP −4 / −5 | MAP −8 / −10 | All attacks |
|---|---|---|---|---|
| **Sevek** | n 14 · mean **7.86** · z **−1.71** | n 12 · mean **12.83** · z +1.40 | n 3 · mean 6.00 | n 29 · mean 9.72 · z −0.72 |
| **Aureys** | n 37 · mean 10.43 · z −0.07 | n 4 · mean 12.75 | n 6 · mean 8.50 | n 47 · mean 10.38 · z −0.14 |
| **Paya** | n 21 · mean 9.52 · z −0.78 | n 6 · mean 12.00 | n 11 · mean **11.91** · z +0.81 | n 38 · mean 10.61 · z +0.11 |
| **Kreebnock** | n 4 · mean 10.00 | — | — | n 4 · mean 10.00 |
| **Mithtirith** | — | — | — | no attack rolls |
| **Party** | n 76 · mean 9.68 · z **−1.23** | n 22 · mean 12.59 · z **+1.70** | n 20 · mean 10.00 · z −0.39 | n 118 · mean 10.28 · z −0.42 |

- **Sevek, no MAP**: 6, 7, 15, 1, 17, 3, 5, 10, 3, 1, 7, 13, 2, 20. Six of fourteen were 5 or lower; two were natural 1s. The 20 was the last roll of the session.
- **Sevek, MAP −5**: 15, 14, 16, 5, 10, 6, 15, 18, 19, 2, 20, 14. His Flurry's second Strike did the work all night.
- **Aureys** makes most of her attacks at no MAP (reactions, agile weapons, Quickstrike), which is why her first column has 37 rolls. Dead average; her damage is volume and debuffs.
- **Paya's three natural 20s were all at no MAP**, and his no-MAP column is still below average, because the other eighteen rolls included two 1s and five more at 5 or lower. His luck was at MAP −10: four of eleven were 15 or higher, three of them natural 19s, and two of his kills came from there.

### Saves and everything else

| | Saves | Other (skills + initiative) | Everything |
|---|---|---|---|
| **Sevek** | n 11 · mean 12.82 · z +1.33 | n 9 · mean 8.56 · z −1.01 | n 49 · mean 10.20 · z −0.36 |
| **Aureys** | n 7 · mean 13.57 · z +1.41 | n 24 · mean 10.33 · z −0.14 | n 78 · mean 10.65 · z +0.24 |
| **Paya** | n 13 · mean 10.23 · z −0.17 | n 6 · mean 7.83 · z −1.13 | n 57 · mean 10.23 · z −0.36 |
| **Kreebnock** | n 6 · mean 11.17 · z +0.28 | n 5 · mean 8.60 · z −0.74 | n 15 · mean 10.00 · z −0.34 |
| **Mithtirith** | n 2 · mean 15.50 | n 5 · mean 12.00 · z +0.58 | n 7 · mean 13.00 · z +1.15 |
| **Party** | n 39 · mean 11.97 · z **+1.60** | n 49 · mean 9.69 · z −0.98 | n 206 · mean **10.46** · z **−0.10** |

- **Sevek's saves were hot overall and cold on the one that mattered**: the vorpal Fortitude was a 4. His skill dice were poor (Trip first dice of 9 and 1, Religion 16 and 1); the Mythic Point covered the Trip.
- "Other" is mostly initiative for everyone but Aureys, whose 19 skill rolls (Feint, Demoralize, Stealth, Scare to Death) averaged 11.05.
- Saves were logged for every PC against area effects; Kreebnock's own save dice were average (he failed two Howls on a 3 and an 8, and crit-failed the Spirit Song on a 4).

### Enemy d20s

| | No MAP | MAP −4 / −5 | MAP −8 / −10 | All attacks | Saves vs party | Other |
|---|---|---|---|---|---|---|
| **All enemies** | n 31 · mean 8.97 · z **−1.48** | n 14 · mean 12.79 · z +1.48 | n 9 · mean 12.33 | n 54 · mean 10.52 · z +0.02 | n 38 · mean 11.13 · z +0.68 | n 17 · mean 10.00 |

| By creature (attacks) | n | Mean | z |
|---|---|---|---|
| Shoggoths | 15 | 9.33 | −0.78 |
| Rune Giants | 11 | 12.64 | +1.23 |
| Runic Warmaws | 8 | 10.25 | −0.12 |
| Knights of Malice | 13 | 9.08 | −0.89 |
| Yrasthura | 2 | 11.50 | — |
| Ancient Ones | 5 | 13.20 | +1.05 |

Cody's dice were average overall, with the same cold-first, hot-second shape as the party's. The Plaza took 60% of the pool with the knights rolling below average. Enemy Wide Swings are logged without a target, so a few are missing from the per-target counts but are in these totals.

### Save luck against each caster

| Caster | Enemy saves | Mean natural | z | Counterfactual with every enemy rolling a 10 |
|---|---|---|---|---|
| **Kreebnock** | 8 | **14.12** | **+1.78** | Both Dazes (rolled 18 and 19) become failures: about +58 damage, and **each would have killed a rune giant that instead survived on 2 and 3 HP**. Weight of the World (rolled 18) becomes a success instead of a critical success. Phantasmagoria is unchanged. |
| **Mithtirith** | 2 | 2.00 | −2.08 | The other way round: Spirit Blast (a natural 1) would have been a success for about 29 instead of 118. His two save spells both drew bottom-of-the-die rolls, and both finished or set up a kill. |
| **Sevek** | 11 | 10.91 | +0.24 | Neutral. Glory on High drew a natural 1 from the knight and a 16 and 18 from the other two that mattered. |
| **Aureys** | 5 | 10.80 | +0.12 | Neutral. |

Kreebnock has a real grievance: enemies rolled well against his DCs specifically (about a 1-in-25 run), while his own dice were average. His 420 in the damage column understates his night for that reason, on top of the Haste, the two reaction Strikes he handed out, and 163 points of in-combat healing.

---

## 9. What didn't fire

| Creature | Printed, never seen in the log |
|---|---|
| **Shoggoth** | Maddening Cacophony, Engulf, Eat Away. Three of them used only pseudopod and Grab, and two died inside three rounds. |
| **Rune Giant** | Flashing Runes, Command Giants, and every spell (Dominate, Suggestion, Charm). |
| **Runic Warmaw** | Chain Lightning, Force Barrage, Rune Flare, Echo Arcana, Pack Attack. Arctic Rift was cast once, by Yrasthura through Share Runes. |
| **Knight of Malice** | Sinful Bite, Seethe, Jealous Enmity. One was blind from round 1 and the other was dazzled, then fled. |
| **Yrasthura** | Flashing Runes, Command Giants, Dominate. She had two full turns. |
| **Ancient One** | Disintegrate, Detonate Magic, Harm, Confusion, Dismantle All Life, Otherworldly Mind, Annihilation Ray, Wretched Claw. A acted once per life; B spent three Mythic Points on movement. |

The Ancient Ones' printed 9th-rank single-target spells never appeared; they were run on a blade and Spirit Song. Yrasthura died on her third turn in initiative with her control spells unused, two rounds after Kreebnock's Phantasmagoria and Aureys' debuffs landed.

---

## Uncertainty notes

- **Sample sizes.** The MAP −8/−10 columns have 3 to 11 rolls per PC. Treat those as descriptions of what happened, not as evidence of anything.
- **Wide Swing targets** are not in the log lines, so per-target attack counts for the giants and Yrasthura come from the transcript.
- **Mythic resistance on the Ancient Ones**: inferred absent because logged applications equal the rolls to within a few points. Whether their Mythic Resilience (Will) was in use is not visible.
- **Tier 2 flips** are my own recomputation from Foundry's margins and condition lists. They agree with Foundry's `ESSENTIAL` tags in ranking (off-guard, then frightened, then Anthem), which is the check I have.
- **Shoggoth crit flips** are not separated out of the hit→crit count and are worth nothing against crit immunity.
- **Knight of Malice B** fled at 315/350, so its real durability was never tested.
- **XP re-pricing of the Plaza** depends on reading Yrasthura as level 20; her HP alone reads higher and her AC lower.
