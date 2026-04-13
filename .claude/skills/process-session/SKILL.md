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

### Step 2.5: Transcript Cleanup (subagent)

Spawn a **general-purpose subagent** to clean up the raw WhisperX transcript before generating the recap. Whisper has two persistent issues that the subagent fixes:

1. **Name mis-hearings** — Whisper mis-transcribes character/NPC names consistently (e.g. "Aesgor" → "Asgore", "A-score", "Acegor"; "Marzena" → "Marzipan"; "Siddhe" → "Cindy"/"City"/"Sidae"). These can be fixed with regex substitution.
2. **VAD over-segmentation** — the audio gets split into ~2-second chunks, which makes dialogue unreadable. Merging consecutive same-speaker segments into sentences dramatically improves readability.
3. **Heavily garbled passages** — occasional run-on transcription errors on dramatic player turns that should be rewritten by hand for later quoting.

Do NOT build this as a standing tool — run it as a fresh subagent invocation each session so the prompt can be tuned per campaign.

**Subagent prompt template** (fill in the campaign-specific bits):

```
You are cleaning up a raw WhisperX transcript of a D&D session for readability and name accuracy.

## Input
- Raw WhisperX JSON: /home/nhanp/dnd-campaign-management/dnd-transcription/transcripts/<transcript-name>.json
- 6 speakers (including DM), diarization is usually clean

## Speaker mapping (from step 2)
<list SPEAKER_XX → character name mapping>

## Canonical name fixes
Apply these as global substitutions. Add any variants you notice in the transcript:

<list canonical → [mishears] for this campaign. Pull from the campaign's dynamics.md.
For Raiders:
- Aesgor ← Asgore, A-score, Acegor, Isco, Elrath, Everett, Ace Gore
- Marzena ← Marzipan, Barzena, Morzana, Verzena, Marzetta, Marzina, Rosanna
- Tree-Hammer ← Treehammer, Tree Master, Tree Hammer, Free Hammer
- Hrolf ← Rolf, Ralph, Hralf, Haralf, Froff, Kral
- Siddhe ← Sidae, Sidhe, Cindy, Sude, City, C-Day, Sadu
- Gaynor ← Kynar, Ganor, Gainor, Gainer, Gaz
- Glug ← Gluck, Glog
- Kekel ← Keckel, Kekkel

For Icewind Dale:
- Avarath ← Elrath, Everett (overlap with Raiders — watch for context)
- Rune Ánstepa ← Rune
- Thors Ketterson ← Thors
- Kane Whitefang ← Kane
- Virel Talthrae ← Virel
- Rathis Nox ← Rathis
- Hrolf doesn't exist in Icewind Dale>

## Cleaning rules
1. **Name substitution** — replace all canonical variants in both speaker labels and dialogue text.
2. **VAD merge** — merge consecutive same-speaker segments when the previous one doesn't end in ./!/? AND the gap is < 1.5s, OR the gap is < 0.6s regardless.
3. **Drop pure filler** — standalone "uh", "um", "yeah", "okay" with no content. Keep substantive reactions like "Nice!", "Holy shit", "Oh my god".
4. **Strip in-sentence filler** — remove mid-sentence "uh"/"um" in segments >6 words; mark `[cleaned]`.
5. **Speaker reassignment — conservative.** Only reassign UNKNOWN segments to adjacent speakers. Do NOT aggressively reassign based on content cues; pyannote diarization is generally clean, and a prior false-positive rate of ~90% was observed on regex reassignment. When genuinely uncertain, leave it and note it in the report.
6. **Garbled passage rewrite** — if you spot 1-3 heavily-garbled dramatic moments (usually a player's turn with run-on filler), rewrite them by hand to be cleanly quotable. Mark `[cleaned]`.
7. **Do NOT invent content.** Mark unintelligible lines `[unclear]` and move on.

## Output
- `/tmp/transcript-cleaned-<campaign>-s<N>.txt` — plain text, one segment per line:
  `[MM:SS] SpeakerName: text [tags]`
- `/tmp/transcript-cleanup-report-<campaign>-s<N>.md` — report with segment counts, reassignments, conflicts, and garbled passages.

## Guardrails
- Be conservative. Quality > speed.
- Preserve every substantive line.
- Preserve chronology.
- Return a summary: segment counts, top 3 findings, confidence.
- **Per-character quotable lines**: For EACH player character (not just the loudest speakers), pull 3-5 of their best quotable lines with timestamps. Scan each character's lines individually — do not just skim the full transcript and pick whatever stands out first, because that biases toward high-volume speakers. Lower-volume speakers often have high-quality RP lines mixed in with mechanical/OOC chatter — dig for them.
```

