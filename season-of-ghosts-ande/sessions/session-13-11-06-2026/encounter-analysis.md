# Encounter Analysis — Season of Ghosts (AndeGM), Session 13

**Party**: level 6, five PCs (Free Archetype, Gradual Boosts, Ancestry Paragon). **HP pool 352** (Kaelen 86 · Iryoku 80 · Zhen 74 · Kaoru 68 · Mu-Jin 44), plus Weaver 42. These are Foundry's own max-HP values from the export header.
**Sources**: `rolls.txt` (export v2, one session, no double paste) and the cleaned transcript. Every creature's book block was read from the local pack's full JSON.

## Headline

**Every creature ran exactly on its book block, and none of the three fights threatened anyone.** The party took **82 damage all night**, about 23% of one PC's worth of HP across three fights, with zero in-combat healing needed. Two fights ended in **one round**; in the dormitory **no enemy took a single action**. The greenhouse's four rounds came from the fungus leshies' mutual healing (122 HP re-cleared) and difficult terrain, not from danger.

**The one real threat in the session was the fight that didn't happen.** The three monks of Kugaptee are level 6 (PL+0), with HP 90, AC 24 and Fist +17 for 2d6+8 + 1d6 void, plus Stunning Flurry and Steal Breath. That is 120 XP, between Moderate and Severe for five. Mu-Jin's tea ceremony resolved it with no fight, and the GM paid it out at 96 XP. It's the only encounter of the night the XP budget rates above Low, and the party talked its way past it.

The table's after-session verdict ("too easy") is correct on the numbers.

---

## 1. Creatures — book vs as run

### Defence
| Creature | Book HP | As run (Foundry exact / damage-to-kill) | Book AC | AC as run (CTX) | Saves F/R/W | Resist / weak |
|---|---|---|---|---|---|---|
| **Yuni** (L7 ghost) | 82 | **82** (damage applied sums to exactly 82) | 23 | 23 | 11/15/17 | all-damage 5 · rejuvenation |
| **Guhdggi** (L5) | 80 | **80** | 21 | 21 | 13/9/14 | void 5 · silver weak 5 |
| **Meokdan** ×5 (L2) | 32 | **32** each (the five sum with the Guhdggi to 240) | 17 | 17 (never attacked) | 5/9/9 | void 5 · silver weak 5 |
| **Fungus Leshy** ×6 (L2) | 30 | **30** (export header: exact) | 19 | 19 | 8/10/6 | — |
| **Slime Mold** ×2 (L2) | 60 | **60** | 12 | 12 | 11/3/4 | immune crits, precision |

### Offence
| Creature | Book | As run |
|---|---|---|
| Yuni | Frightful Moan DC 25 Will; Tiger Attack 4d6 DC 25 basic Reflex (30-ft); Ghostly Hand +15 2d8+8 void | Moan DC 25, Tiger Attack DC 25 4d6 (rolled 16). **Book.** Ghostly Hand never used. |
| Guhdggi | Broken Spear +14 2d6+6 +1d6 mental; Hair Lash +13 grab; Belch Butterflies 8d6; Slow, Enfeeble | **Never acted.** |
| Meokdan | Bite +10 1d4+6; Snack; Phantom Pain | **Never acted.** |
| Fungus Leshy | Fist +10 1d6+2; Spore Pod +10 1d6+2 + spores; Spore Cloud DC 16 Fort | Fist +10, Spore Pod +10, Spore Cloud DC 16. **Book.** |
| Slime Mold | Pseudopod +8 1d8+3 + Slime Rot | Pseudopod +8. **Book.** |

**Verdict: every creature is on book.** No Elite, no Weak, no payload changes. The only oddity is that some fire hits on leshies applied +3 over the roll even though the GM told Mu-Jin they had "no weaknesses." It's small and probably a kineticist or table effect; it changes no verdict. With every axis on book, no per-axis level profile is needed: each creature reads as its printed level.

## 2. Per-fight

| Fight | Rounds | Enemy HP cleared (grind) | Party damage taken (threat) | % of pool | Concentration | In-combat healing | Enemy actions |
|---|---|---|---|---|---|---|---|
| **E1 Yuni** | 1 | 82 | 48 + Weaver 8 | **13.6%** | even (16 each to Zhen, Mu-Jin, Iryoku) | 0 | one turn: Moan + Tiger Attack |
| **E2 Guhdggi + 5 Meokdan** | 1 | 240 | **0** | 0% | — | 0 | **none** |
| **E3 2 slime molds + 6 leshies** | 4 (R4 = one turn) | 300 + **122 Verdant Burst heals** = 422 | 26 | **7.4%** | **all on Kaelen** (30% of his HP) | 0 | 31 attacks, 4 hits |

