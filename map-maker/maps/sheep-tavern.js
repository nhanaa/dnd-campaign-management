// Procedural SVG battlemap: a small village tavern (sign: a sheep) on a muddy main street. Original design.
// 22 x 16 squares, 100 units per square. Daytime. Built as an opening/hub scene: bar, hearth, notice board,
// a quiet back room, kitchen, and the street outside. Drawing helpers are copied from palace-keep.js.
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

const GW = 22, GH = 16;
const W2 = GW * 100, H2 = GH * 100;
const INK = '#1e140e';
const L = {};
const layer = (k) => (L[k] = L[k] || []);
const defs = [];

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
// Light sources for Foundry export: {x, y} in SVG units, range in squares (dim radius; bright is half), color AARRGGBB,
// optional anim (a Foundry light animation such as 'torch' or 'pulse'; the Foundry exporter defaults to torch).
const lights = [];
function fire(x, y, r) {
  lights.push({ x: Math.round(x), y: Math.round(y), range: 8, color: 'ffffa040' });
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
  lights.push({ x, y, range: 2, color: 'ffffd27a' });
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

// ---------- layout ----------
// Building interior: x 2..18, y 1..12 (squares). Common room on the west, kitchen (NE) and back room (SE)
// behind a timber partition. Outside: grass yard with a sheep pen to the east, muddy main street to the south.
const grid = [...Array(GH)].map(() => Array(GW).fill(null));
function room(x0, y0, x1, y1, mat) { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) grid[y][x] = mat; }
room(2, 1, 13, 12, 'wood');      // common room
room(13, 1, 18, 6, 'flag');      // kitchen
room(13, 6, 18, 12, 'woodDark'); // back room
const isFloor = (x, y) => x >= 0 && y >= 0 && x < GW && y < GH && grid[y][x] !== null;

// doors: [x, y, horizontal, length, kind] along cell edges
const doors = [
  [7, 12, true, 2],     // front door onto the street
  [13, 3, false, 1],    // bar -> kitchen
  [13, 9, false, 1],    // common room -> back room
  [18, 3, false, 1],    // kitchen back door to the yard
];
// timber partition walls inside the building (SVG units), with gaps where doors go
const inner = [
  [[1300, 100], [1300, 1200]],
  [[1300, 600], [1800, 600]],
];

