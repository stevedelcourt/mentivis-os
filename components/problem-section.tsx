import { getT, Locale } from "@/lib/i18n";

export default function ProblemSection({ lang }: { lang: Locale }) {
  const t = getT(lang);

  return (
    <section
      style={{
        padding: "var(--section-gap) 0",
        background: "var(--bg-secondary)",
        textAlign: "center",
      }}
    >
      <div className="container">
        <h2
          className="t-display"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            whiteSpace: "pre-line",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {t.problem.statement}
        </h2>
        <p
          className="t-lead"
          style={{
            maxWidth: 600,
            margin: "24px auto 0",
          }}
        >
          {t.problem.counterpoint}
        </p>
      </div>
    </section>
  );
}
