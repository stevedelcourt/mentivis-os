"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";

interface HeroCollageProps {
  lang: Locale;
}

interface CollageCard {
  id: number;
  type: "photo" | "gradient" | "dark-blob" | "label";
  src?: string;
  alt?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotation: number;
  speed: number;
  gradient?: string;
  label?: string;
  zIndex: number;
}

const CARDS: CollageCard[] = [
  {
    id: 1,
    type: "photo",
    src: "/images/student.avif",
    alt: "Student",
    left: 62,
    top: 15,
    width: 280,
    height: 200,
    rotation: -2,
    speed: 0.12,
    zIndex: 3,
  },
  {
    id: 2,
    type: "dark-blob",
    left: 82,
    top: 8,
    width: 200,
    height: 260,
    rotation: 3,
    speed: 0.08,
    zIndex: 2,
  },
  {
    id: 3,
    type: "gradient",
    gradient: "linear-gradient(145deg, #f0f2f5 0%, #e2e6ec 100%)",
    left: 72,
    top: 42,
    width: 220,
    height: 160,
    rotation: -3,
    speed: 0.15,
    zIndex: 4,
  },
  {
    id: 4,
    type: "photo",
    src: "/images/formation.avif",
    alt: "Formation",
    left: 38,
    top: 58,
    width: 340,
    height: 240,
    rotation: 1,
    speed: 0.18,
    zIndex: 5,
  },
  {
    id: 5,
    type: "photo",
    src: "/images/workers.avif",
    alt: "Workers",
    left: 86,
    top: 32,
    width: 280,
    height: 190,
    rotation: 2,
    speed: 0.1,
    zIndex: 3,
  },
  {
    id: 6,
    type: "dark-blob",
    left: 52,
    top: 72,
    width: 240,
    height: 240,
    rotation: -1,
    speed: 0.14,
    zIndex: 2,
  },
  {
    id: 7,
    type: "photo",
    src: "/images/ingenieur.avif",
    alt: "Engineer",
    left: 8,
    top: 68,
    width: 320,
    height: 220,
    rotation: -2,
    speed: 0.16,
    zIndex: 4,
  },
  {
    id: 8,
    type: "gradient",
    gradient: "linear-gradient(135deg, #e8e4f0 0%, #d8d4e6 100%)",
    left: 90,
    top: 62,
    width: 200,
    height: 200,
    rotation: 4,
    speed: 0.12,
    zIndex: 3,
  },
  {
    id: 9,
    type: "photo",
    src: "/images/MentivisOS/mentivos.avif",
    alt: "MentivisOS",
    left: 58,
    top: 82,
    width: 260,
    height: 180,
    rotation: 2,
    speed: 0.1,
    zIndex: 5,
  },
  {
    id: 10,
    type: "label",
    label: "Qualiopi",
    left: 4,
    top: 58,
    width: 120,
    height: 40,
    rotation: -1,
    speed: 0.08,
    zIndex: 6,
  },
  {
    id: 11,
    type: "label",
    label: "RGPD",
    left: 2,
    top: 88,
    width: 100,
    height: 40,
    rotation: 2,
    speed: 0.1,
    zIndex: 6,
  },
  {
    id: 12,
    type: "dark-blob",
    left: -2,
    top: 78,
    width: 160,
    height: 200,
    rotation: -4,
    speed: 0.06,
    zIndex: 1,
  },
];

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
        const yShift = scrollY * card.speed;

        const baseStyle: React.CSSProperties = {
          position: "absolute",
          left: `${card.left}%`,
          top: `calc(${card.top}% + ${yShift}px)`,
          width: card.width,
          height: card.height,
          transform: `rotate(${card.rotation}deg)`,
          zIndex: card.zIndex,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        };

        if (card.type === "photo") {
          return (
            <div key={card.id} style={{ ...baseStyle, overflow: "hidden" }}>
              <Image
                src={card.src!}
                alt={card.alt!}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          );
        }

        if (card.type === "gradient") {
          return (
            <div
              key={card.id}
              style={{
                ...baseStyle,
                background: card.gradient,
              }}
            />
          );
        }

        if (card.type === "dark-blob") {
          return (
            <div
              key={card.id}
              style={{
                ...baseStyle,
                background: "#1a1a1e",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "75%",
                  height: "75%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 40% 40%, rgba(120,160,220,0.35) 0%, rgba(80,100,180,0.15) 50%, transparent 70%)",
                  top: "10%",
                  left: "10%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "55%",
                  height: "55%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 60% 60%, rgba(200,160,120,0.25) 0%, transparent 60%)",
                  bottom: "8%",
                  right: "8%",
                }}
              />
            </div>
          );
        }

        if (card.type === "label") {
          return (
            <div
              key={card.id}
              style={{
                ...baseStyle,
                width: "auto",
                height: "auto",
                padding: "10px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.06)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "#1a1a1e",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              {card.label}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
