# Vercel Deployment — MentivisOS

**Branch:** `vercel` (off `main`)  
**Tag:** `v2.5-integration-mentivis.com`  
**URL:** https://mentivisos.vercel.app  
**Target:** Public site only, no CMS/backoffice. Embedded via iframe on mentivis.com.

## Differences from main

| Aspect | main (o2switch) | vercel (Vercel) |
|--------|-----------------|-----------------|
| DB access | Read/write SQLite | Read-only SQLite (bundled) |
| CMS/backoffice | Full | Blocked via proxy |
| Asset serving | `/statics/` prefix (Apache) | Root (Vercel CDN) |
| Cookie consent | Enabled | Disabled |
| Job applications | Custom form → API | HubSpot native embed |
| Pricing | Hardcoded defaults | Reads from DB |
| Blog images | CMS uploads (o2switch FS) | Synced in `data/uploads/` |
| Login button | Regular link | `target="_blank"` (iframe) |
| Node.js | 20.20.2 (SSH) | 20.x (engines in package.json) |
| Webpack | `--webpack` | `--webpack` |

## Access Control Architecture

**`proxy.ts`** — Next.js proxy middleware (Edge runtime):

1. **Static files** (with file extension) → pass through
2. **API write routes** (`/api/beta-questionnaire`, `/api/cms/*`) → 503
3. **Access check** for non-API routes:
   - IP whitelist: `88.138.77.130` — direct access
   - Referer whitelist: `mentivis.com`, `www.mentivis.com`, `sc3bovu7233.universe.wf` — iframe access
   - Same-origin referer — in-iframe navigation
   - Everything else → 403
4. **Locale redirect**: `/` → `/fr/`, `/blog` → `/fr/blog/`

**Headers** (`next.config.ts`):
- `X-Robots-Tag: noindex, nofollow` — all pages
- `robots.txt` — `Disallow: /`

## Environment Variables (Vercel Dashboard)

| Variable | Value |
|----------|-------|
| `DATA_DIR` | `data` |
| `ALLOWED_REFERRERS` | `https://mentivis.com,https://www.mentivis.com,https://sc3bovu7233.universe.wf,https://mentivis-web.vercel.app` |
| `ALLOWED_IPS` | `88.138.77.130` |
| `ALLOWED_ORIGINS` | `https://mentivisos.vercel.app,https://mentivis.com,https://www.mentivis.com,https://sc3bovu7233.universe.wf,http://localhost:3000` |
| `SITE_URL` | `https://mentivisos.vercel.app` |
| `HUBSPOT_PORTAL_ID` | `49558612` |
| `HUBSPOT_FORM_ID` | `71a2e6a5-1ebe-46ea-9cdf-fe793b95e935` |

## Synced Assets (git-tracked)

- `data/mentivis.db` — production SQLite snapshot (~172KB)
- `data/uploads/*` — CMS-uploaded images (18 files)
- `public/images/visuals/*` — campaign visuals (5 webp)
- `public/PDF/campagne-MentivisOS.pdf` — campaign PDF (~2MB)

## DB Sync

### Manual
```bash
./scripts/sync-vercel-db.sh
```
SSHes into o2switch, copies `mentivis.db` and `data/uploads/`, commits to vercel branch.

### Automated (GitHub Actions)
`.github/workflows/sync-vercel-db.yml` — runs every 4 hours.

Required GitHub Secrets:
- `SSH_KEY` — private key contents
- `SSH_PASSPHRASE` — key passphrase
- `SSH_HOST` — `terre.o2switch.net`
- `SSH_USER` — `sc4bovu7233`

## Deployment

### Via CLI
```bash
git checkout vercel
vercel --prod --yes
```

### Via git push
Push to `vercel` branch triggers Vercel auto-deploy (if connected in Vercel dashboard).

### Build command
```
next build --webpack
```

## Embed on sc3 (mentivis.com)

The sc3 site embeds this via an iframe at:
- `https://mentivis.com/fr/mentivos-website/`
- `https://mentivis.com/en/mentivos-website/`

The sc3 page uses:
```tsx
<iframe
  src="https://mentivisos.vercel.app/{lang}/"
  style={{ width: "100vw", height: "100vh", border: "none", position: "fixed", top: 0, left: 0 }}
  referrerPolicy="unsafe-url"
/>
```

The referrer policy is critical — it ensures the browser sends the `mentivis.com` referrer so the Vercel access control allows the request.

## Known Limitations

- **No CMS/backoffice** — POST/PUT/DELETE to `/api/cms/*` returns 503
- **No beta questionnaire** — POST returns 503
- **DB writes** silently fail (read-only filesystem)
- **CV files** — handled by HubSpot native form, not stored on Vercel
- **CMS uploads** — synced manually via `sync-vercel-db.sh`, must be re-synced when new content is added on production
- **Job application hidden fields** — `job_reference` and `job_title` must exist as hidden fields in HubSpot form `78954872-9038-4a85-8420-ae295c46f90b`

## Key Files

| File | Purpose |
|------|---------|
| `proxy.ts` | Access control middleware |
| `next.config.ts` | Headers, asset tracing, Webpack config |
| `vercel.json` | Build/deploy commands |
| `public/robots.txt` | Block all crawlers |
| `lib/cms/sqlite.ts` | SQLite with `save()` wrapped in try-catch |
| `lib/cms/db.ts` | `getPricing()` reads from DB (not hardcoded) |
| `components/job-detail-client.tsx` | HubSpot native embed form |
| `components/nav-bar.tsx` | Login button with `target="_blank"` |
| `app/[lang]/layout.tsx` | Cookie consent disabled on Vercel |
| `scripts/sync-vercel-db.sh` | DB + uploads sync script |
| `.github/workflows/sync-vercel-db.yml` | Scheduled sync workflow |
