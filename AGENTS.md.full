# AGENTS.md — MentivisOS

## Project Overview

MentivisOS is an AI-native pedagogical engine — not an LMS, not a catalog. It produces three things no LMS produces: a quantified diagnostic of the gap between a profile and an objective, an exact program calibrated to that gap, and embedded coaching that never deviates from the subject.

**Positioning**: radical, factual, anti-marketing. Built by practitioners, not consultants.

**Repository**: https://github.com/stevedelcourt/mentivis-os
**Production**: https://mentivis-os.vercel.app

---

## Tech Stack

- **Framework**: Next.js 16.2.6 + TypeScript + App Router
- **Build**: Webpack ONLY (`--webpack` flag). Turbopack has chunk naming bugs.
- **Styling**: CSS custom properties only, no utility framework
- **Fonts**: Playfair Display (display), DM Mono (interface), Inter (body) — via next/font
- **Language**: Bilingual FR/EN, default FR
- **Database**: SQLite via `sql.js` (pure JS/WASM)
- **Design system**: See `docs/MentivisOS_design-v2.md`

---

## Critical Rules

### 1. ALWAYS use Webpack

```bash
npm run dev       # next dev --webpack
npm run build     # next build --webpack
```

Never run `next dev` or `next build` without `--webpack`. Turbopack causes `ChunkLoadError`.

### 2. Clean builds on structural changes

```bash
rm -rf .next && npm run build
```

### 3. proxy.ts, not middleware.ts

Next.js 16 renamed `middleware.ts` to `proxy.ts`. The function must be exported as `proxy`.

### 4. No onMouseEnter/onMouseLeave on server components

Use CSS `:hover` selectors instead. Event handlers on `Link` in server components cause build errors.

### 5. Params typing

In Next.js 16, `params` from dynamic routes returns `Promise<{ lang: string }>`, not a specific union type. Cast with `as Locale` after awaiting.

### 6. Database: sql.js only

Use `sql.js` (pure JS/WASM) for SQLite. **Never** use `better-sqlite3` on o2switch — it fails due to missing GLIBC_2.29 and absent gcc.

### 7. Async DB layer

All functions in `lib/cms/db.ts` and `lib/cms/users.ts` are `async`. Always `await` them.

```typescript
// Correct
const posts = await getPublishedPosts();

// Wrong — will throw or return a Promise
const posts = getPublishedPosts();
```

### 8. Async auth guards

`getAuthUser()`, `requireAuth()`, and `requireRole()` are `async`. Always `await` them in API routes.

```typescript
// Correct
const auth = await requireAuth(request);
if (auth instanceof Response) return auth;

// Wrong
const auth = requireAuth(request);
```

### 9. WASM resolution

`sql.js` requires a `.wasm` file at runtime. Next.js `standalone` output does not bundle it. The runtime searches `process.cwd()` and parent directories. Ensure `serverExternalPackages: ["sql.js"]` is in `next.config.ts`.

---

## Code Conventions

### Naming

- Components: PascalCase (`<ProductCard />`, `<BentoGrid />`)
- Files: kebab-case for assets, PascalCase for components
- CSS variables: `--color-*`, `--text-*`, `--font-*`, `--grid-*`
- Variables/functions: camelCase

### CSS Architecture

- All design tokens in `app/globals.css` `:root`
- No hardcoded colors — always reference tokens
- Blueprint grid: `rgba(200, 169, 110, 0.03)` on `--color-ground`
- Dark mode only — no light mode

### Typography

- Three typefaces max: Display (serif), Interface (monospace), Body (sans-serif)
- `font-display: swap` on all custom fonts
- Line height: 1.7 body, 1.05 display

### Motion

- Entry: 400ms, `cubic-bezier(0.22, 1, 0.36, 1)`, stagger 50ms
- Hover: 180ms ease-out (color/opacity/border), 240ms (transforms)
- Respect `prefers-reduced-motion`
- No parallax

---

## Content Principles

- **Tone**: factual, precise, never enthusiastic. Numbers do the work.
- **Forbidden**: innovation, disruption, révolutionnaire, solution, écosystème
- **Prescribed**: moteur, diagnostic, programme, écart, score, module, référentiel, ordonnancement, précision, opérationnel
- **CTAs**: one primary per page. Never "En savoir plus" alone.

---

## Site Structure

See `docs/mentivisOS_website_structure_v2.md` for full page-by-page spec.

Key routes:
- `/[lang]/` — Homepage (10 blocks)
- `/[lang]/demo` — Demo request form
- `/api/demo` — Serverless HubSpot relay

---

## API Security

`/api/demo` is server-only, never exposed to client. Protected by:
1. Rate limiting (5 req/min/IP)
2. CORS (allowed origins only)
3. Honeypot anti-spot field

Env vars: `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_ID`, `ALLOWED_ORIGINS`

---

## Accessibility & Performance

- WCAG AA minimum
- Focus: 2px amber outline, 2px offset
- Target Lighthouse: Performance 90+, Accessibility 98+, Best Practices 100, SEO 95+
- LCP: < 1.8s desktop, < 2.5s mobile
- Zero layout shift

---

## Breakpoints

- Mobile: < 768px
- Tablet: 768px – 1024px
- Desktop: > 1024px

---

## Git

- **User**: stevedelcourt / steven.delcourt@mentivis.com
- **Remote**: origin → github.com/stevedelcourt/mentivis-os
- **Branch**: main
- Push triggers Vercel auto-deploy

## Deployment

### o2switch (Production)

- **Host**: `terre.o2switch.net`
- **User**: `sc4bovu7233`
- **App dir**: `/home/sc4bovu7233/nextapp`
- **Data dir**: `/home/sc4bovu7233/data` (persistent, outside repo)
- **Script**: `./deploy.sh` — SSH + `git reset --hard` + `npm install` + `npx next build --webpack` + Passenger restart
- **Process manager**: Passenger (`touch tmp/restart.txt`)
- **Entry**: `server.js` → `require('./.next/standalone/server.js')`
- **Constraints**: No gcc, old glibc, shared hosting — only pure JS dependencies

See `docs/infrastructure.md` for full deployment reference.

### Vercel (Preview)

- Auto-deploys on push to `main`
- Not used for production (o2switch is primary)
