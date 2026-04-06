#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PF2E_DIR = path.join(__dirname, '..', 'pf2e');
const DATA_DIR = path.join(__dirname, 'data');
const DETAILS_DIR = path.join(DATA_DIR, 'details');

// ── Category Configuration ──────────────────────────────────────────────────

const CATEGORIES = {
  spells: {
    paths: ['spells/spells', 'spells/focus', 'spells/rituals'],
    extractor: extractSpell,
    detailExtractor: extractSpellDetail,
  },
  equipment: {
    paths: ['equipment'],
    extractor: extractEquipment,
    detailExtractor: extractGenericDetail,
  },
  feats: {
    paths: ['feats'],
    extractor: extractFeat,
    detailExtractor: extractGenericDetail,
  },
  'class-features': {
    paths: ['class-features'],
    extractor: extractGeneric,
    detailExtractor: extractGenericDetail,
  },
  actions: {
    paths: ['actions'],
    extractor: extractAction,
    detailExtractor: extractGenericDetail,
  },
  backgrounds: {
    paths: ['backgrounds'],
    extractor: extractGeneric,
    detailExtractor: extractGenericDetail,
  },
  conditions: {
    paths: ['conditions'],
    extractor: extractGeneric,
    detailExtractor: extractGenericDetail,
  },
  ancestries: {
    paths: ['ancestries'],
    extractor: extractAncestry,
    detailExtractor: extractGenericDetail,
  },
  heritages: {
    paths: ['heritages'],
    extractor: extractGeneric,
    detailExtractor: extractGenericDetail,
  },
  classes: {
    paths: ['classes'],
    extractor: extractClass,
    detailExtractor: extractGenericDetail,
  },
  deities: {
    paths: ['deities'],
    extractor: extractGeneric,
    detailExtractor: extractGenericDetail,
  },
  'ancestry-features': {
    paths: ['ancestry-features'],
    extractor: extractGeneric,
    detailExtractor: extractGenericDetail,
  },
  hazards: {
    paths: ['hazards'],
    extractor: extractGeneric,
    detailExtractor: extractGenericDetail,
  },
  creatures: {
    paths: [
      'pathfinder-monster-core',
      'pathfinder-monster-core-2',
      'pathfinder-bestiary',
      'pathfinder-bestiary-2',
      'pathfinder-bestiary-3',
      'pathfinder-npc-core',
    ],
    extractor: extractCreature,
    detailExtractor: extractCreatureDetail,
  },
};

// ── File Walking ─────────────────────────────────────────────────────────────

function walkDir(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (entry.name.endsWith('.json') && entry.name !== '_folders.json') {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Description Cleaning ─────────────────────────────────────────────────────

function cleanDescription(html) {
  if (!html) return '';

  return html
    // @UUID[...]{Display Text} → Display Text
    .replace(/@UUID\[([^\]]*)\]\{([^}]*)\}/g, '$2')
    // @UUID[Compendium.pf2e.xxx.Item.Name] (no braces) → extract last segment as name
    .replace(/@UUID\[([^\]]*)\]/g, (_, inner) => {
      const parts = inner.split('.');
      const last = parts[parts.length - 1];
      return last || '';
    })
    // @Check[skill|dc:X|...]{text} → text
    .replace(/@Check\[([^\]]*)\]\{([^}]*)\}/g, '$2')
    // @Check[skill|dc:X|...] (no braces) → "Skill DC X" or just "Skill check"
    .replace(/@Check\[([^\]]*)\]/g, (_, inner) => {
      const parts = inner.split('|');
      const skill = parts[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const dcMatch = parts.find(p => p.startsWith('dc:'));
      const dc = dcMatch ? dcMatch.split(':')[1] : null;
      if (dc && !dc.includes('@')) return `${skill} DC ${dc}`;
      return `${skill} check`;
    })
    // @Damage[formula]{text} → text
    .replace(/@Damage\[([^\]]*)\]\{([^}]*)\}/g, '$2')
    // @Damage[XdY[type]...] (no braces) → extract dice and type
    .replace(/@Damage\[([^\]]*)\]/g, (_, inner) => {
      // Try to extract simple dice like "14d6[fire]" or "2d6[slashing]"
      const diceMatch = inner.match(/^(\d+d\d+)\[(\w+)\]/);
      if (diceMatch) return `${diceMatch[1]} ${diceMatch[2]}`;
      // Complex formula — just show "damage"
      return 'damage';
    })
    // @Template[type:X|distance:Y]{text} → text
    .replace(/@Template\[([^\]]*)\]\{([^}]*)\}/g, '$2')
    // @Template[type:X|distance:Y] (no braces) → "Y-foot X"
    .replace(/@Template\[([^\]]*)\]/g, (_, inner) => {
      const params = Object.fromEntries(
        inner.split('|').map(p => { const [k, ...v] = p.split(':'); return [k, v.join(':')]; })
      );
      const type = params.type || params[inner.split('|')[0]] || inner.split('|')[0] || 'area';
      const dist = params.distance || '';
      if (dist) return `${dist}-foot ${type}`;
      return type;
    })
    // @Embed[...] → remove entirely
    .replace(/@Embed\[[^\]]*\]/g, '')
    // @Localize[...] → remove
    .replace(/@Localize\[[^\]]*\]/g, '')
    // Catch any remaining @Tag[...]{text} → text
    .replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, '$1')
    // Catch any remaining @Tag[...] → remove
    .replace(/@\w+\[[^\]]*\]/g, '');
}

