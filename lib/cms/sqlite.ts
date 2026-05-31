import fs from "fs";
import path from "path";
import type { Database } from "sql.js";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const DB_PATH = path.join(DATA_DIR, "mentivis.db");

let dbPromise: Promise<SqlJsDb> | null = null;

async function initSqlJsWithWasm() {
  const { default: initSqlJs } = await import("sql.js");

  const possiblePaths = [
    path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    path.join(process.cwd(), "..", "..", "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    path.join(process.cwd(), "..", "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    path.join(__dirname, "..", "..", "..", "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    path.join(__dirname, "..", "..", "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    path.join(__dirname, "..", "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    path.join(__dirname, "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
  ];

  for (const wasmPath of possiblePaths) {
    if (fs.existsSync(wasmPath)) {
      const wasmBinary = fs.readFileSync(wasmPath);
      return initSqlJs({ wasmBinary });
    }
  }

  return initSqlJs();
}

export async function getDb(): Promise<SqlJsDb> {
  if (!dbPromise) {
    dbPromise = createDb();
  }
  return dbPromise;
}

async function createDb(): Promise<SqlJsDb> {
  const SQL = await initSqlJsWithWasm();

  let dbBuffer: Buffer | null = null;
  if (fs.existsSync(DB_PATH)) {
    dbBuffer = fs.readFileSync(DB_PATH);
  }

  const db = new SQL.Database(dbBuffer ? new Uint8Array(dbBuffer) : null);

  const wrapper = new SqlJsDb(db, DB_PATH);

  try {
    wrapper.exec("PRAGMA journal_mode = WAL;");
  } catch {
    // WAL mode is best-effort in sql.js
  }

  wrapper.autoSave = false;
  initDatabase(wrapper);
  runMigrations(wrapper);
  migrateFromJson(wrapper);
  wrapper.autoSave = true;
  wrapper.save();

  return wrapper;
}

export class SqlJsDb {
  autoSave = true;

  constructor(private db: Database, private dbPath: string) {}

  exec(sql: string) {
    this.db.exec(sql);
    if (this.autoSave) {
      this.save();
    }
  }

  prepare(sql: string) {
    const db = this.db;
    const self = this;

    return {
      get: (...params: any[]) => {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        let result: any = undefined;
        if (stmt.step()) {
          result = stmt.getAsObject();
        }
        stmt.free();
        return result;
      },
      all: (...params: any[]) => {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const results: any[] = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },
      run: (...params: any[]) => {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        stmt.step();
        stmt.free();

        const rowidStmt = db.prepare("SELECT last_insert_rowid() as lastInsertRowid");
        rowidStmt.step();
        const rowidResult = rowidStmt.getAsObject();
        rowidStmt.free();

        const changesStmt = db.prepare("SELECT changes() as changes");
        changesStmt.step();
        const changesResult = changesStmt.getAsObject();
        changesStmt.free();

        if (self.autoSave) {
          self.save();
        }

        return {
          lastInsertRowid: Number(rowidResult.lastInsertRowid),
          changes: Number(changesResult.changes),
        };
      },
    };
  }

  save() {
    try {
      const data = this.db.export();
      fs.writeFileSync(this.dbPath, Buffer.from(data));
    } catch {
      // No-op on read-only filesystems (Vercel)
    }
  }
}

function initDatabase(db: SqlJsDb) {
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

  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      lang TEXT NOT NULL,
      page TEXT NOT NULL,
      hero_json TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (lang, page)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS pricing (
      product TEXT PRIMARY KEY,
      plans_json TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

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

  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      reference TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      remote INTEGER DEFAULT 0,
      type TEXT NOT NULL CHECK(type IN ('cdi', 'cdd', 'freelance', 'stage', 'alternance')),
      department TEXT NOT NULL,
      description TEXT NOT NULL,
      why_join TEXT NOT NULL,
      published INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_reference TEXT NOT NULL,
      job_title TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      linkedin TEXT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      read INTEGER DEFAULT 0,
      notes TEXT
    );
  `);
}

function runMigrations(db: SqlJsDb) {
  try {
    db.exec("ALTER TABLE posts ADD COLUMN gradient_id INTEGER");
  } catch {
    // Column already exists
  }

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        reference TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('cdi', 'cdd', 'freelance', 'stage', 'alternance')),
        department TEXT NOT NULL,
        description TEXT NOT NULL,
        why_join TEXT NOT NULL,
        published INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch {
    // Table already exists
  }

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_reference TEXT NOT NULL,
        job_title TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        linkedin TEXT,
        message TEXT NOT NULL,
        cv_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        read INTEGER DEFAULT 0,
        notes TEXT
      );
    `);
  } catch {
    // Table already exists
  }

  try {
    db.exec("ALTER TABLE job_applications ADD COLUMN cv_url TEXT");
  } catch {
    // Column already exists
  }

  try {
    db.exec("ALTER TABLE jobs ADD COLUMN remote INTEGER DEFAULT 0");
  } catch {
    // Column already exists
  }

  try {
    const columns = db.prepare("PRAGMA table_info(jobs)").all() as { name: string }[];
    if (columns.some((c) => c.name === "salary")) {
      db.exec(`
        CREATE TABLE jobs_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT UNIQUE NOT NULL,
          reference TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          location TEXT NOT NULL,
          remote INTEGER DEFAULT 0,
          type TEXT NOT NULL CHECK(type IN ('cdi', 'cdd', 'freelance', 'stage', 'alternance')),
          department TEXT NOT NULL,
          description TEXT NOT NULL,
          why_join TEXT NOT NULL,
          published INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        INSERT INTO jobs_new (id, slug, reference, title, location, remote, type, department, description, why_join, published, created_at, updated_at)
        SELECT id, slug, reference, title, location, remote, type, department, description, why_join, published, created_at, updated_at FROM jobs;
        DROP TABLE jobs;
        ALTER TABLE jobs_new RENAME TO jobs;
      `);
    }
  } catch {
    // salary column removed or migration not needed
  }
}

function migrateFromJson(db: SqlJsDb) {
  const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
  if (postCount.count > 0) return;

  const files = {
    posts: path.join(DATA_DIR, "posts.json"),
    users: path.join(DATA_DIR, "users.json"),
    submissions: path.join(DATA_DIR, "submissions.json"),
    pages: path.join(DATA_DIR, "pages.json"),
    pricing: path.join(DATA_DIR, "pricing.json"),
    seo: path.join(DATA_DIR, "seo.json"),
  };

  if (fs.existsSync(files.posts)) {
    try {
      const posts = JSON.parse(fs.readFileSync(files.posts, "utf-8")) as any[];
      const insert = db.prepare(`
        INSERT INTO posts (id, slug, title, excerpt, content, category, date, date_iso, image_url, image_tag, image_caption, gradient_id, featured, published, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const p of posts) {
        insert.run(
          p.id, p.slug, p.title, p.excerpt, p.content, p.category, p.date, p.dateISO,
          p.imageUrl || null, p.imageTag || null, p.imageCaption || null,
          p.gradientId ?? null,
          p.featured ? 1 : 0, p.published ? 1 : 0, p.createdAt, p.updatedAt
        );
      }
      fs.renameSync(files.posts, files.posts + ".bak");
    } catch {}
  }

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
