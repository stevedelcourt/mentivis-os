"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

interface InteractiveShowcaseProps {
  lang: Locale;
}

const ORBS = [
  {
    grad: "showcase-orb-profile",
    title: "Profil utilisateur",
    desc: "Saisir le profil, l'objectif et les contraintes en quelques secondes.",
  },
  {
    grad: "showcase-orb-target",
    title: "Référentiel cible",
    desc: "Cartographier le référentiel métier visé et son périmètre.",
  },
  {
    grad: "showcase-orb-diagnostic",
    title: "Diagnostic",
    desc: "Score de couverture, risque résiduel, durée. Moins d'une minute.",
  },
  {
    grad: "showcase-orb-modules",
    title: "Modules calculés",
    desc: "Découpage, ordonnancement critique, profondeur ajustée.",
  },
  {
    grad: "showcase-orb-program",
    title: "Programme généré",
    desc: "Théorie, projet pratique, évaluation. Module par module.",
  },
  {
    grad: "showcase-orb-assistant",
    title: "Assistant intégré",
    desc: "Accompagnement embarqué qui ne sort jamais du sujet.",
  },
  {
    grad: "showcase-orb-impact",
    title: "Bilan d'impact",
    desc: "Mesure des acquis, ajustement continu, reporting clair.",
  },
];

const PRODUCTS: Record<string, { title: string; sub: string }> = {
  atelier: {
    title: "Diagnostic pédagogique IA",
    sub: "Le programme exact qui comble l'écart, calculé en moins d'une minute.",
  },
  operate: {
    title: "Opérations pédagogiques",
    sub: "Conformité Qualiopi, dossiers OPCO, suivi formateurs. Tout au même endroit.",
  },
  intel: {
    title: "Pilotage et reporting",
    sub: "Mesurer l'impact réel. Décider sur les bons chiffres, pas sur les intentions.",
  },
};

const FEATURES = [
  "Diagnostic IA",
  "Programme adaptatif",
  "Assistant pédagogique",
  "Conformité Qualiopi",
  "Tableau de bord",
];

const POS_STYLES: Record<number, React.CSSProperties> = {
  [-3]: { transform: "translate(-50%, -50%) translateX(-600px) scale(0.25)", opacity: 0, pointerEvents: "none" as const },
  [-2]: { transform: "translate(-50%, -50%) translateX(-420px) scale(0.42)", opacity: 0.55, zIndex: 1 },
  [-1]: { transform: "translate(-50%, -50%) translateX(-280px) scale(0.62)", opacity: 0.95, zIndex: 3 },
  [0]: { transform: "translate(-50%, -50%) translateX(0) scale(1)", opacity: 1, zIndex: 5 },
  [1]: { transform: "translate(-50%, -50%) translateX(280px) scale(0.62)", opacity: 0.95, zIndex: 3 },
  [2]: { transform: "translate(-50%, -50%) translateX(420px) scale(0.42)", opacity: 0.55, zIndex: 1 },
  [3]: { transform: "translate(-50%, -50%) translateX(600px) scale(0.25)", opacity: 0, pointerEvents: "none" as const },
};

