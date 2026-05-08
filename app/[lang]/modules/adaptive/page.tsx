import { Locale } from "@/lib/i18n";
import AdaptiveIntelligenceModule from "@/components/adaptive-intelligence-module";

export default async function AdaptiveModulePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return <AdaptiveIntelligenceModule lang={locale} />;
}
