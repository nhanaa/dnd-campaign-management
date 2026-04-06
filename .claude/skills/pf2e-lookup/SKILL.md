---
name: pf2e-lookup
description: Fast lookup of Pathfinder 2e Remastered rules data from local pf2e packs. Use when the user asks about PF2e spells, feats, items, equipment, conditions, creatures, classes, ancestries, actions, or any game rules. Also triggers on "look up", "what does X do", "find the spell", "check the feat".
---

# PF2e Rules Lookup

Look up PF2e rules from the local Foundry VTT data at `pf2e/` in the project root. Always read the actual JSON — never guess.

## Quick Start

Convert the name to kebab-case and read the file directly:

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

## Lookup Strategy

1. **Know the category** — spell, feat, item, condition, creature, etc.
2. **Go directly to the file** — kebab-case the name, read the JSON. Do NOT glob or grep first if you know the name.
3. **If unsure of exact name** — Glob with a partial pattern: `pf2e/spells/spells/*/{partial}*.json`
4. **If browsing** (e.g. "fighter feats at level 6") — list the directory: `pf2e/feats/class/fighter/level-6/`
5. **If searching by trait** — Grep the relevant directory: `Grep pattern="fire" path="pf2e/spells/spells/rank-3/"`

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
- Archetype feats are in `pf2e/feats/archetype/{archetype-name}/`
- Clean `@UUID[...]{Text}` references — show only the display text
- Try `pathfinder-monster-core/` before `pathfinder-bestiary/` for creatures
- There is also a search index at `pf2e-lookup/data/search-index.json` for fast filtered queries
