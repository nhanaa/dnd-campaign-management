# Encounter Analysis — Session 18 (2026-10-04)

**Party**: level 16 → 17 · 4 PCs (Seva absent) · HP pool 968 (Lightkeepers and earlier) → 1,026 (Roses, after level-up)
**Source**: `rolls-backup.txt` (Foundry export v2, 1,133 messages, single header, so no double paste) + the processed transcript (`2026-10-04 13-02-33`).
**Written**: Sections 1–7 on 2026-10-04 (`/encounter-analysis`). Sections 8–9 from the follow-up discussion that night. Section 10 recomputed on 2026-10-06. Where a first-pass number was refined later, the table points to the refined section.
**Related**: [recap.md](recap.md) · [dm-conduct-notes.md](dm-conduct-notes.md)

---

**Headline:** All three opposing teams were rebuilt well above their book statblocks. AC was kept near party level, so they stayed hittable, while attack, damage and HP were pushed to roughly level 18–24.
- **Winter's Roar** played Severe.
- **The Biting Roses** played Severe.
- **The Lightkeepers** took **208% of the party's HP pool**. Partway through that fight, all three surviving Lightkeepers got exactly the Elite template (+2 to everything and +20 HP), which nobody announced.
- **Luck didn't decide the loss.** Your saves against Syu ran *above* average.

## 1. Opponents: book vs as run

The roll-log header's max HP is exact (Foundry observed each creature at 100%). AC is the AC Foundry used on each attack, with active debuffs added back. The book versions are the Book-2 statblocks.

**Defence**

| Creature | Book level | HP book → run | AC book → run | Saves (Fort/Ref/Will) book → run |
|---|---|---|---|---|
| Urnak | 14 | 310 → **480** | 34 → 39 | 27/23/25 → 32/28/29 |
| Huldrin | 14 | 280 → 375 | 34 → 40 (42 with shield up) | 26/25/27 → 29/28/31 |
| Juspix | 14 | 240 → 325 | 33 → 38 | 22/27/27 → 26/30/– |
| Syu | 16 | 250 → 425 → **445** | 37 → never attacked | Will 28 → 34 |
| Shino | 16 | 300 → 375 → 395 | 38 → 40 → **42** | 27/31/25 → 30/–/27 |
| Blue Viper | 16 | 300 → 400 | 36 → 40 | 30/29/24 → 32/–/27 |
| Ran-to | 16 | 380 → **525 → 545** | 38 → 39 → **41** | Will 23 → 27 |
| Yarrika | 15 | 250 → 320 | 37 → 41 | 24/27/28 → 28/–/33 |
| Lantondo | 15 | 275 → 345 | 36 → 40 | 24/26/27 → 28/–/32 |
| Artus | 15 | 330 → 345 | 35 → 40 | 25/29/26 → 28/33/30 |
| Grandfather Mantis | 15 | 300 → 420 | 36 → 40 | 26/30/25 → 30/–/28 |

**Offence** (average damage per hit in parentheses)

| Creature | Book | As run |
|---|---|---|
| Urnak | Greataxe +27 (36) | **+35 (49)** |
| Huldrin | Trident +29 (25.5) | +33 (35) |
| Juspix | DC 35, top spell rank 7 | **DC 39, rank 8** |
| Syu | Hair +28 (18.5); DC 38; top rank 8 | **+36→38 (43); DC 41→43; rank 10 (Tear the Veil)** |
| Shino | Fist +32 (28) | +34→36 (39.5; **53.5 with sneak attack**) |
| Blue Viper | Shortsword +29 (18.5) | +32 (35.5); bombs +34 |
| Ran-to | Gauntlet +33 (24.5) | **+35→37 (41→43)**; Body Slam 16d6; grapple +37→39 |
| Yarrika | Mantis Strike +25 (29.5); DC 36 | **+35 (43); DC 40; rank 9** |
| Lantondo | Harrow card +30; occult caster, DC 36, top rank 8 | +35; **primal caster, rank 9 Pierce the Sky** (≈64 × 3 targets); DC 39 |
| Artus | Longbow +30 (25.5) | +37 (34) |
| Grandfather Mantis | Claw +28 (29.5) | **+36 (40)** |

