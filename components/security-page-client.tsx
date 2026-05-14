"use client";

import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";
import CTABlock from "@/components/cta-block";
import IcosahedronAnimation from "@/components/icosahedron-animation";

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

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
    fr: { title: "Protection des donnees", body: "Les donnees de formation et de recrutement sont chiffrees, isolees et hebergees en Europe. Nous ne revendons ni n'exploitons aucune donnee." },
    en: { title: "Data protection", body: "Training and recruitment data is encrypted, isolated, and hosted in Europe. We never sell or exploit any data." },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10" /><path d="M12 2a10 10 0 0 0-10 10" /><path d="M2 12h20" /><circle cx="12" cy="12" r="4" />
      </svg>
    ),
    fr: { title: "IA responsable et equitable", body: "Nos algorithmes sont audites pour detecter et corriger les biais. Chaque decision de matching ou de parcours est explicable." },
    en: { title: "Responsible & fair AI", body: "Our algorithms are audited to detect and correct bias. Every matching or pathway decision is explainable." },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    fr: { title: "Conformite RGPD et certifications", body: "Nous respectons le RGPD, les normes ISO 27001 et le referentiel Qualiopi. Nos processus sont audites annuellement." },
    en: { title: "GDPR compliance & certifications", body: "We comply with GDPR, ISO 27001 standards, and Qualiopi framework. Our processes are audited annually." },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    fr: { title: "Controle d'acces strict", body: "Authentification multi-facteurs, roles granulaires (god, editorial, tarifs) et journalisation de toutes les actions administrateurs." },
    en: { title: "Strict access control", body: "Multi-factor authentication, granular roles (god, editorial, tarifs), and logging of all admin actions." },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    fr: { title: "Transparence et tracabilite", body: "Chaque contenu genere par IA est identifie comme tel. Les parcours et evaluations sont horodates et inalterables." },
    en: { title: "Transparency & traceability", body: "Every AI-generated piece of content is identified as such. Pathways and assessments are timestamped and tamper-proof." },
  },
];

