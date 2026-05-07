"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

export default function StepsSection({ lang }: { lang: Locale }) {
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const steps = [t.steps.step1, t.steps.step2, t.steps.step3];

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
            marginBottom: 64,
            textAlign: "center",
          }}
        >
          {t.steps.title}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--grid-gutter)",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.4s ${i * 50}ms ease, transform 0.4s ${i * 50}ms ease`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-interface)",
                  fontSize: "var(--text-micro)",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                  letterSpacing: "0.08em",
                }}
              >
                {step.number}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-heading)",
                  fontWeight: 300,
                  lineHeight: 1.2,
                  color: "var(--color-ink-primary)",
                  marginTop: 12,
                  marginBottom: 12,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-small)",
                  color: "var(--color-ink-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link
            href={`/${lang}/produit`}
            className="section-link"
            style={{
              fontFamily: "var(--font-interface)",
              fontSize: "var(--text-small)",
              color: "var(--color-accent)",
            }}
          >
            {t.steps.link} &rarr;
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
