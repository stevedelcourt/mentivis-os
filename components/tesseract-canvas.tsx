"use client";

import { useEffect, useRef } from "react";

interface TesseractCanvasProps {
  className?: string;
}

export default function TesseractCanvas({ className = "" }: TesseractCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── 16 vertices: all (±1,±1,±1,±1) ── */
    const VERTS = Array.from({ length: 16 }, (_, i) => [
      ((i >> 0) & 1) * 2 - 1,
      ((i >> 1) & 1) * 2 - 1,
      ((i >> 2) & 1) * 2 - 1,
      ((i >> 3) & 1) * 2 - 1,
    ]);

    /* ── 32 edges: vertices differing in exactly 1 coord ── */
    const EDGES: [number, number][] = [];
    for (let i = 0; i < 16; i++)
      for (let j = i + 1; j < 16; j++) {
        const d = VERTS[i].reduce((s, v, k) => s + (v !== VERTS[j][k] ? 1 : 0), 0);
        if (d === 1) EDGES.push([i, j]);
      }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));

    function rot4(v: number[], a: number, b: number, θ: number) {
      const r = [...v];
      const c = Math.cos(θ);
      const s = Math.sin(θ);
      r[a] = c * v[a] - s * v[b];
      r[b] = s * v[a] + c * v[b];
      return r;
    }

    function project(v4: number[], t: number, S: number) {
      let p = [...v4];
      p = rot4(p, 0, 3, t * 0.44);
      p = rot4(p, 1, 2, t * 0.29);
      p = rot4(p, 0, 1, t * 0.17);
      p = rot4(p, 2, 3, t * 0.23);

      const [x, y, z, w] = p;

      const d4 = 2.5;
      const f4 = 1 / (d4 - w);
      const [x3, y3, z3] = [x * f4, y * f4, z * f4];

      const tilt = 0.38;
      const y3t = Math.cos(tilt) * y3 - Math.sin(tilt) * z3;
      const z3t = Math.sin(tilt) * y3 + Math.cos(tilt) * z3;

      const d3 = 2.5;
      const f3 = 1 / (d3 - z3t);
      const sc = S * 0.63;

      return {
        sx: S / 2 + x3 * f3 * sc,
        sy: S / 2 + y3t * f3 * sc,
        w,
        depth: z3t + w * 0.15,
      };
    }

    const c = canvas;
    const g = ctx;
    let DPR = 1;
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const rect = c.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      c.style.width = size + "px";
      c.style.height = size + "px";
      c.width = Math.round(size * DPR);
      c.height = Math.round(size * DPR);
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    let animId: number;

    function draw(now: number) {
      const t = now * 0.001;
      const S = Math.round(c.width / DPR);

      g.clearRect(0, 0, S, S);

      const P = VERTS.map((v, vi) => {
        const p = project(v, t, S);
        const pulse = 1 + 0.18 * Math.sin(t * 2.6 + vi * 0.44);
        return { ...p, pulse };
      });

      const sorted = EDGES.map(([i, j]) => ({
        i,
        j,
        w: (P[i].w + P[j].w) * 0.5,
        depth: (P[i].depth + P[j].depth) * 0.5,
      })).sort((a, b) => a.depth - b.depth);

      g.lineCap = "round";
      sorted.forEach(({ i, j, w }) => {
        const p1 = P[i];
        const p2 = P[j];
        const tw = Math.max(0, Math.min(1, (w + 1) * 0.5));
        const alpha = lerp(0.07, 0.82, tw);
        const lw = lerp(0.3, 2.0, tw);

        g.save();
        g.lineWidth = lw;
        g.strokeStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
        g.beginPath();
        g.moveTo(p1.sx, p1.sy);
        g.lineTo(p2.sx, p2.sy);
        g.stroke();
        g.restore();
      });

      P.forEach((p) => {
        const tw = Math.max(0, Math.min(1, (p.w + 1) * 0.5));
        const alpha = lerp(0.06, 0.88, tw);
        const sz = lerp(1.0, 4.0, tw) * p.pulse;
        g.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
        g.fillRect(p.sx - sz / 2, p.sy - sz / 2, sz, sz);
      });

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animId);
    };
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
