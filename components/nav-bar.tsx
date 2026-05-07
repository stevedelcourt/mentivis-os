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
          height: 64,
          background: scrolled ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.98)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid var(--border-subtle)`,
          transition: "background 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease",
          boxShadow: scrolled ? "var(--shadow-card)" : "none",
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
            <img
              src="/images/MentivisOS/mentivisos-logo-wordmark-noir.svg"
              alt="MentivisOS"
              style={{ height: 28, width: "auto" }}
            />
          </Link>

          <nav className="navbar-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
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
                  className="t-nav"
                  style={{
                    color: isActive(item.path) ? "var(--text-primary)" : "var(--text-secondary)",
                    transition: "color 0.18s ease",
                    paddingBottom: 2,
                    borderBottom: isActive(item.path) ? "1px solid var(--text-primary)" : "1px solid transparent",
                  }}
                >
                  {item.label}
                </Link>
                {item.dropdown && activeDropdown === item.label && (
                  <div
                    className="card"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      padding: "12px 16px",
                      minWidth: 220,
                      zIndex: 1001,
                    }}
                  >
                    {item.dropdown.map((link) => (
                      <Link
                        key={link}
                        href={`/${lang}${item.path}`}
                        className="dropdown-link t-caption"
                        style={{
                          display: "block",
                          padding: "8px 0",
                          color: "var(--text-secondary)",
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
              className="btn-pill btn-black"
              style={{
                fontSize: "var(--text-caption)",
                fontWeight: 500,
                padding: "8px 18px",
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
              <span style={{ color: "var(--text-primary)", fontSize: 20 }}>{mobileOpen ? "x" : "☰"}</span>
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
            background: "var(--bg-primary)",
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
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-heading)",
                fontWeight: 300,
                color: "var(--text-primary)",
                padding: "16px 0",
                borderBottom: `1px solid var(--border-light)`,
                animation: `fadeInUp 0.4s ${i * 40}ms both`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${lang}/demo`}
            onClick={() => setMobileOpen(false)}
            className="btn-pill btn-black"
            style={{
              fontSize: "var(--text-caption)",
              fontWeight: 500,
              padding: "12px 24px",
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
        .dropdown-link:hover { color: var(--text-primary) !important; }
        @media (max-width: 1024px) {
          .navbar-links { display: none !important; }
          .navbar-burger { display: block !important; }
        }
      `}</style>
    </>
  );
}
