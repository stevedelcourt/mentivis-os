"use client";

interface PricingBlocksSVGProps {
  className?: string;
}

export default function PricingBlocksSVG({ className = "" }: PricingBlocksSVGProps) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 -42 499 499"
        style={{ width: "70%", height: "auto", display: "block" }}
      >
        <title>Pricing blocks</title>
        <path stroke="#000" strokeWidth=".5" d="m358.17 259.63 139.45 80.52m.47-287.5L.12 340.15" opacity=".2" />
        <g>
          <animateTransform
            attributeName="transform"
            begin="0s"
            calcMode="linear"
            dur="4s"
            keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1"
            repeatCount="indefinite"
            type="translate"
            values="0,0; 0,-5.66; 0,-8; 0,-5.66; 0,0; 0,5.66; 0,8; 0,5.66; 0,0"
          />
          <path stroke="#000" strokeWidth=".5" d="M437.38 305.34 248.7 414.2 60.07 305.28l188.67-108.85z" />
          <path stroke="#000" d="m437.98 222.74.07 82.85-188.99 109.2L59.9 305.59v-82.85L248.96 113.6z" />
          <path stroke="#000" strokeWidth=".5" d="m248.91 414.63-.16-.1-1.09-.62-4.19-2.4a67386 67386 0 0 1-66.34-38.1A72928 72928 0 0 1 59.6 305.76v-82.9l189.97 109.45z" />
          <path stroke="#000" strokeWidth=".5" d="M249.38 332.47v82.15l.15-.08 1.07-.63 4.13-2.4a55260 55260 0 0 1 65.58-38.2 23024 23024 0 0 0 117.6-148.25v-2.18zm-4.12-215.15a8.6 8.6 0 0 1 7.76 0l179.8 103.81c2.15 1.24 2.15 3.25 0 4.49L249.89 331.16a1.7 1.7 0 0 1-1.55 0L64.64 225.1c-1.71-1-1.71-2.6 0-3.59z" />
          <path stroke="#000" strokeWidth=".5" d="m249.14 114.43 143.82 83.03c1.71 1 1.71 2.6 0 3.59l-140.12 80.84a8.2 8.2 0 0 1-7.45 0l-140.72-81.25c-1.37-.79-1.37-2.07 0-2.86z" />
        </g>
        <g>
          <animateTransform
            attributeName="transform"
            begin="-1.33s"
            calcMode="linear"
            dur="4s"
            keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1"
            repeatCount="indefinite"
            type="translate"
            values="0,0; 0,-5.66; 0,-8; 0,-5.66; 0,0; 0,5.66; 0,8; 0,5.66; 0,0"
          />
          <path stroke="#000" d="m396.33 133.97.05 64.5-147.3 85.11-147.45-85.1v-64.5L249 48.9z" />
          <path stroke="#000" strokeWidth=".5" d="m248.8 283.63-.08-.05-.84-.48-3.22-1.85-11.86-6.84a268608 268608 0 0 1-130.96-75.54v-64.5l147.02 84.8z" />
          <path stroke="#000" strokeWidth=".5" d="m248.84 283.13.1-.07.96-.54 3.63-2.08 13.22-7.6 129.66-74.46v-64l-147.57 84.75zm-3.32-231.44a6.9 6.9 0 0 1 6.21 0l139.98 80.81c1.71 1 1.71 2.6 0 3.59l-141.57 81.65a6.6 6.6 0 0 1-6.12 0L64.31 135.9c-1.37-.79-1.37-2.07 0-2.86z" />
        </g>
      </svg>
    </div>
  );
}
