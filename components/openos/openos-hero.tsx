"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

interface OpenOSHeroProps {
  lang: Locale;
  children?: React.ReactNode;
}

const CTAS_FR = {
  headline: "Votre formation sur mesure, gratuite et illimitée.",
  subheadline:
    "Pour vous pr\u00E9parer \u00E0 un nouveau poste, passer un dipl\u00F4me ou un concours, ou simplement par d\u00E9sir d'apprendre.",
  cta: "L'aventure commence ici \u2192",
  tagline: "OpenOS, la plateforme universelle pour apprendre, se former et r\u00E9viser.",
  proof: "Gratuit pour toujours \u00B7 Sans carte bancaire",
};

const CTAS_EN = {
  headline: "Your custom training, free and unlimited.",
  subheadline:
    "To prepare for a new role, pass a diploma or exam, or simply out of a desire to learn.",
  cta: "The adventure starts here \u2192",
  tagline: "MentivisOS, the universal platform to learn, train and revise.",
  proof: "Free forever \u00B7 No credit card",
};

export default function OpenOSHero({ lang, children }: OpenOSHeroProps) {
  const c = lang === "fr" ? CTAS_FR : CTAS_EN;
  const { ref, visible } = useVisible(0.01);

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
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
        <div style={{ marginBottom: 32, textAlign: "left" }}>{children}</div>
        <h1
          style={{
            ...sectionAnim(visible, 0.1),
            marginBottom: 20,
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            fontSize: "clamp(32px, 5vw, 56px)",
          }}
        >
          {c.headline}
        </h1>
        <p
          style={{
            ...sectionAnim(visible, 0.2),
            margin: "0 0 40px",
            maxWidth: 680,
            fontSize: 18,
            lineHeight: 1.6,
            color: "#4e4e4e",
          }}
        >
          {c.subheadline}
        </p>
        <div
          style={{
            ...sectionAnim(visible, 0.3),
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <a
            href="https://open.mentivisos.com/"
            className="cta-open"
            data-gtm-click="openos-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 32px",
              fontSize: 17,
              fontWeight: 500,
              color: "#fff",
              background: "linear-gradient(135deg, #1A2B80, #7030A0, #B02050, #C83040)",
              borderRadius: 12,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
            }}
          >
            {c.cta}
          </a>
        </div>
        <p
          style={{
            ...sectionAnim(visible, 0.35),
            marginTop: 24,
            marginBottom: 0,
            color: "#888",
            fontSize: 14,
            maxWidth: 600,
          }}
        >
          {c.tagline}
        </p>
        <p
          style={{
            ...sectionAnim(visible, 0.4),
            marginTop: 12,
            color: "#888",
            fontSize: 14,
          }}
        >
          {c.proof}
        </p>
        </div>

        <img
          src="/open-woman.avif"
          alt=""
          className="openos-hero-image"
          style={{
            width: "clamp(200px, 28vw, 380px)",
            height: "auto",
            borderRadius: 24,
            flexShrink: 0,
          }}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .openos-hero-image {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
