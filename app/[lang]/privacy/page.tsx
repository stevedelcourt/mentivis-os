import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import PrivacyClient from "./PrivacyClient";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const title = isFr ? "Politique de confidentialité" : "Privacy Policy";
  const description = isFr
    ? "Politique de confidentialité de MentivisOS."
    : "Privacy policy of MentivisOS.";
  return pageMeta(lang as Locale, "/privacy", { title, description });
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <PrivacyClient lang={lang as Locale} />;
}
