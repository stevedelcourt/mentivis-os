"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";

interface SectorShowcaseProps {
  lang: Locale;
}

interface SubTabAdvantage {
  text: string;
  icon: string;
}

interface SubTab {
  label: string;
  advantages: SubTabAdvantage[];
}

interface BottomBar {
  systemName: string;
  tagline: string;
  cta: string;
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
  image: string;
  subTabs?: SubTab[];
  labelSection?: string;
  bottomBar?: BottomBar;
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
    image: "/images/formation.avif",
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
    image: "/images/student.avif",
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
    image: "/images/ministere.avif",
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
    image: "/images/workers.avif",
  },
  {
    id: "open",
    title: "MentivisOS Open",
    members: [],
    advantages: [],
    gradient: "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)",
    accent: "#7030A0",
    tag: "Gratuit pour toujours",
    orbClass: "",
    image: "/images/student.avif",
    labelSection: "Pour tous",
    subTabs: [
      {
        label: "Étudiants",
        advantages: [
          { text: "Parcours générés par IA adaptés à ton niveau et à tes objectifs", icon: "sparkles" },
          { text: "Explorer des domaines hors de ta formation", icon: "arrows-exchange" },
          { text: "Monter en compétences sur des sujets qui font la différence en entretien", icon: "certificate" },
          { text: "Aucun prérequis, aucune durée imposée, aucun frais", icon: "target" },
        ],
      },
      {
        label: "Lycéens",
        advantages: [
          { text: "Découvrir des filières et des métiers pour préparer ton orientation", icon: "sparkles" },
          { text: "Apprendre autrement, à ton rythme, sur ce qui t'intéresse vraiment", icon: "brain" },
          { text: "Accès libre, environnement sécurisé", icon: "shield-check" },
          { text: "Aucun prérequis, aucune durée imposée, aucun frais", icon: "target" },
        ],
      },
      {
        label: "Salariés",
        advantages: [
          { text: "Monter en compétences sur ton métier ou en dehors de ton poste", icon: "sparkles" },
          { text: "Préparer une reconversion sans attendre un dispositif employeur", icon: "arrows-exchange" },
          { text: "Apprendre à son rythme, en dehors des heures de travail", icon: "clock" },
          { text: "Aucun prérequis, aucune durée imposée, aucun frais", icon: "target" },
        ],
      },
      {
        label: "Indépendants",
        advantages: [
          { text: "Développer de nouvelles compétences sans budget formation", icon: "sparkles" },
          { text: "Explorer des outils et pratiques adjacents à ton activité", icon: "tool" },
          { text: "Pivoter ou élargir ton offre en testant une nouvelle direction", icon: "arrows-exchange" },
          { text: "Aucun prérequis, aucune durée imposée, aucun frais", icon: "target" },
        ],
      },
      {
        label: "Demandeurs d'emploi",
        advantages: [
          { text: "Reprendre confiance et progresser pendant la transition", icon: "sparkles" },
          { text: "Explorer un nouveau secteur avant de s'engager", icon: "arrows-exchange" },
          { text: "Acquérir des compétences valorisables en entretien", icon: "certificate" },
          { text: "Aucun prérequis, aucune durée imposée, aucun frais", icon: "target" },
        ],
      },
      {
        label: "Particuliers",
        advantages: [
          { text: "Apprendre ce qu'on a toujours voulu apprendre, sans justification", icon: "sparkles" },
          { text: "Suivre une curiosité par plaisir ou intérêt personnel", icon: "heart" },
          { text: "Avancer à son rythme, sans contrainte de validation", icon: "clock" },
          { text: "Aucun prérequis, aucune durée imposée, aucun frais", icon: "target" },
        ],
      },
      {
        label: "Retraités",
        advantages: [
          { text: "Rester actif intellectuellement et découvrir de nouveaux sujets", icon: "sparkles" },
          { text: "Apprendre à son rythme, sans pression ni évaluation", icon: "brain" },
          { text: "Partager des parcours avec ses proches ou explorer seul", icon: "heart" },
          { text: "Aucun prérequis, aucune durée imposée, aucun frais", icon: "target" },
        ],
      },
    ],
    bottomBar: {
      systemName: "MentivisOS Open",
      tagline: "La plateforme d'apprentissage libre, pour toutes les envies",
      cta: "Gratuit !",
    },
  },
];

