"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const TESTIMONIALS = {
  fr: [
    { quote: "LearningOS a transformé notre approche de la formation. Nous générons des parcours personnalisés en quelques minutes, et nos apprenants progressent deux fois plus vite.", stat: "2x", statLabel: "Progression", company: "CFA Partenaire" },
    { quote: "Le dashboard nous donne une visibilité sans précédent sur les compétences de nos équipes. Le reporting OPCO est désormais automatisé.", stat: "100%", statLabel: "Conformité", company: "Groupe de formation" },
    { quote: "Les agents IA accompagnent nos apprenants 24/7. Le taux de complétion des formations a augmenté de 40% en trois mois.", stat: "+40%", statLabel: "Complétion", company: "Campus d'entreprise" },
  ],
  en: [
    { quote: "LearningOS transformed our training approach. We generate personalized paths in minutes, and our learners progress twice as fast.", stat: "2x", statLabel: "Progression", company: "Partner CFA" },
    { quote: "The dashboard gives us unprecedented visibility into our teams' skills. OPCO reporting is now fully automated.", stat: "100%", statLabel: "Compliance", company: "Training Group" },
    { quote: "AI agents support our learners 24/7. Course completion rates increased by 40% in three months.", stat: "+40%", statLabel: "Completion", company: "Corporate Campus" },
  ],
};

export default function LearningOSTestimonials({ lang }: { lang: Locale }) {
  const testimonials = TESTIMONIALS[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(96px, 12vw, 160px) 0",
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p
          style={{
            ...sectionAnim(visible, 0),
            marginBottom: 12,
            color: "#777169",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontWeight: 500,
            fontSize: 11,
          }}
        >
          {lang === "fr" ? "ILS NOUS FONT CONFIANCE" : "TRUSTED BY"}
        </p>
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 48,
            maxWidth: 600,
          }}
        >
          {lang === "fr" ? "Rejoignez les équipes qui forment avec LearningOS." : "Join the teams training with LearningOS."}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
          className="learningos-testimonials-grid"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.08),
                background: "#fff",
                borderRadius: 22,
                padding: "32px 28px 28px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="learningos-testimonial-card"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 36, fontWeight: 300, color: "#0A0A0A", lineHeight: 1 }}>{t.stat}</span>
                <span style={{ fontSize: 13, color: "#777169" }}>{t.statLabel}</span>
              </div>
              <blockquote style={{ fontSize: 14, lineHeight: 1.6, color: "#4e4e4e", margin: "0 0 auto 0", fontStyle: "normal" }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p style={{ fontSize: 13, color: "#A8A39A", marginTop: 20, margin: "20px 0 0" }}>{t.company}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .learningos-testimonial-card:hover {
          transform: translateY(-4px);
        }
        @media (max-width: 1024px) {
          .learningos-testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
