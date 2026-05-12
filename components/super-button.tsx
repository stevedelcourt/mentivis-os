"use client";

import Link from "next/link";
import { useState } from "react";

interface SuperButtonProps {
  href: string;
}

export default function SuperButton({ href }: SuperButtonProps) {
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
          transform: isPressed ? "translateY(8px)" : "translateY(0)",
        }}
      />

      {/* Middle layer — shifts DOWN on hover, presses DEEP on click */}
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
            ? "translateY(12px) scale(0.96)"
            : isHovered
            ? "translateY(4px) scale(1.01)"
            : "translateY(0) scale(1)",
        }}
      />

      {/* Top layer — frame, shifts down on press */}
      <img
        src="/images/button/top.svg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transition: "transform 0.15s ease",
          transform: isPressed ? "translateY(6px)" : "translateY(0)",
        }}
      />
    </Link>
  );
}
