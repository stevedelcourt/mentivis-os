"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getT, Locale } from "@/lib/i18n";

interface Satellite {
  id: string;
  label: string;
  sublabel?: string;
  lines: string[];
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  steps: number[]; // which workflow steps this module relates to
}

const SATELLITES: Record<string, Satellite[]> = {
  fr: [
    {
      id: "formation",
      label: "FORMATION",
      lines: ["Génère les contenus", "Programme calibré par profil"],
      x: 50, y: 12,
      steps: [1, 2, 3, 4, 5],
    },
    {
      id: "talentos",
      label: "TALENTOS",
      sublabel: "Recrutement",
      lines: ["Analyse les profils", "Score d'adéquation"],
      x: 14, y: 50,
      steps: [1, 3, 6],
    },
    {
      id: "upskilling",
      label: "UPSKILLING",
      lines: ["Suit chaque parcours", "Score de progression continu"],
      x: 86, y: 50,
      steps: [4, 5, 6, 7],
    },
    {
      id: "api",
      label: "MENTIVIS API",
      sublabel: "Intégrations",
      lines: ["SIRH · ATS · Outils internes", "Sans refonte d'organisation"],
      x: 50, y: 88,
      steps: [1, 7],
    },
    {
      id: "intel",
      label: "MENTIVISINTEL",
      sublabel: "Pilotage et reporting",
      lines: ["Mesure l'impact réel", "Décide sur les bons chiffres"],
      x: 82, y: 18,
      steps: [3, 7],
    },
  ],
  en: [
    {
      id: "formation",
      label: "LEARNING",
      lines: ["Generates content", "Profile-calibrated program"],
      x: 50, y: 12,
      steps: [1, 2, 3, 4, 5],
    },
    {
      id: "talentos",
      label: "TALENTOS",
      sublabel: "Recruitment",
      lines: ["Profile analysis", "Fit score"],
      x: 14, y: 50,
      steps: [1, 3, 6],
    },
    {
      id: "upskilling",
      label: "UPSKILLING",
      lines: ["Tracks every journey", "Continuous progress score"],
      x: 86, y: 50,
      steps: [4, 5, 6, 7],
    },
    {
      id: "api",
      label: "MENTIVIS API",
      sublabel: "Integrations",
      lines: ["HRIS · ATS · Internal tools", "No organizational overhaul"],
      x: 50, y: 88,
      steps: [1, 7],
    },
    {
      id: "intel",
      label: "MENTIVISINTEL",
      sublabel: "Dashboard & reporting",
      lines: ["Measures real impact", "Decides on real numbers"],
      x: 82, y: 18,
      steps: [3, 7],
    },
  ],
};

const WORKFLOW_STEPS_FR = [
  { n: "01", title: "Profil utilisateur", desc: "Saisir le profil, l'objectif et les contraintes en quelques secondes." },
  { n: "02", title: "Référentiel cible", desc: "Cartographier le référentiel métier visé et son périmètre." },
  { n: "03", title: "Diagnostic", desc: "Score de couverture, risque résiduel, durée. Moins d'une minute." },
  { n: "04", title: "Modules calculés", desc: "Découpage, ordonnancement critique, profondeur ajustée." },
  { n: "05", title: "Programme généré", desc: "Théorie, projet pratique, évaluation. Module par module." },
  { n: "06", title: "Assistant intégré", desc: "Accompagnement embarqué qui ne sort jamais du sujet." },
  { n: "07", title: "Bilan d'impact", desc: "Mesure des acquis, ajustement continu, reporting clair." },
];

const WORKFLOW_STEPS_EN = [
  { n: "01", title: "User profile", desc: "Enter profile, objective and constraints in seconds." },
  { n: "02", title: "Target framework", desc: "Map the target job framework and its scope." },
  { n: "03", title: "Diagnostic", desc: "Coverage score, residual risk, duration. Under one minute." },
  { n: "04", title: "Calculated modules", desc: "Breakdown, critical ordering, adjusted depth." },
  { n: "05", title: "Generated program", desc: "Theory, practical project, assessment. Module by module." },
  { n: "06", title: "Embedded assistant", desc: "Built-in coaching that never leaves the subject." },
  { n: "07", title: "Impact review", desc: "Measured gains, continuous adjustment, clear reporting." },
];

const BADGES_FR = ["Diagnostic IA", "Programme adaptatif", "Assistant pédagogique", "Conformité Qualiopi"];
const BADGES_EN = ["AI Diagnostic", "Adaptive Program", "Pedagogical Assistant", "Qualiopi Compliant"];

