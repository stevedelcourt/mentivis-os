# MentivisOS — Homepage Design System

> Document spécifique à la homepage uniquement. Référence absolue pour l'implémentation et la maintenance de la page d'accueil.
> Dernière mise à jour : 13 mai 2026

---

## 1. Architecture de la homepage

### 1.1 Ordre exact des sections (9 sections)

```
1. NavBar              (layout, fixed)
2. HeroUnit
   └── ProductCardGrid
        └── ProductCard ×3 + descriptions
3. ProblemSection
4. SectorShowcase
5. MathFeaturesSection
6. TransformationTimeline
   ├── AtmosphereOrb ×7
   ├── Satellite ×14
   ├── MeasurementBar
   └── StageTextPanel
7. ImpactSection
   ├── Tabs (Clients | Partenariat)
   └── 3×1 CSS Grid
8. FaqSection
9. CTABlock
   └── SuperButton (3-layer SVG)
10. ArticlesFeaturesSection
11. FooterBlock         (layout)
```

### 1.2 Sections retirées (NE PAS RÉINTÉGRER)

Les sections suivantes ont été supprimées de la homepage et ne doivent pas réapparaître :

- BentoSection
- ModulesSection
- ProofSection
- ShiftsSection
- IntegrationSection
- NotLmsSection
- InteractiveShowcase (déplacée vers `/composants`)
- CombinationSection

---

## 2. Tokens CSS — Homepage

### 2.1 Fonds

| Token | Valeur | Usage sur HP |
|---|---|---|
| `--bg-primary` | `#ffffff` | HeroUnit, SectorShowcase, TransformationTimeline |
| `--bg-secondary` | `#f5f5f5` | ProblemSection, FaqSection, CTABlock |
| `--bg-warm` | `#f5f3f1` | MathFeaturesSection, ImpactSection, ArticlesFeaturesSection |

### 2.2 Textes

| Token | Valeur | Usage sur HP |
|---|---|---|
| `--text-primary` | `#000000` | Titres, corps |
| `--text-secondary` | `#4e4e4e` | Descriptions, sous-titres |
| `--text-tertiary` | `#777169` | Eyebrows, captions, légendes |

### 2.3 Bordures & Ombres

| Token | Valeur | Usage sur HP |
|---|---|---|
| `--border-light` | `#e5e5e5` | Bordures de séparation (navbar, footer) |
| `--border-subtle` | `rgba(0,0,0,0.05)` | Bordure navbar |
| `--shadow-card` | `rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px` | Cartes, dropdowns |
| `--shadow-card-full` | `rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px` | Dropdowns, menus |

### 2.4 Typographie

| Token | Valeur | Usage sur HP |
|---|---|---|
| `--font-sans` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Tout le texte |
| `--text-hero` | `clamp(32px, 5vw, 56px)` | HeroUnit headline |
| `--text-display` | `clamp(36px, 4.5vw, 56px)` | Titres de section |
| `--text-title` | `clamp(24px, 3vw, 36px)` | Sous-titres |
| `--text-heading` | `clamp(18px, 2vw, 28px)` | Mobile nav links |
| `--text-body` | `18px` | Corps, lead |
| `--text-body-sm` | `16px` | Titres cartes modules |
| `--text-caption` | `14px` | Eyebrows, labels, preuves |
| `--text-micro` | `12px` | Tags, uppercase eyebrows |
| `--text-tiny` | `10px` | Tags d'articles |

### 2.5 Layout

| Token | Valeur | Usage sur HP |
|---|---|---|
| `--container-max` | `1240px` | Toutes les sections sauf HeroUnit |
| `--container-wide` | `1440px` | Navbar inner |
| `--grid-margin` | `clamp(24px, 5vw, 80px)` | Padding horizontal |
| `--section-gap` | `clamp(96px, 12vw, 160px)` | Padding vertical sections |
| `--section-gap-sm` | `clamp(64px, 8vw, 96px)` | Mobile padding vertical |

### 2.6 Border radius

| Token | Valeur | Usage sur HP |
|---|---|---|
| `--r-card` | `16px` | Cartes standard, dropdowns |
| `--r-pill` | `9999px` | Boutons pill, badges date |
| `--r-module` | `24px` | Cartes module, ProductCards |

---

## 3. Typographie — Spécifications détaillées

