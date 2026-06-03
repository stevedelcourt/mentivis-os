# AGENTS.md — MentivisOS

MentivisOS is an AI-native pedagogical engine — not an LMS, not a catalog.

**Stack**: Next.js 16.2.6, TypeScript, Webpack-only, sql.js (WASM SQLite)
**Host**: o2switch shared, Passenger, Node 20.20.2
**i18n**: Bilingual FR/EN, default FR, proxy.ts routing
**Data**: SQLite via sql.js, persistent in `/data/` (outside repo)
**Auth**: JWT + role-based, async guards

## Servers

| Server | User | SSH Key | URL | Purpose |
|--------|------|---------|-----|---------|
| sc4 | `sc4bovu7233` | `OS_sc4/id_rsa_sc4` (passphrase) | `sc4bovu7233.universe.wf` | Production (CMS source) |
| sc10 | `sc10bovu7233` | `DeployOS-sc10/id_rsa_sc10` (no passphrase) | `sc10bovu7233.universe.wf` | Secondary SSR |
| mirror | — | — | `mirror.sc10bovu7233.universe.wf` | Static fallback |

## Critical Invariants

- **Webpack ONLY**: `next dev --webpack`, `next build --webpack`. Turbopack = ChunkLoadError.
- **No better-sqlite3**: GLIBC_2.29 missing, no gcc. sql.js pure JS/WASM only.
- **Commit before deploy**: `deploy.sh`/`deploy-sc10.sh` does `git push` → server `git reset --hard origin/main`. Uncommitted changes are wiped.
- **All static assets (images, PDFs) must be git-tracked**: deploy does `git reset --hard origin/main`. Any file under `public/` referenced in articles/content that isn't committed will be wiped on the next deploy.
- **Serif fonts banned**: Inter (`var(--font-sans)`) only.
- **No utility CSS frameworks**: Custom properties only, no Tailwind.
- **No em dashes (—) in prose**: Use commas or regular dashes. Banned site-wide.
- **French text must have proper accents**: `système` not `systeme`, `équipe` not `equipe`, etc.
- **o2switch Tiger-Protect blocks `/_next/static/*` URLs**: Fix: `assetPrefix=/statics` in build. Apache serves from `~/nextapp/statics/_next/static/`. 3 chunks get `void 0;\n` prepended. (May 2026)
- **No mod_proxy on o2switch subdomains**: Mirror uses PHP-based proxy (`proxy.php`) instead.

## Architecture Capsule

```
NavBar → MegaMenu, MobileAccordionNav, LanguageSwitcher
PageHero (CMS-driven) → CmsPageHero (fetches from /api/pages)
HeroUnit → ProductCardGrid → ProblemSection → SectorShowcase
TransformationTimeline → ImpactSection → FaqSection
CTABlock → SuperButton (3D SVG), ArticlesFeaturesSection
FooterBlock (bilingual via locale keys)
```

## CMS Heroes
All page heroes are CMS-editable via `/content-management/pages`:
- `homepage`, `learningos`, `talentos`, `about`, `security`, `ambassadors`
- Each has FR/EN hero content stored in `pages` table
- `CmsPageHero` component fetches from `/api/pages?page=xxx&lang=yy`
- Falls back to hardcoded defaults on API failure
- Sitemap at `/sitemap.xml` (no CMS, no videos)
- LLMs.txt at `/llms.txt`

## JSON-LD
- `/layout.tsx`: homepage `SoftwareApplication` schema
- Each product/info page has inline `<script type="application/ld+json">`
- CMS SEO system supports `homepage, tarifs, blog, learningos, talentos, about, security, ambassadors, impact, carrieres`
- `lib/cms/db.ts` `saveSeo()` / `getSeo()` manage per-page SEO data

## Deploy — sc4

```bash
cd /Users/stv/Documents/zed/OS_sc4/mentivis-os
./scripts/deploy-unlock.sh   # auto-unlocks SSH key, runs deploy.sh
```

Push to GitHub → Vercel auto-deploy.

## Deploy — sc10 (secondary SSR, no Vercel)

```bash
cd /Users/stv/Documents/zed/DeployOS-sc10/mentivis-os
set -a && source .env.deploy && set +a
./deploy-sc10.sh
```

## Sync CMS content sc4 → sc10 + mirror

```bash
cd /Users/stv/Documents/zed/DeployOS-sc10/mentivis-os
./scripts/sync-sc4-to-sc10.sh
```

Copies DB + uploads from sc4, restarts sc10, rebuilds mirror.

## Mirror (static fallback)

URL: `https://mirror.sc10bovu7233.universe.wf`
Built via `scripts/build-static.sh` (see `docs/infrastructure.md`).
Failover procedure: `docs/FAILOVER-sc10.md`.

## Context Files

- `docs/CONTEXT.md` — current state, active tasks
- `docs/COMPONENTS.md` — component topology
- `docs/DECISIONS.md` — decision log
- `docs/infrastructure.md` — full deployment reference
- `docs/FAILOVER-sc10.md` — Passenger down procedure

## Conventions

- Components: PascalCase, files: kebab-case (assets) / PascalCase (components)
- CSS vars: `--color-*`, `--text-*`, `--font-*`, `--grid-*`
- camelCase variables/functions
- Dark mode only, WCAG AA, no parallax
- Tone: factual, precise. Forbidden: innovation, disruption, révolutionnaire, solution, écosystème

## Links

- **Repo**: https://github.com/stevedelcourt/mentivis-os
- **sc4 (production)**: https://sc4bovu7233.universe.wf
- **sc10 (secondary)**: https://sc10bovu7233.universe.wf
- **Mirror**: https://mirror.sc10bovu7233.universe.wf
