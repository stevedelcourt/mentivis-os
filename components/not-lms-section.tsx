"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6l12 12" stroke="#c45c4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17l-5-5" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function NotLmsSection({ lang }: { lang: Locale }) {
  const t = getT(lang);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
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
            fontSize: "clamp(28px, 4vw, 44px)",
            marginBottom: 48,
            lineHeight: 1.15,
          }}
        >
          {t.notLms.title}
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {t.notLms.rows.map((row, idx) => (
            <div
              key={idx}
              className="notlms-card"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease ${idx * 0.08}s, transform 0.5s ease ${idx * 0.08}s`,
              }}
            >
              <div
                className="notlms-card-inner"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1px 1fr",
                  gap: 0,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                  const accent = el.querySelector(".notlms-accent") as HTMLElement;
                  if (accent) accent.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                  const accent = el.querySelector(".notlms-accent") as HTMLElement;
                  if (accent) accent.style.opacity = "0.6";
                }}
              >
                {/* LMS side */}
                <div
                  style={{
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <CloseIcon />
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: "var(--text-tertiary)",
                      margin: 0,
                    }}
                  >
                    {row.lms}
                  </p>
                </div>

                {/* Divider */}
                <div
                  style={{
                    background: "var(--border-light)",
                    width: 1,
                    margin: "16px 0",
                  }}
                />

                {/* MentivisOS side */}
                <div
                  style={{
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    position: "relative",
                  }}
                >
                  <div
                    className="notlms-accent"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 16,
                      bottom: 16,
                      width: 3,
                      background: "#2563EB",
                      borderRadius: "0 2px 2px 0",
                      opacity: 0.6,
                      transition: "opacity 0.25s ease",
                    }}
                  />
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <CheckIcon />
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: "var(--text-primary)",
                      fontWeight: 450,
                      margin: 0,
                    }}
                  >
                    {row.mentivis}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .notlms-card-inner {
            grid-template-columns: 1fr !important;
          }
          .notlms-card-inner > div:nth-child(2) {
            display: none !important;
          }
          .notlms-card-inner > div:last-child {
            border-top: 1px solid var(--border-light);
          }
          .notlms-card-inner > div:last-child .notlms-accent {
            top: 12px;
            bottom: 12px;
          }
        }
      `}</style>
    </section>
  );
}