Survival margin was never in question. Garden of Healing after E1 and E3 restored everything; that healing was out of combat both times.

## 3. Two-axis verdict and the XP budget (5 players: Trivial 50 · Low 80 · Moderate 100 · Severe 150 · Extreme 200)

| Fight | XP budget (PL 6) | Budget says | Grind | Threat | Actually was |
|---|---|---|---|---|---|
| E1 Yuni (PL+1) | 60 | Trivial–Low | tiny | low (one AoE turn) | **Low** |
| E2 Guhdggi (PL−1) + 5 Meokdan (PL−4) | 30 + 50 = 80 | Low | medium | **none** | **Trivial**: two AoE turns ended it before anything acted |
| E3 8 × PL−4 | 80 | Low | medium-high (heals) | very low | **Low, long**: a grind, not a threat |
| *(skipped)* 3 monks of Kugaptee (PL) | 120 | Moderate+ | — | — | resolved by tea |

GM awards were exactly 0.8× the 4-player budget (48 / 64 / 64 / 96). That is the standard per-character conversion, so the awards confirm the creatures' levels.

**Why E2 and E3 under-performed even their Low price:** both were hordes of PL−4 bodies. Three rank-3 area spells (Zhen's Fireball and Earth's Bile, Kaoru's Fireball) plus Blazing Wave delete 32-HP creatures with Reflex +9. The budget rates PL−4 bodies at 10 XP each, but even that over-prices bodies that die to splash before they act. It is exactly the "more weak mobs do nothing" pattern Zhen described at the table.

## 4. Damage contribution (HP actually removed, `hp delta`, overkill excluded)

| PC | E1 | E2 | E3 | **Session** | Share |
|---|---|---|---|---|---|
| **Zhen** | 33 | **109** | 123 | **265** | 35.6% |
| **Iryoku** | 8 | 79 | **176** | **263** | 35.3% |
| Kaelen | 21 | 33 | 87 | 141 | 19.0% |
| Kaoru | 12 | 19 | 28 | 59 | 7.9% |
| Mu-Jin | 8 | 0 | 8 | 16 | 2.2% |
| **Total** | 82 | 240 | 422 | **744** | |

- **Zhen and Iryoku together did 71%**, almost all through area effects: Earth's Bile, Fireball and Blazing Wave/Flying Flame.
- **Kills**: Zhen 7 (4 Meokdan, 1 leshy, 2 slime molds) · Kaelen 4 (Yuni, Guhdggi, 2 leshies) · Kaoru 2 · Iryoku 1 · Mu-Jin 1.
- **Overkill**: Zhen 56 (38 of it was Fireball splash on dead or dying Meokdan) · Kaelen 32 · Kaoru 24.
- Kaelen's damage is concentrated in finishers: three of his four kills were the last hit on a target others had softened.

## 5. What the control package bought

Foundry's `MM :: ESSENTIAL` tags (Tier 1: remove only this modifier and the outcome changes) flag 9 rolls. Valued properly:

| Flip | Source | Outcome change | Value |
|---|---|---|---|
| Kaoru Spellstrike on Yuni, hit by 0 | **off-guard from Zhen's nodachi crit** (sword critical specialization) | miss → hit | **8 damage** (5 + 3 Shocking Grasp) |
| Mu-Jin Needle Darts on Yuni, hit by 0 | off-guard (same source) | miss → hit | **8 damage** |
| Kaelen strike on Yuni, miss by −9 | off-guard | crit miss → miss | 0 |
| Zhen nodachi on a slime mold, "crit" by +10 | off-guard | crit → hit, but slime molds are crit-immune | 0 |
| Weaver Will / Reflex / Fort ×2 | Master saves (Familiar Master) | Reflex success saved 8; one Fort save turned spore failure into success | defensive, ~8 HP |
| Zhen's dormitory Search | Medium's Awareness +2 | success → crit | none tangible (Kaelen and Kaoru also passed) |

**Net: two real offensive flips, both worth 8, both enabled by Zhen's natural-20 crit.** Its off-guard rider gave Kaoru and Mu-Jin 16 of Yuni's 82 HP. Mu-Jin's Nudge Fate and Balanced Luck were active in E3 but never decided a roll (no ESSENTIAL tags). Little control mattered because so little was at stake.

**Hero points as the real control package:** 13 in-combat rerolls (14 in the log; one was Mu-Jin's out-of-combat Society reroll):
- E1: 3 (Zhen and Iryoku initiative, Kaoru Spellstrike)
- E2: 1 (Iryoku initiative)
- E3: 9 (Iryoku 3, Kaelen 2, Kaoru 2, Zhen 1, Weaver 1)

At this table a low reroll is floored to 10, which converted most of these. E3 burned nine hero points on a fight that never threatened anyone.

## 6. In-combat healing

**None.** No PC was ever low enough to need it. Zhen's two Gardens of Healing were post-fight, restoring 56 after E1 and 26 to Kaelen after E3.

## 7. Roll analysis (natural d20s; on reroll lines, the first die)

| Roller | Attacks n / mean / z | Non-attack (saves, skills) n / mean / z | Initiative n / mean |
|---|---|---|---|
| Zhen | 4 / 8.5 / −0.7 (one nat 20, two nat 1s) | 11 / **13.0 / +1.4** | 4 / 6.8 (two nat 1s) |
| Iryoku | 5 / **4.4 / −2.4** | 10 / 11.7 / +0.7 | 6 / **2.3 / −3.5** |
| Kaelen | 14 / 9.4 / −0.7 | 10 / 10.3 / −0.1 | 3 / 5.7 |
| Kaoru | 10 / **6.7 / −2.1** (two nat 1s) | 5 / 8.2 / −0.9 | 3 / 13.0 |
| Mu-Jin | 3 / 9.7 | 15 / 9.7 / −0.6 | 3 / 10.0 |
| **Enemies** | 31 attacks / 9.6 / −0.9 | 47 saves / **12.1 / +1.9** | 15 / 11.0 |

- **Iryoku and Kaoru rolled cold on attacks**, and Iryoku's initiative was frozen: two nat 1s and a 3. Hero points absorbed nearly all of it. Iryoku still led the damage column, because most of his damage was save-based area, not attack rolls.
- **Enemy saves ran warm** against the area casters:
  - Against **Zhen**: n 25, mean 12.1, z +1.4; 52% succeeded where ~40% was expected.
  - Against **Iryoku**: n 18, z +1.1; 67% succeeded where ~41% was expected.
  - Together that cost roughly 50–60 damage (about 3 extra half-damage saves against Zhen and 5 against Iryoku). It isn't significant, and it changed no outcome: every fight was already over in its first one or two turns.
- **Enemy attacks rolled slightly cold** (z −0.9): 4 hits out of 31, and no crits.

## 8. What didn't fire

- **Guhdggi**: Belch Butterflies (8d6 slashing plus persistent bleed), Cage Prey, Lurching Skewer, Hair Lash grab, and its occult spells including **Slow** and **Enfeeble**. **None used.** It died before its first turn.
- **Meokdan**: Snack, Quick Snack, Phantom Pain, Soul Shred. **None used.**
- **Yuni**: Ghostly Hand (+15, 2d8+8 void) never used. She spent her one turn on Moan + Tiger Attack and died before her second.
- **Slime molds**: Slime Rot (disease) never applied; neither pseudopod connected.
- **Fungus leshies**: the spores rider on Spore Pod never triggered (all 11 pods missed). Spore Cloud fired once, and every PC that failed was saved by a hero point.
- **Monks of Kugaptee**: Stunning Flurry and Steal Breath were never seen, because the tea resolved the encounter.

The Guhdggi's list is the clearest receipt. A creature built with Slow, a grab, a cage and an 8d6 breath was erased by two AoE turns before it acted. That is also what the GM's promised scaling ("more creatures or the Elite template") will have to fight against.

## Takeaway for the difficulty conversation

Every encounter ran on book, so this session is a clean read of **the AP's own tuning against this party**: Low-rated hordes of PL−4 bodies, cleared by area damage before they act. Zhen's suggestion at the table matches the data on both halves. **Horde fights:** adding more PL−4 bodies does nothing, because they die to splash before acting (E2, E3), so those need harder creatures, not more of them. **Solo creatures:** Yuni died in one round having acted once; buffing a lone boss mostly makes it hard to hit, while giving it company spreads the party's actions. The one creature that would have tested the party tonight (three PL+0 monks with Stunning Flurry) was legitimately bypassed by roleplay. That's the AP working as intended, not a tuning failure.
