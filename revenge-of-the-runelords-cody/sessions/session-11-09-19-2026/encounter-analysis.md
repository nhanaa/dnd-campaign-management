# Encounter Analysis — Session 11 (2026-09-19)

**Party:** level 16 during both fights (17 arrived afterward) · five PCs · **HP pool 1,096**
(Sevek 248 · Paya 248 · Mithtirith 216 · Aureys 200 · Kreebnock 184)

> **Source note.** Foundry's export carried a `# TRUE max HP` block marked `exact (observed at 100%)` for every creature, so HP here is **Foundry's own number**, not an inference from damage floors. AC is derived the hard way — `CTX :: dc armor` plus the conditions live on that roll — never from the printed value. ⚠️ **The Revenge of the Runelords AP bestiary is not in the local packs**, so Kaliphesta, Xirie, Karzoug and the Pridespawn Cultists have **no book chassis to diff against**. Only the two Monster Core creatures (Unrisen, Shining Child) can be compared to print.

---

## 1. Per-creature profile — and the headline

| Creature | Book | Table HP | Table AC | HP reads as | AC reads as | DC reads as |
|---|---|---:|---:|---|---|---|
| **Unrisen** ×4 | L11 · 220 HP · AC 28 | **300** | **33** | **L16** | L12–13 | — |
| **Pridespawn Cultist** ×2 | *(AP, no pack entry)* | **295** | **37** | **L16** | L15 | — |
| **Shining Child** ×3 | L12 · 215 HP · AC 33 | **300** | **39** | **L16** | L16 | 38 → L16 |
| **Risen Runelord Kaliphesta** | *(AP)* | **400** (+200 Ferocity = **600**) | **40** | **L21** | L17 | 40 → L17 |
| **Risen Runelord Xirie** | *(AP)* | **400** | **40** | **L21** | L17 | 40 → L17 |
| **Risen Runelord Karzoug** | *(AP)* | **500** | **43** | **L19–20** | L19 | 43 → L19–20 |

*Level bands derived empirically from 1,700 creatures in the local packs (median HP/AC per level), not from a remembered table.*

**The headline: this is grind inflation, not threat inflation — and it is consistent across every creature.**

**HP sits 4–6 levels above where AC and save DC sit.** The Unrisen are the cleanest receipt because they have a book entry: **220 → 300 HP (+36%) and AC 28 → 33 (+5)**. Elite would be +20 HP and +2 AC. This is well past Elite, and the HP moved much further than the defence did. The Shining Children tell the same story: **215 → 300 HP, AC 33 → 39.**

The Runelords can't be diffed against print, but they follow the identical shape — **HP reading L21 while AC and DC both read L17.** Cody built creatures that take a long time to kill and are no more accurate or deadly per action than their nominal level.

⚠️ **Karzoug is the one exception, and he is internally consistent.** HP 500, AC 43, DC 43 all read **L19–20** together. He is simply a higher-level creature, honestly built — not a scaled-up L17.

> ⚠️ **Kaliphesta's real pool was 600, not 400.** She spent **Mythic Ferocity** and returned at 200 HP; Paya killed her twice. Total applied: **581** against a printed 400. Xirie, by contrast, took **exactly 400** and never used hers. That single decision is most of why fight 1 ran 105 minutes.

---

## 2. Per-fight: grind, threat, margin

| | **F1 — Vat Room** | **F2 — Emerald Prison** | **Session** |
|---|---:|---:|---:|
| Rounds | 9 | 5 | 14 |
| Wall-clock | ~105 min | ~47 min | ~152 min |
| Enemy HP cleared | **2,590** | 1,367 | **3,957** |
| Damage party took | **1,744** | 1,077 | **2,821** |
| …as % of the 1,096 pool | **159%** | 98% | **257%** |
| In-combat healing | 1,440 | 851 | 2,291 |
| Survival margin | +792 | +870 | **+566** |
| PCs downed | **Paya** | **Kreebnock** | 2 |

