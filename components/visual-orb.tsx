"use client";

interface VisualOrbProps {
  variant: "narration" | "characters" | "sage" | "petal" | "ember" | "periwinkle" | "terravert" | "dusk" | "breath" | "huedrift" | "pulse" | "rotgrad";
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const orbGradients: Record<string, string> = {
  narration: `radial-gradient(ellipse 66% 56% at 32% 28%,#E87268 0%,transparent 62%),radial-gradient(ellipse 56% 66% at 68% 58%,#E89068 0%,transparent 62%),radial-gradient(ellipse 72% 46% at 50% 88%,#F0B090 0%,transparent 56%),radial-gradient(ellipse 42% 42% at 18% 72%,#D46262 0%,transparent 52%),#F4C8B8`,
  characters: `radial-gradient(ellipse 70% 60% at 34% 26%,#6058A8 0%,transparent 58%),radial-gradient(ellipse 56% 56% at 64% 42%,#8878C0 0%,transparent 56%),radial-gradient(ellipse 62% 66% at 54% 78%,#D88060 0%,transparent 58%),radial-gradient(ellipse 44% 44% at 80% 22%,#9080C8 0%,transparent 50%),#C8B8E8`,
  sage: `radial-gradient(ellipse 62% 56% at 38% 30%,#7092A8 0%,transparent 58%),radial-gradient(ellipse 56% 62% at 64% 54%,#8898A0 0%,transparent 56%),radial-gradient(ellipse 66% 52% at 48% 82%,#909862 0%,transparent 56%),radial-gradient(ellipse 48% 40% at 75% 22%,#88A8B0 0%,transparent 52%),#B8C8B0`,
  petal: `radial-gradient(ellipse 70% 60% at 38% 32%,#F0C0C8 0%,transparent 60%),radial-gradient(ellipse 60% 70% at 62% 60%,#F8D8D0 0%,transparent 62%),radial-gradient(ellipse 50% 50% at 50% 85%,#F8E8E0 0%,transparent 55%),#FCF0EC`,
  ember: `radial-gradient(ellipse 66% 58% at 36% 26%,#C85838 0%,transparent 58%),radial-gradient(ellipse 58% 66% at 66% 52%,#D87050 0%,transparent 60%),radial-gradient(ellipse 70% 48% at 52% 82%,#E09060 0%,transparent 56%),radial-gradient(ellipse 44% 44% at 20% 68%,#B84838 0%,transparent 52%),#E8B898`,
  periwinkle: `radial-gradient(ellipse 64% 58% at 36% 28%,#8890C8 0%,transparent 58%),radial-gradient(ellipse 58% 64% at 66% 54%,#A8B0D8 0%,transparent 60%),radial-gradient(ellipse 68% 50% at 50% 84%,#C0C8E8 0%,transparent 56%),#D0D8F0`,
  terravert: `radial-gradient(ellipse 64% 56% at 34% 28%,#486858 0%,transparent 56%),radial-gradient(ellipse 56% 64% at 64% 54%,#587868 0%,transparent 58%),radial-gradient(ellipse 68% 50% at 50% 82%,#789068 0%,transparent 56%),radial-gradient(ellipse 46% 46% at 78% 24%,#688078 0%,transparent 52%),#A8B898`,
  dusk: `radial-gradient(ellipse 66% 56% at 30% 26%,#9060A0 0%,transparent 56%),radial-gradient(ellipse 58% 66% at 66% 48%,#A07090 0%,transparent 58%),radial-gradient(ellipse 70% 52% at 52% 78%,#C87858 0%,transparent 58%),radial-gradient(ellipse 50% 44% at 76% 28%,#A880B0 0%,transparent 52%),#D0A8C0`,
};

const animatedOrbs: Record<string, { bg: string; animation: string }> = {
  breath: {
    bg: `radial-gradient(ellipse 66% 56% at 32% 28%,#E87268 0%,transparent 62%),radial-gradient(ellipse 56% 66% at 68% 58%,#E89068 0%,transparent 62%),radial-gradient(ellipse 72% 46% at 50% 88%,#F0B090 0%,transparent 56%),#F4C8B8`,
    animation: "breathe 4.5s ease-in-out infinite alternate",
  },
  huedrift: {
    bg: `radial-gradient(ellipse 70% 60% at 34% 26%,#6058A8 0%,transparent 58%),radial-gradient(ellipse 56% 56% at 64% 42%,#8878C0 0%,transparent 56%),radial-gradient(ellipse 62% 66% at 54% 78%,#D88060 0%,transparent 58%),#C8B8E8`,
    animation: "huedrift 12s linear infinite",
  },
  pulse: {
    bg: `radial-gradient(ellipse 62% 56% at 38% 30%,#7092A8 0%,transparent 58%),radial-gradient(ellipse 56% 62% at 64% 54%,#8898A0 0%,transparent 56%),radial-gradient(ellipse 66% 52% at 48% 82%,#909862 0%,transparent 56%),#B8C8B0`,
    animation: "pulse 5s ease-in-out infinite",
  },
  rotgrad: {
    bg: `radial-gradient(ellipse 66% 58% at 36% 26%,#C85838 0%,transparent 58%),radial-gradient(ellipse 58% 66% at 66% 52%,#D87050 0%,transparent 60%),radial-gradient(ellipse 70% 48% at 52% 82%,#E09060 0%,transparent 56%),#E8B898`,
    animation: "rotGrad 10s linear infinite",
  },
};

const sizeMap = {
  sm: { width: 64, aspect: "64px" },
  md: { width: 120, aspect: "120px" },
  lg: { width: 200, aspect: "200px" },
  full: { width: "100%", aspect: "100%" },
};

export default function VisualOrb({ variant, size = "md", className = "" }: VisualOrbProps) {
  const isAnimated = animatedOrbs[variant] !== undefined;
  const bg = isAnimated ? animatedOrbs[variant].bg : orbGradients[variant];
  const animation = isAnimated ? animatedOrbs[variant].animation : undefined;
  const dimensions = sizeMap[size];

  return (
    <>
      <div
        className={`visual-orb ${className}`}
        style={{
          width: dimensions.width,
          aspectRatio: "1/1",
          borderRadius: "50%",
          background: bg,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
          ...(animation ? { animation } : {}),
        }}
      >
        <div
          style={{
            content: "''",
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
            opacity: 0.09,
            mixBlendMode: "multiply",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      </div>
      <style>{`
        @keyframes breathe {
          from { transform: scale(0.90); opacity: 0.85; }
          to { transform: scale(1.02); opacity: 1; }
        }
        @keyframes huedrift {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(0.94); filter: brightness(1.08); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        @keyframes rotGrad {
          from { filter: hue-rotate(0deg) saturate(1); }
          50% { filter: hue-rotate(-30deg) saturate(1.1); }
          to { filter: hue-rotate(0deg) saturate(1); }
        }
      `}</style>
    </>
  );
}
