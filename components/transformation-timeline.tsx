"use client";

import { useState, useRef, useCallback } from "react";
import { getT, Locale } from "@/lib/i18n";

interface TransformationTimelineProps {
  lang: Locale;
}

const ORB_SIZES = [64, 80, 96, 112, 104, 136, 152];

const ORB_CONFIGS = [
  { base: "rgba(30,30,36,0.55)", blobs: [{c:"rgba(60,80,100,0.7)",x:-25,y:-20,s:110},{c:"rgba(50,40,40,0.6)",x:20,y:25,s:90},{c:"rgba(40,60,50,0.55)",x:0,y:-15,s:80}], satColors:["#6a7a8a","#5a6a7a"] },
  { base: "rgba(42,31,26,0.55)", blobs: [{c:"rgba(180,80,40,0.7)",x:-20,y:-25,s:100},{c:"rgba(140,70,30,0.6)",x:25,y:10,s:95},{c:"rgba(200,120,60,0.5)",x:-10,y:20,s:85}], satColors:["#c4542a","#d48440"] },
  { base: "rgba(42,32,24,0.55)", blobs: [{c:"rgba(180,80,40,0.65)",x:-25,y:-15,s:105},{c:"rgba(80,110,50,0.6)",x:20,y:25,s:90},{c:"rgba(110,80,130,0.55)",x:10,y:-25,s:95}], satColors:["#c4542a","#7a5a8a"] },
  { base: "rgba(42,24,24,0.55)", blobs: [{c:"rgba(180,40,40,0.7)",x:-20,y:-20,s:115},{c:"rgba(120,30,30,0.6)",x:25,y:15,s:95},{c:"rgba(80,20,20,0.55)",x:0,y:25,s:85}], satColors:["#c43030","#8a2020"] },
  { base: "rgba(30,26,46,0.55)", blobs: [{c:"rgba(200,130,30,0.7)",x:-25,y:-15,s:105},{c:"rgba(20,180,160,0.6)",x:20,y:25,s:90},{c:"rgba(180,120,60,0.55)",x:-10,y:-25,s:95}], satColors:["#d48820","#14b8a6"] },
  { base: "rgba(26,26,62,0.55)", blobs: [{c:"rgba(20,180,160,0.7)",x:-20,y:-20,s:100},{c:"rgba(240,110,180,0.6)",x:25,y:15,s:95},{c:"rgba(70,100,200,0.55)",x:-5,y:25,s:90}], satColors:["#14b8a6","#f472b6"] },
  { base: "rgba(26,26,78,0.55)", blobs: [{c:"rgba(20,180,160,0.75)",x:-25,y:-20,s:110},{c:"rgba(240,110,180,0.65)",x:20,y:25,s:100},{c:"rgba(200,130,30,0.6)",x:0,y:-20,s:95}], satColors:["#14b8a6","#f472b6","#d48820"] },
];