// ---------- outside ground ----------
const BG = layer('bg');
BG.push(`<rect width="${W2}" height="${H2}" fill="#4f5e2e"/>`);
for (let i = 0; i < 30; i++) BG.push(`<path d="${blob(rr(0, W2), rr(0, 1300), rr(80, 200), rr(60, 150), 0.3)}" fill="${pick(['#5a6a34', '#46552a', '#61703a'])}" opacity="0.7" filter="url(#s40)"/>`);
BG.push(`<rect width="${W2}" height="${H2}" filter="url(#fine)" opacity="0.6" style="mix-blend-mode:multiply"/>`);
{
  const tf = []; for (let i = 0; i < 700; i++) { const x = rr(0, W2), y = rr(0, 1300); if (x > 180 && x < 1820 && y > 80 && y < 1220) continue; tf.push(`M${f(x)},${f(y)}q-3,-12 -9,-18M${f(x)},${f(y)}q1,-14 2,-22M${f(x)},${f(y)}q4,-11 10,-16`); }
  BG.push(`<path d="${tf.join('')}" stroke="#6f803a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>`);
}
// muddy main street along the south edge, and a trodden path to the front door
{
  const S = layer('street');
  const top = []; for (let x = -50; x <= W2 + 50; x += 100) top.push([x, 1300 + rr(-25, 25)]);
  const pts = [...top, [W2 + 50, H2 + 50], [-50, H2 + 50]];
  S.push(`<path d="${smoothClosed(pts)}" fill="#6b5236"/>`);
  S.push(`<path d="${blob(800, 1260, 160, 70, 0.2)}" fill="#6b5236"/>`);
  S.push(`<rect width="${W2}" height="${H2}" filter="url(#tex)" opacity="0.5" style="mix-blend-mode:multiply" clip-path="url(#streetClip)"/>`);
  defs.push(`<clipPath id="streetClip"><path d="${smoothClosed(pts)}"/><path d="${blob(800, 1260, 160, 70, 0.2)}"/></clipPath>`);
  // cart ruts
  S.push(`<path d="${smoothOpen([[-50, 1420], [600, 1430], [1300, 1410], [2250, 1425]])}" stroke="#4e3a24" stroke-width="10" fill="none" opacity="0.7"/><path d="${smoothOpen([[-50, 1500], [600, 1510], [1300, 1490], [2250, 1505]])}" stroke="#4e3a24" stroke-width="10" fill="none" opacity="0.7"/>`);
  // puddles
  for (const [x, y, rx, ry] of [[350, 1470, 90, 40], [1250, 1530, 120, 45], [1900, 1420, 70, 35], [900, 1560, 60, 25]]) {
    S.push(`<path d="${blob(x, y, rx, ry, 0.25)}" fill="#3e4a52" stroke="#4e3a24" stroke-width="4"/><path d="${blob(x - rx * 0.2, y - ry * 0.25, rx * 0.4, ry * 0.25, 0.3)}" fill="#8aa4b0" opacity="0.5"/>`);
  }
  // hoof prints and wool tufts
  for (let i = 0; i < 90; i++) { const x = rr(0, W2), y = rr(1340, H2); S.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="5" ry="7" fill="#4a3826" opacity="0.6"/>`); }
  for (let i = 0; i < 40; i++) { const x = rr(0, W2), y = rr(1300, H2); S.push(`<path d="${blob(x, y, 7, 5, 0.4, 8)}" fill="#e8e2d2" opacity="0.85"/>`); }
}
// building's shadow on the ground
layer('bgShadow').push(`<rect x="200" y="100" width="1600" height="1100" transform="translate(26,32)" fill="#000" opacity="0.5" filter="url(#s14)"/>`);

// ---------- floors ----------
{
  const FL = layer('floor');
  const mats = {};
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (grid[y][x]) (mats[grid[y][x]] = mats[grid[y][x]] || []).push([x, y]);
  for (const [m, list] of Object.entries(mats)) {
    const d = list.map(([x, y]) => rect(x * 100, y * 100, 100, 100)).join('');
    FL.push(`<clipPath id="cl_${m}"><path d="${d}"/></clipPath><g clip-path="url(#cl_${m})">`);
    const t = [];
    if (m === 'flag') {
      FL.push(`<rect width="${W2}" height="${H2}" fill="#5e5852"/>`);
      for (const [x, y] of list) for (const [ox, oy] of [[0, 0], [50, 0], [0, 50], [50, 50]]) {
        const j = () => rr(-3, 3);
        t.push(`<rect x="${f(x * 100 + ox + 2 + j())}" y="${f(y * 100 + oy + 2 + j())}" width="46" height="46" rx="5" fill="${hsl(rr(24, 36), rr(6, 12), rr(46, 58))}" stroke="${INK}" stroke-width="2" stroke-opacity="0.7"/>`);
      }
      FL.push(t.join(''));
      FL.push(`<rect width="${W2}" height="${H2}" filter="url(#tex)" opacity="0.5" style="mix-blend-mode:multiply"/>`);
    } else {
      const base = m === 'woodDark' ? [24, 38, 30] : [30, 44, 40];
      FL.push(`<rect width="${W2}" height="${H2}" fill="${hsl(base[0], base[1], base[2] - 8)}"/>`);
      const xs = list.map((c) => c[0]), ys = list.map((c) => c[1]);
      const x0 = Math.min(...xs) * 100, x1 = (Math.max(...xs) + 1) * 100, y0 = Math.min(...ys) * 100, y1 = (Math.max(...ys) + 1) * 100;
      for (let y = y0; y < y1; y += 25) { let x = x0 - rr(0, 200); while (x < x1) { const l = rr(140, 320); t.push(`<rect x="${f(x + 1)}" y="${y + 1}" width="${f(l - 2)}" height="23" fill="${hsl(base[0] + rr(-4, 4), base[1], base[2] + rr(-5, 5))}" stroke="${INK}" stroke-width="1.5" stroke-opacity="0.6"/>`); x += l; } }
      FL.push(t.join(''));
      FL.push(`<rect width="${W2}" height="${H2}" filter="url(#grain)" opacity="0.6" style="mix-blend-mode:multiply"/>`);
    }
    FL.push('</g>');
  }
}

// ---------- walls ----------
// outer walls: every edge between building floor and outside, merged into straight runs
const edges = [];
for (let y = 0; y <= GH; y++) { let run = null; for (let x = 0; x <= GW; x++) {
  const edge = x < GW && isFloor(x, y - 1) !== isFloor(x, y);
  if (edge && !run) run = [x, y]; if (!edge && run) { edges.push([[run[0] * 100, y * 100], [x * 100, y * 100]]); run = null; }
} }
for (let x = 0; x <= GW; x++) { let run = null; for (let y = 0; y <= GH; y++) {
  const edge = y < GH && isFloor(x - 1, y) !== isFloor(x, y);
  if (edge && !run) run = [x, y]; if (!edge && run) { edges.push([[x * 100, run[1] * 100], [x * 100, y * 100]]); run = null; }
} }
// cut door openings out of collinear wall runs
function cutDoors(segs) {
  const gaps = doors.map(([x, y, h, n = 1]) => (h ? { y: y * 100, a: x * 100, b: (x + n) * 100 } : { x: x * 100, a: y * 100, b: (y + n) * 100 }));
  let out = segs;
  for (const g of gaps) {
    const next = [];
    for (const s of out) {
      const [[ax, ay], [bx, by]] = s;
      const horiz = ay === by;
      if (horiz && g.y === ay && g.x === undefined) {
        const [lo, hi] = [Math.min(ax, bx), Math.max(ax, bx)];
        if (g.b <= lo || g.a >= hi) { next.push(s); continue; }
        if (lo < g.a) next.push([[lo, ay], [g.a, ay]]);
        if (g.b < hi) next.push([[g.b, ay], [hi, ay]]);
      } else if (!horiz && g.x === ax && g.y === undefined) {
        const [lo, hi] = [Math.min(ay, by), Math.max(ay, by)];
        if (g.b <= lo || g.a >= hi) { next.push(s); continue; }
        if (lo < g.a) next.push([[ax, lo], [ax, g.a]]);
        if (g.b < hi) next.push([[ax, g.b], [ax, hi]]);
      } else next.push(s);
    }
    out = next;
  }
  return out;
}
const outerWalls = cutDoors(edges);
const innerWalls = cutDoors(inner);
{
  const WS = layer('wallShadow'), WL = layer('walls');
  const path = (segs) => segs.map(([[ax, ay], [bx, by]]) => `M${ax},${ay}L${bx},${by}`).join('');
  const dO = path(outerWalls), dI = path(innerWalls);
  WS.push(`<path d="${dO}${dI}" stroke="#000" stroke-width="60" stroke-linecap="square" transform="translate(12,16)" opacity="0.55" filter="url(#s14)"/>`);
  // outer walls: fieldstone
  WL.push(`<path d="${dO}" stroke="${INK}" stroke-width="44" stroke-linecap="square"/><path d="${dO}" stroke="#8a7f6e" stroke-width="34" stroke-linecap="square"/>`);
  const j = [];
  for (const [[ax, ay], [bx, by]] of outerWalls) {
    const len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len;
    for (let s = rr(10, 30); s < len; s += rr(26, 44)) j.push(`M${f(ax + ux * s - uy * 17)},${f(ay + uy * s + ux * 17)}l${f(uy * 34)},${f(-ux * 34)}`);
  }
  WL.push(`<path d="${j.join('')}" stroke="${INK}" stroke-width="3"/>`);
  WL.push(`<path d="${dO}" stroke="#bdb3a0" stroke-width="7" stroke-linecap="square" transform="translate(-6,-6)" opacity="0.5"/>`);
  // inner walls: timber partition
  WL.push(`<path d="${dI}" stroke="${INK}" stroke-width="28" stroke-linecap="square"/><path d="${dI}" stroke="#6a4a2c" stroke-width="20" stroke-linecap="square"/><path d="${dI}" stroke="#3a2414" stroke-width="2"/>`);
  // corner posts
  for (const [x, y] of [[200, 100], [1800, 100], [200, 1200], [1800, 1200], [1300, 100], [1300, 1200], [1300, 600], [1800, 600]]) WL.push(`<rect x="${x - 26}" y="${y - 26}" width="52" height="52" fill="#5a3a22" stroke="${INK}" stroke-width="4"/>`);
}
// windows in the outer walls, with daylight falling inside
{
  const WN = layer('windows');
  const win = (x, y, vertical, inward) => {
    WN.push(`<g transform="translate(${x},${y}) rotate(${vertical ? 90 : 0})"><rect x="-40" y="-9" width="80" height="18" fill="#cfe6f0" stroke="${INK}" stroke-width="4"/><path d="M0,-9v18M-40,0h80" stroke="${INK}" stroke-width="2.5"/></g>`);
    const [dx, dy] = inward;
    layer('daylight').push(`<path d="M${x - (vertical ? 0 : 45)},${y - (vertical ? 45 : 0)} L${x + (vertical ? 0 : 45)},${y + (vertical ? 45 : 0)} L${x + dx * 220 + (vertical ? 0 : 90)},${y + dy * 220 + (vertical ? 90 : 0)} L${x + dx * 220 - (vertical ? 0 : 90)},${y + dy * 220 - (vertical ? 90 : 0)}Z" fill="#fff4d6" opacity="0.16" filter="url(#s14)"/>`);
  };
  win(700, 100, false, [0, 1]); win(950, 100, false, [0, 1]); win(1550, 100, false, [0, 1]);
  win(200, 950, true, [1, 0]); win(200, 300, true, [1, 0]);
  win(400, 1200, false, [0, -1]); win(1100, 1200, false, [0, -1]); win(1550, 1200, false, [0, -1]);
  win(1800, 900, true, [-1, 0]);
}

// ---------- doors (drawn standing open) ----------
{
  const DR = layer('doors');
  for (const [x, y, horiz, n = 1] of doors) {
    const px = x * 100, py = y * 100, len = n * 100, rot = horiz ? 0 : 90;
    if (n === 1) {
      DR.push(`<g transform="translate(${px},${py}) rotate(${rot})"><rect x="-4" y="-16" width="10" height="32" fill="#5a3a22" stroke="${INK}" stroke-width="3"/><rect x="${len - 6}" y="-16" width="10" height="32" fill="#5a3a22" stroke="${INK}" stroke-width="3"/>
        <g transform="translate(6,0) rotate(-70)"><rect x="0" y="-8" width="${len - 12}" height="16" rx="3" fill="#6a4428" stroke="${INK}" stroke-width="3.5"/><path d="M8,-2h${len - 28}" stroke="#2f1d10" stroke-width="2"/></g></g>`);
      continue;
    }
    const leaf = len / 2 - 4;
    DR.push(`<g transform="translate(${px},${py}) rotate(${rot})"><rect x="-4" y="-20" width="12" height="40" fill="#5a3a22" stroke="${INK}" stroke-width="3"/><rect x="${len - 8}" y="-20" width="12" height="40" fill="#5a3a22" stroke="${INK}" stroke-width="3"/>
      <g transform="translate(8,0) rotate(-62)"><rect x="0" y="-9" width="${leaf}" height="18" rx="3" fill="#6a4428" stroke="${INK}" stroke-width="4"/><path d="M8,-3h${leaf - 16}M8,4h${leaf - 16}" stroke="#2f1d10" stroke-width="2"/></g>
      <g transform="translate(${len - 8},0) rotate(242)"><rect x="0" y="-9" width="${leaf}" height="18" rx="3" fill="#6a4428" stroke="${INK}" stroke-width="4"/><path d="M8,-3h${leaf - 16}M8,4h${leaf - 16}" stroke="#2f1d10" stroke-width="2"/></g></g>`);
  }
}

// ---------- props ----------
// sheep, seen from above: woolly body, dark face, little ears
function sheep(x, y, rot = 0, s = 1, sleeping = false) {
  const P = layer('sheep');
  P.push(`<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)}) scale(${s})">${sh(blob(0, 0, 40, 28, 0.15, 12), 8, 10, 0.45)}
    <g filter="url(#leafy)"><path d="${blob(0, 0, 42, 30, 0.12, 14)}" fill="${INK}"/><path d="${blob(0, 0, 38, 26, 0.12, 14)}" fill="#eee8da"/><path d="${blob(-6, -6, 24, 15, 0.2, 10)}" fill="#fbf8f0"/></g>
    ${sleeping ? `<ellipse cx="36" cy="10" rx="13" ry="10" fill="#2a2420" stroke="${INK}" stroke-width="2.5"/>` : `<ellipse cx="44" cy="0" rx="15" ry="11" fill="#2a2420" stroke="${INK}" stroke-width="2.5"/><ellipse cx="40" cy="-14" rx="7" ry="4" fill="#3a3230" stroke="${INK}" stroke-width="2"/><ellipse cx="40" cy="14" rx="7" ry="4" fill="#3a3230" stroke="${INK}" stroke-width="2"/>`}</g>`);
}
function stool(x, y) { layer('props').push(sh(`M${x - 17},${y}a17,17 0 1,0 34,0a17,17 0 1,0 -34,0Z`, 6, 8, 0.45) + `<circle cx="${f(x)}" cy="${f(y)}" r="17" fill="#7a5030" stroke="${INK}" stroke-width="3"/><circle cx="${f(x)}" cy="${f(y)}" r="9" fill="#8a6038"/>`); }
function roundTable(x, y, r = 58, seats = 4, a0 = rr(0, 1)) {
  for (let i = 0; i < seats; i++) { const a = a0 + (i / seats) * Math.PI * 2; chair(x + Math.cos(a) * (r + 26), y + Math.sin(a) * (r + 26), (a * 180) / Math.PI + 90); }
  const P = layer('props');
  P.push(sh(`M${x - r},${y}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`, 12, 16, 0.5));
  P.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#7a4f2c" stroke="${INK}" stroke-width="4"/><path d="M${x - r + 8},${y - r * 0.35}h${2 * r - 16}M${x - r + 4},${y}h${2 * r - 8}M${x - r + 8},${y + r * 0.35}h${2 * r - 16}" stroke="#4a2f18" stroke-width="2.5"/>`);
}
function mug(x, y) { layer('props').push(`<circle cx="${f(x)}" cy="${f(y)}" r="9" fill="#c9a86a" stroke="${INK}" stroke-width="2.5"/><circle cx="${f(x)}" cy="${f(y)}" r="5" fill="#f2e2b0"/>`); }
function plate(x, y) { layer('props').push(`<circle cx="${f(x)}" cy="${f(y)}" r="13" fill="#e8e2d2" stroke="${INK}" stroke-width="2"/><circle cx="${f(x + 2)}" cy="${f(y - 1)}" r="6" fill="#a8783a"/>`); }
function sack(x, y, rot = rr(0, 360)) { layer('props').push(`<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})">${sh(blob(0, 0, 30, 24, 0.15), 8, 10, 0.45)}<path d="${blob(0, 0, 30, 24, 0.15)}" fill="#b09a6a" stroke="${INK}" stroke-width="3"/><path d="M18,-8q8,8 0,16" stroke="#7a6640" stroke-width="3" fill="none"/></g>`); }

