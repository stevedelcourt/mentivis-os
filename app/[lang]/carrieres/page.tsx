import type { Metadata } from "next";
import { Locale, getT } from "@/lib/i18n";
import CareersPageClient from "@/components/careers-page-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getT(lang as Locale);
  return {
    title: t.careers.meta.title,
    description: t.careers.meta.description,
  };
}

export default async function CareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getT(lang as Locale);
  return (
    <>
      <CareersPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.careers.meta.title,
            description: t.careers.meta.description,
            url: `https://sc4bovu7233.universe.wf/${lang}/carrieres`,
          }),
        }}
      />
    </>
  );
}
