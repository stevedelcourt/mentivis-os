# AGENTS.md : MentivisOS

MentivisOS is an AI-native pedagogical engine, not an LMS, not a catalog.

**Since 2026-09-26 the site is 100 % static.** No Node server, no CMS, no database.
`npm run build` produces `out/`, which is uploaded as is into `public_html`
(FTP or cPanel). Forms are PHP scripts that forward to HubSpot.

**Stack**: Next.js 16.2.6 (`output: "export"`), TypeScript, Webpack only, PHP 8 for forms
**Host**: any Apache host with PHP + curl, `mod_rewrite`, `mod_headers` (o2switch today)
**i18n**: FR/EN, every page under `/fr/` or `/en/`, `/` redirects to `/fr/` (`.htaccess`)
**Content**: files in the repo (see below), read at build time

The last state with CMS, Node API and Passenger is commit `c05638c`
(branch `claude/compassionate-cray-kjww7b`).

## Where content lives

| Content | Source | Notes |
|---|---|---|
| Référentiel (4 pillars + articles, FR/EN) | `content/referentiel/2026-09/{fr,en}/*.md`, `content/referentiel/en-retranslation/*.md`, `lib/cms/referentiel.ts` | `npm run referentiel:import` regenerates `lib/cms/referentiel-2026-09.ts` and `lib/cms/referentiel-en-overrides.ts`. Clusters: `lib/cms/referentiel-clusters.ts` |
| Blog posts | `content/blog/<slug>.json` (Post shape) | EN page only if `contentEn` exists |
| Job offers | `content/jobs/<slug>.json` (Job shape) | detail pages are `noindex` |
| Pricing (FR) | `content/pricing.json` (optional) | EN pricing is hard-coded in `lib/content/defaults.ts` |
| Page heroes | `content/pages.json` (optional) | read by `components/cms-page-hero.tsx` |
| Global SEO / JSON-LD | `content/seo.json` (optional) | defaults in `lib/content/defaults.ts` |
| UI strings | `locales/fr.json`, `locales/en.json` | same keys in both |

One-off import from the old CMS: `npm run content:export` (needs `CMS_AUTH_SECRET`,
run on Steven's machine). Accessors: `lib/content/index.ts`.

## Forms (PHP, HubSpot)

- `public/forms/submit.php`: contact, demo, PDF unlock, summer offer.
- `public/forms/beta.php`: beta questionnaire.
- `public/forms/apply.php`: job applications, PDF CV (6 MB max, `%PDF` signature) uploaded to HubSpot Files (private), then `lien_cv` set on the contact. No CV is stored on the server.
- `public/forms/_lib.php`: config, origin check, per-form rate limit, HubSpot calls. Not reachable over HTTP.
- Secrets live in `~/mentivis-config.php` on the server, one level above `public_html`, never in the repo. Template: `scripts/static-export/mentivis-config.example.php`.

## Build, check, upload

```bash
npm install
npm run build          # next build + out/.htaccess + SEO checks (fails on any error)
npm run preview        # optional: serve out/ on http://localhost:3007
```

Then upload the whole content of `out/` (including the hidden `.htaccess` files) into `public_html`.
`scripts/check-static-export.mjs` validates lang, canonical, reciprocal hreflang, JSON-LD,
breadcrumbs, FAQPage, sitemap and internal links.

## Critical Invariants

- **Webpack ONLY**: `next dev --webpack`, `next build --webpack`. Turbopack = ChunkLoadError.
- **No server features**: no route handlers with Request, no `headers()`/`cookies()`, no middleware, no ISR. Dynamic routes need `generateStaticParams`.
- **Per-page SEO**: every page uses `pageMetadata()` (`lib/seo/page-metadata.ts`) and `BreadcrumbJsonLd`. Never set canonical or hreflang in a layout.
- **Serif fonts banned**: Inter (`var(--font-sans)`) only.
- **No utility CSS frameworks**: custom properties only, no Tailwind.
- **No em dashes (—) in prose**: banned site-wide, FR and EN.
- **French text must have proper accents**: `système`, not `systeme`.
- **OG images are generated JPGs**: `npm run og` (macOS `sips`), 1200x630 in `public/images/og/`. Never `.avif` in `og:image`.
- **All assets under `public/` must be git-tracked.**

## Conventions

- Components: PascalCase, files: kebab-case (assets) / PascalCase (components)
- CSS vars: `--color-*`, `--text-*`, `--font-*`, `--grid-*`
- camelCase variables/functions
- Light, warm design (see `docs/MentivisOS-final-design.md`), left-aligned text, WCAG AA
- Tone: factual, precise. Forbidden: innovation, disruption, révolutionnaire, solution, écosystème

## Context Files

- `docs/progress.md`: work log of the September 2026 SEO/GEO and static migration
- `docs/CONTEXT.md`: current state
- `docs/DECISIONS.md`: decision log
- `docs/COMPONENTS.md`: component topology
- `docs/MANUEL-SERVEURS.md`: servers (section 0 describes the static deployment)

- **Repo**: https://github.com/stevedelcourt/mentivis-os
