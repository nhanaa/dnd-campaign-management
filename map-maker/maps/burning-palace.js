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

// ---------- palette ----------
const INK = '#1e140e';
const L = {};
const layer = (k) => (L[k] = L[k] || []);
const defs = [];

// layout (units: 100 per 5-ft square)
const hall = { x: 1000, y: 100, w: 1000, h: 1250 };        // central throne hall
const westWing = { x: 400, y: 300, w: 600, h: 1050 };      // burning, partly collapsed
const eastWing = { x: 2000, y: 300, w: 600, h: 1050 };     // colonnaded gallery around a small garden court
const T = 60;                                              // wall thickness
const plazaY = 1350;

defs.push(`
<filter id="tex" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="4" seed="3" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 1.4 -0.55"/>
</filter>
<filter id="fine" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" seed="9" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.12  0 0 0 1.6 -0.78"/>
</filter>
<filter id="vein" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="turbulence" baseFrequency="0.006 0.018" numOctaves="4" seed="17" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.33  0 0 0 0 0.36  -3 0 0 0 1.1"/>
</filter>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="t"/>
  <feDisplacementMap in="SourceGraphic" in2="t" scale="6" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="flame" x="-30%" y="-30%" width="160%" height="160%">
  <feTurbulence type="fractalNoise" baseFrequency="0.045 0.07" numOctaves="3" seed="23" result="t"/>
  <feDisplacementMap in="SourceGraphic" in2="t" scale="34" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="leafy" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="11" result="t"/>
  <feDisplacementMap in="SourceGraphic" in2="t" scale="18" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="s6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="s14" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="s40" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="stoneTex" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="21" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.13  0 0 0 0 0.11  0 0 0 1.5 -0.6"/>
  <feComposite in2="SourceGraphic" operator="in"/>
</filter>
<radialGradient id="glow"><stop offset="0" stop-color="#ffb347" stop-opacity="0.75"/><stop offset="0.35" stop-color="#ff7a1a" stop-opacity="0.35"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></radialGradient>
<radialGradient id="coolGlow"><stop offset="0" stop-color="#9fc4ff" stop-opacity="0.35"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<radialGradient id="vignette" cx="50%" cy="50%" r="72%"><stop offset="50%" stop-color="#05060c" stop-opacity="0"/><stop offset="100%" stop-color="#05060c" stop-opacity="0.7"/></radialGradient>
<linearGradient id="carpet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5e0f12"/><stop offset="0.5" stop-color="#8e1a1c"/><stop offset="1" stop-color="#5e0f12"/></linearGradient>
<path id="ember" d="M0,-3 L2,0 L0,3 L-2,0Z"/>
`);

// ---------- helpers ----------
function shadowOf(d, dx = 22, dy = 28, op = 0.5, blur = 's6') { return `<path d="${d}" transform="translate(${dx},${dy})" fill="#000" opacity="${op}" filter="url(#${blur})"/>`; }
function stone(x, y, r, opts = {}) {
  const pts = polyPts(x, y, r, opts.n || Math.floor(rr(5, 8)), opts.irr ?? 0.25, rr(0, 6));
  const lit = opts.lit ?? rr(40, 55), hue = opts.hue ?? rr(20, 35), sat = opts.sat ?? rr(5, 12);
  const top = pts.map(([a, b]) => [x + (a - x) * 0.72 - r * 0.1, y + (b - y) * 0.72 - r * 0.12]);
  return (opts.noShadow ? '' : shadowOf(poly(pts), r * 0.3, r * 0.35, 0.5)) +
    `<path d="${poly(pts)}" fill="${hsl(hue, sat, lit - 14)}" stroke="${INK}" stroke-width="${opts.sw || 3}" stroke-linejoin="round"/><path d="${poly(top)}" fill="${hsl(hue, sat, lit)}"/>`;
}
// flame cluster: dark red base -> orange -> yellow -> white core, displaced into tongues
function fire(x, y, r, out = layer('fire')) {
  const g = [];
  g.push(`<g filter="url(#flame)">`);
  g.push(`<path d="${blob(x, y, r, r * 0.85, 0.35, 14)}" fill="#7a1408"/>`);
  g.push(`<path d="${blob(x - r * 0.05, y - r * 0.08, r * 0.78, r * 0.66, 0.35, 12)}" fill="#e2420e"/>`);
  g.push(`<path d="${blob(x - r * 0.08, y - r * 0.12, r * 0.52, r * 0.44, 0.35, 11)}" fill="#ff9a1f"/>`);
  g.push(`<path d="${blob(x - r * 0.1, y - r * 0.15, r * 0.28, r * 0.24, 0.35, 9)}" fill="#ffe27a"/>`);
  g.push(`</g>`);
  out.push(g.join(''));
  layer('glow').push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 4.2)}" fill="url(#glow)"/>`);
}
function scorch(x, y, r) { layer('scorch').push(`<path d="${blob(x, y, r, r * rr(0.6, 0.9), 0.35, 14)}" fill="#0b0705" opacity="${f(rr(0.45, 0.7))}" filter="url(#s14)"/>`); }

