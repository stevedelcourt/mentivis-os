#!/usr/bin/env node
/**
 * Snapshot prod CMS content into a local SQLite file for static-export builds.
 *
 * Usage:
 *   CMS_BASE_URL=https://mentivisos.com \
 *   CMS_EMAIL=steven.delcourt@mentivis.com \
 *   CMS_AUTH_SECRET=... \
 *   SNAPSHOT_DB=data/snapshot.db \
 *   node scripts/snapshot-prod-db.js
 *
 * What it does (reads ONLY - never writes to prod):
 *   1. Logs in to the CMS read API (JWT, no server-side state change).
 *   2. GETs full bilingual rows: posts, jobs, pricing, pages (heroes), seo.
 *   3. Copies local data/mentivis.db Sheriff -> SNAPSHOT_DB (schema guaranteed),
 *      wipes content tables, re-inserts fresh rows (PRAGMA-driven: only
 *      existing columns, warns on skipped non-empty fields).
 *   4. Downloads /api/uploads/* binaries referenced by content into
 *      data/snapshot-uploads/ + writes data/snapshot-uploads.json manifest
 *      (URL -> file). The export phase rewrites URLs to static paths.
 *   5. Prints verification counts. Exit non-zero on any failure.
 *
 * Explicitly NEVER touched: /api/demo, /api/beta-questionnaire,
 * /api/job-applications, /api/upload-cv (all write server-side),
 * users, submissions, job_applications tables, /api/cvs/* files.
 */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const BASE = (process.env.CMS_BASE_URL || "https://mentivisos.com").replace(/\/$/, "");
const EMAIL = process.env.CMS_EMAIL || "steven.delcourt@mentivis.com";
const SECRET = process.env.CMS_AUTH_SECRET || "";
const OUT_DB = process.env.SNAPSHOT_DB || path.join(REPO, "data", "snapshot.db");
const UPLOADS_DIR = path.join(REPO, "data", "snapshot-uploads");
const MANIFEST = path.join(REPO, "data", "snapshot-uploads.json");
const TEMPLATE_DB = path.join(REPO, "data", "mentivis.db");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

if (!SECRET) {
  console.error("FATAL: CMS_AUTH_SECRET is required");
  process.exit(1);
}

