"""Measure map colours so a generated map can match a reference set (e.g. a published adventure's maps).

Run with the dnd-transcription venv (numpy, scipy, Pillow):
  PY=dnd-transcription/.venv/bin/python
  $PY -I map-maker/tools/color_match.py stats   ref1.jpg ref2.jpg ours.png
      overall brightness / saturation / contrast per image, side by side
  $PY -I map-maker/tools/color_match.py palette ref1.jpg [--k 10]
      main colours (k-means in Lab), with share of the image, as hex
  $PY -I map-maker/tools/color_match.py sample  ref.jpg x y w h [x y w h ...]
      median colour of rectangles (pixel coords of the full-size image), as hex
  $PY -I map-maker/tools/color_match.py materials ours.png --ref ref1.jpg ref2.jpg
      for each main colour of OURS, the nearest-hue colour in the refs and the lightness/chroma gap

Lightness L is 0-100 (CIELAB), chroma C is colourfulness (0 = grey), hue h in degrees.
"""
import argparse
import sys

import numpy as np
from PIL import Image
from scipy.cluster.vq import kmeans2


def load(path, max_side=600):
    im = Image.open(path).convert('RGBA')
    s = max_side / max(im.size)
    if s < 1:
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    a = np.asarray(im).astype(np.float64) / 255
    rgb, alpha = a[..., :3], a[..., 3]
    return rgb[alpha > 0.5]          # opaque pixels only, as N x 3


def srgb_to_lab(rgb):
    c = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([116 * f[:, 1] - 16, 500 * (f[:, 0] - f[:, 1]), 200 * (f[:, 1] - f[:, 2])], axis=1)


def lch(lab):
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    return L, np.hypot(a, b), np.degrees(np.arctan2(b, a)) % 360


def hexc(rgb):
    return '#' + ''.join(f'{int(round(v * 255)):02x}' for v in np.clip(rgb, 0, 1))


def stats(paths):
    print(f"{'image':42} {'L mean':>7} {'L p10':>6} {'L p90':>6} {'C mean':>7} {'C p90':>6}")
    for p in paths:
        L, C, _ = lch(srgb_to_lab(load(p)))
        print(f"{p[-42:]:42} {L.mean():7.1f} {np.percentile(L, 10):6.1f} {np.percentile(L, 90):6.1f} {C.mean():7.1f} {np.percentile(C, 90):6.1f}")


def clusters(path, k):
    rgb = load(path, 300)
    lab = srgb_to_lab(rgb)
    np.random.seed(1)
    cent, lbl = kmeans2(lab, k, minit='++', seed=1)
    out = []
    for i in range(k):
        sel = lbl == i
        if not sel.any():
            continue
        out.append((sel.mean(), np.median(rgb[sel], axis=0), np.median(lab[sel], axis=0)))
    return sorted(out, key=lambda t: -t[0])


def palette(path, k):
    print(path)
    for share, rgb, lab in clusters(path, k):
        L, C, h = lch(lab)
        print(f"  {hexc(rgb)}  {share * 100:5.1f}%  L {L:5.1f}  C {C:5.1f}  h {h:5.1f}")


def sample(path, rects):
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float64) / 255
    for i in range(0, len(rects), 4):
        x, y, w, h = map(int, rects[i:i + 4])
        px = a[y:y + h, x:x + w].reshape(-1, 3)
        rgb = np.median(px, axis=0)
        L, C, hh = lch(srgb_to_lab(rgb[None]))
        print(f"  ({x},{y},{w},{h})  {hexc(rgb)}  L {L[0]:5.1f}  C {C[0]:5.1f}  h {hh[0]:5.1f}")


def materials(ours, refs, k):
    ref = [c for r in refs for c in clusters(r, k)]
    print(f"{'ours':8} {'share':>6}   {'nearest ref':11}  {'dL':>6} {'dC':>6} {'dh':>6}")
    for share, rgb, lab in clusters(ours, k):
        L, C, h = lch(lab)
        def dist(c):
            l2, c2, h2 = lch(c[2])
            dh = min(abs(h - h2), 360 - abs(h - h2))
            return dh * (C + c2) / 60 + abs(L - l2) * 0.6
        best = min(ref, key=dist)
        L2, C2, h2 = lch(best[2])
        print(f"{hexc(rgb)} {share * 100:5.1f}%   {hexc(best[1])}     {L - L2:+6.1f} {C - C2:+6.1f} {((h - h2 + 180) % 360) - 180:+6.1f}")


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest='cmd', required=True)
    s = sp.add_parser('stats'); s.add_argument('images', nargs='+')
    s = sp.add_parser('palette'); s.add_argument('image'); s.add_argument('--k', type=int, default=10)
    s = sp.add_parser('sample'); s.add_argument('image'); s.add_argument('rects', nargs='+')
    s = sp.add_parser('materials'); s.add_argument('ours'); s.add_argument('--ref', nargs='+', required=True); s.add_argument('--k', type=int, default=10)
    a = ap.parse_args()
    if a.cmd == 'stats': stats(a.images)
    elif a.cmd == 'palette': palette(a.image, a.k)
    elif a.cmd == 'sample':
        if len(a.rects) % 4: sys.exit('rects come in groups of 4: x y w h')
        sample(a.image, a.rects)
    else: materials(a.ours, a.ref, a.k)
