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
              style={{ position: "relative", padding: "20px 0" }}
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
              style={{ position: "relative", padding: "20px 0" }}
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

            {/* Entreprise */}
            <Link
              href={`/${lang}`}
              className="t-nav navbar-link"
              data-active={isActive("/entreprise")}
              style={{ padding: "20px 0" }}
            >
              {t.nav.entreprise}
            </Link>

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
              className="btn-header-outline"
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
              {t.nav.login}
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

      {/* Mobile Fullscreen Menu */}
      {mobileOpen && (
        <div className="navbar-mobile-fullscreen">
          {/* Header with logo and close button */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 16px",
            position: "relative",
            top: 12,
            zIndex: 2,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: 1280,
              background: "#ffffff",
              borderRadius: 16,
              padding: "10px 20px",
              boxShadow: "none",
            }}>
              <Link href={`/${lang}`} onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Mentivis</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  fontSize: 24,
                  color: "var(--text-primary)",
                  lineHeight: 1,
                }}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Menu content */}
          <div className="navbar-mobile-content">
            <MobileAccordionNav t={t} lang={lang} onClose={() => setMobileOpen(false)} />
          </div>

          {/* CTA bottom */}
          <div style={{
            padding: "20px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            background: "#f7f7f4",
          }}>
            <Link
              href={`/${lang}/contact`}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 600,
                color: "white",
                background: "var(--text-primary)",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              {t.nav.cta || "Contactez-nous"}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      )}

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
          padding: 8px;
          background: none;
          border: none;
          font-size: 20px;
          color: var(--text-primary);
          cursor: pointer;
        }

        .navbar-mobile-fullscreen {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: #f7f7f4;
        }

        .navbar-mobile-content {
          flex: 1;
          overflow: auto;
          background: #f7f7f4;
          padding: "0 20px";
          display: flex;
          flex-direction: column;
          marginTop: 20;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

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
        top: "calc(100% + 4px)",
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

  const navStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: "1.5rem",
    fontWeight: 300,
    color: "var(--text-primary)",
    padding: "20px 0",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "none",
    border: "none",
    width: "100%",
    cursor: "pointer",
    textAlign: "left" as const,
  };

  const subItemStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: "1rem",
    fontWeight: 400,
    color: "var(--text-secondary)",
    padding: "12px 0 12px 20px",
    textDecoration: "none",
    display: "block",
    borderBottom: "1px solid rgba(0,0,0,0.04)",
  };

  const accordionContentStyle = (isOpen: boolean) => ({
    display: "grid",
    gridTemplateRows: isOpen ? "1fr" : "0fr",
    transition: "grid-template-rows 0.3s ease",
  });

  return (
    <>
      {/* LearningOS Accordion */}
      <button
        onClick={() => {
          setLearningOpen(!learningOpen);
          setPipelineOpen(false);
          setApiOpen(false);
          setResourcesOpen(false);
        }}
        style={navStyle}
      >
        <span>{t.nav.learningOS}</span>
        <span style={{
          transform: learningOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div style={accordionContentStyle(learningOpen)}>
        <div style={{ overflow: "hidden" }}>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.learningOSMenu?.products?.[0] || "Diagnostic adaptatif"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.learningOSMenu?.products?.[1] || "Programmes IA"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.learningOSMenu?.products?.[2] || "Coaching intégré"}
          </Link>
        </div>
      </div>

      {/* PipelineOS Accordion */}
      <button
        onClick={() => {
          setPipelineOpen(!pipelineOpen);
          setLearningOpen(false);
          setApiOpen(false);
          setResourcesOpen(false);
        }}
        style={navStyle}
      >
        <span>{t.nav.pipelineOS}</span>
        <span style={{
          transform: pipelineOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div style={accordionContentStyle(pipelineOpen)}>
        <div style={{ overflow: "hidden" }}>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.pipelineOSMenu?.produits?.[0] || "Sourcing intelligent"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.pipelineOSMenu?.workflows?.[0] || "Screening IA"}
          </Link>
        </div>
      </div>

      {/* MentivisAPI Accordion */}
      <button
        onClick={() => {
          setApiOpen(!apiOpen);
          setLearningOpen(false);
          setPipelineOpen(false);
          setResourcesOpen(false);
        }}
        style={navStyle}
      >
        <span>{t.nav.mentivisAPI}</span>
        <span style={{
          transform: apiOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div style={accordionContentStyle(apiOpen)}>
        <div style={{ overflow: "hidden" }}>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.mentivisAPIMenu?.plateforme?.[0] || "API Documentation"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.mentivisAPIMenu?.plateforme?.[1] || "Webhooks"}
          </Link>
        </div>
      </div>

      {/* Ressources Accordion */}
      <button
        onClick={() => {
          setResourcesOpen(!resourcesOpen);
          setLearningOpen(false);
          setPipelineOpen(false);
          setApiOpen(false);
        }}
        style={navStyle}
      >
        <span>{t.nav.ressources}</span>
        <span style={{
          transform: resourcesOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div style={accordionContentStyle(resourcesOpen)}>
        <div style={{ overflow: "hidden" }}>
          <Link href={`/${lang}/blog`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.entreprise?.[0] || "Blog"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.entreprise?.[1] || "Documentation"}
          </Link>
        </div>
      </div>

      {/* Direct links */}
      <Link href={`/${lang}`} onClick={onClose} style={navStyle}>
        <span>{t.nav.entreprise}</span>
      </Link>
      <Link href={`/${lang}/tarifs`} onClick={onClose} style={navStyle}>
        <span>{t.nav.tarifs}</span>
      </Link>
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
