#!/usr/bin/env bash
# Render a generated SVG map to PNG with headless Chrome. Works on macOS and Linux/WSL.
# usage: ./render.sh <map.svg> [px-per-square=140] [out.png]
# Maps use 100 SVG units per 5-ft square, so px-per-square / 100 is the scale.
# Chrome: set CHROME=/path/to/chrome to override; otherwise the first one found below is used.
set -e
abspath() { echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; }

SVG=$(abspath "$1"); PX=${2:-140}
OUT=$(abspath "${3:-${SVG%.*}-${PX}px.png}")

if [ -z "$CHROME" ]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
           "$(command -v google-chrome || true)" "$(command -v chromium || true)" "$(command -v chromium-browser || true)" \
           $(ls -d "$HOME"/.agent-browser/browsers/chrome-*/chrome 2>/dev/null | sort -V | tail -1); do
    [ -n "$c" ] && [ -x "$c" ] && CHROME=$c && break
  done
fi
[ -z "$CHROME" ] && { echo "No Chrome found. Set CHROME=/path/to/chrome." >&2; exit 1; }

read -r W H < <(grep -o 'viewBox="0 0 [0-9]* [0-9]*"' "$SVG" | head -1 | tr -d '"' | awk '{print $3, $4}')
[ -z "$W" ] || [ -z "$H" ] && { echo "Couldn't read the viewBox width/height from $SVG" >&2; exit 1; }
RW=$(( W * PX / 100 )); RH=$(( H * PX / 100 ))
HTML=${SVG%.*}.view.html
printf '<html><body style="margin:0;background:#000"><img src="%s" style="display:block;width:%dpx;height:%dpx"></body></html>' \
  "$(basename "$SVG")" $RW $RH > "$HTML"
# --no-sandbox is needed when Chrome runs as a bundled binary on Linux/WSL; harmless on macOS.
"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=$RW,$RH --virtual-time-budget=40000 --screenshot="$OUT" "file://$HTML" 2>/dev/null
rm -f "$HTML"
echo "$OUT (${RW}x${RH})"
