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
        <h2
          className="t-display"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            maxWidth: 900,
            marginBottom: 20,
          }}
        >
          {t.problem.title}
        </h2>
        <p
          className="t-lead"
          style={{
            maxWidth: 760,
            marginBottom: 24,
          }}
        >
          {t.problem.subheader}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(15px, 1.2vw, 17px)",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            maxWidth: 760,
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
            maxWidth: 760,
          }}
        >
          {t.problem.tagline}
        </p>
      </div>
    </section>
  );
}
