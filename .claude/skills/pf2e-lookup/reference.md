# PF2e Data Reference

## Directory Map

All paths relative to project root `pf2e/`.

| Category | Path | Structure |
|----------|------|-----------|
| Spells | `spells/spells/{rank-N,cantrip}/` | `{name}.json` by rank |
| Focus Spells | `spells/focus/` | Subfolders by class |
| Rituals | `spells/rituals/` | `{name}.json` |
| Equipment | `equipment/` | Flat `{name}.json` |
| Feats — Class | `feats/class/{class}/level-{N}/` | `{name}.json` by class & level |
| Feats — Archetype | `feats/archetype/{archetype}/` | `{name}.json` by archetype |
| Feats — Ancestry | `feats/ancestry/{ancestry}/` | `{name}.json` by ancestry |
| Feats — General | `feats/general/` | `{name}.json` |
| Feats — Skill | `feats/skill/` | `{name}.json` |
| Feats — Mythic | `feats/mythic/` | `{name}.json` |
| Classes | `classes/` | `{class}.json` |
| Class Features | `class-features/` | Flat `{name}.json` |
| Ancestries | `ancestries/` | `{ancestry}.json` |
| Heritages | `heritages/{ancestry}/` | `{heritage}.json` by ancestry |
| Ancestry Features | `ancestry-features/` | `{name}.json` |
| Backgrounds | `backgrounds/` | `{name}.json` |
| Conditions | `conditions/` | `{name}.json` |
| Actions | `actions/{category}/` | basic, skill, class, exploration, downtime, etc. |
| Deities | `deities/` | Subfolders by pantheon + flat files |
| Hazards | `hazards/` | `{name}.json` |
| Vehicles | `vehicles/` | `{name}.json` |
| Familiar Abilities | `familiar-abilities/` | `{name}.json` |
| Creatures — Core | `pathfinder-monster-core/`, `pathfinder-monster-core-2/` | `{name}.json` |
| Creatures — Bestiary | `pathfinder-bestiary/`, `-2/`, `-3/` | `{name}.json` |
| NPC Gallery | `npc-gallery/` | `{name}.json` |

## File Naming

All filenames are kebab-case:
- "Fireball" → `fireball.json`
- "Power Attack" → `power-attack.json`
- "Abadar's Flawless Scale" → `abadars-flawless-scale.json`

## JSON Structure

```json
{
  "name": "Display Name",
  "system": {
    "description": { "value": "<p>HTML rules text</p>" },
    "level": { "value": 3 },
    "traits": { "value": ["trait1"], "rarity": "common" },
    "publication": { "title": "Source Book" }
  }
}
```

### Spell-Specific Fields

- `system.time.value` — casting actions ("1", "2", "3")
- `system.range.value` — range text
- `system.area` — `{ type, value }` (e.g. burst, 20)
- `system.defense.save` — `{ statistic, basic }` (e.g. reflex, true)
- `system.damage` — object with formula + type per entry
- `system.duration` — `{ value, sustained }`
- `system.heightening` — heightened effects
- `system.traits.traditions` — `["arcane", "primal"]`
- `system.cost.value` — material costs

### Equipment-Specific Fields

- `system.price.value` — `{ gp, sp, cp }`
- `system.bulk.value` — bulk number
- `system.damage` — `{ dice, die, damageType }` (weapons)
- `system.category` — martial, simple, etc.
- `system.group` — weapon group
- `system.runes` — potency, property runes

### Feat-Specific Fields

- `system.actionType.value` — "action", "free", "reaction"
- `system.actions.value` — action count (1, 2, 3)
- `system.prerequisites.value` — array of prereq objects
- `system.frequency` — usage limits

### Creature-Specific Fields

- `system.attributes.hp.max` — hit points
- `system.attributes.ac.value` — armor class
- `system.details.level.value` — creature level
- `system.abilities` — ability scores (str, dex, etc.)
- `system.skills` — skill modifiers

## Search Index

A pre-built search index exists at `pf2e-lookup/data/search-index.json` with compact records for all 18,010 entries. Use it for filtered queries:

```javascript
// Structure: { meta: { categoryCounts, traits, sources }, entries: [...] }
// Entry fields: id, n (name), c (category), sc (subcategory), l (level),
//               t (traits), r (rarity), src (source), trad (traditions for spells)
```

Detail files at `pf2e-lookup/data/details/{category}.json` contain full descriptions keyed by ID.
