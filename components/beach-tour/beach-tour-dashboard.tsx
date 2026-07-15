"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

export default function BeachTourDashboard({ lang }: { lang: string }) {
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#FAFAF8", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div className="container" style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <div
          style={{
            ...sectionAnim(visible, 0),
            background: "#ffffff",
            borderRadius: 28,
            padding: "48px 44px",
            boxShadow: "0 8px 40px rgba(160,64,32,0.12)",
            border: "1px solid rgba(200,100,50,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FDE8C8, #F8B878)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              ☀️
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
                Votre Beach Tour
              </h2>
              <p style={{ fontSize: 14, color: "#999", margin: "2px 0 0" }}>
                ���u vu de la m\u00E9diterran\u00E9e
              </p>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: "#555" }}>Amis inscrits</span>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#A04020", letterSpacing: "-0.02em" }}>7 / 10</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 12,
                borderRadius: 6,
                background: "#EEE",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: "100%",
                  borderRadius: 6,
                  background: "linear-gradient(90deg, #F8B878, #E08040, #A04020)",
                  transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  position: "relative",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.15) 12px, rgba(255,255,255,0.15) 14px)",
                  borderRadius: 6,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          <p style={{ fontSize: 18, fontWeight: 400, color: "#555", margin: "0 0 28px", lineHeight: 1.4 }}>
            Plus que 3 amis pour d\u00E9bloquer votre mois illimit\u00E9 !
          </p>

          <div
            style={{
              background: "linear-gradient(135deg, #FEF5ED, #FDE8C8)",
              borderRadius: 16,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              border: "1px solid rgba(200,100,50,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 16 }}>🔗</span>
              <code
                style={{
                  fontSize: 14,
                  color: "#5A3020",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  fontWeight: 500,
                  background: "rgba(255,255,255,0.6)",
                  padding: "6px 12px",
                  borderRadius: 8,
                }}
              >
                open.mentivisos.com/beach-tour/?ref=ABC
              </code>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#A04020",
                  background: "#fff",
                  border: "2px solid #D08050",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#FDE8C8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
              >
                Copier le lien
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  background: "linear-gradient(135deg, #E08040, #A04020)",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(160,64,32,0.3)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
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
