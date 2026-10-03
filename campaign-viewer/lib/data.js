// Reads the campaign folders straight off disk on every request, so the viewer
// always shows the current state of the repo — no build step, no cache to go stale.
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '..', '..');

const NON_CAMPAIGN = new Set(['campaign-viewer', 'bg3-mods', 'dnd-transcription', 'pf2e', 'pf2e-lookup', 'foundry-macros']);
const CORE_DOCS = [
  ['character-sheet.md', 'Character Sheet', 'sheet'],
  ['progression.md', 'Progression', 'progression'],
  ['world.md', 'World', 'world'],
  ['dynamics.md', 'Dynamics', 'dynamics'],
  ['tips.md', 'Tips & Tactics', 'tips'],
];
const DISPLAY_NAMES = {
  'revenge-of-the-runelords-cody': 'Revenge of the Runelords · Cody',
  'revenge-of-the-runelords': 'Revenge of the Runelords · Tuesday',
  'season-of-ghosts-ande': 'Season of Ghosts · Ande',
  'season-of-ghosts': 'Season of Ghosts · Orion',
  'korvosa-monday': 'Korvosa · Monday',
  'abomination-vault': 'Abomination Vaults',
  'icewind-dale (left)': 'Icewind Dale',
  'raiders': 'Raiders of the Serpent Sea',
};
const DORMANT_DAYS = 45;
const FALLBACK_ACCENTS = ['#b48a4a', '#7a8fb8', '#9a7ab0', '#6f9a82', '#b87466', '#8aa0a8', '#a89060'];

const read = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } };
const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };
const mtime = (p) => { try { return fs.statSync(p).mtimeMs; } catch { return 0; } };

export const stripMd = (s) => s
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[*_`~]+/g, '')
  .replace(/^>\s?/gm, '')
  .replace(/\s+/g, ' ')
  .trim();

const normFolder = (s) => s.replace(/`/g, '').replace(/\/$/, '').replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();

// The campaigns table in CLAUDE.md is the canonical metadata source.
function readCampaignTable() {
  const text = read(path.join(ROOT, 'CLAUDE.md')) || '';
  const start = text.indexOf('## Campaigns');
  if (start < 0) return new Map();
  const rows = new Map();
  for (const line of text.slice(start).split('\n').slice(1)) {
    if (line.startsWith('## ')) break;
    if (!line.startsWith('|') || /^\|\s*-/.test(line) || /\|\s*Folder\s*\|/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 4) continue;
    rows.set(normFolder(cells[0]), {
      system: stripMd(cells[1]),
      setting: stripMd(cells[2]),
      character: stripMd(cells[3]),
      statusNote: stripMd(cells.slice(4).join(' ')),
    });
  }
  return rows;
}

function classifyStatus(folder, note) {
  const s = `${folder} ${note}`.toUpperCase();
  if (/ABANDONED/.test(s)) return 'abandoned';
  if (/\bLEFT\b|\(LEFT\)/.test(s)) return 'left';
  return 'active';
}

function systemKey(system) {
  if (/pathfinder|pf2e/i.test(system)) return 'pf2e';
  if (/d&d|5e|5\.5e/i.test(system)) return 'dnd';
  return 'other';
}

function parseDuration(s) {
  if (!s) return 0;
  const h = /(\d+(?:\.\d+)?)\s*h/i.exec(s);
  const m = /(\d+)\s*m(?!o)/i.exec(s);
  return (h ? parseFloat(h[1]) * 60 : 0) + (m ? parseInt(m[1], 10) : 0);
}

