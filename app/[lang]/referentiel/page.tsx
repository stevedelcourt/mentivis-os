import { Suspense } from "react";
import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getReferentielArticles } from "@/lib/cms/db";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { PILIERS } from "@/lib/cms/referentiel-clusters";
import { BLOC_COLORS, BLOC_FULL, BLOC_LABELS, CIBLE_COLORS, CIBLE_LABELS } from "@/lib/referentiel-labels";
import JsonLd from "@/components/seo/json-ld";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";
import { ReferentielGrid } from "./referentiel-grid";

async function listedArticles() {
  // Les articles sans contenu ne sont ni listés ni indexés.
  return (await getReferentielArticles()).filter((a) => a.content && a.content.trim());
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const count = (await listedArticles()).filter((a) => a.bloc !== "PILIER").length;
  return pageMetadata({
    lang,
    path: "referentiel",
    title: isFr
      ? "Le Référentiel - Guides IA, formation et compétences | MentivisOS"
      : "The Reference - AI, Training & Skills Guides | MentivisOS",
    description: isFr
      ? `4 piliers et ${count} articles de référence sur l'IA dans la formation en entreprise, la mesure des compétences, l'apprentissage adaptatif et la conformité AI Act.`
      : `4 pillars and ${count} reference articles on AI in corporate training, skills measurement, adaptive learning and AI Act compliance.`,
    ogImage: "/images/OG-image.jpg",
  });
}

export default async function ReferentielPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const pick = (v: { fr: string; en: string }) => (isFr ? v.fr : v.en);

  const articles = (await listedArticles()).map((a) => (isFr ? a : {
    ...a,
    title: a.titleEn || a.title,
    content: a.contentEn || a.content,
    chapeau: a.chapeauEn || a.chapeau,
  }));
  const piliers = PILIERS.map((s) => articles.find((a) => a.slug === s)).filter((a) => a !== undefined);
  const others = articles.filter((a) => a.bloc !== "PILIER");

  const mapLabels = (m: Record<string, { fr: string; en: string }>) =>
    Object.fromEntries(Object.entries(m).map(([k, v]) => [k, pick(v)]));

  const intro = isFr
    ? `4 piliers et ${others.length} articles factuels sur l'IA dans la formation, la mesure des compétences, l'apprentissage adaptatif et la conformité.`
    : `4 pillars and ${others.length} factual articles on AI in training, skills measurement, adaptive learning and compliance.`;

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
            {intro}
          </p>
        </div>
      </header>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: isFr ? "Le Référentiel - MentivisOS" : "The Reference - MentivisOS",
          description: intro,
          url: `${SITE_URL}/${lang}/referentiel/`,
          inLanguage: isFr ? "fr-FR" : "en-GB",
          publisher: { "@id": `${SITE_URL}/#organization` },
          hasPart: piliers.map((a) => ({
            "@type": "WebPage",
            "@id": `${SITE_URL}/${lang}/referentiel/${a.slug}/`,
            name: a.title,
          })),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: articles.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/${lang}/referentiel/${a.slug}/`,
              name: a.title,
            })),
          },
        }}
      />
      <BreadcrumbJsonLd lang={lang} path="referentiel" />

      <Suspense fallback={null}>
        <ReferentielGrid
          lang={lang as Locale}
          piliers={piliers}
          articles={others}
          blocColors={BLOC_COLORS}
          blocLabels={mapLabels(BLOC_LABELS)}
          blocFull={mapLabels(BLOC_FULL)}
          cibleLabels={mapLabels(CIBLE_LABELS)}
          cibleColors={CIBLE_COLORS}
        />
      </Suspense>
    </div>
  );
}