Wait for the subagent's report, then use the cleaned transcript at `/tmp/transcript-cleaned-<campaign>-s<N>.txt` as the basis for the recap in Step 5. The cleaned transcript gives you better quotes and fewer name-variant errors.

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
<See Memorable Quotes guidelines below>

## Pax's Notes — <Character Name>'s Journal
<See Pax's Notes guidelines below>
```

**Memorable Quotes Guidelines:**
- Include **2-4 quotes per player character**. Every PC must be represented.
- Don't just pick comedic one-liners. Include a **mix** of:
  - In-character roleplay moments (personality, backstory, emotional beats)
  - Impactful combat callouts or tactical moments
  - Comedy/banter that actually landed at the table
  - NPC/DM lines that were significant (1-2 max)
- Each quote uses blockquote format with attribution and a context line:
  ```
  > **Character**: "Quote text"
  *Context — when/why this quote happened*
  ```
- For multi-line exchanges, group them under a single context line.
- Total: ~10-14 quotes per session (roughly one per 15-20 minutes of play).

**Pax's Notes Guidelines:**
This section is written from Pax's character's perspective — factual, terse, tactical. Not interpretive or literary. It captures what the character did, knows, thinks, and wants to find out.

Structure (always these four H3 subsections):
```markdown
## Pax's Notes — <Character Name>'s Journal

*Private notes, observations, and things to think about. Pax's notes only — not shared with the rest of the party.*

### What <Character> did this session
<Bullet list of key actions/decisions — factual, not embellished>

### Things <Character> knows that the party does not
<Secrets, private knowledge, things only this character noticed>

### What <Character> is thinking about
<Tactical considerations, strategic plans, character introspection>

### Open questions for next session
<Unanswered mysteries, things to follow up on>
```

Voice rules:
- **Factual and terse.** Short declarative sentences. No flowery prose.
- **Bold** key names/concepts. *Italics* for in-character quotes only.
- Match the voice from Raiders (Aesgor) and Icewind Dale (Avarath) recaps — direct, tactical, observational.
- Do NOT invent thoughts or motivations. Only include what is evidenced in the transcript.

### Step 5.5: Attribution Review (subagent)

Spawn a **general-purpose subagent** to review the generated recap.md against the cleaned transcript. The recap writer (main agent) has a demonstrated pattern of overriding correct transcript labels based on "vibes" and inventing satisfying-sounding moments that didn't happen. A separate reviewer catches these.

**Subagent prompt template:**

```
You are reviewing a D&D/PF2e session recap for attribution accuracy. Your job is to cross-check every claim in the recap against the cleaned transcript and flag errors.

## Inputs
- Cleaned transcript: /tmp/transcript-cleaned-<campaign>-s<N>.txt
- Generated recap: <campaign>/sessions/session-<N>-<MM>-<DD>-<YYYY>/recap.md
- Party roster: <campaign>/dynamics.md
- Campaign system: <D&D 5e | D&D 5.5e | PF2e Remastered>

## Review Checklist

For EVERY attributed action, spotlight bullet, and quote in the recap:

