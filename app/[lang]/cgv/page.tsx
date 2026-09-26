import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import CgvClient from "./CgvClient";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const title = isFr ? "Conditions générales de vente" : "Terms of Sale";
  const description = isFr
    ? "Conditions générales de vente de MentivisOS."
    : "Terms of sale of MentivisOS.";
  return pageMeta(lang as Locale, "/cgv", { title, description });
}

export default async function CgvPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <CgvClient lang={lang as Locale} />;
}
