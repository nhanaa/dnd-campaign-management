# Encounter Analysis — Session 14 (2026-09-06)

**Party**: Sovael 176 · Ferrok 196 · Sattva 204 · Clutch 248 · Seva 176 — **pool exactly 1,000 HP**, which makes every threat figure below read directly as a percentage.
**Source**: `rolls-backup.txt` (single session, no double-paste), cross-checked against the Fists of the Ruby Phoenix pack JSONs and Monster Core.

---

## Headline

**Every creature this session hit harder than the book says, and all but one hit more accurately.** The defensive chassis (HP, AC) was left honest on the two rival teams and inflated on the three bosses — but **the offensive payload was rebuilt on every creature type**, including the two teams that look untouched on paper.

And **the XP budget is wrong about the hardest fight of the night by a factor of three.** Koto Zekora prices as *Moderate* on paper and took **91.6% of the party's total hit points** — because the budget prices level, and what changed was everything else: **+205 HP, +6 spell DC, and a rank-9 spell that does not appear on her sheet at any rank.** See §3b.

---

## 0. The payload diff — checked last, and it changes the headline

The skill's own warning: *"a GM can leave the defensive chassis honest (or even weaken it) while rebuilding the offense — diff the printed Strike damage dice against what actually appeared in the log."* An earlier draft checked HP and AC, found the rival teams at 1.00×, and declared them "as printed." **That was wrong. Their weapons were rebuilt.**

| Creature | Attack: book → run | Δ | Reads as | Damage: book → run | Δ avg |
|---|---|---:|---|---|---:|
| Pale Sun **Archer** ×2 (L13) | +27 → **+28** | +1 | L13–14 | 3d8+7 → **3d8+11 + 1d6 elec** | **+37%** |
| Pale Sun **Swordsman** ×2 (L13) | +27 → **+29** | **+2** | **L14** | Scimitar 2d6+10 → **Katana 3d10+13** | **+74%** |
| Trembling Meteor Archer | *(no book entry)* | — | L13–14 | → 3d8+11 + 1d6 elec | — |
| Trembling Meteor Monk | *(no book entry)* | — | L13 | → 3d6+15 + 1d6 spirit | — |
| Trembling Meteor Swordsman | *(no book entry)* | — | **L14** | → Katana | — |
| **Grandfather Mantis** (L15) | +28 → **+32** | **+4** | **L16** | 3d10+13 → **3d10+16 + 1d6 elec** | +22% |
| Lantondo (L15) | +30 → **+32** | +2 | **L16** | 3d4+10 +3d6 force → 3d4+16 +2d6 force | +9% |
| Artus Rodrivan (L15) | +30 → **+32** | +2 | **L16** | 3d8+12 → **3d8+16 + 1d6 acid** | +29% |
| Berberoka (L15) | *(no book entry)* | — | ~L15–16 | → 3d12+20 | — |
| **Duneshaker Solifugid** (L18) | +35 → **+35** | **+0** ✔ | L18 ✔ | 4d10+17 → **4d10+22** | +13% |
| **Koto Zekora** (L17) | +31 → **+36** | **+5** | **L19** | 3d10+20 → **3d10+20 + 2d8 fire** | +25% |

*(Attack bonuses benchmarked against the median highest attack bonus per level across the local packs: L13 +27 · L14 +29 · L15 +30 · L16 +32 · L17 +33 · L18 +35 · L19 +36 · L20 +38.)*

**Three things fall out.**

1. **"Under the Pale Sun ran as printed" is false.** HP 190/250 and AC 35/33 are book-exact — and then their swordsmen were handed a **Katana (3d10+13) in place of a Scimitar (2d6+10)**, a **74% damage increase**, at +2 accuracy. That fight cost 568 damage and played as Severe against a *Moderate* XP price. This is why.
2. **The Solifugid is the only creature all session whose attack bonus was left alone** — and its save DCs were *below* level too. It is the one genuinely honest threat profile in the session, which is exactly why a PL+4 creature priced *Severe* played as Moderate.
3. **Koto's melee was inflated as much as her casting.** A greatclub at **+36** is a **level-19** attack bonus, thrown at party ACs of 35–38. She was above her level on **HP, attack, damage and DC at once**, with only her AC left honest.

⚠️ **This supersedes the earlier "1.00× as printed" reading of the two rival teams.** Chassis honest, weapons not — found only by diffing the payload, the step this report initially skipped.

## 1. Per-creature — book vs. table

Max HP here is **exact**, not estimated: the Foundry export derives it from `hp-remaining`/`hp-percent` on each creature's own rolls, so no targeted-floor bracketing was needed.

| Creature | Book | Observed | HP Δ | AC Δ | Verdict |
|---|---|---|---:|---:|---|
| **Archery Specialist** ×2 *(Pale Sun)* | L13 · 190 HP · AC 35 | 190 · AC 35 | **1.00×** | — | **As printed** |
| **Weapon Master** ×2 *(Pale Sun)* | L13 · 250 HP · AC 33 | 250 · AC 33 | **1.00×** | — | **As printed** |
| Trembling Meteor ×4 | *(no pack entry)* | 190–250 · AC 31–32 | — | — | Reads as honest L13 |
| Artus Rodrivan | L15 · 330 · AC 35 | 305 | 0.92× | — | Slightly under book |
| Lantondo | L15 · 275 · AC 36 | 305 · AC 36 | 1.11× | 0 | Near book |
| Yarrika Mulandez | L15 · 250 · AC 37 | 280 | 1.12× | — | Near book |
| Grandfather Mantis | L15 · 300 · AC 36 | 380 · AC 36 | **1.27×** | 0 | Bumped, below the scaling line |
| **Berberoka** | L15 · 310 · AC 36 | **425** · **AC 37** | **1.37×** | **+1** | **Scaled** |
| **Duneshaker Solifugid** | L18 · 340 · AC 42 | **500** · **AC 40** | **1.47×** | **−2** | **Scaled** |
| **Koto Zekora** | L17 · 295 · AC 39 · regen 15 | **500** · **AC 40** | **1.69×** | **+1** | **Heavily scaled** |