// THE BAR: L-shaped counter in the north-east of the common room; barkeep works behind it
{
  box(1110, 420, 70, 620, 0, '#6a4428', { inner: (w, h) => `<rect x="${-w / 2 + 6}" y="${-h / 2 + 6}" width="${w - 12}" height="${h - 12}" fill="#8a5a32"/>${plankLines(w, h, 8)}` });
  box(970, 765, 350, 70, 0, '#6a4428', { inner: (w, h) => `<rect x="${-w / 2 + 6}" y="${-h / 2 + 6}" width="${w - 12}" height="${h - 12}" fill="#8a5a32"/>` });
  for (const y of [220, 320, 420, 520, 620]) stool(1030, y + rr(-6, 6));
  for (const x of [850, 950, 1050]) stool(x + rr(-6, 6), 840);
  mug(1110, 250); mug(1100, 400); mug(1115, 560); mug(900, 760); mug(1020, 770);
  // ale taps
  layer('props').push(`<rect x="1092" y="300" width="36" height="60" rx="6" fill="#3a2414" stroke="${INK}" stroke-width="3"/><circle cx="1110" cy="314" r="7" fill="#c9a24a"/><circle cx="1110" cy="344" r="7" fill="#c9a24a"/>`);
  // behind the bar: kegs and a bottle shelf against the partition
  barrel(1235, 175, 32); barrel(1235, 250, 28);
  box(1262, 530, 44, 220, 0, '#3a2414', { inner: (w, h) => { let s = ''; for (let i = 0; i < 12; i++) s += `<circle cx="${rr(-10, 10)}" cy="${-h / 2 + 12 + i * 17}" r="6" fill="${pick(['#3a6a3a', '#6a2a2a', '#8a6a2a', '#2a4a6a'])}" stroke="${INK}" stroke-width="1.5"/>`; return s; } });
  box(1240, 680, 90, 50, 0, '#d8cfbb', { inner: () => `<path d="M-35,0h70" stroke="#a89878" stroke-width="3"/>` }); // washing tub
}

// HEARTH: stone fireplace on the west wall, rug, two armchairs and a sleeping sheep
{
  rug(300, 470, 300, 300, 'carpet', '#c9a24a');
  box(235, 600, 70, 300, 0, '#6a6258', { inner: () => `<rect x="-24" y="-110" width="44" height="220" fill="#140b07"/>` });
  fire(240, 555, 30); fire(242, 645, 28);
  const armchair = (x, y, rot) => box(x, y, 80, 80, rot, '#5a2a1a', { rx: 12, inner: () => `<rect x="-40" y="-40" width="80" height="22" rx="8" fill="#3a1a10"/><rect x="-40" y="-40" width="18" height="80" rx="8" fill="#3a1a10"/><rect x="22" y="-40" width="18" height="80" rx="8" fill="#3a1a10"/><rect x="-20" y="-16" width="40" height="46" rx="6" fill="#7a3a24"/>` });
  armchair(500, 500, 70); armchair(500, 720, 110);
  box(560, 610, 60, 60, 12, '#6a4428'); mug(560, 600);
  sheep(390, 620, 160, 0.95, true);
  // firewood pile
  for (let i = 0; i < 5; i++) layer('props').push(`<rect x="${f(250 + rr(-8, 8))}" y="${f(800 + i * 14)}" width="70" height="14" rx="7" fill="#7a5030" stroke="${INK}" stroke-width="2.5" transform="rotate(${f(rr(-6, 6))} 285 ${830})"/>`);
}

