import { getT, Locale } from "@/lib/i18n";

interface ImpactSectionProps {
  lang: Locale;
}

export default function ImpactSection({ lang }: ImpactSectionProps) {
  const t = getT(lang);
  const data = t.impact;

  return (
    <section style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        <div style={{ maxWidth: 720 }}>
          <p
            className="t-caption"
            style={{
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 16,
            }}
          >
            {data.eyebrow}
          </p>
          <h2
            className="t-display"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: 32,
            }}
          >
            {data.title}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {data.body.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(15px, 1.2vw, 17px)",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
