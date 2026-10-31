// Procedural SVG battlemap: ruined forest shrine. 30x20 squares, 100 units per square.
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

// ---------- layout ----------
const INK = '#2a1c12';
const chapel = { x: 1080, y: 170, w: 740, h: 560, t: 70, doorX: 1400, doorW: 110 };
const ring = { cx: 1450, cy: 1290, r: 330 };
// clearing (open ground) shape
const clearingPts = blobPts(1470, 1050, 1080, 820, 0.16, 22);
function inClearing(x, y, pad = 0) {
  const dx = (x - 1470) / (1080 - pad), dy = (y - 1050) / (820 - pad);
  return dx * dx + dy * dy < 0.82;
}
// path from west edge into clearing, then up to chapel door
const pathPts = [[-60, 880], [250, 905], [560, 990], [860, 1080], [1150, 1110], [1300, 1010], [1430, 860], [1455, 740]];
// stream across SE corner
const streamPts = [[2120, 2080], [2250, 1910], [2420, 1790], [2620, 1720], [2790, 1560], [2900, 1380], [3080, 1230]];
function streamDist(x, y) {
  let m = 1e9;
  for (let i = 0; i < streamPts.length - 1; i++) {
    const [ax, ay] = streamPts[i], [bx, by] = streamPts[i + 1];
    const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)));
    m = Math.min(m, dist(x, y, ax + t * (bx - ax), ay + t * (by - ay)));
  }
  return m;
}
const inChapel = (x, y, pad = 0) => x > chapel.x - pad && x < chapel.x + chapel.w + pad && y > chapel.y - pad && y < chapel.y + chapel.h + pad;

const defs = [];
const L = {}; // layers
const layer = (k) => (L[k] = L[k] || []);

// ---------- filters, patterns, symbols ----------
defs.push(`
<filter id="groundTex" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="3" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 1.4 -0.55"/>
</filter>
<filter id="fineTex" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="9" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.14  0 0 0 0 0.07  0 0 0 1.6 -0.75"/>
</filter>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="t"/>
  <feDisplacementMap in="SourceGraphic" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="leafy" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="11" result="t"/>
  <feDisplacementMap in="SourceGraphic" in2="t" scale="22" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="soft6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="soft40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="stoneTex" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="21" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.13  0 0 0 0 0.11  0 0 0 1.5 -0.6"/>
  <feComposite in2="SourceGraphic" operator="in"/>
</filter>
<filter id="waterTex" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="turbulence" baseFrequency="0.008 0.03" numOctaves="3" seed="5" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.1 -0.45"/>
  <feComposite in2="SourceGraphic" operator="in"/>
</filter>
<radialGradient id="vignette" cx="50%" cy="50%" r="72%">
  <stop offset="55%" stop-color="#1a0f05" stop-opacity="0"/>
  <stop offset="100%" stop-color="#1a0f05" stop-opacity="0.55"/>
</radialGradient>
<linearGradient id="sun" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#fff2c8" stop-opacity="0.22"/>
  <stop offset="0.6" stop-color="#fff2c8" stop-opacity="0"/>
</linearGradient>
<linearGradient id="water" x1="0" y1="1" x2="1" y2="0">
  <stop offset="0" stop-color="#2f5d6b"/><stop offset="0.5" stop-color="#3d7584"/><stop offset="1" stop-color="#2c5866"/>
</linearGradient>
<path id="tuft" d="M0,0 Q-3,-14 -10,-22 M0,0 Q1,-16 2,-27 M0,0 Q4,-13 11,-20 M-4,0 Q-9,-8 -15,-11 M4,0 Q9,-7 15,-10" fill="none" stroke-linecap="round"/>
<path id="leaf" d="M-6,0 Q-1,-5 6,0 Q-1,5 -6,0Z"/>
`);

// ---------- ground ----------
const G = layer('ground');
G.push(`<rect width="${W}" height="${H}" fill="#8f7d3a"/>`);
// broad color patches: greener and goldener grass
for (let i = 0; i < 70; i++) {
  const x = rr(0, W), y = rr(0, H);
  const col = pick(['#7d7a35', '#9c8740', '#a8853c', '#86833d', '#9a7a36']);
  G.push(`<path d="${blob(x, y, rr(120, 340), rr(100, 260), 0.3)}" fill="${col}" opacity="${f(rr(0.35, 0.7))}" filter="url(#soft40)"/>`);
}
// clearing: trampled golden earth
G.push(`<path d="${smoothClosed(clearingPts)}" fill="#b8924f" opacity="0.75" filter="url(#soft40)"/>`);
G.push(`<path d="${smoothClosed(blobPts(1450, 1200, 620, 520, 0.12, 18))}" fill="#c29a58" opacity="0.7" filter="url(#soft40)"/>`);
// dirt path
G.push(`<path d="${smoothOpen(pathPts)}" fill="none" stroke="#a97d47" stroke-width="160" stroke-linecap="round" opacity="0.95" filter="url(#soft)"/>`);
G.push(`<path d="${smoothOpen(pathPts)}" fill="none" stroke="#cfa66a" stroke-width="95" stroke-linecap="round" opacity="0.95" filter="url(#soft6)"/>`);
// path ruts
G.push(`<path d="${smoothOpen(pathPts.map(([x, y]) => [x, y - 18]))}" fill="none" stroke="#9c7442" stroke-width="5" opacity="0.35" filter="url(#rough)"/>`);
G.push(`<path d="${smoothOpen(pathPts.map(([x, y]) => [x + 6, y + 20]))}" fill="none" stroke="#9c7442" stroke-width="5" opacity="0.35" filter="url(#rough)"/>`);
// mottled texture over everything
G.push(`<rect width="${W}" height="${H}" filter="url(#groundTex)" opacity="0.9" style="mix-blend-mode:multiply"/>`);
G.push(`<rect width="${W}" height="${H}" filter="url(#fineTex)" opacity="0.55" style="mix-blend-mode:multiply"/>`);

