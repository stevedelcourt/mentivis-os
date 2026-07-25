"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

const TESTIMONIALS_FR = [
  {
    quote: "J'ai indiqué que je voulais apprendre le marketing digital. En 30 secondes j'avais un parcours complet de 12 modules. Bluffant.",
    author: "Clara M., salariée en reconversion",
  },
  {
    quote: "Je prépare un concours. MentivisOS Open a généré exactement les révisions dont j'avais besoin, dans le bon ordre.",
    author: "Alexandre K., étudiant",
  },
  {
    quote: "Gratuit et plus pertinent que les MOOCs que j'avais payés. Je ne comprends pas comment c'est possible.",
    author: "Sophie L., cadre en activité",
  },
];

const TESTIMONIALS_EN = [
  {
    quote: "I said I wanted to learn digital marketing. In 30 seconds I had a complete 12-module path. Mind-blowing.",
    author: "Clara M., career changer",
  },
  {
    quote: "I'm preparing for an exam. MentivisOS Open generated exactly the revision I needed, in the right order.",
    author: "Alexandre K., student",
  },
  {
    quote: "Free and more relevant than the MOOCs I had paid for. I don't understand how this is possible.",
    author: "Sophie L., working professional",
  },
];

export default function OpenOSTestimonials({ lang }: { lang: string }) {
  const testimonials = lang === "fr" ? TESTIMONIALS_FR : TESTIMONIALS_EN;
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#f8f8f8", padding: "var(--section-gap) 0" }}>
      <div className="container">
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 44px)",
            marginBottom: 48,
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {lang === "fr" ? "Ils ont déjà commencé." : "They've already started."}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.08),
                background: "#ffffff",
                borderRadius: 20,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <blockquote
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "#1a1a1a",
                  margin: "0 0 20px",
                  flex: 1,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p style={{ fontSize: 13, color: "#4e4e4e", margin: 0 }}>{t.author}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
