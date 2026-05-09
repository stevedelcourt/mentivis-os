import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import CgvClient from "./CgvClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Conditions générales de vente" : "Terms of Sale",
    description: isFr
      ? "Conditions générales de vente de MentivisOS."
      : "Terms of sale of MentivisOS.",
  };
}

export default async function CgvPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <CgvClient lang={lang as Locale} />;
}
