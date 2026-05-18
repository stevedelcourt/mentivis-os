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
    url="$BASE/$lang/$page/"
    if curl -sS -o "$dir/index.html" "$url"; then
      echo "  OK  $url"
    else
      echo "  FAIL $url"
      ((FAILS++)) || true
    fi
  done
done

# Kill server
kill "$SERVER_PID" 2>/dev/null || true
wait "$SERVER_PID" 2>/dev/null || true

echo "--- Copying static assets ---"
if [ -d "public" ]; then cp -r public/* "$OUT_DIR/"; fi

# Fix Next.js Image URLs → direct paths
echo "--- Post-processing image URLs ---"
python3 -c "
import re, urllib.parse, glob
for f in sorted(glob.glob('${OUT_DIR}/**/*.html', recursive=True)):
    html = open(f, 'r').read()
    def repl(m):
        raw = urllib.parse.unquote(m.group(1))
        return raw
    html = re.sub(r'/_next/image\?url=([^&\"]+)(&[^\"\s]*)?', repl, html)
    open(f, 'w').write(html)
"

COUNT=$(find "$OUT_DIR" -name 'index.html' | wc -l | tr -d ' ')
echo "=== Done: $COUNT HTML pages in $OUT_DIR/ ($FAILS failed) ==="
echo "FTP upload: rsync -av out/ user@targetserver:/path/to/webroot/"
