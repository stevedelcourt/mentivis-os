import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

interface FooterBlockProps {
  lang: Locale;
}

export default function FooterBlock({ lang }: FooterBlockProps) {
  const t = getT(lang);

  return (
    <footer
      style={{
        borderTop: `1px solid var(--color-border)`,
        padding: "64px 0 32px",
        background: "var(--color-ground)",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                background: "var(--color-accent)",
                marginRight: 8,
                verticalAlign: "middle",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-small)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-ink-primary)",
              }}
            >
              MentivisOS
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-small)",
              color: "var(--color-ink-tertiary)",
              lineHeight: 1.6,
              maxWidth: 280,
            }}
          >
            {t.footer.tagline}
          </p>
        </div>

        {[
          {
            title: t.footer.produits,
            links: ["MentivisAtelier", "MentivisOperate", "MentivisIntel", "Tarifs", "API & Integrations"],
          },
          {
            title: t.footer.pourQui,
            links: ["Individuel", "Corporate", "Formation", "Competences"],
          },
          {
            title: t.footer.integration,
            links: ["Acces direct", "Licence entreprise", "API"],
          },
          {
            title: t.footer.entreprise,
            links: [t.nav.aPropos, "L'equipe", "Contact"],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4
              style={{
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-micro)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: 16,
              }}
            >
              {col.title}
            </h4>
            <ul>
              {col.links.map((link) => (
                <li key={link} style={{ marginBottom: 8 }}>
                  <Link
                    href={`/${lang}`}
                    className="footer-link"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-small)",
                      color: "var(--color-ink-tertiary)",
                    }}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="container"
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: `1px solid var(--color-border-soft)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-interface)",
            fontSize: "var(--text-micro)",
            color: "var(--color-ink-tertiary)",
          }}
        >
          {t.footer.copyright} &copy; {new Date().getFullYear()} Mentivis.
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          {["Mentions legales", "Confidentialite", "CGU", "Cookies"].map((link) => (
            <Link
              key={link}
              href={`/${lang}`}
              className="footer-link"
              style={{
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-micro)",
                color: "var(--color-ink-tertiary)",
              }}
            >
              {link}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--color-ink-primary) !important; }
        @media (max-width: 1024px) {
          .container > div:first-of-type { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .container > div:first-of-type { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
