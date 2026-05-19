#!/bin/bash
# shellcheck disable=SC2034
set -e
OUT_DIR="out"

PAGES=(
  "" "about" "ambassadors" "security" "impact" "talentos" "learningos"
  "tarifs" "demo" "contact" "composants" "modules/adaptive" "modules/visual"
  "legal" "privacy" "terms" "cgv"
)

rm -rf "$OUT_DIR"

# Source secrets (SITE_URL for output domain)
if [ -f ".env.deploy" ]; then source .env.deploy; fi

SOURCE_URL="https://sc4bovu7233.universe.wf"
TARGET_DOMAIN="${SITE_URL:-https://mentivisos.com}"

echo "=== Mirroring $SOURCE_URL → $OUT_DIR/ (target: $TARGET_DOMAIN) ==="

# Curl all pages from live server (real CMS content baked in)
FAILS=0
for lang in fr en; do
  for page in "${PAGES[@]}"; do
    dir="$OUT_DIR/$lang/$page"
    mkdir -p "$dir"
    url="$SOURCE_URL/$lang${page:+/$page}/"
    if curl -sSk -o "$dir/index.html" "$url"; then
      echo "  OK  $url"
    else
      echo "  FAIL $url"
      ((FAILS++)) || true
    fi
  done
done

# Curl sitemap.xml from live
echo "--- Fetching sitemap.xml ---"
curl -sSk "$SOURCE_URL/sitemap.xml" > "$OUT_DIR/sitemap.xml" 2>/dev/null && echo "  OK  sitemap.xml" || echo "  WARN: sitemap.xml failed"
# Replace source domain with target domain in sitemap
if [ -f "$OUT_DIR/sitemap.xml" ] && grep -q sc4bovu7233 "$OUT_DIR/sitemap.xml" 2>/dev/null; then
  perl -i -pe "s|https://sc4bovu7233\.universe\.wf|${TARGET_DOMAIN}|g" "$OUT_DIR/sitemap.xml"
  echo "  OK  sitemap domain → ${TARGET_DOMAIN}"
fi

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
cat > "$OUT_DIR/robots.txt" << TXTEOL
User-agent: *
Allow: /
Sitemap: ${TARGET_DOMAIN}/sitemap.xml
TXTEOL

# .htaccess for static server — proxy API + trailing slash rewrite
cat > "$OUT_DIR/.htaccess" << 'HTEOF'
RewriteEngine On

# Trailing slash → index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} /$
RewriteRule ^(.*)/$ $1/index.html [L]

# Proxy API calls to live server
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ https://sc4bovu7233.universe.wf/api/$1 [P,L]
HTEOF
echo "  OK  .htaccess (API proxy + trailing slash)"

# Generate minimal PWA manifest
cat > "$OUT_DIR/manifest.json" << 'MANEOF'
{"name":"MentivisOS","short_name":"MentivisOS","start_url":"/fr/","display":"minimal-ui","icons":[{"src":"/icon.svg","sizes":"any","type":"image/svg+xml"}]}
MANEOF
echo "  OK  manifest.json"

# Generate custom 404 page
cat > "$OUT_DIR/404.html" << '404EOF'
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>404 - Page introuvable</title><link rel="stylesheet" href="/_next/static/css/d4eb308dce0866ed.css"></head>
<body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:var(--font-sans),Inter,sans-serif;text-align:center;background:#ffffff">
<div><h1 style="font-size:clamp(40px,8vw,80px);font-weight:300;color:#0A0A0A;margin:0 0 16px">404</h1><p style="font-size:18px;color:#4e4e4e;margin:0 0 24px">Page introuvable</p><a href="/fr/" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:500;color:#fff;background:#0A0A0A;border-radius:8px;text-decoration:none">Retour à l&apos;accueil</a></div>
</body></html>
404EOF
echo "  OK  404.html"