export default function TransformationTimeline({ lang }: TransformationTimelineProps) {
  const t = getT(lang);
  const stages = t.timeline.stages;
  const [active, setActive] = useState<number>(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [fade, setFade] = useState<boolean>(true);
  const rowRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [meshLines, setMeshLines] = useState<Array<{x1:number;y1:number;x2:number;y2:number}>>([]);

  const activate = (i: number) => {
    if (i === active) return;
    setFade(false);
    setTimeout(() => { setActive(i); setFade(true); }, 200);
  };

  const calcMesh = useCallback((i: number) => {
    const src = orbRefs.current[i];
    const row = rowRef.current;
    if (!src || !row) return;
    const sR = src.getBoundingClientRect();
    const rR = row.getBoundingClientRect();
    const lines: Array<{x1:number;y1:number;x2:number;y2:number}> = [];
    for (let j = 0; j < 7; j++) {
      if (j === i) continue;
      const tgt = orbRefs.current[j];
      if (!tgt) continue;
      const tR = tgt.getBoundingClientRect();
      lines.push({
        x1: sR.left + sR.width/2 - rR.left,
        y1: sR.top + sR.height/2 - rR.top,
        x2: tR.left + tR.width/2 - rR.left,
        y2: tR.top + tR.height/2 - rR.top,
      });
    }
    setMeshLines(lines);
  }, []);

  const handleEnter = (i: number) => {
    setHovered(i);
    calcMesh(i);
  };
  const handleLeave = () => {
    setHovered(null);
    setMeshLines([]);
  };

  const activeStage = stages[active];

  return (
    <section style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: 640, marginBottom: 48 }}>
          <p className="t-caption" style={{ fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 16 }}>
            {t.timeline.eyebrow}
          </p>
          <h2 className="t-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.2, marginBottom: 20 }}>
            {t.timeline.title}
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)" }}>
            {t.timeline.description}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "#f5f3f1", borderRadius: 24, padding: "clamp(32px, 4vw, 48px) clamp(20px, 3vw, 40px)", position: "relative", boxShadow: "inset 0 0 0 0.5px rgba(26,22,22,0.1)" }}>

          {/* Measurement bar */}
          <div style={{ position: "relative", height: 9, marginBottom: 40, marginTop: 8 }}>
            <div style={{ position: "absolute", inset: 0, background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 9 9\'%3E%3Crect width=\'0.5\' height=\'9\' fill=\'%231A1616\' opacity=\'0.12\'/%3E%3Crect width=\'0.5\' x=\'8.5\' height=\'9\' fill=\'%231A1616\' opacity=\'0.12\'/%3E%3C/svg%3E") center top / 9px 9px' }} />
            {stages.map((_, i) => (
              <button
                key={i}
                onClick={() => activate(i)}
                aria-label={`${stages[i].label}, ${stages[i].title}`}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${(i / 6) * 100}%`,
                  width: 1,
                  height: 9,
                  marginTop: -4.5,
                  background: "#1A1616",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transformOrigin: "center center",
                  transform: i === active ? "translateX(-50%) scaleY(14)" : "translateX(-50%) scaleY(1)",
                  opacity: i === active ? 1 : 0.25,
                  transition: "transform 340ms cubic-bezier(0.34, 1.18, 0.64, 1), opacity 220ms ease",
                }}
                onMouseEnter={(e) => { if (i !== active) { (e.target as HTMLElement).style.opacity = "0.6"; (e.target as HTMLElement).style.transform = "translateX(-50%) scaleY(4)"; } }}
                onMouseLeave={(e) => { if (i !== active) { (e.target as HTMLElement).style.opacity = "0.25"; (e.target as HTMLElement).style.transform = "translateX(-50%) scaleY(1)"; } }}
              />
            ))}
            {/* Divider badge */}
            <div style={{ position: "absolute", left: "calc(5 / 6 * 100% - 3px)", top: -20, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 500, color: "#8A7D70", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.timeline.dividerLeft}</span>
              <span style={{ width: 16, height: 1, background: "#8A7D70", opacity: 0.4 }} />
              <span style={{ fontSize: 9, fontWeight: 500, color: "#8A7D70", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.timeline.dividerRight}</span>
            </div>
          </div>

          {/* Orb row */}
          <div
            ref={rowRef}
            className="constellation-row"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(6px, 1.2vw, 12px)", marginBottom: 48, position: "relative", minHeight: 200 }}
          >
            {/* Wider gap at divider */}
            <style>{`
              .constellation-row > *:nth-child(5) { margin-right: 24px; }
              @media (max-width: 768px) {
                .constellation-row > *:nth-child(5) { margin-right: 12px; }
              }
            `}</style>

            {/* Mesh overlay */}
            {meshLines.length > 0 && (
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
                {meshLines.map((ln, li) => (
                  <line key={li} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke="rgba(26,22,22,0.06)" strokeWidth={1} />
                ))}
              </svg>
            )}

            {stages.map((stage, i) => {
              const isActive = i === active;
              const isHovered = i === hovered;
              const scale = isActive ? 1.3 : isHovered ? 1.15 : 1;
              const zIndex = isActive ? 10 : isHovered ? 8 : 1;
              const config = ORB_CONFIGS[i];
              const size = ORB_SIZES[i];

              return (
                <div
                  key={i}
                  ref={(el) => { orbRefs.current[i] = el; }}
                  className="constellation-orb-wrapper"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                    zIndex,
                    transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: `scale(${scale})`,
                    position: "relative",
                  }}
                  onClick={() => activate(i)}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={handleLeave}
                >
                  {/* Orb + satellites wrapper */}
                  <div style={{ position: "relative", width: size, height: size }}>
                    {/* Satellite 1 */}
                    <div
                      className={`satellite sat-${i}-1`}
                      style={{
                        position: "absolute",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: config.satColors[0],
                        boxShadow: `0 0 6px ${config.satColors[0]}60`,
                        top: "50%",
                        left: "50%",
                        marginTop: -5,
                        marginLeft: -5,
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
                        boxShadow: `0 0 4px ${config.satColors[1] || config.satColors[0]}50`,
                        top: "50%",
                        left: "50%",
                        marginTop: -4,
                        marginLeft: -4,
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
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                        boxShadow: isActive
                          ? `inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 20px ${config.blobs[0].c}40, 0 0 40px ${config.blobs[1].c}20`
                          : `inset 0 0 0 1px rgba(255,255,255,0.08)`,
                        transition: "box-shadow 0.4s ease",
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
                            filter: "blur(16px)",
                            top: `${blob.y + 50}%`,
                            left: `${blob.x + 50}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      ))}
                      {/* Noise */}
                      <div
                        className={`noise-layer ${isHovered ? "noise-active" : ""}`}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                          backgroundSize: "80px 80px",
                          opacity: isHovered ? 0.2 : 0.12,
                          mixBlendMode: "overlay",
                          pointerEvents: "none",
                          transition: "opacity 0.4s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? "#1A1616" : "#8A7D70",
                      letterSpacing: "0.02em",
                      textAlign: "center",
                      transition: "color 0.3s ease, font-weight 0.3s ease",
                      whiteSpace: "nowrap",
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
        /* --- Blob drift animations --- */
        @keyframes drift1-1 { 0%,100%{transform:translate(-50%,-50%) translate(-15px,-10px)} 33%{transform:translate(-50%,-50%) translate(10px,5px)} 66%{transform:translate(-50%,-50%) translate(-5px,15px)} }
        @keyframes drift1-2 { 0%,100%{transform:translate(-50%,-50%) translate(10px,15px)} 50%{transform:translate(-50%,-50%) translate(-15px,-10px)} }
        @keyframes drift1-3 { 0%,100%{transform:translate(-50%,-50%) translate(0,0)} 50%{transform:translate(-50%,-50%) translate(8px,-12px)} }

        @keyframes drift2-1 { 0%,100%{transform:translate(-50%,-50%) translate(-10px,-15px)} 25%{transform:translate(-50%,-50%) translate(12px,8px)} 50%{transform:translate(-50%,-50%) translate(-8px,12px)} 75%{transform:translate(-50%,-50%) translate(5px,-10px)} }
        @keyframes drift2-2 { 0%,100%{transform:translate(-50%,-50%) translate(15px,5px)} 50%{transform:translate(-50%,-50%) translate(-12px,-8px)} }
        @keyframes drift2-3 { 0%,100%{transform:translate(-50%,-50%) translate(-5px,10px)} 50%{transform:translate(-50%,-50%) translate(10px,-5px)} }

        @keyframes drift3-1 { 0%,100%{transform:translate(-50%,-50%) translate(-20px,-5px)} 33%{transform:translate(-50%,-50%) translate(15px,10px)} 66%{transform:translate(-50%,-50%) translate(-10px,20px)} }
        @keyframes drift3-2 { 0%,100%{transform:translate(-50%,-50%) translate(10px,-20px)} 50%{transform:translate(-50%,-50%) translate(-15px,15px)} }
        @keyframes drift3-3 { 0%,100%{transform:translate(-50%,-50%) translate(5px,15px)} 50%{transform:translate(-50%,-50%) translate(-20px,-10px)} }

        @keyframes drift4-1 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 20%{transform:translate(-50%,-50%) scale(1.15) translate(-5px,-5px)} 40%{transform:translate(-50%,-50%) scale(0.9) translate(5px,5px)} 60%{transform:translate(-50%,-50%) scale(1.1) translate(-8px,3px)} 80%{transform:translate(-50%,-50%) scale(0.95) translate(3px,-8px)} }
        @keyframes drift4-2 { 0%,100%{transform:translate(-50%,-50%) translate(10px,10px)} 50%{transform:translate(-50%,-50%) translate(-15px,-15px)} }
        @keyframes drift4-3 { 0%,100%{transform:translate(-50%,-50%) translate(-10px,15px)} 50%{transform:translate(-50%,-50%) translate(15px,-10px)} }

        @keyframes drift5-1 { 0%,100%{transform:translate(-50%,-50%) translate(-15px,-15px) scale(1)} 50%{transform:translate(-50%,-50%) translate(15px,10px) scale(1.2)} }
        @keyframes drift5-2 { 0%,100%{transform:translate(-50%,-50%) translate(10px,-10px) scale(1)} 50%{transform:translate(-50%,-50%) translate(-10px,15px) scale(1.3)} }
        @keyframes drift5-3 { 0%,100%{transform:translate(-50%,-50%) translate(0,10px)} 50%{transform:translate(-50%,-50%) translate(10px,-20px)} }

        @keyframes drift6-1 { 0%,100%{transform:translate(-50%,-50%) translate(-10px,-8px)} 50%{transform:translate(-50%,-50%) translate(10px,8px)} }
        @keyframes drift6-2 { 0%,100%{transform:translate(-50%,-50%) translate(12px,-5px)} 50%{transform:translate(-50%,-50%) translate(-8px,12px)} }
        @keyframes drift6-3 { 0%,100%{transform:translate(-50%,-50%) translate(-5px,10px)} 50%{transform:translate(-50%,-50%) translate(5px,-10px)} }

        @keyframes drift7-1 { 0%,100%{transform:translate(-50%,-50%) translate(-12px,-10px)} 50%{transform:translate(-50%,-50%) translate(12px,10px)} }
        @keyframes drift7-2 { 0%,100%{transform:translate(-50%,-50%) translate(10px,-12px)} 50%{transform:translate(-50%,-50%) translate(-10px,12px)} }
        @keyframes drift7-3 { 0%,100%{transform:translate(-50%,-50%) translate(0,8px)} 50%{transform:translate(-50%,-50%) translate(8px,-8px)} }

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
        @keyframes orbitA { 0%{transform:translate(-50%,-50%) rotate(0deg) translateX(42px) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg) translateX(42px) rotate(-360deg)} }
        @keyframes orbitB { 0%{transform:translate(-50%,-50%) rotate(180deg) translateX(54px) rotate(-180deg)} 100%{transform:translate(-50%,-50%) rotate(540deg) translateX(54px) rotate(-540deg)} }
        @keyframes orbitC { 0%{transform:translate(-50%,-50%) rotate(90deg) translateX(38px) rotate(-90deg)} 100%{transform:translate(-50%,-50%) rotate(450deg) translateX(38px) rotate(-450deg)} }
        @keyframes orbitD { 0%{transform:translate(-50%,-50%) rotate(270deg) translateX(48px) rotate(-270deg)} 100%{transform:translate(-50%,-50%) rotate(630deg) translateX(48px) rotate(-630deg)} }
        @keyframes orbitE { 0%{transform:translate(-50%,-50%) rotate(45deg) translateX(50px) rotate(-45deg)} 100%{transform:translate(-50%,-50%) rotate(405deg) translateX(50px) rotate(-405deg)} }
        @keyframes orbitF { 0%{transform:translate(-50%,-50%) rotate(135deg) translateX(58px) rotate(-135deg)} 100%{transform:translate(-50%,-50%) rotate(495deg) translateX(58px) rotate(-495deg)} }
        @keyframes orbitG { 0%{transform:translate(-50%,-50%) rotate(315deg) translateX(64px) rotate(-315deg)} 100%{transform:translate(-50%,-50%) rotate(675deg) translateX(64px) rotate(-675deg)} }

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

        /* Noise shift on hover */
        @keyframes noiseShift {
          0% { background-position: 0 0; }
          100% { background-position: 80px 80px; }
        }
        .noise-active {
          animation: noiseShift 8s linear infinite;
        }

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
