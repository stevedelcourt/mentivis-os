"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileAccordionNavProps {
  t: any;
  lang: string;
  onClose: () => void;
}

export default function MobileAccordionNav({ t, lang, onClose }: MobileAccordionNavProps) {
  const [entrepriseOpen, setEntrepriseOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

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

  const eyebrowStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--text-tertiary)",
    padding: "16px 0 6px",
  };

  return (
    <>
      {/* LearningOS — plain link, submenu reserved for future evolution */}
      <Link href={`/${lang}`} onClick={onClose} style={navStyle}>
        <span>{t.nav.learningOS}</span>
      </Link>

      {/* TalentOS — plain link, submenu reserved for future evolution */}
      <Link href={`/${lang}`} onClick={onClose} style={navStyle}>
        <span>{t.nav.pipelineOS}</span>
      </Link>

      {/* Entreprise Section */}
      <button
        onClick={() => {
          setEntrepriseOpen(!entrepriseOpen);
          setResourcesOpen(false);
        }}
        style={navStyle}
      >
        <span>{t.nav.entreprise}</span>
        <span style={{
          transform: entrepriseOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          opacity: 0.5,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {entrepriseOpen && (
        <div style={{ padding: "0 0 10px 0" }}>
          <span style={eyebrowStyle}>{t.nav.eyebrows.entreprise}</span>
          <Link href={`/${lang}/blog`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.entreprise?.[0] || "News"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.entreprise?.[1] || "A propos"}
          </Link>
          <Link href={`/${lang}/security`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.entreprise?.[2] || "Securite"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.entreprise?.[3] || "Temoignages clients"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.entreprise?.[4] || "Carrieres"}
          </Link>
          <span style={eyebrowStyle}>{t.nav.eyebrows.initiatives}</span>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.initiatives?.[0] || "Programme Impact"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.initiatives?.[1] || "Pour Ecoles & Universites"}
          </Link>
          <Link href={`/${lang}/ambassadors`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.initiatives?.[2] || "Programme Affiliation & Ambassadeur"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.ressourcesMenu?.initiatives?.[3] || "Partenariats"}
          </Link>
        </div>
      )}

      {/* Ressources — hidden for now, reserved for future evolution */}

      {/* Tarifs */}
      <Link href={`/${lang}/tarifs`} onClick={onClose} style={navStyle}>
        <span>{t.nav.tarifs}</span>
      </Link>
    </>
  );
}
