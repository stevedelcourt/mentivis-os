// Contenu éditorial du site, lu dans des fichiers au moment du build (site 100 % statique).
//
//   content/blog/<slug>.json   articles de blog (forme Post)
//   content/jobs/<slug>.json   offres d'emploi (forme Job)
//   content/pages.json         textes de hero par page et par langue (lu par components/cms-page-hero.tsx)
//   content/pricing.json       grilles tarifaires FR (optionnel)
//   content/seo.json           titres, descriptions et JSON-LD globaux (optionnel)
//
// Ces fichiers sont produits une fois par scripts/export-cms-content.mjs à partir de
// l'ancien CMS, puis édités directement dans le dépôt.
import fs from "node:fs";
import path from "node:path";
import type { Job, Post, PricingContent, SeoContent } from "@/lib/cms/types";
import { DEFAULT_PRICING, DEFAULT_PRICING_EN, DEFAULT_SEO } from "./defaults";

export { getReferentielArticles, getReferentielArticle } from "./referentiel";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson<T>(file: string): T | undefined {
  const p = path.join(CONTENT_DIR, file);
  if (!fs.existsSync(p)) return undefined;
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

function readDir<T>(dir: string): T[] {
  const p = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(p)) return [];
  return fs
    .readdirSync(p)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(p, f), "utf8")) as T);
}

// ── Blog ──

function normalizePost(raw: Partial<Post>, index: number): Post {
  return {
    id: raw.id ?? index + 1,
    slug: raw.slug || "",
    title: raw.title || "",
    titleEn: raw.titleEn || "",
    excerpt: raw.excerpt || "",
    excerptEn: raw.excerptEn || "",
    content: raw.content || "",
    contentEn: raw.contentEn || "",
    category: raw.category || "strategie",
    date: raw.date || "",
    dateISO: raw.dateISO || raw.createdAt || "",
    imageUrl: raw.imageUrl || "",
    imageTag: raw.imageTag || "",
    imageCaption: raw.imageCaption || "",
    gradientId: raw.gradientId || "",
    featured: Boolean(raw.featured),
    published: raw.published !== false,
    pdfUrl: raw.pdfUrl || undefined,
    pdfTitle: raw.pdfTitle || undefined,
    pdfTitleEn: raw.pdfTitleEn || undefined,
    pdfImage: raw.pdfImage || undefined,
    pdfContext: raw.pdfContext || undefined,
    createdAt: raw.createdAt || raw.dateISO || "",
    updatedAt: raw.updatedAt || raw.dateISO || "",
  };
}

/** Articles publiés, épinglés d'abord puis du plus récent au plus ancien. */
export function getPosts(): Post[] {
  return readDir<Partial<Post>>("blog")
    .map(normalizePost)
    .filter((p) => p.published && p.slug && p.content)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
    });
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** Version localisée d'un article (champs FR remplacés par les champs EN s'ils existent). */
export function localizePost(p: Post, lang: string): Post {
  if (lang !== "en") return p;
  return {
    ...p,
    title: p.titleEn || p.title,
    excerpt: p.excerptEn || p.excerpt,
    content: p.contentEn || p.content,
    pdfTitle: p.pdfTitleEn || p.pdfTitle,
  };
}

/** Articles visibles dans une langue : en anglais, seulement ceux qui ont une traduction. */
export function getPostsForLang(lang: string): Post[] {
  return getPosts()
    .filter((p) => (lang === "en" ? Boolean(p.contentEn) : true))
    .map((p) => localizePost(p, lang));
}

// ── Offres d'emploi ──

function normalizeJob(raw: Partial<Job>, index: number): Job {
  return {
    id: raw.id ?? index + 1,
    slug: raw.slug || "",
    reference: raw.reference || "",
    title: raw.title || "",
    titleEn: raw.titleEn || "",
    location: raw.location || "",
    locationEn: raw.locationEn || "",
    remote: Boolean(raw.remote),
    type: raw.type || "cdi",
    department: raw.department || "",
    departmentEn: raw.departmentEn || "",
    description: raw.description || "",
    descriptionEn: raw.descriptionEn || "",
    whyJoin: raw.whyJoin || "",
    whyJoinEn: raw.whyJoinEn || "",
    published: raw.published !== false,
    createdAt: raw.createdAt || "",
    updatedAt: raw.updatedAt || raw.createdAt || "",
  };
}

export function getJobs(): Job[] {
  return readDir<Partial<Job>>("jobs")
    .map(normalizeJob)
    .filter((j) => j.published && j.slug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getJob(slug: string): Job | undefined {
  return getJobs().find((j) => j.slug === slug);
}

export function localizeJob(j: Job, lang: string): Job {
  if (lang !== "en") return j;
  return {
    ...j,
    title: j.titleEn || j.title,
    location: j.locationEn || j.location,
    department: j.departmentEn || j.department,
    description: j.descriptionEn || j.description,
    whyJoin: j.whyJoinEn || j.whyJoin,
  };
}

// ── Tarifs ──

export function getPricing(lang: string): PricingContent {
  // Comme l'ancien CMS : les grilles anglaises sont figées dans le code.
  if (lang === "en") return DEFAULT_PRICING_EN;
  const file = readJson<Partial<PricingContent>>("pricing.json");
  return { ...DEFAULT_PRICING, ...(file || {}) };
}

// ── SEO global ──

export function getSeo(): SeoContent {
  const file = readJson<Partial<SeoContent>>("seo.json");
  return {
    fr: { ...DEFAULT_SEO.fr, ...(file?.fr || {}) },
    en: { ...DEFAULT_SEO.en, ...(file?.en || {}) },
  };
}