**Koto's 1.69× is real, not an artefact.** The skill requires ruling out regeneration, resistance and the Elite template first: she has **regeneration 15 (deactivated by acid or fire)** and it **never ticked once** — zero healing lines all fight, because Ferrok's flaming rune and Sovael's persistent fire kept it suppressed from round one. Elite would add ~30 HP. Neither closes a 205-point gap. She was rebuilt.

⚠️ **Derive base AC by backing conditions out of `CTX :: dc armor`, not from the modal printed value.** The skill's modal-base rule **fails when a debuff is live for most of a creature's observed rolls**, because the mode *is* the debuffed number. Koto's printed AC read 37 on 8 of 11 rolls — but Clumsy 3 was up for all eight. Adding each roll's active penalties back to the AC Foundry actually used gives a clean, stable base:

| Creature | Book AC | Implied base (n observations) | Δ |
|---|---:|---|---:|
| Koto Zekora | 39 | **40** (9 of 11) | **+1** |
| Duneshaker Solifugid | 42 | **40** (23 of 25) | **−2** |
| Berberoka | 36 | **37** (8 of 10) | **+1** |

**Only the Solifugid got an AC reduction.** The earlier draft of this report claimed all three were lowered by 2 and read that as a deliberate "make them hittable" concession. That reading was wrong and has been removed.

**Two structural notes.** The Biting Roses are **Book 2 creatures used in Book 1** — a level-15 team fielded against a level-14 party during the qualifier. And the export's `CREATURE ::` header line lists the Archery Specialist at **AC 29**, which is wrong; both the pack JSON and every roll in the log say **35**. Trust the rolls and the JSON, not that header field.

---

## 2. Per-fight — grind and threat

| Fight | Enemy HP cleared | Damage taken | % of pool | In-combat healing | Margin | Concentration |
|---|---:|---:|---:|---:|---:|---|
| **1 · Biting Roses** *(LOSS)* | 143 of ~1,270 | **709** | **70.9%** | 167 | 458 | Seva 240 · Ferrok 196 |
| 2 · Trembling Meteor | 698 | 402 | 40.2% | 56 | 654 | Seva 132 · Clutch 102 |
| 3 · Under the Pale Sun | 1,019 | 568 | 56.8% | 225 | 657 | Ferrok 228 · Clutch 135 |
| **4 · Koto Zekora** | 497 | **916** | **91.6%** | 274 | 358 | Clutch 277 · Seva 222 |
| 5 · Duneshaker Solifugid | 518 | 421 | 42.1% | 125 | 704 | Clutch 266 · **Seva 0** |
| 6 · Berberoka | 426 | 144 | 14.4% | 25 | 881 | Clutch 92 |

**Session: 3,301 enemy HP cleared, 3,160 damage absorbed.** The party took more than three times its own collective hit points across one session and lost nobody permanently.

**Damage taken, per PC, all session:** Clutch **962** · Seva 712 · Ferrok 694 · Sovael 515 · Sattva 277. The tank umbrella is working — Clutch ate 30% of everything, and in the Solifugid fight **Seva took literally zero** because he intercepted both hits aimed at her.

---

## 3. Two-axis verdict, re-priced

5-player thresholds at level 14: Trivial 50 · Low 80 · Moderate 100 · Severe 150 · Extreme 200.

| Fight | XP on paper | Paper verdict | Empirical threat | Real verdict |
|---|---:|---|---:|---|
| 1 · Biting Roses | 4 × PL+1 = **240** | Extreme | 70.9% + a forfeit | **Extreme** ✔ |
| 2 · Trembling Meteor | 4 × PL−1 = **120** | Moderate | 40.2% | Moderate ✔ |
| 3 · Under the Pale Sun | 4 × PL−1 = **120** | Moderate | 56.8% | **Severe** — under-priced |
| 4 · **Koto Zekora** | 1 × PL+3 = **120** | **Moderate** | **91.6%** | **Extreme** — badly under-priced |
| 5 · Duneshaker Solifugid | 1 × PL+4 = **160** | Severe | 42.1% | Moderate — over-priced |
| 6 · Berberoka | 1 × PL+1 = **60** | below Trivial | 14.4% | Trivial ✔ (but 425 HP of grind) |

### Full re-pricing — book baseline vs. tuning, per creature

| Creature | Book | HP book → run | HP reads as | AC | Save DC book → run | DC reads as |
|---|---:|---|---|---|---|---|
| **Trembling Meteor** ×4 | L13 | 190–250 → **identical** (1.00×) | L13–14 | L13 | 33 → **33** | L13 |
| **Pale Sun** ×4 | L13 | 190 / 250 → **identical** (1.00×) | L13–14 | L13 | — | — |
| Yarrika Mulandez | L15 | 250 → 280 (1.12×) | L15 | — | 36 → **36** | L15 |
| Lantondo | L15 | 275 → 305 (1.11×) | L16 | L14 | 36 → **36** | L15 |
| Artus Rodrivan | L15 | 330 → **305** (0.92×) | L16 | — | — | — |
| Grandfather Mantis | L15 | 300 → **380** (1.27×) | **L20** | L14 | — | — |
| **Berberoka** | L15 | 310 → **425** (1.37×) | **L22** | L15 | — → **35** | **L14** |
| **Duneshaker Solifugid** | L18 | 340 → **500** (1.47×) | **L24** | **L17** | — → **36** | **L15** |
| **Koto Zekora** | L17 | 295 → **500** (1.69×) | **L24** | L17 | 36 → **42** | **L20** |

