"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import VisualOrb from "@/components/visual-orb";

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
    { ...t.segments.individuel, path: "/pour-qui/individuel", orb: "narration" as const },
    { ...t.segments.corporate, path: "/pour-qui/corporate", orb: "terravert" as const },
    { ...t.segments.formation, path: "/pour-qui/formation", orb: "dusk" as const },
    { ...t.segments.competences, path: "/pour-qui/competences", orb: "characters" as const },
  ];

  return (
    <section ref={ref} className="section">
      <div className="container">
        <h2
          className="t-display"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <h3
                  className="t-display"
                  style={{
                    fontSize: "var(--text-heading)",
                  }}
                >
                  {seg.title}
                </h3>
                <VisualOrb variant={seg.orb} size="sm" />
              </div>
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