// ---------- ring pavement (old circular paving around the altar, half buried) ----------
const RP = layer('ringPave');
{
  const r0 = 120, r1 = 440;
  const rings = 4;
  for (let ri = 0; ri < rings; ri++) {
    const a0r = r0 + (r1 - r0) * (ri / rings), a1r = r0 + (r1 - r0) * ((ri + 1) / rings);
    const segs = Math.round(12 + ri * 7);
    const off = rr(0, 1);
    for (let s = 0; s < segs; s++) {
      const a0 = ((s + off) / segs) * Math.PI * 2, a1 = ((s + 1 + off) / segs) * Math.PI * 2;
      const mx = ring.cx + Math.cos((a0 + a1) / 2) * (a0r + a1r) / 2, my = ring.cy + Math.sin((a0 + a1) / 2) * (a0r + a1r) / 2;
      // buried: fade out stones with distance and noise
      const keep = rnd() < 0.92 - ri * 0.17 - (my > ring.cy + 200 ? 0.15 : 0);
      if (!keep) continue;
      const g = 2.5, j = () => rr(-3, 3);
      const p = (r, a) => [ring.cx + Math.cos(a) * r + j(), ring.cy + Math.sin(a) * r + j()];
      const pts = [p(a0r + g, a0 + 0.006), p(a1r - g, a0 + 0.006), p(a1r - g, (a0 + a1) / 2), p(a1r - g, a1 - 0.006), p(a0r + g, a1 - 0.006)];
      const l = rr(58, 70);
      RP.push(`<path d="${poly(pts)}" fill="${hsl(rr(35, 45), rr(8, 16), l)}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" opacity="${f(rr(0.72, 0.95))}"/>`);
    }
  }
}

for (let i = 0; i < 22; i++) {
  const a = rr(0, 6.28), d = rr(200, 470);
  RP.push(`<path d="${blob(ring.cx + Math.cos(a) * d, ring.cy + Math.sin(a) * d, rr(40, 90), rr(30, 70), 0.4, 11)}" fill="${pick(['#ad8a4a', '#a2853f', '#b38f50'])}" filter="url(#leafy)"/>`);
}
for (let i = 0; i < 70; i++) {
  const a = rr(0, 6.28), d = rr(130, 450);
  RP.push(`<use href="#tuft" transform="translate(${f(ring.cx + Math.cos(a) * d)},${f(ring.cy + Math.sin(a) * d)}) scale(${f(rr(0.7, 1.2))})" stroke="${pick(['#5d6524', '#6f7228', '#7c6a26'])}" stroke-width="2.6"/>`);
}
RP.push(`<clipPath id="ringClip"><circle cx="${ring.cx}" cy="${ring.cy}" r="560"/></clipPath><g clip-path="url(#ringClip)"><rect width="${W}" height="${H}" filter="url(#groundTex)" opacity="0.8" style="mix-blend-mode:multiply"/><rect width="${W}" height="${H}" filter="url(#fineTex)" opacity="0.5" style="mix-blend-mode:multiply"/></g>`);
// ---------- stream ----------
const S = layer('stream');
{
  // banks: wet dark earth, then water body, then shallows highlight
  S.push(`<path d="${smoothOpen(streamPts)}" fill="none" stroke="#5d4a2c" stroke-width="250" stroke-linecap="round" opacity="0.55" filter="url(#soft)"/>`);
  S.push(`<path d="${smoothOpen(streamPts)}" fill="none" stroke="${INK}" stroke-width="196" stroke-linecap="round" filter="url(#rough)"/>`);
  S.push(`<path d="${smoothOpen(streamPts)}" fill="none" stroke="url(#water)" stroke-width="186" stroke-linecap="round" filter="url(#rough)"/>`);
  S.push(`<path d="${smoothOpen(streamPts)}" fill="none" stroke="#5c96a0" stroke-width="186" stroke-linecap="round" filter="url(#waterTex)" opacity="0.5"/>`);
  S.push(`<path d="${smoothOpen(streamPts)}" fill="none" stroke="#1f414c" stroke-width="80" stroke-linecap="round" opacity="0.35" filter="url(#soft)"/>`);
  // ripples (flow lines)
  for (let i = 0; i < 70; i++) {
    const t = rnd() * (streamPts.length - 1.001), k = Math.floor(t), u = t - k;
    const [ax, ay] = streamPts[k], [bx, by] = streamPts[k + 1];
    const x = ax + (bx - ax) * u, y = ay + (by - ay) * u;
    const ang = Math.atan2(by - ay, bx - ax), nx = -Math.sin(ang), ny = Math.cos(ang);
    const o = rr(-70, 70), len = rr(30, 80);
    const x0 = x + nx * o, y0 = y + ny * o;
    const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
    S.push(`<path d="M${f(x0)},${f(y0)} Q${f((x0 + x1) / 2 + nx * 6)},${f((y0 + y1) / 2 + ny * 6)} ${f(x1)},${f(y1)}" stroke="#d9f0ee" stroke-width="${f(rr(2, 4))}" fill="none" stroke-linecap="round" opacity="${f(rr(0.35, 0.8))}"/>`);
  }
}

