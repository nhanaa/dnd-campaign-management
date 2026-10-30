"""
loop_tool.py — turn a soundtrack file into Foundry-ready, seamlessly looping OGGs.

Workflow (see gm-toolkit/README.md, "Music"):
  1. analyze  : length, silence at the ends, loudness, and a loudness envelope
                (shows the intro swell, breaks, and where the composer's fade starts)
  2. find     : rank loop points (A = loop start, B = loop end) by how alike the
                music sounds around them (pitch content + rhythm)
  3. refine   : snap A/B onto drum hits and score the seam against the track's
                own beat-to-beat changes
  4. build    : write <name>-1-intro.ogg (plays once) + <name>-2-loop.ogg
                (repeats) + a seam preview MP3, all at the same loudness
  simple      : one-shot tracks (no loop): trim silence, normalize, convert

Needs ffmpeg on PATH and numpy + scipy. On this machine:
  PY=dnd-transcription/.venv/bin/python
  $PY -I gm-toolkit/music/loop_tool.py analyze "track.mp3"

Times are in seconds on the ORIGINAL file's timeline.
"""
import argparse, json, re, subprocess, sys, tempfile, wave, os
import numpy as np
from scipy.signal import stft

SR = 44100


def decode(path, channels=1):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", str(channels), "-ar", str(SR),
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32)
    return x.reshape(-1, channels) if channels > 1 else x


def lufs(path):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=framelog=quiet",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"^\s+I:\s+(-?[\d.]+) LUFS", out, re.M)
    return float(m[-1]) if m else None


def db(s):
    return 20 * np.log10(np.sqrt(np.mean(s ** 2)) + 1e-9)


def onset_env(x, hop=110):
    f, t, Z = stft(x, fs=SR, nperseg=1024, noverlap=1024 - hop)
    M = np.log1p(np.abs(Z) * 100)
    on = np.maximum(0, np.diff(M, axis=1, prepend=M[:, :1])).sum(0)
    return (on - on.mean()) / (on.std() + 1e-9), SR / hop


def features(x, hop=441):
    """Chroma (pitch classes) + normalized onset strength at 100 frames/s."""
    f, t, Z = stft(x, fs=SR, nperseg=4096, noverlap=4096 - hop)
    P = np.abs(Z) ** 2
    fr = f[1:]
    pc = np.round(12 * np.log2(fr / 440)) % 12
    band = (fr > 55) & (fr < 4000)
    C = np.stack([P[1:][(pc == k) & band].sum(0) for k in range(12)])
    C = np.log1p(C * 1e3)
    C /= np.linalg.norm(C, axis=0) + 1e-9
    M = np.log1p(np.abs(Z) * 100)
    on = np.maximum(0, np.diff(M, axis=1, prepend=M[:, :1])).sum(0)
    on = (on - on.mean()) / (on.std() + 1e-9)
    return C, on, SR / hop


def seam_jolt(x, a, b, xf_ms=30):
    """Biggest spectral change across the splice x[..b] -> x[a..], vs. the track's normal changes."""
    def frames(sig):
        f, t, Z = stft(sig, fs=SR, nperseg=2048, noverlap=2048 - 441)
        return np.log1p(np.abs(Z) * 100)
    a, b = int(a * SR), int(b * SR)
    xf = max(1, int(xf_ms / 1000 * SR))
    r = np.linspace(0, 1, xf)
    head = x[a:a + SR].copy()
    head[:xf] = x[a:a + xf] * r + x[b:b + xf] * (1 - r)
    d = np.linalg.norm(np.diff(frames(np.concatenate([x[b - SR:b], head])), axis=1), axis=0)
    m = SR // 441
    return d[m - 8:m + 40].max()


