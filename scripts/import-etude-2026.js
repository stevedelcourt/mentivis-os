#!/usr/bin/env node
// Import the Etude IA 2026 article (FR + EN, PDF unlock) into the local database.
// Usage: node scripts/import-etude-2026.js
// Idempotent: skips the post if the slug already exists.

const fs = require("fs");
const path = require("path");
const sql = require("sql.js");

const SEED = path.join(__dirname, "..", "lib", "cms", "seeds", "etude-2026.json");
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "mentivis.db");

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error("Database not found at", DB_PATH);
    process.exit(1);
  }

  const row = JSON.parse(fs.readFileSync(SEED, "utf-8"));

  const SQL = await sql();
  const buf = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(new Uint8Array(buf));

  // Add columns if missing
  const colsResult = db.exec("PRAGMA table_info(posts)");
  const colNames = colsResult.length > 0 ? colsResult[0].values.map(v => v[1]) : [];
  for (const col of ["title_en", "excerpt_en", "content_en", "pdf_url", "pdf_title", "pdf_title_en", "pdf_image", "pdf_context"]) {
    if (!colNames.includes(col)) {
      db.exec(`ALTER TABLE posts ADD COLUMN ${col} TEXT`);
      console.log(`  Added column: ${col}`);
    }
  }

  const now = new Date().toISOString();

  const existing = db.exec(`SELECT slug FROM posts WHERE slug = '${row.slug}'`);
  if (existing.length > 0 && existing[0].values.length > 0) {
    console.log(`  SKIP: "${row.slug}" already exists`);
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
    return;
  }

  const stmt = db.prepare(`
    INSERT INTO posts (slug, title, title_en, excerpt, excerpt_en, content, content_en, category, date, date_iso, image_url, featured, published, pdf_url, pdf_title, pdf_title_en, pdf_image, pdf_context, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.bind([
    row.slug,
    row.title,
    row.titleEn || "",
    row.excerpt || "",
    row.excerptEn || "",
    row.content,
    row.contentEn || "",
    row.category || "strategie",
    row.date || "",
    row.dateISO || now,
    row.imageUrl || null,
    row.featured ? 1 : 0,
    row.published ? 1 : 0,
    row.pdfUrl || null,
    row.pdfTitle || "",
    row.pdfTitleEn || "",
    row.pdfImage || "",
    row.pdfContext || "",
    now,
    now,
  ]);
  stmt.step();
  stmt.free();

  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  console.log(`  OK: inserted "${row.slug}" (${row.title})`);
}

main().catch(console.error);