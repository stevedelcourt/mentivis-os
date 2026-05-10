# CMS Data Layer

Reference for the CMS database schema, API surface, authentication, and caching strategy.

---

## Database Schema

### `posts`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| `slug` | TEXT | UNIQUE NOT NULL | URL-friendly identifier |
| `title` | TEXT | NOT NULL | |
| `excerpt` | TEXT | NOT NULL | Short preview |
| `content` | TEXT | NOT NULL | Full markdown body |
| `category` | TEXT | NOT NULL | e.g. "news", "product" |
| `date` | TEXT | NOT NULL | Display date |
| `date_iso` | TEXT | NOT NULL | ISO 8601 for sorting |
| `image_url` | TEXT | | Optional hero image |
| `image_tag` | TEXT | | Alt text / tag |
| `image_caption` | TEXT | | Optional caption |
| `featured` | INTEGER | DEFAULT 0 | Boolean (0/1) |
| `published` | INTEGER | DEFAULT 0 | Boolean (0/1) |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |

### `posts_fts` (Optional)

- Virtual table using FTS5 extension
- Columns: `title`, `content`
- Content-mapped to `posts` table (rowid = `posts.id`)
- Triggers auto-sync on insert/update/delete
- Falls back to `LIKE` query if FTS5 unavailable

### `users`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| `email` | TEXT | UNIQUE NOT NULL COLLATE NOCASE | Case-insensitive |
| `name` | TEXT | NOT NULL | Display name |
| `password_hash` | TEXT | NOT NULL | bcrypt or legacy SHA-256 |
| `role` | TEXT | NOT NULL DEFAULT 'editorial' | `god` / `editorial` / `tarifs` |
| `active` | INTEGER | DEFAULT 1 | Boolean (0/1) |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |

### `submissions`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| `form_type` | TEXT | NOT NULL CHECK IN ('demo', 'contact') | |
| `data` | TEXT | NOT NULL | JSON string |
| `email` | TEXT | NOT NULL | Submitter email |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |
| `read` | INTEGER | DEFAULT 0 | Boolean (0/1) |
| `notes` | TEXT | | Admin notes |

### `pages`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `lang` | TEXT | NOT NULL | `fr` or `en` |
| `page` | TEXT | NOT NULL | e.g. "homepage" |
| `hero_json` | TEXT | NOT NULL | Serialized hero block |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |
| | | PRIMARY KEY (`lang`, `page`) | |

### `pricing`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `product` | TEXT | PRIMARY KEY | `learningos` / `pipelineos` / `api` |
| `plans_json` | TEXT | NOT NULL | Serialized plan array |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |

### `seo`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `lang` | TEXT | NOT NULL | `fr` or `en` |
| `page` | TEXT | NOT NULL | `homepage` / `tarifs` / `blog` |
| `title` | TEXT | NOT NULL | `<title>` tag |
| `description` | TEXT | NOT NULL | Meta description |
| `json_ld` | TEXT | NOT NULL | Serialized JSON-LD object |
| | | PRIMARY KEY (`lang`, `page`) | |

---

## API Surface

### `lib/cms/db.ts`

All functions are **`async`** — required by sql.js.

#### Posts

```typescript
getAllPosts(): Promise<Post[]>
getPublishedPosts(): Promise<Post[]>
getPostBySlug(slug: string): Promise<Post | undefined>
getPostById(id: number): Promise<Post | undefined>
createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>
updatePost(id: number, updates: Partial<Omit<Post, "id" | "createdAt">>): Promise<Post | null>
deletePost(id: number): Promise<boolean>
searchPosts(query: string): Promise<Post[]>
```

#### Pages (Homepage Hero)

```typescript
getPages(): Promise<PageContent>
savePages(data: PageContent): Promise<void>
```

#### Pricing

```typescript
getPricing(): Promise<PricingContent>
savePricing(data: PricingContent): Promise<void>
```

#### SEO / JSON-LD

```typescript
getSeo(): Promise<SeoContent>
saveSeo(data: SeoContent): Promise<void>
```

#### Form Submissions

```typescript
getAllSubmissions(): Promise<FormSubmission[]>
createSubmission(submission: Omit<FormSubmission, "id" | "createdAt">): Promise<FormSubmission>
updateSubmission(id: number, updates: Partial<FormSubmission>): Promise<FormSubmission | null>
deleteSubmission(id: number): Promise<boolean>
```

### `lib/cms/users.ts`

All functions are **`async`**.

```typescript
getAllUsers(): Promise<User[]>
getUserByEmail(email: string): Promise<User | undefined>
getUserById(id: number): Promise<User | undefined>
createUser(user: Omit<User, "id" | "createdAt">): Promise<User>
updateUser(id: number, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User | null>
deleteUser(id: number): Promise<boolean>

// Utilities
hashPassword(password: string): Promise<string>
verifyPassword(password: string, passwordHash: string): Promise<{ valid: boolean; migratedHash?: string }>
seedDefaultUsers(sharedPassword: string): Promise<void>
```

---

## Authentication

### Token Format

HMAC-signed JWT-like token:
```
<base64url(payload)>.<base64url(signature)>
```

