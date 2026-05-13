import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import SecurityPageClient from "@/components/security-page-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Securite — MentivisOS" : "Security — MentivisOS",
    description: isFr
      ? "L'IA pedagogique concue pour transformer la formation, guidee par la responsabilite et des protections qui garantissent la confidentialite des donnees."
      : "AI-powered pedagogy built to transform training, guided by responsibility and protections that guarantee data confidentiality.",
  };
}

export default async function SecurityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <SecurityPageClient lang={lang as Locale} />;
}
