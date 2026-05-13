"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getT, Locale } from "@/lib/i18n";

interface TransformationTimelineProps {
  lang: Locale;
}

const ORB_SIZES = [72, 88, 104, 120, 112, 144, 160];
const MOBILE_ORB_SIZE = 160;

const ORB_CONFIGS = [
  {
    base: "#080810",
    blobs: [
      { c: "hsla(210,70%,55%,0.92)", x: -20, y: -15, s: 110 },
      { c: "hsla(200,60%,40%,0.85)", x: 15, y: 20, s: 95 },
      { c: "hsla(230,50%,30%,0.75)", x: 0, y: -20, s: 85 },
    ],
    satColors: ["#6ab0e0", "#4a90c0"],
  },
  {
    base: "#120804",
    blobs: [
      { c: "hsla(20,90%,60%,0.92)", x: -15, y: -20, s: 105 },
      { c: "hsla(15,85%,50%,0.88)", x: 20, y: 10, s: 100 },
      { c: "hsla(25,80%,40%,0.78)", x: -10, y: 20, s: 90 },
    ],
    satColors: ["#f07030", "#e8a040"],
  },
  {
    base: "#100a04",
    blobs: [
      { c: "hsla(20,90%,55%,0.9)", x: -20, y: -10, s: 110 },
      { c: "hsla(100,60%,45%,0.85)", x: 15, y: 20, s: 95 },
      { c: "hsla(270,50%,55%,0.8)", x: 10, y: -20, s: 100 },
    ],
    satColors: ["#f07030", "#a070d0"],
  },
  {
    base: "#100404",
    blobs: [
      { c: "hsla(0,90%,55%,0.92)", x: -15, y: -15, s: 115 },
      { c: "hsla(350,80%,45%,0.88)", x: 20, y: 15, s: 100 },
      { c: "hsla(340,70%,35%,0.78)", x: 0, y: 25, s: 90 },
    ],
    satColors: ["#f04040", "#d02050"],
  },
  {
    base: "#080410",
    blobs: [
      { c: "hsla(35,95%,60%,0.92)", x: -20, y: -15, s: 110 },
      { c: "hsla(170,85%,50%,0.88)", x: 15, y: 20, s: 95 },
      { c: "hsla(30,80%,45%,0.82)", x: -5, y: -25, s: 100 },
    ],
    satColors: ["#f0a030", "#20d0b0"],
  },
  {
    base: "#040414",
    blobs: [
      { c: "hsla(170,90%,55%,0.95)", x: -15, y: -15, s: 105 },
      { c: "hsla(320,85%,65%,0.9)", x: 20, y: 10, s: 100 },
      { c: "hsla(230,75%,55%,0.85)", x: -5, y: 25, s: 95 },
    ],
    satColors: ["#20e0c0", "#f080d0"],
  },
  {
    base: "#040420",
    blobs: [
      { c: "hsla(175,95%,60%,0.96)", x: -20, y: -15, s: 115 },
      { c: "hsla(330,90%,70%,0.92)", x: 15, y: 20, s: 105 },
      { c: "hsla(45,90%,55%,0.88)", x: 0, y: -25, s: 100 },
    ],
    satColors: ["#30f0d0", "#f090e0", "#f0c040"],
  },
];

// Consolidated blob drift patterns — 3 shared keyframes instead of 21
const BLOB_DRIFTS = [
  ["drift-a 12s ease-in-out infinite", "drift-b 15s ease-in-out infinite", "drift-c 10s ease-in-out infinite"],
  ["drift-b 8s steps(10) infinite", "drift-c 6s steps(8) infinite", "drift-a 9s steps(12) infinite"],
  ["drift-c 7s steps(8) infinite", "drift-a 9s steps(10) infinite", "drift-b 11s steps(6) infinite"],
  ["drift-a 4s ease-in-out infinite", "drift-b 13s ease-in-out infinite", "drift-c 11s ease-in-out infinite"],
  ["drift-b 10s ease-in-out infinite", "drift-c 12s ease-in-out infinite", "drift-a 8s ease-in-out infinite"],
  ["drift-c 14s ease-in-out infinite", "drift-a 16s ease-in-out infinite", "drift-b 12s ease-in-out infinite"],
  ["drift-a 15s ease-in-out infinite", "drift-b 18s ease-in-out infinite", "drift-c 13s ease-in-out infinite"],
];

