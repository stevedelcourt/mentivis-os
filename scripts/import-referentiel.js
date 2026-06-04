#!/usr/bin/env node
// Import referentiel articles from markdown files into the database.
// Usage: node scripts/import-referentiel.js

const fs = require("fs");
const path = require("path");
const sql = require("sql.js");

const FILES = [
  path.join(__dirname, "..", "public", "mos", "mentivisos-lot-1.md"),
  path.join(__dirname, "..", "public", "mos", "mentivisos-lot-2.md"),
];

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "mentivis.db");

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 80);
}

function parseArticles(md) {
  // Split on --- \n --- (separator between articles)
  const blocks = md.split(/\n---\s*\n---\s*\n/);
  const articles = [];
  let position = 0;

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    const titleLine = lines.find(l => l.startsWith("# "));
    if (!titleLine) continue;

    const title = titleLine.replace(/^#\s+/, "").replace(/^\d+\.\s*/, "").trim();
    if (/^MentivisOS\s*[—\-]\s*Lot\b/i.test(title)) continue;
    const slug = generateSlug(title);
    position++;

    articles.push({ title, slug, content: block.trim(), position });
  }

  return articles;
}

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error("Database not found at", DB_PATH);
    console.error("Run DATA_DIR=/path/to/data node scripts/import-referentiel.js");
    process.exit(1);
  }

  const SQL = await sql();
  const buf = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(new Uint8Array(buf));

  // Ensure table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS referentiel_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  let total = 0;
  for (const filePath of FILES) {
    if (!fs.existsSync(filePath)) {
      console.warn("File not found:", filePath);
      continue;
    }
    const md = fs.readFileSync(filePath, "utf-8");
    const articles = parseArticles(md);
    console.log(`\n${path.basename(filePath)}: ${articles.length} articles found`);

    for (const article of articles) {
      // Check if slug already exists
      const existing = db.prepare("SELECT id FROM referentiel_articles WHERE slug = ?").get([article.slug]);
      if (existing && existing.length > 0) {
        console.log(`  SKIP (exists): ${article.title}`);
        continue;
      }

      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO referentiel_articles (slug, title, content, position, published, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, ?, ?)
      `).run([article.slug, article.title, article.content, article.position, now, now]);
      console.log(`  OK: ${article.title}`);
      total++;
    }
  }

  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  console.log(`\nDone. ${total} new articles imported.`);
}

main().catch(console.error);
