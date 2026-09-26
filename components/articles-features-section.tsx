import { Locale } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/cms/db";
import { sortPostsLatestFirst } from "@/lib/cms/types";
import ArticlesFeaturesClient from "./articles-features-client";

interface ArticlesFeaturesSectionProps {
  lang: Locale;
}

export default async function ArticlesFeaturesSection({ lang }: ArticlesFeaturesSectionProps) {
  let posts = await getPublishedPosts().catch(() => []);
  if (lang === "en") {
    posts = posts
      .filter((p) => p.contentEn)
      .map((p) => ({ ...p, title: p.titleEn || p.title, excerpt: p.excerptEn || p.excerpt, content: p.contentEn || p.content }));
  } else {
    // Parity with /api/blog/posts: hide posts with no readable content.
    posts = posts.filter((p) => p.content);
  }
  posts = sortPostsLatestFirst(posts).slice(0, 3);
  return <ArticlesFeaturesClient lang={lang} initialPosts={posts} />;
}
