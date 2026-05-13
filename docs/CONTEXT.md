# MentivisOS — Current State

## Homepage Sections (in order)
HeroUnit → ProblemSection → SectorShowcase → MathFeaturesSection → TransformationTimeline → ImpactSection → FaqSection → CTABlock (SuperButton) → ArticlesFeaturesSection

## Recent Decisions
- **Port 3001**: Port 3000 permanently occupied by lsphp/Passenger error server
- **TransformationTimeline**: Replaced company-history timeline, 7-stage constellation
- **SuperButton**: 3D layered SVG (bottom/middle/top), hover down, press deep, no text overlay
- **Homepage stripped**: Removed 6 legacy sections (NotLmsSection, IntegrationSection, EngineShowcase, ModulesSection, BentoSection, ProofSection), focused 9-section narrative
- **InteractiveExplainer**: Moved to /composants page
- **ImpactSection**: Simplified to text-only block

## Active Tasks
- [x] TransformationTimeline visual polish (6 fixes done, deployed)
- [x] ProductCard descriptions below cards (done, deployed)
- [x] Language switcher in navbar (done, deployed)
- [x] Passenger PORT propagation fix (forced PORT=3001 in server.js, deployed)
- [x] Verify HTTPS health check after deploy — passed on first attempt
- [ ] Future: SectorShowcase content refinement
- [ ] Future: MathFeaturesSection copy polish

## Component Inventory

### Navigation
- `NavBar` — fixed header, mega menus, mobile accordion, language switcher
- `MegaMenu` — desktop dropdown menus
- `MobileAccordionNav` — mobile fullscreen nav
- `LanguageSwitcher` — FR/EN toggle (right of Login)

### Hero
- `HeroUnit` — hero text + ProductCardGrid
- `ProductCardGrid` — 3 gradient cards + descriptions
- `ProductCard` — gradient card with tag + title

### Body
- `ProblemSection` — 2-col grid, "L'infrastructure que le marché attendait."
- `SectorShowcase` — 4-tab sector showcase with .avif images
- `MathFeaturesSection` — NOTRE APPROCHE, 3 cards (Precision/Structure/Continuité)
- `TransformationTimeline` — 7-stage orb constellation, measurement bar, divider
- `ImpactSection` — text-only expertise block
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
