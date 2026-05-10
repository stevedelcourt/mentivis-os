import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const DB_PATH = path.join(DATA_DIR, "mentivis.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initDatabase(db);
    migrateFromJson(db);
  }
  return db;
}

function initDatabase(db: Database.Database) {
  // Posts
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      date_iso TEXT NOT NULL,
      image_url TEXT,
      image_tag TEXT,
      image_caption TEXT,
      featured INTEGER DEFAULT 0,
      published INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Optional FTS5
  try {
    db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
        title, content, content='posts', content_rowid='id'
      );
    `);
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS posts_fts_insert AFTER INSERT ON posts BEGIN
        INSERT INTO posts_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
      END;
      CREATE TRIGGER IF NOT EXISTS posts_fts_update AFTER UPDATE ON posts BEGIN
        INSERT INTO posts_fts(posts_fts, rowid, title, content) VALUES ('delete', old.id, old.title, old.content);
        INSERT INTO posts_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
      END;
      CREATE TRIGGER IF NOT EXISTS posts_fts_delete AFTER DELETE ON posts BEGIN
        INSERT INTO posts_fts(posts_fts, rowid, title, content) VALUES ('delete', old.id, old.title, old.content);
      END;
    `);
  } catch {
    // FTS5 not available — skip full-text search
  }

  // Users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editorial',
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Submissions
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_type TEXT NOT NULL CHECK(form_type IN ('demo', 'contact')),
      data TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      read INTEGER DEFAULT 0,
      notes TEXT
    );
  `);

  // Pages
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      lang TEXT NOT NULL,
      page TEXT NOT NULL,
      hero_json TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (lang, page)
    );
  `);

  // Pricing
  db.exec(`
    CREATE TABLE IF NOT EXISTS pricing (
      product TEXT PRIMARY KEY,
      plans_json TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // SEO
  db.exec(`
    CREATE TABLE IF NOT EXISTS seo (
      lang TEXT NOT NULL,
      page TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      json_ld TEXT NOT NULL,
      PRIMARY KEY (lang, page)
    );
  `);
}

function migrateFromJson(db: Database.Database) {
  const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
  if (postCount.count > 0) return; // Already migrated

  const files = {
    posts: path.join(DATA_DIR, "posts.json"),
    users: path.join(DATA_DIR, "users.json"),
    submissions: path.join(DATA_DIR, "submissions.json"),
    pages: path.join(DATA_DIR, "pages.json"),
    pricing: path.join(DATA_DIR, "pricing.json"),
    seo: path.join(DATA_DIR, "seo.json"),
  };

  // Migrate posts
  if (fs.existsSync(files.posts)) {
    try {
      const posts = JSON.parse(fs.readFileSync(files.posts, "utf-8")) as any[];
      const insert = db.prepare(`
        INSERT INTO posts (id, slug, title, excerpt, content, category, date, date_iso, image_url, image_tag, image_caption, featured, published, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const p of posts) {
        insert.run(
          p.id, p.slug, p.title, p.excerpt, p.content, p.category, p.date, p.dateISO,
          p.imageUrl || null, p.imageTag || null, p.imageCaption || null,
          p.featured ? 1 : 0, p.published ? 1 : 0, p.createdAt, p.updatedAt
        );
      }
      fs.renameSync(files.posts, files.posts + ".bak");
    } catch {}
  }

  // Migrate users
  if (fs.existsSync(files.users)) {
    try {
      const users = JSON.parse(fs.readFileSync(files.users, "utf-8")) as any[];
      const insert = db.prepare(`
        INSERT INTO users (id, email, name, password_hash, role, active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const u of users) {
        insert.run(u.id, u.email, u.name, u.passwordHash, u.role, u.active ? 1 : 0, u.createdAt);
      }
      fs.renameSync(files.users, files.users + ".bak");
    } catch {}
  }

  // Migrate submissions
  if (fs.existsSync(files.submissions)) {
    try {
      const submissions = JSON.parse(fs.readFileSync(files.submissions, "utf-8")) as any[];
      const insert = db.prepare(`
        INSERT INTO submissions (id, form_type, data, email, created_at, read, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const s of submissions) {
        insert.run(s.id, s.formType, JSON.stringify(s.data), s.email, s.createdAt, s.read ? 1 : 0, s.notes || null);
      }
      fs.renameSync(files.submissions, files.submissions + ".bak");
    } catch {}
  }

  // Migrate pages
  if (fs.existsSync(files.pages)) {
    try {
      const pages = JSON.parse(fs.readFileSync(files.pages, "utf-8")) as any;
      const insert = db.prepare("INSERT INTO pages (lang, page, hero_json) VALUES (?, ?, ?)");
      for (const lang of ["fr", "en"]) {
        if (pages[lang]?.hero) {
          insert.run(lang, "homepage", JSON.stringify(pages[lang].hero));
        }
      }
      fs.renameSync(files.pages, files.pages + ".bak");
    } catch {}
  }

  // Migrate pricing
  if (fs.existsSync(files.pricing)) {
    try {
      const pricing = JSON.parse(fs.readFileSync(files.pricing, "utf-8")) as any;
      const insert = db.prepare("INSERT INTO pricing (product, plans_json) VALUES (?, ?)");
      for (const product of ["learningos", "pipelineos", "api"]) {
        if (pricing[product]) {
          insert.run(product, JSON.stringify(pricing[product]));
        }
      }
      fs.renameSync(files.pricing, files.pricing + ".bak");
    } catch {}
  }

  // Migrate SEO
  if (fs.existsSync(files.seo)) {
    try {
      const seo = JSON.parse(fs.readFileSync(files.seo, "utf-8")) as any;
      const insert = db.prepare("INSERT INTO seo (lang, page, title, description, json_ld) VALUES (?, ?, ?, ?, ?)");
      for (const lang of ["fr", "en"]) {
        if (seo[lang]) {
          for (const page of ["homepage", "tarifs", "blog"]) {
            if (seo[lang][page]) {
              insert.run(lang, page, seo[lang][page].title, seo[lang][page].description, JSON.stringify(seo[lang][page].jsonLd));
            }
          }
        }
      }
      fs.renameSync(files.seo, files.seo + ".bak");
    } catch {}
  }
}