// STAIRS up to the rooms, north-west corner
{
  const P = layer('props');
  P.push(`<rect x="215" y="115" width="300" height="120" fill="#6a4428" stroke="${INK}" stroke-width="4"/>`);
  for (let i = 0; i < 7; i++) P.push(`<rect x="${215 + i * 43}" y="115" width="43" height="120" fill="${hsl(28, 40, 26 + i * 3)}" stroke="${INK}" stroke-width="2.5"/>`);
  P.push(`<path d="M215,240h300" stroke="${INK}" stroke-width="6"/><path d="M215,244h300" stroke="#8a6038" stroke-width="4"/>`);
  P.push(`<path d="M470,175l-40,-20v40z" fill="#e8dcc0" opacity="0.6"/>`);
}

// TABLES in the common room (the entry lane from the front door stays clear)
roundTable(660, 330, 60, 4); candles(660, 330, 1); plate(640, 310); mug(690, 350);
roundTable(800, 560, 52, 3); mug(800, 560);
roundTable(430, 1000, 62, 4); candles(430, 1000, 1); plate(450, 980); plate(410, 1025);
roundTable(1100, 1010, 58, 4); mug(1080, 1000); mug(1120, 1030);

// NOTICE BOARD on the south wall, west of the door: jobs, lost sheep, guild notices
{
  const P = layer('props');
  P.push(sh('M490,1150h180v30h-180Z', 6, 8, 0.4) + `<rect x="490" y="1148" width="180" height="30" fill="#8a6038" stroke="${INK}" stroke-width="3"/>`);
  for (const [x, w, r] of [[500, 34, -6], [540, 30, 4], [578, 38, -3], [622, 34, 7]]) P.push(`<rect x="${x}" y="1124" width="${w}" height="40" fill="#efe6cf" stroke="${INK}" stroke-width="2" transform="rotate(${r} ${x + w / 2} 1144)"/><circle cx="${x + w / 2}" cy="1130" r="3.5" fill="#b02a2a"/>`);
}