| Style | Poids | Taille | Line-height | Letter-spacing | Alignement |
|---|---|---|---|---|---|
| **Display** | 300 | `clamp(36px, 4.5vw, 56px)` | 0.95 | -0.03em | Gauche |
| **Hero** | 300 | `clamp(32px, 5vw, 56px)` | 0.95 | -0.03em | Gauche |
| **Title** | 300 | `clamp(24px, 3vw, 36px)` | 1.1 | -0.02em | Gauche |
| **Heading** | 300 | `clamp(18px, 2vw, 28px)` | 1.2 | -0.01em | Gauche |
| **Lead** | 400 | `18px` | 1.6 | 0.18px | Gauche |
| **Body** | 400 | `18px` | 1.6 | 0.16px | Gauche |
| **Caption** | 400 | `14px` | 1.5 | 0.14px | Gauche |
| **Nav** | 500 | `15px` | 1.4 | 0.15px | Gauche |
| **Button** | 500 | `15px` | 1.4 | — | Gauche |
| **Micro** | 500 | `12px` | 1.4 | 0.1em | Gauche |

**Règles strictes** :
- Inter uniquement. Police serif INTERDITE.
- `font-display: swap`
- `text-wrap: balance` sur les titres
- `white-space: pre-line` sur les headlines multi-lignes
- **Tout est aligné à gauche. Jamais de centrage.**

---

## 4. Couleurs — Palette Homepage

| Rôle | Valeur | Usage |
|---|---|---|
| Fond primaire | `#ffffff` | HeroUnit, SectorShowcase, TransformationTimeline, Navbar |
| Fond secondaire | `#f5f5f5` | ProblemSection, FaqSection, CTABlock, FooterBlock |
| Fond chaud | `#f5f3f1` | MathFeaturesSection, ImpactSection, ArticlesFeaturesSection |
| Texte primaire | `#000000` | Titres, corps |
| Texte secondaire | `#4e4e4e` | Descriptions, sous-titres |
| Texte tertiaire | `#777169` | Eyebrows, captions, légendes |
| Grain overlay | `rgba(0,0,0,0.08-0.10)` | Texture sur cartes gradient |
| Focus outline | `rgb(147 197 253 / 0.5)` | Accessibilité |

**Valeurs inline spécifiques** :
| Valeur | Où sur HP |
|---|---|
| `#0A0A0A` | Titres dans cartes sombres (ImpactSection) |
| `#777169` | Texte tertiaire dans cartes sombres |
| `#3E3B38` | Lead dans sections warm (MathFeatures, Articles) |
| `#A0C4FF` | Sélection active (feature tabs, TransformationTimeline) |
| `#A8A39A` | Tags articles (ArticlesFeaturesSection) |

---

## 5. Animation & Motion

### 5.1 Durées par élément

| Élément | Durée | Easing |
|---|---|---|
| Link hover (couleur) | 0.18s | ease |
| Link hover (underline scaleX) | 0.25s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Button hover (bg) | 0.18s | ease |
| Card hover (transform) | 0.4s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Card hover (box-shadow) | 0.2s | ease |
| Dropdown apparition | 0.2s | ease |
| Mobile overlay fadeIn | 0.2s | ease |
| Mobile link fadeInUp | 0.4s | ease |
| Scroll reveal (section) | 0.6s | ease |
| Scroll reveal stagger | 50ms | — |
| Gradient shift | 8s | ease infinite |
| Orb pulse | 1.4s | ease |
| Carousel transition | 0.7s | `cubic-bezier(0.22, 1, 0.36, 1)` |

### 5.2 Keyframes

```css
@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes orbPulse {
  0%   { transform: scale(1); }
  20%  { transform: scale(1.06); }
  100% { transform: scale(1); }
}
```

### 5.3 Accessibilité motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Responsive — Homepage

| Breakpoint | Nom | Effets |
|---|---|---|
| `< 768px` | Mobile | Nav burger, hover animations désactivées, footer vertical, grids 1 colonne, ImpactSection hidden |
| `768px – 1024px` | Tablet | Section-gap réduit, backdrop-filter désactivé, footer 2 colonnes, grids 2 colonnes |
| `> 1024px` | Desktop | Expérience complète |

### 6.1 Règles clés

```css
@media (max-width: 1024px) {
  .section { padding: var(--section-gap-sm) 0; }
  .navbar {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
  .navbar-links { display: none !important; }
  .navbar-burger { display: block !important; }
}

@media (max-width: 768px) {
  .impact-section { display: none !important; }
  .product-card-grid { grid-template-columns: 1fr !important; }
  .sector-showcase-grid { grid-template-columns: 1fr !important; }
  .math-features-grid { grid-template-columns: 1fr !important; }
  .articles-grid { grid-template-columns: 1fr !important; }
}
```