**Fight 1 cleared the party's entire health pool one and a half times over.** Fight 2 cleared it almost exactly once, in five rounds. The margin never got genuinely thin — but that is a statement about the healing and the dice, not about the tuning (see §7).

### Why the tank read as safe

⚠️ **The tank took the least damage in the party (435, 15.4%), and Taunt had almost nothing to do with it.** **2,451 of the 2,821 points the party absorbed — 87% — came from saving throws, not attack rolls.** Against nine-plus party-wide effects (three Cataclysms, two Eclipse Bursts, two Vampiric Exsanguinations, Arctic Rift, Plasma Whirls, three Agonized Howls, Desiccate, Phantasmagoria), target selection is irrelevant and there is nothing for a guardian to intercept.

This is the **S9 pattern repeating and getting worse**: the two softest bodies (Kreebnock 184 HP, Mithtirith 216 HP) absorbed **44% of the session's damage between them**, and no amount of positioning could have changed it. The counter to this table is personal save tech, not aggro.

---

## 3. The verdict: both fights were EXTREME

**Party level 16, five players. Thresholds: Trivial 50 · Low 80 · Moderate 100 · Severe 150 · Extreme 200.**

| Fight | Priced on **AC-implied** levels | Priced on **HP-implied** levels |
|---|---|---|
| **F1 — Vat Room** | **220 XP — EXTREME** | 560 XP — far past Extreme |
| **F2 — Emerald Prison** | **240 XP — EXTREME** | 280 XP — far past Extreme |

**Both fights are Extreme even on the most conservative read.** Taking the AC/DC-implied levels — i.e. giving Cody full credit that these are honestly-levelled creatures with fat health bars — F1 is 220 against a 200 threshold and F2 is 240.

**This matters because the XP budget cannot see HP.** If you priced these creatures off their *nominal* book levels (Unrisen L11, Shining Child L12), F1 would come out around 130 XP — *Moderate*. It took 159% of the party's health pool. **The budget would have been wrong by two full bands.**

**The honest summary:** Cody is running **Extreme-budget encounters that feel Severe**, because the extra difficulty is loaded almost entirely into *duration* rather than *lethality*. That is the most forgiving way to over-tune a fight — and it is also why a 105-minute single combat happened.

---

## 4. Damage contribution and damage taken — per fight

### Fight 1 — The Vat Room (9 rounds)

| PC | Dealt | Share | Attacks | Crits | **Dmg/attack** | | Taken | Share |
|---|---:|---:|---:|---:|---:|---|---:|---:|
| **Paya** | **1,078** | **39.2%** | 31 | 5 | 34.8 | | **538** | **30.8%** |
| **Sevek** | 754 | 27.4% | 20 | 3 | **37.7** | | 259 | 14.9% |
| **Aureys** | 614 | 22.3% | 17 | 2 | 36.1 | | 341 | 19.6% |
| **Mithtirith** | 160 | 5.8% | 1 | 1 | *160.0* | | 338 | 19.4% |
| **Kreebnock** | 147 | 5.3% | 2 | 0 | *73.5* | | 268 | 15.4% |
| **TOTAL** | **2,753** | | 71 | 11 | | | **1,744** | |

### Fight 2 — The Emerald Prison (5 rounds)

| PC | Dealt | Share | Attacks | Crits | **Dmg/attack** | | Taken | Share |
|---|---:|---:|---:|---:|---:|---|---:|---:|
| **Paya** | **504** | **39.5%** | 14 | 4 | 36.0 | | 134 | 12.4% |
| **Sevek** | 477 | **37.4%** | 11 | 3 | **43.4** | | 176 | 16.3% |
| **Aureys** | 266 | 20.9% | 13 | **0** | **20.5** | | 136 | 12.6% |
| **Mithtirith** | 28 | 2.2% | 1 | 1 | *28.0* | | **273** | **25.3%** |
| **Kreebnock** | **0** | **0.0%** | 0 | 0 | — | | **358** | **33.2%** |
| **TOTAL** | **1,275** | | 39 | 8 | | | **1,077** | |