// ---------- outside: night city rooftops beyond the palace ----------
const R = layer('roofs');
R.push(`<rect width="${W}" height="${H}" fill="#1d1a1c"/>`);
// street cobbles under everything outside
R.push(`<rect width="${W}" height="${H}" filter="url(#fine)" opacity="0.6"/>`);
function roof(x, y, w, h, burning) {
  const out = [];
  const hue = rr(8, 18), lit = rr(30, 40);
  out.push(shadowOf(`M${x},${y}h${w}v${h}h${-w}Z`, 30, 36, 0.6, 's14'));
  // hip roof: four facets meeting at a ridge
  const ridge = w > h ? [[x + h / 2, y + h / 2], [x + w - h / 2, y + h / 2]] : [[x + w / 2, y + w / 2], [x + w / 2, y + h - w / 2]];
  const [a, b] = ridge;
  const facets = [
    [[x, y], [x + w, y], b, a, hsl(hue, 45, lit + 8)],             // north facet, lit
    [[x + w, y], [x + w, y + h], b, null, hsl(hue, 45, lit - 6)],    // east
    [[x + w, y + h], [x, y + h], a, b, hsl(hue, 45, lit - 12)],      // south, in shade
    [[x, y + h], [x, y], a, null, hsl(hue, 45, lit + 4)],            // west
  ];
  for (const [p, q, r1, r2, col] of facets) {
    const pts = r2 ? [p, q, r1, r2] : [p, q, r1];
    out.push(`<path d="${poly(pts)}" fill="${col}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`);
  }
  // tile courses
  const lines = [];
  for (let yy = y + 14; yy < y + h; yy += 16) lines.push(`M${x + 4},${f(yy)}h${w - 8}`);
  out.push(`<clipPath id="rc${f(x)}_${f(y)}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><path d="${lines.join('')}" stroke="#000" stroke-width="2" opacity="0.25" clip-path="url(#rc${f(x)}_${f(y)})"/>`);
  out.push(`<path d="M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}" stroke="#d9a07a" stroke-width="5" opacity="0.6"/>`);
  if (burning) {
    // roof caved in: dark hole with fire inside
    const hx = x + w * rr(0.3, 0.7), hy = y + h * rr(0.3, 0.7);
    out.push(`<path d="${blob(hx, hy, w * 0.25, h * 0.22, 0.4, 12)}" fill="#0b0705" stroke="${INK}" stroke-width="3"/>`);
    R.push(out.join(''));
    fire(hx, hy, Math.min(w, h) * 0.18, layer('roofFire'));
    return;
  }
  R.push(out.join(''));
}
// west and east city blocks
const blocks = [];
for (const [x0, x1] of [[0, 360], [2640, 3000]]) {
  let y = -40;
  while (y < plazaY - 60) {
    const h = rr(180, 300);
    let x = x0 - 30;
    while (x < x1) {
      const w = Math.min(rr(150, 260), x1 - x + 20);
      if (w > 90) blocks.push([x, y, w - 14, h - 14]);
      x += w;
    }
    y += h;
  }
}
for (const [x, y, w, h] of blocks) roof(x, y, w, h, rnd() < 0.16);
// north band behind the hall
for (let x = 380; x < 2640; x += rr(180, 280)) {
  if (x > hall.x - 40 && x < hall.x + hall.w) continue;
  roof(x, -60, rr(150, 240), rr(150, 300), rnd() < 0.2);
}

