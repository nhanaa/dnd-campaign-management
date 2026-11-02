# GM Toolkit — reusable tools and lessons for running games in Foundry

Built while prepping **Five Toe Cove** (PF2e level 1 one-shot for friends coming from 5e/BG3, Oct 2026).
Everything here is meant to carry over to the next game Pax runs.

| Path | What |
|------|------|
| `foundry-macros/gm/fade-out-music.js` | Fades whatever music is playing over 4 s for everyone, then stops it |
| `foundry-macros/gm/ask-for-a-check.js` | Opens PF2e's Check Prompt Generator (skill/save + level DC ± difficulty, simple DC, or custom) |
| `gm-toolkit/foundry-module/` | Source for the **Pax's GM Toolkit** Foundry module (macros compendium) + `build-pack.cjs` |
| `gm-toolkit/music/loop_tool.py` | Turns a soundtrack file into a seamless intro + loop pair of OGGs |
| `map-maker/` | Code-drawn SVG battlemaps (exact grid, any resolution, walls JSON) for APs and homebrew when no map exists. See its README |
| `gm-toolkit/map-catalog/` | Catalogue of the Battle Maps Collection (Matthew.W): `CATALOG.md` lists every map by place, setting and use. Visual version: `_Catalog/index.html` inside the collection folder. Art stays out of git. |

---

## Starting a new world (checklist)

1. **Create the world.** System pf2e. Enable: *Pax's GM Toolkit*, Workbench, PF2e HUD, Toolbelt, Dailies, Dice So Nice (+ libWrapper, socketlib). For `map-maker` maps no module is needed: `node map-maker/export-foundry.js <map>`, then Create Scene → right-click → Import Data → the `.foundry-scene.json` (secret doors, see-through portcullises and lights included).
   Drag *Fade out music* and *Ask for a Check* from the **Pax GM Toolkit: Macros** compendium to the hotbar.
2. **Users.** Two GM users: **Pax** (you) and **Gamemaster** (left for the Foundry MCP). Foundry allows one session per user, so sharing one seat kicks someone out.
3. **Import the adventure**, then fix its scenes (see *Imported adventures* below).
4. **Title scene** players load into (see *Landing page*). Activate it before players join.
5. **Music**: playlists per mood, linked to scenes (see *Music*).
6. **Read-aloud journal** (see *Writing table text*).
7. **Treasure** as loot actors + unidentified items (see *Treasure*).

---

## Foundry v14 lessons

### Imported adventures (third-party modules)
- Scenes arrive with **navigation off**: only Foundry's blank default scene shows in the top bar. Turn navigation on, give them short `navName`s, set `navOrder`.
- **Thumbnails point at the author's own world** (`worlds/<their-world>/assets/...`) and show blank. Regenerate with `scene.createThumbnail()` + upload.
- **Check the grid against the art.** Filenames like `[30x30] ... .jpeg` give squares; divide image pixels by squares. Five Toe Cove's art was 140 px/square but the scenes were set to 100.
- **Pax prefers more room than the art's own grid**: 1.5 squares per drawn square (grid = art px ÷ 1.5, e.g. 93 for 140-px art). Re-snap tokens after changing the grid; walls/lights are in pixels and stay aligned.
- Placed lights can be **zero-radius placeholders**, and "night" maps may still have global light on. Check before assuming a scene is dark.
- Things the module text describes (e.g. a Wall of Force) may not exist on the map at all. Grep the walls.

### Scene building quirks
- **Background colour lives on the scene's level** in v14 (`scene.levels[0].background.color`, update via `updateEmbeddedDocuments("Level", …)`), not `scene.backgroundColor`.
- **Tiles are positioned by their centre** (texture anchor 0.5), not top-left.
- `scene.createThumbnail()` **omits drawings/text**. For a title scene, screenshot it and use a crop as the thumbnail.
- An **invisible barrier** (Wall of Force) = a wall with `door: 2` (secret, GM-only), `ds: 0`, `move: 20`, `sight/light/sound: 0`. Players see through it, can't open it; GM clicks to drop it.
- Core title font: **Modesto Condensed**; body: **Signika**.

