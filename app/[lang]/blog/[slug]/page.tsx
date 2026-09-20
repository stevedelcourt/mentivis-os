import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { getPostBySlug } from "@/lib/cms/db";
import { ogImageForPost, OG_WIDTH, OG_HEIGHT } from "@/lib/seo/og-images";
import BlogPostClient from "./blog-post-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const isFr = lang === "fr";
  const post = await getPostBySlug(slug).catch(() => undefined);
  if (!post) return { title: "Not Found" };
  const title = isFr ? post.title : (post.titleEn || post.title);
  const desc = isFr ? post.excerpt : (post.excerptEn || post.excerpt);
  return {
    title: `${title} | News MentivisOS`,
    description: desc,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog/${slug}/`,
      languages: {
        fr: `${SITE_URL}/fr/blog/${slug}/`,
        en: `${SITE_URL}/en/blog/${slug}/`,
        "x-default": `${SITE_URL}/fr/blog/${slug}/`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/${lang}/blog/${slug}/`,
      type: "article",
      locale: isFr ? "fr_FR" : "en_US",
      siteName: "MentivisOS",
      images: [{ url: `${SITE_URL}${ogImageForPost(post)}`, width: OG_WIDTH, height: OG_HEIGHT }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const post = await getPostBySlug(slug).catch(() => undefined);
  return <BlogPostClient lang={lang} slug={slug} initialPost={post ?? null} />;
}