// ---------- plaza (forecourt) ----------
const P = layer('plaza');
P.push(`<rect x="0" y="${plazaY}" width="${W}" height="${H - plazaY}" fill="#6d6560"/>`);
{
  // big flagstones, 50-unit courses (half a square), staggered rows
  const st = [];
  for (let y = plazaY; y < H; y += 50) {
    const off = ((y / 50) % 2) * 50;
    for (let x = -off; x < W; x += 100) {
      const l = rr(36, 48);
      st.push(`<rect x="${f(x + 2)}" y="${f(y + 2)}" width="96" height="46" rx="4" fill="${hsl(rr(18, 34), rr(6, 14), l)}" stroke="${INK}" stroke-width="2" stroke-opacity="0.7"/>`);
    }
  }
  P.push(st.join(''));
  // radial inlay: large compass rose of lighter stone in front of the stairs
  const cx = 1500, cy = 1760;
  P.push(`<circle cx="${cx}" cy="${cy}" r="256" fill="#5a524c"/>`);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2, w = Math.PI / 16;
    const rOut = i % 4 === 0 ? 240 : i % 2 ? 150 : 195;
    const tip = [cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut];
    const l = [cx + Math.cos(a - w) * 70, cy + Math.sin(a - w) * 70], r = [cx + Math.cos(a + w) * 70, cy + Math.sin(a + w) * 70];
    // two halves of each point: lit and shaded
    P.push(`<path d="M${cx},${cy} L${f(l[0])},${f(l[1])} L${f(tip[0])},${f(tip[1])}Z" fill="${i % 2 ? '#a8987e' : '#e2d3b0'}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`);
    P.push(`<path d="M${cx},${cy} L${f(r[0])},${f(r[1])} L${f(tip[0])},${f(tip[1])}Z" fill="${i % 2 ? '#8a7c66' : '#bfae8a'}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`);
  }
  P.push(`<circle cx="${cx}" cy="${cy}" r="250" fill="none" stroke="#c9b48a" stroke-width="10"/><circle cx="${cx}" cy="${cy}" r="250" fill="none" stroke="${INK}" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="262" fill="none" stroke="${INK}" stroke-width="2.5"/>`);
  P.push(`<circle cx="${cx}" cy="${cy}" r="52" fill="#8a1a1c" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="30" fill="#d9b55a" stroke="${INK}" stroke-width="3"/>`);
}
P.push(`<rect x="0" y="${plazaY}" width="${W}" height="${H - plazaY}" filter="url(#tex)" opacity="0.8" style="mix-blend-mode:multiply"/>`);

// grand stairs from the hall doors down to the plaza
const ST = layer('stairs');
{
  const x0 = 1180, x1 = 1820, y0 = plazaY, steps = 7, sd = 22;
  for (let i = steps - 1; i >= 0; i--) {
    const y = y0 + i * sd, inset = i * 14;
    ST.push(`<rect x="${x0 - inset}" y="${y}" width="${x1 - x0 + inset * 2}" height="${sd + 2}" fill="${hsl(32, 14, 70 - i * 3)}" stroke="${INK}" stroke-width="3"/>`);
    ST.push(`<rect x="${x0 - inset}" y="${y + sd - 5}" width="${x1 - x0 + inset * 2}" height="6" fill="#000" opacity="0.3"/>`);
  }
  // carpet runs down the stairs
  ST.push(`<rect x="1410" y="${y0}" width="180" height="${steps * sd}" fill="url(#carpet)" stroke="${INK}" stroke-width="3"/>`);
}

// ---------- hall floor: polished marble, one tile per square ----------
const F = layer('floor');
function marble(x, y, w, h, light, dark, id) {
  F.push(`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">`);
  const t = [];
  for (let yy = y; yy < y + h; yy += 100) for (let xx = x; xx < x + w; xx += 100) {
    const even = (Math.round(xx / 100) + Math.round(yy / 100)) % 2 === 0;
    t.push(`<rect x="${xx}" y="${yy}" width="100" height="100" fill="${even ? light : dark}"/>`);
  }
  F.push(t.join(''));
  F.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#vein)" opacity="0.5"/>`);
  const g = [];
  for (let xx = x; xx <= x + w; xx += 100) g.push(`M${xx},${y}V${y + h}`);
  for (let yy = y; yy <= y + h; yy += 100) g.push(`M${x},${yy}H${x + w}`);
  F.push(`<path d="${g.join('')}" stroke="${INK}" stroke-width="2" opacity="0.55"/>`);
  F.push(`</g>`);
}
marble(hall.x, hall.y, hall.w, hall.h, '#d9d2c4', '#9f9a92', 'hallClip');
marble(eastWing.x, eastWing.y, eastWing.w, eastWing.h, '#cfc6b4', '#8e877b', 'eastClip');
// west wing floor: same marble, but scorched and littered
marble(westWing.x, westWing.y, westWing.w, westWing.h, '#b8ab96', '#7a7064', 'westClip');
F.push(`<rect x="${westWing.x}" y="${westWing.y}" width="${westWing.w}" height="${westWing.h}" fill="#140c08" opacity="0.35"/>`);

// garden court inside the east wing: soil, hedges, a dead ornamental tree
const GC = { x: 2140, y: 520, w: 320, h: 620 };
F.push(`<rect x="${GC.x}" y="${GC.y}" width="${GC.w}" height="${GC.h}" fill="#3b3423" stroke="${INK}" stroke-width="4"/>`);
F.push(`<rect x="${GC.x}" y="${GC.y}" width="${GC.w}" height="${GC.h}" filter="url(#fine)" opacity="0.8"/>`);

