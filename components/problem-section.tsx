import { getT, Locale } from "@/lib/i18n";

export default function ProblemSection({ lang }: { lang: Locale }) {
  const t = getT(lang);

  return (
    <section
      style={{
        padding: "var(--section-gap) 0",
        background: "var(--color-surface-1)",
        textAlign: "center",
      }}
    >
      <div className="container">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--color-ink-primary)",
            whiteSpace: "pre-line",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {t.problem.statement}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            color: "var(--color-ink-secondary)",
            maxWidth: 600,
            margin: "24px auto 0",
            lineHeight: 1.7,
          }}
        >
          {t.problem.counterpoint}
        </p>
      </div>
    </section>
  );
}
