# PROCESS.md — MentivisOS Development Workflow

## 0. Critical Rules

### Webpack, NOT Turbopack

Turbopack has known chunk naming bugs (GitHub #87680, #88775) that cause `ChunkLoadError`.
Always use `--webpack`:

```bash
npm run dev       # uses --webpack
npm run build     # uses --webpack
```

Never run `next dev` or `next build` without the `--webpack` flag.

### Clean Builds

When chunk filenames change (every source change), old and new chunks can coexist.
Always do a clean build:

```bash
rm -rf .next
npm run build
```

---

## Project Structure

```
mentivis-os/
├── app/
│   ├── layout.tsx              # Root: fonts, metadata
│   ├── globals.css             # Design tokens
│   ├── proxy.ts                # Locale routing (FR/EN)
│   ├── [lang]/
│   │   ├── layout.tsx          # NavBar + Footer shell
│   │   ├── page.tsx            # Homepage
│   │   └── demo/page.tsx       # Demo request
│   └── api/
│       └── demo/route.ts       # Serverless: form → HubSpot
├── components/                 # UI components
├── lib/
│   └── i18n.ts                 # Translations (FR/EN)
├── docs/
│   ├── MentivisOS_design-v2.md         # Design system spec
│   └── mentivisOS_website_structure_v2.md  # Site structure
├── public/images/MentivisOS/   # Logos, assets
├── .env.local                  # Secrets (gitignored)
├── .env.example                # Template
├── PROCESS.md                  # This file
└── AGENTS.md                   # Coding conventions
```

---

## Environment Variables

Set in Vercel dashboard or `.env.local`:

| Variable | Purpose | Required |
|----------|---------|----------|
| `HUBSPOT_PORTAL_ID` | HubSpot account ID | For live form submissions |
| `HUBSPOT_FORM_ID` | Demo form GUID | For live form submissions |
| `INTERNAL_TOKEN` | API auth token | Future: protect API routes |
| `ALLOWED_ORIGINS` | CORS whitelist | Comma-separated URLs |

**Never commit `.env.local`.** Use `.env.example` as template.

---

## API Security (`/api/demo`)

The demo form POSTs to `/api/demo` which relays to HubSpot. Protected by:

1. **Rate limiting**: 5 requests per minute per IP (in-memory)
2. **CORS**: Only allowed origins can POST
3. **Honeypot**: Hidden `honeypot` field catches bots
4. **Server-only**: API routes never bundle to client

The API route is invisible to the public — it only responds to POST requests.

---

## Phase 1: Foundation ✅

- [x] Next.js 16 + TypeScript + App Router
- [x] CSS custom properties (dark mode, amber accent, blueprint grid)
- [x] Font loading: Playfair Display, DM Mono, Inter (self-hosted via next/font)
- [x] Grid system, container widths, section gaps
- [x] Bilingual routing via `proxy.ts` (FR/EN)

## Phase 2: Shared Components ✅

- [x] `<NavBar />` — fixed 56px, scroll-aware, dropdowns, mobile hamburger
- [x] `<FooterBlock />` — multi-column layout
- [x] `<CTABlock />` — section closers + final fullscreen CTA
- [x] `<HeroUnit />` — 100vh, canvas wireframe background
- [x] `<ProductCard />` — three-product suite strip
- [ ] `<CustomCursor />` — amber circle with trailing effect
- [ ] `<StatCard />` — animated counter with IntersectionObserver
- [ ] `<ArticleCard />` — blog card with hover states

## Phase 3: Homepage ✅

- [x] Hero with wireframe canvas
- [x] Product suite strip (3 cards)
- [x] Problem statement section
- [x] Three steps section
- [x] Proof case (aeronautique diagnostic)
- [x] Segments grid (4 cards)
- [x] Four shifts section
- [x] Integration modes (3 cards)
- [x] Not-LMS comparison (2 columns)
- [x] Combination/credibility section
- [x] Final CTA with watermark

## Phase 4: Inner Pages (TODO)

Follow `docs/mentivisOS_website_structure_v2.md`:

1. `/[lang]/produit/` — Product overview
2. `/[lang]/produit/diagnostic/` — Diagnostic deep dive
3. `/[lang]/produit/programme/` — Program generation
4. `/[lang]/produit/assistant/` — Embedded assistant
5. `/[lang]/pour-qui/individuel/` — Individual segment
6. `/[lang]/pour-qui/corporate/` — Corporate segment
7. `/[lang]/pour-qui/formation/` — Training organizations
8. `/[lang]/pour-qui/competences/` — ESN & consulting
9. `/[lang]/integration/` — Integration overview
10. `/[lang]/integration/acces-direct/` — Direct access
11. `/[lang]/integration/licence-entreprise/` — Enterprise license
12. `/[lang]/integration/api/` — API integration
13. `/[lang]/a-propos/` — About page
14. `/[lang]/ressources/insights/` — Blog listing
15. `/[lang]/ressources/guides/` — Downloadable guides

## Phase 5: Polish & Performance (TODO)

1. **Animation audit** — entry, hover, scroll-driven, prefers-reduced-motion
2. **Responsive testing** — mobile, tablet, desktop
3. **Performance** — critical CSS, lazy-load, font subsetting
4. **Accessibility** — WCAG AA, focus indicators, keyboard nav
5. **Lighthouse** — Performance 90+, Accessibility 98+, Best Practices 100, SEO 95+

---

## Quality Gates

Before committing:

- [ ] Matches design spec (`docs/MentivisOS_design-v2.md`)
- [ ] Responsive at all three breakpoints
- [ ] No hardcoded colors — always CSS tokens
- [ ] `prefers-reduced-motion` respected
- [ ] French content matches `docs/mentivisOS_website_structure_v2.md`
- [ ] No forbidden vocabulary (innovation, disruption, révolutionnaire, solution, écosystème)
- [ ] One primary CTA per page
- [ ] Build passes: `npm run build`

---

## Git Workflow

- **Remote**: `origin` → `git@github.com:stevedelcourt/mentivis-os.git`
- **Branch**: `main`
- **User**: stevedelcourt / steven.delcourt@mentivis.com
- Feature branches: `feature/<section-name>`
- Commit messages: imperative mood, concise
- Push triggers Vercel auto-deploy

---

## Deployment

### Vercel (Production)

```bash
git push origin main
# or
vercel --prod --scope steves-projects-09f7051e --yes
```

URL: https://mentivis-os.vercel.app

### Local Dev

```bash
npm run dev       # Webpack, not Turbopack
```

### Clean Build

```bash
rm -rf .next
npm run build     # Webpack
```
