# MentivisOS — Design System Final

> Référence absolue du design system. Document de travail pour l'équipe de développement.
> Dernière mise à jour : 13 mai 2026

---

## 1. Principes fondamentaux

### 1.1 Positionnement

MentivisOS est un **moteur pédagogique natif IA**. Ce n'est pas un LMS. Ce n'est pas un catalogue. Il produit trois choses qu'aucun LMS ne produit :

1. Un **diagnostic quantifié** de l'écart entre un profil et un objectif
2. Un **programme exact** calibré sur cet écart
3. Un **accompagnement embarqué** qui ne dévie jamais du sujet

### 1.2 Tone & langage

| Interdit | Prescrit |
|---|---|
| innovation | moteur |
| disruption | diagnostic |
| révolutionnaire | programme |
| solution | écart |
| écosystème | score |
| | module |
| | référentiel |
| | ordonnancement |
| | précision |
| | opérationnel |

**Règle** : les chiffres font le travail. Pas les adjectifs.

### 1.3 Alignement

**Tout le texte est strictement aligné à gauche.**

- Hero : aligné à gauche
- Titres de section : alignés à gauche
- CTAs : alignés à gauche
- Cartes : texte aligné à gauche
- Footer : colonnes alignées à gauche

**Jamais de centrage** sur aucun élément de texte.

### 1.4 Stack technique

| Couche | Choix |
|---|---|
| Framework | Next.js 16.2.6 + TypeScript strict + App Router |
| Bundler | Webpack UNIQUEMENT (`next build --webpack`) |
| Styling | CSS custom properties uniquement |
| Fonts | Inter (`var(--font-sans)`) — serif interdites |
| i18n | `lib/i18n.ts` — FR/EN, FR par défaut |
| Routing | `proxy.ts` (pas `middleware.ts`) |
| Lang par défaut | `fr` |
| Database | sql.js (WASM SQLite) — pas better-sqlite3 |
| Auth | JWT + role-based, async guards |
| Host | o2switch shared (terre.o2switch.net), Passenger, port 3001 |
| Node | v20.20.2 |
| Data dir | `/home/sc4bovu7233/data/` (persistent) |

---

## 2. Système de design

### 2.1 Tokens CSS

#### Fonds

| Token | Valeur | Usage |
|---|---|---|
| `--bg-primary` | `#ffffff` | Fond de page principal |
| `--bg-secondary` | `#f5f5f5` | Sections alternées |
| `--bg-warm` | `#f5f3f1` | Sections chaudes (impact, math, articles) |
| `--bg-warm-trans` | `rgba(245,242,239,0.8)` | Fond translucide (boutons) |
| `--bg-near-white` | `#f6f6f6` | Variante légère |

#### Textes

| Token | Valeur | Usage |
|---|---|---|
| `--text-primary` | `#000000` | Titres, texte principal |
| `--text-secondary` | `#4e4e4e` | Corps, descriptions |
| `--text-tertiary` | `#777169` | Eyebrows, légendes, captions |

#### Bordures

| Token | Valeur | Usage |
|---|---|---|
| `--border-light` | `#e5e5e5` | Bordures de séparation |
| `--border-subtle` | `rgba(0,0,0,0.05)` | Bordures fines (navbar) |

#### Focus

| Token | Valeur |
|---|---|
| `--focus-ring` | `rgb(147 197 253 / 0.5)` |

#### Ombres

| Token | Valeur |
|---|---|
| `--shadow-inset` | `rgba(0,0,0,0.075) 0px 0px 0px 0.5px inset` |
| `--shadow-outline` | `rgba(0,0,0,0.06) 0px 0px 0px 1px` |
| `--shadow-soft` | `rgba(0,0,0,0.04) 0px 4px 4px` |
| `--shadow-card` | `rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px` |
| `--shadow-warm` | `rgba(78, 50, 23, 0.04) 0px 6px 16px` |
| `--shadow-card-full` | `rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px` |

#### Typographie

