// Export a generated map as a native Foundry VTT scene: walls, every door type (including secret
// doors), lights and the background image, imported with Foundry's own "Import Data". No modules.
//
// usage: node export-foundry.js <map-name> [px-per-square=140] [--dark 0..1] [--name "Scene Name"]
//                               [--data-dir ~/foundrydata/Data]
//   reads  output/<map-name>.svg and output/<map-name>-walls.json (run maps/<map-name>.js first)
//   writes output/<map-name>.foundry-scene.json
//   copies the rendered map to <data-dir>/map-maker/<map-name>-<px>px.webp (the scene points there)
//
// Import: Foundry > Scenes sidebar > Create Scene (any name) > right-click it > Import Data >
// pick the .foundry-scene.json. The scene takes the file's name, size, grid, walls, doors, lights
// and background. The image must already be in the data folder of the Foundry that imports it.
//
// Door kinds (from the walls JSON) and what they become:
//   normal, great -> Door, starts OPEN (the art draws them standing open)
//   secret        -> Secret door (GM-only), closed
//   portcullis    -> Door, closed, sight/light/sound pass through the bars
// Lighting: the maps have light and dark painted in, so scenes import fully lit (global light on).
// --dark 0.6 turns global light off and sets darkness, so only the map's light sources light it.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { OUT, loadMap, chainWalls, doorSegments, renderPng } = require('./lib/map-data');

const args = process.argv.slice(2);
const opt = (flag, def) => { const i = args.indexOf(flag); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const dark = opt('--dark', null);
const sceneName = opt('--name', null);
const dataDir = opt('--data-dir', path.join(os.homedir(), 'foundrydata', 'Data'));
const [name, pxArg] = args;
if (!name) { console.error('usage: node export-foundry.js <map-name> [px-per-square=140] [--dark 0..1] [--name "..."] [--data-dir path]'); process.exit(1); }
const PX = Number(pxArg || 140);
const map = loadMap(name);
const k = PX / 100;                       // SVG units -> scene pixels (padding 0, so no offset)
const px = ([x, y]) => [Math.round(x * k), Math.round(y * k)];

// Walls: one Foundry wall per segment of each joined wall line.
const SENSE = { NONE: 0, NORMAL: 20 };
const walls = [];
for (const line of chainWalls(map.walls)) {
  for (let i = 0; i < line.length - 1; i++) walls.push({ c: [...px(line[i]), ...px(line[i + 1])] });
}

// Doors.
const DOOR = { normal: { door: 1, ds: 1 }, great: { door: 1, ds: 1 }, secret: { door: 2, ds: 0 }, portcullis: { door: 1, ds: 0, seeThrough: true } };
for (const { a, b, kind } of doorSegments(map.doors)) {
  const t = DOOR[kind] ?? DOOR.normal;
  const sense = t.seeThrough ? SENSE.NONE : SENSE.NORMAL;
  walls.push({ c: [...px(a), ...px(b)], door: t.door, ds: t.ds, move: SENSE.NORMAL, sight: sense, light: sense, sound: sense,
    flags: { 'map-maker': { kind } } });
}

// Lights: range is the dim radius in squares; bright is half. Feet = squares x 5.
// Kept faint (alpha 0.1, luminosity 0.2): the art already paints each glow, and Foundry's default
// strength stacks on top of it and bleaches bright spots like the keep's arcane ring.
const lights = map.lights.map((l) => ({
  x: Math.round(l.x * k), y: Math.round(l.y * k),
  config: {
    dim: l.range * 5, bright: l.range * 2.5,
    color: '#' + (l.color ?? 'ffffa040').slice(2),
    alpha: 0.1,
    luminosity: 0.2,
    animation: { type: l.anim ?? 'torch', speed: 3, intensity: 3, reverse: false },
  },
}));

// Image: render, then copy into Foundry's data folder (WebP if ffmpeg is available, else PNG).
const pngPath = renderPng(map, PX);
const relDir = 'map-maker';
fs.mkdirSync(path.join(dataDir, relDir), { recursive: true });
let imgRel = `${relDir}/${name}-${PX}px.webp`;
try {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', pngPath, '-c:v', 'libwebp', '-quality', '90', path.join(dataDir, imgRel)]);
} catch {
  imgRel = `${relDir}/${name}-${PX}px.png`;
  fs.copyFileSync(pngPath, path.join(dataDir, imgRel));
}

const title = sceneName ?? name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const scene = {
  name: title,
  width: map.width * k,
  height: map.height * k,
  padding: 0,
  grid: { type: 1, size: PX, distance: 5, units: 'ft' },
  // v14 keeps the background on the scene's level, but Import Data still migrates the old top-level
  // `background` into that level and blanks the level's src when it is missing, so set both.
  background: { src: imgRel },
  levels: [{ _id: 'defaultLevel0000', name: title, background: { src: imgRel } }],
  tokenVision: true,
  environment: dark === null
    ? { darknessLevel: 0, globalLight: { enabled: true } }
    : { darknessLevel: Number(dark), globalLight: { enabled: false } },
  walls,
  lights,
  flags: { 'map-maker': { map: name, pxPerSquare: PX } },
};
const outPath = path.join(OUT, `${name}.foundry-scene.json`);
fs.writeFileSync(outPath, JSON.stringify(scene, null, 1));

const kinds = map.doors.reduce((m, d) => ((m[d[4] ?? 'normal'] = (m[d[4] ?? 'normal'] || 0) + 1), m), {});
console.log(outPath);
console.log(`  "${title}": ${map.cols}x${map.rows} squares at ${PX}px, ${walls.length - map.doors.length} walls, ` +
  `${map.doors.length} doors ${JSON.stringify(kinds)}, ${lights.length} lights, ${dark === null ? 'lit' : `darkness ${dark}`}`);
console.log(`  image -> ${path.join(dataDir, imgRel)} (${(fs.statSync(path.join(dataDir, imgRel)).size / 1048576).toFixed(1)} MB)`);
