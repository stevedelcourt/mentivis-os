"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";

interface HeroCollageProps {
  lang: Locale;
}

/* ── 5 horizontal cards, slight parallax, some overlap, bigger ── */

interface CardDef {
  id: number;
  left: number;     // %
  top: number;      // %
  width: number;    // px
  height: number;   // px
  speed: number;    // parallax
  zIndex: number;
}

const CARDS: CardDef[] = [
  { id: 1, left: -2,  top: 10,  width: 360, height: 300, speed: 0.05, zIndex: 2 },
  { id: 2, left: 22,  top: 35,  width: 340, height: 260, speed: 0.09, zIndex: 4 },
  { id: 3, left: 46,  top: 5,   width: 300, height: 340, speed: 0.12, zIndex: 3 },
  { id: 4, left: 62,  top: 25,  width: 320, height: 280, speed: 0.07, zIndex: 5 },
  { id: 5, left: 82,  top: 40,  width: 380, height: 240, speed: 0.10, zIndex: 4 },
];

/* ── Card contents (matching ElevenLabs reference) ── */

function WaveCard() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1a1e", borderRadius: 20, overflow: "hidden", position: "relative" }}>
      <svg viewBox="0 0 360 300" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }}>
        <path d="M0 180 Q90 140 180 180 T360 180" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <path d="M0 200 Q90 160 180 200 T360 200" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
        <path d="M0 220 Q90 180 180 220 T360 220" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
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
            width: 160,
            height: 160,
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
    const rad = (angle * Math.PI) / 180;
    const r1 = 120;
    const r2 = 138;
    const cx = 160;
    const cy = 140;
    const x1 = +(cx + r1 * Math.cos(rad)).toFixed(2);
    const y1 = +(cy + r1 * Math.sin(rad)).toFixed(2);
    const x2 = +(cx + r2 * Math.cos(rad)).toFixed(2);
    const y2 = +(cy + r2 * Math.sin(rad)).toFixed(2);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1.5}
      />
    );
  });

  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1a1e", borderRadius: 20, overflow: "hidden", position: "relative" }}>
      <svg viewBox="0 0 320 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {ticks}
        <circle cx={160} cy={140} r={100} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        <circle cx={160} cy={140} r={80} fill="url(#sunGrad2)" />
        <defs>
          <radialGradient id="sunGrad2" cx="40%" cy="40%">
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
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        pointerEvents: "none",
        height: 520,
        marginTop: -80,
      }}
    >
      {CARDS.map((card) => {
        const yShift = scrollY * card.speed;

        const baseStyle: React.CSSProperties = {
          position: "absolute",
          left: `${card.left}%`,
          top: `calc(${card.top}% + ${yShift}px)`,
          width: card.width,
          height: card.height,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          overflow: "hidden",
          zIndex: card.zIndex,
        };

        if (card.id === 1) {
          return <div key={card.id} style={baseStyle}><WaveCard /></div>;
        }

        if (card.id === 2) {
          return (
            <div key={card.id} style={baseStyle}>
              <Image src="/images/workers.avif" alt="Workers" fill sizes="340px" style={{ objectFit: "cover" }} />
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
              <Image src="/images/formation.avif" alt="Formation" fill sizes="380px" style={{ objectFit: "cover" }} />
            </div>
          );
        }

        return null;
      })}
    </section>
  );
}