---

## 7. Composants — Spécifications par section

### 7.1 NavBar

- **Fichier** : `components/nav-bar.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Position** : Fixed, top 0, z-index 1000
- **Hauteur** : 64px
- **Fond** : `rgba(255,255,255,0.98)` → `rgba(255,255,255,0.92)` quand scrolled (seuil 8px)
- **Backdrop-filter** : `blur(12px)` quand scrolled
- **Border-bottom** : `1px solid var(--border-subtle)`
- **Transition** : `background 0.35s ease, box-shadow 0.35s ease`
- **Shadow scrolled** : `var(--shadow-card)`
- **Inner container** : max-width `var(--container-wide)` (1440px), padding `0 var(--grid-margin)`
- **Logo** : `<img src="/images/MentivisOS/mentivisos-logo-wordmark-noir.svg" alt="MentivisOS" height="36" />`
- **Liens desktop** : 4 items avec dropdowns (gap 32px)
  - LearningOS, TalentOS, Entreprise, Tarifs
  - Chaque lien : weight 500, underline animé (scaleX 0→1, 0.25s, cubic-bezier(0.22,1,0.36,1))
- **MegaMenu** : position `absolute`, `top: calc(100% + 20px)`, min-width 220px, radius 16px, shadow `var(--shadow-card-full), var(--shadow-soft)`
- **Bridge invisible** : `.navbar-dropdown-bridge`, height 24px, entre le lien et le dropdown
- **Bouton "Contactez-nous"** : `.btn-pill.btn-black.navbar-cta`, padding 8px 18px, chevron 12px
- **LanguageSwitcher** : FR/EN toggle, à droite du Login
- **Burger mobile** : `display: none` desktop, `display: block` < 1024px
- **Overlay mobile** : fixed inset 0, z-index 999, padding 80px var(--grid-margin) 40px
- **Liens mobile** : font-size `var(--text-heading)`, weight 300, stagger 40ms

### 7.2 HeroUnit

- **Fichier** : `components/hero-unit.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding-top** : `calc(64px + var(--section-gap))`
- **Padding-bottom** : `var(--section-gap)`
- **Min-height** : `100vh`
- **Container texte** : max-width 720px (pas `container-wide`)
- **Eyebrow** : `t-caption` uppercase, weight 500, letter-spacing 0.14px, color `var(--text-tertiary)`, margin-bottom 24px
- **Headline** : `t-display` size `var(--text-hero)`, white-space pre-line, margin-bottom 20px
- **Subheadline** : `t-lead`, max-width 560px, white-space pre-line, margin-bottom 40px
- **ProductCardGrid** : 3 cartes gradient + descriptions en dessous
- **CTAs** :
  - Primaire (noir) : `.btn-pill.btn-black`, border-radius **8px** (pas pill !), padding 12px 20px, chevron 14px
  - Secondaire (warm) : `.btn-pill.btn-warm`, border-radius **8px**, padding 12px 20px, chevron 14px
- **Proof line** : `t-caption`, margin-top 32px, color `var(--text-tertiary)`
- **TopoLines** : position absolute, `left: calc(var(--grid-margin) + 720px)`, top 50%, transform translateY(-50%), width/height clamp(300-600px), opacity 0.5, z-index 0, pointer-events none

### 7.3 ProductCardGrid + ProductCard

- **Fichiers** : `components/product-card-grid.tsx`, `components/product-card.tsx`
- **Type** : Client
- **Props** : `{ lang: Locale }`
- **Grille** : 3 colonnes, gap 20px
- **ProductCard** :
  - Fond : gradient variable (4 patterns disponibles via `gradientId`)
  - Radius : 24px
  - Aspect-ratio : 1/1
  - Tag : badge en haut à gauche
  - Titre : en bas à gauche, blanc
  - Grain overlay
  - Hover : translateY(-4px)
- **Descriptions** : texte plain sous chaque carte, 2 lignes max, color `var(--text-secondary)`

### 7.4 ProblemSection

- **Fichier** : `components/problem-section.tsx`
- **Type** : Serveur
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-secondary)` (`#f5f5f5`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Titre** : `t-display` size `clamp(28px, 4vw, 48px)`, white-space pre-line, max-width 800px
- **Contrepoint** : `t-lead`, max-width 600px, margin-top 24px