### Session totals

| PC | Dealt | Share | Attacks | Crit rate | **Dmg/attack** | | Taken | Share | **Dealt ÷ taken** |
|---|---:|---:|---:|---:|---:|---|---:|---:|---:|
| **Paya** | **1,582** | **39.0%** | 45 | 20% | 35.2 | | 672 | 23.8% | 2.35 |
| **Sevek** | 1,231 | 30.3% | 31 | 19% | **39.7** | | **435** | **15.4%** | **2.83** |
| **Aureys** | 880 | 21.7% | 30 | **7%** | 29.3 | | 477 | 16.9% | 1.84 |
| **Mithtirith** | 221 | 5.4% | 2 | 100% | *110.5* | | 611 | 21.7% | 0.36 |
| **Kreebnock** | 147 | 3.6% | 2 | 0% | *73.5* | | 626 | 22.2% | 0.23 |

**What this says that the session totals alone hide:**

**Sevek is the most efficient striker in the party, and fight 2 is where it shows.** He has the **highest damage per attack of the three martials (39.7 vs Paya's 35.2 and Aureys' 29.3)** and the **best dealt-to-taken ratio at 2.83**. In the Emerald Prison he did **37.4% of the party's damage on 11 attacks** — near-parity with Paya's 39.5% on 14. Paya's session lead is built on **50% more swings**, not on hitting harder: two Reactive Strikes a round is an extra attack economy no one else has.

⚠️ **Aureys collapsed in fight 2 and the cause is identifiable.** She went from 36.1 damage per attack with 2 crits to **20.5 with zero crits across 13 attacks** — her worst stretch of the campaign. Two things stacked: **Karzoug's Perception DC 46 critically failed two of her Feints** (the engine that manufactures her off-guard), and her dice were the coldest at the table (z = −1.01). Her kit is built to convert enemy debuffs into criticals; against a boss she cannot debuff, it degrades to an ordinary agile weapon.

⚠️ **Fight 2 is the most lopsided distribution of the campaign: the two casters took 58.5% of the damage and dealt 2.2% of it.** Kreebnock's line is the single cleanest stat of the session — **358 damage taken, zero dealt, zero attack rolls.** He spent the entire Emerald Prison being hit by Cataclysms, spending resources to survive them, and healing. Mithtirith's is nearly as stark: 273 taken for 28 dealt.

**This is not a criticism of either player — it is the shape of the encounter.** Three Cataclysms and a Plasma Whirl into a 184-HP and a 216-HP body will produce exactly this table no matter how well they play. But it is the receipt for why the party's damage looks top-heavy: **in fight 2, three PCs were doing all the killing while two were absorbing two-thirds of the incoming.**

**Mithtirith's 2-for-2 on attack rolls, both critical hits, is the funniest line in the ledger** — 110.5 damage per attack on a sample size of two, one of which drove a Runelord off the board.

---

## 5. What the control package actually bought

**Tier 1 — Foundry's own `MM :: ESSENTIAL` tags** (removing that one modifier changes the outcome tier). **26 flips**, 25 of them on party attack rolls:

| Source | Flips | Who supplies it |
|---|---:|---|
| **Off-Guard** (8 plain + 6 flanked) | **14** | Sevek's Taunt · flanking · Aureys' Feint / Distracting Feint |
| **Clumsy** (−2 ×4, −1 ×1) | **5** | **Sevek's Greater Crushing rune** |
| **Courageous Anthem +1** | **3** | Kreebnock |
| **Frightened** (−2 ×2, −1 ×1) | **3** | Aureys' Demoralize / Majestic Presence |
| **Inner Upheaval +1** | 1 | Sevek (self) |

