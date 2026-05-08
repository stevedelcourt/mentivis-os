"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

// ── GEO 1 — SINE WAVE WITH AMPLITUDE ELLIPSES ──
function GeoSineSvg() {
  const W = 320, H = 220, cx = W / 2, cy = H / 2;
  const S = "#1A1A18";

  // Sine wave path
  const amp = 58, x0 = 50, x1 = 270;
  let sineD = "";
  for (let x = x0; x <= x1; x += 1) {
    const t = (x - x0) / (x1 - x0);
    const y = cy + amp * Math.sin(t * Math.PI * 2);
    sineD += (x === x0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(2) + " ";
  }

  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", height: "auto", display: "block" }}>
      {/* Dotted axes */}
      <line x1={30} y1={cy} x2={290} y2={cy} stroke={S} strokeWidth={0.55} strokeDasharray="2,5" opacity={0.38} />
      <line x1={cx} y1={18} x2={cx} y2={202} stroke={S} strokeWidth={0.55} strokeDasharray="2,5" opacity={0.38} />

      {/* Two ellipses */}
      <ellipse cx={90} cy={cy} rx={16} ry={62} fill="none" stroke={S} strokeWidth={1.1} opacity={0.88} />
      <ellipse cx={230} cy={cy} rx={16} ry={62} fill="none" stroke={S} strokeWidth={1.1} opacity={0.88} />

      {/* Sine wave */}
      <path d={sineD} fill="none" stroke={S} strokeWidth={1.1} opacity={0.90} />

      {/* Tick marks Y */}
      {[-60, -30, 30, 60].map((dy) => (
        <line key={`y-${dy}`} x1={cx - 5} y1={cy + dy} x2={cx + 5} y2={cy + dy} stroke={S} strokeWidth={0.6} opacity={0.32} />
      ))}
      {/* Tick marks X */}
      {[50, 90, 130, 170, 210, 250].map((px) => (
        <line key={`x-${px}`} x1={px} y1={cy - 5} x2={px} y2={cy + 5} stroke={S} strokeWidth={0.6} opacity={0.32} />
      ))}
    </svg>
  );
}

// ── GEO 2 — ISOMETRIC CUBE WIREFRAME ──
function GeoCubeSvg() {
  const S = "#1A1A18";
  const cx = 160, cy = 110;

  // Vertices
  const A = [cx, cy - 72];
  const B = [cx + 62, cy - 36];
  const C = [cx + 62, cy + 36];
  const D = [cx, cy + 72];
  const E = [cx - 62, cy + 36];
  const F = [cx - 62, cy - 36];
  const G = [cx, cy];

  // Midpoints
  const m = {
    AB: [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2],
    BG: [(B[0] + G[0]) / 2, (B[1] + G[1]) / 2],
    GF: [(G[0] + F[0]) / 2, (G[1] + F[1]) / 2],
    FA: [(F[0] + A[0]) / 2, (F[1] + A[1]) / 2],
    BC: [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2],
    CD: [(C[0] + D[0]) / 2, (C[1] + D[1]) / 2],
    DG: [(D[0] + G[0]) / 2, (D[1] + G[1]) / 2],
    DE: [(D[0] + E[0]) / 2, (D[1] + E[1]) / 2],
    EF: [(E[0] + F[0]) / 2, (E[1] + F[1]) / 2],
  };

  function ln(x1: number, y1: number, x2: number, y2: number, w?: number, op?: number, dash?: string) {
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={S} strokeWidth={w || 1.1} opacity={op || 0.88} strokeDasharray={dash} />;
  }
  function dot(x: number, y: number, r: number) {
    return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill={S} opacity={0.82} />;
  }

  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", height: "auto", display: "block" }}>
      {/* Construction lines (extended, dotted) */}
      {ln(A[0], A[1], A[0], A[1] - 36, 0.42, 0.22, "3,5")}
      {ln(B[0], B[1], B[0] + 42, B[1] - 24, 0.42, 0.22, "3,5")}
      {ln(F[0], F[1], F[0] - 42, F[1] - 24, 0.42, 0.22, "3,5")}
      {ln(C[0], C[1], C[0] + 42, C[1] + 24, 0.42, 0.22, "3,5")}
      {ln(E[0], E[1], E[0] - 42, E[1] + 24, 0.42, 0.22, "3,5")}
      {ln(D[0], D[1], D[0], D[1] + 36, 0.42, 0.22, "3,5")}

      {/* Far-corner diagonals (very faint) */}
      {ln(A[0], A[1], D[0], D[1], 0.35, 0.15, "3,6")}
      {ln(F[0], F[1], C[0], C[1], 0.35, 0.15, "3,6")}
      {ln(B[0], B[1], E[0], E[1], 0.35, 0.15, "3,6")}

      {/* Face subdivisions */}
      {ln(m.FA[0], m.FA[1], m.BG[0], m.BG[1], 0.65, 0.48)}
      {ln(m.AB[0], m.AB[1], m.GF[0], m.GF[1], 0.65, 0.48)}
      {ln(m.BC[0], m.BC[1], m.DG[0], m.DG[1], 0.65, 0.48)}
      {ln(m.BG[0], m.BG[1], m.CD[0], m.CD[1], 0.65, 0.48)}
      {ln(m.EF[0], m.EF[1], m.DG[0], m.DG[1], 0.65, 0.48)}
      {ln(m.GF[0], m.GF[1], m.DE[0], m.DE[1], 0.65, 0.48)}

      {/* Main outer edges */}
      {ln(A[0], A[1], B[0], B[1], 1.45, 0.92)}
      {ln(B[0], B[1], C[0], C[1], 1.45, 0.92)}
      {ln(C[0], C[1], D[0], D[1], 1.45, 0.92)}
      {ln(D[0], D[1], E[0], E[1], 1.45, 0.92)}
      {ln(E[0], E[1], F[0], F[1], 1.45, 0.92)}
      {ln(F[0], F[1], A[0], A[1], 1.45, 0.92)}

      {/* Inner skeleton */}
      {ln(G[0], G[1], A[0], A[1], 1.45, 0.92)}
      {ln(G[0], G[1], C[0], C[1], 1.45, 0.92)}
      {ln(G[0], G[1], E[0], E[1], 1.45, 0.92)}

      {/* Vertex marks */}
      {dot(A[0], A[1], 2)}
      {dot(B[0], B[1], 2)}
      {dot(C[0], C[1], 2)}
      {dot(D[0], D[1], 2)}
      {dot(E[0], E[1], 2)}
      {dot(F[0], F[1], 2)}
      {dot(G[0], G[1], 2)}
    </svg>
  );
}