export default function SectorShowcase({ lang }: SectorShowcaseProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeSubTabIdx, setActiveSubTabIdx] = useState(0);
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
    setActiveSubTabIdx(0);
  };

  const sector = SECTORS[activeIdx];
  const activeSubTab = sector.subTabs?.[activeSubTabIdx];

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
            Quelles organisations peuvent former, recruter et piloter les compétences depuis un seul système ?
          </h2>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${SECTORS.length}, 1fr)`,
            gap: 8,
            marginBottom: sector.subTabs ? 12 : 32,
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
                padding: "14px 16px",
                borderRadius: 12,
                border: "1.5px solid",
                borderColor: activeIdx === i ? "#757676" : "rgba(0,0,0,0.08)",
                background: activeIdx === i ? "#757676" : "transparent",
                color: activeIdx === i ? "#ffffff" : "#3a3a3a",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.01em",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                textAlign: "center",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Sub-tabs */}
        {sector.subTabs && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 32,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
            }}
          >
            {sector.subTabs.map((st, i) => (
              <button
                key={st.label}
                onClick={() => setActiveSubTabIdx(i)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1.5px solid",
                  borderColor: activeSubTabIdx === i ? "#7030A0" : "rgba(0,0,0,0.08)",
                  background: activeSubTabIdx === i ? "rgba(112, 48, 160, 0.08)" : "transparent",
                  color: activeSubTabIdx === i ? "#7030A0" : "#3a3a3a",
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: activeSubTabIdx === i ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                  whiteSpace: "nowrap",
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}

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
                color: "#4e4e4e",
                marginBottom: 16,
              }}
            >
              {sector.labelSection || sector.title}
            </p>

            {/* Members (only for non-subTab sectors) */}
            {!sector.subTabs && (
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
            )}

            {/* Advantages or Sub-tab advantages */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(sector.subTabs && activeSubTab ? activeSubTab.advantages : sector.advantages).map((adv, i) => {
                const text = typeof adv === "string" ? adv : adv.text;
                const iconName = typeof adv === "string" ? null : adv.icon;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#757676",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {iconName ? (
                        <Icon name={iconName} size={10} color="#fff" />
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
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
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Box — Image Card */}
          <div
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              minHeight: 360,
            }}
          >
            <img
              src={sector.image}
              alt={sector.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
              }}
            />
            {/* Glass tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(117, 118, 118, 0.08)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(117, 118, 118, 0.18)",
                borderRadius: 10,
                padding: "6px 12px 6px 8px",
                position: "absolute",
                top: 20,
                left: 20,
              }}
            >
              <span
                style={{
                  color: "#757676",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                MentivisOS
              </span>
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
          {sector.bottomBar ? (
            <>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  fontWeight: 400,
                  color: "#4e4e4e",
                  lineHeight: 1.5,
                }}
              >
                <strong>{sector.bottomBar.systemName}</strong> — {sector.bottomBar.tagline}
              </p>
              <Link
                href={`/${lang}/demo`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#7030A0",
                  background: "rgba(112, 48, 160, 0.1)",
                  borderRadius: 8,
                  padding: "12px 24px",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(112, 48, 160, 0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(112, 48, 160, 0.1)";
                }}
              >
                {sector.bottomBar.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  fontWeight: 400,
                  color: "#4e4e4e",
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
            </>
          )}
        </div>
      </div>

      <style>{`
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

function Icon({ name, size, color }: { name: string; size: number; color: string }) {
  const s = size || 12;
  const c = color || "currentColor";
  const svgProps = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "sparkles":
      return <svg {...svgProps}><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" /><path d="M8 5l.5 1.5L10 7l-1.5.5L8 9l-.5-1.5L6 7l1.5-.5z" /><path d="M17 14l.5 1.5L19 16l-1.5.5L17 18l-.5-1.5L15 16l1.5-.5z" /></svg>;
    case "arrows-exchange":
      return <svg {...svgProps}><path d="M7 3l-4 4 4 4" /><path d="M3 7h18" /><path d="M17 21l4-4-4-4" /><path d="M21 17H3" /></svg>;
    case "certificate":
      return <svg {...svgProps}><circle cx="12" cy="12" r="9" /><polyline points="9 12 11 14 15 10" /></svg>;
    case "target":
      return <svg {...svgProps}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
    case "brain":
      return <svg {...svgProps}><path d="M12 4a4 4 0 0 1 4 4c0 1.5-.5 2.5-1.5 3.5A4 4 0 0 1 12 17a4 4 0 0 1-2.5-5.5C8.5 10.5 8 9.5 8 8a4 4 0 0 1 4-4z" /><path d="M4 8a3 3 0 0 1 3-3" /><path d="M20 8a3 3 0 0 0-3-3" /><path d="M4 16a3 3 0 0 0 3 3" /><path d="M20 16a3 3 0 0 1-3 3" /></svg>;
    case "shield-check":
      return <svg {...svgProps}><path d="M12 2l8 4v6c0 4-3.5 7.5-8 9-4.5-1.5-8-5-8-9V6z" /><polyline points="9 12 11 14 15 10" /></svg>;
    case "clock":
      return <svg {...svgProps}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    case "tool":
      return <svg {...svgProps}><path d="M10 10l-6 6a2 2 0 0 0 0 3l1 1a2 2 0 0 0 3 0l6-6" /><path d="M14 10l4-4a2 2 0 0 0 0-3l-1-1a2 2 0 0 0-3 0l-4 4" /><path d="M18 6l2 2" /></svg>;
    case "heart":
      return <svg {...svgProps}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>;
    default:
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>;
  }
}