// ---------- stones helper ----------
function stone(x, y, r, opts = {}) {
  const n = opts.n || Math.floor(rr(6, 9));
  const pts = polyPts(x, y, r, n, opts.irr ?? 0.22, rr(0, 6));
  const hue = opts.hue ?? rr(30, 45), sat = opts.sat ?? rr(5, 12), lit = opts.lit ?? rr(62, 74);
  const out = [];
  if (!opts.noShadow) out.push(`<path d="${poly(pts.map(([a, b]) => [a + r * 0.28, b + r * 0.34]))}" fill="#20140a" opacity="0.38" filter="url(#soft6)"/>`);
  out.push(`<path d="${poly(pts)}" fill="${hsl(hue, sat, lit - 14)}" stroke="${INK}" stroke-width="${opts.sw || 3.5}" stroke-linejoin="round"/>`);
  // lit top facet, shifted toward the light (north-west)
  const top = pts.map(([a, b]) => [x + (a - x) * 0.74 - r * 0.1, y + (b - y) * 0.74 - r * 0.12]);
  out.push(`<path d="${poly(top)}" fill="${hsl(hue, sat, lit)}"/>`);
  out.push(`<path d="${poly(top)}" fill="#fff" filter="url(#stoneTex)" opacity="0.6"/>`);
  if (opts.moss && rnd() < opts.moss) {
    out.push(`<path d="${blob(x + rr(-r, r) * 0.3, y + rr(-r, r) * 0.3, r * rr(0.25, 0.45), r * rr(0.2, 0.35), 0.4, 9)}" fill="#6f7a2e" opacity="0.8"/>`);
  }
  return out.join('');
}

// ---------- rocks along the stream ----------
const RK = layer('rocks');
for (let i = 0; i < 90; i++) {
  const t = rnd() * (streamPts.length - 1.001), k = Math.floor(t), u = t - k;
  const [ax, ay] = streamPts[k], [bx, by] = streamPts[k + 1];
  const x = ax + (bx - ax) * u, y = ay + (by - ay) * u;
  const ang = Math.atan2(by - ay, bx - ax), side = rnd() < 0.5 ? -1 : 1;
  const o = side * rr(85, 140);
  RK.push(stone(x - Math.sin(ang) * o, y + Math.cos(ang) * o, rr(14, 40), { moss: 0.3, hue: rr(190, 220), sat: rr(4, 9) }));
}
for (let i = 0; i < 40; i++) {
  const t = rnd() * (streamPts.length - 1.001), k = Math.floor(t), u = t - k;
  const [ax, ay] = streamPts[k], [bx, by] = streamPts[k + 1];
  const ang = Math.atan2(by - ay, bx - ax), o = (rnd() < 0.5 ? -1 : 1) * rr(78, 92);
  S.push(`<path d="${blob(ax + (bx - ax) * u - Math.sin(ang) * o, ay + (by - ay) * u + Math.cos(ang) * o, rr(14, 30), rr(6, 12), 0.4, 9, ang)}" fill="#e8f4f0" opacity="0.55"/>`);
}
// a few stones in the water
for (let i = 0; i < 6; i++) {
  const t = rr(0.5, 5.4), k = Math.floor(t), u = t - k;
  const [ax, ay] = streamPts[k], [bx, by] = streamPts[k + 1];
  RK.push(stone(ax + (bx - ax) * u + rr(-50, 50), ay + (by - ay) * u + rr(-50, 50), rr(16, 30), { hue: 200, sat: 6, lit: 58 }));
}

