"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";

interface HeroCollageProps {
  lang: Locale;
}

/* ── 5 floating image cards (numbered floater images) ── */

interface CardDef {
  id: number;
  img: string;
  left: number;
  top: number;
  width: number;
  height: number;
  speed: number;
  zIndex: number;
}

const CARDS: CardDef[] = [
  { id: 1, img: "/images/floater/01-wave.webp",        left: 2,  top: 23, width: 22, height: 49, speed: 0.05, zIndex: 1 },
  { id: 2, img: "/images/floater/02-learning-guy.webp", left: 18, top: 53, width: 23, height: 45, speed: 0.09, zIndex: 5 },
  { id: 3, img: "/images/floater/03-os-txt.webp",       left: 36, top: 12, width: 12, height: 63, speed: 0.12, zIndex: 3 },
  { id: 4, img: "/images/floater/04-blue-ico.webp",     left: 54, top: 28, width: 22, height: 44, speed: 0.07, zIndex: 4 },
  { id: 5, img: "/images/floater/05-red-girl.webp",     left: 68, top: 44, width: 28, height: 47, speed: 0.10, zIndex: 6 },
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
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#f3f3f3",
        overflow: "hidden",
      }}
    >
      {CARDS.map((card) => {
        const yShift = scrollY * card.speed;

        return (
          <div
            key={card.id}
            className="hero-collage-card"
            style={{
              position: "absolute",
              left: `${card.left}vw`,
              top: `calc(${card.top}vh + ${yShift}px)`,
              width: `${card.width}vw`,
              height: `${card.height}vh`,
              borderRadius: 18,
              overflow: "hidden",
              zIndex: card.zIndex,
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              transition: "top 0.1s linear",
            }}
          >
            <Image
              src={card.img}
              alt={`Floater ${card.id}`}
              fill
              sizes={`${card.width}vw`}
              style={{ objectFit: "cover" }}
            />
          </div>
        );
      })}

      <style>{`
        @media (max-width: 768px) {
          .hero-collage-card {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 80% !important;
            height: 40vh !important;
            margin: 0 auto 16px !important;
            display: block !important;
            z-index: auto !important;
            transform: none !important;
          }
          section {
            height: auto !important;
            padding: 120px 0 60px !important;
          }
        }
      `}</style>
    </section>
  );
}