| Token | Valeur |
|---|---|
| `--font-sans` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--text-hero` | `clamp(32px, 5vw, 56px)` |
| `--text-display` | `clamp(36px, 4.5vw, 56px)` |
| `--text-title` | `clamp(24px, 3vw, 36px)` |
| `--text-heading` | `clamp(18px, 2vw, 28px)` |
| `--text-body-lg` | `20px` |
| `--text-body` | `18px` |
| `--text-body-sm` | `16px` |
| `--text-nav` | `15px` |
| `--text-button` | `15px` |
| `--text-caption` | `14px` |
| `--text-small` | `13px` |
| `--text-micro` | `12px` |
| `--text-tiny` | `10px` |

#### Layout

| Token | Valeur |
|---|---|
| `--container-max` | `1240px` |
| `--container-wide` | `1440px` |
| `--grid-margin` | `clamp(24px, 5vw, 80px)` |
| `--section-gap` | `clamp(96px, 12vw, 160px)` |
| `--section-gap-sm` | `clamp(64px, 8vw, 96px)` |

#### Border radius

| Token | Valeur | Usage |
|---|---|---|
| `--r-card` | `16px` | Cartes standard |
| `--r-warm` | `30px` | Boutons warm |
| `--r-pill` | `9999px` | Boutons pill |
| `--r-module` | `24px` | Cartes module |

#### Gradients — Module cards

| Token | Valeur |
|---|---|
| `--module-grad-1` | `linear-gradient(135deg, #a89bc2 0%, #d4a0a0 50%, #d4b896 100%)` |
| `--module-grad-2` | `linear-gradient(135deg, #96b8c4 0%, #c49696 50%, #9696c4 100%)` |
| `--module-grad-3` | `linear-gradient(135deg, #96c4a8 0%, #a89bc2 50%, #c49696 100%)` |
| `--module-grad-4` | `linear-gradient(135deg, #d4b896 0%, #96c4a8 50%, #96b8c4 100%)` |
| `--module-grad-5` | `linear-gradient(135deg, #a89bc2 0%, #96b8c4 50%, #96c4a8 100%)` |
| `--module-grad-6` | `linear-gradient(135deg, #c49696 0%, #d4b896 50%, #a89bc2 100%)` |

#### Gradients — Integration cards

| Token | Valeur |
|---|---|
| `--integration-grad-1` | `linear-gradient(135deg, #7eb8c8 0%, #96c4a8 50%, #a89bc2 100%)` |
| `--integration-grad-2` | `linear-gradient(135deg, #c49696 0%, #d4b896 50%, #96b8c4 100%)` |
| `--integration-grad-3` | `linear-gradient(135deg, #a89bc2 0%, #c49696 50%, #96c4a8 100%)` |

#### Gradients — Adaptive capability cards

| Token | Valeur |
|---|---|
| `--adaptive-cap-1` | `linear-gradient(135deg, #7eb8c8 0%, #96c4a8 50%, #a89bc2 100%)` |
| `--adaptive-cap-2` | `linear-gradient(135deg, #a89bc2 0%, #c49696 50%, #d4b896 100%)` |
| `--adaptive-cap-3` | `linear-gradient(135deg, #96c4a8 0%, #7eb8c8 50%, #96b8c4 100%)` |
| `--adaptive-cap-4` | `linear-gradient(135deg, #c49696 0%, #a89bc2 50%, #96c4a8 100%)` |
| `--adaptive-cap-5` | `linear-gradient(135deg, #96b8c4 0%, #d4b896 50%, #c49696 100%)` |

#### Gradients — Adaptive outcome cards

| Token | Valeur |
|---|---|
| `--adaptive-out-1` | `linear-gradient(135deg, #7eb8c8 0%, #a89bc2 100%)` |
| `--adaptive-out-2` | `linear-gradient(135deg, #96c4a8 0%, #96b8c4 100%)` |
| `--adaptive-out-3` | `linear-gradient(135deg, #a89bc2 0%, #c49696 100%)` |
| `--adaptive-out-4` | `linear-gradient(135deg, #c49696 0%, #d4b896 100%)` |
| `--adaptive-out-5` | `linear-gradient(135deg, #96b8c4 0%, #7eb8c8 100%)` |
| `--adaptive-out-6` | `linear-gradient(135deg, #d4b896 0%, #96c4a8 100%)` |

### 2.2 Typographie — Spécifications

| Style | Poids | Taille | Line-height | Letter-spacing | Alignement |
|---|---|---|---|---|---|
| **Display** | 300 | `clamp(36px, 4.5vw, 56px)` | 0.95 | -0.03em | Gauche |
| **Hero** | 300 | `clamp(32px, 5vw, 56px)` | 0.95 | -0.03em | Gauche |
| **Title** | 300 | `clamp(24px, 3vw, 36px)` | 1.1 | -0.02em | Gauche |
| **Heading** | 300 | `clamp(18px, 2vw, 28px)` | 1.2 | -0.01em | Gauche |
| **Lead** | 400 | `18px` (var `--text-body`) | 1.6 | 0.18px | Gauche |
| **Body** | 400 | `18px` | 1.6 | 0.16px | Gauche |
| **Caption** | 400 | `14px` | 1.5 | 0.14px | Gauche |
| **Nav** | 500 | `15px` | 1.4 | 0.15px | Gauche |
| **Button** | 500 | `15px` | 1.4 | — | Gauche |
| **Micro** | 500 | `12px` | 1.4 | 0.1em | Gauche |

**Règles** :
- Inter uniquement. Aucune police serif.
- `font-display: swap` sur toutes les polices.
- `text-wrap: balance` sur les titres.
- `white-space: pre-line` sur les headlines multi-lignes.

### 2.3 Couleurs — Palette

| Rôle | Valeur | Usage |
|---|---|---|
| Fond primaire | `#ffffff` | Page principale, cartes |
| Fond secondaire | `#f5f5f5` | Sections alternées |
| Fond chaud | `#f5f3f1` | Sections chaudes (impact, math, articles) |
| Texte primaire | `#000000` | Titres, corps |
| Texte secondaire | `#4e4e4e` | Descriptions, sous-titres |
| Texte tertiaire | `#777169` | Eyebrows, captions, légendes |
| Grain overlay | `rgba(0,0,0,0.08-0.10)` | Texture sur cartes gradient |
| Focus outline | `rgb(147 197 253 / 0.5)` | Accessibilité |

**Valeurs hors tokens (inline)** :
| Valeur | Où |
|---|---|
| `#222` | `.btn-black:hover` |
| `#ffffff` | Titres sur cartes gradient |
| `rgba(255,255,255,0.9)` | Texte secondaire sur cartes |
| `#A0C4FF` | Sélection active (feature tabs) |
| `#0A0A0A` | Titres dans cartes sombres |
| `#3E3B38` | Lead dans sections warm |

### 2.4 Ombres & effets

#### Grain SVG

```svg
<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'>
  <filter id='noise'>
    <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/>
  </filter>
  <rect width='100%' height='100%' filter='url(%23noise)' opacity='1'/>
</svg>
```

- `background-size: 128px 128px`
- `opacity: 0.1` (sur cartes sombres)
- `opacity: 0.4` (sur cartes gradient)
- `mix-blend-mode: overlay`

#### Backdrop-filter

- Navbar : `blur(12px)` quand scrolled
- Date badges : `blur(8px)`
- Mobile : `backdrop-filter: none` (performance)

### 2.5 Animation & motion

#### Durées par élément

| Élément | Durée | Easing |
|---|---|---|
| Link hover (couleur) | 0.18s | ease |
| Link hover (underline scaleX) | 0.25s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Button hover (bg) | 0.18s | ease |
| Button hover (shadow) | 0.18s | ease |
| Card hover (transform) | 0.4s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Card hover (bg scale) | 0.5s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Card hover (box-shadow) | 0.2s | ease |
| Dropdown apparition | 0.2s | ease |
| Mobile overlay fadeIn | 0.2s | ease |
| Mobile link fadeInUp | 0.4s | ease |
| Scroll reveal (section) | 0.6s | ease |
| Scroll reveal stagger | 50ms | — |
| Gradient shift | 8s | ease infinite |

#### Keyframes

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

#### Accessibilité

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2.6 Responsive

| Breakpoint | Nom | Effets |
|---|---|---|
| `< 768px` | Mobile | Nav burger, hover animations désactivées, footer vertical, grids 1 colonne |
| `768px – 1024px` | Tablet | Section-gap réduit, backdrop-filter désactivé, footer 2 colonnes |
| `> 1024px` | Desktop | Expérience complète |

#### Règles media queries clés

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
  /* Tous les hover animations sur cartes gradient désactivés */
  .module-card:hover,
  .integration-card:hover,
  .adaptive-cap-card:hover,
  .adaptive-out-card:hover {
    animation: none !important;
    transform: none !important;
    transition: none !important;
  }
}
```

---

## 3. Composants

### 3.1 Architecture des sections — Homepage

Ordre exact des sections sur la homepage (9 sections) :

```
NavBar (layout)
  HeroUnit
    ProductCardGrid
      ProductCard ×3 + descriptions
  ProblemSection
  SectorShowcase
  MathFeaturesSection
  TransformationTimeline
    AtmosphereOrb ×7
    Satellite ×14
    MeasurementBar
    StageTextPanel
  ImpactSection
    Tabs (Clients | Partenariat)
    3×1 CSS Grid (1fr 1.58fr 1fr)
  FaqSection
  CTABlock
    SuperButton (3-layer SVG)
  ArticlesFeaturesSection
