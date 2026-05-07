# PROCESS.md — MentivisOS Development Workflow

## Phase 1: Foundation

1. **Set up project scaffolding**
   - Initialize framework (Next.js / Astro / chosen stack)
   - Configure CSS custom properties from design tokens (§2 of design doc)
   - Set up font loading with `font-display: swap` and system fallbacks

2. **Build core layout primitives**
   - 12-column grid system with CSS Grid
   - Container widths: `--container-max` (1280px), `--container-wide` (1440px)
   - Blueprint grid overlay component (SVG or CSS background pattern)
   - Section gap spacing: `clamp(80px, 10vw, 160px)`

3. **Implement design tokens**
   - Color system (§2)
   - Typography scale (§3)
   - Layout variables (§4)
   - Button system (§17)

---

## Phase 2: Shared Components

Build in this order (dependencies flow downward):

1. `<NavBar />` — fixed, 56px, scroll-aware opacity
2. `<FooterBlock />` — four-column layout
3. `<CTABlock />` — reusable CTA patterns
4. `<CustomCursor />` — amber circle with trailing effect
5. `<StatCard />` — animated counter with IntersectionObserver
6. `<ArticleCard />` — blog card with hover states

---

## Phase 3: Homepage Sections

Build sections in scroll order:

1. **Hero** (`<HeroUnit />`) — 100vh, wireframe background, marquee strip
2. **Product Suite Strip** (`<ProductCard />` × 3)
3. **Social Proof Rail** (`<SocialProofRail />`) — dual-row auto-scroll
4. **MentivisAtelier Deep Dive** — 7/5 split, `<BentoGrid />`, client evidence strip
5. **MentivisOperate Deep Dive** — 5/7 split (flipped), `<AccordionFeature />`
6. **MentivisIntel Deep Dive** — full-width, `<DashboardMock />`, metric callouts
7. **Timeline** (`<TimelineNode />` × 6) — scroll-driven fill animation
8. **Trust & Compliance** — three-column typographic treatment
9. **Final CTA** — full-bleed, watermark background
10. **Blog Strip** (`<ArticleCard />` × 3)

---

## Phase 4: Inner Pages

Follow the site structure in `mentivisOS_website_structure_v2.md`:

1. `/produit/` — Product overview
2. `/produit/diagnostic/` — Diagnostic deep dive
3. `/produit/programme/` — Program generation
4. `/produit/assistant/` — Embedded assistant
5. `/pour-qui/individuel/` — Individual segment
6. `/pour-qui/corporate/` — Corporate segment
7. `/pour-qui/formation/` — Training organizations
8. `/pour-qui/competences/` — ESN & consulting
9. `/integration/` — Integration overview
10. `/integration/acces-direct/` — Direct access
11. `/integration/licence-entreprise/` — Enterprise license
12. `/integration/api/` — API integration
13. `/demo/` — Demo request form (primary conversion)
14. `/a-propos/` — About page
15. `/ressources/insights/` — Blog listing
16. `/ressources/guides/` — Downloadable guides

---

## Phase 5: Polish & Performance

1. **Animation audit**
   - All entry animations: 400ms, stagger 50ms
   - Hover transitions: 180ms ease-out
   - Scroll-driven effects: timeline fill, stat counters
   - `prefers-reduced-motion` compliance

2. **Responsive testing**
   - Mobile (< 768px): single column, hamburger nav, vertical timeline
   - Tablet (768–1024px): two-column bento, reduced timeline nodes
   - Desktop (> 1024px): full design as specified

3. **Performance optimization**
   - Inline critical CSS for hero
   - Lazy-load below-the-fold imagery
   - Font subsetting where possible
   - Preload hero wireframe asset

4. **Accessibility audit**
   - Color contrast verification (WCAG AA minimum)
   - Focus indicators (amber, 2px outline, 2px offset)
   - Keyboard navigation testing
   - Screen reader testing

5. **Lighthouse targets**
   - Performance: 90+
   - Accessibility: 98+
   - Best Practices: 100
   - SEO: 95+

---

## Quality Gates

Before committing any section or page:

- [ ] Matches design spec (colors, type, spacing, motion)
- [ ] Responsive at all three breakpoints
- [ ] No hardcoded values — all tokens referenced
- [ ] `prefers-reduced-motion` respected
- [ ] WCAG AA contrast verified
- [ ] Focus indicators visible and styled
- [ ] No layout shift on load
- [ ] French content matches `mentivisOS_website_structure_v2.md`
- [ ] No forbidden vocabulary (innovation, disruption, etc.)
- [ ] One primary CTA per page

---

## Git Workflow

- Feature branches: `feature/<section-name>`
- Commit messages: imperative mood, concise
- No commits without passing quality gates
- Squash merge to main after review
