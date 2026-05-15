import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import BlogIndex from "./BlogIndex";
import { getSeo } from "@/lib/cms/db";

export const metadata: Metadata = {
  title: "News - MentivisOS",
  description: "Actualites, insights et points de vue sur la formation et l'IA.",
};

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
      <BlogIndex lang={lang as Locale} />
      {blogSeo?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSeo.jsonLd) }}
        />
      )}
    </section>
  );
}