// ---------- scatter: leaves, tufts, ferns, pebbles ----------
const SC = layer('scatter');
const leafCols = ['#c4521f', '#d9762a', '#e3a33a', '#a63a1c', '#b8862e', '#8e2f17', '#e8c25a'];
for (let i = 0; i < 4200; i++) {
  const x = rr(0, W), y = rr(0, H);
  if (inChapel(x, y, -60) || streamDist(x, y) < 100) continue;
  const dense = inClearing(x, y, 120) ? 0.35 : 1;
  if (rnd() > dense) continue;
  const s = rr(1.4, 2.6);
  SC.push(`<use href="#leaf" transform="translate(${f(x)},${f(y)}) rotate(${f(rr(0, 360))}) scale(${f(s)})" fill="${pick(leafCols)}" opacity="${f(rr(0.75, 1))}"/>`);
}
for (let i = 0; i < 900; i++) {
  const x = rr(0, W), y = rr(0, H);
  if (inChapel(x, y, 20) || streamDist(x, y) < 110 || dist(x, y, ring.cx, ring.cy) < 470) continue;
  if (inClearing(x, y, 200) && rnd() < 0.75) continue;
  const s = rr(0.9, 1.7);
  SC.push(`<use href="#tuft" transform="translate(${f(x)},${f(y)}) scale(${f(s)})" stroke="${pick(['#5d6524', '#6f7228', '#7c6a26', '#4c5a20'])}" stroke-width="2.6"/>`);
}
// pebbles
for (let i = 0; i < 260; i++) {
  const x = rr(300, 2700), y = rr(250, 1850);
  if (inChapel(x, y, 10) || streamDist(x, y) < 110) continue;
  SC.push(`<path d="${blob(x, y, rr(4, 9), rr(3, 7), 0.3, 7)}" fill="${hsl(35, 8, rr(55, 72))}" stroke="${INK}" stroke-width="1.5"/>`);
}
// ferns
function fern(x, y, len, ang) {
  const out = [];
  const col = pick(['#5f6f26', '#6e7c2c', '#7d7a2a', '#a07a2a']);
  const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
  const bend = rr(-0.3, 0.3);
  const mx = (x + ex) / 2 - Math.sin(ang) * len * bend, my = (y + ey) / 2 + Math.cos(ang) * len * bend;
  const leaflets = [];
  for (let i = 1; i < 12; i++) {
    const t = i / 12, it = 1 - t;
    const px = it * it * x + 2 * it * t * mx + t * t * ex, py = it * it * y + 2 * it * t * my + t * t * ey;
    const l = len * 0.32 * Math.sin(t * Math.PI) + 4;
    for (const s of [-1, 1]) {
      const a = ang + s * 1.05;
      leaflets.push(`M${f(px)},${f(py)} Q${f(px + Math.cos(a) * l * 0.6 + Math.cos(ang) * 4)},${f(py + Math.sin(a) * l * 0.6 + Math.sin(ang) * 4)} ${f(px + Math.cos(a + s * -0.3) * l)},${f(py + Math.sin(a + s * -0.3) * l)}`);
    }
  }
  out.push(`<path d="${leaflets.join('')}" stroke="${col}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`);
  out.push(`<path d="M${f(x)},${f(y)} Q${f(mx)},${f(my)} ${f(ex)},${f(ey)}" stroke="#3d4a17" stroke-width="2.5" fill="none"/>`);
  return out.join('');
}
const FE = layer('ferns');
function fernClump(x, y, n = 6) {
  const out = [`<ellipse cx="${f(x + 10)}" cy="${f(y + 12)}" rx="55" ry="45" fill="#20140a" opacity="0.25" filter="url(#soft6)"/>`];
  for (let i = 0; i < n; i++) out.push(fern(x, y, rr(70, 110), (i / n) * Math.PI * 2 + rr(-0.3, 0.3)));
  return out.join('');
}
const fernSpots = [[1020, 760], [1880, 760], [1060, 330], [1870, 260], [700, 1300], [2200, 1100], [1950, 1700], [880, 1700], [2330, 650], [610, 560], [2050, 1450], [1150, 1640]];
for (const [x, y] of fernSpots) FE.push(fernClump(x + rr(-30, 30), y + rr(-30, 30), Math.floor(rr(8, 12))));

