#!/usr/bin/env node
// Export unique du contenu de l'ancien CMS vers des fichiers du dépôt (site 100 % statique).
// Adapté de scripts/snapshot-prod-db.js (branche feat/static-export), en lecture seule.
//
// Usage (sur le poste de Steven, là où se trouvent les identifiants) :
//   CMS_BASE_URL=https://sc4bovu7233.universe.wf \
//   CMS_EMAIL=steven.delcourt@mentivis.com \
//   CMS_AUTH_SECRET=... \
//   node scripts/export-cms-content.mjs
//
// Écrit :
//   content/blog/<slug>.json    articles (publiés et brouillons, champ "published" conservé)
//   content/jobs/<slug>.json    offres d'emploi
//   content/pricing.json        grilles tarifaires FR
//   content/pages.json          textes de hero (fr/en)
//   content/seo.json            titres, descriptions et JSON-LD globaux
//   public/uploads/<fichier>    images référencées par le contenu (URL réécrites en /uploads/...)
//
// Jamais lus : soumissions de formulaires, candidatures, CV, utilisateurs.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.env.CMS_BASE_URL || "https://sc4bovu7233.universe.wf").replace(/\/$/, "");
const EMAIL = process.env.CMS_EMAIL || "steven.delcourt@mentivis.com";
const SECRET = process.env.CMS_AUTH_SECRET || "";
const UA = "mentivis-export-cms-content";
const PAGE_KEYS = ["homepage", "learningos", "talentos", "about", "security", "ambassadors"];

if (!SECRET) {
  console.error("CMS_AUTH_SECRET est requis (mot de passe du compte CMS).");
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

const write = (rel, data) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
};

// Images servies par l'ancien CMS (/api/uploads/x) : téléchargées et servies en statique (/uploads/x).
const uploads = new Set();
const rewriteUploads = (value) => {
  if (typeof value === "string") {
    return value.replace(/\/api\/uploads\/([A-Za-z0-9._-]+)/g, (_m, name) => {
      uploads.add(name);
      return `/uploads/${name}`;
    });
  }
  if (Array.isArray(value)) return value.map(rewriteUploads);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteUploads(v)]));
  }
  return value;
};

async function main() {
  console.log(`Export du CMS ${BASE}`);
  const login = await api("/api/cms/auth/login/", null, "PUT", { email: EMAIL, password: SECRET });
  if (!login.success || !login.token) throw new Error("Connexion au CMS refusée");
  const token = login.token;

  const [{ posts = [] }, { jobs = [] }, { pricing }, { seo }] = await Promise.all([
    api("/api/cms/posts/", token),
    api("/api/cms/jobs/", token),
    api("/api/cms/pricing/", token),
    api("/api/cms/seo/", token),
  ]);

  for (const post of posts) {
    const { id: _id, ...rest } = post;
    write(`content/blog/${post.slug}.json`, rewriteUploads(rest));
  }
  for (const job of jobs) {
    const { id: _id, ...rest } = job;
    write(`content/jobs/${job.slug}.json`, rewriteUploads(rest));
  }
  write("content/pricing.json", rewriteUploads(pricing));
  write("content/seo.json", rewriteUploads(seo));

  const pages = { fr: {}, en: {} };
  for (const page of PAGE_KEYS) {
    for (const lang of ["fr", "en"]) {
      try {
        const r = await api(`/api/cms/pages/?page=${page}&lang=${lang}`, token);
        if (r.page?.hero) pages[lang][page] = { hero: r.page.hero };
      } catch (e) {
        console.log(`  page ${page}/${lang} ignorée : ${e.message}`);
      }
    }
  }
  write("content/pages.json", rewriteUploads(pages));

  mkdirSync(join(root, "public/uploads"), { recursive: true });
  let downloaded = 0;
  for (const name of uploads) {
    const res = await fetch(`${BASE}/api/uploads/${name}`, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      console.log(`  image ${name} : HTTP ${res.status}`);
      continue;
    }
    writeFileSync(join(root, "public/uploads", name), Buffer.from(await res.arrayBuffer()));
    downloaded += 1;
  }

  console.log(`articles : ${posts.length}, offres : ${jobs.length}, pages : ${Object.keys(pages.fr).length}/${PAGE_KEYS.length}, images : ${downloaded}/${uploads.size}`);
  console.log("Vérifier le résultat (git status), puis commiter content/ et public/uploads/.");
}

main().catch((e) => {
  console.error("Échec :", e.message);
  process.exit(1);
});
