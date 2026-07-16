import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import SummerPage from "@/components/summer/summer-page";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return {
    title: "Offre \u00C9t\u00E9 2026 MentivisOS | 50% sur le d\u00E9ploiement + 3 mois offerts",
    description: "Jusqu'au 31 ao\u00FBt 2026, d\u00E9ployez MentivisOS dans votre organisme ou votre entreprise avec 50% de r\u00E9duction et 3 mois de licences offertes pour tous vos collaborateurs.",
    robots: { index: false },
    openGraph: {
      title: "Offre \u00C9t\u00E9 2026 MentivisOS",
      description: "50% sur le d\u00E9ploiement + 3 mois de licences offerts pour tous vos collaborateurs.",
      images: [{ url: `${SITE_URL}/images/og-summer-2026.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function SummerRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <SummerPage lang={lang} />;
}
