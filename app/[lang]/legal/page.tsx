import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import LegalClient from "./LegalClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Mentions légales" : "Legal Notice",
    description: isFr
      ? "Mentions légales du site MentivisOS."
      : "Legal notice of the MentivisOS website.",
  };
}

export default async function LegalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalClient lang={lang as Locale} />;
}
