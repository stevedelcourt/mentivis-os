import { Locale } from "@/lib/i18n";
import VisualIntelligenceModule from "@/components/visual-intelligence-module";

export default async function VisualModulePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return <VisualIntelligenceModule lang={locale} />;
}
