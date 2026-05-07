"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

export default function ProofSection({ lang }: { lang: Locale }) {
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

  const outputs = t.proof.outputs;

  return (
    <section
      ref={ref}
      style={{
        padding: "var(--section-gap) 0",
        background: "var(--color-surface-1)",
      }}
    >
      <div className="container">
        <p
          style={{
            fontFamily: "var(--font-interface)",
            fontSize: "var(--text-micro)",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: 16,
          }}
        >
          Cas reel
        </p>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            color: "var(--color-ink-secondary)",
            maxWidth: 720,
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          {t.proof.situation}
        </p>

        <div
          style={{
            background: "var(--color-ground)",
            border: `1px solid var(--color-border)`,
            borderRadius: "var(--card-radius)",
            padding: 32,
            maxWidth: 640,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-interface)",
              fontSize: "var(--text-small)",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 24,
            }}
          >
            {outputs.title}
          </h3>

          {[
            outputs.feasibility,
            outputs.coverage,
            outputs.risk,
            outputs.duration,
            outputs.modules,
            outputs.ordering,
          ].map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-small)",
                color: "var(--color-ink-secondary)",
                padding: "8px 0",
                borderBottom: i < 5 ? `1px solid var(--color-border-soft)` : "none",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <blockquote
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-small)",
            color: "var(--color-ink-tertiary)",
            fontStyle: "italic",
            marginTop: 24,
            paddingLeft: 16,
            borderLeft: `2px solid var(--color-accent)`,
          }}
        >
          {t.proof.honesty}
        </blockquote>

        <p
          style={{
            fontFamily: "var(--font-interface)",
            fontSize: "var(--text-small)",
            color: "var(--color-ink-secondary)",
            marginTop: 32,
          }}
        >
          {t.proof.editorial}
        </p>
      </div>
    </section>
  );
}
