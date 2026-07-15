"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

export default function BeachTourComparison({ lang }: { lang: string }) {
  const { ref, visible } = useVisible(0.05);

  const Column = ({
    title,
    items,
    accent,
    delay,
  }: {
    title: string;
    items: string[];
    accent: string;
    delay: number;
  }) => (
    <div
      style={{
        ...sectionAnim(visible, delay),
        background: "#ffffff",
        borderRadius: 20,
        padding: "36px 32px",
        border: accent === "warm" ? "1px solid #D08050" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: accent === "warm" ? "0 4px 20px rgba(160,64,32,0.1)" : "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <h3
        style={{
          fontSize: 18,
          fontWeight: 500,
          marginBottom: 20,
          color: accent === "warm" ? "#A04020" : "#1a1a1a",
        }}
      >
        {title}
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              padding: "10px 0",
              borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)",
              fontSize: 14,
              lineHeight: 1.5,
              color: "#555",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span style={{ color: accent === "warm" ? "#A04020" : "#AAA", flexShrink: 0 }}>
              {accent === "warm" ? "\u2713" : "\u2014"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <h2
          style={{
            ...sectionAnim(visible, 0),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Ce que vous débloquez
        </h2>
        <p
          style={{
            ...sectionAnim(visible, 0.05),
            textAlign: "center",
            color: "#888",
            fontSize: 16,
            marginBottom: 48,
          }}
        >
          Comparez votre quota standard et le Beach Tour
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <Column
            title="Sans Beach Tour (quota standard)"
            accent="neutral"
            delay={0.1}
            items={[
              "10 cours g\u00e9n\u00e9r\u00e9s par mois",
              "Formation sur mesure gratuite",
              "Acc\u00e8s illimit\u00e9 aux parcours existants",
            ]}
          />
          <Column
            title="Avec Beach Tour (1 mois illimit\u00e9)"
            accent="warm"
            delay={0.18}
            items={[
              "40 cours g\u00e9n\u00e9r\u00e9s par mois",
              "Formation sur mesure gratuite",
              "Acc\u00e8s illimit\u00e9 aux parcours existants",
              "Valable 30 jours d\u00e8s activation",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