// carpet up the nave to the dais
const CP = layer('carpet');
{
  const x = 1410, w = 180, y0 = 430, y1 = plazaY;
  CP.push(shadowOf(`M${x},${y0}h${w}V${y1}h${-w}Z`, 4, 6, 0.4));
  CP.push(`<rect x="${x}" y="${y0}" width="${w}" height="${y1 - y0}" fill="url(#carpet)" stroke="${INK}" stroke-width="3"/>`);
  CP.push(`<rect x="${x + 14}" y="${y0 + 10}" width="${w - 28}" height="${y1 - y0 - 10}" fill="none" stroke="#d9b55a" stroke-width="6"/>`);
  CP.push(`<rect x="${x + 26}" y="${y0 + 22}" width="${w - 52}" height="${y1 - y0 - 22}" fill="none" stroke="#d9b55a" stroke-width="2" opacity="0.7"/>`);
  // repeating diamond motif
  for (let y = y0 + 80; y < y1 - 40; y += 120) CP.push(`<path d="M1500,${y - 34} L1530,${y} L1500,${y + 34} L1470,${y}Z" fill="none" stroke="#d9b55a" stroke-width="4"/>`);
  // burned-through holes
  for (const [hx, hy, hr] of [[1450, 980, 34], [1540, 1210, 26], [1480, 690, 22]]) {
    CP.push(`<path d="${blob(hx, hy, hr * 1.6, hr * 1.3, 0.25, 16)}" fill="#1a0806" opacity="0.75" filter="url(#s6)"/><path d="${blob(hx, hy, hr, hr * 0.85, 0.2, 16)}" fill="#a39b90" stroke="#ff7a1a" stroke-width="3" filter="url(#leafy)"/>`);
  }
}

// ---------- dais and throne ----------
const DA = layer('dais');
{
  const cx = 1500;
  const tiers = [[1180, 130, 640, 320, 52], [1250, 150, 500, 250, 60], [1320, 165, 360, 190, 68]];
  for (const [x, y, w, h, l] of tiers) {
    DA.push(shadowOf(`M${x},${y}h${w}v${h}h${-w}Z`, 10, 14, 0.5));
    DA.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${hsl(35, 12, l)}" stroke="${INK}" stroke-width="4"/>`);
    DA.push(`<rect x="${x}" y="${y + h - 8}" width="${w}" height="8" fill="#000" opacity="0.3"/>`);
  }
  DA.push(`<rect x="1180" y="130" width="640" height="320" filter="url(#vein)" opacity="0.35"/>`);
  // throne: high back against the north wall, armrests, red cushion, gold trim
  DA.push(shadowOf(`M1430,175h140v120h-140Z`, 16, 20, 0.6));
  DA.push(`<rect x="1420" y="170" width="160" height="44" rx="8" fill="#c9a24a" stroke="${INK}" stroke-width="4"/>`);
  DA.push(`<path d="M1440,170 L1460,140 L1500,128 L1540,140 L1560,170Z" fill="#d9b55a" stroke="${INK}" stroke-width="4"/>`);
  DA.push(`<rect x="1420" y="205" width="34" height="100" rx="6" fill="#b58f3e" stroke="${INK}" stroke-width="4"/><rect x="1546" y="205" width="34" height="100" rx="6" fill="#b58f3e" stroke="${INK}" stroke-width="4"/>`);
  DA.push(`<rect x="1454" y="212" width="92" height="88" rx="10" fill="#8e1a1c" stroke="${INK}" stroke-width="4"/><path d="M1464,232 Q1500,224 1536,232" stroke="#c23a32" stroke-width="5" fill="none"/>`);
  DA.push(`<circle cx="1500" cy="150" r="10" fill="#8e1a1c" stroke="${INK}" stroke-width="3"/>`);
  // tall standing braziers flanking the throne
  for (const bx of [1290, 1710]) {
    DA.push(shadowOf(`M${bx - 34},${210}a34,34 0 1,0 68,0a34,34 0 1,0 -68,0Z`, 14, 18, 0.5));
    DA.push(`<circle cx="${bx}" cy="210" r="34" fill="#4a3a2a" stroke="${INK}" stroke-width="4"/><circle cx="${bx}" cy="210" r="26" fill="#1a0d08"/>`);
    fire(bx, 205, 26);
  }
}

