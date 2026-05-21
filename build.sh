#!/bin/bash
# Build the deploy directory for Cloudflare Pages.
# Only public assets land in dist/; dev files (CLAUDE.md, tests/, package.json) stay out.

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
DIST="$ROOT/dist"

rm -rf "$DIST"
mkdir -p "$DIST"

# Public assets (HTML, JS, CSS, static files)
cp "$ROOT/index.html" "$DIST/"
cp "$ROOT/resources.html" "$DIST/"
cp "$ROOT/404.html" "$DIST/"
cp "$ROOT/styles.css" "$DIST/"
cp "$ROOT/print.css" "$DIST/"
cp "$ROOT/app.js" "$DIST/"
cp "$ROOT/resources.js" "$DIST/"
cp "$ROOT/404.js" "$DIST/"
cp "$ROOT/qrcode.min.js" "$DIST/"
cp "$ROOT/sw.js" "$DIST/"
cp "$ROOT/_headers" "$DIST/"
cp "$ROOT/robots.txt" "$DIST/"
cp "$ROOT/sitemap.xml" "$DIST/"
cp "$ROOT/og-image.png" "$DIST/"

echo "Built dist/ with $(ls "$DIST" | wc -l | tr -d ' ') files"
