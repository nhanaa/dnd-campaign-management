#!/bin/sh
cd "$(dirname "$0")" && echo "Dark Codex running at http://localhost:8080" && open http://localhost:8080 && python3 -m http.server 8080
