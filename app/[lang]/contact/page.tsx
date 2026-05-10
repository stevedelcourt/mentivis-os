import { Locale } from "@/lib/i18n";
import ContactForm from "@/components/contact-form";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <ContactForm lang={lang as Locale} mode="contact" />;
}
