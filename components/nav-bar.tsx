"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getT, Locale } from "@/lib/i18n";
import MegaMenu from "@/components/nav/mega-menu";
import MobileAccordionNav from "@/components/nav/mobile-accordion-nav";

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
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = document.body.dataset.scrollY || "0";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      delete document.body.dataset.scrollY;
      window.scrollTo(0, parseInt(scrollY, 10));
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const openDropdown = useCallback((label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  }, []);

  const closeDropdown = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  }, []);

  const closeDropdownImmediate = useCallback(() => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(null);
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
          background: "#ffffff",
          borderBottom: "1px solid var(--border-subtle)",
          transition: "box-shadow 0.35s ease",
          boxShadow: "var(--shadow-card)",
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
          {/* Logo */}
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
            {/* LearningOS */}
            <Link
              href={`/${lang}/learningos`}
              className="t-nav navbar-link"
              data-active={isActive("/learningos")}
              style={{ padding: "20px 0" }}
            >
              {t.nav.learningOS}
            </Link>

            {/* TalentOS */}
            <Link
              href={`/${lang}/talentos`}
              className="t-nav navbar-link"
              data-active={isActive("/talentos")}
              style={{ padding: "20px 0" }}
            >
              {t.nav.pipelineOS}
            </Link>

            {/* Entreprise (was Ressources) */}
            <div
              className="navbar-item"
              style={{ position: "relative", padding: "20px 0" }}
              onMouseEnter={() => openDropdown("entreprise")}
              onMouseLeave={closeDropdown}
            >
              <span className="t-nav navbar-link" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {t.nav.entreprise}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s ease", transform: activeDropdown === "entreprise" ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
              {activeDropdown === "entreprise" && (
                <MegaMenu
                  sections={[
                    {
                      eyebrow: t.nav.eyebrows.entreprise,
                      links: [
                        { label: t.nav.ressourcesMenu.entreprise[0], href: `/${lang}/blog` },
                        ...t.nav.ressourcesMenu.entreprise.slice(1).map((label) => ({
                          label,
                          href: label === "Securite" || label === "Security" ? `/${lang}/security` : label === "A propos" || label === "About" ? `/${lang}/about` : label === "Temoignages clients" || label === "Customer Stories" ? `/${lang}/blog?category=cas` : label === "Carrieres" || label === "Careers" ? `/${lang}/carrieres` : `/${lang}`,
                        })),
                      ],
                    },
                    {
                      eyebrow: t.nav.eyebrows.initiatives,
                      links: t.nav.ressourcesMenu.initiatives.map((label, i) => ({
                        label,
                        href: i === 0 ? `/${lang}/impact` : i === 2 ? `/${lang}/ambassadors` : `/${lang}`,
                      })),
                    },
                  ]}
                  onMouseEnter={() => openDropdown("entreprise")}
                  onMouseLeave={closeDropdown}
                />
              )}
            </div>

            {/* Resources — hidden for now, reserved for future evolution */}

            {/* Tarifs */}
            <Link
              href={`/${lang}/tarifs`}
              className="t-nav navbar-link"
              data-active={isActive("/tarifs")}
              style={{ padding: "20px 0" }}
            >
              {t.nav.tarifs}
            </Link>
          </nav>

          {/* Right side CTAs */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link
              href={`/${lang}/contact`}
              className="btn-header-outline hide-mobile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: "#0A0A0A",
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 8,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.25)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              }}
            >
              {t.nav.contact}
            </Link>

            <Link
              href="https://app.mentivisOS.com"
              className="btn-header-black"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: "#FFFFFF",
                background: "#0A0A0A",
                borderRadius: 8,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#222";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0A0A0A";
              }}
            >
              Login
            </Link>

            {/* Language switcher */}
            <Link
              href={pathname.replace(/^\/(fr|en)/, `/${lang === "fr" ? "en" : "fr"}`)}
              className="hide-mobile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {lang === "fr" ? "EN" : "FR"}
            </Link>

            <button
              className={`navbar-burger${mobileOpen ? " is-open" : ""}`}
              style={{
                padding: 4,
                background: "none",
                border: "none",
                color: "var(--text-primary)",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">
                <line className="burger-line burger-top" x1="18" y1="34" x2="82" y2="34" />
                <line className="burger-line burger-mid" x1="18" y1="50" x2="82" y2="50" />
                <line className="burger-line burger-bot" x1="18" y1="66" x2="82" y2="66" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div style={{
        position: "fixed",
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#ffffff",
        zIndex: 1000,
        transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Scrollable content area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px var(--grid-margin)",
          display: "flex",
          flexDirection: "column",
        }}>
          <MobileAccordionNav t={t} lang={lang} onClose={() => setMobileOpen(false)} />
        </div>

        {/* Sticky bottom buttons */}
        <div style={{
          position: "sticky",
          bottom: 0,
          display: "flex",
          gap: 12,
          padding: "16px var(--grid-margin)",
          background: "#ffffff",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}>
          <Link
            href={`/${lang}/contact`}
            onClick={() => setMobileOpen(false)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "12px 20px",
              fontSize: 14,
              fontWeight: 500,
              color: "#0A0A0A",
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 12,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {t.nav.contact}
          </Link>
          <Link
            href="https://app.mentivisOS.com"
            onClick={() => setMobileOpen(false)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "12px 20px",
              fontSize: 14,
              fontWeight: 500,
              color: "#FFFFFF",
              background: "#0A0A0A",
              borderRadius: 12,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            Login
          </Link>
        </div>
      </div>

      <style>{`
        .navbar-link {
          position: relative;
          display: inline-block;
          color: var(--text-secondary);
          transition: color 0.18s ease;
          cursor: pointer;
        }
        .navbar-link:hover {
          color: var(--text-primary);
        }
        .navbar-link[data-active="true"] {
          color: var(--text-primary);
        }

        /* Hide contact button on mobile */
        @media (max-width: 1024px) {
          .hide-mobile {
            display: none !important;
          }
        }

        @media (max-width: 1170px) {
          .navbar {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          .navbar-links { display: none !important; }
          .hide-mobile { display: none !important; }
          .navbar-burger { display: block !important; }
        }

        .navbar-burger {
          display: none;
          position: relative;
        }

        .burger-line {
          fill: none;
          stroke: var(--text-primary);
          stroke-width: 6;
          stroke-linecap: round;
          transform-box: fill-box;
          transform-origin: center;
          transition: stroke 0.3s ease;
        }
        .burger-top,
        .burger-bot {
          transition: transform 0.52s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease;
        }
        .burger-mid {
          transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 0.26s cubic-bezier(0.22, 1, 0.36, 1),
                      stroke 0.3s ease;
        }
        .is-open .burger-top {
          transform: translateY(16px) rotate(45deg);
        }
        .is-open .burger-mid {
          transform: scaleX(0);
          opacity: 0;
        }
        .is-open .burger-bot {
          transform: translateY(-16px) rotate(-45deg);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
