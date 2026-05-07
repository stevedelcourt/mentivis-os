"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

export default function SegmentsSection({ lang }: { lang: Locale }) {
  const t = getT(lang);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const segments = [
    { ...t.segments.individuel, path: "/pour-qui/individuel" },
    { ...t.segments.corporate, path: "/pour-qui/corporate" },
    { ...t.segments.formation, path: "/pour-qui/formation" },
    { ...t.segments.competences, path: "/pour-qui/competences" },
  ];

  return (
    <section ref={ref} className="section">
      <div className="container">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--color-ink-primary)",
            marginBottom: 48,
          }}
        >
          {t.segments.title}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--grid-gutter)",
          }}
        >
          {segments.map((seg, i) => (
            <Link
              key={seg.title}
              href={`/${lang}${seg.path}`}
              className="segment-card"
              style={{
                background: "var(--color-surface-1)",
                border: `1px solid var(--color-border)`,
                borderRadius: "var(--card-radius)",
                padding: 32,
                borderLeft: `2px solid var(--color-accent)`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.4s ${i * 50}ms ease, transform 0.4s ${i * 50}ms ease, border-color 0.2s ease`,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-heading)",
                  fontWeight: 300,
                  color: "var(--color-ink-primary)",
                  marginBottom: 12,
                }}
              >
                {seg.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-small)",
                  color: "var(--color-ink-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {seg.body}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .segment-card:hover {
          border-color: rgba(200, 169, 110, 0.4) !important;
        }
        @media (max-width: 768px) {
          section > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