**Yarrika and Lantondo are book HP + exactly 30** — the Elite template's HP bump, applied without any of Elite's +2 to AC, DCs or saves. That reads as a deliberate flat "fifth player" HP allowance rather than a difficulty increase.

**Every DC in the session was honest or *below* level except Koto's.** The Solifugid, a level-18 creature, threw DC 35–36 when the level-18 median is 40 — its DCs read as **level 15**. The Berberoka's read as **level 14**. Koto's read as **level 20**. She is the single outlier in the entire session, on the single axis that actually kills people.

### True cost per fight

| Fight | Book XP | Book verdict | HP-adjusted XP | Threat (% pool) | Healing burned | Hero pts | Real verdict |
|---|---:|---|---:|---:|---:|---:|---|
| **1 · Biting Roses** | **240** | **Extreme** | 264 *(HP proxy)* | 70.9% + **lost** | 167 | 2 | **1.2× Extreme by the book; +4 attack on the Mantis doubled his crit rate** |
| 2 · Trembling Meteor | 120 | Moderate | 130 | 40.2% | 56 | 1 | Moderate ✔ |
| 3 · Under the Pale Sun | 120 | Moderate | 140 | 56.8% | 225 | 1 | Severe-ish |
| **4 · Koto Zekora** | **120** | **Moderate** | 160 *(capped)* | **91.6%** | 274 | 2 | **Beyond Extreme** |
| 5 · Duneshaker Solifugid | 160 | Severe | 160 | 42.1% | 125 | 0 | Moderate — grind, not threat |
| 6 · Berberoka | **60** | **Trivial** | **160** | 14.4% | 25 | 0 | Trivial threat, Severe grind |

⚠️ **The XP scale caps at PL+4 (160 XP), so it structurally cannot price Koto at all.** Her hit points read as PL+10. Even the HP-adjusted column under-states her; the only honest number for that fight is the 91.6%.

### The two things this re-pricing actually reveals

**1. Fight 1 was Extreme *by the book*, and the tuning that mattered was on attack bonuses, not hit points.**

Four level-15 creatures against a level-14 party is **4 × PL+1 = 240 XP against an Extreme threshold of 200 — 1.2× Extreme**, before anything was touched. That alone makes it the hardest-priced fight of the session, and it was fielded with **Book 2 creatures during the Book 1 qualifier.**

The HP tuning was minor: **1,155 book → 1,270 at the table, +10%.** But the **payload diff is where fight 1 was actually changed**, and it is not visible in HP or DC at all:

| | Book | At the table | Δ |
|---|---|---|---|
| **Grandfather Mantis** Claw | **+28**, 3d10+13 | **+32**, 3d10+16 **+ 1d6 electricity** | **+4 attack**, +3 damage, new rider |
| **Lantondo** Harrow Card | **+30**, 3d4+10 + 3d6 force | **+32**, 3d4+16 + 2d6 force | **+2 attack**, +6 damage |
| Yarrika | DC 36, top rank 8 | DC 36, top rank 8 | **none** — spells swapped within her printed ranks |

**That +4 on Grandfather Mantis is the whole fight.** Against Seva's AC 35:

- **Book +28** → hits on a nat 7, **crits on a nat 17 — a 20% critical rate**
- **Table +32** → hits on a nat 3, **crits on a nat 13 — a 40% critical rate**

**His critical rate was doubled.** He then critically hit Seva twice in one turn for 92 and 58 — 150 damage on a 176-HP character — which is what put her down and effectively decided the fight. The party's read that it came down to "double crits and failing all saves" is correct; what they couldn't know is that the double crits were running at twice the printed odds.

⚠️ **Correction to an earlier draft of this report:** it described fight 1 as "~380 XP, nearly 1.9× Extreme." That 380 was this document's own *HP-proxy* metric — pricing each creature at the level its hit points imply — and it is not a difficulty figure. The honest numbers are **240 XP (1.2× Extreme) with +10% HP and a +2/+4 attack bump.**


**2. HP inflation moved the grind axis; threat inflation arrived by two other doors.** The Berberoka jumped from *Trivial* (60 XP) to *Severe* (160 XP) on hit points alone — and still cost only 14.4% of the party pool, because its DCs read as **level 14** and Seva's Rooting rune immobilised it all fight. Same for the Solifugid: *Severe* on paper, 42.1% in practice, DCs reading **level 15** against a level-18 chassis. **Big hit points make fights long, not dangerous.**

The two fights that actually endangered the party were the two where something *other* than HP moved:

| Fight | Channel | Effect |
|---|---|---|
| **1 · Biting Roses** | **attack bonus** (+4 Mantis, +2 Lantondo) | doubled the Mantis's critical rate, 20% → 40% |
| **4 · Koto Zekora** | **save DC** (+6) | took the opener's crit-fail odds from 23% → 82% |

**Every save DC in the session was book-accurate or below level except Koto's, and every attack bonus was book-accurate except the Biting Roses'.** Those are the only two threat-axis changes all session, and they are precisely the two fights that hurt.

### Why this session cannot be priced with a single XP number

