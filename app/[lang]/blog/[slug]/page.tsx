import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { getPostBySlug, getPublishedPosts } from "@/lib/cms/db";
import { ogImageForPost } from "@/lib/seo/og-images";
import { pageMetadata } from "@/lib/seo/page-metadata";
import JsonLd from "@/components/seo/json-ld";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";
import BlogPostClient from "./blog-post-client";

// Pages prérendues à partir de la base disponible au build. En export statique,
// une page coquille "_" sert en plus les articles publiés après le build (réécriture .htaccess).
export async function generateStaticParams() {
  const posts = await getPublishedPosts().catch(() => []);
  const params = posts.flatMap((p) => [
    { lang: "fr", slug: p.slug },
    { lang: "en", slug: p.slug },
  ]);
  if (process.env.STATIC_EXPORT === "1") {
    params.push({ lang: "fr", slug: "_" }, { lang: "en", slug: "_" });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (slug === "_") return { title: "News MentivisOS", robots: { index: false, follow: true } };
  const isFr = lang === "fr";
  const post = await getPostBySlug(slug).catch(() => undefined);
  if (!post) return { title: "Not Found", robots: { index: false, follow: true } };
  const hasEn = Boolean(post.contentEn && post.contentEn.trim());
  const title = isFr ? post.title : (post.titleEn || post.title);
  const desc = isFr ? post.excerpt : (post.excerptEn || post.excerpt);
  return pageMetadata({
    lang,
    path: `blog/${slug}`,
    title: `${title} | News MentivisOS`,
    description: desc,
    ogImage: ogImageForPost(post),
    type: "article",
    publishedTime: post.dateISO,
    modifiedTime: post.updatedAt,
    en: hasEn,
    noindex: !isFr && !hasEn,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const post = slug === "_" ? undefined : await getPostBySlug(slug).catch(() => undefined);
  const isFr = lang === "fr";
  const title = post ? (isFr ? post.title : (post.titleEn || post.title)) : "";
  return (
    <>
      <BlogPostClient lang={lang} slug={slug} initialPost={post ?? null} />
      {post && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Article",
              headline: title,
              description: isFr ? post.excerpt : (post.excerptEn || post.excerpt),
              image: `${SITE_URL}${ogImageForPost(post)}`,
              datePublished: post.dateISO,
              dateModified: post.updatedAt,
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
          <BreadcrumbJsonLd lang={lang} path={`blog/${slug}`} title={title} />
        </>
      )}
    </>
  );
}