// ---------- chapel ----------
const CH = layer('chapel');
{
  const { x, y, w, h, t } = chapel;
  const ix = x + t, iy = y + t, iw = w - 2 * t, ih = h - 2 * t;
  // flagstone floor: jittered grid, shared vertices so the stones tile
  const cols = 9, rows = 7, cw = iw / cols, chh = ih / rows;
  const V = [];
  for (let r = 0; r <= rows; r++) { V.push([]); for (let c = 0; c <= cols; c++) {
    const edge = r === 0 || r === rows || c === 0 || c === cols;
    V[r].push([ix + c * cw + (edge ? 0 : rr(-cw * 0.22, cw * 0.22)), iy + r * chh + (edge ? 0 : rr(-chh * 0.22, chh * 0.22))]);
  } }
  CH.push(`<clipPath id="chapelFloor"><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}"/></clipPath>`);
  CH.push(`<g clip-path="url(#chapelFloor)">`);
  CH.push(`<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="#5a4c3c"/>`);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const q = [V[r][c], V[r][c + 1], V[r + 1][c + 1], V[r + 1][c]];
    const cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2;
    const inset = q.map(([a, b]) => [cx + (a - cx) * 0.93, cy + (b - cy) * 0.93]);
    const l = rr(56, 70);
    CH.push(`<path d="${poly(inset)}" fill="${hsl(rr(32, 42), rr(8, 14), l)}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`);
    if (rnd() < 0.25) { // crack
      const a = q[Math.floor(rr(0, 4))], b = q[Math.floor(rr(0, 4))];
      const ax = (a[0] + cx) / 2, ay = (a[1] + cy) / 2;
      const zz = [0.25, 0.5, 0.75].map((k) => `L${f(ax + (cx - ax) * k * 2 + rr(-7, 7))},${f(ay + (cy - ay) * k * 2 + rr(-7, 7))}`).join('');
      CH.push(`<path d="M${f(ax)},${f(ay)} ${zz}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linejoin="bevel"/>`);
    }
  }
  CH.push(`<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="#fff" filter="url(#stoneTex)" opacity="0.5"/>`);
  // moss and leaf litter creeping in at the edges
  for (let i = 0; i < 9; i++) {
    const ex = rnd() < 0.5 ? ix + rr(0, 60) : ix + iw - rr(0, 60), ey = iy + rr(0, ih);
    CH.push(`<path d="${blob(ex, ey, rr(30, 70), rr(25, 55), 0.4, 11)}" fill="#6c7330" opacity="0.6" filter="url(#soft6)"/>`);
  }
  // interior wall shadow (light from NW -> shadow along north and west inner faces)
  CH.push(`<rect x="${ix}" y="${iy}" width="${iw}" height="34" fill="#1a0f05" opacity="0.35" filter="url(#soft6)"/>`);
  CH.push(`<rect x="${ix}" y="${iy}" width="30" height="${ih}" fill="#1a0f05" opacity="0.3" filter="url(#soft6)"/>`);
  // collapsed roof beam
  CH.push(`<g transform="translate(${ix + iw * 0.62},${iy + ih * 0.45}) rotate(-28)"><rect x="-150" y="-13" width="300" height="26" rx="5" fill="#6b4a2c" stroke="${INK}" stroke-width="3"/><path d="M-140,-4 L130,-6 M-120,6 L140,4" stroke="#3f2a18" stroke-width="2"/></g>`);
  CH.push(`</g>`);
  // lectern stump / broken font in the north
  CH.push(stone(ix + iw / 2, iy + 70, 34, { n: 8, irr: 0.05, lit: 70, moss: 0.5 }));
}

// walls: rows of blocks along a segment. gaps = [[from, to]] in local length units (broken sections)
const WL = layer('walls');
const WS = layer('wallShadow');
const wallSegs = [];
function wall(x0, y0, x1, y1, t, gaps = [], ruin = []) {
  const len = dist(x0, y0, x1, y1), ang = Math.atan2(y1 - y0, x1 - x0);
  const ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux;
  let s = 0;
  const pieces = [];
  while (s < len) {
    const bl = Math.min(rr(42, 70), len - s);
    const mid = s + bl / 2;
    const gap = gaps.some(([a, b]) => mid > a && mid < b);
    const low = ruin.some(([a, b]) => mid > a && mid < b);
    if (!gap) pieces.push({ s, bl, low });
    s += bl;
  }
  // wall sections for walls export
  let run = null;
  for (const p of pieces) {
    if (run && Math.abs(run[1] - p.s) < 1) run[1] = p.s + p.bl; else { if (run) wallSegs.push(run.map((v) => [x0 + ux * v, y0 + uy * v])); run = [p.s, p.s + p.bl]; }
  }
  if (run) wallSegs.push(run.map((v) => [x0 + ux * v, y0 + uy * v]));
  for (const { s, bl, low } of pieces) {
    // two courses across the thickness, staggered
    for (const [o, th] of low ? [[0, t]] : [[-t / 4, t / 2], [t / 4, t / 2]]) {
      const ss = s + (o > 0 ? rr(-10, 10) : 0);
      const a = ss + 2, b = Math.min(ss + bl - 2, len);
      const j = () => rr(-2.5, 2.5);
      const c = (u, v) => [x0 + ux * u + nx * v + j(), y0 + uy * u + ny * v + j()];
      const pts = [c(a, o - th / 2 + 2), c(b, o - th / 2 + 2), c(b, o + th / 2 - 2), c(a, o + th / 2 - 2)];
      const lit = low ? rr(50, 58) : rr(60, 70);
      WS.push(`<path d="${poly(pts.map(([p, q]) => [p + (low ? 14 : 30), q + (low ? 16 : 34)]))}" fill="#1a0f05"/>`);
      WL.push(`<path d="${poly(pts)}" fill="${hsl(rr(34, 42), rr(9, 15), lit)}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`);
      // bevel highlight on NW edge
      WL.push(`<path d="M${f(pts[0][0])},${f(pts[0][1])}L${f(pts[1][0])},${f(pts[1][1])}" stroke="#f3ecdc" stroke-width="3" opacity="0.6"/>`);
    }
  }
}
{
  const { x, y, w, h, t } = chapel;
  const c = t / 2;
  wall(x, y + c, x + w, y + c, t, [[300, 380]], [[160, 260], [480, 560]]);           // north wall, small breach
  wall(x + w - c, y, x + w - c, y + h, t, [[250, 330]], [[120, 230]]);               // east wall, breach
  wall(x + w, y + h - c, x, y + h - c, t, [[w - (chapel.doorX - x) - chapel.doorW, w - (chapel.doorX - x)]], [[60, 200]]); // south wall, doorway
  wall(x + c, y + h, x + c, y, t, [], [[200, 330]]);                                  // west wall
}
// tumbled blocks from the breaches
const RB = layer('rubble');
function rubble(cx, cy, n, spread) {
  for (let i = 0; i < n; i++) {
    const x = cx + rr(-spread, spread), y = cy + rr(-spread, spread) * 0.8;
    const bw = rr(26, 48), bh = rr(20, 34), rot = rr(-50, 50);
    RB.push(`<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})"><rect x="${f(-bw / 2 + 8)}" y="${f(-bh / 2 + 10)}" width="${f(bw)}" height="${f(bh)}" fill="#1a0f05" opacity="0.4" filter="url(#soft6)"/><rect x="${f(-bw / 2)}" y="${f(-bh / 2)}" width="${f(bw)}" height="${f(bh)}" rx="3" fill="${hsl(38, 11, rr(60, 72))}" stroke="${INK}" stroke-width="3"/></g>`);
  }
  for (let i = 0; i < n * 2; i++) RB.push(stone(cx + rr(-spread, spread) * 1.2, cy + rr(-spread, spread), rr(6, 13), { noShadow: rnd() < 0.5, sw: 2 }));
}
rubble(chapel.x + 340, chapel.y - 40, 7, 60);
rubble(chapel.x + chapel.w + 60, chapel.y + 290, 8, 70);
rubble(chapel.x - 50, chapel.y + 270, 6, 55);
rubble(chapel.x + 120, chapel.y + chapel.h + 40, 5, 50);
rubble(chapel.x + chapel.w * 0.62, chapel.y + chapel.h * 0.7, 6, 50);

