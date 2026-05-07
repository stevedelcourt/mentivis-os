import { Locale } from "@/lib/i18n";
import DemoClient from "@/components/demo-client";

export default async function DemoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <DemoClient lang={lang as Locale} />;
}
