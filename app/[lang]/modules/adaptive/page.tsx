import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import AdaptiveIntelligenceModule from "@/components/adaptive-intelligence-module";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = "Module Adaptatif - MentivisOS";
  const description = "Le module adaptatif MentivisOS ajuste les parcours en temps réel selon le profil et la progression de chaque apprenant.";
  return pageMeta(lang as Locale, "/modules/adaptive", { title, description });
}

export default async function AdaptiveModulePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return <AdaptiveIntelligenceModule lang={locale} />;
}
