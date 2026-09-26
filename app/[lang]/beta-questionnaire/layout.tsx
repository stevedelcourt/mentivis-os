import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const title = isFr ? "Questionnaire Beta - MentivisOS" : "Beta Survey - MentivisOS";
  const description = isFr
    ? "Participez au programme beta MentivisOS et façonnez le futur de la formation."
    : "Join the MentivisOS beta program and shape the future of training.";
  return pageMeta(lang as Locale, "/beta-questionnaire", { title, description });
}

export default function BetaQuestionnaireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