// ── GEO 3 — ECCENTRIC CONCENTRIC CIRCLES ──
function GeoSpiralSvg() {
  const S = "#1A1A18";
  const cx = 140, cy = 110;
  const n = 16;
  const circles = [];

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const r = 130 * (1 - t * 0.92);
    const shift = t * t * t * 92;
    const opacity = 0.3 + t * 0.55;
    const strokeW = 0.8 + t * 0.55;

    circles.push(
      <circle
        key={i}
        cx={cx + shift}
        cy={cy}
        r={r}
        fill="none"
        stroke={S}
        strokeWidth={strokeW}
        opacity={opacity}
      />
    );
  }

  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", height: "auto", display: "block" }}>
      {/* Outer dotted guide circle */}
      <circle cx={cx} cy={cy} r={140} fill="none" stroke={S} strokeWidth={0.48} strokeDasharray="2,5" opacity={0.32} />
      {/* Concentric circles */}
      {circles}
      {/* Small square at center */}
      <rect x={cx + 92 - 3} y={cy - 3} width={6} height={6} fill={S} opacity={0.9} />
    </svg>
  );
}

export default function MathFeaturesSection({ lang }: { lang: Locale }) {
  const t = getT(lang);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mt = t.mathFeatures;

  const cards = [
    {
      title: mt.cards.saddle.title,
      desc: mt.cards.saddle.description,
      Visual: GeoSineSvg,
    },
    {
      title: mt.cards.hilbert.title,
      desc: mt.cards.hilbert.description,
      Visual: GeoCubeSvg,
    },
    {
      title: mt.cards.mobius.title,
      desc: mt.cards.mobius.description,
      Visual: GeoSpiralSvg,
    },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 760px) {
          .math-features-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <section
        ref={ref}
        style={{
          background: "#ffffff",
          padding: "var(--section-gap) 0",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="container">
          <div style={{ marginBottom: 40 }}>
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
              {mt.eyebrow}
            </p>
            <h2
              className="t-display"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                maxWidth: 480,
                lineHeight: 1.35,
              }}
            >
              {mt.title}
            </h2>
          </div>

          <div
            className="math-features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {cards.map((card, i) => {
              const Visual = card.Visual;
              return (
                <div
                  key={i}
                  style={{
                    background: "#EDEAE3",
                    borderRadius: 22,
                    overflow: "hidden",
                    padding: "32px 28px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(18px)",
                    transition: `opacity 0.6s ease ${0.15 * (i + 1)}s, transform 0.6s ease ${0.15 * (i + 1)}s`,
                  }}
                >
                  {/* Visual area */}
                  <div
                    style={{
                      width: "100%",
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 0 24px",
                      minHeight: 160,
                    }}
                  >
                    <div style={{ width: "100%", maxWidth: 300 }}>
                      <Visual />
                    </div>
                  </div>
                  {/* Text inside card */}
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 17,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      color: "var(--text-primary)",
                      marginBottom: 8,
                    }}
                  >
                    {card.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "var(--text-tertiary)",
                      maxWidth: 280,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
