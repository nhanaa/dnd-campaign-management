import { esc, urlPath } from './markdown.js';

// ── helpers ─────────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtDate = (d) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
const shortDate = (d) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
const today = () => { const n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); };
export function relDays(d) {
  const days = Math.round((today() - d) / 864e5);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}
function relTime(ms) {
  const mins = (Date.now() - ms) / 6e4;
  if (mins < 60) return `${Math.max(1, Math.round(mins))}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}
const hours = (min) => (min >= 600 ? Math.round(min / 60) : Math.round(min / 6) / 10);
const shortSystem = (s) => s.replace(/\s*\(.*$/, '').replace('Pathfinder 2e Remastered', 'PF2e Remaster');
const variants = (s) => (/\((.*)\)/.exec(s)?.[1] ?? '').split(',').map((x) => x.trim()).filter(Boolean);
const sessionUrl = (c, s, file) => `/c/${urlPath(c.slug)}/s/${urlPath(s.slug)}${file ? `?f=${encodeURIComponent(file)}` : ''}`;
const campaignUrl = (c) => `/c/${urlPath(c.slug)}`;
const STATUS_LABEL = { active: 'Active', dormant: 'Dormant', left: 'Left', abandoned: 'Abandoned' };

// ── icons (inline, stroke-based) ────────────────────────────────────────
const ICONS = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  sheet: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  progression: '<path d="M4 19l5-6 4 3 7-9"/><path d="M15 7h5v5"/>',
  world: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  dynamics: '<circle cx="8" cy="9" r="3"/><circle cx="17" cy="9" r="3"/><path d="M2.5 20c.8-3 3-5 5.5-5s4.7 2 5.5 5M13 15.5c1-.4 2-.5 4-.5 2.5 0 4.5 2 5 5"/>',
  tips: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
  file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>',
  scroll: '<path d="M7 4h11a2 2 0 0 1 2 2v1h-4"/><path d="M16 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1h11"/><path d="M7 4a2 2 0 0 0-2 2v11"/><path d="M9 9h4M9 13h4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  swords: '<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2"/><path d="M14.5 6.5L18 3h3v3l-3.5 3.5M5 14l4 4M7 17l-3 3M3 19l2 2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  chevL: '<path d="M15 18l-6-6 6-6"/>',
  chevR: '<path d="M9 18l6-6-6-6"/>',
};
export const icon = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.file}</svg>`;

const pill = (status) => `<span class="pill pill-${status}">${STATUS_LABEL[status]}</span>`;
const sysTag = (c) => `<span class="sys sys-${c.systemKey}">${esc(shortSystem(c.system) || 'Unknown system')}</span>`;

// ── layout ──────────────────────────────────────────────────────────────
function sidebar(campaigns, current) {
  const groups = [['Playing now', ['active']], ['On hiatus', ['dormant']], ['Past tables', ['left', 'abandoned']]];
  const nav = groups.map(([label, sts]) => {
    const list = campaigns.filter((c) => sts.includes(c.status));
    if (!list.length) return '';
    return `<div class="nav-group"><div class="nav-label">${label}</div>${list.map((c) => `
      <a class="nav-item${current === c.slug ? ' on' : ''}${c.status === 'left' || c.status === 'abandoned' ? ' faded' : ''}" href="${campaignUrl(c)}" style="--accent:${c.accent}">
        <span class="dot"></span><span class="nav-name">${esc(c.name)}</span><span class="count">${c.sessions.length || ''}</span>
      </a>`).join('')}</div>`;
  }).join('');
  return `
  <aside class="sidebar" id="sidebar">
    <a class="brand" href="/">
      <span class="brand-mark">${icon('swords')}</span>
      <span><span class="brand-name">Campaign Codex</span><span class="brand-sub">Pax's tables</span></span>
    </a>
    <form class="search" action="/search" role="search">
      ${icon('search')}<input name="q" placeholder="Search everything" aria-label="Search all campaign files" autocomplete="off"><kbd>/</kbd>
    </form>
    <nav>
      <a class="nav-item${current === '__home' ? ' on' : ''}" href="/">${icon('home')}<span class="nav-name">Dashboard</span></a>
      <a class="nav-item${current === '__library' ? ' on' : ''}" href="/library">${icon('book')}<span class="nav-name">Library</span></a>
      ${nav}
    </nav>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle light and dark theme">${icon('sun', 'i-sun')}${icon('moon', 'i-moon')}<span>Theme</span></button>
  </aside>`;
}

export function layout({ title, campaigns, current, body, accent }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Campaign Codex</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚔️</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/static/style.css">
<script>try{const t=localStorage.getItem('codex-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
</head>
<body${accent ? ` style="--accent:${accent}"` : ''}>
<input type="checkbox" id="nav-open" class="nav-open" hidden>
<header class="mobilebar"><label for="nav-open" class="icon-btn" aria-label="Open navigation">${icon('menu')}</label><a class="brand-name" href="/">Campaign Codex</a></header>
<div class="shell">
  ${sidebar(campaigns, current)}
  <label for="nav-open" class="scrim"></label>
  <main class="main">${body}</main>
</div>
<div class="tip" id="tip" role="tooltip"></div>
<script src="/static/app.js"></script>
</body>
</html>`;
}

// ── charts (server-rendered SVG, hover via data-tip) ───────────────────
const SYS_NAMES = { pf2e: 'Pathfinder 2e', dnd: 'D&D 5e', other: 'Other' };

function timelineChart(campaigns) {
  const rows = campaigns.filter((c) => c.sessions.length);
  const all = rows.flatMap((c) => c.sessions.map((s) => s.date.getTime()));
  const minD = new Date(Math.min(...all)); const start = Date.UTC(minD.getUTCFullYear(), minD.getUTCMonth(), 1);
  const now = new Date(); const end = Date.UTC(now.getFullYear(), now.getMonth() + 1, 1);
  const W = 1000, L = 250, R = 16, T = 26, RH = 30, H = T + rows.length * RH + 8;
  const x = (t) => L + ((t - start) / (end - start)) * (W - L - R);
  let grid = '';
  for (let m = new Date(start); m.getTime() < end; m.setUTCMonth(m.getUTCMonth() + 1)) {
    const gx = x(m.getTime());
    grid += `<line class="grid" x1="${gx}" x2="${gx}" y1="${T - 8}" y2="${H - 4}"/><text class="axis" x="${gx + 4}" y="${T - 12}">${MONTHS[m.getUTCMonth()]}</text>`;
  }
  const lanes = rows.map((c, i) => {
    const y = T + i * RH + RH / 2;
    const first = x(c.sessions[0].date.getTime()), last = x(c.sessions.at(-1).date.getTime());
    const faded = c.status === 'left' || c.status === 'abandoned';
    const dots = c.sessions.map((s) => {
      const tip = `${esc(c.name)} · Session ${s.number}|${fmtDate(s.date)}${s.title ? ` — ${esc(s.title)}` : ''}${s.duration ? ` · ${esc(s.duration)}` : ''}`;
      return `<a href="${sessionUrl(c, s)}" data-tip="${tip}"><circle class="hit" cx="${x(s.date.getTime())}" cy="${y}" r="11"/><circle class="mark s-${c.systemKey}" cx="${x(s.date.getTime())}" cy="${y}" r="5.5"/></a>`;
    }).join('');
    return `<g class="lane${faded ? ' faded' : ''}">
      <a href="${campaignUrl(c)}"><text class="lane-label" x="${L - 14}" y="${y + 4}" text-anchor="end">${esc(c.name)}</text></a>
      <line class="lane-line" x1="${first}" x2="${last}" y1="${y}" y2="${y}"/>${dots}</g>`;
  }).join('');
  const table = `<table><thead><tr><th>Campaign</th><th>Sessions</th><th>First</th><th>Latest</th></tr></thead><tbody>${rows.map((c) => `<tr><td>${esc(c.name)}</td><td>${c.sessions.length}</td><td>${fmtDate(c.sessions[0].date)}</td><td>${fmtDate(c.last.date)}</td></tr>`).join('')}</tbody></table>`;
  const used = [...new Set(rows.map((c) => c.systemKey))];
  return `<figure class="chart">
    <figcaption><span class="chart-title">Every session, every table</span>
      <span class="legend">${used.map((k) => `<span><i class="sw s-${k}"></i>${SYS_NAMES[k]}</span>`).join('')}</span></figcaption>
    <div class="chart-scroll"><svg viewBox="0 0 ${W} ${H}" class="timeline" role="img" aria-label="Timeline of sessions per campaign">${grid}${lanes}</svg></div>
    <details class="table-view"><summary>View as table</summary>${table}</details>
  </figure>`;
}

function monthlyChart(campaigns) {
  const sessions = campaigns.flatMap((c) => c.sessions.map((s) => ({ s, c })));
  const minD = new Date(Math.min(...sessions.map(({ s }) => s.date.getTime())));
  const now = new Date();
  const months = [];
  for (let m = new Date(Date.UTC(minD.getUTCFullYear(), minD.getUTCMonth(), 1)); m <= now; m.setUTCMonth(m.getUTCMonth() + 1)) {
    months.push({ y: m.getUTCFullYear(), m: m.getUTCMonth(), pf2e: 0, dnd: 0, other: 0, minutes: 0 });
  }
  for (const { s, c } of sessions) {
    const b = months.find((mo) => mo.y === s.date.getUTCFullYear() && mo.m === s.date.getUTCMonth());
    if (b) { b[c.systemKey]++; b.minutes += s.minutes; }
  }
  const keys = ['pf2e', 'dnd', 'other'].filter((k) => months.some((mo) => mo[k]));
  const max = Math.max(...months.map((mo) => keys.reduce((a, k) => a + mo[k], 0)));
  const step = max > 12 ? 5 : 2; const top = Math.ceil(max / step) * step;
  const W = 620, L = 30, T = 14, B = 26, H = 250, ph = H - T - B;
  const bw = (W - L) / months.length, barW = Math.min(56, bw * 0.62);
  let grid = '';
  for (let v = 0; v <= top; v += step) {
    const gy = T + ph - (v / top) * ph;
    grid += `<line class="grid${v === 0 ? ' base' : ''}" x1="${L}" x2="${W}" y1="${gy}" y2="${gy}"/><text class="axis" x="${L - 8}" y="${gy + 4}" text-anchor="end">${v}</text>`;
  }
  const bars = months.map((mo, i) => {
    const cx = L + bw * i + bw / 2; let y = T + ph; let out = '';
    const total = keys.reduce((a, k) => a + mo[k], 0);
    const topKey = [...keys].reverse().find((k) => mo[k]);
    for (const k of keys) {
      if (!mo[k]) continue;
      const h = (mo[k] / top) * ph; y -= h;
      const gap = k === topKey ? 0 : 2;
      out += k === topKey
        ? `<path class="bar s-${k}" d="M${cx - barW / 2},${y + h} v${-(h - 4)} q0,-4 4,-4 h${barW - 8} q4,0 4,4 v${h - 4} z"/>`
        : `<rect class="bar s-${k}" x="${cx - barW / 2}" y="${y + gap}" width="${barW}" height="${Math.max(0, h - gap)}"/>`;
    }
    const tip = `${MONTHS[mo.m]} ${mo.y}|${total} session${total === 1 ? '' : 's'}${keys.map((k) => (mo[k] ? ` · ${SYS_NAMES[k]} ${mo[k]}` : '')).join('')}${mo.minutes ? ` · ~${hours(mo.minutes)}h played` : ''}`;
    return `<g data-tip="${tip}"><rect class="hit" x="${cx - bw / 2}" y="${T}" width="${bw}" height="${ph}"/>${out}
      <text class="axis" x="${cx}" y="${H - 8}" text-anchor="middle">${MONTHS[mo.m]}</text>${total ? `<text class="bar-val" x="${cx}" y="${T + ph - (total / top) * ph - 6}" text-anchor="middle">${total}</text>` : ''}</g>`;
  }).join('');
  const table = `<table><thead><tr><th>Month</th>${keys.map((k) => `<th>${SYS_NAMES[k]}</th>`).join('')}<th>Hours</th></tr></thead><tbody>${months.map((mo) => `<tr><td>${MONTHS[mo.m]} ${mo.y}</td>${keys.map((k) => `<td>${mo[k]}</td>`).join('')}<td>${hours(mo.minutes)}</td></tr>`).join('')}</tbody></table>`;
  return `<figure class="chart">
    <figcaption><span class="chart-title">Sessions per month</span>
      <span class="legend">${keys.map((k) => `<span><i class="sw s-${k}"></i>${SYS_NAMES[k]}</span>`).join('')}</span></figcaption>
    <svg viewBox="0 0 ${W} ${H}" class="bars" role="img" aria-label="Sessions per month by system">${grid}${bars}</svg>
    <details class="table-view"><summary>View as table</summary>${table}</details>
  </figure>`;
}

function durationChart(c) {
  const ss = c.sessions.filter((s) => s.minutes);
  if (ss.length < 2) return '';
  const max = Math.max(...ss.map((s) => s.minutes));
  const topH = Math.ceil(max / 60);
  const W = 1000, L = 34, T = 12, B = 26, H = 200, ph = H - T - B;
  const bw = (W - L) / c.sessions.length, barW = Math.min(38, bw * 0.6);
  let grid = '';
  const step = topH > 6 ? 2 : 1;
  for (let v = 0; v <= topH; v += step) {
    const gy = T + ph - (v / topH) * ph;
    grid += `<line class="grid${v === 0 ? ' base' : ''}" x1="${L}" x2="${W}" y1="${gy}" y2="${gy}"/><text class="axis" x="${L - 8}" y="${gy + 4}" text-anchor="end">${v}h</text>`;
  }
  const bars = c.sessions.map((s, i) => {
    const cx = L + bw * i + bw / 2;
    const h = (s.minutes / 60 / topH) * ph; const y = T + ph - h;
    const shape = s.minutes ? `<path class="bar accent" d="M${cx - barW / 2},${T + ph} v${-(h - 4)} q0,-4 4,-4 h${barW - 8} q4,0 4,4 v${h - 4} z"/>` : '';
    const label = c.sessions.length <= 26 || i % 2 === 0 ? `<text class="axis" x="${cx}" y="${H - 8}" text-anchor="middle">${s.number}</text>` : '';
    return `<a href="${sessionUrl(c, s)}" data-tip="Session ${s.number} · ${shortDate(s.date)}|${esc(s.title || '')}${s.duration ? ` · ${esc(s.duration)}` : ' · no duration logged'}"><rect class="hit" x="${cx - bw / 2}" y="${T}" width="${bw}" height="${ph}"/>${shape}${label}</a>`;
  }).join('');
  return `<figure class="chart">
    <figcaption><span class="chart-title">Session length</span><span class="chart-note">by session number · click a bar to open it</span></figcaption>
    <svg viewBox="0 0 ${W} ${H}" class="bars" role="img" aria-label="Session length per session">${grid}${bars}</svg>
    <details class="table-view"><summary>View as table</summary><table><thead><tr><th>Session</th><th>Date</th><th>Length</th></tr></thead><tbody>${c.sessions.map((s) => `<tr><td>${s.number}</td><td>${fmtDate(s.date)}</td><td>${esc(s.duration || '—')}</td></tr>`).join('')}</tbody></table></details>
  </figure>`;
}

// ── shared pieces ───────────────────────────────────────────────────────
const stat = (value, label, sub = '') => `<div class="stat"><div class="stat-value">${value}</div><div class="stat-label">${label}</div>${sub ? `<div class="stat-sub">${sub}</div>` : ''}</div>`;

function sessionCard(c, s, { showCampaign = true, big = false } = {}) {
  const badges = [
    s.hasHtml ? `<a class="badge" href="${sessionUrl(c, s, 'recap.html')}">${icon('eye')}Visual recap</a>` : '',
    s.files.includes('encounter-analysis.md') ? `<a class="badge" href="${sessionUrl(c, s, 'encounter-analysis.md')}">${icon('swords')}Encounter analysis</a>` : '',
  ].join('');
  return `<article class="session-card${big ? ' big' : ''}" style="--accent:${c.accent}">
    <div class="session-meta">${showCampaign ? `<a class="camp-link" href="${campaignUrl(c)}"><span class="dot"></span>${esc(c.name)}</a>` : ''}
      <span>Session ${s.number}</span><span>${fmtDate(s.date)}</span>${s.duration ? `<span>${icon('clock')}${esc(s.duration)}</span>` : ''}<span class="muted">${relDays(s.date)}</span></div>
    <h3><a href="${sessionUrl(c, s)}">${esc(s.title || `Session ${s.number}`)}</a></h3>
    ${s.summary ? `<p class="excerpt">${esc(s.summary)}</p>` : ''}
    ${badges ? `<div class="badges">${badges}</div>` : ''}
  </article>`;
}

function campaignCard(c) {
  const faded = c.status === 'left' || c.status === 'abandoned';
  return `<a class="camp-card${faded ? ' faded' : ''}" href="${campaignUrl(c)}" style="--accent:${c.accent}">
    <div class="camp-top">${pill(c.status)}${sysTag(c)}</div>
    <h3>${esc(c.name)}</h3>
    <p class="camp-char">${esc(c.character || '—')}</p>
    <dl class="camp-facts">
      <div><dt>Sessions</dt><dd>${c.sessions.length}</dd></div>
      <div><dt>Hours</dt><dd>${c.minutes ? hours(c.minutes) : '—'}</dd></div>
      <div><dt>Last played</dt><dd>${c.last ? relDays(c.last.date) : '—'}</dd></div>
    </dl>
    ${c.last?.title ? `<p class="camp-latest"><span>Latest</span> S${c.last.number} · ${esc(c.last.title)}</p>` : ''}
  </a>`;
}

// ── pages ───────────────────────────────────────────────────────────────
export function dashboardPage(campaigns, docs) {
  const active = campaigns.filter((c) => c.status === 'active');
  const allSessions = campaigns.flatMap((c) => c.sessions.map((s) => ({ c, s }))).sort((a, b) => b.s.date - a.s.date || b.s.number - a.s.number);
  const totalMin = campaigns.reduce((a, c) => a + c.minutes, 0);
  const last30 = allSessions.filter(({ s }) => today() - s.date <= 30 * 864e5).length;
  const recent = allSessions.slice(0, 5);
  const edited = [...docs].sort((a, b) => b.mtime - a.mtime).slice(0, 10);
  const hour = new Date().getHours();
  const greet = hour < 5 ? 'Late night at the table' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const byStatus = (sts) => campaigns.filter((c) => sts.includes(c.status));

  return `
  <section class="hero home-hero">
    <p class="eyebrow">${fmtDate(new Date(today()))}</p>
    <h1>${greet}, Pax</h1>
    <p class="lede">${active.length} tables in play${allSessions[0] ? ` · last session ${relDays(allSessions[0].s.date)} in <a href="${campaignUrl(allSessions[0].c)}">${esc(allSessions[0].c.name)}</a>` : ''}.</p>
  </section>

  <section class="stats">
    ${stat(active.length, 'Active campaigns', `${campaigns.length} tracked in total`)}
    ${stat(allSessions.length, 'Sessions recapped', `${campaigns.filter((c) => c.sessions.length).length} campaigns`)}
    ${stat(hours(totalMin), 'Hours at the table', 'from recap durations')}
    ${stat(last30, 'Sessions in 30 days', last30 ? `about ${Math.round((last30 / 30) * 7 * 10) / 10} a week` : '')}
  </section>

  <section class="block">
    <div class="block-head"><h2>Latest sessions</h2></div>
    <div class="session-grid">${recent.map(({ c, s }, i) => sessionCard(c, s, { big: i === 0 })).join('')}</div>
  </section>

  <section class="block">
    <div class="block-head"><h2>Playing now</h2></div>
    <div class="camp-grid">${byStatus(['active']).map(campaignCard).join('')}</div>
  </section>

  <section class="block two-col">
    <div>${timelineChart(campaigns)}</div>
  </section>
  <section class="block split">
    <div>${monthlyChart(campaigns)}</div>
    <div class="panel">
      <div class="block-head"><h2>Recently edited</h2></div>
      <ul class="edited">${edited.map((d) => `<li><a href="/view/${urlPath(d.rel)}">
        ${d.campaign ? `<span class="dot" style="--accent:${d.campaign.accent}"></span>` : `<span class="dot neutral"></span>`}
        <span class="edited-name">${esc(d.campaign ? d.campaign.name : 'Library')}<b>${esc(d.label)}</b></span><span class="muted">${relTime(d.mtime)}</span></a></li>`).join('')}</ul>
    </div>
  </section>

  <section class="block">
    <div class="block-head"><h2>On hiatus &amp; past tables</h2></div>
    <div class="camp-grid compact">${byStatus(['dormant', 'left', 'abandoned']).map(campaignCard).join('')}</div>
  </section>`;
}

export function campaignPage(c) {
  const sessions = [...c.sessions].reverse();
  const tags = variants(c.system).map((v) => `<span class="tag">${esc(v)}</span>`).join('');
  const docCards = c.core.map((d) => `<a class="doc-card" href="/view/${urlPath(`${c.slug}/${d.file}`)}">${icon(d.icon)}<span>${d.label}</span></a>`).join('');
  const extras = c.extra.map((f) => `<li><a href="/view/${urlPath(`${c.slug}/${f}`)}">${icon('file')}${esc(f.replace(/\.md$/, '').replace(/[-/]/g, ' '))}</a></li>`).join('');
  return `
  <section class="hero camp-hero" style="--accent:${c.accent}">
    <div class="crumbs"><a href="/">Dashboard</a><span>/</span>${esc(c.name)}</div>
    <div class="camp-top">${pill(c.status)}${sysTag(c)}${tags}</div>
    <h1>${esc(c.name)}</h1>
    ${c.setting ? `<p class="lede">${esc(c.setting)}</p>` : ''}
    ${c.character ? `<p class="hero-char">${icon('sheet')}${esc(c.character)}</p>` : ''}
    ${c.statusNote ? `<p class="hero-note">${esc(c.statusNote)}</p>` : ''}
  </section>

  <section class="stats">
    ${stat(c.sessions.length, 'Sessions', c.sessions.length ? `S${c.sessions[0].number}–S${c.last.number} recapped` : '')}
    ${stat(c.minutes ? hours(c.minutes) : '—', 'Hours played', c.minutes && c.sessions.length ? `avg ${hours(c.minutes / c.sessions.filter((s) => s.minutes).length)}h per session` : '')}
    ${stat(c.cadence ? `${c.cadence} days` : '—', 'Average gap', c.cadence ? (c.cadence <= 8 ? 'weekly table' : c.cadence <= 16 ? 'roughly biweekly' : 'irregular') : '')}
    ${stat(c.level ? `Lv ${c.level}` : '—', 'Sheet level', c.last ? `last played ${relDays(c.last.date)}` : '')}
  </section>

  ${docCards ? `<section class="block"><div class="doc-grid">${docCards}</div></section>` : ''}

  ${c.last ? `<section class="block"><div class="block-head"><h2>Latest session</h2></div>${sessionCard(c, c.last, { showCampaign: false, big: true })}</section>` : ''}

  ${durationChart(c) ? `<section class="block">${durationChart(c)}</section>` : ''}

  ${sessions.length ? `<section class="block">
    <div class="block-head"><h2>All sessions</h2><span class="muted">${sessions.length}</span></div>
    <ol class="session-list">${sessions.map((s) => `<li><a href="${sessionUrl(c, s)}">
      <span class="sl-num">${s.number}</span>
      <span class="sl-main"><span class="sl-title">${esc(s.title || `Session ${s.number}`)}</span>${s.summary ? `<span class="sl-sum">${esc(s.summary)}</span>` : ''}</span>
      <span class="sl-side"><span>${fmtDate(s.date)}</span><span class="muted">${esc(s.duration)}</span>
        <span class="sl-icons">${s.hasHtml ? `<i data-tip="Has a visual recap">${icon('eye')}</i>` : ''}${s.files.includes('encounter-analysis.md') ? `<i data-tip="Has an encounter analysis">${icon('swords')}</i>` : ''}</span></span>
    </a></li>`).join('')}</ol>
  </section>` : ''}

  ${extras ? `<section class="block"><div class="block-head"><h2>Other notes</h2></div><ul class="extra-list">${extras}</ul></section>` : ''}`;
}

function tocBlock(toc) {
  if (toc.length < 3) return '';
  return `<nav class="toc" aria-label="On this page"><div class="toc-label">On this page</div>${toc.map((t) => `<a class="d${t.depth}" href="#${t.id}">${esc(t.text)}</a>`).join('')}</nav>`;
}

export function docPage({ c, rel, html, toc, mtime, absPath }) {
  const name = rel.split('/').pop();
  const doc = c?.core.find((d) => d.file === rel.slice(c.slug.length + 1));
  const siblings = c ? c.core.map((d) => `<a class="tab${d.file === rel.slice(c.slug.length + 1) ? ' on' : ''}" href="/view/${urlPath(`${c.slug}/${d.file}`)}">${icon(d.icon)}${d.label}</a>`).join('') : '';
  return `
  <div class="doc-head" ${c ? `style="--accent:${c.accent}"` : ''}>
    <div class="crumbs"><a href="/">Dashboard</a><span>/</span>${c ? `<a href="${campaignUrl(c)}">${esc(c.name)}</a><span>/</span>` : '<a href="/library">Library</a><span>/</span>'}${esc(doc?.label || name)}</div>
    ${siblings && doc ? `<div class="tabs">${siblings}</div>` : ''}
    <div class="doc-tools"><span class="muted">Edited ${relTime(mtime)}</span>
      <a class="tool" href="vscode://file${urlPath(absPath)}">${icon('edit')}Open in VS Code</a></div>
  </div>
  <div class="doc-layout">
    <article class="prose">${html}</article>
    ${tocBlock(toc)}
  </div>`;
}

export function sessionPage({ c, s, file, html, toc, absPath }) {
  const idx = c.sessions.indexOf(s);
  const prev = c.sessions[idx - 1], next = c.sessions[idx + 1];
  const order = ['recap.md', 'recap.html', 'encounter-analysis.md'];
  const files = s.files.filter((f) => /\.(md|html)$/.test(f)).sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99) || a.localeCompare(b));
  const label = (f) => ({ 'recap.md': 'Recap', 'recap.html': 'Visual recap', 'encounter-analysis.md': 'Encounter analysis' }[f]
    || f.replace(/\.(md|html)$/, '').replace(/-/g, ' ').replace(/^./, (x) => x.toUpperCase()));
  const ico = (f) => (f === 'recap.html' ? 'eye' : f === 'encounter-analysis.md' ? 'swords' : f === 'recap.md' ? 'scroll' : 'file');
  const nav = (x, dir) => (x ? `<a class="pn ${dir}" href="${sessionUrl(c, x, file === 'recap.html' && x.hasHtml ? 'recap.html' : null)}">${icon(dir === 'prev' ? 'chevL' : 'chevR')}<span><small>Session ${x.number}</small>${esc(x.title || fmtDate(x.date))}</span></a>` : '<span></span>');
  const isHtml = file.endsWith('.html');
  return `
  <div class="doc-head" style="--accent:${c.accent}">
    <div class="crumbs"><a href="/">Dashboard</a><span>/</span><a href="${campaignUrl(c)}">${esc(c.name)}</a><span>/</span>Session ${s.number}</div>
    <h1 class="session-title">${esc(s.title || `Session ${s.number}`)}</h1>
    <div class="session-meta big"><span>Session ${s.number}</span><span>${fmtDate(s.date)}</span>${s.duration ? `<span>${icon('clock')}${esc(s.duration)}</span>` : ''}</div>
    <div class="tabs">${files.map((f) => `<a class="tab${f === file ? ' on' : ''}" href="${sessionUrl(c, s, f === 'recap.md' ? null : f)}">${icon(ico(f))}${label(f)}</a>`).join('')}</div>
    <div class="doc-tools">
      ${isHtml ? `<a class="tool" href="/raw/${urlPath(`${c.slug}/sessions/${s.slug}/${file}`)}" target="_blank" rel="noopener">${icon('ext')}Open full screen</a>` : ''}
      <a class="tool" href="vscode://file${urlPath(absPath)}">${icon('edit')}Open in VS Code</a></div>
  </div>
  ${isHtml
    ? `<div class="frame-wrap"><iframe src="/raw/${urlPath(`${c.slug}/sessions/${s.slug}/${file}`)}" title="Visual recap for session ${s.number}" loading="lazy"></iframe></div>`
    : `<div class="doc-layout"><article class="prose">${html}</article>${tocBlock(toc)}</div>`}
  <nav class="prevnext">${nav(prev, 'prev')}${nav(next, 'next')}</nav>`;
}

export function libraryPage(rootDocs, docs) {
  const mt = (f) => docs.find((d) => d.rel === f)?.mtime;
  return `
  <section class="hero"><div class="crumbs"><a href="/">Dashboard</a><span>/</span>Library</div>
    <h1>Library</h1><p class="lede">Cross-campaign references kept at the root of the repo.</p></section>
  <section class="block"><div class="doc-list">
    ${['CLAUDE.md', ...rootDocs].map((f) => `<a class="doc-row" href="/view/${urlPath(f)}">${icon(f === 'CLAUDE.md' ? 'book' : 'file')}<span class="doc-row-name">${esc(f.replace(/\.md$/, '').replace(/-/g, ' '))}</span><span class="muted">${mt(f) ? `edited ${relTime(mt(f))}` : ''}</span></a>`).join('')}
  </div></section>`;
}

export function searchPage(q, results, scanned) {
  const re = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi') : null;
  const hl = (s) => esc(s).replace(re ? new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi') : /$^/, (m) => `<mark>${m}</mark>`);
  const total = results.reduce((a, r) => a + r.count, 0);
  return `
  <section class="hero"><div class="crumbs"><a href="/">Dashboard</a><span>/</span>Search</div>
    <h1>Search</h1>
    <form class="search big" action="/search" role="search">${icon('search')}<input name="q" value="${esc(q)}" placeholder="An NPC, a spell, a feat, a quote…" autofocus aria-label="Search"></form>
    ${q ? `<p class="lede">${total} match${total === 1 ? '' : 'es'} in ${results.length} file${results.length === 1 ? '' : 's'} <span class="muted">(${scanned} files searched)</span></p>` : ''}
  </section>
  <section class="block results">${results.map((r) => `
    <article class="result" ${r.doc.campaign ? `style="--accent:${r.doc.campaign.accent}"` : ''}>
      <a class="result-head" href="/view/${urlPath(r.doc.rel)}"><span class="dot${r.doc.campaign ? '' : ' neutral'}"></span>${esc(r.doc.campaign?.name || 'Library')}<b>${esc(r.doc.label)}</b><span class="muted">${r.count} match${r.count === 1 ? '' : 'es'}</span></a>
      ${r.snippets.map((sn) => `<a class="snippet" href="/view/${urlPath(r.doc.rel)}${sn.anchor ? `#${sn.anchor}` : ''}">${sn.section ? `<span class="sn-sec">${esc(sn.section)}</span>` : ''}${hl(sn.text)}</a>`).join('')}
    </article>`).join('')}
    ${q && !results.length ? '<p class="empty">Nothing found. Try a shorter or different spelling — transcripts misspell names often.</p>' : ''}
  </section>`;
}

export function notFound(msg = 'That page doesn’t exist.') {
  return `<section class="hero"><h1>Lost in the dungeon</h1><p class="lede">${esc(msg)}</p><p><a href="/">Back to the dashboard</a></p></section>`;
}
