"use client";

import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";

interface HeroCollageProps {
  lang: Locale;
}

interface FloatElement {
  id: number;
  type: "orb" | "square" | "ghost" | "icon" | "label" | "photo" | "wave";
  x: number;
  y: number;
  size: number;
  speed: number;
  style?: React.CSSProperties;
}

const WAVE_SVG = `
<svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <path d="M0 160 C240 80 480 240 720 160 C960 80 1200 240 1440 160 L1440 320 L0 320 Z" fill="rgba(120,120,120,0.12)">
    <animate attributeName="d" dur="8s" repeatCount="indefinite"
      values="M0 160 C240 80 480 240 720 160 C960 80 1200 240 1440 160 L1440 320 L0 320 Z;
              M0 200 C240 100 480 280 720 200 C960 100 1200 280 1440 200 L1440 320 L0 320 Z;
              M0 160 C240 80 480 240 720 160 C960 80 1200 240 1440 160 L1440 320 L0 320 Z" />
  </path>
  <path d="M0 200 C320 120 640 280 960 200 C1280 120 1400 200 1440 180 L1440 320 L0 320 Z" fill="rgba(100,100,100,0.08)">
    <animate attributeName="d" dur="12s" repeatCount="indefinite"
      values="M0 200 C320 120 640 280 960 200 C1280 120 1400 200 1440 180 L1440 320 L0 320 Z;
              M0 180 C320 200 640 100 960 180 C1280 200 1400 180 1440 200 L1440 320 L0 320 Z;
              M0 200 C320 120 640 280 960 200 C1280 120 1400 200 1440 180 L1440 320 L0 320 Z" />
  </path>
  <path d="M0 240 C360 160 720 280 1080 220 C1260 190 1380 240 1440 220 L1440 320 L0 320 Z" fill="rgba(80,80,80,0.06)">
    <animate attributeName="d" dur="10s" repeatCount="indefinite"
      values="M0 240 C360 160 720 280 1080 220 C1260 190 1380 240 1440 220 L1440 320 L0 320 Z;
              M0 220 C360 260 720 160 1080 240 C1260 260 1380 220 1440 240 L1440 320 L0 320 Z;
              M0 240 C360 160 720 280 1080 220 C1260 190 1380 240 1440 220 L1440 320 L0 320 Z" />
  </path>
</svg>`;