### 1. Class Feature Check
Does this action match the character's class? Cross-reference dynamics.md.
- Only Thaumaturges use Exploit Vulnerability
- Only Alchemists craft bombs/elixirs/mutagens
- Only Witches cast hexes
- Only Inventors use Overdrive / command constructs
- Only Clerics/divine casters use Channel Divinity / divine spells
- If a spotlight says "Character X identified the weakness" — verify X is the class that does that

### 2. Mechanical Check
Does this make system sense?
- Hero points are PERSONAL (PF2e) — you cannot spend yours on someone else's roll
- Rune transfers require a full day of downtime — did it actually happen or just get proposed?
- Spell slots are per-character
- Action economy: did the character have enough actions to do what's described?

### 3. Narrative Sequence Check
Did this event ACTUALLY HAPPEN, or was it proposed then deferred/cancelled?
- Read the FULL sequence in the transcript, not just the proposal
- "Let's do X" followed by "actually, let's do Y instead" means X did NOT happen
- A plan discussed but interrupted by a new mission = deferred, not completed

### 4. Speaker Content-Fit Check
Even if the transcript labels a line as SPEAKER_XX, does the CONTENT match?
- A line about "my craft" or grenades → probably the Alchemist, not the Fighter
- A line about "my wings" → probably the dragon/winged character
- A line referencing a specific class ability → belongs to that class's player
- Diarization sometimes merges the tail of one speaker into the next

### 5. Quote Ownership Check
For every memorable quote in the recap:
- Find the exact line in the cleaned transcript
- Verify the speaker label matches
- If the transcript says Speaker A but the content fits Speaker B, FLAG IT
- Do NOT assume the recap writer got it right — they have overridden correct labels before

### 6. Quote Distribution Check
Count quotes per character in the recap:
- Every PC must have 2-4 quotes — no exceptions
- If any PC has 0-1 quotes, scan that character's transcript lines individually for quotable moments
- Quotes should be a MIX: roleplay, combat, comedy — not all one type
- Do not let high-volume speakers crowd out lower-volume ones

### 7. Spotlight Proportion Check
Count spotlight bullets per character:
- Should be roughly equal (within ±2 bullets)
- No PC should consistently be the thinnest spotlight
- If a character has significantly fewer bullets, check if the transcript supports more

## Output

Write your review to: /tmp/recap-review-<campaign>-s<N>.md

Format:
### Errors Found
<List each error with: what the recap says, what the transcript shows, and the fix>

### Flagged — Needs User Confirmation
<List attributions that are ambiguous — include the transcript line and both possible interpretations>

### Quote Distribution
<Table: character → quote count, with suggestions for underrepresented characters>

### Spotlight Distribution
<Table: character → bullet count, with notes on balance>

### Missing Quotes for Underrepresented Characters
<For any PC with <2 quotes, provide 2-3 candidate quotes from the transcript with timestamps>

## Guardrails
- Be adversarial. Assume the recap has errors until proven otherwise.
- Every flagged item must cite a specific transcript timestamp.
- Do NOT rewrite the recap — just report findings. The main agent will fix.
- If something is genuinely ambiguous, say so and recommend asking the user.
```

After the subagent returns its review:
1. Fix all confirmed errors in the recap.
2. For flagged/ambiguous items, use **AskUserQuestion** to ask the user before committing.
3. Rebalance quotes and spotlights based on the distribution check.

**Do NOT proceed to HTML generation until all review items are resolved.**

### Step 5.6: Combat Review (subagent)

Spawn a **second general-purpose subagent** to review combat encounters specifically. The recap writer has a demonstrated pattern of collapsing multi-round combat into narrative summaries, merging actions from different rounds, inserting actions that never happened, and understating contributions. This subagent reconstructs the actual combat from the transcript and compares it against the recap.

**Run this in parallel with Step 5.5** — both review subagents are independent.

**Subagent prompt template:**

```
You are reviewing the combat encounters in a D&D/PF2e session recap for accuracy. Your job is to reconstruct what ACTUALLY happened round-by-round from the cleaned transcript, then compare it against what the recap claims.