function parseSession(campaignDir, name) {
  const m = /^session-(\d+)-(\d{1,2})-(\d{1,2})-(\d{4})/.exec(name);
  if (!m) return null;
  const dir = path.join(campaignDir, 'sessions', name);
  const recap = read(path.join(dir, 'recap.md')) || '';
  const h1 = /^#\s+(.+)$/m.exec(recap)?.[1] ?? '';
  const title = stripMd(h1.split(/\s+[—–-]\s+/).slice(1).join(' — ') || '');
  const duration = /\*\*Duration\*\*:?\s*(.+)/.exec(recap)?.[1] ?? '';
  let summary = '';
  const sIdx = recap.search(/^##\s+(Session )?Summary/m);
  const body = sIdx >= 0 ? recap.slice(sIdx).split('\n').slice(1).join('\n') : recap.replace(/^#.*$/m, '');
  for (const para of body.split(/\n\s*\n/)) {
    const p = para.trim();
    if (!p || /^(#|\||---|\*\*[A-Za-z -]+\*\*:|>|- )/.test(p)) continue;
    summary = stripMd(p);
    break;
  }
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => !f.startsWith('.')).sort(); } catch {}
  return {
    slug: name,
    number: parseInt(m[1], 10),
    date: new Date(Date.UTC(+m[4], +m[2] - 1, +m[3])),
    title,
    summary,
    duration: (() => {
      const min = parseDuration(duration);
      if (!min) return stripMd(duration).replace(/\s*\(.*$/, '');
      return `${/^\s*~/.test(duration) ? '~' : ''}${Math.floor(min / 60)}h${String(Math.round(min % 60)).padStart(2, '0')}m`;
    })(),
    minutes: parseDuration(duration),
    files,
    hasRecap: files.includes('recap.md'),
    hasHtml: files.includes('recap.html'),
  };
}

function walkMd(dir, rel = '') {
  const out = [];
  let entries = [];
  try { entries = fs.readdirSync(path.join(dir, rel), { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) { if (e.name !== 'sessions') out.push(...walkMd(dir, r)); }
    else if (e.name.endsWith('.md')) out.push(r);
  }
  return out;
}

export function loadCampaigns() {
  const table = readCampaignTable();
  const campaigns = [];
  let fallbackIdx = 0;
  for (const name of fs.readdirSync(ROOT).sort()) {
    const dir = path.join(ROOT, name);
    if (name.startsWith('.') || NON_CAMPAIGN.has(name) || !isDir(dir)) continue;
    if (!isDir(path.join(dir, 'sessions')) && !fs.existsSync(path.join(dir, 'character-sheet.md'))) continue;

    const meta = table.get(normFolder(name)) || { system: '', setting: '', character: '', statusNote: '' };
    const sessions = (isDir(path.join(dir, 'sessions')) ? fs.readdirSync(path.join(dir, 'sessions')) : [])
      .map((s) => parseSession(dir, s)).filter(Boolean)
      .sort((a, b) => a.number - b.number || a.date - b.date);

    const sheet = read(path.join(dir, 'character-sheet.md')) || '';
    // Only trust explicit level fields — prose mentions of "level N" are often historical.
    const level = /\*\*Level\*\*:?\s*\**\s*(\d+)/.exec(sheet)?.[1]
      ?? /\*\*Level (\d+)[^*]*\*\*/.exec(sheet.split('\n').slice(0, 6).join('\n'))?.[1]
      ?? /level-(\d+) Foundry export/.exec(sheet)?.[1] ?? null;
    if (!meta.system) {
      const first = sessions[0] && read(path.join(dir, 'sessions', sessions[0].slug, 'recap.md'));
      meta.system = stripMd(/\*\*System\*\*:?\s*(.+)/.exec(first || '')?.[1] ?? '').split(/\s+[—–]\s+/)[0];
    }
    const style = read(path.join(dir, 'style-guide.md')) || '';
    const accent = /`--gold`\s*\|\s*`?(#[0-9a-fA-F]{6})/.exec(style)?.[1]
      ?? FALLBACK_ACCENTS[fallbackIdx++ % FALLBACK_ACCENTS.length];

    const allMd = walkMd(dir);
    const core = CORE_DOCS.filter(([f]) => allMd.includes(f)).map(([file, label, icon]) => ({ file, label, icon }));
    const extra = allMd.filter((f) => !CORE_DOCS.some(([c]) => c === f) && f !== 'style-guide.md');
    const docMtimes = allMd.map((f) => mtime(path.join(dir, f)));

    const display = DISPLAY_NAMES[name] ?? name.replace(/\s*\(.*?\)\s*/g, '')
      .split('-').map((w) => (w.length <= 2 && w !== 'of' ? w.toUpperCase() : w === 'of' || w === 'the' ? w : w[0].toUpperCase() + w.slice(1)))
      .join(' ').replace(/^the/, 'The');

    const minutes = sessions.reduce((a, s) => a + s.minutes, 0);
    const last = sessions.at(-1) || null;
    const gaps = sessions.slice(1).map((s, i) => (s.date - sessions[i].date) / 864e5).filter((d) => d > 0);
    campaigns.push({
      slug: name,
      name: display,
      ...meta,
      systemKey: systemKey(meta.system),
      status: (() => {
        const st = classifyStatus(name, meta.statusNote);
        if (st === 'active' && last && (Date.now() - last.date) / 864e5 > DORMANT_DAYS) return 'dormant';
        return st;
      })(),
      level,
      accent,
      sessions,
      last,
      minutes,
      cadence: gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : null,
      core,
      extra,
      hasStyle: allMd.includes('style-guide.md'),
      updated: Math.max(0, ...docMtimes, ...sessions.map((s) => mtime(path.join(dir, 'sessions', s.slug, 'recap.md')))),
    });
  }
  const order = { active: 0, dormant: 1, left: 2, abandoned: 3 };
  campaigns.sort((a, b) => order[a.status] - order[b.status] || (b.last?.date ?? 0) - (a.last?.date ?? 0));
  return campaigns;
}

export function rootDocs() {
  return fs.readdirSync(ROOT).filter((f) => f.endsWith('.md') && f !== 'CLAUDE.md').sort();
}

// Every markdown file the viewer knows about, for search and "recently edited".
export function allDocs(campaigns) {
  const docs = [];
  for (const c of campaigns) {
    const dir = path.join(ROOT, c.slug);
    for (const f of walkMd(dir)) docs.push({ campaign: c, rel: `${c.slug}/${f}`, label: f });
    for (const s of c.sessions) {
      for (const f of s.files.filter((x) => x.endsWith('.md'))) {
        docs.push({ campaign: c, session: s, rel: `${c.slug}/sessions/${s.slug}/${f}`, label: `S${s.number} · ${f}` });
      }
    }
  }
  for (const f of rootDocs()) docs.push({ campaign: null, rel: f, label: f });
  docs.push({ campaign: null, rel: 'CLAUDE.md', label: 'CLAUDE.md' });
  for (const d of docs) d.mtime = mtime(path.join(ROOT, d.rel));
  return docs;
}

// Resolve a URL path to a file inside the repo, refusing anything that escapes it.
export function safePath(rel) {
  const p = path.resolve(ROOT, rel);
  if (p !== ROOT && !p.startsWith(ROOT + path.sep)) return null;
  return p;
}

export { read };
