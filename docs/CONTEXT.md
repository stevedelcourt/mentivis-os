# MentivisOS — Current State

## Product Pages (in order)
### LearningOS
Hero → Edge-to-edge banner (proportions.avif) → FeatureGrid → WorkflowTabs → Showcase → Pipeline (video) → Enterprise → Testimonials → FAQ → CTABlock

### TalentOS
Hero (with TalentOSWave visual) → FeatureGrid → WorkflowTabs → Showcase → Pipeline → Enterprise → Testimonials → FAQ → CTABlock

### Ambassadors
Hero (with ambassador.avif visual) → WHO → HOW → FAQ → Bottom CTA

### Other pages
- `/about` — Hero → Conviction → Histoire → Equipe → Approche → Signatures → Valeurs → CTABlock
- `/security` — Hero (with Icosahedron) → Engagement → Principles → Protections → Infrastructure → CTABlock → FAQ
- `/impact` — Hero (with impact.avif) → Stats → Modules → CTA
- `/tarifs` — pricing plans via CMS API
- `/blog` — CMS-managed blog with category filtering
- `/carrieres` — job listings

## Milestone: v2.1 — Refactor + LocalBusiness JSON-LD (2026-05-16)

### Code Quality Refactor
- **Centralized `useVisible` + `sectionAnim`**: Moved 12 inline copies + 2 duplicate `_shared.ts` files into `hooks/use-visible.ts`. Deleted `talentos/_shared.ts` and `learningos/_shared.ts`. 12 files now import from `@/hooks/use-visible`.
- **Locale keys replacing inline ternaries**: All product section eyebrow/title strings (featureGrid, workflowTabs, showcase, pipeline, enterprise, testimonials, faq) now sourced from `fr.json`/`en.json` via `getT(lang)` instead of inline `lang === "fr" ? ...` ternaries. 14 files.
- **Footer link paths**: Replaced 3 triple-nested ternaries with `Record<string, string>` lookup maps. Fixed locale bugs where EN `"Training & Learning"`, `"Integration"`, `"Developers"` silently fell through to wrong pages.
- **Contact form i18n**: Added `firstName`/`lastName` split keys to demo.form locales. Replaced hardcoded `"Prénom"`, `"Nom"`, `"Merci."` with `t.demo.form.*` keys.
- **Dead CSS removal**: 15 dead animation lines in `talentos-wave.tsx` mobile query (element is `display:none`). 16 dead `data-plan="Gratuit"` hover rules in `tarifs-client.tsx`.
- **CmsPageHero `className` forwarding**: CMS hero pages can now pass `className` through to `PageHero`.
- **+169 / −410 lines net code reduction** across 36 files.

### LocalBusiness JSON-LD (Google Business Listing)
- Added `LocalBusiness` schema with address, phone, and Google Maps URL to CMS SEO defaults.
- New `"Fiche établissement"` tab in `/content-management/seo` (god-editable).
- Schema injected site-wide via `layout.tsx` alongside existing `SoftwareApplication` JSON-LD.
- **Address**: 60 Rue François 1er, 75008 Paris. **Phone**: +33189481002. **Map**: share.google/8UyU2AWo3MXMIhWPa

## Milestone: v2.0 — Mobile + CMS Candidatures (2026-05-16)

### Mobile Layout Overhaul
- **PageHero**: Removed `whiteSpace: "nowrap"`, added optional `className` prop
- **TalentOS**: Wave animation hidden on mobile, feature grid 2 cols, workflow/showcase reverted to side-image layout
- **Security**: Icosahedron animation hidden on mobile (`.security-hero-visual` class)
- **Ambassadors**: Hero image moves below text on mobile (`.amb-hero-visual` class)
- **Demo/Contact**: 30%/70% image/form grid below hero (not inside hero), same `demo-cool.webp` for both
- **Impact stats**: Bar charts larger on mobile (taller bars, wider gaps)
- **Footer**: Produits/Workflows linked to real paths
- **Nav**: Fixed href `carrières` → `carrieres` in mobile accordion (404 fix)
- **CmsPageHero**: Proof field stripped from CMS data (proof only from page defaults)

### CMS Candidatures Badge
- Added `getJobApplicationCount()` in `lib/cms/db.ts` (queries `job_applications` table)
- Created `/api/cms/job-applications/count` API endpoint (calqued on `submissions/count`)
- Added `candidatures` tab to CMS nav with unread badge (blue, same as submissions)

### Tarifs EN Translation
- Hero eyebrow/headline/subheadline now conditional on `lang` prop (FR/EN)

## Recent Major Build (May 2026)
- **CMS Heroes**: All page heroes editable via `/content-management/pages` (homepage, learningos, talentos, about, security, ambassadors)
- **PageHero component**: Shared hero with `CmsPageHero` wrapper fetching from `/api/pages?page=xxx&lang=yy`
- **French accents**: Full pass — `système`, `équipe`, `pédagogique`, `déploiement`, etc. across all files
- **Em dash ban**: All `—` replaced with commas or regular dashes in prose text
- **Arrow unified**: All CTA buttons use `M9 18l6-6-6-6` chevron-right
- **JSON-LD**: Added to learningos, talentos, about, security, ambassadors, impact, carrieres
- **Sitemap**: `/sitemap.xml` — 16 pages × 2 langs, no CMS/videos
- **LLMs.txt**: `/llms.txt` — project overview for AI tools
- **Bilingual footer**: All footer text now locale-driven (fr.json/en.json)
- **FAQ redesign**: LearningOS & TalentOS FAQ match homepage design (2-col, numbered badges, plus/minus toggle)
- **Video player**: Dark glass buttons, chapter thumbnails at 0s/18s/27s/41s/49s
- **Enterprise cards**: #f8f8f8 default with gradient on hover
- **Footer restructure**: WORKFLOWS section, ENTREPRISE restructured, Sécurité moved to bottom bar

## Invariants
- Serif fonts banned everywhere (Inter only)
- No Turbopack (Webpack only)
- No em dashes (—) in prose text
- French text must have proper accents
- Commit before deploy (git push → git reset --hard origin/main)
- All .avif/.svg assets must be git-tracked
- No utility CSS frameworks (Tailwind etc.)
- Bilingual FR/EN, default FR
- Build with `--webpack` flag only
