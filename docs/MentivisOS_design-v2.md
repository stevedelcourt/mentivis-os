# MentivisOS — Design System & Page Architecture

## 1. Design Philosophy

MentivisOS is not a marketing website. It is an operating room. Every design decision must communicate one thing: this is a platform built by practitioners who have already done the work, not consultants selling a slide deck.

The aesthetic register is **architectural precision meets editorial authority**. Think: a Renzo Piano blueprint rendered in editorial ink. Dense information hierarchy, no decorative excess, but enormous visual confidence. Dark mode by default, not as a trend choice but as a statement that this product operates in professional environments where screen time matters and visual fatigue is real.

The reference aesthetic sits between two poles: the disciplined darkness of Linear and the structural seriousness of a French Grand Ecole prospectus. The result is a site that feels simultaneously like a tech product and a strategic partner you want in the room.

**One unforgettable thing**: every section of the site has a visible "operating layer" — faint technical grid lines in the background that recall architectural blueprints, reinforcing that MentivisOS is a builder's tool, not an advisor's brochure.

---

## 2. Color System

All values expressed in CSS custom properties. The palette is intentionally narrow: domination by two foundational tones, one structural accent, and two signal colors.

```css
:root {
  --color-ground:      #080808;   /* Near-black. Page background. */
  --color-surface-1:   #111111;   /* Card and panel background. */
  --color-surface-2:   #1A1A1A;   /* Elevated surface, modals, drawers. */
  --color-border:      #232323;   /* All structural borders. */
  --color-border-soft: #1C1C1C;   /* Subtle dividers. */

  --color-ink-primary:   #F0EDE6; /* Main body and heading text. Warm off-white, not pure. */
  --color-ink-secondary: #8A8680; /* Secondary labels, captions, metadata. */
  --color-ink-tertiary:  #504E4B; /* Placeholder text, disabled states. */

  --color-accent:        #C8A96E; /* Warm amber-gold. French architectural stone. Primary CTA. */
  --color-accent-dim:    #7A6540; /* Muted accent. Hover states on dark surfaces. */
  --color-accent-glow:   rgba(200, 169, 110, 0.12); /* Ambient glow for accent elements. */

  --color-signal-green:  #4CAF7D; /* Success, active, deployed. */
  --color-signal-red:    #E05C5C; /* Error, alert. */
  --color-signal-blue:   #5C8AE0; /* Info, in progress. */
}
```

### Usage rules

- `--color-ground` is the only true background. No white pages anywhere.
- `--color-accent` appears sparingly: primary CTA buttons, active nav indicators, key metric callouts, timeline node markers, and one decorative element per section maximum.
- All gradients are tight and directional: `linear-gradient(135deg, #111111 0%, #0D0D0D 100%)`. No rainbow, no purple, no generic tech.
- The blueprint grid overlay is drawn in `rgba(200, 169, 110, 0.03)` on `--color-ground` — barely perceptible but present throughout.

---

## 3. Typography

Three typefaces. No exceptions.

```css
/* Display: Headings, hero titles, section anchors */
--font-display: 'Editorial New', 'Playfair Display', serif;
/* Fallback stack ensures the editorial character survives. */

/* Interface: Navigation, labels, captions, buttons, data */
--font-interface: 'ABC Diatype', 'DM Mono', monospace;
/* Gives a technical, precise quality to all UI chrome. */

/* Body: Long-form text, descriptions, case study copy */
--font-body: 'Suisse Intl', 'Neue Haas Grotesk', 'Helvetica Neue', sans-serif;
/* The workhorse. Neutral enough to carry meaning without competing with Display. */
```

### Type scale

```css
--text-hero:    clamp(52px, 7vw, 96px);   /* Hero H1. One per page. */
--text-display: clamp(36px, 4.5vw, 64px); /* Section titles. */
--text-title:   clamp(24px, 3vw, 40px);   /* Card and feature headings. */
--text-heading: clamp(18px, 2vw, 24px);   /* Subheadings, feature names. */
--text-body:    16px;                       /* Base reading size. */
--text-small:   14px;                       /* Captions, labels, metadata. */
--text-micro:   11px;                       /* Legal, system text, timestamps. */
```

### Type rules

