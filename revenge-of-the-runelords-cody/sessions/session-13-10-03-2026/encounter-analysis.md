# Session 13 — Encounter Analysis

**Revenge of the Runelords (Cody) · 2026-10-03 · party level 17 · four PCs (Paya absent)**
Sources: `rolls.txt` (foundry-export v2, single header, no double paste); the cleaned transcript; the AP stat blocks in `pf2e/revenge-of-the-runelords-bestiary/book-2-crypt-of-runes/` (`animate-nightmare-*.json`, `bittersweet-sister.json`); level benchmarks taken from the median of every NPC in the local packs (levels 14–25, 1,000+ creatures).

**Party HP pool tonight: 899** (Sevek 263 · Aureys 212 · Kreebnock 195 · Mithtirith 229). A five-PC party was facing encounters at four-PC strength.

---

## The headline

1. **Tonight's difficulty came from offence, not HP.** Cody rebuilt the **Bittersweet Sisters as melee bruisers**. The book gives them a weak caster's claw (+23, 3d12+15). They hit at **+35 / +37 / +38**, and +40 once Spleen went elite, for **4d12+18 to 4d12+27** with Rend. That is the attack of a level-20 to 21 monster. Their spell DCs went up 2 to 5, and Spleen cast four spells that aren't on her stat block. The nightmares were scaled more modestly: **+3 to hit, +17% damage, +28% to +68% HP**.
2. **The XP budget calls the session three Moderates and a Severe. The damage says Moderate, Low, Extreme, Extreme.** The last two fights took **94% and 111% of the party's HP pool**. Mithtirith went to 0, and Aureys finished on 18.
3. **The party rolled hot, and Pax most of all.** Party d20 mean 11.85 (z +3.25, n = 192). Pax: **12.29 (z +2.44)**, the table's best on attacks *and* saves. The enemies were dead average (attacks z −0.16, saves z −0.10). This was a hard night that good dice made comfortable, not an easy night.
4. **Sevek's tank kit prevented about 600–650 damage and stopped one PC from going down** (breakdown in §6). AC and Taunt changed *where* the damage went: **enemies needed nearly twice as much to-hit against him, and he took 1 crit in 13 attacks while Aureys took 6 in 19.**

---

## 1. Per-creature tables

### Defence: book → as run

| Creature | HP book → as run | AC book → run (from CTX + conditions) | Saves book → run (F/R/W) | Resistance |
|---|---|---|---|---|
| Disordered Axolotls ×2 | 235 → **350** (×1.49) | 39 → 39–40 | 28/31/30 → **28/31/30** | resist all 10 + precision immunity: **kept** (Tempest Surge rolled 81, applied 71) |
| Famine Bear | 235 → **300** (×1.28) | 39 → 39 | book | kept |
| Plague Wolves ×2 | 235 → **300** (×1.28) | 39 → 39 | book | kept |
| Lurking Cataclysm (disaster) | 235 → **395** (×1.68) | 39 → **41** | book | kept |
| **Aceta** (youngest sister) | 350 → **430** (×1.23) | 38 → **41** | 26/32/29 → **28/≈35/31** | weakness cold iron 15 |
| **Raanka** (middle) | 350 → **455** (×1.30) | 38 → **42** | → ≈ **?/35/?** | cold iron 15 |
| **Spleen** (eldest) | 350 → **520, then +290 from Undying Myth = 810 effective** (×2.31) | 38 → **44, +2 Moonlight's Kiss = 46**, up to 48 once elite | 26/32/29 → **31/37/34** (+5) | cold iron 15 (**applied**: Sevek's 29-point hit landed for 44) |

HP figures are the export header's `exact (observed at 100%)` values, not inferred. Damage was applied **after** the nightmares' resist-10, so their HP inflation is real and not resistance math.

### Offence: book → as run

