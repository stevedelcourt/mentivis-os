"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

interface HeroUnitProps {
  lang: Locale;
}

export default function HeroUnit({ lang }: HeroUnitProps) {
  const t = getT(lang);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w * 0.7, h * 0.5);
      ctx.rotate(rotation);

      const lines = 12;
      const size = Math.min(w, h) * 0.35;
      ctx.strokeStyle = "rgba(200, 169, 110, 0.06)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < lines; i++) {
        const offset = (i - lines / 2) * (size / lines);
        ctx.beginPath();
        ctx.moveTo(-size + offset, -size);
        ctx.lineTo(size + offset, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size, -size + offset);
        ctx.lineTo(size, size + offset);
        ctx.stroke();
      }

      ctx.restore();
      rotation += 0.0001;
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      className="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 56,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      <div className="container-wide" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: 720,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-interface)",
              fontSize: "var(--text-micro)",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 24,
            }}
          >
            {t.hero.eyebrow}
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-hero)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-ink-primary)",
              whiteSpace: "pre-line",
              marginBottom: 28,
            }}
          >
            {t.hero.headline}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--color-ink-secondary)",
              maxWidth: 560,
              whiteSpace: "pre-line",
              marginBottom: 36,
            }}
          >
            {t.hero.subheadline}
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href={`/${lang}/demo`}
              className="btn btn-primary"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-ground)",
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-small)",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "12px 24px",
                borderRadius: "var(--button-radius)",
                transition: "background 0.18s ease, box-shadow 0.18s ease",
              }}
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href={`/${lang}/produit`}
              className="btn btn-secondary"
              style={{
                background: "transparent",
                border: `1px solid var(--color-border)`,
                color: "var(--color-ink-primary)",
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-small)",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "12px 24px",
                borderRadius: "var(--button-radius)",
                transition: "border-color 0.18s ease, background 0.18s ease",
              }}
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>

          <p
            style={{
              fontFamily: "var(--font-interface)",
              fontSize: "var(--text-small)",
              color: "var(--color-ink-tertiary)",
              marginTop: 24,
            }}
          >
            {t.hero.proof}
          </p>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--color-accent)",
          boxShadow: "0 0 20px 0 rgba(200, 169, 110, 0.15)",
        }}
      />

      <style>{`
        .btn-primary:hover {
          background: #d4b67a !important;
          box-shadow: 0 0 20px rgba(200, 169, 110, 0.2) !important;
        }
        .btn-secondary:hover {
          border-color: rgba(200, 169, 110, 0.6) !important;
          background: var(--color-surface-1) !important;
        }
      `}</style>
    </section>
  );
}
