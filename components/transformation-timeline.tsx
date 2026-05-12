"use client";

import { useState, useRef, useCallback } from "react";
import { getT, Locale } from "@/lib/i18n";

interface TransformationTimelineProps {
  lang: Locale;
}

const ORB_SIZES = [72, 88, 104, 120, 112, 144, 160];

const ORB_CONFIGS = [
  {
    base: "#080810",
    blobs: [
      { c: "hsla(210,70%,55%,0.92)", x: -20, y: -15, s: 110 },
      { c: "hsla(200,60%,40%,0.85)", x: 15, y: 20, s: 95 },
      { c: "hsla(230,50%,30%,0.75)", x: 0, y: -20, s: 85 },
    ],
    satColors: ["#6ab0e0", "#4a90c0"],
  },
  {
    base: "#120804",
    blobs: [
      { c: "hsla(20,90%,60%,0.92)", x: -15, y: -20, s: 105 },
      { c: "hsla(15,85%,50%,0.88)", x: 20, y: 10, s: 100 },
      { c: "hsla(25,80%,40%,0.78)", x: -10, y: 20, s: 90 },
    ],
    satColors: ["#f07030", "#e8a040"],
  },
  {
    base: "#100a04",
    blobs: [
      { c: "hsla(20,90%,55%,0.9)", x: -20, y: -10, s: 110 },
      { c: "hsla(100,60%,45%,0.85)", x: 15, y: 20, s: 95 },
      { c: "hsla(270,50%,55%,0.8)", x: 10, y: -20, s: 100 },
    ],
    satColors: ["#f07030", "#a070d0"],
  },
  {
    base: "#100404",
    blobs: [
      { c: "hsla(0,90%,55%,0.92)", x: -15, y: -15, s: 115 },
      { c: "hsla(350,80%,45%,0.88)", x: 20, y: 15, s: 100 },
      { c: "hsla(340,70%,35%,0.78)", x: 0, y: 25, s: 90 },
    ],
    satColors: ["#f04040", "#d02050"],
  },
  {
    base: "#080410",
    blobs: [
      { c: "hsla(35,95%,60%,0.92)", x: -20, y: -15, s: 110 },
      { c: "hsla(170,85%,50%,0.88)", x: 15, y: 20, s: 95 },
      { c: "hsla(30,80%,45%,0.82)", x: -5, y: -25, s: 100 },
    ],
    satColors: ["#f0a030", "#20d0b0"],
  },
  {
    base: "#040414",
    blobs: [
      { c: "hsla(170,90%,55%,0.95)", x: -15, y: -15, s: 105 },
      { c: "hsla(320,85%,65%,0.9)", x: 20, y: 10, s: 100 },
      { c: "hsla(230,75%,55%,0.85)", x: -5, y: 25, s: 95 },
    ],
    satColors: ["#20e0c0", "#f080d0"],
  },
  {
    base: "#040420",
    blobs: [
      { c: "hsla(175,95%,60%,0.96)", x: -20, y: -15, s: 115 },
      { c: "hsla(330,90%,70%,0.92)", x: 15, y: 20, s: 105 },
      { c: "hsla(45,90%,55%,0.88)", x: 0, y: -25, s: 100 },
    ],
    satColors: ["#30f0d0", "#f090e0", "#f0c040"],
  },
];

