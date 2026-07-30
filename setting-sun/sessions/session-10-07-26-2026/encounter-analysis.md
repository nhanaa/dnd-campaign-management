# Session 10 — Encounter & Damage Analysis

**Method**: every creature's HP derived from the damage it actually absorbed in `rolls.txt`, not from its stat block. A **targeted** attack (Strike, single-target spell attack) cannot land on a corpse, so the highest running total reached by a targeted hit is a **hard floor** on real HP. Book values are reference only.

**Party level**: 11 for E1–E2, **12** for E3–E5.
**Party HP pool ≈ 816** — Sovael **164** (Foundry-verified); Clutch ~200, Sattva ~164, Ferrok ~150, Seva ~138 (class/level estimates, ⚠️ not verified).

---

## 1. Per-creature: book vs. reality

| Creature | Book | Observed HP floor | Observed AC | Effective level | Scaled? |
|---|---|---|---|---|---|
| **Tick Swarm A / B / C** | L9 · 130 HP · AC 28 | **203 / 210 / 188** | **31** | ~11–12 | ⚠️ **YES — ~1.5× HP** |
| **Old Man Statue** | *(no match — "Divine Warden" glossary entry is L6/95 HP/AC 24)* | **265** | **37** | **~14–15** | ⚠️ **Custom / heavily scaled** |
| **Manyala Ahmoza** | — | **278** (KO'd) | 33 | HP→L15-16, AC/atk→L12-13 | ⚠️ **HP-scaled** |
| **Rijana Ahmoza** | — | 139 *(forfeited — floor only)* | 33 | as above | — |
| **Lightning Caller A** | — | 14 *(floor only — untouched)* | 33–35 | ~12–13 | — |
| **Lightning Caller B** | — | 192 *(floor — still standing)* | 35 | ~12–13 | — |
| **Lightning Caller C** | — | **196** *(206 log minus a double-applied Foretell Harm)* | 34–35 | ~12–13 | — |
| **Deadly Mantis A / B / C** | L11 · 220 HP · AC 31 | **276 / 281 / 280** | **34** | ~13 | ⚠️ **YES — ~1.27× HP** |

**Every creature whose book entry I could identify was running above it.** No Fast Healing or Regeneration appeared anywhere in the log, so none of this is phantom HP — it's real inflation.

### The pattern: HP is scaled, offense mostly isn't

Ticks ran **+3 AC and +55% HP** over book. Mantises ran **+3 AC and +27% HP**. That is the classic **five-player adjustment** — give creatures more to chew through without making each hit deadlier. It turns fights into *grinds* rather than *spikes*, which is exactly how this session felt.

**The Old Man Statue is the exception, and it's a big one.** AC **37**, attack **+31**, ~**265 HP** against a *level 11* party. Benchmarked against the PF2e tables that's roughly a **level 14–15 creature** — **PL+3 to PL+4**, solo. Its offense was scaled as hard as its defense: it critted for 86 and 70, and only Ferrok, Seva and Sovael could reliably touch it. **Sattva and Clutch dealt literally zero damage to it across four rounds.**

---

## 2. Per-fight: grind vs. threat

| Fight | Rds | **Grind** (enemy HP cleared) | **Threat** (party dmg taken) | % of pool | Healing burned | Survival margin |
|---|---:|---:|---:|---:|---:|---:|
| **E1 · Tick Swarms ×3** | 4 | **601** | 367 | **45%** | 73 | +522 |
| **E2 · Old Man Statue** | 4 | 265 | ~330 | **40%** | 382 | +868 |
| **E3 · Ahmoza Twins** | 2 | 417 | 105 | 13% | 123 | +834 |
| **E4 · Lightning Callers ×3** | 4 | 402 | 389 | **48%** | 285 | +712 |
| **E5 · Deadly Mantises ×3** | 6 | **837** | ~300 | 37% | 455 | +971 |
| **SESSION** | **20** | **~2,522** | **~1,491** | **183%** | **1,318** | — |

**The party absorbed 1.8× its entire collective HP pool in one session and nobody went unconscious.** That gap is the healing economy: 1,318 HP restored, more than three-quarters of the damage taken.

- **Highest grind**: E5 (837 HP across three Gargantuan bodies) and E1 (601 across three swarms).
- **Highest threat**: E4 (48% of the pool) — three archers whose Rain of Arrows hits *everyone* on one roll. It out-threatened the mantises despite being a smaller fight.
- **Lowest of both**: E3 — the Ahmoza bout ended in two rounds because Ferrok's 130-damage turn broke it open. The only fight that was genuinely easy.

---

## 3. Re-priced against the XP budget

5-player thresholds: Trivial 50 · Low 80 · **Moderate 100** · **Severe 150** · **Extreme 200**.

| Fight | Priced by the book | Priced by observed levels | DM's own call |
|---|---|---|---|
| **E1 · Ticks ×3** | 3 × PL−2 = **60 → Low** | 3 × PL/PL+1 = **120–180 → Severe** | — |
| **E2 · Statue** | *(no valid book match)* | 1 × PL+3/PL+4 = **120–160 → Severe, top end** | — |
| **E3 · Ahmoza ×2** | — | 2 × PL+1 = **120 → Moderate** | **Moderate** ✅ |
| **E4 · Lightning ×3** | — | 3 × PL/PL+1 = **120–180 → Severe** | **Severe** ✅ |
| **E5 · Mantises ×3** | 3 × PL−1 = **90 → Low/Moderate** | 3 × PL+1 = **180 → Severe, near Extreme** | **Severe** ✅ |

**The empirical numbers agree with Cody on all three fights he priced out loud.** Where the book and the dice disagree — E1 and E5 — the dice are right and the book is badly wrong: the mantis fight would price as *Low* on its glossary entry and was unambiguously Severe.

**E1 is the quiet outlier.** Nobody called it anything, it opened the session, and it was a **Severe encounter** that cost the party 45% of its HP pool. It read as a slog because it *was* one.

---

## 4. Damage contribution

Attributed per encounter; AoE (Chain Lightning, Shock arcs) hand-checked because automated attribution under-credits multi-target effects.

| | Clutch | Ferrok | Sattva | Seva | Sovael | Fight total |
|---|---:|---:|---:|---:|---:|---:|
| **E1** Ticks | 104 | **260** | 9 | 65 | 130 | 568 |
| **E2** Statue | **0** | 53 | **0** | 89 | **101** | 243 |
| **E3** Ahmoza | 93 | **215** | 63 | 26 | 0 | 397 |
| **E4** Lightning | 98 | 99 | **104** | 53 | 49 | 403 |
| **E5** Mantises | **234** | 228 | 197 | 41 | 137 | 837 |
| **TOTAL** | **529** | **855** | **373** | **274** | **417** | **2,448** |
| **share** | **21.6%** | **34.9%** | **15.2%** | **11.2%** | **17.0%** | |

**Ferrok is the damage engine and it isn't close** — 35% of everything, on the strength of two enormous Spellstrike crits (98 into a tick swarm in one turn, 130 into Manyala). **Clutch is second at 22%**, which is remarkable for a Guardian who also absorbed a third of all incoming damage. **Sovael is third at 17% while casting almost no attack spells in two of the five fights** — that's Chain Lightning and Fire Ray doing heavy lifting in bursts.

### Damage taken

| | Clutch | Ferrok | Sattva | Seva | Sovael |
|---|---:|---:|---:|---:|---:|
| **Total absorbed** | **506** | 285 | 182 | 194 | 286 |
| **share** | **34.8%** | 19.6% | 12.5% | 13.3% | 19.7% |

**Clutch ate 35% of all incoming damage on a five-person team** — 1.75× an even share — and that *understates* it, because **Guardian's Armor silently deleted another 6–7 points off every single hit he took**. Across ~40 hits absorbed that's roughly **250–280 additional damage that never entered the ledger at all.**

---

## 5. What the control package bought

- **Courageous Anthem was up for nearly every attack the party made.** Lingering Composition **critically succeeded in both E1 and E5** (four rounds each). A flat +1 to hit and damage on ~136 attack rolls converts roughly **7 additional hits and ~7 additional crits** across the session, plus ~136 damage.
- **Clutch's taunt-and-Intercept umbrella** is the single largest reason nobody dropped. He took 506 damage so others didn't, and Guardian's Armor made ~55% of it disappear.
- **Fear stacking got cheap at level 12.** Talent Envy rides free on the Performance check Sovael already makes on round one, and it **critically succeeded on its debut**. Add Clutch's Battle Cry Demoralize (which crit on a Lightning Caller for Frightened 2) and Sovael's Fear, and multiple enemies spent whole fights at −1 or −2 on everything.
- **Three medics.** 1,318 HP of healing against 1,491 taken. The S9-era "Sovael is the only healer" risk is gone — he cast two Heals all session.

---

## 6. Player luck

⚠️ **Enemy attack modifiers are hidden in the log, so nothing here says anything about the DM's dice.** This measures the players only.

| | attacks | hit % | crit % | crit-miss |
|---|---:|---:|---:|---:|
| Sovael | 9 | **78%** | 22% | 0 |
| Seva | 19 | **74%** | 5% | 0 |
| Ferrok | 23 | 65% | 13% | 0 |
| Clutch | 27 | 59% | 11% | 2 |
| **Sattva** | **42** | **31%** | **0%** | **17** |
| **ALL** | **136** | **54%** | **8%** | **19** |

**Sattva's collapse is real, but it is half structural.** Filtering to *first attacks only* (no multiple-attack penalty), the gap narrows and sharpens:

| first-attack only | attacks | hit % | crits |
|---|---:|---:|---:|
| Sovael | 9 | 78% | 2 |
| Seva | 19 | 74% | 1 |
| Ferrok | 17 | 71% | 3 |
| Clutch | 16 | 69% | 2 |
| **Sattva** | **20** | **45%** | **0** |

- **The other four cluster at 69–78%. Sattva sits at 45% with zero critical hits in twenty unpenalized attacks.** That is genuine bad luck, not just MAP.
- **His crit-miss count is inflated by structure**: Hunted Shot fires two arrows, and against the statue's **AC 37** his second shot at +17 critically missed on any natural roll ≤ 10 — a coin flip, by the math, before luck entered it.
- **The collapse was concentrated in the first two fights**: E1–E2 he went **1-for-17**. From E3 onward, after the level-up and the greater striking rune, he was **12-for-25 (48%)** and killed two of the three mantises.

---

## Headline

**This was a five-Severe session run against a party that was never in real danger of losing anyone** — and both halves of that sentence are true because of the same thing: the DM scales **HP, not lethality**, so the fights are long rather than spiky, and the party has enough healing and enough tank to outlast long.

The two things worth carrying forward:

1. **The Old Man Statue was the real outlier** — a PL+3/PL+4 solo with scaled *offense*, not just HP, against a level-11 party. It is the only fight this session where two PCs contributed literally nothing, and the only one where the party's answer was "wait for the three people who can hit AC 37."
2. **The mantis fight was correctly feared.** The party discussed retreating in round one and the empirical price is 180 XP — Severe pushing Extreme. Clutch's two critical Claws are the only reason that read changed.

---

# Appendix — Damage Contribution in Depth

## A1. The action-economy answer

Sovael's raw damage looks low next to Ferrok's. It is **not** an efficiency problem — it's an allocation one.

| Fight | Rounds | Actions available | Actions spent on damage | % | Damage | **Damage per damage-action** |
|---|---:|---:|---:|---:|---:|---:|
| E1 Ticks | 4 | 12 | 8 | 67% | 130 | 16.2 |
| E2 Statue | 4 | 12 | 6 | 50% | 101 | 16.8 |
| **E3 Ahmoza** | 2 | 6 | **0** | **0%** | **0** | — |
| E4 Lightning | 4 | 12 | **2** | **17%** | 49 | 24.5 |
| E5 Mantises | 6 | 18 | 7 | 39% | 137 | 19.6 |
| **TOTAL** | **20** | **60** | **23** | **38%** | **417** | **18.1** |

Against the party's damage leader:

| | damage per action **spent on damage** | damage per **total** action |
|---|---:|---:|
| **Ferrok** | **17.8** | 14.2 |
| **Sovael** | **18.1** | **7.0** |

**When Sovael commits an action to damage, it lands as hard as Ferrok's — marginally harder.** He simply commits **38% of his actions** to it where Ferrok commits ~80%. The entire gap in the contribution table is allocation, not output.

### Where the other 62% went

- **Every fight opens with the same three-part tax**: Lingering Composition (free) → **Courageous Anthem (1A)** → and usually Shield or repositioning. That's a guaranteed 1–2 actions of round one, every single time.
- **E3 is the extreme case: zero damage actions in six.** Round 1 was Anthem + **Benediction** (2A). Round 2 was **Sustain Benediction** (1A) + **Fear** (2A). Both rounds fully spent, nothing offensive. The bout then ended.
- **E4 is the second-worst: two damage actions in twelve.** Round 1 went to Anthem, flying clear of the Rain of Arrows burst, and Shield. Round 3 went to a rank-3 **Heal on himself** (2A) after taking 90 in one turn, plus a Stride. Round 4 went to **re-casting Courageous Anthem after it lapsed** plus a move, with Demoralize ruled out of range at 30 ft.

So the instinct is right, and it's sharper than "I had to move and buff": **two of the five fights (E3, E4) consumed 78% of their actions on non-damage work.** Those two fights alone account for the gap.

## A2. Sovael's damage by ability

| Ability | Damage | Share | Cost |
|---|---:|---:|---|
| **Chain Lightning** (R6 slot) | **89** | 21% | 1 top-rank slot, 2A |
| **Fire Ray** ×2 + burning ground | **88** | 21% | 2 focus points, 2A each |
| **Ignition** (cantrip) ×2 | **74** | 18% | free, 2A each |
| **Telekinetic Projectile** (cantrip) ×2 | **56** | 13% | free, 2A each |
| **Thunderstrike** (R5 slot) ×2 | **53** | 13% | **2 rank-5 slots** |
| **Blazing Bolt** (R5 slot) | 39 | 9% | 1 rank-5 slot, 2A |
| Foretell Harm | 10 | 2% | free action + Cursebound |
| Electric Arc (cantrip) | 8 | 2% | free, 2A |

Three things fall straight out of this:

1. **The two rank-5 Thunderstrikes were the worst trade of the session.** Two top-tier spell slots, 107 damage *rolled*, **53 delivered** — because the statue succeeded on both basic Reflex saves. That is less than a single Fire Ray, which costs a renewable focus point. **Against a creature whose lowest save is still good for its level, a basic-save spell is a coin-flip for half.** The Shadow Signet exists precisely to route around this — targeting Reflex *DC* with an attack roll instead of forcing a Reflex *save*.
2. **Cantrips out-earned slots.** Ignition + Telekinetic Projectile + Electric Arc = **138 damage for zero resources**, more than every spell slot he spent except Chain Lightning. At rank 6 those are 7d6/7d4 — they are not filler.
3. **Chain Lightning was the single best slot expenditure of the session** — 89 damage across three targets from one cast, and the only one of his AoEs that could fire without hitting allies.

## A3. What the buff actions bought (the invisible column)

Courageous Anthem was up for roughly **80% of the party's 136 attack rolls** (~109 attacks). It grants **+1 status to attack *and* damage**.

- **Flat damage**: ~59 of those attacks landed; +1 each, doubled on crits ≈ **+68 damage**.
- **Accuracy conversion**: +1 to hit turns ~5% of attacks from miss into hit. ~5–6 extra hits at the session's mean of **37.7 damage per landed attack** ≈ **+190–220 damage**.

**Estimated total enabled: ~260–290 damage — sitting in other people's columns.** ⚠️ *A model estimate, not a measurement: it assumes uniform AC spread and 80% Anthem uptime.*

Fold that in and the picture inverts:

| | direct | enabled (est.) | **effective** |
|---|---:|---:|---:|
| Ferrok | 855 | — | 855 |
| **Sovael** | **417** | **~275** | **~690** |
| Clutch | 529 | — | 529 |
| Sattva | 373 | — | 373 |
| Seva | 274 | — | 274 |

That does not count Benediction's +1 party AC, Fear and Dirge of Doom's Frightened stacks, Talent Envy's critical Demoralize, or the two Whispers of Weakness +2 bonuses — all of which reduce incoming damage or raise hit rates without ever appearing as a number.

## A4. The others, briefly

- **Ferrok — 855 (35%).** Concentrated, not steady: **two turns account for 228 of it** (98 into a tick swarm, 130 into Manyala). Ignition Spellstrike crits double *both* the weapon and the spell, which is why his ceiling is so much higher than anyone else's. His floor is low too — he contributed 53 across the whole statue fight.
- **Clutch — 529 (22%), while absorbing 35% of all incoming.** He is second in damage *and* first in damage taken, which should not be possible and is: Guardian's Armor let him stand in the middle and keep swinging. **234 of his total came in the mantis fight alone**, after Gargantuan size switched off his entire Wrestler kit and left him with nothing to do but hit things.
- **Sattva — 373 (15%).** Almost all of it late: **9 damage across E1–E2, then 364 across E3–E5.** The greater striking rune Seva bought him landed between those two halves.
- **Seva — 274 (11%), on her first session, with the party's most valuable single hit** — the killing blow on the Old Man Statue. Her 89 in that fight was second only to Sovael's 101, and Clutch and Sattva both dealt zero.

## A5. The practical read

The lever isn't "blast more" — the efficiency is already there. It's **buying back actions in the fights that eat them**:

- **Talent Envy now makes round one nearly free.** The Demoralize rides the Performance check he was already making for Lingering Composition. Round one used to be Anthem + setup; it can now be Anthem + setup + a debuff at no action cost.
- **Courageous Anthem lapsing cost a whole action in E4.** Lingering Composition critically succeeded in E1 and E5 (four rounds) but only rolled a plain success in E3 and E4 (three rounds) — and in a four-round fight that means re-casting. Performance is +23; the crit threshold on a standard DC 30 is a 17+. Worth tracking as a real variable.
- **Stop paying rank-5 slots for basic-save damage.** Route through the **Shadow Signet** (attack roll vs Fort/Reflex DC) or spend the slot on Chain Lightning, which does not offer a save-for-half on the primary target.
- **The heal was correct and cost 2 actions.** After eating 90 in one turn at 164 HP, healing was the right call — but with three medics now in the party, that is increasingly somebody else's action to spend.
