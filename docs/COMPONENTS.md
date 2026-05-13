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
├── Satellite (×14) — 2 per orb, orbiting
├── MeasurementBar — 7 ticks with step numbers
└── StageTextPanel — title + description (left-aligned)

ImpactSection — 3×1 CSS Grid, 3 use‑cases layout
├── Tabs: Clients | Partenariat (pill toggle)
├── Grid: 3 cols (1fr 1.58fr 1fr) × 1 row (auto), gap 12px
├── All cards: aspect-ratio 1/1
├── Big (i=0): col 2, fills row height (1.58W)
├── MedA (i=1): col 1 (clients) / col 3 (partenariat), align-self start → top = Big top
├── MedE (i=2): col 3 (clients) / col 1 (partenariat), align-self end → bottom = Big bottom
├── Image overlay: transparent 66% → rgba(0,0,0,.75) (lower third, photo cards)
├── Hover: translateY(-4px)
└── Mobile: hidden < 768px

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
