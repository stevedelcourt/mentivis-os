import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getReferentielArticles, getReferentielArticle } from "@/lib/cms/db";
import { ReferentielSplit } from "./referentiel-split";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Le Référentiel - MentivisOS",
    description: "Articles pratiques et conformes sur la formation professionnelle, le réferentiel Qualiopi, le développement des compétences.",
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_URL}/fr/referentiel/` },
  };
}

export default async function ReferentielPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ article?: string }> }) {
  const { lang } = await params;
  const sp = await searchParams;
  const slug = sp.article || "";
  const articles = await getReferentielArticles();
  let initialArticle = null;
  if (slug) {
    initialArticle = await getReferentielArticle(slug) || null;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ReferentielSplit
        lang={lang as Locale}
        articles={articles}
        initialArticle={initialArticle}
        initialSlug={slug}
      />
    </div>
  );
}
