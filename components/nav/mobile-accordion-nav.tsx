"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileAccordionNavProps {
  t: any;
  lang: string;
  onClose: () => void;
}

export default function MobileAccordionNav({ t, lang, onClose }: MobileAccordionNavProps) {
  const [learningOpen, setLearningOpen] = useState(false);
  const [pipelineOpen, setPipelineOpen] = useState(false);
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
      {/* LearningOS Section */}
      <button
        onClick={() => {
          setLearningOpen(!learningOpen);
          setPipelineOpen(false);
          setEntrepriseOpen(false);
          setResourcesOpen(false);
        }}
        style={navStyle}
      >
        <span>{t.nav.learningOS}</span>
        <span style={{
          transform: learningOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          opacity: 0.5,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {learningOpen && (
        <div style={{ padding: "0 0 10px 0" }}>
          <span style={eyebrowStyle}>{t.nav.eyebrows.produits}</span>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.learningOSMenu?.produits?.[0] || "LearningOS"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.learningOSMenu?.produits?.[1] || "SkillAgents"}
          </Link>
          <span style={eyebrowStyle}>{t.nav.eyebrows.workflows}</span>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.learningOSMenu?.workflows?.[0] || "Former collaborateurs"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.learningOSMenu?.workflows?.[1] || "Formations certifiantes"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.learningOSMenu?.workflows?.[2] || "Dashboard Entreprise"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.learningOSMenu?.workflows?.[3] || "OPCO Manager"}
          </Link>
        </div>
      )}

      {/* TalentOS Section */}
      <button
        onClick={() => {
          setPipelineOpen(!pipelineOpen);
          setLearningOpen(false);
          setEntrepriseOpen(false);
          setResourcesOpen(false);
        }}
        style={navStyle}
      >
        <span>{t.nav.pipelineOS}</span>
        <span style={{
          transform: pipelineOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          opacity: 0.5,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {pipelineOpen && (
        <div style={{ padding: "0 0 10px 0" }}>
          <span style={eyebrowStyle}>{t.nav.eyebrows.produits}</span>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.pipelineOSMenu?.produits?.[0] || "TalentOS"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.pipelineOSMenu?.produits?.[1] || "HRAgents"}
          </Link>
          <span style={eyebrowStyle}>{t.nav.eyebrows.workflowsRH}</span>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.pipelineOSMenu?.workflows?.[0] || "ATS Pipeline"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.pipelineOSMenu?.workflows?.[1] || "Test & Cases pour Recruteurs"}
          </Link>
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
            {t.nav.pipelineOSMenu?.workflows?.[2] || "Ranking Engine"}
          </Link>
        </div>
      )}

      {/* Entreprise Section */}
      <button
        onClick={() => {
          setEntrepriseOpen(!entrepriseOpen);
          setLearningOpen(false);
          setPipelineOpen(false);
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
          <Link href={`/${lang}`} onClick={onClose} style={subItemStyle}>
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

      {/* Ressources Section */}
      <button
        onClick={() => {
          setResourcesOpen(!resourcesOpen);
          setLearningOpen(false);
          setPipelineOpen(false);
          setEntrepriseOpen(false);
        }}
        style={navStyle}
      >
        <span>{t.nav.ressources}</span>
        <span style={{
          transform: resourcesOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          opacity: 0.5,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {resourcesOpen && (
        <div style={{ padding: "0 0 10px 0" }}>
          <Link href={`/${lang}/blog`} onClick={onClose} style={subItemStyle}>
            {t.nav.resourcesMenu?.blog || "News"}
          </Link>
        </div>
      )}

      {/* Tarifs */}
      <Link href={`/${lang}/tarifs`} onClick={onClose} style={navStyle}>
        <span>{t.nav.tarifs}</span>
      </Link>
    </>
  );
}
