"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";

interface SectorShowcaseProps {
  lang: Locale;
}

interface Sector {
  id: string;
  title: string;
  members: string[];
  advantages: string[];
  gradient: string;
  accent: string;
  tag: string;
  orbClass: string;
}

const SECTORS: Sector[] = [
  {
    id: "entreprises",
    title: "Entreprises & Réseaux",
    members: [
      "Entreprises", "ETI", "Grands Groupes", "PME", "ESN",
      "Campus d'entreprise", "Franchises", "Santé"
    ],
    advantages: [
      "Parcours générés par IA, calibrés par métier",
      "Pilotage centralisé à l'échelle du groupe",
      "Recrutement calibré aux besoins opérationnels",
      "Onboarding ciblé par profil et site",
      "Déploiement multi-sites, multi-pays",
      "Connexion SIRH, ATS, outils internes"
    ],
    gradient: "linear-gradient(135deg, #1A2B80 0%, #7030A0 50%, #B02050 100%)",
    accent: "#7030A0",
    tag: "8 types d'organisations",
    orbClass: "sector-orb-purple",
  },
  {
    id: "formation",
    title: "Formation & Éducation",
    members: [
      "CFA", "Écoles", "Universités", "Organismes de formation", "Centres de formation internes"
    ],
    advantages: [
      "Formation personnalisée par apprenant",
      "Recalibrage pédagogique automatique",
      "Conformité Qualiopi et certification intégrée",
      "Gestion OPCO et financements automatiques",
      "Évaluation des acquis, pas de la consommation",
      "Workflows pédagogiques automatisés"
    ],
    gradient: "linear-gradient(135deg, #243A1A 0%, #607020 50%, #909840 100%)",
    accent: "#B07820",
    tag: "5 organismes de formation",
    orbClass: "sector-orb-amber",
  },
  {
    id: "public",
    title: "Public & Institutionnel",
    members: [
      "Collectivités", "Ministères", "Agences publiques", "Réseaux associatifs", "Acteurs de l'insertion"
    ],
    advantages: [
      "Diagnostic des écarts territoriaux",
      "Recommandations adaptées aux politiques publiques",
      "Mise en oeuvre rapide, sans refonte",
      "Optimisation des budgets formation publics",
      "Mesure d'impact sur l'emploi et l'insertion",
      "Infrastructure souveraine et évolutive"
    ],
    gradient: "linear-gradient(135deg, #A03020 0%, #C05828 50%, #D08840 100%)",
    accent: "#C05828",
    tag: "5 acteurs institutionnels",
    orbClass: "sector-orb-rust",
  },
  {
    id: "professionnels",
    title: "Professionnels & Métiers",
    members: [
      "Cabinets de conseil", "Opérateurs de compétences", "Fédérations professionnelles", "Branches métiers"
    ],
    advantages: [
      "Analyse de faisabilité avant prescription",
      "Scoring technique et opérationnel des parcours",
      "Agents IA métier, embarqués dans les référentiels",
      "Tableaux de bord par branche et fédération",
      "Veille compétences et upskilling continu",
      "Orchestration formation et placement"
    ],
    gradient: "linear-gradient(135deg, #1A4A6C 0%, #2D7A9F 50%, #4D9AAF 100%)",
    accent: "#2D7A9F",
    tag: "4 fédérations métiers",
    orbClass: "sector-orb-sky",
  },
];

