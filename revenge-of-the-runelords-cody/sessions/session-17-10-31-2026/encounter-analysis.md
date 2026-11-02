# Session 17 — Encounter Analysis

*Built from `rolls.txt` (Foundry export v2, a single session block, no double paste) and the cleaned transcript. Book stat blocks come from the local packs: `pathfinder-monster-core-2/urveth.json` and `revenge-of-the-runelords-bestiary/book-3-*/{adamantine-sentinel, risen-runelord-aethusa-ii, risen-runelord-jurah, risen-runelord-alaznist, goldgorger}.json`. Max HP for every creature is the export header's `exact (observed at 100%)` value. AC is backed out of `CTX :: dc armor` plus the conditions active on each roll. Party level 19, five PCs, HP pool **1,294** (Sevek 293 · Paya 293 · Mithtirith 255 · Aureys 236 · Kreebnock 217).*

## Headline

- **The Runelord fight was the hardest of the night, and the XP budget can't see it.** Book stats price it at 120 XP (Moderate for five players). As run it was about **240 XP, above Extreme**:
  - **Aethusa and Jurah**: book 333 HP, run at 475.
  - **Alaznist**: book 385 HP, run at 550, with spell DCs +4 over book, a heavier polearm, and Reactive Strike and Pierce the Sky added.
  - The party took **65% of its HP pool**, Aureys bottomed at 23 HP, and nobody dropped.
- **Two printed defences never fired, and the party would have felt both.** That lowers the threat axis for that fight but not the grind.
  - The Runelords' **mythic resistance 9–10** was not applied. Non-mythic hits landed for exactly what they rolled, which saved roughly 200–250 HP of grinding.
  - **Alaznist's Mythic Defenses** (every critical hit against her must be rerolled) never triggered. Three crits on her stood: Paya 106, Sevek 84, Aureys's Undying-Myth claw.
- **The Sentinels were the fight that actually hurt.** They took **81% of the pool**, the most of any fight, and **Paya dropped**. The book has a level-15 construct. Cody ran an Elite-plus: attack +4 to +5 over book, damage +7 per hit, and the printed physical resistance 15 kept. That resistance alone absorbed about 390 damage.
- **Glory on High zeroed the Goldgorgers.** After it landed, **not one of their melee hits got through**: seven attacks lost to the flat check, including a natural-20 crit on Aureys. The fight cost 20% of the pool, all of it from Searing Spew.

## 1. Per-creature tables

### Defence (book → as run)

| Creature | HP | AC | Fort / Ref / Will | Resist / weak | Verdict |
|---|---|---|---|---|---|
| **Urveth** ×3 (L18) | 460 → **480** | 40 → **42** | 32/29/34 → **34/31/36** | cold 15; weak holy/silver 15 (both applied) | **Clean Elite** |
| **Adamantine Sentinel** ×8 (L15) | 275 → **300** | 37 → **39** | 29/27/24 → **27/27/27** | physical 15, **applied** (~15 off every weapon hit) | Elite chassis, saves flattened |
| **Aethusa** (L18) | 333 → **475** (×1.43) | 42 → **43** | 27/30/32 → **30/33/36** | mythic 9, **never applied** | **Scaled** (HP; saves +3–4) |
| **Jurah** (L18) | 333 → **475** (×1.43) | 42 → **43** | 27/30/32 → **30/33/36** | mythic 9, **never applied** | **Scaled** (as Aethusa) |
| **Alaznist** (L20) | 385 → **550** (×1.43) | 46 → **47** | 30/34/36 → **32/36/38** | mythic 10, **never applied**; Mythic Defenses **never applied** | **Scaled** |
| **Goldgorger** ×4 (L18) | 335 → **355** | 42 → **43** | 34/30/28 → **36/32/30** | acid/electricity 20 (applied) | Elite, AC one short of Elite's 44 |

- **Undying Myth refills scaled too.** Alaznist's book refill is 193 HP; as run it was **275**, half of 550. The two L18 Runelords refilled to 237.
- **Why "scaled" holds for the three Runelords.** Elite on an L18 adds only 20 HP (353) and on an L20 adds 30 (415). No printed field explains 475 or 550, so the ×1.43 is Cody's own rebuild.

### Offence (book → as run)

