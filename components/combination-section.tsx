import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

export default function CombinationSection({ lang }: { lang: Locale }) {
  const t = getT(lang);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            color: "var(--color-ink-secondary)",
            lineHeight: 1.8,
            whiteSpace: "pre-line",
          }}
        >
          {t.combination.body}
        </p>
        <Link
          href={`/${lang}/a-propos`}
          className="section-link"
          style={{
            fontFamily: "var(--font-interface)",
            fontSize: "var(--text-small)",
            color: "var(--color-accent)",
            marginTop: 24,
            display: "inline-block",
          }}
        >
          {t.combination.link} &rarr;
        </Link>
      </div>
    </section>
  );
}
