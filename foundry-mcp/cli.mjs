#!/usr/bin/env node
// Command-line front end to the same operations the MCP server exposes.
//   node cli.mjs status
//   node cli.mjs actor "Bai Feng"
//   node cli.mjs import-pathbuilder build.json [--replace] [--name "X"]
//   node cli.mjs script 'return game.actors.size'

import fs from "node:fs";
import { getActor, importPathbuilder, runScript, shutdown, status } from "./lib.mjs";

const [cmd, ...rest] = process.argv.slice(2);
const flag = (f) => rest.includes(f);
const opt = (f) => { const i = rest.indexOf(f); return i >= 0 ? rest[i + 1] : undefined; };

let out;
try {
  if (cmd === "status") out = await status();
  else if (cmd === "actor") out = await getActor(rest[0]);
  else if (cmd === "import-pathbuilder") out = await importPathbuilder(fs.readFileSync(rest[0], "utf8"), { replace: flag("--replace"), name: opt("--name"), answers: Object.fromEntries(rest.flatMap((r, i) => rest[i - 1] === "--answer" ? [r.split("=")] : [])) });
  else if (cmd === "script") out = await runScript(rest[0]);
  else { console.error("usage: status | actor <name> | import-pathbuilder <file> [--replace] [--name N] [--answer 'Prompt Item=Choice' ...] | script <code>"); process.exitCode = 2; }
  if (out !== undefined) console.log(JSON.stringify(out, null, 2));
} catch (e) {
  console.error(e?.stack ?? e); process.exitCode = 1;
} finally {
  await shutdown();
}
