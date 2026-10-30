// Procedural SVG battlemap: burning imperial palace throne hall (original design). 30x20 squares, 100 units per square.
const fs = require('fs');
const OUT = require('path').join(__dirname, '..', 'output');
fs.mkdirSync(OUT, { recursive: true });
const W = 3000, H = 2000, C = 100;

// ---------- seeded RNG + helpers ----------
let seed = Number(process.argv[2] || 7);
function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
const rr = (a, b) => a + rnd() * (b - a);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const f = (n) => Math.round(n * 10) / 10;

// smooth closed path through points (Catmull-Rom -> cubic Bezier)
function smoothClosed(pts) {
  const n = pts.length;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}
function smoothOpen(pts) {
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}
// irregular blob outline
function blobPts(cx, cy, rx, ry, irr, n = 14, rot = 0) {
  const ph = [rr(0, 6.28), rr(0, 6.28), rr(0, 6.28)];
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + irr * (0.5 * Math.sin(a * 2 + ph[0]) + 0.3 * Math.sin(a * 3 + ph[1]) + 0.2 * Math.sin(a * 5 + ph[2])) + rr(-irr, irr) * 0.3;
    const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
    pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  return pts;
}
const blob = (...a) => smoothClosed(blobPts(...a));
function polyPts(cx, cy, r, n, irr, rot = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2 + rr(-0.25, 0.25);
    const k = r * rr(1 - irr, 1 + irr);
    pts.push([cx + Math.cos(a) * k, cy + Math.sin(a) * k]);
  }
  return pts;
}
const poly = (pts) => 'M' + pts.map((p) => `${f(p[0])},${f(p[1])}`).join('L') + 'Z';
const dist = (a, b, c, d) => Math.hypot(a - c, b - d);
function hsl(h, s, l, a = 1) { return a === 1 ? `hsl(${f(h)},${f(s)}%,${f(l)}%)` : `hsla(${f(h)},${f(s)}%,${f(l)}%,${a})`; }

// Palace keep: multi-room dungeon on a square grid. Original design.
// Cells are 100 units (one 5-ft square). Map is 44 x 32 squares.
const GW = 44, GH = 32;
const W2 = GW * 100, H2 = GH * 100;
const INK = '#1e140e';
const L = {};
const layer = (k) => (L[k] = L[k] || []);
const defs = [];

// ---------- grid ----------
const grid = [...Array(GH)].map(() => Array(GW).fill(null));
function room(x0, y0, x1, y1, mat) { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) grid[y][x] = mat; }
const rooms = {
  throne:   [12, 1, 33, 11, 'marble'],
  ante:     [19, 12, 26, 14, 'flag'],
  court:    [13, 15, 31, 24, 'grass'],
  barracks: [2, 13, 11, 23, 'wood'],
  library:  [2, 2, 10, 11, 'woodDark'],
  quarters: [35, 2, 42, 14, 'rug'],
  banquet:  [34, 16, 42, 30, 'parquet'],
  gallery:  [12, 26, 34, 29, 'gallery'],
  gate:     [2, 24, 12, 31, 'flag'],
  store:    [18, 30, 24, 32 - 0, 'plank'],
};
for (const [x0, y0, x1, y1, m] of Object.values(rooms)) room(x0, y0, x1, y1, m);
// store room sits below the gallery, one square of wall between them except at the door
room(18, 30, 24, 31, 'plank');
for (let x = 18; x < 24; x++) grid[31][x] = null;
for (let x = 18; x < 24; x++) grid[29][x] = null;
// corridors
room(21, 11, 24, 12, 'flag');   // throne <-> ante
room(21, 14, 24, 15, 'flag');   // ante <-> court
room(31, 19, 34, 21, 'flag');   // court <-> banquet
room(38, 14, 40, 16, 'flag');   // quarters <-> banquet
room(33, 5, 35, 7, 'flag');     // quarters <-> throne (flanking door)
room(11, 18, 13, 20, 'flag');   // court <-> barracks
room(5, 11, 7, 13, 'flag');     // barracks <-> library
room(20, 29, 22, 30, 'flag');   // gallery <-> store
room(6, 31, 9, 32, 'flag');     // gate entry to the south edge
// gallery alcoves for statues, north and south walls
const alcoves = [];
for (const x of [15, 19, 26, 30]) { grid[25][x] = 'gallery'; alcoves.push([x, 25]); }
for (const x of [15, 26, 30]) { grid[29][x] = 'gallery'; alcoves.push([x, 29]); }

const isFloor = (x, y) => x >= 0 && y >= 0 && x < GW && y < GH && grid[y][x] !== null;

// doors: [x, y, horizontal] cell edge placements, drawn later
const doors = [
  [21, 11, true, 3, 'great'], [21, 14, true, 3, 'great'],
  [31, 19, false, 2], [38, 14, true, 2], [33, 5, false, 2, 'secret'],
  [11, 18, false, 2], [5, 11, true, 2], [20, 29, true, 2], [12, 26, false, 3, 'portcullis'], [6, 31, true, 3, 'portcullis'],
  [34, 26, false, 3],
];

// ---------- filters ----------
defs.push(`
<filter id="tex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.11  0 0 0 1.4 -0.55"/></filter>
<filter id="fine" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.12  0 0 0 1.6 -0.78"/></filter>
<filter id="vein" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency="0.006 0.018" numOctaves="4" seed="17" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.33  0 0 0 0 0.36  -3 0 0 0 1.1"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.12" numOctaves="3" seed="31" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 1.5 -0.6"/></filter>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="flame" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves="3" seed="23" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="leafy" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="11" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="16" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="s6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="s14" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="s40" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="stoneTex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="21" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.13  0 0 0 0 0.11  0 0 0 1.5 -0.6"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<radialGradient id="glow"><stop offset="0" stop-color="#ffb347" stop-opacity="0.7"/><stop offset="0.35" stop-color="#ff7a1a" stop-opacity="0.3"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></radialGradient>
<radialGradient id="candle"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.6"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
<radialGradient id="moon"><stop offset="0" stop-color="#b9d4ff" stop-opacity="0.45"/><stop offset="1" stop-color="#b9d4ff" stop-opacity="0"/></radialGradient>
<radialGradient id="arcane"><stop offset="0" stop-color="#b48cff" stop-opacity="0.55"/><stop offset="1" stop-color="#7a4cff" stop-opacity="0"/></radialGradient>
<linearGradient id="carpet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3e0f22"/><stop offset="0.5" stop-color="#6a1a36"/><stop offset="1" stop-color="#3e0f22"/></linearGradient>
<linearGradient id="carpetH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2a4a"/><stop offset="0.5" stop-color="#2c3f6b"/><stop offset="1" stop-color="#1d2a4a"/></linearGradient>
<radialGradient id="vignette" cx="50%" cy="50%" r="72%"><stop offset="55%" stop-color="#05060c" stop-opacity="0"/><stop offset="100%" stop-color="#05060c" stop-opacity="0.6"/></radialGradient>
`);