Every creature is +4 to +10 above book on attack and +4 to +6 on AC, with up to 55% more HP. That is far beyond Elite; these are rebuilt creatures.

**What each axis reads as, in creature level**, against medians from the 2,092 NPCs in the local packs:

| Creature | AC | Attack | Damage | DC | HP |
|---|---|---|---|---|---|
| Urnak | L16 | L18 | **L24** | – | **L23** |
| Ran-to (after the change) | L17–18 | L19–20 | L20–21 | – | **L24+** |
| Syu (after the change) | ? | L20 | L20–21 | **L21** | L22 |
| Shino (after the change) | L18 | L19 | L18 (L24+ with sneak attack) | – | L21 |
| Grandfather Mantis | L17 | L19 | L19 | – | L21 |
| Yarrika | L17–18 | L18 | L21 | L18 | L17 |
| Huldrin | L17 | L17 | L17 | – | L19 |
| Artus | L17 | L19–20 | L17 | – | L18 |
| Juspix / Lantondo | L16 / L17 | – | – | L18 | L18 |
| Blue Viper | L17 | L16–18 | L18 | – | L21 |

This is Cody's pattern from earlier sessions, pushed further. The defences stay honest, so the party keeps hitting, while offence and HP climb. That inflates both how long fights take and how dangerous they are.

### ⚠️ The Lightkeepers' mid-fight shift

Blue Viper died at 14:30:10. By 14:31–14:32:
- **Ran-to:** attack +35 → +37, damage `4d6+20` → `4d6+22`, AC 39 → 41, max HP 525 → 545.
- **Shino:** attack +34 → +36, AC 40 → 42, max HP 375 → 395.
- **Syu:** spell DC 41 → 43 (Phantasmagoria at DC 41, then Spirit Song and Synesthesia at DC 43); max HP 425 → 445.

**+2 to everything and +20 HP is exactly the Elite template** for creatures of level 5–19. Nothing in the log causes it: no spell, no ability message. Cody didn't mention it at the table. Follow-up: the board at the moment of the change is in Section 9, and the conduct record is in [dm-conduct-notes.md](dm-conduct-notes.md).

## 2. The fights

| | Winter's Roar | Lightkeepers | Biting Roses |
|---|---|---|---|
| Rounds | 7 (~46 min) | 9 (~74 min) | 6 |
| Enemy HP removed | 1,272 | 989 of ~1,785 | ~1,375 of 1,430 |
| **Damage taken / party HP pool** | 816 / 968 = **84%** (77% excluding your own Dichotomy damage) | 2,018 / 968 = **208%** | 1,127 / 1,026 = **110%** |
| Who took it | Clutch 371 (~263 intercepted for others) | Clutch 650, **Sovael 542 (271% of your max HP)**, Sattva 463, Ferrok 363 | Sattva 346, Ferrok 290, Sovael 267, Clutch 224 |
| In-combat healing | ~464 | ~970 | ~796 |
| PCs dropped | 0 | all 4 (Sovael 2×, Sattva 3×, Ferrok 2×) | 0 |

**XP budget vs reality** (4 players: Trivial 40 · Low 60 · Moderate 80 · Severe 120 · Extreme 160):

| Fight | Book XP | XP at the levels the run stats read as | Played as |
|---|---|---|---|
| Winter's Roar | L14 × 3 vs party level 16 = 60 → **Low** | ~L18 × 3 = 240 → beyond Extreme | **Severe.** Roaring Applause took away the reactions they were built around. |
| Lightkeepers | L16 × 4 = 160 → **Extreme** | First pass: L19–20 (plus the mid-fight Elite) = 480–640. **Refined in Sections 8 and 10: ~340–440 at the start (2.1–2.75×)** | **Party wiped.** Cody: *"not designed for you to be able to win."* |
| Biting Roses | L15 × 4 vs party level 17 = 80 → **Moderate** | Foundry lists them as L17 Elite; first pass read L18–19 → 240–320. **Refined in Section 10: ~225 (1.4×)** | **Severe.** Nobody dropped. |