// ---------- columns ----------
const CO = layer('columns');
function column(x, y, r = 44, broken = false) {
  CO.push(shadowOf(`M${x - r - 8},${y - r - 8}h${2 * r + 16}v${2 * r + 16}h${-2 * r - 16}Z`, 30, 38, 0.5, 's14'));
  CO.push(`<rect x="${x - r - 10}" y="${y - r - 10}" width="${2 * r + 20}" height="${2 * r + 20}" fill="#b9b0a0" stroke="${INK}" stroke-width="4"/>`);
  CO.push(`<rect x="${x - r - 10}" y="${y - r - 10}" width="${2 * r + 20}" height="${2 * r + 20}" fill="#fff" filter="url(#stoneTex)" opacity="0.5"/>`);
  if (broken) {
    CO.push(`<path d="${poly(polyPts(x, y, r, 9, 0.18))}" fill="#a69d8e" stroke="${INK}" stroke-width="4"/>`);
    CO.push(`<path d="${poly(polyPts(x - 4, y - 4, r * 0.55, 7, 0.25))}" fill="#7d756a"/>`);
    return;
  }
  CO.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#ddd5c6" stroke="${INK}" stroke-width="4"/>`);
  // fluting as ring of short ticks, lit from the NW
  const t = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; t.push(`M${f(x + Math.cos(a) * r * 0.62)},${f(y + Math.sin(a) * r * 0.62)}L${f(x + Math.cos(a) * r * 0.94)},${f(y + Math.sin(a) * r * 0.94)}`); }
  CO.push(`<path d="${t.join('')}" stroke="#8f8676" stroke-width="2.5"/>`);
  CO.push(`<circle cx="${x - r * 0.18}" cy="${y - r * 0.2}" r="${r * 0.45}" fill="#f2ece0" opacity="0.7"/>`);
}
// two rows down the nave, one square in from the aisles
const colY = [550, 750, 950, 1150];
for (const y of colY) { column(1250, y, 44, y === 950); column(1750, y, 44, false); }
// a fallen column across the west aisle (lying drum segments)
const FC = layer('fallen');
{
  const x = 1110, y = 1000, ang = -62;
  FC.push(`<g transform="translate(${x},${y}) rotate(${ang})">`);
  for (let i = 0; i < 4; i++) {
    const sx = -150 + i * 92 + rr(-6, 6), sy = rr(-8, 8);
    FC.push(`<rect x="${sx + 12}" y="${sy - 44 + 26}" width="86" height="88" rx="10" fill="#000" opacity="0.45" filter="url(#s6)"/>`);
    FC.push(`<rect x="${sx}" y="${sy - 44}" width="86" height="88" rx="10" fill="#cfc6b6" stroke="${INK}" stroke-width="4"/>`);
    FC.push(`<path d="M${sx + 8},${sy - 30}h70M${sx + 8},${sy - 10}h70M${sx + 8},${sy + 10}h70M${sx + 8},${sy + 30}h70" stroke="#8f8676" stroke-width="2.5"/>`);
    FC.push(`<rect x="${sx}" y="${sy - 44}" width="86" height="22" rx="8" fill="#f2ece0" opacity="0.6"/>`);
  }
  FC.push(`</g>`);
}
// east wing colonnade around the garden court
for (let y = 440; y <= 1240; y += 200) { column(2080, y, 30); column(2520, y, 30); }