// ---------- helpers ----------
const sh = (d, dx = 18, dy = 22, op = 0.5, b = 's6') => `<path d="${d}" transform="translate(${dx},${dy})" fill="#000" opacity="${op}" filter="url(#${b})"/>`;
const rect = (x, y, w, h) => `M${f(x)},${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
const cells = (pred) => { const d = []; for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (pred(x, y)) d.push(rect(x * 100, y * 100, 100, 100)); return d.join(''); };
function fire(x, y, r) {
  layer('fire').push(`<g filter="url(#flame)"><path d="${blob(x, y, r, r * 0.85, 0.35, 12)}" fill="#8a1a08"/><path d="${blob(x - r * 0.05, y - r * 0.08, r * 0.75, r * 0.64, 0.35, 11)}" fill="#e2420e"/><path d="${blob(x - r * 0.08, y - r * 0.12, r * 0.5, r * 0.42, 0.35, 10)}" fill="#ff9a1f"/><path d="${blob(x - r * 0.1, y - r * 0.15, r * 0.26, r * 0.22, 0.35, 9)}" fill="#ffe27a"/></g>`);
  layer('glow').push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 6)}" fill="url(#glow)"/>`);
}
function brazier(x, y, r = 34) {
  layer('props').push(sh(`M${x - r},${y}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`, 14, 18, 0.55) + `<circle cx="${x}" cy="${y}" r="${r}" fill="#4a3a2a" stroke="${INK}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${r * 0.74}" fill="#160b06"/>`);
  fire(x, y - 3, r * 0.75);
}
function candles(x, y, n = 3) {
  const P = layer('props');
  for (let i = 0; i < n; i++) { const cx = x + rr(-18, 18), cy = y + rr(-18, 18); P.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="7" fill="#efe6cf" stroke="${INK}" stroke-width="2"/><circle cx="${f(cx)}" cy="${f(cy)}" r="2.5" fill="#ffb347"/>`); }
  layer('glow').push(`<circle cx="${x}" cy="${y}" r="150" fill="url(#candle)"/>`);
}
function box(x, y, w, h, rot, fill, opts = {}) {
  const P = layer(opts.layer || 'props');
  let s = `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})">`;
  if (!opts.noShadow) s += sh(rect(-w / 2, -h / 2, w, h), 12, 16, 0.5);
  s += `<rect x="${f(-w / 2)}" y="${f(-h / 2)}" width="${f(w)}" height="${f(h)}" rx="${opts.rx ?? 4}" fill="${fill}" stroke="${INK}" stroke-width="${opts.sw ?? 4}"/>`;
  if (opts.inner) s += opts.inner(w, h);
  P.push(s + '</g>');
}
const plankLines = (w, h, n = 3, col = '#2f1d10') => { let d = ''; for (let i = 1; i < n; i++) d += `M${-w / 2 + 6},${-h / 2 + (h * i) / n}h${w - 12}`; return `<path d="${d}" stroke="${col}" stroke-width="2.5"/>`; };
const crate = (x, y, s = 70, rot = rr(-15, 15)) => box(x, y, s, s, rot, '#7a5432', { inner: (w, h) => `<path d="M${-w / 2 + 6},${-h / 2 + 6}L${w / 2 - 6},${h / 2 - 6}M${w / 2 - 6},${-h / 2 + 6}L${-w / 2 + 6},${h / 2 - 6}" stroke="#4a2f18" stroke-width="5"/><rect x="${-w / 2 + 5}" y="${-h / 2 + 5}" width="${w - 10}" height="${h - 10}" fill="none" stroke="#4a2f18" stroke-width="3"/>` });
function barrel(x, y, r = 30) {
  layer('props').push(sh(`M${x - r},${y}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`, 10, 14, 0.5) + `<circle cx="${x}" cy="${y}" r="${r}" fill="#8a5a32" stroke="${INK}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${r * 0.72}" fill="none" stroke="#3a2414" stroke-width="3"/><circle cx="${x - r * 0.2}" cy="${y - r * 0.2}" r="${r * 0.35}" fill="#a87448" opacity="0.6"/>`);
}
function column(x, y, r = 40) {
  const P = layer('columns');
  P.push(sh(rect(x - r - 8, y - r - 8, 2 * r + 16, 2 * r + 16), 26, 32, 0.5, 's14'));
  P.push(`<rect x="${x - r - 9}" y="${y - r - 9}" width="${2 * r + 18}" height="${2 * r + 18}" fill="#b4ab9b" stroke="${INK}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ddd5c6" stroke="${INK}" stroke-width="4"/>`);
  const t = []; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; t.push(`M${f(x + Math.cos(a) * r * 0.6)},${f(y + Math.sin(a) * r * 0.6)}L${f(x + Math.cos(a) * r * 0.93)},${f(y + Math.sin(a) * r * 0.93)}`); }
  P.push(`<path d="${t.join('')}" stroke="#8f8676" stroke-width="2.5"/><circle cx="${x - r * 0.18}" cy="${y - r * 0.2}" r="${r * 0.42}" fill="#f2ece0" opacity="0.7"/>`);
}
// statue seen from above: square plinth, figure as shoulders + head + held weapon
function statue(x, y, rot = 0, s = 1) {
  const P = layer('columns');
  P.push(`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${sh(rect(-42, -42, 84, 84), 22, 28, 0.5, 's14')}<rect x="-42" y="-42" width="84" height="84" fill="#9d9586" stroke="${INK}" stroke-width="4"/>
  <path d="M-30,6 Q-30,-14 0,-16 Q30,-14 30,6 Q30,18 0,20 Q-30,18 -30,6Z" fill="#cfc8ba" stroke="${INK}" stroke-width="3.5"/>
  <circle cx="0" cy="0" r="13" fill="#e2dccf" stroke="${INK}" stroke-width="3"/>
  <path d="M22,-36 L26,30" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M22,-36 L26,30" stroke="#bdb5a6" stroke-width="5" stroke-linecap="round"/>
  <path d="M-34,10 Q-38,-8 -26,-20 L-14,-6 Q-22,4 -18,16Z" fill="#b8b0a1" stroke="${INK}" stroke-width="3"/></g>`);
}
function rug(x, y, w, h, grad, trim = '#d9b55a') {
  const P = layer('rugs');
  P.push(sh(rect(x, y, w, h), 4, 6, 0.35));
  P.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${grad})" stroke="${INK}" stroke-width="3"/><rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" fill="none" stroke="${trim}" stroke-width="5"/><rect x="${x + 24}" y="${y + 24}" width="${w - 48}" height="${h - 48}" fill="none" stroke="${trim}" stroke-width="2" opacity="0.7"/>`);
}
function chair(x, y, rot) { box(x, y, 40, 40, rot, '#6a4428', { sw: 3, rx: 5, inner: () => `<rect x="-20" y="-20" width="40" height="10" fill="#3a2414"/>` }); }
function table(x, y, w, h, rot = 0, cloth = false, chairs = true) {
  if (chairs) {
    const n = Math.max(1, Math.round(w / 80));
    for (let i = 0; i < n; i++) {
      const cx = -w / 2 + (w / n) * (i + 0.5);
      const a = (rot * Math.PI) / 180;
      for (const side of [-1, 1]) {
        if (rnd() < 0.18) continue;
        const ox = cx + rr(-6, 6), oy = side * (h / 2 + 26);
        chair(x + ox * Math.cos(a) - oy * Math.sin(a), y + ox * Math.sin(a) + oy * Math.cos(a), rot + (side > 0 ? 180 : 0) + rr(-10, 10));
      }
    }
  }
  box(x, y, w, h, rot, cloth ? '#d8cfbb' : '#7a4f2c', { inner: (ww, hh) => (cloth ? `<rect x="${-ww / 2 + 8}" y="${-hh / 2}" width="${ww - 16}" height="${hh}" fill="#6a1a36" opacity="0.85"/>` : plankLines(ww, hh, 4)) });
}

// ---------- background rock ----------
const BG = layer('bg');
BG.push(`<rect width="${W2}" height="${H2}" fill="#22201e"/><rect width="${W2}" height="${H2}" filter="url(#tex)" opacity="0.9"/>`);
// hatching around the walls, classic dungeon style
{
  const h = [];
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    if (isFloor(x, y)) continue;
    let near = false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (isFloor(x + dx, y + dy)) near = true;
    if (!near) continue;
    for (let i = 0; i < 4; i++) {
      const cx = x * 100 + rr(10, 90), cy = y * 100 + rr(10, 90), a = rr(0, Math.PI), l = rr(14, 30);
      for (let k = -1; k <= 1; k++) h.push(`M${f(cx + Math.cos(a) * -l + Math.sin(a) * k * 8)},${f(cy + Math.sin(a) * -l - Math.cos(a) * k * 8)}l${f(Math.cos(a) * 2 * l)},${f(Math.sin(a) * 2 * l)}`);
    }
  }
  BG.push(`<path d="${h.join('')}" stroke="#0e0c0a" stroke-width="3" opacity="0.8"/>`);
}

// ---------- floors ----------
const FL = layer('floor');
const mats = {};
for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (grid[y][x]) (mats[grid[y][x]] = mats[grid[y][x]] || []).push([x, y]);
for (const [m, list] of Object.entries(mats)) {
  const d = list.map(([x, y]) => rect(x * 100, y * 100, 100, 100)).join('');
  FL.push(`<clipPath id="cl_${m}"><path d="${d}"/></clipPath><g clip-path="url(#cl_${m})">`);
  const t = [];
  if (m === 'marble' || m === 'gallery') {
    for (const [x, y] of list) {
      const even = (x + y) % 2 === 0;
      t.push(`<rect x="${x * 100}" y="${y * 100}" width="100" height="100" fill="${m === 'marble' ? (even ? '#d6d0c4' : '#2f3138') : (even ? '#cdbfa6' : '#a8977c')}"/>`);
      if (m === 'marble') t.push(`<rect x="${x * 100 + 38}" y="${y * 100 + 38}" width="24" height="24" transform="rotate(45 ${x * 100 + 50} ${y * 100 + 50})" fill="${even ? '#b89a52' : '#8a7340'}" opacity="0.8"/>`);
    }
    FL.push(t.join(''));
    FL.push(`<rect width="${W2}" height="${H2}" filter="url(#vein)" opacity="0.45"/>`);
    const g = []; for (const [x, y] of list) g.push(`M${x * 100},${y * 100}h100v100`);
    FL.push(`<path d="${g.join('')}" stroke="${INK}" stroke-width="2" fill="none" opacity="0.5"/>`);
  } else if (m === 'flag') {
    FL.push(`<rect width="${W2}" height="${H2}" fill="#5e5852"/>`);
    for (const [x, y] of list) for (const [ox, oy, w, h] of [[0, 0, 50, 50], [50, 0, 50, 50], [0, 50, 50, 50], [50, 50, 50, 50]]) {
      const j = () => rr(-3, 3);
      t.push(`<rect x="${f(x * 100 + ox + 2 + j())}" y="${f(y * 100 + oy + 2 + j())}" width="${46}" height="${46}" rx="5" fill="${hsl(rr(20, 34), rr(5, 12), rr(40, 52))}" stroke="${INK}" stroke-width="2" stroke-opacity="0.7"/>`);
    }
    FL.push(t.join(''));
    FL.push(`<rect width="${W2}" height="${H2}" filter="url(#tex)" opacity="0.6" style="mix-blend-mode:multiply"/>`);
  } else if (m === 'wood' || m === 'woodDark' || m === 'plank') {
    const base = m === 'woodDark' ? [24, 40, 26] : m === 'plank' ? [30, 34, 34] : [28, 42, 32];
    FL.push(`<rect width="${W2}" height="${H2}" fill="${hsl(base[0], base[1], base[2] - 8)}"/>`);
    const xs = list.map((c) => c[0]), ys = list.map((c) => c[1]);
    const x0 = Math.min(...xs) * 100, x1 = (Math.max(...xs) + 1) * 100, y0 = Math.min(...ys) * 100, y1 = (Math.max(...ys) + 1) * 100;
    for (let y = y0; y < y1; y += 25) { let x = x0 - rr(0, 200); while (x < x1) { const l = rr(140, 320); t.push(`<rect x="${f(x + 1)}" y="${y + 1}" width="${f(l - 2)}" height="23" fill="${hsl(base[0] + rr(-4, 4), base[1], base[2] + rr(-5, 5))}" stroke="${INK}" stroke-width="1.5" stroke-opacity="0.6"/>`); x += l; } }
    FL.push(t.join(''));
    FL.push(`<rect width="${W2}" height="${H2}" filter="url(#grain)" opacity="0.7" style="mix-blend-mode:multiply"/>`);
  } else if (m === 'parquet') {
    FL.push(`<rect width="${W2}" height="${H2}" fill="#5a3a22"/>`);
    for (const [x, y] of list) for (const [ox, oy] of [[0, 0], [50, 0], [0, 50], [50, 50]]) {
      const v = ((ox + oy) / 50) % 2 === 0;
      for (let k = 0; k < 3; k++) t.push(v ? `<rect x="${x * 100 + ox + k * 16.6 + 1}" y="${y * 100 + oy + 1}" width="14.6" height="48" fill="${hsl(28, 40, rr(30, 40))}"/>` : `<rect x="${x * 100 + ox + 1}" y="${y * 100 + oy + k * 16.6 + 1}" width="48" height="14.6" fill="${hsl(30, 42, rr(32, 42))}"/>`);
    }
    FL.push(t.join(''));
    FL.push(`<rect width="${W2}" height="${H2}" filter="url(#grain)" opacity="0.5" style="mix-blend-mode:multiply"/>`);
  } else if (m === 'rug') {
    FL.push(`<rect width="${W2}" height="${H2}" fill="#4a3220"/>`);
    for (const [x, y] of list) t.push(`<rect x="${x * 100 + 1}" y="${y * 100 + 1}" width="98" height="98" fill="${hsl(26, 36, rr(26, 32))}"/>`);
    FL.push(t.join(''));
    FL.push(`<rect width="${W2}" height="${H2}" filter="url(#grain)" opacity="0.6" style="mix-blend-mode:multiply"/>`);
  } else if (m === 'grass') {
    FL.push(`<rect width="${W2}" height="${H2}" fill="#3d4a26"/>`);
    for (let i = 0; i < 40; i++) FL.push(`<path d="${blob(rr(1300, 3100), rr(1500, 2400), rr(80, 200), rr(60, 160), 0.3)}" fill="${pick(['#4a5a2c', '#35421f', '#55602f'])}" opacity="0.7" filter="url(#s40)"/>`);
    FL.push(`<rect width="${W2}" height="${H2}" filter="url(#fine)" opacity="0.7" style="mix-blend-mode:multiply"/>`);
    const tf = []; for (let i = 0; i < 900; i++) { const x = rr(1300, 3100), y = rr(1500, 2400); tf.push(`M${f(x)},${f(y)}q-3,-12 -9,-18M${f(x)},${f(y)}q1,-14 2,-22M${f(x)},${f(y)}q4,-11 10,-16`); }
    FL.push(`<path d="${tf.join('')}" stroke="#5f7030" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>`);
  }
  FL.push('</g>');
}

// ---------- walls from the grid ----------
// collect boundary edges between floor and rock, merged into straight runs
const edges = [];
for (let y = 0; y <= GH; y++) { let run = null; for (let x = 0; x <= GW; x++) {
  const e = x < GW && (isFloor(x, y - 1) !== isFloor(x, y)) && !(y === GH) && !(y === 0 && !isFloor(x, 0));
  const edge = x < GW && isFloor(x, y - 1) !== isFloor(x, y);
  if (edge && !run) run = [x, y]; if (!edge && run) { edges.push([[run[0] * 100, y * 100], [x * 100, y * 100]]); run = null; }
} }
for (let x = 0; x <= GW; x++) { let run = null; for (let y = 0; y <= GH; y++) {
  const edge = y < GH && isFloor(x - 1, y) !== isFloor(x, y);
  if (edge && !run) run = [x, y]; if (!edge && run) { edges.push([[x * 100, run[1] * 100], [x * 100, y * 100]]); run = null; }
} }
// drop the map-edge opening at the gate entry (south edge)
const wallEdges = edges.filter(([[ax, ay], [bx, by]]) => !(ay === H2 && by === H2));
{
  const WS = layer('wallShadow'), WL = layer('walls');
  const d = wallEdges.map(([[ax, ay], [bx, by]]) => `M${ax},${ay}L${bx},${by}`).join('');
  // soft shadow cast into rooms
  WS.push(`<path d="${d}" stroke="#000" stroke-width="70" stroke-linecap="square" transform="translate(14,18)" opacity="0.6" filter="url(#s14)"/>`);
  WL.push(`<path d="${d}" stroke="${INK}" stroke-width="44" stroke-linecap="square"/>`);
  WL.push(`<path d="${d}" stroke="#7d756a" stroke-width="34" stroke-linecap="square"/>`);
  // block joints and a lit top edge
  const j = [];
  for (const [[ax, ay], [bx, by]] of wallEdges) {
    const len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len;
    for (let s = rr(10, 40); s < len; s += rr(38, 60)) j.push(`M${f(ax + ux * s - uy * 17)},${f(ay + uy * s + ux * 17)}l${f(uy * 34)},${f(-ux * 34)}`);
  }
  WL.push(`<path d="${j.join('')}" stroke="${INK}" stroke-width="3"/>`);
  WL.push(`<path d="${d}" stroke="#b7ae9e" stroke-width="8" stroke-linecap="square" transform="translate(-6,-6)" opacity="0.55"/>`);
}

// ---------- doors ----------
{
  const DR = layer('doors');
  for (const [x, y, horiz, n, kind] of doors) {
    const px = x * 100, py = y * 100, len = n * 100;
    const rot = horiz ? 0 : 90;
    if (kind === 'portcullis') {
      // iron grate raised halfway: bars across the opening
      const bars = []; for (let i = 10; i < len; i += 22) bars.push(`M${i},-10v20`);
      DR.push(`<g transform="translate(${px},${py}) rotate(${rot})"><rect x="0" y="-12" width="${len}" height="24" fill="#2a2a2e" stroke="${INK}" stroke-width="4"/><path d="${bars.join('')}M0,0h${len}" stroke="#6a6a72" stroke-width="5"/></g>`);
      continue;
    }
    if (kind === 'secret') {
      // looks like wall from the throne side; a faint seam marks it for the GM
      DR.push(`<g transform="translate(${px},${py}) rotate(${rot})"><rect x="6" y="-20" width="${len - 12}" height="40" fill="#7d756a" stroke="${INK}" stroke-width="3"/><path d="M${len / 2},-18v36" stroke="${INK}" stroke-width="2" stroke-dasharray="5 5"/></g>`);
      continue;
    }
    const thick = kind === 'great' ? 26 : 20;
    // double doors standing open, swung into the room beyond
    const leaf = len / 2 - 4;
    DR.push(`<g transform="translate(${px},${py}) rotate(${rot})">
      <rect x="-4" y="-22" width="12" height="44" fill="#5a524a" stroke="${INK}" stroke-width="3"/><rect x="${len - 8}" y="-22" width="12" height="44" fill="#5a524a" stroke="${INK}" stroke-width="3"/>
      <g transform="translate(8,0) rotate(-62)"><rect x="0" y="${-thick / 2}" width="${leaf}" height="${thick}" rx="3" fill="#5a3620" stroke="${INK}" stroke-width="4"/>${kind === 'great' ? `<path d="M10,0h${leaf - 20}" stroke="#c9a24a" stroke-width="4"/>` : `<path d="M8,-3h${leaf - 16}M8,4h${leaf - 16}" stroke="#2f1d10" stroke-width="2"/>`}</g>
      <g transform="translate(${len - 8},0) rotate(242)"><rect x="0" y="${-thick / 2}" width="${leaf}" height="${thick}" rx="3" fill="#5a3620" stroke="${INK}" stroke-width="4"/>${kind === 'great' ? `<path d="M10,0h${leaf - 20}" stroke="#c9a24a" stroke-width="4"/>` : `<path d="M8,-3h${leaf - 16}M8,4h${leaf - 16}" stroke="#2f1d10" stroke-width="2"/>`}</g></g>`);
  }
}

// ---------- THRONE ROOM (boss arena): open centre, pillars at the edges, dais, ritual circle ----------
{
  // dais in three tiers against the north wall
  const P = layer('props');
  for (const [x, y, w, h, l] of [[1700, 100, 1100, 330, 46], [1800, 100, 900, 250, 54], [1900, 100, 700, 170, 62]]) {
    P.push(sh(rect(x, y, w, h), 10, 14, 0.5) + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${hsl(250, 8, l)}" stroke="${INK}" stroke-width="4"/><rect x="${x}" y="${y + h - 8}" width="${w}" height="8" fill="#000" opacity="0.3"/>`);
  }
  P.push(`<rect x="1700" y="100" width="1100" height="330" filter="url(#vein)" opacity="0.3"/>`);
  // throne
  P.push(sh('M2170,120h160v120h-160Z', 16, 20, 0.6));
  P.push(`<rect x="2160" y="112" width="180" height="46" rx="8" fill="#a8a2b8" stroke="${INK}" stroke-width="4"/><path d="M2180,112 L2205,84 L2250,70 L2295,84 L2320,112Z" fill="#c9c3d8" stroke="${INK}" stroke-width="4"/>`);
  P.push(`<rect x="2160" y="150" width="36" height="100" rx="6" fill="#8f89a0" stroke="${INK}" stroke-width="4"/><rect x="2304" y="150" width="36" height="100" rx="6" fill="#8f89a0" stroke="${INK}" stroke-width="4"/><rect x="2196" y="158" width="108" height="88" rx="10" fill="#2c3f6b" stroke="${INK}" stroke-width="4"/><circle cx="2250" cy="92" r="11" fill="#7ad0ff" stroke="${INK}" stroke-width="3"/>`);
  // carpet from the great doors to the dais
  rug(2120, 430, 260, 670, 'carpetH', '#c9a24a');
  // ritual circle in the open centre: glowing arcane ring the boss can draw power from
  const cx = 2250, cy = 760;
  const ring = [];
  ring.push(`<circle cx="${cx}" cy="${cy}" r="300" fill="none" stroke="#c9b6ff" stroke-width="6" opacity="0.85"/><circle cx="${cx}" cy="${cy}" r="270" fill="none" stroke="#c9b6ff" stroke-width="2.5" opacity="0.7"/>`);
  const tri = (r, a0) => poly([0, 1, 2].map((i) => [cx + Math.cos(a0 + (i * 2 * Math.PI) / 3) * r, cy + Math.sin(a0 + (i * 2 * Math.PI) / 3) * r]));
  ring.push(`<path d="${tri(270, -Math.PI / 2)}${tri(270, Math.PI / 2)}" fill="none" stroke="#c9b6ff" stroke-width="3" opacity="0.75"/>`);
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; ring.push(`<path d="M${f(cx + Math.cos(a) * 278)},${f(cy + Math.sin(a) * 278)}l${f(Math.cos(a + 1.2) * 12)},${f(Math.sin(a + 1.2) * 12)}l${f(Math.cos(a + 2.4) * 10)},${f(Math.sin(a + 2.4) * 10)}" stroke="#e2d8ff" stroke-width="2.5" fill="none"/>`); }
  layer('arcane').push(`<g>${ring.join('')}</g>`);
  layer('glow').push(`<circle cx="${cx}" cy="${cy}" r="460" fill="url(#arcane)"/>`);
  // pillars ring the room, leaving the middle open for movement
  for (const y of [300, 550, 800, 1000]) { column(1350, y); column(3150, y); }
  for (const x of [1700, 2800]) column(x, 1000);
  // braziers at the dais corners and by the door
  brazier(1640, 160); brazier(2860, 160); brazier(1950, 1020); brazier(2550, 1020);
  // two shallow fire trenches flanking the carpet: hazard terrain
  for (const tx of [1600, 2800]) {
    P.push(`<rect x="${tx}" y="560" width="100" height="300" rx="10" fill="#1a0d08" stroke="${INK}" stroke-width="5"/><rect x="${tx}" y="560" width="100" height="300" rx="10" fill="none" stroke="#6a5a4a" stroke-width="3" transform="translate(-6,-6)"/>`);
    for (let y = 600; y < 860; y += 70) fire(tx + 50 + rr(-10, 10), y, 34);
  }
  // hanging banners along the north wall (seen from above as cloth folded over a rod)
  for (const bx of [1450, 3050]) P.push(`<rect x="${bx - 50}" y="100" width="100" height="40" fill="#2c3f6b" stroke="${INK}" stroke-width="3"/><path d="M${bx - 56},104h112" stroke="#c9a24a" stroke-width="8" stroke-linecap="round"/><circle cx="${bx}" cy="120" r="12" fill="#c9a24a"/>`);
}