| Creature | Attack | Damage per hit (avg) | DCs | Payload changes |
|---|---|---|---|---|
| **Urveth** | +36 → **+38** | jaws 3d10+14 + 2d10 cold (~41) → 3d10+22 + 2d10 (**~49**) | Eclipse Burst DC 40 → **42** | Elite. Swallow Whole and venom on the block, never used |
| **Adamantine Sentinel** | headbutt/claw +30 → **+34 / +35**; bolt +27 → +33 | headbutt 3d12+15 (~35) → **3d12+22 (~42)**; claw 3d10+15 (~32) → **3d10+20 (~37)** | — | **+4–6 to hit and +5–7 damage, more than Elite's +2/+2.** Offence rebuilt harder than defence |
| **Aethusa** | (polearm never swung) | — | DC 40 → **41** (Eclipse Burst, Howling Blizzard), **42** (Desiccate) | spells as printed, rank 8 top |
| **Jurah** | +33 → **+36** | 3d12+15 (~35) → **4d12+22 (~48)** | DC 40 → **43** (Phantasmagoria, rank 9) | +1 damage die, +7 flat |
| **Alaznist** | +36 → **+39** | 4d12+16 (~42) → **5d12+23 (~56)** | DC 42 → **46** (Fireball r7, Cataclysm r10, Arctic Rift r8); spell attack **+38** | **Added**: Reactive Strike (Cody: *"Most of them don't because it's cheap, but in her case"*) and **Pierce the Sky** (rank 9; not on her list). Fireball heightened to 7 |
| **Goldgorger** | +34 → **+38** | jaws 4d12+16 (~42), as printed | Searing Spew DC 40 → **40–42** (varied by creature) | +4 to hit (Elite is +2). **Caustic Slivers aura** (8d6 acid, DC 37 to anyone ending a turn adjacent) **never applied**, though Aureys and Sevek stood next to them all fight |

### Per-axis level profile (medians from 1,300+ local NPC blocks at levels 14–25)

| Creature | Book level | AC reads as | DC reads as | HP reads as | Attack reads as |
|---|---|---|---|---|---|
| Urveth | 18 | L18 | L20 | **L23** (book 460 is already L22) | L20 |
| Adamantine Sentinel | 15 | L16 | — | L16 (+ resist 15) | **L18** |
| Aethusa / Jurah | 18 | L19 | L19–21 | **L23** | L19 |
| Alaznist | 20 | L21 | **L23** | **L25** | L21 |
| Goldgorger | 18 | L19 | L18–19 | L19 | L20 |

**What kind of inflation each fight had:**
- **Grind (HP) inflation:** the Runelords. Normal five-player accommodation.
- **Threat inflation:** Alaznist's DCs and damage, and the Sentinels' attack and damage. These are the levers that actually endanger a party.
- **Honest Elites:** the Urveth.

## 2. Per-fight table

| Fight | Rounds | Enemy HP cleared | Damage taken (% of 1,294 pool) | In-combat healing | Who ate it | Margin (pool + heals − taken) |
|---|---|---|---|---|---|---|
| **Urveth** | 5 | 1,440 | **846 (65%)** | 479 | Kreebnock 286 · Sevek 225 · Mithtirith 123 · Aureys 113 · Paya 99 | 927 |
| **Sentinels** | 6 | 2,400 + ~390 absorbed by resistance | **1,044 (81%)** | 562 | **Paya 471 (dropped)** · Kreebnock 170 · Sevek 168 · Mithtirith 125 · Aureys 110 | 812 |
| **Runelords** | 6 | 2,249 (incl. three refills) + ~200–250 if resistance had worked | **846 (65%)** | 372 | Aureys 213 (low 23) · Paya 210 · Mithtirith 152 · Kreebnock 142 · Sevek 129 | 820 |
| **Goldgorgers** | 3 | 1,420 | **258 (20%)** | 0 | Sevek 99 · Mithtirith 83 · Kreebnock 39 · Paya 37 · Aureys 0 | 1,036 |

**Notes:**
- **Urveth:** three opening Eclipse Bursts did ~340 before anyone acted, which put Kreebnock (softest body, 217 HP) on top of the damage-taken column.
- **Sentinels:** the damage concentrated on whoever was surrounded. Paya stood in the middle of four of them for most of the fight.
- **Runelords:** the spread was even. The only spike was Alaznist's three-swing melee turn into Aureys (166 damage).

## 3. Two-axis verdict and re-priced budget (5 players: Low 80 · Moderate 100 · Severe 150 · Extreme 200)

| Fight | XP by book levels | XP by as-run levels | Grind | Threat | Verdict |
|---|---|---|---|---|---|
| Urveth | 3 × L18 = 90 (Low+) | 3 × L19 (Elite) = 120 (Moderate+) | high | **high**: alpha strike | **Severe in play.** Three Eclipse Bursts before the party acted |
| Sentinels | 8 × L15 = 80 (Low) | 8 × ~L17 = 160 (Severe) | very high | **highest of the night** | **Severe.** Book says Low; the offence rebuild and the body count made it the dangerous fight |
| Runelords | 18 + 18 + 20 = 120 (Moderate) | ~L20 + L20 + L22 = 60 + 60 + 120 = **240** | very high | high | **Extreme** by the as-run budget. **Severe** in play, because the two unapplied defences took the edge off |
| Goldgorgers | 4 × L18 = 120 (Moderate) | 4 × L19 = 160 (Severe) | moderate | **low** | **Moderate in play.** Glory on High took their melee out of the fight |

