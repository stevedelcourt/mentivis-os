import { Locale } from "@/lib/i18n";
import ContactClient from "@/components/contact-client";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <ContactClient lang={lang as Locale} />;
}
