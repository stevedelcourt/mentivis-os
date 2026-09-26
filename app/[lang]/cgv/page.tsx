import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { Locale } from "@/lib/i18n";
import CgvClient from "./CgvClient";
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
    path: "cgv",
    title: isFr ? "Conditions générales de vente - MentivisOS" : "Terms of Sale - MentivisOS",
    description: isFr
      ? "Conditions générales de vente de MentivisOS."
      : "Terms of sale of MentivisOS.",
  });
}

export default async function CgvPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="cgv" />
      <CgvClient lang={lang as Locale} />
    </>
  );
}
