"use client";

import { getT, Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";
import EnterpriseCards from "@/components/enterprise-cards";

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
  const t = getT(lang);

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
          {t.learningosPage.enterprise.title}
        </h2>

        <EnterpriseCards items={items} />
      </div>
    </section>
  );
}