FooterBlock (layout)
```

#### 1. NavBar

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
- **Dropdown** : position `absolute`, `top: calc(100% + 20px)`, min-width 220px, radius 16px, shadow `var(--shadow-card-full), var(--shadow-soft)`
- **Bridge invisible** : `.navbar-dropdown-bridge`, height 24px, entre le lien et le dropdown
- **Bouton "Contactez-nous"** : `.btn-pill.btn-black.navbar-cta`, padding 8px 18px, chevron 12px
- **LanguageSwitcher** : FR/EN toggle, à droite du login
- **Burger mobile** : `display: none` desktop, `display: block` < 1024px
- **Overlay mobile** : fixed inset 0, z-index 999, padding 80px var(--grid-margin) 40px
- **Liens mobile** : font-size `var(--text-heading)`, weight 300, stagger 40ms

#### 2. HeroUnit

- **Fichier** : `components/hero-unit.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding-top** : `calc(64px + var(--section-gap))`
- **Padding-bottom** : `var(--section-gap)`
- **Min-height** : `100vh`
- **Container** : max-width 720px (pas `container-wide`)
- **Eyebrow** : `t-caption` uppercase, weight 500, letter-spacing 0.14px, color `var(--text-tertiary)`, margin-bottom 24px
- **Headline** : `t-display` size `var(--text-hero)`, white-space pre-line, margin-bottom 20px
- **Subheadline** : `t-lead`, max-width 560px, white-space pre-line, margin-bottom 40px
- **ProductCardGrid** : 3 cartes gradient + descriptions en dessous
- **CTAs** :
  - Primaire (noir) : `.btn-pill.btn-black`, border-radius **8px** (pas pill !), padding 12px 20px, chevron 14px
  - Secondaire (warm) : `.btn-pill.btn-warm`, border-radius **8px**, padding 12px 20px, chevron 14px