**Tier 2 — remove *every* party-supplied modifier and recompute:** **28 flips**, of which **21 were worth something** (13 miss→hit, 7 hit→crit) and **7 were critmiss→miss, which buys nothing** and is discounted.

> Tier 1 (26) and Tier 2 (28) agreeing this closely is the cross-check that says the parser is sound.

**Off-guard is the party's single biggest lever, at 54% of all Tier-1 flips** — and it has three independent suppliers, which is why it stays up. This is the fourth consecutive session where off-guard, not raw accuracy, is what the party's crits are built on.

⚠️ **Aureys' engine failed against the boss and worked on everything else.** She went **0-for-13 on crits against Karzoug** and critically failed two Feints against his **Perception DC 46**, while the same kit ran normally on the Shining Children at DC 38. Combined with S10's mindless-enemy problem, that is now two structural switch-offs for her debuff package.

---

## 6. In-combat healing (downtime excluded)

| Healer | **In-combat** | Downtime | Methods (in-combat) |
|---|---:|---:|---|
| **Mithtirith** | **1,689** | **0** | Heal spell 1,631 · Battle Medicine 27 · impulse 31 |
| **Kreebnock** | 477 | 25 | Soothe 183 · impulse 170 · potions 124 |
| **Paya** | **125** | **688** | impulse |

**This is the single most misleading column in the raw log, and filtering it inverts the ranking.**

**Mithtirith delivered 1,689 hit points under fire and zero out of it.** That is **74% of all in-combat healing** and more than the party's entire HP pool by half again. His recipients were spread exactly where the damage landed: Paya 469, himself 393, Kreebnock 343, Aureys 280, Sevek 204.

⚠️ **Paya's healing lane is a downtime lane.** 688 of his 813 points — **85%** — were delivered between fights. That is genuinely valuable (it is why the party entered fight 2 topped up without spending a rest), but it is not the same contribution as healing under fire, and the unfiltered number reads as though it were.

---

## 7. Dice — and the thing that actually decided this session

### Attack and skill rolls: dead average

| PC | Attacks | mean | nat20 | nat1 | z | Skills | mean | z |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Sevek | 31 | 11.19 | 4 | 0 | +0.67 | 9 | 11.44 | +0.49 |
| Paya | 45 | 10.09 | 0 | 3 | −0.48 | 2 | 12.50 | — |
| Aureys | 30 | 9.43 | 1 | 1 | **−1.01** | 13 | 11.69 | +0.75 |
| Mithtirith | 2 | 19.50 | 1 | 0 | — | 5 | 6.60 | −1.51 |
| Kreebnock | 2 | 11.50 | 0 | 0 | — | 4 | 9.75 | −0.26 |
| **PARTY** | **110** | **10.42** | 6 | 4 | **−0.15** | **33** | 10.67 | +0.17 |

**Nobody was lucky on offence.** The party's 110 attack rolls came in at z = −0.15 — statistically indistinguishable from average. **Paya put up 1,582 damage and nine critical hits on a below-average mean with zero natural 20s**, which is what a legendary-proficiency fighter with two reactions a round looks like when the dice do nothing for him. **Aureys was the coldest thing at the table (z = −1.01)** and that, not her kit, is most of the gap between her 880 and Sevek's 1,231.

### Saving throws: the party ran extremely hot

| PC | n | mean | nat20 | nat1 | z | Outcomes |
|---|---:|---:|---:|---:|---:|---|
| Mithtirith | 12 | 14.67 | 0 | 0 | **+2.50** | 4 critS · 3 S · 5 F |
| Paya | 16 | 13.75 | 2 | 0 | **+2.25** | 10 critS · 1 S · 5 F |
| Sevek | 16 | 12.56 | 2 | 0 | +1.43 | 11 critS · 2 S · 3 F |
| Aureys | 18 | 11.89 | 1 | 0 | +1.02 | 8 critS · 4 S · 6 F |
| Kreebnock | 12 | 11.08 | 0 | 0 | +0.35 | 3 critS · 3 S · 5 F · **1 critF** |
| **PARTY** | **74** | **12.76** | **5** | **0** | **+3.37** | |

