# MentivisOS — Design System Final

> Référence absolue du design system. Document de travail pour l'équipe de développement.

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
| Framework | Next.js 16.2.6 + TypeScript + App Router |
| Bundler | Webpack UNIQUEMENT (`next build --webpack`) |
| Styling | CSS custom properties uniquement |
| Fonts | Inter (Google Fonts) |
| i18n | `lib/i18n.ts` — FR/EN, FR par défaut |
| Routing | `proxy.ts` (pas `middleware.ts`) |
| Lang par défaut | `fr` |

---

## 2. Système de design

### 2.1 Tokens CSS

#### Fonds

| Token | Valeur | Usage |
|---|---|---|
| `--bg-primary` | `#ffffff` | Fond de page principal |
| `--bg-secondary` | `#f5f5f5` | Sections alternées |
| `--bg-warm` | `#f5f2ef` | Sections chaudes (impact, math, articles) |
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
| Fond secondaire | `#f5f5f5` | Sections alternées (problem, shifts, CTA) |
| Fond chaud | `#f5f2ef` | Sections chaudes (impact, math features, articles) |
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
| `#0A0A0A` | Titres dans cartes sombres (impact, showcase) |
| `#777169` | Texte tertiaire dans cartes sombres |
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

### 3.1 Composants actifs — Homepage

Ordre exact des sections sur la homepage :

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
- **Liens desktop** : 5 items avec dropdowns (gap 32px)
  - Produit, Pour qui, Intégration, Ressources, À propos
  - Chaque lien : `t-nav` weight 500, underline animé (scaleX 0→1, 0.25s, cubic-bezier(0.22,1,0.36,1))
- **Dropdown** : position `absolute`, `top: calc(100% + 20px)`, min-width 220px, radius 16px, shadow `var(--shadow-card-full), var(--shadow-soft)`
- **Bridge invisible** : `.navbar-dropdown-bridge`, height 24px, entre le lien et le dropdown
- **Bouton "Démarrer"** : `.btn-pill.btn-black.navbar-cta`, padding 8px 18px, chevron 12px
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
- **CTAs** :
  - Primaire (noir) : `.btn-pill.btn-black`, border-radius **8px** (pas pill !), padding 12px 20px, chevron 14px
  - Secondaire (warm) : `.btn-pill.btn-warm`, border-radius **8px**, padding 12px 20px, chevron 14px
- **Proof line** : `t-caption`, margin-top 32px, color `var(--text-tertiary)`
- **TopoLines** : position absolute, `left: calc(var(--grid-margin) + 720px)`, top 50%, transform translateY(-50%), width/height clamp(300-600px), opacity 0.5, z-index 0, pointer-events none

#### 3. BentoSection

- **Fichier** : `components/bento-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Top row** : grille 2 colonnes, gap 20px
  - **Gauche** (Agents) : fond `linear-gradient(135deg, #1a3a2a, #2d5a3d, #4a7c5c, #8fb8a0)`, radius 32px, min-height 480px, padding 40px
    - ChatMockup en haut (bulles CSS)
    - Titre + description en bas
    - Grain overlay
  - **Droite** (Analytics) : fond `#f5f5f5`, radius 32px, padding 40px
    - ChartMockup en haut
    - Titre + description en bas
- **Bottom row** : grille 3 colonnes, gap 20px
  - 3 cartes `#f5f5f5` radius 24px, padding 32px
  - Chaque carte : icône lucide (TestTube, Hand, Workflow) dans un cercle blanc radius 12px, titre, description
- **Footer row** : flex space-between, margin-top 32px
  - Logos placeholders + texte
  - Bouton pill avec chevron
- **Responsive** : < 1024px top row 1 colonne, < 768px bottom row 1 colonne

#### 4. ModulesSection

- **Fichier** : `components/modules-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Header** : flex space-between, align-items flex-end, margin-bottom 48px
  - Titre : `t-display` size `clamp(28px, 4vw, 44px)`, line-height 1.1
  - Sous-titre : 16px weight 300, color `var(--text-secondary)`
  - Bouton "En savoir plus" : pill blanc, border `#e5e5e5`, chevron 14px
- **Grille** : 3 colonnes, gap 20px
  - 6 cartes, chaque carte : fond `#f5f5f5`, radius 24px, padding 32px 28px 28px
  - Illustration SVG line-art au centre (140×140px)
  - Titre : 17px weight 500, color `#1a1a1a`
  - Description : 14px weight 300, color `#6b6b6b`
  - Hover : fond `#eeeeee`, transition 0.18s
- **Responsive** : < 1024px 2 colonnes, < 768px 1 colonne

#### 5. ProblemSection

- **Fichier** : `components/problem-section.tsx`
- **Type** : Serveur
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-secondary)` (`#f5f5f5`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Titre** : `t-display` size `clamp(28px, 4vw, 48px)`, white-space pre-line, max-width 800px
- **Contrepoint** : `t-lead`, max-width 600px, margin-top 24px

