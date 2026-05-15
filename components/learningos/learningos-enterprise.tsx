"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const GRADIENTS = [
  `radial-gradient(ellipse 55% 48% at 12% 90%, rgba(196,108,42,0.88) 0%, rgba(155,75,28,0.42) 38%, transparent 62%), radial-gradient(ellipse 38% 32% at 30% 60%, rgba(145,68,118,0.38) 0%, transparent 55%), radial-gradient(ellipse 45% 38% at 68% 28%, rgba(18,48,72,0.5) 0%, transparent 58%), linear-gradient(148deg, #1a3042 0%, #152535 55%, #0e1f30 100%)`,
  `radial-gradient(ellipse 58% 52% at 80% 80%, rgba(218,42,52,0.94) 0%, rgba(178,28,38,0.6) 32%, transparent 62%), radial-gradient(ellipse 32% 28% at 65% 62%, rgba(235,82,38,0.22) 0%, transparent 48%), radial-gradient(ellipse 30% 25% at 45% 45%, rgba(12,18,45,0.4) 0%, transparent 60%), linear-gradient(138deg, #07102c 0%, #090e2e 100%)`,
  `radial-gradient(ellipse 18% 55% at -2% 8%, rgba(115,22,182,0.88) 0%, transparent 52%), radial-gradient(ellipse 15% 35% at 0% 72%, rgba(18,135,78,0.78) 0%, transparent 48%), radial-gradient(ellipse 22% 25% at 5% 40%, rgba(18,88,185,0.5) 0%, transparent 45%), radial-gradient(ellipse 72% 62% at 58% 42%, rgba(238,112,28,0.92) 0%, transparent 62%), radial-gradient(ellipse 52% 55% at 78% 72%, rgba(205,55,38,0.88) 0%, transparent 56%), radial-gradient(ellipse 42% 35% at 85% 18%, rgba(225,158,18,0.72) 0%, transparent 52%), linear-gradient(138deg, #cf6228 0%, #c03228 100%)`,
  `radial-gradient(ellipse 55% 52% at 12% 18%, rgba(115,18,175,0.88) 0%, transparent 58%), radial-gradient(ellipse 52% 56% at 78% 52%, rgba(232,48,108,0.9) 0%, transparent 56%), radial-gradient(ellipse 46% 42% at 52% 92%, rgba(222,88,58,0.78) 0%, transparent 52%), radial-gradient(ellipse 28% 28% at 92% 8%, rgba(85,15,142,0.62) 0%, transparent 48%), linear-gradient(138deg, #6e12b2 0%, #c23272 100%)`,
  `radial-gradient(ellipse 28% 24% at 64% 30%, rgba(75,145,255,0.7) 0%, transparent 52%), radial-gradient(ellipse 22% 20% at 30% 58%, rgba(35,208,118,0.54) 0%, transparent 50%), radial-gradient(ellipse 20% 18% at 82% 70%, rgba(55,80,208,0.64) 0%, transparent 48%), radial-gradient(ellipse 26% 22% at 16% 24%, rgba(0,162,220,0.42) 0%, transparent 50%), linear-gradient(138deg, #161c30 0%, #121828 100%)`,
  `radial-gradient(ellipse 58% 52% at 88% 18%, rgba(38,52,218,0.92) 0%, transparent 58%), radial-gradient(ellipse 55% 58% at 38% 62%, rgba(118,38,202,0.88) 0%, transparent 56%), radial-gradient(ellipse 46% 42% at 12% 88%, rgba(202,48,152,0.78) 0%, transparent 52%), linear-gradient(138deg, #2232b8 0%, #6e1e9e 100%)`,
];

const ITEMS = {
  fr: [
    { label: "RGPD", desc: "Conformité au Règlement Général sur la Protection des Données." },
    { label: "SOC 2", desc: "Certification SOC 2 Type II pour la sécurité des données." },
    { label: "SSO / SAML", desc: "Authentification unique via votre fournisseur d'identité." },
    { label: "Chiffrement", desc: "Données chiffrées au repos et en transit (AES-256 / TLS 1.3)." },
    { label: "Journaux d'audit", desc: "Traçabilité complète de toutes les actions et accès." },
    { label: "SLA", desc: "Engagement de disponibilité et support prioritaire." },
  ],
  en: [
    { label: "GDPR", desc: "Compliance with the General Data Protection Regulation." },
    { label: "SOC 2", desc: "SOC 2 Type II certification for data security." },
    { label: "SSO / SAML", desc: "Single sign-on through your identity provider." },
    { label: "Encryption", desc: "Data encrypted at rest and in transit (AES-256 / TLS 1.3)." },
    { label: "Audit Logs", desc: "Complete traceability of all actions and accesses." },
    { label: "SLA", desc: "Availability commitment and priority support." },
  ],
};

export default function LearningOSEnterprise({ lang }: { lang: Locale }) {
  const items = ITEMS[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
            color: "#4e4e4e",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontWeight: 500,
            fontSize: 11,
          }}
        >
          Sécurité & Infrastructure
        </p>
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 48,
            maxWidth: 700,
          }}
        >
          {lang === "fr" ? "Une infrastructure de niveau entreprise." : "Enterprise-grade infrastructure."}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
          className="learningos-enterprise-grid"
        >
          {items.map((item, i) => {
             const isHovered = hoveredIndex === i;
             return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.05),
                background: isHovered ? GRADIENTS[i % GRADIENTS.length] : "#f8f8f8",
                borderRadius: 18,
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                aspectRatio: "2.2/1",
                transition: "background 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="learningos-enterprise-card"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  alignSelf: "flex-start",
                  background: isHovered ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
                  backdropFilter: isHovered ? "blur(6px)" : "none",
                  border: isHovered ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 10,
                  padding: "6px 12px 6px 10px",
                  color: isHovered ? "#fff" : "#000",
                  transition: "background 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 130 130" fill="none">
                  <rect x="20" y="20" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="20" width="10" height="10" fill="currentColor"/>
                  <rect x="20" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="40" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="20" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="40" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="20" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="40" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="20" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="100" width="10" height="10" fill="currentColor"/>
                </svg>
                <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>
                  {item.label}
                </span>
              </div>
              <p style={{
                fontSize: 13,
                lineHeight: 1.45,
                color: isHovered ? "rgba(255,255,255,0.75)" : "#4e4e4e",
                margin: 0,
                textAlign: "left",
                transition: "color 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}>
                {item.desc}
              </p>
            </div>
             );
          })}
        </div>
      </div>

      <style>{`
        .learningos-enterprise-card:hover {
          transform: translateY(-4px);
        }
        @media (max-width: 1024px) {
          .learningos-enterprise-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .learningos-enterprise-grid {
            grid-template-columns: 1fr !important;
          }
          .learningos-enterprise-card {
            aspect-ratio: 3/1 !important;
          }
        }
      `}</style>
    </section>
  );
}
