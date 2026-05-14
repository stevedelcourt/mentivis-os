"use client";
import { useEffect, useRef } from "react";

export default function IcosahedronAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const phi = (1 + Math.sqrt(5)) / 2;
    const raw: number[][] = [
      [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
      [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
      [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
    ];
    const r = Math.sqrt(1 + phi * phi);
    const verts = raw.map(v => [v[0] / r, v[1] / r, v[2] / r]);

    const edges: [number, number][] = [];
    for (let i = 0; i < 12; i++) {
      for (let j = i + 1; j < 12; j++) {
        const d = Math.sqrt(
          (raw[i][0] - raw[j][0]) ** 2 +
          (raw[i][1] - raw[j][1]) ** 2 +
          (raw[i][2] - raw[j][2]) ** 2
        );
        if (Math.abs(d - 2) < 0.001) edges.push([i, j]);
      }
    }

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("stroke", "#000000");
    g.setAttribute("stroke-linecap", "round");
    g.setAttribute("stroke-linejoin", "round");
    g.setAttribute("fill", "none");

    const lines = edges.map(() => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
      g.appendChild(el);
      return el;
    });
    svg.appendChild(g);

    const TILT = 23 * Math.PI / 180;
    const cosTilt = Math.cos(TILT);
    const sinTilt = Math.sin(TILT);
    const CX = 300, CY = 300, SCALE = 218;

    function applyTilt([x, y, z]: number[]) {
      return [x, cosTilt * y - sinTilt * z, sinTilt * y + cosTilt * z];
    }

    function spinY([x, y, z]: number[], a: number) {
      const c = Math.cos(a), s = Math.sin(a);
      return [c * x + s * z, y, -s * x + c * z];
    }

    function project([x, y]: number[]) {
      return [x * SCALE + CX, -y * SCALE + CY];
    }

    let t = 0;
    const SPEED = (Math.PI * 2) / (60 * 20);
    let animId: number;

    function frame() {
      const pts = verts.map(v => {
        const [x, y, z] = spinY(applyTilt(v), t);
        return project([x, y]);
      });

      edges.forEach(([i, j], k) => {
        const line = lines[k];
        line.setAttribute("x1", pts[i][0].toFixed(2));
        line.setAttribute("y1", pts[i][1].toFixed(2));
        line.setAttribute("x2", pts[j][0].toFixed(2));
        line.setAttribute("y2", pts[j][1].toFixed(2));
        const mz = (verts[i][2] + verts[j][2]) / 2;
        const depth = (mz + 1) / 2;
        line.setAttribute("stroke-width", (0.7 + depth * 0.9).toFixed(2));
      });

      t += SPEED;
      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      svg.removeChild(g);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
