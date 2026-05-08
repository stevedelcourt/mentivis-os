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
            fontSize: "var(--text-display)",
            marginBottom: 48,
          }}
        >
          {t.notLms.title}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div>
            <h3
              className="t-caption"
              style={{
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: 20,
              }}
            >
              LMS
            </h3>
            <ul>
              {t.notLms.lms.map((item) => (
                <li
                  key={item}
                  className="t-caption"
                  style={{
                    padding: "10px 0",
                    borderBottom: `1px solid var(--border-light)`,
                    color: "var(--text-tertiary)",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="t-caption"
              style={{
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-primary)",
                marginBottom: 20,
              }}
            >
              Mentivis OS
            </h3>
            <ul>
              {t.notLms.mentivos.map((item) => (
                <li
                  key={item}
                  className="t-caption"
                  style={{
                    padding: "10px 0",
                    borderBottom: `1px solid var(--border-light)`,
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
        @media (max-width: 1024px) {
          section > .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
