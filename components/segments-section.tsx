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
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
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
          className="t-display"
          style={{
            fontSize: "var(--text-display)",
            marginBottom: 48,
          }}
        >
          {t.segments.title}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {segments.map((seg, i) => (
            <Link
              key={seg.title}
              href={`/${lang}${seg.path}`}
              className="card segment-card"
              style={{
                padding: 32,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.4s ${i * 50}ms ease, transform 0.4s ${i * 50}ms ease`,
              }}
            >
              <h3
                className="t-display"
                style={{
                  fontSize: "var(--text-heading)",
                  marginBottom: 12,
                }}
              >
                {seg.title}
              </h3>
              <p className="t-caption">{seg.body}</p>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          section > .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
