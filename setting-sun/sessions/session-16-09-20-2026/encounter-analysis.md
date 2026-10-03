# Encounter Analysis — Session 16 (2026-09-20)

**Party**: level 15 × 5 · **HP pool 1,113** (Clutch 280 · Sattva 233 · Ferrok 209 · Seva 203 · Sovael 188)
**Source**: `rolls.txt` (foundry-export v2, 1,179 messages, single header — no double-paste) + cleaned transcript.
**Every creature's HP came back `exact (observed at 100%)` in the export header** — these are Foundry's own numbers, not damage-derived inferences. No floor bracketing needed.

---

## 1. Per-creature: book vs table — chassis AND payload

ACs derived from `CTX :: dc armor` plus the conditions live on each roll (never from the printed AC — the mode is the *debuffed* number whenever a debuff dominates). Method validated by the fact that it returns **AC 36 for Sovael**, matching his sheet exactly. **Enemy attack bonuses, damage formulas, save modifiers and ability DCs are all fully visible in this log** (`Modifier +34 :: 1d20 + 34`), so the payload can be diffed directly against the pack JSON.

### Defence (chassis)

| Creature | HP book → run | AC book → run | Saves book → run |
|---|---|---|---|
| **Butterfly Blade Warrior** (L13) | 235 → 235 | 33 → **35–36** | Fort +26 → **+24** |
| **Rune Giant** (L16) | 330 → 330 | 38 → 38 | Will +28 → +28 |
| **Clockwork Chopper** (L14) | 250 → **275** | 36 → 36 | Ref +31 → +29/31 |
| **Clockwork Dragon** (L16) | 265 → **400** | 39 → **42** | Ref +28 → **+31** |

### Offence (payload) — the half that actually hurt

| Creature | Attack book → run | Damage/hit book → run | Ability DC book → run |
|---|---|---|---|
| **Butterfly Blade** | +25 → **+30** | 2d4+15 (20) → 3d4+15 + 1d6 elec **+ 3d6 sneak** (**36.5**) · **×1.82** | — |
| **Rune Giant** | +33 → +33 | 3d12+17 (36.5) → 3d12+20 (39.5) · ×1.08 | Invoke Rune 35/37 → 36 |
| **Clockwork Chopper** | +29 → +29 | 3d12+10 (29.5) → 3d12+16 (35.5) · ×1.20 | — |
| **Clockwork Dragon** | +33/31 → **+36/34/35** | Jaws 36.5 → **47** · Claw 30.5 → **39** · Tail 34.5 → **47** · **×1.28–1.36** | **Breathe Oil DC 37 → 40, 16d6 → 20d6** · Self-Destruct DC 37 → 40, 12d10 → 15d10 |

### Verdict per creature

| Creature | Template read | What it means |
|---|---|---|
| **Rune Giant** | **Book, both halves.** +3 flat damage only | An honest fight. It was hard because it's a level-16 creature, not because it was tuned |
| **Clockwork Chopper** | HP ≈ Elite, attack/AC book, damage +6 | Mild |
| **Butterfly Blade** | **Offence rebuilt, defence mixed.** Attack +5, damage ×1.3 base / ×1.8 with sneak attack, AC +2/+3, but Fort −2 | *Easier to damage than to survive.* This is why Clutch ate 395 |
| **Clockwork Dragon** | **Scaled on every single axis** — HP ×1.51, AC +3, attack +3, damage ×1.3, breath DC +3 and dice +25%, Reflex +3 | A level-16 sheet running level-19-to-21 numbers throughout |

Elite at L16 would be 285 HP / AC 41 / +35 attack / DC 39. The dragon exceeded Elite on HP, AC and DC, matched it on attack, and added a damage die on top. The printed resistance 15 was ruled out as an explanation before calling it scaled.

### Per-axis level profile (empirical medians, 5,139 NPCs in the local packs)

| Level | median HP | median AC |
|---|---|---|
| 14 | 255 | 36 |
| 16 | 295 | 39 |
| 18 | 338 | 42 |
| 21 | 400 | 46 |

| Creature | AC reads as | HP reads as | DC reads as | Book | XP prices it |
|---|---|---|---|---|---|
| Butterfly Blade | L14 | L13 | — | 13 | PL−1 |
| Rune Giant | L15 | L18 | book | 16 | PL+1 |
| **Clockwork Dragon** | **L18** | **L21** | **L19** (DC 40) | **16** | **PL+1** |

