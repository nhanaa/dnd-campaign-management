// Procedural SVG battlemap: Weethingtoe's Merchants' Guild hall, the opening scene of Five Toe Cove. Original design.
// 20 x 14 squares, 100 units per square. Drawn to match Snowy's Five Toe Cove maps: thin ink, bright watercolour fills.
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

// ---------- style: matches Snowy's Five Toe Cove maps ----------
// thin wobbly black ink outlines, bright flat watercolour fills with soft mottling, short soft shadows,
// pale outlined stones for walls, chunky simple props. Daylight, no vignette.
const GW = 20, GH = 14;
const W2 = GW * 100, H2 = GH * 100;
const INK = '#141210';
const K = 2.6;                       // ink line width (about 3.6 px at 140 px per square)
const L = {};
const layer = (k) => (L[k] = L[k] || []);
const defs = [];
const lights = [];
defs.push(`
<filter id="wash" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="5" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 2.2 -0.95"/></filter>
<filter id="washLight" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="2" seed="12" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 0.97  0 0 0 0 0.85  0 0 0 2 -1"/></filter>
<filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="8" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.5" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="soft20" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="flame" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.06 0.09" numOctaves="2" seed="23" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="10" xChannelSelector="R" yChannelSelector="G"/></filter>
<radialGradient id="candle"><stop offset="0" stop-color="#ffe28a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffc04a" stop-opacity="0"/></radialGradient>
`);
const rect = (x, y, w, h) => `M${f(x)},${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
const circ = (x, y, r) => `M${f(x - r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2 * r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2 * r)},0Z`;
// short soft shadow, light from the north-west
const sh = (d, op = 0.32, dx = 9, dy = 11) => `<path d="${d}" transform="translate(${dx},${dy})" fill="#2a1e10" opacity="${op}" filter="url(#soft)"/>`;
const P = (k = 'props') => layer(k);
function thing(x, y, rot, svg, shadowD, k = 'props') {
  P(k).push(`<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})">${shadowD ? sh(shadowD) : ''}${svg}</g>`);
}
const ink = (w = K, extra = '') => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" ${extra}`;