// ---------- walls ----------
const WL = layer('walls'), WS = layer('wallShadow');
const wallSegs = [];
function wall(x0, y0, x1, y1, gaps = [], broken = []) {
  const len = dist(x0, y0, x1, y1), ux = (x1 - x0) / len, uy = (y1 - y0) / len, nx = -uy, ny = ux;
  let s = 0;
  const runs = [];
  while (s < len) {
    const bl = Math.min(rr(60, 110), len - s), mid = s + bl / 2;
    if (!gaps.some(([a, b]) => mid > a && mid < b)) {
      const low = broken.some(([a, b]) => mid > a && mid < b);
      const j = () => rr(-2, 2);
      const c = (u, v) => [x0 + ux * u + nx * v + j(), y0 + uy * u + ny * v + j()];
      const th = low ? T * rr(0.5, 0.8) : T;
      const pts = [c(s + 1.5, -th / 2), c(s + bl - 1.5, -th / 2), c(s + bl - 1.5, th / 2), c(s + 1.5, th / 2)];
      WS.push(`<path d="${poly(pts.map(([p, q]) => [p + (low ? 16 : 36), q + (low ? 18 : 44)]))}" fill="#000"/>`);
      WL.push(`<path d="${poly(pts)}" fill="${hsl(rr(28, 36), rr(8, 14), low ? rr(38, 46) : rr(52, 60))}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
      WL.push(`<path d="M${f(pts[0][0])},${f(pts[0][1])}L${f(pts[1][0])},${f(pts[1][1])}" stroke="#e6dccb" stroke-width="3" opacity="0.5"/>`);
      if (runs.length && Math.abs(runs[runs.length - 1][1] - s) < 1) runs[runs.length - 1][1] = s + bl; else runs.push([s, s + bl]);
    }
    s += bl;
  }
  for (const [a, b] of runs) wallSegs.push([[x0 + ux * a, y0 + uy * a], [x0 + ux * b, y0 + uy * b]]);
}
const h = T / 2;
// hall: north, west (door to west wing), east (door to east wing), south (great doors)
wall(hall.x, hall.y + h, hall.x + hall.w, hall.y + h);
wall(hall.x + h, hall.y, hall.x + h, plazaY, [[640, 760]]);
wall(hall.x + hall.w - h, hall.y, hall.x + hall.w - h, plazaY, [[640, 760]]);
wall(hall.x, plazaY - h, hall.x + hall.w, plazaY - h, [[380, 620]]);
// west wing: north wall half collapsed, west wall breached, south wall door
wall(westWing.x, westWing.y + h, westWing.x + westWing.w, westWing.y + h, [[180, 330]], [[60, 180], [330, 420]]);
wall(westWing.x + h, westWing.y, westWing.x + h, plazaY, [[420, 560]], [[300, 420], [560, 640]]);
wall(westWing.x, plazaY - h, westWing.x + westWing.w, plazaY - h, [[230, 360]]);
// east wing
wall(eastWing.x, eastWing.y + h, eastWing.x + eastWing.w, eastWing.y + h);
wall(eastWing.x + eastWing.w - h, eastWing.y, eastWing.x + eastWing.w - h, plazaY);
wall(eastWing.x, plazaY - h, eastWing.x + eastWing.w, plazaY - h, [[240, 360]]);

// great doors: one blown off its hinges lying on the stairs, one hanging open
const DR = layer('doors');
DR.push(`<g transform="translate(1440,1420) rotate(-14)">${shadowOf('M-110,-14h220v40h-220Z', 12, 16, 0.5)}<rect x="-110" y="-14" width="220" height="40" rx="4" fill="#4a2a18" stroke="${INK}" stroke-width="4"/><path d="M-100,-4h200M-100,6h200M-100,16h200" stroke="#2a160c" stroke-width="2.5"/><rect x="-80" y="-14" width="14" height="40" fill="#8a7a5a" stroke="${INK}" stroke-width="2"/><rect x="60" y="-14" width="14" height="40" fill="#8a7a5a" stroke="${INK}" stroke-width="2"/></g>`);
DR.push(`<g transform="translate(1620,1330) rotate(-78)"><rect x="0" y="-12" width="118" height="24" rx="3" fill="#4a2a18" stroke="${INK}" stroke-width="4"/><path d="M8,-3h104M8,5h104" stroke="#2a160c" stroke-width="2.5"/></g>`);
// side doors
for (const [x, y, rot] of [[hall.x + h, 790, 0], [hall.x + hall.w - h, 790, 0]]) DR.push(`<rect x="${x - 12}" y="${y - 48}" width="24" height="44" fill="#4a2a18" stroke="${INK}" stroke-width="3" transform="rotate(${rot} ${x} ${y})"/>`);

// ---------- west wing on fire ----------
const RB = layer('rubble');
function rubble(cx, cy, n, spread, charred = false) {
  for (let i = 0; i < n; i++) {
    const x = cx + rr(-spread, spread), y = cy + rr(-spread, spread) * 0.8, bw = rr(28, 56), bh = rr(22, 40);
    RB.push(`<g transform="translate(${f(x)},${f(y)}) rotate(${f(rr(-60, 60))})"><rect x="${f(-bw / 2 + 8)}" y="${f(-bh / 2 + 12)}" width="${f(bw)}" height="${f(bh)}" fill="#000" opacity="0.5" filter="url(#s6)"/><rect x="${f(-bw / 2)}" y="${f(-bh / 2)}" width="${f(bw)}" height="${f(bh)}" rx="3" fill="${hsl(30, 10, charred ? rr(28, 38) : rr(48, 58))}" stroke="${INK}" stroke-width="3"/></g>`);
  }
  for (let i = 0; i < n * 2; i++) RB.push(stone(cx + rr(-spread, spread) * 1.2, cy + rr(-spread, spread), rr(6, 14), { noShadow: rnd() < 0.5, sw: 2, lit: charred ? 34 : 50 }));
}
function beam(x, y, len, ang, charred = true) {
  const g = `<g transform="translate(${x},${y}) rotate(${ang})"><rect x="${-len / 2 + 10}" y="2" width="${len}" height="28" fill="#000" opacity="0.5" filter="url(#s6)"/><rect x="${-len / 2}" y="-14" width="${len}" height="28" rx="4" fill="${charred ? '#2a1a12' : '#5a3a22'}" stroke="${INK}" stroke-width="3"/><path d="M${-len / 2 + 10},-4h${len * 0.6}M${-len / 2 + 30},5h${len * 0.5}" stroke="${charred ? '#ff7a1a' : '#3a2414'}" stroke-width="2" opacity="${charred ? 0.7 : 1}"/></g>`;
  layer('beams').push(g);
}
scorch(700, 700, 260); scorch(620, 1120, 200); scorch(880, 480, 160);
rubble(560, 420, 9, 90, true); rubble(450, 800, 8, 70, true); rubble(760, 1000, 7, 80, true);
beam(650, 640, 360, 28); beam(760, 820, 300, -40); beam(540, 1040, 260, 75); beam(820, 560, 220, 5);
fire(640, 700, 70); fire(560, 1130, 55); fire(820, 900, 45); fire(470, 470, 40); fire(860, 1220, 34);
// east wing garden: hedges and a dead tree
{
  const g = layer('garden');
  for (const [x, y, w, hh] of [[GC.x + 20, GC.y + 20, 280, 50], [GC.x + 20, GC.y + GC.h - 70, 280, 50], [GC.x + 20, GC.y + 90, 50, 440], [GC.x + 250, GC.y + 90, 50, 440]]) {
    g.push(shadowOf(`M${x},${y}h${w}v${hh}h${-w}Z`, 14, 18, 0.5));
    g.push(`<g filter="url(#leafy)"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="18" fill="${INK}"/><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${hh - 6}" rx="16" fill="#2f4322"/><rect x="${x + 6}" y="${y + 4}" width="${w - 16}" height="${hh * 0.5}" rx="12" fill="#45602e"/></g>`);
  }
  const tx = GC.x + GC.w / 2, ty = GC.y + GC.h / 2;
  g.push(`<circle cx="${tx}" cy="${ty}" r="70" fill="#4a3a2a" stroke="${INK}" stroke-width="4"/>`);
  const br = [];
  for (let i = 0; i < 7; i++) { const a = rr(0, 6.28), l = rr(80, 140); br.push(`M${tx},${ty} Q${f(tx + Math.cos(a + 0.3) * l * 0.5)},${f(ty + Math.sin(a + 0.3) * l * 0.5)} ${f(tx + Math.cos(a) * l)},${f(ty + Math.sin(a) * l)}`); }
  g.push(`<path d="${br.join('')}" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${br.join('')}" stroke="#3a2a1e" stroke-width="7" fill="none" stroke-linecap="round"/>`);
  fire(GC.x + 70, GC.y + 40, 26);
}

// ---------- plaza details ----------
{
  // braziers along the approach
  for (const [x, y] of [[1080, 1500], [1920, 1500], [1080, 1920], [1920, 1920]]) {
    P.push(shadowOf(`M${x - 40},${y}a40,40 0 1,0 80,0a40,40 0 1,0 -80,0Z`, 16, 20, 0.55));
    P.push(`<circle cx="${x}" cy="${y}" r="40" fill="#3b2e24" stroke="${INK}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="30" fill="#140b07"/>`);
    fire(x, y - 4, 30);
  }
  // broken fountain, west plaza
  const fx = 640, fy = 1690;
  const oct = (r) => poly([...Array(8)].map((_, i) => [fx + Math.cos(i * Math.PI / 4 + Math.PI / 8) * r, fy + Math.sin(i * Math.PI / 4 + Math.PI / 8) * r]));
  P.push(shadowOf(oct(190), 22, 28, 0.55, 's14'));
  P.push(`<path d="${oct(190)}" fill="#b5ab99" stroke="${INK}" stroke-width="5"/><path d="${oct(160)}" fill="#24424f" stroke="${INK}" stroke-width="4"/>`);
  P.push(`<path d="${oct(160)}" fill="#6fa0ad" filter="url(#stoneTex)" opacity="0.5"/>`);
  P.push(`<path d="${blob(fx + 40, fy + 30, 70, 40, 0.3, 10)}" fill="#ff8a2a" opacity="0.25"/>`); // fire reflected in water
  P.push(stone(fx, fy, 56, { n: 8, irr: 0.08, lit: 68 }));
  rubble(fx + 120, fy - 90, 5, 40);
  // barricade of overturned carts and crates, east plaza
  const bx = 2350, by = 1700;
  for (const [dx, dy, w, hh, rot] of [[-120, -40, 200, 90, -18], [80, 40, 180, 80, 24], [-10, 90, 80, 80, 8], [150, -80, 70, 70, -30]]) {
    P.push(`<g transform="translate(${bx + dx},${by + dy}) rotate(${rot})">${shadowOf(`M${-w / 2},${-hh / 2}h${w}v${hh}h${-w}Z`, 16, 20, 0.55)}<rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" rx="4" fill="#5a3a22" stroke="${INK}" stroke-width="4"/><path d="M${-w / 2 + 8},${-hh / 4}h${w - 16}M${-w / 2 + 8},0h${w - 16}M${-w / 2 + 8},${hh / 4}h${w - 16}" stroke="#2f1d10" stroke-width="3"/></g>`);
  }
  fire(bx - 80, by - 10, 60);
  P.push(`<g transform="translate(${bx - 200},${by + 110}) rotate(30)"><circle r="46" fill="none" stroke="${INK}" stroke-width="14"/><circle r="46" fill="none" stroke="#5a3a22" stroke-width="9"/><path d="M-46,0h92M0,-46v92M-32,-32L32,32M-32,32L32,-32" stroke="#5a3a22" stroke-width="6"/></g>`);
  // fallen banners: crimson cloth with a gold sun disc (original sigil)
  for (const [x, y, rot] of [[870, 1460, 12], [2170, 1480, -20], [1900, 1820, 70]]) {
    P.push(`<g transform="translate(${x},${y}) rotate(${rot})">${shadowOf('M-60,-110 L60,-110 L66,90 L0,120 L-66,90Z', 10, 14, 0.5)}<path d="M-60,-110 L60,-110 L66,90 L0,120 L-66,90Z" fill="#8e1a1c" stroke="${INK}" stroke-width="4"/><path d="M-50,-100 L50,-100 L55,82 L0,108 L-55,82Z" fill="none" stroke="#d9b55a" stroke-width="4"/><circle cx="0" cy="-10" r="30" fill="#d9b55a" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="-10" r="16" fill="#8e1a1c"/><path d="M-70,-112h140" stroke="#5a3a22" stroke-width="12" stroke-linecap="round"/></g>`);
  }
  for (const [x, y] of [[1260, 1640], [1760, 1600], [2050, 1940], [420, 1450], [2620, 1500]]) scorch(x, y, rr(60, 110));
  rubble(1030, 1380, 4, 40); rubble(2000, 1380, 4, 40);
  // weapons and arrows left on the ground
  for (let i = 0; i < 40; i++) {
    const x = rr(300, 2700), y = rr(1420, 1960), a = rr(0, 360);
    if (dist(x, y, 1500, 1760) < 270 || dist(x, y, 640, 1690) < 210) continue;
    P.push(`<g transform="translate(${f(x)},${f(y)}) rotate(${f(a)})"><path d="M-30,0H28" stroke="#4a3220" stroke-width="3"/><path d="M28,-4L36,0L28,4Z" fill="#9aa0a6" stroke="${INK}" stroke-width="1"/><path d="M-30,0l-6,-5M-30,0l-6,5" stroke="#d8d0c0" stroke-width="2"/></g>`);
  }
}

// ---------- embers, ash, smoke ----------
const EM = layer('embers');
for (let i = 0; i < 700; i++) {
  const x = rr(0, W), y = rr(0, H);
  EM.push(`<use href="#ember" transform="translate(${f(x)},${f(y)}) rotate(${f(rr(0, 90))}) scale(${f(rr(0.6, 1.6))})" fill="${pick(['#ffb347', '#ff7a1a', '#ffd27a', '#ff5a1a'])}" opacity="${f(rr(0.5, 1))}"/>`);
}
for (let i = 0; i < 900; i++) {
  const x = rr(0, W), y = rr(0, H);
  EM.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr(1.5, 3.5))}" fill="#c9c2bb" opacity="${f(rr(0.15, 0.4))}"/>`);
}
const SM = layer('smoke');
for (const [x, y, r] of [[620, 700, 300], [500, 1150, 220], [2350, 1700, 220], [200, 300, 260], [2800, 900, 240], [1500, -40, 300]]) {
  SM.push(`<path d="${blob(x + 60, y - 60, r, r * 0.7, 0.4, 14)}" fill="#2b2726" opacity="0.32" filter="url(#s40)"/>`);
}

