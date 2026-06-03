# Infrastructure

Reference document for the MentivisOS deployment environment, database architecture, and deployment pipeline.

---

## Hosting Environment

### Production (sc4)

| Property | Value |
|----------|-------|
| Provider | o2switch (shared hosting) |
| Server | `terre.o2switch.net` |
| User | `sc4bovu7233` |
| SSH Key | `/Users/stv/Documents/zed/OS_sc4/id_rsa_sc4` (passphrase: `RoxanStevenMathias2024`) |
| Node | v20.20.2 via `/opt/alt/alt-nodejs20/root/usr/bin` |
| Process Manager | Passenger (CloudLinux) |
| Live URL | `https://sc4bovu7233.universe.wf` |
| Database | `/home/sc4bovu7233/data/mentivis.db` |

### Staging / Secondary (sc10)

| Property | Value |
|----------|-------|
| Provider | o2switch (shared hosting) |
| Server | `terre.o2switch.net` |
| User | `sc10bovu7233` |
| SSH Key | `/Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10` (no passphrase) |
| Node | v20.20.2 via `/opt/alt/alt-nodejs20/root/usr/bin` |
| Process Manager | Passenger (CloudLinux) |
| Live URL | `https://sc10bovu7233.universe.wf` |
| Mirror URL | `https://mirror.sc10bovu7233.universe.wf` |
| Database | `/home/sc10bovu7233/data/mentivis.db` |

### Key Constraints

- **No gcc/g++** in PATH — native Node.js modules cannot be compiled from source
- **Old glibc** — prebuilt `better-sqlite3` binaries require GLIBC_2.29, which is unavailable
- **Shared hosting** — no root access, no Docker, Passenger manages the Node process lifecycle
- **2 CPU cores** — build capped via `experimental.cpus: 2` in `next.config.ts` to prevent OOM
- **No mod_proxy** on subdomains — API proxying must use PHP-based proxy

---

## Directory Layout on Server

### sc4 — `/home/sc4bovu7233/`

```
/home/sc4bovu7233/
├── nextapp/                    # Application code (git checkout)
│   ├── .env.local              # Secrets (written by deploy.sh)
│   ├── .next/standalone/       # Next.js production build output
│   │   ├── .next/server/       # Server-side chunks
│   │   ├── public/             # Copied static assets
│   │   └── .next/static/       # Client-side static assets
│   ├── node_modules/
│   │   └── sql.js/dist/
│   │       ├── sql-wasm.wasm   # SQLite WASM runtime (~660KB)
│   │       └── sql-wasm.js     # JS glue code
│   ├── server.js               # Passenger entry point
│   └── ...
├── data/                       # Persistent data (outside repo)
│   ├── mentivis.db             # SQLite database
│   ├── posts.json.bak          # Migrated JSON backups
│   ├── seo.json.bak
│   ├── submissions.json.bak
│   ├── users.json.bak
│   └── uploads/                # CMS image uploads
└── public_html/
    └── .htaccess               # Passenger config + security headers
```

### sc10 — `/home/sc10bovu7233/`

```
/home/sc10bovu7233/
├── nextapp/                    # Application code (git checkout)
│   ├── .env.local              # Secrets (written by deploy-sc10.sh)
│   ├── node_modules/
│   ├── server.js               # Passenger entry point
│   ├── statics/                # Static files served directly by Apache
│   │   └── _next/static/       # (avoids o2switch Tiger-Protect blocking _next/)
│   ├── tmp/
│   │   └── restart.txt         # Passenger restart trigger
│   └── ...
├── data/                       # Persistent data (outside repo)
│   ├── mentivis.db             # SQLite database (synced from sc4)
│   └── uploads/                # CMS image uploads (synced from sc4)
└── public_html/
    ├── .htaccess               # Passenger config + security headers
    └── mirror/                 # Static mirror (served by Apache)
        ├── index.html
        ├── .htaccess            # PHP-based API proxy + trailing slash rewrite
        ├── proxy.php            # Forwards /api/* to live server
        ├── fr/                  # 20 pages
        ├── en/                  # 20 pages
        ├── _next/static/        # CSS/JS chunks
        ├── images/
        └── videos/
```

---

## Database

### Migration History

