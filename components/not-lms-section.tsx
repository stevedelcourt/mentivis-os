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
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
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
        background: "var(--color-surface-1)",
      }}
    >
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
          {t.notLms.title}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-micro)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-ink-tertiary)",
                marginBottom: 20,
              }}
            >
              LMS
            </h3>
            <ul>
              {t.notLms.lms.map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-small)",
                    color: "var(--color-ink-tertiary)",
                    padding: "10px 0",
                    borderBottom: `1px solid var(--color-border-soft)`,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              style={{
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-micro)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: 20,
              }}
            >
              MentivisOS
            </h3>
            <ul>
              {t.notLms.mentivos.map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-small)",
                    color: "var(--color-ink-secondary)",
                    padding: "10px 0",
                    borderBottom: `1px solid var(--color-border-soft)`,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
