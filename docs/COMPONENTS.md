# Component Topology

## Navigation
```
NavBar
├── MegaMenu (desktop dropdowns)
│   ├── LearningOS → produits, workflows
│   ├── TalentOS → produits, workflowsRH
│   ├── Entreprise → Ressources (blog), Ambassadeurs
│   └── Tarifs → plain link
├── MobileAccordionNav (mobile fullscreen)
│   ├── LearningOS → plain link
│   ├── TalentOS → plain link
│   ├── Entreprise → accordion (blog, ambassadors)
│   └── Tarifs → plain link
└── LanguageSwitcher (FR/EN toggle)
```

## Hero
```
HeroUnit
└── ProductCardGrid
    └── ProductCard (×3) + Description
        ├── Card 1: MentivisOS / Intelligence de formation
        ├── Card 2: TalentOS / Talent Pipeline IA
        └── Card 3: Mentivis API / Connecté à votre écosystème
```

## Body Sections
```
ProblemSection
SectorShowcase
MathFeaturesSection
TransformationTimeline
├── AtmosphereOrb (×7) — glassmorphism orbs with blob gradients
│   ├── Orb 1: Désorganisée (blue) → Orb 7: Adaptative (teal-pink-gold)
├── Satellite (×14) — 2 per orb, orbiting
├── MeasurementBar — 7 ticks with step numbers
└── StageTextPanel — title + description (left-aligned)

ImpactSection — 3×2 CSS Grid use‑cases
├── Tabs: Clients | Partenariat (pill toggle)
├── Layout A (clients):
│   ┌─────────┐ ┌──────────────┐ ┌──────┐
│   │ MedA ↑  │ │   Big ██     │ │Ghost │
│   │         │ │   (carré)    │ │ →↓  │
│   ├─────────┤ │   centré     │ └──────┘
│   │Ghost ←↓│ │              │ ┌─────────┐
│   └─────────┘ │              │ │ MedE ↓ │
│               └──────────────┘ └─────────┘
├── Layout B (partenariat): mirror-flip of cols 1 & 3
├── Grid: 3 cols (1fr 1.58fr 1fr) × 2 rows (auto auto), gap 12px
├── All cards: aspect-ratio 1/1
├── Big (i=0): col 2, row 1/3, centered (no explicit align-self)
├── MedA (i=1): col 1/3 row 1, align-self start
├── MedE (i=2): col 3/1 row 2, align-self end
├── Ghosts (i=3,4): width 50%, aspect-ratio 1/1
│   ├── justifySelf: end (col 1) / start (col 3) — tucked toward Big
│   └── alignSelf: end (row 1) / start (row 2) — mid-height of Big
├── Image overlay: transparent 66% → rgba(0,0,0,.75) (lower third)
└── Mobile: <900px 2-col stacked, <520px 1-col

FaqSection — 8 Q&A accordion
CTABlock
└── SuperButton — 3-layer SVG (bottom/middle/top)
ArticlesFeaturesSection
```

## Shared Components
```
FooterBlock
TopoLines — animated SVG line background
BurgerMorph — spring-animated SVG menu icon
```

## Component → File Map

| Component | File |
|-----------|------|
| NavBar | `components/nav-bar.tsx` |
| MegaMenu | `components/nav/mega-menu.tsx` |
| MobileAccordionNav | `components/nav/mobile-accordion-nav.tsx` |
| HeroUnit | `components/hero-unit.tsx` |
| ProductCardGrid | `components/product-card-grid.tsx` |
| ProblemSection | `components/problem-section.tsx` |
| SectorShowcase | `components/sector-showcase.tsx` |
| MathFeaturesSection | `components/math-features-section.tsx` |
| TransformationTimeline | `components/transformation-timeline.tsx` |
| ImpactSection | `components/impact-section.tsx` |
| FaqSection | `components/faq-section.tsx` |
| CTABlock | `components/cta-block.tsx` |
| SuperButton | `components/super-button.tsx` |
| ArticlesFeaturesSection | `components/articles-features-section.tsx` |
| FooterBlock | `components/footer-block.tsx` |
| TopoLines | `components/topo-lines.tsx` |
