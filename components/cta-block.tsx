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
          background: "var(--bg-secondary)",
          padding: "var(--section-gap) 0",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: 640 }}>
          <h2
            className="t-display"
            style={{
              fontSize: "var(--text-display)",
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
          >
            {t.finalCta.button}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ textAlign: "center" }}>
      <div className="container">
        <h2
          className="t-display"
          style={{
            fontSize: "var(--text-display)",
            marginBottom: 24,
          }}
        >
          {t.finalCta.headline}
        </h2>
        <Link
          href={`/${lang}/demo`}
          className="btn-pill btn-black"
        >
          {t.finalCta.button}
        </Link>
      </div>
    </section>
  );
}
