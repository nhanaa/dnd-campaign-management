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
| `korvosa/` | Pathfinder 2e Remastered | Korvosa | Frozen Wind Kitsune — Draconic Sorcerer (Rime) |
| `myrrindar/` | D&D 5e (2024 PHB) | Myrrindar — Winds of Warding | Fairy Bard (Mist) |
| `icewind-dale/` | D&D 5.5e (2024 PHB) | Rime of the Frostmaiden | Eladrin Paladin (Avarath Solvane) |
| `raiders/` | D&D 5e (2014 PHB) | Raiders of the Serpent Sea (Grimnir) | Tuss — Discovery Domain Cleric (Aesgor) |
| `hellbreakers/` | Pathfinder 2e Remastered | Hellbreakers — Rise Up Isger | Tian Human Dragonblood — Dueling Fighter (Bai Jian) |

## How to Help

- **Build discussions**: When discussing builds, reference specific feats, spells, and class features by name. Consider action economy and party synergy.
- **System accuracy**: Be precise about which system (5e vs PF2e Remastered) rules apply. Do not mix rules between systems.
- **Progression planning**: When planning levels, lay out feat/spell choices level by level.
- **Session processing**: Use `/process-session <campaign> <audio-file>` to transcribe recordings and generate session recaps (MD + HTML). The skill handles transcription, speaker mapping, recap generation, and proposes updates to world.md and dynamics.md.
- **World file**: `world.md` tracks the campaign storyline, world-building, NPCs, and locations. Updated after each session.
- **Style guides**: Each campaign can have a `style-guide.md` defining the HTML recap theme. Copy `style-guide-template.md` from the project root to create one.
- **Tactics**: Focus on action economy, spell slot efficiency, and positioning.
- **Ask Question Tool**: Use it regularly to help aid with thinking and asking questions about what Pax thinks.

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