// ---------- ANTECHAMBER: a narrow killing floor guarded by two statues ----------
statue(2000, 1300, 0, 1.1); statue(2500, 1300, 0, 1.1);
brazier(1960, 1260, 24); brazier(2540, 1260, 24);

// ---------- COURTYARD: open sky, reflecting pool, hedges for cover, colonnade ----------
{
  const P = layer('props');
  // gravel paths
  P.push(`<rect x="1350" y="1950" width="1700" height="100" fill="#8a826f" opacity="0.9"/><rect x="2150" y="1500" width="200" height="900" fill="#8a826f" opacity="0.9"/><rect x="1350" y="1950" width="1700" height="100" filter="url(#fine)"/><rect x="2150" y="1500" width="200" height="900" filter="url(#fine)"/>`);
  // reflecting pool: deep water (swim), with a fountain statue
  P.push(sh(rect(1900, 1650, 700, 600), 18, 22, 0.55, 's14'));
  P.push(`<rect x="1900" y="1650" width="700" height="600" rx="20" fill="#9c9484" stroke="${INK}" stroke-width="5"/><rect x="1940" y="1690" width="620" height="520" rx="12" fill="#163440" stroke="${INK}" stroke-width="4"/>`);
  P.push(`<rect x="1940" y="1690" width="620" height="520" rx="12" fill="#3f7c8c" filter="url(#stoneTex)" opacity="0.5"/>`);
  for (let i = 0; i < 26; i++) { const x = rr(1970, 2520), y = rr(1720, 2180); P.push(`<path d="M${f(x)},${f(y)}q14,-6 28,0" stroke="#bfe6ec" stroke-width="2.5" fill="none" opacity="0.6"/>`); }
  // lily pads
  for (let i = 0; i < 9; i++) { const x = rr(1980, 2520), y = rr(1730, 2170); P.push(`<path d="M${f(x)},${f(y)} m-16,0 a16,16 0 1,0 32,0 a16,16 0 1,0 -32,0Z" fill="#4c6a2c" stroke="${INK}" stroke-width="2"/>`); }
  statue(2250, 1950, 180, 0.9);
  // hedges (cover), L-shaped around the corners
  const hedge = (x, y, w, h) => { P.push(sh(rect(x, y, w, h), 14, 18, 0.5) + `<g filter="url(#leafy)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${INK}"/><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="16" fill="#2a3d1e"/><rect x="${x + 7}" y="${y + 5}" width="${w - 18}" height="${h * 0.5}" rx="12" fill="#3f5a2a"/></g>`); };
  hedge(1420, 1580, 400, 70); hedge(1420, 1580, 70, 300); hedge(2680, 1580, 400, 70); hedge(3010, 1580, 70, 300);
  hedge(1420, 2120, 70, 230); hedge(1420, 2280, 400, 70); hedge(3010, 2120, 70, 230); hedge(2680, 2280, 400, 70);
  // two ornamental trees
  for (const [tx, ty, col] of [[1650, 1800, ['#3a1a2a', '#6a2a4a', '#9a4a6a', '#c87a94']], [2850, 2150, ['#3a1a2a', '#6a2a4a', '#9a4a6a', '#c87a94']]]) {
    const lobes = []; for (let i = 0; i < 6; i++) { const a = rr(0, 6.28), d = rr(0, 50); lobes.push([tx + Math.cos(a) * d, ty + Math.sin(a) * d, rr(60, 80)]); }
    const lp = (k, dx = 0, dy = 0) => lobes.map(([x, y, r]) => blob(x + dx, y + dy, r * k, r * k, 0.18, 12)).join('');
    layer('canopyShadow').push(`<path d="${lp(1, 50, 60)}" fill="#000" opacity="0.45" filter="url(#s14)"/>`);
    layer('canopy').push(`<g filter="url(#leafy)"><path d="${lp(1.05)}" fill="${INK}"/><path d="${lp(1)}" fill="${col[0]}"/><path d="${lp(0.8, -10, -12)}" fill="${col[1]}"/><path d="${lp(0.55, -18, -22)}" fill="${col[2]}"/>${lobes.map(([x, y, r]) => `<path d="${blob(x - r * 0.35, y - r * 0.4, r * 0.25, r * 0.2, 0.3, 9)}" fill="${col[3]}"/>`).join('')}</g>`);
  }
  // fallen petals
  for (let i = 0; i < 260; i++) { const x = rr(1350, 3050), y = rr(1550, 2350); P.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="4" ry="2.5" transform="rotate(${f(rr(0, 180))} ${f(x)} ${f(y)})" fill="#e0a0b8" opacity="0.8"/>`); }
  // colonnade along the north and south edges
  for (let x = 1450; x <= 3050; x += 400) { if (x !== 2250) column(x, 1550, 30); column(x, 2340, 30); }
  layer('moon').push(`<rect x="1300" y="1500" width="1800" height="900" fill="url(#moon)"/>`);
}

// ---------- BARRACKS: bunks, racks, a mess table, crates (difficult terrain) ----------
{
  const bunk = (x, y, rot) => box(x, y, 90, 190, rot, '#6a4428', { inner: (w, h) => `<rect x="${-w / 2 + 8}" y="${-h / 2 + 8}" width="${w - 16}" height="${h - 16}" rx="6" fill="#7a6a52"/><rect x="${-w / 2 + 8}" y="${-h / 2 + 8}" width="${w - 16}" height="44" rx="8" fill="#d8d0bc" stroke="${INK}" stroke-width="2"/><path d="M${-w / 2 + 8},${-h / 2 + 90}h${w - 16}v${h - 98}h${-w + 16}Z" fill="#4a5a7a" stroke="${INK}" stroke-width="2"/>` });
  for (const x of [300, 450, 600, 750]) bunk(x, 1440, 0);
  for (const x of [300, 450]) bunk(x, 2160, 180);
  table(800, 1900, 280, 100, 0, false);
  // weapon rack against the east wall
  box(1040, 1800, 50, 300, 0, '#5a3a22', { inner: () => { let s = ''; for (let i = -130; i <= 130; i += 40) s += `<path d="M-20,${i}h40" stroke="#b8bcc4" stroke-width="5" stroke-linecap="round"/><circle cx="-22" cy="${i}" r="5" fill="#8a6a3a"/>`; return s; } });
  crate(620, 2140); crate(690, 2190, 60); crate(560, 2210, 55); barrel(980, 2200); barrel(1030, 2150, 26);
  // training dummy
  layer('props').push(`<circle cx="320" cy="1840" r="30" fill="#c9a86a" stroke="${INK}" stroke-width="4"/><path d="M280,1840h80" stroke="#6a4428" stroke-width="10" stroke-linecap="round"/><circle cx="320" cy="1840" r="12" fill="#a8864a"/>`);
  brazier(1000, 1380, 26);
}

// ---------- LIBRARY + SHRINE (rest spot): shelf aisles, reading table, candlelit altar ----------
{
  const shelf = (x, y, w, h) => box(x, y, w, h, 0, '#3a2414', { inner: (ww, hh) => { let s = ''; const vertical = hh > ww; const n = Math.floor((vertical ? hh : ww) / 14); for (let i = 0; i < n; i++) { const c = pick(['#7a2a2a', '#2a4a6a', '#5a6a2a', '#8a6a2a', '#4a2a5a', '#6a4a2a']); s += vertical ? `<rect x="${-ww / 2 + 6}" y="${-hh / 2 + 4 + i * 14}" width="${ww - 12}" height="11" fill="${c}"/>` : `<rect x="${-ww / 2 + 4 + i * 14}" y="${-hh / 2 + 6}" width="11" height="${hh - 12}" fill="${c}"/>`; } return s; } });
  for (const x of [330, 520, 710]) { shelf(x, 420, 60, 360); }
  shelf(560, 230, 560, 50);
  table(470, 860, 220, 110, 0, false);
  rug(260, 700, 140, 300, 'carpet', '#c9a24a');
  // scattered books and a toppled shelf
  box(880, 640, 60, 300, 24, '#3a2414');
  for (let i = 0; i < 14; i++) box(rr(760, 960), rr(500, 820), 26, 20, rr(0, 360), pick(['#7a2a2a', '#2a4a6a', '#8a6a2a']), { sw: 2, rx: 2, noShadow: true });
  // shrine alcove: altar, candles, kneeling cushions
  box(880, 290, 160, 80, 0, '#c9c0ad', { inner: (w, h) => `<rect x="-60" y="-26" width="120" height="52" fill="none" stroke="#c9a24a" stroke-width="3"/><circle cx="0" cy="0" r="14" fill="#7ad0ff" stroke="${INK}" stroke-width="3"/>` });
  candles(800, 280); candles(960, 280);
  for (const x of [840, 920]) layer('props').push(`<rect x="${x - 22}" y="410" width="44" height="36" rx="8" fill="#6a1a36" stroke="${INK}" stroke-width="3"/>`);
}

// ---------- CAPTAIN'S QUARTERS + strongroom (rest spot / loot) ----------
{
  rug(3580, 400, 520, 400, 'carpet', '#c9a24a');
  box(3900, 300, 200, 90, 0, '#5a3620', { inner: () => `<rect x="-80" y="-30" width="60" height="44" fill="#e8dfc8" transform="rotate(-8)"/><circle cx="50" cy="-10" r="8" fill="#1a1a2a"/>` });
  chair(3900, 380, 180);
  // bed with canopy posts
  box(3720, 1100, 200, 240, 0, '#5a3620', { inner: (w, h) => `<rect x="-88" y="-108" width="176" height="216" rx="8" fill="#2c3f6b"/><rect x="-80" y="-104" width="160" height="50" rx="10" fill="#e8dfc8" stroke="${INK}" stroke-width="2"/>${[[-96, -116], [96, -116], [-96, 116], [96, 116]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="9" fill="#3a2414" stroke="${INK}" stroke-width="2"/>`).join('')}` });
  // treasure chests and coin spill
  for (const [x, y, r] of [[4050, 900, 8], [4060, 1080, -12], [3950, 1220, 30]]) box(x, y, 110, 70, r, '#6a4428', { inner: (w, h) => `<rect x="${-w / 2}" y="-6" width="${w}" height="12" fill="#c9a24a"/><rect x="-8" y="-12" width="16" height="22" fill="#e2c26a" stroke="${INK}" stroke-width="2"/>` });
  for (let i = 0; i < 60; i++) { const x = 3980 + rr(-60, 40), y = 1000 + rr(-30, 60); layer('props').push(`<circle cx="${f(x)}" cy="${f(y)}" r="6" fill="#e2c26a" stroke="#8a6a2a" stroke-width="1.5"/>`); }
  statue(3620, 300, 135, 0.9);
  candles(3700, 700, 4);
}

// ---------- BANQUET HALL: long tables (difficult terrain), fallen chandelier, hearth ----------
{
  table(3700, 2200, 120, 900, 0, true, false);
  for (let y = 1830; y <= 2580; y += 80) { if (rnd() > 0.15) chair(3610, y + rr(-6, 6), 90 + rr(-12, 12)); if (rnd() > 0.15) chair(3790, y + rr(-6, 6), 270 + rr(-12, 12)); }
  // second table overturned on its side as a barricade
  box(3540, 2780, 380, 60, 78, '#5a3620', { inner: (w, h) => plankLines(w, h, 3) });
  for (let i = 0; i < 5; i++) chair(rr(3460, 3640), rr(2650, 2950), rr(0, 360));
  // food and plates on the clothed table
  for (let y = 1820; y <= 2600; y += 110) layer('props').push(`<circle cx="${3700 + rr(-24, 24)}" cy="${y}" r="16" fill="#e8e2d2" stroke="${INK}" stroke-width="2"/><circle cx="${3700 + rr(-20, 20)}" cy="${y + 50}" r="10" fill="#c9a24a" stroke="${INK}" stroke-width="2"/>`);
  // fallen chandelier: iron ring with broken candles, glass shards around it
  layer('props').push(`<circle cx="3900" cy="1820" r="110" fill="none" stroke="${INK}" stroke-width="14"/><circle cx="3900" cy="1820" r="110" fill="none" stroke="#3a3a40" stroke-width="9"/><path d="M3790,1820h220M3900,1710v220" stroke="#3a3a40" stroke-width="7"/>`);
  for (let i = 0; i < 40; i++) { const a = rr(0, 6.28), d = rr(90, 200); layer('props').push(`<path d="${poly(polyPts(3900 + Math.cos(a) * d, 1820 + Math.sin(a) * d, rr(5, 10), 3, 0.4))}" fill="#cfe6ee" stroke="${INK}" stroke-width="1.2" opacity="0.85"/>`); }
  // hearth on the east wall
  box(4150, 2350, 70, 300, 0, '#5a524a', { inner: () => `<rect x="-25" y="-120" width="50" height="240" fill="#140b07"/>` });
  fire(4150, 2300, 40); fire(4150, 2410, 36);
  rug(3450, 1650, 160, 120, 'carpet');
  brazier(3500, 1680, 24);
}

// ---------- LONG GALLERY: statues in alcoves, suits of armour, runner carpet ----------
{
  rug(1250, 2660, 2100, 180, 'carpet', '#c9a24a');
  for (const [x, y] of alcoves) statue(x * 100 + 50, y * 100 + 50, y === 25 ? 180 : 0, 0.85);
  // suits of armour on stands between alcoves
  for (const x of [1720, 2300, 2840, 3240]) for (const y of [2640, 2860]) layer('props').push(`<g transform="translate(${x},${y})">${sh('M-24,-24h48v48h-48Z', 10, 12, 0.5)}<rect x="-24" y="-24" width="48" height="48" fill="#3a3a40" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="0" rx="20" ry="13" fill="#a8b0bc" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="0" r="9" fill="#cfd6e0" stroke="${INK}" stroke-width="2"/></g>`);
  for (const x of [1500, 2500, 3200]) candles(x, 2620, 2);
}

// ---------- GATEHOUSE: barricades, guard post, murder holes ----------
{
  // sandbag / crate barricade across the entry hall
  crate(500, 2850, 70, 6); crate(580, 2860, 70, -8); crate(980, 2850, 70, 4); crate(1060, 2860, 65, -10);
  box(780, 2620, 300, 50, 0, '#5a3620', { inner: (w, h) => plankLines(w, h, 3) });
  // spiked barricades (cheval de frise)
  for (const x of [400, 1100]) layer('props').push(`<g transform="translate(${x},2500)">${sh('M-90,-12h180v24h-180Z', 10, 14, 0.5)}<rect x="-90" y="-10" width="180" height="20" fill="#5a3620" stroke="${INK}" stroke-width="3"/>${[-70, -35, 0, 35, 70].map((o) => `<path d="M${o - 18},-26L${o + 18},26M${o + 18},-26L${o - 18},26" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${o - 18},-26L${o + 18},26M${o + 18},-26L${o - 18},26" stroke="#8a6a42" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`);
  // guard post
  table(330, 2950, 140, 90, 90, false);
  barrel(1120, 2980); barrel(1160, 3040, 26);
  // murder-hole grates in the floor
  for (const [x, y] of [[700, 2700], [900, 2700]]) layer('props').push(`<rect x="${x - 30}" y="${y - 30}" width="60" height="60" fill="#120a06" stroke="${INK}" stroke-width="3"/><path d="M${x - 30},${y - 10}h60M${x - 30},${y + 10}h60M${x - 10},${y - 30}v60M${x + 10},${y - 30}v60" stroke="#5a5a62" stroke-width="5"/>`);
  brazier(300, 2500, 26); brazier(1150, 2700, 26);
}

// ---------- STOREROOM (rest spot) ----------
crate(1880, 3060); crate(1950, 3050, 60); barrel(2280, 3050); barrel(2340, 3060, 26); box(2120, 3070, 120, 50, 0, '#d8cfbb', { inner: () => `<path d="M-50,0h100" stroke="#a89878" stroke-width="3"/>` });
candles(2120, 3020, 1);

// ---------- dust, debris, lighting ----------
{
  const D = layer('dust');
  for (let i = 0; i < 1500; i++) { const x = rr(0, W2), y = rr(0, H2); if (!isFloor(Math.floor(x / 100), Math.floor(y / 100))) continue; D.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr(1.5, 3.5))}" fill="${pick(['#c9c2b3', '#8a8276', '#3a3430'])}" opacity="${f(rr(0.2, 0.5))}"/>`); }
}
const LT = layer('light');
LT.push(`<rect width="${W2}" height="${H2}" fill="#0c1430" opacity="0.4" style="mix-blend-mode:multiply"/>`);
LT.push(`<rect width="${W2}" height="${H2}" fill="url(#vignette)"/>`);

const order = ['bg', 'floor', 'rugs', 'wallShadow', 'arcane', 'props', 'dust', 'columns', 'canopyShadow', 'canopy', 'doors', 'walls', 'light', 'glow', 'moon'];
const body = order.map((k) => {
  const attr = k === 'walls' ? ' filter="url(#rough)"' : k === 'glow' || k === 'moon' ? ' style="mix-blend-mode:screen"' : k === 'wallShadow' ? ' clip-path="url(#allFloor)"' : '';
  return `<g id="${k}"${attr}>${(L[k] || []).join('\n')}</g>`;
}).join('\n');
const allFloor = `<clipPath id="allFloor"><path d="${cells(isFloor)}"/></clipPath>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}" viewBox="0 0 ${W2} ${H2}"><defs>${defs.join('')}${allFloor}</defs>${body}<g>${(L.fire || []).join('')}</g><g style="mix-blend-mode:screen" opacity="0.35">${(L.arcane || []).join('')}</g></svg>`;
fs.writeFileSync(OUT + '/palace-keep.svg', svg);
fs.writeFileSync(OUT + '/palace-keep-walls.json', JSON.stringify({ walls: wallEdges, doors }));
console.log('svg bytes', svg.length, 'wall runs', wallEdges.length);
