import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { Suspense } from "react";
import BlogIndex from "./BlogIndex";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";
import { getPostsForLang, getSeo } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "blog",
    title: isFr ? "Actualités - IA, formation et compétences | MentivisOS" : "News - AI, Training and Skills | MentivisOS",
    description: isFr
      ? "Actualités, annonces et analyses de MentivisOS sur la formation en entreprise, l'IA générative et la mesure des compétences."
      : "News, announcements and analysis from MentivisOS on corporate training, generative AI and skills measurement.",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const seo = await getSeo();
  const blogSeo = seo[lang as "fr" | "en"]?.blog;

  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh" }}>
      <BreadcrumbJsonLd lang={lang} path="blog" />
      <Suspense fallback={null}>
        <BlogIndex lang={lang as Locale} posts={getPostsForLang(lang)} />
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
