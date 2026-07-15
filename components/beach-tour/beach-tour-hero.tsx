"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

export default function BeachTourHero({ lang }: { lang: string }) {
  const { ref, visible } = useVisible(0.01);

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(135deg, #FDE8C8 0%, #FBD3A0 30%, #F8B878 60%, #F09050 100%)",
        padding: "clamp(96px, 12vw, 160px) 0 clamp(64px, 8vw, 96px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(32px, 5vw, 64px)",
        }}
      >
        <div style={{ maxWidth: 720, flex: 1, minWidth: 0 }}>
          <p
            style={{
              ...sectionAnim(visible, 0.05),
              marginBottom: 16,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#A06030",
            }}
          >
            MentivisOS Open Beach Tour
          </p>
          <h1
            style={{
              ...sectionAnim(visible, 0.1),
              marginBottom: 20,
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              fontSize: "clamp(32px, 5vw, 56px)",
              color: "#3A2010",
            }}
          >
            Cet \u00E9t\u00E9, r\u00E9visez, apprenez, progressez. Gratuitement.
          </h1>
          <p
            style={{
              ...sectionAnim(visible, 0.2),
              margin: "0 0 40px",
              maxWidth: 680,
              fontSize: 18,
              lineHeight: 1.6,
              color: "#6A4030",
            }}
          >
            Invitez 10 amis et d\u00E9bloquez 1 mois de formation illimit\u00E9e. 40 cours par mois, sur tous les sujets.
          </p>
          <div style={{ ...sectionAnim(visible, 0.3), display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="https://open.mentivisos.com/beach-tour/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 32px",
                fontSize: 17,
                fontWeight: 500,
                color: "#fff",
                background: "#A04020",
                borderRadius: 12,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#803010"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#A04020"; }}
            >
              Je commence gratuitement \u2192
            </a>
          </div>
        </div>

        <img
          src="/images/beach-tour.webp"
          alt=""
          style={{
            width: "clamp(200px, 28vw, 380px)",
            height: "auto",
            borderRadius: 24,
            flexShrink: 0,
          }}
        />
      </div>
    </section>
  );
}
