# Component Topology

## Navigation
```
NavBar
├── MegaMenu (desktop dropdowns)
│   ├── learningOS → produits, workflows
│   ├── pipelineOS → produits, workflowsRH
│   ├── mentivisAPI → plateforme, workflows
│   └── ressources → entreprise (blog), initiatives (ambassadors)
├── MobileAccordionNav (mobile fullscreen)
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
│   ├── Orb 1: Désorganisée (blue)
│   ├── Orb 2: Sous tension (orange)
│   ├── Orb 3: Complexifiée (orange-green-purple)
│   ├── Orb 4: Limitée (red)
│   ├── Orb 5: En mutation (orange-teal)
│   ├── Orb 6: Unifiée (teal-pink-blue)
│   └── Orb 7: Adaptative (teal-pink-gold)
├── Satellite (×14) — 2 per orb, orbiting
├── MeasurementBar — 7 ticks with step numbers
└── StageTextPanel — title + description (left-aligned)
ImpactSection
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
