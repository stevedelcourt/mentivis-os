"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "../lib/i18n";
import Link from "next/link";

/* ─── SVG Illustrations (line-art, minimal) ─── */

function SvgDiagnostic() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      <circle cx="100" cy="100" r="60" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <circle cx="100" cy="100" r="40" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <circle cx="100" cy="100" r="20" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="40" y1="100" x2="160" y2="100" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="100" y1="40" x2="100" y2="160" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="57.6" y1="57.6" x2="142.4" y2="142.4" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="142.4" y1="57.6" x2="57.6" y2="142.4" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <path d="M100 100 L130 70" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4" />
      <path d="M100 100 L115 130" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4" />
      <path d="M100 100 L75 95" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4" />
      <circle cx="130" cy="70" r="3" fill="#1a1a1a" opacity="0.4" />
      <circle cx="115" cy="130" r="3" fill="#1a1a1a" opacity="0.4" />
      <circle cx="75" cy="95" r="3" fill="#1a1a1a" opacity="0.4" />
    </svg>
  );
}

function SvgAccompaniment() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      <path d="M40 140 Q70 100 100 130 T160 110" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <path d="M40 150 Q70 110 100 140 T160 120" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <circle cx="60" cy="80" r="18" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <circle cx="100" cy="60" r="14" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <circle cx="140" cy="75" r="16" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <line x1="78" y1="80" x2="86" y2="65" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="114" y1="65" x2="124" y2="72" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <rect x="50" y="115" width="100" height="36" rx="18" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <circle cx="68" cy="133" r="3" fill="#1a1a1a" opacity="0.3" />
      <circle cx="78" cy="133" r="3" fill="#1a1a1a" opacity="0.3" />
      <circle cx="88" cy="133" r="3" fill="#1a1a1a" opacity="0.3" />
    </svg>
  );
}

function SvgSteering() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      <circle cx="100" cy="100" r="55" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <circle cx="100" cy="100" r="35" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="100" y1="45" x2="100" y2="65" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <line x1="100" y1="135" x2="100" y2="155" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <line x1="45" y1="100" x2="65" y2="100" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <line x1="135" y1="100" x2="155" y2="100" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <polygon points="100,85 108,100 100,115 92,100" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="100" cy="100" r="4" fill="#1a1a1a" opacity="0.3" />
    </svg>
  );
}

function SvgMeasurement() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      <line x1="40" y1="160" x2="160" y2="160" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="40" y1="160" x2="40" y2="40" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <rect x="55" y="110" width="18" height="50" rx="2" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <rect x="85" y="80" width="18" height="80" rx="2" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <rect x="115" y="95" width="18" height="65" rx="2" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <rect x="145" y="60" width="18" height="100" rx="2" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <path d="M64 95 Q100 70 136 50" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="64" cy="95" r="3" fill="#1a1a1a" opacity="0.3" />
      <circle cx="100" cy="70" r="3" fill="#1a1a1a" opacity="0.3" />
      <circle cx="136" cy="50" r="3" fill="#1a1a1a" opacity="0.3" />
    </svg>
  );
}

function SvgCompliance() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      <path d="M100 40 L130 55 L130 95 Q130 125 100 145 Q70 125 70 95 L70 55 Z" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <path d="M90 95 L98 105 L112 85" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.3" fill="none" />
      <line x1="85" y1="65" x2="115" y2="65" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="85" y1="75" x2="115" y2="75" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="85" y1="85" x2="115" y2="85" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <circle cx="155" cy="50" r="12" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="149" y1="50" x2="155" y2="56" stroke="#1a1a1a" strokeWidth="1" opacity="0.25" />
      <line x1="155" y1="56" x2="161" y2="44" stroke="#1a1a1a" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

function SvgScheduling() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      <rect x="50" y="50" width="40" height="40" rx="4" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <rect x="110" y="50" width="40" height="40" rx="4" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <rect x="50" y="110" width="40" height="40" rx="4" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <rect x="110" y="110" width="40" height="40" rx="4" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.2" />
      <line x1="90" y1="70" x2="110" y2="70" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="90" y1="130" x2="110" y2="130" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="70" y1="90" x2="70" y2="110" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <line x1="130" y1="90" x2="130" y2="110" stroke="#1a1a1a" strokeWidth="0.75" opacity="0.15" />
      <path d="M65 130 L85 150" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" fill="none" />
      <path d="M125 90 L145 70" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="85" cy="150" r="3" fill="#1a1a1a" opacity="0.3" />
      <circle cx="145" cy="70" r="3" fill="#1a1a1a" opacity="0.3" />
    </svg>
  );
}

/* ─── Component ─── */

export default function ModulesSection({ lang }: { lang: Locale }) {
  const t = getT(lang);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  const modules = [
    {
      title: t.modules.cognitive.title,
      description: t.modules.cognitive.description,
      href: `/${lang}/modules/adaptive`,
      illustration: <SvgDiagnostic />,
    },
    {
      title: t.modules.engagement.title,
      description: t.modules.engagement.description,
      href: `/${lang}/modules/adaptive`,
      illustration: <SvgAccompaniment />,
    },
    {
      title: t.modules.collaboration.title,
      description: t.modules.collaboration.description,
      href: `/${lang}/modules/visual`,
      illustration: <SvgSteering />,
    },
    {
      title: t.modules.analytics.title,
      description: t.modules.analytics.description,
      href: `/${lang}/modules/adaptive`,
      illustration: <SvgMeasurement />,
    },
    {
      title: t.modules.security.title,
      description: t.modules.security.description,
      href: `/${lang}/modules/visual`,
      illustration: <SvgCompliance />,
    },
    {
      title: t.modules.platform.title,
      description: t.modules.platform.description,
      href: `/${lang}/modules/adaptive`,
      illustration: <SvgScheduling />,
    },
  ];

  return (
    <section ref={ref} className="section" style={{ background: "#ffffff" }}>
      <div className="container">
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
            flexWrap: "wrap",
            gap: 24,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div style={{ maxWidth: 600 }}>
            <h2
              className="t-display"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              {t.modules.title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 16,
                fontWeight: 300,
                lineHeight: 1.5,
                color: "var(--text-secondary)",
              }}
            >
              {t.modules.subtitle}
            </p>
          </div>

          <Link
            href={`/${lang}/modules/adaptive`}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              fontWeight: 400,
              padding: "10px 24px",
              borderRadius: 9999,
              border: "1px solid #e5e5e5",
              background: "#ffffff",
              color: "#1a1a1a",
              textDecoration: "none",
              transition: "all 0.18s ease",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f5f5";
              e.currentTarget.style.borderColor = "#d4d4d4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.borderColor = "#e5e5e5";
            }}
          >
            {lang === "fr" ? "En savoir plus" : "Learn more"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {modules.map((m, i) => (
            <Link
              key={m.title}
              href={m.href}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 24,
                background: "#f5f5f5",
                padding: "32px 28px 28px",
                textDecoration: "none",
                color: "inherit",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ${0.1 + i * 0.06}s ease, transform 0.5s ${0.1 + i * 0.06}s ease, background 0.18s ease`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eeeeee";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
              }}
            >
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" }}>
                <div style={{ width: 140, height: 140 }}>
                  {m.illustration}
                </div>
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 17,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    color: "#1a1a1a",
                    marginBottom: 8,
                  }}
                >
                  {m.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 300,
                    lineHeight: 1.5,
                    color: "#6b6b6b",
                  }}
                >
                  {m.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          section > .container > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          section > .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