// ---------- props ----------
function crate(x, y, s = 64, rot = rr(-12, 12)) {
  const h = s / 2;
  thing(x, y, rot, `<rect x="${-h}" y="${-h}" width="${s}" height="${s}" rx="3" fill="#9c8062" ${ink()}/><rect x="${-h + 7}" y="${-h + 7}" width="${s - 14}" height="${s - 14}" fill="#ac9472" ${ink(1.8)}/><path d="M${-h + 7},${-h + 7}L${h - 7},${h - 7}" ${ink(1.8)}/><path d="M${-h + 10},${-h + 7}L${h - 7},${h - 10}" stroke="#6e5844" stroke-width="2"/>`, rect(-h, -h, s, s));
}
function barrel(x, y, r = 28) {
  const staves = []; for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; staves.push(`M${f(Math.cos(a) * r * 0.72)},${f(Math.sin(a) * r * 0.72)}L${f(Math.cos(a) * r)},${f(Math.sin(a) * r)}`); }
  thing(x, y, rr(0, 360), `<circle r="${r}" fill="#77604a" ${ink()}/><circle r="${r * 0.72}" fill="#8a7258" ${ink(1.8)}/><path d="${staves.join('')}" ${ink(1.5)}/><path d="M${-r * 0.6},-4h${r * 1.2}M${-r * 0.6},6h${r * 1.2}" stroke="#5e4a3a" stroke-width="2"/>`, circ(0, 0, r));
}
function sack(x, y, rot = rr(0, 360), c = '#bba887') {
  thing(x, y, rot, `<path d="${blob(0, 0, 28, 22, 0.12)}" fill="${c}" ${ink()}/><path d="M16,-10q9,10 0,20" ${ink(1.8, 'fill=\"none\"')}/><path d="${blob(-6, -5, 12, 8, 0.2)}" fill="#fff" opacity="0.25"/>`, blob(0, 0, 28, 22, 0.12));
}
function woolBale(x, y, rot = rr(-8, 8)) {
  thing(x, y, rot, `<rect x="-42" y="-30" width="84" height="60" rx="10" fill="#d2c9b2" ${ink()}/><path d="M-36,-22q10,6 20,0t20,0t20,0M-36,22q10,-6 20,0t20,0t20,0" stroke="#a89c80" stroke-width="2" fill="none"/><path d="${blob(-10, -8, 20, 10, 0.3)}" fill="#e2dccb"/><path d="M-14,-30v60M16,-30v60" stroke="#5a4a3a" stroke-width="5"/><path d="M-14,-30v60M16,-30v60" ${ink(1)}/>`, rect(-42, -30, 84, 60));
}
function chair(x, y, rot) {
  thing(x, y, rot, `<rect x="-17" y="-17" width="34" height="34" rx="4" fill="#8e7558" ${ink()}/><rect x="-17" y="-17" width="34" height="9" rx="3" fill="#5e4a3a" ${ink(1.8)}/>`, rect(-17, -17, 34, 34));
}
function paper(x, y, rot = rr(0, 360), s = 1) {
  P('papers').push(`<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)}) scale(${s})"><rect x="-11" y="-14" width="22" height="28" fill="#e4dbc4" stroke="${INK}" stroke-width="1.4"/><path d="M-6,-7h12M-6,-2h12M-6,3h8" stroke="#8a8070" stroke-width="1.3"/></g>`);
}
function ledger(x, y, rot = 0, c = '#6a2a2a') {
  thing(x, y, rot, `<rect x="-24" y="-17" width="48" height="34" rx="2" fill="${c}" ${ink(2)}/><rect x="-20" y="-14" width="40" height="28" fill="#e4dbc4" ${ink(1.2)}/><path d="M0,-14v28" ${ink(1.5)}/><path d="M-16,-8h12M-16,-3h12M-16,2h10M4,-8h12M4,-3h12" stroke="#8a8070" stroke-width="1.2"/>`);
}
function candles(x, y) {
  P('props').push(`<circle cx="${x}" cy="${y}" r="7" fill="#e4dbc4" ${ink(1.8)}/><circle cx="${x}" cy="${y}" r="3" fill="#ffb347"/>`);
  P('glow').push(`<circle cx="${x}" cy="${y}" r="120" fill="url(#candle)"/>`);
  lights.push({ x, y, range: 2, color: 'ffffd27a' });
}
// sheep, top-down, drawn like Snowy's props
function sheep(x, y, rot = 0, s = 1) {
  thing(x, y, rot, `<g transform="scale(${s})"><g filter="url(#wob)"><path d="${blob(0, 0, 36, 26, 0.16, 14)}" fill="#ddd7c6" ${ink()}/><path d="${blob(-6, -6, 18, 11, 0.25, 9)}" fill="#ebe6d8"/></g><ellipse cx="38" cy="0" rx="13" ry="10" fill="#33302c" ${ink(2)}/><ellipse cx="34" cy="-13" rx="6" ry="3.5" fill="#4a3e36" ${ink(1.6)}/><ellipse cx="34" cy="13" rx="6" ry="3.5" fill="#4a3e36" ${ink(1.6)}/></g>`, blob(0, 0, 36 * s, 26 * s, 0.16, 14), 'outside');
}
// round leafy bush, teal-green with little curl marks
function bush(x, y, r, berries = false) {
  const lobes = []; for (let i = 0; i < 5; i++) { const a = rr(0, 6.28), d = rr(0, r * 0.45); lobes.push([x + Math.cos(a) * d, y + Math.sin(a) * d, r * rr(0.45, 0.6)]); }
  const lp = (k, dx = 0, dy = 0) => lobes.map(([lx, ly, lr]) => blob(lx + dx, ly + dy, lr * k, lr * k, 0.15, 11)).join('');
  const curls = lobes.map(([lx, ly, lr]) => `M${f(lx - lr * 0.3)},${f(ly)}q${f(lr * 0.15)},${f(-lr * 0.2)} ${f(lr * 0.3)},0`).join('');
  P('outside').push(`<path d="${lp(1, 14, 18)}" fill="#1e2a1c" opacity="0.35" filter="url(#soft)"/><g><path d="${lp(1)}" fill="#44675e" ${ink()}/><path d="${lp(0.7, -6, -8)}" fill="#5f9479"/><path d="${curls}" ${ink(1.8, 'fill="none"')}/>${berries ? lobes.map(([lx, ly, lr]) => `<circle cx="${f(lx + lr * 0.3)}" cy="${f(ly + lr * 0.2)}" r="6" fill="#9e4a3c" ${ink(1.5)}/>`).join('') : ''}</g>`);
}