const FAQS_FR = [
  {
    q: "Mes donnees sont-elles utilisees pour entrainer les modeles d'IA ?",
    a: "Non. Les donnees de nos clients (contenus de formation, profils candidats, resultats d'evaluation) ne sont jamais utilisees pour entrainer ou ameliorer les modeles d'IA generatifs partages. Chaque client dispose d'un isolement strict de ses donnees.",
  },
  {
    q: "Ou sont hebergees les donnees ?",
    a: "Toutes les donnees sont hebergees en France et en Union Europeenne chez O2switch (Clermont-Ferrand) et nos partenaires cloud europeens. Nous garantissons l'absence de transfert hors UE.",
  },
  {
    q: "Comment signaler un contenu abusif ou illegitime ?",
    a: "Si vous estimez qu'un contenu public via MentivisOS enfreint nos conditions d'utilisation ou la loi, vous pouvez le signaler a l'adresse legal@mentivis.com. Nous traitons chaque signalement sous 48 heures ouvre.es.",
  },
  {
    q: "Quel est mon droit d'acces et de suppression de mes donnees ?",
    a: "Conformement au RGPD, vous pouvez demander l'acces, la rectification ou la suppression de vos donnees personnelles a tout moment en contactant dpo@mentivis.com. Nous repondons sous 30 jours.",
  },
  {
    q: "MentivisOS est-il certifie Qualiopi ?",
    a: "Oui, notre systeme de formation est conforme au referentiel Qualiopi. Nous accompagnons nos clients dans leur propre demarche de certification si necessaire.",
  },
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
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { setHeroLoaded(true); }, []);

  const engagement = useVisible();
  const principles = useVisible();
  const protections = useVisible();
  const infrastructure = useVisible();
  const faq = useVisible();

  const sectionAnim = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  const stickyNav = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("engagement");

  const sections = [
    { id: "engagement", fr: "Engagement", en: "Commitment" },
    { id: "principes", fr: "Principes", en: "Principles" },
    { id: "protections", fr: "Protections", en: "Protections" },
    { id: "infrastructure", fr: "Infrastructure", en: "Infrastructure" },
    { id: "faq", fr: "FAQ", en: "FAQ" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const H = isFr ? {
    metaTitle: "Securite — MentivisOS",
    heroEyebrow: "Securite",
    heroHeadline: "L'IA pedagogique pour transformer la formation, avec confidentialite et protections integrees.",
    engagementTitle: "Notre engagement securite",
    engagementBody1: "Chez MentivisOS, nous croyons profondement aux benefices de l'IA pour la formation et le recrutement. Notre technologie est utilisee par des entreprises et des institutions pour structurer les parcours de competence, analyser les profils candidats et orchestrer la montee en competences des equipes.",
    engagementBody2: "Nous savons qu'une mauvaise utilisation des donnees ou des algorithmes peut causer des torts. C'est pourquoi nous nous engageons a proteger les donnees de nos clients — apprenants, candidats, collaborateurs — avec le plus haut niveau de securite et de transparence.",
    engagementQuote: "La securite des donnees fait partie integrante de l'innovation chez MentivisOS. Garantir le developpement, le deploiement et l'utilisation surs de nos systemes reste au c.ur de notre strategie.",
    engagementAuthor: "Steven Delcourt — Fondateur, Mentivis",
    principlesTitle: "Nos principes de securite",
    protectionsTitle: "Nos protections",
    protectionsIntro: "Nous deployons un ensemble complet de protections dans un systeme de defense a plusieurs niveaux. Si une couche est contournee, les suivantes prennent le relais pour detecter les abus.",
    protectionsLayers: [
      { title: "Chiffrement", desc: "Toutes les donnees sont chiffrees en transit (TLS 1.3) et au repos (AES-256). Les cles sont gerees via un HSM dedie." },
      { title: "Isolement", desc: "Chaque client dispose d'un espace de donnees isole. Aucun croisement ni fuite entre les espaces clients." },
      { title: "Audit continu", desc: "Nos infrastructures sont auditees en continu. Analyses de vulnerabilite, tests d'intrusion et surveillance 24/7." },
      { title: "Gouvernance", desc: "Politique de securite formelle, revue trimestrielle par un RSSI externe, registre des traitements RGPD tenu a jour." },
    ],
    infrastructureTitle: "Infrastructure et conformite",
    infrastructureItems: [
      { label: "Hebergement", value: "France et UE — O2switch, partenaires cloud europeens" },
      { label: "Certifications", value: "RGPD, ISO 27001 (en cours), Qualiopi" },
      { label: "Sauvegarde", value: "Backup quotidien chiffre, retention 30 jours, restauration testee mensuellement" },
      { label: "Disponibilite", value: "99.9% uptime SLA, deploiement zero-downtime, bascule automatique" },
    ],
    faqTitle: "Questions frequentes",
  } : {
    metaTitle: "Security — MentivisOS",
    heroEyebrow: "Security",
    heroHeadline: "AI-powered pedagogy to transform training, with built-in confidentiality and protections.",
    engagementTitle: "Our security commitment",
    engagementBody1: "At MentivisOS, we deeply believe in the benefits of AI for training and recruitment. Our technology is used by companies and institutions to structure skill pathways, analyze candidate profiles, and orchestrate team upskilling.",
    engagementBody2: "We know that misuse of data or algorithms can cause harm. That's why we are committed to protecting our clients' data — learners, candidates, employees — with the highest level of security and transparency.",
    engagementQuote: "Data security is an integral part of innovation at MentivisOS. Ensuring the safe development, deployment, and use of our systems remains at the core of our strategy.",
    engagementAuthor: "Steven Delcourt — Founder, Mentivis",
    principlesTitle: "Our security principles",
    protectionsTitle: "Our protections",
    protectionsIntro: "We deploy a comprehensive set of protections in a multi-layered defense system. If one layer is bypassed, the next steps in to detect abuse.",
    protectionsLayers: [
      { title: "Encryption", desc: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Keys are managed via a dedicated HSM." },
      { title: "Isolation", desc: "Each client has an isolated data space. No cross-contamination or leaks between client spaces." },
      { title: "Continuous audit", desc: "Our infrastructure is continuously audited. Vulnerability scans, penetration testing, and 24/7 monitoring." },
      { title: "Governance", desc: "Formal security policy, quarterly review by an external CISO, up-to-date GDPR processing register." },
    ],
    infrastructureTitle: "Infrastructure & compliance",
    infrastructureItems: [
      { label: "Hosting", value: "France and EU — O2switch, European cloud partners" },
      { label: "Certifications", value: "GDPR, ISO 27001 (in progress), Qualiopi" },
      { label: "Backup", value: "Daily encrypted backup, 30-day retention, monthly restore testing" },
      { label: "Availability", value: "99.9% uptime SLA, zero-downtime deployment, automatic failover" },
    ],
    faqTitle: "Frequently asked questions",
  };

  const faqs = isFr ? FAQS_FR : FAQS_EN;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main style={{ background: "#ffffff" }}>
      {/* ── STICKY NAV ── */}
      <div
        ref={stickyNav}
        className="security-sticky-nav"
        style={{
          position: "sticky",
          top: 60,
          zIndex: 50,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #F0EBE5",
          padding: "0 var(--grid-margin)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            gap: 24,
            paddingTop: 8,
            paddingBottom: 8,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: activeSection === s.id ? "#000000" : "#777169",
                textDecoration: "none",
                padding: "8px 0",
                  borderBottom: activeSection === s.id ? "2px solid #000000" : "2px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-sans)",
              }}
            >
              {isFr ? s.fr : s.en}
            </a>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section
        className="section"
        style={{
          position: "relative",
          paddingTop: "clamp(80px, 12vh, 140px)",
          ...sectionAnim(heroLoaded),
        }}
      >
        {/* Icosahedron animation to the right */}
        <div
          style={{
            position: "absolute",
            left: "calc(var(--grid-margin) + 720px)",
            top: "50%",
            transform: "translateY(-50%)",
            width: "clamp(300px, 40vw, 600px)",
            height: "clamp(300px, 40vw, 600px)",
            opacity: 0.5,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <IcosahedronAnimation />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#777169", marginBottom: 16 }}>
              {H.heroEyebrow}
            </p>
            <h1
              className="t-display"
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#000000",
                margin: 0,
              }}
            >
              {H.heroHeadline}
            </h1>
          </div>
        </div>
      </section>

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
            <p style={{ fontSize: 13, color: "#777169", margin: 0 }}>{H.engagementAuthor}</p>
          </div>
        </div>
      </section>

      {/* ── PRINCIPLES ── */}
      <section id="principes" ref={principles.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(principles.visible, 0.05) }}>
        <div className="container">
          <h2 className="section-title">{H.principlesTitle}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {PRINCIPLES.map((p, i) => {
              const content = isFr ? p.fr : p.en;
              return (
                <div
                  key={i}
                  className="principle-card"
                  style={{
                    padding: 24,
                    borderRadius: 16,
                    background: "#ffffff",
                    border: "1px solid #e5e5e5",
                    transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease",
                    cursor: "default",
                  }}
                >
                  <div style={{ color: "#000000", marginBottom: 14 }}>{p.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 8px", color: "#000000" }}>{content.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#777169", margin: 0 }}>{content.body}</p>
                </div>
              );
            })}
          </div>
        </div>
        <style>{`
          .principle-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.06);
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
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#777169", margin: 0 }}>{layer.desc}</p>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 12,
            }}
          >
            {H.infrastructureItems.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 24px",
                  background: "#ffffff",
                  borderRadius: 12,
                  border: "1px solid #e5e5e5",
                }}
              >
                <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#777169", marginBottom: 6, fontWeight: 500 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.5, color: "#000000", margin: 0 }}>{item.value}</p>
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
                      color: "#777169",
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
          color: #777169;
          margin: 0 0 16px;
          max-width: 680px;
        }
        .security-sticky-nav::-webkit-scrollbar { display: none; }
        @media (max-width: 1024px) {
          .security-sticky-nav { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
        }
        @media (max-width: 768px) {
          .section-title { margin-bottom: 16px; }
        }
      `}</style>
    </main>
  );
}
