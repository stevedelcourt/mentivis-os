"use client";

import Link from "next/link";
import { useState } from "react";

interface SuperButtonProps {
  href: string;
  label: string;
}

export default function SuperButton({ href, label }: SuperButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{
        display: "block",
        position: "relative",
        width: 200,
        height: 120,
        flexShrink: 0,
        cursor: "pointer",
        textDecoration: "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* Bottom layer — static base */}
      <img
        src="/images/button/bottom.svg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transition: "transform 0.15s ease",
          transform: isPressed ? "translateY(2px)" : "translateY(0)",
        }}
      />

      {/* Middle layer — shifts on hover, presses on click */}
      <img
        src="/images/button/middle.svg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isPressed
            ? "translateY(4px) scale(0.98)"
            : isHovered
            ? "translateY(-3px) translateX(-2px) scale(1.02)"
            : "translateY(0) scale(1)",
        }}
      />

      {/* Top layer — frame, subtle shift on press */}
      <img
        src="/images/button/top.svg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transition: "transform 0.15s ease",
          transform: isPressed ? "translateY(1px)" : "translateY(0)",
        }}
      />

      {/* Text overlay */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-sans)",
          fontSize: 18,
          fontWeight: 600,
          color: "#1A1616",
          letterSpacing: "0.02em",
          zIndex: 10,
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isPressed
            ? "translateY(4px)"
            : isHovered
            ? "translateY(-3px) translateX(-2px)"
            : "translateY(0)",
          pointerEvents: "none",
        }}
      >
        {label}
      </span>
    </Link>
  );
}
