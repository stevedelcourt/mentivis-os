"use client";

/* 17-square MentivisOS logomark with W02 Drop Physics */

const squares = [
  { i: 0,  x: 20,  y: 20 },
  { i: 1,  x: 100, y: 20 },
  { i: 2,  x: 20,  y: 40 },
  { i: 3,  x: 40,  y: 40 },
  { i: 4,  x: 80,  y: 40 },
  { i: 5,  x: 100, y: 40 },
  { i: 6,  x: 20,  y: 60 },
  { i: 7,  x: 40,  y: 60 },
  { i: 8,  x: 60,  y: 60 },
  { i: 9,  x: 80,  y: 60 },
  { i: 10, x: 100, y: 60 },
  { i: 11, x: 20,  y: 80 },
  { i: 12, x: 40,  y: 80 },
  { i: 13, x: 80,  y: 80 },
  { i: 14, x: 100, y: 80 },
  { i: 15, x: 20,  y: 100 },
  { i: 16, x: 100, y: 100 },
];

export default function LogomarkMotion() {
  return (
    <div
      className="logomark-motion"
      style={{
        width: 80,
        height: 80,
        marginTop: 20,
      }}
    >
      <svg
        viewBox="0 0 130 130"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {squares.map((sq) => {
          const delay = ((sq.y - 20) / 80 * 0.5).toFixed(3);
          return (
            <rect
              key={sq.i}
              className="lm-sq"
              x={sq.x}
              y={sq.y}
              width={10}
              height={10}
              fill="var(--text-tertiary)"
              style={{
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </svg>

      <style>{`
        .lm-sq {
          animation: lmDrop 3s cubic-bezier(.36,.07,.19,.97) infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes lmDrop {
          0%   { transform: translateY(-60px); opacity: 0; }
          20%  { opacity: 1; }
          55%  { transform: translateY(0); }
          62%  { transform: translateY(-4px); }
          68%  { transform: translateY(0); }
          72%  { transform: translateY(-1px); }
          76%  { transform: translateY(0); }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