def cmd_analyze(a):
    x = decode(a.file)
    dur = len(x) / SR
    print(f"duration {dur:.2f}s   loudness {lufs(a.file)} LUFS")
    lead = np.argmax(np.abs(x) > 10 ** (-50 / 20)) / SR
    tail = dur - np.argmax(np.abs(x[::-1]) > 10 ** (-50 / 20)) / SR
    print(f"sound starts {lead:.2f}s, ends {tail:.2f}s (below -50 dB outside that)")
    hop = SR // 2
    rows = [db(x[i:i + hop]) for i in range(0, len(x) - hop, hop)]
    print("loudness envelope (dB per 0.5 s):")
    for i in range(0, len(rows), 4):
        row = rows[i:i + 4]
        print(f"{i * 0.5:7.1f}s " + " ".join(f"{v:6.1f}" for v in row) + "  " + "#" * int(max(0, (max(row) + 50) / 1.5)))
    env, fps = onset_env(x)
    lo, hi = int(fps * 60 / 200), int(fps * 60 / 60)
    body = env[int(len(env) * 0.15):int(len(env) * 0.85)]
    ac = np.correlate(body, body, "full")[len(body) - 1:]
    k = lo + ac[lo:hi].argmax()
    print(f"tempo estimate ~{60 * fps / k:.1f} BPM (beat {k / fps:.3f}s)")


def cmd_find(a):
    x = decode(a.file)
    C, on, fps = features(x)
    w = int(4 * fps)
    rows = []
    a_vals = [a.a] if a.a is not None else np.arange(a.a_range[0], a.a_range[1], 0.02)
    for A in a_vals:
        ia = int(A * fps)
        for ib in range(int(a.b_range[0] * fps), int(a.b_range[1] * fps), 2):
            post_c = np.mean(np.sum(C[:, ia:ia + w] * C[:, ib:ib + w], 0))
            post_r = np.dot(on[ia:ia + w], on[ib:ib + w]) / w
            if a.mode == "post":  # music AFTER B sounds like music after A (track repeats itself / continues)
                s = 0.5 * post_c + 0.5 * post_r
            else:                 # music leading INTO B sounds like music leading into A
                pre_c = np.mean(np.sum(C[:, ia - w:ia] * C[:, ib - w:ib], 0))
                pre_r = np.dot(on[ia - w:ia], on[ib - w:ib]) / w
                s = 0.4 * pre_c + 0.4 * pre_r + 0.2 * post_c
            rows.append((s, A, ib / fps, post_c, post_r))
    rows.sort(reverse=True)
    seen = []
    for s, A, B, pc, pr in rows:
        if all(abs(A - p) > 1 or abs(B - q) > 0.4 for p, q in seen):
            seen.append((A, B))
            print(f"A={A:7.2f}  B={B:7.2f}  loop {B - A:7.2f}s  score {s:.3f} (chroma {pc:.3f}, rhythm {pr:.3f})")
        if len(seen) >= 8:
            break
    if a.a is not None:
        ia = int(a.a * fps); ib = ia + int(4 * fps)
        print(f"reference: A vs A+4s  chroma {np.mean(np.sum(C[:, ia:ia + w] * C[:, ib:ib + w], 0)):.3f} "
              f"rhythm {np.dot(on[ia:ia + w], on[ib:ib + w]) / w:.3f}  (a B that beats this is a real repeat)")


def cmd_refine(a):
    x = decode(a.file)
    env, fps = onset_env(x)

    def onset_near(t0, win):
        i0, i1 = int((t0 - win) * fps), int((t0 + win) * fps)
        return (i0 + env[i0:i1].argmax()) / fps

    A = onset_near(a.a, 0.12) - 0.008
    w = int(4 * fps); ia = int(a.a * fps); ref = env[ia:ia + w]
    best = max((np.dot(ref, env[i:i + w]) / w, i / fps)
               for i in range(int((a.b - 0.2) * fps), int((a.b + 0.2) * fps)))
    B = best[1] + (A - a.a)
    base = [seam_jolt(x, t, t) for t in np.linspace(len(x) / SR * 0.2, len(x) / SR * 0.8, 12)]
    print(f"A (onset-snapped) = {A:.4f}   B (rhythm-locked) = {B:.4f}   loop {B - A:.4f}s")
    print(f"normal jolt inside the track: median {np.median(base):.2f}, max {max(base):.2f}")
    print(f"natural jolt at B in the original: {seam_jolt(x, B, B):.2f}")
    for ms in (10, 30, 50, 150):
        print(f"  seam jolt with {ms:3d} ms crossfade: {seam_jolt(x, A, B, ms):.2f}")
    print("A seam at or below the natural jolt at B sounds like the music's own accent.")


