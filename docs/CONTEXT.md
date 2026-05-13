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
- **Multi-tag categories**: `category` field stores comma-separated values (e.g. `"cas,clients"`), filtered via `.includes()`
- **ImpactSection**: Final 3×2 CSS Grid layout — Big square centered spanning 2 rows, 2 medium squares (1fr each), 2 ghost squares (50% width) tucked in diagonal corners mid-height of Big. All cards `aspect-ratio: 1/1`. MedA `align-self: start`, MedE `align-self: end`. Two layouts (clients/partenariat) mirror-flip left/right columns. Tabs with crossfade via `grid-area: 1/1`.

## Active Tasks
- [x] TransformationTimeline visual polish (6 fixes done, deployed)
- [x] ProductCard descriptions below cards (done, deployed)
- [x] Language switcher in navbar (done, deployed)
- [x] Passenger PORT propagation fix (forced PORT=3001 in server.js, deployed)
- [x] Menu reorganization (multi-phase, deployed)
- [x] Multi-tag category system (types, API, BlogIndex, slug, CMS editor — 8 files)
- [x] ImpactSection — final layout (Big square centered, MedA start/MedE end, ghosts 50% tucked mid-height)
- [ ] Future: SectorShowcase content refinement
- [ ] Future: MathFeaturesSection copy polish
- [ ] Future: Add CMS content tagged `clients`/`cas`/`partenariat`
- [ ] Future: Orb connection arc SVG bezier curve

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
- `ImpactSection` — 3×2 CSS Grid, 1fr 1.58fr 1fr columns, Big square centered, MedA start/MedE end, ghosts 50% tucked mid-height, tabbed (clients/partenariat) with crossfade
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
