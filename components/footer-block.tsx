import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import CookieButton from "./cookie-button";

interface FooterBlockProps {
  lang: Locale;
}

export default function FooterBlock({ lang }: FooterBlockProps) {
  const t = getT(lang);
  const f = t.footer;

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
                src="/images/MentivisOS/mentivisos-logo-anim-drop.svg"
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
            {f.slogan}
          </p>
          <p
            className="t-caption"
            style={{
              maxWidth: 280,
              lineHeight: 1.6,
              color: "var(--text-tertiary)",
            }}
          >
            {f.tagline}
          </p>

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
              {f.produits}
            </h4>
            <ul>
              {(f.sections?.produits || ["LearningOS", "TalentOS", "Mentivis API", "Tarifs"]).map((link: string) => {
                const PRODUITS_PATH: Record<string, string> = { LearningOS: "/learningos", TalentOS: "/talentos", "Mentivis API": "/modules/adaptive", Tarifs: "/tarifs" };
                const path = PRODUITS_PATH[link] || "/learningos";
                return (
                <li key={link} style={{ marginBottom: 8 }}>
                  <Link
                    href={`/${lang}${path}`}
                    className="footer-link t-caption"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {link}
                  </Link>
                </li>
                );
              })}
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
              {f.workflows || "Workflows"}
            </h4>
            <ul>
              {(f.sections?.workflows || ["Formation & Learning", "Talent Pipeline HR", "Transformation", "Integration", "Developpeurs"]).map((link: string) => {
                const WORKFLOWS_PATH: Record<string, string> = {
                  "Formation & Learning": "/learningos", "Formation & Apprentissage": "/learningos", "Training & Learning": "/learningos",
                  "Talent Pipeline HR": "/talentos", "Recrutement & Pipeline": "/talentos",
                  "Transformation": "/impact",
                  "Integration": "/modules/adaptive", "Intégration": "/modules/adaptive",
                  "Developpeurs": "/modules/visual", "Développeurs": "/modules/visual", "Developers": "/modules/visual",
                };
                const wPath = WORKFLOWS_PATH[link] || "/talentos";
                return (
                <li key={link} style={{ marginBottom: 8 }}>
                  <Link
                    href={`/${lang}${wPath}`}
                    className="footer-link t-caption"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {link}
                  </Link>
                </li>
                );
              })}
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
            {f.entreprise}
          </h4>
          <ul>
            {(f.sections?.entreprise || ["News & publications", "A propos", "Affiliation & Ambassadeurs", "Carrieres"]).map((link: string) => (
              <li key={link} style={{ marginBottom: 8 }}>
                <Link
                  href={(() => {
                    const ENTREPRISE_PATH: Record<string, string> = {
                      "News & publications": "/blog",
                      "A propos": "/about", "About": "/about", "À propos": "/about",
                      "Affiliation & Ambassadeurs": "/ambassadors", "Affiliation & Ambassadors": "/ambassadors",
                      "Carrieres": "/carrieres", "Careers": "/carrieres", "Carrières": "/carrieres",
                    };
                    return `/${lang}${ENTREPRISE_PATH[link] || ""}`;
                  })()}
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
                {f.sections?.contact || (lang === "en" ? "Contact" : "Contact")}
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
            { label: f.bottom?.cms || "CMS", href: `/${lang}/content-management` },
            { label: f.bottom?.securite || "Securite", href: `/${lang}/security` },
            { label: f.bottom?.mentions || "Mentions legales", href: `/${lang}/legal` },
            { label: f.bottom?.confidentialite || "Confidentialite", href: `/${lang}/privacy` },
            { label: f.bottom?.cgu || "CGU", href: `/${lang}/terms` },
            { label: f.bottom?.cgv || "CGV", href: `/${lang}/cgv` },
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
            label={f.bottom?.cookies || "Cookies"}
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
