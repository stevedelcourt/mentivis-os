"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const ICONS: Record<string, string> = {
  shield: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
  lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM7.4 8V6c0-2.54 2.06-4.6 4.6-4.6s4.6 2.06 4.6 4.6v2H7.4z",
  key: "M12.65 10A6 6 0 0 0 6 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a6 6 0 0 0 5.66-4H17v4h4v-4h2v-4H12.65zM6 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
  audit: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z",
  robot: "M22 14h-1c0-3.87-3.13-7-7-7h-1V5.73A2 2 0 1 0 10 4c0 .74.4 1.39 1 1.73V7h-1c-3.87 0-7 3.13-7 7H2c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h1v1c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1zM7.5 13c.83 0 1.5.67 1.5 1.5S8.33 16 7.5 16 6 15.33 6 14.5 6.67 13 7.5 13zm3.5 7H7v-1c0-1.66 1.34-3 3-3s3 1.34 3 3v1h-2zm4.5-7c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S14 15.33 14 14.5s.67-1.5 1.5-1.5z",
  cloud: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z",
};

function SvgIcon({ path }: { path: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d={path} fill="#000" />
    </svg>
  );
}

const ITEMS = {
  fr: [
    { label: "RGPD", desc: "Conformité au Règlement Général sur la Protection des Données.", icon: "shield" },
    { label: "ISO 27001", desc: "Standard international de sécurité des systèmes d'information.", icon: "lock" },
    { label: "SSO / SAML", desc: "Authentification unique via votre fournisseur d'identité.", icon: "key" },
    { label: "Journaux d'audit", desc: "Traçabilité complète des accès, actions et modifications.", icon: "audit" },
    { label: "AI Act Ready", desc: "Architecture et IA conçues pour répondre aux exigences européennes.", icon: "robot" },
    { label: "Cloud souverain", desc: "Hébergement des données en Europe sur infrastructure souveraine.", icon: "cloud" },
  ],
  en: [
    { label: "GDPR", desc: "Compliance with the General Data Protection Regulation.", icon: "shield" },
    { label: "ISO 27001", desc: "International standard for information security management systems.", icon: "lock" },
    { label: "SSO / SAML", desc: "Single sign-on through your identity provider.", icon: "key" },
    { label: "Audit Logs", desc: "Complete traceability of accesses, actions and modifications.", icon: "audit" },
    { label: "AI Act Ready", desc: "Architecture and AI designed to meet European requirements.", icon: "robot" },
    { label: "Sovereign Cloud", desc: "Data hosting in Europe on sovereign infrastructure.", icon: "cloud" },
  ],
};

export default function TalentOSEnterprise({ lang }: { lang: Locale }) {
  const items = ITEMS[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "clamp(96px, 12vw, 160px) 0" }}>
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#4e4e4e", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          {lang === "fr" ? "SÉCURITÉ & INFRASTRUCTURE" : "SECURITY & INFRASTRUCTURE"}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 700 }}>
          {lang === "fr" ? "Une infrastructure de niveau entreprise." : "Enterprise-grade infrastructure."}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }} className="talentos-enterprise-grid">
          {items.map((item, i) => (
            <div
              key={item.label}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.05),
                background: "#f5f5f5",
                borderRadius: 18,
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minHeight: 200,
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="talentos-enterprise-card"
            >
              <SvgIcon path={ICONS[item.icon]} />
              <div style={{ marginTop: "auto" }}>
                <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "#000" }}>{item.label}</h4>
                <p style={{ fontSize: 12, lineHeight: 1.4, color: "#4e4e4e", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .talentos-enterprise-card:hover { transform: translateY(-4px); }
        @media (max-width: 1200px) { .talentos-enterprise-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px) { .talentos-enterprise-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
