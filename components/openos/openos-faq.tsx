"use client";

import { useState } from "react";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const FAQS = [
  {
    q: "C'est vraiment gratuit ? Pas de carte bancaire demandée ?",
    a: "Oui, gratuit pour toujours. Aucune carte bancaire n'est demandée, aucun essai limité dans le temps, aucune conversion forcée vers une offre payante. MentivisOS Open est conçu pour rester accessible à tous.",
  },
  {
    q: "Faut-il un diplôme ou un niveau minimum pour commencer ?",
    a: "Aucun prérequis. Que tu aies le bac, aucun diplôme, ou un doctorat, le parcours s'adapte à ton niveau dès les premières minutes. L'IA calibre le contenu en fonction de ce que tu sais déjà.",
  },
  {
    q: "Par où commencer si je ne sais pas ce que je veux apprendre ?",
    a: "Il suffit de décrire une envie, une question ou une situation. L'IA te propose un point de départ. Tu peux tester plusieurs domaines, changer de direction à tout moment, sans avoir à recommencer de zéro.",
  },
  {
    q: "Combien de temps faut-il y consacrer ?",
    a: "Aucune durée imposée. Certains progressent en dix minutes par jour, d'autres en sessions longues le week-end. La plateforme s'adapte à ton rythme, sans pression de complétion ni délai d'expiration.",
  },
  {
    q: "Mes données d'apprentissage sont-elles confidentielles ?",
    a: "Tes parcours, résultats et préférences restent privés. Ils ne sont ni revendus, ni partagés avec des employeurs ou des tiers. Ils servent uniquement à personnaliser ton expérience.",
  },
  {
    q: "Quelle est la différence avec la version professionnelle ?",
    a: "Open donne accès à l'ensemble des parcours d'apprentissage générés par IA. Les versions professionnelles ajoutent le pilotage collectif, le reporting RH, les intégrations SIRH, et le déploiement multi-sites pour les organisations.",
  },
];

export default function OpenOSFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 className="t-display" style={{ ...sectionAnim(visible, 0), fontSize: "clamp(24px, 3.5vw, 36px)", marginBottom: 48, lineHeight: 1.1, textAlign: "center" }}>
          Tout ce qu&apos;il faut savoir avant de commencer.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ ...sectionAnim(visible, 0.05 + i * 0.03), border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12, overflow: "hidden" }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "18px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#1a1a1a",
                  textAlign: "left",
                  lineHeight: 1.4,
                }}
              >
                <span>{faq.q}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ flexShrink: 0, transition: "transform 0.2s ease", transform: openIdx === i ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openIdx === i && (
                <div style={{ padding: "0 24px 18px" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6, color: "#4e4e4e", margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
