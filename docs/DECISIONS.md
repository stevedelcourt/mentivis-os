# Decision Log

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