- `--font-display` always set in `font-weight: 300` for editorial lightness. The contrast between thin serif and dark ground creates tension.
- `--font-interface` used for all navigation items, numbered labels (01, 02, 03), button text, stat figures, and code-adjacent content. Its monospaced character codes every UI element as precise and engineered.
- Line height for body: `1.7`. For display: `1.05`. Tight at scale, generous for reading.
- Letter spacing: display titles get `letter-spacing: -0.03em` to collapse the serifs into solidity.
- All caps restricted to: section index labels, nav items, button text, and tag chips. Never applied to headlines or body.

---

## 4. Layout and Grid

```css
--grid-columns:  12;
--grid-gutter:   clamp(16px, 2vw, 32px);
--grid-margin:   clamp(24px, 5vw, 80px);

--container-max: 1280px;
--container-wide: 1440px; /* For full-bleed hero sections only. */

--section-gap:   clamp(80px, 10vw, 160px); /* Between major page sections. */
--card-radius:   4px;  /* All cards and panels. Deliberately sharp — no pill shapes. */
--button-radius: 2px;  /* Even sharper for buttons. Architectural not friendly. */
```

### Layout principles

The grid breaks intentionally. Section anchors (numbered labels like "01", "02") are always placed in column 1, hanging outside the text flow. This creates a constant vertical axis of reference — like chapter numbers in a French academic text — and gives the layout an asymmetric structure.

Bento grids are used for feature showcases: asymmetric two-three column arrangements where the dominant card always spans 7 of 12 columns on desktop and the supporting cards split the remaining 5. No equal grids.

Full-bleed sections (hero, timeline, CTA finale) extend to `--container-wide`. Content sections are constrained to `--container-max`. The contrast between contained and uncontained creates rhythm.

---

## 5. Navigation

### Structure

```
[Logo: MentivisOS]          [MentivisAtelier]  [MentivisOperate]  [MentivisIntel]  [Ressources]  [Entreprise]  [Tarifs]          [Connexion]  [Démarrer]
```

### Behavior

- Fixed top bar. Height: 56px. Background: `rgba(8, 8, 8, 0.92)` with `backdrop-filter: blur(20px)` and a 1px bottom border in `--color-border`.
- Logo: wordmark in `--font-interface`, all-caps, `--color-ink-primary`. A small amber square precedes the wordmark — a reference to the blueprint grid without being literal.
- Primary nav items in `--font-interface`, `--text-small`, `--color-ink-secondary`. On hover: `--color-ink-primary` with a 0.2px amber underline that grows from left to right at 180ms ease-out.
- Dropdowns on hover, not click. Background: `--color-surface-2`. 320px wide. No mega menus. Maximum three items per column, two columns maximum.
- Active section: the current product tab gets a 2px `--color-accent` left border treatment and shifts text to `--color-ink-primary`.
- CTAs: "Connexion" is a ghost button (border `--color-border`, text `--color-ink-secondary`). "Démarrer" is the only filled button on the nav: `--color-accent` background, `--color-ground` text, `--font-interface`, `--text-small`, all caps.
- Mobile: hamburger at 768px breakpoint. Full-screen overlay menu with staggered line entry animation (each nav item enters 40ms after the previous).

---

## 6. Hero Section

### Content

```
SECTION INDEX (--font-interface, 11px, amber, all caps)
MentivisOS

HEADLINE (--font-display, --text-hero, --color-ink-primary)
La formation opérée.
De bout en bout.

SUBHEADLINE (--font-body, 18px, --color-ink-secondary, max-width 560px)
Stratégie, ingénierie pédagogique, déploiement, conformité, pilotage.
Un seul opérateur. Tous les métiers. Aucun maillon sous-traité.

CTAs
[Démarrer gratuitement]  [Contacter l'équipe]

PROOF LINE (--font-interface, --text-small, --color-ink-tertiary)
Utilisé par les directions de la formation, les CFA, les campus d'entreprise.
```

### Visual treatment

The hero occupies 100vh. Behind the text: a large, slowly rotating architectural wireframe — a three-dimensional building grid rendered in lines at `rgba(200, 169, 110, 0.06)`, animated via CSS transform at 0.01deg/frame rotation. It is slow enough to appear almost static. It fills the right 60% of the viewport.

