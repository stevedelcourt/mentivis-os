"use client";

import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";
import CTABlock from "@/components/cta-block";
import PageHero from "@/components/page-hero";
import CmsPageHero from "@/components/cms-page-hero";
import IcosahedronAnimation from "@/components/icosahedron-animation";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

interface SecurityPageProps {
  lang: Locale;
}

const PRINCIPLES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    fr: { title: "Protection des données", body: "Les données de formation et de recrutement sont chiffrees, isolees et hébergées en Europe. Nous ne revendons ni n'exploitons aucune donnée." },
    en: { title: "Data protection", body: "Training and recruitment data is encrypted, isolated, and hosted in Europe. We never sell or exploit any data." },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10" /><path d="M12 2a10 10 0 0 0-10 10" /><path d="M2 12h20" /><circle cx="12" cy="12" r="4" />
      </svg>
    ),
    fr: { title: "IA responsable et equitable", body: "Nos algorithmes sont audites pour détécter et corriger les biais. Chaque decision de matching ou de parcours est explicable." },
    en: { title: "Responsible & fair AI", body: "Our algorithms are audited to détéct and correct bias. Every matching or pathway decision is explainable." },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    fr: { title: "Conformite RGPD et certifications", body: "Nous respectons le RGPD, les normes ISO 27001 et le référentiel Qualiopi. Nos processus sont audites annuellement." },
    en: { title: "GDPR compliance & certifications", body: "We comply with GDPR, ISO 27001 standards, and Qualiopi framework. Our processes are audited annually." },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    fr: { title: "Contrôle d'acces strict", body: "Authentification multi-facteurs, rôles granulaires (god, editorial, tarifs) et journalisation de toutes les actions administrateurs." },
    en: { title: "Strict access control", body: "Multi-factor authentication, granular roles (god, editorial, tarifs), and logging of all admin actions." },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    fr: { title: "Transparence et tracabilite", body: "Chaque contenu généré par IA est identifie comme tel. Les parcours et evaluations sont horodates et inalterables." },
    en: { title: "Transparency & traceability", body: "Every AI-generated piece of content is identified as such. Pathways and assessments are timestamped and tamper-proof." },
  },
];

const FAQS_FR = [
  {
    q: "Mes données sont-elles utilisees pour entrainer les modèles d'IA ?",
    a: "Non. Les données de nos clients (contenus de formation, profils candidats, resultats d'evaluation) ne sont jamais utilisees pour entrainer ou ameliorer les modèles d'IA generatifs partages. Chaque client dispose d'un isolement strict de ses données.",
  },
  {
    q: "Ou sont hébergées les données ?",
    a: "Toutes les données sont hébergées en France et en Union Europeenne chez O2switch (Clermont-Ferrand) et nos partenaires cloud europeens. Nous garantissons l'absence de transfert hors UE.",
  },
  {
    q: "Comment signaler un contenu abusif ou illegitime ?",
    a: "Si vous estimez qu'un contenu public via MentivisOS enfreint nos conditions d'utilisation ou la loi, vous pouvez le signaler à l'adresse legal@mentivis.com. Nous traitons chaque signalement sous 48 heures ouvre.es.",
  },
  {
    q: "Quel est mon droit d'acces et de suppression de mes données ?",
    a: "Conformêment au RGPD, vous pouvez demander l'acces, la rectification ou la suppression de vos données personnelles a tout moment en contactant dpo@mentivis.com. Nous repondons sous 30 jours.",
  },
  {
    q: "MentivisOS est-il certifie Qualiopi ?",
    a: "Oui, notre système de formation est conforme au référentiel Qualiopi. Nous accompagnons nos clients dans leur propre demarche de certification si necessaire.",
  },
];

const INFRA_GRADIENTS = [
  "linear-gradient(135deg, #1A2B80 0%, #3040A0 50%, #4A5AC0 100%)",
  "linear-gradient(135deg, #1A5C3A 0%, #2D7A50 50%, #409A6A 100%)",
  "linear-gradient(135deg, #2D1B69 0%, #4A2D8A 50%, #6A4AAA 100%)",
  "linear-gradient(135deg, #8B3A20 0%, #A85830 50%, #C87848 100%)",
];

const FAQS_EN = [
  {
    q: "Is my data used to train AI models?",
    a: "No. Client data (training content, candidate profiles, assessment results) is never used to train or improve shared generative AI models. Each client benefits from strict data isolation.",
  },
  {
    q: "Where is the data hosted?",
    a: "All data is hosted in France and the European Union at O2switch (Clermont-Ferrand) and our European cloud partners. We guarantee no transfer outside the EU.",
  },
  {
    q: "How do I report abusive or illegitimate content?",
    a: "If you believe content published via MentivisOS violates our terms of use or the law, you can report it at legal@mentivis.com. We handle each report within 48 business hours.",
  },
  {
    q: "What are my data access and deletion rights?",
    a: "Under GDPR, you can request access, rectification, or deletion of your personal data at any time by contacting dpo@mentivis.com. We respond within 30 days.",
  },
  {
    q: "Is MentivisOS Qualiopi certified?",
    a: "Yes, our training system complies with the Qualiopi framework. We support our clients in their own certification process if needed.",
  },
];

