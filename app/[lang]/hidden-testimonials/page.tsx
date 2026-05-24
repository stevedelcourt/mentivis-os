import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Témoignages — MentivisOS" : "Testimonials — MentivisOS",
    robots: { index: false, follow: false },
  };
}

export default async function HiddenTestimonialsPage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <main style={{ background: "#ffffff", minHeight: "100vh" }} />
  );
}
