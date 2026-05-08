"use client";

import { useEffect, useRef } from "react";

interface AnimatedLinesProps {
  count?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  lineColor?: string;
  lineWidth?: number;
  speed?: number;
}

export default function AnimatedLines({
  count = 5,
  width = "100%",
  height = 200,
  className = "",
  lineColor = "rgba(0,0,0,0.12)",
  lineWidth = 1,
  speed = 1,
}: AnimatedLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ns = "http://www.w3.org/2000/svg";
    const w = svg.clientWidth || 400;
    const h = svg.clientHeight || 200;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const waves = Array.from({ length: count }, (_, i) => ({
      freq: 0.6 + i * 0.7,
      amp: 18 + i * 8,
      yb: (h / (count + 1)) * (i + 1),
      phase: i * 0.8,
      speed: (0.008 + i * 0.004) * speed,
      opacity: 0.15 + (i / count) * 0.55,
      width: lineWidth + (count - i) * 0.15,
    }));

    const paths: SVGPathElement[] = [];
    waves.forEach((wave) => {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", lineColor);
      path.setAttribute("stroke-width", String(wave.width));
      path.setAttribute("opacity", String(wave.opacity));
      svg.appendChild(path);
      paths.push(path);
    });

    let frame = 0;
    function animate() {
      waves.forEach((wave, idx) => {
        let d = "";
        for (let x = 0; x <= w; x += 2) {
          const y =
            wave.yb +
            wave.amp *
              Math.sin(
                (x / w) * 2 * Math.PI * wave.freq +
                  frame * wave.speed +
                  wave.phase
              );
          d += (x === 0 ? "M" : "L") + `${x.toFixed(1)},${y.toFixed(2)} `;
        }
        paths[idx].setAttribute("d", d);
      });
      frame++;
      requestAnimationFrame(animate);
    }
    animate();
  }, [count, lineColor, lineWidth, speed]);

  return (
    <svg
      ref={svgRef}
      className={className}
      style={{ width, height, display: "block" }}
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
    />
  );
}
