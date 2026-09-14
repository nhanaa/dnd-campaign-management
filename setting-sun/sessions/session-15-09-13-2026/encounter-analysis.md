# Encounter Analysis — Session 15 (2026-09-13)

*Setting Sun, Rising Phoenix · Fists of the Ruby Phoenix, Book 1 · party level 14 (Poltergeists, Shadows) → 15 (Jaiban onward) · five PCs (four for the Poltergeists)*

**Sources.** `rolls.txt` (foundry-export v2, one header — no double paste). Every enemy's max HP comes from the export's `max-HP :: … :: exact` block. Per-fight damage and healing reconcile exactly to enemy HP (the six combat reviews in `/tmp/combat-review-setting-sun-s15-enc*.md`). Book blocks were read in full from `pf2e/fists-of-the-ruby-phoenix-bestiary/book-1-despair-on-danger-island/` and `pathfinder-monster-core/banshee.json`. `MM :: ESSENTIAL` tags matched the independent Tier-1 flip count **23 of 23**.

## Headline

1. **Jaiban was a level-18-to-20 threat that hit like level 24, on level-15 paperwork — and the XP table prices him below Trivial.** Book: level 15, 170 HP, AC 36, Strikes +31. Table: **470 HP (+100 from Earth-Shaking Ferocity), AC 41, Strikes +35/+37 with an extra damage die and ~+10 flat, save DCs 41–42, Perception +34, Quickened for two rounds.** The +6 on Jaws alone turned both hits on Clutch into criticals — **186 damage where the book gives ~51** — and is most of why Clutch absorbed 277 of his 280 HP. It is the same block Cody fielded against the level-12 party in S11; it was not rescaled for the rematch. Foundry's own threat tag read **"severe"** every round.

2. **Earth-Shaking Ferocity, as run, was worth ~100 HP and 148 damage.** The Foundry card says *stay at 1 HP, Wounded +1, regain Quaking Stomp*; Cody set Jaiban to 100 HP. Against the card, that bought Jaiban a free Stomp (99 applied) and an extra turn (a 49-damage tail) that a 1-HP Jaiban would never have reached — Foretell Harm would have killed it first. **That is 32% of everything the party took in the fight.** Jaiban was already on **1 HP** when Sovael's natural-20 Fire Ray landed; the "100" was narrated, not applied.

3. **The Wraiths were the session's worst fight, and it came entirely from spells their stat block doesn't have.** HP, AC and Strike bonus are book-exact — but they cast **rank-7 Howling Blizzard and Eclipse Burst (DC 38)** and a 20d6 Grip of Fear that are not in the block. **643 of the 699 damage the party took (92%) came from those.** At a 120-XP "PL+1" price it took **66% of the party's HP pool** and put Seva at 25/143.

4. **Tamikan and the Shadows got grind plus damage; the Banshees were a Weak Monster Core banshee with re-buffed hands; the Poltergeists ran softer than the book.** Tamikan: 450 HP vs 295, 18d6 Screech vs 12d6, +7 on Strikes, Quickened — but AC and DC at book. **49.5% of the pool at a Trivial-band 60 XP.** The S14 pattern holds: Cody's inflation lives in **HP, damage dice, added abilities and Quickened**; AC stays within ±1 of book, and save DCs were inflated only on Jaiban.

5. **The party dodged its crit-fail branches.** Quaking Stomp at DC 41 instead of 36 raised P(at least one critical failure across both Stomps) from **27% to 80%**; the four Wraith AoE casts carried **77%**. **Zero critical failures landed in either fight.** In S11, against the same DC 41 Stomp, Ferrok and Sovael both critically failed for 180.

6. **Clutch was the session's control engine, not Sovael.** Clutch's Taunt, Battle Cry, trips and grabs supplied **16 outcome-changing flips** (plus 3 from his own shield); Sovael supplied **7** (plus 1 on himself). Off-guard carried 49% of the party's decisive package points; Courageous Anthem 22%.