### 7.5 SectorShowcase

- **Fichier** : `components/sector-showcase.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Tabs** : 4 onglets sectoriels (pills)
- **Grille** : 2 colonnes, gap 48px
  - Colonne texte : titre + description + CTA
  - Colonne image : `.avif` avec aspect-ratio 4/3, radius 24px
- **Responsive** : < 1024px 1 colonne

### 7.6 MathFeaturesSection

- **Fichier** : `components/math-features-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : Aucun
- **Fond** : `#F5F2EF`
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Header** :
  - Eyebrow : "Principes", 11px, uppercase, letter-spacing 0.18em, color `#777169`
  - Lead : "Précision, structure, continuité. Les trois constantes du système.", clamp(22px, 3vw, 32px), weight 300, color `#3E3B38`, max-width 480px
- **Grille** : 3 colonnes, gap 16px
  - **Card 1 — Précision** : fond `#EDEAE3`, radius 22px, padding 32px 28px 28px
    - SVG : Phyllotaxis (600 dots golden-angle, arcs connecteurs)
    - Titre : 17px weight 500
    - Desc : 14px line-height 1.55, color `#777169`
  - **Card 2 — Structure** : même style
    - SVG : Hilbert Curve (order 5, 1024 points, stroke 0.42px)
  - **Card 3 — Continuité** : même style
    - SVG : Möbius Strip (36 longitudinal + 6 cross-ring, 3D projection)
- **Responsive** : < 760px 1 colonne

### 7.7 TransformationTimeline

- **Fichier** : `components/transformation-timeline.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Structure** : 7-stage organizational transformation journey
- **AtmosphereOrb** : 7 orbs glassmorphism avec blob gradients
  - Carrés arrondis (PAS cercles), border-radius 32px
  - Active : 280×280px, scale 1
  - Adjacents : scale 0.62, opacity 0.95
  - Lointains : scale 0.42, opacity 0.55
  - Grain overlay sur chaque orb
  - Play button : 60×60px, border-radius 16px (PAS cercle)
- **Satellite** : 14 satellites (2 par orb), orbiting
- **MeasurementBar** : 7 ticks avec numéros d'étape
- **StageTextPanel** : titre + description, aligné à gauche
- **Animations** : orb pulse 1.4s, carousel transition 0.7s `cubic-bezier(0.22,1,0.36,1)`
- **Responsive** : < 768px simplifié

### 7.8 ImpactSection

- **Fichier** : `components/impact-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `#F5F2EF`
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Titre** : `t-display` size `clamp(28px, 4vw, 44px)`, weight 300, line-height 1.1
- **Tabs** : 2 pills (Clients / Partenariat)
  - Actif : fond blanc, shadow multi-couche
  - Inactif : transparent, hover `rgba(0,0,0,0.04)`
- **Grille** : `grid-template-columns: 1fr 1.58fr 1fr`, `grid-template-rows: auto`, gap 12px
  - **Big** (i=0) : colonne 2, remplit la hauteur de ligne (1.58W) via aspect-ratio
  - **MedA** (i=1) : colonne 1 (clients) / 3 (partenariat), `align-self: start` → top = Big top
  - **MedE** (i=2) : colonne 3 (clients) / 1 (partenariat), `align-self: end` → bottom = Big bottom
  - Toutes les cartes : `aspect-ratio: 1/1` (pas de stretch)
  - Hover : `translateY(-4px)`
  - Crossfade entre les deux layouts via `grid-area: 1/1`
- **Mobile** : hidden < 768px

**Règle fondamentale** : Pas de JS pour le layout. Pas de margins, pas de calc, pas de translateY inline, pas de ghosts. Seul `align-self` contrôle la position verticale.

### 7.9 FaqSection

