"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

export default function NotLmsSection({ lang }: { lang: Locale }) {
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

  return (
    <section
      ref={ref}
      style={{
        padding: "var(--section-gap) 0",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="container">
        <h2
          className="t-display"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            marginBottom: 48,
          }}
        >
          {t.notLms.title}
        </h2>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              borderBottom: "2px solid var(--text-primary)",
              marginBottom: 0,
            }}
          >
            <div
              className="t-caption"
              style={{
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                padding: "16px 0",
                fontSize: 12,
              }}
            >
              {t.notLms.lmsLabel}
            </div>
            <div
              className="t-caption"
              style={{
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-primary)",
                padding: "16px 0",
                fontSize: 12,
              }}
            >
              {t.notLms.mentivisLabel}
            </div>
          </div>

          {/* Table rows */}
          {t.notLms.rows.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              <div
                className="t-caption"
                style={{
                  padding: "20px 24px 20px 0",
                  color: "var(--text-tertiary)",
                  fontSize: 15,
                  lineHeight: 1.5,
                }}
              >
                {row.lms}
              </div>
              <div
                className="t-caption"
                style={{
                  padding: "20px 0 20px 24px",
                  color: "var(--text-primary)",
                  fontSize: 15,
                  lineHeight: 1.5,
                  fontWeight: 450,
                }}
              >
                {row.mentivis}
              </div>
            </div>
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
