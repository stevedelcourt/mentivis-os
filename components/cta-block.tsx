import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

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
              padding: "48px 44px",
            }}
          >
            <h2
              className="t-display"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                whiteSpace: "pre-line",
                marginBottom: 24,
              }}
            >
              {t.finalCta.headline}
            </h2>
            <p className="t-lead" style={{ marginBottom: 40 }}>
              {t.finalCta.subline}
            </p>
            <Link
              href={`/${lang}/demo`}
              className="btn-pill btn-warm"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              {t.finalCta.button}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
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
