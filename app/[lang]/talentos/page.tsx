import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import TalentOSPageClient from "@/components/talentos/talentos-page-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "TalentOS - Recrutement IA" : "TalentOS - AI recruitment",
    description: isFr
      ? "Le système de recrutement IA qui transforme votre sourcing en embauches qualifiées."
      : "The AI recruitment system that turns your sourcing into qualified hires.",
  };
}

export default async function TalentOSPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <TalentOSPageClient lang={lang as Locale} />;
}