Payload:
```json
{
  "email": "user@mentivis.com",
  "role": "god",
  "exp": 1715376000000
}
```

- **Algorithm:** HMAC-SHA256
- **Secret:** `process.env.CMS_AUTH_SECRET || process.env.INTERNAL_TOKEN`
- **Expiry:** 24 hours from creation
- **Signature encoding:** base64url

### Auth Guards

All guards are **`async`**.

```typescript
// Returns user object or null
getAuthUser(request: Request): Promise<{ email: string; role: UserRole } | null>

// Returns user object or 401 Response
requireAuth(request: Request): Promise<{ email: string; role: UserRole } | Response>

// Returns user object or 401/403 Response
requireRole(request: Request, allowedRoles: UserRole[]): Promise<{ email: string; role: UserRole } | Response>
```

### Role Hierarchy

| Role | Permissions |
|------|------------|
| `god` | Full access (users, settings, all content) |
| `editorial` | Posts, pages, SEO, uploads, submissions |
| `tarifs` | Pricing tables only |

### Email Authorization

Only emails ending with `@mentivis.com` or `@mentivisOS.com` are allowed to log in.

---

## Password Hashing

### Algorithm

- **Primary:** `bcryptjs` with 12 salt rounds
- **Legacy fallback:** SHA-256 (hex digest)

### Migration Flow

1. User submits password
2. If hash starts with `$2` → verify with `bcrypt.compare()`
3. If not → verify with SHA-256
4. If SHA-256 matches:
   - Return `{ valid: true, migratedHash: <new bcrypt hash> }`
   - Caller updates user record with new hash
5. On next login, bcrypt path is used

### Security Note

The `verifyPassword` function is intentionally async because `bcrypt.compare()` is CPU-intensive and should not block the event loop. With sql.js, the entire DB layer is async, so this is naturally compatible.

---

## Cache Strategy

### Posts Cache

```typescript
let postsCache: Post[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds
```

- `getPosts()` checks cache before hitting SQLite
- Any write (`createPost`, `updatePost`, `deletePost`) sets `postsCache = null`
- Other tables (pages, pricing, seo, submissions) are uncached — they are small and SQLite is fast enough

### Rationale

- Blog post listings are the most frequently accessed CMS data
- 5s TTL balances freshness vs. performance
- Static pages (homepage, tarifs) read SEO data at build time, not request time

---

## Search Implementation

### Primary: FTS5 (if available)

```sql
SELECT posts.* FROM posts
JOIN posts_fts ON posts.id = posts_fts.rowid
WHERE posts_fts MATCH ?
ORDER BY rank
```

### Fallback: LIKE

```sql
SELECT * FROM posts
WHERE title LIKE ? OR content LIKE ?
ORDER BY date_iso DESC
```

### FTS5 Triggers

Auto-maintained via triggers on `posts`:
- `posts_fts_insert` — inserts new row into FTS index
- `posts_fts_update` — deletes old row, inserts new row
- `posts_fts_delete` — deletes row from FTS index

If FTS5 is unavailable (older SQLite builds), table creation fails silently and `searchPosts()` falls back to `LIKE`.

---

## Migration Logic

### One-Time JSON → SQLite

Location: `lib/cms/sqlite.ts` → `migrateFromJson()`

**Flow:**
1. `initDatabase()` creates all tables
2. `migrateFromJson()` checks if `posts` table already has rows
3. If empty, reads `posts.json`, `users.json`, `submissions.json`, `pages.json`, `pricing.json`, `seo.json`
4. Inserts data into respective SQLite tables
5. Renames each JSON file to `*.bak`

**Idempotency:**
- Safe to re-run — exits immediately if `posts` has data
- If migration is interrupted, manual cleanup of partial data + `*.bak` files may be needed

---

## Data Types

### `Post`

```typescript
interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  dateISO: string;
  imageUrl?: string;
  imageTag?: string;
  imageCaption?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### `User`

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  role: "god" | "editorial" | "tarifs";
  active: boolean;
  createdAt: string;
}
```

### `FormSubmission`

```typescript
interface FormSubmission {
  id: number;
  formType: "demo" | "contact";
  data: Record<string, any>;
  email: string;
  createdAt: string;
  read: boolean;
  notes?: string;
}
```

### `PageContent`

```typescript
interface PageContent {
  fr: { hero: HeroBlock };
  en: { hero: HeroBlock };
}

interface HeroBlock {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
  proof: string;
}
```

### `PricingContent`

```typescript
interface PricingContent {
  learningos: Plan[];
  pipelineos: Plan[];
  api: Plan[];
}

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  originalPrice: number | null;
  setupFee: number | null;
  cta: string;
  ctaLink: string;
  gradient: string;
  previousPlan: string | null;
  features: string[];
  creditLimit: string;
  popular: boolean;
}
```

### `SeoContent`

```typescript
interface SeoContent {
  fr: { homepage: SeoPageData; tarifs: SeoPageData; blog: SeoPageData };
  en: { homepage: SeoPageData; tarifs: SeoPageData; blog: SeoPageData };
}

interface SeoPageData {
  title: string;
  description: string;
  jsonLd: Record<string, any>;
}
```
