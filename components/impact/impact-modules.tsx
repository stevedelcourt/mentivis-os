"use client";

import { useRef, useState, useEffect } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const CONTENT = {
  fr: {
    eyebrow: "CE QUE LE PROGRAMME IMPACT CHANGE CONCRETEMENT",
    title: "Cinq modules progressifs, sans prérequis.",
    modules: [
      {
        num: "01",
        title: "Comprendre sans subir",
        desc: "Ce que l'IA fait réellement, ce qu'elle ne fait pas, et pourquoi les représentations courantes brouillent les pistes. Poser un vocabulaire commun, distinguer les réalités des fantasmes, reprendre pied dans le débat public.",
      },
      {
        num: "02",
        title: "Prendre en main les outils du quotidien",
        desc: "Rédiger, rechercher, organiser, préparer une candidature, gérer ses démarches. Des usages concrets, testés en situation, avec une posture active et critique dès le premier jour.",
      },
      {
        num: "03",
        title: "Exercer son jugement",
        desc: "Comment reconnaître une erreur, un biais, une information générée. L'IA produit vite et beaucoup. Savoir évaluer ce qu'elle produit est une compétence à part entière, et une protection.",
      },
      {
        num: "04",
        title: "Comprendre ce qu'on cède",
        desc: "Données personnelles, consentement, RGPD appliqué au quotidien numérique. Ce que vous acceptez quand vous utilisez un outil IA, et comment exercer vos droits de manière concrète.",
      },
      {
        num: "05",
        title: "Participer au débat qui nous concerne tous",
        desc: "IA et travail, IA et démocratie, IA et souveraineté. Ces questions ne sont pas réservées aux experts. Ce module donne les clés pour suivre les décisions qui façonnent notre rapport collectif à ces technologies.",
      },
    ],
  },
  en: {
    eyebrow: "WHAT THE IMPACT PROGRAM CHANGES",
    title: "Five progressive modules, no prerequisites.",
    modules: [
      {
        num: "01",
        title: "Understand without suffering",
        desc: "What AI actually does, what it does not do, and why common representations confuse the issue. Establish a shared vocabulary, distinguish reality from fantasy, regain footing in public debate.",
      },
      {
        num: "02",
        title: "Master everyday tools",
        desc: "Write, research, organize, prepare applications, manage procedures. Concrete uses, tested in real situations, with an active and critical posture from day one.",
      },
      {
        num: "03",
        title: "Exercise judgment",
        desc: "How to recognize an error, a bias, generated information. AI produces fast and abundantly. Knowing how to evaluate what it produces is a skill in itself, and a protection.",
      },
      {
        num: "04",
        title: "Understand what you give up",
        desc: "Personal data, consent, GDPR applied to daily digital life. What you accept when you use an AI tool, and how to exercise your rights in concrete ways.",
      },
      {
        num: "05",
        title: "Participate in the debate that concerns us all",
        desc: "AI and work, AI and democracy, AI and sovereignty. These questions are not reserved for experts. This module provides the keys to follow the decisions that shape our collective relationship with these technologies.",
      },
    ],
  },
};

export default function ImpactModules({ lang }: { lang: Locale }) {
  const c = CONTENT[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(80px, 10vw, 120px) 0",
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p
          style={{
            ...sectionAnim(visible, 0),
            marginBottom: 16,
            color: "#4e4e4e",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontWeight: 500,
            fontSize: 12,
            maxWidth: 640,
          }}
        >
          {c.eyebrow}
        </p>
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            marginBottom: 56,
            fontWeight: 300,
            fontSize: "clamp(24px, 3vw, 36px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {c.title}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {c.modules.map((mod, i) => (
            <div
              key={i}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.08),
                background: "#f5f5f5",
                borderRadius: 22,
                padding: "32px 28px 28px",
                display: "flex",
                flexDirection: "column",
                aspectRatio: "1/1",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: "auto",
                }}
              >
                {mod.num}
              </div>
              <div style={{ marginTop: "auto" }}>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 500,
                    marginBottom: 10,
                    color: "#000",
                    lineHeight: 1.3,
                  }}
                >
                  {mod.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "#4e4e4e",
                    margin: 0,
                  }}
                >
                  {mod.desc}
                </p>
              </div>
            </div>
          ))}
          {/* MARIUS card */}
          <a
            href="https://iciafrance.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ICIA France"
            style={{
              ...sectionAnim(visible, 0.1 + c.modules.length * 0.08),
              borderRadius: 22,
              overflow: "hidden",
              backgroundImage: "url(https://iciafrance.com/images/publications/icia-association-loi-1901/icia-article.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              aspectRatio: "1/1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "28px",
              textDecoration: "none",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.6) 100%)",
                borderRadius: 22,
              }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  style={{
                    padding: "8px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  Voir !
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
