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
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
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
          className="t-display"
          style={{
            fontSize: "var(--text-display)",
            marginBottom: 64,
            textAlign: "center",
          }}
        >
          {t.steps.title}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
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
                className="t-caption"
                style={{ color: "var(--text-tertiary)", fontWeight: 500 }}
              >
                {step.number}
              </span>
              <h3
                className="t-display"
                style={{
                  fontSize: "var(--text-heading)",
                  marginTop: 12,
                  marginBottom: 12,
                }}
              >
                {step.title}
              </h3>
              <p className="t-caption">{step.body}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link
            href={`/${lang}/produit`}
            className="section-link t-caption"
            style={{ color: "var(--text-tertiary)" }}
          >
            {t.steps.link} &rarr;
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