export default function SecurityPageClient({ lang }: SecurityPageProps) {
  const isFr = lang === "fr";

  const engagement = useVisible();
  const principles = useVisible();
  const protections = useVisible();
  const infrastructure = useVisible();
  const faq = useVisible();

  const H = isFr ? {
    metaTitle: "Sécurité - MentivisOS",
    heroEyebrow: "Sécurité",
    heroHeadline: "L'IA p\u00e9dagogique pour transformer la formation,<br />avec confidentialit\u00e9 et protections int\u00e9gr\u00e9es.",
    engagementTitle: "Notre engagement sécurité",
    engagementBody1: "Chez MentivisOS, nous croyons profondement aux benefices de l'IA pour la formation et le recrutement. Notre technologie est utilisee par des entreprises et des institutions pour structurer les parcours de compéténce, analyser les profils candidats et orchestrer la montée en compéténces des équipes.",
    engagementBody2: "Nous savons qu'une mauvaise utilisation des données ou des algorithmes peut causer des torts. C'est pourquoi nous nous engageons a proteger les données de nos clients, apprenants, candidats, collaborateurs, avec le plus haut niveau de sécurité et de transparence.",
    engagementQuote: "La sécurité des données fait partie integrante de l'innovation chez MentivisOS. Garantir le développément, le déploiement et l'utilisation surs de nos systèmes reste au c.ur de notre stratégie.",
    engagementAuthor: "Steven Delcourt, Fondateur, Mentivis",
    principlesTitle: "Nos principes de sécurité",
    protectionsTitle: "Nos protections",
    protectionsIntro: "Nous deployons un ensemble complet de protections dans un système de defense a plusieurs niveaux. Si une couche est contournee, les suivantes prennent le relais pour détécter les abus.",
    protectionsLayers: [
      { title: "Chiffrement", desc: "Toutes les données sont chiffrees en transit (TLS 1.3) et au repos (AES-256). Les cles sont gerees via un HSM dédié." },
      { title: "Isolement", desc: "Chaque client dispose d'un espace de données isole. Aucun croisement ni fuite entre les espaces clients." },
      { title: "Audit continu", desc: "Nos infrastructures sont auditees en continu. Analyses de vulnerabilite, tests d'intrusion et surveillancé 24/7." },
      { title: "Gouvernance", desc: "Politique de sécurité formelle, revue trimestrielle par un RSSI externe, registre des traitements RGPD tenu a jour." },
    ],
    infrastructureTitle: "Infrastructure et conformité",
    infrastructureItems: [
      { label: "Hebergement", value: "France et UE, O2switch, partenaires cloud europeens" },
      { label: "Certifications", value: "RGPD, ISO 27001 (en cours), Qualiopi" },
      { label: "Sauvegarde", value: "Backup quotidien chiffre, réténtion 30 jours, restauration testee mensuellement" },
      { label: "Disponibilite", value: "99.9% uptime SLA, déploiement zero-downtime, bascule automatique" },
    ],
    faqTitle: "Questions fréquentes",
  } : {
    metaTitle: "Security - MentivisOS",
    heroEyebrow: "Security",
    heroHeadline: "AI-powered pedagogy to transform training,<br />with built-in confidentiality and protections.",
    engagementTitle: "Our security commitment",
    engagementBody1: "At MentivisOS, we deeply believe in the benefits of AI for training and recruitment. Our technology is used by companies and institutions to structure skill pathways, analyze candidate profiles, and orchestrate team upskilling.",
    engagementBody2: "We know that misuse of data or algorithms can cause harm. That's why we are committed to protecting our clients' data, learners, candidates, employees, with the highest level of security and transparency.",
    engagementQuote: "Data security is an integral part of innovation at MentivisOS. Ensuring the safe development, deployment, and use of our systems remains at the core of our strategy.",
    engagementAuthor: "Steven Delcourt, Founder, Mentivis",
    principlesTitle: "Our security principles",
    protectionsTitle: "Our protections",
    protectionsIntro: "We deploy a comprehensive set of protections in a multi-layered defense system. If one layer is bypassed, the next steps in to détéct abuse.",
    protectionsLayers: [
      { title: "Encryption", desc: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Keys are managed via a dedicated HSM." },
      { title: "Isolation", desc: "Each client has an isolated data space. No cross-contamination or leaks between client spaces." },
      { title: "Continuous audit", desc: "Our infrastructure is continuously audited. Vulnerability scans, penetration testing, and 24/7 monitoring." },
      { title: "Governance", desc: "Formal security policy, quarterly review by an external CISO, up-to-date GDPR processing register." },
    ],
    infrastructureTitle: "Infrastructure & compliance",
    infrastructureItems: [
      { label: "Hosting", value: "France and EU, O2switch, European cloud partners" },
      { label: "Certifications", value: "GDPR, ISO 27001 (in progress), Qualiopi" },
      { label: "Backup", value: "Daily encrypted backup, 30-day réténtion, monthly restore testing" },
      { label: "Availability", value: "99.9% uptime SLA, zero-downtime deployment, automatic failover" },
    ],
    faqTitle: "Frequently asked questions",
  };

  const faqs = isFr ? FAQS_FR : FAQS_EN;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#ffffff" }}>
      <CmsPageHero
        page="security"
        lang={lang}
        defaults={{
          eyebrow: H.heroEyebrow,
          headline: H.heroHeadline.replace(/<br\s*\/?>/g, "\n"),
        }}
        visual={
          <div className="security-hero-visual" style={{ opacity: 0.5 }}>
            <IcosahedronAnimation />
          </div>
        }
      />

      {/* ── ENGAGEMENT ── */}
      <section id="engagement" ref={engagement.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(engagement.visible) }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="section-title">{H.engagementTitle}</h2>
          <p className="section-body">{H.engagementBody1}</p>
          <p className="section-body">{H.engagementBody2}</p>
          <div
            style={{
              marginTop: 40,
              padding: "28px 32px",
              background: "#f5f5f5",
              borderRadius: 16,
              borderLeft: "3px solid #000000",
            }}
          >
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "#000000", margin: "0 0 12px" }}>
              &ldquo;{H.engagementQuote}&rdquo;
            </p>
            <p style={{ fontSize: 13, color: "#4e4e4e", margin: 0 }}>{H.engagementAuthor}</p>
          </div>
        </div>
      </section>

      {/* ── PRINCIPLES ── */}
      <section id="principes" ref={principles.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(principles.visible, 0.05) }}>
        <div className="container">
          <h2 className="section-title">{H.principlesTitle}</h2>
          <div className="principles-grid">
            <div className="p-card p-card-dark">
              <div className="p-icon-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 style={{ color: "#fff" }}>{isFr ? PRINCIPLES[0].fr.title : PRINCIPLES[0].en.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.7)" }}>{isFr ? PRINCIPLES[0].fr.body : PRINCIPLES[0].en.body}</p>
            </div>
            <div className="p-card p-card-mid">
              <div className="p-icon-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 0 1 10 10" /><path d="M12 2a10 10 0 0 0-10 10" /><path d="M2 12h20" /><circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <h3 style={{ color: "#fff" }}>{isFr ? PRINCIPLES[1].fr.title : PRINCIPLES[1].en.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.7)" }}>{isFr ? PRINCIPLES[1].fr.body : PRINCIPLES[1].en.body}</p>
            </div>
            <div className="p-card p-card-light">
              <div className="p-icon-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 style={{ color: "#000" }}>{isFr ? PRINCIPLES[2].fr.title : PRINCIPLES[2].en.title}</h3>
              <p style={{ color: "#4e4e4e" }}>{isFr ? PRINCIPLES[2].fr.body : PRINCIPLES[2].en.body}</p>
            </div>
            <div className="p-card p-card-light">
              <div className="p-icon-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 style={{ color: "#000" }}>{isFr ? PRINCIPLES[3].fr.title : PRINCIPLES[3].en.title}</h3>
              <p style={{ color: "#4e4e4e" }}>{isFr ? PRINCIPLES[3].fr.body : PRINCIPLES[3].en.body}</p>
            </div>
            <div className="p-card p-card-light">
              <div className="p-icon-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 style={{ color: "#000" }}>{isFr ? PRINCIPLES[4].fr.title : PRINCIPLES[4].en.title}</h3>
              <p style={{ color: "#4e4e4e" }}>{isFr ? PRINCIPLES[4].fr.body : PRINCIPLES[4].en.body}</p>
            </div>
            <div className="p-card p-card-image">
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "url(/images/data-flower.webp)",
                backgroundSize: "cover", backgroundPosition: "center",
              }} />
            </div>
          </div>
        </div>
        <style>{`
          .principles-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          .p-card {
            border-radius: 18px;
            padding: 28px 24px 24px;
            position: relative;
            transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .p-card-dark {
            background: #1a1a2e;
          }
          .p-card-mid {
            background: #4e4e4e;
          }
          .p-card-light {
            background: #ffffff;
            border: 1px solid #e5e5e5;
          }
          .p-card-image {
            padding: 0;
            overflow: hidden;
            aspect-ratio: 3 / 2;
          }
          .p-icon-pill {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255,255,255,0.12);
            backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 18px;
          }
          .p-card-light .p-icon-pill {
            background: rgba(0,0,0,0.06);
          }
          .p-card-light .p-icon-pill svg {
            color: #000;
          }
          .p-card h3 {
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 10px;
            line-height: 1.3;
          }
          .p-card p {
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
          }
          .p-card:hover {
            transform: translateY(-4px);
          }
          @media (max-width: 768px) {
            .principles-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
          @media (max-width: 480px) {
            .principles-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </section>

      {/* ── PROTECTIONS ── */}
      <section id="protections" ref={protections.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(protections.visible, 0.1) }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="section-title">{H.protectionsTitle}</h2>
          <p className="section-body">{H.protectionsIntro}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 28 }}>
            {H.protectionsLayers.map((layer, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "18px 20px",
                  background: "#ffffff",
                  borderRadius: 12,
                  border: "1px solid #e5e5e5",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#000000",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px", color: "#000000" }}>{layer.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#4e4e4e", margin: 0 }}>{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFRASTRUCTURE ── */}
      <section id="infrastructure" ref={infrastructure.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(infrastructure.visible, 0.15) }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="section-title">{H.infrastructureTitle}</h2>
          <div className="infra-grid">
            {H.infrastructureItems.map((item, i) => (
              <div
                key={i}
                className="infra-card"
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: 18,
                  overflow: "hidden",
                  background: INFRA_GRADIENTS[i],
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 10,
                    padding: "6px 12px 6px 8px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 130 130" fill="none">
                    <rect x="20" y="20" width="10" height="10" fill="white"/>
                    <rect x="100" y="20" width="10" height="10" fill="white"/>
                    <rect x="20" y="40" width="10" height="10" fill="white"/>
                    <rect x="40" y="40" width="10" height="10" fill="white"/>
                    <rect x="80" y="40" width="10" height="10" fill="white"/>
                    <rect x="100" y="40" width="10" height="10" fill="white"/>
                    <rect x="20" y="60" width="10" height="10" fill="white"/>
                    <rect x="40" y="60" width="10" height="10" fill="white"/>
                    <rect x="60" y="60" width="10" height="10" fill="white"/>
                    <rect x="80" y="60" width="10" height="10" fill="white"/>
                    <rect x="100" y="60" width="10" height="10" fill="white"/>
                    <rect x="20" y="80" width="10" height="10" fill="white"/>
                    <rect x="40" y="80" width="10" height="10" fill="white"/>
                    <rect x="80" y="80" width="10" height="10" fill="white"/>
                    <rect x="100" y="80" width="10" height="10" fill="white"/>
                    <rect x="20" y="100" width="10" height="10" fill="white"/>
                    <rect x="100" y="100" width="10" height="10" fill="white"/>
                  </svg>
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 14,
                    right: 14,
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.38,
                    letterSpacing: "-0.005em",
                    color: "#ffffff",
                    zIndex: 2,
                    textAlign: "left",
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABlock lang={lang} variant="final" />

      {/* ── FAQ ── */}
      <section id="faq" ref={faq.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", paddingBottom: 120, ...sectionAnim(faq.visible, 0.25) }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 className="section-title">{H.faqTitle}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs.map((item, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "#fff",
                  transition: "box-shadow 0.15s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 22px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#000000",
                    textAlign: "left",
                    fontFamily: "var(--font-sans)",
                    lineHeight: 1.4,
                  }}
                >
                  <span>{item.q}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      flexShrink: 0,
                      transition: "transform 0.2s",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  style={{
                    maxHeight: openFaq === i ? "400px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <p
                    style={{
                      padding: "0 22px 18px",
                      margin: 0,
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "#4e4e4e",
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .section-title {
          font-family: var(--font-sans);
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 300;
          line-height: 1.2;
          color: #000000;
          margin: 0 0 24px;
          letter-spacing: -0.01em;
        }
        .section-body {
          font-family: var(--font-sans);
          font-size: 18px;
          line-height: 1.6;
          color: #4e4e4e;
          margin: 0 0 16px;
          max-width: 680px;
        }
        .infra-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .infra-card {
          transition: transform .45s cubic-bezier(.22,1,.36,1);
        }
        .infra-card:hover {
          transform: translateY(-4px);
        }
        @media (max-width: 1024px) {
          .section-hero-ico { display: none !important; }
        }
        @media (max-width: 768px) {
          .section-title { margin-bottom: 16px; }
          .infra-grid { grid-template-columns: 1fr !important; }
          .security-hero-visual { display: none !important; }
        }
      `}</style>
    </div>
  );
}
