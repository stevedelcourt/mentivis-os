# MentivisOS — Project Brief for AI Context

## 1. What Is MentivisOS?

**MentivisOS** is an AI-native pedagogical engine — not an LMS, not a catalog.

It produces three things no LMS produces:
1. A **quantified diagnostic** of the gap between a profile and an objective
2. An **exact program** calibrated to that gap
3. **Embedded coaching** that never deviates from the subject

**Positioning:** radical, factual, anti-marketing. Built by practitioners, not consultants.

**Live site:** https://sc4bovu7233.universe.wf
**Repository:** https://github.com/stevedelcourt/mentivis-os

---

## 2. What the Website Does

This is a **marketing website** (not the SaaS application). It serves three purposes:

| Purpose | Description |
|---------|-------------|
| **Conversion** | Demo requests, contact forms, pricing exploration |
| **Content** | Blog/news articles for SEO and thought leadership |
| **CMS** | Content management system for editors to update copy, SEO, pricing, pages |

The actual SaaS application runs separately at `https://app.mentivisOS.com`.

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 + TypeScript + App Router |
| Build | Webpack ONLY (`--webpack` flag). Never Turbopack — causes chunk errors. |
| Styling | CSS custom properties only. No utility framework (Tailwind, etc.) banned. |
| Fonts | Inter (body/sans), DM Mono (interface), Playfair Display (display) |
| Language | Bilingual FR/EN, default FR. Locale routing via `proxy.ts`. |
| Database | SQLite via `sql.js` (pure JS/WASM) — no native dependencies |
| Auth | HMAC-signed tokens, role-based (`god` / `editorial` / `tarifs`) |
| Hosting | o2switch shared hosting (Node v20, Passenger, no gcc/Docker) |

**Critical constraint:** Shared hosting with old glibc. Native modules (like `better-sqlite3`) fail. Only pure JS dependencies work.

---

## 4. Site Structure

### Public Marketing Pages

```
/[lang]/              — Homepage (hero, modules, features, CTA)
/[lang]/modules/adaptive   — Adaptive learning module detail
/[lang]/modules/visual     — Visual module detail
/[lang]/tarifs/       — Pricing page (3 products × 3 plans)
/[lang]/blog/         — Blog index (posts listing)
/[lang]/blog/[slug]   — Individual blog post
/[lang]/demo/         — Demo request form
/[lang]/contact/      — Contact form
/[lang]/legal/        — Legal mentions
/[lang]/cgv/          — Terms of service
/[lang]/privacy/      — Privacy policy
/[lang]/terms/        — Terms and conditions
```

### CMS (Authenticated)

```
/[lang]/content-management/           — Articles dashboard
/[lang]/content-management/edit/[id]  — Post editor
/[lang]/content-management/pages/     — Homepage hero editor
/[lang]/content-management/tarifs/    — Pricing plans editor
/[lang]/content-management/seo/       — SEO / JSON-LD editor
/[lang]/content-management/soumissions/ — Form submissions inbox
/[lang]/content-management/settings/  — User management (god only)
```

### API Routes

```
/api/health                  — Health check
/api/blog/posts              — Public posts (filtered by category)
/api/blog/posts/[slug]       — Single post
/api/pages                   — Homepage hero content
/api/pricing                 — Pricing data
/api/demo                    — Form submission + HubSpot relay
/api/cms/*                   — All CMS CRUD operations
/api/uploads/[filename]      — Image file serving
```

---

## 5. Design System

### Tone & Voice

- **Factual, precise, never enthusiastic.** Numbers do the work.
- **Forbidden words:** innovation, disruption, révolutionnaire, solution, écosystème
- **Prescribed words:** moteur, diagnostic, programme, écart, score, module, référentiel, ordonnancement, précision, opérationnel
- **CTAs:** one primary per page. Never "En savoir plus" alone.

### Visual Style

- Dark mode only. No light mode.
- CSS custom properties in `app/globals.css`
- Blueprint grid: `rgba(200, 169, 110, 0.03)` on `--color-ground`
- Three typefaces max: Display (serif), Interface (mono), Body (sans)
- **Serif fonts banned everywhere** except display headings — `var(--font-sans)` (Inter) is the default

### Motion

- Entry: 400ms, `cubic-bezier(0.22, 1, 0.36, 1)`, stagger 50ms
- Hover: 180ms ease-out (color/opacity/border), 240ms (transforms)
- Respect `prefers-reduced-motion`
- No parallax

---

## 6. CMS Architecture

### Data Layer

- **SQLite database:** `/data/mentivis.db` (persistent, outside repo)
- **Tables:** posts, users, submissions, pages, pricing, seo, posts_fts (optional full-text search)
- **Auto-backup:** `deploy.sh` creates timestamped `.backup.YYYYMMDD_HHMMSS` before each deploy (last 10 retained)
- **One-time migration:** JSON files → SQLite on first DB access, then renamed to `.bak`

### Auth & Roles

| Role | Permissions |
|------|------------|
| `god` | Full access: users, settings, all content |
| `editorial` | Posts, pages, SEO, uploads, submissions |
| `tarifs` | Pricing tables only |

- Tokens: HMAC-SHA256 signed, 24h expiry
- Email domain restriction: `@mentivis.com` or `@mentivisOS.com`
- Passwords: bcrypt primary, SHA-256 legacy fallback with auto-migration

### Key CMS Features

- **Posts:** Full markdown editor, image upload, featured flag, publish/draft toggle
- **SEO:** Per-page per-language title, description, JSON-LD
- **Pricing:** 3 products (MentivisOS Pro, TalentOS, MentivisAPI) × 3 tiers each
- **Submissions:** Demo/contact form inbox with read/unread tracking and notes
- **Users:** God-only user creation with role assignment

---

## 7. Deployment Pipeline

### o2switch Production

- **Script:** `./deploy.sh` (SSH + git + npm + build + Passenger restart)
- **Zero-downtime:** Atomic swap of `.next/standalone` builds
- **Health check:** Auto-rollback if `/api/health/` fails after restart
- **Process manager:** Passenger (CloudLinux)
- **Entry:** `server.js` → `.next/standalone/server.js`

### Environment Variables

```
INTERNAL_TOKEN       — API route protection
CMS_AUTH_SECRET      — CMS auth token signing
HUBSPOT_PORTAL_ID    — HubSpot form relay
HUBSPOT_FORM_ID      — HubSpot form relay
ALLOWED_ORIGINS      — CORS whitelist
DATA_DIR             — Defaults to /home/sc4bovu7233/data
```

---

## 8. Recent Changes (Context for AI)

| Commit | Change |
|--------|--------|
| `978742c` | CMS auth: decode role from token fallback |
| `85c0adf` | CMS fully responsive on mobile |
| `c5b11bb` | Viewport meta tag for mobile rendering |
| `0ee73d1` | Zero-downtime deploy with atomic swap + DB backup |
| `75891bf` | Infrastructure + CMS data layer documentation |
| `36c818a` | Migrated DB from `better-sqlite3` to `sql.js` |

---

## 9. What NOT to Do

- ❌ Never use Turbopack — always `--webpack`
- ❌ Never use `better-sqlite3` on o2switch — use `sql.js`
- ❌ Never add serif fonts as default — `var(--font-sans)` only
- ❌ Never put data files inside the repo — use `/data/` outside
- ❌ Never commit `.env*` files — managed via deploy script
- ❌ Never use `onMouseEnter`/`onMouseLeave` in server components
- ❌ Never write utility-framework CSS (Tailwind, etc.)
