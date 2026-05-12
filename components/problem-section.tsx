import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

export default function ProblemSection({ lang }: { lang: Locale }) {
  const t = getT(lang);

  return (
    <section
      style={{
        padding: "var(--section-gap) 0",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="container">
        <div
          className="problem-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Left: title + subheader + CTA */}
          <div>
            <h2
              className="t-display"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                marginBottom: 20,
              }}
            >
              {t.problem.title}
            </h2>
            <p
              className="t-lead"
              style={{
                marginBottom: 28,
              }}
            >
              {t.problem.subheader}
            </p>
            <Link
              href={`/${lang}/contact`}
              className="problem-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "#ffffff",
                background: "#1a1a1a",
                borderRadius: 8,
                padding: "12px 24px",
                textDecoration: "none",
                transition: "all 0.25s ease",
              }}
            >
              {t.problem.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </div>

          {/* Right: body + tagline */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(15px, 1.2vw, 17px)",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
                marginBottom: 24,
              }}
            >
              {t.problem.body}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              {t.problem.tagline}
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .problem-cta:hover {
          background: #333 !important;
        }
        @media (max-width: 768px) {
          .problem-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
