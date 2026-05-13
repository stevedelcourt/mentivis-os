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