// Satellite orbit params: [startAngleDeg, radiusPx, durationS]
const SAT_PARAMS = [
  [0, 48, 5], [180, 60, 7],
  [90, 44, 4], [270, 54, 6],
  [45, 56, 3.5], [135, 64, 5.5],
  [315, 70, 7], [225, 52, 6],
  [30, 68, 4.5], [210, 58, 5],
  [120, 72, 6.5], [300, 50, 4],
  [60, 66, 5.5], [240, 62, 7],
];

export default function TransformationTimeline({ lang }: TransformationTimelineProps) {
  const t = getT(lang);
  const stages = t.timeline.stages;
  const [active, setActive] = useState<number>(0);
  const [prevActive, setPrevActive] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleMobile, setVisibleMobile] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const navLock = useRef(false);

  useEffect(() => {
    const el = mobileRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleMobile(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activate = (i: number) => {
    if (i === active || isTransitioning) return;
    setIsTransitioning(true);
    setPrevActive(active);
    setFade(false);
    setTimeout(() => {
      setActive(i);
      setFade(true);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 200);
  };

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + stages.length) % stages.length);
  }, [stages.length]);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % stages.length);
  }, [stages.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
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

  const activeStage = stages[active];

  const getOrbMargin = (i: number) => {
    if (active === i) return 0;
    if (Math.abs(active - i) === 1) return 12;
    return 0;
  };

  return (
    <section style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: 640, marginBottom: 48 }}>
          <p
            className="t-caption"
            style={{
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 16,
            }}
          >
            {t.timeline.eyebrow}
          </p>
          <h2
            className="t-display"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            {t.timeline.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
            }}
          >
            {t.timeline.description}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#f5f3f1",
            borderRadius: 24,
            padding: "clamp(20px, 3vw, 32px) clamp(24px, 4vw, 48px)",
            position: "relative",
            boxShadow: "inset 0 0 0 0.5px rgba(26,22,22,0.1)",
            overflow: "hidden",
          }}
        >
          {/* AVANT / APRES */}
          <div className="timeline-divider">
            <span className="timeline-divider-label">{t.timeline.dividerLeft}</span>
            <div className="timeline-divider-line" />
            <span className="timeline-divider-label">{t.timeline.dividerRight}</span>
          </div>

          {/* Measurement bar */}
          <div className="measurement-bar">
            <div className="measurement-track" />
            <div
              className="measurement-progress"
              style={{ width: `${(active / 6) * 100}%` }}
            />
            <div
              ref={rowRef}
              className="measurement-ticks"
            >
              {stages.map((_, i) => {
                const tickColor = i === active ? "#1A1616" : i < 5 ? "#B0A090" : "#14B8A6";
                const isPassed = i <= active;
                return (
                  <div key={i} className="tick-wrapper">
                    <span className={`tick-number ${i === active ? "tick-active" : ""}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => activate(i)}
                      aria-label={`${stages[i].label}, ${stages[i].title}`}
                      className={`tick-mark ${isPassed ? "tick-passed" : ""} ${i === active ? "tick-current" : ""}`}
                      style={{ background: i === active ? "#1A1616" : tickColor }}
                      data-passed={isPassed}
                      data-tickcolor={tickColor}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop orb row */}
          <div className="orb-row">
            {/* Wave lines behind orbs */}
            <div className="wave-container">
              <svg className="wave-svg" viewBox="0 0 1200 260" preserveAspectRatio="none">
                <path d="M0,65 Q150,45 300,65 T600,65 T900,65 T1200,65" fill="none" stroke="rgba(26,22,22,0.18)" strokeWidth="1.5" />
                <path d="M0,130 Q150,110 300,130 T600,130 T900,130 T1200,130" fill="none" stroke="rgba(26,22,22,0.14)" strokeWidth="1.5" />
                <path d="M0,195 Q150,175 300,195 T600,195 T900,195 T1200,195" fill="none" stroke="rgba(26,22,22,0.10)" strokeWidth="1.5" />
              </svg>
            </div>

            {stages.map((stage, i) => {
              const isActive = i === active;
              const wasActive = i === prevActive && isTransitioning;
              
              let scale = 1;
              let scaleTransition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
              if (isActive && !isTransitioning) {
                scale = 1.35;
              } else if (isActive && isTransitioning) {
                scale = 1.35;
                scaleTransition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s";
              } else if (wasActive) {
                scale = 1;
                scaleTransition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
              }
              
              const zIndex = isActive ? 10 : 1;
              const config = ORB_CONFIGS[i];
              const size = ORB_SIZES[i];
              const margin = getOrbMargin(i);
              const driftAnims = BLOB_DRIFTS[i];
              const sat1Params = SAT_PARAMS[i * 2] || SAT_PARAMS[0];
              const sat2Params = SAT_PARAMS[i * 2 + 1] || SAT_PARAMS[1];

              return (
                <div
                  key={i}
                  className="orb-column"
                  style={{
                    zIndex,
                    transition: "margin 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    marginLeft: margin,
                    marginRight: margin,
                  }}
                  onClick={() => activate(i)}
                >
                  {/* Float wrapper */}
                  <div
                    className={`float-orb float-delay-${i}`}
                    style={{
                      position: "relative",
                      width: size,
                      height: size,
                      marginBottom: isActive ? Math.round(size * 0.35) + 8 : 8,
                      transition: "margin-bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    {/* Outer ring (active only) */}
                    {isActive && (
                      <div
                        className="orb-ring"
                        style={{
                          opacity: isTransitioning && wasActive ? 0 : 1,
                        }}
                      />
                    )}
                    
                    {/* Scale wrapper */}
                    <div
                      className={isTransitioning && isActive ? "orb-pulse" : undefined}
                      style={{
                        position: "absolute",
                        inset: 0,
                        transition: scaleTransition,
                        transform: `scale(${scale})`,
                        transformOrigin: "center top",
                      }}
                    >
                      {/* Satellite 1 */}
                      <div
                        className="satellite"
                        style={{
                          background: config.satColors[0],
                          width: 10,
                          height: 10,
                          marginTop: -5,
                          marginLeft: -5,
                          animation: `orbit ${sat1Params[2]}s linear infinite`,
                          ['--orbit-r' as string]: `${sat1Params[1]}px`,
                          ['--orbit-a' as string]: `${sat1Params[0]}deg`,
                        }}
                      />
                      {/* Satellite 2 */}
                      <div
                        className="satellite"
                        style={{
                          background: config.satColors[1] || config.satColors[0],
                          width: 8,
                          height: 8,
                          marginTop: -4,
                          marginLeft: -4,
                          animation: `orbit ${sat2Params[2]}s linear infinite`,
                          ['--orbit-r' as string]: `${sat2Params[1]}px`,
                          ['--orbit-a' as string]: `${sat2Params[0]}deg`,
                        }}
                      />

                      {/* Main orb */}
                      <div
                        className={`atmosphere-orb orb-${i + 1} ${isActive ? "orb-active" : ""}`}
                        style={{
                          background: config.base,
                          boxShadow: isActive
                            ? `inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 40px ${config.blobs[0].c}70, 0 0 80px ${config.blobs[1].c}40`
                            : `inset 0 0 0 1px rgba(255,255,255,0.1)`,
                        }}
                      >
                        {config.blobs.map((blob, bi) => (
                          <div
                            key={bi}
                            className="orb-blob"
                            style={{
                              width: `${blob.s}%`,
                              height: `${blob.s}%`,
                              background: blob.c,
                              top: `${blob.y + 50}%`,
                              left: `${blob.x + 50}%`,
                              animation: driftAnims[bi],
                            }}
                          />
                        ))}
                        {/* Noise */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: "60px 60px",
                            opacity: 0.15,
                            mixBlendMode: "overlay",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={`orb-label ${isActive ? "orb-label-active" : ""}`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile orb swiper (hidden on desktop) */}
          <div
            ref={mobileRef}
            className={`mobile-timeline-swiper ${visibleMobile ? "mobile-timeline-visible" : ""}`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Pagination dots */}
            <div className="mobile-timeline-dots">
              {stages.map((_, i) => (
                <button
                  key={i}
                  className={`mobile-timeline-dot ${i === active ? "mobile-timeline-dot-active" : ""}`}
                  onClick={() => activate(i)}
                  aria-label={`${stages[i].label}`}
                />
              ))}
            </div>

            {/* 3-up orb stage with chevrons */}
            <div className="mobile-timeline-stage">
              {/* Prev chevron */}
              <button
                className="mobile-timeline-chevron"
                onClick={handlePrev}
                aria-label="Précédent"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="#1A1616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Orb container */}
              <div className="mobile-timeline-orb-container">
                {/* Prev orb */}
                {(() => {
                  const idx = (active - 1 + stages.length) % stages.length;
                  const config = ORB_CONFIGS[idx];
                  const driftAnims = BLOB_DRIFTS[idx];
                  const sat1Params = SAT_PARAMS[idx * 2] || SAT_PARAMS[0];
                  const sat2Params = SAT_PARAMS[idx * 2 + 1] || SAT_PARAMS[1];
                  const size = ORB_SIZES[idx];
                  return (
                    <div className="mobile-timeline-side-orb mobile-timeline-orb-prev">
                      <div className="float-orb float-delay-1" style={{ position: "relative", width: size, height: size }}>
                        <div
                          className="satellite"
                          style={{
                            background: config.satColors[0],
                            width: 10,
                            height: 10,
                            marginTop: -5,
                            marginLeft: -5,
                            animation: `orbit ${sat1Params[2]}s linear infinite`,
                            ['--orbit-r' as string]: `${sat1Params[1]}px`,
                            ['--orbit-a' as string]: `${sat1Params[0]}deg`,
                          }}
                        />
                        <div
                          className="satellite"
                          style={{
                            background: config.satColors[1] || config.satColors[0],
                            width: 8,
                            height: 8,
                            marginTop: -4,
                            marginLeft: -4,
                            animation: `orbit ${sat2Params[2]}s linear infinite`,
                            ['--orbit-r' as string]: `${sat2Params[1]}px`,
                            ['--orbit-a' as string]: `${sat2Params[0]}deg`,
                          }}
                        />
                        <div className="atmosphere-orb" style={{ background: config.base }}>
                          {config.blobs.map((blob, bi) => (
                            <div
                              key={bi}
                              className="orb-blob"
                              style={{
                                width: `${blob.s}%`,
                                height: `${blob.s}%`,
                                background: blob.c,
                                top: `${blob.y + 50}%`,
                                left: `${blob.x + 50}%`,
                                animation: driftAnims[bi],
                              }}
                            />
                          ))}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: "50%",
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                              backgroundSize: "60px 60px",
                              opacity: 0.15,
                              mixBlendMode: "overlay",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Current orb */}
                {(() => {
                  const idx = active;
                  const config = ORB_CONFIGS[idx];
                  const driftAnims = BLOB_DRIFTS[idx];
                  const sat1Params = SAT_PARAMS[idx * 2] || SAT_PARAMS[0];
                  const sat2Params = SAT_PARAMS[idx * 2 + 1] || SAT_PARAMS[1];
                  const size = ORB_SIZES[idx];
                  return (
                    <div className="mobile-timeline-center-orb">
                      <div className="float-orb float-delay-0" style={{ position: "relative", width: size, height: size }}>
                        <div className="orb-ring" style={{ opacity: 1 }} />
                        <div style={{ position: "absolute", inset: 0, transform: "scale(1.2)", transformOrigin: "center top" }}>
                          <div
                            className="satellite"
                            style={{
                              background: config.satColors[0],
                              width: 10,
                              height: 10,
                              marginTop: -5,
                              marginLeft: -5,
                              animation: `orbit ${sat1Params[2]}s linear infinite`,
                              ['--orbit-r' as string]: `${sat1Params[1]}px`,
                              ['--orbit-a' as string]: `${sat1Params[0]}deg`,
                            }}
                          />
                          <div
                            className="satellite"
                            style={{
                              background: config.satColors[1] || config.satColors[0],
                              width: 8,
                              height: 8,
                              marginTop: -4,
                              marginLeft: -4,
                              animation: `orbit ${sat2Params[2]}s linear infinite`,
                              ['--orbit-r' as string]: `${sat2Params[1]}px`,
                              ['--orbit-a' as string]: `${sat2Params[0]}deg`,
                            }}
                          />
                          <div
                            className="atmosphere-orb orb-active"
                            style={{
                              background: config.base,
                              boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 40px ${config.blobs[0].c}70, 0 0 80px ${config.blobs[1].c}40`,
                            }}
                          >
                            {config.blobs.map((blob, bi) => (
                              <div
                                key={bi}
                                className="orb-blob"
                                style={{
                                  width: `${blob.s}%`,
                                  height: `${blob.s}%`,
                                  background: blob.c,
                                  top: `${blob.y + 50}%`,
                                  left: `${blob.x + 50}%`,
                                  animation: driftAnims[bi],
                                }}
                              />
                            ))}
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "50%",
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                                backgroundSize: "60px 60px",
                                opacity: 0.15,
                                mixBlendMode: "overlay",
                                pointerEvents: "none",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <span className="orb-label orb-label-active" style={{ marginTop: 20, display: "block" }}>
                        {stages[idx].label}
                      </span>
                    </div>
                  );
                })()}

                {/* Next orb */}
                {(() => {
                  const idx = (active + 1) % stages.length;
                  const config = ORB_CONFIGS[idx];
                  const driftAnims = BLOB_DRIFTS[idx];
                  const sat1Params = SAT_PARAMS[idx * 2] || SAT_PARAMS[0];
                  const sat2Params = SAT_PARAMS[idx * 2 + 1] || SAT_PARAMS[1];
                  const size = ORB_SIZES[idx];
                  return (
                    <div className="mobile-timeline-side-orb mobile-timeline-orb-next">
                      <div className="float-orb float-delay-2" style={{ position: "relative", width: size, height: size }}>
                        <div
                          className="satellite"
                          style={{
                            background: config.satColors[0],
                            width: 10,
                            height: 10,
                            marginTop: -5,
                            marginLeft: -5,
                            animation: `orbit ${sat1Params[2]}s linear infinite`,
                            ['--orbit-r' as string]: `${sat1Params[1]}px`,
                            ['--orbit-a' as string]: `${sat1Params[0]}deg`,
                          }}
                        />
                        <div
                          className="satellite"
                          style={{
                            background: config.satColors[1] || config.satColors[0],
                            width: 8,
                            height: 8,
                            marginTop: -4,
                            marginLeft: -4,
                            animation: `orbit ${sat2Params[2]}s linear infinite`,
                            ['--orbit-r' as string]: `${sat2Params[1]}px`,
                            ['--orbit-a' as string]: `${sat2Params[0]}deg`,
                          }}
                        />
                        <div className="atmosphere-orb" style={{ background: config.base }}>
                          {config.blobs.map((blob, bi) => (
                            <div
                              key={bi}
                              className="orb-blob"
                              style={{
                                width: `${blob.s}%`,
                                height: `${blob.s}%`,
                                background: blob.c,
                                top: `${blob.y + 50}%`,
                                left: `${blob.x + 50}%`,
                                animation: driftAnims[bi],
                              }}
                            />
                          ))}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: "50%",
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                              backgroundSize: "60px 60px",
                              opacity: 0.15,
                              mixBlendMode: "overlay",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Next chevron */}
              <button
                className="mobile-timeline-chevron"
                onClick={handleNext}
                aria-label="Suivant"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="#1A1616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Divider line */}
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(26,22,22,0.1)",
              marginTop: 8,
              marginBottom: 12,
            }}
          />

          {/* Stage text panel */}
          <div
            style={{
              maxWidth: 560,
              height: 180,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              opacity: fade ? 1 : 0,
              transform: fade ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 300,
                color: "#1A1616",
                margin: "0 0 16px",
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
              }}
            >
              {activeStage.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 300,
                color: "#3A3A3A",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {activeStage.desc}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* --- Layout classes --- */
        .timeline-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 16px;
        }
        .timeline-divider-label {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          color: #8A7D70;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0 16px;
        }
        .timeline-divider-line {
          width: 1px;
          height: 24px;
          background: rgba(26,22,22,0.1);
        }

        .measurement-bar {
          position: relative;
          height: 14px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
        .measurement-track {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: rgba(26,22,22,0.06);
          transform: translateY(-50%);
        }
        .measurement-progress {
          position: absolute;
          left: 0;
          top: 50%;
          height: 1px;
          background: rgba(26,22,22,0.12);
          transform: translateY(-50%);
          transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 1;
        }
        .measurement-ticks {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 2;
        }
        .tick-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .tick-number {
          font-family: var(--font-sans);
          font-size: 10px;
          color: #8A7D70;
          letter-spacing: 0.08em;
          font-weight: 400;
          transition: color 0.3s ease;
          margin-bottom: 6px;
        }
        .tick-number.tick-active {
          color: #1A1616;
          font-weight: 500;
        }
        .tick-mark {
          width: 1px;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 340ms cubic-bezier(0.34, 1.18, 0.64, 1);
          flex-shrink: 0;
          height: 6px;
        }
        .tick-mark.tick-passed {
          height: 10px;
        }
        .tick-mark.tick-current {
          height: 16px;
        }
        .tick-mark:hover:not(.tick-current) {
          height: 12px !important;
        }

        .orb-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          position: relative;
          min-height: 260px;
          padding: 10px 0;
        }

        /* --- Wave lines --- */
        .wave-container {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .wave-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.55;
        }

        /* --- Orb column & hover --- */
        .orb-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          cursor: pointer;
          flex-shrink: 0;
        }
        .orb-column:hover .satellite {
          opacity: 0.9;
        }
        .orb-column:hover .atmosphere-orb:not(.orb-active) {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 20px rgba(255,255,255,0.1);
        }
        .orb-column:hover .orb-label:not(.orb-label-active) {
          color: #6A5D50;
        }

        /* --- Orb label --- */
        .orb-label {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 400;
          color: #8A7D70;
          letter-spacing: 0.02em;
          text-align: center;
          transition: color 0.3s ease, font-weight 0.3s ease;
          line-height: 1.3;
          cursor: pointer;
        }
        .orb-label-active {
          font-weight: 600;
          color: #1A1616;
        }

        /* --- Orb ring --- */
        .orb-ring {
          position: absolute;
          inset: -25%;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.25);
          transition: opacity 0.3s ease, transform 0.4s ease;
          pointer-events: none;
        }

        /* --- Satellite --- */
        .satellite {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          z-index: 2;
          transition: opacity 0.3s ease;
          opacity: 0.55;
        }

        /* --- Atmosphere orb --- */
        .atmosphere-orb {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
          z-index: 3;
        }
        .orb-active {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 40px rgba(255,255,255,0.2), 0 0 80px rgba(255,255,255,0.1);
        }

        /* --- Orb blob --- */
        .orb-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(20px);
          transform: translate(-50%, -50%);
        }

        /* --- Float animation --- */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .float-orb {
          animation: float 6s ease-in-out infinite;
        }
        .float-delay-0 { animation-delay: 0s; }
        .float-delay-1 { animation-delay: 0.7s; }
        .float-delay-2 { animation-delay: 1.4s; }
        .float-delay-3 { animation-delay: 2.1s; }
        .float-delay-4 { animation-delay: 2.8s; }
        .float-delay-5 { animation-delay: 3.5s; }
        .float-delay-6 { animation-delay: 4.2s; }

        /* --- Pulse on activation --- */
        @keyframes orbPulse {
          0% { transform: scale(1.0); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1.35); }
        }
        .orb-pulse {
          animation: orbPulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* --- Consolidated blob drift patterns (3 instead of 21) --- */
        @keyframes drift-a {
          0%, 100% { transform: translate(-50%, -50%) translate(-12px, -8px); }
          50% { transform: translate(-50%, -50%) translate(8px, 4px); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(-50%, -50%) translate(8px, 12px); }
          33% { transform: translate(-50%, -50%) translate(-4px, 8px); }
          66% { transform: translate(-50%, -50%) translate(12px, -4px); }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          25% { transform: translate(-50%, -50%) scale(1.08) translate(-4px, -4px); }
          50% { transform: translate(-50%, -50%) scale(0.96) translate(4px, 4px); }
          75% { transform: translate(-50%, -50%) scale(1.04) translate(-2px, 2px); }
        }

        /* --- Consolidated satellite orbit (1 instead of 7) --- */
        @keyframes orbit {
          0% { transform: translate(-50%, -50%) rotate(var(--orbit-a)) translateX(var(--orbit-r)) rotate(calc(var(--orbit-a) * -1)); }
          100% { transform: translate(-50%, -50%) rotate(calc(var(--orbit-a) + 360deg)) translateX(var(--orbit-r)) rotate(calc(var(--orbit-a) * -1 - 360deg)); }
        }

        /* --- Mobile timeline swiper (hidden on desktop) --- */
        .mobile-timeline-swiper {
          display: none;
        }

        @media (max-width: 768px) {
          .orb-row {
            display: none;
          }
          .measurement-bar {
            display: none;
          }
          .mobile-timeline-swiper {
            display: block;
            padding: 24px 0 8px;
            touch-action: pan-y;
            opacity: 0;
            transform: translateX(40px);
            transition: opacity 0.6s ease, transform 0.6s ease;
          }
          .mobile-timeline-swiper.mobile-timeline-visible {
            opacity: 1;
            transform: translateX(0);
          }
          .mobile-timeline-dots {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-bottom: 28px;
          }
          .mobile-timeline-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: none;
            padding: 0;
            background: rgba(26,22,22,0.15);
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
          }
          .mobile-timeline-dot-active {
            background: #1A1616;
            transform: scale(1.2);
          }
          .mobile-timeline-stage {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            position: relative;
            min-height: 280px;
          }
          .mobile-timeline-chevron {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background: rgba(0,0,0,0.04);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            z-index: 20;
            transition: background 0.2s ease;
            padding: 0;
          }
          .mobile-timeline-chevron:active {
            background: rgba(0,0,0,0.1);
          }
          .mobile-timeline-orb-container {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            flex: 1;
            min-height: 260px;
            max-width: 320px;
          }
          .mobile-timeline-center-orb {
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 10;
            position: relative;
          }
          .mobile-timeline-side-orb {
            position: absolute;
            top: 50%;
            transform: translateY(-50%) scale(0.55);
            opacity: 0.4;
            z-index: 1;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .mobile-timeline-orb-prev {
            left: -5%;
          }
          .mobile-timeline-orb-next {
            right: -5%;
          }
          .wave-container {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