| Creature | Strike book → as run | Avg/hit book → run | Spell DC book → run | Spells cast that the block lacks |
|---|---|---|---|---|
| Axolotls / Bear / Wolves | Tendril +31, 8d8 void → **+33–34, 6d8+15** | 36 → **42** (+17%) | 38 → 36–38 | none |
| Lurking Cataclysm | +31 → **+36, 6d8+17** | 36 → **44** | 38 → 39 | none (it never cast its own Phantasmal Calamity) |
| **Aceta** | Claw **+23, 3d12+15** → **+35, 4d12+18** | 34.5 → **44** | 38 → **40** | — |
| **Raanka** | → **+37, 4d12+22** + Rend | → **48** | → **42** | Spirit Song r8, Telekinetic Bombardment r7; **truesight** |
| **Spleen** | → **+38, 4d12+25** + Rend → elite **+40, 4d12+27** | → **51 / 53** | → **43**, **45 once Elite** (two casts read 41 only because she was frightened 2 and frightened 4) | **Phantasmagoria at rank 10** (block: 9), **Wails of the Damned r9**, **Spirit Song r9**, **Phantasmal Calamity r7**, **Undying Myth**, **Kip Up** |

**Template verdicts**
- **Nightmares**: modest **elite-plus**. Attack +3, damage +17%, HP up 28–68%, saves at book, and the printed resistance kept.
- **Sisters**: **rebuilt offence on a near-book frame.** Attack +12 to +17 over book is not a template, it's a different creature. AC +3 to +6, DC +2 to +5, HP +23–49%, with Spleen's two lives on top.

**Per-axis level profile** (median NPC by level from the local packs: L17 = HP 315 · AC 40 · attack +33 · DC 38)

| Creature | AC reads as | Attack reads as | DC reads as | HP reads as | XP prices it as |
|---|---|---|---|---|---|
| Axolotls | L17 | L18 | L16–17 | L19 | L17 (PL+0) |
| Bear / Wolves | L16 | L17–18 | L16–17 | L16 | L17 |
| Lurking Cataclysm | L18 | **L19–20** | L18 | **L21** | L17 |
| Aceta | L18 | **L18–19** | L19 | **L21–22** | L17 |
| Raanka | L18–19 | **L20** | **L20** | **L22** | L17 |
| Spleen | **L20–21** with the moon | **L20–21** | **L20–21** | **L24, or past L25 counting Undying Myth** | L17 |

This is the S14-style pattern again: **grind inflation (HP) on everything, and real threat inflation (attack, damage, DC) on the sisters.**

---

## 2. Per-fight table

| Fight | Rounds | Grind (enemy HP cleared) | Damage the party took | % of pool | In-combat healing | Concentration | Worst moment |
|---|---|---|---|---|---|---|---|
| **E1 Axolotls** | 4 | 700 | 240 | 27% | 0 | Aureys 103, Sevek 69 | — |
| **E2 Aceta + Bear** | 3 | 730 | 155 | 17% | 0 | Aureys 83, Mithtirith 56 | Aceta 0-for-3 on her last turn |
| **E3 Raanka + Wolves** | 6 | 1,055 | **842** | **94%** | 490 | **Kreebnock 316**, Sevek 251 | Kreebnock on **34 HP** with a 48-point Rend inbound |
| **E4 Spleen + Cataclysm** | 7 | **1,205** | **996** | **111%** | 634 | **Aureys 370**, **Mithtirith 324** | **Mithtirith to 0** (Contingency); **Aureys on 18** at the end |

Survival margin (pool + in-combat healing − damage taken): E3 **+547**, E4 **+537**. Nobody was beaten, but in both fights the healing was carrying it.

## 3. Two-axis verdict and the re-priced budget

Four-PC thresholds: Moderate 80 · Severe 120 · Extreme 160.

| Fight | XP (book levels) | XP (empirical levels) | Grind | Threat | **Verdict** |
|---|---|---|---|---|---|
| E1 | 80 Moderate | ~120 (two ~L18) Severe | medium | low (27%) | **Moderate**: big HP bags with modest damage |
| E2 | 80 Moderate | ~110 | medium | low (17%) | **Low**: Aureys' debuffs plus Aceta's cold dice (mean natural 7.7) |
| E3 | 120 Severe | ~200 (Raanka ≈ PL+3, wolves ≈ PL) | high | **high (94%)** | **Extreme** |
| E4 | 80 Moderate | **~240** (Spleen PL+4 with two lives, Cataclysm ≈ PL+2) | **highest** | **highest (111%)** | **Extreme+** |

