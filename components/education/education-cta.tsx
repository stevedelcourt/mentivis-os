"use client";

import Link from "next/link";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

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
            <Link
              href={`/${lang}/contact`}
              className="btn-pill btn-black"
              style={{ padding: "14px 32px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
            >
              {isFr ? "Contactez-nous" : "Contact us"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
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
