"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const rafId = useRef<number | null>(null);

  /* ── scroll: rAF-throttled + passive ── */
  useEffect(() => {
    let lastScrollY = 0;
    const onScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastScrollY) > 2) {
          setScrolled(y > 8);
          lastScrollY = y;
        }
        rafId.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const isActive = (path: string) => pathname.startsWith(`/${lang}${path}`);

  /* ── dropdown: no timer, bridge element catches mouse ── */
  const openDropdown = useCallback((label: string) => {
    setActiveDropdown(label);
  }, []);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const navItems = [
    { label: t.nav.produit, path: "/produit", dropdown: t.nav.produitLinks },
    { label: t.nav.pourQui, path: "/pour-qui", dropdown: t.nav.pourQuiLinks },
    { label: t.nav.integration, path: "/integration", dropdown: t.nav.integrationLinks },
    { label: t.nav.ressources, path: "/ressources", dropdown: t.nav.ressourcesLinks },
    { label: t.nav.aPropos, path: "/a-propos", dropdown: null },
  ];

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
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.98)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: "1px solid var(--border-subtle)",
          transition: "background 0.35s ease, box-shadow 0.35s ease",
          boxShadow: scrolled ? "var(--shadow-card)" : "none",
          willChange: "transform",
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
          <Link
            href={`/${lang}`}
            className="navbar-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src="/images/MentivisOS/mentivisos-logo-wordmark-noir.svg"
              alt="MentivisOS"
              style={{ height: 36, width: "auto" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="navbar-links"
            style={{ display: "flex", gap: 32, alignItems: "center" }}
          >
            {navItems.map((item) => (
              <div
                key={item.label}
                className="navbar-item"
                style={{ position: "relative", padding: "20px 0" }}
                onMouseEnter={() => item.dropdown && openDropdown(item.label)}
                onMouseLeave={closeDropdown}
              >
                <Link
                  href={`/${lang}${item.path}`}
                  className="t-nav navbar-link"
                  data-active={isActive(item.path)}
                >
                  {item.label}
                </Link>

                {/* Invisible hover bridge — catches mouse between link and dropdown */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="navbar-dropdown-bridge" />
                )}

                {/* Dropdown */}
                {item.dropdown && activeDropdown === item.label && (
                  <div
                    className="card navbar-dropdown"
                    onMouseLeave={closeDropdown}
                  >
                    {item.dropdown.map((link) => (
                      <Link
                        key={link}
                        href={`/${lang}${item.path}`}
                        className="dropdown-link t-caption"
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
              href={`/${lang}/composants`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 8,
                background: "#E8726A",
                color: "#ffffff",
                fontSize: "var(--text-caption)",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#D06058";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#E8726A";
              }}
            >
              Composants
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              href={`/${lang}/demo`}
              className="btn-pill btn-black navbar-cta"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              {t.nav.demarrer}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <button
              className="navbar-burger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span>{mobileOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="navbar-mobile-overlay">
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              href={`/${lang}${item.path}`}
              onClick={() => setMobileOpen(false)}
              className="navbar-mobile-link"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${lang}/composants`}
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: 16,
              textAlign: "center",
              padding: "12px 24px",
              borderRadius: 8,
              background: "#E8726A",
              color: "#ffffff",
              fontSize: "var(--text-body-sm)",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Composants
          </Link>
          <Link
            href={`/${lang}/demo`}
            onClick={() => setMobileOpen(false)}
            className="btn-pill btn-black"
            style={{
              marginTop: 12,
              textAlign: "center",
              padding: "12px 24px",
            }}
          >
            {t.nav.demarrer}
          </Link>
        </div>
      )}

      <style>{`
        .navbar-link {
          position: relative;
          display: inline-block;
          color: var(--text-secondary);
          transition: color 0.18s ease;
          padding-bottom: 2px;
        }
        .navbar-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 1px;
          background: var(--text-primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .navbar-link:hover {
          color: var(--text-primary);
        }
        .navbar-link:hover::after {
          transform: scaleX(1);
        }
        .navbar-link[data-active="true"] {
          color: var(--text-primary);
        }
        .navbar-link[data-active="true"]::after {
          transform: scaleX(1);
        }

        .navbar-dropdown-bridge {
          position: absolute;
          top: 100%;
          left: -12px;
          right: -12px;
          height: 24px;
          background: transparent;
          z-index: 1000;
        }

        .navbar-dropdown {
          position: absolute;
          top: calc(100% + 20px);
          left: -12px;
          padding: 12px 16px;
          min-width: 220px;
          z-index: 1001;
          border-radius: var(--r-card);
          background: var(--bg-primary);
          box-shadow: var(--shadow-card-full), var(--shadow-soft);
          animation: dropdownIn 0.2s ease both;
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dropdown-link {
          display: block;
          padding: 8px 0;
          color: var(--text-secondary);
          transition: color 0.15s ease;
        }
        .dropdown-link:hover {
          color: var(--text-primary);
        }

        .navbar-cta {
          font-size: var(--text-caption);
          font-weight: 500;
          padding: 8px 18px;
        }

        .navbar-burger {
          display: none;
          padding: 8px;
          background: none;
          border: none;
          font-size: 20px;
          color: var(--text-primary);
          cursor: pointer;
        }

        .navbar-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: var(--bg-primary);
          display: flex;
          flex-direction: column;
          padding: 80px var(--grid-margin) 40px;
          animation: fadeIn 0.2s ease both;
        }
        .navbar-mobile-link {
          font-family: var(--font-sans);
          font-size: var(--text-heading);
          font-weight: 300;
          color: var(--text-primary);
          padding: 16px 0;
          border-bottom: 1px solid var(--border-light);
          animation: fadeInUp 0.4s both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Mobile: disable expensive blur, reduce shadow */
        @media (max-width: 1024px) {
          .navbar {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          .navbar-links { display: none !important; }
          .navbar-burger { display: block !important; }
        }
      `}</style>
    </>
  );
}
