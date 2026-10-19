# foundry-mcp

Local MCP server (and CLI) that drives a **local** Foundry VTT world through a headless GM client.
Foundry has no server-side document API — every write goes through a logged-in client's socket —
so this launches its own headless Chrome, joins the world as the GM user, and calls the Foundry/PF2e
APIs in that page. Local test worlds only; never point it at a hosted game.

## Tools
- `foundry_status` — start the server if it's down, log in, report world/system/variants/actors
- `foundry_get_actor` — compact actor summary (ABC, attributes, HP/AC/saves, skills, feats + slots, gear, spells, focus)
- `foundry_add_items` — add compendium items in order, answering PF2e choice prompts from `answers`
- `foundry_import_pathbuilder` — build a character from a Pathbuilder 2e JSON export
- `foundry_update_actor`, `foundry_delete_items`, `foundry_run_script` (escape hatch)

## Choice prompts
PF2e ChoiceSets open a prompt that blocks creation. Answers are keyed by the prompting item's name,
value = choice label; use `A|B` for items that prompt more than once (e.g. `Deity (Champion)` asks for
the deity, then sanctification). The Pathbuilder importer also answers from the build itself
(specials, child feats, key attribute, weapons). **Anything unanswered is cancelled and reported — it
never hangs**; re-run with the listed answers.

## Importer notes
- Attributes are set in **manual mode** (exact final modifiers), so gradual boosts don't matter.
- Free-archetype / ancestry-paragon feats become bonus feats if the world has no slot for them.
- Runed armor is invested; focus spells and the focus pool come from the export's `focus` block.
- Weapons Pathbuilder treats as proficient but Foundry leaves untrained (e.g. Unconventional
  Weaponry, which has no rule elements) get a `MartialProficiency` rule.

## CLI
    node foundry-mcp/cli.mjs status
    node foundry-mcp/cli.mjs actor "Bai Feng"
    node foundry-mcp/cli.mjs import-pathbuilder build.json --replace --answer "Deity (Champion)=Shizuru"

Config via env: `FOUNDRY_URL`, `FOUNDRY_USER`, `FOUNDRY_PASSWORD`, `FOUNDRY_WORLD`, `FOUNDRY_APP`,
`FOUNDRY_DATA`, `CHROME_PATH` (defaults: localhost:30000, Gamemaster, sovael-testing, ~/foundryvtt,
~/foundrydata, agent-browser's Chrome).
