"use client";

import { useState, useEffect } from "react";
import { getT, Locale } from "@/lib/i18n";

interface TransformationTimelineProps {
  lang: Locale;
}

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
  const isAvant = active < 5;

  return (
    <section style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        {/* Eyebrow */}
        <p
          className="t-caption"
          style={{
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 12,
          }}
        >
          {t.timeline.eyebrow}
        </p>

        {/* Constellation */}
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
                  {/* Orb */}
                  <div
                    className={`transformation-orb-${i + 1}`}
                    style={{
                      width: getOrbSize(i),
                      height: getOrbSize(i),
                      borderRadius: "50%",
                      position: "relative",
                      opacity,
                      transition: "opacity 0.4s ease, box-shadow 0.4s ease",
                    }}
                  >
                    {/* Satellites for stage 3 */}
                    {i === 2 && (
                      <>
                        <div
                          className="satellite-1"
                          style={{
                            position: "absolute",
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: "#B0A090",
                            opacity: isActive ? 0.8 : 0.4,
                          }}
                        />
                        <div
                          className="satellite-2"
                          style={{
                            position: "absolute",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#C0B0A0",
                            opacity: isActive ? 0.7 : 0.35,
                          }}
                        />
                        <div
                          className="satellite-3"
                          style={{
                            position: "absolute",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: "#A09080",
                            opacity: isActive ? 0.75 : 0.4,
                          }}
                        />
                      </>
                    )}

                    {/* Connection arcs for stage 7 */}
                    {i === 6 && isActive && (
                      <svg
                        style={{
                          position: "absolute",
                          inset: -20,
                          width: "calc(100% + 40px)",
                          height: "calc(100% + 40px)",
                          pointerEvents: "none",
                        }}
                      >
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="rgba(90,138,192,0.3)"
                          strokeWidth="0.5"
                          strokeDasharray="4,4"
                        />
                      </svg>
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

          {/* Text panel */}
          <div
            style={{
              textAlign: "center",
              maxWidth: 560,
              margin: "0 auto",
              minHeight: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              opacity: fade ? 1 : 0,
              transform: fade ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: 600,
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
        @keyframes floatJerky {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(3px, -4px); }
          50% { transform: translate(-2px, 2px); }
          75% { transform: translate(4px, 3px); }
        }
        @keyframes tremble {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1px, 1px); }
          20% { transform: translate(1px, -1px); }
          30% { transform: translate(-1px, -1px); }
          40% { transform: translate(1px, 1px); }
          50% { transform: translate(-1px, 0); }
          60% { transform: translate(1px, 0); }
          70% { transform: translate(0, 1px); }
          80% { transform: translate(0, -1px); }
        }
        @keyframes orbitChaos1 {
          0% { top: -18px; left: 50%; transform: translateX(-50%); }
          25% { top: 50%; left: calc(100% + 10px); transform: translateY(-50%); }
          50% { top: calc(100% + 10px); left: 50%; transform: translateX(-50%); }
          75% { top: 50%; left: -18px; transform: translateY(-50%); }
          100% { top: -18px; left: 50%; transform: translateX(-50%); }
        }
        @keyframes orbitChaos2 {
          0% { top: 50%; left: -14px; transform: translateY(-50%); }
          33% { top: -14px; left: 50%; transform: translateX(-50%); }
          66% { top: calc(100% + 8px); left: 30%; }
          100% { top: 50%; left: -14px; transform: translateY(-50%); }
        }
        @keyframes orbitChaos3 {
          0% { top: calc(100% + 8px); left: 60%; }
          33% { top: 20%; left: calc(100% + 8px); }
          66% { top: -16px; left: 30%; transform: translateX(-50%); }
          100% { top: calc(100% + 8px); left: 60%; }
        }
        @keyframes pulseIrregular {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          15% { transform: scale(1.08); opacity: 0.8; }
          30% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.12); opacity: 0.85; }
          70% { transform: scale(0.98); opacity: 0.55; }
        }
        @keyframes mutate {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.15); filter: brightness(1.3); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        @keyframes floatSmooth {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(90,138,192,0.3), 0 0 40px rgba(90,138,192,0.15); }
          50% { box-shadow: 0 0 30px rgba(90,138,192,0.5), 0 0 60px rgba(90,138,192,0.25), 0 0 90px rgba(122,168,224,0.1); }
        }
        @keyframes radiant {
          0%, 100% { 
            box-shadow: 
              0 0 20px rgba(90,138,192,0.4), 
              0 0 40px rgba(90,138,192,0.2),
              0 0 80px rgba(122,168,224,0.1);
          }
          50% { 
            box-shadow: 
              0 0 30px rgba(90,138,192,0.6), 
              0 0 60px rgba(90,138,192,0.35),
              0 0 100px rgba(122,168,224,0.2),
              0 0 140px rgba(122,168,224,0.08);
          }
        }

        .transformation-orb-1 {
          background: radial-gradient(circle at 35% 35%, #A0A0A0 0%, #808080 40%, #606060 100%);
          animation: floatJerky 4s steps(8) infinite;
        }
        .transformation-orb-2 {
          background: radial-gradient(circle at 40% 30%, #C09070 0%, #A07050 40%, #805030 100%);
          animation: tremble 2.5s linear infinite;
        }
        .transformation-orb-3 {
          background: radial-gradient(circle at 35% 35%, #B09070 0%, #907050 40%, #705030 100%);
        }
        .transformation-orb-3 .satellite-1 {
          animation: orbitChaos1 5s linear infinite;
        }
        .transformation-orb-3 .satellite-2 {
          animation: orbitChaos2 4s linear infinite;
        }
        .transformation-orb-3 .satellite-3 {
          animation: orbitChaos3 6s linear infinite;
        }
        .transformation-orb-4 {
          background: radial-gradient(circle at 35% 35%, #D08070 0%, #B06050 40%, #904030 100%);
          animation: pulseIrregular 3s ease-in-out infinite;
        }
        .transformation-orb-5 {
          background: radial-gradient(circle at 40% 30%, #E8A860 0%, #D08840 40%, #B07020 100%);
          animation: mutate 4s ease-in-out infinite;
        }
        .transformation-orb-6 {
          background: radial-gradient(circle at 35% 35%, #6A9AD0 0%, #4A7AB0 40%, #3A6A9A 100%);
          animation: floatSmooth 3s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(90,138,192,0.3);
        }
        .transformation-orb-7 {
          background: radial-gradient(circle at 35% 35%, #7AA8E0 0%, #5A88C0 40%, #4A78B0 100%);
          animation: radiant 3s ease-in-out infinite;
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

function getOrbSize(index: number): number {
  const sizes = [56, 72, 88, 104, 96, 128, 144];
  return sizes[index] || 80;
}
