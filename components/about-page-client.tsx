"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import CTABlock from "@/components/cta-block";
import PageHero from "@/components/page-hero";
import CmsPageHero from "@/components/cms-page-hero";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

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
    body: "Cadrage du projet, positionnement de marche, modèle economique. Ce qui rend le système viable avant même le premier inscrit.",
  },
  {
    tag: "Ingenierie pédagogique",
    title: "Ingenierie pédagogique",
    body: "Referentiels, certifications, parcours. Conception fine des objets pédagogiques et de leur evaluation par l'IA.",
  },
  {
    tag: "Marketing et admissions",
    title: "Marketing et admissions",
    body: "Recrutement des apprenants, notoriété, conversion. Du tunnel de candidature a l'identite de marque.",
  },
  {
    tag: "Conformite et déploiement",
    title: "Conformite et déploiement",
    body: "OPCO, dispositifs publics, certifications qualite, mise en oeuvre opérationnelle quotidienne.",
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
  { num: "01", title: "Obsession du resultat", body: "Pas du rapport. Un projet qui n'est pas lancé n'a pas existe." },
  { num: "02", title: "Maitrise du financement", body: "OPCO, dispositifs publics, montages hybrides. Le levier economique du projet." },
  { num: "03", title: "Approche full-stack", body: "Strategie, pédagogie, marketing, conformité. Sous un seul toit." },
  { num: "04", title: "Capacite a opèrer", body: "Pas seulement a conseiller. Nous tenons les renes jusqu'à la premiere promotion." },
];

const SIGS_EN = [
  { num: "01", title: "Results obsession", body: "Not reports. A project that hasn't launched doesn't exist." },
  { num: "02", title: "Funding mastery", body: "OPCO, public schemes, hybrid structures. The economic lever of the project." },
  { num: "03", title: "Full-stack approach", body: "Strategy, pedagogy, marketing, compliance. Under one roof." },
  { num: "04", title: "Ability to opérate", body: "Not just advisory. We hold the reins until the first cohort." },
];

