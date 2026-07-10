#!/usr/bin/env node
// Import new referentiel articles (2026 extension) into the database.
// Usage: node scripts/import-referentiel-2026.js

const fs = require("fs");
const path = require("path");
const sql = require("sql.js");

const FILE = path.join(__dirname, "..", "public", "referentiel-mentivisos-2026.md");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "mentivis.db");

const BLOC_TITLES = {
  M: "IA et formation en entreprise",
  N: "IA et apprentissage",
  P: "Produits MentivisOS",
};

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

function parseFAQ(md) {
  const faqs = [];
  const lines = md.trim().split("\n");
  let current = null;
  for (const line of lines) {
    const boldMatch = line.match(/^\*\*(.+?)\?\*\*\s*(.*)/);
    if (boldMatch) {
      if (current) faqs.push(current);
      current = { q: boldMatch[1].trim() + " ?", a: boldMatch[2].trim() };
    } else if (current) {
      current.a += "\n" + line.trim();
    }
  }
  if (current) faqs.push(current);
  return faqs;
}

function parseArticles(md) {
  // Remove header section (everything before first ---)
  const headerEnd = md.indexOf("\n---\n");
  const body = headerEnd >= 0 ? md.slice(headerEnd + 5) : md;

  // Split on --- (separator)
  const segments = body.split(/\n---\s*\n/);

  const articles = [];
  let currentBloc = "";
  let positionInBloc = 0;

  for (const seg of segments) {
    const t = seg.trim();
    if (!t) continue;

    // Check for bloc header: "Bloc M — ..."
    const blocMatch = t.match(/^## Bloc\s+([MNP])\s*[—\-–]\s*(.+)$/m);
    if (blocMatch) {
      currentBloc = blocMatch[1];
      positionInBloc = 0;
      continue;
    }

    // Check for article: "## M1. Title"
    const articleMatch = t.match(/^##\s+([MNP])(\d+)\.\s+(.+)$/m);
    if (!articleMatch) continue;

    const bloc = articleMatch[1];
    if (bloc !== currentBloc) {
      currentBloc = bloc;
      positionInBloc = 0;
    }
    positionInBloc++;

    const articleNum = articleMatch[2];
    const title = articleMatch[3].trim();
    const slug = generateSlug(title);

    // Extract body: everything after the title line, before FAQ
    const afterTitle = t.replace(/^##\s+[MNP]\d+\.\s+.+$/m, "").trim();

    const faqIdx = afterTitle.indexOf("### Questions fréquentes");
    let contentBody = "";
    let faqSection = "";

    if (faqIdx >= 0) {
      contentBody = afterTitle.slice(0, faqIdx).trim();
      faqSection = afterTitle.slice(faqIdx + 26).trim(); // after "### Questions fréquentes"
    } else {
      contentBody = afterTitle;
    }

    // First paragraph = chapeau (summary)
    const bodyLines = contentBody.split("\n").filter(l => l.trim());
    let chapeau = "";
    for (const line of bodyLines) {
      const s = line.trim();
      if (s && !s.startsWith("#") && !s.startsWith("---")) {
        chapeau = s;
        break;
      }
    }

    const faqs = parseFAQ(faqSection);

    articles.push({
      slug,
      title,
      bloc,
      positionInBloc,
      chapeau,
      content: `## ${title}\n\n${contentBody}${faqs.length > 0 ? `\n\n### Questions fréquentes\n\n${faqs.map(f => `**${f.q}**\n${f.a}`).join("\n\n")}` : ""}`,
      faq: JSON.stringify(faqs),
    });
  }

  return articles;
}

const CIBLE_RULES = [
  { mots: ["direction de la formation", "directeur de la formation", "pilotage de la formation", "décision technologique", "système de formation ia", "éditeur", "cahier des charges", "appel d'offres", "fournisseur"], cible: "Directions formation" },
  { mots: ["drh", "daf", "direction financière", "directeur financier", "retour sur investissement", "budget formation", "coût", "business case", "argumentaire financier"], cible: "DRH et DAF" },
  { mots: ["apprenant", "apprentissage", "pédagogique", "mémoire", "rétention", "études", "sciences cognitives"], cible: "Apprenants" },
  { mots: ["organisme de formation", "cfa", "école", "qualifi", "financeur", "opco"], cible: "Organismes de formation" },
];

function guessCible(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  const scores = {};
  for (const rule of CIBLE_RULES) {
    scores[rule.cible] = 0;
    for (const mot of rule.mots) {
      if (text.includes(mot)) scores[rule.cible] += mot.length;
    }
  }
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error("Database not found at", DB_PATH);
    console.error("Run DATA_DIR=/path/to/data node scripts/import-referentiel-2026.js");
    process.exit(1);
  }

  const SQL = await sql();
  const buf = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(new Uint8Array(buf));

  // Add new columns if missing
  const cols = db.prepare("PRAGMA table_info(referentiel_articles)").all();
  const colNames = cols.map(c => c.name);

  const newCols = [
    "chapeau TEXT",
    "chapeau_en TEXT",
    "bloc TEXT",
    "position_in_bloc INTEGER DEFAULT 0",
    "cible TEXT",
    "faq TEXT",
    "faq_en TEXT",
  ];

  for (const colDef of newCols) {
    const colName = colDef.split(" ")[0];
    if (!colNames.includes(colName)) {
      db.exec(`ALTER TABLE referentiel_articles ADD COLUMN ${colDef}`);
      console.log(`  Added column: ${colName}`);
    }
  }

  // Delete existing articles
  const existingCount = db.prepare("SELECT COUNT(*) as c FROM referentiel_articles").get();
  db.exec("DELETE FROM referentiel_articles");
  console.log(`Deleted ${existingCount.c} existing articles`);

  const md = fs.readFileSync(FILE, "utf-8");
  const articles = parseArticles(md);
  console.log(`\n${articles.length} articles found\n`);

  let total = 0;
  for (const article of articles) {
    const cible = guessCible(article.title, article.content);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO referentiel_articles (slug, title, content, chapeau, bloc, position_in_bloc, cible, faq, position, published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run([
      article.slug,
      article.title,
      article.content,
      article.chapeau,
      article.bloc,
      article.positionInBloc,
      cible,
      article.faq,
      article.positionInBloc + (article.bloc === "M" ? 0 : article.bloc === "N" ? 100 : 200),
      now,
      now,
    ]);
    console.log(`  ${article.bloc}${article.positionInBloc}. ${article.title} [${cible}]`);
    total++;
  }

  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  console.log(`\nDone. ${total} articles imported.`);
}

main().catch(console.error);