// ---------- standing stones + altar ----------
const SS = layer('standing');
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2 + 0.2;
  const x = ring.cx + Math.cos(a) * ring.r, y = ring.cy + Math.sin(a) * ring.r;
  if (i === 5) { // one has fallen: long slab lying on its side
    SS.push(`<g transform="translate(${f(x + 20)},${f(y + 10)}) rotate(${f(a * 57.3 + 70)})">`);
    SS.push(`<rect x="-62" y="-26" width="134" height="58" rx="10" fill="#1a0f05" opacity="0.4" filter="url(#soft6)" transform="translate(12,14)"/>`);
    SS.push(`<path d="${poly([[-64, -24], [58, -30], [70, 4], [56, 28], [-60, 26], [-70, 0]])}" fill="#8f877a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
    SS.push(`<path d="${poly([[-56, -18], [52, -23], [60, -2], [-58, -4]])}" fill="#b9b1a2"/>`);
    SS.push(`<path d="M-30,-20 L-18,-4 L-26,10 M20,-24 L28,-8" stroke="${INK}" stroke-width="2" fill="none"/>`);
    SS.push(`</g>`);
    continue;
  }
  SS.push(stone(x, y, rr(58, 66), { n: 8, irr: 0.2, hue: 38, sat: 7, lit: 70, moss: 0.8, sw: 5 }));
  // carved rune on the top face
  SS.push(`<path d="M${f(x - 10)},${f(y - 18)} l8,14 l-10,10 M${f(x + 6)},${f(y - 20)} l0,26" stroke="#4a3f33" stroke-width="2.5" fill="none" opacity="0.7"/>`);
}
// altar: stepped base, slab top, crack, offerings
{
  const { cx, cy } = ring;
  SS.push(`<rect x="${cx - 112 + 26}" y="${cy - 112 + 32}" width="224" height="224" fill="#1a0f05" opacity="0.45" filter="url(#soft)"/>`);
  SS.push(`<path d="${poly([[cx - 112, cy - 110], [cx + 110, cy - 113], [cx + 113, cy + 111], [cx - 110, cy + 112]])}" fill="#a39a88" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`);
  SS.push(`<path d="${poly([[cx - 84, cy - 86], [cx + 86, cy - 84], [cx + 84, cy + 84], [cx - 86, cy + 86]])}" fill="#c9c0ad" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
  SS.push(`<rect x="${cx - 84}" y="${cy - 86}" width="170" height="170" fill="#fff" filter="url(#stoneTex)" opacity="0.7"/>`);
  SS.push(`<path d="M${cx - 84},${cy - 30} L${cx - 40},${cy - 18} L${cx - 22},${cy + 20} L${cx + 18},${cy + 26} L${cx + 40},${cy + 70} L${cx + 52},${cy + 84}" stroke="${INK}" stroke-width="3.5" fill="none"/>`);
  SS.push(`<path d="M${cx - 22},${cy + 20} L${cx - 50},${cy + 50}" stroke="${INK}" stroke-width="2.5" fill="none"/>`);
  // old blood/wine stain and candle stubs
  SS.push(`<path d="${blob(cx + 58, cy + 40, 30, 22, 0.5, 10)}" fill="#6b1d14" opacity="0.5"/><path d="${blob(cx + 92, cy + 62, 14, 9, 0.5, 8)}" fill="#6b1d14" opacity="0.45"/>`);
  for (const [dx, dy] of [[-62, -60], [-36, -66], [-60, -32], [-30, -40]]) {
    SS.push(`<path d="${blob(cx + dx + 4, cy + dy + 3, 16, 13, 0.4, 9)}" fill="#e6dcc0" opacity="0.8"/><circle cx="${cx + dx}" cy="${cy + dy}" r="7" fill="#f6efdc" stroke="${INK}" stroke-width="2"/><circle cx="${cx + dx - 2}" cy="${cy + dy - 2}" r="3" fill="#fffbe8"/>`);
  }
  // moss on base corners
  SS.push(`<path d="${blob(cx - 100, cy + 95, 36, 22, 0.4, 9)}" fill="#6f7a2e" opacity="0.85"/>`);
}

// ---------- fallen log bridge ----------
const LG = layer('log');
{
  const lx = 2590, ly = 1690, rot = -52, len = 420, rad = 34;
  LG.push(`<g transform="translate(${lx},${ly}) rotate(${rot})">`);
  LG.push(`<rect x="${-len / 2 + 14}" y="${-rad + 22}" width="${len}" height="${rad * 2}" rx="${rad}" fill="#1a0f05" opacity="0.45" filter="url(#soft6)"/>`);
  LG.push(`<rect x="${-len / 2}" y="${-rad}" width="${len}" height="${rad * 2}" rx="12" fill="#6e4b2b" stroke="${INK}" stroke-width="4"/>`);
  LG.push(`<rect x="${-len / 2 + 6}" y="${-rad + 6}" width="${len - 12}" height="${rad * 0.8}" rx="8" fill="#8a6237"/>`);
  const bark = [];
  for (let i = 0; i < 26; i++) { const x0 = rr(-len / 2 + 30, len / 2 - 40), yy = rr(-rad + 6, rad - 6); bark.push(`M${f(x0)},${f(yy)} q${f(rr(15, 30))},${f(rr(-3, 3))} ${f(rr(30, 60))},${f(rr(-2, 2))}`); }
  LG.push(`<path d="${bark.join('')}" stroke="#3b2614" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);
  // broken root end and cut end with rings
  LG.push(`<ellipse cx="${len / 2 - 4}" cy="0" rx="14" ry="${rad - 2}" fill="#c79a62" stroke="${INK}" stroke-width="3.5"/>`);
  LG.push(`<ellipse cx="${len / 2 - 4}" cy="0" rx="8" ry="${rad - 12}" fill="none" stroke="#8a6237" stroke-width="2"/>`);
  LG.push(`<path d="M${-len / 2},-${rad - 4} l-38,-26 M${-len / 2},0 l-48,4 M${-len / 2},${rad - 6} l-34,30 M${-len / 2 - 20},-14 l-22,-20" stroke="#5a3c22" stroke-width="9" stroke-linecap="round"/>`);
  LG.push(`<path d="${blob(40, -8, 46, 16, 0.4, 10)}" fill="#7a8a2e" opacity="0.85"/><path d="${blob(-110, 10, 30, 12, 0.4, 9)}" fill="#7a8a2e" opacity="0.85"/>`);
  LG.push(`</g>`);
}

// ---------- trees ----------
const TS = layer('treeShadow');
const TR = layer('trees');
const palettes = [
  ['#7a2412', '#b8401c', '#df6a2a', '#f39a45'], // red-orange
  ['#8a3a10', '#c9611e', '#e88f2e', '#f8c25a'], // orange
  ['#7b5212', '#b98422', '#ddb13a', '#f4d86e'], // gold
  ['#4a4d18', '#6d7224', '#8f932f', '#b8b450'], // olive green (still green)
  ['#6b1a12', '#9c2c1a', '#c84826', '#e8773c'], // deep red
];
const trees = [];
function tryTree(x, y, r) {
  for (const t of trees) if (dist(x, y, t.x, t.y) < (r + t.r) * 0.62) return false;
  trees.push({ x, y, r });
  return true;
}
// edge-heavy placement: reject inside the clearing, near the chapel, stream, and path
for (let i = 0; i < 6000 && trees.length < 75; i++) {
  const x = rr(-120, W + 120), y = rr(-120, H + 120), r = rr(110, 210);
  if (inClearing(x, y, -40)) continue;
  if (inChapel(x, y, r * 0.6)) continue;
  if (streamDist(x, y) < r * 0.5 + 90) continue;
  let nearPath = false;
  for (let k = 0; k < pathPts.length - 3; k++) if (dist(x, y, pathPts[k][0], pathPts[k][1]) < r * 0.5 + 60) nearPath = true;
  if (nearPath) continue;
  tryTree(x, y, r);
}
trees.sort((a, b) => a.y - b.y);
for (const t of trees) {
  const pal = pick(rnd() < 0.18 ? [palettes[3]] : [palettes[0], palettes[1], palettes[2], palettes[4], palettes[1]]);
  const lobes = [];
  const nl = Math.floor(rr(6, 10));
  for (let i = 0; i < nl; i++) {
    const a = rr(0, 6.28), d = rr(0, t.r * 0.45);
    lobes.push([t.x + Math.cos(a) * d, t.y + Math.sin(a) * d, t.r * rr(0.45, 0.62)]);
  }
  lobes.push([t.x, t.y, t.r * 0.62]);
  const lobePath = (k, dx = 0, dy = 0) => lobes.map(([x, y, r]) => blob(x + dx, y + dy, r * k, r * k, 0.18, 12)).join('');
  // cast shadow on the ground, to the SE
  TS.push(`<path d="${lobePath(1, t.r * 0.32, t.r * 0.42)}" fill="#1a0f05" opacity="0.42" filter="url(#soft)"/>`);
  const g = [];
  g.push(`<g filter="url(#leafy)">`);
  g.push(`<path d="${lobePath(1.04)}" fill="${INK}"/>`);           // ink outline
  g.push(`<path d="${lobePath(0.98)}" fill="${pal[0]}"/>`);         // shade
  g.push(`<path d="${lobePath(0.8, -t.r * 0.08, -t.r * 0.1)}" fill="${pal[1]}"/>`);
  g.push(`<path d="${lobePath(0.55, -t.r * 0.16, -t.r * 0.2)}" fill="${pal[2]}"/>`);
  // sunlit clumps
  for (let i = 0; i < 7; i++) {
    const [lx, ly, lr] = pick(lobes);
    g.push(`<path d="${blob(lx - lr * 0.35 + rr(-15, 15), ly - lr * 0.4 + rr(-15, 15), lr * rr(0.18, 0.32), lr * rr(0.15, 0.28), 0.3, 9)}" fill="${pal[3]}" opacity="0.9"/>`);
  }
  g.push(`</g>`);
  // inner leaf-cluster ink strokes for texture
  // sub-clumps: small leaf clusters with a dark lower-right rim, so the canopy reads as many bunches
  const clumps = [];
  for (let i = 0; i < Math.round(t.r / 9); i++) {
    const a = rr(0, 6.28), d = Math.sqrt(rnd()) * t.r * 0.78, x = t.x + Math.cos(a) * d, y = t.y + Math.sin(a) * d;
    const cr = rr(18, 32);
    const lit = d < t.r * 0.45 && (x - t.x) + (y - t.y) < 0;
    clumps.push(`<path d="M${f(x - cr)},${f(y)} A${f(cr)},${f(cr)} 0 0 0 ${f(x + cr * 0.7)},${f(y - cr * 0.7)}" stroke="${lit ? pal[1] : pal[0]}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>`);
  }
  g.push(`<g filter="url(#leafy)">${clumps.join('')}</g>`);
  // birch branches peeking through some canopies
  if (false) {
    const br = [];
    for (let i = 0; i < 3; i++) { const a = rr(0, 6.28); br.push(`M${f(t.x)},${f(t.y)} L${f(t.x + Math.cos(a) * t.r * 0.55)},${f(t.y + Math.sin(a) * t.r * 0.55)}`); }
    g.push(`<path d="${br.join('')}" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity="0.5"/><path d="${br.join('')}" stroke="#e9e3d6" stroke-width="3.5" opacity="0.6" stroke-linecap="round"/>`);
  }
  TR.push(g.join(''));
}

// ---------- forest-floor darkness around trees ----------
const AO = layer('ao');
for (const t of trees) AO.push(`<circle cx="${f(t.x)}" cy="${f(t.y)}" r="${f(t.r * 1.25)}" fill="#1a0f05" opacity="0.18" filter="url(#soft40)"/>`);
// ---------- lighting ----------
const LT = layer('light');
// sunbeams / dappled light in the clearing
for (let i = 0; i < 9; i++) {
  LT.push(`<path d="${blob(rr(900, 2100), rr(700, 1600), rr(120, 260), rr(80, 180), 0.3)}" fill="#fff1c4" opacity="${f(rr(0.08, 0.16))}" filter="url(#soft40)" style="mix-blend-mode:screen"/>`);
}
LT.push(`<rect width="${W}" height="${H}" fill="url(#sun)" style="mix-blend-mode:screen"/>`);
LT.push(`<rect width="${W}" height="${H}" fill="url(#vignette)"/>`);
// subtle warm grade
LT.push(`<rect width="${W}" height="${H}" fill="#ffb060" opacity="0.06" style="mix-blend-mode:soft-light"/>`);

// ---------- assemble ----------
const order = ['ground', 'ringPave', 'stream', 'rocks', 'scatter', 'ferns', 'chapel', 'wallShadow', 'walls', 'rubble', 'standing', 'log', 'ao', 'treeShadow', 'trees', 'light'];
const body = order.map((k) => `<g id="${k}"${k === 'walls' || k === 'standing' || k === 'rubble' ? ' filter="url(#rough)"' : k === 'wallShadow' ? ' filter="url(#soft6)" opacity="0.85"' : ''}>${(L[k] || []).join('\n')}</g>`).join('\n');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join('')}</defs>${body}</svg>`;
fs.writeFileSync(OUT + '/forest-shrine.svg', svg);
fs.writeFileSync(OUT + '/forest-shrine-walls.json', JSON.stringify({ walls: wallSegs.map(([a, b]) => [a.map(Math.round), b.map(Math.round)]), doors: [], lights: [] }));  // daylight: no light sources
console.log('svg bytes', svg.length, 'trees', trees.length, 'wall segments', wallSegs.length);