// KITCHEN: stone oven, prep table, pots, sacks and barrels
{
  box(1560, 160, 260, 90, 0, '#6a6258', { inner: () => `<rect x="-100" y="-30" width="90" height="52" rx="6" fill="#140b07"/><rect x="20" y="-34" width="90" height="60" rx="6" fill="#3a3430" stroke="${INK}" stroke-width="2"/><circle cx="65" cy="-4" r="22" fill="#2a2420" stroke="${INK}" stroke-width="3"/><circle cx="65" cy="-4" r="15" fill="#8a6a3a"/>` });
  fire(1505, 158, 24);
  box(1560, 390, 220, 80, 0, '#7a4f2c', { inner: (w, h) => plankLines(w, h, 3) });
  plate(1500, 380); plate(1540, 395);
  layer('props').push(`<circle cx="1610" cy="388" r="20" fill="#5a5a62" stroke="${INK}" stroke-width="3"/><circle cx="1610" cy="388" r="13" fill="#c9b08a"/><rect x="1650" y="370" width="40" height="30" rx="4" fill="#d8b878" stroke="${INK}" stroke-width="2"/>`);
  barrel(1740, 520, 30); barrel(1680, 545, 26); sack(1380, 530); sack(1430, 545); sack(1395, 480, 40);
  // hanging herbs along the north wall
  for (const x of [1360, 1400, 1720]) layer('props').push(`<path d="${blob(x, 135, 14, 18, 0.4, 9)}" fill="#5a7a3a" stroke="${INK}" stroke-width="2"/>`);
}

