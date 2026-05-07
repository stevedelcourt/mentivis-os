import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

export default function CombinationSection({ lang }: { lang: Locale }) {
  const t = getT(lang);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <p
          className="t-lead"
          style={{
            whiteSpace: "pre-line",
          }}
        >
          {t.combination.body}
        </p>
        <Link
          href={`/${lang}/a-propos`}
          className="section-link t-caption"
          style={{
            marginTop: 24,
            display: "inline-block",
            color: "var(--text-tertiary)",
          }}
        >
          {t.combination.link} &rarr;
        </Link>
      </div>
    </section>
  );
}
