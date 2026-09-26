#!/usr/bin/env node
// Export statique du site dans out/, prêt pour un upload FTP manuel.
//
// Usage :
//   npm run build:static
//   SITE_URL=https://mentivisos.com API_ORIGIN=https://sc10bovu7233.universe.wf npm run build:static
//   DATA_DIR=/chemin/vers/copie/data npm run build:static   (blog et offres prérendus depuis la base)
//
// Étapes :
// 1. écarte temporairement ce qui exige un serveur Node (app/api, CMS, proxy.ts) ;
// 2. lance `next build` avec STATIC_EXPORT=1 (output: "export") ;
// 3. restaure les fichiers, quoi qu'il arrive ;
// 4. écrit out/.htaccess, out/proxy.php et out/index.html (racine vers /fr/) ;
// 5. vérifie la présence des fichiers attendus.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const stash = join(root, ".static-export-stash");

const SITE_URL = process.env.SITE_URL || "https://mentivisos.com";
const API_ORIGIN = process.env.API_ORIGIN || "https://sc10bovu7233.universe.wf";
const canonicalHost = new URL(SITE_URL).hostname.replace(/^www\./, "");

// Chemins qui exigent un serveur Node : exclus de l'export.
const SERVER_ONLY = ["app/api", "app/[lang]/content-management", "proxy.ts"];

const OLD_REF_SLUG = "comment-lia-personnalise-un-parcours-de-formation";
const NEW_REF_SLUG = "comment-lia-personnalise-et-adapte-un-parcours-de-formation";

function stashServerOnly() {
  if (existsSync(stash)) {
    throw new Error(`${stash} existe déjà : un export précédent a été interrompu. Restaure les fichiers qu'il contient avant de relancer.`);
  }
  mkdirSync(stash, { recursive: true });
  for (const rel of SERVER_ONLY) {
    const from = join(root, rel);
    if (!existsSync(from)) continue;
    const to = join(stash, rel);
    mkdirSync(dirname(to), { recursive: true });
    renameSync(from, to);
  }
}

function restoreServerOnly() {
  if (!existsSync(stash)) return;
  for (const rel of SERVER_ONLY) {
    const from = join(stash, rel);
    if (!existsSync(from)) continue;
    renameSync(from, join(root, rel));
  }
  rmSync(stash, { recursive: true, force: true });
}

function build() {
  rmSync(outDir, { recursive: true, force: true });
  rmSync(join(root, ".next"), { recursive: true, force: true });
  const env = { ...process.env, STATIC_EXPORT: "1", SITE_URL, NEXT_PUBLIC_SITE_URL: SITE_URL };
  delete env.ASSET_PREFIX;
  const res = spawnSync("npx", ["next", "build", "--webpack"], { cwd: root, env, stdio: "inherit" });
  if (res.status !== 0) throw new Error(`next build a échoué (code ${res.status})`);
}

function writeExtras() {
  const legacy = ["fr", "en"]
    .map((lang) => `RewriteRule ^${lang}/referentiel/${OLD_REF_SLUG}/?$ https://%{HTTP_HOST}/${lang}/referentiel/${NEW_REF_SLUG}/ [R=301,L]`)
    .join("\n");
  const htaccess = readFileSync(join(root, "scripts/static-export/htaccess"), "utf8")
    .replace("__LEGACY_REDIRECTS__", legacy)
    .replace("__CANONICAL_HOST_RE__", canonicalHost.replace(/\./g, "\\."));
  writeFileSync(join(outDir, ".htaccess"), htaccess);

  const proxy = readFileSync(join(root, "scripts/static-export/proxy.php"), "utf8").replace("__API_ORIGIN__", API_ORIGIN);
  writeFileSync(join(outDir, "proxy.php"), proxy);

  // Racine : redirection 301 par .htaccess ; ce fichier sert de repli sans mod_rewrite.
  writeFileSync(
    join(outDir, "index.html"),
    `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>MentivisOS</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${SITE_URL}/fr/">
<meta http-equiv="refresh" content="0; url=/fr/">
</head>
<body><a href="/fr/">MentivisOS</a></body>
</html>
`,
  );
}

function checkOutput() {
  const required = [
    "fr/index.html", "en/index.html", "fr/referentiel/index.html", "en/referentiel/index.html",
    "sitemap.xml", "robots.txt", "llms.txt", "404.html", ".htaccess", "proxy.php",
    "fr/blog/_/index.html", "fr/carrieres/_/index.html",
  ];
  const missing = required.filter((f) => !existsSync(join(outDir, f)));
  if (missing.length) throw new Error(`Fichiers manquants dans out/ : ${missing.join(", ")}`);

  let pages = 0;
  let bytes = 0;
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else {
        bytes += st.size;
        if (name === "index.html") pages += 1;
      }
    }
  };
  walk(outDir);
  console.log(`\nExport statique prêt : ${outDir}`);
  console.log(`  ${pages} pages HTML, ${(bytes / 1024 / 1024).toFixed(1)} Mo au total`);
  console.log(`  SITE_URL=${SITE_URL}  API_ORIGIN=${API_ORIGIN}`);
  console.log("  Upload : copier TOUT le contenu de out/ (y compris .htaccess) à la racine du site.");
}

try {
  stashServerOnly();
  build();
} finally {
  restoreServerOnly();
}
writeExtras();
checkOutput();
