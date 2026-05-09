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
              href={`/${lang}`}
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
              href={`/${lang}/demo`}
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
              href={`/${lang}/demo`}
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

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="navbar-mobile-overlay">
          <MobileMenuItem label={t.nav.learningOS} />
          <MobileMenuItem label={t.nav.pipelineOS} />
          <MobileMenuItem label={t.nav.mentivisAPI} />
          <MobileMenuItem label={t.nav.ressources} href={`/${lang}/blog`} />
          <MobileMenuItem label={t.nav.entreprise} href={`/${lang}`} />
          <MobileMenuItem label={t.nav.tarifs} href={`/${lang}`} />
          
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href={`/${lang}/demo`}
              onClick={() => setMobileOpen(false)}
              className="btn-header-outline"
              style={{
                textAlign: "center",
                padding: "12px 24px",
              }}
            >
              {t.nav.contact}
            </Link>
            <Link
              href={`/${lang}/demo`}
              onClick={() => setMobileOpen(false)}
              className="btn-header-black"
              style={{
                textAlign: "center",
                padding: "12px 24px",
              }}
            >
              {t.nav.login}
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
        top: "calc(100% + 12px)",
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
