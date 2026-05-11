"use client";

import Link from "next/link";

interface ProductCard {
  tag: string;
  title: string;
  gradient: string;
  href: string;
}

interface ProductCardGridProps {
  lang: string;
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

export default function ProductCardGrid({ lang }: ProductCardGridProps) {
  return (
    <div className="product-card-grid-wrapper">
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#777169",
          marginBottom: 20,
        }}
      >
        Modules
      </p>
      <div className="product-card-grid">
        {CARDS.map((card, i) => (
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