// ── Subcategory Derivation ───────────────────────────────────────────────────

function deriveSubcategory(filePath, category) {
  const rel = path.relative(PF2E_DIR, filePath);
  const parts = rel.split(path.sep);

  if (category === 'feats') {
    // feats/class/fighter/level-2/lunge.json → "fighter"
    // feats/archetype/assassin/assassin-dedication.json → "assassin"
    // feats/general/toughness.json → "general"
    // feats/skill/battle-medicine.json → "skill"
    if (parts.length >= 3) {
      const featType = parts[1]; // class, archetype, general, skill, ancestry, mythic, miscellaneous
      if (featType === 'class' && parts.length >= 4) return parts[2]; // class name
      if (featType === 'archetype' && parts.length >= 4) return parts[2]; // archetype name
      if (featType === 'ancestry' && parts.length >= 4) return parts[2]; // ancestry name
      return featType;
    }
  }

  if (category === 'spells') {
    // spells/spells/rank-3/fireball.json → derive spell type
    // spells/focus/... → focus
    // spells/rituals/... → ritual
    if (parts[1] === 'focus') return 'focus';
    if (parts[1] === 'rituals') return 'ritual';
    if (parts.length >= 3 && parts[2] === 'cantrip') return 'cantrip';
    return 'spell';
  }

  if (category === 'actions' && parts.length >= 3) {
    return parts[1]; // basic, skill, class, exploration, etc.
  }

  if (category === 'heritages' && parts.length >= 3) {
    return parts[1]; // ancestry name
  }

  if (category === 'deities' && parts.length >= 3) {
    // Could be in a subfolder (pantheon) or flat
    if (parts[1] !== path.basename(filePath, '.json')) {
      return parts[1]; // subfolder = pantheon
    }
  }

  return '';
}

// ── Type-Specific Extractors ─────────────────────────────────────────────────

function extractCommon(data, filePath, category) {
  const sys = data.system || {};
  const traits = sys.traits || {};
  return {
    id: data._id,
    n: data.name,
    c: category,
    sc: deriveSubcategory(filePath, category),
    l: sys.level?.value ?? null,
    t: traits.value || [],
    r: traits.rarity || 'common',
    src: sys.publication?.title || '',
    rm: sys.publication?.remaster || false,
  };
}

function extractSpell(data, filePath) {
  const base = extractCommon(data, filePath, 'spells');
  const sys = data.system || {};
  const traits = sys.traits || {};

  // Spell type from subcategory
  base.spellType = base.sc; // cantrip, spell, focus, ritual

  // Cantrips: set level to 0 so they don't match "Level 1" filters
  if (base.spellType === 'cantrip') base.l = 0;

  // Traditions
  base.trad = traits.traditions || [];

  // Cast time (actions)
  base.act = sys.time?.value || '';

  // Range
  base.rng = sys.range?.value || '';

  // Save
  base.sav = sys.defense?.save?.statistic || '';

  // Area
  if (sys.area?.value) {
    base.area = `${sys.area.value}-ft ${sys.area.type || ''}`.trim();
  }

  // Damage (first entry)
  const dmgEntries = sys.damage || {};
  const firstDmg = Object.values(dmgEntries)[0];
  if (firstDmg?.formula) {
    base.dmg = `${firstDmg.formula} ${firstDmg.type || ''}`.trim();
  }

  return base;
}

function extractEquipment(data, filePath) {
  const base = extractCommon(data, filePath, 'equipment');
  const sys = data.system || {};

  // Equipment sub-type
  base.eqCat = data.type || '';

  // Price normalized to GP
  const price = sys.price?.value || {};
  base.pr = (price.gp || 0) + (price.sp || 0) / 10 + (price.cp || 0) / 100 + (price.pp || 0) * 10;

  // Bulk
  base.blk = sys.bulk?.value ?? '';

  // Damage (weapons)
  if (sys.damage?.die) {
    base.dmg = `${sys.damage.dice || 1}${sys.damage.die} ${sys.damage.damageType || ''}`.trim();
  }

  return base;
}

function extractFeat(data, filePath) {
  const base = extractCommon(data, filePath, 'feats');
  const sys = data.system || {};

  // Action type
  base.act = sys.actionType?.value || '';
  base.acts = sys.actions?.value || null;

  // Prerequisites
  const prereqs = sys.prerequisites?.value || [];
  if (prereqs.length > 0) {
    base.prereqs = prereqs.map(p => p.value || p).filter(Boolean);
  }

  return base;
}

function extractAction(data, filePath) {
  const base = extractCommon(data, filePath, 'actions');
  const sys = data.system || {};
  base.act = sys.actionType?.value || '';
  base.acts = sys.actions?.value || null;
  return base;
}

