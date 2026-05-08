import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import NavBar from "@/components/nav-bar";
import FooterBlock from "@/components/footer-block";
import CookieConsentDeferred from "@/components/cookie-consent-deferred";

export function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Metadata {
  return { title: "MentivisOS" };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <NavBar lang={lang as Locale} />
      <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
      <FooterBlock lang={lang as Locale} />
      <CookieConsentDeferred lang={lang} />
    </>
  );
}
