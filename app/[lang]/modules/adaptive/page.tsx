import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { Locale } from "@/lib/i18n";
import AdaptiveIntelligenceModule from "@/components/adaptive-intelligence-module";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "modules/adaptive",
    title: isFr ? "Module Adaptatif - MentivisOS" : "Adaptive Module - MentivisOS",
    description: isFr
      ? "Le module adaptatif MentivisOS ajuste les parcours en temps réel selon le profil et la progression de chaque apprenant."
      : "The MentivisOS adaptive module adjusts learning paths in real time to each learner's profile and progress.",
  });
}

export default async function AdaptiveModulePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="modules/adaptive" />
      <AdaptiveIntelligenceModule lang={locale} />
    </>
  );
}
