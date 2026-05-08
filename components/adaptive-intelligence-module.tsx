"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

const capabilityGradients = [
  "--adaptive-cap-1",
  "--adaptive-cap-2",
  "--adaptive-cap-3",
  "--adaptive-cap-4",
  "--adaptive-cap-5",
];

const outcomeGradients = [
  "--adaptive-out-1",
  "--adaptive-out-2",
  "--adaptive-out-3",
  "--adaptive-out-4",
  "--adaptive-out-5",
  "--adaptive-out-6",
];

export default function AdaptiveIntelligenceModule({ lang }: { lang: Locale }) {
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

  const personalizationItems = [
    t.modules.adaptive.personalization.skillLevel,
    t.modules.adaptive.personalization.role,
    t.modules.adaptive.personalization.behavioral,
    t.modules.adaptive.personalization.performance,
    t.modules.adaptive.personalization.engagement,
    t.modules.adaptive.personalization.cognitive,
    t.modules.adaptive.personalization.objectives,
  ];

  const contextItems = [
    t.modules.adaptive.context.device,
    t.modules.adaptive.context.location,
    t.modules.adaptive.context.language,
    t.modules.adaptive.context.time,
    t.modules.adaptive.context.environment,
    t.modules.adaptive.context.priorities,
    t.modules.adaptive.context.regulatory,
  ];

  const optimizationItems = [
    t.modules.adaptive.optimization.sequencing,
    t.modules.adaptive.optimization.difficulty,
    t.modules.adaptive.optimization.recommendations,
    t.modules.adaptive.optimization.remediation,
    t.modules.adaptive.optimization.reorganization,
  ];

  const aiItems = [
    t.modules.adaptive.ai.copilots,
    t.modules.adaptive.ai.tutoring,
    t.modules.adaptive.ai.recommendations,
    t.modules.adaptive.ai.multimodal,
    t.modules.adaptive.ai.intervention,
  ];

  const syncItems = [
    t.modules.adaptive.sync.workflows,
    t.modules.adaptive.sync.tools,
    t.modules.adaptive.sync.events,
    t.modules.adaptive.sync.gaps,
  ];

  const intelligenceItems = [
    t.modules.adaptive.intelligence.behavioral,
    t.modules.adaptive.intelligence.predictive,
    t.modules.adaptive.intelligence.competency,
    t.modules.adaptive.intelligence.telemetry,
    t.modules.adaptive.intelligence.semantic,
    t.modules.adaptive.intelligence.reinforcement,
  ];

  const outcomesItems = [
    t.modules.adaptive.outcomes.completion,
    t.modules.adaptive.outcomes.acquisition,
    t.modules.adaptive.outcomes.fatigue,
    t.modules.adaptive.outcomes.retention,
    t.modules.adaptive.outcomes.progression,
    t.modules.adaptive.outcomes.alignment,
  ];

  const capabilities = [
    { title: t.modules.adaptive.personalization.title, items: personalizationItems },
    { title: t.modules.adaptive.context.title, items: contextItems },
    { title: t.modules.adaptive.optimization.title, items: optimizationItems },
    { title: t.modules.adaptive.ai.title, items: aiItems },
    { title: t.modules.adaptive.sync.title, items: syncItems },
  ];

  return (
    <section ref={ref} className="section">
      <div className="container">
        {/* Hero with CSS-generated visual background */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            marginBottom: "var(--section-gap)",
            position: "relative",
            borderRadius: "var(--r-module)",
            overflow: "hidden",
            padding: "64px 48px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #7eb8c8 0%, #a89bc2 50%, #c49696 100%)",
              opacity: 0.15,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(126, 184, 200, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(168, 155, 194, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(196, 150, 150, 0.1) 0%, transparent 50%)
              `,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="t-caption" style={{ marginBottom: 16, color: "var(--text-tertiary)" }}>
              {t.modules.adaptive.eyebrow}
            </p>
            <h1 className="t-display" style={{ fontSize: "var(--text-display)", marginBottom: 24 }}>
              {t.modules.adaptive.title}
            </h1>
            <p className="t-lead" style={{ maxWidth: 720 }}>
              {t.modules.adaptive.description}
            </p>
          </div>
        </div>

        {/* Core Capabilities as Gradient Cards */}
        <div style={{ marginBottom: "var(--section-gap)" }}>
          <h2 className="t-display" style={{ fontSize: "var(--text-title)", marginBottom: 48 }}>
            {t.modules.adaptive.capabilitiesTitle}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {capabilities.map((cap, i) => (
              <div
                key={cap.title}
                className="adaptive-cap-card"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.4s ${i * 80}ms ease, transform 0.4s ${i * 80}ms ease`,
                }}
              >
                <div
                  className="adaptive-cap-card__bg"
                  style={{ background: `var(${capabilityGradients[i]})` }}
                />
                <div className="adaptive-cap-card__grain" />
                <div className="adaptive-cap-card__content">
                  <h3 className="adaptive-cap-card__title">{cap.title}</h3>
                  <ul className="adaptive-cap-card__list">
                    {cap.items.map((item, j) => (
                      <li key={j} className="adaptive-cap-card__item">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence System with gradient background */}
        <div
          style={{
            marginBottom: "var(--section-gap)",
            position: "relative",
            borderRadius: "var(--r-module)",
            overflow: "hidden",
            padding: "48px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #96c4a8 0%, #7eb8c8 50%, #a89bc2 100%)",
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="t-display" style={{ fontSize: "var(--text-title)", marginBottom: 24 }}>
              {t.modules.adaptive.intelligenceTitle}
            </h2>
            <p className="t-lead" style={{ marginBottom: 32 }}>
              {t.modules.adaptive.intelligenceDescription}
            </p>
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {intelligenceItems.map((item, i) => (
                <li key={i} className="t-caption" style={{ paddingLeft: 16, position: "relative", color: "var(--text-secondary)" }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--text-tertiary)" }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Outcomes as Gradient Cards */}
        <div style={{ marginBottom: "var(--section-gap)" }}>
          <h2 className="t-display" style={{ fontSize: "var(--text-title)", marginBottom: 32 }}>
            {t.modules.adaptive.outcomesTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {outcomesItems.map((item, i) => (
              <div
                key={i}
                className="adaptive-out-card"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.4s ${i * 60}ms ease, transform 0.4s ${i * 60}ms ease`,
                }}
              >
                <div
                  className="adaptive-out-card__bg"
                  style={{ background: `var(${outcomeGradients[i]})` }}
                />
                <div className="adaptive-out-card__grain" />
                <div className="adaptive-out-card__content">
                  <p className="adaptive-out-card__text">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Positioning */}
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--r-card)",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, #7eb8c8, #a89bc2, #c49696)",
            }}
          />
          <h2 className="t-display" style={{ fontSize: "var(--text-heading)", marginBottom: 16 }}>
            {t.modules.adaptive.positioningTitle}
          </h2>
          <p className="t-lead" style={{ whiteSpace: "pre-line" }}>
            {t.modules.adaptive.positioning}
          </p>
        </div>
      </div>
    </section>
  );
}
