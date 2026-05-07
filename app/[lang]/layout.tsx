import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import NavBar from "@/components/nav-bar";
import FooterBlock from "@/components/footer-block";

export function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Metadata {
  return { title: "MentivisOS" };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <>
      <NavBar lang={lang} />
      <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
      <FooterBlock lang={lang} />
    </>
  );
}