function extractAncestry(data, filePath) {
  const base = extractCommon(data, filePath, 'ancestries');
  const sys = data.system || {};
  base.hp = sys.hp || null;
  base.spd = sys.speed || null;
  base.sz = sys.size || '';
  base.vis = sys.vision || '';
  return base;
}

function extractClass(data, filePath) {
  const base = extractCommon(data, filePath, 'classes');
  const sys = data.system || {};
  base.hp = sys.hp || null;
  base.ka = sys.keyAbility?.value || [];
  return base;
}

function extractCreature(data, filePath) {
  const base = extractCommon(data, filePath, 'creatures');
  const sys = data.system || {};
  base.hp = sys.attributes?.hp?.max || null;
  base.ac = sys.attributes?.ac?.value || null;
  // Creature level is in details.level.value
  base.l = sys.details?.level?.value ?? base.l;
  return base;
}

function extractGeneric(data, filePath, category) {
  return extractCommon(data, filePath, category || 'unknown');
}

// ── Detail Extractors ────────────────────────────────────────────────────────

function extractGenericDetail(data) {
  const sys = data.system || {};
  return {
    desc: cleanDescription(sys.description?.value || ''),
  };
}

function extractSpellDetail(data) {
  const sys = data.system || {};
  const detail = extractGenericDetail(data);

  // Heightening info
  if (sys.heightening) {
    detail.heightening = sys.heightening;
  }

  // Duration
  if (sys.duration?.value) {
    detail.duration = sys.duration.value;
    if (sys.duration.sustained) detail.sustained = true;
  }

  // Target
  if (sys.target?.value) {
    detail.target = sys.target.value;
  }

  return detail;
}

function extractCreatureDetail(data) {
  const sys = data.system || {};
  const detail = extractGenericDetail(data);

  // Abilities
  if (sys.abilities) {
    detail.abilities = {};
    for (const [key, val] of Object.entries(sys.abilities)) {
      detail.abilities[key] = val.mod ?? val.value ?? null;
    }
  }

  // Skills (just names and modifiers)
  if (sys.skills) {
    detail.skills = {};
    for (const [key, val] of Object.entries(sys.skills)) {
      if (val.base != null) detail.skills[key] = val.base;
    }
  }

  // Perception
  detail.perception = sys.perception?.mod ?? null;

  // Speeds
  if (sys.attributes?.speed) {
    detail.speed = sys.attributes.speed;
  }

  return detail;
}

// ── Main Build ───────────────────────────────────────────────────────────────

function main() {
  console.log('Building PF2e search index...\n');
  const startTime = Date.now();

  const searchIndex = [];
  const allTraits = new Set();
  const allSources = new Set();
  const categoryCounts = {};

  // Ensure output dirs exist
  fs.mkdirSync(DETAILS_DIR, { recursive: true });

  for (const [category, config] of Object.entries(CATEGORIES)) {
    const details = {};
    let count = 0;

    for (const relPath of config.paths) {
      const fullDir = path.join(PF2E_DIR, relPath);
      const files = walkDir(fullDir);

      for (const filePath of files) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(raw);

          // Skip entries without a name (malformed)
          if (!data.name) continue;

          // Extract Tier 1 record
          let record;
          if (config.extractor.length === 3) {
            record = config.extractor(data, filePath, category);
          } else {
            record = config.extractor(data, filePath);
          }

          // For generic extractor, set category
          if (record.c === 'unknown') record.c = category;

          searchIndex.push(record);

          // Collect traits and sources for metadata
          (record.t || []).forEach(t => allTraits.add(t));
          if (record.src) allSources.add(record.src);

          // Extract Tier 2 detail
          details[data._id] = config.detailExtractor(data);

          count++;
        } catch (err) {
          // Skip files that fail to parse
        }
      }
    }

    categoryCounts[category] = count;

    // Write detail file for this category
    const detailPath = path.join(DETAILS_DIR, `${category}.json`);
    fs.writeFileSync(detailPath, JSON.stringify(details));
    const detailSize = (fs.statSync(detailPath).size / 1024 / 1024).toFixed(2);
    console.log(`  ${category}: ${count} entries (detail: ${detailSize} MB)`);
  }

  // Sort index by name
  searchIndex.sort((a, b) => a.n.localeCompare(b.n));

  // Write search index with metadata header
  const indexData = {
    meta: {
      buildDate: new Date().toISOString(),
      totalEntries: searchIndex.length,
      categoryCounts,
      traits: [...allTraits].sort(),
      sources: [...allSources].sort(),
    },
    entries: searchIndex,
  };

  const indexPath = path.join(DATA_DIR, 'search-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData));
  const indexSize = (fs.statSync(indexPath).size / 1024 / 1024).toFixed(2);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n  Search index: ${indexSize} MB (${searchIndex.length} entries)`);
  console.log(`  Traits: ${allTraits.size} unique`);
  console.log(`  Sources: ${allSources.size} unique`);
  console.log(`  Built in ${elapsed}s`);
}

main();
