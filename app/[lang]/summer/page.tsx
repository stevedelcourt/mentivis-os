import type { Metadata } from "next";
import SummerPage from "@/components/summer/summer-page";

export const metadata: Metadata = {
  title: "Offre Été 2026 — MentivisOS",
  description: "50% sur le déploiement, 3 mois offerts. Pour les organismes de formation et les entreprises. Jusqu'au 31 août 2026.",
  robots: { index: false },
};

export default async function SummerRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <SummerPage lang={lang} />;
}
