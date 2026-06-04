import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getReferentielArticles, getReferentielArticle } from "@/lib/cms/db";
import { ReferentielSplit } from "./referentiel-split";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Le Référentiel — Guides formation professionnelle | MentivisOS" : "The Reference — Professional Training Guides | MentivisOS",
    description: lang === "fr"
      ? "Articles pratiques et conformes sur la formation professionnelle, le référentiel Qualiopi, le développement des compétences."
      : "Practical compliance guides for training organizations. Qualiopi, funding, skills development, AI training.",
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
    if (initialArticle && lang === "en" && initialArticle.contentEn) {
      initialArticle.content = initialArticle.contentEn;
      if (initialArticle.titleEn) initialArticle.title = initialArticle.titleEn;
    }
  }
  const localizedArticles = lang === "en"
    ? articles.map((a) => ({ ...a, content: a.contentEn || a.content, title: a.titleEn || a.title }))
    : articles;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!sp.article && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: lang === "en" ? "The Reference — MentivisOS" : "Le Référentiel — MentivisOS",
              description: lang === "en"
                ? "Practical compliance guides for training organizations. Qualiopi, funding, skills development, AI training."
                : "Articles pratiques sur la formation professionnelle, le référentiel Qualiopi, le développement des compétences et l'intégration IA.",
              url: `${SITE_URL}/${lang}/referentiel/`,
              inLanguage: lang === "en" ? "en-US" : "fr-FR",
              publisher: {
                "@type": "Organization",
                name: "MentivisOS",
                url: SITE_URL,
              },
              hasPart: localizedArticles.slice(0, 10).map((a: any) => ({
                "@type": "Article",
                headline: a.title,
                url: `${SITE_URL}/${lang}/referentiel/?article=${a.slug}`,
              })),
            }),
          }}
        />
      )}
      <ReferentielSplit
        lang={lang as Locale}
        articles={localizedArticles}
        initialArticle={initialArticle}
        initialSlug={slug}
      />
    </div>
  );
}