| Phase | Technology | Status | Notes |
|-------|-----------|--------|-------|
| 1 | JSON files in `/data/` | Legacy | Simple file-based storage |
| 2 | `better-sqlite3` | **Failed** | GLIBC_2.29 not found; no gcc to compile from source |
| 3 | `sql.js` (pure JS/WASM) | **Active** | Zero native dependencies; works on o2switch |

### One-Time JSON → SQLite Migration

- Triggered on first `getDb()` call after deployment
- Checks `SELECT COUNT(*) FROM posts` — exits early if already migrated
- Reads all `*.json` files from `DATA_DIR`, inserts into SQLite tables
- Renames source files to `*.bak` after successful migration
- Safe to re-run: idempotent via row count check

### SQLite File

- **sc4 path:** `/home/sc4bovu7233/data/mentivis.db`
- **sc10 path:** `/home/sc10bovu7233/data/mentivis.db`
- **CMS content is managed on sc4** — sc10 is a secondary deployment that receives synced data
- **Persistence:** Survives `git reset --hard` and redeploys (outside repo)
- **WAL mode:** Attempted on init (best-effort with sql.js)
- **Auto-save:** Every `INSERT`/`UPDATE`/`DELETE` triggers `fs.writeFileSync()` of the exported database buffer
- **Backups:** `deploy-sc10.sh` creates timestamped backups before every deploy (`mentivis.db.backup.YYYYMMDD_HHMMSS`). Last 10 retained.

---

## sql.js Runtime

### Why sql.js?

`better-sqlite3` is the preferred choice for local development (sync API, faster). However, on o2switch it fails because:

1. The prebuilt binary is linked against GLIBC_2.29
2. `npm rebuild` cannot compile from source because gcc is absent
3. `sql.js` is pure JavaScript + WASM — no native compilation required

### Trade-offs

| Aspect | better-sqlite3 | sql.js |
|--------|---------------|--------|
| API | Sync | Async (Promises) |
| Performance | Faster | Slower (WASM overhead) |
| Persistence | Automatic | Manual (`db.export()` + `fs.writeFileSync()`) |
| Native deps | Yes | No |
| o2switch | Broken | Works |

### WASM Resolution

Next.js `standalone` output does **not** copy `sql.js` WASM into `.next/standalone/node_modules/`. It only bundles the JS glue code. The WASM must be resolved at runtime.

**Solution:**

1. `next.config.ts` declares `serverExternalPackages: ["sql.js"]`
2. `lib/cms/sqlite.ts` searches multiple candidate paths for `sql-wasm.wasm`:
   - `process.cwd()/node_modules/sql.js/dist/sql-wasm.wasm`
   - `process.cwd()` parent directories
   - `__dirname` relative paths
3. Falls back to `initSqlJs()` (HTTP fetch) if local file not found

---

## Deployment Pipeline

### sc4 — `deploy.sh`

Production deploy. Pushes to GitHub triggers Vercel auto-deploy. See `deploy.sh` for full script.

```bash
cd /Users/stv/Documents/zed/OS_sc4/mentivis-os
./scripts/deploy-unlock.sh
```

### sc10 — `deploy-sc10.sh`

Secondary SSR deploy. No Vercel. Uses `id_rsa_sc10` key (no passphrase).

```bash
cd /Users/stv/Documents/zed/DeployOS-sc10/mentivis-os
set -a && source .env.deploy && set +a
./deploy-sc10.sh
```

The script:
1. Writes `.env.local` with `ALLOWED_ORIGINS` including `mirror.sc10bovu7233.universe.wf`
2. Fetches code from GitHub (`git reset --hard origin/main`)
3. Builds Next.js with `ASSET_PREFIX=/statics` (avoids Tiger-Protect)
4. Copies static files to `statics/_next/static/` for Apache direct serving
5. Restarts Passenger
6. Health checks at `https://sc10bovu7233.universe.wf/api/health/`

### Sync sc4 → sc10 — `scripts/sync-sc4-to-sc10.sh`

Syncs CMS content (database + uploads) from sc4 to sc10, then rebuilds the mirror.

```bash
cd /Users/stv/Documents/zed/DeployOS-sc10/mentivis-os
./scripts/sync-sc4-to-sc10.sh
```

