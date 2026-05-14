"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const ITEMS = {
  fr: [
    { label: "RGPD", desc: "Conformité au Règlement Général sur la Protection des Données.", icon: "🔒" },
    { label: "SOC 2", desc: "Certification SOC 2 Type II pour la sécurité des données.", icon: "🛡️" },
    { label: "SSO / SAML", desc: "Authentification unique via votre fournisseur d'identité.", icon: "🔑" },
    { label: "Chiffrement", desc: "Données chiffrées au repos et en transit (AES-256 / TLS 1.3).", icon: "🔐" },
    { label: "Journaux d'audit", desc: "Traçabilité complète de toutes les actions et accès.", icon: "📋" },
    { label: "SLA", desc: "Engagement de disponibilité et support prioritaire.", icon: "⏱️" },
  ],
  en: [
    { label: "GDPR", desc: "Compliance with the General Data Protection Regulation.", icon: "🔒" },
    { label: "SOC 2", desc: "SOC 2 Type II certification for data security.", icon: "🛡️" },
    { label: "SSO / SAML", desc: "Single sign-on through your identity provider.", icon: "🔑" },
    { label: "Encryption", desc: "Data encrypted at rest and in transit (AES-256 / TLS 1.3).", icon: "🔐" },
    { label: "Audit Logs", desc: "Complete traceability of all actions and accesses.", icon: "📋" },
    { label: "SLA", desc: "Availability commitment and priority support.", icon: "⏱️" },
  ],
};

export default function TalentOSEnterprise({ lang }: { lang: Locale }) {
  const items = ITEMS[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "clamp(96px, 12vw, 160px) 0" }}>
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#777169", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          {lang === "fr" ? "SÉCURITÉ & INFRASTRUCTURE" : "SECURITY & INFRASTRUCTURE"}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 700 }}>
          {lang === "fr" ? "Une infrastructure de niveau entreprise." : "Enterprise-grade infrastructure."}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="talentos-enterprise-grid">
          {items.map((item, i) => (
            <div
              key={item.label}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.05),
                background: "#F5F3F0",
                borderRadius: 18,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                aspectRatio: "1/1",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="talentos-enterprise-card"
            >
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div style={{ marginTop: "auto" }}>
                <h4 style={{ fontSize: 17, fontWeight: 500, marginBottom: 6, color: "#000" }}>{item.label}</h4>
                <p style={{ fontSize: 14, lineHeight: 1.5, color: "#777169", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .talentos-enterprise-card:hover { transform: translateY(-4px); }
        @media (max-width: 1024px) { .talentos-enterprise-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) { .talentos-enterprise-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