// BACK ROOM: quiet meeting table with candles, a sideboard, a crate or two
{
  rug(1400, 760, 300, 280, 'carpetH', '#c9a24a');
  table(1550, 900, 200, 100, 0, false);
  candles(1550, 900, 2); mug(1500, 890); mug(1600, 910);
  box(1720, 700, 60, 160, 0, '#5a3620', { inner: (w, h) => plankLines(w, h, 3) });
  crate(1390, 1110, 64); crate(1460, 1130, 56); barrel(1740, 1120, 28);
}

// OUTSIDE: sign post by the door, a cart with a sheep standing on it, a sheep pen in the east yard
{
  const P = layer('outside');
  // hanging sign: a post and a round board painted with a sheep
  P.push(sh('M580,1215h20v110h-20Z', 10, 12, 0.45) + `<rect x="582" y="1215" width="18" height="110" fill="#5a3a22" stroke="${INK}" stroke-width="3"/><circle cx="530" cy="1280" r="44" fill="#7a5030" stroke="${INK}" stroke-width="4"/><path d="M574,1280h12" stroke="${INK}" stroke-width="4"/>`);
  P.push(`<g transform="translate(530,1280)"><path d="${blob(0, 2, 24, 16, 0.12, 12)}" fill="#f2ecdc" stroke="${INK}" stroke-width="2.5"/><ellipse cx="-24" cy="-2" rx="9" ry="7" fill="#2a2420"/><path d="M-10,16v10M10,16v10" stroke="${INK}" stroke-width="3"/></g>`);
  // cart on the street
  box(1560, 1430, 260, 130, -4, '#7a5030', { layer: 'outside', inner: (w, h) => `${plankLines(w, h, 4)}<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="#4a2f18" stroke-width="8"/>` });
  for (const [dx, dy] of [[-70, -78], [-70, 78], [70, -78], [70, 78]]) layer('outside').push(`<g transform="translate(1560,1430) rotate(-4)"><rect x="${dx - 30}" y="${dy - 8}" width="60" height="16" rx="4" fill="#4a2f18" stroke="${INK}" stroke-width="3"/></g>`);
  layer('outside').push(`<path d="M1430,1440 L1300,1450" stroke="#5a3a22" stroke-width="14" stroke-linecap="round"/>`);
  sheep(1580, 1425, -20, 1);
  // sheep pen in the east yard
  const fence = [];
  const px0 = 1880, py0 = 220, px1 = 2160, py1 = 1060;
  fence.push(`M${px0},${py0}H${px1}V${py1}H${px0}V${py0 + 520}M${px0},${py0 + 340}V${py0}`);
  P.push(`<path d="${fence.join('')}" stroke="${INK}" stroke-width="12" fill="none"/><path d="${fence.join('')}" stroke="#8a6038" stroke-width="7" fill="none"/>`);
  const posts = []; for (let y = py0; y <= py1; y += 80) posts.push([px0, y], [px1, y]); for (let x = px0; x <= px1; x += 70) posts.push([x, py0], [x, py1]);
  for (const [x, y] of posts) P.push(`<rect x="${x - 8}" y="${y - 8}" width="16" height="16" fill="#5a3a22" stroke="${INK}" stroke-width="2.5"/>`);
  P.push(`<rect x="${px0 + 30}" y="${py1 - 140}" width="70" height="110" rx="6" fill="#c8b070" stroke="${INK}" stroke-width="3"/><path d="M${px0 + 40},${py1 - 120}h50M${px0 + 40},${py1 - 90}h50M${px0 + 40},${py1 - 60}h50" stroke="#a08a4a" stroke-width="3"/>`); // hay
  for (const [x, y, r] of [[1990, 340, 30], [2070, 470, 200], [1960, 620, 100], [2080, 760, -40], [2000, 930, 160]]) sheep(x, y, r);
  // sheep loose on the street (one has escaped the pen and is heading for the gap in the fence)
  for (const [x, y, r] of [[250, 1440, 10], [420, 1530, -160], [1050, 1420, 190], [1950, 1500, 30], [2080, 1340, -110], [1890, 660, 180]]) sheep(x, y, r);
  // a few bushes along the north and west walls
  for (const [x, y, r] of [[100, 200, 60], [90, 700, 70], [110, 1150, 55], [1000, 40, 50], [400, 30, 45]]) {
    layer('outside').push(sh(blob(x, y, r, r * 0.85, 0.2), 20, 26, 0.45, 's14') + `<g filter="url(#leafy)"><path d="${blob(x, y, r, r * 0.85, 0.2)}" fill="${INK}"/><path d="${blob(x, y, r * 0.93, r * 0.78, 0.2)}" fill="#2f4a22"/><path d="${blob(x - r * 0.15, y - r * 0.18, r * 0.6, r * 0.5, 0.25)}" fill="#4a6a2e"/></g>`);
  }
}

