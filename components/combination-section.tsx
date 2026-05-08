"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

export default function CombinationSection({ lang }: { lang: Locale }) {
  const t = getT(lang);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const lines = t.combination.body.split("\n").filter(Boolean);
  const isFr = lang === "fr";

  return (
    <section
      ref={ref}
      style={{
        padding: "var(--section-gap-sm) 0",
        background: "#ffffff",
      }}
    >
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Eyebrow */}
        <p
          className="t-caption"
          style={{
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 32,
          }}
        >
          {isFr ? "Pedigree" : "Pedigree"}
        </p>

        {/* Manifest items */}
        <div style={{ marginBottom: 40 }}>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                padding: "18px 0",
                borderBottom: i < lines.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 6,
                  height: 6,
                  background: "var(--text-primary)",
                  marginTop: 8,
                }}
              />
              <p
                style={{
                  fontSize: "clamp(17px, 2vw, 22px)",
                  fontWeight: 300,
                  lineHeight: 1.4,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                }}
              >
                {line}
              </p>
            </div>
          ))}
        </div>

        {/* CTA pill button */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${lines.length * 0.08}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${lines.length * 0.08}s`,
          }}
        >
          <Link
            href={`/${lang}/a-propos`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: "var(--r-pill)",
              background: "var(--text-primary)",
              color: "var(--bg-primary)",
              fontSize: "var(--text-button)",
              fontWeight: 400,
              letterSpacing: "0.01em",
              textDecoration: "none",
            }}
          >
            {t.combination.link}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