**Where I believe the budget and where I don't:**
- **Sentinels:** I believe the threat side. The XP floors the bodies; eight of them doing +7 damage over book took more of the pool than three Runelords did.
- **Runelords:** the budget is right about the bodies. Foundry quietly gave back about two levels of defence.
- **Goldgorgers:** the budget says Severe, and one 2-action feat made it Moderate.

## 4. Per-PC damage dealt (applied; no overkill; reverted lines excluded; persistent credited to the inflicter)

| PC | Urveth | Sentinels | Runelords | Goldgorgers | **Total** | Share | Kills |
|---|---|---|---|---|---|---|---|
| **Paya** | 728 | 850 | 1,043 | 313 | **~2,930** | **39%** | 8 |
| **Sevek** | 306 | 683 | 470 | 453 | **~1,910** | 26% | 1 |
| **Aureys** | 196 | 462 | 488 | 386 | **~1,530** | 20% | 5 |
| **Kreebnock** | 194 | 353 | 78 | 224 | **~850** | 11% | 2 |
| **Mithtirith** | 16 | 52 | 56 | 44 | **~170** | 2% | 1 |

Alaznist did 68 to Jurah, killing him, and the Runelords' own area spells did 46 more to each other. Sevek's Goldgorger figure includes a 51-point hit that Foundry applied to D instead of A.

**Why Paya is so far ahead:**
- Hot dice: attack naturals averaged 11.69, z = +1.57, four natural 20s.
- The Timeflaying Blade: it is mythic, so it would have ignored the Runelords' resistance anyway.
- Two Reactive Strikes a round: 108 on Jurah mid-Haste.
- **Kreebnock's three amped Messages** turned into Paya Strikes for 102, 94 and the Alaznist kill.

## 5. What the control package bought — Foundry's own `MM :: ESSENTIAL` tags (Tier 1: remove that one modifier and the outcome changes)

**Offensive (party attack rolls, 72 tagged rolls):**

| Modifier | Essential | Helpful | Source |
|---|---|---|---|
| **Off-guard** (flanking, Feint, prone, blind) | **21** (11 + 10 flanked) | 24 | Aureys's Feint/Distracting Feint, flanking, Sevek's and Rippling Spin's trips, Glory on High / Celestial Armaments blinds |
| **Frightened** | **12** | 10 | **Majestic Presence (Aureys ×3 fights, Sevek ×2)**, Frightening Power, Demoralize |
| **Courageous Anthem** (+1) | **8** | 13 | Kreebnock, every round |
| **Clumsy** | **5** | 8 | Sevek's Greater Crushing crits, Aureys's Earth to Heavens, Mithtirith's Tempest Surge |
| Sickened | 1 | 1 | Painful Vibrations (Kreebnock) |

