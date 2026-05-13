# MentivisOS — Current State

## Homepage Sections (in order)
HeroUnit → ProblemSection → SectorShowcase → MathFeaturesSection → TransformationTimeline → ImpactSection → FaqSection → CTABlock (SuperButton) → ArticlesFeaturesSection

## Recent Decisions
- **Port 3001**: Port 3000 permanently occupied by lsphp/Passenger error server
- **TransformationTimeline**: Replaced company-history timeline, 7-stage constellation
- **SuperButton**: 3D layered SVG (bottom/middle/top), hover down, press deep, no text overlay
- **Homepage stripped**: Removed 6 legacy sections, focused 9-section narrative
- **InteractiveExplainer**: Moved to /composants page
- **Menu reorg**: Swapped Entreprise/Ressources, hid MentivisAPI; final order: LearningOS | TalentOS | Entreprise | Tarifs
- **Multi-tag categories**: `category` field stores comma-separated values, filtered via `.includes()`
- **ImpactSection**: Final layout — 3 columns × 1 row CSS Grid (`1fr 1.58fr 1fr`). Big in col 2, MedA `align-self: start` (top = Big top), MedE `align-self: end` (bottom = Big bottom). All `aspect-ratio: 1/1`. No ghosts, no translateY, no margins, no calc. Tabs with crossfade via `grid-area: 1/1`. Hover `translateY(-4px)`. Hidden on mobile (< 768px).

## Active Tasks
- [x] TransformationTimeline visual polish
- [x] ProductCard descriptions below cards
- [x] Language switcher in navbar
- [x] Menu reorganization (multi-phase)
- [x] Multi-tag category system
- [x] ImpactSection — final 3×1 grid, no ghosts, pure align-self
- [ ] Future: SectorShowcase content refinement
- [ ] Future: MathFeaturesSection copy polish
- [ ] Future: Add CMS content tagged `clients`/`cas`/`partenariat`

## Component Inventory

### Navigation
- `NavBar` — fixed header, mega menus, mobile accordion, language switcher
- `MegaMenu` — desktop dropdown menus (fit-content width, maxWidth 640px, nowrap)
- `MobileAccordionNav` — mobile fullscreen nav (accordion for Entreprise only)
- `LanguageSwitcher` — FR/EN toggle (right of Login)

### Hero
- `HeroUnit` — hero text + ProductCardGrid
- `ProductCardGrid` — 3 gradient cards + descriptions
- `ProductCard` — gradient card with tag + title

### Body
- `ProblemSection` — 2-col grid
- `SectorShowcase` — 4-tab sector showcase with .avif images
- `MathFeaturesSection` — NOTRE APPROCHE, 3 cards (Precision/Structure/Continuité)
- `TransformationTimeline` — 7-stage orb constellation, measurement bar, divider
- `ImpactSection` — 3×1 CSS Grid, 1fr 1.58fr 1fr, Big center, MedA start/MedE end, all square, no ghosts, tabbed with crossfade
- `FaqSection` — 8-question accordion
- `CTABlock` — white rounded card + SuperButton
- `ArticlesFeaturesSection` — blog/articles grid

### Shared
- `SuperButton` — 3D layered SVG button
- `FooterBlock` — site footer
- `TopoLines` — animated SVG background

## Invariants
- Serif fonts banned everywhere (Inter only)
- No Turbopack (Webpack only)
- No onMouseEnter/onMouseLeave on server components
- All .avif/.svg assets must be git-tracked
- No utility CSS frameworks (Tailwind etc.)
- Bilingual FR/EN, default FR
- Build with `--webpack` flag only
- Async DB layer (always await getPublishedPosts(), etc.)
- Async auth guards (always await requireAuth())