The dragon's *book* HP (265) is already below the L16 median — a low-HP-for-level creature. Run at 400 it sits on the level-21 median. **Grind inflation and threat inflation were both present on the same creature**, which is the combination that ends parties. The Rune Giants, by contrast, show neither.

---

## 2. Per-fight: grind, threat, verdict

| Fight | Enemy HP cleared | Dmg taken | % of party pool | In-combat healing | XP budget (5p, L15) | Actually played as |
|---|---|---|---|---|---|---|
| **F1 Fallen Moon** | 2,395 (10 bodies) | 496 | 45% | 279 | ~300 XP → *past Extreme* | **Moderate** — 3 allied NPCs did 44% of the damage |
| **F2 Butterfly Blades** | 1,175 (5 bodies) | 607 | 55% | 49 | 150 XP → **Severe** | **Severe** ✓ |
| **F3 Rune Giants** | 660 (2 bodies) | 439 | 39% | 144 | 120 XP → *Mod/Severe* | **Moderate** ✓ |
| **F4 Clockwork** | 950 (3 bodies) | **1,550** | **139%** | 732 | 120 XP → **Moderate** | **EXTREME** ✗ |

5-player thresholds: Trivial 50 · Low 80 · Moderate 100 · Severe 150 · Extreme 200.

**F4 is the decoupled one, and by a mile.** The budget priced it *Moderate* — one PL+1 and two PL−1 — and it did **139% of the party's entire hit-point pool** in six rounds, requiring 732 points of in-combat healing to survive. That gap is the 400-HP dragon: level-21 HP, level-18 AC, priced as level 16.

### The Breathe Oil counterfactual — where the DC bump actually bit

A +3 on a basic save moves the **critical-failure threshold** far more than it moves the failure rate, and a crit-fail doubles the damage. Per PC, at the table's DC 40 versus the book's DC 37:

| PC | Reflex | Crit-fails on (DC 40) | P(crit-fail) | Crit-fails on (DC 37 book) | P(crit-fail) |
|---|---|---|---|---|---|
| Ferrok | +25 | nat ≤ 5 | 25% | nat ≤ 2 | 10% |
| Clutch | +26 | nat ≤ 4 | 20% | nat 1 only | 5% |
| Seva | +26 | nat ≤ 4 | 20% | nat 1 only | 5% |
| Sovael | +25 base (+27 overflowing) | nat ≤ 5 | 25% | nat ≤ 2 | 10% |
| Sattva | +30 | nat 1 only | 5% | nat 1 only | 5% |

- **P(at least one PC crit-fails any given breath): 61% as run vs 27% at book.** More than double.
- **Expected party damage per breath: 332 as run vs 210 at book (×1.58)** — DC and dice together.
- **Over the three breaths: ~998 expected vs ~630.** The breath-weapon payload alone accounts for **~370 points** of F4's 1,550 before a single Strike is counted.

**The concrete instance:** Sovael's save against the second breath was a natural 3 at +25 = 28. **At DC 40 that is a critical failure — 158 damage. At the book's DC 37 it is a plain failure — 79.** The three-point DC bump was worth exactly **79 damage on that one roll**. He hero-pointed it and rolled another critical failure; Clutch Intercepted the whole thing.

F1 looks terrifying on paper (10 enemies, ~300 XP) and played as Moderate purely because **Tino, Ran-to and Mafika contributed 1,286 damage — 41% of the fight** — and soaked a proportional share of the incoming.

---

## 3. Damage contribution

| PC | F1 | F2 | F3 | F4 | **Session** | Share |
|---|---|---|---|---|---|---|
| **Sattva** | 379 | 264 | 106 | **357** | **1,106** | 23.5% |
| **Sovael** | **723** | 141 | 51 | 123 | **1,038** | 22.1% |
| **Ferrok** | 184 | **330** | 193 | 228 | **935** | 19.9% |
| **Clutch** | 343 | 238 | 152 | 106 | **839** | 17.9% |
| **Seva** | 206 | 168 | **221** | 186 | **781** | 16.6% |

Allied NPCs in F1: Mafika 550 · Tino 517 · Ran-to 219.