// ---------- layout ----------
// building interior: x 2..18, y 1..10 (squares). Vault in the north-east corner behind a locked iron door.
const grid = [...Array(GH)].map(() => Array(GW).fill(null));
for (let y = 1; y < 10; y++) for (let x = 2; x < 18; x++) grid[y][x] = y < 4 && x >= 14 ? 'vault' : 'hall';
const isFloor = (x, y) => x >= 0 && y >= 0 && x < GW && y < GH && grid[y][x] !== null;
const doors = [
  [9, 10, true, 2],             // front doors onto the main street
  [15, 4, true, 1, 'locked'],   // the Guild vault
];
const inner = [[[1400, 100], [1400, 400]], [[1400, 400], [1800, 400]]];

// ---------- ground outside ----------
{
  const G = layer('ground');
  G.push(`<rect width="${W2}" height="${H2}" fill="#6a8b59"/>`);
  for (let i = 0; i < 26; i++) G.push(`<path d="${blob(rr(0, W2), rr(0, H2), rr(90, 220), rr(70, 160), 0.3)}" fill="${pick(['#7a9c62', '#5c8753', '#8bad6b'])}" opacity="0.6" filter="url(#soft20)"/>`);
  G.push(`<rect width="${W2}" height="${H2}" filter="url(#wash)" opacity="0.8" style="mix-blend-mode:multiply"/>`);
  const tufts = []; for (let i = 0; i < 260; i++) { const x = rr(0, W2), y = rr(0, H2); if (x > 170 && x < 1830 && y > 70 && y < 1030) continue; if (y > 1060) continue; tufts.push(`M${f(x)},${f(y)}l-4,-10M${f(x + 5)},${f(y)}l1,-12M${f(x + 10)},${f(y)}l5,-9`); }
  G.push(`<path d="${tufts.join('')}" stroke="#3e543e" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>`);
  for (let i = 0; i < 30; i++) { const x = rr(0, W2), y = rr(0, 1040); if (x > 170 && x < 1830 && y > 70) continue; G.push(`<g transform="translate(${f(x)},${f(y)})"><path d="M-5,0h10M0,-5v10" stroke="${pick(['#d8c070', '#dedcd4', '#b07a8a'])}" stroke-width="3.5" stroke-linecap="round"/></g>`); }
  // main street: packed earth, muddy in patches
  const top = []; for (let x = -50; x <= W2 + 50; x += 100) top.push([x, 1090 + rr(-22, 22)]);
  const road = smoothClosed([...top, [W2 + 50, H2 + 50], [-50, H2 + 50]]);
  const path = blob(1000, 1040, 150, 60, 0.15);
  G.push(`<path d="${road}${path}" fill="#b9a07e"/>`);
  defs.push(`<clipPath id="roadClip"><path d="${road}${path}"/></clipPath>`);
  G.push(`<g clip-path="url(#roadClip)"><rect width="${W2}" height="${H2}" filter="url(#wash)" opacity="0.3" style="mix-blend-mode:multiply"/>${[...Array(10)].map(() => `<path d="${blob(rr(0, W2), rr(1120, H2), rr(60, 160), rr(30, 70), 0.3)}" fill="#9a8262" opacity="0.25" filter="url(#soft20)"/>`).join('')}</g>`);
  G.push(`<path d="${smoothOpen(top)}" fill="none" stroke="#486041" stroke-width="5" opacity="0.6"/>`);
  for (const [x, y, rx, ry] of [[420, 1260, 80, 32], [1500, 1310, 100, 36], [1850, 1190, 55, 24]]) G.push(`<path d="${blob(x, y, rx, ry, 0.25)}" fill="#5e7a80" ${ink(2)}/><path d="${blob(x, y, rx * 0.8, ry * 0.7, 0.25)}" fill="#6f9298"/><path d="${blob(x - rx * 0.25, y - ry * 0.25, rx * 0.35, ry * 0.2, 0.3)}" fill="#c4dade" opacity="0.8"/>`);
  for (let i = 0; i < 60; i++) G.push(`<ellipse cx="${f(rr(0, W2))}" cy="${f(rr(1130, H2))}" rx="4" ry="6" fill="#7a6650" opacity="0.6"/>`);
  for (let i = 0; i < 24; i++) G.push(`<path d="${blob(rr(0, W2), rr(1100, H2), 6, 4.5, 0.4, 8)}" fill="#f6f1e4" ${ink(1)}/>`);
  // the building's shadow on the ground
  G.push(`<rect x="200" y="100" width="1600" height="900" transform="translate(18,22)" fill="#1e2a1c" opacity="0.4" filter="url(#soft20)"/>`);
}

