# Decision Log

## 2026-05-16

### Centralized Animation Hooks
**Problem**: `useVisible` and `sectionAnim` duplicated across 12+ files, plus identical `_shared.ts` in both `talentos/` and `learningos/`. A proper `hooks/use-visible.ts` existed but was never imported.
**Decision**: Move `sectionAnim` into `hooks/use-visible.ts`, delete both `_shared.ts` files, all components import from `@/hooks/use-visible`.
**Status**: ✅ Deployed

### Inline Ternaries → Locale Keys
**Problem**: 50+ instances of `lang === "fr" ? "..." : "..."` across product components bypassing the locale system. Locale keys (talentosPage/learningosPage.*.eyebrow/title) already populated in `fr.json`/`en.json` but unused.
**Decision**: Import `getT(lang)` in every product section component, replace all inline ternaries with `t.*.eyebrow`/`t.*.title`. Feature grid eyebrow changed from duplicated "FONCTIONNALITÉS CLÉS" to distinct "Capacités" (matching locale intent).
**Status**: ✅ Deployed

### Footer Link Lookup Maps
**Problem**: Triple-nested ternaries for Produits, Workflows, and Entreprise link paths were unmaintainable and silently linked wrong pages for locale-sourced labels (EN "Training & Learning" → /talentos instead of /learningos).
**Decision**: Replace all three with `Record<string, string>` lookup maps. Added all FR/EN locale variants as keys.
**Status**: ✅ Deployed

### Contact Form Split Names
**Problem**: Contact form had separate Prénom/Nom fields but locale only had a combined "Prenom et nom" key.
**Decision**: Split into `firstName` + `lastName` locale keys (FR: Prénom/Nom, EN: First name/Last name). Success message "Merci." replaced with `t.demo.form.success`.
**Status**: ✅ Deployed

### Google Business Listing via CMS SEO
**Problem**: No `LocalBusiness` schema for Google Maps/business listing. Address/phone existed only on /about page as plain `Organization`.
**Decision**: Add `business` page to CMS SEO system (editable by god role). Inject `LocalBusiness` JSON-LD site-wide from `layout.tsx`. Default includes address (60 Rue François 1er, 75008 Paris), phone (+33189481002), and Google Maps URL.
**Status**: ✅ Deployed

### Dead CSS Cleanup
**Problem**: `talentos-wave.tsx` animated element dimensions inside mobile media query where element is `display:none`. `tarifs-client.tsx` had 16 lines of hover overrides for `data-plan="Gratuit"` which doesn't exist.
**Decision**: Remove dead CSS. 31 lines removed.
**Status**: ✅ Deployed

## 2026-05-16

### Mobile Wave/Icosahedron Hiding
**Problem**: TalentOS wave animation and Security icosahedron caused scroll/performance issues and layout breaks on mobile.
**Decision**: Hide both via `display: none` at 768px breakpoint (TalentOSWave: CSS, Icosahedron: `.security-hero-visual` class).
**Status**: ✅ Deployed

### Demo/Contact 30/70 Layout
**Problem**: Demo and contact pages had inconsistent image placement; image inside hero visual caused alignment issues with form.
**Decision**: Place `<Grid cols={[3, 7]}>` below hero section — image 30% left, ContactForm 70% right. Image `margin-top: 120px` to align with form title. Same `demo-cool.webp` for both pages.
**Status**: ✅ Deployed

### Ambassador Hero Mobile Stack
**Problem**: Hero image overlapped text on mobile.
**Decision**: Force single column on mobile with `.amb-hero-visual` image full-width below headline/text.
**Files**: `ambassadors-page-client.tsx`
**Status**: ✅ Deployed

### CMS Proof Stripping
**Problem**: CMS `proof` field appearing on pages that shouldn't show it (e.g. TalentOS).
**Decision**: `CmsPageHero` strips `proof` from CMS response on merge. Proof only shown from page defaults.
**Status**: ✅ Deployed

### CMS Candidatures Badge
**Problem**: No way to see unread job applications from CMS nav.
**Decision**: Add `getJobApplicationCount()` query, `/api/cms/job-applications/count` endpoint, `candidatures` tab in `CmsLayout` with unread badge.
**Files**: `lib/cms/db.ts`, `app/api/cms/job-applications/count/route.ts`, `components/cms/CmsLayout.tsx`
**Status**: ✅ Deployed

### Tarifs EN Translation
**Problem**: Tarifs hero text hardcoded in French on EN version.
**Decision**: Conditional render based on `lang` prop for eyebrow, headline, subheadline.
**Files**: `components/tarifs-client.tsx`
**Status**: ✅ Deployed

