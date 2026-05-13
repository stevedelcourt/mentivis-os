"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";

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

interface AboutPageProps {
  lang: Locale;
}

const TEAM = [
  {
    name: "Roxan Roumegas",
    roleFr: "Partner, President",
    roleEn: "Partner, President",
    img: "/images/team/roxan-roumegas.avif",
  },
  {
    name: "Mathias Costes",
    roleFr: "Partner, Corporate Sales",
    roleEn: "Partner, Corporate Sales",
    img: "/images/team/mathias-costes.avif",
  },
  {
    name: "Julie Steiner",
    roleFr: "Partner, Direction commerciale",
    roleEn: "Partner, Sales Director",
    img: "/images/team/julie-steiner.avif",
  },
  {
    name: "Steven Delcourt",
    roleFr: "Partner, Strategy",
    roleEn: "Partner, Strategy",
    img: "/images/team/steven-delcourt.avif",
  },
];

const APPROACH_FR = [
  {
    tag: "Strategie",
    title: "Strategie",
    body: "Cadrage du projet, positionnement de marche, modele economique. Ce qui rend le systeme viable avant meme le premier inscrit.",
  },
  {
    tag: "Ingenierie pedagogique",
    title: "Ingenierie pedagogique",
    body: "Referentiels, certifications, parcours. Conception fine des objets pedagogiques et de leur evaluation par l'IA.",
  },
  {
    tag: "Marketing et admissions",
    title: "Marketing et admissions",
    body: "Recrutement des apprenants, notoriete, conversion. Du tunnel de candidature a l'identite de marque.",
  },
  {
    tag: "Conformite et deploiement",
    title: "Conformite et deploiement",
    body: "OPCO, dispositifs publics, certifications qualite, mise en oeuvre operationnelle quotidienne.",
  },
];

const APPROACH_EN = [
  {
    tag: "Strategy",
    title: "Strategy",
    body: "Project framing, market positioning, business model. What makes the system viable before the first enrollee.",
  },
  {
    tag: "Pedagogical engineering",
    title: "Pedagogical engineering",
    body: "Frameworks, certifications, pathways. Fine design of pedagogical objects and their AI-powered assessment.",
  },
  {
    tag: "Marketing & admissions",
    title: "Marketing & admissions",
    body: "Learner recruitment, awareness, conversion. From application funnel to brand identity.",
  },
  {
    tag: "Compliance & deployment",
    title: "Compliance & deployment",
    body: "OPCO, public schemes, quality certifications, day-to-day operational implementation.",
  },
];

const SIGS_FR = [
  { num: "01", title: "Obsession du resultat", body: "Pas du rapport. Un projet qui n'est pas lance n'a pas existe." },
  { num: "02", title: "Maitrise du financement", body: "OPCO, dispositifs publics, montages hybrides. Le levier economique du projet." },
  { num: "03", title: "Approche full-stack", body: "Strategie, pedagogie, marketing, conformite. Sous un seul toit." },
  { num: "04", title: "Capacite a operer", body: "Pas seulement a conseiller. Nous tenons les renes jusqu'a la premiere promotion." },
];

const SIGS_EN = [
  { num: "01", title: "Results obsession", body: "Not reports. A project that hasn't launched doesn't exist." },
  { num: "02", title: "Funding mastery", body: "OPCO, public schemes, hybrid structures. The economic lever of the project." },
  { num: "03", title: "Full-stack approach", body: "Strategy, pedagogy, marketing, compliance. Under one roof." },
  { num: "04", title: "Ability to operate", body: "Not just advisory. We hold the reins until the first cohort." },
];

const VALUES_FR = [
  { title: "Clarte", body: "Dire ce qui fonctionne. Eliminer le reste." },
  { title: "Execution", body: "Un projet n'existe que s'il est lance." },
  { title: "Responsabilite", body: "Nous allons jusqu'au resultat." },
  { title: "Confidentialite", body: "Les projets ne circulent pas." },
  { title: "Utilite", body: "Chaque action doit creer de la valeur mesurable." },
];

const VALUES_EN = [
  { title: "Clarity", body: "Say what works. Eliminate the rest." },
  { title: "Execution", body: "A project only exists if it's launched." },
  { title: "Responsibility", body: "We see it through to results." },
  { title: "Confidentiality", body: "Projects don't circulate." },
  { title: "Utility", body: "Every action must create measurable value." },
];