- **Proof line** : `t-caption`, margin-top 32px, color `var(--text-tertiary)`
- **TopoLines** : position absolute, `left: calc(var(--grid-margin) + 720px)`, top 50%, transform translateY(-50%), width/height clamp(300-600px), opacity 0.5, z-index 0, pointer-events none

#### 3. ProductCardGrid + ProductCard

- **Fichier** : `components/product-card-grid.tsx`, `components/product-card.tsx`
- **Type** : Client
- **Props** : `{ lang: Locale }`
- **Grille** : 3 colonnes, gap 20px
- **ProductCard** :
  - Fond : gradient variable (4 patterns disponibles : Flows 5, Music 6, ImgVid 7, Acid 12)
  - Radius : 24px
  - Aspect-ratio : 1/1
  - Tag : badge en haut à gauche
  - Titre : en bas à gauche, blanc
  - Grain overlay
  - Hover : translateY(-4px)
- **Descriptions** : texte plain sous chaque carte, 2 lignes max, color `var(--text-secondary)`

#### 4. ProblemSection

- **Fichier** : `components/problem-section.tsx`
- **Type** : Serveur
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-secondary)` (`#f5f5f5`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Titre** : `t-display` size `clamp(28px, 4vw, 48px)`, white-space pre-line, max-width 800px
- **Contrepoint** : `t-lead`, max-width 600px, margin-top 24px

#### 5. SectorShowcase

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

#### 6. MathFeaturesSection

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

#### 7. TransformationTimeline

