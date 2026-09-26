import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import VisualIntelligenceModule from "@/components/visual-intelligence-module";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = "Module Visuel - MentivisOS";
  const description = "Le module visuel MentivisOS rend les données de compétences exploitables grâce à des visualisations interactives.";
  return pageMeta(lang as Locale, "/modules/visual", { title, description });
}

export default async function VisualModulePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return <VisualIntelligenceModule lang={locale} />;
}
