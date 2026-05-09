"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

function parseMetric(line: string): { label: string; value: string; suffix?: string; detail?: string } {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return { label: line, value: "" };
  const label = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();

  // Coverage: "84 / 100"
  if (label.toLowerCase().includes("couverture") || label.toLowerCase().includes("coverage")) {
    const match = rest.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (match) return { label, value: match[1], suffix: `/${match[2]}` };
  }

  // Risk: "22"
  if (label.toLowerCase().includes("risque") || label.toLowerCase().includes("risk")) {
    return { label, value: rest };
  }

  // Duration: "70 heures - 7 semaines..." → extract number + unit, rest as detail
  if (label.toLowerCase().includes("duree") || label.toLowerCase().includes("duration")) {
    const match = rest.match(/^(\d+)\s*(\w+)/);
    if (match) {
      const detailStart = rest.indexOf(" - ");
      return { label, value: match[1], suffix: match[2].toLowerCase().startsWith("heure") || match[2].toLowerCase().startsWith("hour") ? "h" : match[2], detail: detailStart > -1 ? rest.slice(detailStart + 3) : undefined };
    }
  }

  // Modules: "7"
  if (label.toLowerCase().includes("modules") || label.toLowerCase().includes("module")) {
    return { label, value: rest };
  }

  // Feasibility: "exigeante" / "demanding"
  if (label.toLowerCase().includes("faisabilite") || label.toLowerCase().includes("feasibility")) {
    return { label, value: rest };
  }

  return { label, value: rest };
}

function parseOrdering(line: string): string[] {
  return line.split(">").map(s => s.trim()).filter(Boolean);
}

export default function ProofSection({ lang }: { lang: Locale }) {
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

  const outputs = t.proof.outputs;
  const metrics = [
    parseMetric(outputs.coverage),
    parseMetric(outputs.risk),
    parseMetric(outputs.duration),
    parseMetric(outputs.modules),
  ];
  const feasibility = parseMetric(outputs.feasibility);
  const orderingSteps = parseOrdering(outputs.ordering);
  const isFr = lang === "fr";

  return (
    <section
      ref={ref}
      style={{
        padding: "var(--section-gap-sm) 0",
        background: "#fefefe",
      }}
    >
      <div className="container">
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="var(--text-tertiary)" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="4" stroke="var(--text-tertiary)" strokeWidth="1.5"/>
            <line x1="12" y1="2" x2="12" y2="6" stroke="var(--text-tertiary)" strokeWidth="1.5"/>
            <line x1="12" y1="18" x2="12" y2="22" stroke="var(--text-tertiary)" strokeWidth="1.5"/>
            <line x1="2" y1="12" x2="6" y2="12" stroke="var(--text-tertiary)" strokeWidth="1.5"/>
            <line x1="18" y1="12" x2="22" y2="12" stroke="var(--text-tertiary)" strokeWidth="1.5"/>
          </svg>
          <p
            className="t-caption"
            style={{
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            {isFr ? "Cas reel" : "Real case"}
          </p>
        </div>

        {/* Situation */}
        <p
          className="t-caption"
          style={{
            color: "var(--text-tertiary)",
            marginBottom: 8,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {isFr ? "Situation" : "Situation"}
        </p>
        <p
          className="t-lead"
          style={{
            fontSize: "clamp(20px, 2.5vw, 28px)",
            lineHeight: 1.4,
            maxWidth: 820,
            marginBottom: 40,
          }}
        >
          {t.proof.situation}
        </p>

        {/* Output card */}
        <div
          style={{
            background: "var(--bg-primary)",
            borderRadius: "var(--r-card)",
            boxShadow: "var(--shadow-card-full)",
            overflow: "hidden",
            maxWidth: 720,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Header strip */}
          <div
            style={{
              height: 4,
              background: "linear-gradient(90deg, #7eb8c8, #96c4a8, #a89bc2, #c49696, #d4b896)",
            }}
          />

          <div style={{ padding: "28px 32px 32px" }}>
            <h3
              className="t-caption"
              style={{
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: 28,
              }}
            >
              {outputs.title}
            </h3>

            {/* Metrics grid 2×2 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "24px 32px",
                marginBottom: 28,
              }}
            >
              {metrics.map((m, i) => (
                <div key={i}>
                  <p
                    className="t-caption"
                    style={{
                      color: "var(--text-tertiary)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                      fontSize: "var(--text-tiny)",
                    }}
                  >
                    {m.label}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                    <span
                      style={{
                        fontSize: "clamp(28px, 3.5vw, 40px)",
                        fontWeight: 300,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        color: "var(--text-primary)",
                      }}
                    >
                      {m.value}
                    </span>
                    {m.suffix && (
                      <span
                        style={{
                          fontSize: "var(--text-body-sm)",
                          fontWeight: 300,
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {m.suffix}
                      </span>
                    )}
                  </div>
                  {m.detail && (
                    <p
                      className="t-caption"
                      style={{
                        color: "var(--text-tertiary)",
                        marginTop: 2,
                      }}
                    >
                      {m.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Feasibility badge */}
            <div style={{ marginBottom: 28 }}>
              <p
                className="t-caption"
                style={{
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                  fontSize: "var(--text-tiny)",
                }}
              >
                {feasibility.label}
              </p>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "var(--r-pill)",
                  background: "var(--text-primary)",
                  color: "var(--bg-primary)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                {feasibility.value}
              </span>
            </div>

            {/* Ordering sequence */}
            <div>
              <p
                className="t-caption"
                style={{
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  fontSize: "var(--text-tiny)",
                }}
              >
                {isFr ? "Ordonnancement" : "Ordering"}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "8px 4px",
                  background: "var(--bg-secondary)",
                  borderRadius: 12,
                  padding: "14px 18px",
                }}
              >
                {orderingSteps.map((step, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        fontSize: "var(--text-body-sm)",
                        fontWeight: 300,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {step}
                    </span>
                    {i < orderingSteps.length - 1 && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div
          style={{
            marginTop: 32,
            background: "#EDEAE3",
            borderRadius: "var(--r-card)",
            padding: "28px 32px",
            position: "relative",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
          }}
        >
          <p
            style={{
              fontSize: "clamp(22px, 2.5vw, 26px)",
              fontWeight: 300,
              lineHeight: 1.4,
              fontStyle: "italic",
              color: "var(--text-secondary)",
              paddingLeft: 24,
            }}
          >
            <span style={{ color: "var(--text-tertiary)", marginRight: 4 }}>«</span>
            {t.proof.honesty}
            <span style={{ color: "var(--text-tertiary)", marginLeft: 4 }}>»</span>
          </p>
          <p
            className="t-caption"
            style={{
              marginTop: 16,
              color: "var(--text-tertiary)",
              textAlign: "right",
            }}
          >
            {t.proof.editorial}
          </p>
        </div>
      </div>
    </section>
  );
}
