"use client";

import { useState, useEffect, useRef } from "react";
import { getT, Locale } from "@/lib/i18n";

export default function FaqSection({ lang }: { lang: Locale }) {
  const t = getT(lang);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faq = t.faq;

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "var(--section-gap) 0",
        background: "#ffffff",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "clamp(2.5rem, 6vw, 6rem)",
          }}
          className="m-faq-grid"
        >
          {/* Left intro */}
          <div className="m-faq-intro">
            <p
              className="t-caption"
              style={{
                marginBottom: "1.75rem",
                color: "var(--text-tertiary)",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {faq.eyebrow}
            </p>
            <h2
              className="t-display"
              style={{
                fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                margin: "0 0 1.75rem",
              }}
            >
              {faq.title}
            </h2>
            <p
              className="t-lead"
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                color: "var(--text-secondary)",
                maxWidth: "36ch",
                margin: 0,
              }}
            >
              {faq.lead}
            </p>
          </div>

          {/* Right accordion */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {faq.items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <article
                  key={index}
                  style={{
                    borderTop: "1px solid var(--border-light)",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    type="button"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: 0,
                      color: "var(--text-primary)",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "1.85rem 0",
                      display: "grid",
                      gridTemplateColumns: "2.25rem 1fr auto",
                      alignItems: "center",
                      gap: "1.5rem",
                      fontSize: "1.0625rem",
                      fontWeight: 400,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.4,
                      transition: "color 0.25s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        color: isOpen ? "var(--text-primary)" : "var(--text-tertiary)",
                        fontVariantNumeric: "tabular-nums",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.question}</span>
                    <span
                      style={{
                        position: "relative",
                        width: 14,
                        height: 14,
                        flexShrink: 0,
                        display: "block",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: 0,
                          width: "100%",
                          height: 1,
                          background: isOpen
                            ? "var(--text-primary)"
                            : "var(--text-tertiary)",
                          transform: "translateY(-50%)",
                          transition:
                            "background 0.3s ease, transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 0,
                          width: 1,
                          height: "100%",
                          background: isOpen
                            ? "var(--text-primary)"
                            : "var(--text-tertiary)",
                          transform: isOpen
                            ? "translateX(-50%) rotate(90deg)"
                            : "translateX(-50%)",
                          transition:
                            "background 0.3s ease, transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)",
                        }}
                      />
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition:
                        "grid-template-rows 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p
                        style={{
                          padding: "0 0 2.25rem calc(2.25rem + 1.5rem)",
                          fontSize: "0.9375rem",
                          lineHeight: 1.75,
                          color: "var(--text-secondary)",
                          maxWidth: "62ch",
                          fontWeight: 400,
                          margin: 0,
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
            {/* Bottom border */}
            <div
              style={{
                borderTop: "1px solid var(--border-light)",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 950px) {
          .m-faq-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .m-faq-intro {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
}
