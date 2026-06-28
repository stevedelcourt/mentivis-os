"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const STEPS = [
  { num: "1", title: "Définir", desc: "Compétences visées, métiers, référentiels internes." },
  { num: "2", title: "Générer", desc: "Parcours personnalisés avec objectifs et modules." },
  { num: "3", title: "Former", desc: "Agents IA accompagnent chaque apprenant." },
  { num: "4", title: "Évaluer", desc: "Quiz, mises en situation, validation des acquis." },
  { num: "5", title: "Certifier", desc: "Certifications et badges de compétences." },
  { num: "6", title: "Analyser", desc: "Dashboard, reporting, conformité OPCO." },
];

export default function OpenOSWorkflow({ lang }: { lang: Locale }) {
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        <p style={{ ...sectionAnim(visible, 0), fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "0.14px", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 24 }}>
          PARCOURS COMPLET
        </p>
        <h2 className="t-display" style={{ ...sectionAnim(visible, 0.05), fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 48, lineHeight: 1.1 }}>
          Du référentiel à la certification, un seul flux.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ ...sectionAnim(visible, 0.1 + i * 0.05), background: "#f8f8f8", borderRadius: 16, padding: "28px 24px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 300, color: "#7030A0", display: "block", marginBottom: 8 }}>{step.num}</span>
              <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1a1a1a" }}>{step.title}</h3>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5, color: "#4e4e4e", margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
