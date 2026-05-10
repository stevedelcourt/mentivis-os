# MentivisOS Content Management — Roadmap

## Overview

A self-hosted content management system built into the MentivisOS Next.js application, running on o2switch shared hosting with SQLite. Enables real-time content editing without rebuilds, deployments, or external dependencies.

---

## Architecture

```
/home/sc4bovu7233/
├── nextapp/                    ← Git repo (deployed, wiped on reset)
│   ├── app/
│   │   ├── [lang]/content-management/   ← Admin UI
│   │   ├── [lang]/blog/                 ← Public blog (fetches from DB)
│   │   └── api/cms/                     ← All CMS API routes
│   └── lib/db.ts                        ← SQLite client
└── data/                       ← PERSISTENT (outside git)
    ├── mentivis.db             ← SQLite database
    └── uploads/                ← Uploaded images
```

**Key constraint on o2switch:** `git reset --hard` on every deploy wipes files inside the repo. All user data lives in `/home/sc4bovu7233/data/` (outside the repo) to survive deploys.

---

## Phase 1: News (Current)

**Goal:** Replace hardcoded blog posts with a real CMS.

### Database Schema (SQLite)

```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  date_iso TEXT NOT NULL,
  image_url TEXT,
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/cms/auth/login` | POST | No | Validate email domain + password, return token |
| `/api/cms/auth/logout` | POST | Yes | Clear session |
| `/api/cms/posts` | GET | Yes | List all posts |
| `/api/cms/posts` | POST | Yes | Create new post |
| `/api/cms/posts/[id]` | GET | Yes | Get single post |
| `/api/cms/posts/[id]` | PUT | Yes | Update post |
| `/api/cms/posts/[id]` | DELETE | Yes | Delete post |
| `/api/cms/upload` | POST | Yes | Upload image → `/data/uploads/` |
| `/api/uploads/[filename]` | GET | No | Serve uploaded image |

### Admin UI (`/content-management`)

**Login page:**
- Email field (validated: `@mentivis.com` or `@mentivisOS.com`)
- Password field (matches `INTERNAL_TOKEN`)
- Simple token-based auth (stored in `localStorage`)

**Dashboard:**
- Table of all posts (title, category, date, status)
- Filters: All / Published / Drafts
- Actions: New, Edit, Delete, Preview
- Search by title

**Editor:**
- Title, slug (auto-generated from title)
- Excerpt
- Category dropdown (stratégie, IA, ingénierie, institutions, entreprises, international, cas)
- Date picker
- Content textarea (`##` headings, `•` lists — same syntax as current blog)
- Featured image: upload file OR paste external URL
- Published / Draft toggle
- Save button

### Public Blog Updates

- `/blog` — fetch posts from SQLite instead of hardcoded `POSTS` array
- `/blog/[slug]` — fetch single post content from SQLite
- Categories and filtering remain the same

---

## Phase 2: Static Pages (Quick Win)

**Goal:** Edit homepage sections, about text, footer without code changes.

### New Table

```sql
CREATE TABLE pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,   -- e.g. "hero", "about", "footer"
  title TEXT,
  content TEXT NOT NULL,       -- JSON or markdown
  lang TEXT DEFAULT 'fr',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### New API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/cms/pages` | GET/POST | List / create pages |
| `/api/cms/pages/[slug]` | GET/PUT/DELETE | Manage single page |

### Admin UI Addition

- New "Pages" tab in admin
- Editor for each page section
- Preview before publishing

---

## Phase 3: Form Submissions

**Goal:** View all demo requests and contact forms in one place (backup to HubSpot).

### New Table

```sql
CREATE TABLE form_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_type TEXT NOT NULL,     -- "demo", "contact"
  data TEXT NOT NULL,          -- JSON string
  email TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  read INTEGER DEFAULT 0,
  notes TEXT
);
```

### Changes

- `/api/demo` — also write to SQLite (in addition to HubSpot)
- Admin UI — "Submissions" tab with table view
- Export to CSV

---

## Phase 4: Media Library

**Goal:** Centralized image manager.

### Features

- Upload images once, use anywhere
- Browse all uploaded images
- Delete unused images
- Image optimization (resize on upload)

### New API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/cms/media` | GET | List all uploaded images |
| `/api/cms/media` | POST | Upload new image |
| `/api/cms/media/[filename]` | DELETE | Delete image |

---

## Phase 5: Multi-User & Roles

**Goal:** Team accounts with different permissions.

### New Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'editor',  -- "admin", "editor", "viewer"
  name TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: users, posts, pages, settings |
| **Editor** | Create/edit posts and pages, cannot delete or manage users |
| **Viewer** | Read-only: view posts, submissions, analytics |

### Features

- User management page (admin only)
- Activity log: who edited what, when
- Draft review workflow: editor writes → admin approves → published

---

## Phase 6: Advanced Features

### Newsletter

- Manage subscribers (`subscribers` table)
- Draft emails in admin
- Send via API (Brevo, Mailgun, or SMTP)

### Analytics Dashboard

- Page views (simple counter in DB)
- Popular posts
- Traffic sources (basic referrer tracking)
- Form conversion rates

### SEO Management

- Edit meta titles/descriptions per page
- Manage URL redirects (`redirects` table)
- Sitemap generation

### Pricing Editor

- Edit plan names, descriptions, prices
- Toggle features per plan
- Update without code changes

---

## Technical Decisions

### Why SQLite?

- **No setup:** File-based, no server process needed
- **Portable:** Single `.db` file, easy to backup/restore
- **Sufficient:** For a content site with < 10k posts, SQLite is more than enough
- **Shared hosting friendly:** No extra services to configure on o2switch

### Why Token-Based Auth?

- **Stateless:** No session store needed (critical on shared hosting)
- **Simple:** Token stored in `localStorage`, sent as `Authorization` header
- **Secure:** Token is a hash of `INTERNAL_TOKEN`, short expiry (24h)

### Why `/content-management` URL?

- Less obvious than `/admin` (slightly harder for bots to find)
- Descriptive of what it does
- Still easy to remember

---

## Deployment Notes

### Persistent Data

The `deploy.sh` script must ensure `/home/sc4bovu7233/data/` exists before the app starts:

```bash
# In deploy.sh
mkdir -p /home/sc4bovu7233/data/uploads
```

### Database Initialization

The app auto-creates tables on first run if `mentivis.db` doesn't exist.

### Backups

- SQLite file can be downloaded via SFTP
- Future: automated daily backups to S3 or email

---

## Security Checklist

- [x] Email domain validation (`@mentivis.com` or `@mentivisOS.com`)
- [x] Password protected (token-based)
- [x] API routes require auth header
- [x] File upload: validate type (jpg, png, webp), size limit (5MB), sanitize filename
- [x] SQL injection prevention (parameterized queries only)
- [x] XSS prevention (sanitize all user input before rendering)
- [ ] Rate limiting on login (5 attempts / 15 min)
- [ ] HTTPS only (already enforced by o2switch)
- [ ] Future: 2FA for admin accounts

---

## Files Created / Modified

### New Files

```
lib/db.ts
app/api/cms/auth/login/route.ts
app/api/cms/posts/route.ts
app/api/cms/posts/[id]/route.ts
app/api/cms/upload/route.ts
app/api/uploads/[filename]/route.ts
app/[lang]/content-management/page.tsx
app/[lang]/content-management/layout.tsx
app/[lang]/content-management/edit/[id]/page.tsx
```

### Modified Files

```
app/[lang]/blog/BlogIndex.tsx       ← fetch from DB
app/[lang]/blog/[slug]/page.tsx     ← fetch from DB
app/[lang]/blog/page.tsx            ← metadata from DB
deploy.sh                            ← create /data/ directory
.env.local                           ← add CMS_AUTH_SECRET
```

---

## Milestones

| Phase | Feature | Est. Effort | Status |
|-------|---------|-------------|--------|
| 1 | News (posts CRUD + blog integration) | 1 day | **In Progress** |
| 2 | Static Pages | 4 hours | Planned |
| 3 | Form Submissions | 3 hours | Planned |
| 4 | Media Library | 4 hours | Planned |
| 5 | Multi-User & Roles | 1 day | Planned |
| 6 | Newsletter + Analytics | 2 days | Planned |

---

*Last updated: 2026-05-10*