The budget can't see the sisters' rebuilt claws. The three sisters, book-level-17 "casters" priced at 40 XP each, dealt **~1,640 of the ~2,200 damage enemies did to the party: three quarters of it** (Spleen 908, Raanka 593, Aceta 139).

---

## 4. Damage contribution (applied, overkill capped, persistent damage credited to its source)

| PC | E1 | E2 | E3 | E4 | **Session** | Share | Kills |
|---|---|---|---|---|---|---|---|
| **Sevek** | 247 | 199 | 461 | 546 | **~1,453** | **40%** | **4** (Axolotl B, Aceta, Wolf A, Lurking Cataclysm) |
| **Aureys** | 214 | 420 | 327 | 451 | **~1,412** | 39% | 3 (Axolotl A, Bear, Raanka) |
| **Kreebnock** | 75 | 83 | 194 | 160 | **~512** | 14% | 2 (Wolf B, **Spleen**, bleed) |
| **Mithtirith** | 164 | 28 | 27 | 48 | **~267** | 7% | 0 |

Raanka's Spirit Song put 46 into her own wolf. **About 105 of Sevek's 546 in E4 came from Spleen's cold iron weakness 15 on his staff** (seven hits), which Mithtirith's Recall Knowledge had found. **Sevek forced Spleen's Undying Myth with a single Herald's Weapon hit**, so the 290 HP of her second life came out of the whole party's pocket.

---

## 5. What the control package bought (offence)

Foundry's modifier-matters tags give **Tier-1 (marginal) flips**: removing that one modifier changes the outcome.

