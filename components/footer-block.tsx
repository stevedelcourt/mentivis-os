import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import LogomarkMotion from "./logomark-motion";
import CookieButton from "./cookie-button";

interface FooterBlockProps {
  lang: Locale;
}

export default function FooterBlock({ lang }: FooterBlockProps) {
  const t = getT(lang);

  return (
    <footer
      style={{
        borderTop: `1px solid var(--border-light)`,
        padding: "64px 0 80px",
        background: "var(--bg-secondary)",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gap: 40,
        }}
      >
        {/* Column 1 — Brand */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <Link href={`/${lang}`} style={{ textDecoration: "none", display: "inline-block" }}>
              <img
                src="/images/MentivisOS/mentivisos-logo-wordmark-noir.svg"
                alt="MentivisOS"
                style={{ height: 24, width: "auto", opacity: 0.7 }}
              />
            </Link>
          </div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              fontWeight: 500,
              color: "var(--text-primary)",
              marginBottom: 8,
              letterSpacing: "-0.01em",
            }}
          >
            Compétences. Pas clics.
          </p>
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
          <div style={{ marginLeft: -5 }}>
            <LogomarkMotion />
          </div>
        </div>

        {/* Column 2 — Produits + Workflows */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div>
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
              {t.footer.produits}
            </h4>
            <ul>
              {["LearningOS", "TalentOS", "Mentivis API", "Tarifs"].map((link) => (
                <li key={link} style={{ marginBottom: 8 }}>
                  <Link
                    href={`/${lang}`}
                    className="footer-link t-caption"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
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
              {t.footer.workflows || "Workflows"}
            </h4>
            <ul>
              {["Formation & Learning", "Talent Pipeline HR", "Transformation", "Integration", "Developpeurs"].map((link) => (
                <li key={link} style={{ marginBottom: 8 }}>
                  <Link
                    href={`/${lang}`}
                    className="footer-link t-caption"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3 — Entreprise */}
        <div>
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
            {t.footer.entreprise}
          </h4>
          <ul>
            {["News & publications", "A propos", "Affiliation & Ambassadeurs", "Carrieres"].map((link) => (
              <li key={link} style={{ marginBottom: 8 }}>
                <Link
                  href={link === "News & publications" ? `/${lang}/blog` : link === "A propos" || link === "About" ? `/${lang}/about` : link === "Affiliation & Ambassadeurs" || link === "Affiliation & Ambassadors" ? `/${lang}/ambassadors` : link === "Carrieres" || link === "Careers" ? `/${lang}/carrieres` : `/${lang}`}
                  className="footer-link t-caption"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {link}
                </Link>
              </li>
            ))}
            <li style={{ marginBottom: 8 }}>
              <Link
                href={`/${lang}/contact`}
                className="footer-link t-caption"
                style={{ color: "var(--text-tertiary)" }}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
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
          {/* intentionally empty — copyright removed */}
        </span>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "CMS", href: `/${lang}/content-management` },
            { label: "Securite", href: `/${lang}/security` },
            { label: "Mentions legales", href: `/${lang}/legal` },
            { label: "Confidentialite", href: `/${lang}/privacy` },
            { label: "CGU", href: `/${lang}/terms` },
            { label: "CGV", href: `/${lang}/cgv` },
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
          <CookieButton
            label="Cookies"
            className="footer-link"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-micro)",
              color: "var(--text-tertiary)",
            }}
          />
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--text-primary) !important; }
        @media (max-width: 1024px) {
          footer > .container:first-of-type { grid-template-columns: 1fr 1fr !important; }
          footer > .container:first-of-type > div:first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 768px) {
          footer > .container:first-of-type { grid-template-columns: 1fr !important; }
          footer > .container:first-of-type > div:first-child { grid-column: auto; }
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