Steps:
1. Unlocks sc4 SSH key (`/Users/stv/Documents/zed/OS_sc4/id_rsa_sc4`)
2. Copies `mentivis.db` from sc4 → sc10 via SSH pipe
3. Copies `uploads/` directory from sc4 → sc10 via tar pipe
4. Restarts Passenger on sc10
5. Rebuilds static mirror (see below)
6. Uploads mirror to `public_html/mirror/`

### Required Environment Variables

| Variable | Purpose |
|----------|---------|
| `INTERNAL_TOKEN` | API route protection |
| `CMS_AUTH_SECRET` | CMS auth token HMAC signing |
| `HUBSPOT_PORTAL_ID` | HubSpot form relay |
| `HUBSPOT_FORM_ID` | HubSpot form relay |
| `ALLOWED_ORIGINS` | CORS whitelist (comma-separated) |
| `DATA_DIR` | Data directory path (defaults to `/home/sc4bovu7233/data`) |

---

## Passenger Configuration

`/home/sc4bovu7233/public_html/.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home/sc4bovu7233/nextapp"
PassengerBaseURI "/"
PassengerNodejs "/home/sc4bovu7233/nodevenv/nextapp/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
```

### Restart Behavior

- Passenger auto-restarts when `tmp/restart.txt` is touched
- If the app crashes, Passenger will attempt to restart it automatically
- Check `ps aux | grep next-server` to verify the process is running

---

## Troubleshooting

### `GLIBC_2.29 not found` (better-sqlite3)

**Cause:** Native binary incompatible with o2switch's older glibc.
**Fix:** Use `sql.js`. Do not install or use `better-sqlite3` on o2switch.

### `ENOENT: sql-wasm.wasm`

**Cause:** Next.js `standalone` output did not include the WASM file.
**Fix:** Ensure `serverExternalPackages: ["sql.js"]` is in `next.config.ts`. The runtime will search parent directories from `process.cwd()`.

### `Invalid request` on API routes after deploy

**Causes:**
- Passenger has not restarted (wait 10s, or `touch tmp/restart.txt`)
- `.env.local` missing or malformed (check `cat .env.local`)
- `node_modules` out of sync (run `npm install` again)

### Data lost on deploy

**Cause:** JSON/SQLite files stored inside the repo directory.
**Fix:** Ensure `DATA_DIR` points outside the repo (default: `/home/sc4bovu7233/data`). This directory is gitignored by deploy script logic.

### Build fails with `Type error: Could not find a declaration file for module 'sql.js'`

**Fix:** The project includes a custom `sql.js.d.ts` declaration file at the repo root. Do not remove it.

### Deploy health check fails

**Cause:** New build crashed or API routes are broken.
**Auto-fix:** `deploy.sh` automatically rolls back to `standalone-old` and restarts Passenger.
**Manual fix:** Check `ps aux | grep next-server` to see if the process is running. Check Passenger logs if available.

---

## Security

### File Protection (.htaccess)

```apache
<FilesMatch "^\.">
  Require all denied
</FilesMatch>

<IfModule mod_rewrite.c>
  RewriteRule ^\.env - [F,L]
  RewriteRule ^\.git - [F,L]
  RewriteRule ^node_modules - [F,L]
  RewriteRule ^data/ - [F,L]
</IfModule>
```

### Headers (next.config.ts)

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — restricts camera, geolocation, microphone, etc.

---

## Git History (Relevant Commits)

- `dd99106` — Initial SQLite migration (better-sqlite3)
- `36c818a` — Migrate to sql.js (pure JS/WASM)
- `29d8dc9` — Add sql.js TypeScript declarations
- `0843f85` — Fix sql.js module declaration shape
- `8c19b64` — Convert Buffer to Uint8Array for sql.js constructor
- `f29ede5` — Allow Uint8Array in Database constructor declaration
- `3257b10` — Fix WASM path resolution for standalone builds
- `75891bf` — Add infrastructure and CMS data layer documentation
- `0ee73d1` — Zero-downtime deploy with atomic swap, DB backup, and health check

---

## Static Mirror Build (`/out`)

### Purpose

Generate a complete static HTML snapshot of all public pages for deployment as a **fallback mirror** when Passenger is down. No Node.js required — pure Apache/static hosting.

### URL

- **sc10 mirror**: `https://mirror.sc10bovu7233.universe.wf`
- Created as a subdomain in cPanel, document root: `public_html/mirror/`

### Script: `scripts/build-static.sh`

