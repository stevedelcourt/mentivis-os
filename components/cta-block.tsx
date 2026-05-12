import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import SuperButton from "./super-button";

interface CTABlockProps {
  lang: Locale;
  variant?: "section" | "final";
}

export default function CTABlock({ lang, variant = "section" }: CTABlockProps) {
  const t = getT(lang);

  if (variant === "final") {
    return (
      <section
        style={{
          background: "#f5f5f5",
          padding: "var(--section-gap) 0",
        }}
      >
        <div className="container">
          <div
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: "clamp(32px, 4vw, 48px) clamp(24px, 4vw, 44px)",
            }}
          >
            <div
              className="cta-final-layout"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 40,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  className="t-display"
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 40px)",
                    whiteSpace: "pre-line",
                    marginBottom: 20,
                    lineHeight: 1.2,
                  }}
                >
                  {t.finalCta.headline}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  {t.finalCta.subline}
                </p>
              </div>
              <SuperButton
                href={`/${lang}/demo?subject=demo`}
                label={lang === "fr" ? "Start !" : "Start !"}
              />
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .cta-final-layout {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 32px !important;
            }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h2
          className="t-display"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            marginBottom: 24,
          }}
        >
          {t.finalCta.headline}
        </h2>
        <Link
          href={`/${lang}/demo`}
          className="btn-pill btn-black"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          {t.finalCta.button}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
