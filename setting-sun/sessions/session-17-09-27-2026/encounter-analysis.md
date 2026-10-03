# Session 17 — Encounter Analysis & Roll Luck

*Source: `rolls.txt` (foundry-export v2, single header, 27/09/2026 13:09–16:37), cleaned transcript, AP bestiary JSON (`pf2e/fists-of-the-ruby-phoenix-bestiary/book-2-ready-fight/`) and `pf2e/pathfinder-bestiary-2/thrasfyr.json`. Level benchmarks are medians over 1,397 level-13–20 NPCs in the local packs. Enemy attack and save modifiers are fully visible in this export (checked), so enemy luck is measured, not assumed.*

## Headline

- **All three fights were hard, and the hardest was the one the table would call the warm-up.** The two Thrasfyrs took **129% of the party's HP pool** — more than the Steps of the Sun (91%) or the tournament match (85%).
- **Cody tuned every opponent the same way: HP up hard, offence up, defences near book.** The Steps of the Sun and the monks played at **level 16–17 on attack and DC**, and at **level 19–20 on HP**, against book level 15. Of the three fights, only the Thrasfyrs' breath weapon was run *below* book.
- **Sovael was the session's top damage dealer: 1,097, 31%** of everything the party removed. Most of that came in the tournament match, where he did **645 of the monks' 1,430 HP (45%) in six actions, about 108 per action.**
- **Luck.** The party's dice were dead average (z +0.50). The enemies' saves against Sovael were not:
  - **Steps of the Sun bout:** they saved hot, averaging a natural 14.9 (z +2.41, p ≈ 0.008). All four made Divine Armageddon.
  - **Tournament match:** the monks paid it back, averaging 7.9.
  - **Net across the session:** Sovael's basic-save damage came in **~130 under** what flat-10 saves would have given him.

---

## 1. The creatures — book vs as run

### Defence

| Creature | Book L | HP book → run | AC book → run | Saves book (F/R/W) → run | Verdict |
|---|---|---|---|---|---|
| **Amihan** | 15 | 275 → **350** (×1.27) | 37 → **38** | 25/28/21 → F25 / W**28** | Reskinned. Book is a scimitar-and-shield "battle dancer"; run as a star-knife swashbuckler. Will +7 |
| **Maalya** | 15 | 275 → **350** (×1.27) | 37 → **38** | 25/28/21 → F**27** | HP up; book chassis otherwise |
| **Joon-seo** | 15 | 250 → **375** (×1.5) | 35 → **38** | 26/26/28 → **28/28/30** | +2 on everything; actor set to level 16 |
| **Halspin the Stung** | 15 | 250 → **350** (×1.4) | 35 → **38** | 26/28/26 → **28/30/28** | +2 on everything; actor set to level 16 |
| **Thrasfyr** ×2 | 17 | 350 → **450** (×1.29), regen 25 (book) | 40 → **39** | F35/R28/W27 → R28 / W27 | HP +100; defence otherwise book, AC −1 |
| **Usvani** | 15 | 300 → **380** (×1.27) | 35 → **38** | 27/27/27 → F26 / R29 | HP up, AC +3 |
| **Pravan Majinapti** | 15 | 300 → **350** | 35 → **37** | 27/27/27 → F27 / R30 | |
| **Ranya Shibhatesh** | 15 | 300 → **350** | 35 → **37** | 27/27/27 → F25 | |
| **Jivati Rovat** | 15 | 300 → **350** | 35 → **37** | 27/27/27 → F27 / R31 | |

*HP is from the export header's `exact (observed at 100%)` values. AC is `CTX dc armor` plus the active conditions added back, taking the mode across all party attacks. The book's +1 status to saves vs magic on the Thrasfyr is included.*

### Offence