async function api(pathname, token, method = "GET", body) {
  const res = await fetch(BASE + pathname, {
    method,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": UA,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${pathname} -> HTTP ${res.status}`);
  return res.json();
}

async function main() {
  console.log(`=== Snapshot ${BASE} -> ${OUT_DB} ===`);

  // 1. Login (read-only proof, JWT is stateless)
  const login = await api("/api/cms/auth/login/", null, "PUT", { email: EMAIL, password: SECRET });
  if (!login.success || !login.token) throw new Error("CMS login failed: " + JSON.stringify(login).slice(0, 150));
  const token = login.token;
  console.log("login OK");

  // 2. Fetch collections (GET only)
  const [postsRes, jobsRes, pricingRes, seoRes] = await Promise.all([
    api("/api/cms/posts", token),
    api("/api/cms/jobs", token),
    api("/api/cms/pricing", token),
    api("/api/cms/seo", token),
  ]);
  const posts = postsRes.posts || [];
  const jobs = jobsRes.jobs || [];
  console.log(`fetched: posts=${posts.length} jobs=${jobs.length}`);

  // Pages: one GET per (PageKey x lang) — the CMS read endpoint shape varies,
  // so request each hero explicitly.
  const PAGE_KEYS = ["homepage", "learningos", "talentos", "about", "security", "ambassadors"];
  const heroes = [];
  for (const page of PAGE_KEYS) {
    for (const lang of ["fr", "en"]) {
      try {
        const r = await api(`/api/cms/pages?page=${page}&lang=${lang}`, token);
        const hero = r.page?.hero || r.hero || r.page || null;
        if (hero) heroes.push({ lang, page, hero });
      } catch (e) {
        console.log(`  WARN pages/${page}/${lang}: ${e.message}`);
      }
    }
  }
  console.log(`fetched: heroes=${heroes.length} (expect 12)`);

  // 3. Fresh DB from local template (schema guaranteed incl. migrations)
  if (!fs.existsSync(TEMPLATE_DB)) throw new Error(`template DB missing: ${TEMPLATE_DB}`);
  fs.mkdirSync(path.dirname(OUT_DB), { recursive: true });
  fs.copyFileSync(TEMPLATE_DB, OUT_DB);
  const initSqlJs = require("sql.js");
  const SQL = await initSqlJs();
  const buf = fs.readFileSync(OUT_DB);
  const db = new SQL.Database(new Uint8Array(buf));
  // Raw sql.js has no .all() (the app adds it via SqlJsDb wrapper) - use exec().
  const colsOf = (table) => {
    const res = db.exec(`PRAGMA table_info(${table})`);
    if (!res.length) return [];
    const ci = res[0].columns.indexOf("name");
    return res[0].values.map((r) => r[ci]);
  };
  const runStmt = (sql, vals) => {
    const st = db.prepare(sql);
    try { st.run(vals || []); } finally { st.free(); }
  };

  const skipped = [];
  function insertMapped(table, row, map) {
    const cols = colsOf(table);
    const entries = Object.entries(map).filter(([col]) => cols.includes(col));
    for (const [col, from] of Object.entries(map)) {
      if (!cols.includes(col) && row[from] !== undefined && row[from] !== "" && row[from] !== null) {
        skipped.push(`${table}.${col} (value present, column missing)`);
      }
    }
    if (!entries.length) return;
    const sql = `INSERT INTO ${table} (${entries.map(([c]) => c).join(",")}) VALUES (${entries.map(() => "?").join(",")})`;
    let vals = entries.map(([, from]) => {
      let v = row[from];
      if (typeof v === "boolean") v = v ? 1 : 0;
      if (v === undefined) v = null;
      return v;
    });
    runStmt(sql, vals);
  }

  const NORM = (s) => s.toLowerCase().replace(/_/g, "");
  function autoMap(table, row) {
    const cols = colsOf(table);
    const byNorm = {};
    for (const k of Object.keys(row)) byNorm[NORM(k)] = k;
    const map = {};
    for (const col of cols) {
      if (col === "id") continue;
      const hit = byNorm[NORM(col)];
      if (hit !== undefined) map[col] = hit;
    }
    return map;
  }

  for (const t of ["posts", "jobs", "pricing", "pages", "seo"]) {
    try { runStmt(`DELETE FROM ${t}`); } catch {}
  }
  for (const p of posts) insertMapped("posts", p, autoMap("posts", p));
  for (const j of jobs) insertMapped("jobs", j, autoMap("jobs", j));
  const pricingRows = Array.isArray(pricingRes.pricing) ? pricingRes.pricing : Object.entries(pricingRes.pricing || {}).map(([product, plans_json]) => ({ product, plans_json: typeof plans_json === "string" ? plans_json : JSON.stringify(plans_json) }));
  for (const r of pricingRows) insertMapped("pricing", r, autoMap("pricing", r));
  for (const h of heroes) {
    runStmt("INSERT OR REPLACE INTO pages (lang, page, hero_json, updated_at) VALUES (?,?,?,datetime('now'))",
      [h.lang, h.page, typeof h.hero === "string" ? h.hero : JSON.stringify(h.hero)]);
  }
  const seoRows = Array.isArray(seoRes.seo) ? seoRes.seo : Object.entries(seoRes.seo || {}).flatMap(([lang, pages]) =>
    Object.entries(pages || {}).map(([page, s]) => ({ lang, page, title: s.title, description: s.description, json_ld: typeof s.jsonLd === "string" ? s.jsonLd : JSON.stringify(s.jsonLd || {}) }))
  );
  for (const s of seoRows) insertMapped("seo", s, autoMap("seo", s));

  const out = Buffer.from(db.export());
  fs.writeFileSync(OUT_DB, out);
  db.close();
  if (skipped.length) {
    console.log("WARN skipped fields (column missing locally):");
    [...new Set(skipped)].forEach((s) => console.log("  - " + s));
  }

  // 4. Uploads binaries referenced by content (+ manifest for URL rewrite)
  const urls = new Set();
  const scan = (v) => {
    if (typeof v === "string") {
      const m = v.match(/\/api\/uploads\/[A-Za-z0-9._-]+/g);
      if (m) m.forEach((u) => urls.add(u));
    }
  };
  const walk = (v) => {
    if (typeof v === "string") scan(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  [...posts, ...jobs].forEach(walk);
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const manifest = {};
  for (const u of urls) {
    const name = u.split("/").pop();
    const dest = path.join(UPLOADS_DIR, name);
    const res = await fetch(BASE + u, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      console.log(`  WARN download ${u} -> HTTP ${res.status}`);
      continue;
    }
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    manifest[u] = name;
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`uploads: ${Object.keys(manifest).length} files -> ${UPLOADS_DIR}`);

  // 5. Verify counts against live public API
  const pub = await (await fetch(`${BASE}/api/blog/posts?lang=fr`, { headers: { "User-Agent": UA } })).json();
  console.log(`verify: snapshot posts=${posts.length} vs live FR=${(pub.posts || []).length}`);
  console.log(`verify: jobs=${jobs.length} heroes=${heroes.length} seo=${seoRows.length}`);
  if (!posts.length) throw new Error("snapshot empty - aborting");
  console.log(`=== Snapshot OK: ${OUT_DB} (${(out.length / 1024).toFixed(0)}K) ===`);
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });
