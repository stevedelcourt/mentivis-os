import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { getPublishedPosts } from "@/lib/cms/db";

const BASE_URL = SITE_URL;
const langs = ["fr", "en"];

const pages = [
  { path: "", priority: 1.0, changeFreq: "weekly" as const },
  { path: "/learningos", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/talentos", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/tarifs", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/about", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/security", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/ambassadors", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/impact", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFreq: "daily" as const },
  { path: "/carrieres", priority: 0.7, changeFreq: "weekly" as const },
  { path: "/contact", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/demo", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/legal", priority: 0.3, changeFreq: "yearly" as const },
  { path: "/privacy", priority: 0.3, changeFreq: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFreq: "yearly" as const },
  { path: "/cgv", priority: 0.3, changeFreq: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of langs) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${lang}${page.path}/`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            langs.map((l) => [l, `${BASE_URL}/${l}${page.path}/`])
          ),
        },
      });
    }
  }

  try {
    const posts = await getPublishedPosts();
    for (const post of posts) {
      for (const lang of langs) {
        entries.push({
          url: `${BASE_URL}/${lang}/blog/${post.slug}/`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.dateISO),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {}

  return entries;
}
