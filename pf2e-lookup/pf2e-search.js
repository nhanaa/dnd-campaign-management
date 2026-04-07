#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const INDEX_PATH = path.join(DATA_DIR, 'search-index.json');
const DETAILS_DIR = path.join(DATA_DIR, 'details');

// ── Parse Arguments ─────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { query: [], filters: {}, flags: {} };
  let i = 2;
  while (i < argv.length) {
    const a = argv[i];
    if (a === '--cat' || a === '-c') { args.filters.cat = argv[++i]; }
    else if (a === '--level' || a === '-l') { args.filters.level = argv[++i]; }
    else if (a === '--trad' || a === '-t') { args.filters.trad = argv[++i]?.toLowerCase(); }
    else if (a === '--trait') { args.filters.trait = argv[++i]?.toLowerCase(); }
    else if (a === '--rarity' || a === '-r') { args.filters.rarity = argv[++i]?.toLowerCase(); }
    else if (a === '--save' || a === '-s') { args.filters.save = argv[++i]?.toLowerCase(); }
    else if (a === '--eq-type') { args.filters.eqType = argv[++i]?.toLowerCase(); }
    else if (a === '--act' || a === '-a') { args.filters.act = argv[++i]; }
    else if (a === '--subcat') { args.filters.subcat = argv[++i]?.toLowerCase(); }
    else if (a === '--class') { args.filters.classTrait = argv[++i]?.toLowerCase(); }
    else if (a === '--wpn-cat') { args.filters.wpnCat = argv[++i]?.toLowerCase(); }
    else if (a === '--wpn-grp') { args.filters.wpnGrp = argv[++i]?.toLowerCase(); }
    else if (a === '--remaster') { args.filters.remaster = true; }
    else if (a === '--detail' || a === '-d') { args.flags.detail = true; }
    else if (a === '--limit' || a === '-n') { args.flags.limit = parseInt(argv[++i], 10); }
    else if (a === '--json') { args.flags.json = true; }
    else if (a === '--help' || a === '-h') { args.flags.help = true; }
    else if (a === '--no-desc') { args.flags.noDesc = true; }
    else if (!a.startsWith('-')) { args.query.push(a); }
    i++;
  }
  args.queryStr = args.query.join(' ').toLowerCase();
  if (!args.flags.limit) args.flags.limit = 20;
  return args;
}

// ── Help ────────────────────────────────────────────────────────────────────

const HELP = `
pf2e-search — CLI search for PF2e Remastered rules data

USAGE:
  node pf2e-search.js [query] [options]

SEARCH:
  <query>              Name search (substring match, case-insensitive)

FILTERS:
  -c, --cat <cat>      Category: spells, equipment, feats, actions, conditions,
                        ancestries, heritages, classes, class-features,
                        backgrounds, creatures, deities, hazards, ancestry-features
  -l, --level <range>  Level or range (e.g., 3, 1-5, 0 for cantrips)
  -t, --trad <trad>    Spell tradition: arcane, divine, occult, primal
  -s, --save <save>    Spell save: fortitude, reflex, will
  -a, --act <act>      Action cost: 1, 2, 3, free, reaction, passive
  --trait <trait>       Trait (e.g., fire, healing, kitsune, martial)
  -r, --rarity <r>     Rarity: common, uncommon, rare, unique
  --eq-type <type>     Equipment type: weapon, armor, shield, consumable, etc.
  --wpn-cat <cat>      Weapon proficiency: simple, martial, advanced, unarmed
  --wpn-grp <grp>      Weapon group: sword, axe, bow, polearm, club, etc.
  --class <class>      Class feat filter — finds all feats available to a class
                        by matching the class trait (includes shared/metamagic feats).
                        e.g., --class sorcerer finds Widen Spell, Reach Spell, etc.
  --subcat <sc>        Subcategory folder filter (e.g., cantrip, focus, general).
                        For feats, this only matches the folder — use --class instead
                        to find ALL feats a class can take.
  --remaster           Only show remaster content

OUTPUT:
  -d, --detail         Show full description (loads detail files)
  --no-desc            With --detail, skip description text (show stats only)
  -n, --limit <n>      Max results (default 20)
  --json               Output as JSON
  -h, --help           Show this help

EXAMPLES:
  node pf2e-search.js fireball
  node pf2e-search.js -c spells -t arcane -l 1-3
  node pf2e-search.js -c spells --trait fire -l 3-5
  node pf2e-search.js -c spells -t primal -s reflex
  node pf2e-search.js -c equipment --eq-type weapon --trait martial
  node pf2e-search.js -c feats --class sorcerer -l 1-2
  node pf2e-search.js -c feats --subcat sorcerer -l 1-4
  node pf2e-search.js -c feats --trait kitsune
  node pf2e-search.js -c conditions
  node pf2e-search.js heal -c spells -d
`.trim();

