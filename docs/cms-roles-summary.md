# CMS Roles & Settings — Implementation Summary

## Overview
User roles, permissions, and a settings page have been added to the MentivisOS CMS. Navigation tabs have been fixed on all CMS sub-pages.

---

## Roles

| Role | Write Access | Read Access |
|------|-------------|-------------|
| **god** | Everything + user management | Everything |
| **editorial** | Articles only | Everything (plain text preview) |
| **tarifs** | Pricing only | Everything (plain text preview) |

---

## New Files

| File | Purpose |
|------|---------|
| `lib/cms/users.ts` | User CRUD, password hashing (SHA-256), auto-seed default god user |
| `lib/cms/types.ts` | Added `UserRole` (`god` / `editorial` / `tarifs`) and `User` interface |
| `app/api/cms/users/route.ts` | List / create users (god only) |
| `app/api/cms/users/[id]/route.ts` | Update / delete user (god only) |
| `app/[lang]/content-management/settings/page.tsx` | User invite & management UI |

---

## Modified Files

| File | Change |
|------|--------|
| `lib/cms/auth.ts` | Role-aware tokens (`email` + `role` in payload), `requireRole()` |
| `app/api/cms/auth/login/route.ts` | Per-user password auth with fallback to shared password |
| `app/api/cms/posts/route.ts` | Write: god + editorial |
| `app/api/cms/posts/[id]/route.ts` | Write: god + editorial |
| `app/api/cms/pages/route.ts` | Write: god only |
| `app/api/cms/pricing/route.ts` | Write: god + tarifs |
| `app/api/cms/seo/route.ts` | Write: god only |
| `app/api/cms/submissions/[id]/route.ts` | Write: god only |
| `app/api/cms/upload/route.ts` | Write: god + editorial |
| `app/[lang]/content-management/page.tsx` | Role badge, conditional edit buttons, Settings tab |
| `app/[lang]/content-management/edit/[id]/page.tsx` | Role guard, redirect non-editorial |
| `app/[lang]/content-management/pages/page.tsx` | Full rewrite: nav tabs, read-only preview for non-god |
| `app/[lang]/content-management/tarifs/page.tsx` | Full rewrite: nav tabs, read-only preview for non-tarifs |
| `app/[lang]/content-management/seo/page.tsx` | Full rewrite: nav tabs, read-only preview for non-god |
| `app/[lang]/content-management/soumissions/page.tsx` | Nav tabs, conditional manage buttons, Settings tab |
| `components/demo-client.tsx` | Hidden `formType=demo` field |
| `components/contact-client.tsx` | Hidden `formType=contact` field |
| `app/api/demo/route.ts` | Persist submissions to `submissions.json` before HubSpot |

---

## Navigation Tabs Fixed

All CMS pages now display the shared tab bar:

- **Articles** — article list
- **Pages (HP)** — homepage hero editor
- **Tarifs** — pricing editor
- **SEO / JSON-LD** — structured data editor
- **Soumissions** — form submissions viewer
- **Parametres** — user management (god only)

Previously, Pages, Tarifs, and SEO had no tabs — only a back link.

---

## Auto-Seed on First Login

When the first login occurs after deploy:

1. If `users.json` does not exist, it is auto-created with:
   - Email: `steven.delcourt@mentivis.com`
   - Role: `god`
   - Password: the existing shared password (`CMS_AUTH_SECRET` / `INTERNAL_TOKEN`)
2. All subsequent logins verify against `users.json` per-user passwords.
3. Fallback: if an email is not yet in `users.json` but the password matches the shared password, a `god` token is issued (backward compatibility).

---

## Read-Only Behavior

For users without write access to a section:

- An orange banner appears: "Lecture seule — Vous n'avez pas les droits de modification sur cette section."
- Form inputs are replaced with plain text previews (no inputs, no save buttons).
- The page is still navigable via the tab bar.

---

## Data Persistence

- `users.json` → `/home/sc4bovu7233/data/` (outside git repo, survives deploys)
- `submissions.json` → same directory
- All other CMS data files unchanged (`posts.json`, `pages.json`, `pricing.json`, `seo.json`)

---

## Server-Side Enforcement

Every write API route uses `requireRole()` and returns:

- `401 Unauthorized` — no valid token
- `403 Forbidden` — valid token but wrong role

This is enforced server-side; UI hiding is a convenience, not the security boundary.
