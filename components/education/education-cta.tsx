"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";
import SuperButton from "@/components/super-button";

export default function EducationCTA({ lang }: { lang: string }) {
  const { ref, visible } = useVisible(0.05);
  const isFr = lang === "fr";

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        <div
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: "clamp(32px, 4vw, 48px) clamp(24px, 4vw, 44px)",
          }}
        >
          <div
            className="education-cta-inner"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 40,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className="t-display" style={{ ...sectionAnim(visible, 0), fontSize: "clamp(24px, 3.5vw, 40px)", marginBottom: 20, lineHeight: 1.2 }}>
                {isFr ? "Vous voulez en savoir plus ?" : "Want to learn more?"}
              </h2>
              <p style={{ ...sectionAnim(visible, 0.05), fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0 }}>
                {isFr ? "Contactez-nous pour une démonstration." : "Contact us for a demonstration."}
              </p>
            </div>
            <SuperButton href={`/${lang}/contact`} />
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .education-cta-inner {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 32px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