// ---------- floor: warm wide planks ----------
{
  const FL = layer('floor');
  const cellsOf = (m) => { const d = []; for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (grid[y][x] === m) d.push(rect(x * 100, y * 100, 100, 100)); return d.join(''); };
  defs.push(`<clipPath id="hallClip"><path d="${cellsOf('hall')}${cellsOf('vault')}"/></clipPath><clipPath id="vaultClip"><path d="${cellsOf('vault')}"/></clipPath>`);
  const t = [];
  t.push(`<rect x="200" y="100" width="1600" height="900" fill="#a88963"/>`);
  for (let y = 100; y < 1000; y += 50) { let x = 200 - rr(0, 260); while (x < 1800) { const l = rr(220, 420); t.push(`<rect x="${f(x)}" y="${y}" width="${f(l)}" height="50" fill="${hsl(33 + rr(-3, 3), 26, 52 + rr(-4, 4))}" stroke="#4e3e32" stroke-width="1.8"/>`); if (rnd() < 0.25) t.push(`<circle cx="${f(x + rr(30, l - 30))}" cy="${y + rr(15, 35)}" r="3" fill="#5a4636"/>`); x += l; } }
  FL.push(`<g clip-path="url(#hallClip)">${t.join('')}<rect width="${W2}" height="${H2}" filter="url(#wash)" opacity="0.32" style="mix-blend-mode:multiply"/><rect width="${W2}" height="${H2}" filter="url(#washLight)" opacity="0.12"/></g>`);
  // vault: grey flagstones
  const v = [`<rect x="1400" y="100" width="400" height="300" fill="#6b6660"/>`];
  for (let y = 100; y < 400; y += 50) for (let x = 1400 + (((y - 100) / 50) % 2) * 35; x < 1800; x += 70) v.push(`<rect x="${f(x + rr(-2, 2))}" y="${f(y + rr(-2, 2))}" width="68" height="48" rx="5" fill="${hsl(45, 5, rr(48, 58))}" stroke="${INK}" stroke-width="1.6"/>`);
  FL.push(`<g clip-path="url(#vaultClip)">${v.join('')}<rect width="${W2}" height="${H2}" filter="url(#wash)" opacity="0.5" style="mix-blend-mode:multiply"/></g>`);
}