## 2026-05-13

### Menu Reorganisation
**Problem**: Nav order confusing (Ressources before Entreprise), MentivisAPI not needed in nav.
**Decision**: Swapped Entreprise/Ressources, hid MentivisAPI. Final order: LearningOS | TalentOS | Entreprise | Tarifs.
**Status**: ✅ Deployed

### Multi-Tag Categories
**Problem**: Posts needed to appear in multiple category filters.
**Decision**: Store comma-separated values in `category` field, filter via `.includes()`.
**Files**: types.ts, db.ts, route.ts, BlogIndex.tsx, slug page, CMS editor — 8 files.
**Status**: ✅ Deployed

### ImpactSection — Final Layout
**Problem**: Previous iterations used absolute positioning + JS (`squarify()`), overlapping grids, complex margins/transforms — none matched the required visual consistently across viewports.
**Decision**: Pure CSS Grid, single row. No JS, no margins, no calc, no translateY, no ghosts.
- `grid-template-columns: 1fr 1.58fr 1fr`
- `grid-template-rows: auto` (1 row)
- `gap: 12px`
- All cards `aspect-ratio: 1/1` (no stretch)
- Big (i=0): col 2, fills row height (1.58W) via auto row
- MedA (i=1): col 1/3, `align-self: start` → top = Big top
- MedE (i=2): col 3/1, `align-self: end` → bottom = Big bottom
- Two layouts (clients/partenariat) swap cols 1 & 3
- Crossfade via `grid-area: 1/1` on two `.impact-grid` divs
- Hover `translateY(-4px)` restored (no inline transform conflict)
- Hidden on mobile < 768px

**Key insight**: Single `auto` row height is driven by Big's intrinsic height (1.58W from aspect-ratio). MedA and MedE (W tall) simply align to top/bottom of the row via `align-self`. No offsets needed — the row IS Big's height.
**Committed**: 5800655
**Status**: ✅ Deployed and verified

## 2026-05-12

### Port 3001
**Problem**: Port 3000 permanently occupied by lsphp/Passenger error server.
**Decision**: Set PORT=3001. Override in server.js with `process.env.PORT = '3001'`.
**Status**: ✅ Fixed

### Homepage Reordering
**Problem**: Homepage had 15+ sections, narrative unfocused.
**Decision**: Strip to 9 sections: Hero → Problem → Sectors → MathFeatures → Timeline → Impact → FAQ → CTA → Articles.
**Removed**: NotLmsSection, IntegrationSection, EngineShowcase, ModulesSection, BentoSection, ProofSection, ShiftsSection, CombinationSection.
**Status**: ✅ Deployed

### TransformationTimeline
**Problem**: Company history timeline not relevant to prospects.
**Decision**: Replace with 7-stage organizational transformation journey.
**Status**: ✅ Deployed

### SuperButton
**Problem**: CTA needed visual punch.
**Decision**: 3D layered SVG button (bottom/middle/top layers).
**Status**: ✅ Deployed

### Orb Float Behavior
**Problem**: Active orb covering label when scaled.
**Decision**: All orbs float. Active orb grows upward from center top.
**Status**: ✅ Deployed

### Language Switcher
**Problem**: No way to switch language.
**Decision**: Add FR/EN toggle right of Login button.
**Status**: ✅ Deployed

### Product Card Descriptions
**Problem**: Cards lacked context below them.
**Decision**: Add plain text descriptions below each card (bilingual).
**Status**: ✅ Deployed

### InteractiveExplainer Relocation
**Problem**: Too heavy for homepage load.
**Decision**: Moved to /composants page.
**Status**: ✅ Deployed

## 2026-05-11

### SQLite Migration
**Problem**: JSON file storage fragile, not scalable.
**Decision**: Migrated to sql.js (pure JS/WASM) SQLite.
**Status**: ✅ Deployed

### Zero-Downtime Deploy
**Problem**: Deploys caused downtime.
**Decision**: Atomic swap — build to standalone-new, swap atomically, health check, cleanup.
**Status**: ✅ Deployed

### CMS Mobile Support
**Problem**: CMS admin not usable on mobile.
**Decision**: Added responsive layouts, touch-friendly controls.
**Status**: ✅ Deployed

### Auth Role Fix
**Problem**: Role-based access control had async bugs.
**Decision**: Fixed requireRole() to properly await and return 403.
**Status**: ✅ Deployed
