"use client";

import { useEffect, useRef } from "react";

interface TopoLinesProps {
  count?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  lineColor?: string;
  lineWidth?: number;
  animated?: boolean;
  speed?: number;
}

export default function TopoLines({
  count = 15,
  width = "100%",
  height = 300,
  className = "",
  lineColor = "rgba(0,0,0,0.12)",
  lineWidth = 0.75,
  animated = true,
  speed = 0.3,
}: TopoLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let animId: number;

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.42;

      for (let i = 1; i <= count; i++) {
        const base = (i / count) * maxR;
        const dist = base * 0.2;
        const phase = i * 0.32 + (animated ? frame * speed * 0.01 : 0);
        const op = 0.18 + (i / count) * 0.42;

        ctx.beginPath();
        for (let a = 0; a <= 360; a++) {
          const rad = (a * Math.PI) / 180;
          const wobble = dist * (
            Math.sin(3 * rad + phase) +
            0.5 * Math.sin(5 * rad - phase * 0.8) +
            0.3 * Math.sin(7 * rad + phase * 1.4)
          );
          const x = cx + (base + wobble) * Math.cos(rad);
          const y = cy + (base + wobble) * Math.sin(rad);
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${op})`);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      // center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();

      frame++;
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [count, lineColor, lineWidth, animated, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: "block" }}
    />
  );
}