7. **Sovael's night, measured honestly.** 453 damage (15.2%, 3rd of 5) — but **266 of it was vitality against undead**, and he dealt **72 of 1,020 (7%) against the two living bosses**. What he converted was precise: **the Tamikan kill** (Fire Ray hitting by exactly 0, needing both Whispers of Weakness and Clutch's off-guard), **the Banshee B kill** (Anthem essential), **two Ferrok criticals worth ~145 on Jaiban** (Synesthesia's Clumsy 3), and **Anthem keeping Clutch out of Stunned 4**. He was the **#1 in-combat healer (437, of which 135 was self-healing)** and **#2 on ally healing** behind Sattva. **No luck grievance this session:** enemies rolled z = −1.62 against his DCs. **Benediction flipped nothing; Roaring Applause bought no enemy actions** (Tamikan succeeded) but denied an estimated 3–4 tail Reactive Strikes (~110–150 HP).

## Level benchmarks used

**Benchmarks.** These are empirical medians per level across **6,307 unique NPC JSONs** (`pf2e/*bestiary*`, `pathfinder-monster-core*`, `pathfinder-npc-core`, `npc-gallery`). "dmg" means the average of the creature's best Strike.

| Lvl | HP | AC | Strike | Strike dmg | Spell/ability DC | Perception |
|---:|---:|---:|---:|---:|---:|---:|
| 14 | 255 | 36 | +29 | 30.5 | 34 | 25 |
| 15 | 275 | 37 | +30 | 32.5 | 36 | 27 |
| 16 | 295 | 39 | +32 | 32.5 | 37 | 28 |
| 17 | 315 | 40 | +33 | 34.5 | 38 | 30 |
| 18 | 335 | 42 | +35 | 36.5 | 40 | 32 |
| 19 | 360 | 43 | +36 | 41 | 41 | 33 |
| 20 | 380 | 45 | +38 | 44 | 42 | 36 |
| 22 | 450 | 48 | +41 | 48 | 45 | 39 |
| 24 | 525 | 51 | +44 | 50 | 48 | 42 |

⚠️ **Pack-version caveat.** Every local FotRP JSON is flagged `remaster: false` (the legacy AP printing). Cody's Foundry module may carry a revised actor. So treat **±1–2 differences** as possible version drift, not proof of a GM edit: the Poltergeist's attack, Shadow AC, Wraith Fort/Will, and Tamikan's AC and saves. The large differences cannot be drift: HP, damage dice, added spells, Quickened, Ferocity, and all of Jaiban.

## 1. Per-creature — book vs. table

AC is the **clean base**: `CTX dc armor` plus the active penalties on that roll (frightened N, clumsy N, off-guard 2). Sattva's ranged shots show a +1 lesser-cover bump and were read accordingly.

### Watchtower Poltergeist ×2 (book L14): ran close to book, and slightly *softer*
| | Book | Table | Evidence |
|---|---|---|---|
| HP | 190 | **190** | header exact |
| AC | 36 | **36** (A 35+Fr1, B 34+Fr2, 32+Fr2+OG all → 36) | L81, 210, 215, 358 |
| Telekinetic Object | +27, 3d12+10 | **+29**, 3d12+10 | L117–128, 164; B's R2 storm was hand-set to +32 (L226–238, see combat review FLAG 4) |
| Saves | F+22 R+27 W+26 | F+22, W+26 | L151, 259, 335; Will DC 36 L78 |
| Perception | +24 | +24 | L72 |
| DCs | innate 35, Frighten 33 | none used | — |
| **Payload** | Storm misses deal **2d12** | **misses did 0** | 10 plain misses (L117, 120, 182, 186, 226, 264, 275, 343, 350, 354) → **~130 book damage never applied** |

**Template:** none. It is the book block, with +2 attack that may be version drift. **Per-axis level:** AC L14 · attack L14 · damage L13.5 · Perception L13.5 · **HP L11**.

### Watchtower Shadow ×2 (book L15): grind plus a damage bump
| | Book | Table | Evidence |
|---|---|---|---|
| HP | 190 | **250** (×1.32) | header |
| AC | 36 | **37** (every roll: 37 clean; 35+OG; 34+Fr1+OG) | L457–680 |
| Shadow Hand | +30, 4d10+10 (32) | **+30, 4d10+17 (39)** | L442–617, 444 |
| Saves / Perception | F+21 W+26 / +25 | F+21, W+26 (DC 36) / +25 | L487, 559, 438, 416 |
| Added | — | **Translocate** (once each; transcript 54:54–55:50, no log card) | — |

**Template:** not Elite (Elite would be +2 attack and 210 HP). It is custom: +60 HP, +7 damage, +1 AC. **Per-axis level:** AC L15 · attack L15 · Perception L14 · HP L14 · **damage L18.6**.

### Jaiban (book L15 "Creature 15"): rebuilt; the same block as S11, not a rematch rescale
| | Book | Table | Δ | Evidence |
|---|---|---|---|---|
| HP | 170 | **470** (+100 Ferocity = 570 cleared) | ×2.76 (×3.35) | header; [113:43] |
| AC | 36 | **41** (41 clean on four R1 rolls; 38+Cl3; 36+Cl3+OG) | **+5** | L784–1120 |
| Jaws | +31, 3d12+14 (33.5) | **+37, 4d12+24 (50)** | +6, +49% | L765, 768 |
| Foot | +31, 3d8+14 (27.5) | **+36, 4d8+20 (38)** | +5, +38% | L918, 924 |
| Tail | +31, 3d6+14 (24.5) | **+35, 4d10+23 (45.5)** | +4, +86% | L1082, 1086 |
| Athletics (Grapple) | +30 | **+32** | +2 | L912 |
| Will / Reflex | +25 / +23 | **+32** (L804, 813, DC 42 L846) / **+32** (Reflex DC 39 under Clumsy 3, L1033) | **+7 / +9** | |
| Perception | +23 | **+34** | **+11** | L714 |
| Whip Tail | Fort DC 36 | **DC 42** | +6 | L809–812 |
| Quaking Stomp | "Earthquake effects", no DC printed (sibling DCs 36) | **11d6+4, basic Reflex DC 41** | +5 | L751–756, 1048–1053 |
| Quickened | no | **yes** (removed R2, [105:09]; gone from COND after 14:55:23) | — | L746 |
| Earth-Shaking Ferocity | **not in book** | card: *1 HP + Wounded 1 + regain Stomp*; **run as regain 100 HP** + free Stomp | — | L1125; [113:43] |

- **Template read.** It carries **Elite fingerprints**: +4 on the limited-use Earthquake damage (`11d6 + 4`) and +2 Athletics. Heavy hand edits sit on top.
- **What Foundry thinks.** The combat tracker's own threat tag reads **"severe" on all 32 CTX lines**. That fits an actor at **level 18** (if the party actor has 4 members) or **level 19** (if it has 5). The S11 recap's "RK DC ~48" matches a unique L18 (38 + 10). Two indirect reads, so the level is inferred, not confirmed.
- **The block predates this fight.** `sessions/session-11-08-16-2026/recap.md:128` lists identical numbers (Perception +34, Jaws +37 4d12+24, Tail +35 4d10+23, Stomp DC 41, 11d6+4) against a **level-12** party. Cody: *"the other group brought him down at level 14"* [117:32].
- **Rules note, not a tuning claim.** RAW Earthquake deals damage only through collapses and fissure falls. Applying 11d6+4 as a flat basic-Reflex burst is a table ruling.

**Per-axis level:** AC **L17.5** · attack **L19.5** · DC **L19–20** · Perception **L19** · HP **L22.7** (570 → ≥L25) · damage **≥L24**.

### Watchtower Banshee ×2: no AP entry; reads as a **Weak Monster Core Banshee (L16)** with its hands re-buffed
No `watchtower-banshee` exists in any FotRP book folder. The only banshee in the local packs is `pathfinder-monster-core/banshee.json` (L17).

| | MC Banshee (L17) | Weak (L16) would be | Table | Evidence |
|---|---|---|---|---|
| HP | 250 | 230 | **255** | header |
| AC | 39 | 37 | **38** (37+Fr1, 38 clean, 36+OG → 38) | L1241–1667 |
| Hand | +32, 4d10+14 (36) | +30, 4d10+12 | **+32, 4d10+20 (42)** | L1300, 1305 |
| Perception | +32 | +30 | **+30** ✔ | L1173 |
| Fort / Will | +25 / +32 | +23 / +30 | **+23 ✔ / +30 ✔** (Will DC 40) | L1235, 1196 |
| Wail | rank 9, 8d10, Fort DC 38 | 8d10−4, DC 36 | **8d10−4, DC 36** ✔ | L1199–1207 |
| Terrifying Touch | DC 38 / 43 on crit | 36 / 41 | **36 / 41** ✔ (35 while Frightened) | L1311, 1396, 1528 |
| Vengeful Spite | 4d10+14 | 4d10+12 | **4d10+12** ✔ | L1381 |
| Resistance | 12 all (not force, ghost touch, spirit, vitality) | — | not re-derived | — |

Every derived number matches Weak: Perception, Fort, Will, all DCs, and the −4 limited-use and −2 Spite damage. The exceptions are **Hand +32 and 4d10+20** (+2 attack and +8 damage over Weak), **HP 255** (+25 over Weak), and **AC 38** (+1).
⚠️ AC 38 might instead be Weak applied to a legacy Bestiary 2 banshee, which isn't in the local packs. **Unverified.**

**Per-axis level:** AC L15.5 · attack L16 · DC L15 · Perception L17 · HP L14 · **damage L19.3**.

### Watchtower Wraith ×2 (book L16): chassis honest, payload rebuilt
| | Book | Table | Evidence |
|---|---|---|---|
| HP | 285 | **285** | header |
| AC | 39 | **39** (A: 39 clean; 36+Cl1+OG; 37+OG → 39) | L2003–2183 |
| Spectral Hand | +32, 3d8+14 (27.5) | **+32, 4d8+19 (37)** | L1979, 2118, 2122 |
| Fort / Ref / Will | +22 / +28 / +28 | **+25** / +28 / **+31** (DC 41) | L2068, 1859, 1742 |
| Perception | +28 | +28 | L1718 |
| **Spells** | **none** (the block has no spellcasting entry) | **Howling Blizzard rank 7** (14d6, DC 38; 3-action burst, 2-action cone), **Eclipse Burst rank 7** (8d10+8d4, DC 38) | L1745–1753, 1771–1781, 1853–1864, 1905–1914 |
| Grip of Fear | **not in block** (it is the *remaster MC wraith's* ability, 6d6 DC 24 at L6) | **20d6 mental, basic Will DC 36** | L2022–2025, 2127–2130 |
| Drain Life | on Spectral Hand hits | **never applied** (the 16:11:04 crit on Clutch should have triggered it) | L2118 |

**Per-axis level:** AC L16 · attack L16 · Perception L16 · HP L15.5 · spell DC **L17** · Strike damage **L18**. The real change is the **spell payload the book block doesn't have at all** (§2).

### Tamikan (book L16): grind, payload and Quickened; honest AC and DC
| | Book | Table | Evidence |
|---|---|---|---|
| HP | 295 | **450** (×1.53) | header |
| AC | 38 | **39** (39 clean; 37+OG; 35+Fr2+OG; 36+Fr1+OG → 39) | L2294–2740 |
| Beak | +32, 3d12+13 (32.5) | **+33, 3d12+20, deadly 2d12** (39.5) | L2342, 2347 |
| Wing | +32, 3d10+13 (29.5) | **+32, 4d10+20 (42)** | L2353, 2430 |
| Tail | +30, 3d8+13 (26.5) | **+32, 3d8+20 (33.5)** | L2279, 2282 |
| Sonic Screech | **12d6**, DC 37 | **18d6**, DC 37 ✔ (35 under Frightened 2) | L2309–2314, 2541–2546 |
| Fort / Will / Reflex | +29 / +26 / +27 | **+31 / +28 / +29** (Fort DC 41, Reflex DC 39) | L2277, 2391, 2289, 2394 |
| Perception | +23 | **+28** | L2240 |
| Quickened | no | **yes** | L2308 |

The block is unchanged since S13, when the party was level 13 (`world.md:450`, S13 recap: 18d6, DC 37, AC 39, 450 HP).
**Per-axis level:** AC L16 · DC L16 · Perception L16 · attack L17 · **damage L19.3** · **HP L22**.

### Summary: per-axis level profile
| Creature | Book L | AC | Attack | DC | Perc | Strike dmg | HP | Extras |
|---|---:|---|---|---|---|---|---|---|
| Poltergeist | 14 | L14 | L14 | (L14.5, unused) | L13.5 | L13.5 | L11 | miss damage dropped |
| Shadow | 15 | L15 | L15 | (L15, unused) | L14 | **L18.6** | L14 | Translocate |
| **Jaiban** | 15 | **L17.5** | **L19.5** | **L19–20** | **L19** | **≥L24** | **L22.7** (≥25 with Ferocity) | Quickened R1–2, Ferocity +100 |
| Banshee | 17 (Weak 16) | L15.5 | L16 | L15 | L17 | **L19.3** | L14 | — |
| Wraith | 16 | L16 | L16 | **L17** | L16 | **L18** | L15.5 | **2× rank-7 AoE + Grip of Fear** |
| Tamikan | 16 | L16 | L17 | L16 | L16 | **L19.3** | **L22** | Quickened, Screech +50% |

## 2. Payload diff — what Cody added, and what never fired

**Added (in the log, not in the book block)**
- **Jaiban**: Quickened (R1–R2); **Earth-Shaking Ferocity**, run as +100 HP plus a free Quaking Stomp; Whip Tail and Stomp DCs raised to 42/41; +1 damage die and roughly +10 flat on all three Strikes.
- **Wraiths**: **Howling Blizzard ×2 and Eclipse Burst ×2, both rank 7 at DC 38**, plus Grip of Fear 20d6 ×2. **643 of the 699 damage the party took in that fight (92%) came from these non-book abilities**:
  - Blizzard: 160 + 79
  - Eclipse Burst: 153 + 193
  - Grip of Fear: 58
  - Spectral Hand, the only book attack, did just **56**.
- **Tamikan**: Quickened (the 4th action each round was R1 wing miss, R2 beak nat 1, R3 beak on Seva **44**, R4 beak nat 1, so it bought 44 damage); Screech 12d6 → 18d6; deadly 2d12 on the beak; +7 on every Strike and +1 wing die. At book dice the two Screeches would have applied ~77 less; the Strike bumps add roughly 85 more across 8 hits (rough, before intercept and shield).
- **Shadows**: Translocate (transcript only); +7 Shadow Hand damage, worth about 42 across the 5 applied hits.
- **Banshees**: Hand +6 over MC (+8 over Weak), about 60 of the 407 Hand damage. Hand +32 instead of Weak +30 flipped exactly one outcome: Clutch hit by +0 at 15:33:14 for 36.

**Printed but never fired**
- **Poltergeist**: Frighten (DC 33), Telekinetic Defense, single-target Storm (4d12+15), Telekinetic Maneuver, and **Storm miss damage** (~130 withheld).
- **Shadow**: Steal Shadow (5 Shadow Hand hits on living targets, zero Enfeebled), Darkness, Slink in Shadows.
- **Jaiban**: Trample. A second Ferocity was legal at the killing blow (Wounded 1, reaction refreshed) and was not used. The Grab route was used via a Grapple action.
- **Banshee**: Spectral Ripple (no concealment flat checks in the fight). **Vengeful Spite missed one trigger**: A critically failed against Sovael's Spiritual Torrent (L1662).
- **Wraith**: **Drain Life** (15 temp HP + drained) on the 16:11:04 crit. Wraith Spawn was not applicable.
- **Tamikan**: Claw, **Wailing Dive** (Frightened aura), Grab on the beak. Tail AoO fired twice before Roaring Applause shut off reactions.

## 3. Per-fight — grind and threat

Pools:
- **Fight 1**: 4 PCs at L14 = 824.
- **Fight 2**: 5 PCs at L14 = 1,000.
- **Fights 3–4**: L15 = 1,113.
- **Fights 5–6**: 1,053, because Seva is Drained 4 (−60 max HP).

In-combat healing counts the combat window only; Treat Wounds is excluded.

| Fight | Rds | Enemy HP cleared | Damage taken | % pool | In-combat heal | Margin | Concentration (lowest PC) |
|---|---:|---:|---:|---:|---:|---:|---|
| 1 · Poltergeists (4p) | 4 | 380 | 192 (+10 temp) | **23.3%** | 45 (Sovael Healing Nexus; no log line) | 677 | Sovael 108 · Sattva 84 · frontline **0** (low: Sovael ~68/176) |
| 2 · Shadows | 3 | 500 | 235 | **23.5%** | 79 (Heal scroll 51, Healer's Gloves 28) | 844 | Ferrok 115 · Clutch 86 (Emergency Targe negated 91) |
| 3 · **Jaiban** | 4 | **570** (470 + 100) | 469 | **42.1%** | 133 (Battle Medicine 54, Heal 79) | 777 | **Clutch 277 = 99% of his 280** (low 83/280 at L903) · Sattva 73 |
| 4 · Banshees | 5 | 510 | 561 applied (536 net of the hand-refunded Wooden Double) | **50.4%** | 229 (Nexus 45, Heal 77 + 60, potion 47) | 781 **and −60 max HP to Seva for the day** | **Seva 226 = 158% of drained max** (low ~35/143) · Sovael 172 |
| 5 · **Wraiths** | 4 | 570 (39 self-inflicted) | **699** | **66.4%** | 314 (Heal 84 + 61, Battle Medicine 69, Nexus 45, potion 55) | 668 | **Seva 197 = 138% of 143** (low **25/143**) · Clutch 172 · Ferrok 146 |
| 6 · Tamikan | 5 | 450 | 521 | **49.5%** | 362 (Battle Medicine 58/64/57, Heal scrolls 89/53, potion 41) | 894 | **Clutch 317 = 113% of max** (167 intercepted) · Ferrok 130 |
| **Session** | 25 | **2,980** | **2,677** | | **1,162** | | |

- ⚠️ The Banshees combat review's "586 applied" total doesn't match its own per-PC rows, which sum to **561**. The log deltas give 563, the extra 2 being self-inflicted persistent damage.
- ⚠️ The log's fight line ranges include post-fight Risky Surgery self-damage. The numbers above use the reviews' combat windows.

## 4. XP pricing vs. empirical threat

Thresholds:
- **4 players**: Trivial 40 · Low 60 · Moderate 80 · Severe 120 · Extreme 160.
- **5 players**: Trivial 50 · Low 80 · Moderate 100 · Severe 150 · Extreme 200.

| Fight | Book-level XP | Book verdict | Lethality axes read as | Empirical XP | Threat | Foundry tracker tag | Cody | Real verdict |
|---|---|---|---|---|---:|---|---|---|
| 1 · Poltergeists (4p, PL14) | 2 × PL+0 = **80** | Moderate | PL+0 | 60–80 | 23% | moderate | **"Low"** [72:04] | **Low–Moderate** ✔ (softer than book: miss damage dropped) |
| 2 · Shadows (5p, PL14) | 2 × PL+1 = **120** | Moderate+ | attack PL+1, damage PL+4.6 | ~120–160 | 23.5% | severe | **"Moderate"** [72:11] | **Moderate** ✔ |
| 3 · **Jaiban** (PL15) | 1 × PL+0 = **40** | **below Trivial** | AC PL+2.5, attack PL+4.5, DC PL+4–5, damage ≥PL+9, HP PL+7.7 (≥PL+10 with Ferocity) | 160 (capped PL+4) to ~200 | 42% (Clutch 99%) | **severe** | none announced | **Severe** |
| 4 · Banshees (PL15) | Weak L16: 2 × PL+1 = **120** (MC L17: 160) | Moderate+ (Severe) | attack PL+1, DC PL+0, damage PL+4.3 | ~120–160 | 50% + Drained 4 | severe | none announced | **Severe** |
| 5 · **Wraiths** (PL15) | 2 × PL+1 = **120** | Moderate+ | chassis PL+1; spell DC PL+2; AoE payload not in block | ~160+ | **66%** | severe | none announced | **Severe → Extreme** on threat |
| 6 · Tamikan (PL15) | 1 × PL+1 = **60** | **Trivial band** (50–79) | attack PL+2, damage PL+4.3, HP PL+7, Quickened | ~120–160 | 49.5% (Clutch 113%) | low | none announced | **Severe** |

- **What Cody awarded.** **140 XP for Poltergeists (Low, 60) + Shadows (Moderate, 80)**, plus **40** for finding every team base [72:04–72:24]. That put the party at "20 into level 15" [72:49].
  - RAW: the Poltergeists were exactly 80 (Moderate) for four PCs. Whether the Shadows award should scale for five PCs is a minor ambiguity.
  - **No XP was announced for fights 3–6.** Cody said level 15 was Bonmou's cap and that the campaign **switches back to milestone** now that Bonmou is done [221:51–222:06]. So the four hardest fights were effectively unpriced.
- **Foundry's tracker tags** are consistent with book levels for every watchtower and Tamikan, and with Weak L16 banshees, *if* its party actor counts 4 members. Under that reading, **Jaiban's actor is ~level 18**. ⚠️ If it counts 5 members, every creature reads +1 (Jaiban L19). The ambiguity doesn't change the conclusion that Jaiban isn't level 15.
- **Jaiban cannot be priced on the XP table.** HP and damage read beyond PL+4, the table's cap. The extrapolated ~200 for PL+5 (carried over from S14) is not RAW.

## 5. Crit-fail counterfactual — the big area saves

Method: per PC, the natural die that critically fails (≤ DC−10−mod, plus a nat 1 that degrades a failure), then P(at least one critical failure).
- Modifiers are from the SAVE lines: Reflex Sovael +25 (+27 while Overflowing), Seva +26, Ferrok +24 (with Bulwark), Clutch +26 (+24 without Reflexive Shield), Sattva +30.
- **Sattva cannot critically fail Reflex.** Improved Evasion converted his nat 1 at L1862 into a plain failure.
- Fort juggernaut-style success→crit upgrades (Sattva, Clutch, Ferrok, all observed) don't touch the crit-fail line. No Fort crit-fail protection was observed on anyone.

### Quaking Stomp: DC 41 table vs 36 (Jaiban's printed DCs)
| Cast | Targets (crit-fails on) | P(≥1 crit fail) table | book |
|---|---|---:|---:|
| R1 (L751–756) | Seva nat ≤5 (25%) · Sovael ≤6 (30%) · Clutch ≤5 (25%) | **61%** | 14% |
| R4 (Ferocity, L1048–1053) | Sovael ≤4 (20%) · Clutch ≤7 (35%) · Sattva immune | **48%** | 15% |
| Both casts | | **80%** | 27% |
| If all five had been in the burst | Ferrok ≤7 (35%) | 74% per cast | 23% |

**Actual: zero critical failures in either cast**, the ~20% branch. At S11, against the same DC 41, **Ferrok and Sovael both critically failed (96 and 84)**. A crit-failed Stomp averages **85**.
The DC bump's realised cost this session was about **37 HP**: Clutch's 40 and Sattva's 37 in R4 would have been successes at DC 36.

### Whip Tail (Fort, Stunned): DC 42 vs 36
Clutch crit-fails on nat ≤4 (20%), Ferrok ≤5 (25%), Seva ≤5 (25%): **55% vs 14%**.
Actual: Ferrok 33 and Seva 34 **still fail at DC 36**, so the +6 changed no realised outcome. Cody also corrected the targets so Clutch wasn't affected.

### Sonic Screech: DC 37 table = DC 37 book
- R1: 10% / 10%.
- R3: 14% at table DC 35 (Clutch's Frightened 2), versus 27% at an unfrightened 37.
- All five in the line: 31% / 31%.
- **The DC was not the lever; the dice were.** A crit fail is 126 average at 18d6 versus 84 at the book's 12d6.

### Wraith AoEs: DC 38 table. The "book" is **no area save at all**; the DC 36 column is the book block's native DC (Drain Life).
| Cast | Table DC | P(≥1 crit fail) table | at DC 36 |
|---|---:|---:|---:|
| B Howling Blizzard burst R1 (all 5) | 38 | **45%** (Ferrok ≤4, Sovael ≤3, Seva/Clutch ≤2) | 23% |
| A Eclipse Burst R1 | **36** (Frightened 2 from Clutch's nat-20 Battle Cry, L1742) | 23% | 23% (would be **45%** at 38) |
| B Eclipse Burst R2 (all 5) | 38 | **38%** | 23% |
| A Blizzard cone R2 (4 targets) | 37 (Frightened 1) | 14% | 14% |
| All four casts | | **77%** (84% without Clutch's Frightened) | 61% |

**Actual: zero critical failures.** The book-block wraith has **no area save, so the true book counterfactual is 0% and ~56 damage total.**

### Banshee Wails of the Damned (Fort, rank 9): Weak DC 36 vs MC DC 38
Here the table was **easier** than the Monster Core block.
| Cast | Table | MC DC 38 |
|---|---:|---:|
| A R1 (all 5) | 23% | 31% |
| B R1 (DC 35 via Frightened 1; Seva Drained 4 → +23, crit-fails ≤2) | 27% | **45%** |
| A R5 (Seva +23) | 31% | 39% |

**Actual: one critical failure.** Seva rolled a nat 2 = 25 at L1286, rerolled, and Cody ruled it a plain failure, so no extra Drain. The Weak template's −2 lowered the party's crit-fail exposure by 8–18 points per Wail.

## 6. Damage contribution

These are applied HP deltas taken from the combat reviews. Every fight reconciles to the enemies' exact max HP (380 / 500 / 570 / 510 / 570 / 450). Jaiban's pool is 470 plus the 100 HP that Cody set by hand on Earth-Shaking Ferocity.

| Fight | Ferrok | Clutch | Sovael | Sattva | Seva | other | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 · Poltergeists (Seva absent) | 99 | 74 | 51 *(4th of 4)* | **156** | — | | 380 |
| 2 · Shadows | 126 | **150** | **150** | 0 | 74 | | 500 |
| 3 · Jaiban | **289** | 130 | 40 *(tied last)* | 40 | 71 | | 570 |
| 4 · Banshees | **237** | 56 | 116 | 46 | 55 | | 510 |
| 5 · Wraiths | **155** | 117 | 64 *(5th)* | 118 | 77 | 39 (Wraith B hit itself) | 570 |
| 6 · Tamikan | 101 | 107 | 32 *(5th)* | 75 | **135** | | 450 |
| **Session** | **1,007** | **634** | **453** | **435** | **412** | 39 | 2,980 |
| **Share** | **33.8%** | **21.3%** | **15.2%** | **14.6%** | **13.8%** | 1.3% | |

Three notes:
- **Sattva's shared Hunt Prey precision** (+52 on Jaiban) is booked under Ferrok and Clutch, whose crits doubled it. Credited to Sattva instead, he has 487 (16.3%).
- **Sovael's 3rd place overall comes almost entirely from vitality damage against undead.**
  - Shadows plus Banshees account for 266 of his 453.
  - Against the two non-undead bosses (Jaiban and Tamikan) he dealt **72 of 1,020 (7%)**.
  - Of his 40 on Jaiban, **1 HP was the Fire Ray**. The "100" was narrated and never applied, because Jaiban was at 1 HP. The rest was 16 Foretell Harm plus 23 burning ground.
- **Kill shots:** Sovael killed Tamikan (Fire Ray, L2756) and took Jaiban's first "life" (Sure Strike Fire Ray at 1 HP, L1033). He also set up two kills that others finished:
  - Spiritual Torrent put Banshee A at 5 HP for Seva.
  - Spiritual Torrent did 70 to Shadow A. Clutch's kill would have happened anyway: A would have had 72 left, and the bite rolled 74.

### Actions and attack rolls

| PC | d20 attack rolls | Other damaging uses | Damage / attack roll | Damage / damaging use |
|---|---:|---|---:|---:|
| Ferrok | 26 | 7 Force Fang (no roll) | 38.7 | 30.5 |
| Clutch | 27 (incl. Armored Counterattacks) | + 14 maneuvers / Demoralizes | 23.5 | 23.5 |
| Seva | 22 | — | 18.7 | 18.7 |
| Sattva | 46 | — | 9.5 (10.6 with shared precision) | 9.5 |
| **Sovael** | **2** (both Fire Ray) | 11 save spells: Dirge, Spirit Blast, Vitality Lash ×5, 3-action Heal, Spiritual Torrent ×3; + 2 free Foretell Harms | — | **34.8** |

Sovael spent roughly **29 actions on offense** (15.6 damage per action) and roughly **40 on support and control**:
- Anthem ×7
- Demoralize ×4
- Benediction
- Synesthesia ×2
- True Target
- Earthbind ×2
- Roaring Applause plus 3 sustains
- Shield ×2
- Healing Nexus ×3
- Ally Heals ×4

Action counts come from the spell cards and are approximate. Retrieval-belt interacts and Strides are not counted.

## 7. What the control package bought

### Validation first: Foundry's `MM :: ESSENTIAL` tags match my Tier-1 recomputation 23/23

| Party-supplied modifier | MM ESSENTIAL tags (roll / dc side) | My Tier-1 flips | Outcome-changing (crit-miss→miss discounted) |
|---|---|---:|---:|
| Off-Guard −2 | 11 (dc) — L1010, 1345, 1375, 1513, 1605, 1991, 2041, 2143, 2532, 2683, 2761 | 11 | **8** |
| Courageous Anthem +1 | 6 (roll) — L548, 844, 1332, 1376, 1606, 2144 | 6 | **2** |
| Clumsy −3 / −1 | 4 (dc) — L843, 866, 1009, 1957 | 4 | **3** |
| Frightened −2 | 1 (dc) — L2531 | 1 | **1** |
| Whispers of Weakness +2 | 1 (roll) — L2762 | 1 | **1** |

Excluded from this table:
- **The roller's own feats.** Risky Surgery L1162, Great Kholo L1958 and Intimidating Prowess L2521 are ESSENTIAL but are not party control.
- **Frightened on a PC's AC** (L1440, L1445). That helped the enemy, and only moved a crit-miss to a miss.
- **Enemy-roll `DETRIMENTAL` tags.** These are *joint*, and they include the enemy's own Telekinetic Storm −2 (L231–233, L242–244), so they are not Tier-1 marginals.

**Annotation coverage:**
- Anthem is on 95 of 123 party attack rolls (77%). The gaps are real lapses, not missing annotations:
  - Poltergeists: 3 PCs acted before Sovael, so only 7 of 17 rolls had it.
  - Tamikan R4–R5: Sovael was sustaining Applause instead, so the Anthem had lapsed.
- Some party-caused enemy penalty is on 85 of 123 attack rolls.
- 34 of 66 enemy attacks carry a party penalty.
- **Benediction never appears as a modifier.** It is only visible in the printed PC AC, on three attacks: L766 on Clutch, L1516 on Sovael, L1536 on Seva. All three were crits regardless (nat 17 by +10, nat 20, nat 20). **Benediction flipped 0.**

**Sanity check on Anthem.** It flipped only 2 rolls at the hit/crit boundaries, against roughly 9 expected from 95 annotated rolls. The margin distribution explains it: only 2 rolls landed at exactly +0, and 1 at +10 (a nat 20). The other 4 Anthem flips were at the −10 boundary, which buys nothing. MM's independent count matches, so the low number is dice clustering, not a parser bug. Extrapolated to full coverage, it is about 2.6.

### Tier 2 — the whole package, all four roll types

| Roll type | n | Package flips | Outcome-changing |
|---|---:|---|---:|
| **Party attacks + maneuvers vs enemies** | 143 (123 attacks, 20 skill checks) | 14 miss→hit (incl. one Trip), 6 hit→crit, 9 crit-miss→miss (discounted) | **20** |
| **Enemy attacks vs PCs** | 66 | 5 crit→hit, 5 hit→miss, 1 miss→crit-miss (discounted). 3 of the 10 are Clutch's *own* Sturdy Shield +2 (L343, L518, L2342) | **7** party-control (+3 own shield) |
| **Enemy saves vs PC spells** | 17 (+ Wraith B's save vs its own Eclipse Burst) | 1 fail→crit-fail | **1** |
| **PC saves vs enemy effects** (defensive) | 60 | Anthem 1, enemy-Frightened DC 2, Overflowing 1 (self) | **4** |
| **Enemy skill checks** | 1 (Jaiban Grapple L912) | no party modifiers present | 0 |

- The 20 decisive offensive flips were won by an **average margin of 2.7 points**, and the average package on those rolls was **3.9 points**.
- **Share of package points:**

| Source | Share |
|---|---:|
| Off-guard | 49% |
| **Anthem** | **22%** |
| Synesthesia clumsy | 15% |
| Seva's rune clumsy | 6% |
| Frightened | 5% |
| WoW | 3% |

- **Tier 3 — participation.** Anthem was in **17 of the 20** decisive flips, off-guard in 19, and Synesthesia in 4.

### Tier 1 — by source, outcome-changing only, all roll types

| Source | Flips | Rolls, and what each bought |
|---|---:|---|
| **Clutch — Taunt** | **7** (+2 joint) | Off-guard made two crits (Ferrok's Jaiban Ignition L1004, +~99; Ferrok's Banshee B Ignition L1341, +~73). It also made four hits: **Banshee B kill** L1601 (63), Sattva 31 L2036, Clutch's grab L2527, **Tamikan kill** L2756. Taunt −1 turned Banshee B's crit on Ferrok into a hit (L1384, ~42 saved). Jointly with another penalty, it turned two hits into misses (Wraith A → Seva L2015, with Seva's Clumsy; Tamikan → Sovael L2714, with Frightened) |
| **Clutch — Battle Cry / Demoralize (Frightened)** | **6** | Frightened on Poltergeist A turned two nat-19 crits into hits (L157 Sattva, L170 Sovael, ~48 saved). The Tamikan crit-Demoralize turned a beak crit on Sovael into a hit (L2568, intercepted) and made the Combat Grab land (L2527). A frightened caster also lowered DCs on Clutch's own saves: Eclipse Burst DC 36 fail→success (L1781, ~43 saved) and Blizzard cone DC 37 crit-fail→fail (L1913, 42 saved) |
| **Clutch — Trip / Grab** | **3** | Off-guard gave **Wraith B kill** L1985 (55) and Sattva 33 L2139. Prone turned Wraith B's Reactive Strike on Ferrok into a miss (L1979, ~37 saved) |
| **Sovael — Synesthesia (Clumsy 3)** | **2** | Two Ferrok hits became crits: L862 (True Target sword, +~46) and L1004 (Ignition, +~99, shared with Taunt). A third flip was crit-miss→miss (L839), worth nothing |
| **Sovael — Courageous Anthem** | **3** | **Banshee B kill** (L1601, hit by +0, 63) and Sattva 33 on Wraith A (L2139) on attacks. **Clutch's Terrifying Touch save, crit-fail→fail** (L1435, nat 2 = 27 vs DC 36): Anthem kept Clutch out of **Stunned 4**. Anthem applies to saves against fear effects by RAW |
| **Sovael — Demoralize → Spiritual Torrent** | **1** | Shadow A fail→crit-fail (L674: nat 4, 24 vs DC 34; 25 without) = **+35** |
| **Sovael — Whispers of Weakness** | **1** | **Tamikan kill** (L2756, Fire Ray hit by +0; both WoW and off-guard ESSENTIAL) |
| **Sovael — Overflowing** (self, from Absorb Magic) | **1** | Free Quaking Stomp on Sovael, crit-fail→fail (L1051) = **49 not taken** |
| Seva — Clumsy 1 from her rune | 1 (+1 joint) | Clutch's Trip on Wraith B, success by +0 (L1952). That prone is where Ferrok's kill-hit off-guard came from |
| Flanking | 0 | Participated in 3 Shadows crits, but never decisive alone |
| Benediction (Sovael R1 Jaiban, Sattva R2 Banshees) | 0 | See above |

**Totals:**
- **Clutch-supplied: 16 outcome-changing flips, plus 3 from his own shield.** He is the session's control engine by a wide margin.
- **Sovael-supplied: 7, plus 1 self.** Offensive value is roughly **+308 damage and two kills**. Defensively he saved Clutch from **Stunned 4** and kept 49 off himself.
- **The per-source counts overlap.** A roll with two ESSENTIAL sources is counted once under each: L1004 is both Taunt and Synesthesia, L2527 is both Taunt and Frightened, L2756 is both Taunt and WoW. So per-source totals do not add up to distinct rolls.

### True Target on Jaiban (L805, one action)

The export prints only the *kept* die of a `2d20kh`, so the counterfactual has to be probabilistic. Given a kept die m, the single-die roll is m with probability m/(2m−1), and each lower face has probability 1/(2m−1).

| Attacker | Kept | Result | Without fortune | Expected cost of no TT |
|---|---|---|---|---|
| Seva L825 | nat 16, +7 | hit, 14 + bleed | 26% miss | ~4 |
| Sattva L835 | nat 6, −3 | miss | still a miss | 0 |
| Clutch L851 | **nat 20**, +13 | crit 48 (+26 precision) | 59% crit / 26% hit / 15% miss | ~21 |
| Ferrok L862 | nat 19, +12 | crit 66 (+26 precision) | 57% crit / 27% hit / 16% miss | ~27 |

True Target delivered 3 hits in 4 attacks (2 crits), 114 applied plus 52 in precision riders. **About 50 damage and about 1.1 outcome changes are attributable to the fortune itself.** The rest was the dice plus Clumsy 3. Ferrok's crit also needed the Synesthesia clumsy, which was ESSENTIAL at L866.

**Sure Strike → Fire Ray** (L1033): kept nat 20 vs Reflex DC 39 at +27. On a single die that is 51% crit / 21% hit / **28% miss**. Jaiban was at 1 HP, so what Sure Strike bought was **+28 percentage points of dropping it this action**. Clumsy 3 was *not* applied to that Reflex DC (COND shows no clumsy on L1033). It made no difference, since a nat 20 at 47 is a crit either way.

### What the two Synesthesias bought (4 actions, 2 scrolls)

**Saves:**
- #1: Jaiban succeeded (L804, nat 7 = 39 vs 37; it needed a 5). Effect lasted 1 round, L802 → expired around L880.
- #2: Jaiban failed (L888, nat 2 = 34). Effect lasted 1 minute.

**Clumsy 3:**
- 2 real flips, both of them Ferrok crits: about **+145 damage**.
- A share of 2 more package hits: Seva 17 (L947), Sattva 40 (L975).
- 1 worthless crit-miss→miss.
- Jaiban never rolled a Reflex save while Clumsy.

**Flat checks.** These render as prose lines. There were **5**:

| Line | How rolled | Result |
|---|---|---|
| L916 | manual | success |
| L922 | manual (Foot crit on Ferrok) | success |
| L1081 | automated (Jaws on Clutch, nat 1 anyway) | success |
| L1085 | automated (Tail on Sattva, 49) | success |
| L1094 | automated (Foot on Seva) | **Failure** |

**The one failure cancelled nothing.** The Foot had already missed by 4.

**Checks that were never rolled:**
- **Jaiban's R2 Jaws crit on Clutch (112, L816)** and its R3 Jaws on Ferrok (L890) had no concealment check, though Synesthesia was active for both. Each check had a 5% chance to cancel.
- **The free Quaking Stomp** (Earthquake, concentrate, L1045) was cast while the effect was missing from the token. COND at L1046 has no clumsy or dazzled, so its DC 5 check was skipped.
- In expectation, the unrolled checks were worth roughly 5–10 HP.

**The luck angle:** Synesthesia #2's 1-minute duration was irrelevant. Sovael acts first in initiative, so a *successful* save would still have covered Ferrok's R3 Ignition crit.

### Roaring Applause + Earthbind vs Tamikan — counted in actions

**Tamikan's actions.** Tamikan (Quickened) took **16 actions over 4 turns and lost none**:

| Round | Actions |
|---|---|
| R1 | Screech (2), beak, wing |
| R2 | **Stand**, Flying Strafe (2), beak |
| R3 | Screech (2), beak, beak |
| R4 | **Stand**, Strafe (2), beak |

- **Both Stands came from Clutch's Trips**, not Sovael. Each Stand provoked Ferrok and Seva: 0 in R2, 38 in R4.
- **Neither spell cost it an action.** Applause *succeeded* (L2391, nat 11 = 40 vs 37, needed 8; 65% odds), so there was no Slowed. Earthbind has no action tax.

**Reactions.** Roaring Applause bought these:
- **Before it:** Tamikan's tail Reactive Strike (L2278: +32, reach 20 ft) triggers on *any* move, manipulate or ranged attack in reach. In R1 it hit Clutch for **26** (L2279) and Ferrok for **28** (L2358).
- **After it:** zero reactions from R2 to the kill.
- **Denied reactions:** trigger events in reach were near-certain in R2, R3 and R4:
  - potion and belt interacts
  - two Goring Charges
  - Battle Medicine ×2
  - a regrip
  - Sattva's ranged shots

  That is **3 denied reactions for certain, 4 if Sovael was within 20 ft in R5**. At +32 vs AC ~37 a tail averages ~37 (50% hit, 30% crit), so **≈110–150 HP prevented**. A crit tail on a manipulate action would also have disrupted it: heal scrolls, Battle Medicine, Earthbind #2.

**Positioning.** This is what Earthbind bought:
- **#1 failed** (L2277, nat 3). Tamikan was grounded and could not Fly through its R1 turn: no Flying Strafe, and it stayed in reach for Seva's 44 Spellstrike.
- **#2 succeeded** (L2485, nat 11). It only fell, but that fall fired Seva's readied Strike (15, L2487). Clutch's Combat Grab then pinned Tamikan on the ground (L2527).
- **R3, the grounded round, was the party's biggest:**

| Round | Damage | Tamikan's position |
|---|---:|---|
| R1 | 107 | grounded |
| R2 | 33 | stood, then Strafed back into the air |
| R3 | **163** | grounded |
| R4 | 115 | stood, then Strafed back into the air |
| R5 | 32 | airborne |

- On a flat-10 save, Earthbind #1 would have succeeded: a fall with no lock, letting Tamikan Strafe in R1.

### Demoralize → Spiritual Torrent crit-fail flips

- **Shadow A 70: yes.** L674 was nat 4 + 21 − 1 (Frightened 1 from Sovael's Demoralize, success by +1 at L666) = 24, a crit-fail. It would be 25 without, a plain fail. **+35.**
- **Banshee A 66: no.** L1662 was nat 4 + 23 = 27 vs DC 37, which is exactly −10. That is a crit-fail on the dice alone, with no Frightened in the breakdown. The R1 Demoralize (L1229) had long decayed.

## 8. Healing — in-combat vs. downtime

The combat window runs from first initiative to the kill. Treat Wounds is excluded by name. Healing Nexus has no heal line; its 3 × 45 are reconstructed from HP arithmetic (cards at L253, L1318, L1813).

| Fight | Sovael | Sattva | Seva | Clutch | Ferrok | Total |
|---|---:|---:|---:|---:|---:|---:|
| Poltergeists | 45 (Nexus, self) | — | — | — | — | 45 |
| Shadows | 51 (3-action r5 Heal scroll: Clutch/Ferrok/Sattva 17 each; it also burned both shadows for 51) | 28 (Healer's Gloves → Ferrok) | — | — | — | 79 |
| Jaiban | 0 | 79 (Heal → Clutch) | 54 (Battle Medicine → Clutch) | — | — | 133 |
| Banshees | 182 (Nexus 45 self; r6 Heal scroll 77 → Seva; r5 Heal 60 → Seva) | — | 47 (potion, self) | — | — | 229 |
| Wraiths | 106 (Nexus 45 self; r5 Heal scroll 61 → Ferrok) | 153 (r7 Heal scroll 84 → Seva; Battle Medicine 69 → Clutch) | 55 (potion, self) | — | — | 314 |
| Tamikan | 53 (r4 Heal scroll → Clutch) | 146 (Battle Medicine 57, r7 Heal scroll 89 → Clutch) | 58 (Battle Medicine → Clutch) | 64 (Doctor's Visitation → Ferrok) | 41 (potion, self) | 362 |
| **Total** | **437** | **406** | **214** | **64** | **41** | **1,162** |

**Ranking:**
- Sovael is **#1 in-combat healer (437)**, but 135 of that is self-healing (Healing Nexus).
- **On ally healing, Sattva leads, 406 to 302.**
- By method:
  - Sovael: Heal scrolls/spells 302, Nexus 135.
  - Sattva: Heal scrolls 252, Battle Medicine 126, gloves 28.
  - Seva: Battle Medicine 112, potions 102.

**Recipients.** Triage was correct:

| Recipient | Healed | Damage taken |
|---|---:|---:|
| **Clutch** | **476** | 935 |
| **Seva** | **323** | 486 |
| Ferrok | 211 | 521 |
| Sovael | 135 | 419 net |
| Sattva | 17 | 291 |

The tank and the focus-fire target (Seva, while Drained 4) received 69% of all in-combat healing.

**Downtime** (not comparable), about 1,626:
- **Sattva's Treat Wounds / Risky Surgery: ~1,334 effective** (L40–45, L378–397, L1136–1168, L1689–1699, L2218–2234, L2778–2789).
- Aeon Stones ~213 (nominal).
- Between-fight potions 64.
- Sovael's two rank-1 Heals 15.

## 9. Roll analysis and save luck

Player d20s only. The first die is used on hero-point rerolls. The 5 `2d20kh` fortune rolls are excluded, because the export shows only the kept die. PC saves come from the `SAVE ::` lines.

| PC | Attack n · mean · z | Skill n · mean · z | Save n · mean · z | Non-attack (skill+save) z | nat 20 / nat 1 |
|---|---|---|---|---|---|
| Ferrok | 26 · 9.85 · **−0.58** | 6 · 13.50 · +1.27 | 12 · 12.42 · +1.15 | 18 · **+1.68** | 2 / 1 |
| Clutch | 26 · 12.15 · **+1.46** | 22 · 12.14 · +1.33 | 14 · 11.21 · +0.46 | 36 · +1.33 | 6 / 2 |
| Sattva | 46 · 9.37 · **−1.33** | 18 · 12.28 · +1.31 | 9 · 7.67 · −1.47 | 27 · +0.22 | 1 / 3 |
| Seva | 21 · 11.52 · +0.81 | 7 · 13.29 · +1.28 | 14 · 8.57 · −1.25 | 21 · −0.28 | 3 / 1 |
| **Sovael** | **1** · 9.00 · — | 17 · 9.24 · **−0.90** | 11 · 13.55 · **+1.75** | 28 · +0.39 | 1 / 0 |
| **Party** | 120 · 10.45 · −0.09 | 70 · 11.70 · +1.74 | 60 · 10.73 · +0.31 | 130 · +1.49 | 13 / 7 |

- **Party overall z = +1.01** across 250 dice: ordinary.
- **Sattva had the split personality:** cold on 46 bow shots (z −1.33, including 0 for 8 vs the Shadows), warm on skills.
- **Ferrok was the reverse:** below average on attacks, and still did a third of the session's damage.
- **Sovael made one un-fortuned attack roll all session.** His skill dice ran a little cold (Performance and Demoralize); his saves ran warm, including the nat-20 Earthquake save.

**Hero points spent (RAW) vs fortune:**

| PC | Hero points | Detail | Fortune |
|---|---|---|---|
| Sattva | 2 | L788 miss→miss; L2294 miss→**hit, 37** | — |
| Ferrok | 2 | L798 miss→miss; R5 Wail save ([152:42], only the final roll is logged) | — |
| Clutch | 2 (+1 unconfirmed) | L989 Escape fail→fail; L2289 Grapple fail→fail. Possible R1 Earthquake save [97:13] | — |
| Seva | 1–2 (unconfirmed) | L2615 miss→**hit, 53**; L2747 miss→miss. The Banshee Wail-B reroll was ruled "not a hero point" | — |
| **Sovael** | **0** | — | Sure Strike ×1 (self); True Target ×4 given to allies |

### Save-luck counterfactual — Sovael's save effects (the only PC save effects this session)

Enemy modifier as rolled, including party penalties. "Needed" is the natural die the enemy needed to succeed.

| # | Effect → target | DC | Mod | Needed | Enemy odds | Nat | Result | Flat-10 result | Δ damage / effect |
|---|---|---:|---:|---:|---:|---:|---|---|---|
| 1 | Dirge → Poltergeist B (L151) | 34 | +24 | 10 | 55% | 14 | S | S | 0 (Foundry applied 0; should be ~9) |
| 2 | Spirit Blast → Poltergeist B (L259) | 34 | +21 | 13 | 40% | 13 | S | F | **+33** |
| 3 | Vitality Lash → Poltergeist A (L335) | 34 | +22 | 12 | 45% | 9 | F | F | 0 |
| 4 | Vitality Lash → Shadow B (L487) | 34 | +21 | 13 | 40% | 5 | F | F | 0 |
| 5 | Heal → Shadow A (L559) | 34 | +21 | 13 | 40% | 7 | F | F | 0 |
| 6 | Heal → Shadow B (L560) | 34 | +21 | 13 | 40% | **1** | cF | F | −17 |
| 7 | Torrent → Shadow A (L674) | 34 | +20 | 14 | 35% | 4 | cF | F | −35 |
| 8 | Synesthesia #1 → Jaiban (L804) | 37 | +32 | 5 | 80% | 7 | S | S | same (1 round) |
| 9 | Synesthesia #2 → Jaiban (L888) | 37 | +32 | 5 | 80% | **2** | F | S | 1 round, not 1 minute (no measurable loss) |
| 10 | Vitality Lash → Banshee A (L1235) | 37 | +22 | 15 | 30% | 10 | F | F | 0 |
| 11 | Vitality Lash → Banshee B (L1454) | 37 | +23 | 14 | 35% | 14 | S | F | **+18** |
| 12 | Torrent → Banshee A (L1662) | 37 | +23 | 14 | 35% | 4 | cF | F | −33 |
| 13 | Torrent → Wraith A (L2068) | 37 | +25 | 12 | 45% | 9 | F | F | 0 |
| 14 | Vitality Lash → Wraith A (L2158) | 37 | +26 | 11 | 50% | 16 | S | F | **+15** |
| 15 | Earthbind #1 → Tamikan (L2277) | 37 | +32 | 5 | 80% | **3** | F | S | lose the R1 flight lock |
| 16 | Roaring Applause → Tamikan (L2391) | 37 | +29 | 8 | 65% | 11 | S | S | same |
| 17 | Earthbind #2 → Tamikan (L2485) | 37 | +32 | 5 | 80% | 11 | S | S | same |

- **Observed mean natural: 8.24 over n = 17. z = −1.62, one-tailed p ≈ 0.05.** Enemies rolled *below* average against Sovael's DCs.
- Expected successes were 8.75; there were 7.
- Re-run at a flat 10, his save damage would be **19 lower** (+66 from saves they made, −85 from their crit-fails).
- The two long-odds control saves (80% for the enemy each) both landed as failures: Synesthesia #2 and Earthbind #1.
- **No luck grievance this session. The dice leaned his way.**
- The structural point from S14 still holds. Synesthesia and Earthbind were each **20% shots** against Jaiban's Will and Tamikan's Fortitude. Earthbind's defense is fixed; Synesthesia's target was the only choice.

## 10. Judging Sovael fairly — five axes

| Axis | Result |
|---|---|
| **Direct damage** | **453 (15.2%) — 3rd of 5**, but last or tied-last in Poltergeists, Jaiban, Wraiths and Tamikan. 266 of it was vitality vs undead; **72 of 1,020 (7%) against the two living bosses**. The Jaiban "100" was 1 HP |
| **Damage owed to luck** | **None owed to him.** Enemies rolled nat 8.24 (z −1.62) against his DCs; a flat-10 world costs him ~19 damage |
| **Control flips** | **7 outcome-changing + 1 self.** That breaks down as Synesthesia 2 crits (+~145), Anthem 2 hits (incl. the Banshee B kill), Anthem's fear save keeping Clutch out of Stunned 4, WoW on the Tamikan kill, and Demoralize → Torrent +35. Add ~1.1 expected from True Target (~50 damage) and a +28-point chance on the Jaiban drop from Sure Strike. Anthem was in 17 of 20 decisive party flips (22% of package points). **Clutch supplied 16 (+3 own shield) and is clearly #1**; Sovael is #2. Roaring Applause bought no enemy actions but ~3–4 denied tail Reactive Strikes (~110–150 HP), and Earthbind bought the grounded rounds where R3's 163 happened |
| **In-combat healing** | **437, #1, but 135 is self-Nexus.** Ally healing 302, #2 behind Sattva's 406. It landed where needed: Seva 137, Ferrok 78, Clutch 70 |
| **Actions spent** | **2 attack rolls** and 13 damaging uses (34.8 per use, about the same as Ferrok's 30.5), out of roughly 70 tracked actions. About 40 went to Anthem, Heals, Synesthesia, Earthbind, Applause, Benediction and True Target |

**The honest read:**
- **The damage column is not a support caster's night, and it flatters him this time.** The 15% is mostly the undead matchup: vitality against Shadows and Banshees. Against the two living bosses he was a 7% damage dealer, and one of his two "kills" was a 1-HP tap.
- **What he converted was precise, not voluminous.** Five of his seven flips changed a result someone will remember:
  - the Tamikan kill
  - the Banshee B kill
  - two Ferrok crits worth ~145 on Jaiban
  - a tank who didn't lose a turn to Stunned 4
- **Some of his action spend bought little or nothing measurable:**
  - Benediction: 0 flips.
  - Synesthesia #2's minute-long duration: nothing beyond what a success would have given.
  - Applause's success tier: no Slowed.
  - Earthbind #2: fall only, no lock.
- **The controller who bent this session's math most was Clutch.**

## Caveats

**Creature side**
- The local FotRP pack is legacy (`remaster: false`), so ±1–2 deltas may be module version drift.
- Banshee identity is inferred from template fingerprints; there is no AP JSON. AC 38 is off Weak-MC by 1.
- Jaiban's actor level (~18) comes from the Foundry threat tag plus the S11 RK-DC note, which is indirect. The Elite reading rests on two fingerprints only.
- Enemy attack rolls show their modifiers in this export, but the DM's hand edits (Poltergeist B +32) show that printed modifiers can be overridden.
- The Tamikan and Shadow "book-dice" damage deltas are averages, before intercepts, shields and resistances.
- The Healing Nexus 45 in fight 1 has no log line; it comes from the transcript plus HP arithmetic.
- The XP award scaling for five players, and whether RAW Earthquake damages creatures at all, are rules readings, not measurements.

**Party side**
- **Reroll CTX fields** (`nat`/`delta`) describe the *original* roll. Outcomes were recomputed from the formula header's kept total. Without this, L2294 and L2615 show up as false Anthem/off-guard flips.
- **`2d20kh` lines** carry only the kept die, so True Target and Sure Strike value is an expectation, not a count.
- **Off-guard source** (Taunt vs flanking vs trip/grab) is inferred from the `COND` target list and the flanking flag. Where Taunt and flanking overlap, credit is shared.
- **Status penalties don't stack.** Frightened, Clumsy and Sickened were taken as the max, and off-guard (circumstance) was added on top. Every creature's base AC (`ctx dc + conditions`) came out stable. The only outliers were +1 cover on Sattva's shots, Seva's Ray of Frost and the Tamikan Fire Ray.
- **Cody's hand-set `Modifier +32`** on Poltergeist B's R2 storm cancels the listed Taunt and Frightened (L226–244). No outcome changed either way.
- **Enemy DC reductions** from Frightened on PC saves were identified by hand: DC 35/36/37 against known base DCs. Wail B's lowered DC flipped nothing, because Juggernaut-style upgrades absorbed it.
- **Healing Nexus** (135) and **Wooden Double's 25 refund** have no heal lines. Nexus is counted as healing from HP arithmetic; Wooden Double is excluded as mitigation.
- **Dirge of Remembrance** applied 0 on a success. RAW it should be ~9, bypassing resistance. The ledger was left as applied.
- **Damage-prevented figures** for defensive flips are estimates from the rolled hit or crit damage.
- **Unconfirmed hero points:** Clutch R1 Earthquake save and Seva's two Tamikan rerolls. Ferrok's Banshee save is confirmed by transcript but absent from the log.
