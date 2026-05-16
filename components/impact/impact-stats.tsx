"use client";

import { useRef, useState, useEffect } from "react";
import { Locale } from "@/lib/i18n";

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const sectionAnim = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(24px)",
  transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
});

/* ── Tooltip state ── */
interface TooltipData {
  x: number;
  y: number;
  html: string;
  show: boolean;
}

function BarChart({
  data,
  max,
  color,
  visible,
  unit = "%",
  labels,
}: {
  data: number[];
  max: number;
  color: string;
  visible: boolean;
  unit?: string;
  labels: string[];
}) {
  const [tip, setTip] = useState<TooltipData>({ x: 0, y: 0, html: "", show: false });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const barH = isMobile ? 11 : 13;
  const gap = isMobile ? 18 : 22;
  const H = data.length * (barH + gap);
  const W = 560;
  const M = { l: isMobile ? 90 : 140, r: isMobile ? 30 : 60, t: 10, b: 10 };
  const pw = W - M.l - M.r;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const x = M.l + p * pw;
          return (
            <g key={p}>
              <line x1={x} y1={0} x2={x} y2={H} stroke="#e5e5e5" strokeWidth={0.8} />
              <text x={x} y={H - 2} textAnchor="middle" fill="#9CA3AF" fontSize={10}>
                {Math.round(p * max)}{unit}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((v, i) => {
          const y = i * (barH + gap) + gap / 2;
          const bw = (v / max) * pw;
          const label = labels[i];

          return (
            <g key={i}>
              {/* Track */}
              <rect x={M.l} y={y} width={pw} height={barH} fill="#f3f4f6" rx={4} />
              {/* Bar */}
              <rect
                x={M.l}
                y={y}
                width={visible ? bw : 0}
                height={barH}
                fill={color}
                rx={4}
                style={{
                  transition: `width 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const rect = (e.target as Element).closest("svg")?.getBoundingClientRect();
                  if (!rect) return;
                  setTip({
                    x: e.clientX - rect.left + 16,
                    y: e.clientY - rect.top,
                    html: `<div style="font-size:11px;color:#6B7280;margin-bottom:4px">${label}</div><div style="font-size:13px;font-weight:600">${v}${unit}</div>`,
                    show: true,
                  });
                }}
                onMouseMove={(e) => {
                  const rect = (e.target as Element).closest("svg")?.getBoundingClientRect();
                  if (!rect) return;
                  setTip({
                    ...tip,
                    x: e.clientX - rect.left + 16,
                    y: e.clientY - rect.top,
                  });
                }}
                onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
              />
              {/* Label */}
              <text
                x={M.l - 10}
                y={y + barH / 2 + 4}
                textAnchor="end"
                fill="#374151"
                fontSize={11}
                fontWeight={500}
              >
                {label}
              </text>
              {/* Value */}
              <text
                x={M.l + bw + 6}
                y={y + barH / 2 + 4}
                fill={color}
                fontSize={11}
                fontWeight={600}
              >
                {v}{unit}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tip.show && (
        <div
          style={{
            position: "absolute",
            left: tip.x,
            top: tip.y,
            background: "#fff",
            borderRadius: 10,
            padding: "10px 14px",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.09), 0 4px 18px rgba(0,0,0,0.08)",
            fontSize: 12,
            pointerEvents: "none",
            zIndex: 10,
            minWidth: 120,
          }}
          dangerouslySetInnerHTML={{ __html: tip.html }}
        />
      )}
    </div>
  );
}

const CONTENT = {
  fr: {
    schemas: [
      {
        eyebrow: "SCHEMA 1",
        title: "L'ampleur de la transformation",
        bars: {
          labels: ["Tâches IA 2030", "Tâches IA 2035", "Reconversion 2030"],
          values: [27, 45, 59],
          max: 70,
          color: "#E11D48",
          unit: "%",
        },
        source: "Source : McKinsey Global Institute / Institut de l'Entreprise, « L'IA et l'évolution des compétences en France », 2025",
        link: "https://www.rhmatin.com/sirh/gpec/travailler-avec-l-ia-en-france-27-des-taches-impactees-d-ici-2030.html",
      },
      {
        eyebrow: "SCHEMA 2",
        title: "L'écart qui se creuse",
        bars: {
          labels: ["Prime salariale IA", "Utilisation Bac+5", "Utilisation non diplômés"],
          values: [56, 73, 50],
          max: 90,
          color: "#F59E0B",
          unit: "%",
        },
        source: "Source : PwC AI Jobs Barometer 2025 / France Travail, Observatoire IA & Emploi, octobre 2024",
        link: "https://www.pwc.fr/fr/publications/series/ai-jobs-barometer.html",
      },
      {
        eyebrow: "SCHEMA 3",
        title: "Le marché du travail bascule",
        bars: {
          labels: ["Croissance offres IA", "Offres IA 2024", "Vitesse évolution compétences"],
          values: [273, 166, 66],
          max: 300,
          color: "#8B5CF6",
          unit: "%",
        },
        source: "Source : PwC AI Jobs Barometer 2025",
        link: "https://www.pwc.fr/fr/espace-presse/communiques-de-presse/2025/juin/ai-jobs-barometer.html",
      },
    ],
  },
  en: {
    schemas: [
      {
        eyebrow: "SCHEMA 1",
        title: "The scale of the transformation",
        bars: {
          labels: ["AI tasks 2030", "AI tasks 2035", "Reskilling by 2030"],
          values: [27, 45, 59],
          max: 70,
          color: "#E11D48",
          unit: "%",
        },
        source: "Source: McKinsey Global Institute / Institut de l'Entreprise, « AI and Skills Evolution in France », 2025",
        link: "https://www.rhmatin.com/sirh/gpec/travailler-avec-l-ia-en-france-27-des-taches-impactees-d-ici-2030.html",
      },
      {
        eyebrow: "SCHEMA 2",
        title: "The widening gap",
        bars: {
          labels: ["AI salary premium", "Graduate usage", "Non-graduate usage"],
          values: [56, 73, 50],
          max: 90,
          color: "#F59E0B",
          unit: "%",
        },
        source: "Source: PwC AI Jobs Barometer 2025 / France Travail, AI & Employment Observatory, October 2024",
        link: "https://www.pwc.fr/fr/publications/series/ai-jobs-barometer.html",
      },
      {
        eyebrow: "SCHEMA 3",
        title: "The job market shifts",
        bars: {
          labels: ["AI job growth", "AI jobs 2024", "Skill change velocity"],
          values: [273, 166, 66],
          max: 300,
          color: "#8B5CF6",
          unit: "%",
        },
        source: "Source: PwC AI Jobs Barometer 2025",
        link: "https://www.pwc.fr/fr/espace-presse/communiques-de-presse/2025/juin/ai-jobs-barometer.html",
      },
    ],
  },
};

export default function ImpactStats({ lang }: { lang: Locale }) {
  const c = CONTENT[lang === "fr" ? "fr" : "en"];

  return (
    <section style={{ background: "#f5f5f5", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        {c.schemas.map((schema, i) => {
          const { ref, visible } = useVisible(0.1);
          return (
            <div
              key={i}
              ref={ref}
              style={{
                marginBottom: i < 2 ? 80 : 0,
              }}
            >
              <p
                style={{
                  ...sectionAnim(visible, 0),
                  marginBottom: 12,
                  color: "#4e4e4e",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  fontWeight: 500,
                  fontSize: 12,
                }}
              >
                {schema.eyebrow}
              </p>
              <h2
                style={{
                  ...sectionAnim(visible, 0.05),
                  marginBottom: 40,
                  fontWeight: 300,
                  fontSize: "clamp(24px, 3vw, 36px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {schema.title}
              </h2>

              <div
                style={{
                  ...sectionAnim(visible, 0.1),
                  background: "#ffffff",
                  borderRadius: 20,
                  padding: "32px 28px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <BarChart
                  data={schema.bars.values}
                  max={schema.bars.max}
                  color={schema.bars.color}
                  visible={visible}
                  unit={schema.bars.unit}
                  labels={schema.bars.labels}
                />
              </div>

              <p
                style={{
                  ...sectionAnim(visible, 0.2),
                  marginTop: 16,
                  fontSize: 13,
                  color: "#9CA3AF",
                  lineHeight: 1.5,
                }}
              >
                {schema.source}
                {" "}
                <a
                  href={schema.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4e4e4e", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  →
                </a>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