- **Fichier** : `components/transformation-timeline.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Structure** : 7-stage organizational transformation journey
- **AtmosphereOrb** : 7 orbs glassmorphism avec blob gradients
- **Satellite** : 14 satellites (2 par orb), orbiting
- **MeasurementBar** : 7 ticks avec numéros d'étape
- **StageTextPanel** : titre + description, aligné à gauche
- **Responsive** : < 768px simplifié

#### 8. ImpactSection

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

#### 9. FaqSection

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

#### 10. CTABlock

- **Fichier** : `components/cta-block.tsx`
- **Type** : Serveur
- **Props** : `{ lang: Locale; variant?: "section" | "final" }`
- **Variant "final"** :
  - Fond : `var(--bg-secondary)` (`#f5f5f5`)
  - Padding : `var(--section-gap) 0`
  - Container : max-width 720px
  - Titre : `t-display` size `var(--text-display)`, white-space pre-line, margin-bottom 24px
  - Sous-titre : `t-lead`, margin-bottom 40px
  - **SuperButton** : 3D layered SVG (bottom/middle/top), hover down, press deep, pas de texte overlay

#### 11. ArticlesFeaturesSection

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

#### — FooterBlock

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

### 3.2 Composants de page

| Composant | Page | Description |
|---|---|---|
| **CareersPageClient** | `/carrieres` | Hero two-column (Trial Program layout), Why Join Us 4 cards, department-filtered job list, CTABlock. |
| **JobDetailClient** | `/carrieres/[slug]` | Job detail avec tabs (Description/Apply), info box, markdown rendering, CV upload, autofill attributes, random 24-char URLs. |
| **SecurityPageClient** | `/security` | Sticky nav, engagement quote, 5 principles, 4-layer protections, infrastructure grid, FAQ accordion. |
| **AboutPageClient** | `/about` | Conviction block, history, 4-partner team (.avif), 4 approach cards, 4 signatures, 5 values, CTABlock variant="final". |
| **DemoClient** | `/demo` | Formulaire 7 champs (prénom, organisation, rôle, segment radio, objectif textarea, email, téléphone, préférence visio/onsite). Honeypot invisible. POST `/api/demo`. État success/error. |
| **AdaptiveIntelligenceModule** | `/modules/adaptive` | Hero gradient, 5 capability cards gradient avec grain, intelligence section, 6 outcome cards gradient. Traductions via `modules.adaptive.*`. |
| **VisualIntelligenceModule** | `/modules/visual` | Hero gradient, 6 capability sections, technical approach, outcomes. Traductions via `modules.visual.*`. |
| **ComposantsPage** | `/composants` | Inventaire interne : 21+ cartes avec preview visuel, nom, description, filename. Catégories : Layout, Interactive, Content, Navigation, Motion, Mockup, Form, Card, Page. |

### 3.3 Composants partagés / utilitaires

| Composant | Usage | Description |
|---|---|---|
| **TopoLines** | HeroUnit | Canvas rAF, lignes topographiques concentriques animées. Props : `count`, `height`, `lineColor`, `lineWidth`, `speed`. |
| **SuperButton** | CTABlock | 3D layered SVG button (bottom/middle/top). Hover : translateY(4px), active : translateY(8px). Pas de texte overlay — le texte est à côté. |
| **LogomarkMotion** | FooterBlock | 17 carrés SVG (130×130 viewBox), animation `lmDrop` W02 Drop Physics, stagger 40ms. |
| **NavBar** | Layout | Header fixe avec dropdowns. Voir section 3.1.1. |
| **FooterBlock** | Layout | Footer 5 colonnes. Voir section 3.1.15. |
| **MegaMenu** | NavBar | Desktop dropdown menus (fit-content width, maxWidth 640px, nowrap). |
| **MobileAccordionNav** | NavBar | Mobile fullscreen nav (accordion pour Entreprise uniquement). |
| **LanguageSwitcher** | NavBar | FR/EN toggle (à droite du Login). |
| **AtmosphereOrb** | TransformationTimeline | Glassmorphism orbs avec blob gradients. |
| **MeasurementBar** | TransformationTimeline | 7 ticks avec numéros d'étape. |
| **BurgerMorph** | NavBar | Spring-animated SVG menu icon. |

### 3.4 Composants morts — NE PAS UTILISER