// ---------- lighting ----------
const LT = layer('light');
LT.push(`<rect width="${W}" height="${H}" fill="#0c1430" opacity="0.38" style="mix-blend-mode:multiply"/>`);   // night
LT.push(`<circle cx="1500" cy="800" r="900" fill="url(#coolGlow)" style="mix-blend-mode:screen" opacity="0.4"/>`); // moonlight through the hall's skylights
LT.push(`<rect width="${W}" height="${H}" fill="url(#vignette)"/>`);

const order = ['roofs', 'plaza', 'stairs', 'floor', 'scorch', 'carpet', 'garden', 'wallShadow', 'walls', 'doors', 'dais', 'fallen', 'columns', 'rubble', 'beams', 'embers', 'smoke', 'light', 'glow'];
const body = order.map((k) => {
  const attr = k === 'walls' || k === 'rubble' ? ' filter="url(#rough)"' : k === 'wallShadow' ? ' filter="url(#s14)" opacity="0.55"' : k === 'glow' ? ' style="mix-blend-mode:screen"' : '';
  return `<g id="${k}"${attr}>${(L[k] || []).join('\n')}</g>`;
}).join('\n');
// flames drawn again above the lighting so they read as light sources
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join('')}</defs>${body}<g>${(L.fire || []).join('')}${(L.roofFire || []).join('')}</g></svg>`;
fs.writeFileSync(OUT + '/burning-palace.svg', svg);
fs.writeFileSync(OUT + '/burning-palace-walls.json', JSON.stringify(wallSegs.map(([a, b]) => [a.map(Math.round), b.map(Math.round)])));
console.log('svg bytes', svg.length, 'wall segments', wallSegs.length);
