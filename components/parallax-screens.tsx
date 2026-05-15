"use client";

import { useState, useCallback, useRef } from "react";

const screenPath =
  "M659.189,265.043L659.189,614.221C659.189,634.402 642.804,650.788 622.622,650.788L106.921,539.125C86.739,539.125 70.354,522.74 70.354,502.558L70.354,153.38C70.354,133.199 86.739,116.814 106.921,116.814L622.622,228.476C642.804,228.476 659.189,244.861 659.189,265.043Z";

export default function ParallaxScreens() {
  const [transform, setTransform] = useState("none");
  const [smooth, setSmooth] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    setSmooth(false);
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rx = dy * 12;
    const ry = dx * 12;
    setTransform(`rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`);
  }, []);

  const handleLeave = useCallback(() => {
    setSmooth(true);
    setTransform("rotateX(0deg) rotateY(0deg)");
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        width: "100%",
        minHeight: 420,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1200px",
        cursor: "default",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          aspectRatio: "1 / 1",
          transformStyle: "preserve-3d",
          transform,
          transition: smooth
            ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
            : "none",
        }}
      >
        <svg
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 1.5,
            transform: "translateZ(-40px)",
          }}
        >
          <g transform="matrix(0.697279,0,0,0.697279,47.8297,209.415)">
            <path
              d={screenPath}
              style={{ fill: "none", stroke: "#0A0A0A", strokeWidth: "4.78px" }}
            />
          </g>
        </svg>
        <svg
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 1.5,
            transform: "translateZ(0px)",
          }}
        >
          <g transform="matrix(0.697279,0,0,0.697279,110.439,178.457)">
            <path
              d={screenPath}
              style={{ fill: "none", stroke: "#0A0A0A", strokeWidth: "4.78px" }}
            />
          </g>
        </svg>
        <svg
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 1.5,
            transform: "translateZ(50px)",
          }}
        >
          <g transform="matrix(0.697279,0,0,0.697279,170.021,145.336)">
            <path
              d={screenPath}
              style={{ fill: "none", stroke: "#0A0A0A", strokeWidth: "4.78px" }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
