import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { getReferentielArticles, getReferentielArticle } from "@/lib/cms/db";
import { ReferentielSplit } from "./referentiel-split";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Le Référentiel - MentivisOS" : "The Reference - MentivisOS",
    description: isFr
      ? "Articles pratiques et conformes sur la formation professionnelle, le référentiel Qualiopi, le développement des compétences."
      : "Practical articles on vocational training, Qualiopi standards, and skills development.",
    robots: { index: true, follow: true },
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
