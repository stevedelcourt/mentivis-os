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
          background: "var(--color-surface-1)",
          padding: "var(--section-gap) 0",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 140,
              fontWeight: 300,
              color: "var(--color-ink-primary)",
              opacity: 0.04,
              letterSpacing: "-0.03em",
            }}
          >
            MentivisOS
          </span>
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-ink-primary)",
              whiteSpace: "pre-line",
              marginBottom: 24,
            }}
          >
            {t.finalCta.headline}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              color: "var(--color-ink-secondary)",
              marginBottom: 36,
            }}
          >
            {t.finalCta.subline}
          </p>
          <Link
            href={`/${lang}/demo`}
            className="btn btn-primary"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-ground)",
              fontFamily: "var(--font-interface)",
              fontSize: "var(--text-small)",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "14px 32px",
              borderRadius: "var(--button-radius)",
              transition: "background 0.18s ease, box-shadow 0.18s ease",
              display: "inline-block",
            }}
          >
            {t.finalCta.button}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "var(--section-gap) 0", textAlign: "center" }}>
      <div className="container">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--color-ink-primary)",
            marginBottom: 24,
          }}
        >
          {t.finalCta.headline}
        </h2>
        <Link
          href={`/${lang}/demo`}
          className="btn btn-primary"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-ground)",
            fontFamily: "var(--font-interface)",
            fontSize: "var(--text-small)",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "12px 24px",
            borderRadius: "var(--button-radius)",
            display: "inline-block",
          }}
        >
          {t.finalCta.button}
        </Link>
      </div>
    </section>
  );
}