// ---------- walls: pale outlined stones, timber corner posts ----------
const edges = [];
const hallFloor = (x, y) => isFloor(x, y);
for (let y = 0; y <= GH; y++) { let run = null; for (let x = 0; x <= GW; x++) { const e = x < GW && hallFloor(x, y - 1) !== hallFloor(x, y); if (e && !run) run = [x, y]; if (!e && run) { edges.push([[run[0] * 100, y * 100], [x * 100, y * 100]]); run = null; } } }
for (let x = 0; x <= GW; x++) { let run = null; for (let y = 0; y <= GH; y++) { const e = y < GH && hallFloor(x - 1, y) !== hallFloor(x, y); if (e && !run) run = [x, y]; if (!e && run) { edges.push([[x * 100, run[1] * 100], [x * 100, y * 100]]); run = null; } } }
function cutDoors(segs) {
  let out = segs;
  for (const [dx, dy, h, n = 1] of doors) {
    const g = h ? { y: dy * 100, a: dx * 100, b: (dx + n) * 100 } : { x: dx * 100, a: dy * 100, b: (dy + n) * 100 };
    const next = [];
    for (const s of out) {
      const [[ax, ay], [bx, by]] = s, horiz = ay === by;
      const on = horiz ? g.y === ay && g.x === undefined : g.x === ax && g.y === undefined;
      if (!on) { next.push(s); continue; }
      const lo = horiz ? Math.min(ax, bx) : Math.min(ay, by), hi = horiz ? Math.max(ax, bx) : Math.max(ay, by);
      if (g.b <= lo || g.a >= hi) { next.push(s); continue; }
      const mk = (p, q) => (horiz ? [[p, ay], [q, ay]] : [[ax, p], [ax, q]]);
      if (lo < g.a) next.push(mk(lo, g.a)); if (g.b < hi) next.push(mk(g.b, hi));
    }
    out = next;
  }
  return out;
}
const outerWalls = cutDoors(edges), innerWalls = cutDoors(inner);
function stoneWall(segs, wdt) {
  const WL = layer('walls'), WS = layer('wallShadow');
  for (const [[ax, ay], [bx, by]] of segs) {
    const len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len, nx = -uy, ny = ux, hw = wdt / 2;
    const pt = (s, o) => [ax + ux * s + nx * o, ay + uy * s + ny * o];
    const band = poly([pt(-hw, -hw), pt(len + hw, -hw), pt(len + hw, hw), pt(-hw, hw)]);
    WS.push(`<path d="${band}" transform="translate(12,15)" fill="#2a1e10" opacity="0.4" filter="url(#soft)"/>`);
    let s = `<path d="${band}" fill="#79776c" ${ink()}/>`;
    // two courses of irregular stones
    const st = [];
    for (const [o0, o1] of [[-hw, 0], [0, hw]]) {
      let p = -hw + rr(0, 18);
      while (p < len + hw - 8) {
        const l = Math.min(rr(26, 46), len + hw - p);
        const q = [pt(p + 2, o0 + 2), pt(p + l - 2, o0 + 2), pt(p + l - 2, o1 - 2), pt(p + 2, o1 - 2)].map(([x, y]) => [x + rr(-1.5, 1.5), y + rr(-1.5, 1.5)]);
        st.push(`<path d="${smoothClosed(q.flatMap((c, i) => [c, [(c[0] + q[(i + 1) % 4][0]) / 2, (c[1] + q[(i + 1) % 4][1]) / 2]]))}" fill="${hsl(48, rr(4, 8), rr(48, 60))}" ${ink(1.6)}/>`);
        p += l;
      }
    }
    s += st.join('');
    WL.push(s);
  }
}
stoneWall(outerWalls, 40);
// partition around the vault: thick stone too, it's a strongroom
stoneWall(innerWalls, 34);
// timber corner posts
for (const [x, y] of [[200, 100], [1800, 100], [200, 1000], [1800, 1000], [1400, 100], [1400, 400], [1800, 400], [900, 1000], [1100, 1000]]) layer('posts').push(`<rect x="${x - 25}" y="${y - 25}" width="50" height="50" rx="4" fill="#5e4a3a" ${ink()}/><path d="M${x - 16},${y - 10}h32M${x - 16},${y + 6}h32" stroke="#46382c" stroke-width="2"/>`);
// windows
function win(x, y, vertical, inward) {
  layer('windows').push(`<g transform="translate(${x},${y}) rotate(${vertical ? 90 : 0})"><rect x="-38" y="-10" width="76" height="20" rx="2" fill="#9fbec4" ${ink()}/><path d="M0,-10v20M-38,0h76" ${ink(1.8)}/></g>`);
  const [dx, dy] = inward, w = 50;
  const a = vertical ? [[x, y - w], [x, y + w], [x + dx * 240, y + w + 70], [x + dx * 240, y - w - 70]] : [[x - w, y], [x + w, y], [x + w + 70, y + dy * 240], [x - w - 70, y + dy * 240]];
  layer('daylight').push(`<path d="${poly(a)}" fill="#fff6d8" opacity="0.22" filter="url(#soft20)"/>`);
}
win(650, 100, false, [0, 1]); win(1000, 100, false, [0, 1]);
win(200, 380, true, [1, 0]); win(200, 700, true, [1, 0]);
win(1800, 650, true, [-1, 0]); win(1800, 850, true, [-1, 0]);
win(500, 1000, false, [0, -1]); win(1500, 1000, false, [0, -1]);

