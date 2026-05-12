"use client";

import { useState } from "react";
import { getT, Locale } from "@/lib/i18n";

interface TransformationTimelineProps {
  lang: Locale;
}

const ORB_CONFIGS = [
  // 1 - Désorganisée: cold, dead
  { base: "#1e1e24", blobs: [{ c: "#2a3a4a", x: -30, y: -20, s: 120 }, { c: "#3a2a2a", x: 20, y: 30, s: 100 }, { c: "#1a2a1a", x: 0, y: 0, s: 80 }] },
  // 2 - Sous tension: rust, trembling
  { base: "#2a1f1a", blobs: [{ c: "#c4542a", x: -20, y: -30, s: 110 }, { c: "#8a4a20", x: 30, y: 10, s: 90 }, { c: "#d48440", x: -10, y: 30, s: 100 }] },
  // 3 - Complexifiée: conflicting
  { base: "#2a2018", blobs: [{ c: "#c4542a", x: -25, y: -15, s: 100 }, { c: "#5a7a3a", x: 20, y: 25, s: 90 }, { c: "#7a5a8a", x: 10, y: -30, s: 110 }] },
  // 4 - Limitée: dark red, pulsing
  { base: "#2a1818", blobs: [{ c: "#c43030", x: -20, y: -20, s: 120 }, { c: "#5a1a1a", x: 25, y: 15, s: 100 }, { c: "#3a1a1a", x: 0, y: 30, s: 90 }] },
  // 5 - En mutation: transition
  { base: "#1e1a2e", blobs: [{ c: "#d48820", x: -30, y: -10, s: 110 }, { c: "#14b8a6", x: 20, y: 30, s: 100 }, { c: "#c48440", x: -10, y: -30, s: 90 }] },
  // 6 - Unifiée: smooth indigo/teal/coral
  { base: "#1a1a3e", blobs: [{ c: "#14b8a6", x: -25, y: -20, s: 110 }, { c: "#f472b6", x: 30, y: 10, s: 100 }, { c: "#4a6ad0", x: -10, y: 30, s: 90 }] },
  // 7 - Adaptative: full aurora
  { base: "#1a1a4e", blobs: [{ c: "#14b8a6", x: -20, y: -25, s: 120 }, { c: "#f472b6", x: 25, y: 20, s: 110 }, { c: "#d48820", x: 0, y: -20, s: 100 }] },
];

const ORB_SIZES = [56, 72, 88, 104, 96, 128, 144];

