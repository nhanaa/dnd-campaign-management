/**
 * Chat Recorder — keeps your own copy of every chat message, so the session
 * log survives the GM clearing chat, a world reset, or Foundry pruning.
 * ==========================================================================
 *
 * WHY: foundry-export.js can only export what `game.messages` still holds at
 * session end. Some sessions lose it (chat cleared or deleted, messages gone
 * after a reconnect). Everything the export reads lives on the message itself,
 * so a copy taken when the message arrives is as good as the original.
 *
 * HOW: click this macro once per session (re-clicking is safe — it replaces
 * its hooks, never stacks them). It
 *   - saves every message already loaded (backfill),
 *   - saves each new message, and again whenever it's updated (Toolbelt saves
 *     and damage-applied / reverted flags arrive AFTER the message is created),
 *   - on delete, KEEPS the copy and stamps it `deletedAt`.
 *
 * WHERE: IndexedDB in your own client (FLC), one database per world:
 * `chat-recorder:<world id>`. Nothing is written to the server, and the GM
 * doesn't need to run anything. foundry-export.js merges this store with
 * `game.messages` automatically.
 *
 * LIMITS: only messages your client received (no GM blind rolls), and only
 * while the recorder is running — anything sent and deleted before you
 * clicked it is gone. The copy lives on this PC only.
 *
 * CONSOLE CHECKS (F12):
 *   await globalThis.__chatRecorder.count()      // messages stored for this world
 *   await globalThis.__chatRecorder.deleted()    // how many the server has since lost
 */

(async () => {
  const KEEP_DAYS = 180;              // older copies are pruned on each start
  const DB_NAME = `chat-recorder:${game.world.id}`;
  const STORE = "messages";

  const open = () => new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: "_id" });
      store.createIndex("timestamp", "timestamp");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const state = (globalThis.__chatRecorder ??= { hookIds: [] });
  for (const [event, id] of state.hookIds) Hooks.off(event, id);
  state.hookIds = [];
  state.db?.close();
  state.db = await open();

  const tx = (mode, fn) => new Promise((resolve, reject) => {
    const t = state.db.transaction(STORE, mode);
    const out = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(out?.result ?? out);
    t.onerror = () => reject(t.error);
  });

  const record = (message, extra = {}) => ({
    _id: message.id,
    timestamp: message.timestamp,
    savedAt: Date.now(),
    data: message.toObject(),
    ...extra,
  });

  const save = messages => tx("readwrite", store => {
    for (const m of messages) if (m.id) store.put(record(m));
  }).catch(err => console.error("Chat Recorder | save failed", err));

  // A deleted message keeps its last saved data; only the stamp is added.
  const markDeleted = message => tx("readwrite", store => {
    const req = store.get(message.id);
    req.onsuccess = () => {
      const prev = req.result ?? record(message);
      store.put({ ...prev, deletedAt: Date.now() });
    };
  }).catch(err => console.error("Chat Recorder | delete-mark failed", err));

  const on = (event, fn) => state.hookIds.push([event, Hooks.on(event, fn)]);
  on("createChatMessage", m => save([m]));
  on("updateChatMessage", m => save([m]));
  on("deleteChatMessage", m => markDeleted(m));

  // Prune, then backfill whatever the client holds right now.
  const cutoff = Date.now() - KEEP_DAYS * 86400e3;
  await tx("readwrite", store => {
    const req = store.index("timestamp").openCursor(IDBKeyRange.upperBound(cutoff));
    req.onsuccess = () => { const c = req.result; if (c) { c.delete(); c.continue(); } };
  });
  await save(game.messages.contents);

  state.count = () => tx("readonly", store => store.count());
  state.deleted = async () => {
    const all = await tx("readonly", store => store.getAll());
    return all.filter(r => r.deletedAt || !game.messages.has(r._id)).length;
  };

  const total = await state.count();
  ui.notifications.info(`Chat Recorder on — ${total} messages saved for this world.`);
})();
