"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";

interface HeroCollageProps {
  lang: Locale;
}

/* ── 5 cards, all horizontal, articulating around one imaginary horizontal line ── */

const CENTER_LINE = 58; // % from top of section

interface CardDef {
  id: number;
  left: number;     // % from left
  width: number;    // px
  height: number;   // px
  align: "top" | "center" | "bottom"; // how card sits relative to center line
  speed: number;    // parallax multiplier
}

const CARDS: CardDef[] = [
  { id: 1, left: -4,  width: 320, height: 280, align: "center", speed: 0.06 },
  { id: 2, left: 22,  width: 300, height: 220, align: "top",    speed: 0.10 },
  { id: 3, left: 44,  width: 240, height: 260, align: "bottom", speed: 0.14 },
  { id: 4, left: 62,  width: 280, height: 240, align: "center", speed: 0.08 },
  { id: 5, left: 82,  width: 320, height: 200, align: "top",    speed: 0.12 },
];

function topFromAlign(height: number, align: "top" | "center" | "bottom"): number {
  const linePx = (CENTER_LINE / 100) * 800; // approximate section height ref
  if (align === "top")    return CENTER_LINE - (height / 800) * 35;
  if (align === "bottom") return CENTER_LINE - (height / 800) * 65;
  return CENTER_LINE - (height / 800) * 50;
}

/* ── Card contents (exactly matching the ElevenLabs reference) ── */

function WaveCard() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1a1e", borderRadius: 20, overflow: "hidden", position: "relative" }}>
      <svg viewBox="0 0 320 280" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }}>
        <path d="M0 180 Q80 140 160 180 T320 180" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <path d="M0 200 Q80 160 160 200 T320 200" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
        <path d="M0 220 Q80 180 160 220 T320 220" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
      </svg>
    </div>
  );
}

function GreenSphereCard() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#f0f2f5", borderRadius: 20, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #a8f0a8 0%, #4dd04d 40%, #2a9a2a 70%, #1a6a1a 100%)",
            boxShadow: "inset -10px -10px 30px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    </div>
  );
}

function RadialCircleCard() {
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const angle = (i / 48) * 360;
    return (
      <line
        key={i}
        x1={140 + 110 * Math.cos((angle * Math.PI) / 180)}
        y1={120 + 110 * Math.sin((angle * Math.PI) / 180)}
        x2={140 + 125 * Math.cos((angle * Math.PI) / 180)}
        y2={120 + 125 * Math.sin((angle * Math.PI) / 180)}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1.5}
      />
    );
  });

  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1a1e", borderRadius: 20, overflow: "hidden", position: "relative" }}>
      <svg viewBox="0 0 280 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {ticks}
        <circle cx={140} cy={120} r={90} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        <circle cx={140} cy={120} r={70} fill="url(#sunGrad)" />
        <defs>
          <radialGradient id="sunGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#f5e6a8" />
            <stop offset="50%" stopColor="#e8c87a" />
            <stop offset="100%" stopColor="#c9a855" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function HeroCollage({ lang }: HeroCollageProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {CARDS.map((card) => {
        const top = topFromAlign(card.height, card.align);
        const yShift = scrollY * card.speed;

        const baseStyle: React.CSSProperties = {
          position: "absolute",
          left: `${card.left}%`,
          top: `calc(${top}% + ${yShift}px)`,
          width: card.width,
          height: card.height,
          transform: "rotate(0deg)",
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          overflow: "hidden",
        };

        if (card.id === 1) {
          return <div key={card.id} style={baseStyle}><WaveCard /></div>;
        }

        if (card.id === 2) {
          return (
            <div key={card.id} style={baseStyle}>
              <Image src="/images/workers.avif" alt="Workers" fill sizes="320px" style={{ objectFit: "cover" }} />
            </div>
          );
        }

        if (card.id === 3) {
          return <div key={card.id} style={baseStyle}><GreenSphereCard /></div>;
        }

        if (card.id === 4) {
          return <div key={card.id} style={baseStyle}><RadialCircleCard /></div>;
        }

        if (card.id === 5) {
          return (
            <div key={card.id} style={baseStyle}>
              <Image src="/images/formation.avif" alt="Formation" fill sizes="320px" style={{ objectFit: "cover" }} />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
