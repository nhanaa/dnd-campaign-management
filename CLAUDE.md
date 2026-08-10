# DnD Campaign Management

## About This Project

This is a personal TTRPG character and campaign management project for Pax. It tracks characters, build progressions, session notes, tactics, and party dynamics across multiple campaigns spanning **D&D 5e** and **Pathfinder 2e Remastered**.

## Project Structure

Each campaign lives in its own root-level folder. All content is in Markdown.

```
<campaign-name>/
├── character-sheet.md    # Current stats, abilities, feats, equipment, spells
├── progression.md        # Level-up plans, build path, future feat/spell picks
├── world.md              # World-building, storyline, NPCs, locations, lore
├── tips.md               # Playstyle tips, tactics, combos, action economy
├── dynamics.md           # Party dynamics, NPC relationships, plot threads
├── style-guide.md        # Visual theme for session recap HTML (optional)
└── sessions/
    └── session-<N>-<MM>-<DD>-<YYYY>/
        ├── recap.md      # Session recap — summary, events, loot, quotes
        └── recap.html    # Styled HTML visual — timeline, character spotlights
```

## Campaigns

| Folder | System | Setting | Character |
|--------|--------|---------|-----------|
| `korvosa (abandoned)/` | Pathfinder 2e Remastered | Korvosa | Frozen Wind Kitsune — Draconic Sorcerer (Rime) | **ABANDONED** |
| `korvosa-monday/` | Pathfinder 2e Remastered | Curse of the Crimson Throne (Korvosa) — Monday group | Izka — Kashrishi (Sylph) Magus (Inexorable Iron) / Cavalier | **ABANDONED** — DM had issues and never returned |
| `myrrindar/` | D&D 5e (2024 PHB) | Myrrindar — Winds of Warding | Fairy Bard (Mist) |
| `icewind-dale/` | D&D 5.5e (2024 PHB) | Rime of the Frostmaiden | Eladrin Paladin (Avarath Solvane) | **LEFT 2026-05-16** |
| `raiders/` | D&D 5e (2014 PHB) | Raiders of the Serpent Sea (Grimnir) | Tuss — Discovery Domain Cleric (Aesgor) |
| `hellbreakers/` | Pathfinder 2e Remastered | Hellbreakers — Rise Up Isger | Tian Human Dragonblood — Dueling Fighter (Bai Jian) |
| `season-of-ghosts/` | Pathfinder 2e Remastered | Season of Ghosts (Willowshore, Shenmen, Tian Xia) — **Orion's group** | Mo — Wayang Rogue (Thief) / Spirit Warrior | **ABANDONED** — Orion left |
| `season-of-ghosts-ande/` | Pathfinder 2e Remastered (Free Archetype, Gradual Boosts, Ancestry Paragon) | Season of Ghosts (Willowshore, Shenmen, Tian Xia) — **AndeGM's paid group** | **Zhen Stillness** — Samsaran (Hungerseed) Animist (Liturgist) — healer/buffer/secondary striker | **JOINED 2026-06-26 @ S1** (new 5th player) |
| `setting-sun/` | Pathfinder 2e Remastered | Setting Sun, Rising Phoenix (Shades of Blood → Fists of the Ruby Phoenix) | **Sovael** — Pearl Dragonet (Aiuvarin) — Oracle (Flames) / Bard / Sorcerer | **SHADES OF BLOOD COMPLETE 2026-07-12 @ S8 → Ruby Phoenix @ Lv11. Tivael retired; Sovael (his cousin) replaces him** |
| `revenge-of-the-runelords/` | Pathfinder 2e Remastered (**Mythic**) | Revenge of the Runelords — **Tom Brister's Tuesday group** | Liu Heifeng — Tengu (Sylph) Thaumaturge — falcata + fist, Champion/Spirit Warrior | **LEFT** — scheduling conflict; switched to Cody's Saturday RotR |
| `revenge-of-the-runelords-cody/` | Pathfinder 2e Remastered (**Mythic**, Free Archetype, Ancestry Paragon, **no ARP, no GAB**) | Revenge of the Runelords — **Cody McGraw's Saturday group** (same DM as `setting-sun/`) | **Sevek** — Human (Sky Dragonblood) **Monk 13**, worshipper of Ashava — bo staff trip/tank, Guardian + Staff Acrobat + Druid + Mortal Herald, Ascended Celestial destiny | **JOINING 2026-08-01 @ Lv13** |
| `abomination-vault/` | Pathfinder 2e Remastered | Abomination Vaults (Otari, the Gauntlight) | ~~Argon Rath — Orc Barbarian~~ **DIED S4 (2026-07-29)**; new Lv5 PC TBD | **DM ("Lap") runs deliberately over-level; party Lv5** |

## Discuss it — don't go build it