// ---------- doors ----------
{
  const DR = layer('doors');
  // front double doors, standing open into the hall
  DR.push(`<g transform="translate(900,1000)"><g transform="translate(6,0) rotate(-65)"><rect x="0" y="-8" width="92" height="16" rx="3" fill="#77604a" ${ink()}/><path d="M10,0h70" stroke="#46382c" stroke-width="2"/></g><g transform="translate(194,0) rotate(245)"><rect x="0" y="-8" width="92" height="16" rx="3" fill="#77604a" ${ink()}/><path d="M10,0h70" stroke="#46382c" stroke-width="2"/></g></g>`);
  // vault door: heavy iron, closed, with bolts and a wheel lock
  DR.push(`<g transform="translate(1550,400)"><rect x="-56" y="-22" width="112" height="44" rx="6" fill="#5e6068" ${ink()}/>${[-44, -24, 24, 44].map((bx) => `<circle cx="${bx}" cy="${-12}" r="3.5" fill="#34363a"/><circle cx="${bx}" cy="12" r="3.5" fill="#34363a"/>`).join('')}<circle cx="0" cy="0" r="15" fill="#b09450" ${ink()}/><path d="M-11,0h22M0,-11v22" ${ink(2.2)}/></g>`);
}

// ---------- THE HALL ----------
// entry runner from the doors to the clerk's desk
{
  const R = layer('rugs');
  R.push(sh(rect(910, 560, 180, 420), 0.25, 5, 6) + `<rect x="910" y="560" width="180" height="420" rx="4" fill="#4e6680" ${ink()}/><rect x="924" y="574" width="152" height="392" fill="none" stroke="#c8ad62" stroke-width="4"/><rect x="910" y="560" width="180" height="420" filter="url(#wash)" opacity="0.4" style="mix-blend-mode:multiply"/>`);
}
// clerk's desk, buried in paperwork, and THE CHAIR in the middle of the room (she stands on it)
{
  thing(1000, 420, 0, `<rect x="-150" y="-55" width="300" height="110" rx="5" fill="#77604a" ${ink()}/><path d="M-145,-18h290M-145,18h290" stroke="#4e3e32" stroke-width="2"/>`, rect(-150, -55, 300, 110));
  for (let i = 0; i < 9; i++) paper(rr(870, 1130), rr(380, 460), rr(-30, 30), 1.1);
  for (const [x, y] of [[900, 400], [1095, 395]]) for (let k = 0; k < 4; k++) paper(x + k * 1.5, y - k * 3, rr(-6, 6), 1.2); // stacks
  ledger(1000, 430, -4, '#2a4a6a'); ledger(1060, 455, 12, '#6a2a2a');
  P('props').push(`<circle cx="1120" cy="440" r="8" fill="#24242a" ${ink(1.8)}/><path d="M1124,436l26,-26" stroke="#e4dbc4" stroke-width="3"/><path d="M1124,436l26,-26" ${ink(1)}/>`);
  candles(880, 455);
  chair(1000, 330, 180); // the clerk's own chair behind the desk
  chair(1000, 560, 0);   // the chair in the middle of the room
  for (let i = 0; i < 22; i++) paper(rr(820, 1200), rr(500, 720), rr(0, 360), 1);
}
// shelves along the west wall and the north wall: ledgers, scroll cubbies, boxes
function shelf(x, y, w, h) {
  const vertical = h > w, n = Math.floor((vertical ? h : w) / 30);
  let s = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="3" fill="#5a4638" ${ink()}/>`;
  for (let i = 0; i < n; i++) {
    const o = -((vertical ? h : w) / 2) + 6 + i * 30, kind = rnd();
    const cx = vertical ? 0 : o + 12, cy = vertical ? o + 12 : 0;
    if (kind < 0.45) s += `<rect x="${cx - (vertical ? w / 2 - 6 : 11)}" y="${cy - (vertical ? 11 : h / 2 - 6)}" width="${vertical ? w - 12 : 22}" height="${vertical ? 22 : h - 12}" fill="${pick(['#7e4a3e', '#4e6680', '#5e7a4c', '#b09450', '#665070'])}" ${ink(1.5)}/>`;
    else if (kind < 0.8) s += `<circle cx="${cx}" cy="${cy}" r="9" fill="#ddd0ae" ${ink(1.5)}/><circle cx="${cx}" cy="${cy}" r="3" fill="#b0a07c"/>`;
    else s += `<rect x="${cx - 10}" y="${cy - 10}" width="20" height="20" fill="#ac9472" ${ink(1.5)}/>`;
  }
  thing(x, y, 0, s, rect(-w / 2, -h / 2, w, h));
}
shelf(250, 560, 50, 420);
shelf(250, 880, 50, 160);
shelf(820, 140, 300, 50);
shelf(1200, 140, 300, 50);
// stairs up to the second floor (the Guild is very proud of it), north-west corner
{
  const S = P('props');
  S.push(sh(rect(225, 125, 330, 130)) + `<rect x="225" y="125" width="330" height="130" fill="#8e7558" ${ink()}/>`);
  for (let i = 0; i < 8; i++) S.push(`<rect x="${225 + i * 41}" y="125" width="41" height="130" fill="${hsl(32, 24, 40 + i * 2.5)}" ${ink(1.8)}/>`);
  S.push(`<path d="M225,262h330" stroke="#46382c" stroke-width="8"/><path d="M225,262h330" ${ink(1.5)}/>`);
  S.push(`<path d="M505,190l-34,-18v36z" fill="#e4dbc4" opacity="0.8"/>`);
}
// trade counter with scales by the east windows
{
  thing(1590, 760, 0, `<rect x="-45" y="-150" width="90" height="300" rx="5" fill="#77604a" ${ink()}/><path d="M-40,-50h80M-40,50h80" stroke="#4e3e32" stroke-width="2"/>`, rect(-45, -150, 90, 300));
  P('props').push(`<g transform="translate(1590,700)"><path d="M-30,0h60" ${ink(3)}/><circle cx="-30" cy="0" r="14" fill="#bfa058" ${ink()}/><circle cx="30" cy="0" r="14" fill="#bfa058" ${ink()}/><circle cx="0" cy="0" r="6" fill="#76603a" ${ink(1.8)}/></g>`);
  for (let i = 0; i < 7; i++) P('props').push(`<circle cx="${f(1580 + rr(-14, 14))}" cy="${f(800 + rr(-30, 30))}" r="6" fill="#c8ad62" ${ink(1.3)}/>`);
  ledger(1590, 860, 90, '#5e7a4c');
  chair(1680, 760, 270);
}
// goods waiting to ship: crates, barrels, sacks and wool bales
crate(300, 300, 66, 6); crate(370, 330, 58, -10); crate(330, 380, 52, 18);
woolBale(1290, 610, 90); woolBale(1290, 700, 86); woolBale(1220, 655, 92);
crate(320, 930, 64, -4); barrel(420, 950, 28); sack(510, 945, 20); sack(560, 960, -30, '#ad9a78');
crate(1250, 930, 62, 8); crate(1320, 940, 56, -12); barrel(1700, 940, 28); barrel(1750, 900, 24); sack(1420, 950, 70);
barrel(1680, 470, 26); // by the vault
// a table where merchants sign contracts
{
  thing(560, 620, 0, `<rect x="-90" y="-50" width="180" height="100" rx="5" fill="#8e7454" ${ink()}/><path d="M-85,-15h170M-85,20h170" stroke="#4e3e32" stroke-width="2"/>`, rect(-90, -50, 180, 100));
  chair(445, 595, 270); chair(445, 650, 270); chair(675, 595, 90); chair(675, 650, 90);
  paper(540, 610, 8, 1.2); paper(590, 630, -14, 1.2); P('props').push(`<circle cx="600" cy="600" r="7" fill="#24242a" ${ink(1.6)}/>`);
}
// notice board by the door
{
  thing(650, 975, 0, `<rect x="-90" y="-14" width="180" height="28" rx="3" fill="#94785a" ${ink()}/>`);
  for (const [x, r] of [[-70, -6], [-36, 5], [-2, -3], [34, 8], [66, -4]]) P('props').push(`<g transform="translate(${650 + x},962) rotate(${r})"><rect x="-13" y="-16" width="26" height="32" fill="#e4dbc4" ${ink(1.4)}/><circle cx="0" cy="-11" r="3" fill="#9e4a3c"/></g>`);
}
// ---------- THE VAULT (reward room) ----------
{
  for (const [x, y, r] of [[1480, 180, 4], [1700, 175, -6]]) thing(x, y, r, `<rect x="-50" y="-32" width="100" height="64" rx="6" fill="#77604a" ${ink()}/><rect x="-50" y="-6" width="100" height="12" fill="#b09450" ${ink(1.8)}/><rect x="-8" y="-12" width="16" height="22" rx="2" fill="#c8ad62" ${ink(1.8)}/>`, rect(-50, -32, 100, 64));
  shelf(1600, 130, 140, 40);
  for (let i = 0; i < 18; i++) P('props').push(`<circle cx="${f(1560 + rr(-40, 60))}" cy="${f(300 + rr(-25, 30))}" r="6" fill="#c8ad62" ${ink(1.3)}/>`);
  P('props').push(`<g transform="translate(1720,320)">${sh(rect(-30, -22, 60, 44))}<rect x="-30" y="-22" width="60" height="44" rx="4" fill="#5e6068" ${ink()}/><circle cx="0" cy="0" r="7" fill="#b09450" ${ink(1.6)}/></g>`);
}

// ---------- OUTSIDE ----------
{
  // guild sign: hanging board painted with a coin and scales
  P('outside').push(`<g transform="translate(780,1070)">${sh(rect(-6, -10, 12, 90))}<rect x="-6" y="-10" width="12" height="90" fill="#5e4a3a" ${ink()}/><path d="M0,40h-46" ${ink(3)}/><rect x="-104" y="14" width="64" height="52" rx="6" fill="#4e6680" ${ink()}/><path d="M-72,26v26M-90,32h36" ${ink(2.2)}/><path d="M-90,32l-7,12h14zM-54,32l-7,12h14z" fill="#c8ad62" ${ink(1.6)}/><path d="M-80,52h16" ${ink(2.2)}/></g>`);
  // hitching rail and a water trough
  P('outside').push(`<g transform="translate(1300,1090)">${sh(rect(-110, -6, 220, 12))}<path d="M-110,0h220" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-110,0h220" stroke="#77604a" stroke-width="7" stroke-linecap="round"/><rect x="-116" y="-10" width="16" height="20" fill="#5a4638" ${ink(2)}/><rect x="100" y="-10" width="16" height="20" fill="#5a4638" ${ink(2)}/></g>`);
  P('outside').push(`<g transform="translate(1600,1110)">${sh(rect(-70, -22, 140, 44))}<rect x="-70" y="-22" width="140" height="44" rx="5" fill="#77604a" ${ink()}/><rect x="-60" y="-13" width="120" height="26" rx="3" fill="#5f97a4" ${ink(1.8)}/><path d="M-40,-4q10,-4 20,0M10,4q10,-4 20,0" stroke="#d0e4e8" stroke-width="2" fill="none"/></g>`);
  barrel(1120, 1060, 24); crate(1170, 1075, 44, 12);
  for (const [x, y, r] of [[300, 1200, 15], [520, 1330, -150], [1050, 1250, 170], [1700, 1240, 40], [1880, 1340, -120], [1450, 1200, 200]]) sheep(x, y, r);
  for (const [x, y, r, b] of [[90, 200, 70, true], [80, 520, 62, false], [100, 880, 66, true], [1920, 220, 66, false], [1910, 560, 60, true], [1925, 900, 64, false], [450, 40, 46, false], [1200, 35, 44, true], [1650, 40, 42, false]]) bush(x, y, r, b);
}

// ---------- compose ----------
const order = ['ground', 'outside', 'floor', 'rugs', 'daylight', 'wallShadow', 'papers', 'props', 'doors', 'walls', 'posts', 'windows', 'glow'];
const body = order.map((k) => {
  const attr = k === 'daylight' || k === 'glow' ? ' style="mix-blend-mode:screen" clip-path="url(#hallClip)"' : k === 'wallShadow' ? ' clip-path="url(#hallClip)"' : k === 'props' || k === 'walls' || k === 'outside' ? ' filter="url(#wob)"' : '';
  return `<g id="${k}"${attr}>${(L[k] || []).join('\n')}</g>`;
}).join('\n');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}" viewBox="0 0 ${W2} ${H2}"><defs>${defs.join('')}</defs>${body}</svg>`;
fs.writeFileSync(OUT + '/guild-hall.svg', svg);
fs.writeFileSync(OUT + '/guild-hall-walls.json', JSON.stringify({ walls: [...outerWalls, ...innerWalls], doors, lights }));
console.log('svg bytes', svg.length, 'walls', outerWalls.length + innerWalls.length, 'doors', doors.length, 'lights', lights.length);
