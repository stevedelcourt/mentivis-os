"use client";

import Link from "next/link";

// ── GEO 1 — NESTED ROSES ──
function GeoSineSvg({ color = "#1A1A18" }: { color?: string }) {
  const S = color;
  const CX = 160, CY = 110;
  const τ = Math.PI * 2;
  const paths: string[] = [];

  for (let n = 1; n <= 8; n++) {
    const r0 = (n * 168 * 0.92) / 8;
    let d = "";
    for (let i = 0; i <= 720; i++) {
      const θ = (i / 720) * τ;
      const r = r0 * Math.abs(Math.cos(n * θ));
      const x = CX + r * Math.cos(θ);
      const y = CY - r * Math.sin(θ);
      d += (i === 0 ? "M" : "L") + `${x.toFixed(2)},${y.toFixed(2)} `;
    }
    paths.push(d.trim());
  }

  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", height: "auto", display: "block" }}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={S}
          strokeWidth={1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.28 + (i + 1) * 0.09}
        />
      ))}
    </svg>
  );
}

// ── GEO 2 — ISOMETRIC CUBE WIREFRAME ──
function GeoCubeSvg({ color = "#1A1A18" }: { color?: string }) {
  const S = color;
  const cx = 160, cy = 110;

  const A = [cx, cy - 72];
  const B = [cx + 62, cy - 36];
  const C = [cx + 62, cy + 36];
  const D = [cx, cy + 72];
  const E = [cx - 62, cy + 36];
  const F = [cx - 62, cy - 36];
  const G = [cx, cy];

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
      {ln(A[0], A[1], A[0], A[1] - 36, 0.42, 0.22, "3,5")}
      {ln(B[0], B[1], B[0] + 42, B[1] - 24, 0.42, 0.22, "3,5")}
      {ln(F[0], F[1], F[0] - 42, F[1] - 24, 0.42, 0.22, "3,5")}
      {ln(C[0], C[1], C[0] + 42, C[1] + 24, 0.42, 0.22, "3,5")}
      {ln(E[0], E[1], E[0] - 42, E[1] + 24, 0.42, 0.22, "3,5")}
      {ln(D[0], D[1], D[0], D[1] + 36, 0.42, 0.22, "3,5")}

      {ln(A[0], A[1], D[0], D[1], 0.35, 0.15, "3,6")}
      {ln(F[0], F[1], C[0], C[1], 0.35, 0.15, "3,6")}
      {ln(B[0], B[1], E[0], E[1], 0.35, 0.15, "3,6")}

      {ln(m.FA[0], m.FA[1], m.BG[0], m.BG[1], 0.65, 0.48)}
      {ln(m.AB[0], m.AB[1], m.GF[0], m.GF[1], 0.65, 0.48)}
      {ln(m.BC[0], m.BC[1], m.DG[0], m.DG[1], 0.65, 0.48)}
      {ln(m.BG[0], m.BG[1], m.CD[0], m.CD[1], 0.65, 0.48)}
      {ln(m.EF[0], m.EF[1], m.DG[0], m.DG[1], 0.65, 0.48)}
      {ln(m.GF[0], m.GF[1], m.DE[0], m.DE[1], 0.65, 0.48)}

      {ln(A[0], A[1], B[0], B[1], 1.45, 0.92)}
      {ln(B[0], B[1], C[0], C[1], 1.45, 0.92)}
      {ln(C[0], C[1], D[0], D[1], 1.45, 0.92)}
      {ln(D[0], D[1], E[0], E[1], 1.45, 0.92)}
      {ln(E[0], E[1], F[0], F[1], 1.45, 0.92)}
      {ln(F[0], F[1], A[0], A[1], 1.45, 0.92)}

      {ln(G[0], G[1], A[0], A[1], 1.45, 0.92)}
      {ln(G[0], G[1], C[0], C[1], 1.45, 0.92)}
      {ln(G[0], G[1], E[0], E[1], 1.45, 0.92)}

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
function GeoSpiralSvg({ color = "#1A1A18" }: { color?: string }) {
  const S = color;
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
      <circle cx={cx} cy={cy} r={140} fill="none" stroke={S} strokeWidth={0.48} strokeDasharray="2,5" opacity={0.32} />
      {circles}
      <rect x={cx + 92 - 3} y={cy - 3} width={6} height={6} fill={S} opacity={0.9} />
    </svg>
  );
}

interface ProductCard {
  tag: string;
  title: string;
  gradient: string;
  href: string;
  Visual: React.FC<{ color?: string }>;
}

interface ProductCardGridProps {
  lang: string;
}

const CARDS: ProductCard[] = [
  {
    tag: "MENTIVIS OS",
    title: "Intelligence de formation",
    gradient: "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)",
    href: "/",
    Visual: GeoSineSvg,
  },
  {
    tag: "TALENT OS",
    title: "Talent Pipeline IA",
    gradient: "linear-gradient(135deg, #243A1A 0%, #607020 40%, #909840 78%, #A8B040 100%)",
    href: "/",
    Visual: GeoCubeSvg,
  },
  {
    tag: "MENTIVIS API",
    title: "Connecté à votre écosystème",
    gradient: "linear-gradient(135deg, #A03020 0%, #C05828 35%, #D08840 70%, #E0AA50 100%)",
    href: "/",
    Visual: GeoSpiralSvg,
  },
];

export default function ProductCardGrid({ lang }: ProductCardGridProps) {
  return (
    <div className="product-card-grid-wrapper" style={{ marginTop: 32 }}>
      <div className="product-card-grid">
        {CARDS.map((card, i) => {
          const Visual = card.Visual;
          return (
            <Link
              key={i}
              href={`/${lang}${card.href}`}
              className="product-card-link"
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <div
                className="product-card"
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: 18,
                  overflow: "hidden",
                  background: card.gradient,
                  transition: "transform .45s cubic-bezier(.22,1,.36,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* SVG Illustration — right side, full height with padding */}
                <div
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                    bottom: 16,
                    width: "auto",
                    maxWidth: "45%",
                    opacity: 0.35,
                    zIndex: 1,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Visual color="#ffffff" />
                </div>

                {/* Tag */}
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 400,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    zIndex: 2,
                  }}
                >
                  {card.tag}
                </span>

                {/* Title */}
                <span
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 14,
                    right: "45%",
                    fontFamily: "var(--font-sans)",
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: 1.38,
                    letterSpacing: "-0.005em",
                    color: "#ffffff",
                    zIndex: 2,
                    textAlign: "left",
                  }}
                >
                  {card.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .product-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .product-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
