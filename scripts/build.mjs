#!/usr/bin/env node
// Build du site statique dans out/, prêt à déposer dans public_html.
//
// Usage :
//   npm run build
//   SITE_URL=https://mentivisos.com npm run build   (URL canonique, défaut mentivisos.com)
//
// Étapes : next build (output: "export"), écriture de out/.htaccess et out/index.html,
// puis contrôle SEO de out/ (scripts/check-static-export.mjs). Le build échoue au moindre problème.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const SITE_URL = (process.env.SITE_URL || "https://mentivisos.com").replace(/\/$/, "");
const canonicalHost = new URL(SITE_URL).hostname.replace(/^www\./, "");

// Redirections 301 des anciennes URL (slugs renommés, pages supprimées) : content/redirects.json.
const REDIRECTS = JSON.parse(readFileSync(join(root, "content/redirects.json"), "utf8"));

/** Règle mod_rewrite pour une redirection : chemin échappé, slash final facultatif, cible absolue. */
function redirectRule({ from, to }) {
  const path = from.replace(/^\/+|\/+$/g, "");
  const pattern = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return `RewriteRule "^${pattern}/?$" "https://%{HTTP_HOST}${to}" [R=301,L,NE]`;
}

function run(cmd, args, env = process.env) {
  const res = spawnSync(cmd, args, { cwd: root, env, stdio: "inherit" });
  if (res.status !== 0) throw new Error(`${cmd} ${args.join(" ")} a échoué (code ${res.status})`);
}

function build() {
  rmSync(outDir, { recursive: true, force: true });
  rmSync(join(root, ".next"), { recursive: true, force: true });
  run("npx", ["next", "build", "--webpack"], { ...process.env, SITE_URL, NEXT_PUBLIC_SITE_URL: SITE_URL });
}

function writeExtras() {
  const legacy = REDIRECTS.map(redirectRule).join("\n");
  const htaccess = readFileSync(join(root, "scripts/static-export/htaccess"), "utf8")
    .replace("__LEGACY_REDIRECTS__", legacy)
    .replace("__CANONICAL_HOST_RE__", canonicalHost.replace(/\./g, "\\."));
  writeFileSync(join(outDir, ".htaccess"), htaccess);

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

function summary() {
  const required = [
    "fr/index.html", "en/index.html", "fr/referentiel/index.html", "en/referentiel/index.html",
    "sitemap.xml", "robots.txt", "llms.txt", "404.html", ".htaccess",
    "forms/submit.php", "forms/beta.php", "forms/apply.php", "forms/_lib.php", "forms/.htaccess",
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
  console.log(`\nSite statique prêt : ${outDir}`);
  console.log(`  ${pages} pages HTML, ${(bytes / 1024 / 1024).toFixed(1)} Mo, SITE_URL=${SITE_URL}`);
  console.log("  Déposer TOUT le contenu de out/ (y compris .htaccess et forms/.htaccess) dans public_html.");
}

build();
writeExtras();
run("node", ["scripts/check-static-export.mjs"], { ...process.env, SITE_URL });
summary();