- **Fichier** : `components/faq-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-secondary)` (`#f5f5f5`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Titre** : `t-display` size `var(--text-display)`
- **Accordéon** : 8 questions
  - Question : `t-heading`, weight 500, cursor pointer
  - Réponse : `t-body`, max-width 720px, slideDown 0.3s ease
  - Icon : chevron rotate 180deg

### 7.10 CTABlock + SuperButton

- **Fichier** : `components/cta-block.tsx`, `components/super-button.tsx`
- **Type** : Serveur (CTABlock), Client (SuperButton)
- **Props** : `{ lang: Locale; variant?: "section" | "final" }`
- **Variant "final"** :
  - Fond : `var(--bg-secondary)` (`#f5f5f5`)
  - Padding : `var(--section-gap) 0`
  - Container : max-width 720px
  - Titre : `t-display` size `var(--text-display)`, white-space pre-line, margin-bottom 24px
  - Sous-titre : `t-lead`, margin-bottom 40px
- **SuperButton** :
  - 3D layered SVG (bottom/middle/top)
  - Hover : translateY(4px)
  - Active/press : translateY(8px)
  - Pas de texte overlay — le texte est à côté du bouton

### 7.11 ArticlesFeaturesSection

- **Fichier** : `components/articles-features-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `#F5F2EF`
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Header** : flex space-between, margin-bottom 36px
  - Eyebrow : "Insights & Actualités", 11px, uppercase, letter-spacing 0.18em
  - Lead : clamp(22px, 3vw, 32px), weight 300, color `#3E3B38`, max-width 380px
  - Bouton "En savoir plus" : pill blanc, border `rgba(0,0,0,0.07)`, chevron 14px, hover inverse (noir/blanc)
- **Articles grid** : 3 colonnes, gap 16px
  - 3 cartes, chaque carte :
    - Image area : aspect-ratio 16/9, radius 18px, gradient (bleu-violet, vert, ambre)
      - Wave overlay : SVG lignes ondulées blanches à 18% opacity
      - Date badge : absolute top-left, blanc blur(8px), radius 9999px
    - Tag : 10px uppercase, color `#A8A39A`
    - Titre : 16px weight 500, line-height 1.38
    - Hover : translateY(-4px), transition 0.45s `cubic-bezier(0.22,1,0.36,1)`
- **Responsive** : < 760px 1 colonne

### 7.12 FooterBlock

- **Fichier** : `components/footer-block.tsx`
- **Type** : Serveur
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-secondary)` (`#f5f5f5`)
- **Border-top** : `1px solid var(--border-light)`
- **Padding** : 64px 0 32px
- **Top grid** : `grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr`, gap 40px
  - Col 1 : logo (height 24, opacity 0.7), tagline `t-caption` max-width 280px, LogomarkMotion
  - Cols 2-5 : titre `t-micro` uppercase + liste de liens `t-caption`
- **Bottom bar** : margin-top 48px, border-top, flex space-between
  - Copyright : `t-micro`, color `var(--text-tertiary)`
  - Liens légaux : flex gap 16px, `t-micro`
- **Responsive** :
  - < 1024px : grid 2 colonnes
  - < 768px : grid 1 colonne, bottom bar vertical flex-start

---

## 8. Assets visuels — Homepage

### 8.1 Logo & brand

| Fichier | Chemin | Usage | Dimensions |
|---|---|---|---|
| Wordmark noir | `/images/MentivisOS/mentivisos-logo-wordmark-noir.svg` | Navbar | 36px height |
| Logomark noir | `/images/MentivisOS/mentivisos-logomark-noir.svg` | Footer motion | 80px |
| Logomark blanc | `/images/MentivisOS/mentivisos-logomark-blanc.svg` | Variante | — |

### 8.2 TopoLines

- **Fichier** : `components/topo-lines.tsx`
- Canvas rAF, lignes topographiques concentriques animées
- Position absolute, droite du hero texte
- Opacity 0.5, pointer-events none

### 8.3 LogomarkMotion

- **Fichier** : intégré dans FooterBlock
- 17 carrés SVG (130×130 viewBox)
- Animation `lmDrop` W02 Drop Physics
- Stagger 40ms

---

## 9. Invariants — Homepage

Ces règles sont immuables. Toute modification doit être discutée explicitement.

1. **Serif fonts INTERDITES** — Inter (`var(--font-sans)`) uniquement
2. **Tout aligné à gauche** — Jamais de centrage sur du texte
3. **Pas de Turbopack** — Webpack uniquement (`next build --webpack`)
4. **Pas de `onMouseEnter`/`onMouseLeave` sur les server components** — Utiliser CSS `:hover`
5. **Tous les `.avif` et `.svg` doivent être git-trackés**
6. **Pas de framework CSS utilitaire** (Tailwind, etc.)
7. **Bilingue FR/EN**, FR par défaut
8. **`aspect-ratio: 1/1` sur toutes les cartes** — Pas de stretch
9. **Ordre des sections immuable** — Voir section 1.1
10. **ImpactSection hidden < 768px** — Pas de version mobile

---

> Document généré le 13 mai 2026. Spécifique à la homepage uniquement.