| Composant | Raison |
|---|---|
| `animated-lines.tsx` | SVG vague, jamais importé |
| `mosaic-module.tsx` | Grille mosaic avec tabs, jamais importée |
| `steps-section.tsx` | 3 étapes avec `VisualOrb`, jamais importée |
| `segments-section.tsx` | 4 segments avec `VisualOrb`, jamais importée |
| `product-card.tsx` (ancien) | 3 cartes produit avec `VisualOrb`, jamais importées |
| `visual-orb.tsx` | Orbs gradient circulaires. Tous ses consommateurs sont morts. |
| `bento-section.tsx` | Section bento retirée de la homepage |
| `modules-section.tsx` | Section modules retirée de la homepage |
| `proof-section.tsx` | Section preuve retirée de la homepage |
| `shifts-section.tsx` | Section shifts retirée de la homepage |
| `integration-section.tsx` | Section intégration retirée de la homepage |
| `not-lms-section.tsx` | Section NotLMS retirée de la homepage |
| `interactive-showcase.tsx` | Déplacée vers `/composants` |
| `combination-section.tsx` | Section combination retirée de la homepage |

---

## 4. Spécifications par page

### 4.1 Homepage (`/{lang}/`)

Sections dans l'ordre exact :

1. NavBar (layout)
2. HeroUnit
3. ProblemSection
4. SectorShowcase
5. MathFeaturesSection
6. TransformationTimeline
7. ImpactSection
8. FaqSection
9. CTABlock (variant "final")
10. ArticlesFeaturesSection
11. FooterBlock (layout)

**Sections retirées** (anciennement sur la homepage) : BentoSection, ModulesSection, ProofSection, ShiftsSection, IntegrationSection, NotLmsSection, InteractiveShowcase, CombinationSection.

### 4.2 Demo (`/{lang}/demo`)

- **Titre** : `t-display` size `var(--text-display)`, white-space pre-line
- **Description** : `t-lead`
- **Formulaire** :
  - Grille 2 colonnes : prénom + organisation, rôle + segment (select)
  - Textarea : objectif (max 200 caractères)
  - Grille 2 colonnes : email + téléphone
  - Radios : visioconférence / sur site
  - Honeypot : `name="honeypot"`, tabindex -1, display none
  - Bouton submit : `.btn-pill.btn-black`, width 100%, chevron 14px
  - Autofill : `autoComplete="given-name"`, `"family-name"`, `"email"`, `"tel"`, `"organization"`
- **État success** : "Merci." + message de confirmation
- **État error** : message d'erreur rouge `#c62828`
- **Pricing note** : `t-caption`, margin-top 48px, centré, color `var(--text-tertiary)`

### 4.3 Carrières (`/{lang}/carrieres`)

- **Hero** — Two-column Trial Program layout :
  - Gauche : eyebrow uppercase 12px/0.18em, titre `t-display` clamp(28px,4vw,44px), description lead, 4 features avec checkmark SVG, CTA bouton noir radius 12px
  - Droite : image `/images/team/chat%20window.avif`, 380×380px, radius 24px
  - Responsive : stacks below 768px, image aspect-ratio 2/1
  - Border-bottom : `1px solid var(--border-light)`
- **Why Join Us** : 4 cartes sur fond `#FAFAF8`
- **Postes ouverts** : filtres par département (pills), liste verticale
- **CTA** : `CTABlock variant="final"`

### 4.4 Carrières — Détail (`/{lang}/carrieres/[slug]`)

