"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

export default function VisualIntelligenceModule({ lang }: { lang: Locale }) {
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

  const cssVisualItems = [
    t.modules.visual.cssVisuals.gradients,
    t.modules.visual.cssVisuals.mesh,
    t.modules.visual.cssVisuals.textures,
    t.modules.visual.cssVisuals.patterns,
    t.modules.visual.cssVisuals.overlays,
    t.modules.visual.cssVisuals.depth,
    t.modules.visual.cssVisuals.light,
  ];

  const adaptationItems = [
    t.modules.visual.adaptation.context,
    t.modules.visual.adaptation.density,
    t.modules.visual.adaptation.atmosphere,
    t.modules.visual.adaptation.backgrounds,
  ];

  const performanceItems = [
    t.modules.visual.performance.bitmap,
    t.modules.visual.performance.vector,
    t.modules.visual.performance.gpu,
    t.modules.visual.performance.bandwidth,
    t.modules.visual.performance.theme,
  ];

  const aiItems = [
    t.modules.visual.ai.cards,
    t.modules.visual.ai.layouts,
    t.modules.visual.ai.prioritization,
    t.modules.visual.ai.orchestration,
    t.modules.visual.ai.transitions,
  ];

  const designItems = [
    t.modules.visual.design.primitives,
    t.modules.visual.design.tokens,
    t.modules.visual.design.procedural,
    t.modules.visual.design.blocks,
    t.modules.visual.design.motion,
  ];

  const technicalItems = [
    t.modules.visual.technical.css,
    t.modules.visual.technical.gradients,
    t.modules.visual.technical.svg,
    t.modules.visual.technical.shaders,
    t.modules.visual.technical.motion,
    t.modules.visual.technical.rendering,
  ];

  const outcomesItems = [
    t.modules.visual.outcomes.interfaces,
    t.modules.visual.outcomes.identity,
    t.modules.visual.outcomes.performance,
    t.modules.visual.outcomes.aesthetics,
    t.modules.visual.outcomes.assets,
    t.modules.visual.outcomes.personalization,
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
          {/* CSS-generated gradient background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              opacity: 0.15,
            }}
          />
          {/* Procedural mesh pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(240, 147, 251, 0.1) 0%, transparent 50%)
              `,
            }}
          />
          {/* Grain texture overlay */}
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
              {t.modules.visual.eyebrow}
            </p>
            <h1 className="t-display" style={{ fontSize: "var(--text-display)", marginBottom: 24 }}>
              {t.modules.visual.title}
            </h1>
            <p className="t-lead" style={{ maxWidth: 720 }}>
              {t.modules.visual.description}
            </p>
          </div>
        </div>

        {/* Core Capabilities */}
        <div style={{ marginBottom: "var(--section-gap)" }}>
          <h2 className="t-display" style={{ fontSize: "var(--text-title)", marginBottom: 48 }}>
            {t.modules.visual.capabilitiesTitle}
          </h2>

          <div style={{ display: "grid", gap: 48 }}>
            {/* CSS-Generated Visual Environments */}
            <div>
              <h3 className="t-display" style={{ fontSize: "var(--text-heading)", marginBottom: 16 }}>
                {t.modules.visual.cssVisuals.title}
              </h3>
              <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {cssVisualItems.map((item, i) => (
                  <li key={i} className="t-caption" style={{ paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--text-tertiary)" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Real-Time Visual Adaptation */}
            <div>
              <h3 className="t-display" style={{ fontSize: "var(--text-heading)", marginBottom: 16 }}>
                {t.modules.visual.adaptation.title}
              </h3>
              <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {adaptationItems.map((item, i) => (
                  <li key={i} className="t-caption" style={{ paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--text-tertiary)" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Performance-First Rendering */}
            <div>
              <h3 className="t-display" style={{ fontSize: "var(--text-heading)", marginBottom: 16 }}>
                {t.modules.visual.performance.title}
              </h3>
              <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {performanceItems.map((item, i) => (
                  <li key={i} className="t-caption" style={{ paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--text-tertiary)" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI-Native Interface Behavior */}
            <div>
              <h3 className="t-display" style={{ fontSize: "var(--text-heading)", marginBottom: 16 }}>
                {t.modules.visual.ai.title}
              </h3>
              <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {aiItems.map((item, i) => (
                  <li key={i} className="t-caption" style={{ paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--text-tertiary)" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Design System Orchestration */}
            <div>
              <h3 className="t-display" style={{ fontSize: "var(--text-heading)", marginBottom: 16 }}>
                {t.modules.visual.design.title}
              </h3>
              <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {designItems.map((item, i) => (
                  <li key={i} className="t-caption" style={{ paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--text-tertiary)" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Approach */}
        <div style={{ marginBottom: "var(--section-gap)" }}>
          <h2 className="t-display" style={{ fontSize: "var(--text-title)", marginBottom: 24 }}>
            {t.modules.visual.technicalTitle}
          </h2>
          <p className="t-lead" style={{ marginBottom: 32 }}>
            {t.modules.visual.technicalDescription}
          </p>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {technicalItems.map((item, i) => (
              <li key={i} className="t-caption" style={{ paddingLeft: 16, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "var(--text-tertiary)" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Outcomes */}
        <div style={{ marginBottom: "var(--section-gap)" }}>
          <h2 className="t-display" style={{ fontSize: "var(--text-title)", marginBottom: 32 }}>
            {t.modules.visual.outcomesTitle}
          </h2>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {outcomesItems.map((item, i) => (
              <li key={i} className="t-caption" style={{ paddingLeft: 16, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "var(--text-tertiary)" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Implementation Note */}
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--r-card)",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle CSS gradient accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
            }}
          />
          <h2 className="t-display" style={{ fontSize: "var(--text-heading)", marginBottom: 16 }}>
            {t.modules.visual.implementationTitle}
          </h2>
          <p className="t-lead" style={{ whiteSpace: "pre-line" }}>
            {t.modules.visual.implementation}
          </p>
        </div>
      </div>
    </section>
  );
}
