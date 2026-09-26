import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { Locale } from "@/lib/i18n";
import VisualIntelligenceModule from "@/components/visual-intelligence-module";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "modules/visual",
    title: isFr ? "Module Visuel - MentivisOS" : "Visual Module - MentivisOS",
    description: isFr
      ? "Le module visuel MentivisOS rend les données de compétences exploitables grâce à des visualisations interactives."
      : "The MentivisOS visual module makes skills data actionable through interactive visualisations.",
  });
}

export default async function VisualModulePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="modules/visual" />
      <VisualIntelligenceModule lang={locale} />
    </>
  );
}