export default function AboutPageClient({ lang }: AboutPageProps) {
  const isFr = lang === "fr";

  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { setHeroLoaded(true); }, []);

  const conviction = useVisible();
  const histoire = useVisible();
  const equipe = useVisible();
  const approche = useVisible();
  const signatures = useVisible();
  const valeurs = useVisible();
  const cta = useVisible();

  const sectionAnim = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  const H = isFr ? {
    heroEyebrow: "A propos",
    heroHeadline: "MentivisOS est le systeme de formation native IA concu par Mentivis",
    heroSub: "De la strategie au deploiement operationnel. Un seul OS pour former, certifier et faire grandir les talents.",
    convictionText: "Former n'est pas un cout. C'est un systeme de production de valeur.",
    convictionAuthor: "Steven Delcourt — Fondateur, Mentivis",
    histoireTitle: "Ne d'un constat operationnel",
    histoireBody1: "Les fondateurs de Mentivis ont deja cree des ecoles ensemble. Pedagogie, developpement commercial, marketing, conformite, operations. Toutes les dimensions du metier.",
    histoireBody2: "Ils se sont associes pour une raison precise. Les mutations rapides de l'education et de la formation exigent un acteur specialise, capable de faire le lien entre entreprises, dispositifs de formation et enjeux a venir.",
    histoireBody3: "Un choix des l'origine. Ne pas faire du conseil abstrait, mais construire des dispositifs qui fonctionnent reellement.",
    equipeTitle: "L'equipe",
    equipeSub: "Les fondateurs",
  } : {
    equipeSub: "The founders",
    approcheTitle: "Our approach",
    approcheSub: "Four integrated blocks. A single goal. A viable, funded, rapidly activatable system.",
    signaturesTitle: "What sets us apart",
    signaturesSub: "Four signatures.",
    valeursTitle: "Our values",
    valeursSub: "Five operating rules.",
    ctaTitle: "Have a training project to structure?",
    ctaBody: "First no-obligation discussion, analysis of your needs and clear positioning on our ability to support you.",
    ctaPrimary: "Start for free",
    ctaSecondary: "Contact the team",
  };

  const approach = isFr ? APPROACH_FR : APPROACH_EN;
    const sigs = isFr ? SIGS_FR : SIGS_EN;
  const values = isFr ? VALUES_FR : VALUES_EN;

  return (
    <main style={{ background: "#ffffff" }}>
      {/* ── HERO ── */}
      <section
        className="section"
        style={{ paddingTop: "clamp(80px, 12vh, 140px)", ...sectionAnim(heroLoaded) }}
      >
        <div className="container" style={{ maxWidth: 800 }}>
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
              color: "#3E3B38",
              margin: "0 0 20px",
            }}
          >
            {H.heroHeadline}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#777169", maxWidth: 600, margin: 0 }}>
            {H.heroSub}
          </p>
        </div>
      </section>

      {/* ── CONVICTION ── */}
      <section ref={conviction.ref} className="section" style={{ paddingTop: 100, ...sectionAnim(conviction.visible) }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div
            style={{
              padding: "36px 40px",
              background: "#0A0A0A",
              borderRadius: 20,
            }}
          >
            <p
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 300,
                lineHeight: 1.3,
                color: "#fff",
                margin: "0 0 16px",
                letterSpacing: "-0.01em",
              }}
            >
              &ldquo;{H.convictionText}&rdquo;
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0 }}>
              {H.convictionAuthor}
            </p>
          </div>
        </div>
      </section>

      {/* ── HISTOIRE ── */}
      <section id="histoire" ref={histoire.ref} className="section" style={{ paddingTop: 100, ...sectionAnim(histoire.visible, 0.05) }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="section-title">{H.histoireTitle}</h2>
          <p className="section-body">{H.histoireBody1}</p>
          <p className="section-body">{H.histoireBody2}</p>
          <div
            style={{
              padding: "20px 24px",
              background: "#F9F7F4",
              borderRadius: 12,
              borderLeft: "3px solid #0A0A0A",
              marginTop: 8,
            }}
          >
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#3E3B38", margin: 0, fontWeight: 450 }}>
              {H.histoireBody3}
            </p>
          </div>
        </div>
      </section>

      {/* ── EQUIPE ── */}
      <section id="equipe" ref={equipe.ref} className="section" style={{ paddingTop: 100, ...sectionAnim(equipe.visible, 0.1) }}>
        <div className="container">
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#A8A29E", marginBottom: 6 }}>
            {H.equipeTitle}
          </p>
          <h2 className="section-title" style={{ marginBottom: 36 }}>{H.equipeSub}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 24,
            }}
          >
            {TEAM.map((member, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: 16,
                    overflow: "hidden",
                    marginBottom: 14,
                    background: "#F0EBE5",
                  }}
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <p style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A", margin: "0 0 4px" }}>{member.name}</p>
                <p style={{ fontSize: 13, color: "#777169", margin: 0 }}>{isFr ? member.roleFr : member.roleEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROCHE ── */}
      <section id="approche" ref={approche.ref} className="section" style={{ paddingTop: 100, ...sectionAnim(approche.visible, 0.15) }}>
        <div className="container">
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#A8A29E", marginBottom: 6 }}>
            {H.approcheTitle}
          </p>
          <h2 className="section-title" style={{ marginBottom: 8 }}>{H.approcheSub}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
              marginTop: 28,
            }}
          >
            {approach.map((block, i) => (
              <div
                key={i}
                className="approach-card"
                style={{
                  padding: 24,
                  borderRadius: 16,
                  background: "#FAFAF8",
                  border: "1px solid #F0EBE5",
                  transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease",
                  cursor: "default",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#A8A29E",
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  {block.tag}
                </span>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#777169", margin: 0 }}>{block.body}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .approach-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          }
        `}</style>
      </section>

      {/* ── SIGNATURES ── */}
      <section ref={signatures.ref} className="section" style={{ paddingTop: 100, ...sectionAnim(signatures.visible, 0.2) }}>
        <div className="container">
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#A8A29E", marginBottom: 6 }}>
            {H.signaturesTitle}
          </p>
          <h2 className="section-title" style={{ marginBottom: 36 }}>{H.signaturesSub}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sigs.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  padding: "20px 24px",
                  background: "#FAFAF8",
                  borderRadius: 12,
                  border: "1px solid #F0EBE5",
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 300,
                    color: "#D0C8BE",
                    lineHeight: 1,
                    flexShrink: 0,
                    width: 48,
                  }}
                >
                  {s.num}
                </span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px", color: "#0A0A0A" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#777169", margin: 0 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALEURS ── */}
      <section ref={valeurs.ref} className="section" style={{ paddingTop: 100, ...sectionAnim(valeurs.visible, 0.25) }}>
        <div className="container">
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#A8A29E", marginBottom: 6 }}>
            {H.valeursTitle}
          </p>
          <h2 className="section-title" style={{ marginBottom: 36 }}>{H.valeursSub}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {values.map((v, i) => (
              <div
                key={i}
                style={{
                  padding: "24px 20px",
                  borderRadius: 12,
                  border: "1px solid #F0EBE5",
                  textAlign: "center",
                  transition: "background 0.2s",
                  cursor: "default",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", margin: "0 0 8px", letterSpacing: "0.02em" }}>
                  {v.title}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "#777169", margin: 0 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={cta.ref} className="section" style={{ paddingTop: 100, paddingBottom: 120, ...sectionAnim(cta.visible, 0.3) }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <div
            style={{
              padding: "48px 40px",
              background: "#0A0A0A",
              borderRadius: 20,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 300,
                color: "#fff",
                margin: "0 0 12px",
              }}
            >
              {H.ctaTitle}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 28px" }}>
              {H.ctaBody}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="https://app.mentivisOS.com"
                style={{
                  padding: "14px 28px",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#0A0A0A",
                  background: "#fff",
                  borderRadius: 10,
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
              >
                {H.ctaPrimary}
              </Link>
              <Link
                href={`/${lang}/contact`}
                style={{
                  padding: "14px 28px",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#fff",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                  transition: "background 0.15s",
                }}
              >
                {H.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .section-title {
          font-family: var(--font-sans);
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 300;
          line-height: 1.2;
          color: #3E3B38;
          margin: 0 0 24px;
          letter-spacing: -0.01em;
        }
        .section-body {
          font-family: var(--font-sans);
          font-size: 16px;
          line-height: 1.7;
          color: #777169;
          margin: 0 0 16px;
          max-width: 680px;
        }
        @media (max-width: 768px) {
          .section-title { margin-bottom: 16px; }
        }
      `}</style>
    </main>
  );
}