The XP budget takes one input — **creature level** — and assumes HP, AC, save DCs and damage all sit on that level's benchmark row. **Koto breaks that assumption in three directions at once** (AC L17, DC L20, HP L24), so the budget prices only the axis that happens to still match her nominal level and is blind to the other two. It reports *Moderate*; the fight took 91.6% of the party pool and had an 82% chance of opening with a 128-point critical failure.

**When a GM decouples the axes, replace the single verdict with a per-axis level profile:**

| Fight | AC reads as | DC reads as | HP reads as | XP says | Actually was |
|---|---|---|---|---|---|
| Koto Zekora | L17 (PL+3) | **L20 (PL+6)** | **L24 (PL+10)** | Moderate | **Extreme** |
| Duneshaker Solifugid | L17 (PL+3) | L15-ish (PL+1) | **L24 (PL+10)** | Severe | Moderate |
| Berberoka | L15 (PL+1) | L15 (PL+1) | **L22 (PL+8)** | Trivial | Trivial-but-long |

Read that way the session is legible: **every boss was a grind-axis outlier (HP at PL+8 to PL+10) with an honest threat axis — except Koto, whose DC axis was also pushed to PL+6.** That single decoupled number is the whole difference between "long fight" and "nearly lost the party."

**The budget fails exactly where the scaling is.** It prices *level*, and Koto's level didn't change — her hit points nearly doubled. A single PL+3 creature is supposed to be a Moderate speed bump for five level-14 PCs; this one nearly ended the party. Conversely the Solifugid, priced *Severe* at PL+4, played softer than its number because it lost a third of its action economy on round one (see §5).

---

## 3b. Koto Zekora's payload — the sharpest finding in the session

The skill says to diff the **payload** (spell ranks, DCs, damage dice) separately from the **chassis** (HP/AC/saves), because a GM can leave one honest and rebuild the other. Here he rebuilt both, and the payload is the more serious half.

| | Book | At the table | Δ |
|---|---|---|---:|
| Spell DC | **36** | **41 – 42** | **+5 / +6** |
| Top spell rank | **8** *(no rank-9 slots exist on her sheet)* | **9** | **+1 above her ceiling** |
| Eclipse Burst | rank 7 @ DC 36 | rank 7 @ **DC 41** | +5 |
| **Falling Stars** | ***not in her spell list at all*** | rank 9 @ **DC 42** | new spell |
| HP | 295 | 500 | ×1.69 |
| AC | 39 | **40** | **+1** |

**Her printed DC 36 is *moderate* for a level-17 creature** — Paizo deliberately did not build her as a save-or-die caster. **DC 42 is the *extreme* benchmark for level 17, and sits 4 points above the extreme benchmark for the party's own level (38).**

### She is not a level-17 creature. She is three different creatures.

Benchmarked against **4,871 NPCs** in the local packs (median per level):

| Level | median HP | median AC | median spell DC |
|---:|---:|---:|---:|
| 14 *(party)* | 255 | 36 | 34 |
| **17** *(her book level)* | **315** *(max observed 400)* | **40** | **38** |
| 20 | 380 | 45 | **42** |
| 24 | **512** | 51 | 48 |

Now place her three observed numbers:

| Her stat | Reads as | Relative to the party |
|---|---|---|
| **AC 40** | **level 17** — exactly the median | PL+3 |
| **Spell DC 42** | **level 20** | **PL+6** |
| **HP 500** | **level 24** | **PL+10** |

**500 hit points is higher than every single level-17 creature in a 4,871-creature sample** — the maximum observed at that level is 400. It sits at the 25th percentile *for level 24*.

So she was **hittable like a level 17**, **saved against like a level 20**, and **died like a level 24**. That is not a scaled boss; it is three different creatures wearing one name, and it explains the felt experience exactly — the party connected freely (497 damage dealt), could not make her fall over, and could not save against anything she cast.

### The dens got the HP treatment but not the DC treatment

The same HP inflation is on all three non-team opponents, and it is uniform enough to look like a deliberate house rule rather than per-creature tuning:

| Creature | Book HP → run at | Reads as | Book AC → run at | Save DCs used |
|---|---|---|---|---|
| Berberoka (L15) | 310 → **425** | ~L22 | 36 → **37** | Spray Water **35** — on-level |
| Duneshaker Solifugid (L18) | 340 → **500** | ~L24 | 42 → **40** | Venom Spray **36**, Earth Shaker **35** — *below* level |
| **Koto Zekora (L17)** | 295 → **500** | ~L24 | 39 → **40** | **41 – 42** — extreme for L17 |

**Every boss got roughly level-22-to-24 hit points while keeping a book-level AC.** That part is consistent and defensible — it makes fights long without making them lethal, which is a normal accommodation for a five-player table.

**Koto is the only one whose save DCs were also raised**, and by six points. The dens threw DC 35–36 at a level-14 party, which is fair. She threw **DC 41 and 42**. That is the outlier, and it is the number that did the damage.

### What that did to the dice

Party Reflex modifiers ranged +23 to +27. The die each PC needed:

| | vs. table DC 42 | vs. her book DC 36 |
|---|---|---|
| Sattva (+27) | 15 → **30%** | 9 → 60% |
| Sovael / Seva (+25) | 17 → **20%** | 11 → 50% |
| Ferrok (+23) | 19 → **10%** | 13 → 40% |
| Clutch (+23) | 19 → **10%** | 13 → 40% |

**Eclipse Burst: all five PCs failed.** They needed 14–17.

### And the crit-fail line is where it actually hurt

Failing a basic save by 10 or more **doubles** the damage. At DC 42:

- **Sovael** — 32 vs 42 = **−10 → critical failure → 162 damage** (on 176 HP)
- **Seva** — 30 vs 42 = **−12 → critical failure → 158 damage** (on 176 HP)