**Crit-fail odds on Syu's big area spells** (failing a basic save by 10 or more doubles the damage):
- **Tear the Veil, DC 42:** a critical failure needed a natural 3 or 4 or lower. The chance that at least one of the four of you crit-failed was **56%**. At her book DC of 38 it would have been 19%, and her book version can't cast a rank-10 spell at all. Two of you did crit-fail (Ferrok on a natural 1, Sattva on a natural 4), for 121 each.
- **Spirit Song #2, DC 43:** a **66%** chance that someone crit-failed. At DC 41, before the change, it was 45%. Ferrok crit-failed on a natural 4 and took 98.

## 3. Damage dealt per PC

| PC | Winter's Roar | Lightkeepers | Biting Roses | Session |
|---|---|---|---|---|
| Ferrok | 353 | 311 | **588** | 1,252 |
| Sattva | 325 | **379** | 419 | 1,123 |
| Clutch | **384** | 299* | 64* | 747 |
| Sovael | 161† | 0 | 281 (+85 max HP removed by Wails' Drained) | 442 |

\* Includes Phantasmagoria damage reflected by Clutch's Aeon stone (27 against the Lightkeepers, 36 against the Roses).
† Includes 56 from Juspix's own Desiccate, which your Spell Riposte turned back on him.

Kills: Sattva 4, Ferrok 2, Sovael 2, Clutch 0.

## 4. What the buffs and debuffs bought

**Tier 1, single-modifier flips** (Foundry's ESSENTIAL tags: removing just this one modifier changes the result):

| Modifier | Flips | Damage value (capped at the target's remaining HP) |
|---|---|---|
| Off-guard (Clutch's grabs, flanking, prone) | 19 | – |
| Frightened (Dirge, your Demoralizes, Clutch's Battle Cry, Ferrok's Fearsome rune) | 14 | – |
| **Heroism (yours)** | **12**: 8 attacks, 4 maneuvers or Battle Medicine | **~190**. The best flips: Clutch's crit on Huldrin (+24), Sattva's Mantis crit (+53), and two hits on the Mantis and Lantondo (64 and 37). |
| **Courageous Anthem (yours)** | **6** (one of them at +3 via Fortissimo) | **~226**. Sattva's crit on Urnak (+41), Sattva's natural-20 on Blue Viper (+51), Ferrok's hits on Juspix and Shino (33 and 74), Clutch's crit on Ran-to (+27). |
| Defensive, on enemy rolls | 11 | Benediction 4, Frightened 5, Taunt 2 |

Anthem's flat +1 to +3 bonus on every damage roll wasn't counted on this pass, so its total value is higher than ~226.

**Tier 2, the whole package** (strip every party buff and every party-caused enemy penalty): **36 party attacks changed result**, 20 misses that became hits and 16 hits that became crits. A further 12 crit-misses became plain misses, which doesn't change anything. On defence, 6 enemy attacks were downgraded. Foundry annotated a party buff on 60 of the 111 party attacks.

## 5. Roll analysis by category (natural d20s)

Positive z means the rolls ran hot; below about −2 or above +2 is unusual.

**PCs**

| | Attack | Save | Other (skill, initiative, flat) |
|---|---|---|---|
| Sovael | n=5, mean 14.2, z **+1.43** (1 nat 20) | n=12, 10.9, z +0.25 | n=18, 9.5, z −0.74 (**3 nat 1s**: Demoralize, Scare to Death, a recovery check) |
| Clutch | n=39, 10.4, z −0.10 | n=18, **13.9, z +2.49** | n=36, 10.1, z −0.46 |
| Ferrok | n=30, 10.4, z −0.06 (3 nat 1s) | n=12, 9.7, z −0.50 (2 nat 1s) | n=4, 8.0 |
| Sattva | n=42, 10.3, z −0.24 (3 nat 20s) | n=15, 10.0, z −0.34 | n=15, 11.0, z +0.34 |
| **Party** | **n=116, 10.5, z +0.06** | **n=57, 11.4, z +1.11** | **n=73, 10.0, z −0.74** |

**Enemies**

| | Attack | Save | Other |
|---|---|---|---|
| Winter's Roar | 9.4, z −0.89 | 8.9, z −0.99 | 10.4 |
| Lightkeepers | 9.7, z −0.86 | 6.9, z −1.78 | **14.3, z +2.82** |
| Biting Roses | 10.5, z −0.04 | 10.9, z +0.30 | 11.7 |
| **All enemies** | **9.9, z −1.06** | **9.5, z −1.15** | **12.8, z +2.30** |

**What the dice say:**
- **The loss wasn't bad luck.** Your saves against the Lightkeepers ran *hot* (n=30, mean 12.3, z +1.74), and their attack rolls ran slightly cold.
- **The one hot streak that mattered was Ran-to's Athletics:** 10 rolls averaging 14.5 (z +2.19), and all four grapple attempts on you were critical successes. But with his +37 grapple (+39 after the Elite change) against your Fortitude DC of 36, he crit on a natural 9 or better (7 or better after the change), so luck only added margin. The grab was effectively guaranteed by the numbers.
- **Enemies rolled low against your spells:** 17 saves averaging 8.5 (z −1.41, about 1-in-12 odds). That favoured you. A flat-10 replay mostly changes nothing, because your Applause, Chain Lightning and Wails failures would mostly still have failed. Two outcomes swap: Ran-to would have failed the Lightkeepers Applause and Syu would have saved it. In the Roses fight, Artus would have saved.
- **Lantondo** made both the Applause and Canticle saves with exactly 40 against DC 40, each on a natural 8.
- **Ferrok's spell DC reads 30**, rising to 33 at level 17. That's why Disintegrate and his other save spells keep landing as successes: enemies averaged a natural 10.2 against them and still saved.

## 6. Sovael across the five axes

| Axis | Result |
|---|---|
| Damage | 442, 4th of 4 (0 against the Lightkeepers). Plus 85 max HP removed by Wails' Drained. Two kills. |
| Control | Roaring Applause in 3 of 3 fights: Winter's Roar 2 of 2 failed, Lightkeepers 3 of 4, Roses 2 of 4, and every target lost its reactions. Heroism was the party's #1 single buff by flips (12, ~190 damage); Anthem added 6 flips (~226). |
| Healing | ~322 in combat: 72 to Sattva, 99 to Clutch at 9 HP, 101 to yourself, plus about 50 from Healing Nexus. |
| Luck | Enemies saved cold against you. Your own skill rolls ran cold. |
| As a target | 975 damage taken, more than any PC except Clutch. Dropped twice. |

## 7. What never fired
- **Artus:** Veering Miss and Soul Arrow.
- **Grandfather Mantis:** Pounce.
- **Ran-to:** Whirlwind Toss.
- **Shino:** Pressure Point.

Some of these may not exist in Cody's rebuilt versions, so this is weak evidence either way.

---

## 8. Lightkeepers budget, priced one axis at a time

Each as-run stat is compared with the median of the published NPCs in the local packs, to get an effective creature level per axis (start of fight → after the mid-fight change).

| Axis | Ran-to | Shino | Blue Viper | Syu |
|---|---|---|---|---|
| **HP** | 525 → 545: **L24 → L25** | 375 → 395: L20 → L21 | 400: L21 | 425 → 445: L21.5 → L22 |
| **Attack** | +35 → +37: L18 → L19.5 | +34 → +36: L17.5 → L19 | +34: L17.5 | +36* → +38: L19 → L20 |
| **Damage per hit** | 41 → 43: L20 → L20.7 | 39.5 → 41.5: L19 → L20 (L24+ with sneak attack) | 35.5: L18 | 41* → 43: L20 → L20.7 |
| **Spell DC** | – | – | 40 (poison): L18 | 41 → 43: L19 → L20.5. A rank-10 spell needs a level-19+ caster. |
| **AC** | 39 → 41: **L16** → L17.5 | 40 → 42: L17 → L18 | 40: L17 | never attacked |
| **Saves** | Will 27 → 29: **L15** → L17 | Fort 30 / Will 27: L17 / **L15** | Fort 32 / Will 27: L18 / **L15** | Will 34: L19.5 |
| **Perception** | 33 → 35: L19 → L20 | 32 → 34: L18 → L19 | 32: L18 | 29 → 31: L16.5 → L17.5 |

\* Inferred. Syu's attack and damage were only seen after the change, so her starting values are the observed ones minus 2.

**Pattern:** defenses sit near party level (L15–17, with Will the weak spot, which is why Roaring Applause landed on three of four). Offense reads L18–21 and HP L20–25.

**Budget** (party level 16, 4 PCs: Trivial 40 · Low 60 · Moderate 80 · Severe 120 · Extreme 160):

| Priced only by… | Ran-to | Shino | Blue Viper | Syu | Total | vs Extreme |
|---|---|---|---|---|---|---|
| Defense (AC, saves) | L15.5 → 30–40 | L16.5 → 40–60 | L17 → 60 | L19.5 → 120–160 | ~250–320 | 1.6–2× |
| Offense (attack, damage, DC) | L19 → 120 | L18 → 80 | L18 → 80 | L19.5 → 120–160 | ~400–440 | 2.5–2.75× |
| HP | L24: off the table | L20: 160 | L21: off the table | L21.5: off the table | 640+ | 4×+ |
| **Combined (median of axes)** | L18.5 → 80–120 | L17.5 → 60–80 | L18 → 80 | L19.5 → 120–160 | **~340–440** | **2.1–2.75×** |

- **Without the Elite change** (the fight as it started): ~340–440, the combined row above.
- **With it, as it actually happened:** Blue Viper was already dead, so it applied to three. Ran-to ~L19–20, Shino ~L19, Syu ~L20.5. Those three alone price at ~400–440.
- **If all four had been Elite from the start:** ~480–560 (3–3.5×).

Caveats: Syu's AC was never tested. Each save comes from one or two rolls. A hand-built boss can sit off-median on an axis by design, so treat each effective level as ±1.

---

## 9. Where the Lightkeepers fight turned

### The board at 14:30:10 (start of round 3, Blue Viper dies)

| | HP | State |
|---|---|---|
| Sovael | 197/200 | Just freed from Ran-to by Ferrok's teleport; Quickened; sustaining Roaring Applause |
| Clutch | ~151/298 | Quickened |
| Ferrok | 183/222 | Quickened; confusion over |
| Sattva | ~229/248 | Quickened; fast healing 9 |
| **Party** | **~760/968 (79%)** | 2 hero points spent; scroll Haste and Quickened Casting used |
| Blue Viper | **0/400** | Dead |
| Ran-to | 492/525 | No reactions (made the Applause save); Frightened 1 |
| Shino | 302/375 | **Slowed 1, no reactions** |
| Syu | 398/425 | **Slowed 1, no reactions**, so no three-action spells; rank 9 and rank 7 slots already spent |

**Pace through round 3:** the party was dealing ~178 a round, so the three survivors needed ~6.7 more rounds. The enemy was dealing ~209 a round against ~100 a round of party healing, so ~7–8 rounds to finish the party. **Roughly a coin flip, trending the party's way.** That is the moment the Elite template appeared.

### The failure point: round 3, when Sovael dropped and the Applause ended

| | Rounds 1–3 (Applause up) | Rounds 3–9 (Applause gone) |
|---|---|---|
| Damage the party dealt | 533 (~178/round) | 456 (~76/round) |
| Damage the party took | 626 (~209/round) | 1,392 (~232/round) |
| Enemy kills | Blue Viper | none |

**Why the Applause mattered:** Slowed 1 kept Syu to two-action spells (Telekinetic Bombardment, Spirit Song). Once it ended she cast two three-action spells, **Visions of Danger (278) and Tear the Veil (265): 543 damage, 27% of everything the party took.** Shino got Nimble Dodge back immediately and cancelled a 74-damage Briny Bolt.

**How round 3 broke:**
1. Ferrok's Take Your Places pulled Sovael out of Ran-to's grip.
2. Syu's Spirit Song hit Sovael and Clutch: Sovael Stunned 1, and Clutch lost his reaction.
3. Ran-to closed back in, crit-grappled Sovael and hit him twice (Sovael at 68).
4. Shino crit Sovael while he was restrained (off-guard, so sneak attack) for 90. Sovael dropped and the Applause ended.
5. The Elite change hit their stats in the same window.

**Things that looked like causes but weren't:**
- **Clutch not rerolling his save:** Spirit Song strips reactions even on a success. Only a natural 20 would have kept his Intercept.
- **The +2 from the Elite change:** Sovael's Spirit Song save (natural 6, total 34) fails at DC 41 and DC 43 alike, and Shino's crit still crits without the +2. The change added roughly 250–300 damage to the party and 60 enemy HP afterward. It didn't cause the drop. (The integrity question is separate and doesn't depend on this; see the conduct notes.)
- **Dice:** Sovael's saves against Syu ran above average.

**Root cause:** Ran-to was the one Lightkeeper the Applause didn't slow (saved on a natural 16), and he was assigned to Sovael. Against Sovael's Fortitude DC 36 his grapples crit on a natural 9 or better (7 or better after the Elite change), so every time he reached Sovael, Sovael was restrained and off-guard for Shino's sneak attack.

### Answers worked out afterward
- **Delay plan (Pax's idea):** delaying until after Ferrok's teleport freed him would have let Sovael cast Unfettered Movement (restrained blocks manipulate). It doesn't stop the round-3 drop. It pays off from round 4, turning each failed Escape (rounds 4 and 6) into one automatic action. Pre-casting isn't an option: pre-buffing is banned in the tournament.
- **Rematch turn 1:** Quickened Casting into a rank-6 Roaring Applause (1 action), then the Living Thunderbolt scroll (2 actions). Fly 60 outranges Ran-to's 50-ft Greater Leaping Catch, Escape auto-succeeds, and spells and Sustain still work. Open question for Cody: whether the polymorph "can't activate items" line applies.
- **Dazzling Dragonet Disappearance (new at 17):** no manipulate trait, so it works while restrained. After the first adjacent hit Sovael is hidden, and every attack *and grapple* against him needs a DC 11 flat check. None of the book Lightkeepers has truesight.
- **Mirror Image** limits damage once grabbed (a crit that lands on an image becomes a normal hit) but doesn't stop the grapple itself, which targets Fortitude DC, not AC.

---

## 10. Cross-fight benchmark (recomputed 2026-10-06)

Same method, all three fights on one scale: each as-run stat mapped to the median of **2,104 published NPCs** (levels 10–25), then the median across axes priced against the party. For reference, the book labels its tournament matches **Extreme**.

| Match | Party | Effective level per enemy | Budget | vs Extreme (160) |
|---|---|---|---|---|
| **Winter's Roar** | L16, 4 PCs | Urnak 18 · Huldrin 17 · Juspix 17.5 | ~210 XP | **1.3×** |
| **Biting Roses** | L17, 4 PCs | Yarrika 18 · Lantondo 17.8 · Artus 18 · Grandfather Mantis 17.5 | ~225 XP | **1.4×** |
| **Lightkeepers** (start) | L16, 4 PCs | Ran-to 18.5 · Shino 17.5 · Blue Viper 18 · **Syu 19.2** | ~380 XP | **2.4×** |

**The Roses in detail:**

| | AC | Attack | Damage | DC | HP | Weak save |
|---|---|---|---|---|---|---|
| Yarrika | L17.5 | L18 | L20.7 | L18 | L17.2 | Fort L16 |
| Lantondo | L17 | L18 | – | L17.5 | L18.4 | Fort L16 |
| Artus | L17 | **L19.5** | L16.8 | – | L18.4 | Fort L16 |
| Grandfather Mantis | L17 | L19 | L18.9 | – | **L21.4** | Will L16 / Fort L17 |

**Reading:** Cody's normal tournament tuning puts every enemy at about **party level +1**, around 1.3–1.4× Extreme on this method. Defense stays near party level, while offense and HP sit higher. The Lightkeepers ran about 1.7× harder than that before the Elite change, with Syu a full level above her team. The multiplier is this method's estimate (HP inflation pushes it up), so it's solid for comparing Cody's fights with each other but shouldn't be read as an exact figure.
