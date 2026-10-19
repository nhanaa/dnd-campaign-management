#!/usr/bin/env node
// MCP server exposing a local Foundry VTT world (driven through a headless GM client).
// Local test worlds only — never point this at a hosted game you don't run.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { addItems, getActor, importPathbuilder, runScript, runWithPrompts, pageFn, shutdown, status } from "./lib.mjs";

const server = new McpServer({ name: "foundry", version: "0.1.0" });
const json = (v) => ({ content: [{ type: "text", text: JSON.stringify(v, null, 2) }] });
const safe = (fn) => async (args) => {
  try { return json(await fn(args)); }
  catch (e) { return { isError: true, content: [{ type: "text", text: String(e?.stack ?? e) }] }; }
};

server.tool("foundry_status",
  "Start the local Foundry server if needed, log in headlessly as the GM, and report world, system, variant rules and actors.",
  {}, safe(() => status()));

server.tool("foundry_get_actor",
  "Read an actor back as a compact summary (ABC, attributes, HP/AC/saves, skills, feats with slot, gear, spells).",
  { actor: z.string().describe("Actor name or id") }, safe(({ actor }) => getActor(actor)));

server.tool("foundry_add_items",
  "Add compendium items (feats, equipment, spells, features) to an actor in order. PF2e choice prompts are answered from `answers` (keyed by the prompting item's name, value = choice label); unanswered prompts are cancelled and reported instead of hanging.",
  {
    actor: z.string(),
    items: z.array(z.object({
      name: z.string(),
      pack: z.string().optional().describe("e.g. pf2e.feats-srd; searched across common packs if omitted"),
      location: z.string().nullable().optional().describe("feat slot, e.g. class-4, skill-2, ancestry-1, general-3, archetype-2; null = bonus feat"),
      system: z.record(z.any()).optional().describe("merged into the item's system data"),
      answers: z.record(z.string()).optional(),
    })),
    answers: z.record(z.string()).optional(),
    timeoutMs: z.number().optional(),
  },
  safe(({ actor, items, answers, timeoutMs }) => addItems(actor, items, { answers, timeoutMs })));

server.tool("foundry_import_pathbuilder",
  "Create a PF2e character from a Pathbuilder 2e JSON export (ABC, level, attributes in manual mode, feats into slots, skills, lores, weapons/armor with runes, coins, prepared spells).",
  {
    json: z.union([z.string(), z.record(z.any())]).describe("The Pathbuilder export, as a JSON string or object"),
    name: z.string().optional(),
    replace: z.boolean().optional().describe("Delete an existing actor with the same name first"),
    answers: z.record(z.string()).optional().describe("Extra prompt answers, e.g. {\"Deity (Champion)\": \"Shizuru\"}"),
  },
  safe(({ json, name, replace, answers }) => importPathbuilder(json, { name, replace, answers })));

server.tool("foundry_update_actor",
  "Apply a Foundry update object to an actor (dot-notation keys allowed, e.g. {\"system.details.level.value\": 9}).",
  { actor: z.string(), data: z.record(z.any()) },
  safe(({ actor, data }) => runWithPrompts(pageFn(`const a = H.actor(args.actor); await a.update(args.data); return H.summary(a);`), { actor, data })));

server.tool("foundry_delete_items",
  "Delete embedded items from an actor by exact name (all matches).",
  { actor: z.string(), names: z.array(z.string()) },
  safe(({ actor, names }) => runWithPrompts(pageFn(`const a = H.actor(args.actor); const ids = a.items.filter(i => args.names.includes(i.name)).map(i => i.id); await a.deleteEmbeddedDocuments("Item", ids); return { deleted: ids.length };`), { actor, names })));

server.tool("foundry_run_script",
  "Escape hatch: run an async JavaScript function body inside the logged-in Foundry page (has `game`, `foundry`, `ui`). Return a JSON-serialisable value.",
  { code: z.string() }, safe(({ code }) => runScript(code)));

process.on("SIGINT", async () => { await shutdown(); process.exit(0); });
process.on("SIGTERM", async () => { await shutdown(); process.exit(0); });

await server.connect(new StdioServerTransport());