// ── Filtering ───────────────────────────────────────────────────────────────

function matchesQuery(entry, queryStr) {
  if (!queryStr) return true;
  const name = entry.n.toLowerCase();
  if (name === queryStr) return 100;
  if (name.startsWith(queryStr)) return 80;
  if (name.includes(queryStr)) return 60;
  // Check traits
  if (entry.t?.some(t => t.includes(queryStr))) return 30;
  return 0;
}

function parseLevelRange(levelStr) {
  if (!levelStr) return null;
  if (levelStr.includes('-')) {
    const [min, max] = levelStr.split('-').map(Number);
    return { min, max };
  }
  const n = parseInt(levelStr, 10);
  return { min: n, max: n };
}

function applyFilters(entries, filters) {
  let result = entries;

  if (filters.cat) {
    result = result.filter(e => e.c === filters.cat);
  }
  if (filters.level) {
    const range = parseLevelRange(filters.level);
    if (range) result = result.filter(e => e.l >= range.min && e.l <= range.max);
  }
  if (filters.trad) {
    result = result.filter(e => e.trad?.includes(filters.trad));
  }
  if (filters.trait) {
    const traits = filters.trait.split(',');
    result = result.filter(e => traits.every(t => e.t?.includes(t.trim())));
  }
  if (filters.classTrait) {
    result = result.filter(e => e.t?.includes(filters.classTrait));
  }
  if (filters.rarity) {
    result = result.filter(e => e.r === filters.rarity);
  }
  if (filters.save) {
    result = result.filter(e => e.sav?.toLowerCase().includes(filters.save));
  }
  if (filters.eqType) {
    result = result.filter(e => e.eqCat === filters.eqType);
  }
  if (filters.wpnCat) {
    result = result.filter(e => e.wpnCat === filters.wpnCat);
  }
  if (filters.wpnGrp) {
    result = result.filter(e => e.wpnGrp === filters.wpnGrp);
  }
  if (filters.act) {
    result = result.filter(e => String(e.act) === filters.act);
  }
  if (filters.subcat) {
    result = result.filter(e => e.sc?.toLowerCase().includes(filters.subcat));
  }
  if (filters.remaster) {
    result = result.filter(e => e.rm === true);
  }

  return result;
}

