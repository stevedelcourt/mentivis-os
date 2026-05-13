"use client";

import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

interface ProductCard {
  tag: string;
  title: string;
  gradient: string;
  href: string;
}

interface ProductCardGridProps {
  lang: Locale;
}

const CARDS: ProductCard[] = [
  {
    tag: "MentivisOS",
    title: "Intelligence de formation",
    gradient: "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)",
    href: "/",
  },
  {
    tag: "TalentOS",
    title: "Talent Pipeline IA",
    gradient: "linear-gradient(135deg, #243A1A 0%, #607020 40%, #909840 78%, #A8B040 100%)",
    href: "/",
  },
  {
    tag: "Mentivis API",
    title: "Connecté à votre écosystème",
    gradient: "linear-gradient(135deg, #A03020 0%, #C05828 35%, #D08840 70%, #E0AA50 100%)",
    href: "/",
  },
];

const DESCRIPTION_KEYS = ["card1", "card2", "card3"] as const;

export default function ProductCardGrid({ lang }: ProductCardGridProps) {
  const t = getT(lang);
  return (
    <div className="product-card-grid-wrapper" style={{ marginTop: 32 }}>
      <div className="product-card-grid">
        {CARDS.map((card, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column" }}>
            <Link
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
                {/* Glass tag */}
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 10,
                    padding: "6px 12px 6px 8px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 130 130" fill="none">
                    <rect x="20" y="20" width="10" height="10" fill="white"/>
                    <rect x="100" y="20" width="10" height="10" fill="white"/>
                    <rect x="20" y="40" width="10" height="10" fill="white"/>
                    <rect x="40" y="40" width="10" height="10" fill="white"/>
                    <rect x="80" y="40" width="10" height="10" fill="white"/>
                    <rect x="100" y="40" width="10" height="10" fill="white"/>
                    <rect x="20" y="60" width="10" height="10" fill="white"/>
                    <rect x="40" y="60" width="10" height="10" fill="white"/>
                    <rect x="60" y="60" width="10" height="10" fill="white"/>
                    <rect x="80" y="60" width="10" height="10" fill="white"/>
                    <rect x="100" y="60" width="10" height="10" fill="white"/>
                    <rect x="20" y="80" width="10" height="10" fill="white"/>
                    <rect x="40" y="80" width="10" height="10" fill="white"/>
                    <rect x="80" y="80" width="10" height="10" fill="white"/>
                    <rect x="100" y="80" width="10" height="10" fill="white"/>
                    <rect x="20" y="100" width="10" height="10" fill="white"/>
                    <rect x="100" y="100" width="10" height="10" fill="white"/>
                  </svg>
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {card.tag}
                  </span>
                </div>

                {/* Title */}
                <span
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 14,
                    right: 14,
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
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 300,
                color: "#8A7D70",
                lineHeight: 1.5,
                marginTop: 12,
                marginBottom: 0,
              }}
            >
              {t.productCards[DESCRIPTION_KEYS[i]]}
            </p>
          </div>
        ))}
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