// ---------- dust and warm light ----------
{
  const D = layer('dust');
  for (let i = 0; i < 500; i++) { const x = rr(200, 1800), y = rr(100, 1200); D.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr(1.5, 3))}" fill="${pick(['#c9b08a', '#6a4a2c', '#e8dcc0'])}" opacity="${f(rr(0.2, 0.45))}"/>`); }
  for (let i = 0; i < 40; i++) { const x = rr(250, 1250), y = rr(150, 1150); D.push(`<path d="M${f(x)},${f(y)}l${f(rr(-10, 10))},${f(rr(4, 10))}" stroke="#d8c070" stroke-width="2" opacity="0.6"/>`); } // straw
}
const LT = layer('light');
LT.push(`<rect x="200" y="100" width="1600" height="1100" fill="#ffd9a0" opacity="0.06" style="mix-blend-mode:multiply"/>`);
LT.push(`<rect width="${W2}" height="${H2}" fill="url(#vignette)" opacity="0.6"/>`);

const order = ['bg', 'street', 'bgShadow', 'outside', 'floor', 'rugs', 'daylight', 'wallShadow', 'props', 'dust', 'sheep', 'doors', 'walls', 'windows', 'light', 'glow'];
const body = order.map((k) => {
  const attr = k === 'walls' ? ' filter="url(#rough)"' : k === 'glow' ? ' style="mix-blend-mode:screen" clip-path="url(#allFloor)"' : k === 'daylight' ? ' style="mix-blend-mode:screen" clip-path="url(#allFloor)"' : k === 'wallShadow' ? ' clip-path="url(#allFloor)"' : '';
  return `<g id="${k}"${attr}>${(L[k] || []).join('\n')}</g>`;
}).join('\n');
const allFloor = `<clipPath id="allFloor"><path d="${cells(isFloor)}"/></clipPath>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}" viewBox="0 0 ${W2} ${H2}"><defs>${defs.join('')}${allFloor}</defs>${body}<g>${(L.fire || []).join('')}</g></svg>`;
fs.writeFileSync(OUT + '/sheep-tavern.svg', svg);
fs.writeFileSync(OUT + '/sheep-tavern-walls.json', JSON.stringify({ walls: [...outerWalls, ...innerWalls], doors, lights }));
console.log('svg bytes', svg.length, 'walls', outerWalls.length + innerWalls.length, 'doors', doors.length, 'lights', lights.length);
