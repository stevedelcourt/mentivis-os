"use client";

import { Locale } from "@/lib/i18n";
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

export default function EnterpriseSection({ lang }: { lang: Locale }) {
  const items = ITEMS[lang === "fr" ? "fr" : "en"];

  return (
    <section style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        <EnterpriseCards items={items} />
      </div>
    </section>
  );
}
