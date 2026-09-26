import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import SummerPage from "@/components/summer/summer-page";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "summer",
    title: isFr
      ? "Offre Été 2026 MentivisOS | 50 % sur le déploiement + 3 mois offerts"
      : "MentivisOS Summer 2026 offer | 50% off deployment + 3 months free",
    description: isFr
      ? "Jusqu'au 30 septembre 2026, déployez MentivisOS dans votre organisme ou votre entreprise avec 50 % de réduction et 3 mois de licences offertes pour tous vos collaborateurs."
      : "Until 30 September 2026, deploy MentivisOS in your organisation with 50% off deployment and 3 months of free licences for all your staff.",
    ogImage: "/images/og/page-summer.jpg",
    noindex: true,
  });
}

export default async function SummerRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="summer" />
      <SummerPage lang={lang} />
    </>
  );
}
