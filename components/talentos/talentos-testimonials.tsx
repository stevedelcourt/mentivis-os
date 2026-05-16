"use client";

import { getT, Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const TESTIMONIALS = {
  fr: [
    { quote: "TalentOS a réduit notre time-to-hire de 40%. Le matching IA nous propose des profils pertinents en quelques secondes.", stat: "-40%", statLabel: "Time-to-hire", company: "Cabinet de recrutement" },
    { quote: "Les tests techniques intégrés nous permettent d'évaluer les compétences réelles avant même le premier entretien.", stat: "3x", statLabel: "Qualité présélection", company: "Direction RH, Groupe industriel" },
    { quote: "Le pipeline visuel et les workflows de décision ont simplifié nos recrutements multi-recruiters complexes.", stat: "+60%", statLabel: "Efficacité recrutement", company: "CFA national" },
  ],
  en: [
    { quote: "TalentOS reduced our time-to-hire by 40%. AI matching suggests relevant profiles in seconds.", stat: "-40%", statLabel: "Time-to-hire", company: "Recruitment firm" },
    { quote: "Integrated technical tests let us assess real skills before the first interview.", stat: "3x", statLabel: "Screening quality", company: "HR Director, Industrial Group" },
    { quote: "The visual pipeline and decision workflows simplified our complex multi-recruiter hiring.", stat: "+60%", statLabel: "Hiring efficiency", company: "National CFA" },
  ],
};

export default function TalentOSTestimonials({ lang }: { lang: Locale }) {
  const testimonials = TESTIMONIALS[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);
  const t = getT(lang);

  return (
    <section ref={ref} style={{ background: "#f5f5f5", padding: "clamp(96px, 12vw, 160px) 0" }}>
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#4e4e4e", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          {t.talentosPage.testimonials.eyebrow}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 600 }}>
          {t.talentosPage.testimonials.title}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="talentos-testimonials-grid">
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
              className="talentos-testimonial-card"
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 36, fontWeight: 300, color: "#0A0A0A", lineHeight: 1 }}>{t.stat}</span>
                <span style={{ fontSize: 13, color: "#4e4e4e" }}>{t.statLabel}</span>
              </div>
              <blockquote style={{ fontSize: 14, lineHeight: 1.6, color: "#4e4e4e", margin: "0 0 auto 0", fontStyle: "normal" }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p style={{ fontSize: 13, color: "#777777", margin: "20px 0 0" }}>{t.company}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .talentos-testimonial-card:hover { transform: translateY(-4px); }
        @media (max-width: 1024px) { .talentos-testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
