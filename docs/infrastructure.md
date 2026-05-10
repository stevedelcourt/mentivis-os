# Infrastructure

Reference document for the MentivisOS deployment environment, database architecture, and deployment pipeline.

---

## Hosting Environment

| Property | Value |
|----------|-------|
| Provider | o2switch (shared hosting) |
| Server | `terre.o2switch.net` |
| User | `sc4bovu7233` |
| Node | v20.20.2 via `/opt/alt/alt-nodejs20/root/usr/bin` |
| Process Manager | Passenger (CloudLinux) |
| Live URL | `https://sc4bovu7233.universe.wf` |

### Key Constraints

- **No gcc/g++** in PATH — native Node.js modules cannot be compiled from source
- **Old glibc** — prebuilt `better-sqlite3` binaries require GLIBC_2.29, which is unavailable
- **Shared hosting** — no root access, no Docker, Passenger manages the Node process lifecycle
- **2 CPU cores** — build capped via `experimental.cpus: 2` in `next.config.ts` to prevent OOM

---

## Directory Layout on Server

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

- **Path:** `/home/sc4bovu7233/data/mentivis.db`
- **Persistence:** Survives `git reset --hard` and redeploys (outside repo)
- **WAL mode:** Attempted on init (best-effort with sql.js)
- **Auto-save:** Every `INSERT`/`UPDATE`/`DELETE` triggers `fs.writeFileSync()` of the exported database buffer

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

### `deploy.sh` Step-by-Step

```bash
# 1. Push to GitHub
git push

# 2. SSH to o2switch
ssh -i $SSH_KEY $SSH_USER@$SSH_HOST

# 3. Write .env.local from local environment variables
cat > ${APP_DIR}/.env.local << EOF
INTERNAL_TOKEN=...
CMS_AUTH_SECRET=...
HUBSPOT_PORTAL_ID=...
HUBSPOT_FORM_ID=...
ALLOWED_ORIGINS=...
EOF

# 4. Ensure persistent data directory exists
mkdir -p /home/sc4bovu7233/data/uploads

# 5. Update code
git fetch origin main
git reset --hard origin/main

# 6. Install dependencies
npm install

# 7. Build Next.js (webpack only)
npx next build --webpack

# 8. Copy static assets to standalone output
if [ -d ".next/standalone" ]; then
  mkdir -p .next/standalone/public
  cp -r public/* .next/standalone/public/
  mkdir -p .next/standalone/.next/static
  cp -r .next/static/* .next/standalone/.next/static/
  cp .env.local .next/standalone/.env.local
fi

# 9. Restart Passenger
mkdir -p tmp
touch tmp/restart.txt
```

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
