import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { getPosts, getReferentielArticles } from "@/lib/content";
import { PILIERS } from "@/lib/cms/referentiel-clusters";

export const dynamic = "force-static";

const BASE_URL = SITE_URL;
const langs = ["fr", "en"] as const;

// Date de dernière révision éditoriale des pages statiques. À mettre à jour
// lors d'une modification de contenu, pour un lastmod fiable (pas la date du build).
const PAGES_UPDATED = new Date("2026-09-26T00:00:00.000Z");

// Pages indexables uniquement (les pages noindex n'ont rien à faire ici).
const pages = [
  { path: "", priority: 1.0, changeFreq: "weekly" as const },
  { path: "/openos", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/entreprises", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/education", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/tarifs", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/referentiel", priority: 0.8, changeFreq: "weekly" as const },
  { path: "/about", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/security", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/developpers", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/modules/adaptive", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/modules/visual", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/ambassadors", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/impact", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/blog", priority: 0.7, changeFreq: "weekly" as const },
  { path: "/carrieres", priority: 0.5, changeFreq: "weekly" as const },
  { path: "/contact", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/demo", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/legal", priority: 0.2, changeFreq: "yearly" as const },
  { path: "/privacy", priority: 0.2, changeFreq: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFreq: "yearly" as const },
  { path: "/cgv", priority: 0.2, changeFreq: "yearly" as const },
];

/** hreflang réciproques + x-default (version FR). */
function alternates(path: string, withEn = true) {
  const languages: Record<string, string> = { fr: `${BASE_URL}/fr${path}/` };
  if (withEn) languages.en = `${BASE_URL}/en${path}/`;
  languages["x-default"] = `${BASE_URL}/fr${path}/`;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of langs) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${lang}${page.path}/`,
        lastModified: PAGES_UPDATED,
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: alternates(page.path),
      });
    }
  }

  {
    const posts = getPosts();
    for (const post of posts) {
      const withEn = Boolean(post.contentEn && post.contentEn.trim());
      for (const lang of withEn ? langs : (["fr"] as const)) {
        entries.push({
          url: `${BASE_URL}/${lang}/blog/${post.slug}/`,
          lastModified: new Date(post.updatedAt || post.dateISO),
          changeFrequency: "monthly",
          priority: 0.5,
          alternates: alternates(`/blog/${post.slug}`, withEn),
        });
      }
    }
  }

  const refArticles = (await getReferentielArticles()).filter((a) => a.content && a.content.trim());
  for (const article of refArticles) {
    const withEn = Boolean(article.contentEn && article.contentEn.trim());
    const isPilier = (PILIERS as readonly string[]).includes(article.slug);
    for (const lang of withEn ? langs : (["fr"] as const)) {
      entries.push({
        url: `${BASE_URL}/${lang}/referentiel/${article.slug}/`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: "monthly",
        priority: isPilier ? 0.8 : 0.6,
        alternates: alternates(`/referentiel/${article.slug}`, withEn),
      });
    }
  }

  return entries;
}
