// Export a generated map as a Universal VTT file (.dd2vtt): the map image plus its walls, doors and
// lights in one file, readable by most VTTs. For Foundry, prefer export-foundry.js: UVTT has no
// secret doors, see-through doors or door state, so those come in as plain closed doors.
//
// usage: node export-uvtt.js <map-name> [px-per-square=140]
//   reads  output/<map-name>.svg and output/<map-name>-walls.json (run maps/<map-name>.js first)
//   writes output/<map-name>-<px>px.png (via render.sh) and output/<map-name>.dd2vtt
//
// What Foundry's dd-import does with each field (checked against its ddimport.js, Oct 2026):
//   line_of_sight  -> walls. Lists of {x, y} points in squares; touching ends get joined.
//   portals        -> closed: true becomes a normal openable door (it has no secret-door type).
//   lights         -> dim radius = range x 5 ft, bright = half, colour "AARRGGBB" (alpha byte dropped).
//   objects_line_of_sight is ignored by dd-import, so everything solid goes in line_of_sight.
const fs = require('fs');
const path = require('path');
const { OUT, loadMap, chainWalls, doorSegments, renderPng } = require('./lib/map-data');

const [name, pxArg] = process.argv.slice(2);
if (!name) { console.error('usage: node export-uvtt.js <map-name> [px-per-square=140]'); process.exit(1); }
const PX = Number(pxArg || 140);
const map = loadMap(name);

const sq = ([x, y]) => ({ x: x / 100, y: y / 100 });
const lineOfSight = chainWalls(map.walls).map((pts) => pts.map(sq));

const portals = doorSegments(map.doors).map(({ a, b, horiz, kind }) => {
  const [pa, pb] = [sq(a), sq(b)];
  return {
    position: { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 },
    bounds: [pa, pb],
    rotation: horiz ? 0 : Math.PI / 2,
    closed: true,
    freestanding: false,
    ...(kind !== 'normal' ? { kind } : {}),   // extra field for us; importers ignore it
  };
});

const lights = map.lights.map((l) => ({
  position: sq([l.x, l.y]),
  range: l.range,
  intensity: l.intensity ?? 1,
  color: l.color ?? 'ffffa040',
  shadows: true,
}));

const pngPath = renderPng(map, PX);
const uvtt = {
  format: 0.3,
  software: 'map-maker',
  resolution: { map_origin: { x: 0, y: 0 }, map_size: { x: map.cols, y: map.rows }, pixels_per_grid: PX },
  line_of_sight: lineOfSight,
  objects_line_of_sight: [],
  portals,
  environment: { baked_lighting: true, ambient_light: 'ffffffff' },
  lights,
  image: fs.readFileSync(pngPath).toString('base64'),
};
const outPath = path.join(OUT, `${name}.dd2vtt`);
fs.writeFileSync(outPath, JSON.stringify(uvtt));

const secret = map.doors.filter((d) => d[4] === 'secret').length;
console.log(outPath);
console.log(`  ${map.cols}x${map.rows} squares at ${PX}px, ${map.walls.length} wall segments -> ${lineOfSight.length} wall lines, ` +
  `${portals.length} doors${secret ? ` (${secret} secret: switch to Secret in Foundry after import)` : ''}, ${lights.length} lights, ` +
  `${(fs.statSync(outPath).size / 1048576).toFixed(1)} MB`);
