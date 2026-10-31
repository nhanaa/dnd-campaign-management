// Shared loading for the exporters: map size, walls (joined into long lines), doors and lights,
// all read from output/<map>.svg and output/<map>-walls.json. Units here are SVG units
// (100 per 5-ft square); each exporter converts to what its target wants.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'output');

function loadMap(name) {
  const svgPath = path.join(OUT, `${name}.svg`);
  const wallsPath = path.join(OUT, `${name}-walls.json`);
  for (const p of [svgPath, wallsPath]) {
    if (!fs.existsSync(p)) throw new Error(`missing ${p} (run: node maps/${name}.js)`);
  }
  const vb = fs.readFileSync(svgPath, 'utf8').slice(0, 2000).match(/viewBox="0 0 (\d+) (\d+)"/);
  const width = Number(vb[1]), height = Number(vb[2]);
  // Older scripts wrote a bare array of wall segments; newer ones write {walls, doors, lights}.
  const data = JSON.parse(fs.readFileSync(wallsPath, 'utf8'));
  const { walls = [], doors = [], lights = [] } = Array.isArray(data) ? { walls: data } : data;
  return { name, svgPath, width, height, cols: width / 100, rows: height / 100, walls, doors, lights };
}

// Join wall segments that share endpoints into polylines and drop points in the middle of straight
// runs, so the VTT gets a few long walls instead of many short ones.
function chainWalls(segs) {
  const key = ([x, y]) => `${x},${y}`;
  const adj = new Map();
  segs.forEach(([a, b], i) => {
    for (const p of [a, b]) { if (!adj.has(key(p))) adj.set(key(p), []); adj.get(key(p)).push(i); }
  });
  const used = new Array(segs.length).fill(false);
  const lines = [];
  const walk = (start, i) => {
    const pts = [start];
    let at = start;
    while (i !== undefined) {
      used[i] = true;
      const [a, b] = segs[i];
      at = key(a) === key(at) ? b : a;
      pts.push(at);
      i = (adj.get(key(at)) || []).find((j) => !used[j]);
    }
    return pts;
  };
  // Open chains first (start at points used by exactly one segment), then closed loops.
  for (const [k, list] of adj) {
    if (list.length !== 1 || used[list[0]]) continue;
    lines.push(walk(k.split(',').map(Number), list[0]));
  }
  segs.forEach((s, i) => { if (!used[i]) lines.push(walk(s[0], i)); });
  return lines.map((pts) => pts.filter((p, i) => {
    if (i === 0 || i === pts.length - 1) return true;
    const [a, b] = [pts[i - 1], pts[i + 1]];
    return (p[0] - a[0]) * (b[1] - p[1]) !== (p[1] - a[1]) * (b[0] - p[0]);   // keep corners only
  }));
}

// Doors: [x, y, horizontal, length, kind] in squares along a cell edge -> endpoints in SVG units.
function doorSegments(doors) {
  return doors.map(([x, y, horiz, n = 1, kind = 'normal']) => ({
    a: [x * 100, y * 100],
    b: horiz ? [(x + n) * 100, y * 100] : [x * 100, (y + n) * 100],
    horiz, kind,
  }));
}

// Render the map PNG at px-per-square with render.sh; returns the PNG path.
function renderPng(map, px) {
  const pngPath = path.join(OUT, `${map.name}-${px}px.png`);
  execFileSync(path.join(ROOT, 'render.sh'), [map.svgPath, String(px), pngPath], { stdio: 'inherit' });
  return pngPath;
}

module.exports = { ROOT, OUT, loadMap, chainWalls, doorSegments, renderPng };