const VALUES_FR = [
  { title: "Clarte", body: "Dire ce qui fonctionne. Eliminer le reste." },
  { title: "Execution", body: "Un projet n'existe que s'il est lancé." },
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

  const histoire = useVisible();
  const equipe = useVisible();
  const approche = useVisible();
  const signatures = useVisible();
  const valeurs = useVisible();

  const H = isFr ? {
    heroEyebrow: "À propos",
    heroHeadline: "MentivisOS est le système de formation native IA conçu par Mentivis",
    heroSub: "De la stratégie au déploiement opérationnel. Un seul OS pour former, certifier et faire grandir les talents.",
    convictionText: "Former n'est pas un cout. C'est un système de production de valeur.",
    convictionAuthor: "Steven Delcourt, Fondateur, Mentivis",
    histoireTitle: "Ne d'un constat opérationnel",
    histoireBody1: "Les fondateurs de Mentivis ont déjà cree des écoles ensemble. Pedagogie, développement commercial, marketing, conformité, opérations. Toutes les dimensions du metier.",
    histoireBody2: "Ils se sont associes pour une raison precise. Les mutations rapides de l'education et de la formation exigent un acteur spécialisé, capable de faire le lien entre entreprises, dispositifs de formation et enjeux a venir.",
    histoireBody3: "Un choix des l'origine. Ne pas faire du conseil abstrait, mais construire des dispositifs qui fonctionnent réellement.",
    equipeTitle: "L'équipe",
    equipeSub: "Les fondateurs",
    approcheTitle: "Notre approche",
    approcheSub: "Quatre blocs intégrés. Un seul objectif. Un système viable, finance, activable rapidement.",
    signaturesTitle: "Ce qui nous distingue",
    signaturesSub: "Quatre signatures.",
    valeursTitle: "Nos valeurs",
    valeursSub: "Cinq regles de fonctionnement.",
  } : {
    heroEyebrow: "About",
    heroHeadline: "MentivisOS is the native AI training system built by Mentivis",
    heroSub: "From strategy to operational deployment. A single OS to train, certify, and grow talent.",
    equipeSub: "The founders",
    approcheTitle: "Our approach",
    approcheSub: "Four integrated blocks. A single goal. A viable, funded, rapidly activatable system.",
    signaturesTitle: "What sets us apart",
    signaturesSub: "Four signatures.",
    valeursTitle: "Our values",
    valeursSub: "Five opérating rules.",
  };

  const approach = isFr ? APPROACH_FR : APPROACH_EN;
    const sigs = isFr ? SIGS_FR : SIGS_EN;
  const values = isFr ? VALUES_FR : VALUES_EN;

  return (
    <main style={{ background: "#ffffff" }}>
      <CmsPageHero
        page="about"
        lang={lang}
        defaults={{
          eyebrow: H.heroEyebrow,
          headline: H.heroHeadline,
          subheadline: H.heroSub,
        }}
      />

      {/* CONVICTION */}
      <section className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)" }}>
        <div className="container">
          <Image
            src="/images/former.avif"
            alt="Former n'est pas un coût — Steven Delcourt"
            width={2400}
            height={1350}
            style={{ width: "100%", height: "auto", borderRadius: 24, display: "block" }}
          />
        </div>
      </section>

      {/* ── INSIGHTS ── */}
      <section className="section" style={{ paddingTop: "clamp(48px, 6vw, 80px)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                tag: "Notes stratégiques",
                date: "28 mars 2026",
                title: "Le poste est mort, vive la compétence",
                author: "Marie Castelli",
                href: "https://www.mentivis.com/fr/insights/le-poste-est-mort-vive-la-competence/",
              },
              {
                tag: "Annonces",
                date: "16 mars 2026",
                title: "Les entreprises sont les prochaines grandes écoles",
                author: "Mentivis",
                href: "https://www.mentivis.com/fr/insights/les-entreprises-sont-les-prochaines-grandes-ecoles/",
              },
              {
                tag: "Perspectives",
                date: "26 janvier 2026",
                title: "L\u2019IA comme nouvelle alphab\u00e9tisation : reprendre la bataille de la lumi\u00e8re",
                author: "Roxan Roum\u00e9gas (PhD)",
                href: "https://www.mentivis.com/fr/insights/lia-comme-nouvelle-alphabetisation-reprendre-la-bataille-de-la-lumiere/",
              },
            ].map((article, i) => (
              <a
                key={i}
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 24,
                  borderRadius: 16,
                  border: "1px solid #e5e5e5",
                  background: "#ffffff",
                  textDecoration: "none",
                  transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease",
                }}
                className="insight-card"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4e4e4e", fontWeight: 500 }}>
                    {article.tag}
                  </span>
                  <span style={{ fontSize: 11, color: "#aaa" }}>{article.date}</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.4, color: "#000", margin: "0 0 6px", flex: 1 }}>
                  {article.title}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{article.author}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" viewBox="0 0 12 13" fill="none" style={{ flexShrink: 0, color: "#bbb" }}>
                    <path d="M5.60002 0.899994C5.82094 0.899994 6.00002 1.07908 6.00002 1.29999C6.00002 1.52091 5.82094 1.69999 5.60002 1.69999H1.60002C1.37911 1.69999 1.20002 1.87908 1.20002 2.09999V10.9C1.20002 11.1209 1.37911 11.3 1.60002 11.3H10.4C10.6209 11.3 10.8 11.1209 10.8 10.9V6.89999C10.8 6.67908 10.9791 6.49999 11.2 6.49999C11.4209 6.49999 11.6 6.67908 11.6 6.89999V10.9C11.6 11.5627 11.0628 12.1 10.4 12.1H1.60002C0.937283 12.1 0.400024 11.5627 0.400024 10.9V2.09999C0.400024 1.43725 0.937283 0.899994 1.60002 0.899994H5.60002ZM11.2 0.899994C11.2299 0.899994 11.2598 0.903486 11.2891 0.91015C11.3078 0.91442 11.3259 0.920467 11.3438 0.927338C11.3496 0.9296 11.3552 0.932601 11.361 0.93515C11.3771 0.942258 11.3927 0.950169 11.4078 0.959369C11.414 0.963129 11.4206 0.966183 11.4266 0.970306C11.4466 0.984054 11.4654 0.999763 11.4828 1.01718L11.5344 1.07968C11.5431 1.09292 11.5485 1.1079 11.5555 1.12187C11.56 1.13085 11.5657 1.13915 11.5696 1.14843C11.5832 1.18169 11.5911 1.21637 11.5953 1.25156C11.5973 1.26761 11.6 1.28365 11.6 1.29999V4.49999C11.6 4.72091 11.4209 4.89999 11.2 4.89999C10.9791 4.89999 10.8 4.72091 10.8 4.49999V2.26562L7.48284 5.58281C7.32663 5.73902 7.07342 5.73902 6.91721 5.58281C6.761 5.4266 6.761 5.17339 6.91721 5.01718L10.2344 1.69999H8.00003C7.77911 1.69999 7.60003 1.52091 7.60003 1.29999C7.60003 1.07908 7.77911 0.899994 8.00003 0.899994H11.2Z" fill="currentColor" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#999" }}>
            {isFr ? "Articles publiés sur mentivis.com" : "Articles published on mentivis.com"}
          </p>
        </div>
        <style>{`
          .insight-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          }
          @media (max-width: 768px) {
            .insight-card { grid-column: 1 / -1; }
          }
          @media (max-width: 480px) {
            .insight-card { grid-column: 1 / -1; }
          }
        `}</style>
      </section>

      {/* ── HISTOIRE ── */}
      <section id="histoire" ref={histoire.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(histoire.visible, 0.05) }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="section-title">{H.histoireTitle}</h2>
          <p className="section-body">{H.histoireBody1}</p>
          <p className="section-body">{H.histoireBody2}</p>
          <div
            style={{
              padding: "20px 24px",
              background: "#f5f5f5",
              borderRadius: 12,
              borderLeft: "3px solid #000000",
              marginTop: 8,
            }}
          >
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#000000", margin: 0, fontWeight: 450 }}>
              {H.histoireBody3}
            </p>
          </div>
        </div>
      </section>

      {/* ── EQUIPE ── */}
      <section id="equipe" ref={equipe.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(equipe.visible, 0.1) }}>
        <div className="container">
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4e4e4e", marginBottom: 6 }}>
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
              <div key={i}>
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 14,
              background: "#e5e5e5",
            }}
          >
            <img
              src={member.img}
              alt={member.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
                <p style={{ fontSize: 15, fontWeight: 500, color: "#000000", margin: "0 0 4px" }}>{member.name}</p>
                <p style={{ fontSize: 13, color: "#4e4e4e", margin: 0 }}>{isFr ? member.roleFr : member.roleEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROCHE ── */}
      <section id="approche" ref={approche.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(approche.visible, 0.15) }}>
        <div className="container">
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4e4e4e", marginBottom: 6 }}>
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
                  background: "#ffffff",
                  border: "1px solid #e5e5e5",
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
                    color: "#4e4e4e",
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  {block.tag}
                </span>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#4e4e4e", margin: 0 }}>{block.body}</p>
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
      <section ref={signatures.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(signatures.visible, 0.2) }}>
        <div className="container">
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4e4e4e", marginBottom: 6 }}>
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
                  background: "#ffffff",
                  borderRadius: 12,
                  border: "1px solid #e5e5e5",
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
                  <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px", color: "#000000" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#4e4e4e", margin: 0 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALEURS ── */}
      <section ref={valeurs.ref} className="section" style={{ paddingTop: "clamp(64px, 8vw, 120px)", ...sectionAnim(valeurs.visible, 0.25) }}>
        <div className="container">
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4e4e4e", marginBottom: 6 }}>
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
                  border: "1px solid #e5e5e5",
                  transition: "background 0.2s",
                  cursor: "default",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 500, color: "#000000", margin: "0 0 8px", letterSpacing: "0.02em" }}>
                  {v.title}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "#4e4e4e", margin: 0 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABlock lang={lang} variant="final" />

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
        @media (max-width: 768px) {
          .section-title { margin-bottom: 16px; }
        }
      `}</style>
    </main>
  );
}