## Inputs
- Cleaned transcript: /tmp/transcript-cleaned-<campaign>-s<N>.txt
- Generated recap: <campaign>/sessions/session-<N>-<MM>-<DD>-<YYYY>/recap.md
- Party roster: <campaign>/dynamics.md (includes class features and action abilities)
- Campaign system: <D&D 5e | D&D 5.5e | PF2e Remastered>

## Step 1: Reconstruct Each Combat

For every combat encounter in the transcript, build a round-by-round breakdown:

### Per Round, Per Character:
- **Initiative order** (who went when, including delays)
- **Each action** taken (action 1, action 2, action 3 — PF2e has 3 actions per turn)
- **Reactions** used (Attack of Opportunity, Goblin Scuttle, Shield Block, etc.)
- **Free actions** (Exploit Vulnerability rider, familiar abilities, etc.)
- **Hit/miss/crit** for every attack roll
- **Damage numbers** when stated by the DM
- **Conditions applied** (off-guard, frightened, enfeebled, stupefied, prone, etc.)
- **Hero point usage** — who spent them, on what roll, what the reroll result was
- **Enemy turns** — what enemies did, who they targeted, hit or miss

### Per Combat Summary:
- Total rounds
- Who landed the killing blow on each enemy (and how)
- Key tactical moments (flanking setups, condition stacking, clutch saves)
- Things that went wrong (missed attacks, failed saves, wasted actions)
- Who took damage and how much

## Step 2: Compare Against Recap

Read the recap's Combat Encounters section AND any combat mentions in Character Spotlight, Key Events, and Pax's Notes. Flag:

### Errors to check:
1. **Conflated rounds** — actions from different rounds described as one sequence
2. **Invented actions** — things described in the recap that never happened in the transcript (e.g., a Demoralize that was considered but not executed)
3. **Missing enemy turns** — "the enemy never got a turn" when it actually did
4. **Wrong kill attribution** — who actually landed the killing blow?
5. **Missing kills** — did a character kill multiple enemies but only get credit for one?
6. **Hero point omissions** — every hero point spent in combat must be noted
7. **Condition tracking** — were conditions (off-guard, frightened, etc.) correctly attributed to the right source?
8. **Damage numbers** — do the numbers in the recap match what the DM said?
9. **Action economy violations** — does the recap describe more actions than the system allows per turn?
10. **Round count** — does the recap say "quick 2-round fight" when it was actually 3 rounds?

## Output

Write your review to: /tmp/combat-review-<campaign>-s<N>.md

Format:

### Combat Reconstruction
<For each encounter: full round-by-round breakdown as described above>

### Recap vs Reality
<Table: what the recap says | what actually happened | severity (factual error / omission / minor)>

### Missing from Recap
<Important combat moments that the transcript shows but the recap doesn't mention>

### Suggested Combat Section Rewrite
<Provide a corrected version of the Combat Encounters section with round-by-round accuracy. Include per-character action sequences, hit/miss results, and enemy turns.>

## Guardrails
- Reconstruct from the transcript FIRST, then compare. Do not read the recap first — that biases you toward confirming it.
- Every claim must cite a transcript timestamp.
- If the transcript is ambiguous about round boundaries, note it and give your best reconstruction.
- Do NOT skip enemy turns. If an enemy acted, it must appear in the reconstruction.
- Track ALL hero point usage — these are mechanically significant and players care about them.
```

After the subagent returns its combat review:
1. Replace the Combat Encounters section with the corrected version.
2. Fix any combat-related errors in Character Spotlight, Key Events, and Pax's Notes.
3. If anything is ambiguous, use **AskUserQuestion** to confirm with the user.

**Do NOT proceed to HTML generation until both review subagents (5.5 and 5.6) are resolved.**

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
- Memorable quotes (2-4 per PC, mixed types)
- Pax's Notes — character journal section (styled per campaign style guide)
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
