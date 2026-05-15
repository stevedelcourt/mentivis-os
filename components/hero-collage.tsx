"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Locale } from "@/lib/i18n";

interface HeroCollageProps {
  lang: Locale;
}

interface CardDef {
  id: number;
  img: string;
  left: number;
  top: number;
  width: number;
  ar: string;
  speed: number;
  zIndex: number;
  radius: number | string;
}

const CARDS: CardDef[] = [
  { id: 1, img: "/images/floater/01-wave.webp",        left: 0,  top: 23, width: 22, ar: "3/2",   speed: 0.05, zIndex: 1, radius: "0 18px 18px 0" },
  { id: 2, img: "/images/floater/02-learning-guy.webp", left: 18, top: 23, width: 23, ar: "3/2",   speed: 0.09, zIndex: 5, radius: 18 },
  { id: 3, img: "/images/floater/03-os-txt.webp",       left: 36, top: 12, width: 12, ar: "9/16",  speed: 0.12, zIndex: 3, radius: 18 },
  { id: 4, img: "/images/floater/04-blue-ico.webp",     left: 54, top: 28, width: 22, ar: "3/2",   speed: 0.07, zIndex: 4, radius: 18 },
  { id: 5, img: "/images/floater/05-red-girl.webp",     left: 68, top: 44, width: 28, ar: "16/9",  speed: 0.10, zIndex: 6, radius: "18px 0 0 18px" },
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
        background: "#ffffff",
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
              aspectRatio: card.ar,
              borderRadius: card.radius,
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
            height: auto !important;
            margin: 0 auto 16px !important;
            display: block !important;
            z-index: auto !important;
            transform: none !important;
            border-radius: 18px !important;
          }
          section {
            height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