#### 6. ProofSection

- **Fichier** : `components/proof-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Eyebrow** : `t-caption` uppercase, weight 500, letter-spacing 0.1em, color `var(--text-tertiary)`, margin-bottom 16px
- **Situation** : `t-lead`, max-width 720px, margin-bottom 40px
- **Carte outputs** : `.card`, padding 32px, max-width 640px, fade-in au scroll
  - Header : `t-caption` uppercase, weight 500, letter-spacing 0.06em, color `var(--text-tertiary)`, margin-bottom 24px
  - 6 lignes de données : `t-caption`, padding 10px 0, border-bottom `1px solid var(--border-light)` sauf dernière
- **Blockquote** : `t-caption`, italic, color `var(--text-tertiary)`, margin-top 24px, padding-left 16px, border-left `2px solid var(--border-light)`
- **Éditorial** : `t-caption`, margin-top 32px, color `var(--text-secondary)`

#### 7. ShiftsSection

- **Fichier** : `components/shifts-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-secondary)` (`#f5f5f5`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Titre** : `t-display` size `var(--text-display)`, margin-bottom 48px
- **Liste** : flex colonne, gap 32px
  - 4 items, chaque item : flex row, gap 24px, align-items flex-start
  - Numéro : `t-caption` weight 500, color `var(--text-tertiary)`, flex-shrink 0, margin-top 4px
  - Titre : `t-display` size `var(--text-heading)`, margin-bottom 8px
  - Body : `t-caption`, max-width 640px
  - Stagger : 50ms par item

#### 8. IntegrationSection

- **Fichier** : `components/integration-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Titre** : `t-display` size `var(--text-display)`, margin-bottom 48px
- **Grille** : 3 colonnes, gap 24px
  - 3 cartes, chaque carte : `.integration-card`, radius 24px, overflow hidden
    - Fond : gradient variable (`--integration-grad-1` à `3`)
    - Grain overlay
    - Contenu : titre 22px weight 300 blanc, description 15px weight 300 blanc à 90%
    - Hover : scale 1.02, bg scale 1.05, gradient-shift 8s
  - Stagger : 50ms
- **Lien** : "Voir le détail des modes d'intégration", `t-caption`, color `var(--text-tertiary)`, chevron 14px, margin-top 40px
- **Responsive** : < 1024px 1 colonne

#### 9. NotLmsSection

- **Fichier** : `components/not-lms-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-secondary)` (`#f5f5f5`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Titre** : `t-display` size `var(--text-display)`, margin-bottom 48px
- **Grille** : 2 colonnes, gap 48px, fade-in au scroll
  - Colonne LMS : titre `t-caption` uppercase, weight 500, letter-spacing 0.1em, color `var(--text-tertiary)`
    - 4 items : `t-caption`, padding 10px 0, border-bottom, color `var(--text-tertiary)`
  - Colonne MentivisOS : même style, color `var(--text-primary)`
- **Responsive** : < 1024px 1 colonne

#### 10. InteractiveShowcase