export default function TransformationTimeline({ lang }: TransformationTimelineProps) {
  const t = getT(lang);
  const stages = t.timeline.stages;
  const [active, setActive] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);

  const activate = (i: number) => {
    if (i === active) return;
    setFade(false);
    setTimeout(() => {
      setActive(i);
      setFade(true);
    }, 200);
  };

  const activeStage = stages[active];

  return (
    <section style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        {/* Header — left aligned */}
        <div style={{ maxWidth: 600, marginBottom: 48 }}>
          <p
            className="t-caption"
            style={{
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 16,
            }}
          >
            {t.timeline.eyebrow}
          </p>
          <h2
            className="t-display"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            {t.timeline.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
            }}
          >
            {t.timeline.description}
          </p>
        </div>

        {/* Constellation card */}
        <div
          style={{
            background: "#f5f3f1",
            borderRadius: 24,
            padding: "clamp(32px, 4vw, 48px) clamp(20px, 3vw, 40px)",
            position: "relative",
            boxShadow: "inset 0 0 0 0.5px rgba(26,22,22,0.1)",
          }}
        >
          {/* Divider labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8A7D70",
            }}
          >
            <span>{t.timeline.dividerLeft}</span>
            <span style={{ opacity: 0.4 }}>—</span>
            <span>{t.timeline.dividerRight}</span>
          </div>

          {/* Orb row */}
          <div
            className="constellation-row"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: "clamp(8px, 1.5vw, 16px)",
              marginBottom: 48,
              position: "relative",
            }}
          >
            {/* Vertical divider line */}
            <div
              style={{
                position: "absolute",
                left: "calc(5 / 7 * 100% - 3px)",
                top: -16,
                bottom: -16,
                width: 1,
                background: "linear-gradient(to bottom, transparent, rgba(26,22,22,0.15), transparent)",
                zIndex: 1,
              }}
            />

            {stages.map((stage, i) => {
              const isActive = i === active;
              const scale = isActive ? 1.35 : 0.85;
              const opacity = isActive ? 1 : 0.45;
              const zIndex = isActive ? 10 : 1;
              const config = ORB_CONFIGS[i];
              const size = ORB_SIZES[i];

              return (
                <div
                  key={i}
                  className="constellation-orb-wrapper"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    zIndex,
                    transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: `scale(${scale})`,
                  }}
                  onClick={() => activate(i)}
                >
                  {/* Atmosphere Orb */}
                  <div
                    className={`atmosphere-orb atmosphere-orb-${i + 1}`}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: "50%",
                      position: "relative",
                      overflow: "hidden",
                      background: config.base,
                      opacity,
                      transition: "opacity 0.4s ease, box-shadow 0.4s ease",
                      boxShadow: i === 6 && isActive
                        ? "0 0 30px rgba(90,138,192,0.5), 0 0 60px rgba(90,138,192,0.25)"
                        : i === 5 && isActive
                        ? "0 0 20px rgba(90,138,192,0.3)"
                        : "none",
                    }}
                  >
                    {/* Blurred gradient blobs */}
                    {config.blobs.map((blob, bi) => (
                      <div
                        key={bi}
                        className={`orb-blob blob-${i + 1}-${bi + 1}`}
                        style={{
                          position: "absolute",
                          width: `${blob.s}%`,
                          height: `${blob.s}%`,
                          borderRadius: "50%",
                          background: blob.c,
                          filter: "blur(18px)",
                          opacity: 0.65,
                          top: `${blob.y + 50}%`,
                          left: `${blob.x + 50}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ))}

                    {/* Noise overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundSize: "100px 100px",
                        opacity: 0.15,
                        mixBlendMode: "overlay",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Satellites for stage 3 */}
                    {i === 2 && (
                      <>
                        <div className="satellite-1" style={satelliteStyle(isActive, "#C4542A")} />
                        <div className="satellite-2" style={satelliteStyle(isActive, "#D48440")} />
                        <div className="satellite-3" style={satelliteStyle(isActive, "#8A4A20")} />
                      </>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? "#1A1616" : "#8A7D70",
                      letterSpacing: "0.02em",
                      textAlign: "center",
                      transition: "color 0.3s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stage text panel — left aligned */}
          <div
            style={{
              maxWidth: 560,
              minHeight: 120,
              opacity: fade ? 1 : 0,
              transform: fade ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: 300,
                color: "#1A1616",
                margin: "0 0 16px",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              {activeStage.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 300,
                color: "#3A3A3A",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {activeStage.desc}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drift1-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(-15px, -10px); }
          33% { transform: translate(-50%, -50%) translate(10px, 5px); }
          66% { transform: translate(-50%, -50%) translate(-5px, 15px); }
        }
        @keyframes drift1-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(10px, 15px); }
          50% { transform: translate(-50%, -50%) translate(-15px, -10px); }
        }
        @keyframes drift1-3 {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
          50% { transform: translate(-50%, -50%) translate(8px, -12px); }
        }

        @keyframes drift2-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(-10px, -15px); }
          25% { transform: translate(-50%, -50%) translate(12px, 8px); }
          50% { transform: translate(-50%, -50%) translate(-8px, 12px); }
          75% { transform: translate(-50%, -50%) translate(5px, -10px); }
        }
        @keyframes drift2-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(15px, 5px); }
          50% { transform: translate(-50%, -50%) translate(-12px, -8px); }
        }
        @keyframes drift2-3 {
          0%, 100% { transform: translate(-50%, -50%) translate(-5px, 10px); }
          50% { transform: translate(-50%, -50%) translate(10px, -5px); }
        }

        @keyframes drift3-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(-20px, -5px); }
          33% { transform: translate(-50%, -50%) translate(15px, 10px); }
          66% { transform: translate(-50%, -50%) translate(-10px, 20px); }
        }
        @keyframes drift3-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(10px, -20px); }
          50% { transform: translate(-50%, -50%) translate(-15px, 15px); }
        }
        @keyframes drift3-3 {
          0%, 100% { transform: translate(-50%, -50%) translate(5px, 15px); }
          50% { transform: translate(-50%, -50%) translate(-20px, -10px); }
        }

        @keyframes drift4-1 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          20% { transform: translate(-50%, -50%) scale(1.15) translate(-5px, -5px); }
          40% { transform: translate(-50%, -50%) scale(0.9) translate(5px, 5px); }
          60% { transform: translate(-50%, -50%) scale(1.1) translate(-8px, 3px); }
          80% { transform: translate(-50%, -50%) scale(0.95) translate(3px, -8px); }
        }
        @keyframes drift4-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(10px, 10px); }
          50% { transform: translate(-50%, -50%) translate(-15px, -15px); }
        }
        @keyframes drift4-3 {
          0%, 100% { transform: translate(-50%, -50%) translate(-10px, 15px); }
          50% { transform: translate(-50%, -50%) translate(15px, -10px); }
        }

        @keyframes drift5-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(-15px, -15px) scale(1); }
          50% { transform: translate(-50%, -50%) translate(15px, 10px) scale(1.2); }
        }
        @keyframes drift5-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(10px, -10px) scale(1); }
          50% { transform: translate(-50%, -50%) translate(-10px, 15px) scale(1.3); }
        }
        @keyframes drift5-3 {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 10px); }
          50% { transform: translate(-50%, -50%) translate(10px, -20px); }
        }

        @keyframes drift6-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(-10px, -8px); }
          50% { transform: translate(-50%, -50%) translate(10px, 8px); }
        }
        @keyframes drift6-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(12px, -5px); }
          50% { transform: translate(-50%, -50%) translate(-8px, 12px); }
        }
        @keyframes drift6-3 {
          0%, 100% { transform: translate(-50%, -50%) translate(-5px, 10px); }
          50% { transform: translate(-50%, -50%) translate(5px, -10px); }
        }

        @keyframes drift7-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(-12px, -10px); }
          50% { transform: translate(-50%, -50%) translate(12px, 10px); }
        }
        @keyframes drift7-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(10px, -12px); }
          50% { transform: translate(-50%, -50%) translate(-10px, 12px); }
        }
        @keyframes drift7-3 {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 8px); }
          50% { transform: translate(-50%, -50%) translate(8px, -8px); }
        }

        @keyframes orbitChaos1 {
          0% { top: -22px; left: 50%; transform: translateX(-50%) scale(1); }
          15% { top: 30%; left: calc(100% + 14px); transform: translateY(-50%) scale(1.1); }
          35% { top: calc(100% + 12px); left: 70%; transform: translateX(-50%) scale(0.9); }
          55% { top: 70%; left: -18px; transform: translateY(-50%) scale(1.2); }
          75% { top: -16px; left: 20%; transform: translateX(-50%) scale(0.85); }
          100% { top: -22px; left: 50%; transform: translateX(-50%) scale(1); }
        }
        @keyframes orbitChaos2 {
          0% { top: 50%; left: -16px; transform: translateY(-50%) scale(1); }
          20% { top: -12px; left: 60%; transform: translateX(-50%) scale(1.15); }
          40% { top: calc(100% + 10px); left: 30%; transform: translateX(-50%) scale(0.9); }
          60% { top: 20%; left: calc(100% + 12px); transform: translateY(-50%) scale(1.1); }
          80% { top: calc(100% + 6px); left: 70%; }
          100% { top: 50%; left: -16px; transform: translateY(-50%) scale(1); }
        }
        @keyframes orbitChaos3 {
          0% { top: calc(100% + 10px); left: 40%; transform: translateX(-50%) scale(1); }
          25% { top: 20%; left: calc(100% + 10px); transform: translateY(-50%) scale(0.85); }
          50% { top: -18px; left: 40%; transform: translateX(-50%) scale(1.2); }
          75% { top: 60%; left: -14px; transform: translateY(-50%) scale(1); }
          100% { top: calc(100% + 10px); left: 40%; transform: translateX(-50%) scale(1); }
        }

        .blob-1-1 { animation: drift1-1 12s ease-in-out infinite; }
        .blob-1-2 { animation: drift1-2 15s ease-in-out infinite; }
        .blob-1-3 { animation: drift1-3 10s ease-in-out infinite; }

        .blob-2-1 { animation: drift2-1 8s steps(10) infinite; }
        .blob-2-2 { animation: drift2-2 6s steps(8) infinite; }
        .blob-2-3 { animation: drift2-3 9s steps(12) infinite; }

        .blob-3-1 { animation: drift3-1 7s steps(8) infinite; }
        .blob-3-2 { animation: drift3-2 9s steps(10) infinite; }
        .blob-3-3 { animation: drift3-3 11s steps(6) infinite; }

        .blob-4-1 { animation: drift4-1 4s ease-in-out infinite; }
        .blob-4-2 { animation: drift4-2 13s ease-in-out infinite; }
        .blob-4-3 { animation: drift4-3 11s ease-in-out infinite; }

        .blob-5-1 { animation: drift5-1 10s ease-in-out infinite; }
        .blob-5-2 { animation: drift5-2 12s ease-in-out infinite; }
        .blob-5-3 { animation: drift5-3 8s ease-in-out infinite; }

        .blob-6-1 { animation: drift6-1 14s ease-in-out infinite; }
        .blob-6-2 { animation: drift6-2 16s ease-in-out infinite; }
        .blob-6-3 { animation: drift6-3 12s ease-in-out infinite; }

        .blob-7-1 { animation: drift7-1 15s ease-in-out infinite; }
        .blob-7-2 { animation: drift7-2 18s ease-in-out infinite; }
        .blob-7-3 { animation: drift7-3 13s ease-in-out infinite; }

        .atmosphere-orb-3 .satellite-1 {
          animation: orbitChaos1 4s linear infinite;
        }
        .atmosphere-orb-3 .satellite-2 {
          animation: orbitChaos2 5s linear infinite;
        }
        .atmosphere-orb-3 .satellite-3 {
          animation: orbitChaos3 6s linear infinite;
        }

        @media (max-width: 768px) {
          .constellation-row {
            flex-wrap: wrap;
            gap: 20px !important;
          }
          .constellation-orb-wrapper {
            flex: 0 0 calc(25% - 15px);
          }
        }
      `}</style>
    </section>
  );
}

function satelliteStyle(isActive: boolean, color: string): React.CSSProperties {
  return {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: color,
    opacity: isActive ? 0.9 : 0.5,
    boxShadow: `0 0 6px ${color}40`,
  };
}
