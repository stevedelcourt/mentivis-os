"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getT, Locale } from "@/lib/i18n";

interface NavBarProps {
  lang: Locale;
}

export default function NavBar({ lang }: NavBarProps) {
  const t = getT(lang);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname.startsWith(`/${lang}${path}`);

  return (
    <>
      <header
        className="navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 56,
          background: scrolled ? "rgba(8, 8, 8, 0.92)" : "rgba(8, 8, 8, 0.98)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: `1px solid var(--color-border)`,
          transition: "background 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease",
          boxShadow: scrolled ? "0 12px 40px rgba(16,24,40,0.12)" : "none",
        }}
      >
        <div
          className="navbar-inner"
          style={{
            maxWidth: "var(--container-wide)",
            margin: "0 auto",
            padding: "0 var(--grid-margin)",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href={`/${lang}`} className="navbar-logo">
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
          </Link>

          <nav className="navbar-links" style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {[
              { label: t.nav.produit, path: "/produit", dropdown: t.nav.produitLinks },
              { label: t.nav.pourQui, path: "/pour-qui", dropdown: t.nav.pourQuiLinks },
              { label: t.nav.integration, path: "/integration", dropdown: t.nav.integrationLinks },
              { label: t.nav.ressources, path: "/ressources", dropdown: t.nav.ressourcesLinks },
              { label: t.nav.aPropos, path: "/a-propos", dropdown: null },
            ].map((item) => (
              <div
                key={item.label}
                className="navbar-item"
                style={{ position: "relative" }}
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={`/${lang}${item.path}`}
                  style={{
                    fontFamily: "var(--font-interface)",
                    fontSize: "var(--text-small)",
                    color: isActive(item.path) ? "var(--color-ink-primary)" : "var(--color-ink-secondary)",
                    transition: "color 0.18s ease",
                    position: "relative",
                    paddingBottom: 2,
                    borderLeft: isActive(item.path) ? "2px solid var(--color-accent)" : "2px solid transparent",
                    paddingLeft: 8,
                  }}
                >
                  {item.label}
                </Link>
                {item.dropdown && activeDropdown === item.label && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: 8,
                      background: "var(--color-surface-2)",
                      border: `1px solid var(--color-border)`,
                      borderRadius: "var(--card-radius)",
                      padding: "12px 16px",
                      minWidth: 220,
                      zIndex: 1001,
                    }}
                  >
                    {item.dropdown.map((link) => (
                      <Link
                        key={link}
                        href={`/${lang}${item.path}`}
                        className="dropdown-link"
                        style={{
                          display: "block",
                          padding: "6px 0",
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-small)",
                          color: "var(--color-ink-secondary)",
                        }}
                      >
                        {link}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link
              href={`/${lang}/demo`}
              className="btn btn-primary"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-ground)",
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-small)",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: "var(--button-radius)",
                transition: "background 0.18s ease",
              }}
            >
              {t.nav.demarrer}
            </Link>

            <button
              className="navbar-burger"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: "none", padding: 8 }}
              aria-label="Toggle menu"
            >
              <span style={{ color: "var(--color-ink-primary)", fontSize: 20 }}>{mobileOpen ? "x" : "☰"}</span>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "var(--color-ground)",
            display: "flex",
            flexDirection: "column",
            padding: "80px var(--grid-margin) 40px",
          }}
        >
          {[
            { label: t.nav.produit, path: "/produit" },
            { label: t.nav.pourQui, path: "/pour-qui" },
            { label: t.nav.integration, path: "/integration" },
            { label: t.nav.ressources, path: "/ressources" },
            { label: t.nav.aPropos, path: "/a-propos" },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={`/${lang}${item.path}`}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-heading)",
                color: "var(--color-ink-primary)",
                padding: "16px 0",
                borderBottom: `1px solid var(--color-border)`,
                animation: `fadeInUp 0.4s ${i * 40}ms both`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${lang}/demo`}
            onClick={() => setMobileOpen(false)}
            className="btn btn-primary"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-ground)",
              fontFamily: "var(--font-interface)",
              fontSize: "var(--text-small)",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "12px 24px",
              borderRadius: "var(--button-radius)",
              marginTop: 24,
              textAlign: "center",
            }}
          >
            {t.nav.demarrer}
          </Link>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-link:hover { color: var(--color-ink-primary) !important; }
        @media (max-width: 768px) {
          .navbar-links { display: none !important; }
          .navbar-burger { display: block !important; }
        }
      `}</style>
    </>
  );
}
