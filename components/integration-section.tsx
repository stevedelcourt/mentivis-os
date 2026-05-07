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
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
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
          className="t-display"
          style={{
            fontSize: "var(--text-display)",
            marginBottom: 48,
            textAlign: "center",
          }}
        >
          {t.integration.title}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {modes.map((mode, i) => (
            <Link
              key={mode.title}
              href={`/${lang}${mode.path}`}
              className="card"
              style={{
                textAlign: "center",
                padding: 32,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.4s ${i * 50}ms ease, transform 0.4s ${i * 50}ms ease`,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-heading)",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "var(--text-primary)",
                  marginBottom: 12,
                }}
              >
                {mode.title}
              </h3>
              <p className="t-caption">{mode.body}</p>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            href={`/${lang}/integration`}
            className="section-link t-caption"
            style={{ color: "var(--text-tertiary)" }}
          >
            {t.integration.link} &rarr;
          </Link>
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
