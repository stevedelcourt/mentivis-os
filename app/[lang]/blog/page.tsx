import type { Metadata } from "next";
import { Suspense } from "react";
import { Locale } from "@/lib/i18n";
import BlogIndex from "./BlogIndex";
import { getSeo, getPublishedPosts } from "@/lib/cms/db";
import { sortPostsLatestFirst } from "@/lib/cms/types";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const title = "News - MentivisOS";
  const description = isFr
    ? "Actualites, insights et points de vue sur la formation et l'IA."
    : "News, insights and perspectives on training and AI.";
  return pageMeta(lang as Locale, "/blog", { title, description });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const seo = await getSeo();
  const blogSeo = seo[lang as "fr" | "en"]?.blog;
  let posts = await getPublishedPosts().catch(() => []);
  if (lang === "en") {
    posts = posts.filter((p) => p.contentEn);
  } else {
    // Parity with /api/blog/posts: hide posts with no readable content
    // (e.g. empty-title language duplicates).
    posts = posts.filter((p) => p.content);
  }
  const localized = sortPostsLatestFirst(lang === "fr" ? posts : posts.map((p) => ({
    ...p,
    title: p.titleEn || p.title,
    excerpt: p.excerptEn || p.excerpt,
    content: p.contentEn || p.content,
  })));

  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh" }}>
      <Suspense fallback={<p style={{ textAlign: "center", color: "#4e4e4e", padding: 60 }}>Chargement...</p>}>
        <BlogIndex lang={lang as Locale} initialPosts={localized} />
      </Suspense>
      {blogSeo?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSeo.jsonLd) }}
        />
      )}
    </section>
  );
}
