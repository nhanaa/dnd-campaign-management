---
name: process-session
description: Process a DnD/PF2e session recording into a transcribed, diarized recap with HTML visualization and markdown notes. Use when the user says "process session", "session recap", or provides a session audio file to transcribe. Triggers on /process-session.
---

# Process Session

End-to-end pipeline: transcribe a session recording, generate a styled HTML recap and markdown session notes, then propose updates to the campaign's world.md and dynamics.md.

## Usage

```
/process-session <campaign> <audio-file> [--speakers N] [--session-number N]
```

**Arguments:**
- `<campaign>` — Campaign folder name: `korvosa`, `myrrindar`, `icewind-dale`, `raiders`
- `<audio-file>` — Filename in the recordings directory (`/mnt/c/Users/nhanp/Videos/`), or a full path
- `--speakers N` — Number of speakers (players + DM). Optional, improves diarization accuracy.
- `--session-number N` — Session number. If omitted, auto-detect from existing session folders.

## Pipeline Steps

### Step 1: Transcribe

Run the transcription pipeline:

```bash
source dnd-transcription/.venv/bin/activate
python dnd-transcription/transcribe.py <audio-path> --min-speakers <N> --max-speakers <N>
```

- Audio files are in `/mnt/c/Users/nhanp/Videos/` by default
- If the file is just a filename (no path), prepend the default directory
- Output goes to `dnd-transcription/transcripts/`

### Step 2: Speaker Identification

After transcription completes, show the user a sample of each speaker's dialogue (first 2-3 lines per speaker) and ask them to map SPEAKER_XX labels to character/player names.

Use the campaign's `dynamics.md` to show the expected party roster for reference.

### Step 3: Determine Session Number and Folder

- Check `<campaign>/sessions/` for existing session folders
- Auto-increment session number, or use `--session-number` if provided
- Create folder: `<campaign>/sessions/session-<N>-<MM>-<DD>-<YYYY>/`
- Date comes from the transcript metadata or today's date

### Step 4: Read Campaign Context

Before generating the recap, read these files for context:
- `<campaign>/dynamics.md` — Party composition, roles, relationships
- `<campaign>/world.md` — World lore, storyline, NPCs, previous events
- `<campaign>/character-sheet.md` — The user's character details
- `<campaign>/style-guide.md` — Visual theme for HTML (if it exists)

### Step 5: Generate Session Recap (Markdown)

Create `<campaign>/sessions/session-<N>-<MM>-<DD>-<YYYY>/recap.md` with:

```markdown
# Session <N> Recap — <Session Title>

**Date**: <date>
**System**: <system>
**Duration**: <duration>

---

## Party

| Character | Class | Player |
|-----------|-------|--------|
| ... | ... | ... |

## Session Summary
<2-3 paragraph narrative summary>

## Key Events
<Chronological list of major plot points, organized by scene/act>

## Character Spotlight
<Per-character notable actions, organized by character name>

## Combat Encounters
<For each combat: enemies, key rolls, dramatic moments>

## Loot
<Table of items found, gold, equipment changes>

## Open Threads
<Unresolved plot hooks, cliffhangers, things to follow up>

## Memorable Quotes
<Notable/funny quotes with attribution>
```

### Step 6: Generate HTML Visual

Create `<campaign>/sessions/session-<N>-<MM>-<DD>-<YYYY>/recap.html`

**Style Guide**: If `<campaign>/style-guide.md` exists, use its color palette, fonts, and component specs. If not, use a sensible default dark theme.

**Readability Principles** (always apply):
- Display/decorative fonts ONLY for the main h1 title
- All other headings and body use a clean, readable sans-serif font
- Heading weight: 600 (semibold)
- `--text-dim` must pass WCAG AA contrast (4.5:1 minimum)
- Max content width: 860px
- Line height: 1.7 for body text
- Paragraph spacing: 12px minimum
- List item padding: 8px vertical minimum

**HTML sections** (match the structure from the markdown but with visual enhancements):
- Header with campaign/system info
- Session composition bar (combat/exploration/roleplay/puzzle/loot breakdown)
- Party cards with character colors from style guide
- Timeline with color-coded event types
- Character spotlight cards
- Loot grid (magical items highlighted)
- Memorable quotes
- Open threads / cliffhanger

### Step 7: Propose Campaign File Updates

After generating the recap, propose updates to:

1. **`<campaign>/world.md`** — Add new NPCs, locations, lore, story developments
2. **`<campaign>/dynamics.md`** — Update party status, NPC relationships, plot threads

**Important:** Do NOT auto-write these updates. Instead:
- Show the user the proposed additions as a diff
- Ask for confirmation before writing
- Only add genuinely new information (don't duplicate what's already there)

## Output Summary

When complete, report:
- Transcript location (JSON + SRT)
- Session recap location (MD + HTML)
- Proposed updates to world.md and dynamics.md (show inline, await approval)

## Error Handling

- If transcription fails, report the error and stop
- If no style-guide.md exists for the campaign, note this and use a default theme
- If speaker mapping is ambiguous, ask the user to clarify
