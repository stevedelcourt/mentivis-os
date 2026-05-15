import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import LearningOSPageClient from "@/components/learningos/learningos-page-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "LearningOS - Formation native IA" : "LearningOS - AI-native training",
    description: isFr
      ? "Le système de formation native IA qui transforme vos collaborateurs en talents."
      : "The AI-native training system that turns your employees into talents.",
  };
}

export default async function LearningOSPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LearningOSPageClient lang={lang as Locale} />;
}
