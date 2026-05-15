"use client";

import { useState, useCallback, useRef } from "react";

export default function ParallaxScreens() {
  const [transform, setTransform] = useState({ t1: "", t2: "", t3: "" });
  const containerRef = useRef<HTMLDivElement>(null);
  const tid = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (tid.current) {
      clearTimeout(tid.current);
      tid.current = null;
    }
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);   // -1..1
    const dy = (e.clientY - cy) / (rect.height / 2);   // -1..1

    const layers = [0.2, 0.5, 1.0];
    setTransform({
      t1: buildTransform(dx, dy, layers[0]),
      t2: buildTransform(dx, dy, layers[1]),
      t3: buildTransform(dx, dy, layers[2]),
    });
  }, []);

  const handleLeave = useCallback(() => {
    // Smooth return to center via CSS transition
    setTransform({ t1: "reset", t2: "reset", t3: "reset" });
    tid.current = setTimeout(() => {
      setTransform({ t1: "", t2: "", t3: "" });
    }, 600);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        width: "100%",
        minHeight: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "default",
      }}
    >
      <svg
        viewBox="0 0 800 800"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "auto",
          maxWidth: 480,
          fillRule: "evenodd",
          clipRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 1.5,
        }}
      >
        <g
          transform="matrix(0.697279,0,0,0.697279,47.8297,209.415)"
          className="plx-screen plx-s1"
          style={getLayerStyle(transform.t1)}
        >
          <path
            d="M659.189,265.043L659.189,614.221C659.189,634.402 642.804,650.788 622.622,650.788L106.921,539.125C86.739,539.125 70.354,522.74 70.354,502.558L70.354,153.38C70.354,133.199 86.739,116.814 106.921,116.814L622.622,228.476C642.804,228.476 659.189,244.861 659.189,265.043Z"
            style={{ fill: "none", stroke: "#0A0A0A", strokeWidth: "4.78px" }}
          />
        </g>
        <g
          transform="matrix(0.697279,0,0,0.697279,110.439,178.457)"
          className="plx-screen plx-s2"
          style={getLayerStyle(transform.t2)}
        >
          <path
            d="M659.189,265.043L659.189,614.221C659.189,634.402 642.804,650.788 622.622,650.788L106.921,539.125C86.739,539.125 70.354,522.74 70.354,502.558L70.354,153.38C70.354,133.199 86.739,116.814 106.921,116.814L622.622,228.476C642.804,228.476 659.189,244.861 659.189,265.043Z"
            style={{ fill: "none", stroke: "#0A0A0A", strokeWidth: "4.78px" }}
          />
        </g>
        <g
          transform="matrix(0.697279,0,0,0.697279,170.021,145.336)"
          className="plx-screen plx-s3"
          style={getLayerStyle(transform.t3)}
        >
          <path
            d="M659.189,265.043L659.189,614.221C659.189,634.402 642.804,650.788 622.622,650.788L106.921,539.125C86.739,539.125 70.354,522.74 70.354,502.558L70.354,153.38C70.354,133.199 86.739,116.814 106.921,116.814L622.622,228.476C642.804,228.476 659.189,244.861 659.189,265.043Z"
            style={{ fill: "none", stroke: "#0A0A0A", strokeWidth: "4.78px" }}
          />
        </g>
      </svg>
    </div>
  );
}

function buildTransform(dx: number, dy: number, factor: number): string {
  const tx = dx * factor * 8;
  const ty = dy * factor * 6;
  const ry = dx * factor * 3;
  const rx = -dy * factor * 2;
  return `translateX(${tx}px) translateY(${ty}px) rotateY(${ry}deg) rotateX(${rx}deg)`;
}

function getLayerStyle(t: string): React.CSSProperties {
  if (!t) return {};
  if (t === "reset") {
    return {
      transformOrigin: "center",
      transform: "translateX(0) translateY(0) rotateY(0deg) rotateX(0deg)",
      transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
    };
  }
  return {
    transformOrigin: "center",
    transform: t,
    transition: "none",
  };
}
