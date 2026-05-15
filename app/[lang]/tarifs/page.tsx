import { Locale } from "@/lib/i18n";
import TarifsClient from "@/components/tarifs-client";
import { getSeo } from "@/lib/cms/db";

export const metadata = {
  title: "Tarifs - MentivisOS",
  description: "Des tarifs transparents pour les particuliers, les équipes et les entreprises. Essayez gratuitement.",
};

export default async function TarifsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = await getSeo();
  const tarifsSeo = seo[lang as "fr" | "en"]?.tarifs;

  return (
    <>
      <TarifsClient lang={lang as Locale} />
      {tarifsSeo?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tarifsSeo.jsonLd) }}
        />
      )}
    </>
  );
}