- **Fichier** : `components/interactive-showcase.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-warm)` (`#f5f2ef`)
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Carte principale** : max-width 1180px, fond `#F2EEE7`, radius 32px, padding 36px 40px 28px
  - **Top bar** : flex space-between
    - Tabs produits : 3 pills (Atelier/Operate/Intel), fond `rgba(0,0,0,0.03)`, radius 9999px, padding 5px
      - Actif : fond blanc, shadow `0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)`
      - Chaque tab : dot gradient 18px radius 50% + label
    - Titre + sous-titre à droite, aligné à droite
  - **Stage** : min-height 480px, position relative
    - 7 orbs (carrés arrondis, PAS cercles)
    - Orb actif : width 280px, height 280px, **border-radius 32px**
    - Orbs adjacents : scale 0.62, opacity 0.95
    - Orbs lointains : scale 0.42, opacity 0.55
    - Grain overlay sur chaque orb (border-radius 32px)
    - Play button : 60×60px, **border-radius 16px** (PAS cercle), blanc, shadow
    - Nav flèches : 34×34px, border-radius 50%, transparent, z-index 20
  - **Bottom bar** : flex space-between, border-top `1px solid rgba(0,0,0,0.08)`
    - Feature tabs : 5 items (Diagnostic IA, Programme adaptatif...)
      - Actif : weight 500, dernière mot highlight `#A0C4FF`
    - CTA pill noir avec chevron 14px
- **Animations** : orb pulse 1.4s, carousel transition 0.7s `cubic-bezier(0.22,1,0.36,1)`, opacity 0.55s

#### 11. ImpactSection

- **Fichier** : `components/impact-section.tsx`
- **Type** : Client (`"use client"`)
- **Props** : `{ lang: Locale }`
- **Fond** : `#F5F2EF`
- **Padding** : `var(--section-gap) 0`
- **Container** : `.container` (1240px)
- **Titre** : `t-display` size `clamp(28px, 4vw, 44px)`, weight 300, line-height 1.1
- **Tabs** : 2 pills (MentivisAtelier / MentivisOperate)
  - Actif : fond blanc, shadow multi-couche
  - Inactif : transparent, hover `rgba(0,0,0,0.04)`
- **Bento grid** : `grid-template-columns: 1fr 1.56fr 1fr`, `grid-template-rows: 1fr 1fr`, gap 12px, height 620px
  - **Card A** : grid-row 1, grid-column 1, gradient chaud (ambre/terra-cotta), grain overlay, contenu blanc avec logo-chip
  - **Card B** : grid-row 1/3, grid-column 2, fond sombre atmosphérique, détails géométriques, grain
  - **Card C** : grid-row 1, grid-column 3, **ghost transparent** (layout uniquement)
  - **Card D** : grid-row 2, grid-column 1, **ghost transparent** (layout uniquement)
  - **Card E** : grid-row 2, grid-column 3, gradient gris/B&W, grain, tag + caption
  - Hover : scale 1.014, shadow `0 12px 40px rgba(0,0,0,.12)`
- **Responsive** :
  - < 800px : 2 colonnes, card C et D hidden
  - < 520px : 1 colonne

#### 12. CombinationSection

- **Fichier** : `components/combination-section.tsx`
- **Type** : Serveur
- **Props** : `{ lang: Locale }`
- **Fond** : `var(--bg-primary)` (`#ffffff`)
- **Padding** : `var(--section-gap) 0`
- **Container** : max-width 720px
- **Corps** : `t-lead`, white-space pre-line
- **Lien** : "En savoir plus sur Mentivis", `t-caption`, inline-flex, gap 6px, color `var(--text-tertiary)`, chevron 14px SVG

#### 13. MathFeaturesSection

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

#### 14. CTABlock

- **Fichier** : `components/cta-block.tsx`
- **Type** : Serveur
- **Props** : `{ lang: Locale; variant?: "section" | "final" }`
- **Variant "final"** :
  - Fond : `var(--bg-secondary)` (`#f5f5f5`)
  - Padding : `var(--section-gap) 0`
  - Titre : `t-display` size `var(--text-display)`, white-space pre-line, margin-bottom 24px
  - Sous-titre : `t-lead`, margin-bottom 40px
  - Bouton : `.btn-pill.btn-warm`, border-radius 8px, chevron 14px

#### 15. ArticlesFeaturesSection

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
| **DemoClient** | `/demo` | Formulaire 7 champs (prénom, organisation, rôle, segment radio, objectif textarea, email, téléphone, préférence visio/onsite). Honeypot invisible. POST `/api/demo`. État success/error. |
| **AdaptiveIntelligenceModule** | `/modules/adaptive` | Hero gradient, 5 capability cards gradient avec grain, intelligence section, 6 outcome cards gradient. Traductions via `modules.adaptive.*`. |
| **VisualIntelligenceModule** | `/modules/visual` | Hero gradient, 6 capability sections, technical approach, outcomes. Traductions via `modules.visual.*`. |
| **ComposantsPage** | `/composants` | Inventaire interne : 21+ cartes avec preview visuel, nom, description, filename. Catégories : Layout, Interactive, Content, Navigation, Motion, Mockup, Form, Card, Page. |

