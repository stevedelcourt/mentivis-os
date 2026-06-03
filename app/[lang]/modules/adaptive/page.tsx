import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import AdaptiveIntelligenceModule from "@/components/adaptive-intelligence-module";

export const metadata: Metadata = {
  title: "Module Adaptatif - MentivisOS",
  description: "Le module adaptatif MentivisOS ajuste les parcours en temps réel selon le profil et la progression de chaque apprenant.",
};

export default async function AdaptiveModulePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return <AdaptiveIntelligenceModule lang={locale} />;
}
