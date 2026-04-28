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

## Past-Session Pitfalls — read before every run

These are concrete errors that have happened in real sessions. Scan this list every time you generate a recap. If any of these patterns shows up in your draft, stop and fix it before continuing.

**Identity / pronouns:**
- **Mist is he/him.** Fairy Bard, Myrrindar. Don't infer pronouns from the name — read the character-sheet Backstory section and use those pronouns. Ask Pax for cameo NPC pronouns if not stated.

**Class-mechanic mismatches** (the diarization label is a *hint*, not authority — every quoted ability use must match the character's actual class):
- **Guidance** = Cleric / Druid / Artificer cantrip. If quoted on a Bard/Monk/Barbarian/Rogue/Fighter speaker, that's bleed — check the actual class list before attributing.
- **Spiritual Weapon, Cure Wounds, Channel Divinity, Mind Spike, Detect Magic ritual** = Cleric. Common bleed source onto Talya's bucket in Myrrindar (SPEAKER_05).
- **Heat Metal, Dissonant Whispers, Silvery Barbs, Healing Word, Bardic Inspiration, Vicious Mockery** = Bard (Mist's lane).
- **Guiding Bolt, Thorn Whip, Wild Shape, Starry Wisp** = Druid (Akasha's lane).
- **Elemental Strikes/Attunement, Flurry of Blows, Patient Defense, Deflect Missiles** = Monk (Talya's lane).
- **Rage, Reckless Attack, Savage Attacker, Divine Fury (Path of the Zealot)** = Barbarian (Loren).
- **Touch-spell suggestions / Inflict Wounds advice** = Pax (Mist) frequently offers cross-class spell knowledge — check who's actually speaking.
- **"Hadouken" coining** = Avon (a player joke, attributed to Avon in S5).

**High-roll / negotiation outcomes:**
- A high Persuasion roll plus a co-PC's "deal is a deal" refusal does NOT mean the high roll failed. Patrons frequently re-frame asks as separate parallel deals. Read the FULL exchange to the end of the scene before declaring an outcome.
- If a PC says "remember the X you promised" later in the scene, the X was won — don't frame it as a loss.

**Initiative & combat structure:**
- **Ask Pax for the Foundry/Roll20 initiative tracker screenshot** (or roll log) before reconstructing combat. The transcript's "who spoke when" is unreliable — DMs flex tie-breaks, mis-call turns, and abandon partial rounds when players join late.
- For late-joining cameo NPCs: "back at the top of the initiative" = restart from existing order with the new PC slotted at their actual roll. NOT a full re-roll. NOT "slotted at the top."
- Common bug: inverting two PCs at adjacent inits (Akasha 14 / Talya 10 → don't write Talya before Akasha).

**Damage numbers:**
- If a damage tick number is "unstated" in the transcript (e.g. Heat Metal sustain on the cast turn), ASK PAX rather than writing "unstated." He tracks his own damage.

**Quote selection:**
- Don't fill the Mist quote slots with tactical-only lines (Heat Metal plan, sustain narration, persuasion attempt). Mix in character voice — panic moments, covert RP, comedy, schemes. The cleanup report's per-character quotable list is a *menu*, not the answer; pick the lines that show character, not the lines that are easy to defend.
- Hard cap: 2-4 quotes per PC, 10-14 total. Count before finalizing.

**Subagent reports are inputs, not authority:**
- The cleanup, attribution-review, and combat-review subagents produce structured reports. Their outputs are advisory. The cleanup report explicitly flags caveats ("left as Talya but writer should double-check Cleric spells") — actually act on those caveats. Don't copy a quotable line from the report without verifying the speaker against transcript context.

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
- Hrolf doesn't exist in Icewind Dale

For Myrrindar:
**Characters / players:**
- Mist ← Miss, Mr., Myst, Mast, Mister
- Avon ← Avalon, Aven, Aaron, Avah, Avons, Aabon
- Akasha ← Acosta, Akoshu, Akashia, Akashu, Akasi, Acoshia
- Talya ← Talia, Tahlia, Tiia, **Kelly** (real S5 mishear — T→K substitution on "Talya's" → "Kelly's"), Tilly
- Loren ← Lauren
- Loren Lyster ← Loren Leister, Loren Lister
- Seerosaur ← Sirosaur, Cirosaur, Sero, Ciro

**NPCs / world:**
- Evrin ← Everin, Everett, Everin
- Vale Tempest ← Veiled Tempest, Vail Tempest, Vale Temptest
- Wardstone(s) ← Ward stone, War stone, Wardston
- Whisper Prism ← Whisper Prison, Whispering Prism, Wisper Prism
- Skybreeze ← Sky breeze, Sky-breeze, Sky brees
- Stillwind Lab ← Still Wind, Stillwind, Still-Wind
- Crowned Pheasant ← Crown Pheasant, Crowned Peasant
- Elias Whitmore ← Elias Whitmer, Eli Whitmore, Elias Witmore
- Carrie-Anne ← Carrie Ann, Cary Ann, Karianne, Carry Anne, Carry on (context-fragile — only when followed by Bahamut/priestess context)
- Bahamut ← Bahmut, Behmut, Bahomut
- Eldrin ← Eldren, Aldrin, Aldren
- Rufus Dawnstrider ← Rufus Donstrider, Roofus, Ruffus
- Neulvyn ← Newlvin, Newlivin, Newlivian, Nulvyn
- Sylvia Plath ← Silvia Plath, Sylvia Path

**Note on `Kelly` (Myrrindar-specific):** "Kelly" is *not* a character in this campaign. Whisper repeatedly mis-transcribes "Talya's" as "Kelly's" (especially possessive form). If you see "Kelly" anywhere in the transcript, it is a mishear — most often referring to Talya. Confirm context before substituting; if the line is the Talya player narrating Talya's reaction in third person, normalize to "Talya's."

**Tactical jargon mishears (any campaign):**
- save-or-suck ← Sable sucks, Sable suck, save or sock (5e/PF2e tactical phrasing meaning "save spell that punishes the target on a failed save"). Whisper consistently mishears "save-or-" as "Sable" because of the soft consonant blend.
- save-or-die ← Sable die, Save or dye
- save-or-lose ← Sable lose, Save or loose
- nat 20 / nat 1 ← natural 20, natural 1 (sometimes mishears as "Nat" name)
- AoO / OA ← attack of opportunity (frequently mishears as "AOA" or run-on "attack opportunity")
- AC ← AC (usually fine, but watch for "ACE" mishears in fast speech)>

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

### Step 4.5: Gather Session-Specific Facts from Pax

**Before generating the recap, ask Pax for the inputs you'll need.** Doing this upfront prevents the grind-back-through cycle of correcting a recap after the fact.

Use **AskUserQuestion** (not free-form text) and bundle these into a single question with multi-select:

1. **Initiative tracker screenshot** — Foundry/Roll20 init order if any combat happened. Treat as authoritative for round structure.
2. **Combat damage / HP tracking** — does Pax have a damage log or HP-per-round notes for any of the PCs (especially Mist)? If so, ask him to paste/screenshot it.
3. **Ambiguous moments** — anything from this session that was confusing in the moment, e.g. "Silas's teleport — DM intent?" or "What was Loren's full name?"
4. **Cameo NPC details** — pronouns, last names, anything not in dynamics.md.
5. **Anything Pax wants to make sure is captured** — high-impact moments he wants the recap to land correctly (his persuasion wins, his character beats, etc.). This is a deliberate carve-out — Pax has historically been under-represented in recaps; ask him directly what he wants emphasized.

If Pax says "skip / no extras," proceed. If he provides items, store them locally and reference them throughout Step 5.

### Step 5: Generate Session Recap (Markdown)

**Read the full picture before writing. Cheap shortcuts here turn into corrections you'll have to grind back through later.**

**Required reads before drafting:**
- The cleaned transcript at `/tmp/transcript-cleaned-<campaign>-s<N>.txt` — read it **end-to-end**, not just the per-character quote list from the cleanup report. The full linear read catches: (a) who said what in long exchanges, (b) negotiation re-framings, (c) class-mechanic bleed lines, (d) damage numbers you'd otherwise mark "unstated," (e) the iconic character moments that don't make the cleanup's quote list.
- The cleanup report's flagged caveats — these are not informational; they are **action items**. If the report says "left as Talya but writer should verify Cleric spell attributions," that's a directive to do a class-mechanic pass over Talya's quoted lines.
- The character sheet for every PC named in the recap — confirm pronouns, class features, and self-presentation notes from the Backstory section.

Before declaring outcomes, applying pronouns, or framing scenes:

1. **Pronouns and basic character facts** — read each PC's `<campaign>/character-sheet.md` Backstory/Personality sections to confirm pronouns and self-presentation. Do NOT default to gendered pronouns from name vibes (e.g. "Mist" sounds androgynous; the character sheet uses he/him). When in doubt about a cameo NPC's pronouns, ask Pax.

2. **High rolls and negotiation outcomes** — when a PC makes a high check (Persuasion, Insight, etc.) or any pivotal roll, **read the full in-fiction exchange** before framing the result. Patrons and NPCs frequently re-frame an ask as a *separate* deal (e.g. "I won't pay more for the original deal, *but* for a long-term contract a signing bonus is acceptable"). One PC's refusal to renegotiate one thread does NOT close other threads. The earliest "no" is often not the final word — keep reading until the scene actually ends.

3. **Initiative and combat structure** — if Pax can share the Foundry/Roll20 initiative tracker (screenshot or roll log), use it as the authoritative order. Do NOT infer init order from "who spoke when" in the transcript — DMs flex order on ties, mis-call turns, and abandon partial rounds when a player joins late. Ask Pax for the tracker if combat is ambiguous (per `feedback_dice_log.md`).

4. **Cameo / late-joining NPCs** — confirm whether the DM re-rolled initiative or just slotted them in at their actual roll. Check the transcript for the DM saying "back at the top of the initiative" (= restart from existing order) vs. "everyone re-roll" (= full re-roll). These produce very different round structures.

5. **Class features and mechanics** — every quoted casting/ability use should be matched to the character whose class supports it. Diarization mis-attribution is common; the transcript label is a hint, not ground truth. Cross-reference `<campaign>/dynamics.md` and `<campaign>/character-sheet.md` for class abilities.

Once you have the full picture, create `<campaign>/sessions/session-<N>-<MM>-<DD>-<YYYY>/recap.md` with:

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

**Hard caps (count before finalizing):**
- 2-4 quotes per PC. Every PC must be represented (≥2).
- 1-2 NPC/DM quotes max.
- **Total: 10-14 quotes**. Going over is a rule violation, not a stylistic choice.

**Selection rubric** — for each PC, pick quotes that span 2-3 of these facets (NOT all combat-tactical):
- (a) **Iconic character moment** — the one line that's unmistakably this PC. Often weird, covert, panicked, or emotionally specific.
- (b) **Combat / tactical** — one strong line tied to the round-by-round.
- (c) **RP / negotiation** — character voice in a social scene.
- (d) **Comedy / banter that landed at the table.**
- (e) **Plot beat / emotional weight** — a line that lands a story moment.

**Anti-patterns to avoid:**
- All-tactical Mist quotes. The cleanup report's quote list often skews tactical because tactical lines are easy to identify; the iconic-character-moment lines (panic, covert RP, schemes) require linear-reading the transcript and recognizing the *moment*, not the wording.
- Picking the easy/safe quote when a punchier line exists 30 seconds later.
- Picking quotes that all came from the same scene.

**Format:**
```
> **Character**: "Quote text"
*Context — when/why this quote happened*
```
Group multi-line exchanges under a single context line.

**Self-check before finalizing the section:**
1. Count total quotes. Cap is 14.
2. Count per PC. Each PC has 2-4. No PC has 0-1.
3. For each PC, list which facets (a-e) are covered. If a PC has only one facet (e.g. all tactical for Mist), swap one quote for a different facet.
4. Class-mechanic check: every quoted casting/ability mention matches the speaker's class.

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

### Step 5.4: Pre-Review Self-Audit (main agent — DO NOT SKIP)

**Before spawning the review subagents, run this audit yourself.** The review subagents catch errors but they cost time and you can pre-empt half of their findings with a 60-second checklist. Going through this catches the same class of errors that grind the user back through corrections after the fact.

For each item, scan the recap.md you just wrote:

1. **Pronoun pass:** Search for "her" and "she" in any line referring to a male PC; "him" and "he" referring to a female PC. Mist is he/him.

2. **Class-mechanic pass:** For every quoted casting / ability / feature, verify it matches the speaker's class:
   - Open `<campaign>/dynamics.md` and `<campaign>/character-sheet.md` side by side with the recap
   - For each quoted "I cast X" or "I use Y," ask: does this character actually have X/Y? If no, it's bleed — find the real speaker.
   - Common bleed: Cleric spells (Spiritual Weapon, Cure Wounds, Channel Divinity, Mind Spike, Guidance) on a Monk/Bard/Barbarian's bucket = Cleric speaker bled in.

3. **High-roll outcome pass:** For every Persuasion/Insight/Deception/Intimidation roll mentioned in the recap, search the cleaned transcript ±2 minutes around the roll. Read to the END of the scene. If the recap frames a high roll as a failure, double-check that the patron didn't carve out a separate parallel deal that succeeded.

4. **Initiative pass** (if there was combat): If you have the tracker screenshot from Step 4.5, verify every round's order against it. Specifically check adjacent-init pairs (e.g. Akasha 14 vs Talya 10 — they should NOT be inverted).

5. **Late-joiner placement:** Did anyone join combat partway through? Verify their actual init number, not "slotted at the top." Search the transcript for the DM's exact phrasing.

6. **Damage numbers pass:** If you wrote "damage unstated" or "tick number not announced" anywhere, ask Pax (he tracks his own damage) before locking the section.

7. **Quote section count + diversity:**
   - Count total quotes — must be 10-14.
   - Count per PC — each must have 2-4.
   - For each PC, list the facet (a-e) of each of their quotes. If all are the same facet (e.g. all tactical), swap one for a different facet.

8. **Cleanup-report-caveat pass:** Re-open the cleanup report. For every "left as Talya but writer should double-check..." style caveat, confirm you actually checked the affected lines.

If any item fails, fix it BEFORE running the review subagents. The reviewers should be catching subtle errors, not the basics.

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
- **Negotiation re-framing**: when one PC refuses to renegotiate one thread, the patron may explicitly carve out a *different* thread that another PC wins. Read past the first refusal to the actual end of the scene. Don't frame a successful high-roll outcome (e.g. Persuasion 25 winning a signing bonus tied to a long-term contract) as a failure just because a co-PC shut down a parallel renegotiation. Each thread resolves independently.

### 3a. Initiative & Round Structure Check
- The transcript's "who spoke when" is not the authoritative initiative order. DMs flex on ties, mis-call turns, and abandon partial rounds when players join late.
- If Pax can share the Foundry/Roll20 initiative tracker, use it as ground truth. Verify Akasha-vs-Talya ordering, late-joiner placement, and tie-breaks against the tracker before locking the combat reconstruction.
- For late-joining cameo NPCs: confirm whether the DM said "back at the top of the initiative" (= restart from existing order, slot the new PC at their actual roll) vs "everyone re-roll" (= full re-roll). Default to the former if ambiguous.

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
1. **The review is advisory, not authoritative.** Do not blindly apply fixes — verify each finding against the cleaned transcript yourself before changing the recap. The reviewer can also miss things or mis-suggest (e.g. propose attributing a Cleric line to Akasha when it's Avon).
2. Fix all confirmed errors in the recap.
3. For flagged/ambiguous items, use **AskUserQuestion** to ask the user before committing.
4. Rebalance quotes and spotlights based on the distribution check.
5. After applying fixes, re-scan for collateral damage: when you change one attribution, check that you didn't break a related sentence elsewhere (e.g. moving a quote from Talya to Avon may also require updating a spotlight bullet that references the same moment).

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
11. **Initiative order** — if the user can share a Foundry/Roll20 tracker screenshot, treat it as authoritative. The transcript "who spoke when" can mislead due to DM tie-flexing, mis-called turns, and abandoned partial rounds. Common mistake: inverting two PCs at adjacent inits (e.g. assuming Talya goes before Akasha when the tracker shows Akasha 14 and Talya 10).
12. **Late-joiner placement** — if a cameo NPC joins mid-combat, verify their actual init roll vs. assuming they were "slotted at the top." Listen for the DM saying "back at the top of the initiative" (= restart existing order, place new PC at their roll) vs "everyone re-roll" (= full re-roll).

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

**CRITICAL**: Do NOT delegate HTML generation to a subagent. Write it directly. Subagents consistently strip content and produce condensed versions that miss non-combat detail. The main agent must write the HTML itself.

**Reference template**: Before writing, read the most recent existing `recap.html` in `<campaign>/sessions/` to use as the structural reference. Copy its CSS verbatim and match its HTML element structure exactly — same class names, same nesting, same component patterns.

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

#### HTML Structure (match exactly)

The HTML must be a single self-contained file. Copy the CSS from the reference recap.html verbatim — do not create new classes or rename existing ones. The following documents the required structure using the Hellbreakers campaign as the canonical example. Other campaigns should follow the same patterns with their own style-guide colors.

**1. Header** (`header.header`)
- Sparkle via CSS `::before` pseudo-element (NOT an explicit `<span>`)
- `<h1>` with session title (Cinzel Decorative)
- `.subtitle` div — gold, italic, 17px, font-weight 500
- `.meta-row` with `.meta-pill` spans for date, system, duration, in-game date

**2. Session Composition Bar**
- `.composition-bar` flex container with `.comp-seg` divs (`.comp-combat`, `.comp-rp`, `.comp-explore`, `.comp-social`, `.comp-loot`)
- `.composition-legend` with `.legend-dot` spans

**3. Party Cards**
- `.party-grid` (CSS grid, `repeat(auto-fill, minmax(240px, 1fr))`)
- `.char-card` with character-specific class (`.char-baijian`, `.char-cyrathul`, etc.) for left border color
- Inner divs: `.char-name`, `.char-class`, `.char-player`

**4. Session Summary**
- `.summary` div wrapping `<p>` tags (NOT `<br><br>`)
- Full narrative paragraphs from the recap.md Session Summary section

**5. Timeline** (MOST IMPORTANT — this is where subagents consistently fail)
- `.timeline` div with `border-left: 2px solid var(--border)`
- Each act is a `.act` div with type class (`.combat`, `.rp`, `.explore`, `.social`, `.mystery`)
- Timeline dot via `::before` pseudo-element, colored by type
- `.act-label` div — JetBrains Mono, uppercase, e.g. "Act I · Combat · The Warehouse"
- `.act-card` div — card background with full content inside:
  - `<h3>` title for the act
  - `<ul><li>` bullet lists with **ALL key events** from that act
  - Include character names in `<strong>`, quotes in `<em>`, XP awards
  - **Every act must have 4-8 detailed bullet points** — NOT a one-line summary
  - The timeline is the narrative backbone. If it's thin, the whole recap feels empty.

**6. Combat Encounters**
- `.combat-box` with rose left border
- `.combat-meta` div — JetBrains Mono, uppercase
- `.combat-stats` grid — dark inner panel (`#160f12`) with stat label/value pairs
- `<h4>` for each round header (e.g. "Round 1 — Swabbies Neutralized")
- `<ul><li>` for each character's actions per round, with `<strong>` names
- Include hit/miss/crit, damage numbers, conditions, hero points
- Post-combat XP in gold-colored `<p>`

**7. Character Spotlight**
- `.spotlight-grid` (single column)
- `.spotlight` divs with character class (`.s-baijian`, `.s-cyrathul`, etc.)
- `<h4>` with character name + epithet (e.g. "Bai Jian · the Measured Blade")
- `<ul><li>` with all spotlight bullets from recap.md

**8. Loot**
- `.loot-grid` (CSS grid, card layout — NOT a `<table>`)
- `.loot-item` divs, with `.magical` class for magic items
- Inner divs: `.loot-name`, `.loot-source`, `.loot-note`
- `.xp-banner` after the grid — inline format: `Experience · X encounter1 · Y encounter2 = <strong>Z XP each</strong>`

**9. Memorable Quotes**
- `<blockquote>` elements (NOT divs)
- `<strong>` for speaker name, quote text in italic (inherited from blockquote)
- `<span class="attribution">` for context line

**10. Open Threads**
- `.threads` div wrapping a `<ul>`
- Custom `➤` bullet via `li::before` in rose color
- `<strong>` for thread names

**11. Pax's Notes**
- `<section class="pax-notes">` (NOT a div inside a section)
- CSS for `.pax-notes` in a separate `<style>` block at the BOTTOM of the file (after content, before `</div></body>`)
- `.pax-intro` paragraph with dashed border-bottom
- `<h3>` for each subsection in amber/gold
- `<ul><li>` for all bullet points

**12. Cliffhanger** (if session ends on one)
- `.cliffhanger` div with rose border, gradient background
- `.label` span, `<p>` description, `.big-line` in Cinzel Decorative, `.speaker` span

#### Content Completeness Checklist

Before finishing the HTML, verify:
- [ ] Every act in the timeline has 4+ bullet points (not one-line summaries)
- [ ] All combat rounds are present with per-character actions
- [ ] All quotes from recap.md are included
- [ ] All spotlight bullets are included
- [ ] All loot items are included
- [ ] All open threads are included
- [ ] All Pax's Notes subsections and bullets are included
- [ ] The file renders correctly with no missing CSS classes

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
