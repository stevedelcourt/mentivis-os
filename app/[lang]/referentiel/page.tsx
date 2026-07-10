import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getReferentielArticles } from "@/lib/cms/db";
import { Cible, Bloc } from "@/lib/cms/types";
import { ReferentielGrid } from "./referentiel-grid";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Le Référentiel - Guides IA, formation et compétences | MentivisOS" : "The Reference - AI, Training & Skills Guides | MentivisOS",
    description: lang === "fr"
      ? "18 articles de référence sur l'IA dans la formation en entreprise, l'apprentissage adaptatif et les produits MentivisOS."
      : "18 reference articles on AI in corporate training, adaptive learning, and MentivisOS products.",
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_URL}/${lang}/referentiel/` },
  };
}

export default async function ReferentielPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ article?: string; bloc?: string; cible?: string }> }) {
  const { lang } = await params;
  const sp = await searchParams;

  if (sp.article) {
    redirect(`/${lang}/referentiel/${sp.article}`);
  }

  const isFr = lang === "fr";
  const blocFilter = sp.bloc as Bloc | undefined;
  const cibleFilter = sp.cible as Cible | undefined;

  const articles = await getReferentielArticles({ bloc: blocFilter, cible: cibleFilter });
  const allArticles = blocFilter || cibleFilter ? await getReferentielArticles() : articles;

  const localized = isFr ? articles : articles.map((a) => ({
    ...a,
    title: a.titleEn || a.title,
    content: a.contentEn || a.content,
    chapeau: a.chapeauEn || a.chapeau,
  }));

  const localizedAll = isFr ? allArticles : allArticles.map((a) => ({
    ...a,
    title: a.titleEn || a.title,
    content: a.contentEn || a.content,
    chapeau: a.chapeauEn || a.chapeau,
  }));

  const BLOC_COLORS: Record<string, string> = { M: "#0891b2", N: "#15803d", P: "#7c3aed" };
  const BLOC_LABELS: Record<string, string> = {
    M: isFr ? "IA & Formation" : "AI & Training",
    N: isFr ? "IA & Apprentissage" : "AI & Learning",
    P: isFr ? "Produits" : "Products",
  };
  const BLOC_FULL: Record<string, string> = {
    M: isFr ? "IA et formation en entreprise" : "AI in Corporate Training",
    N: isFr ? "IA et apprentissage" : "AI and Learning",
    P: isFr ? "Produits MentivisOS" : "MentivisOS Products",
  };
  const CIBLE_LABELS: Record<string, string> = {
    "Directions formation": isFr ? "Directions formation" : "Training Directors",
    "DRH et DAF": isFr ? "DRH & DAF" : "HR & Finance",
    Apprenants: isFr ? "Apprenants" : "Learners",
    "Organismes de formation": isFr ? "Organismes de formation" : "Training Orgs",
    "Tout public": isFr ? "Tout public" : "General",
  };
  const CIBLE_COLORS: Record<string, string> = {
    "Directions formation": "#2563eb",
    "DRH et DAF": "#7c3aed",
    Apprenants: "#0891b2",
    "Organismes de formation": "#059669",
    "Tout public": "#6b7280",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid #e4e4e4", padding: "80px 24px 32px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4e4e4e", marginBottom: 8 }}>
            {isFr ? "Articles de référence" : "Reference Articles"}
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, lineHeight: 1.2, color: "#0A0A0A", margin: 0 }}>
            {isFr ? "Le Référentiel" : "The Reference"}
          </h1>
          <p style={{ fontSize: 16, color: "#4e4e4e", marginTop: 12, maxWidth: 600 }}>
            {isFr
              ? "18 articles factuels sur l'IA dans la formation, l'apprentissage adaptatif et les produits MentivisOS."
              : "18 factual articles on AI in training, adaptive learning, and MentivisOS products."}
          </p>
        </div>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: isFr ? "Le Référentiel - MentivisOS" : "The Reference - MentivisOS",
            description: isFr
              ? "18 articles factuels sur l'IA dans la formation, l'apprentissage adaptatif et les produits MentivisOS."
              : "18 factual articles on AI in training, adaptive learning, and MentivisOS products.",
            url: `${SITE_URL}/${lang}/referentiel/`,
            inLanguage: isFr ? "fr-FR" : "en-US",
            publisher: { "@type": "Organization", name: "MentivisOS", url: SITE_URL },
          }),
        }}
      />

      <ReferentielGrid
        lang={lang as Locale}
        articles={localized}
        allArticles={localizedAll}
        blocFilter={blocFilter}
        cibleFilter={cibleFilter}
        blocColors={BLOC_COLORS}
        blocLabels={BLOC_LABELS}
        blocFull={BLOC_FULL}
        cibleLabels={CIBLE_LABELS}
        cibleColors={CIBLE_COLORS}
      />
    </div>
  );
}