**A question from Pax is a question, not a work order.** When he asks what something should be, what would work, or how to approach it, the deliverable is a *conversation*. Talk it through, offer options, ask what he thinks, and let him decide. Do not go produce the finished thing.

This is a creative collaboration, and the characters, stories, and builds are **his**. Handing him a polished artifact in response to a question takes the decision away from him even when the work is good — it settles choices he hasn't made and leaves him editing something instead of choosing something.

- **Write a file only when he asks for a file** — never because the discussion generated enough material to justify one.
- **Never write a decision he hasn't made into a file**, and never propagate one across multiple files.
- **Do the one thing asked.** Don't chain follow-on edits onto an approved action.
- **Ask when there's a real fork** instead of picking a branch and presenting it as done.
- **Software-engineering defaults do not apply in this repo.** The reflex to carry a task to completion and report it finished is wrong here. Stopping to talk *is* the work.

## How to Help

- **Build discussions**: When discussing builds, reference specific feats, spells, and class features by name. Consider action economy and party synergy.
- **System accuracy**: Be precise about which system (5e vs PF2e Remastered) rules apply. Do not mix rules between systems.
- **Progression planning**: When planning levels, lay out feat/spell choices level by level.
- **Session processing**: Use `/process-session <campaign> [audio-file]` to transcribe recordings and generate session recaps (MD + HTML). The skill handles transcription, speaker mapping, recap generation, and proposes updates to world.md and dynamics.md. **The audio file is optional — if Pax doesn't give one, auto-find today's recording in `/mnt/c/Users/nhanp/Videos/` (filenames are `YYYY-MM-DD HH-MM-SS.wav`); never build a recap from the roll log alone unless Pax explicitly says "no recording."**
- **World file**: `world.md` tracks the campaign storyline, world-building, NPCs, and locations. Updated after each session.
- **Style guides**: Each campaign can have a `style-guide.md` defining the HTML recap theme. Copy `style-guide-template.md` from the project root to create one.
- **Tactics**: Focus on action economy, spell slot efficiency, and positioning.
- **Ask Question Tool**: Use it regularly to help aid with thinking and asking questions about what Pax thinks.

## Roll logs — the Foundry export (applies to every Foundry campaign)

**Pax exports the Foundry chat log at session end using `foundry-export.js` in the repo root.** He pastes it into the campaign's roll log (`rolls.txt` for setting-sun). Read that script's header comment before working with any roll log — it documents the format and the failure modes.

**The exported format is speaker-attributed.** Each line is:

```
[HH:MM:SS] Speaker :: flavor :: formula = total :: rendered content
```

split into `=== ENCOUNTER N ===` blocks auto-detected from initiative clusters.

**This supersedes the old "the rolls log is a global dump, back-derive attribution from stat fingerprints" guidance** — that applied to the copy-pasted format used through 2026-07-19 and earlier. With the export script, attribution is *direct*: the speaker is on the line. Only fall back to stat-fingerprint back-derivation when working with a pre-2026-07-19 log.

### What the export gives you, without opening a bestiary