// ── Formatting ──────────────────────────────────────────────────────────────

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li>/gi, '  • ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '_$1_')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatEntry(entry, detail) {
  const parts = [];
  const rarityTag = entry.r !== 'common' ? ` [${entry.r.toUpperCase()}]` : '';
  parts.push(`### ${entry.n}${rarityTag}`);

  const meta = [];
  meta.push(`**Category:** ${entry.c}`);
  if (entry.sc) meta.push(`**Subcategory:** ${entry.sc}`);
  if (entry.l !== undefined && entry.l !== null) {
    const label = entry.c === 'spells' ? 'Rank' : 'Level';
    meta.push(`**${label}:** ${entry.l}`);
  }
  if (entry.t?.length) meta.push(`**Traits:** ${entry.t.join(', ')}`);
  if (entry.trad?.length) meta.push(`**Traditions:** ${entry.trad.join(', ')}`);

  // Spell-specific
  if (entry.act && entry.c === 'spells') meta.push(`**Cast:** ${entry.act} actions`);
  if (entry.rng) meta.push(`**Range:** ${entry.rng}`);
  if (entry.area) meta.push(`**Area:** ${entry.area}`);
  if (entry.sav) meta.push(`**Save:** ${entry.sav}`);
  if (entry.dmg && entry.c === 'spells') meta.push(`**Damage:** ${entry.dmg}`);

  // Equipment-specific
  if (entry.eqCat) meta.push(`**Type:** ${entry.eqCat}`);
  if (entry.wpnCat) meta.push(`**Proficiency:** ${entry.wpnCat}`);
  if (entry.wpnGrp) meta.push(`**Group:** ${entry.wpnGrp}`);
  if (entry.pr !== undefined && entry.pr !== null) meta.push(`**Price:** ${entry.pr} gp`);
  if (entry.blk !== undefined && entry.blk !== null) meta.push(`**Bulk:** ${entry.blk}`);
  if (entry.dmg && entry.c === 'equipment') meta.push(`**Damage:** ${entry.dmg}`);

  // Feat-specific
  if (entry.act && entry.c === 'feats') meta.push(`**Action:** ${entry.act}`);
  if (entry.prereqs?.length) meta.push(`**Prerequisites:** ${entry.prereqs.join('; ')}`);

  // Creature-specific
  if (entry.hp) meta.push(`**HP:** ${entry.hp}`);
  if (entry.ac) meta.push(`**AC:** ${entry.ac}`);

  meta.push(`**Source:** ${entry.src}${entry.rm ? ' (Remaster)' : ''}`);
  parts.push(meta.join(' | '));

  if (detail) {
    if (detail.desc) parts.push(stripHtml(detail.desc));
    if (detail.heightening) {
      const h = detail.heightening;
      if (h.type === 'interval' && h.damage) {
        const dmgParts = Object.entries(h.damage).map(([k, v]) => v).join(', ');
        parts.push(`**Heightened (+${h.interval})** Damage increases by ${dmgParts}`);
      }
    }
    if (detail.duration) parts.push(`**Duration:** ${detail.duration}`);
    if (detail.target) parts.push(`**Target:** ${detail.target}`);
  }

  return parts.join('\n');
}

function formatCompact(entry) {
  const rarity = entry.r !== 'common' ? ` [${entry.r}]` : '';
  const level = entry.l !== null && entry.l !== undefined ? ` (${entry.c === 'spells' ? 'rank' : 'lvl'} ${entry.l})` : '';
  const traits = entry.t?.length ? ` {${entry.t.join(', ')}}` : '';
  const extra = [];
  if (entry.trad?.length) extra.push(`trad:${entry.trad.join('/')}`);
  if (entry.dmg) extra.push(entry.dmg);
  if (entry.act && entry.c === 'spells') extra.push(`${entry.act}A`);
  if (entry.sav) extra.push(`save:${entry.sav}`);
  if (entry.eqCat) extra.push(entry.eqCat);
  if (entry.wpnCat) extra.push(entry.wpnCat);
  if (entry.wpnGrp) extra.push(entry.wpnGrp);
  if (entry.pr) extra.push(`${entry.pr}gp`);
  if (entry.prereqs?.length) extra.push(`prereq:${entry.prereqs.join(';')}`);
  const extraStr = extra.length ? ` — ${extra.join(', ')}` : '';
  return `  ${entry.n}${level}${rarity}${traits}${extraStr}`;
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv);

  if (args.flags.help) {
    console.log(HELP);
    return;
  }

  // Load index
  const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
  let entries = index.entries;

  // Apply filters
  entries = applyFilters(entries, args.filters);

  // Apply search query with scoring
  if (args.queryStr) {
    entries = entries
      .map(e => ({ entry: e, score: matchesQuery(e, args.queryStr) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.n.localeCompare(b.entry.n))
      .map(x => x.entry);
  }

  const total = entries.length;
  const limited = entries.slice(0, args.flags.limit);

  if (args.flags.json) {
    console.log(JSON.stringify({ total, results: limited }, null, 2));
    return;
  }

  if (total === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`Found ${total} results${total > args.flags.limit ? ` (showing first ${args.flags.limit})` : ''}:\n`);

  if (args.flags.detail) {
    // Load detail files for relevant categories
    const cats = [...new Set(limited.map(e => e.c))];
    const detailData = {};
    for (const cat of cats) {
      const detailPath = path.join(DETAILS_DIR, `${cat}.json`);
      if (fs.existsSync(detailPath)) {
        detailData[cat] = JSON.parse(fs.readFileSync(detailPath, 'utf8'));
      }
    }
    for (const entry of limited) {
      const detail = args.flags.noDesc
        ? null
        : detailData[entry.c]?.[entry.id] || null;
      console.log(formatEntry(entry, detail));
      console.log('');
    }
  } else {
    for (const entry of limited) {
      console.log(formatCompact(entry));
    }
  }
}

main();
