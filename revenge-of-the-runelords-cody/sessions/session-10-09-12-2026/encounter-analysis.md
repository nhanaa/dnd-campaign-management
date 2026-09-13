# Encounter Analysis — Session 10 (2026-09-12)

**Revenge of the Runelords · Cody McGraw's Saturday table · party level 16, five PCs**
**Source:** `rolls.txt` — Foundry export v2, 1026 messages, 13:07:28 → 16:34:49. Single scene: *B13–B21. Crypt of Runes (North)*.

> ⚠️ **Roll-log only.** The session recording was not transcribed for this pass, so there is no cross-reference for death timing, DM commentary, or in-fiction context. Everything below is derived from the Foundry log. Enemy attack modifiers **are** visible this session (57 of 62 lines), so — unusually — the DM's dice are measurable too.
>
> ✅ **Double-paste check passed**: two header lines, one session, 1026 messages. One `** REVERTED **` application (Mithtirith −30 at 16:19:18, intercepted by Paya's Unbelievable Interception) — excluded from every total.

---

## Headline

**Your dice were the most exactly-average of anyone at the table.** Across 41 attack rolls Sevek landed **29 hits against 28.0 expected and 11 critical hits against 11.0 expected** — a deviation of zero. Paya was the lucky one (+2.4 crits over expectation); Aureys was unlucky (−1.8).

So the "I got lucky" feeling isn't in the d20s. It's in five other things that are all real:

1. **You were the most-targeted PC and the hardest to hit.** 17 attacks came at you — more than anyone — and only **53% landed**, the lowest rate in the party (Mithtirith 75%, Paya 71%, Kreebnock 67%, Aureys 55%).
2. **You absorbed 621 damage, 2.5× your own HP bar, and never went down.** Nobody in the party hit dying all session.
3. **Your four natural 20s all converted** — three critical Strikes and a critical Trip, and all four landed in the two fights where the party was clearing bodies fastest.
4. **Six of your eleven crits were manufactured, not rolled.** Strip the party's buffs and enemy debuffs and 6 of the 11 fall back to ordinary hits. That's Aureys' fifteen Feints and the flanking they bought, not your dice.
5. **Each of those eleven crits stapled a three-condition rider onto the target** — Celestial Armaments' blind plus Greater Crushing's Clumsy 2 and Enfeebled 2. **This is the single largest contribution anyone made to the session, and the first pass missed all of it.** The headline receipt: your blind on Pridespawn Cultist B made it fail two DC-11 flat checks in one round, **erasing two critical hits on Aureys — roughly 155 damage, on a 200-HP character, in a fight where she consequently took zero.** **§4a** is the real answer to "what did I actually do tonight."

The one place you genuinely ran hot: **enemies rolled a mean natural 8.00 (z −1.30) against your Electric Arc** — three critical failures in nine saves. Real luck, on a cantrip.

---

## 1 · Per-creature — real numbers vs the book

Foundry's own `# TRUE max HP` block gave exact HP for every creature engaged (all marked `exact (observed at 100%)`), so no floor bracketing was needed. AC was derived from `CTX :: dc armor` **plus the conditions live on that roll**, not from the printed value.

| Creature | Run as | Book (pack JSON) | Verdict |
|---|---|---|---|
| **Vogorond** | L18 · **340 HP** · **AC 40** · resist B10/P20/S20 | L18 · 340 · AC 40 | **Book exact. Completely untouched.** |
| **Risen Runelord Tannaris** | L17 · **400 HP** · **AC 40** · +Mythic Ferocity | *(Xirie/Kaliphesta chassis)* L16 · **195** · AC 38 | AC = clean **Elite** (+2). HP **×2.05** — far past what Elite grants |
| **Risen Runelord Ivamura** | L17 · 400 HP · AC 40 · +Mythic Ferocity | as above | same |
| **Risen Runelord Haphrama** | L17 · 400 HP · AC 40 · resist mythic 16 | L16 · 195 · AC 38 · resist mythic 16 | same — but **spent no Ferocity**; died at a clean 400 |
| **Risen Runelord Xirie** | L17 · 400 HP · AC 40 | L16 · 195 · AC 38 | barely engaged (took 10) |
| **Pridespawn Cultist** ×6 | L15 · **315 HP** · **AC 37** · resist mental 10 | *no pack entry*; Pridespawn Sentinel is L12 · 215 · AC 32 | Cody's custom creature; **identical to the S9 record** |
| **Chromatic Ooze** ×2 | L18 · **550 HP** · **AC 28** · immune crits + precision | L18 · 550 · AC 28 | **Book exact. Completely untouched.** |

### The one real scaling claim

Before calling anything scaled I ruled out, in order: overkill (used Foundry-exact HP, not applied totals), regeneration (none printed), flat/mythic resistance (Haphrama's mythic 16 is already netted out of applied damage), and the Elite template.

**Only the Risen Runelords survive that filter.** Elite on a level-16 creature gives +2 AC and roughly +20 HP — that would be **215 HP, AC 40**. Cody ran them at **400 HP, AC 40**. The AC is a textbook Elite; the HP is nearly double what Elite explains. That is deliberate HP inflation, and it is the *grind* axis, not the *threat* axis.

Everything else — Vogorond, both oozes — is the printed statblock, unmodified. That is worth saying plainly: **most of this session's difficulty was designed by Paizo, not added by Cody.**

### Per-axis level profile (medians from 5,442 local NPC statblocks)

| Level | median HP | median AC | median spell DC |
|---:|---:|---:|---:|
| 15 | 275 | 37 | 36 |
| 16 | 295 | 39 | 37 |
| 17 | 315 | 40 | 38 |
| 18 | 338 | 42 | 40 |
| 21 | 400 | 46 | 44 |

| Creature | HP reads as | AC reads as | DC reads as | XP prices it |
|---|---|---|---|---|
| Vogorond | L18 | L17 | — | PL+2 |
| Risen Runelord | **L21** | L17 | L18 | PL+1 |
| Pridespawn Cultist | L17 | L15 | — | PL−1 |
| **Chromatic Ooze** | **L25** | **L9** | — | PL+2 |

The ooze is the most decoupled creature in the session by a wide margin — **level-25 hit points behind level-9 armour class**, plus immunity to critical hits and precision damage. It is a pure attrition sponge: trivially hittable, effectively unkillable in a hurry, and it blanks Paya's crit engine and Aureys' precision at the same time. That decoupling is in the *book*; Cody just fielded two of them.

---

## 2 · Per-fight — grind and threat

The export's six `ENCOUNTER` blocks are five real fights' worth of initiative cards but **four actual fights**: blocks 1–2 are one continuous eight-round fight (the Risen rolled initiative at 13:35 and joined Vogorond's fight at round 3), and block 4 is just the initiative roll for block 5.

| Fight | Rounds | Wall time | Real enemy HP cleared | Party damage taken | % of 1,096 HP pool | Who ate it |
|---|---:|---:|---:|---:|---:|---|
| **F1** Vogorond + Tannaris + Ivamura | 8 | 83 min | **1,540** | 625 | 57% | Sevek 275, Mithtirith 249 |
| **F2** Four Pridespawn Cultists | 4 | 37 min | 1,260 | 476 | 43% | Paya 195, Sevek 166 |
| **F3** Haphrama + Xirie + 2 Cultists | 3 | 35 min | 1,040 | 509 | 46% | **Aureys 230**, Kreebnock 133 |
| **F4** Two Chromatic Oozes | 3 | 32 min | 1,100 | **832** | **76%** | spread — all five, 55–87% each |
| **Session** | 18 | 3h 07m | **4,940** | **2,442** | **223%** | — |

**The party cycled its entire collective HP bar 2.2 times.** But only **1,032 of those 2,442 points were healed back during combat** — the other 1,639 came from Paya's between-fight medic block (see §5). The party fought on its own hit points and got patched up in the gaps, which is why four fights consumed three hours.

**Mythic Ferocity is the hidden grind tax in F1.** Tannaris and Ivamura each hit 0 HP, came back at half max (200), and had to be killed twice — 400 HP of extra clearing each. Tannaris's card is explicit in the log at 13:55:13; Ivamura's is unlogged but his HP marker reads exactly 200 (50%) mid-fight, which only Ferocity produces. **Haphrama never used his** and died at a clean 400 — the difference between an 83-minute fight and a 35-minute one.

### Two-axis verdict vs the XP budget

Five-player level-16 thresholds: Trivial 50 · Low 80 · Moderate 100 · Severe 150 · Extreme 200.

| Fight | XP | Budget says | Grind | Threat | **What it actually was** |
|---|---:|---|---|---|---|
| F1 | 200 | Extreme | **very high** (1,540 + double-kills) | high (57%) | **Extreme** — budget got this right |
| F2 | 120 | Moderate | high (1,260) | moderate (43%) | **Severe** — budget under-rates it |
| F3 | 210 | Extreme | moderate (1,040) | moderate (46%) | **Severe** — budget over-rates it |
| F4 | 160 | Severe | high (1,100) | **highest of the session (76%)** | **Extreme** |

**Where I disagree with the budget, and why.**

- **F2 (Moderate, played Severe).** The budget floors four PL−1 creatures at 30 XP each and calls 1,260 hit points a Moderate encounter. Four bodies at AC 37 with reach-10 bec de corbins and Cruel Sneak Attack is an action-economy problem, not a Moderate one — it took 476 damage and four rounds off the party. The budget cannot see aggregate HP or action count.
- **F3 (Extreme, played Severe).** Xirie contributed **10 damage taken** all fight and Cultist C took none — the budget charged 90 XP for three creatures that barely fought. Discount them and it prices Severe, which is what it played as.
- **F4 (Severe, played Extreme).** The budget sees two PL+2 creatures. It cannot see 1,100 hit points behind AC 28, crit immunity, precision immunity, and **Chromatic Shift** (a reaction granting resistance 20 to whichever energy type just hit them) feeding **Chromatic Slam** (+2d10 of that same type on their own Strikes). The party's two biggest damage levers — Paya's Vicious Swing crits and Aureys' precision — were both structurally blanked, and the oozes got *stronger* as the party threw energy at them. It took 76% of the party's HP pool, the worst of the night.

---

## 3 · Per-PC damage contribution

Applied damage to enemies, post-resistance, `** REVERTED **` excluded. Persistent-damage ticks are broken out separately because they are riders from several PCs' runes (mostly Paya's Nightmare/Decaying/Flaming and Aureys' fan) and can't be cleanly split.

| PC | F1 | F2 | F3 | F4 | **Session** | Share |
|---|---:|---:|---:|---:|---:|---:|
| **Paya** | 625 | 617 | 390 | 341 | **1,973** | **34.5%** |
| **Sevek** | 572 | 430 | 257 | 410 | **1,669** | **29.2%** |
| **Aureys** | 246 | 368 | 349 | 284 | **1,247** | **21.8%** |
| **Kreebnock** | 107 | 47 | 136 | 159 | **449** | 7.9% |
| **Mithtirith** | 131 | 18 | — | — | **149** | 2.6% |
| *persistent riders* | 80 | 70 | 31 | 22 | *203* | *3.6%* |
| *Vogorond, self-inflicted* | 25 | — | — | — | *25* | *0.4%* |
| **Total applied** | 1,786 | 1,550 | 1,163 | 1,216 | **5,715** | |

> **Vogorond caught itself in its own Launch Rubble burst** at 13:29:26 — it made the Reflex save (Reflex +26 / Fort +34 fingerprint identifies the unnamed token as Vogorond) and still ate 25 through its own bludgeoning resistance. Not credited to anyone.

**Damage per attack roll** — the more honest ranking of a turn's worth of work:

| PC | attack rolls | dmg / roll |
|---|---:|---:|
| Kreebnock | 8 | **56.1** |
| Paya | 45 | 43.8 |
| **Sevek** | 41 | **40.7** |
| Aureys | 36 | 34.6 |
| Mithtirith | 0 | n/a (149 from save-based effects) |

**Sevek's control moved from his maneuvers to his crits.** 41 Melee Strikes, and only **2 Trips** all night — against six Taunts, one Grapple, four Inner Upheavals and seven Electric Arcs. Both Trips landed (one critical, on a natural 20), but the Trip lock that defines the build barely came out.

That reads as "played striker" until you price the crit riders — **each of his 11 critical hits applies blind + Clumsy 2 + Enfeebled 2**, and that package did more control work than the Trips would have. **§4a** has the full accounting. Still worth asking whether four Pridespawn Cultists in melee in F2 deserved more than one Trip attempt.

---

## 4 · What the control package bought

**Counted as flips** — rolls whose degree of success actually changed — using Foundry's margin, never a recomputed AC. 122 party attack rolls parsed with full CTX.

| Tier | Definition | Result |
|---|---|---:|
| **1 — Marginal** | remove one effect, hold everything else | see breakdown |
| **2 — Package** | remove *every* party buff and *every* party-caused enemy penalty | **39 flips** (20 hit→crit, 18 miss→hit, 1 critmiss→miss) |
| | flips that changed a real outcome | **38** |

*The critmiss→miss flip bought nothing — a critical miss and a miss are the same outcome. Discounted.*

**Tier 1, by source** (my recompute, cross-checked against Foundry's own `MM :: ESSENTIAL` tags):

| Effect | Source | My Tier-1 count | Foundry ESSENTIAL |
|---|---|---:|---:|
| off-guard (flanking / Feint / Taunt) | **Aureys** (15 Feints) + flanking | 13 | 16 |
| **clumsy 2** | **Sevek — Greater Crushing, on crit** | **6** | **6** |
| Courageous Anthem +1 | **Kreebnock** | 4 | 4 |
| sickened | Paya / party | 3 | 3 |
| frightened | Aureys (Demoralize, fear auras) | 3 | 2 |
| **blinded −4** | **Sevek — Celestial Armaments, on crit** | — | **1** |
| Emotional Surge +2 | Kreebnock | — | 1 |
| **total** | | **29** | **33** (file-wide, incl. non-attack rolls) |

**Clumsy is the second-largest single flip source in the session and it is entirely Sevek's** — see §4a.

The two methods agree within noise, which is what gives confidence in both.

**Off-guard is the party's engine, and it isn't close.** It contributed to **31 of the 39 package flips**. Courageous Anthem contributed to 17. The average winning margin on a flipped roll was **2.67 points** — which is exactly why no single modifier deserves sole credit, and why the Tier-1 numbers look small next to the Tier-2 total.

**Where off-guard came from: Aureys threw 15 Feints** (9 landed — 7 successes, 2 criticals) on top of flanking. Her damage column says 21.8%; her actual contribution is that **most of the party's crits were built on a condition she supplied.**

**Manufactured vs rolled critical hits:**

| PC | crits | natural 20s | would not have crit without the party's package |
|---|---:|---:|---:|
| Sevek | 11 | 3 | **6 (55%)** |
| Paya | 20 | 1 | 7 (35%) |
| Aureys | 9 | 1 | **7 (78%)** |

**Defensive side** — party-supplied penalties on enemy attack rolls (44 of 53 annotated enemy attacks carried at least one): **6 real flips prevented** — 4 would-be hits turned into misses, 2 would-be crits turned into ordinary hits. Sources seen: Enfeebled ×22 (Sevek's Crushing rune + Aureys' debilitation), Taunt ×14, Sickened ×10, Frightened ×6.

> ⚠️ **This count excludes the blind entirely, and the blind was worth more than all six of these flips combined.** A failed DC-11 flat check deletes an attack *after* the roll, so it never appears as a degree change. See §4a: **two critical hits on Aureys erased outright, ~155 damage denied.**

---

## 4a · Sevek's crit rider stack — the thing the first pass buried

Every one of Sevek's **11 critical hits** fires three riders at once:

| Rider | Source | Effect |
|---|---|---|
| **Blinded** (1d4 rounds) | **Celestial Armaments** (mythic feat 16) — Fort DC 35 | off-guard to everyone, −4 to Perception DCs, DC 11 flat check to target anything |
| **Clumsy 2** | **Greater Crushing** rune | **−2 to the target's AC** until the end of Sevek's next turn |
| **Enfeebled 2** | **Greater Crushing** rune | **−2 to the target's Str attack rolls and damage** |

> The first pass reported "clumsy 6 Tier-1 flips" and "Enfeebled ×22" in the flip tables **and attributed them to nobody.** They are Sevek's, and together they are the party's second-largest control lever after off-guard.

**The eleven crits:**

| Time | Target | nat |
|---|---|---:|
| 13:58:23 | Wall of Stone | 17 |
| 14:50:48 | Pridespawn Cultist B | **20** |
| 15:16:17 | Pridespawn Cultist A | 15 |
| 15:16:28 | Pridespawn Cultist C | **20** |
| 15:29:12 | Pridespawn Cultist A | **20** |
| 16:06:30 | Chromatic Ooze A | 16 |
| 16:14:24 | Chromatic Ooze A | 6 |
| 16:14:33 | Chromatic Ooze A | 10 |
| 16:22:57 | Chromatic Ooze A | 7 |
| 16:23:12 | Chromatic Ooze B | 11 |
| 16:29:20 | Chromatic Ooze B | 10 |

### What Clumsy 2 bought — party offence

**33 party attack rolls were swung into a window Sevek's crits had opened** — Paya 12, Sevek 11, Aureys 10.

- **6 Tier-1 flips from clumsy alone** — 4 hit→critHit, 2 miss→hit. Beneficiaries: **Sevek 3, Aureys 2, Paya 1.**
- That makes clumsy the **second-biggest single flip source in the session**, behind off-guard (13) and ahead of Courageous Anthem (4).
- Concretely visible in the ooze fight: Chromatic Ooze A prints **AC 26** through the back half of F4 instead of its true 28, and **AC 24** with off-guard on top. Every party member was swinging at a −2 Sevek put there.

### What the blind bought — Celestial Armaments — **the biggest single thing in the session**

First: **every blind in this log is Sevek's.** Kreebnock cast Blinding Foam twice (13:26:00 at Vogorond, 14:57:59 at Cultist C) and **both missed** — Foundry logs `outcome failure (unadjusted success)`, the Incapacitation trait downgrading a hit against a higher-level target. Blinding Foam blinded nobody all session.

A blinded creature treats everyone as **hidden**, so it must pass a **DC 11 flat check to target anything** — and on a failure the action is simply lost, *after* the attack roll has already been made. Foundry emits these as prose lines (`X is Hidden to attacker. Flat Check DC is 11. Failure`), not as `CTX` blocks, which is why the first pass never counted them.

**Sevek's blind generated 8 of these flat checks** — Cultist B (blinded by the 14:50:48 crit) and Cultist A (blinded by the 15:29:12 crit). Five passed. Three failed. Two of the three are the story:

| Time | Attacker | Target | Roll | Flat check | Result |
|---|---|---|---|---|---|
| **15:01:35** | Pridespawn Cultist B | **Aureys** | **Critical Hit by +12** | **Failure** | **erased** |
| **15:01:38** | Pridespawn Cultist B | **Aureys** | **Critical Hit by +7** | **Failure** | **erased** |
| 15:32:23 | Pridespawn Cultist A | Sevek | Critical Miss by −11 | Failure | bought nothing |

**Two critical hits with a bec de corbin, back to back, on Aureys — both deleted.** No damage line follows either; the log goes straight to the cultist's persistent-damage tick.

Priced against the four Pridespawn Cultist crits that *did* land this session (70, 72, 88, 80 — mean **77.5**), that is **roughly 155 damage denied to a 200-HP character in a single round.**

And it explains a number that looked strange in §2: **Aureys took zero damage in F2.** She wasn't dodging — those two crits were the only attacks aimed at her in the whole fight that would have connected, and Sevek's blind erased both.

**This forces a correction to the enemy-attack table.** The first pass read Foundry's `outcome` field and counted both erased crits as landed hits:

| PC | attacks | raw hits | **erased** | real hits | real hit % | raw crits | **real crits** |
|---|---:|---:|---:|---:|---:|---:|---:|
| Sevek | 17 | 9 | 0 | 9 | 53% | 2 | 2 |
| Paya | 14 | 10 | 0 | 10 | 71% | 2 | 2 |
| **Aureys** | 11 | 8 | **2** | **6** | **55%** | 4 | **2** |
| Mithtirith | 8 | 6 | 0 | 6 | 75% | 3 | 3 |
| Kreebnock | 6 | 4 | 0 | 4 | 67% | 2 | 2 |

So the first pass's line that *"Aureys was the softest target in the party at 80%"* is wrong twice over — she was at **55%**, and half her apparent crits never happened, because of Sevek.

**The blind's second job — feeding the party's offence.** 12 of the 33 swings into Sevek's condition window were at a blinded target, and blinded is off-guard to everyone without needing a flanking partner. The clearest receipt: at **15:07:12** Aureys Feinted Cultist B and Foundry tagged it **`MM :: ESSENTIAL :: Blinded −4 :: dc`** — the Feint landed by **+3** against a Perception DC the blind had cut by 4. Without Sevek's crit, that Feint fails and the off-guard it generated for the rest of the party never happens.

Cultist B stayed blind from **14:50:48 to roughly 15:16**.

> *Not Sevek's:* five further DC-11 checks (13:55:09, 14:13:18, 14:19:43, 15:54:04) come from the **unconscious** condition on dying Risen Runelords — unconscious includes blinded — and two DC-5 checks at 14:13:03 and 14:18:58 are Mithtirith's own dazzle-concealment, a separate effect.

### What Enfeebled bought — party defence

Enfeebled 2 and Enfeebled 1 are cleanly separable in the log: **Greater Crushing applies Clumsy 2 + Enfeebled 2 together**, while Aureys' debilitation applies Enfeebled 1 alone.

| Source | enemy attacks under it | defensive flips | flat damage denied |
|---|---:|---:|---:|
| **Enfeebled 2 — Sevek, Greater Crushing** | 12 | **2** (1 hit prevented, 1 critmiss) | ~14 |
| Enfeebled 1 — Aureys, debilitation | 10 | 0 | ~8 |

The damage-denial figure is small and honest — enfeebled shaves its value off each Str-based damage roll, so ~2 per landed hit. The −2 to attack is where the value is, and it produced one genuinely prevented hit.

### The critical Grapple — and the correction it forces

**13:38:32 — Sevek Grapples Risen Runelord Ivamura, critical success by +13 (Fortitude DC 37).** A critical Grapple is **Restrained**, not merely Grabbed: immobilized, off-guard, and unable to take manipulate actions without a check.

What followed, in order:

1. **13:38:39** — Sevek Strikes the restrained target and hits for **36** (off-guard, AC 40→38).
2. **13:38:47** — Sevek Taunts.
3. **13:38:54** — Foundry posts *Current Conditions: Restrained, Off-Guard, Immobilized.*
4. **13:38:59** — **Ivamura spends a Mythic Point on Remove a Condition to get out of it.**

> ⚠️ **This overturns summary point 5 of the first pass.** I wrote that with only two Trips attempted, the enemy-mythic-point drain "never happened." It did happen — **the single enemy Mythic Point spent in the entire session was spent escaping Sevek's Grapple.** The drain didn't come from the Trip lock; it came from a maneuver that isn't even the build's headline tool.

### ⚠️ Foundry Taunt bug — much better, still present

The S9 open thread was that Taunt's −1 was being applied to attacks **targeting Sevek**, which is backwards (the penalty exists only for actions that *exclude* the guardian). It fired on 8 attacks in S9 and masked two genuine crits.

**This session it fired on 3** — and **none of them mattered**:

| Time | Attacker | Outcome | Margin | With the bug removed |
|---|---|---|---:|---|
| 13:43:38 | Risen Runelord Tannaris | failure | −6 | still a miss |
| 16:17:33 | Chromatic Ooze A | success | +5 | still an ordinary hit |
| 16:18:43 | Chromatic Ooze B | failure | −2 | still a miss |

**No hidden crits this session.** Still worth fixing, but it cost nothing.

---

## 5 · Healing — in-combat vs downtime

> **Corrected.** The first pass defined a fight's window as *first initiative → last damage application*, which swallowed each fight's post-combat cleanup block into the fight itself. Fights are now cut at the **last enemy death**. This inverts the section completely.

Values are *effective* HP restored (capped at missing HP), not nominal rolls.

### In-combat (during initiative, before the last enemy dropped) — **1,032 total**

| Healer | F1 | F2 | F3 | F4 | **Total** | Method |
|---|---:|---:|---:|---:|---:|---|
| **Mithtirith** | 228 | 135 | 204 | 279 | **846** | Heal spell, 100% of it |
| **Kreebnock** | 68 | — | 50 | 68 | **186** | Restore the Mind 136, Soothe 50 |
| **Paya** | — | — | — | — | **0** | — |

**Mithtirith is the in-combat healing lane, essentially alone.** 846 of the party's 1,032, all of it the Heal spell, and **365 of it went into Sevek** — Aureys 195, Paya 124, self 98, Kreebnock 64.

### Post-combat / downtime — **1,639 total**

| Healer | Total | Method |
|---|---:|---|
| **Paya** | **1,332** | the `8d4+36` Medicine block + Dash of Herbs, Ocean's Balm, Torrent in the Blood |
| **Kreebnock** | 307 | Healing Well activation at 16:30:14 — 49 seconds *after* Ooze B died |

**Paya delivered zero healing under fire.** All five of his `8d4+36` casts fire in the cleanup block after the last enemy in each fight dropped — 13:07 (pre-session), 14:20:43 (Tannaris died 14:19:43), 15:17:09 (Cultist C died 15:16:33), 15:54:52 (Haphrama died 15:54:04), 16:30:14 (Ooze B died 16:29:25). His Kineticist impulses follow the same pattern. He is the party's **between-fight medic**, and that is a different job from the one the first pass credited him with.

### What that changes about the session

The party absorbed **2,442 damage against only 1,032 points of in-combat healing.** They fought on their own HP bars and got patched up between fights — which is why four fights consumed three hours, and why F4 (832 taken, 76% of the pool) was as dangerous as it was: **347 in-combat healing against 832 incoming.**

---

## 6 · Roll analysis

Natural d20s only. `z = (mean − 10.5) / (5.766/√n)`; |z| > 2 is meaningfully off expectation.

| PC | category | n | mean nat | nat 20 | nat 1 | z |
|---|---|---:|---:|---:|---:|---:|
| **Sevek** | attacks | 41 | 11.02 | 3 | 5 | +0.58 |
| | saves | 7 | 10.57 | 0 | 0 | +0.03 |
| | skills | 8 | 9.62 | 1 | 2 | −0.43 |
| | **all** | **56** | **10.77** | **4** | **7** | **+0.35** |
| **Paya** | **all** | 54 | **11.70** | 2 | 2 | **+1.53** |
| **Aureys** | all | 69 | 9.84 | 3 | 4 | −0.95 |
| **Mithtirith** | all | 15 | 8.53 | 0 | 2 | −1.32 |
| **Kreebnock** | all | 16 | 11.31 | 1 | 1 | +0.56 |
| **PARTY** | all | **210** | **10.59** | 10 | 16 | **+0.22** |

**Nobody was statistically lucky or unlucky.** Paya at +1.53 is the closest to a real signal and still short of significance. The party as a whole rolled a 10.59 mean against an expected 10.50.

**The DM's dice, unusually, are measurable this session** — enemy attack modifiers were printed on 57 of 62 lines. **53 enemy attack d20s, mean nat 11.40, 5 natural 20s, 3 natural 1s, z +1.13.** Cody ran slightly hot but within normal variance.

### Save-luck counterfactual

**Enemy saves against PC effects** (fully logged with modifiers):

| Caster | enemy saves | mean nat | z | outcomes |
|---|---:|---:|---:|---|
| Mithtirith | 11 | 10.45 | −0.03 | 2 critSucc, 5 succ, 3 fail, 1 critFail |
| **Sevek** | 9 | **8.00** | **−1.30** | 4 succ, 2 fail, **3 critFail** |
| Kreebnock | 9 | 9.22 | −0.66 | 4 succ, 4 fail, 1 critFail |
| Aureys | 4 | 10.50 | +0.00 | 1 critSucc, 1 succ, 1 fail, 1 critFail |

**This is the only place Sevek genuinely ran hot.** Enemies rolled a mean natural 8.00 against his Electric Arc — three critical failures in nine attempts. It's real luck; it's also on a cantrip, so the damage consequence is small.

### Party area-save exposure

Six multi-target saves came at the party (two Launch Rubbles, Force Rain, two Phantasmagorias, Plasma Whirl), 17 individual saves in total, all at DC 39–40.

**Zero critical failures. Expected: ~1.45.** Mildly lucky, but mostly earned — the party's save modifiers ran +26 to +34 against DC 40, which puts critical failure out of reach on most of them entirely. Sevek critically failed *nothing* and had a 0% critical-failure chance on four of his six area saves.

---

## 7 · What didn't fire

Printed abilities that never appeared in the log. This is usually the concrete receipt for how much the party's kill speed censored the enemy's material.

**Chromatic Ooze — and this one is significant:**
- **Caustic Aura** (90-foot emanation, DC 37 Fortitude or Sickened 1, every round, on entry *and* at start of turn) — **never used.** In a 32-minute fight against two oozes, this would have meant a party-wide sickened check every round from ninety feet away, with no way to leave the aura. Its absence is the single largest softening of the session, and F4 was *still* the most dangerous fight.
- **Greater Constrict** (3d10+13 plus DC 40 Fortitude vs unconscious) — never used, despite one successful Grapple.
- *Chromatic Shift and Chromatic Slam **did** fire* — the oozes shifted to electricity and fire resistance and added +2d10 of the matching type to their Strikes.

**Vogorond:**
- **Debris Storm** (8d6 bludgeoning to every enemy in its aura, DC 40 basic Reflex) — **never used** across 8 rounds. Launch Rubble fired only twice.
- **Monument**, **Dreams of the Past**, **Hypercognition** — never used.

**Risen Runelords:**
- **Remove a Condition** (1 Mythic Point) used **once**, by Ivamura. In S5/S8 enemies routinely burned mythic points standing up from Sevek's Trips — with only two Trips attempted this session, that drain never happened.
- **Recharge** and **Steady Spellcasting** — never used.
- **Vanishing Death** fired 4 times (Tannaris twice, Ivamura, Haphrama).
- **Haphrama spent no Mythic Ferocity at all** — he died at a clean 400 HP, having escaped at 94% in S9.

**Pridespawn Cultists:**
- **Hallucinatory Backlash** (the reaction that punishes whoever hits them) — **never triggered once** across six cultists and two fights, despite being their signature defensive ability in S6/S9.

---

## 8 · Summary judgments

1. **Cody scaled exactly one thing: Risen Runelord hit points, from 195 to 400.** The AC bump to 40 is a clean Elite template. Vogorond and both Chromatic Oozes are the printed statblock, untouched. This is grind inflation, not threat inflation — the safest kind, and consistent with accommodating a five-player table.
2. **The XP budget was right once out of four.** It over-rated F3 (charging full price for two creatures that barely fought) and under-rated F2 and F4 — F4 badly, because it cannot see 550 hit points behind AC 28 with crit and precision immunity.
3. **The ooze fight was the session's real Extreme**, and it was Paizo's design, not Cody's. Two creatures that blank the party's two best damage levers and get resistant to whatever you hit them with.
4. **The party's whole crit economy runs on off-guard**, contributed to 31 of 39 package flips, and Aureys' 15 Feints are the largest single source of it. Her 21.8% damage share badly understates her night.
5. **Sevek's control ran through his crits, not his maneuvers — and it was the best single performance of the night.** 41 Strikes, 2 Trips, 1 Grapple, 6 Taunts. The Trip lock sat idle, but the build controlled the fight anyway, via **11 critical hits each applying blind + Clumsy 2 + Enfeebled 2**:
   - **~155 damage erased** — two Pridespawn Cultist critical hits on Aureys deleted by DC-11 flat checks off the blind, which is why she took **zero** in F2.
   - **6 Tier-1 offensive flips** from Clumsy 2 — second only to off-guard, ahead of Courageous Anthem — plus a −2 AC window that 33 party attacks were swung into.
   - **The blind that made Aureys' pivotal Feint land** (Foundry tagged it ESSENTIAL).
   - **The only enemy Mythic Point spent all session**, burned escaping his critical Grapple on Ivamura.
   - Second in damage at 29.2% / 40.7 per attack roll.
6. **Mithtirith is the in-combat healing lane, alone. Paya healed nothing under fire.** 846 of the party's 1,032 in-combat HP is Mithtirith's Heal spell (365 of it into Sevek); Kreebnock adds 186. Paya's 1,332 is entirely post-combat cleanup between fights. He is the between-fight medic, which is a real job and a different one.
7. **The party fought on its own hit points.** 2,442 damage absorbed against only **1,032** points of in-combat healing. The gap is why four fights took three hours.
8. **The Taunt bug is nearly resolved and cost nothing** — 3 misapplications, none of which changed an outcome. Down from 8 in S9.
9. **The luck question: no.** Your dice hit expectation to within 0.0 crits on 41 attacks. What carried the session was AC 40+, the lowest incoming hit rate in the party, 365 points of Mithtirith's Heal aimed at you, six crits that Aureys' Feints manufactured — and eleven crits whose riders bent the math back for everyone else.

10. ⚠️ **`character-sheet.md` is stale on the weapon.** It lists a *+3 Greater Striking Flaming Astral Bo Staff*. Foundry has been rolling **+3 Greater Striking **Greater** Flaming Astral **Greater Crushing** Bo Staff** all session. The Greater Crushing rune is doing real work (6 flips, a −2 AC window on 33 party swings) and it is not on the sheet. Add it — and note the sheet's crit stack currently reads "prone + blinded + dazzled" when the live stack is **blinded + Clumsy 2 + Enfeebled 2**, with prone only when a Trip lands.

---

*Method notes: HP is Foundry's own `# TRUE max HP` block, all entries `exact (observed at 100%)`. AC is derived from `CTX :: dc armor` plus the conditions live on each roll, never the printed value. Flips test `deg(margin)` before and after removing points, never a margin string match. Damage ledger is built on `takes N damage` text lines with the one `** REVERTED **` excluded; the `DMG ::` extractor was used only for its revert marker. Persistent-damage ticks are anchored at `^Persistent Damage (` and attributed to the bearer, not the last attacker.*