- **Speaker on every line** → damage contribution and kill credit per PC, directly
- **`Target: X (AC 35 31)`** → the target's real AC *and* its reduced AC when off-guard/frightened. First number is base.
- **`Result: Hit by +7`** → exact accuracy and crit rates
- **Full modifier fingerprint** → disambiguates rollers when names collide
- **`They are destroyed`** → kill confirmation, no inference needed
- **Enemy attack bonus + Perception (initiative cards) + AC** → reverse-engineer creature level against the PF2e benchmark tables. This is more reliable than the bestiary, because GMs scale creatures (S9's catoblepas was book level 12 / AC 33, run at AC 35 / attack +29 ≈ level 14).
- **Timestamps** → align the roll log to a session recording's transcript
- **`SAVE ::` lines** → every target's saving throw against a PC spell: **natural die, total, degree of success, and the modifier breakdown** (including debuffs like `Frightened 2 -2`). This is how you measure what the party's debuffs actually bought. Sourced from the **pf2e-toolbelt** module's message flags — not present at tables without it.

### Hero points — house rule (reroll + 10 on a low die)

**At SOME of Pax's tables, hero point rerolls are NOT RAW.** The house rule: spend a hero point, reroll the d20, and **if the new die is 10 or lower, add +10 to the result.** A high reroll takes no bonus.

> ⚠️ **This rule is table-specific — confirm before assuming it.** **`setting-sun/` (Cody McGraw / "Ryu") does NOT use it** (confirmed by Pax 2026-07-26, after S10 produced four rerolls of ≤10 that never got the bonus). Cody's hero-point homebrew is instead **3 per session, rationed, no hourly refresh** (see `setting-sun/world.md`). Do not apply the +10 to setting-sun logs.

**How it appears in the export.** A hero-point reroll renders as *two* d20 blocks on one line. Compare the formula header to the dice:

```
Panacea :: Medicine Check ... :: 1d20 + 12 + 10 = 28 :: 1d20 + 12  1d20 3  3 15   1d20 + 12  1d20 6  6 28
                                          ^^^^ house-rule bonus       first roll (3)      reroll (6, ≤10) → +10
Zanthar :: Arcane Spell Attack ... ::     1d20 + 11 = 27 :: 1d20 + 11  1d20 5  5 16   1d20 + 11  1d20 16  16 27
                                          no +10                       first roll (5)      reroll (16, >10) → no bonus
```

So: **`+ 10` in the formula header ⇒ hero point spent AND the reroll came up low.** But its *absence* does not mean "no hero point" — a two-d20 line with a high reroll is still a hero point. **Count every two-d20 line as a hero-point spend**; use the `+ 10` only to tell whether the reroll was low.

⚠️ Do not confuse this with the Foundry **low-reroll automation** warned about elsewhere in this file. Both render as two d20s. Confirm against the transcript where it matters — players say "I'll hero point that" out loud.

### Pitfalls that have actually bitten

- **CHECK FOR DOUBLE-PASTE FIRST.** The 2026-07-19 log contained encounters 1–3 twice, which silently doubled every HP estimate. Exports now begin with two `#` header lines giving the message count and date range — **two headers means a double paste.** For older logs, verify by looking for a repeated damage sequence per creature before computing anything.
- **The export auto-detects sessions by time gap** (`GAP_HOURS`, default 8) and skips stray clusters under `MIN_MESSAGES`, so a token healed the next day can't anchor the window. The header lists every session found; `SESSION = 0` is the latest, `1` the one before.
- **Adjacent duplicate applications.** The same target taking the same value on consecutive lines is usually one event applied twice, not two hits.
- **Stale ability headers.** Plain weapon Strikes generate no ability block, so in the *old* format they inherit whatever spell header came before. This caused a real error: Ferrok's Force Fang damage was credited to Sovael's Fire Ray. The new format's speaker field eliminates this.
- **Damage rolls ≠ damage dealt.** An AoE rolls once and applies to many targets. Summing roll totals undercounts AoE casters badly; pair rolls to their applications.
- **GM blind rolls are absent** — the script only sees what Pax's client received.
- **Enemy saves live in message *flags*, not visible chat text.** The rendered chat card shows them, but a copy-paste of the pane loses them — which is why older logs have no save data. The export reads them out of `flags['pf2e-toolbelt'].targetHelper.saveVariants`. If a log has no `SAVE ::` lines, either the table lacks the module or the log predates 2026-07-21.

## 5.5e (2024) rules discipline

When discussing any campaign that uses **D&D 5.5e / 2024 PHB** (`myrrindar/`, `icewind-dale/`, and any future 2024 tables), **always double-check mechanics against the 2024 rules before stating them as fact.** Your training prior leans heavily toward 2014 5e, and you will silently default to 2014 mechanics — encounter budgets (no x1.5 monster multiplier in 2024; per-character XP budgets with Low/Moderate/High tiers), concentration rules (Spiritual Weapon, Hunter's Mark, etc. changed), spell scaling (Cure Wounds 2d8 base, Healing Word 2d4 base), class-feature levels (Monk Stunning Strike at Lv5 not Lv3), and subclass features have all shifted. Verify before critiquing tactics, planning levels, or estimating encounter difficulty. If you can't verify, hedge explicitly ("in 2014 this was X; I'm not sure if 2024 changed it") rather than asserting confidently.

## PF2e Remaster rules discipline

Your training prior leans heavily toward **legacy (pre-remaster) PF2e** and will silently default to it. Verify every mechanic — spells, feats, class chassis numbers, focus spell text — in the local `pf2e-lookup` pack (`node pf2e-lookup/pf2e-search.js "<name>" -d`) before asserting it. Known traps that have already caused wrong analysis:

- **Spell attack modifier and spell DC are ONE unified statistic.** Class features like Expert/Master Spellcaster raise it for ALL spells the character casts, including archetype spells of other traditions. There is no per-tradition DC gap for multiclass casters — archetype casting lags in slots and spell ranks only, never DC.
- **Remaster oracle (PC2) gets 4 spell slots / 4 spells known per rank** (3 at the newest rank), plus mystery-granted spells and a free mystery feat. Not the legacy 3-per-rank chassis.
- **Focus spells auto-heighten to half level (round up)** and many were completely redesigned in the remaster (e.g., Ancestral Memories is now a ±1/±2 spell-accuracy swing, not skill training). Read the current text before judging one.
- **Foundry actor JSON**: a spontaneous caster's heightened-known copies appear as duplicate spell items — the real rank is `system.location.heightenedLevel`, not `system.level.value`. Cantrips also store `system.level.value: 1` — check for the `cantrip` trait before counting a spell as a rank-1 repertoire pick (Needle Darts is a cantrip, not a slotted spell). Before flagging a feat as slotless or illegal, check granting feats' full text (e.g., dragonet Covet Hoard grants Hefty Hauler at 1 and Incredible Investiture at 11).
- **Archetype spontaneous casters get signature spells**: one from Basic Spellcasting benefits (6th), a second from Expert Spellcasting (12th).

## Build sheets — assume incomplete, don't audit for blanks

When Pax shares a Pathbuilder export or a build sheet, **treat missing fields as not-yet-filled-in, not as errors.** Equipment, runes, deity, languages, alignment, some feat slots, and attribute-boost routing are routinely blank because he's sketching the concept fast — not because he overlooked them or doesn't know they're required.

Do **not** list blanks as findings, flags, or "fixes before this is playable." It's noise, and he's said so directly. Analyze the build on what's actually there.

The one exception: if a blank genuinely changes the mechanical analysis (e.g. a class feature keys off the deity, or a damage number depends on a rune), state the assumption in a single clause — *"assuming +1 striking handwraps"* — and continue. Never make it a section, and never make it a to-do list.

## Archetype analysis — read the whole feat list, never just the Dedication

**When evaluating ANY archetype — multiclass, class archetype, mythic calling, or mythic destiny — pull its full feat list and read the payload feats before forming an opinion.** The Dedication is the entry fee, not the product, and it is routinely the weakest part of the archetype. Judging an archetype by its Dedication is the single most common way to give Pax a wrong answer.

Worked examples of the failure:
- **Mortal Herald**: the Dedication is a self-only 1/day Heal. The archetype's actual value is *Stand for the Fallen*, *Divine Presence*, *Flash of Omnipresence*, *Flash of Omnipotence*, and *Marked for Rebuke* — none visible from the Dedication.
- **Mythic destinies**: each is a full archetype with feats at 14/16/18/20. Ranking them off Dedication text alone is meaningless.
- **Staff Acrobat**: Dedication is a jump bonus; the reason to take it is *Whirlwind Stance* and *Staff Sweep*.

Also check, every time:
- **Dedications that grant things the character already has** are near-dead feats — e.g. Wrestler grants expert Athletics + Titan Wrestler, both worthless to a master-Athletics character who already took Titan Wrestler.
- **Prerequisites on the payload feats**, not just the Dedication. Whole branches die on a skill rank Pax doesn't have (expert Intimidation, master Stealth, master Diplomacy).
- **Whether the archetype's feats are reachable.** `Advanced [X]` feats set your effective class level to *half your character level*, so a level-8 class feat needs character level 16.

Enumerate before recommending. `node pf2e-lookup/pf2e-search.js --archetype` with no argument lists all 256; `--archetype "<name>"` prints one archetype's full feat list. Do not shortlist from memory — Pax has called this out explicitly ("you find like 3 archetypes that you have in your memory and then just go... for nothing").

## Interpretation discipline

When reviewing Pax's tactical or RP decisions in a session:

- **Decision-time info, not recap-time info.** Walk the transcript chronologically before flagging a play as bad. New enemy mechanics revealed by a hit are *discovery*, not "should have anticipated." If the lesson only exists because we now know how the encounter ended, it's hindsight, not critique.
- **Verify the encounter is actually live.** Don't call something a "tactical risk" if combat had already ended.
- **RP choices are not tactical errors.** If Pax tells you a call was a roleplay decision, it's not a bug. Note it as RP-driven and move on.
- **Default to fewer, sharper critiques.** It's better to land two real ones than to fill out a list with hedged or padding entries.

## Memory discipline

This project has a memory store at `~/.claude/projects/-home-nhanp-dnd-campaign-management/memory/`. Be selective:

- **Project files are the source of truth.** `character-sheet.md`, `progression.md`, `world.md`, `dynamics.md`, `tips.md`, and `sessions/*/recap.md` are authoritative for builds, in-fiction state, NPCs, and plot beats. Don't save memory that duplicates anything derivable from these files — read the files instead.
- **Save only what isn't in the files.** Cross-conversation context that genuinely needs to persist: stable user preferences, cross-session DM craft analyses, recap-generation rules, active campaign-status thresholds Pax has stated.
- **Don't save just because you were corrected.** A correction only justifies a memory if the underlying lesson is genuinely surprising and would generalize to future conversations. Most corrections are one-offs — acknowledge, adjust, move on. No "look I'm learning" theater.
- **Don't save ephemeral session-specific details.** Other PCs' stat blocks, this-session HP totals, single-encounter loot — all derivable from session files.
- **Verify before recommending from memory.** A memory naming a file path, NPC, or campaign should be checked against the current file tree before acting on it. Memories age; files are current.