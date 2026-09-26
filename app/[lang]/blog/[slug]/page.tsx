import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site-url";
import { getPost, getPosts, localizePost } from "@/lib/content";
import { ogImageForPost } from "@/lib/seo/og-images";
import { brandedTitle, pageMetadata } from "@/lib/seo/page-metadata";
import JsonLd from "@/components/seo/json-ld";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";
import BlogPostClient from "./blog-post-client";

export const dynamicParams = false;

// Un article sans traduction n'a pas de page anglaise.
export function generateStaticParams() {
  return getPosts().flatMap((p) => [
    { lang: "fr", slug: p.slug },
    ...(p.contentEn ? [{ lang: "en", slug: p.slug }] : []),
  ]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const raw = getPost(slug);
  if (!raw) return { title: "Not Found", robots: { index: false, follow: true } };
  const post = localizePost(raw, lang);
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: `blog/${slug}`,
    title: brandedTitle(post.title, isFr ? "Actualités MentivisOS" : "MentivisOS News"),
    description: post.excerpt,
    ogImage: ogImageForPost(raw),
    type: "article",
    publishedTime: raw.dateISO,
    modifiedTime: raw.updatedAt,
    en: Boolean(raw.contentEn),
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const raw = getPost(slug);
  if (!raw || (lang === "en" && !raw.contentEn)) notFound();
  const post = localizePost(raw, lang);
  const isFr = lang === "fr";
  return (
    <>
      <BlogPostClient lang={lang} post={post} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: `${SITE_URL}${ogImageForPost(raw)}`,
          datePublished: raw.dateISO,
          dateModified: raw.updatedAt,
          inLanguage: isFr ? "fr-FR" : "en-GB",
          author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "MentivisOS" },
          publisher: {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "MentivisOS",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/images/MentivisOS/mentivisos-logo-wordmark-noir.svg`, width: 200, height: 50 },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/${lang}/blog/${slug}/` },
        }}
      />
      <BreadcrumbJsonLd lang={lang} path={`blog/${slug}`} title={post.title} />
    </>
  );
}
