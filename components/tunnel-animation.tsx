"use client";

interface TunnelAnimationProps {
  className?: string;
}

export default function TunnelAnimation({ className = "" }: TunnelAnimationProps) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "400px",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "60%",
            height: "60%",
            border: "2px solid #000000",
            animation: "tunnelZoom 4s linear infinite",
            animationDelay: `${-i * 0.5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes tunnelZoom {
          from { transform: translateZ(-400px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          to { transform: translateZ(200px) rotate(45deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
