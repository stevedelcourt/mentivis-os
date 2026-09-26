#!/usr/bin/env node
// Contrôle SEO de l'export statique (out/). Usage : node scripts/check-static-export.mjs
// Vérifie, pour chaque page HTML : <html lang>, canonical autoréférent, hreflang
// fr/en/x-default réciproques, JSON-LD valide, un seul BreadcrumbList, FAQPage
// sur les articles avec FAQ ; puis : URL du sitemap présentes et indexables,
// liens internes non cassés. Sort en erreur (code 1) au moindre problème.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const SITE_URL = (process.env.SITE_URL || "https://mentivisos.com").replace(/\/$/, "");

const errors = [];
const warn = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);

function htmlFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "_next") continue;
      htmlFiles(p, acc);
    } else if (name === "index.html") acc.push(p);
  }
  return acc;
}

const decode = (s) => s.replace(/&amp;/g, "&");

const pages = new Map(); // url -> infos
for (const file of htmlFiles(outDir)) {
  const rel = "/" + relative(outDir, dirname(file)).split("\\").join("/");
  const path = rel === "/" ? "/" : `${rel}/`;
  if (path === "/") continue; // redirection racine
  if (path === "/404/" || path === "/_not-found/") continue; // artefacts 404 de Next
  const html = readFileSync(file, "utf8");
  const url = `${SITE_URL}${path}`;
  const lang = (html.match(/<html[^>]*\slang="([^"]+)"/) || [])[1];
  const robots = (html.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || "";
  const noindex = /noindex/.test(robots);
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const alternates = {};
  for (const m of html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)) alternates[m[1]] = m[2];
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const links = [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => decode(m[1]));
  pages.set(url, { path, lang, noindex, canonical, alternates, ld, links, html });
}

for (const [url, p] of pages) {
  const expectedLang = p.path.split("/")[1];
  if (p.lang !== expectedLang) err(p.path, `<html lang="${p.lang}"> au lieu de "${expectedLang}"`);

  const types = [];
  for (const raw of p.ld) {
    try {
      const data = JSON.parse(raw);
      for (const d of Array.isArray(data) ? data : [data]) types.push(d["@type"]);
    } catch {
      err(p.path, "JSON-LD invalide");
    }
  }
  const crumbs = types.filter((t) => t === "BreadcrumbList").length;
  if (crumbs > 1) err(p.path, `${crumbs} BreadcrumbList`);

  if (p.noindex) continue; // les pages noindex n'ont pas d'exigence de canonical/hreflang

  if (p.canonical !== url) err(p.path, `canonical ${p.canonical} (attendu ${url})`);
  if (!p.alternates["x-default"]) err(p.path, "hreflang x-default absent");
  if (!p.alternates.fr) err(p.path, "hreflang fr absent");
  for (const [hl, target] of Object.entries(p.alternates)) {
    if (hl === "x-default") continue;
    const other = pages.get(target);
    if (!other) { err(p.path, `hreflang ${hl} vers une page absente : ${target}`); continue; }
    if (other.noindex) { err(p.path, `hreflang ${hl} vers une page noindex : ${target}`); continue; }
    const back = Object.values(other.alternates);
    if (!back.includes(url)) err(p.path, `hreflang ${hl} non réciproque (${target})`);
  }
  if (crumbs === 0 && p.path.split("/").filter(Boolean).length > 1) err(p.path, "BreadcrumbList absent");
  if (/\/referentiel\/[^/]+\/$/.test(p.path)) {
    if (!types.includes("Article")) err(p.path, "Article JSON-LD absent");
    const hasFaqBlock = /Questions fréquentes<\/h2>|Frequently asked questions<\/h2>/.test(p.html);
    if (hasFaqBlock && !types.includes("FAQPage")) err(p.path, "FAQ visible sans FAQPage");
    if (/<h1[\s>][\s\S]*?<h3[\s>]/.test(p.html) && !/<h1[\s>][\s\S]*?<h2[\s>]/.test(p.html)) err(p.path, "h1 suivi de h3 sans h2");
  }
}

// Sitemap
const sitemap = readFileSync(join(outDir, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  const p = pages.get(loc);
  if (!p) err("sitemap.xml", `URL sans page : ${loc}`);
  else if (p.noindex) err("sitemap.xml", `URL noindex : ${loc}`);
}
const inSitemap = new Set(locs);
for (const [url, p] of pages) {
  if (!p.noindex && !inSitemap.has(url)) warn.push(`page indexable absente du sitemap : ${p.path}`);
}

// Liens internes
const files = new Set();
for (const [url] of pages) files.add(new URL(url).pathname);
for (const [, p] of pages) {
  for (const href of p.links) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const pathOnly = href.split(/[?#]/)[0];
    if (!pathOnly || /\.[a-z0-9]+$/i.test(pathOnly)) {
      if (pathOnly && !existsSync(join(outDir, pathOnly))) err(p.path, `fichier lié absent : ${pathOnly}`);
      continue;
    }
    const normalized = pathOnly.endsWith("/") ? pathOnly : `${pathOnly}/`;
    if (!files.has(normalized) && !existsSync(join(outDir, normalized, "index.html"))) {
      err(p.path, `lien interne cassé : ${href}`);
    }
  }
}

const unique = (a) => [...new Set(a)];
console.log(`${pages.size} pages contrôlées, ${locs.length} URL dans le sitemap.`);
if (warn.length) console.log(`\nAvertissements (${warn.length}) :\n  ${unique(warn).join("\n  ")}`);
if (errors.length) {
  console.log(`\nErreurs (${errors.length}) :\n  ${unique(errors).join("\n  ")}`);
  process.exit(1);
}
console.log("Aucune erreur.");
