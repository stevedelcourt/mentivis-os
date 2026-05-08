"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";
import { ChatMockup } from "./chat-mockup";
import { ChartMockup } from "./chart-mockup";
import { TestTube, Hand, Workflow } from "lucide-react";

export default function BentoSection({ lang }: { lang: Locale }) {
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
    <section ref={ref} className="section" style={{ background: "#ffffff" }}>
      <div className="container">
        {/* Top Row: 2 Large Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 20 }}>
          {/* Left: Agents (Dark) */}
          <div
            style={{
              borderRadius: 32,
              overflow: "hidden",
              position: "relative",
              minHeight: 480,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 40,
              background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 30%, #4a7c5c 60%, #8fb8a0 100%)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {/* Grain overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.08,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChatMockup messages={t.modules.bento.agents.chat} />
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.9)", marginBottom: 8 }}>
                {t.modules.bento.agents.title}
              </h3>
              <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>
                {t.modules.bento.agents.body}
              </p>
            </div>
          </div>

          {/* Right: Analytics (Light) */}
          <div
            style={{
              borderRadius: 32,
              overflow: "hidden",
              background: "#f5f5f5",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease",
            }}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              <ChartMockup data={t.modules.bento.analytics.chart} />
            </div>

            <div style={{ position: "relative", zIndex: 1, marginTop: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: "#6b6b6b", marginBottom: 8 }}>
                {t.modules.bento.analytics.title}
              </h3>
              <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.6, color: "#1a1a1a" }}>
                {t.modules.bento.analytics.body}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row: 3 Small Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { icon: <TestTube size={20} />, ...t.modules.bento.tests },
            { icon: <Hand size={20} />, ...t.modules.bento.guardrails },
            { icon: <Workflow size={20} />, ...t.modules.bento.workflows },
          ].map((card, i) => (
            <div
              key={card.title}
              style={{
                borderRadius: 24,
                background: "#f5f5f5",
                padding: 32,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.6s ${0.2 + i * 0.1}s ease, transform 0.6s ${0.2 + i * 0.1}s ease`,
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                color: "#1a1a1a",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: "#6b6b6b", marginBottom: 8 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.6, color: "#1a1a1a" }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 32,
            flexWrap: "wrap",
            gap: 20,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s 0.5s ease, transform 0.6s 0.5s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo placeholders */}
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e5e5e5" }} />
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#4a154b" }} />
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e5e5e5" }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>Meesho</p>
              <p style={{ fontSize: 13, fontWeight: 300, color: "#6b6b6b" }}>
                Assurer un support client multilingue en temps reel avec des agents vocaux
              </p>
            </div>
          </div>

          <button
            style={{
              padding: "12px 28px",
              borderRadius: 9999,
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              fontSize: 15,
              fontWeight: 500,
              color: "#1a1a1a",
              cursor: "pointer",
              transition: "all 0.18s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f5f5";
              e.currentTarget.style.borderColor = "#d4d4d4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.borderColor = "#e5e5e5";
            }}
          >
            {t.modules.bento.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          section > .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          section > .container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
