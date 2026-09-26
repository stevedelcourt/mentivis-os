import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { SITE_URL } from "@/lib/site-url";
import { Locale, getT } from "@/lib/i18n";
import CareersPageClient from "@/components/careers-page-client";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getT(lang as Locale);
  return pageMetadata({
    lang,
    path: "carrieres",
    title: t.careers.meta.title,
    description: t.careers.meta.description,
  });
}

export default async function CareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getT(lang as Locale);
  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="carrieres" />
      <CareersPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.careers.meta.title,
            description: t.careers.meta.description,
            url: `${SITE_URL}/${lang}/carrieres`,
          }),
        }}
      />
    </>
  );
}
