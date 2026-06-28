"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

const TESTIMONIALS = [
  {
    stat: "2x plus vite",
    quote: "J'avais arrêté d'apprendre depuis des années. En deux semaines, j'ai compris des notions qui me bloquaient depuis longtemps. Le parcours s'adapte vraiment à moi.",
    author: "Herbert, salarié en reconversion",
  },
  {
    stat: "3 mois",
    quote: "Je préparais mon orientation sans trop savoir par où commencer. Open m'a permis de tester trois domaines différents avant de faire mon choix.",
    author: "Chloé, lycéenne, Terminale",
  },
  {
    stat: "100% gratuit",
    quote: "Je suis retraitée et je voulais comprendre l'IA dont tout le monde parle. J'ai suivi un parcours complet, à mon rythme, sans rien payer.",
    author: "Geneviève, particulière, 63 ans",
  },
];

export default function OpenOSTestimonials() {
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#f8f8f8", padding: "var(--section-gap) 0" }}>
      <div className="container">
        <p style={{ ...sectionAnim(visible, 0), fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "0.14px", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 24 }}>
          ILS APPRENNENT AVEC OPEN
        </p>
        <h2 className="t-display" style={{ ...sectionAnim(visible, 0.05), fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 48, lineHeight: 1.1 }}>
          Rejoignez ceux qui apprennent à leur rythme, sans contrainte.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ ...sectionAnim(visible, 0.1 + i * 0.08), background: "#ffffff", borderRadius: 20, padding: "32px 28px", display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", background: "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 16 }}>
                {t.stat}
              </span>
              <blockquote style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "#1a1a1a", margin: "0 0 20px", flex: 1, fontStyle: "italic" }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#4e4e4e", margin: 0 }}>{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