At her **book DC 36**, Sovael's 32 is −4 and Seva's 30 is −6 — **both plain failures, both half that damage.** The DC inflation alone converted roughly **160 points of that single round** out of thin air, and it did it specifically to the party's two 176-HP characters. That round is why the fight reached 91.6% of the party's HP pool.

### How do you actually price her? The full axis profile

Benchmarked against the local packs (median per level), every axis at once:

| Axis | Book (L17) | As run | Reads as | vs. the party |
|---|---|---|---|---|
| **AC** | 39 | **40** | L17 | **PL+3** |
| **Attack bonus** | +31 | **+36** | L19 | **PL+5** |
| **Spell DC** | 36 | **42** | L20 | **PL+6** |
| **Strike damage** | 36.5 avg | **45.5 avg** *(3d10+20 + 2d8 fire)* | **L21** | **PL+7** |
| **HP** | 295 | **500** | **L24** | **PL+10** |
| **Actions/round** | 3 | **4** *(un-printed Quickened)* | — | **+33% output** |

*(Damage benchmark: L17 median 34.5 · L19 40.5 · L20 42.0 · **L21 45.5**.)*

**Her Quickened was NOT legitimate, and it is the sixth axis.** ⚠️ *An earlier draft of this report called it "book-supported, she cast Haste on herself." That was wrong — **the only Haste in the entire session's log is Ferrok's.** She never cast it.* See below.

### The sixth axis: permanent Quickened, and it is not a Paizo pattern

All three solo bosses this session — Koto, the Duneshaker Solifugid and the Berberoka — show **Quickened in their very first condition printout**, before anything else was applied. None of them cast Haste; none of them has a Quickened ability printed:

| Creature | Printed Quickened ability |
|---|---|
| Koto Zekora (L17) | **NONE** |
| Duneshaker Solifugid (L18) | **NONE** |
| Berberoka (L15) | **NONE** |

**Across 5,140 NPCs in the local packs, only 3.4% have the word "quickened" anywhere in a printed ability** — and when they do it is almost always *conditional*: `Quickened Casting` for one spell type, or a trigger like `Horrific Speed` or `Feast on Destruction`. A **permanent, unconditional extra action every round** is not a published design pattern at any level.

So this is a house rule, and per Pax it is applied to **every** solo boss at high level in this campaign. It is worth naming separately because **it multiplies every other axis**:

- A solo boss is balanced against **five PCs × 3 actions = 15 actions per round** versus its own 3. Going to 4 is a **+33% increase in everything the boss does.**
- For Koto across three rounds that is **12 actions instead of 9 — three extra actions**, or roughly **135 extra damage** at her 45.5-average greatclub, or **one extra two-action spell.**
- It is very likely what allowed both **Eclipse Burst (2 actions)** and a Strike, or **Falling Stars (2 actions)** plus movement, inside single rounds.

**The XP table stops at PL+4 (160 XP) because the designers assume nobody fields creatures past it.** Extrapolating its own increments (+1 = 60, +2 = 80, +3 = 120, +4 = 160):

| | PL+4 | PL+5 | PL+6 | PL+7 |
|---|---:|---:|---:|---:|
| extrapolated XP | 160 | ~200 | ~280 | ~360 |

Priced on the three axes that determine **lethality** — attack, DC and damage, which cluster at **PL+5 to PL+7** — she comes out around **280 XP as a single creature.** The 5-player Extreme threshold is 200. **She is roughly 1.4× Extreme, solo.**

### Why the HP inflation is what made the lethality land

The two inflations multiply, and this is the part a single number hides:

- A **PL+6-lethality boss with PL+3 hit points** dies in two rounds. Call it two turns of output.
- The same boss with **PL+10 hit points** survived three full rounds *and* an Eclipse Burst opener, and delivered **968 damage.**

**HP wasn't the threat — it was the delivery mechanism.** It bought the DC-42 and +36-attack axes enough turns to actually connect. That is why the fight consumed 91.6% of the party pool when a Severe solo boss should cost roughly 40–50% of party resources: **about 2× a Severe outcome.**

### The practical pricing rule for this table

Given how consistently Cody separates the axes, the usable convention is:

> **Price his creatures on attack / damage / save DC, and treat HP purely as a duration multiplier on top.** The XP budget's level input tracks AC — the one axis he leaves alone — which is precisely why it reported *Moderate* for a fight that nearly ended the party.

### The counterfactual: the party rolled into the 18% branch

Eclipse Burst dealt **8d10 cold (47) + 8d4 void (17) = 64** on a plain failure — so **128 on a critical failure**, in one action, at the top of round one, before a single PC had acted. Party Reflex modifiers were +24 to +27, so against **DC 41** each PC critically failed on a **nat 4–7**:

| PC | Save mod | Crit-fails on | Chance | Damage | % of their HP |
|---|---:|---|---:|---:|---:|
| Ferrok | +24 | nat ≤ 7 | **35%** | 128 | 65% |
| Sovael | +25 | nat ≤ 6 | **30%** | 128 | **73%** |
| Seva | +25 | nat ≤ 6 | **30%** | 128 | **73%** |
| Clutch | +25 | nat ≤ 6 | **30%** | 128 | 52% |
| Sattva | +27 | nat ≤ 4 | **20%** | 128 | 63% |

- **Expected critical failures: 1.45 PCs.**
- **P(at least one PC critically fails the opener): 82%.**
- **P(what actually happened — zero): 18%.**

