import { Locale } from "@/lib/i18n";
import AmbassadorsPageClient from "@/components/ambassadors-page-client";

export default async function AmbassadorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <AmbassadorsPageClient locale={lang as Locale} />;
}
