#!/bin/zsh
# Render a generated SVG map to PNG with headless Chrome.
# usage: ./render.sh <map.svg> [px-per-square=140] [out.png]
# Maps use 100 SVG units per 5-ft square, so px-per-square / 100 is the scale.
set -e
SVG=${1:A}; PX=${2:-140}; OUT=${3:-${SVG:r}-${PX}px.png}
W=$(grep -o 'viewBox="0 0 [0-9]* [0-9]*"' $SVG | head -1 | awk '{print $4}')
H=$(grep -o 'viewBox="0 0 [0-9]* [0-9]*"' $SVG | head -1 | awk '{print $5}' | tr -d '"')
RW=$(( W * PX / 100 )); RH=$(( H * PX / 100 ))
HTML=${SVG:r}.view.html
printf '<html><body style="margin:0;background:#000"><img src="%s" style="display:block;width:%dpx;height:%dpx"></body></html>' ${SVG:t} $RW $RH > $HTML
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=$RW,$RH --virtual-time-budget=40000 --screenshot=${OUT:A} "file://$HTML" 2>/dev/null
rm -f $HTML
echo "$OUT (${RW}x${RH})"
