import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { Locale } from "@/lib/i18n";
import PrivacyClient from "./PrivacyClient";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "privacy",
    title: isFr ? "Politique de confidentialité - MentivisOS" : "Privacy Policy - MentivisOS",
    description: isFr
      ? "Politique de confidentialité de MentivisOS."
      : "Privacy policy of MentivisOS.",
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="privacy" />
      <PrivacyClient lang={lang as Locale} />
    </>
  );
}