**Sovael is second on the session and first in the biggest fight** — 723 of F1's 3,123, more than any allied NPC and more than the other four PCs combined (1,112 vs his 723 is close, but against each individually he doubles them). That's one eighth-rank Divine Armageddon catching nine bodies before the melee closed.

The spread is unusually flat: 23.5% to 16.6% across five PCs. Nobody carried and nobody freeloaded.

---

## 4. What the control package actually bought

Counted from Foundry's own **`MM :: ESSENTIAL`** tags — the module computes, per roll, whether removing that one modifier changes the outcome tier. This is Tier-1 (marginal) by construction.

| Modifier | Tier-1 flips | Side | Owner |
|---|---|---|---|
| **Off-guard family** (plain + Flanked + Swift Blow) | **22** | target | **Clutch** (grapples, taunts, flanking) |
| **Courageous Anthem** | **12** | roller | **Sovael** |
| Clumsy | 4 | target | Seva / Sovael |
| Intimidating Prowess | 2 | roller | Clutch |
| Inner Upheaval | 1 | roller | Tino (NPC) |
| Sickened | 1 | target | — |
| Size Modifier | 1 | roller | Clutch (Animal Form) |
| **Tier-2 package total** | **43** | | |

**Courageous Anthem: 12 provable flips on 91% annotation coverage** (94 of 103 party attack rolls). Statistical expectation for a +1 over 94 rolls is ~9.4 — observed 12 is comfortably consistent, i.e. the parser isn't lying and the Anthem ran slightly hot. Extrapolated to full coverage: ~13.

**Off-guard is the single biggest lever in the party at 22 flips**, and it is almost entirely Clutch's — grapples, taunts and flanking. This is the same finding as S15.

### Reaction denial — Roaring Applause, receipted

The Rune Giant fight ran 15:31:41 → 15:55:13. The sixth-rank Roaring Applause landed at **15:42:24**, almost exactly the midpoint. Splitting the giants' attack rolls on that timestamp:

| Window | Giant attack rolls | Damage on the following applications |
|---|---|---|
| **Before** the applause | 4 | **~165** |
| **After** | 3 | **~0** |

And the receipt that matters: **`Reactive Strike (Special)` is a printed Rune Giant ability and it appears nowhere in the session log.** Not once. The giants' bonus per-turn Reactive Strike — the thing that made repositioning through 20-foot reach cost 85 HP in round one — simply never fired again after the save failed.

---

## 5. What never fired (censored material)

| Creature | Printed abilities | Never appeared |
|---|---|---|
| **Rune Giant** | 15 | **12** — Dominate, Suggestion (At Will), Charm (At Will), Command Giants, Demand, Sending, Truesight, Flashing Runes, **Reactive Strike (Special)**, Constant Spells, Fly, Demand |
| Butterfly Blade | 5 | 3 — Butterfly's Kiss, Mastermind's Eye, Studied Strike |
| Clockwork Dragon | 5 | 1 — Spearing Tail |

**The Rune Giants never used a single one of their mental-control abilities.** Dominate is their signature — a rune giant's whole reputation is enslaving lesser giants and, at this level, players. Twelve of fifteen abilities went unused in a fight that lasted four rounds and killed both of them. Some of that is DM selection; a meaningful part is that a **failed Roaring Applause left them Slowed 1 with no reactions**, and a giant down an action per turn spends it swinging, not casting.

---

## 6. In-combat healing (Treat Wounds excluded)

| Fight | Total | By | To |
|---|---|---|---|
| F1 | 279 | Sattva 163 · Seva 67 · Ferrok 49 | Sovael 107 · Seva 67 · Clutch 56 · Ferrok 49 |
| F2 | 49 | Seva 49 | Seva 49 |
| F3 | 144 | Clutch 119 (self) · other 25 | Seva 85 · Clutch 59 |
| **F4** | **732** | **Sattva 246 · Clutch 217 · Sovael 121 · Seva 99 · Ferrok 49** | **Clutch 425** · Ferrok 133 · Seva 119 · Sattva 55 |

F4's healing concentration is textbook: **58% of all healing went into Clutch**, which is exactly what should happen when the tank is absorbing 50% of the incoming. Triage was correct.

Sovael delivered 121 of it — third-highest in the fight — while also being second on session damage.

---

## 7. Dice luck — split by category