| Creature | Attack book → run | Damage per hit, book → run | DCs book → run | Abilities the book doesn't have |
|---|---|---|---|---|
| Amihan | Scimitar +31 → **Starknife +32** | 2d6+12+1d6 (≈23) → **3d4+20+5d6+1d6** (≈47 on a finisher; **94 and 99** on crits) | — | Vexing Tumble, Confident/Mobile Finisher, Kip Up, "Enjoy the Show" — a whole swashbuckler kit |
| Maalya | +31 → **+32** | 2d6+12+1d6 → **3d6+18+5d6+1d6+1d6** (≈51; hit for 56) | — | — |
| Joon-seo | Whip +28 → **+32**; Sound Blast +28 → **+32** | Whip 3d4+8 → **3d4+18**; Sound Blast 4d6 → **4d6+19** | spell DC 36 → **38** | — (by round 3 he was **out of rank-7 and rank-8 slots**, per Cody — his round-1 Spirit Song plus what he'd spent in earlier exhibition bouts) |
| Halspin | Longbow +30 → **+33** | 2d8+10+1d6 → **3d8+19+1d6** (≈36; crit 83) | spell DC 34 → **38** | **Spirit Song** (on Joon-seo's list, not Halspin's) |
| Thrasfyr | Chain +34 → **+34**; Jaws/Horn +32 → **+33** | +4 to +6 flat per strike (Jaws 3d10+21+3d6, Horn 3d12+21) | Breath DC 40 → **38–40**, but **10d12 → 8d12**; Tangling Chains 18d6 DC 38 (book) | — |
| Monks (all four) | Fist/Tornado Lunge +27 → **+32/+33** (+5/+6) | 3d8+13+1d6 → **3d8+20+1d6** | breath abilities DC 33 → **37–38**, dice ×1.5 (Breath of the Glacier 10d6 → **15d6**, Draw of the Aurora 4d12 → **6d12**, Magma's Grasp 8d6 → **12d6**) | **Qi Blast, Inner Upheaval, Stand Still, Winding Flow** — none on the book blocks. Usvani's printed Breath of the Volcano was swapped for Qi Blast |

### Per-axis level profile (party level 15 for Fight 1, 16 for Fights 2–3)

| Creature | AC reads as | Attack reads as | DC reads as | HP reads as | XP (book) |
|---|---|---|---|---|---|
| Steps of the Sun | L15–16 | **L16–17** | **L17** | **L19** | L15 = PL |
| Thrasfyr | L16 | L17 | L17–18 | **L20+** (plus regeneration) | L17 = PL+1 |
| Arms of Balance | L15–16 | **L16–17** | **L16–17** | **L19–20** | L15 = PL−1 |

**Reading:** this is not "HP padding for a five-player table" alone. On the Steps of the Sun and the monks, **both** axes moved:
- **Grind:** HP was run at level 19–20.
- **Threat:** attack and DC were run at level 16–17, and damage per hit rose by 10–20 flat.

The Thrasfyr is the opposite case: honest offence, a *lighter* breath than book, and HP inflated to level 20+ on top of regeneration.

---

## 2. The fights

| | Fight 1 — Steps of the Sun | Fight 2 — Two Thrasfyrs | Fight 3 — Arms of Balance |
|---|---|---|---|
| Rounds | 5 (forfeit top of 6) | 7 | 3 |
| **Grind** — enemy HP removed | 1,070 of 1,425 (355 left at the forfeit) | 1,075 (900 HP + 175 regeneration, **50 of which should have been suppressed**) | 1,430 (all four down) |
| **Threat** — damage the party took | 1,011 (+13 temp) = **91%** of a 1,113 pool | 1,524 = **129%** of a 1,184 pool | 1,004 = **85%** of 1,184 |
| Concentration | **Sattva 314** (down to 16 HP), **Sovael 263 + 13 temp: dropped** | **Clutch 558**, Seva 380 | Seva 260 (would have been ~285 without Wooden Double), Sovael 241 |
| In-combat healing | 401 (+~35 Healing Nexus) | **671** | 437 |
| Survival margin (pool + healing − taken) | ~500 | **~330** | ~620 |
| XP, book levels (5 PCs: Mod 100 / Sev 150 / Ext 200) | 160 = **Severe** | 120 = **Moderate+** | 120 = **Moderate+** |
| XP, as-run offence levels | L16 ×4 = 240 = **beyond Extreme** | L17 ×2 = 120 → **Moderate+** | L16–17 ×4 = 160–240 = **Severe–Extreme** |
| **Actually was** | **Severe–Extreme**. The only PC drop; ended by forfeit with the musicians at 55% and 43% | **Extreme** on threat, the hardest fight of the night | **Severe**, collapsed to three rounds by a hot opener and cold enemy saves |

- **Fight 2 is where the XP budget fails.** Book level 17 against a level-16 party prices at Moderate+, and the fight took more damage than the party has HP.
  - **Why:** 900 HP of targets behind 15 physical resistance (which also ate every bleed tick), plus regeneration.
  - **The party's shortage:** almost no cold or cold iron. Seva's Ray of Frost and Sovael's staff were the only sources.
  - **The two breaths that did the most:** Clutch and Seva both crit-failed the first one, for 126 each.
- **Fight 3 was over before the monks' offence mattered.** The upgraded breaths were real: Breath of the Glacier and Draw of the Aurora landed on four PCs, and Magma's Grasp stripped two Focus Points. Three things ended it early:
  - Divine Armageddon (266) and Spirit Song (204) went in before the monks' second turns.
  - Five crits in round 2.
  - Monk saves ran cold.

---

## 3. Damage contribution (HP actually removed, overkill capped)

| PC | Fight 1 | Fight 2 | Fight 3 | **Session** | Share |
|---|---|---|---|---|---|
| **Sovael** | 297 | 155 | **645** | **1,097** | **30.6%** |
| Sattva | 296 (+7 via gift) | 228 | 240 | 764 | 21.3% |
| Ferrok | 113 | **326** | 244 | 683 | 19.1% |
| Seva | 235 | 297 | 133 | 665 | 18.6% |
| Clutch | 122 | 69 | 180 | 371 | 10.4% |

- **Sovael per action.** Fight 3: 645 in six actions (Divine Armageddon, Spirit Song, Frigid Flurry), **~108 per action**. Fight 1: ~297 over about 7 casting actions (~42). Fight 2: ~155 over about 8 (~19). Fight 2 was the Thrasfyrs' resistance plus a natural-20 save on the first Aether Beam.
- **Ferrok's and Sattva's rolled totals are much higher than what they removed** (376 and 316 rolled in Fight 3): their killing blows were 100+ hits into 17 and 35 HP. Kill credit went to them; the HP was mostly removed by Sovael's AoE.

**Damage taken, session:** Clutch 896 · Seva 769 · Sattva 754 · Sovael 611 · Ferrok 509.

---

## 4. What the control package bought (Foundry `MM :: ESSENTIAL`, Tier 1)

28 roll outcomes changed because of a single modifier. After removing the enemy-side ones and zero-value ones, **15 helped the party, worth about ~300 HP of removed damage** (overkill capped).

| Source | Tier-1 flips | What they bought |
|---|---|---|
| **Off-guard** (Clutch's grabs, trips and flanking) | 11 | Six miss→hit, including the hit that dropped Amihan and Ferrok's 38 into Usvani. Hit→crit on Clutch's 68 into Pravan and two of Seva's Thrasfyr crits |
| **Courageous Anthem** (Sovael) | 4 | Miss→hit: Seva into Jivati (46), Ferrok into Usvani (38), Sattva into Ranya (combined Hunted Shot, ~42). The fourth, Ferrok's Blink Charge crit, landed on 17 HP and was worth 0 |
| **Clumsy** (Synesthesia's Clumsy 3 on A — Sovael; Spinebreaker's Clumsy 2 on B — Clutch; Clumsy 1 from other sources) | 6 | Clutch's trip on B (fail→success), Clutch's claw into A (miss→hit), and Sattva's killing crit on B (overkill, 0). Ferrok's 15:49 flip was only a crit-miss becoming a miss (0) |
| **Frightened** (Clutch's Battle Cry on Maalya; Sovael's Talent Envy / Dirge on Joon-seo) | 4 | Sattva's first crit on Maalya; Seva's critical Spellstrike on Joon-seo |
| **Bon Mot** (Sovael) | 1 | Turned his Demoralize on A into a critical success (Frightened 2 instead of 1) |

### True Target (Fight 2, round 7 — Sovael)

Cast at 15:47 on four allies, lasting until the start of Sovael's next turn. **Two of the four used it**, because Thrasfyr A died on the second one:

| Attack | Modifier vs AC 34 (Clumsy 3, off-guard, prone) | Dice (Pax's recollection; the export keeps only the higher) | Without True Target | With True Target |
|---|---|---|---|---|
| Ferrok, Gouging Claw Spellstrike | +31 | **20 and 1** | natural 1 → **critical miss**, 0 damage | natural 20 → crit by +17, **105 damage** (A 135 → 30) |
| Clutch, claw (A on 30 HP) | +27 | **20 and 15** | 42 vs 34 → **hit**, ~17 damage — A survives on ~13 | natural 20 → crit by +13, 34 — **the kill** |

- **Both rolls were flipped.** Ferrok's attack went from a critical miss to a critical hit. Clutch's went from a non-lethal hit to a critical, and that critical was the kill.
- **It bought ~118 HP that turn (105 + ~13), and it ended the fight a round early.** Without it, Thrasfyr A goes into round 8 on ~118 HP. The party it would have faced:
  - Clutch, Ferrok and Seva had just been **immobilised by Tangling Chains**.
  - **Clutch was on 33 HP**.
  - A's breath weapon was due to recharge.
- **This was True Target's best cast of the campaign.** Measured against the dice (rather than expectation), it flipped two rolls, **one of them a critical miss into a critical hit**, and the second flip was the killing blow. S15's cast (four attacks, ~one outcome changed) was "good, not magic". This one was decisive.
- **Why it landed so hard:** Sovael's Synesthesia (Clumsy 3) and the grab/prone package had already dropped A's AC by 5. That turned Clutch's second die, a 15, into a hit at all, and let a natural 20 crit by double digits. Fortune on a stacked target is where the spell pays most.

- **Anthem's flat +1** appears on about **150 damage applications** across the three fights, counting crits double and AoE per target. Add ~125 from its flips, and Anthem is worth **~275 HP over four one-action casts**, before counting Lingering.
- **Enemy-side flips worth knowing:**
  - **Joon-seo's own Courageous Anthem** turned Amihan's shot on Sattva into a **99-point crit** (13:40).
  - **Usvani's Inner Upheaval +1** landed the hit on Sovael that Bounce Away then halved.
- **Coverage caveat:** Foundry only tags a modifier when it's on the token. These are provable flips, a floor, not the total.

---

## 5. In-combat healing (downtime excluded)

| Healer | HP healed | Method |
|---|---|---|
| **Sattva** | **551** | Battle Medicine ×5 (including 77 into Seva and 58 into Sovael), 6th-rank Heal scrolls (81 Seva, 73 Sovael), a potion |
| **Clutch** | 448 | Doctor's Visitation / Battle Medicine, mostly on himself (plus 48 to Sovael and 75 to Seva), and potions |
| Seva | 308 | Battle Medicine (62 to Sovael, 64 to Clutch, the rest on herself) and a potion |
| **Sovael** | 152 (+~35 Healing Nexus not logged) | Quickened 6th-rank Heal: 73 to Clutch in Fight 2, 79 to himself in Fight 3 |
| Ferrok | 50 | potion |

**Total 1,509 in combat.** Three medics carried it. Sovael healed on only two actions all session, so almost his entire action budget went into offence and control.

---

## 6. Roll luck

### Party d20s (fortune rolls excluded; on a reroll, the first die counts)

| PC | Attack | Skills / other | Saves | **All** |
|---|---|---|---|---|
| **Sovael** | — (no attack rolls this session) | n12, mean 9.8, z −0.40 | n15, mean 10.3, z −0.16 | n27, mean 10.1, **z −0.38** |
| Seva | n22, mean 10.4, z −0.07 | n8, mean 12.3 | n15, mean 9.2, z −0.87 | n45, **z −0.19** |
| Clutch | n29, mean 10.8 | n23, mean 12.0, four 20s, z +1.28 | n18, mean 11.6 | n70, **z +1.31** |
| **Ferrok** | n21, **mean 8.8, z −1.34** | n4, mean 5.3 | n14, mean 9.8 | n39, **z −1.85** (coldest) |
| **Sattva** | n26, **mean 12.5, four 20s, z +1.73** | n10, mean 9.3 | n19, mean 12.0 | n55, **z +1.56** (hottest) |
| **Party** | n98, z +0.37 | n57, z +0.20 | n81, z +0.28 | **n236, mean 10.69, z +0.50 — average** |

- **Ferrok's "all 1s or all 20s" reputation (Cody's line) is half right.** His attacks ran cold (8.8), with eight straight misses in bout 4. His two tournament kills were natural 20s, but those were only 2 of his 21 attack rolls.
- **Sattva was hot on attacks and cold on healing checks**, which is the running bit ("I can't roll above a nine").

### Enemy d20s

| Group | Attacks | Checks (skills, Perform, Tumble) | Saves vs party effects | All |
|---|---|---|---|---|
| Steps of the Sun | n13, mean 10.3 | n21, mean 10.8, four 20s | n7, **mean 15.6, z +2.33** | z +1.07 |
| Thrasfyrs | n11, **mean 9.2, z −0.76** | n6, mean 13.5 | n8, mean 9.6 | z −0.12 |
| Arms of Balance | n11, mean 10.2 | n7, mean 8.6 | n11, **mean 9.0** | z −1.08 |

The Thrasfyrs rolled **below average** on attacks and still took 129% of the pool. That fight's danger was structural, not dice.

### Sovael's save-luck counterfactual

Every enemy save against a Sovael effect, with the natural die, the die it needed, and the outcome re-run at a flat 10. Modifiers include the party debuffs active at the time.

| Fight | Saves | Mean natural | z | Damage actual → at flat 10 |
|---|---|---|---|---|
| **1 — Steps of the Sun** | 10 | **14.9** | **+2.41 (p ≈ 0.008)** | 227 → 288 (**−60**) |
| 2 — Thrasfyrs | 5 | 12.6 | +0.81 | 127 → 243 (**−117**) |
| 3 — Arms of Balance | 10 | **7.9** | −1.43 | 633 → 587 (**+46**) |
| **Session** | 25 | 11.6 | +0.9 | **~986 → ~1,118 (−130)** |

- **Fight 1: the save-luck complaint is real.** All four made Divine Armageddon on natural 14–18; at a flat 10, Maalya and Amihan fail and it does 225, not 150. Roaring Applause and Chain Lightning were also saved on natural 12–19.
  - **The Specter's arrival** (direct Will saves, not in the table): Joon-seo's natural 20 cancelled his prone (at a flat 10 he drops prone). Halspin's natural 6 was the only lucky save for Sovael in that fight, and it pinned him.
- **Fight 2:** Thrasfyr B rolled a **natural 20 against the first Aether Beam** (56 → 0) and a 14 against the Frigid Flurry. Debilitating Dichotomy's natural-2 failure was the one break.
- **Fight 3 paid it back.** Spirit Song drew natural 2, 3 and 4, with Jivati crit-failing for 102. Frigid Flurry drew 6 and 5, and Pravan's natural 6 is what killed him. At a flat 10 Pravan passes that Flurry and lives.
- **Net:** Sovael's saves ran against him by ~130 damage over the session. The tournament opener was the only fight where the dice helped him.

---

## 7. What didn't fire

- **Joon-seo:** Disappearance, Mask of Terror, True Target and Energy Aegis (ranks 7–8) never appeared. He spent his top slots on Spirit Song in round 1 (and on earlier exhibition bouts), and by round 3 was down to rank 6. **Halspin:** Uncontrollable Dance, Scintillating Pattern, Prismatic Spray and Allegro, and Cat's Luck (once per day) was never used on a failed Reflex save.
- **Monks:** Wild Winds Stance and Wind Jump never appeared. Usvani's printed Breath of the Volcano was replaced by Qi Blast. Most of the round-2 monk turns were Stunned (Spirit Song) or Taunted (Clutch).
- **Thrasfyr:** Teleport and Rider's Bond (irrelevant in an arena). Improved Knockdown fired twice. The second time it **crit-failed and knocked Thrasfyr A prone itself**.
- **Steps of the Sun reactions:** Roaring Applause (success = no reactions) switched off both musicians' reactions from round 4. Maalya's Reactive Strikes (the only printed reaction on the dancers) were all spent and missed by round 2.

---

## 8. Table-tracking notes

- ⚠️ **Thrasfyr regeneration:** two of Thrasfyr B's ticks (50 HP) landed after Sovael's Frigid Flurry and a cold Foretell Harm should have suppressed them. Later ticks were correctly reverted.
- **Healing Nexus** (~35 on Sovael in Fight 1) never posted a heal line; it shows only in the HP trail.
- **Foretell Harm** on Pravan (Fight 3, round 1) and on Joon-seo (Fight 1, round 5) never resolved. The first wasn't applied; the second was cut off by the forfeit.
