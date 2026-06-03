import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import VisualIntelligenceModule from "@/components/visual-intelligence-module";

export const metadata: Metadata = {
  title: "Module Visuel - MentivisOS",
  description: "Le module visuel MentivisOS rend les données de compétences exploitables grâce à des visualisations interactives.",
};

export default async function VisualModulePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return <VisualIntelligenceModule lang={locale} />;
}
