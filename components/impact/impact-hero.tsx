"use client";

import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { useRef, useState, useEffect } from "react";

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const sectionAnim = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(24px)",
  transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
});

const CONTENT = {
  fr: {
    eyebrow: "PROGRAMME IMPACT",
    headline: "MentivisOS avec l'Institut Collectif de l'IA, ICIA",
    chapeau: [
      "Personne n'a demandé à vivre cette transition. Elle s'est imposée, vite, à tout le monde en même temps, sans manuel d'utilisation. Ceux qui la vivent le mieux ne sont pas nécessairement les plus diplômés ni les plus technophiles. Ce sont ceux qui ont eu la chance d'être accompagnés.",
      "L'IA ne va pas supprimer votre poste du jour au lendemain. Mais elle va transformer ce qu'on attend de vous, les compétences qui comptent, et les écarts entre ceux qui savent s'en servir et ceux qui ne le savent pas encore. Ces écarts se creusent déjà, et ils sont mesurables.",
      "C'est précisément pour cela que l'ICIA existe, et que Mentivis en est l'opérateur pédagogique.",
    ],
  },
  en: {
    eyebrow: "IMPACT PROGRAM",
    headline: "MentivisOS with the Institut Collectif de l'IA, ICIA",
    chapeau: [
      "No one asked to live through this transition. It was imposed, fast, on everyone at once, with no instruction manual. Those who are coping best are not necessarily the most educated or the most tech-savvy. They are the ones who had the chance to be supported.",
      "AI will not eliminate your job overnight. But it will transform what is expected of you, the skills that matter, and the gaps between those who know how to use it and those who do not yet know. These gaps are already widening, and they are measurable.",
      "This is precisely why ICIA exists, and why Mentivis is its pedagogical operator.",
    ],
  },
};

export default function ImpactHero({ lang }: { lang: Locale }) {
  const c = CONTENT[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.01);

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(96px, 12vw, 160px) 0 clamp(64px, 8vw, 96px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          {/* Left: text */}
          <div>
            <p
              style={{
                ...sectionAnim(visible, 0),
                marginBottom: 24,
                color: "#4e4e4e",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              {c.eyebrow}
            </p>
            <h1
              style={{
                ...sectionAnim(visible, 0.1),
                marginBottom: 40,
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                fontSize: "clamp(28px, 4vw, 48px)",
              }}
            >
              {c.headline}
            </h1>
            {c.chapeau.map((p, i) => (
              <p
                key={i}
                style={{
                  ...sectionAnim(visible, 0.2 + i * 0.1),
                  marginBottom: 20,
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "#4e4e4e",
                  maxWidth: 540,
                }}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Right: image */}
          <div
            style={{
              ...sectionAnim(visible, 0.3),
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              aspectRatio: "4/3",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            }}
          >
            <Image
              src="/images/impact.avif"
              alt="Programme Impact"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