**At her book DC 36 the same spell needs a nat 1 or 2 to critically fail anyone** — 5–10% each, **23% that anyone does.** The +5 to the DC took the opening action from "a nat-1 punishes one person" to "somebody almost certainly eats 128 before the fight starts," and then Falling Stars did exactly that later at DC 42, twice, for 162 and 158.

The party did not survive this fight because it was tuned to be survivable. **They survived it because they hit an 18% branch on the opener.** The stake on a loss was three feathers — 10 down to 7, with one day left to re-earn them.

### What the book actually says (Despair on Danger Island, Event 9)

| | **Book — "EVENT 9: FACING THE TOP ENFORCER · SEVERE 14"** | **At the table** |
|---|---|---|
| Statblock | CREATURE 17, HP **295**, regen 15, AC **39** | HP **500**, AC **40** |
| Spell DC | **36** | **41 – 42** |
| Top slot | **8th** — maze, polar ray, scintillating pattern | **9th** — Falling Stars |
| **Stakes** | **None. No feather wager exists in the book.** | **3 silver feathers** |
| Reward | 500 gp challenge prize **+ 5,000 gp** bonus | 1,000 pp (**≈10,000 gp**) |
| Her exit | *"fights until knocked unconscious or, if her opponents deactivate her regeneration, until she is reduced to fewer than 25 Hit Points"* | conceded at 3 HP |
| Design intent | *"aside from **Event 9, which is intended simply to exhaust some of the party's resources**, these events are designed as easy opportunities for the characters to earn the last few feathers"* | a 3-feather stake fight |

**The book's Koto is a resource drain with no stakes attached.** Every other Day-3 event is an explicit feather handout. Cody added the wager, roughly doubled her hit points, added six to her DC, gave her a spell rank above her sheet, and doubled the payout.

### The stakes he attached it to are harsher than the recap assumed

- *"To qualify… a team must collect a total of 10 silver feathers. **Failure to do so will result in immediate disqualification.**"*
- *"Contenders who fail to reach the palace atop the mountain **by sunset forfeit their place in the tournament, even if they have 10 feathers.**"*
- *"**Once eight teams have qualified, the qualifying round is over, and all remaining teams are immediately disqualified.**"* — **it is a race for eight slots, not a threshold.**

### But the book builds a recovery ramp on Day 3 — which bears on intent

- **Event 10 — Silver Feathers on the Breeze**: Hao Jin **scatters free spare feathers** into the six hexes around Mount Haminabu. Reconnoiter + DC 37 Perception/Survival; **first success is a guaranteed feather**, then 50% per hex.
- **Event 11 — The Last Breath (LOW 14)**: three *weak* level-12 warriors, down to their final feather, who challenge for it.
- Canonically **Tino's Toughest fail** — *"just a few feathers short… run out of teams to fight and out of time for a bout."*

So losing three feathers to Koto is **designed to be recoverable inside the same day.**

### Where that leaves the "he wanted us to lose" theory

**For it:** the book attaches *no stakes at all* to this fight. Cody invented a 3-feather wager and then tuned her well past Severe. That combination only makes sense if a feather loss was an intended live outcome — and the book's Day-3 recovery ramp means he could set that up knowing it was survivable.

**Against it:** his **Phoenix Necklace ruling is more generous than canon.** The book says *"the slaying of an entrant during a challenge is entirely possible and permitted,"* and the necklace's actual power is a 10-minute activation that **consumes a silver feather to cast 7th-level raise dead, costing one additional feather each time**. Cody instead ruled that a tournament fight cannot kill you at all — removal from the fight, automatic return, **no feather cost**. He was capping lethality downward while pushing the numbers up.

**Most consistent reading: maximum drama, capped consequence.** He wanted the fight to feel like a near-loss and was probably content for it to cost feathers, with the book's recovery ramp as the safety net — but he removed the one canon rule that could actually have ended a character.

### The fair counterweight

Two things kept this survivable, and neither is a defence of the tuning:
1. **The Phoenix Necklace.** In a tournament fight lethal damage removes you from that fight rather than killing you — the consequence was capped even though the numbers weren't.
2. **She was under orders not to kill**, stated in-fiction (*"Orders from the big boss lady"*), and conceded at 3 HP rather than pressing.

### The honest verdict

A level-17 creature against a level-14 party is already PL+3. This one was fielded with **+205 HP, +1 AC, +6 spell DC, and a spell one rank above anything on her sheet.** There is no compensating concession anywhere on the block — every single number that could move, moved up. **DC 42 against level-14 saves is not a difficulty knob, it's a different game**, and the two critical failures it manufactured are the reason two 176-HP characters ate 162 and 158 in one round. Worth raising with Cody, with these numbers.

---

## 4. Damage contribution

Attribution resolves **99.6%** of applied damage; persistent-damage ticks are broken out separately rather than credited to whoever applied them.

| Fight | Ferrok | Sattva | Seva | Clutch | Sovael | persistent |
|---|---:|---:|---:|---:|---:|---:|
| 1 · Biting Roses | 91 | 52 | 0 | 0 | 0 | 0 |
| 2 · Trembling Meteor | 113 | 175 | **267** | 37 | 48 | 58 |
| 3 · Under the Pale Sun | **541** | 231 | 140 | 52 | 42 | 13 |
| 4 · Koto Zekora | 147 | **181** | 118 | 0 | 31 | 8 |
| 5 · Duneshaker Solifugid | **143** | 106 | 79 | 127 | 52 | 11 |
| 6 · Berberoka | 0 | 70 | 128 | **172** | 40 | 16 |
| **TOTAL** | **1,035** | **815** | **732** | **388** | **213** | 106 |
| **Share** | **31.4%** | **24.7%** | **22.2%** | **11.8%** | **6.5%** | 3.2% |