```bash
SOURCE_URL=https://sc10bovu7233.universe.wf \
API_PROXY=https://sc10bovu7233.universe.wf \
SITE_URL=https://mirror.sc10bovu7233.universe.wf \
./scripts/build-static.sh
```

**Environment variables (all optional):**

| Variable | Default | Purpose |
|----------|---------|---------|
| `SOURCE_URL` | `https://sc10bovu7233.universe.wf` | Source server to curl pages from |
| `API_PROXY` | `$SOURCE_URL` | Backend URL for PHP API proxy |
| `SITE_URL` | `https://mentivisos.com` | Target domain for sitemap/JSON-LD |

**Process (v4):**
1. Curls all **41 pages** (20 FR + 20 EN + root) from `SOURCE_URL` → CMS content baked in
2. (New) Pages include: `blog`, `carrieres`, `hidden-testimonials`
3. Curls `sitemap.xml` from live, replaces domain with `SITE_URL`
4. Copies `public/` + `_next/static/` CSS/JS/fonts/images from live server
5. Strips `/statics/` prefix from asset URLs (mirror doesn't use `ASSET_PREFIX`)
6. Fixes URL-encoded directory names (`%5Blang%5D` → `[lang]`)
7. Generates `proxy.php` — PHP-based API proxy (no mod_proxy needed)
8. Generates `.htaccess`:
   - Trailing slash → `index.html` rewrite
   - `/api/*` → PHP proxy (for CORS-free same-origin API calls)
   - Fallback → `404.html`
9. Post-processes HTML: OG tags, favicon, `_next/image` cleanup

### Output Structure

```
out/
├── index.html              ← root → /fr/
├── .htaccess               ← PHP proxy + trailing slash rewrite
├── proxy.php               ← Forwards /api/* to live server via cURL
├── 404.html                ← custom 404 page
├── robots.txt
├── sitemap.xml             ← 41 entries with hreflang
├── manifest.json
├── icon.svg
├── llms.txt
├── fr/ (20 dirs)           ← "" + 19 pages
├── en/ (20 dirs)
├── images/
├── videos/
├── _next/static/           ← CSS, JS chunks, fonts
└── visuals-library/
```

### How the API proxy works

`proxy.php` receives `/api/*` requests via Apache rewrite, forwards them to `API_PROXY` via cURL, and returns the response — all same-origin, no CORS headers needed.

```apache
# .htaccess rules (in mirror directory)
RewriteRule ^(api/.*)$ proxy.php?url=$1 [L,QSA]
```

The PHP script:
- Forwards GET/POST/PUT/PATCH with body and Content-Type
- Follows redirects (handles trailing slash redirects from Next.js)
- Disables SSL verification (shared hosting has no CA certs)
- Passes through HTTP status codes and Content-Type

### Building the mirror

```bash
# Full rebuild
SOURCE_URL=https://sc10bovu7233.universe.wf \
API_PROXY=https://sc10bovu7233.universe.wf \
SITE_URL=https://mirror.sc10bovu7233.universe.wf \
./scripts/build-static.sh

# Upload to sc10
rsync -avz --delete -e "ssh -i /Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10" \
  out/ sc10bovu7233@terre.o2switch.net:/home/sc10bovu7233/public_html/mirror/
```

Or use the all-in-one sync script:

```bash
./scripts/sync-sc4-to-sc10.sh  # copies DB + uploads from sc4, rebuilds mirror
```

### Key Details

- **Total size**: ~180MB (includes 37MB video)
- **Blog pages**: Client-side JS fetches posts via `/api/blog/posts` → PHP proxy → live server (same-origin, no CORS)
- **Blog detail pages**: Not static — served by fallback 404 or redirect to live server
- **Forms (demo/contact)**: Submit via `/api/demo` → PHP proxy → live server → HubSpot
- **CMS heroes**: Baked into HTML at build time (static snapshot)

### Failover

If Passenger goes down, redirect `sc10bovu7233.universe.wf` to the mirror:

```bash
ssh -i /Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10 \
  sc10bovu7233@terre.o2switch.net \
  "cat > /home/sc10bovu7233/public_html/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteRule ^(.*)$ https://mirror.sc10bovu7233.universe.wf/\$1 [L,R=302]
EOF"
```

To restore Passenger, see `docs/FAILOVER-sc10.md`.
