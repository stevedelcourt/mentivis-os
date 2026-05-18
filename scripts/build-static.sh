#!/bin/bash
set -e
OUT_DIR="out"
PORT=3999
BASE="http://localhost:${PORT}"

PAGES=(
  "" "about" "ambassadors" "security" "impact" "talentos" "learningos"
  "tarifs" "demo" "contact" "composants" "modules/adaptive" "modules/visual"
  "legal" "privacy" "terms" "cgv"
)

rm -rf "$OUT_DIR"
echo "=== Building static mirror to $OUT_DIR/ ==="

# Create local data dir for sql.js
export DATA_DIR="${TMPDIR:-/tmp}/mentivis-data"
mkdir -p "$DATA_DIR"
echo "--- DATA_DIR=$DATA_DIR ---"

# Start Next.js
echo "--- Starting Next.js on port $PORT ---"
npx next start --port "$PORT" &
SERVER_PID=$!
sleep 5

# Curl all pages
FAILS=0
for lang in fr en; do
  for page in "${PAGES[@]}"; do
    dir="$OUT_DIR/$lang/$page"
    mkdir -p "$dir"
    url="$BASE/$lang${page:+/$page}/"
    if curl -sS -o "$dir/index.html" "$url"; then
      echo "  OK  $url"
    else
      echo "  FAIL $url"
      ((FAILS++)) || true
    fi
  done
done

# Curl sitemap.xml while server is still up
echo "--- Fetching sitemap.xml ---"
curl -sS "$BASE/sitemap.xml" > "$OUT_DIR/sitemap.xml" 2>/dev/null && echo "  OK  sitemap.xml" || echo "  WARN: sitemap.xml failed"

# Kill server
kill "$SERVER_PID" 2>/dev/null || true
wait "$SERVER_PID" 2>/dev/null || true

# Root index.html redirect → /fr/
cat > "$OUT_DIR/index.html" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/fr/"></head>
<body><a href="/fr/">MentivisOS</a></body>
</html>
HTMLEOF
echo "  OK  root index.html → /fr/"

# robots.txt
cat > "$OUT_DIR/robots.txt" << 'TXTEOL'
User-agent: *
Allow: /
Sitemap: ${SITE_URL:-https://mentivisos.com}/sitemap.xml
TXTEOL

echo "--- Copying static assets ---"
if [ -d "public" ]; then cp -r public/* "$OUT_DIR/"; fi

# Fix Next.js Image URLs → direct paths (handles &amp; in srcSet)
echo "--- Post-processing image URLs ---"
python3 -c "
import re, urllib.parse, glob
for f in sorted(glob.glob('${OUT_DIR}/**/*.html', recursive=True)):
    html = open(f, 'r').read()
    html = re.sub(
        r'/_next/image/?\?url=([^&\s\"<>]+)(?:&(?:amp;)?[^\s\"<>]*)*',
        lambda m: urllib.parse.unquote(m.group(1)),
        html
    )
    open(f, 'w').write(html)
"

COUNT=$(find "$OUT_DIR" -name 'index.html' | wc -l | tr -d ' ')
echo "=== Done: $COUNT HTML pages in $OUT_DIR/ ($FAILS pages failed) ==="
echo "Contents:"
ls -la "$OUT_DIR/"
echo "FTP upload: rsync -av out/ user@targetserver:/path/to/webroot/"