export default function InteractiveShowcase({ lang }: InteractiveShowcaseProps) {
  const t = getT(lang);
  const [activeIdx, setActiveIdx] = useState(2);
  const [product, setProduct] = useState("atelier");
  const [activeFeature, setActiveFeature] = useState(0);
  const [pulsingIdx, setPulsingIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingOrbIdx, setPlayingOrbIdx] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const navLock = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasPlayingRef = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const fadeVolume = useCallback((target: number, duration = 400) => {
    const audio = audioRef.current;
    if (!audio) return;
    const start = audio.volume;
    const startTime = performance.now();
    if (fadeInterval.current) clearInterval(fadeInterval.current);
    fadeInterval.current = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      audio.volume = start + (target - start) * t;
      if (t >= 1) {
        if (fadeInterval.current) clearInterval(fadeInterval.current);
        if (target === 0) {
          audio.pause();
        }
      }
    }, 16);
  }, []);

  const toggleAudio = useCallback((orbIdx: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (isPlaying && playingOrbIdx === orbIdx) {
      fadeVolume(0, 250);
      setIsPlaying(false);
      setPlayingOrbIdx(null);
    } else {
      setPlayingOrbIdx(orbIdx);
      audio.volume = 1;
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => { setIsPlaying(false); setPlayingOrbIdx(null); });
      }
    }
  }, [isPlaying, playingOrbIdx, fadeVolume]);

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + ORBS.length) % ORBS.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % ORBS.length);
  }, []);

  const handleOrbClick = useCallback(
    (idx: number, isPlay: boolean) => {
      if (isPlay) {
        setPulsingIdx(idx);
        setTimeout(() => setPulsingIdx(null), 1400);
        return;
      }
      if (idx !== activeIdx) {
        setActiveIdx(idx);
      }
    },
    [activeIdx]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handlePrev, handleNext]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const audio = audioRef.current;
          if (!audio) return;
          if (!entry.isIntersecting) {
            if (isPlaying) {
              wasPlayingRef.current = true;
              fadeVolume(0, 500);
              setIsPlaying(false);
              setPlayingOrbIdx(null);
            }
          } else {
            if (wasPlayingRef.current && !isPlaying) {
              audio.volume = 1;
              audio.play().catch(() => {});
              setIsPlaying(true);
            }
            wasPlayingRef.current = false;
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [isPlaying, fadeVolume]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < 12 && Math.abs(e.deltaY) < 12) return;
      if (navLock.current) return;
      navLock.current = true;
      setTimeout(() => { navLock.current = false; }, 600);
      if (e.deltaX > 0 || e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    };
    stage.addEventListener("wheel", onWheel, { passive: true });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [handlePrev, handleNext]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      if (navLock.current) return;
      navLock.current = true;
      setTimeout(() => { navLock.current = false; }, 600);
      if (dx < 0) handleNext();
      else handlePrev();
    };
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchend", onTouchEnd);
    };
  }, [handlePrev, handleNext]);

  const getPos = (idx: number) => {
    const total = ORBS.length;
    let diff = idx - activeIdx;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.max(-3, Math.min(3, diff));
  };

  const prod = PRODUCTS[product];

  return (
    <section ref={sectionRef} className="section" style={{ background: "var(--bg-warm)" }}>
      <audio
        ref={audioRef}
        src="/sounds/bacri.mp3"
        preload="auto"
        onEnded={() => { setIsPlaying(false); setPlayingOrbIdx(null); }}
        onError={() => { setIsPlaying(false); setPlayingOrbIdx(null); }}
        style={{ display: "none" }}
      />
      <div className="container">
        <div
          style={{
            width: "100%",
            maxWidth: 1180,
            margin: "0 auto",
            background: "#F2EEE7",
            borderRadius: 32,
            padding: "clamp(20px, 4vw, 36px) clamp(16px, 4vw, 40px) clamp(16px, 3vw, 28px)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 0 0 1px rgba(0,0,0,.04), 0 8px 40px rgba(0,0,0,.04)",
          }}
        >
          {/* TOP BAR */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 48,
              marginBottom: 24,
            }}
          >
            {/* Product Tabs */}
            <div
              style={{
                display: "flex",
                background: "rgba(0,0,0,.03)",
                borderRadius: 8,
                padding: 4,
                height: "fit-content",
              }}
            >
              {(["atelier", "operate", "intel"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setProduct(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    border: "none",
                    background: product === key ? "#FFFFFF" : "transparent",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                    color: product === key ? "#0A0A0A" : "#3A3A3A",
                    boxShadow: product === key
                      ? "0 0 0 1px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.06)"
                      : "none",
                    transition: "all .25s ease",
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      position: "relative",
                      overflow: "hidden",
                      flexShrink: 0,
                      background:
                        key === "atelier"
                          ? "radial-gradient(ellipse at 30% 30%,#E8726A,#F0A080 60%,#FFD0B0)"
                          : key === "operate"
                          ? "radial-gradient(ellipse at 30% 30%,#6058A8,#8878C0 60%,#D88060)"
                          : "radial-gradient(ellipse at 30% 30%,#4F8068,#7A9880 60%,#B0C098)",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                        backgroundSize: "30px 30px",
                        opacity: 0.18,
                        mixBlendMode: "multiply",
                      }}
                    />
                  </span>
                  <span>
                    {key === "atelier"
                      ? "MentivisAtelier"
                      : key === "operate"
                      ? "MentivisOperate"
                      : "MentivisIntel"}
                  </span>
                </button>
              ))}
            </div>

            {/* Title */}
            <div style={{ textAlign: "right", maxWidth: 600 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#0A0A0A",
                  marginBottom: 4,
                  letterSpacing: "-.01em",
                  lineHeight: 1.2,
                }}
              >
                {prod.title}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "#777169",
                  lineHeight: 1.45,
                }}
              >
                {prod.sub}
              </p>
            </div>
          </div>

          {/* STAGE */}
          <div
            ref={stageRef}
            style={{
              position: "relative",
              flex: 1,
              minHeight: 480,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 -40px",
              padding: "0 40px",
            }}
          >
            {/* Prev */}
            <button
              className="showcase-arrows"
              onClick={handlePrev}
              aria-label="Précédent"
              style={{
                position: "absolute",
                top: "42%",
                left: "32%",
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                color: "#777169",
                transition: "all .25s ease",
                fontSize: 24,
                lineHeight: 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#0A0A0A";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#777169";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Orbs */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {ORBS.map((orb, i) => {
                const pos = getPos(i);
                const posStyle = POS_STYLES[pos] || POS_STYLES[3];
                return (
                  <div
                    key={i}
                    className="showcase-orb-container"
                    data-pos={pos}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.closest(".showcase-tap-zone")) {
                        handleOrbClick(i, true);
                        return;
                      }
                      handleOrbClick(i, false);
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: 280,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 18,
                      cursor: "pointer",
                      transition: "transform .7s cubic-bezier(.22,1,.36,1), opacity .55s ease",
                      transformOrigin: "center",
                      ...posStyle,
                    }}
                  >
                    {/* Orb — rounded square */}
                    <div
                      className={orb.grad}
                      style={{
                        width: 280,
                        height: 280,
                        borderRadius: 32,
                        position: "relative",
                        overflow: "hidden",
                        transition: "transform .35s cubic-bezier(.34,1.56,.64,1)",
                        animation: pulsingIdx === i ? "orbPulse 1.4s cubic-bezier(.22,1,.36,1)" : "none",
                      }}
                    >
                      {/* Grain overlay */}
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 32,
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                          backgroundSize: "200px 200px",
                          opacity: 0.1,
                          mixBlendMode: "multiply",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Tap zones — prev/next chevrons on active card */}
                      {pos === 0 && (
                        <>
                          <button
                            className="showcase-tap-zone"
                            aria-label="Précédent"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrev();
                            }}
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: "25%",
                              zIndex: 15,
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(255,255,255,0.7)" }}>
                              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            className="showcase-tap-zone"
                            aria-label="Suivant"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNext();
                            }}
                            style={{
                              position: "absolute",
                              right: 0,
                              top: 0,
                              bottom: 0,
                              width: "25%",
                              zIndex: 15,
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(255,255,255,0.7)" }}>
                              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Play button / Audio player */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: pos === 0 ? "flex" : "none",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                          opacity: pos === 0 ? 1 : 0,
                          pointerEvents: pos === 0 ? "auto" : "none",
                          transition: "all .4s ease",
                          transitionDelay: ".2s",
                        }}
                      >
                        {/* Full-width edge-to-edge waveform */}
                        {isPlaying && playingOrbIdx === i && (
                          <div
                            style={{
                              position: "absolute",
                              left: 16,
                              right: 16,
                              top: "50%",
                              transform: "translateY(-50%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              height: 56,
                              gap: 2,
                              zIndex: 1,
                            }}
                          >
                            {Array.from({ length: 50 }).map((_, wi) => (
                              <span
                                key={wi}
                                style={{
                                  flex: 1,
                                  borderRadius: 1,
                                  background: "rgba(255,255,255,0.95)",
                                  animation: `waveform ${0.25 + Math.random() * 0.35}s ease-in-out infinite alternate`,
                                  animationDelay: `${wi * 0.025}s`,
                                  height: `${10 + Math.random() * 40}px`,
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Centered play/pause button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAudio(i);
                          }}
                          aria-label={isPlaying && playingOrbIdx === i ? "Pause" : "Lire"}
                          style={{
                            position: "relative",
                            zIndex: 10,
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: "#FFFFFF",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 20px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.05)",
                            transition: "transform .2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                          }}
                          onMouseDown={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)";
                          }}
                          onMouseUp={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                          }}
                        >
                          {isPlaying && playingOrbIdx === i ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A0A0A">
                              <rect x="6" y="5" width="5" height="14" rx="1.5" />
                              <rect x="13" y="5" width="5" height="14" rx="1.5" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A0A0A" style={{ marginLeft: 2 }}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div
                      style={{
                        textAlign: "center",
                        opacity: [-1, 0, 1].includes(pos) ? 1 : 0,
                        transition: "opacity .5s ease",
                        transitionDelay: ".1s",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#0A0A0A",
                          marginBottom: 6,
                          letterSpacing: "-.01em",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {orb.title}
                        {pos === 0 && (
                          <span style={{ fontSize: 16, fontWeight: 400 }}>↗</span>
                        )}
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#777169",
                          lineHeight: 1.5,
                          maxWidth: 240,
                          margin: "0 auto",
                        }}
                      >
                        {orb.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next */}
            <button
              className="showcase-arrows"
              onClick={handleNext}
              aria-label="Suivant"
              style={{
                position: "absolute",
                top: "42%",
                right: "32%",
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                color: "#777169",
                transition: "all .25s ease",
                fontSize: 24,
                lineHeight: 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#0A0A0A";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#777169";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* BOTTOM BAR */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              paddingTop: 18,
              borderTop: "1px solid rgba(0,0,0,.08)",
              gap: 24,
            }}
          >
            <nav className="showcase-features-nav" style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              {FEATURES.map((f, i) => (
                <button
                  key={f}
                  onClick={() => setActiveFeature(i)}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontFamily: "inherit",
                    fontSize: 14,
                    color: activeFeature === i ? "#0A0A0A" : "#777169",
                    cursor: "pointer",
                    padding: "8px 0",
                    position: "relative",
                    transition: "color .2s ease",
                    fontWeight: activeFeature === i ? 500 : 400,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (activeFeature !== i) {
                      (e.currentTarget as HTMLButtonElement).style.color = "#3A3A3A";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeFeature !== i) {
                      (e.currentTarget as HTMLButtonElement).style.color = "#777169";
                    }
                  }}
                >
                  {f.split(" ").map((word, wi) => (
                    <span
                      key={wi}
                      style={
                        activeFeature === i && wi === f.split(" ").length - 1
                          ? {
                              background: "#A0C4FF",
                              color: "#0A0A0A",
                              padding: "0 1px",
                            }
                          : undefined
                      }
                    >
                      {word}
                      {wi < f.split(" ").length - 1 ? " " : ""}
                    </span>
                  ))}
                </button>
              ))}
            </nav>
            <Link
              href={`/${lang}/demo`}
              className="showcase-cta-link"
              style={{
                background: "#0A0A0A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                padding: "10px 16px",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all .25s ease",
                whiteSpace: "nowrap",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#222";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#0A0A0A";
              }}
            >
              {t.demo.form.submit}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Mobile CTA — full width, below features */}
          <Link
            href={`/${lang}/demo`}
            className="showcase-mobile-cta"
            style={{
              display: "none",
              background: "#0A0A0A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              padding: "12px 16px",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all .25s ease",
              whiteSpace: "nowrap",
              textDecoration: "none",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              marginTop: 12,
            }}
          >
            {t.demo.form.submit}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Orb pulse keyframe */}
      <style>{`
        @keyframes orbPulse {
          0% { transform: scale(1); }
          20% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .showcase-orb-profile {
          background:
            radial-gradient(ellipse 70% 60% at 35% 28%,#7A6CC4 0%,transparent 58%),
            radial-gradient(ellipse 56% 56% at 65% 42%,#A89AD8 0%,transparent 56%),
            radial-gradient(ellipse 62% 66% at 54% 78%,#F0B090 0%,transparent 58%),
            radial-gradient(ellipse 44% 44% at 80% 22%,#B0A0E0 0%,transparent 50%),
            #DCC8E8;
        }
        .showcase-orb-target {
          background:
            radial-gradient(ellipse 64% 58% at 36% 28%,#F0C25C 0%,transparent 56%),
            radial-gradient(ellipse 58% 64% at 66% 54%,#E89868 0%,transparent 60%),
            radial-gradient(ellipse 68% 50% at 50% 84%,#F0D098 0%,transparent 56%),
            #F4D8B0;
        }
        .showcase-orb-diagnostic {
          background:
            radial-gradient(ellipse 66% 56% at 32% 26%,#FF6878 0%,transparent 60%),
            radial-gradient(ellipse 58% 66% at 70% 50%,#FF8856 0%,transparent 60%),
            radial-gradient(ellipse 72% 48% at 50% 88%,#FFB088 0%,transparent 56%),
            radial-gradient(ellipse 44% 44% at 18% 70%,#E84858 0%,transparent 52%),
            radial-gradient(ellipse 38% 32% at 76% 22%,#FFAFA8 0%,transparent 50%),
            #FFC8B8;
        }
        .showcase-orb-modules {
          background:
            radial-gradient(ellipse 62% 56% at 38% 30%,#7090A8 0%,transparent 58%),
            radial-gradient(ellipse 56% 62% at 64% 54%,#8898A0 0%,transparent 56%),
            radial-gradient(ellipse 66% 52% at 48% 82%,#909862 0%,transparent 56%),
            radial-gradient(ellipse 48% 40% at 75% 22%,#88A8B0 0%,transparent 52%),
            #B8C8B0;
        }
        .showcase-orb-program {
          background:
            radial-gradient(ellipse 64% 58% at 36% 28%,#5688C8 0%,transparent 58%),
            radial-gradient(ellipse 58% 64% at 66% 54%,#88B0D8 0%,transparent 60%),
            radial-gradient(ellipse 68% 50% at 50% 84%,#A0C0E8 0%,transparent 56%),
            #C0D8F0;
        }
        .showcase-orb-assistant {
          background:
            radial-gradient(ellipse 64% 58% at 38% 30%,#4FAA94 0%,transparent 58%),
            radial-gradient(ellipse 56% 60% at 64% 54%,#7AC4B0 0%,transparent 56%),
            radial-gradient(ellipse 66% 50% at 50% 84%,#A8DCC8 0%,transparent 56%),
            #C0E8D8;
        }
        .showcase-orb-impact {
          background:
            radial-gradient(ellipse 66% 58% at 36% 26%,#D85838 0%,transparent 58%),
            radial-gradient(ellipse 58% 66% at 66% 52%,#E87858 0%,transparent 60%),
            radial-gradient(ellipse 70% 48% at 52% 82%,#F09060 0%,transparent 56%),
            #E8B898;
        }
        @keyframes waveform {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
        @media (max-width: 900px) {
          .showcase-stage { flex-direction: column; gap: 24px; }
          .showcase-title { text-align: left; }
        }
        @media (max-width: 768px) {
          .showcase-nav { display: none !important; }
          .showcase-arrows { display: none !important; }
          .showcase-orb-container[data-pos="1"] {
            transform: translate(-50%, -50%) translateX(calc(50vw + 52px)) scale(0.55) !important;
            opacity: 0.55 !important;
          }
          .showcase-orb-container[data-pos="-1"] {
            transform: translate(-50%, -50%) translateX(calc(-50vw - 52px)) scale(0.55) !important;
            opacity: 0.55 !important;
          }
          .showcase-orb-container[data-pos="2"],
          .showcase-orb-container[data-pos="-2"],
          .showcase-orb-container[data-pos="3"],
          .showcase-orb-container[data-pos="-3"] {
            opacity: 0 !important;
            pointer-events: none !important;
          }
          .showcase-features-nav {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            flex-wrap: nowrap !important;
            gap: 16px !important;
            width: 100%;
            padding-bottom: 4px;
          }
          .showcase-features-nav::-webkit-scrollbar { display: none; }
          .showcase-cta-link {
            display: none !important;
          }
          .showcase-mobile-cta {
            display: flex !important;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