### 3.3 Composants partagés / utilitaires

| Composant | Usage | Description |
|---|---|---|
| **TopoLines** | HeroUnit | Canvas rAF, lignes topographiques concentriques animées. Props : `count`, `height`, `lineColor`, `lineWidth`, `speed`. |
| **ChatMockup** | BentoSection | 5 bulles CSS (utilisateur/agent), border-radius 20px, max-width 360px. |
| **ChartMockup** | BentoSection | SVG 2 séries (orange/bleu) + tooltip flottant. Props : `data`. |
| **LogomarkMotion** | FooterBlock | 17 carrés SVG (130×130 viewBox), animation `lmDrop` W02 Drop Physics, stagger 40ms. |
| **ModuleCard** | ComposantsPage | Carte carrée gradient + grain. Props : `title`, `href`, `gradientVar`, `delay`. |
| **NavBar** | Layout | Header fixe avec dropdowns. Voir section 3.1.1. |
| **FooterBlock** | Layout | Footer 5 colonnes. Voir section 3.1.15. |

### 3.4 Composants morts — NE PAS UTILISER

| Composant | Raison |
|---|---|
| `animated-lines.tsx` | SVG vague, jamais importé |
| `mosaic-module.tsx` | Grille mosaic avec tabs, jamais importée |
| `steps-section.tsx` | 3 étapes avec `VisualOrb`, jamais importée |
| `segments-section.tsx` | 4 segments avec `VisualOrb`, jamais importée |
| `product-card.tsx` | 3 cartes produit avec `VisualOrb`, jamais importées |
| `visual-orb.tsx` | Orbs gradient circulaires. Tous ses consommateurs sont morts. |

---

## 4. Spécifications par page

### 4.1 Homepage (`/{lang}/`)

Sections dans l'ordre exact :

1. NavBar (layout)
2. HeroUnit
3. BentoSection
4. ModulesSection
5. ProblemSection
6. ProofSection
7. ShiftsSection
8. IntegrationSection
9. NotLmsSection
10. InteractiveShowcase
11. ImpactSection
12. CombinationSection
13. MathFeaturesSection
14. CTABlock (variant "final")
15. ArticlesFeaturesSection
16. FooterBlock (layout)

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
- **État success** : "Merci." + message de confirmation
- **État error** : message d'erreur rouge `#c62828`
- **Pricing note** : `t-caption`, margin-top 48px, centré, color `var(--text-tertiary)`

### 4.3 Modules / Adaptive (`/{lang}/modules/adaptive`)

- **Hero** : gradient CSS, eyebrow "Module", titre "Adaptive Intelligence", description
- **Capabilities** : 5 cartes gradient avec grain
  - Personnalisation, Contexte, Optimisation, IA, Synchronisation
  - Chaque carte : titre + liste de items avec tiret "—"
- **Intelligence system** : titre + description + liste
- **Outcomes** : 6 cartes gradient
- **Positioning** : texte de positionnement

### 4.4 Modules / Visual (`/{lang}/modules/visual`)

- **Hero** : gradient CSS, eyebrow "Module", titre "Visual Intelligence Layer"
- **Capabilities** : 6 sections
  - CSS Visuals, Adaptation, Performance, IA, Design, Technique
- **Outcomes** : 6 items
- **Implementation note** : paragraphe technique

### 4.5 Composants (`/{lang}/composants`)

- **Titre** : "Composants"
- **Description** : "Inventaire interne des composants React de MentivisOS..."
- **Grille** : `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`, gap 20px
- **Catégories** : Layout, Interactive, Content, Navigation, Motion, Mockup, Form, Card, Page
- **Chaque carte** :
  - Preview area : min-height 140px, fond `var(--bg-secondary)`
  - Info : colored dot (8px) + nom + description + filename (code)
- **Previews live** : ChatMockup, ChartMockup, TopoLines, ModuleCard
- **Previews CSS mockup** : tous les autres composants

---

## 5. Assets visuels

### 5.1 Logo & brand

