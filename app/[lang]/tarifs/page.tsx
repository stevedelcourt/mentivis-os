import { Locale } from "@/lib/i18n";
import TarifsClient from "@/components/tarifs-client";
import { getSeo } from "@/lib/cms/db";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Record<string, unknown>> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Pricing - MentivisOS" : "Tarifs - MentivisOS",
    description: lang === "en"
      ? "Transparent pricing for individuals, teams, and enterprises. Start free."
      : "Des tarifs transparents pour les particuliers, les équipes et les entreprises. Essayez gratuitement.",
  };
}

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
