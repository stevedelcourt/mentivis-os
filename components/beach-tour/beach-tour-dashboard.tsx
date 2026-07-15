"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

export default function BeachTourDashboard({ lang }: { lang: string }) {
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#FAFAF8", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div className="container" style={{ maxWidth: 680, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <div
          style={{
            ...sectionAnim(visible, 0),
            background: "#ffffff",
            borderRadius: 20,
            padding: "40px 36px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A04020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
            </svg>
            <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: "#1a1a1a" }}>
              Votre Beach Tour
            </h2>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: "#666" }}>Amis inscrits</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>7 / 10</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 8,
                borderRadius: 4,
                background: "#EEE",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: "100%",
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #F8B878, #A04020)",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>

          <p style={{ fontSize: 15, color: "#666", margin: "0 0 24px" }}>
            Plus que 3 amis pour d\u00E9bloquer votre mois illimit\u00E9\u00A0!
          </p>

          <div
            style={{
              background: "#F5F5F3",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <code
              style={{
                fontSize: 13,
                color: "#333",
                fontFamily: "monospace",
                wordBreak: "break-all",
                flex: 1,
                minWidth: 0,
              }}
            >
              open.mentivisos.com/beach-tour/?ref=ABC
            </code>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#A04020",
                  background: "transparent",
                  border: "1px solid #D08050",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#FDE8C8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Copier le lien
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#fff",
                  background: "#A04020",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#803010"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#A04020"; }}
              >
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