export default function SectorShowcase({ lang }: SectorShowcaseProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectSector = (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
  };

  const sector = SECTORS[activeIdx];

  return (
    <section ref={sectionRef} style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        {/* Headline */}
        <div
          style={{
            maxWidth: 760,
            marginBottom: 48,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <h2
            className="t-display"
            style={{
              fontSize: "clamp(24px, 3.5vw, 40px)",
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              color: "#1a1a1a",
            }}
          >
            Pour les organisations qui veulent former, recruter et piloter les compétences depuis un seul système.
          </h2>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 32,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
        >
          {SECTORS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => selectSector(i)}
              style={{
                padding: "16px 20px",
                borderRadius: 12,
                border: "1.5px solid",
                borderColor: activeIdx === i ? s.accent : "rgba(0,0,0,0.08)",
                background: activeIdx === i ? s.accent : "transparent",
                color: activeIdx === i ? "#ffffff" : "#3a3a3a",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.01em",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                textAlign: "left",
                lineHeight: 1.4,
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}
        >
          {/* Left Box */}
          <div
            style={{
              background: "#f8f8f8",
              borderRadius: 24,
              padding: "36px 32px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#777169",
                marginBottom: 16,
              }}
            >
              {sector.title}
            </p>

            {/* Members */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px 8px",
                marginBottom: 32,
              }}
            >
              {sector.members.map((m) => (
                <span
                  key={m}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "#3a3a3a",
                    padding: "5px 12px",
                    borderRadius: 999,
                    background: "rgba(0,0,0,0.04)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Advantages */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sector.advantages.map((adv, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: sector.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: "#3a3a3a",
                    }}
                  >
                    {adv}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Box — Orb Gradient Card */}
          <div
            className={sector.orbClass}
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              minHeight: 360,
            }}
          >
            {/* Colored tag */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                zIndex: 10,
                padding: "5px 12px",
                borderRadius: 999,
                background: sector.accent,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 500,
                color: "#ffffff",
                letterSpacing: "0.02em",
              }}
            >
              {sector.tag}
            </div>
          </div>
        </div>

        {/* Baseline + CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 48,
            flexWrap: "wrap",
            gap: 20,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              fontWeight: 400,
              color: "#777169",
              lineHeight: 1.5,
            }}
          >
            Le système opérationnel des compétences, du recrutement à l'impact
          </p>
          <Link
            href={`/${lang}/demo`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              color: "#ffffff",
              background: "#1a1a1a",
              borderRadius: 8,
              padding: "12px 24px",
              textDecoration: "none",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1a1a1a";
            }}
          >
            Demander une démo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        .sector-orb-purple {
          background:
            radial-gradient(ellipse 70% 60% at 35% 28%,#7A6CC4 0%,transparent 58%),
            radial-gradient(ellipse 56% 56% at 65% 42%,#A89AD8 0%,transparent 56%),
            radial-gradient(ellipse 62% 66% at 54% 78%,#F0B090 0%,transparent 58%),
            radial-gradient(ellipse 44% 44% at 80% 22%,#B0A0E0 0%,transparent 50%),
            #DCC8E8;
        }
        .sector-orb-amber {
          background:
            radial-gradient(ellipse 64% 58% at 36% 28%,#F0C25C 0%,transparent 56%),
            radial-gradient(ellipse 58% 64% at 66% 54%,#E89868 0%,transparent 60%),
            radial-gradient(ellipse 68% 50% at 50% 84%,#F0D098 0%,transparent 56%),
            #F4D8B0;
        }
        .sector-orb-rust {
          background:
            radial-gradient(ellipse 66% 58% at 36% 26%,#D85838 0%,transparent 58%),
            radial-gradient(ellipse 58% 66% at 66% 52%,#E87858 0%,transparent 60%),
            radial-gradient(ellipse 70% 48% at 52% 82%,#F09060 0%,transparent 56%),
            #E8B898;
        }
        .sector-orb-sky {
          background:
            radial-gradient(ellipse 64% 58% at 36% 28%,#5688C8 0%,transparent 58%),
            radial-gradient(ellipse 58% 64% at 66% 54%,#88B0D8 0%,transparent 60%),
            radial-gradient(ellipse 68% 50% at 50% 84%,#A0C0E8 0%,transparent 56%),
            #C0D8F0;
        }
        @media (max-width: 768px) {
          .container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          .container > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
