import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { Locale } from "@/lib/i18n";
import LegalClient from "./LegalClient";
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
    path: "legal",
    title: isFr ? "Mentions légales - MentivisOS" : "Legal Notice - MentivisOS",
    description: isFr
      ? "Mentions légales du site MentivisOS."
      : "Legal notice of the MentivisOS website.",
  });
}

export default async function LegalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="legal" />
      <LegalClient lang={lang as Locale} />
    </>
  );
}