| Roller | Flips | By source |
|---|---|---|
| Aureys | 18 | **Off-guard 12** (Feint / flanking), Frightened 4 (incl. **Frightened 4** off her Majestic Presence nat 1), **Clumsy 2 ×2, from Sevek's Greater Crushing crit on the bear**, Anthem 1 |
| Sevek | 16 | **Off-guard 7**, Frightened 3, Clumsy 1 ×2 (Aureys' Earth to Heavens), **Inner Upheaval +1: 3**, Anthem 1 |

**The debuffs ran both ways.** Most of Sevek's flips came from conditions someone else put up: Aureys' Feints and Earth to Heavens Strike, flanking, and her frightened. In return, **his Greater Crushing rune put Clumsy 2 on the bear with his natural-20 crit**. That turned two of Aureys' claws into crits (the 64, and the double crit that killed the bear) and made the bear's next tendril on her miss by 1. Earth to Heavens only gives Clumsy 1; every Clumsy 2 tonight was the crushing rune. Off-guard, at 19 Tier-1 flips across the party, was again the biggest single lever.

---

## 6. ⭐ Sevek's tank kit — what it actually bought

### Where the attacks went

| Target | Attacks | Connected | Crits | Effective AC |
|---|---|---|---|---|
| Aureys | 19 | 12 (63%) | **6** | 38 |
| **Sevek** | 13 | 7 (54%) | **1** (a natural 20) | **45** in stance / 43 out |
| Kreebnock | 6 | 6 | 1 | 38 |
| Mithtirith | 4 | 2 | 1 | 38 |

**The AC math.** Against a +37 claw, AC 45 means the enemy needs an 8 to hit and an 18 to crit. Against AC 38 it needs a 1 and an 11. With the sisters' ~48-point claws, **each claw aimed at Sevek costs about 38 HP on average, and each one aimed at an AC-38 ally about 70.** Every attack he drew roughly halved its own value. That's the Taunt dividend, even before the penalty.

### Itemized: damage prevented, from the log

| Tool | What happened | Prevented (approx.) |
|---|---|---|
| ⭐ **Life Connection** | Raanka's Rend (48) on **Kreebnock, who was on 34 HP**. Foundry first applied it to him (capped at 34), then reverted it to Sevek. | 48, **plus Kreebnock not going down**: no dying track, and no turn of Mithtirith's spent reviving him |
| **Taunt (−1)** | Two Raanka claws on Kreebnock landed at +9. Without Taunt they're +10 crits (Cody: *"because of Taunt, not a crit"*). Spleen's claw on Mithtirith missed by 1 (Taunt, Mystic Armor and Frightened 4 each essential). Aceta's 38-vs-38 claw Cody ruled a miss once the Taunt penalty was accounted for. | ~95 (two crits halved) + ~52 + ~42 ≈ **190** |
| **Whirlwind +2 AC (fused stance)** | Raanka's claw missed by 1. Spleen's 15:29 claw hit at +8, which is a crit without the +2 (49 → ~98). | ~47 + ~49 ≈ **96** |
| **Prevailing Position** | Plague Wolf B's tendril hit by exactly 0; +4 AC → miss | ~**40** |
| **Nimble Crawl** | Prone in front of a wolf, the tendril rolled 52 against off-guard AC 41 (a crit). Pax called Nimble Crawl and Cody rolled it as a hit (53 instead of ~106). | ~**53** |
| **Legendary Will + Path to Perfection** | **9 crit saves out of 10 Will saves.** Every success became a crit: Vision of Death, three Panicking Touches, Phantasmagoria ×3, Phantasmal Calamity. Mithtirith was confused twice and stunned once off these same spells. | ~**140** (the crit-vs-success half on ~290 points of spell damage), plus the confusion and stun he never took |
| **Kip Up** | Stood from prone with no reaction and no action, the turn after the wolf crit | 1 action |
| **Bear Hug + Trip** | Spleen spent a Mythic Point to break the first grab. The second grab forced a DC 5 flat check on Ride the Moonbeams, which she failed and **spent a second Mythic Point to reroll**. His Herald's Weapon hit then **forced Undying Myth**. Her whole pool went answering Sevek. | 2 MP + Undying Myth taxed |
| **Celestial Armaments** | 3 blind saves (bear, wolf B, Cataclysm): **0 blinds**. They needed 9–11 and rolled 14, 19, 19. | 0 (unlucky: ~45% each to land) |

**Total: about 470 directly prevented, plus ~140 off Will saves, plus a PC kept off the dying track: ≈ 600–650 HP of mitigation in a session where the party took 2,233.**

### Where the kit didn't reach
- **Raanka ignored the Taunt** and put four claws into Kreebnock (238 damage). Taunt's −1 is a crit-shaver, not an aggro lock; this matches the S8–S11 finding.
- **Spleen's last round**: Taunt wasn't up (Frostbite turn), and **all four of her claws went to Aureys**: two crits, 184 damage, Aureys left on 18.
- **Teleports**: Ride the Moonbeams moved Spleen 60 ft a turn, and on two of her turns she was away from Sevek, attacking Mithtirith (who dropped). The **moon-mirrors that powered it were never smashed**, and they also gave her +2 AC for the whole fight. Kreebnock: *"We got some mirrors to smash."*
- **Area spells don't care about AC**: Wails of the Damned, Spleen's Spirit Song, Telekinetic Bombardment and Raanka's Phantasmagoria cost him 147 of his 532 in-fight damage. Fortitude was his weak save tonight (1 crit, 2 failures).

### Healing he received in combat
Mithtirith 204 · Kreebnock 55 (Soothe), against 532 taken in fights. He was **never below 72 HP**.

---

## 7. In-combat healing (downtime excluded)

| Healer | In-combat HP | Method | Recipients |
|---|---|---|---|
| **Mithtirith** | **961** | Heal with Communal Healing, Fast-Channel Heal, Healer's Gloves, **Contingency on himself** | Kreebnock 261 · himself 255 · Aureys 241 · Sevek 204 |
| Kreebnock | 163 | Soothe, Restore the Mind ×3 | spread evenly |
| Paya (Cody-run, between fights) | **0 in combat** | Treat Wounds, Ocean's Balm, Fresh Produce: 1,512 out of combat | — |

E1 and E2 needed no in-combat healing at all. In E3 and E4, **in-combat healing equalled about 60% of the damage the party took** (1,124 of 1,838), mostly Mithtirith's.

---

## 8. Roll analysis

### Party d20s (natural die; for rerolls, the first die where the log shows it)

| PC | Attacks | Saves | Skills | Initiative | **All** |
|---|---|---|---|---|---|
| **Sevek** | n 39 · **12.10** · z +1.74 · 3×20, 1×1 | n 14 · **12.36** · z +1.21 · 1×20 | n 5 · 10.60 | n 4 · **16.00** | **n 62 · 12.29 · z +2.44** |
| Aureys | n 43 · 11.53 · z +1.18 | n 6 · **14.00** | n 26 · 11.65 · z +1.02 | 10.75 | n 79 · 11.72 · z +1.88 |
| Kreebnock | n 6 · 11.83 | n 12 · **15.25 · z +2.85** | n 9 · 11.67 | 8.75 | n 31 · 12.71 · z +2.13 |
| Mithtirith | — (all save spells) | n 11 · **9.09** · 2×1 | — | 8.50 | n 15 · **8.93 · z −1.05** |
| **Party** | n 88 · 11.81 · z +2.13 | n 43 · 12.56 · z +2.34 | n 45 · 11.58 | n 16 · 11.00 | **n 192 · 11.85 · z +3.25** |

Cody's on-mic averages (Pax 12, Anna 11.8, Arrakis 11.8, Jesse 9.5) agree with this.

- **Sevek was hot on both offence and defence.** Three attack nat 20s, each worth a crit (bear 119, Wolf A, Cataclysm 153), plus an initiative 20.
- **Kreebnock's split personality**: saves at 15.25 (seven crit saves), while **all three Unexpected Shift flat checks failed** (4, 5, 2). Each one would have given him resistance to a Raanka claw.
- **Mithtirith was the cold one**: 1, 1 and 2 on saves, a crit-failed Phantasmal Calamity, and the lowest average at the table. He was also on save spells, so the cold dice didn't cost his damage much.

### Enemy d20s (modifiers visible in the v2 export, checked)

| Roller | n | Mean | z |
|---|---|---|---|
| All enemy attacks | 42 | 10.36 | **−0.16** |
| Aceta | 6 | **7.67** | −1.20 |
| Spleen | 12 | 10.75 | +0.15 |
| Plague Wolves | 7 | 14.3 | +1.7 |
| **Enemy saves vs PC effects** | 39 | 10.41 | **−0.10** |
| Enemy initiative | 9 | 8.44 | −1.07 |

**The enemies rolled dead average.** The six crits on Aureys came from AC 38 against +35–40 attackers (a 50% crit chance per claw), not from enemy luck. Two of them were natural 20s, and four were ordinary rolls of 11–16.

**Counterfactual: if the party had rolled average** (mean 10.5 instead of 11.85, about 1.35 points per roll), roughly 7% of party attack rolls would have dropped a degree. Over 88 attacks that's about 6 fewer hits or crits, roughly 250–350 damage. The four fights still end, but E4 runs a round or two longer while Spleen keeps attacking a party that's already at 111% of its pool.

---

## 9. What didn't fire

- **Bittersweet Sisters' printed kit**: Dreadful Prediction, Confusion, Cursed Metamorphosis, Mask of Terror, Spirit Blast, Change Shape, Fear: **none used**. Cody swapped the casters for a melee-plus-AoE build.
- **Nightmares**: each had a signature 8th-rank spell (Confusion, Vampiric Exsanguination, Spiritual Epidemic, Phantasmal Calamity), plus Warp Mind, Nightmare, Sleep, Fear and Translocate. **Only Vision of Death and the Cataclysm's Phantasmagoria were ever cast.** Kreebnock's natural-1 Daze stunned Axolotl A, and three of the four nightmares died within two rounds of their first turn.
- **The sisters' Ferocity** posted for Aceta and Raanka, but both were declared dead.
- **Celestial Armaments blind**: 0 for 3.
- **Heroic Presence**: still unused.

---

## Uncertainty notes
- Prevented-damage figures use average damage for the specific attacker, and a crit counted as ×2 of its hit.
- The Will-save "≈140" assumes a normal success would have taken half. Mental riders (confusion, stun) aren't priced in.
- Rerolled saves (Ascended Celestial on Aceta's Phantasmagoria, the Mythic Point on Raanka's, Mithtirith's Headwrap) appear once in the log, with the die that stood.
- Sister save modifiers are partial: the export keys enemy saves by token ID, and not every save maps cleanly to a caster.