function StepConnector({ progress }: { progress: number }) {
  return (
    <div style={{ position: "relative", width: 40, height: 2, background: "rgba(200,169,110,0.08)", flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, height: "100%",
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, rgba(200,169,110,0.3), rgba(200,169,110,0.6))",
          transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${progress * 100}%`,
          transform: "translate(-50%, -50%)",
          width: 6, height: 6,
          borderRadius: "50%",
          background: progress > 0 ? "rgba(200,169,110,0.7)" : "rgba(200,169,110,0.15)",
          boxShadow: progress > 0 ? "0 0 8px rgba(200,169,110,0.4)" : "none",
          transition: "all 0.6s ease",
        }}
      />
    </div>
  );
}

export default function EngineShowcase({ lang }: { lang: Locale }) {
  const t = getT(lang);
  const isFr = lang === "fr";
  const sats = SATELLITES[lang];
  const steps = isFr ? WORKFLOW_STEPS_FR : WORKFLOW_STEPS_EN;
  const badges = isFr ? BADGES_FR : BADGES_EN;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setEntered(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activeSteps = activeId
    ? sats.find((s) => s.id === activeId)?.steps ?? []
    : [];

  const handleSatClick = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#08080e",
        position: "relative",
        overflow: "hidden",
        padding: "var(--section-gap-sm) 0",
      }}
    >
      {/* Blueprint grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(200,169,110,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(4,4,10,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(200,169,110,0.45)",
              marginBottom: 16,
            }}
          >
            {isFr ? "ARCHITECTURE SYSTÈME" : "SYSTEM ARCHITECTURE"}
          </p>
          <h2
            className="t-display"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#e2ddd6",
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            {isFr
              ? "Un seul moteur. Trois modules. Un seul référentiel."
              : "One engine. Three modules. One framework."}
          </h2>
        </div>

        {/* ── Interactive Diagram ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 900,
            margin: "0 auto 64px",
            aspectRatio: "16 / 10",
            minHeight: 420,
          }}
        >
          {/* Connector lines (SVG behind everything) */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}
          >
            <defs>
              <pattern id="dash" width="6" height="6" patternUnits="userSpaceOnUse">
                <line x1="0" y1="3" x2="3" y2="3" stroke="rgba(200,169,110,0.18)" strokeWidth="0.4" />
              </pattern>
            </defs>
            {sats.map((sat) => {
              const isActive = activeId === sat.id;
              const isDimmed = activeId && !isActive;
              return (
                <g key={`conn-${sat.id}`}>
                  <line
                    x1="50"
                    y1="50"
                    x2={String(sat.x)}
                    y2={String(sat.y)}
                    stroke={isActive ? "rgba(200,169,110,0.5)" : isDimmed ? "rgba(200,169,110,0.06)" : "rgba(200,169,110,0.2)"}
                    strokeWidth={isActive ? "0.5" : "0.3"}
                    strokeDasharray={isActive ? "2 1.5" : "1.5 2"}
                    style={{ transition: "all 0.4s ease" }}
                  />
                  {/* Data pulse dot */}
                  {isActive && (
                    <circle r="1.2" fill="rgba(200,169,110,0.8)">
                      <animateMotion
                        dur="1.2s"
                        repeatCount="indefinite"
                        path={`M50,50 L${sat.x},${sat.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Satellites */}
          {sats.map((sat, idx) => {
            const isActive = activeId === sat.id;
            const isDimmed = activeId && !isActive;
            return (
              <button
                key={sat.id}
                onClick={() => handleSatClick(sat.id)}
                style={{
                  position: "absolute",
                  left: `${sat.x}%`,
                  top: `${sat.y}%`,
                  transform: `translate(-50%, -50%) scale(${isActive ? 1.08 : isDimmed ? 0.92 : 1})`,
                  zIndex: isActive ? 10 : 2,
                  opacity: entered ? (isDimmed ? 0.35 : 1) : 0,
                  transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${entered ? idx * 0.08 : 0}s`,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 12,
                  textAlign: "left",
                  minWidth: 180,
                }}
              >
                {/* Corner brackets */}
                <div style={{ position: "relative", padding: "16px 18px" }}>
                  {/* Top-left bracket */}
                  <div style={{ position: "absolute", top: 0, left: 0, width: 14, height: 14, borderTop: `1px solid ${isActive ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.35)"}`, borderLeft: `1px solid ${isActive ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.35)"}`, transition: "all 0.4s ease" }} />
                  {/* Top-right bracket */}
                  <div style={{ position: "absolute", top: 0, right: 0, width: 14, height: 14, borderTop: `1px solid ${isActive ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.35)"}`, borderRight: `1px solid ${isActive ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.35)"}`, transition: "all 0.4s ease" }} />
                  {/* Bottom-left bracket */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, width: 14, height: 14, borderBottom: `1px solid ${isActive ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.35)"}`, borderLeft: `1px solid ${isActive ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.35)"}`, transition: "all 0.4s ease" }} />
                  {/* Bottom-right bracket */}
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderBottom: `1px solid ${isActive ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.35)"}`, borderRight: `1px solid ${isActive ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.35)"}`, transition: "all 0.4s ease" }} />

                  {/* Glow backdrop */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -1,
                      borderRadius: 2,
                      background: isActive ? "rgba(200,169,110,0.06)" : "transparent",
                      transition: "background 0.4s ease",
                      pointerEvents: "none",
                    }}
                  />

                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 9,
                      fontWeight: 500,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: isActive ? "rgba(200,169,110,0.75)" : "rgba(200,169,110,0.5)",
                      marginBottom: 6,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {sat.label}
                  </p>
                  {sat.sublabel && (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 10,
                        color: isActive ? "rgba(226,221,214,0.55)" : "rgba(226,221,214,0.35)",
                        marginBottom: 8,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {sat.sublabel}
                    </p>
                  )}
                  {sat.lines.map((line, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        fontWeight: 300,
                        color: isActive ? "rgba(226,221,214,0.85)" : "rgba(226,221,214,0.55)",
                        lineHeight: 1.5,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </button>
            );
          })}

          {/* Central Hub */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 5,
              textAlign: "center",
              opacity: entered ? 1 : 0,
              transition: "opacity 0.6s ease 0.15s",
            }}
          >
            {/* Corner brackets */}
            <div style={{ position: "relative", padding: "28px 36px" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 18, height: 18, borderTop: "1.5px solid rgba(200,169,110,0.85)", borderLeft: "1.5px solid rgba(200,169,110,0.85)" }} />
              <div style={{ position: "absolute", top: 0, right: 0, width: 18, height: 18, borderTop: "1.5px solid rgba(200,169,110,0.85)", borderRight: "1.5px solid rgba(200,169,110,0.85)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: 18, height: 18, borderBottom: "1.5px solid rgba(200,169,110,0.85)", borderLeft: "1.5px solid rgba(200,169,110,0.85)" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 18, height: 18, borderBottom: "1.5px solid rgba(200,169,110,0.85)", borderRight: "1.5px solid rgba(200,169,110,0.85)" }} />

              {/* Pulsing glow */}
              <div
                style={{
                  position: "absolute",
                  inset: -2,
                  borderRadius: 2,
                  background: "rgba(200,169,110,0.04)",
                  animation: "engineGlow 4s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />

              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 8,
                  fontWeight: 500,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(200,169,110,0.55)",
                  marginBottom: 10,
                }}
              >
                {isFr ? "MOTEUR" : "ENGINE"}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  fontWeight: 500,
                  color: "#c8a96e",
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              >
                MentivisOS
              </p>
              <div style={{ width: 60, height: 1, background: "rgba(200,169,110,0.2)", margin: "0 auto 12px" }} />
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 9,
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(200,169,110,0.45)",
                  lineHeight: 2,
                }}
              >
                {isFr ? "Diagnostic · Ordonnancement · Coaching" : "Diagnostic · Ordering · Coaching"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Workflow Steps ── */}
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s",
          }}
        >
          {/* Eyebrow for steps */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(200,169,110,0.4)",
                marginBottom: 12,
              }}
            >
              {isFr ? "FLUX DE TRAVAIL" : "WORKFLOW"}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(18px, 2vw, 22px)",
                fontWeight: 300,
                color: "rgba(226,221,214,0.7)",
                lineHeight: 1.5,
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              {isFr
                ? "De la donnée brute au programme opérationnel en 7 étapes."
                : "From raw data to operational program in 7 steps."}
            </p>
          </div>

          {/* Steps grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px 24px",
            }}
          >
            {steps.map((step, idx) => {
              const isHighlighted = activeSteps.includes(idx + 1);
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "18px 20px",
                    borderRadius: 12,
                    background: isHighlighted ? "rgba(200,169,110,0.06)" : "rgba(255,255,255,0.02)",
                    border: isHighlighted ? "1px solid rgba(200,169,110,0.18)" : "1px solid rgba(200,169,110,0.06)",
                    opacity: entered ? 1 : 0,
                    transform: entered ? "translateY(0)" : "translateY(12px)",
                    transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${0.4 + idx * 0.06}s, border-color 0.3s ease, background 0.3s ease`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.15em",
                      color: isHighlighted ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.35)",
                      marginTop: 3,
                      flexShrink: 0,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 14,
                        fontWeight: 500,
                        color: isHighlighted ? "rgba(226,221,214,0.95)" : "rgba(226,221,214,0.7)",
                        marginBottom: 4,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {step.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        fontWeight: 300,
                        lineHeight: 1.6,
                        color: isHighlighted ? "rgba(226,221,214,0.6)" : "rgba(226,221,214,0.35)",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step connectors (desktop only visual) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            {steps.map((_, idx) => (
              <StepConnector key={idx} progress={entered ? 1 : 0} />
            ))}
          </div>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginTop: 48,
              flexWrap: "wrap",
              opacity: entered ? 1 : 0,
              transition: "opacity 0.6s ease 0.8s",
            }}
          >
            {badges.map((badge, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(200,169,110,0.6)",
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(200,169,110,0.15)",
                  background: "rgba(200,169,110,0.03)",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes engineGlow {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.09; }
        }
      `}</style>
    </section>
  );
}
