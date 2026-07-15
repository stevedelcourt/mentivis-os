"use client";

export default function NotFoundContent({ lang }: { lang: string }) {
  const isFr = lang === "fr";
  const phrase = isFr
    ? "L'univers a 404 r\u00e9ponses. Celle-ci n'est pas l'une d'elles."
    : "The universe has 404 answers. This isn't one of them.";

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 70px - 260px)",
        padding: "4rem 1rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(100px, 20vw, 180px)",
          fontWeight: 200,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          margin: "0 0 2.5rem",
          color: "#1a1a1a",
        }}
      >
        404
      </h1>

      <div
        style={{
          position: "relative",
          width: 120,
          height: 120,
          marginBottom: "2.5rem",
        }}
      >
        {[0, 0.8, 1.6].map((delay, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 24,
              height: 24,
              marginLeft: -12,
              marginTop: -12,
              borderRadius: "50%",
              border: "2px solid #1a1a1a",
              animation: `ring-pulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s infinite`,
            }}
          />
        ))}
      </div>

      <p
        style={{
          fontSize: "clamp(16px, 2vw, 22px)",
          fontWeight: 300,
          color: "#555",
          lineHeight: 1.6,
          maxWidth: "36ch",
          margin: 0,
        }}
      >
        {phrase}
      </p>

      <style>{`
        @keyframes ring-pulse {
          0% { transform: scale(0.3); opacity: 0.7; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
