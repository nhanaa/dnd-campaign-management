---
name: pf2e-lookup
description: Fast lookup of Pathfinder 2e Remastered rules data from local pf2e packs. Use when the user asks about PF2e spells, feats, items, equipment, conditions, creatures, classes, ancestries, actions, or any game rules. Also triggers on "look up", "what does X do", "find the spell", "check the feat".
---

# PF2e Rules Lookup

Look up PF2e rules from the local data. Always use the CLI search script first — never guess.

## Lookup Strategy

**Always start with the CLI script.** It searches a pre-built index of 18,010 entries and is faster than reading individual JSON files.

1. **Use the CLI script first** — covers all lookup needs: name search, filtering, browsing.
2. **Fall back to direct JSON** — only if the CLI script lacks detail you need (e.g., complex nested data, spell effects, or fields not in the index).
3. **Fall back to Glob/Grep** — only if the CLI and direct file access both fail to find what you need.

## CLI Search Script (Primary Method)

```bash
# Search by name (with full details)
node pf2e-lookup/pf2e-search.js fireball -d

# Search by name (compact list)
node pf2e-lookup/pf2e-search.js fireball

# Filter: arcane fire spells rank 1-3
node pf2e-lookup/pf2e-search.js -c spells -t arcane -l 1-3 --trait fire

# All feats available to a class (includes shared/metamagic feats)
node pf2e-lookup/pf2e-search.js -c feats --class sorcerer -l 1-2

# Feats by ancestry trait
node pf2e-lookup/pf2e-search.js -c feats --trait kitsune

# Remaster arcane cantrips
node pf2e-lookup/pf2e-search.js -c spells -l 0 -t arcane --remaster

# Browse all conditions with descriptions
node pf2e-lookup/pf2e-search.js -c conditions -d

# Equipment: martial weapons
node pf2e-lookup/pf2e-search.js -c equipment --eq-type weapon --trait martial

# Spells by save type
node pf2e-lookup/pf2e-search.js -c spells -t primal -s reflex

# Archetype: full entry INCLUDING its "Additional Feats" list
node pf2e-lookup/pf2e-search.js --archetype archer

# List all 256 archetypes
node pf2e-lookup/pf2e-search.js --archetype

# Run with --help for all options
node pf2e-lookup/pf2e-search.js --help
```

## Archetypes — always use `--archetype`

⚠️ **The search index does not contain archetype "Additional Feats."** Many archetypes
grant feats from *other* classes at *adjusted levels* — and those grants exist only in
`pf2e/journals/archetypes.json`, never in the index or in `pf2e/feats/archetype/<name>/`.

Filtering by subcategory or trait returns a tree that **looks complete and isn't**:

```bash
# WRONG — returns only the archetype's own feats, silently missing the rest
node pf2e-lookup/pf2e-search.js -c feats --subcat archer

# RIGHT
node pf2e-lookup/pf2e-search.js --archetype archer
```

Worked example: Archer's Additional Feats grant **Double Shot at 6th** (normally a
4th-level Fighter feat), **Triple Shot at 8th**, **Multishot Stance at 18th**, and
**Impossible Volley at 20th**. None appear under `--subcat archer`. A feat taken this
way **loses the granting class's trait** (an Archer's Double Shot is not a fighter feat).

Consequence: never conclude "that archetype can't take X" or "X is <class>-exclusive"
from an index query alone. Check `--archetype` first.

**Filters (combinable):**
| Flag | Description | Examples |
|------|-------------|---------|
| `-c, --cat` | Category | `spells`, `feats`, `equipment`, `conditions`, `actions`, `creatures`, `ancestries`, `classes`, etc. |
| `-l, --level` | Level or range | `3`, `1-5`, `0` (cantrips) |
| `-t, --trad` | Spell tradition | `arcane`, `divine`, `occult`, `primal` |
| `--class` | Class trait (for feats) | `sorcerer`, `fighter` — finds ALL feats the class can take |
| `--trait` | Trait filter (comma-sep) | `fire`, `healing`, `kitsune`, `martial` |
| `-r, --rarity` | Rarity | `common`, `uncommon`, `rare`, `unique` |
| `-s, --save` | Spell save | `fortitude`, `reflex`, `will` |
| `-a, --act` | Action cost | `1`, `2`, `3`, `free`, `reaction`, `passive` |
| `--eq-type` | Equipment type | `weapon`, `armor`, `shield`, `consumable` |
| `--subcat` | Subcategory (folder) | `cantrip`, `focus`, `general` |
| `--archetype` | Full archetype entry **+ Additional Feats** | `archer`, `eldritch archer`; omit value to list all |
| `--remaster` | Remaster only | |

**Output:**
| Flag | Description |
|------|-------------|
| `-d, --detail` | Full description and stats |
| `--no-desc` | With `-d`, show stats only (skip description text) |
| `-n, --limit` | Max results (default 20) |
| `--json` | Raw JSON output |

## Direct File Access (Fallback)

Only use when the CLI detail view (`-d`) doesn't have enough info (e.g., you need the full raw JSON with nested spell effects or complex equipment runes).

Convert the name to kebab-case and read the file:

```
# Spell → pf2e/spells/spells/{rank-N or cantrip}/{name}.json
Read pf2e/spells/spells/rank-3/fireball.json

# Feat → pf2e/feats/{class|archetype|general|skill|ancestry}/{subdir}/{name}.json
Read pf2e/feats/class/fighter/level-2/lunge.json

# Equipment → pf2e/equipment/{name}.json
Read pf2e/equipment/longsword.json

# Condition → pf2e/conditions/{name}.json
Read pf2e/conditions/frightened.json

# Creature → pf2e/pathfinder-monster-core/{name}.json
Read pf2e/pathfinder-monster-core/adult-red-dragon.json
```

For the full directory map and JSON field reference, see [reference.md](reference.md).

## Presenting Results

Strip HTML tags from descriptions. Always include:

- **Name**, **level/rank**, **traits**, **source book**
- **Spells**: casting time, range, area, save, damage, duration, heightened
- **Feats**: prerequisites, action cost, level
- **Equipment**: price, bulk, damage (weapons), traits
- **Conditions**: full mechanical description
- **Creatures**: level, HP, AC, key abilities

## Guidelines

- Cantrips are at level 0 in the index, stored in `pf2e/spells/spells/cantrip/`
- Archetype feats: use `--archetype <name>`. `pf2e/feats/archetype/{name}/` holds only the
  archetype's *own* feats — the Additional Feats list lives in `pf2e/journals/archetypes.json`
- `pf2e/journals/` also holds other rules text the index omits (e.g. archetype spellcasting
  benefit tables). Grep it before going to the web for a rules question
- Use `--class` (not `--subcat`) to find all feats a class can take — `--subcat` only checks the folder
- Clean `@UUID[...]{Text}` references — show only the display text
- Try `pathfinder-monster-core/` before `pathfinder-bestiary/` for creatures