export default function TransformationTimeline({ lang }: TransformationTimelineProps) {
  const t = getT(lang);
  const stages = t.timeline.stages;
  const [active, setActive] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const rowRef = useRef<HTMLDivElement>(null);

  const activate = (i: number) => {
    if (i === active) return;
    setFade(false);
    setTimeout(() => {
      setActive(i);
      setFade(true);
    }, 200);
  };

  const activeStage = stages[active];

  // Calculate dynamic spacing based on active orb
  const getOrbMargin = (i: number) => {
    if (active === i) return 0;
    // Neighbors of active get extra space
    if (Math.abs(active - i) === 1) return 12;
    return 0;
  };

  return (
    <section style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: 640, marginBottom: 48 }}>
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

        {/* Card */}
        <div
          style={{
            background: "#f5f3f1",
            borderRadius: 24,
            padding: "clamp(40px, 5vw, 64px) clamp(24px, 4vw, 48px)",
            position: "relative",
            boxShadow: "inset 0 0 0 0.5px rgba(26,22,22,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Measurement bar with divider badge */}
          <div
            style={{
              position: "relative",
              height: 14,
              marginBottom: 56,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Horizontal line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 1,
                background: "rgba(26,22,22,0.08)",
                transform: "translateY(-50%)",
              }}
            />

            {/* Vertical accent line at divider */}
            <div
              style={{
                position: "absolute",
                left: "75%",
                top: -8,
                bottom: -8,
                width: 1,
                background: "rgba(26,22,22,0.08)",
                zIndex: 1,
              }}
            />

            {/* Tick marks */}
            <div
              ref={rowRef}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                position: "relative",
                zIndex: 2,
              }}
            >
              {stages.map((_, i) => {
                const tickColor = i === active ? "#1A1616" : i < 5 ? "#B0A090" : "#14B8A6";
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                    <span style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 10,
                      color: i === active ? "#1A1616" : "#8A7D70",
                      letterSpacing: "0.08em",
                      fontWeight: i === active ? 500 : 400,
                      transition: "color 0.3s ease",
                      marginBottom: 6,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => activate(i)}
                      aria-label={`${stages[i].label}, ${stages[i].title}`}
                      style={{
                        width: 1,
                        height: i === active ? 16 : 6,
                        background: tickColor,
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        transition: "all 340ms cubic-bezier(0.34, 1.18, 0.64, 1)",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (i !== active) {
                          (e.target as HTMLElement).style.height = "12px";
                          (e.target as HTMLElement).style.background = i < 5 ? "#8A7D70" : "#0D9488";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (i !== active) {
                          (e.target as HTMLElement).style.height = "6px";
                          (e.target as HTMLElement).style.background = tickColor;
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Divider badge */}
            <div
              style={{
                position: "absolute",
                left: "calc(75% - 40px)",
                top: -22,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#f5f3f1",
                padding: "2px 8px",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#8A7D70",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {t.timeline.dividerLeft}
              </span>
              <span
                style={{
                  width: 20,
                  height: 1,
                  background: "#8A7D70",
                  opacity: 0.4,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#8A7D70",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {t.timeline.dividerRight}
              </span>
            </div>
          </div>

          {/* Orb row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 56,
              position: "relative",
              minHeight: 260,
              padding: "20px 0",
            }}
          >
            {stages.map((stage, i) => {
              const isActive = i === active;
              const scale = isActive ? 1.35 : 1;
              const zIndex = isActive ? 10 : 1;
              const config = ORB_CONFIGS[i];
              const size = ORB_SIZES[i];
              const margin = getOrbMargin(i);

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0,
                    cursor: "pointer",
                    zIndex,
                    transition: "margin 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    marginLeft: margin,
                    marginRight: margin,
                    flexShrink: 0,
                  }}
                  onClick={() => activate(i)}
                >
                  {/* Float wrapper */}
                  <div
                    className={!isActive ? `float-orb float-delay-${i}` : undefined}
                    style={{
                      position: "relative",
                      width: size,
                      height: isActive ? Math.round(size * 1.35) : size,
                      marginBottom: 12,
                      transition: "height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    {/* Scale wrapper */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        transform: `scale(${scale})`,
                        transformOrigin: "center top",
                      }}
                    >
                      {/* Satellite 1 */}
                      <div
                        className={`satellite sat-${i}-1`}
                        style={{
                          position: "absolute",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: config.satColors[0],
                          boxShadow: `0 0 8px ${config.satColors[0]}80`,
                          top: "50%",
                          left: "50%",
                          marginTop: -5,
                          marginLeft: -5,
                          zIndex: 2,
                        }}
                      />
                      {/* Satellite 2 */}
                      <div
                        className={`satellite sat-${i}-2`}
                        style={{
                          position: "absolute",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: config.satColors[1] || config.satColors[0],
                          boxShadow: `0 0 6px ${config.satColors[1] || config.satColors[0]}60`,
                          top: "50%",
                          left: "50%",
                          marginTop: -4,
                          marginLeft: -4,
                          zIndex: 2,
                        }}
                      />

                      {/* Main orb */}
                      <div
                        className={`atmosphere-orb orb-${i + 1}`}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: config.base,
                          boxShadow: isActive
                            ? `inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 30px ${config.blobs[0].c}60, 0 0 60px ${config.blobs[1].c}30`
                            : `inset 0 0 0 1px rgba(255,255,255,0.1)`,
                          transition: "box-shadow 0.4s ease",
                          zIndex: 3,
                        }}
                      >
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
                              filter: "blur(20px)",
                              top: `${blob.y + 50}%`,
                              left: `${blob.x + 50}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        ))}
                        {/* Noise */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: "60px 60px",
                            opacity: 0.15,
                            mixBlendMode: "overlay",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#1A1616" : "#8A7D70",
                      letterSpacing: "0.02em",
                      textAlign: "center",
                      transition: "color 0.3s ease, font-weight 0.3s ease",
                      lineHeight: 1.3,
                    }}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stage text panel */}
          <div
            style={{
              maxWidth: 560,
              minHeight: 120,
              opacity: fade ? 1 : 0,
              transform: fade ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            {/* Delimiter */}
            <div style={{
              width: 100,
              height: 1,
              background: "rgba(26,22,22,0.1)",
              marginBottom: 24,
            }} />
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 300,
                color: "#1A1616",
                margin: "0 0 16px",
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
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
        /* --- Orb float animation --- */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .float-orb {
          animation: float 5s ease-in-out infinite;
        }
        .float-delay-0 { animation-delay: 0s; }
        .float-delay-1 { animation-delay: 0.7s; }
        .float-delay-2 { animation-delay: 1.4s; }
        .float-delay-3 { animation-delay: 2.1s; }
        .float-delay-4 { animation-delay: 2.8s; }
        .float-delay-5 { animation-delay: 3.5s; }
        .float-delay-6 { animation-delay: 4.2s; }

        /* --- Blob drift animations --- */
        @keyframes drift1-1 { 0%,100%{transform:translate(-50%,-50%) translate(-12px,-8px)} 33%{transform:translate(-50%,-50%) translate(8px,4px)} 66%{transform:translate(-50%,-50%) translate(-4px,12px)} }
        @keyframes drift1-2 { 0%,100%{transform:translate(-50%,-50%) translate(8px,12px)} 50%{transform:translate(-50%,-50%) translate(-12px,-8px)} }
        @keyframes drift1-3 { 0%,100%{transform:translate(-50%,-50%) translate(0,0)} 50%{transform:translate(-50%,-50%) translate(6px,-10px)} }

        @keyframes drift2-1 { 0%,100%{transform:translate(-50%,-50%) translate(-8px,-12px)} 25%{transform:translate(-50%,-50%) translate(10px,6px)} 50%{transform:translate(-50%,-50%) translate(-6px,10px)} 75%{transform:translate(-50%,-50%) translate(4px,-8px)} }
        @keyframes drift2-2 { 0%,100%{transform:translate(-50%,-50%) translate(12px,4px)} 50%{transform:translate(-50%,-50%) translate(-10px,-6px)} }
        @keyframes drift2-3 { 0%,100%{transform:translate(-50%,-50%) translate(-4px,8px)} 50%{transform:translate(-50%,-50%) translate(8px,-4px)} }

        @keyframes drift3-1 { 0%,100%{transform:translate(-50%,-50%) translate(-16px,-4px)} 33%{transform:translate(-50%,-50%) translate(12px,8px)} 66%{transform:translate(-50%,-50%) translate(-8px,16px)} }
        @keyframes drift3-2 { 0%,100%{transform:translate(-50%,-50%) translate(8px,-16px)} 50%{transform:translate(-50%,-50%) translate(-12px,12px)} }
        @keyframes drift3-3 { 0%,100%{transform:translate(-50%,-50%) translate(4px,12px)} 50%{transform:translate(-50%,-50%) translate(-16px,-8px)} }

        @keyframes drift4-1 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 20%{transform:translate(-50%,-50%) scale(1.12) translate(-4px,-4px)} 40%{transform:translate(-50%,-50%) scale(0.92) translate(4px,4px)} 60%{transform:translate(-50%,-50%) scale(1.08) translate(-6px,2px)} 80%{transform:translate(-50%,-50%) scale(0.96) translate(2px,-6px)} }
        @keyframes drift4-2 { 0%,100%{transform:translate(-50%,-50%) translate(8px,8px)} 50%{transform:translate(-50%,-50%) translate(-12px,-12px)} }
        @keyframes drift4-3 { 0%,100%{transform:translate(-50%,-50%) translate(-8px,12px)} 50%{transform:translate(-50%,-50%) translate(12px,-8px)} }

        @keyframes drift5-1 { 0%,100%{transform:translate(-50%,-50%) translate(-12px,-12px) scale(1)} 50%{transform:translate(-50%,-50%) translate(12px,8px) scale(1.15)} }
        @keyframes drift5-2 { 0%,100%{transform:translate(-50%,-50%) translate(8px,-8px) scale(1)} 50%{transform:translate(-50%,-50%) translate(-8px,12px) scale(1.25)} }
        @keyframes drift5-3 { 0%,100%{transform:translate(-50%,-50%) translate(0,8px)} 50%{transform:translate(-50%,-50%) translate(8px,-16px)} }

        @keyframes drift6-1 { 0%,100%{transform:translate(-50%,-50%) translate(-8px,-6px)} 50%{transform:translate(-50%,-50%) translate(8px,6px)} }
        @keyframes drift6-2 { 0%,100%{transform:translate(-50%,-50%) translate(10px,-4px)} 50%{transform:translate(-50%,-50%) translate(-6px,10px)} }
        @keyframes drift6-3 { 0%,100%{transform:translate(-50%,-50%) translate(-4px,8px)} 50%{transform:translate(-50%,-50%) translate(4px,-8px)} }

        @keyframes drift7-1 { 0%,100%{transform:translate(-50%,-50%) translate(-10px,-8px)} 50%{transform:translate(-50%,-50%) translate(10px,8px)} }
        @keyframes drift7-2 { 0%,100%{transform:translate(-50%,-50%) translate(8px,-10px)} 50%{transform:translate(-50%,-50%) translate(-8px,10px)} }
        @keyframes drift7-3 { 0%,100%{transform:translate(-50%,-50%) translate(0,6px)} 50%{transform:translate(-50%,-50%) translate(6px,-6px)} }

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

        /* --- Satellite orbits --- */
        @keyframes orbitA { 0%{transform:translate(-50%,-50%) rotate(0deg) translateX(48px) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg) translateX(48px) rotate(-360deg)} }
        @keyframes orbitB { 0%{transform:translate(-50%,-50%) rotate(180deg) translateX(60px) rotate(-180deg)} 100%{transform:translate(-50%,-50%) rotate(540deg) translateX(60px) rotate(-540deg)} }
        @keyframes orbitC { 0%{transform:translate(-50%,-50%) rotate(90deg) translateX(44px) rotate(-90deg)} 100%{transform:translate(-50%,-50%) rotate(450deg) translateX(44px) rotate(-450deg)} }
        @keyframes orbitD { 0%{transform:translate(-50%,-50%) rotate(270deg) translateX(54px) rotate(-270deg)} 100%{transform:translate(-50%,-50%) rotate(630deg) translateX(54px) rotate(-630deg)} }
        @keyframes orbitE { 0%{transform:translate(-50%,-50%) rotate(45deg) translateX(56px) rotate(-45deg)} 100%{transform:translate(-50%,-50%) rotate(405deg) translateX(56px) rotate(-405deg)} }
        @keyframes orbitF { 0%{transform:translate(-50%,-50%) rotate(135deg) translateX(64px) rotate(-135deg)} 100%{transform:translate(-50%,-50%) rotate(495deg) translateX(64px) rotate(-495deg)} }
        @keyframes orbitG { 0%{transform:translate(-50%,-50%) rotate(315deg) translateX(70px) rotate(-315deg)} 100%{transform:translate(-50%,-50%) rotate(675deg) translateX(70px) rotate(-675deg)} }

        .sat-0-1 { animation: orbitA 5s linear infinite; }
        .sat-0-2 { animation: orbitB 7s linear infinite; }
        .sat-1-1 { animation: orbitC 4s linear infinite; }
        .sat-1-2 { animation: orbitD 6s linear infinite; }
        .sat-2-1 { animation: orbitE 3.5s linear infinite; }
        .sat-2-2 { animation: orbitF 5.5s linear infinite; }
        .sat-3-1 { animation: orbitA 4.5s linear infinite; }
        .sat-3-2 { animation: orbitB 6.5s linear infinite; }
        .sat-4-1 { animation: orbitC 5s linear infinite; }
        .sat-4-2 { animation: orbitD 7s linear infinite; }
        .sat-5-1 { animation: orbitE 6s linear infinite; }
        .sat-5-2 { animation: orbitF 8s linear infinite; }
        .sat-6-1 { animation: orbitG 7s linear infinite; }
        .sat-6-2 { animation: orbitA 9s linear infinite; }

        @media (max-width: 768px) {
          .constellation-row {
            flex-wrap: wrap;
            gap: 20px !important;
            min-height: auto !important;
          }
          .constellation-orb-wrapper {
            flex: 0 0 calc(25% - 15px);
          }
        }
      `}</style>
    </section>
  );
}