echo "--- Copying static assets ---"
if [ -d "public" ]; then cp -r public/* "$OUT_DIR/"; fi
# Copy Next.js file-based metadata assets
if [ -f "app/icon.svg" ]; then cp app/icon.svg "$OUT_DIR/icon.svg"; fi
# Strip Next.js default metadata SVGs (unused in static)
rm -f "$OUT_DIR/file.svg" "$OUT_DIR/globe.svg" "$OUT_DIR/next.svg" "$OUT_DIR/vercel.svg" "$OUT_DIR/window.svg"

# Curl CSS/JS/fonts from live server (must match HTML references exactly)
echo "--- Fetching CSS/JS assets from live server ---"
mkdir -p "$OUT_DIR/_next/static"
ASSETS=0
grep -ohE "/_next/static/[^\"<>[:space:]]+" $(find "$OUT_DIR" -name 'index.html') | sort -u > /tmp/static-assets.txt
while IFS= read -r path; do
  [[ -z "$path" ]] && continue
  path=$(echo "$path" | sed 's/\\$//')
  [[ -z "$path" ]] && continue
  dir="$OUT_DIR$(/usr/bin/dirname "$path")"
  /bin/mkdir -p "$dir"
  if curl -sSk -o "${OUT_DIR}${path}" "${SOURCE_URL}${path}"; then
    ((ASSETS++)) 2>/dev/null || true
  else
    echo "  SKIP $path"
  fi
done < /tmp/static-assets.txt
echo "  OK  $ASSETS CSS/JS/fonts mirrored"

# ── Post-processing (Python) ──
echo "--- Post-processing HTML ---"
python3 -c "
import re, urllib.parse, glob, os

SITE_URL = os.environ.get('SITE_URL', 'https://mentivisos.com')

for f in sorted(glob.glob('${OUT_DIR}/**/*.html', recursive=True)):
    html = open(f, 'r').read()

    # Fix Next.js Image URLs → direct paths (handles &amp; in srcSet and imageSrcSet)
    html = re.sub(
        r'/_next/image/?\?url=([^&\s\"<>]+)(?:&(?:amp;)?[^\s\"<>]*)*',
        lambda m: urllib.parse.unquote(m.group(1)),
        html
    )

    # Strip <link rel=preload as=image> — dead on static, uses _next/image
    html = re.sub(r'<link\s[^>]*\brel=[\"\']?preload[\"\']?\s[^>]*\bas=[\"\']?image[\"\']?[^>]*/?>', '', html)

    # Replace live server domain with target domain (sitemap, JSON-LD, breadcrumbs)
    if SITE_URL and 'sc4bovu7233.universe.wf' in html and SITE_URL != 'https://sc4bovu7233.universe.wf':
        html = html.replace('https://sc4bovu7233.universe.wf', SITE_URL)

    # Fix favicon: strip cache-busting query, preserve quotes
    html = re.sub(r'href=([\"\'])/icon.svg\?[^\"\']*\1', r'href=\1/icon.svg\1', html)

    # Add apple-touch-icon
    html = html.replace('<link rel=\"icon\"', '<link rel=\"apple-touch-icon\" href=\"/icon.svg\"/><link rel=\"icon\"')

    # Inject OG + Twitter tags if missing
    if '<meta property=\"og:' not in html:
        title_match = re.search(r'<title>([^<]*)</title>', html)
        desc_match = re.search(r'<meta name=\"description\" content=\"([^\"]*)\"', html)
        title = title_match.group(1) if title_match else 'MentivisOS'
        desc = desc_match.group(1) if desc_match else ''
        og = f'<meta property=\"og:title\" content=\"{title}\"/><meta property=\"og:description\" content=\"{desc}\"/><meta property=\"og:type\" content=\"website\"/><meta property=\"og:url\" content=\"{SITE_URL}\"/><meta name=\"twitter:card\" content=\"summary_large_image\"/>'
        html = html.replace('<title>', og + '<title>', 1)

    open(f, 'w').write(html)
"

COUNT=$(find "$OUT_DIR" -name 'index.html' | wc -l | tr -d ' ')
echo "=== Done: $COUNT HTML pages in $OUT_DIR/ ($FAILS pages failed) ==="
echo "Contents:"
ls -la "$OUT_DIR/"
echo "FTP upload: rsync -av out/ user@targetserver:/path/to/webroot/"
