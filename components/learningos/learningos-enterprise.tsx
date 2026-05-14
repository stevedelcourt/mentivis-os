"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const GRADIENTS = [
  `radial-gradient(ellipse 50% 60% at 15% 30%, rgba(180,160,220,0.25) 0%, transparent 60%), linear-gradient(135deg, #f8f4fc 0%, #eae4f4 100%)`,
  `radial-gradient(ellipse 45% 55% at 80% 20%, rgba(160,200,180,0.25) 0%, transparent 55%), linear-gradient(135deg, #f0f8f4 0%, #e0ece4 100%)`,
  `radial-gradient(ellipse 50% 50% at 70% 80%, rgba(230,200,170,0.25) 0%, transparent 55%), linear-gradient(135deg, #fcf4ec 0%, #f0e4d8 100%)`,
  `radial-gradient(ellipse 45% 50% at 25% 80%, rgba(160,200,240,0.2) 0%, transparent 55%), linear-gradient(135deg, #f0f6fc 0%, #dce8f4 100%)`,
  `radial-gradient(ellipse 40% 50% at 85% 50%, rgba(230,180,200,0.25) 0%, transparent 55%), linear-gradient(135deg, #fcf0f4 0%, #f0dce8 100%)`,
  `radial-gradient(ellipse 45% 45% at 30% 90%, rgba(170,220,200,0.25) 0%, transparent 55%), linear-gradient(135deg, #ecf8f0 0%, #dcece4 100%)`,
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
          {items.map((item, i) => (
            <div
              key={item.label}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.05),
                background: GRADIENTS[i % GRADIENTS.length],
                borderRadius: 18,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                aspectRatio: "2.2/1",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="learningos-enterprise-card"
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: "#000" }}>{item.label}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.45, color: "#4e4e4e", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
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
