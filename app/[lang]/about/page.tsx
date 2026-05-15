import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import AboutPageClient from "@/components/about-page-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "A propos - MentivisOS" : "About - MentivisOS",
    description: isFr
      ? "MentivisOS est le systeme de formation native IA concu par Mentivis pour former, certifier et faire grandir les talents."
      : "MentivisOS is the AI-native training system built by Mentivis to train, certify and grow talent.",
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <AboutPageClient lang={lang as Locale} />;
}