### PF2e system features worth using
- **Check Prompt Generator** (`game.pf2e.gm.checkPrompt()`): improvised checks for players.
- **Loot actors** (`type: "loot"`, default ownership Observer) for chests players can open. Keep reward caches off-map with ownership None and move items in at the table.
- **Unidentified items**: set `system.identification.status = "unidentified"` and `unidentified.name/img/data.description` → players see e.g. *Wine Bottle: "Positively bright and healing"* until identified.
- **Elite/Weak adjustments** (`actor.applyAdjustment("elite")`). Elite on a level −1 creature made it **level 1** (+2 levels), which changes its XP more than you'd expect.
- Unlinked token edits (adjustments, extra items) affect only that token. Edit the world actor to change all copies.

### Operating notes (for Claude driving Foundry)
- **Don't reload the MCP's page** (it drops the MCP's in-page hook). To pick up module changes, `game.logOut()` instead; the next MCP call logs back in fresh.
- `PlaylistSound` updates from the headless MCP page throw *"game audio is unlocked"*. The update still saves; verify by re-reading.
- New modules are only discovered at **server start**. Restart the server, then enable the module in the world.
- Kill Foundry by the PID listening on port 30000 (`ss -ltnp | grep :30000`). `pgrep -f` matches its own shell, and the process name is `node-MainThread`.
- To screenshot what a player sees without moving the GM's view: make a temporary Assistant-GM user, log in with headless `agent-browser`, `scene.view()`, screenshot, log out, delete the user.

---

## Music

### Format and loudness
- **OGG (Vorbis)** for anything that loops; MP3 has encoder padding that stutters at the loop point. MP3 is fine for one-shot tracks.
- **Normalize every track to −16 LUFS.** Favourite soundtracks come from different albums mastered 6 dB+ apart; without this, the boss theme blasts or vanishes.
- Trim leading/trailing silence. Keep source files; never ship WAV/FLAC (every player downloads the file).
- Start playlist volumes around **0.5**; fights a bit higher (~0.7). Dense battle mixes can sound quieter at equal LUFS.
- When replacing a file, **use a new filename** so browsers don't play a cached old version.

### Loops
- Most battle/town tracks have an intro and a composer's fade/ending. Split them: **`-1-intro.ogg`** (plays once, `repeat: false`) → **`-2-loop.ogg`** (`repeat: true`) in a *sequential* playlist.
- **Set `fade: 0` on both sounds.** Foundry fades a sound *in from silence* whenever it starts if fade > 0, which dips the music right at the intro→loop hand-off. It also fades non-repeating sounds out early. Then end them with the **Fade out music** macro (plain Stop cuts a fade-0 sound dead).
- Single-track moods (no intro) can use a normal playlist fade (2 s) to crossfade between scenes.
- **What Pax liked:** loop start right *after* a section break, on the downbeat; loop end at the **natural end of the phrase**, even into the start of the composer's fade, instead of cutting mid-phrase. Lead with that, and send a seam preview before calling it done.

### loop_tool.py workflow
```
PY=dnd-transcription/.venv/bin/python        # has numpy + scipy
T="track.mp3"
$PY -I gm-toolkit/music/loop_tool.py analyze "$T"
#   read the envelope: intro swell, quiet breaks, where the fade starts
$PY -I gm-toolkit/music/loop_tool.py find "$T" --a <downbeat after break> --b-range <start> <before fade> --mode post
#   --mode post: the track repeats its own section (common in game OSTs). A B that beats
#                the printed "A vs A+4s" reference is a real repeat.
#   --mode pre : B sits just before an ending/cadence; matches what leads into A and B.
#   Without --a it searches A too (--a-range).
$PY -I gm-toolkit/music/loop_tool.py refine "$T" --a A --b B
#   snaps to drum hits; pick the crossfade whose seam jolt is <= the natural jolt at B
$PY -I gm-toolkit/music/loop_tool.py build "$T" --a A --b B --name boss --out-dir <dir> --intro-start 1.0 --xfade-ms 30
$PY -I gm-toolkit/music/loop_tool.py simple "outro.mp3" --start 0.9 --end 70 --out outro.ogg
```
Put files in `Data/audio/<adventure>/music/` and send Pax the `-seam-preview.mp3` (copy to `C:\Users\nhanp\Music\...`).
The tool can measure a seam but can't *hear* it; Pax's ear is the final check.

Five Toe Cove results for reference: town theme had its own repeat (21.49→120.31 s, post mode); spider fight looped 36.62→99.48 s (pre mode, rhythm match 1.1); the finale needed Pax's ear: 23.3 s → 137.3 s, length snapped to whole 2-s bars.

---

## Encounter building (PF2e)

- **XP per creature vs party level:** −4: 10 · −3: 15 · −2: 20 · −1: 30 · 0: 40 · +1: 60 · +2: 80 · +3: 120 · +4: 160.
  Budgets for 4 PCs: Trivial 40 · Low 60 · Moderate 80 · Severe 120 · Extreme 160; each PC more/less shifts by 10/20/20/30/40.
  Source: GM Core *Combat Threats*, https://2e.aonprd.com/Rules.aspx?ID=2716 (verified 2026-10-30).
  *(I mis-stated this table once during prep. Look it up, don't recall it.)*
- **Creature benchmarks** (perception, AC, saves, HP, strike, spell DC by level): GM Core *Building Creatures*, https://2e.aonprd.com/Rules.aspx?ID=2874
- Back up a stat block before rebuilding it (copy into an "Originals (backup)" folder).
- **Pax's design taste:**
  - Boss spells should be **offensive and dramatic**, not defensive stalling (cut Nimble Dodge, Mirror Image, Blur). Two-reaction bosses add little.
  - Bosses need **mooks** to split the party's attention; one can be Enlarged.
  - One-shots: **no gold** (players can't spend it). Convert all treasure to **items**, and pick items after seeing the PCs. Stronger PCs = more room to push encounters.
  - Reward NPC interaction (tiered rewards for 1/2/3 helpful actions).
  - Order the dungeon so the **boss is last**; locks/keys should make narrative sense (key holder guards the door before it).
- **Teaching 5e players:** give **one** enemy Reactive Strike in a Moderate fight, describe its guard stance, and explain afterwards that most PF2e monsters *don't* have it. Use secret checks for lies (Perception covers Sense Motive). Call out degrees of success when improvising.

## Writing table text

Pax's preferred format, settled after two rewrites:
- **Read-aloud = spoken description**, like a GM talking: what's there, where it is, how big it is, what it sounds and smells like. Detailed. **Not** literary prose.
- **Notes = short bullets and tables**: "If the PCs…", tactics by situation, music cues (🎵), skill DCs.
- Tone can switch by section (Five Toe Cove: goofy until the boss room, then played straight, with music to sell the shift).
- Mark undecided things as **[TBD] / "your call"**. Don't decide for him.
- Make a one-screen **cheat sheet** page (music cues, changes from the module).

## Landing page
A 1920×1080 gridless scene, dark level background, the module's banner as a centred tile, title text as a Drawing in Modesto Condensed, a subtitle, `tokenVision: false`, `navOrder: 0`, and a title/town playlist that autoplays.

## Remote hosting (planned, not finished)
- Host: AWS Lightsail **Convene-VM** (us-east-2, 2 vCPU / 2 GB, Ubuntu 24.04, Node already installed), reached via **Tailscale** (`convene`). Only SSH is public.
- Copied to `/home/ubuntu/foundryvtt` + `/home/ubuntu/foundrydata` (world, PF2e, modules). **Not yet:** systemd service (needs Pax's OK), license key, user passwords, `Data/audio`, this toolkit module.
- Plan: systemd service on port 30000 → **Tailscale Funnel** for a public HTTPS link (no Lightsail ports). Stop Convene during sessions if memory is tight (~1.1 GB free).
- Sync prep from local with `rsync` of the world + `Data/audio` + modules, with local Foundry stopped.