- **URL** : 24 caractères alphanumériques aléatoires (ex: `/carrieres/a1B2c3D4e5F6g7H8i9J0k1L2`)
- **Tabs** : Description / Candidature
- **Info box** : département, type, lieu, référence
- **Description** : rendu markdown (• → `<ul><li>`, ## → `<h3>`)
- **Formulaire** : prénom, nom, email, téléphone, LinkedIn, CV (PDF, 6MB max, auto-nommé `{nom}-{prenom}-cv.pdf`), message
- **Autofill** : `autoComplete="given-name"`, `"family-name"`, `"email"`, `"tel"`, `"url"`, `"organization"`

### 4.5 Modules / Adaptive (`/{lang}/modules/adaptive`)

- **Hero** : gradient CSS, eyebrow "Module", titre "Adaptive Intelligence", description
- **Capabilities** : 5 cartes gradient avec grain
  - Personnalisation, Contexte, Optimisation, IA, Synchronisation
  - Chaque carte : titre + liste de items avec tiret "—"
- **Intelligence system** : titre + description + liste
- **Outcomes** : 6 cartes gradient
- **Positioning** : texte de positionnement

### 4.6 Modules / Visual (`/{lang}/modules/visual`)

- **Hero** : gradient CSS, eyebrow "Module", titre "Visual Intelligence Layer"
- **Capabilities** : 6 sections
  - CSS Visuals, Adaptation, Performance, IA, Design, Technique
- **Outcomes** : 6 items
- **Implementation note** : paragraphe technique

### 4.7 Composants (`/{lang}/composants`)

- **Titre** : "Composants"
- **Description** : "Inventaire interne des composants React de MentivisOS..."
- **Grille** : `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`, gap 20px
- **Catégories** : Layout, Interactive, Content, Navigation, Motion, Mockup, Form, Card, Page
- **Chaque carte** :
  - Preview area : min-height 140px, fond `var(--bg-secondary)`
  - Info : colored dot (8px) + nom + description + filename (code)
- **Previews live** : ChatMockup, ChartMockup, TopoLines, ModuleCard
- **Previews CSS mockup** : tous les autres composants

### 4.8 Sécurité (`/{lang}/security`)

- **Sticky nav** : 4 ancres (Engagement, Principes, Protections, Infrastructure)
- **Engagement** : citation + auteur
- **5 principes** : grille 2×2 + 1 centrée
- **4 protections** : cartes avec icônes
- **Infrastructure** : grille de features
- **FAQ** : accordéon 5 questions

### 4.9 À propos (`/{lang}/about`)

- **Conviction** : texte de conviction + image
- **Histoire** : timeline courte
- **Équipe** : 4 fondateurs (.avif git-tracked)
- **Approche** : 4 cartes
- **Signatures** : 4 blocs de texte
- **Valeurs** : 5 valeurs
- **CTA** : `CTABlock variant="final"` (style HP)

---

## 5. Assets visuels

### 5.1 Logo & brand

| Fichier | Chemin | Usage | Dimensions |
|---|---|---|---|
| Wordmark noir | `/images/MentivisOS/mentivisos-logo-wordmark-noir.svg` | Navbar | 36px height |
| Logomark noir | `/images/MentivisOS/mentivisos-logomark-noir.svg` | Footer motion | 80px |
| Logomark blanc | `/images/MentivisOS/mentivisos-logomark-blanc.svg` | Variante | — |
| Photo brand | `/images/MentivisOS/mentivos.avif` | Asset photo | — |

### 5.2 Équipe (tous git-trackés)

| Fichier | Chemin | Usage |
|---|---|---|
| Roxan Roumegas | `/images/team/roxan-roumegas.avif` | Page /about |
| Mathias Costes | `/images/team/mathias-costes.avif` | Page /about |
| Steven Delcourt | `/images/team/steven-delcourt.avif` | Page /about |
| Julie Steiner | `/images/team/julie-steiner.avif` | Page /about |
| Chat window | `/images/team/chat%20window.avif` | Page /carrieres hero |

### 5.3 Bibliothèque de référence (`visuals-library/`)

| Fichier | Contenu | Statut |
|---|---|---|
| `mentivisOS_math_visuals.html` | 24 courbes paramétriques (Lorenz, Koch, Phyllotaxis, Hilbert, Möbius...) | **Utilisé** : Phyllotaxis, Hilbert, Möbius |
| `mentivisOS_articles_features.html` | Articles gradient + features géométriques | **Utilisé** : structure des articles |
| `mentivisOS_interactive_showcase.html` | Carousel orbs avec tabs | **Utilisé** : InteractiveShowcase (déplacé vers /composants) |
| `mentivisOS_impact_section.html` | Bento grid impact avec tabs | **Utilisé** : ImpactSection |
| `mentivisOS_logomark_motion.html` | 24 animations logo CSS | **Utilisé** : W02 Drop Physics |
| `mentivisOS_funky_visual_library.html` | 24 patterns colorés | Référence future |
| `mentivisOS_visual_library.html` | 24 visuels dark theme | Référence future |
| `mentivisOS_light_visual_library.html` | 24 visuels light theme | Référence future |

---

## 6. Patterns & conventions

### 6.1 i18n

- **Fichier** : `lib/i18n.ts`
- **Type** : `Locale = "fr" | "en"`
- **Défaut** : `fr`
- **Fonction** : `getT(locale)` retourne l'objet de traduction complet
- **Clés top-level** : nav, hero, products, problem, sectors, mathFeatures, timeline, impact, faq, finalCta, articles, footer, demo, careers, ambassadors, security, about, modules, legal, privacy, terms

### 6.2 Routing

- **Fichier** : `app/proxy.ts`
- **Comportement** : redirige `/` → `/fr/`
- **Locales supportées** : `fr`, `en`
- **Pattern** : `[lang]` pour toutes les pages
- **Params** : `params: Promise<{ lang: string }>` (Next.js 16)
- **Careers** : `/{lang}/carrieres` (liste), `/{lang}/carrieres/[slug]` (détail)

### 6.3 API

| Route | Méthode | Description |
|---|---|---|
| `/api/demo` | POST | Formulaire demo → HubSpot. Rate limit 5/min/IP, honeypot, CORS. |
| `/api/job-applications` | POST | Candidature → upload CV + auto HubSpot. |
| `/api/jobs` | GET | Liste publique des offres. |
| `/api/jobs/[slug]` | GET | Détail d'une offre. |
| `/api/cms/jobs` | CRUD | CMS jobs (admin). |
| `/api/cms/job-applications` | GET/PUT | CMS candidatures (admin). |
| `/api/cvs/[filename]` | GET | Téléchargement CV. |
| `/api/blog/posts` | GET | Liste articles blog. |
| `/api/blog/posts/[slug]` | GET | Détail article blog. |

**HubSpot** : auto-send sur demo et candidatures. `lien_cv` text field pour URL CV (API v3 ne supporte pas les fichiers).

### 6.4 Build & déploiement

- **Dev** : `npm run dev` (alias `next dev --webpack`)
- **Build** : `rm -rf .next && npm run build` (alias `next build --webpack`)
- **Déploiement** : `./scripts/deploy-unlock.sh`
- **Host** : o2switch shared (terre.o2switch.net), user sc4bovu7233, Passenger
- **Port** : 3001 (3000 occupé par lsphp/Passenger)
- **App root** : `/home/sc4bovu7233/nextapp`
- **Data dir** : `/home/sc4bovu7233/data/` (persistent)
- **Node** : v20.20.2
- **Workers limit** : `experimental.cpus: 2` (évite OOM)

### 6.5 Architecture des composants

- **Server components** par défaut
- **Client components** : marqués `"use client"`, uniquement quand nécessaire (state, effets, event handlers)
- **Pas de `onMouseEnter`/`onMouseLeave` sur les server components** — utiliser CSS `:hover` à la place
- **Proxy** : `proxy.ts` (pas `middleware.ts`)

---

## 7. Éléments écartés

### Polices
- **Cormorant Garamond** — présente dans les fichiers HTML source (`visuals-library/`), jamais utilisée dans le code
- **Playfair Display** — référencée dans `AGENTS.md`, jamais chargée
- **DM Mono** — référencée dans `AGENTS.md`, jamais chargée
- **Outfit** — présente dans les fichiers HTML source, jamais utilisée

### Composants morts
- `animated-lines.tsx`
- `mosaic-module.tsx`
- `steps-section.tsx`
- `segments-section.tsx`
- `product-card.tsx` (ancien, avec VisualOrb)
- `visual-orb.tsx`
- `bento-section.tsx`
- `modules-section.tsx`
- `proof-section.tsx`
- `shifts-section.tsx`
- `integration-section.tsx`
- `not-lms-section.tsx`
- `interactive-showcase.tsx` (déplacé vers /composants)
- `combination-section.tsx`

### Patterns abandonnés
- Orbs circulaires (`border-radius: 50%`) — remplacés par des carrés arrondis (`border-radius: 32px`)
- Boutons pill extremes (`border-radius: 9999px`) sur les CTAs hero — remplacés par `border-radius: 8px`
- `overflow: hidden` sur le hero — supprimé pour éviter le cropping des TopoLines
- Timer-based dropdowns (150ms) — remplacés par un bridge element invisible
- Homepage à 15+ sections — stripée à 9 sections narrative

### Anciens tokens
- Couleurs sombres du design system v1 (remplacées par la palette blanche/chaude)
- `--color-ground` et variants blueprint (remplacés par `#ffffff` et `#f5f5f5`)

---

> Document généré le 13 mai 2026. Dernière mise à jour : sections Carrières, ImpactSection finale, SuperButton, TransformationTimeline.
