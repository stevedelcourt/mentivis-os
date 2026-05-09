import { Locale } from "@/lib/i18n";
import TarifsClient from "@/components/tarifs-client";

export const metadata = {
  title: "Tarifs — MentivisOS",
  description: "Des tarifs transparents pour les particuliers, les équipes et les entreprises. Essayez gratuitement.",
};

export default async function TarifsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <TarifsClient lang={lang as Locale} />;
}