**z = +3.37, one-tailed p ≈ 0.0004. Seventy-four saving throws and not one natural 1.** By save type: **Fortitude z = +3.33**, Will z = +1.89, Reflex z = +0.79.

### The counterfactual: what average saves would have cost

Reconstructing each area effect's base damage from whoever took a resolvable hit, then re-rolling every save as a flat 10:

| | Actual | If every save rolled 10 |
|---|---:|---:|
| Damage from save effects | **2,451** | **3,332** |

> ### **The party's save luck was worth 882 damage — 36% more incoming, and 80% of the entire party HP pool.**

Per PC: Paya **+369**, Sevek **+270**, Aureys **+222**, Mithtirith **+120**, Kreebnock **−99** (he was the only one whose saves ran cold).

**This is the finding.** The survival margin of +566 was *smaller* than the luck dividend of 882. **Run this session again with average dice and the margin goes negative** — the party does not clear both fights without either more healing, more resources, or someone dying. The comfortable-looking margin was borrowed from the dice, not earned by the tuning.

⚠️ **Crit-fail exposure was real and mostly dodged.** Against Karzoug's DC 43, **Mithtirith critically failed on a natural 7 or lower (35%)** and **Kreebnock on a 6 or lower (30%)** — and a critical failure on a basic save doubles the damage. Kreebnock ate the one that landed. On three Cataclysms, the odds of at least one of those two crit-failing were substantial, and the party got away with one.

### Enemy saves against the party's spells

**40 saves, mean 11.05, z = +0.60** — slightly above average, not significant. **The casters were not cheated.** Their low damage columns are the design (Kreebnock 147) and the tradition (Mithtirith spent his actions healing), not bad luck against their DCs.

---

## 8. What didn't fire

⚠️ **Read this section narrowly.** Foundry renders reactions as plain Strikes, so Opportune Backstab, Stand Still and Draconic Salvation show zero hits in the log text despite demonstrably happening. Only **named spells and activated abilities** are reliable absences. Verified against both the log and the transcript:

- **Murder of Crows** — Kreebnock's biggest single-target hit (a crit for 68 in S9) never came out. In a session where his damage was 147 total, that is most of the gap.
- **Rallying Anthem** — 103 Courageous Anthem references, zero Rallying. He ran one anthem all session.
- **Scintillating Safeguard** — the resistance tool that carried Mithtirith and Paya through two of S9's nine Desiccates. **In the session where 87% of damage came from area saves, the party's dedicated area-mitigation reaction was never used.**
- **Unbelievable Interception** — Paya spent it on an ally in *both* S9 and S10. Not once here.

**The pattern worth noticing:** the three unused tools are all **mitigation**, and this was the most mitigation-shaped session of the campaign. The party took 2,821 points across fourteen rounds of mostly-unavoidable area damage and answered it almost entirely with *post-hoc healing* (2,291 points) rather than *prevention*. That worked — but it worked on a +3.37 save streak.

---

## Uncertainty

- **No AP bestiary locally**, so four of six creature types have no book chassis to diff. The "HP reads 4–6 levels high" claim rests on the two Monster Core creatures plus internal consistency across the Runelords.
- **Enemy attack modifiers are hidden**, so nothing here measures the DM's luck on attack rolls — only the party's. Enemy *saves* are fully logged and were analysed.
- Damage-rolled figures are extracted from the log and carry roughly ±1%; multi-Strike rolls and alias-speaker lines are included.
- The save counterfactual reconstructs base damage from 15 of 17 area events (69 of 74 saves). The two unreconstructed events would move the 882 slightly, almost certainly upward.
