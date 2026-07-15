import type { Metadata } from "next";
import BeachTourPageClient from "@/components/beach-tour/beach-tour-page-client";

export const metadata: Metadata = {
  title: "Beach Tour — MentivisOS Open",
  description: "Invitez 10 amis et débloquez 1 mois de formation illimitée sur MentivisOS Open. Été 2026.",
  robots: { index: false },
};

export default async function BeachTourPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <BeachTourPageClient lang={lang} />;
}