Below the headline text, a continuous horizontal marquee (identical to ElevenLabs' product strip) shows the three product sub-brands cycling in amber monospace: `MentivisAtelier / MentivisOperate / MentivisIntel / MentivisAtelier / ...`.

A thin amber horizontal line (1px, full viewport width) separates the hero from the first content section below, with a subtle glow effect: `box-shadow: 0 0 20px 0 rgba(200, 169, 110, 0.15)`.

---

## 7. Product Suite Strip

Immediately below the hero. Three product cards in a horizontal strip, each 1/3 of the container width.

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  01                 │  │  02                 │  │  03                 │
│  MentivisAtelier    │  │  MentivisOperate    │  │  MentivisIntel      │
│                     │  │                     │  │                     │
│  Concevoir          │  │  Déployer           │  │  Piloter            │
│  [→]               │  │  [→]               │  │  [→]               │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

Each card: `--color-surface-1` background, 1px `--color-border` border, `--card-radius`. On hover: border transitions to `--color-accent` at 0.3 opacity, and a very faint amber gradient appears in the top-right corner. The product number is in `--font-interface`, amber, 11px. The product name is in `--font-interface`, `--color-ink-primary`, 14px, all caps. The short descriptor is in `--font-body`, `--color-ink-secondary`, 14px. The arrow is amber.

---

## 8. Social Proof Rail

Full-width scrolling logo rail. Auto-scroll, no pause on hover.

Two rows moving in opposite directions at different speeds — identical to best-in-class SaaS social proof rails — but constrained to professional logos: OPCO Atlas, France Compétences, Qualiopi seal, partner institutions, corporate client silhouettes (anonymized with a round pill shape where confidentiality applies).

Style: all logos at 60% opacity in `--color-ink-secondary`. On row hover: opacity drops to 30% for all logos except the one under cursor, which goes to 100% in `--color-ink-primary`. This inverts the usual hover logic and creates a focused, cinematic effect.

---

## 9. MentivisAtelier Deep Dive

Section index: `01 — ATELIER`

### Headline
```
Concevoir les dispositifs
qui forment vraiment.
```

Layout: 7-column left text block / 5-column right interactive preview.

The right panel shows an animated interface mockup: a pedagogical module builder with draggable blocks labeled "Objectifs pédagogiques", "Évaluations", "Ressources", "Séquençage". The blocks animate into place in sequence on scroll entry.

### Bento grid beneath the headline

```
┌──────────────────────────────────┬─────────────────┐
│  CARD A (7 col)                  │  CARD B (5 col) │
│  Ingénierie pédagogique          │  Certifications │
│  Design de parcours sur mesure   │  Qualiopi       │
│  [Preview: parcours timeline]    │  RNCP / RS      │
│                                  │  CPF            │
├────────────────┬─────────────────┴─────────────────┤
│  CARD C (4col) │  CARD D (8 col)                   │
│  Formats       │  Modalités pédagogiques            │
│  Présentiel    │  [Visual: grid of icons]           │
│  Distanciel    │  Présentiel / Hybride / 100% online│
│  Hybride       │  Synchrone / Asynchrone            │
└────────────────┴───────────────────────────────────┘
```

Each bento card has: index number in amber, heading in `--font-display` at `--text-heading` weight 300, body in `--font-body` at `--text-small`, and either a UI preview or an icon cluster.

### Client evidence strip

Three anonymized client uses cases below the bento:

```
[Client A — Secteur industriel]
Parcours de certification métier en 6 semaines.
Taux de validation : 94%.

[Client B — Secteur public]
Dispositif de montée en compétences managériales.
Déployé sur 3 sites simultanément.

[Client C — Campus d'entreprise]
Architecture complète d'un CFA interne.
De zéro à l'ouverture en 14 mois.
```

These appear as horizontal stat cards with a thin amber left border. Stats are in `--font-interface`, large size, amber color.

---

## 10. MentivisOperate Deep Dive

Section index: `02 — OPERATE`

### Headline
```
Déployer. Gérer.
Ne laisser aucun maillon hors contrôle.
```

Layout mirrors Atelier but flips: interactive preview on the left (5 col), text and bento on the right (7 col).

The preview shows an operations dashboard mockup: a live status grid with rows labeled "Sessions planifiées", "Formateurs affectés", "OPCO dossiers en cours", "Apprenants actifs". Each row has a colored status dot (green/amber/blue) and a figure. The numbers increment slowly on loop to suggest live data.

### Feature list (replaces bento for this section)

Four features displayed as a vertical accordion. Only one open at a time. Closed state: feature name in `--font-interface`, right-aligned status tag. Open state: name expands to reveal a short paragraph in `--font-body` and a UI screenshot at reduced opacity.

```
1. Gestion administrative et contractuelle
   — Conventions, convocations, émargements, bilans.

2. Coordination formateurs et intervenants
   — Affectation, suivi, qualité des interventions.

3. Suivi OPCO et financement
   — Montage des dossiers, justificatifs, remboursements.

4. Conformité Qualiopi
   — Audit-readiness permanent. Indicateurs en temps réel.
```

---

## 11. MentivisIntel Deep Dive

Section index: `03 — INTEL`

### Headline
```
Piloter avec les bons chiffres.
Pas avec de bonnes intentions.
```

Layout: full-width, one dominant data visualization mockup as the hero visual for this section, with text overlay on the left.

The visualization is an animated dashboard: a dark card with three KPI tiles at the top (taux de complétion, coût par apprenant, ROI formation), a line chart below, and a small table with regional breakdown. Numbers animate on scroll entry using a counter effect.

### Metric callouts

Three large-format stats arranged horizontally:

```
94%           2.4×           J+14
Taux moyen    ROI mesuré     Délai de
de validation en formation   primo-bilan
              professionnelle post-déploiement
```

Stats in `--font-interface`, `clamp(48px, 5vw, 72px)`, amber. Labels below in `--font-body`, `--text-small`, `--color-ink-secondary`.

---

## 12. Timeline / Milestones Section

Section index: `04 — CHRONOLOGIE`

Full-width dark section with blueprint grid overlay at double intensity (still subtle). A horizontal timeline with nodes.

```
2018          2020          2022          2023          2024          2025
  ●             ●             ●             ●             ●             ●
Première      Déploiement   Certification  Lancement     Campus        MentivisOS
création      multi-sites   Qualiopi      MentivisOS    d'entreprise   v2.0
d'école       PACA          obtenue       alpha          intégré
```

Each node: a small amber circle. Inactive nodes: `--color-border` ring with amber fill at 30%. Active/highlighted node: full amber fill with a soft glow. The line connecting nodes is 1px `--color-border` with an amber fill that progresses as the user scrolls (scroll-driven animation).

Below each node: year in `--font-interface`, amber, 11px. Label in `--font-body`, `--color-ink-secondary`, 14px. On hover: the node expands to a card with more detail, emerging from below the timeline.

---

## 13. Trust and Compliance Section

Section index: `05 — CONFORMITÉ`

Three column layout, no cards. Pure typographic treatment.

```
QUALIOPI                    OPCO ATLAS                  RNCP / RS
──────────                  ──────────                  ──────────
Certification               Partenaire                  Enregistrement
nationale qualité           référencé                   de formations
des prestataires            pour le                     certifiantes
de formation.               financement CPF.            au RNCP et RS.

Suivi des 7                 Montage et                  Accompagnement
indicateurs en              suivi des                   au dépôt et
permanence.                 dossiers de                 renouvellement.
                            financement.
```

Column headers in `--font-interface`, `--text-small`, amber, all caps. Body in `--font-body`, `--text-small`, `--color-ink-secondary`. A thin vertical amber rule separates columns. No icons, no illustrations. The austerity of the typography is itself a trust signal.

---

## 14. Final CTA Section

Full-bleed, `--color-surface-1` background. Centered layout.

```
Headline (--font-display, --text-display, --color-ink-primary)
Tous les métiers de la formation.
De bout en bout.

Subline (--font-body, 18px, --color-ink-secondary)
Un premier échange suffit pour cartographier votre situation
et identifier les leviers prioritaires.

CTAs
[Prendre rendez-vous]      [Explorer la documentation]
```

Behind the text, very large ghost text in `--font-display` at 140px opacity 4%: `MentivisOS`. This fills the background like a watermark visible only at certain viewport sizes.

---

## 15. Blog / Actualités Strip

Three cards, horizontal row, no carousel.

Card anatomy: top tag in `--font-interface`, amber, 11px, all caps (INGÉNIERIE PÉDAGOGIQUE / CONFORMITÉ / OPÉRATIONS). Below: article title in `--font-display`, `--text-heading`, `--color-ink-primary`. Below: date in `--font-interface`, `--text-micro`, `--color-ink-tertiary`. Bottom: read arrow that slides right 6px on card hover.

Card hover: border shifts from `--color-border` to `rgba(200, 169, 110, 0.4)`. No image required — the typographic weight of the title carries the visual hierarchy.

---

## 16. Footer

Four-column layout.

```
COL 1: MentivisOS logo + tagline
"Tous les métiers de la formation. De bout en bout."
Copyright line. Legal links.

COL 2: Produits
MentivisAtelier
MentivisOperate
MentivisIntel
Tarifs
API & Intégrations

COL 3: Ressources
Documentation
Blog
Études de cas
Conformité Qualiopi
Guide OPCO

COL 4: Entreprise
À propos
L'équipe
Contact
Mentions légales
Politique de confidentialité
```

Footer background: `--color-ground`. Top border: 1px `--color-border`. Column headers: `--font-interface`, `--text-micro`, amber, all caps. Links: `--font-body`, `--text-small`, `--color-ink-tertiary`. On hover: `--color-ink-primary`, 200ms ease.

---

## 17. Button System

```
PRIMARY:    background --color-accent, text --color-ground, --font-interface, 13px, all caps, --button-radius, padding 12px 24px.
            Hover: background lightens 10%, slight box-shadow amber glow.

SECONDARY:  background transparent, border 1px --color-border, text --color-ink-primary, same type treatment.
            Hover: border --color-accent at 60%, background --color-surface-1.

GHOST:      background transparent, no border, text --color-ink-secondary, underline on hover.
            Used for tertiary actions in footer and nav.

ICON:       40px square, --color-surface-2 background, amber icon, no text. Used for interactive controls only.
```

---

## 18. Motion Principles

All animations follow three rules: purposeful, fast, directional.

- **Entry animations**: elements enter from 16px below their resting position with opacity 0 to 1, duration 400ms, `cubic-bezier(0.22, 1, 0.36, 1)`. Stagger children by 50ms per element.
- **Hover transitions**: 180ms ease-out for color, opacity, border. 240ms for transforms.
- **Scroll-driven**: timeline fill, stat counter increment, and blueprint grid intensity increase are all tied to scroll progress via `animation-timeline: scroll()` where supported, with IntersectionObserver fallback.
- **No parallax**: parallax creates cognitive load inconsistent with a professional tool. All scroll effects are simple clip/fill progressions.
- **Cursor**: custom cursor on desktop. A small amber circle (8px) that scales to 32px on hover over interactive elements, with a 60ms lag creating a smooth trailing effect. Inside the expanded cursor on link hover: a thin `→` appears in `--font-interface`.

---

## 19. Responsive Strategy

Three breakpoints. No more.

```
--bp-mobile:  < 768px
--bp-tablet:  768px – 1024px
--bp-desktop: > 1024px
```

- **Mobile**: single column throughout. Hero headline drops to `clamp(36px, 8vw, 52px)`. Navigation becomes full-screen overlay. Bento grids become vertical stacks. Timeline switches to vertical scroll. CTA buttons stack.
- **Tablet**: two-column bento. Navigation collapses to hamburger at 768px. Hero adjusts to 80vh. Timeline remains horizontal but nodes reduce to 5 visible with scroll.
- **Desktop**: full design as specified. Blueprint grid at full intensity. Wide container for hero and CTA finale.

---

## 20. Component Index

The following components require dedicated design and build specifications:

- `<NavBar />` with scroll-aware opacity and active section detection
- `<HeroUnit />` with wireframe background and marquee strip
- `<ProductCard />` for the three-product suite strip
- `<BentoGrid />` with asymmetric column configurations
- `<StatCard />` with animated counter on scroll entry
- `<TimelineNode />` with scroll-driven fill and hover expansion
- `<AccordionFeature />` for the Operate section
- `<DashboardMock />` static animated mockup for Intel section
- `<SocialProofRail />` dual-row auto-scroll with hover focus effect
- `<ArticleCard />` for the blog strip
- `<CTABlock />` for section closers and the final fullscreen CTA
- `<FooterBlock />` with legal link cluster
- `<CustomCursor />` with trailing amber circle and arrow icon

---

## 21. Accessibility and Performance Targets

- Color contrast: all text combinations meet WCAG AA at minimum. Amber on near-black exceeds 4.5:1 for all standard text sizes.
- Focus indicators: 2px amber outline, 2px offset. Never hidden, never default browser blue.
- Animation: all motion effects respect `prefers-reduced-motion`. Blueprint grid and cursor effects are suppressed. Entry animations collapse to instant opacity changes.
- Font loading: `font-display: swap` on all custom fonts. System font fallbacks specified in every stack.
- Target Lighthouse score: Performance 90+, Accessibility 98+, Best Practices 100, SEO 95+.
- LCP target: under 1.8s on desktop, under 2.5s on mobile, achieved by inlining the hero critical CSS and lazy-loading all below-the-fold imagery.
- No layout shift: all image containers pre-sized with explicit aspect ratios.
