"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

export default function IntegrationSection({ lang }: { lang: Locale }) {
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

  const modes = [
    { ...t.integration.direct, path: "/integration/acces-direct" },
    { ...t.integration.license, path: "/integration/licence-entreprise" },
    { ...t.integration.api, path: "/integration/api" },
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
            textAlign: "center",
          }}
        >
          {t.integration.title}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--grid-gutter)",
          }}
        >
          {modes.map((mode, i) => (
            <Link
              key={mode.title}
              href={`/${lang}${mode.path}`}
              style={{
                textAlign: "center",
                padding: 32,
                border: `1px solid var(--color-border)`,
                borderRadius: "var(--card-radius)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.4s ${i * 50}ms ease, transform 0.4s ${i * 50}ms ease, border-color 0.2s ease`,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-interface)",
                  fontSize: "var(--text-heading)",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "var(--color-ink-primary)",
                  marginBottom: 12,
                }}
              >
                {mode.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-small)",
                  color: "var(--color-ink-secondary)",
                }}
              >
                {mode.body}
              </p>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            href={`/${lang}/integration`}
            className="section-link"
            style={{
              fontFamily: "var(--font-interface)",
              fontSize: "var(--text-small)",
              color: "var(--color-accent)",
            }}
          >
            {t.integration.link} &rarr;
          </Link>
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
