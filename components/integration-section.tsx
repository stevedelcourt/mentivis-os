"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

const gradientVars = [
  "--integration-grad-1",
  "--integration-grad-2",
  "--integration-grad-3",
];

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
    <section ref={ref} className="section" style={{ background: "#ffffff" }}>
      <div className="container">
        <h2
          className="t-display"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            marginBottom: 48,
          }}
        >
          {t.integration.title}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {modes.map((mode, i) => (
            <Link
              key={mode.title}
              href={`/${lang}${mode.path}`}
              className="integration-card"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.4s ${i * 50}ms ease, transform 0.4s ${i * 50}ms ease`,
              }}
            >
              <div
                className="integration-card__bg"
                style={{ background: `var(${gradientVars[i]})` }}
              />
              <div className="integration-card__grain" />
              <div className="integration-card__content">
                <h3 className="integration-card__title">{mode.title}</h3>
                <p className="integration-card__body">{mode.body}</p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            href={`/${lang}/integration`}
            className="section-link t-caption"
            style={{ color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            {t.integration.link}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