| Fichier | Chemin | Usage | Dimensions |
|---|---|---|---|
| Wordmark noir | `/images/MentivisOS/mentivisos-logo-wordmark-noir.svg` | Navbar | 36px height |
| Logomark noir | `/images/MentivisOS/mentivisos-logomark-noir.svg` | Footer motion | 80px |
| Logomark blanc | `/images/MentivisOS/mentivisos-logomark-blanc.svg` | Variante | — |
| Photo brand | `/images/MentivisOS/mentivos.avif` | Asset photo | — |

### 5.2 Bibliothèque de référence (`visuals-library/`)

| Fichier | Contenu | Statut |
|---|---|---|
| `mentivisOS_math_visuals.html` | 24 courbes paramétriques (Lorenz, Koch, Phyllotaxis, Hilbert, Möbius...) | **Utilisé** : Phyllotaxis, Hilbert, Möbius |
| `mentivisOS_articles_features.html` | Articles gradient + features géométriques | **Utilisé** : structure des articles |
| `mentivisOS_interactive_showcase.html` | Carousel orbs avec tabs | **Utilisé** : InteractiveShowcase |
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
- **18 clés top-level** : nav, hero, products, problem, steps, proof, modules, segments, shifts, integration, notLms, combination, finalCta, footer, demo

### 6.2 Routing

- **Fichier** : `app/proxy.ts`
- **Comportement** : redirige `/` → `/fr/`
- **Locales supportées** : `fr`, `en`
- **Pattern** : `[lang]` pour toutes les pages
- **Params** : `params: Promise<{ lang: string }>` (Next.js 16)

### 6.3 API

- **Route** : `POST /api/demo`
- **Fichier** : `app/api/demo/route.ts`
- **Sécurité** :
  - Rate limit : 5 requêtes/minute/IP
  - Honeypot : champ invisible `honeypot`
  - CORS : validation `ALLOWED_ORIGINS`
  - Champs requis : `firstname`, `email`
- **Relay** : POST vers HubSpot `api.hsforms.com`
- **Fallback** : si env vars manquantes, log console + success fallback

### 6.4 Build & déploiement

- **Dev** : `npm run dev` (alias `next dev --webpack`)
- **Build** : `rm -rf .next && npm run build` (alias `next build --webpack`)
- **Déploiement** : `npx vercel deploy --prod --yes --scope steves-projects-09f7051e`
- **Scope Vercel** : `steves-projects-09f7051e`

### 6.5 Architecture des composants

- **Server components** par défaut
- **Client components** : marqués `"use client"`, uniquement quand nécessaire (state, effets, event handlers)
- **Pas de `onMouseEnter`/`onMouseLeave` sur les server components** — utiliser CSS `:hover` à la place
- **Proxy** : `proxy.ts` (pas `middleware.ts`)

---

## 7. Roadmap

Pages futures prévues (non implémentées) :

| Page | Route | Description |
|---|---|---|
| **Produit** | `/{lang}/produit` | Page produit complète avec détail des 3 piliers |
| **Pour qui** | `/{lang}/pour-qui` | 4 segments : Individuel, Corporate, Formation, Compétences |
| **Intégration** | `/{lang}/integration` | Détail des 3 modes : accès direct, licence entreprise, API |
| **Ressources** | `/{lang}/ressources` | Insights, guides, articles |
| **À propos** | `/{lang}/a-propos` | Historique, équipe, valeurs |

---

## 8. Éléments écartés

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
- `product-card.tsx`
- `visual-orb.tsx`

### Patterns abandonnés
- Orbs circulaires (`border-radius: 50%`) — remplacés par des carrés arrondis (`border-radius: 32px`)
- Boutons pill extremes (`border-radius: 9999px`) sur les CTAs hero — remplacés par `border-radius: 8px`
- `overflow: hidden` sur le hero — supprimé pour éviter le cropping des TopoLines
- Timer-based dropdowns (150ms) — remplacés par un bridge element invisible

### Anciens tokens
- Couleurs sombres du design system v1 (remplacées par la palette ElevenLabs blanche/chaude)
- `--color-ground` et variants blueprint (remplacés par `#ffffff` et `#f5f5f5`)

---

> Document généré le 8 mai 2026. Dernière mise à jour : sections MathFeaturesSection et ArticlesFeaturesSection.
