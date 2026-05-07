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
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
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
        background: "var(--bg-primary)",
      }}
    >
      <div className="container">
        <p
          className="t-caption"
          style={{
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 16,
          }}
        >
          Cas reel
        </p>

        <p
          className="t-lead"
          style={{ maxWidth: 720, marginBottom: 40 }}
        >
          {t.proof.situation}
        </p>

        <div
          className="card"
          style={{
            padding: 32,
            maxWidth: 640,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <h3
            className="t-caption"
            style={{
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
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
              className="t-caption"
              style={{
                padding: "10px 0",
                borderBottom: i < 5 ? `1px solid var(--border-light)` : "none",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <blockquote
          className="t-caption"
          style={{
            color: "var(--text-tertiary)",
            fontStyle: "italic",
            marginTop: 24,
            paddingLeft: 16,
            borderLeft: `2px solid var(--border-light)`,
          }}
        >
          {t.proof.honesty}
        </blockquote>

        <p
          className="t-caption"
          style={{ marginTop: 32, color: "var(--text-secondary)" }}
        >
          {t.proof.editorial}
        </p>
      </div>
    </section>
  );
}
