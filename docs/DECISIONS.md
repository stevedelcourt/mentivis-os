# Decision Log

## 2026-05-13

### Menu Reorganisation
**Problem**: Nav order confusing (Ressources before Entreprise), MentivisAPI not needed in nav.
**Decision**: Swapped Entreprise/Ressources, hid MentivisAPI. Final order: LearningOS | TalentOS | Entreprise | Tarifs. Desktop: plain links for LearningOS/TalentOS, mega-menu for Entreprise. Mobile: accordion for Entreprise only, plain links for others.
**Status**: ✅ Deployed

### Multi-Tag Categories
**Problem**: Posts needed to appear in multiple category filters (e.g. both "cas" and "clients").
**Decision**: Store comma-separated values in `category` field (e.g. `"cas,clients"`), filter via `.includes()`.
**Files**: types.ts, db.ts, route.ts, BlogIndex.tsx, slug page, CMS editor — 8 files total.
**Status**: ✅ Deployed

### ImpactSection — Final Layout
**Problem**: Previous iterations used absolute positioning + JS height calculation (`squarify()`), then overlapping absolute grids, then CSS grid with `align-self: stretch` on Big and margins on mediums — none matched the required visual.
**Decision**: Final approach — pure CSS Grid with no JS, no margins, no calc:
- `grid-template-columns: 1fr 1.58fr 1fr`
- `grid-template-rows: auto auto`
- `gap: 12px`
- All cards `aspect-ratio: 1/1` (no stretch ever)
- Big: col 2, row 1/3, centered (no explicit align-self)
- MedA: col 1/3 row 1, `align-self: start`
- MedE: col 3/1 row 2, `align-self: end`
- Ghosts: `width: 50%`, `aspect-ratio: 1/1`, tucked toward Big via `justify-self: end/start`, mid-height via `align-self: end/start`
- Two layouts (clients/partenariat) mirror-flip cols 1 & 3
- Crossfade via `grid-area: 1/1` on two overlapping `.impact-grid` divs
- Image overlay: `transparent 66% → rgba(0,0,0,.75)` (lower third only)
- Mobile: `<900px` 2-col, `<520px` 1-col

**Key insight**: MedA aligns with Big's top (both at row 1 start), MedE aligns with Big's bottom (both at row 2 end). Ghosts sit at midpoint via opposing row edges. No math needed — the grid auto-rows + alignment handles it intrinsically.
**Committed**: 568dbeb
**Status**: ✅ Deployed and verified

## 2026-05-12

### Port 3001
**Problem**: Port 3000 permanently occupied by lsphp/Passenger error server, causing EADDRINUSE.
**Decision**: Set PORT=3001 in server.js, deploy.sh, and .env.local.
**Update (2026-05-13)**: Changed `server.js` from `process.env.PORT || '3001'` to `process.env.PORT = '3001'` to override any Passenger-injected PORT value. Added startup logging for visibility.
**Status**: ✅ Fixed

### Homepage Reordering
**Problem**: Homepage had 15+ sections, narrative was unfocused.
**Decision**: Strip to 9 sections: Hero → Problem → Sectors → MathFeatures → Timeline → Impact → FAQ → CTA → Articles.
**Removed**: NotLmsSection, IntegrationSection, EngineShowcase, ModulesSection, BentoSection, ProofSection, ShiftsSection, CombinationSection.
**Status**: ✅ Deployed

### TransformationTimeline
**Problem**: Company history timeline not relevant to prospects.
**Decision**: Replace with 7-stage organizational transformation journey (Avant/Apres).
**Features**: Glassmorphism orbs, floating animation, measurement bar, divider badge.
**Status**: ✅ Deployed

### SuperButton
**Problem**: CTA needed visual punch.
**Decision**: 3D layered SVG button (bottom/middle/top layers).
**Behavior**: Hover → middle drops down; Press → all compress deep.
**Status**: ✅ Deployed

### Orb Float Behavior
**Problem**: Active orb covering label when scaled.
**Decision**: All orbs float (not just inactive). Active orb grows upward from center top. Dynamic marginBottom pushes label clear.
**Status**: ✅ Deployed

### Language Switcher
**Problem**: No way to switch language on site.
**Decision**: Add FR/EN toggle right of Login button in navbar.
**Status**: ✅ Deployed

### Product Card Descriptions
**Problem**: Cards lacked context below them.
**Decision**: Add plain text descriptions below each card (bilingual FR/EN).
**Status**: ✅ Deployed

### ImpactSection Simplification
**Problem**: Bento grid was over-engineered.
**Decision**: Simplified to text-only block emphasizing pedagogical expertise.
**Status**: ✅ Deployed (replaced by final layout on 2026-05-13)

### InteractiveExplainer Relocation
**Problem**: Too heavy for homepage load.
**Decision**: Moved from homepage to /composants page (component showcase).
**Status**: ✅ Deployed

## 2026-05-11

### SQLite Migration
**Problem**: JSON file storage fragile, not scalable.
**Decision**: Migrated to sql.js (pure JS/WASM) SQLite. better-sqlite3 blocked by GLIBC_2.29.
**Status**: ✅ Deployed

### Zero-Downtime Deploy
**Problem**: Deploys caused downtime.
**Decision**: Atomic swap strategy — build to standalone-new, swap atomically, health check, cleanup.
**Status**: ✅ Deployed

### CMS Mobile Support
**Problem**: CMS admin not usable on mobile.
**Decision**: Added responsive layouts, touch-friendly controls, mobile nav.
**Status**: ✅ Deployed

### Auth Role Fix
**Problem**: Role-based access control had async bugs.
**Decision**: Fixed requireRole() to properly await and return 403 for unauthorized.
**Status**: ✅ Deployed
