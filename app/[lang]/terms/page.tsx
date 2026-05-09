import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import TermsClient from "./TermsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Conditions générales d'utilisation" : "Terms of Use",
    description: isFr
      ? "Conditions générales d'utilisation de MentivisOS."
      : "Terms of use of MentivisOS.",
  };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <TermsClient lang={lang as Locale} />;
}
