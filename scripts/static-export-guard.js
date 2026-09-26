// Static-export guard for Universe deployments.
// When STATIC_EXPORT=1, API routes, the admin CMS and the edge proxy cannot
// be exported (no server runtime on a static host). This script moves them
// aside before the build and restores them afterwards, so the normal server
// build is untouched. No-op for every other build.
//
// Dynamic [slug] routes are also moved aside when their source table is
// empty: Next.js export requires generateStaticParams() to yield at least
// one path, so a route with zero items (e.g. no published jobs in the local
// DB the export is built from) would fail the build. The live servers keep
// serving those routes from their own databases.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const BAK = path.join(ROOT, ".static-export-bak");
const RECORD = path.join(BAK, "moved.json");

// Always excluded from a static export (no server runtime on Universe).
const ALWAYS = ["app/api", "app/[lang]/content-management", "proxy.ts"];

// Excluded only when the local build DB holds zero items for them.
// Excluded only when the local build DB holds zero items for them.
// Note: carrieres/[slug] is NOT conditional: its generateStaticParams()
// always includes the spontaneous-application slug, so the route always
// yields at least one static path.
const CONDITIONAL = [
  { route: "app/[lang]/blog/[slug]", table: "posts", where: "published = 1" },
];

function countRows(table, where) {
  try {
    const out = execFileSync(
      "python3",
      [
        "-c",
        `import sqlite3,sys; db=sqlite3.connect('data/mentivis.db'); print(db.execute('SELECT COUNT(*) FROM ${table} WHERE ${where}').fetchone()[0])`,
      ],
      { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }
    );
    return parseInt(String(out).trim(), 10) || 0;
  } catch {
    return 0;
  }
}

function moveAside(rel) {
  const src = path.join(ROOT, rel);
  const dest = path.join(BAK, rel);
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(src, dest);
    console.log(`[static-export] moved ${rel} aside`);
    return true;
  }
  return false;
}

function main() {
  if (process.env.STATIC_EXPORT !== "1") return;
  const mode = process.argv[2];
  if (mode === "pre") {
    // Fresh export dir: stale files from previous exports (removed pages,
    // old slugs) must not linger in out/.
    const outDir = path.join(ROOT, "out");
    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true, force: true });
      console.log("[static-export] cleaned out/");
    }
    // Merge with any existing record (a previous pre without post must
    // never orphan already-moved files).
    let moved = [];
    try {
      moved = JSON.parse(fs.readFileSync(RECORD, "utf8"));
      if (!Array.isArray(moved)) moved = [];
    } catch {
      moved = [];
    }
    for (const rel of ALWAYS) if (moveAside(rel) && !moved.includes(rel)) moved.push(rel);
    for (const { route, table, where } of CONDITIONAL) {
      const n = countRows(table, where);
      console.log(`[static-export] ${table}: ${n} published item(s)`);
      if (n === 0 && moveAside(route) && !moved.includes(route)) moved.push(route);
    }
    fs.mkdirSync(BAK, { recursive: true });
    fs.writeFileSync(RECORD, JSON.stringify(moved));
  } else if (mode === "post") {
    let moved = [];
    try {
      moved = JSON.parse(fs.readFileSync(RECORD, "utf8"));
    } catch {
      moved = [];
    }
    const restoreOne = (rel) => {
      const src = path.join(BAK, rel);
      const dest = path.join(ROOT, rel);
      if (fs.existsSync(src) && !fs.existsSync(dest)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(src, dest);
        console.log(`[static-export] restored ${rel}`);
      }
    };
    for (const rel of moved) restoreOne(rel);
    // Belt and braces: restore anything still under backup (unrecorded moves
    // must never be deleted).
    for (const rel of [...ALWAYS, ...CONDITIONAL.map((c) => c.route)]) restoreOne(rel);
    // Only remove the backup dir when it is actually empty.
    try {
      if (fs.existsSync(BAK) && fs.readdirSync(BAK).length <= 1) {
        fs.rmSync(BAK, { recursive: true, force: true });
      } else if (fs.existsSync(BAK)) {
        console.log("[static-export] backup dir NOT empty, kept at " + BAK);
      }
    } catch {
      // ignore
    }
  }
}

main();