const ICONS = {
  lock: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  chart: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  cert: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  users: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

const LABELS = ["RGPD", "Qualiopi", "ISO 27001", "99.9% uptime", "Zero-downtime"];

const INITIAL_ELEMENTS: FloatElement[] = [
  { id: 1, type: "orb", x: 5, y: 15, size: 80, speed: 0.15 },
  { id: 2, type: "square", x: 75, y: 8, size: 60, speed: 0.25 },
  { id: 3, type: "ghost", x: 88, y: 35, size: 100, speed: 0.1 },
  { id: 4, type: "icon", x: 15, y: 70, size: 48, speed: 0.2 },
  { id: 5, type: "photo", x: 60, y: 55, size: 120, speed: 0.3, style: { aspectRatio: "16/9" } },
  { id: 6, type: "label", x: 82, y: 65, size: 80, speed: 0.18 },
  { id: 7, type: "orb", x: 45, y: 20, size: 50, speed: 0.12 },
  { id: 8, type: "ghost", x: 30, y: 85, size: 70, speed: 0.08 },
  { id: 9, type: "icon", x: 70, y: 80, size: 44, speed: 0.22 },
  { id: 10, type: "photo", x: 20, y: 40, size: 90, speed: 0.25, style: { aspectRatio: "1/1" } },
  { id: 11, type: "square", x: 55, y: 75, size: 55, speed: 0.15 },
  { id: 12, type: "label", x: 40, y: 60, size: 90, speed: 0.2 },
  { id: 13, type: "wave", x: 0, y: 70, size: 400, speed: 0.05 },
  { id: 14, type: "ghost", x: 90, y: 15, size: 50, speed: 0.1 },
  { id: 15, type: "label", x: 8, y: 45, size: 70, speed: 0.17 },
];

export default function HeroCollage({ lang }: HeroCollageProps) {
  const [offsets, setOffsets] = useState<Record<number, number>>({});
  const rafRef = useRef<number>(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const animate = () => {
      setOffsets((prev) => {
        const next = { ...prev };
        INITIAL_ELEMENTS.forEach((el) => {
          next[el.id] = scrollRef.current * el.speed;
        });
        return next;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const iconKeys = Object.keys(ICONS) as (keyof typeof ICONS)[];

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
      {/* Wave SVG at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          opacity: 0.6,
        }}
        dangerouslySetInnerHTML={{ __html: `<div style="width:100%;height:100%">${WAVE_SVG}</div>` }}
      />

      {INITIAL_ELEMENTS.filter((e) => e.type !== "wave").map((el) => {
        const y = el.y + (offsets[el.id] || 0) * 0.3;
        const rotate = (offsets[el.id] || 0) * 0.02;

        if (el.type === "orb") {
          return (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${y % 100}%`,
                width: el.size,
                height: el.size,
                borderRadius: "50%",
                background: el.id % 3 === 0
                  ? "radial-gradient(circle at 35% 35%, rgba(200,210,230,0.4) 0%, rgba(140,160,200,0.25) 50%, rgba(100,120,180,0.15) 100%)"
                  : el.id % 3 === 1
                  ? "radial-gradient(circle at 30% 30%, rgba(180,180,200,0.3) 0%, rgba(120,120,150,0.2) 60%, rgba(80,80,120,0.1) 100%)"
                  : "radial-gradient(circle at 40% 40%, rgba(160,180,200,0.35) 0%, rgba(100,130,170,0.2) 50%, rgba(70,90,140,0.12) 100%)",
                backdropFilter: "blur(8px)",
                transform: `rotate(${rotate}deg)`,
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            />
          );
        }

        if (el.type === "square") {
          return (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${y % 100}%`,
                width: el.size,
                height: el.size,
                borderRadius: 12,
                background: el.id % 2 === 0 ? "#1a1a2e" : "#777169",
                opacity: 0.7,
                transform: `rotate(${rotate * 0.5}deg)`,
              }}
            />
          );
        }

        if (el.type === "ghost") {
          return (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${y % 100}%`,
                width: el.size,
                height: el.size,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(4px)",
                transform: `rotate(${rotate * -0.3}deg)`,
              }}
            />
          );
        }

        if (el.type === "icon") {
          const iconKey = iconKeys[el.id % iconKeys.length];
          return (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${y % 100}%`,
                width: el.size,
                height: el.size,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                transform: `rotate(${rotate}deg)`,
              }}
            >
              {ICONS[iconKey]}
            </div>
          );
        }

        if (el.type === "label") {
          const label = LABELS[el.id % LABELS.length];
          return (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${y % 100}%`,
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(0,0,0,0.06)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#000",
                whiteSpace: "nowrap",
                transform: `rotate(${rotate * 0.4}deg)`,
              }}
            >
              {label}
            </div>
          );
        }

        if (el.type === "photo") {
          return (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${y % 100}%`,
                width: el.size,
                aspectRatio: el.style?.aspectRatio || "1/1",
                borderRadius: 12,
                overflow: "hidden",
                transform: `rotate(${rotate * 0.6}deg)`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              {/* Placeholder gradient — replace with real photo */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: el.style?.aspectRatio === "16/9"
                    ? "linear-gradient(160deg, #2a2a3e 0%, #4a4a6e 30%, #6a6a8e 60%, #3a3a5e 100%)"
                    : "linear-gradient(135deg, #3a3a4a 0%, #5a5a7a 40%, #4a4a6a 70%, #2a2a3a 100%)",
                }}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}