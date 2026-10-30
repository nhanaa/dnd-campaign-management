/**
 * Fade out music — smoothly end whatever is playing, for everyone
 * ================================================================
 *
 * Fades every playing playlist sound out over FADE_MS, then stops it.
 *
 * Why this exists: looping battle tracks are split into an intro + a loop, and
 * both sounds have fade = 0 so the hand-off from intro to loop doesn't dip
 * (Foundry fades a sound IN from silence whenever it starts if fade > 0). The
 * catch is that pressing Stop on a fade-0 sound cuts it dead. This macro sets a
 * temporary fade on the playing sounds, stops them (every client fades), then
 * restores the original fade values.
 *
 * GM only. Works on any playlist.
 */

const FADE_MS = 4000;

const lists = game.playlists.filter(p => p.playing);
if (!lists.length) return ui.notifications.info("No music is playing.");

const restore = [];
for (const pl of lists) {
  const playing = pl.sounds.filter(s => s.playing);
  restore.push([pl, pl.sounds.map(s => ({_id: s.id, fade: s.fade}))]);
  await pl.updateEmbeddedDocuments("PlaylistSound", playing.map(s => ({_id: s.id, fade: FADE_MS})));
  await pl.stopAll();
}
setTimeout(() => restore.forEach(([pl, u]) => pl.updateEmbeddedDocuments("PlaylistSound", u)), FADE_MS + 500);
