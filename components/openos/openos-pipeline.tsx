"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const CHAPTER_TIMES = [0, 31, 99, 143, 196, 215];

interface VideoPlayerProps {
  lang: string;
  activeChapter: number;
  seekVersion: number;
  onSeekChapter: (i: number) => void;
}

function VideoPlayer({ lang, activeChapter, seekVersion, onSeekChapter }: VideoPlayerProps) {
  const isEn = lang === "en";
  const [videoSrc, setVideoSrc] = useState(isEn ? "/videos/mOS-product-en-sm.mp4" : "/videos/mOS-720.mp4");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasSeeked = useRef(false);

  useEffect(() => {
    const conn = (navigator as any).connection;
    if (conn) {
      const isSlow = conn.downlink < 5 || ["slow-2g", "2g", "3g"].includes(conn.effectiveType);
      setVideoSrc(
        isSlow
          ? (isEn ? "/videos/mOS-product-en-sm.mp4" : "/videos/mOS-720.mp4")
          : (isEn ? "/videos/mOS-product-en.mp4" : "/videos/mOS-1080.mp4")
      );
    }
  }, []);

  const handlePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying((p) => !p);
  }, [playing]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    const isFs = !!(document.fullscreenElement || (video as any).webkitDisplayingFullscreen);
    if (isFs) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
    } else if (typeof (video as any).webkitEnterFullscreen === "function") {
      (video as any).webkitEnterFullscreen();
    } else {
      video.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onFsChange = () => {
      setFullscreen(!!(document.fullscreenElement || (video as any).webkitDisplayingFullscreen));
    };
    video.addEventListener("fullscreenchange", onFsChange);
    video.addEventListener("webkitfullscreenchange", onFsChange);
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      video.removeEventListener("fullscreenchange", onFsChange);
      video.removeEventListener("webkitfullscreenchange", onFsChange);
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!hasSeeked.current) { hasSeeked.current = true; return; }
    const t = CHAPTER_TIMES[activeChapter];
    if (t !== undefined) videoRef.current.currentTime = t;
    setPlaying(false);
  }, [activeChapter, seekVersion]);

  const progressRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleBarDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    seekFromEvent(e);
  };

  const seekFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * videoRef.current.duration;
    setProgress(ratio * 100);
  };

  useEffect(() => {
    const up = () => { isDragging.current = false; };
    const move = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      if (!progressRef.current || !videoRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const ratio = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      videoRef.current.currentTime = ratio * videoRef.current.duration;
      setProgress(ratio * 100);
    };
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="video-player"
      style={{
        position: "relative",
        borderRadius: 32,
        overflow: "hidden",
        aspectRatio: "16/9",
        background: "#0a0a0a",
      }}
      onDoubleClick={handleFullscreen}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        preload="metadata"
        playsInline
        poster="/images/LearningOS/thumb-product.webp"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        onClick={handlePlay}
      />

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <button
          onClick={handlePlay}
          style={{
            position: "absolute",
            bottom: 28,
            left: 28,
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(12px)",
            borderRadius: 999,
            cursor: "pointer",
            pointerEvents: "auto",
            transition: "background 0.2s ease",
            border: "none",
          }}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <button
          onClick={handleFullscreen}
          style={{
            position: "absolute",
            bottom: 28,
            right: 28,
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(12px)",
            borderRadius: 999,
            cursor: "pointer",
            pointerEvents: "auto",
            transition: "background 0.2s ease",
            border: "none",
          }}
        >
          {fullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 8 4 4 8 4" />
              <polyline points="16 4 20 4 20 8" />
              <polyline points="20 16 20 20 16 20" />
              <polyline points="8 20 4 20 4 16" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          )}
        </button>
      </div>

      <div
        ref={progressRef}
        onMouseDown={handleBarDown}
        onTouchStart={handleBarDown}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "rgba(255,255,255,0.15)",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "#fff",
            borderRadius: "0 2px 2px 0",
            transition: "width 0.1s linear",
            position: "relative",
          }}
        />
        {CHAPTER_TIMES.map((t, i) => {
          const left = duration ? (t / duration) * 100 : (i / (CHAPTER_TIMES.length - 1)) * 100;
          return (
            <div
              key={i}
              onClick={(e) => { e.stopPropagation(); onSeekChapter(i); }}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: "50%",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === activeChapter ? "#fff" : "rgba(255,255,255,0.4)",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                pointerEvents: "auto",
                transition: "background 0.2s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

const STEPS_FR = [
  { label: "Définir", desc: "Compétences visées, métiers, référentiels internes." },
  { label: "Générer", desc: "Parcours personnalisés avec objectifs et modules." },
  { label: "Former", desc: "Agents IA accompagnent chaque apprenant." },
  { label: "Évaluer", desc: "Quiz, mises en situation, validation des acquis." },
  { label: "Certifier", desc: "Certifications et badges de compétences." },
  { label: "Analyser", desc: "Dashboard, reporting, conformité OPCO." },
];

const STEPS_EN = [
  { label: "Define", desc: "Target skills, job roles, internal frameworks." },
  { label: "Generate", desc: "Personalized paths with objectives and modules." },
  { label: "Train", desc: "AI agents accompany each learner." },
  { label: "Assess", desc: "Quizzes, simulations, skills validation." },
  { label: "Certify", desc: "Certifications and skill badges." },
  { label: "Analyze", desc: "Dashboard, reporting, OPCO compliance." },
];

export default function OpenOSPipeline({ lang }: { lang: string }) {
  const { ref, visible } = useVisible(0.05);
  const [activeChapter, setActiveChapter] = useState(0);
  const [seekVersion, setSeekVersion] = useState(0);

  const seekChapter = (i: number) => {
    setActiveChapter(i);
    setSeekVersion((v) => v + 1);
  };

  const steps = lang === "fr" ? STEPS_FR : STEPS_EN;

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(96px, 12vw, 160px) 0",
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p
          style={{
            ...sectionAnim(visible, 0),
            marginBottom: 12,
            color: "#4e4e4e",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontWeight: 500,
            fontSize: 11,
          }}
        >
          {lang === "fr" ? "PARCOURS COMPLET" : "COMPLETE PATH"}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 600 }}>
          {lang === "fr"
            ? "Voyez ce que ça donne, avant de commencer."
            : "See it in action before you start."}
        </h2>

        <div style={{ ...sectionAnim(visible, 0.1) }}>
          {visible && <VideoPlayer lang={lang} activeChapter={activeChapter} seekVersion={seekVersion} onSeekChapter={seekChapter} />}
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            marginTop: 32,
            flexWrap: "wrap",
          }}
          className="openos-pipeline-steps"
        >
          {steps.map((s, i) => (
            <div
              key={s.label}
              onClick={() => seekChapter(i)}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "16px",
                position: "relative",
                borderTop: i === activeChapter ? "2px solid #0A0A0A" : "2px solid #e5e5e5",
                transition: "border-color 0.3s ease",
                cursor: "pointer",
              }}
              className="openos-pipeline-step"
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: i === activeChapter ? "#0A0A0A" : "#e5e5e5",
                  color: i === activeChapter ? "#fff" : "#666",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 8,
                  transition: "background 0.3s ease, color 0.3s ease",
                }}
              >
                {i + 1}
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "#000" }}>{s.label}</h4>
                <p style={{ fontSize: 12, lineHeight: 1.5, color: "#4e4e4e", margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .openos-pipeline-step:hover {
          border-top-color: #0A0A0A !important;
        }
        .openos-pipeline-step:hover > div:first-child {
          background: #0A0A0A !important;
          color: #fff !important;
        }
      `}</style>
    </section>
  );
}
