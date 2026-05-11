"use client";

import { useEffect, useRef } from "react";

interface RoseCanvasProps {
  className?: string;
}

export default function RoseCanvas({ className = "" }: RoseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const τ = Math.PI * 2;
    const S = Math.min(canvas.width, canvas.height) / 2;
    const CX = S;
    const CY = S;

    ctx.lineWidth = 1.3;
    ctx.strokeStyle = "rgba(0,0,0,0.84)";
    ctx.beginPath();
    for (let i = 0; i <= 3000; i++) {
      const t = (i / 3000) * τ * 5;
      const r = Math.cos(3.5 * t) * S * 0.84;
      const x = CX + r * Math.cos(t);
      const y = CY - r * Math.sin(t);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