**Defensive (enemy rolls the party's modifiers turned):**

| Modifier | Turned | Source |
|---|---|---|
| **Whirlwind Stance** (+2 AC) | **8 hits → misses**, plus 1 crit → hit | Sevek |
| Frightened on the attacker | 7 hits → misses, plus 1 more | the two Majestic Presences and Frightening Power |
| Enfeebled | 3 | Sevek's Greater Crushing crits |
| Taunt | 1 | Sevek |
| Prone | 1 | trips |
| **Blinded/dazzled flat checks** | **7 attacks cancelled** (Goldgorgers B ×2, A ×2, D ×3), including a natural-20 crit on Aureys and all three jaws on Kreebnock | **Glory on High** (Sevek) |

**Reading it:**
- **Frightened was decisive on 19 rolls:** 12 party attacks and 7 enemy attacks. Most of it traces to the two Majestic Presences (Aureys started it; Sevek *"took a page out of Aureys"*). Frightening Power and Demoralize contributed too, and the tags don't separate the sources.
- **Sevek's defensive contribution is mostly invisible in the damage column.** Whirlwind Stance turned 8 hits into misses, Greater Crushing 3, and Glory on High cancelled 7 attacks. That is 18 enemy attacks turned, against about 20 aimed at him in the Sentinel fight and 3 hits taken there.
- **Coverage:** Foundry only tags what it applied. Anthem was "up" most rounds but is tagged on 21 rolls, so its true count is higher. This report gives Tier 1 only; a full package (Tier 2) recount was not run.

## 6. In-combat healing (between-fight Refocus and Treat Wounds excluded)

| Fight | Total | Healers |
|---|---|---|
| Urveth | 479 | **Mithtirith 239** (incl. Cody's rank-9 Heal for him, 121) · Sevek 104 (Scroll of Heal on himself) · Paya 96 (Ocean's Balm) · Kreebnock 40 |
| Sentinels | 562 | **Mithtirith 429** (three-action Heal 58 × 5, self 109, Healer's Gloves 30) · **Kreebnock 133** (Restore the Mind 80, **Soothe 53, which raised Paya from dying 1**) |
| Runelords | 372 | **Mithtirith 252** (self 104, three-action Heal 37 × 4) · Kreebnock 120 (Restore the Mind ×3) |
| Goldgorgers | 0 | none needed |
| **Session** | **1,413** | **Mithtirith ~920 · Kreebnock ~293 · Sevek 104 · Paya 96** |

Out of combat, Paya ran the healing queue after every fight: Refocus 69–76 to all five, Ocean's Balm, Dash of Herbs, Torrent in the Blood and Treat Wounds. That is roughly 1,000 more and is not counted above.

## 7. Roll analysis (first die only on rerolls)

| PC | Attack d20: n / mean / z | Saves: n / mean / z | Skills: n / mean | Notes |
|---|---|---|---|---|
| **Paya** | 58 / **11.69 / +1.57** | 11 / 10.91 / +0.24 | 2 / 9.5 | Four natural 20s; Cody: *"this is some bullshit"* |
| Sevek | 41 / 9.76 / −0.83 | 13 / 12.77 / +1.42 | 7 / 12.57 | Two natural 20s; **Perfected Form** rescued four first Strikes below 10 |
| Aureys | 56 / 9.96 / −0.70 | 8 / 10.50 / 0.00 | 15 / 11.27 | No natural 20s in 56 attacks |
| Kreebnock | 5 / 10.40 | 8 / 12.88 / +1.17 | — | Spell attacks: two of five were critical hits (194, 198) |
| Mithtirith | 2 / 3.50 | 9 / 11.11 | 1 / 19 | Mostly save spells and heals |

**Enemy dice (attack modifiers are visible in this export, checked):**

| Enemy | n | Mean | z |
|---|---|---|---|
| Urveth | 15 | **8.87** | −1.10, cold (but three natural-20 crits for 82, 94, 113) |
| Adamantine Sentinels | 63 | 10.51 | +0.01, dead average (three natural 20s) |
| Alaznist | 9 | 10.78 | +0.14 |
| Goldgorgers | 12 | 10.75 | +0.15 |

**Enemy saves against each PC's effects:**

| Against | n | Mean | z | Reading |
|---|---|---|---|---|
| Sevek | 24 | **9.58** | −0.78 | Slightly in his favour: Glory on High's 4/2/6 and Aethusa's blind |
| Kreebnock | 8 | 12.62 | +1.04 | Slightly against him |
| Mithtirith | 12 | 10.75 | +0.15 | Even |
| Aureys | 10 | 11.40 | +0.49 | Even |

No one's night was decided by luck except Paya's attack dice, and the Sentinels hit as hard as they did on average rolls.

## 8. What didn't fire

| Creature | Printed ability | Why it matters |
|---|---|---|
| Urveth | **Swallow Whole**; Urveth Venom (stinger never hit) | Aureys sat restrained in a set of jaws for a round. Sevek's Shove ended it before the swallow came |
| Aethusa, Jurah, Alaznist | **Mythic resistance 9 / 9 / 10** | ~200–250 HP of grind the party never had to clear (non-mythic Strikes and spells landed in full) |
| Alaznist | **Mythic Defenses** (crits must be rerolled) | Three crits stood, including the claw crit that forced her Undying Myth |
| Alaznist | Implosion, Massacre, Chain Lightning, Disintegrate (all on her list) | She spent her turns on Cataclysm, Arctic Rift (which killed Jurah), Eclipse Burst (Nullified) and melee |
| Jurah | Duplicate Foe, Warp Mind, Confusion, Slow | One Phantasmagoria (Kreebnock immune), one Haste (disrupted by Paya), then dead to his own side |
| Goldgorgers | **Caustic Slivers** (8d6 acid aura, DC 37) | Never applied, despite melee PCs ending turns beside them. With it, Aureys's "0 damage taken" would have been ~50–100 |
| Goldgorgers | Melee in general after round 1 | Glory on High: seven attacks cancelled |

## Uncertainty

- **Kill and HP figures** use the header's exact max HP and the reviewers' per-fight ledgers, which reconcile to those totals.
- **"Never applied"** means the log shows full rolled damage landing on non-mythic hits. It could be a Cody choice rather than a Foundry miss.
- **The Sentinels' "~L17"** is a judgement across mixed axes. Their AC and HP read L16, and their offence reads L18.
- **Flip counts** are Foundry's Tier 1 only; a Tier 2 package recount was not run.
