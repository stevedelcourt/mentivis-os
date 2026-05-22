# AGENTS.md — MentivisOS

MentivisOS is an AI-native pedagogical engine — not an LMS, not a catalog.

**Stack**: Next.js 16.2.6, TypeScript, Webpack-only, sql.js (WASM SQLite)
**Host**: o2switch shared, Passenger, port 3001, Node 20.20.2
**i18n**: Bilingual FR/EN, default FR, proxy.ts routing
**Data**: SQLite via sql.js, /home/sc4bovu7233/data/ (persistent), auto-backup on deploy
**Auth**: JWT + role-based, async guards

## Critical Invariants

- **Webpack ONLY**: `next dev --webpack`, `next build --webpack`. Turbopack = ChunkLoadError.
- **No better-sqlite3**: GLIBC_2.29 missing, no gcc. sql.js pure JS/WASM only.
- **Commit before deploy**: `deploy.sh` does `git push` → server `git reset --hard origin/main`. Uncommitted changes are wiped.
- **All .avif/.svg assets must be git-tracked**: deploy does `git reset --hard`.
- **Serif fonts banned**: Inter (`var(--font-sans)`) only.
- **No utility CSS frameworks**: Custom properties only, no Tailwind.
- **No em dashes (—) in prose**: Use commas or regular dashes. Banned site-wide.
- **French text must have proper accents**: `système` not `systeme`, `équipe` not `equipe`, etc.
- **o2switch Tiger-Protect blocks `/_next/static/*` URLs**: Files served at `/_next/static/` are intercepted by Apache and blocked with 500. Fix: `assetPrefix=/statics` in `next.config.ts` so Next.js generates URLs as `/statics/_next/static/...`. Apache serves these directly from `~/nextapp/statics/_next/static/` (copied after build in deploy.sh). 3 specific chunk files get `void 0;\n` prepended to bypass Tiger-Protect's content scanning. The server.js must NOT intercept or serve `_next/static` — Apache must handle it directly. (May 2026)

## Architecture Capsule

```
NavBar → MegaMenu, MobileAccordionNav, LanguageSwitcher
PageHero (CMS-driven) → CmsPageHero (fetches from /api/pages?page=)
HeroUnit → ProductCardGrid (3 cards + descriptions)
ProblemSection → SectorShowcase → MathFeaturesSection
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

## Deploy

`./scripts/deploy-unlock.sh` (auto-unlocks SSH, runs deploy)
`./deploy.sh` (requires manual SSH unlock)

Zero-downtime: atomic swap, health check, auto-rollback.
Env: INTERNAL_TOKEN, CMS_AUTH_SECRET, HUBSPOT_PORTAL_ID, HUBSPOT_FORM_ID, ALLOWED_ORIGINS

## Context Files

- `docs/CONTEXT.md` — current state, active tasks
- `docs/COMPONENTS.md` — component topology
- `docs/DECISIONS.md` — decision log
- `docs/infrastructure.md` — full deployment reference

## Critical Invariants

- **Webpack ONLY**: `next dev --webpack`, `next build --webpack`. Turbopack = ChunkLoadError.
- **No better-sqlite3**: GLIBC_2.29 missing, no gcc. sql.js pure JS/WASM only.
- **No onMouseEnter/onMouseLeave on server components**: Use CSS `:hover`.
- **Params returns Promise**: Cast `as Locale` after awaiting.
- **All .avif/.svg assets must be git-tracked**: deploy does `git reset --hard`.
- **Serif fonts banned**: Inter (`var(--font-sans)`) only.
- **No utility CSS frameworks**: Custom properties only, no Tailwind.

## Architecture Capsule

```
NavBar → MegaMenu, MobileAccordionNav, LanguageSwitcher
HeroUnit → ProductCardGrid (3 cards + descriptions)
ProblemSection → SectorShowcase → MathFeaturesSection
TransformationTimeline → ImpactSection → FaqSection
CTABlock (SuperButton 3D SVG) → ArticlesFeaturesSection
FooterBlock
```

## Deploy

`./scripts/deploy-unlock.sh` (auto-unlocks SSH, runs deploy)
`./deploy.sh` (requires manual SSH unlock)

Zero-downtime: atomic swap, health check, auto-rollback.
Env: INTERNAL_TOKEN, CMS_AUTH_SECRET, HUBSPOT_PORTAL_ID, HUBSPOT_FORM_ID, ALLOWED_ORIGINS

## Context Files

- `docs/CONTEXT.md` — current state, active tasks
- `docs/COMPONENTS.md` — component topology
- `docs/DECISIONS.md` — decision log
- `docs/infrastructure.md` — full deployment reference

## Conventions

- Components: PascalCase, files: kebab-case (assets) / PascalCase (components)
- CSS vars: `--color-*`, `--text-*`, `--font-*`, `--grid-*`
- camelCase variables/functions
- Dark mode only, WCAG AA, no parallax
- Tone: factual, precise. Forbidden: innovation, disruption, révolutionnaire, solution, écosystème

## Links

- **Repo**: https://github.com/stevedelcourt/mentivis-os
- **Production**: https://sc4bovu7233.universe.wf
- **Vercel Preview**: https://mentivis-os.vercel.app
