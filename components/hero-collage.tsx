"use client";

import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";

interface HeroCollageProps {
  lang: Locale;
}

const ICONS = {
  lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  cert: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

const LABELS = ["RGPD", "Qualiopi", "ISO 27001", "99.9% uptime"];

interface FloatEl {
  id: number;
  type: "orb" | "square" | "ghost" | "icon" | "label" | "photo";
  left: number;
  top: number;
  size: number;
  speed: number;
  iconKey?: keyof typeof ICONS;
  label?: string;
  photoGradient?: string;
}

const ELEMENTS: FloatEl[] = [
  { id: 1, type: "orb", left: 3, top: 12, size: 140, speed: 0.08 },
  { id: 2, type: "photo", left: 12, top: 25, size: 200, speed: 0.15, photoGradient: "linear-gradient(135deg, #2a2a3e 0%, #5a5a7e 50%, #3a3a5e 100%)" },
  { id: 3, type: "ghost", left: 22, top: 8, size: 120, speed: 0.06 },
  { id: 4, type: "icon", left: 30, top: 55, size: 56, speed: 0.12, iconKey: "lock" },
  { id: 5, type: "square", left: 38, top: 18, size: 100, speed: 0.1 },
  { id: 6, type: "label", left: 45, top: 70, size: 100, speed: 0.14, label: "RGPD" },
  { id: 7, type: "photo", left: 52, top: 30, size: 220, speed: 0.18, photoGradient: "linear-gradient(160deg, #3a3a4a 0%, #6a6a8a 40%, #4a4a6a 100%)" },
  { id: 8, type: "orb", left: 60, top: 60, size: 100, speed: 0.09 },
  { id: 9, type: "ghost", left: 68, top: 15, size: 160, speed: 0.07 },
  { id: 10, type: "icon", left: 72, top: 45, size: 52, speed: 0.13, iconKey: "shield" },
  { id: 11, type: "label", left: 78, top: 75, size: 110, speed: 0.16, label: "Qualiopi" },
  { id: 12, type: "square", left: 82, top: 25, size: 80, speed: 0.11 },
  { id: 13, type: "photo", left: 85, top: 50, size: 180, speed: 0.2, photoGradient: "linear-gradient(145deg, #4a4a5e 0%, #7a7a9a 50%, #5a5a7e 100%)" },
  { id: 14, type: "icon", left: 90, top: 80, size: 48, speed: 0.1, iconKey: "chart" },
  { id: 15, type: "label", left: 95, top: 35, size: 120, speed: 0.12, label: "ISO 27001" },
  { id: 16, type: "ghost", left: 48, top: 42, size: 90, speed: 0.05 },
  { id: 17, type: "orb", left: 15, top: 65, size: 80, speed: 0.07 },
  { id: 18, type: "icon", left: 55, top: 12, size: 44, speed: 0.11, iconKey: "users" },
];

export default function HeroCollage({ lang }: HeroCollageProps) {
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number>(0);

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

  useEffect(() => {
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const iconKeys = Object.keys(ICONS) as (keyof typeof ICONS)[];

  return (
    <>
      {/* LAYER 1: Wave SVG — slow parallax */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
          transform: `translateY(${scrollY * 0.03}px)`,
        }}
      >
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 280, opacity: 0.35 }}
        >
          <path d="M0 200 C240 120 480 280 720 200 C960 120 1200 280 1440 200 L1440 400 L0 400 Z" fill="rgba(100,100,100,0.15)">
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="M0 200 C240 120 480 280 720 200 C960 120 1200 280 1440 200 L1440 400 L0 400 Z;
                      M0 240 C240 160 480 320 720 240 C960 160 1200 320 1440 240 L1440 400 L0 400 Z;
                      M0 200 C240 120 480 280 720 200 C960 120 1200 280 1440 200 L1440 400 L0 400 Z" />
          </path>
          <path d="M0 260 C320 180 640 340 960 260 C1280 180 1440 260 1440 240 L1440 400 L0 400 Z" fill="rgba(80,80,80,0.1)">
            <animate attributeName="d" dur="12s" repeatCount="indefinite"
              values="M0 260 C320 180 640 340 960 260 C1280 180 1440 260 1440 240 L1440 400 L0 400 Z;
                      M0 240 C320 220 640 160 960 240 C1280 220 1440 240 1440 260 L1440 400 L0 400 Z;
                      M0 260 C320 180 640 340 960 260 C1280 180 1440 260 1440 240 L1440 400 L0 400 Z" />
          </path>
          <path d="M0 300 C360 220 720 340 1080 280 C1260 250 1380 300 1440 280 L1440 400 L0 400 Z" fill="rgba(60,60,60,0.08)">
            <animate attributeName="d" dur="10s" repeatCount="indefinite"
              values="M0 300 C360 220 720 340 1080 280 C1260 250 1380 300 1440 280 L1440 400 L0 400 Z;
                      M0 280 C360 260 720 200 1080 280 C1260 260 1380 280 1440 300 L1440 400 L0 400 Z;
                      M0 300 C360 220 720 340 1080 280 C1260 250 1380 300 1440 280 L1440 400 L0 400 Z" />
          </path>
        </svg>
      </div>

      {/* LAYER 2: Floating elements — faster parallax */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
      >
        {ELEMENTS.map((el) => {
          const yShift = scrollY * el.speed;

          if (el.type === "orb") {
            return (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: `${el.left}%`,
                  top: `calc(${el.top}% + ${yShift}px)`,
                  width: el.size,
                  height: el.size,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, rgba(180,190,210,0.35) 0%, rgba(120,140,180,0.2) 50%, rgba(80,100,150,0.12) 100%)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
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
                  left: `${el.left}%`,
                  top: `calc(${el.top}% + ${yShift}px)`,
                  width: el.size,
                  height: el.size,
                  borderRadius: 14,
                  background: el.id % 2 === 0 ? "#1a1a2e" : "#4e4e4e",
                  opacity: 0.6,
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
                  left: `${el.left}%`,
                  top: `calc(${el.top}% + ${yShift}px)`,
                  width: el.size,
                  height: el.size,
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.07)",
                  background: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(4px)",
                }}
              />
            );
          }

          if (el.type === "icon") {
            const key = el.iconKey || iconKeys[el.id % iconKeys.length];
            return (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: `${el.left}%`,
                  top: `calc(${el.top}% + ${yShift}px)`,
                  width: el.size,
                  height: el.size,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                }}
              >
                {ICONS[key]}
              </div>
            );
          }

          if (el.type === "label") {
            return (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: `${el.left}%`,
                  top: `calc(${el.top}% + ${yShift}px)`,
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "#000",
                  whiteSpace: "nowrap",
                }}
              >
                {el.label}
              </div>
            );
          }

          if (el.type === "photo") {
            return (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: `${el.left}%`,
                  top: `calc(${el.top}% + ${yShift}px)`,
                  width: el.size,
                  aspectRatio: el.photoGradient?.includes("16/9") ? "16/9" : undefined,
                  height: el.photoGradient?.includes("16/9") ? undefined : el.size,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: el.photoGradient || "linear-gradient(135deg, #3a3a4a, #6a6a8a)",
                  }}
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
}