def cmd_build(a):
    x = decode(a.file, 2)
    s, e = round(a.a * SR), round(a.b * SR)
    xf = int(a.xfade_ms / 1000 * SR)
    r = np.linspace(0, 1, xf)[:, None]
    loop = x[s:e].copy()
    loop[:xf] = x[s:s + xf] * r + x[e:e + xf] * (1 - r)   # blend the loop's head with what follows B
    intro = x[int(a.intro_start * SR):s]
    prev = np.concatenate([loop[-10 * SR:], loop[:6 * SR]])
    os.makedirs(a.out_dir, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        def wav(p, y):
            w = wave.open(p, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(y, -1, 1) * 32767).astype("<i2").tobytes()); w.close()
        paths = {k: os.path.join(td, k + ".wav") for k in ("intro", "loop", "prev")}
        wav(paths["intro"], intro); wav(paths["loop"], loop); wav(paths["prev"], prev)
        gain = a.lufs - lufs(paths["loop"])          # one gain for both, so the hand-off stays level
        for key, out, codec in (("intro", f"{a.name}-1-intro.ogg", ["-c:a", "libvorbis", "-q:a", "6"]),
                                ("loop", f"{a.name}-2-loop.ogg", ["-c:a", "libvorbis", "-q:a", "6"]),
                                ("prev", f"{a.name}-seam-preview.mp3", ["-c:a", "libmp3lame", "-q:a", "2"])):
            af = f"volume={gain:.2f}dB" + (",aresample=48000" if out.endswith(".ogg") else "")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", paths[key], "-af", af, *codec,
                            os.path.join(a.out_dir, out)], check=True)
    print(f"intro {len(intro) / SR:.2f}s, loop {len(loop) / SR:.3f}s, gain {gain:+.1f} dB -> {a.out_dir}")
    if len(intro) / SR < 0.05:
        print("(intro is empty: loop starts at the top — use only the -2-loop file)")


def cmd_simple(a):
    trim = ["-ss", str(a.start)] + (["-to", str(a.end)] if a.end else [])
    out = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *trim, "-i", a.file, "-vn", "-af",
                          f"loudnorm=I={a.lufs}:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    m = json.loads(out[out.rfind("{"):out.rfind("}") + 1])
    af = (f"loudnorm=I={a.lufs}:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:"
          f"linear=true,aresample=48000")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *trim, "-i", a.file, "-vn", "-map_metadata", "-1", "-af", af,
                    "-c:a", "libvorbis", "-q:a", "6", a.out], check=True)
    print(f"{a.out}: {lufs(a.out)} LUFS")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("analyze"); s.add_argument("file"); s.set_defaults(fn=cmd_analyze)
    s = sp.add_parser("find"); s.add_argument("file")
    s.add_argument("--a", type=float, help="fix the loop start (e.g. a downbeat after a break)")
    s.add_argument("--a-range", type=float, nargs=2, default=(5, 40))
    s.add_argument("--b-range", type=float, nargs=2, required=True, help="where the loop may end, e.g. before the fade")
    s.add_argument("--mode", choices=("pre", "post"), default="pre",
                   help="pre: match what leads into A/B (use when B is just before the ending); "
                        "post: match what follows (use when the track repeats its own section)")
    s.set_defaults(fn=cmd_find)
    s = sp.add_parser("refine"); s.add_argument("file"); s.add_argument("--a", type=float, required=True)
    s.add_argument("--b", type=float, required=True); s.set_defaults(fn=cmd_refine)
    s = sp.add_parser("build"); s.add_argument("file"); s.add_argument("--a", type=float, required=True)
    s.add_argument("--b", type=float, required=True); s.add_argument("--name", required=True)
    s.add_argument("--out-dir", required=True); s.add_argument("--intro-start", type=float, default=0.0)
    s.add_argument("--xfade-ms", type=float, default=30); s.add_argument("--lufs", type=float, default=-16)
    s.set_defaults(fn=cmd_build)
    s = sp.add_parser("simple"); s.add_argument("file"); s.add_argument("--out", required=True)
    s.add_argument("--start", type=float, default=0); s.add_argument("--end", type=float)
    s.add_argument("--lufs", type=float, default=-16); s.set_defaults(fn=cmd_simple)
    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
