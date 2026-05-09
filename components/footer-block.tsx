import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import LogomarkMotion from "./logomark-motion";

interface FooterBlockProps {
  lang: Locale;
}

export default function FooterBlock({ lang }: FooterBlockProps) {
  const t = getT(lang);

  return (
    <footer
      style={{
        borderTop: `1px solid var(--border-light)`,
        padding: "64px 0 32px",
        background: "var(--bg-secondary)",
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
            <img
              src="/images/MentivisOS/mentivisos-logo-wordmark-noir.svg"
              alt="MentivisOS"
              style={{ height: 24, width: "auto", opacity: 0.7 }}
            />
          </div>
          <p
            className="t-caption"
            style={{
              maxWidth: 280,
              lineHeight: 1.6,
              color: "var(--text-tertiary)",
            }}
          >
            {t.footer.tagline}
          </p>
          <LogomarkMotion />
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
            links: ["A propos", "L'equipe", "Contact"],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-micro)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
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
                    className="footer-link t-caption"
                    style={{
                      color: "var(--text-tertiary)",
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
          borderTop: `1px solid var(--border-light)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-micro)",
            color: "var(--text-tertiary)",
          }}
        >
          {t.footer.copyright} &copy; {new Date().getFullYear()} Mentivis.
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "Composants", href: `/${lang}/composants` },
            { label: "Mentions legales", href: `/${lang}` },
            { label: "Confidentialite", href: `/${lang}` },
            { label: "CGU", href: `/${lang}` },
            { label: "Cookies", href: `/${lang}` },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="footer-link"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-micro)",
                color: "var(--text-tertiary)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--text-primary) !important; }
        @media (max-width: 1024px) {
          footer > .container:first-of-type { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          footer > .container:first-of-type { grid-template-columns: 1fr !important; }
          footer > .container:last-of-type {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          footer > .container:last-of-type > div {
            flex-wrap: wrap !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </footer>
  );
}