Ferrok is the damage engine and the Pale Sun fight is why — **541 of his 1,035 came from that one fight.**

---

## 5. What the control package bought

Foundry's own `MM :: ESSENTIAL` tags (its independent marginal-flip verdict) and my recomputation from margins agree almost exactly, which is a good sign both are right.

**Tier 2 — the whole package** (remove every party buff *and* every party-caused enemy AC penalty):
**16 flips on 99 party attack rolls** — 8 hit→crit, 5 miss→hit, 3 critmiss→miss. Discounting the critical-miss flips, which buy nothing, that is **13 outcome-changing flips.** Average package size on a decisive roll: **3.25 points.**

**Tier 1 — marginal, one effect at a time:**

| Effect | Annotated coverage | Flips | vs. statistical expectation |
|---|---:|---:|---|
| **Heroism** (+2, on Ferrok) | 9 / 99 rolls (9%) | **4** | ~0.9 expected — **4.4× over** |
| Courageous Anthem (+1) | 67 / 99 rolls (68%) | 5 | ~3.4 expected — normal |
| Enemy AC penalties (off-guard, frightened, clumsy) | 60 / 99 rolls (61%) | **10** | the single largest lever |

**Heroism is the standout of the session and it is not close.** Nine annotated rolls, four flipped — three of them ordinary hits into criticals worth 76, 70 and 74. A +2 should flip about one roll in ten; this flipped nearly one in two, because it was riding a character making high-MAP swings that were landing right on the boundary. Courageous Anthem, cast in every single fight, converted at exactly the rate a +1 should.

**The credit is shared, and the log says so explicitly.** All three Heroism-made criticals also carry an `ESSENTIAL` tag for **Clutch's off-guard** — remove either one and they are plain hits. Same for the Berberoka kill: Clutch's 69-damage critical needed Sovael's Anthem, Sovael's Frightened, *and* Clutch's own Taunt, all three.

**Non-attack payoffs** (the ones a Strike-only scan misses):
- **Clumsy 3 / Dazzled (Synesthesia scroll) — audited on request. It performed; the party's off-guard engine didn't.** Its one flip was **Koto's basic Reflex save against Sovael's own Thunderstrike** (nat 6 + 26 = 32 vs DC 34; 35 and a success without it), **doubling the finisher from 15 to 31**. The rest:
  - **Zero flips across the eight party attacks made while it was live** — margins −5, +6, +7, −4, +9, +6, −13, +9, none of which change degree at −3. **The cause is lost flanking, not the scroll.** Off-guard (circumstance −2) and Clumsy (status −3) are different penalty types and stack normally. The AC trail proves it:

    | Time | Printed AC | Flanking | Off-guard on her |
    |---|---|---|---|
    | 15:39:45 | 40 → **38** | ✅ | yes |
    | 15:40:47 → 15:51:06 *(six attacks)* | 40 → **37** | ❌ | **no** |
    | 15:52:12 | 40 → **35** | ✅ | yes |

    For six consecutive attacks she carried Clumsy 3 **without** off-guard, so the party's effective target only moved from 38 to 37 — one point — and nothing flipped. The single attack that had both landed at **AC 35**, exactly as the stacking rules predict. **Her 10-ft reach greatclub plus Reactive Strikes is what priced flanking out**: both of her critical hits on Clutch were Reactive Strikes on his own turns, punishing exactly the repositioning a flank requires. Note flanking returns at 15:52:12 — one turn after she is **Immobilized**.
  - **Dazzled did fire.** Three DC 5 flat checks (15:42:15 Success, **15:43:57 Failure**, 15:47:51 Success). ⚠️ These render as Foundry **text lines** (`Koto Zekora is Dazzled . X is Concealed to attacker. Flat Check DC is 5 . Failure`), **not** as `CTX :: flat-check` entries — a CTX-only grep misses them entirely. The one failure landed on **Falling Stars**, a rank-9 *area* spell, which resolved anyway at 15:44:33 for **465 damage** across four PCs. So Dazzled generated checks but prevented no damage.
  - The condition stayed applied **15:40:09 → 15:54:23**, well past the one round a *successful* save should grant.
  - ⚠️ **Correction to an earlier draft:** a reviewer claimed Clumsy 3 upgraded Seva's Deathseeker into a critical for 45. It did not — that roll is `outcome success`, nat 18, margin +9 against AC 37, and still a hit at +6 without the penalty. Removed from the recap.

- **Clumsy *1* elsewhere did flip one, though.** On Pale Sun Swordsman A it turned a failure (27, −7) into a **critical failure** (24, −10) against Sovael's Electric Arc, **doubling 21 into 42** on the basic save — the hit that killed him.
- **Roaring Applause** on a failed save gave **Slowed 1 to a Quickened creature** — a straight −1 action per round for the rest of the fight, provable from MAP progression alone (four Strikes in round 1, exactly three in every round after). Its *manipulate* applause then provoked **four Reactive Strikes in rounds 3–4 for 141 damage, 28% of the creature's health.** ⚠️ The creature had **no Reactive Strike of its own**, so the spell's reaction-denial clause bought nothing — the Slow and the clapping were the entire value.
- **Incarnate Ancient Specter** dropped four enemies Prone **on successful saves** (only a crit success avoids it) — four actions taxed, and a three-action Howling Blizzard cancelled outright.

---

## 6. Healing — in-combat vs. downtime

**Never quote the combined number.** Filtering to combat windows completely inverts the ranking:

| | In-combat | Downtime |
|---|---:|---:|
| **Total** | **968 HP** / 19 applications | 2,956 HP / 54 applications |
| **Clutch** | **647** (Battle Medicine ×) | — |
| **Sovael** | **120** (Heal spell) | 36 |
| Seva | 80 | — |
| Sattva | 104 (incl. healer's gloves) | **2,812** (Treat Wounds) |
| Ryu (Aeon Stones) | — | 108 |

**Sattva looks like the party's healer by a mile — 2,886 HP — and 97% of it is Treat Wounds between fights.** Under fire, **Clutch is the #1 healer at 647 HP**, almost entirely Battle Medicine off Doctor's Visitation, and **Sovael is #2 at 120.**

Triage was correct: **Clutch 465 and Seva 417** absorbed 91% of in-combat healing, which is exactly the tank and the focus-fire target.

---

## 7. Roll analysis

Player rolls only — enemy attack modifiers are hidden in this export, so no claim is made about the DM's luck. Enemy *saves* against party effects **are** fully logged and are analysed below.

| PC | Attack n · mean · z | nat20 / nat1 | Skill n · mean · z | Save n · mean · z |
|---|---|---|---|---|
| Ferrok | 25 · 10.92 · **+0.36** | 4 / 1 | 1 · — | 9 · 11.89 · +0.72 |
| Sattva | 33 · 9.97 · **−0.53** | 1 / 2 | 16 · 11.69 · +0.82 | 9 · 13.11 · +1.36 |
| Seva | 18 · 12.50 · **+1.47** | 1 / 1 | 1 · — | 11 · 8.82 · −0.97 |
| Clutch | 15 · 12.73 · **+1.50** | 1 / 0 | 30 · 11.17 · +0.63 | 11 · 10.09 · −0.24 |
| **Sovael** | **4** · 10.50 · +0.00 | 0 / 0 | 11 · 12.91 · +1.39 | 9 · 12.67 · +1.13 |
| **Party** | 95 · 11.16 · +1.11 | 7 / 4 | 59 · 11.53 · +1.37 | 49 · 11.16 · +0.81 |

Party overall **z = +1.89** across 203 dice — mildly warm, not remarkable.

Two things worth naming. **Sattva was the only PC rolling cold on attacks (z = −0.53) and still finished second in damage** — that is volume and precision damage doing the work, not dice. And **Sovael made four attack rolls in three hours and forty-two minutes.** His entire contribution lives outside the column most damage analyses measure.

### Save-luck counterfactual — was Sovael unlucky?

**No — the opposite.** Enemies rolling against his DCs averaged **nat 7.80 (z = −1.05)**, below par, and **3 of 5 failed**.

| Effect | Save | Enemy needed | Their odds | Rolled | Result |
|---|---|---:|---:|---:|---|
| Thunderstrike | Reflex DC 34 | nat 8 | 65% | 6 | **failure** |
| — | Reflex DC 34 | nat 13 | 40% | 3 | **critical failure** |
| — | Will DC 34 | nat 8 | 65% | 4 | **failure** |
| — | Will DC 34 | nat 7 | 70% | 9 | success |
| — | Will DC 34 | nat 6 | 75% | 17 | critical success |

**The actionable finding is target selection, not luck.** Against these opponents his DC 34 gave them a **65–75% chance on Will saves** and only **40% on the best Reflex matchup.** Every Will-targeted effect was a coin-flip he was losing on the odds; the Reflex-targeted one was the good bet. **Whispers of Weakness exists to tell him which** — and it did, twice, reporting *"weakest save is Reflex"* on the Berberoka.

---

## 8. Judging Sovael fairly — five axes

| Axis | Result |
|---|---|
| Direct damage | **213 (6.5%)** — last of five |
| Damage owed to luck | None; enemies rolled **below** average against him |
| **Control** | **~10 of the 13 outcome-changing flips** involved a modifier he supplied; **Heroism alone flipped 4 on 9 annotated rolls**; Slowed cancelled a boss's extra action for a whole fight |
| **In-combat healing** | **#2 at 120 HP**, behind only Clutch |
| **Damage per action** | **Highest in the party** — 3 kills and a 53→1 setup off **4 attack rolls** |

The damage column says 6.5% and last place. The other four axes say he supplied a modifier to roughly three-quarters of the session's decisive rolls, was the second-best healer under fire, and converted four attack rolls into three kills. **Both are true; only one of them is the measure of his night.**

---

## 9. What didn't fire

- **Koto Zekora's regeneration 15 never ticked once.** It deactivates on acid or fire, and Ferrok's flaming rune plus Sovael's persistent fire kept it off from round one. Across a 3-round fight that is **~45 HP the party never had to re-clear** — invisible in every damage column, and a direct receipt for running a fire-heavy front line.
- **The Berberoka's fear of crabs** was found by Sattva's Recall Knowledge and never exploited — the staff of illusions had been sold that morning. A live, exploitable Fear trigger left on the table.
- **Sovael's Fear** critically succeeded against the Solifugid: no effect.
- **Roaring Applause's reaction-denial clause** was worth nothing against a creature with no Reactive Strike. The Slow was the whole spell.

---

## Caveats

- Enemy **attack** modifiers are hidden in this export; no claim is made about the DM's dice. Enemy **saves** are fully logged and were analysed.
- Flip counts are **provable** flips at the stated annotation coverage (Anthem 68%, Heroism 9%). True counts are likely higher; Heroism's especially, since it was live for a full 10-minute duration but annotated on only nine rolls.
- The Trembling Meteor has no pack entry, so its "as printed" reading is inferred from HP/AC plausibility rather than a book diff.
- The save-luck sample for Sovael is **n = 5** — directionally clear, not statistically strong.