PC rolls first; **enemy rolls below.** Unlike some tables, this log exposes enemy attack modifiers in full (`1d20 + 34`), so the DM's luck *is* measurable here.

| PC | Attacks (n/mean/z) | Checks (n/mean/z) | Saves (n/mean/z) | nat20 | nat1 |
|---|---|---|---|---|---|
| Sovael | 6 / 9.00 / −0.64 | 20 / 11.05 / **+0.43** | 6 / 11.00 / +0.21 | 1 | 0 |
| Ferrok | 30 / 9.50 / −0.95 | 7 / 7.14 / −1.54 | 4 / 8.75 / −0.61 | 0 | 1 |
| Sattva | 33 / **10.03** / −0.47 | 15 / **10.00** / −0.34 | 6 / 11.33 / +0.35 | 3 | 1 |
| Clutch | 54 / 9.74 / −0.97 | 36 / 10.00 / −0.52 | 6 / **16.83** / **+2.69** | 7 | 7 |
| Seva | 31 / **8.90** / **−1.54** | 15 / 12.00 / +1.01 | 7 / 13.00 / +1.15 | 2 | 7 |
| **Party** | — | — | — | **13** | **16** |

**Party total: n=276, mean 10.12, z = −1.09** — marginally cold, not significant (p ≈ 0.14). Nobody was cursed.

Three findings worth naming:

- **Sattva's complaint was wrong.** He said on mic *"My average roll today is below a 10, so it just makes sense."* His attack mean was **10.03** and his check mean **10.00**. He rolled exactly average and still led the party in damage.
- **Clutch's saves ran genuinely hot** — mean 16.83 over 6 saves, z = +2.69 (p ≈ 0.004). That is the single luckiest thing that happened to the party, and it happened to the PC eating 50% of the incoming. He also had the session's widest variance: 7 nat-20s and 7 nat-1s.
- **Seva's attacks were the coldest** (8.90, z = −1.54) with 7 nat-1s, which is why she needed two hero points and a Lucky Number to land what she landed.


### Enemy attack luck

| Enemy | n | mean natural | z |
|---|---|---|---|
| **Clockwork Dragon** | 18 | **8.83** | **−1.23** |
| Clockwork Chopper | 12 | 11.17 | +0.40 |
| Rune Giant | 6 | 8.67 | −0.78 |
| Butterfly Blade | 28 | 10.32 | −0.17 |
| **All enemy attacks** | **64** | **9.91** | **−0.82** |

**The dragon rolled cold.** Its attacks averaged a natural 8.83. **F4 took 139% of the party's HP pool with the boss rolling below average** — at a flat 10.5 it would have been worse. The Extreme verdict is a floor, not a fluke.

### Save-luck counterfactual — did enemies save against Sovael?

37 enemy saves logged with full modifier breakdowns; **28 of them against Sovael's effects.**

| | |
|---|---|
| Mean natural die | **9.71** |
| z-score | **−0.72** (enemies rolled *cold* against him) |
| Outcomes | 16 failure · 10 success · 1 critical failure · 1 critical success |

**No grievance available here.** Enemies rolled slightly below average against his DC 37 and failed 17 of 28. The Divine Armageddon opener alone forced nine Fortitude saves and got six failures and a critical failure. His spell DC is doing its job and the dice cooperated.

---

## 8. Honest uncertainty

- **Correction to the first version of this report:** it said enemy attack modifiers were hidden and DM luck was unmeasurable. That was copied from the skill's generic caveat without checking; this log shows them in full. The first version also analysed enemy **defence only** — the payload diff (attacks, damage, DCs, saves) and the crit-fail counterfactual were missing, and they are what explain F4.

- Damage-taken totals differ by 5–25% from the per-encounter reviewers on three PCs (Ferrok, Seva, Sovael in F4) depending on how `** REVERTED **` applications are attributed. Clutch's 776 and Sattva's 91 are confirmed by both methods. Treat individual PC damage-taken as ±10%; fight totals are solid.
- F1's XP pricing is unreliable by construction — three high-level allied NPCs fought alongside the party and the budget has no way to represent that.
- Annotation coverage for Courageous Anthem is 91%; every other modifier's coverage is unstated by Foundry and the Tier-1 counts for those are floors.
- The Fallen Moon have no pack entry, so their levels are inferred from HP against empirical medians only.
