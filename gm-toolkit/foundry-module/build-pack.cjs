const {ClassicLevel} = require("/home/nhanp/foundryvtt/resources/app/node_modules/classic-level");
const fs = require("fs");
// Usage: node gm-toolkit/foundry-module/build-pack.cjs
// Rebuilds ~/foundrydata/Data/modules/pax-gm-toolkit from foundry-macros/gm/*.js.
// Stop Foundry first (it locks the pack), or restart it afterwards.
const path = require("path");
const repo = path.resolve(__dirname, "../..");
const modDir = path.join(process.env.HOME, "foundrydata/Data/modules/pax-gm-toolkit");
fs.mkdirSync(modDir, {recursive:true});
fs.copyFileSync(path.join(__dirname, "module.json"), path.join(modDir, "module.json"));
const dbPath = path.join(modDir, "packs/gm-macros");
const id = () => Array.from({length:16},()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random()*62)]).join("");
const macros = [
  ["Fade out music", "fade-out-music.js", "icons/svg/sound-off.svg"],
  ["Ask for a Check", "ask-for-a-check.js", "icons/sundries/gaming/dice-runed-brown.webp"],
];
(async () => {
  fs.rmSync(dbPath, {recursive:true, force:true});
  const db = new ClassicLevel(dbPath, {valueEncoding:"json"});
  let sort = 0;
  for (const [name, file, img] of macros) {
    const _id = id();
    await db.put(`!macros!${_id}`, {_id, name, type:"script", img, scope:"global", author:null, folder:null, sort:(sort+=100000),
      command: fs.readFileSync(`${repo}/foundry-macros/gm/${file}`, "utf8"), ownership:{default:0}, flags:{},
      _stats:{coreVersion:"14.367", systemId:null, systemVersion:null, createdTime:Date.now(), modifiedTime:Date.now(), lastModifiedBy:null}});
  }
  await db.close();
  console.log("wrote", macros.length, "macros to", dbPath);
})();
