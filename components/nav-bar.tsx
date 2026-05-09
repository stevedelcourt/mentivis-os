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
            <div
              className="navbar-item"
              style={{ position: "relative", padding: "20px 0 28px" }}
              onMouseEnter={() => openDropdown("learningOS")}
              onMouseLeave={closeDropdown}
            >
              <span className="t-nav navbar-link">{t.nav.learningOS}</span>
              {activeDropdown === "learningOS" && (
                <MegaMenu
                  sections={[
                    {
                      eyebrow: t.nav.eyebrows.produits,
                      links: t.nav.learningOSMenu.produits.map((label) => ({
                        label,
                        href: `/${lang}`,
                      })),
                    },
                    {
                      eyebrow: t.nav.eyebrows.workflows,
                      links: t.nav.learningOSMenu.workflows.map((label) => ({
                        label,
                        href: `/${lang}`,
                      })),
                    },
                  ]}
                  onMouseEnter={() => openDropdown("learningOS")}
                  onMouseLeave={closeDropdown}
                />
              )}
            </div>

            {/* PipelineOS */}
            <div
              className="navbar-item"
              style={{ position: "relative", padding: "20px 0 28px" }}
              onMouseEnter={() => openDropdown("pipelineOS")}
              onMouseLeave={closeDropdown}
            >
              <span className="t-nav navbar-link">{t.nav.pipelineOS}</span>
              {activeDropdown === "pipelineOS" && (
                <MegaMenu
                  sections={[
                    {
                      eyebrow: t.nav.eyebrows.produits,
                      links: t.nav.pipelineOSMenu.produits.map((label) => ({
                        label,
                        href: `/${lang}`,
                      })),
                    },
                    {
                      eyebrow: t.nav.eyebrows.workflowsRH,
                      links: t.nav.pipelineOSMenu.workflows.map((label) => ({
                        label,
                        href: `/${lang}`,
                      })),
                    },
                  ]}
                  onMouseEnter={() => openDropdown("pipelineOS")}
                  onMouseLeave={closeDropdown}
                />
              )}
            </div>

            {/* MentivisAPI */}
            <div
              className="navbar-item"
              style={{ position: "relative", padding: "20px 0" }}
              onMouseEnter={() => openDropdown("mentivisAPI")}
              onMouseLeave={closeDropdown}
            >
              <span className="t-nav navbar-link">{t.nav.mentivisAPI}</span>
              {activeDropdown === "mentivisAPI" && (
                <MegaMenu
                  sections={[
                    {
                      eyebrow: t.nav.eyebrows.plateforme,
                      links: t.nav.mentivisAPIMenu.plateforme.map((label) => ({
                        label,
                        href: `/${lang}`,
                      })),
                    },
                  ]}
                  onMouseEnter={() => openDropdown("mentivisAPI")}
                  onMouseLeave={closeDropdown}
                />
              )}
            </div>

            {/* Ressources */}
            <div
              className="navbar-item"
              style={{ position: "relative", padding: "20px 0" }}
              onMouseEnter={() => openDropdown("ressources")}
              onMouseLeave={closeDropdown}
            >
              <span className="t-nav navbar-link">{t.nav.ressources}</span>
              {activeDropdown === "ressources" && (
                <MegaMenu
                  sections={[
                    {
                      eyebrow: t.nav.eyebrows.entreprise,
                      links: [
                        { label: t.nav.ressourcesMenu.entreprise[0], href: `/${lang}/blog` },
                        ...t.nav.ressourcesMenu.entreprise.slice(1).map((label) => ({
                          label,
                          href: `/${lang}`,
                        })),
                      ],
                    },
                  ]}
                  onMouseEnter={() => openDropdown("ressources")}
                  onMouseLeave={closeDropdown}
                />
              )}
            </div>

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
              className="btn-header-black hide-mobile"
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
              {t.nav.login}
            </Link>

            <button
              className={`navbar-burger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={mobileOpen ? 'open' : ''}>
                <line x1="6" y1="10" x2="26" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="line-top" />
                <line x1="6" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="line-mid" />
                <line x1="6" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="line-bot" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu - Starts below header */}
      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {/* Scrollable content area */}
        <div className="navbar-mobile-scrollable">
          <MobileAccordionNav t={t} lang={lang} onClose={() => setMobileOpen(false)} />
        </div>

        {/* Sticky bottom buttons */}
        <div className="navbar-mobile-sticky-bottom">
          <Link
            href={`/${lang}/contact`}
            onClick={() => setMobileOpen(false)}
            className="mobile-btn-outline"
          >
            {t.nav.contact}
          </Link>
          <Link
            href="https://app.mentivisOS.com"
            onClick={() => setMobileOpen(false)}
            className="mobile-btn-primary"
          >
            {t.nav.login}
          </Link>
        </div>
      </div>

      {/* Overlay backdrop */}
      <div 
        className={`navbar-mobile-backdrop ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

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

        .navbar-burger {
          display: none;
          padding: 4px;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        .navbar-burger svg {
          width: 32px;
          height: 32px;
        }

        .navbar-burger line {
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .navbar-burger.open .line-top {
          transform: translateY(6px) rotate(45deg);
        }

        .navbar-burger.open .line-mid {
          opacity: 0;
        }

        .navbar-burger.open .line-bot {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Hide contact button on mobile */
        @media (max-width: 1024px) {
          .hide-mobile {
            display: none !important;
          }
        }

        /* Mobile fullscreen menu - starts below header */
        .navbar-mobile-menu {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f7f7f4;
          z-index: 1000;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .navbar-mobile-menu.open {
          transform: translateX(0);
        }

        .navbar-mobile-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 20px var(--grid-margin);
          display: flex;
          flex-direction: column;
        }

        .navbar-mobile-sticky-bottom {
          position: sticky;
          bottom: 0;
          display: flex;
          gap: 12;
          padding: 16px var(--grid-margin);
          background: #f7f7f4;
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        .mobile-btn-outline {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          color: #0A0A0A;
          background: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .mobile-btn-primary {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          color: #FFFFFF;
          background: #0A0A0A;
          border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        /* Backdrop */
        .navbar-mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .navbar-mobile-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 1170px) {
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

// Mega Menu Component
interface MegaMenuSection {
  eyebrow: string;
  links: { label: string; href: string }[];
}

interface MegaMenuProps {
  sections: MegaMenuSection[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function MegaMenu({ sections, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <div
      className="mega-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        top: "calc(100% - 6px)",
        left: -200,
        display: "flex",
        gap: 40,
        padding: "28px 32px",
        minWidth: 520,
        zIndex: 1001,
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        animation: "megaMenuIn 0.2s ease both",
      }}
    >
      {sections.map((section, idx) => (
        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#777169",
            }}
          >
            {section.eyebrow}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {section.links.map((link, linkIdx) => (
              <Link
                key={linkIdx}
                href={link.href}
                className="mega-menu-link"
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#0A0A0A",
                  textDecoration: "none",
                  padding: "4px 0",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#777169";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#0A0A0A";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes megaMenuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Mobile Accordion Navigation
interface MobileAccordionNavProps {
  t: any;
  lang: string;
  onClose: () => void;
}

function MobileAccordionNav({ t, lang, onClose }: MobileAccordionNavProps) {
  const [learningOpen, setLearningOpen] = useState(false);
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [apiOpen, setApiOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const eyebrowStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--text-tertiary)",
    padding: "24px 0 8px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  };

  const navStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: "17px",
    fontWeight: 500,
    color: "var(--text-primary)",
    padding: "10px 0",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "none",
    border: "none",
    width: "100%",
    cursor: "pointer",
    textAlign: "left" as const,
    position: "relative" as const,
  };

  const subItemStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: "15px",
    fontWeight: 400,
    color: "var(--text-secondary)",
    padding: "10px 0 10px 20px",
    textDecoration: "none",
    display: "block",
    position: "relative" as const,
  };

  return (
    <>
      {/* LearningOS Section */}
      <button
        onClick={() => {
          setLearningOpen(!learningOpen);
          setPipelineOpen(false);
          setApiOpen(false);
          setResourcesOpen(false);
        }}
        className="mobile-nav-item"
        style={navStyle}
      >
        <span>{t.nav.learningOS}</span>
        <span style={{
          transform: learningOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          opacity: 0.5,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className={`accordion-content ${learningOpen ? 'open' : ''}`}>
        <Link href={`/${lang}`} onClick={onClose} className="mobile-sub-item" style={subItemStyle}>
          {t.nav.learningOSMenu?.products?.[0] || "Diagnostic adaptatif"}
        </Link>
        <Link href={`/${lang}`} onClick={onClose} className="mobile-sub-item" style={subItemStyle}>
          {t.nav.learningOSMenu?.products?.[1] || "Programmes IA"}
        </Link>
        <Link href={`/${lang}`} onClick={onClose} className="mobile-sub-item" style={subItemStyle}>
          {t.nav.learningOSMenu?.workflows?.[0] || "Former collaborateurs"}
        </Link>
      </div>

      {/* PipelineOS Section */}
      <button
        onClick={() => {
          setPipelineOpen(!pipelineOpen);
          setLearningOpen(false);
          setApiOpen(false);
          setResourcesOpen(false);
        }}
        className="mobile-nav-item"
        style={navStyle}
      >
        <span>{t.nav.pipelineOS}</span>
        <span style={{
          transform: pipelineOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          opacity: 0.5,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className={`accordion-content ${pipelineOpen ? 'open' : ''}`}>
        <Link href={`/${lang}`} onClick={onClose} className="mobile-sub-item" style={subItemStyle}>
          {t.nav.pipelineOSMenu?.produits?.[0] || "Sourcing intelligent"}
        </Link>
        <Link href={`/${lang}`} onClick={onClose} className="mobile-sub-item" style={subItemStyle}>
          {t.nav.pipelineOSMenu?.workflows?.[0] || "ATS Pipeline"}
        </Link>
        <Link href={`/${lang}`} onClick={onClose} className="mobile-sub-item" style={subItemStyle}>
          {t.nav.pipelineOSMenu?.workflows?.[1] || "Screening IA"}
        </Link>
      </div>

      {/* MentivisAPI Section */}
      <button
        onClick={() => {
          setApiOpen(!apiOpen);
          setLearningOpen(false);
          setPipelineOpen(false);
          setResourcesOpen(false);
        }}
        className="mobile-nav-item"
        style={navStyle}
      >
        <span>{t.nav.mentivisAPI}</span>
        <span style={{
          transform: apiOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          opacity: 0.5,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className={`accordion-content ${apiOpen ? 'open' : ''}`}>
        <Link href={`/${lang}`} onClick={onClose} className="mobile-sub-item" style={subItemStyle}>
          {t.nav.mentivisAPIMenu?.plateforme?.[0] || "API Documentation"}
        </Link>
        <Link href={`/${lang}`} onClick={onClose} className="mobile-sub-item" style={subItemStyle}>
          {t.nav.mentivisAPIMenu?.plateforme?.[1] || "Webhooks"}
        </Link>
        <Link href={`/${lang}`} onClick={onClose} className="mobile-sub-item" style={subItemStyle}>
          {t.nav.mentivisAPIMenu?.plateforme?.[2] || "Développer"}
        </Link>
      </div>

      {/* Ressources Section */}
      <Link href={`/${lang}/blog`} onClick={onClose} className="mobile-nav-item mobile-nav-link" style={navStyle}>
        <span>{t.nav.ressources}</span>
      </Link>

      {/* Tarifs */}
      <Link href={`/${lang}/tarifs`} onClick={onClose} className="mobile-nav-item mobile-nav-link" style={navStyle}>
        <span>{t.nav.tarifs}</span>
      </Link>

      <style>{`
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.4s ease, opacity 0.3s ease;
        }
        .accordion-content.open {
          max-height: 500px;
          opacity: 1;
        }
        .mobile-nav-item::after,
        .mobile-sub-item::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--text-primary);
          transition: width 0.25s ease;
        }
        .mobile-nav-item:hover::after,
        .mobile-sub-item:hover::after {
          width: 100%;
        }
        .mobile-sub-item::after {
          left: 16px;
        }
        .mobile-nav-link::after {
          bottom: 8px;
        }
      `}</style>
    </>
  );
}

// Mobile Menu Item
interface MobileMenuItemProps {
  label: string;
  href?: string;
}

function MobileMenuItem({ label, href }: MobileMenuItemProps) {
  const style = {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-heading)",
    fontWeight: 300,
    color: "var(--text-primary)",
    padding: "16px 0",
    borderBottom: "1px solid var(--border-light)",
    textDecoration: "none",
  };

  if (href) {
    return (
      <Link href={href} style={style}>
        {label}
      </Link>
    );
  }

  return <span style={style}>{label}</span>;
}
