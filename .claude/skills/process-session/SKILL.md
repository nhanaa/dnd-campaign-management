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

## Foundational Principle: Capability-Constrained Attribution

**The transcript is not gospel. Whisper hallucinates, misattributes, and conflates. Pyannote diarization splits one speaker into multiple labels and merges multiple speakers into one. The rolls log Pax pastes is a global dump, not a per-speaker log — attribution must be back-derived.**

Every attribution in the recap (a spell cast, a skill check, a damage number, a quote, a kill credit) must satisfy **all five capability tests** below. If even one fails, the attribution is wrong — find the actual character. Do **not** paper over with hedge phrases ("X deadpans an offer to cast Y" when X can't cast Y).

### The five capability tests

1. **Can this character actually do this thing?** — Cross-reference `<campaign>/character-sheet.md` and `<campaign>/dynamics.md`. A Rogue cannot cast Calm Emotions. A Barbarian does not have Channel Divinity. A Sorcerer is not trained in Battle Medicine without Medic Dedication. *If the attributed character lacks the class feature, feat, item, or skill, the attribution is wrong.*

2. **Does the math match?** — The Foundry/Roll20 rolls log records the stat modifier breakdown (e.g. "Intelligence +2, Expert +8, Pendant +1, 1d20 + 11"). That fingerprint identifies the roller. Compare the modifier components against each PC's character sheet. *Example: a Lore check rolled at INT +2 / Expert +8 cannot be a PC whose char sheet has INT 10 / no Lore training. The roll belongs to someone else.*

3. **Is the character physically able right now?** — Track HP and conditions across the encounter. A PC at 2 HP cannot take 5 damage and "save" — they would have dropped. A character who's currently Restrained can't reposition. *If the attributed action requires capability the character has been actively stripped of, re-check the target.*

4. **Is this their lane?** — The party's dynamics.md assigns explicit roles (RK lane, healing lane, off-guard generation, infiltration, etc.). When the recap attributes an action that belongs to another PC's designated lane, treat it as suspect. *Example: if dynamics.md says "Riddle carries spirit/undead RK," then a Recall Knowledge attribution on Mo (no Lore training, INT 10) is wrong — Riddle did it.*

5. **Does this match their voice?** — Players have RP fingerprints. Third-person self-reference ("Mo's gonna..."), distinctive phrasings ("not a lot of visitors here. Not a lot of visitors here."), preferred jargon, gallows humor patterns. A line that doesn't match the character's established voice in 5+ sessions is likely misattributed.

### Why the transcript misleads

- **Whisper mishears proper nouns** as common phrases ("Kugaptee" → "cook of tea") that then get treated as "the table canonized" jokes. They didn't. The mishear is a transcription artifact, not a real beat.
- **Whisper mis-attributes speakers** when two voices have similar register. The speaker label is a hint; the *content* of the line is the truth.
- **Pyannote diarization** can split one speaker across SPEAKER_00 + SPEAKER_03 (especially if their cadence shifts), or merge two speakers into one SPEAKER_xx. Check segment counts against expected player count; investigate any discrepancy.
- **The rolls log is global, not per-speaker.** Pax pastes the whole Foundry dump. Attribution-by-proximity ("Mo got the 96 gp callout, so Mo also rolled the Boneyard Lore check next to it") is wrong — back-derive from stat fingerprints.

### When ambiguous: ask, don't guess

If after running the five capability tests an attribution is still ambiguous between two PCs, use **AskUserQuestion** rather than picking. The cost of a wrong attribution (Pax has to correct it, sometimes multiple times) is much higher than the cost of one extra question.

### Concrete error patterns this prevents (illustrative, not exhaustive)

- Attributing a divine spell to a non-divine-caster PC (the spell exists in the transcript, but the speaker label is wrong).
- Crediting a Lore-skill Earn Income roll to the wrong PC because their name was nearby in the DM's narration.
- Attributing a high-damage hit to the PC with the loudest dice reaction when the actual damage roll math fits another PC's weapon.
- Putting a kill credit on the PC who did the "softening" hit when another PC actually rolled the finishing blow.
- Putting Recall Knowledge or a system-specific knowledge action on a PC whose stats and party lane both rule them out.
- Inventing a "running joke" out of a Whisper mishear that was never actually said at the table.

The reviewer subagents in Steps 5.5 and 5.6 enforce these tests systematically. The main agent's Step 5.4 pre-audit catches them before the reviewers run.

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

**Step 0 — Build the capability matrix.** Before the per-item checks, write out (in your head or scratch space) a one-row-per-PC table covering each PC's: class + key features, primary spell list / tradition (if any), trained skills, key items currently held (especially items that grant rolls or innate spells), stat fingerprint (the modifier components that would appear in their rolls log entries: e.g. STR/DEX/CON/INT/WIS/CHA + proficiency tier per skill), and explicit lane assignment per dynamics.md. **This matrix is your reference for all subsequent attribution checks.** It takes about 2 minutes and prevents the entire class of errors covered in the Foundational Principle section.

For each item below, scan the recap.md you just wrote:

1. **Pronoun pass:** Search for "her" and "she" in any line referring to a male PC; "him" and "he" referring to a female PC. Mist is he/him.

2. **Class-mechanic pass:** For every quoted casting / ability / feature, verify it matches the speaker's class against your capability matrix:
   - For each quoted "I cast X" or "I use Y," ask: **does this character actually have X/Y?** If no, it's bleed — find the real speaker.
   - **Class-contradiction = misattribution, not flavor.** If you wrote "Mo deadpans an offer to cast Calm" and Mo is a no-spellcaster Rogue, the line isn't Mo's — it's the actual divine caster's. Don't hedge ("deadpans," "jokingly offers," "who has no spellcasting") to paper over the conflict. Fix the speaker.
   - Common bleed: divine spells on a martial PC's bucket; class-specific actions (Channel Divinity, Flurry of Blows, Spellstrike, Rage, Hex) on the wrong class.

3. **Roll-fingerprint pass:** For every skill check or roll quoted in the recap (especially Earn Income, Recall Knowledge, Lore checks), cross-check the roll modifier against the attributed PC's character sheet:
   - The Foundry/Roll20 rolls log Pax may paste records the modifier breakdown verbatim (e.g. "Intelligence +2, Expert +8, item bonus +1, 1d20 + 11"). The fingerprint identifies the actual roller.
   - If the rolls log says "INT +2 / Expert in Boneyard Lore" but the attributed PC has INT 10 and no Boneyard Lore training, **the attribution is wrong** — find the PC whose sheet matches the fingerprint.
   - Pax's pasted rolls log is a **global dump**, not a per-speaker log. Do not attribute rolls to a PC just because their name appeared nearby in the DM's narration (e.g. don't assume "Mo gets 96 gp" means Mo rolled every Earn Income check in that block).

4. **Lane-discipline pass:** For each attributed action, check whether dynamics.md assigns that action's lane to a different PC. If it does, default to the lane-owner unless the transcript is unambiguous otherwise. *Example: if dynamics.md says "Riddle carries spirit/undead RK," don't credit Mo (no Lore training, INT 10) with the Recall Knowledge unless the transcript is explicit that Mo rolled it.*

5. **High-roll outcome pass:** For every Persuasion/Insight/Deception/Intimidation roll mentioned in the recap, search the cleaned transcript ±2 minutes around the roll. Read to the END of the scene. If the recap frames a high roll as a failure, double-check that the patron didn't carve out a separate parallel deal that succeeded.

6. **Initiative pass** (if there was combat): If you have the tracker screenshot from Step 4.5, verify every round's order against it. Specifically check adjacent-init pairs (e.g. Akasha 14 vs Talya 10 — they should NOT be inverted).

7. **HP-state plausibility pass:** For each attributed damage event in combat, check whether the attributed target could physically survive it given their HP coming in. A PC at 2 HP who "saves" a 12-damage Phantom Pain didn't take that hit — re-check the target. A PC who took a "5 mental, no persistent" save outcome wasn't dropped to 2 HP by it. This pass catches transposed Phantom Pain / Heat Metal / similar single-target spell targets.

8. **Late-joiner placement:** Did anyone join combat partway through? Verify their actual init number, not "slotted at the top." Search the transcript for the DM's exact phrasing.

9. **Damage numbers pass:** If you wrote "damage unstated" or "tick number not announced" anywhere, ask Pax (he tracks his own damage) before locking the section.

10. **Quote section count + diversity:**
    - Count total quotes — must be 10-14.
    - Count per PC — each must have 2-4.
    - For each PC, list the facet (a-e) of each of their quotes. If all are the same facet (e.g. all tactical), swap one for a different facet.

11. **Cleanup-report-caveat pass:** Re-open the cleanup report. For every "left as Talya but writer should double-check..." style caveat, confirm you actually checked the affected lines.

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

## Step 0 (REQUIRED before reviewing) — Build the capability matrix

Before scanning any recap claim, **read all PC character sheets and the dynamics.md** and build a one-row-per-PC matrix in your scratch space covering:

- Class + key class features (e.g. "Rogue (Thief) — Sneak Attack, Surprise Attack, Nimble Dodge")
- Spell tradition + spell list (if any) — divine / occult / arcane / primal. **A no-spellcaster PC cannot cast spells.**
- Trained skills + proficiency tier per skill (Trained / Expert / Master / Legendary)
- Stat fingerprint (STR/DEX/CON/INT/WIS/CHA modifiers) — these will appear in any rolls log Pax pastes
- Key items currently held (especially items that grant rolls, innate spells, or bonuses — e.g. "Pendant of the Occult held by X")
- Explicit lane assignment per dynamics.md (RK lane, healing lane, infiltration, off-guard generation, etc.)

**This matrix is your reference for every check below.** Reviews that skip this step generate false-positives and miss real errors.

## Review Checklist

For EVERY attributed action, spotlight bullet, and quote in the recap, run the **five capability tests** (from the Foundational Principle section of the skill):

### 1. Capability Check — Can this character actually do this thing?
Cross-reference the matrix:
- A PC without spellcasting cannot cast spells. A character offering to "cast Calm" is not the no-caster PC.
- A class-specific ability belongs to that class. Examples (system-agnostic): channel-divinity-style features = divine caster; sneak-attack precision damage = Rogue / Investigator-style class; flurry / monastic stance abilities = Monk; bardic-inspiration-style features = Bard.
- An item-granted ability (e.g. "innate Guidance from Pendant of the Occult") belongs to the holder of that item.
- **Class-contradiction = misattribution.** Don't accept the speaker label when it conflicts with capability. Find the actual speaker.

### 2. Roll-Fingerprint Check — Does the math match?
For any skill check, attack roll, or save with a stated modifier in the recap or rolls log:
- Decompose the modifier (e.g. "1d20 + 11" with breakdown "Intelligence +2, Expert +8, Pendant +1").
- Match the components to the PC whose sheet fits: INT 14 + Expert in this skill + holds the relevant item.
- **If the fingerprint doesn't match the attributed PC, the attribution is wrong.** Find the PC whose sheet matches.
- **The rolls log Pax pastes is a global dump, not a per-speaker log.** Do not attribute a roll to a PC just because their name appears nearby in narration.

### 3. Class Feature / Mechanic Sanity Check
Does the action make system sense?
- Hero points are personal (PF2e) — you cannot spend yours on someone else's roll.
- Rune transfers require a full day of downtime — was the in-fiction time available?
- Spell slots are per-character.
- Action economy: did the character have enough actions to do what's described?
- Status bonuses don't stack (PF2e) — Bless and Inner Upheaval both giving +1 status to attacks means only one applies. Don't double-count.

### 4. Lane Discipline Check
For each attributed action, ask: **does dynamics.md assign this action's lane to a different PC?** If yes, default to the lane-owner unless the transcript is unambiguous otherwise.
- Example pattern: if dynamics.md says "PC X carries the spirit/undead Recall Knowledge lane," then RK attributions on other PCs need transcript proof. Don't credit a different PC just because their name is nearby in the rolls log.
- Healing attributions belong to designated healers unless the transcript is explicit.
- Infiltration / scout actions belong to the stealth specialist unless the transcript is explicit.

### 5. HP-State Plausibility Check
Track each PC's HP across the encounter from the transcript. For each attributed damage event, ask: **could this PC physically survive this hit given their HP coming in?**
- A PC at 2 HP cannot "save" a 12-damage Phantom Pain — they would have dropped to 0 or below. The target was someone else.
- A PC who's currently Restrained / Grabbed / Stunned cannot take the action attributed.
- A character whose damage outcome was "5 mental, no persistent" (a successful save) was not the one brought low by that same hit — those are mutually exclusive states.
- **This pass catches transposed targets** on single-target spells like Phantom Pain, Heat Metal, Inflict Wounds.

### 6. Speaker-Content-Fit Check (Whisper / pyannote distrust)
Even if the cleaned transcript labels a line as a particular speaker, **does the content match the named PC?** The diarization label is a hint, not the truth.
- **Whisper mishears proper nouns** as ordinary phrases (the campaign deity's name → some common phrase). Don't canonize a Whisper artifact as a "table running joke" — verify with the user before treating the mishear as in-fiction.
- **Whisper invents plausible-sounding content** that wasn't said — be skeptical of any line that doesn't match the speaker's known voice patterns.
- **Pyannote diarization splits one speaker** across multiple SPEAKER_xx labels when their cadence shifts, and merges multiple speakers into one when voices are similar. Check segment counts against the expected player count.
- A line about a specific class ability belongs to that class's player, regardless of the diarization label.
- A line in a distinctive RP voice (doubled phrases, third-person self-reference, characteristic jargon) belongs to that PC's player.
- **If the speaker label conflicts with content, content wins.** Find the actual speaker.

### 7. Narrative Sequence Check
Did this event ACTUALLY HAPPEN, or was it proposed then deferred/cancelled?
- Read the FULL sequence in the transcript, not just the proposal.
- "Let's do X" followed by "actually, let's do Y instead" means X did NOT happen.
- A plan discussed but interrupted by a new mission = deferred, not completed.
- **Negotiation re-framing**: when one PC refuses to renegotiate one thread, the patron may explicitly carve out a *different* thread that another PC wins. Read past the first refusal to the actual end of the scene. Don't frame a successful high-roll outcome as a failure just because a co-PC shut down a parallel renegotiation. Each thread resolves independently.

### 7a. Initiative & Round Structure Check
- The transcript's "who spoke when" is not the authoritative initiative order. DMs flex on ties, mis-call turns, and abandon partial rounds when players join late.
- If Pax can share the Foundry/Roll20 initiative tracker, use it as ground truth. Verify adjacent-init pairs, late-joiner placement, and tie-breaks against the tracker before locking the combat reconstruction.
- For late-joining cameo NPCs: confirm whether the DM said "back at the top of the initiative" (= restart from existing order, slot the new PC at their actual roll) vs "everyone re-roll" (= full re-roll). Default to the former if ambiguous.

### 8. Quote Ownership Check
For every memorable quote in the recap:
- Find the exact line in the cleaned transcript.
- Verify the speaker label matches AND the content fits the matrix (capability + voice).
- If the transcript says Speaker A but the content fits Speaker B per the matrix, **trust the matrix, not the label**. The recap writer has overridden correct labels before.

### 9. Quote Distribution Check
Count quotes per character in the recap:
- Every PC must have 2-4 quotes — no exceptions.
- If any PC has 0-1 quotes, scan that character's transcript lines individually for quotable moments.
- Quotes should be a MIX: roleplay, combat, comedy — not all one type.
- Do not let high-volume speakers crowd out lower-volume ones.

### 10. Spotlight Proportion Check
Count spotlight bullets per character:
- Should be roughly equal (within ±2 bullets).
- No PC should consistently be the thinnest spotlight.
- If a character has significantly fewer bullets, check if the transcript supports more.

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
- **The transcript is not gospel. Whisper is not accurate.** Whisper mishears proper nouns ("Kugaptee" → "cook of tea"), invents plausible-sounding content, and pyannote diarization misattributes speakers regularly (especially when voices have similar register). **The capability matrix you built in Step 0 is stronger evidence than the speaker label.** When they conflict, trust the matrix.
- **Don't canonize Whisper artifacts.** If a "running joke" in the recap is actually a Whisper mishear of an in-fiction name, flag it as a transcription artifact, not a real beat.
- Be adversarial. Assume the recap has errors until proven otherwise.
- Every flagged item must cite a specific transcript timestamp AND the capability test that fails.
- Do NOT rewrite the recap — just report findings. The main agent will fix.
- **When an attribution is ambiguous between two PCs, flag for user confirmation rather than guessing.** A wrong guess costs the user a correction cycle; a flag costs one question.
- Do NOT hedge known errors. If a Rogue is attributed casting a spell, the answer is "the speaker is the actual caster, not the Rogue" — never "Mo deadpans an offer to cast Calm" or similar paper-over language.
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
- PC character sheets in <campaign>/ (typically `character-sheet.md` for Pax's PC; others may have separate files or be summarized in dynamics.md)
- Campaign system: <D&D 5e | D&D 5.5e | PF2e Remastered>

## Step 0 (REQUIRED before reconstructing) — Build the capability matrix

Before touching the transcript, **read all PC character sheets and the dynamics.md** and build a one-row-per-PC matrix in your scratch space:

- Class + key class features (especially damage-relevant: Sneak Attack, Spellstrike, Flurry of Blows, etc.)
- Weapons + runes/properties (e.g. "+1 Crushing Rapier, d6 piercing, Deadly d8")
- Spell tradition + spell list (if any). **A no-spellcaster PC cannot cast spells. Don't attribute spells to them no matter what Whisper says.**
- Trained skills + proficiency tier
- Stat fingerprint (STR/DEX/CON/INT/WIS/CHA) — these appear in rolls log entries
- Key items currently held (especially items granting innate spells or roll bonuses — e.g. "Pendant of the Occult: +1 Occultism + innate Guidance, held by Mo")
- HP at session start + AC
- Hero point count entering the session (returning PCs typically 1; new PCs typically 2; recap-presenter may get +1)
- Lane assignment per dynamics.md (RK lane, healing lane, off-guard generation, infiltration, frontline tank, etc.)

**Every attribution you make in the reconstruction must be consistent with this matrix.** If a transcript line says "PC X cast Phantom Pain" but PC X has no occult spellcasting, find the actual caster. If the rolls log shows "INT +2 / Expert in Boneyard Lore" but no PC in the matrix has that fingerprint, flag it — the roll might be from an NPC, an item, or a PC sheet you don't have access to.

## Step 1: Reconstruct Each Combat

For every combat encounter in the transcript, build a round-by-round breakdown:

### Per Round, Per Character:
- **Initiative order** (who went when, including delays)
- **Each action** taken (action 1, action 2, action 3 — PF2e has 3 actions per turn; 5e has 1 action + 1 bonus action + movement)
- **Reactions** used (Attack of Opportunity, Goblin Scuttle, Shield Block, etc.)
- **Free actions** (Exploit Vulnerability rider, familiar abilities, etc.)
- **Hit/miss/crit** for every attack roll
- **Damage numbers** when stated by the DM
- **Conditions applied** (off-guard, frightened, enfeebled, stupefied, prone, etc.)
- **Hero point usage** — who spent them, on what roll, what the reroll result was. **Distinguish hero point rerolls from Foundry low-reroll automation** — they are different mechanics. Hero points are explicitly stated ("I hero point that"); Foundry low-rerolls fire automatically when a roll falls below a threshold and are not the same as a player spending a hero point.
- **Enemy turns** — what enemies did, who they targeted, hit or miss
- **HP state per PC** — track HP across the rounds. A PC at low HP who "saves" a damaging hit didn't take that hit; re-check the target.

### Per Combat Summary:
- Total rounds
- Who landed the killing blow on each enemy (and how)
- Key tactical moments (flanking setups, condition stacking, clutch saves)
- Things that went wrong (missed attacks, failed saves, wasted actions)
- Who took damage and how much

## Step 2: Compare Against Recap

Read the recap's Combat Encounters section AND any combat mentions in Character Spotlight, Key Events, and Pax's Notes. Flag:

### Errors to check:
1. **Capability misattributions** — every quoted ability, spell, or feature must match the named PC's capability matrix. A divine spell quoted on a no-spellcaster PC = misattribution, find the actual caster. A class-specific feature on the wrong class = misattribution.
2. **Roll-fingerprint mismatches** — attack rolls, damage rolls, and skill checks with stated modifiers must match the attributed PC's stat fingerprint. If "Mo's Overwhelming Combination crit for 44 damage" decomposes to weapon dice + sneak attack + Crushing rune that all fit Mo's sheet, attribution is correct. If a 44-damage Stumbling Swing crit is attributed to a Monk who doesn't have Crushing rune on their Handwraps, re-check the source.
3. **HP-state impossibilities** — a PC at 2 HP who "saves" a 12-damage Phantom Pain didn't take that hit; check who the actual target was. A PC currently Grabbed cannot Stride. A PC who used a Reaction this round cannot Shield Block as another Reaction unless they have multi-reaction features.
4. **Conflated rounds** — actions from different rounds described as one sequence. Watch especially for round-3 actions getting duplicated into a fabricated round-4.
5. **Invented actions** — things described in the recap that never happened in the transcript (e.g., a Demoralize that was considered but not executed; a Strike that was rolled but not connected).
6. **Missing enemy turns** — "the enemy never got a turn" when it actually did.
7. **Wrong kill attribution** — who actually landed the killing blow? The PC who softened a target is not the killer; the PC whose final hit dropped it is.
8. **Missing kills** — did a character kill multiple enemies but only get credit for one?
9. **Hero point omissions or over-counts** — every hero point spent in combat must be noted, but Foundry low-reroll automation is NOT a hero point spend. Distinguish carefully: explicit "I hero point that" = spent; automatic reroll on low result = Foundry feature, not hero point.
10. **Condition tracking** — were conditions (off-guard, frightened, etc.) correctly attributed to the right source? Status-bonus stacking rules apply (don't double-count two same-type bonuses).
11. **Damage numbers** — do the numbers in the recap match what the DM said? Don't invent specific damage numbers when the DM said "barely alive" or similar narrative-only descriptions; mark them as unstated and ask the user.
12. **Action economy violations** — does the recap describe more actions than the system allows per turn? PF2e is 3 actions + 1 reaction; 5e is 1 action + 1 bonus action + 1 reaction + movement. Free actions and reactions don't count against the action total.
13. **Round count** — does the recap say "quick 2-round fight" when it was actually 3 rounds?
14. **Initiative order** — if the user can share a Foundry/Roll20 tracker screenshot, treat it as authoritative. The transcript "who spoke when" can mislead due to DM tie-flexing, mis-called turns, and abandoned partial rounds. Common mistake: inverting two PCs at adjacent inits.
15. **Late-joiner placement** — if a cameo NPC joins mid-combat, verify their actual init roll vs. assuming they were "slotted at the top." Listen for the DM saying "back at the top of the initiative" (= restart existing order, place new PC at their roll) vs "everyone re-roll" (= full re-roll).
16. **Damage attribution swaps** — when a "softened then finished" sequence happens (PC A does big damage, PC B kills), make sure the big damage stays with PC A in the recap, not transposed to PC B. The transcript will usually have the DM saying "let me combine both of that into N damage" right after the killing PC's hit — that N belongs to the *attacker who rolled*, not the next speaker.

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
- **The transcript is not gospel. Whisper is not accurate.** Whisper mishears proper nouns, invents plausible-sounding content, and the cleaned transcript's speaker labels are based on pyannote diarization that misattributes regularly. **Capability + roll-fingerprint + HP-state plausibility are stronger evidence than the speaker label.** When they conflict, trust the capability matrix, not Whisper.
- **Build the capability matrix (Step 0) before doing anything else.** If you skip it, your reconstruction will have the same misattributions the recap has.
- **Cross-check every roll modifier against PC sheets.** The rolls log Pax pastes is global, not per-speaker — back-derive attribution from stat fingerprints, not from text proximity.
- Reconstruct from the transcript FIRST, then compare. Do not read the recap first — that biases you toward confirming it.
- Every claim must cite a transcript timestamp.
- If the transcript is ambiguous about round boundaries, note it and give your best reconstruction.
- Do NOT skip enemy turns. If an enemy acted, it must appear in the reconstruction.
- Track ALL hero point usage — distinguish from Foundry low-reroll automation, which is NOT a hero point.
- **When ambiguous between two PCs, flag for user confirmation rather than guessing.** Guessing wrong costs the user a correction cycle; asking costs one question.
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
