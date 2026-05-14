"use client";

import { useRef, useState, useCallback } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

interface Chapter {
  id: number;
  label: string;
  thumbnail?: string;
  startTime?: number;
}

const CHAPTERS: Record<Locale, Chapter[]> = {
  fr: [
    { id: 0, label: "Définir" },
    { id: 1, label: "Générer" },
    { id: 2, label: "Former" },
    { id: 3, label: "Évaluer" },
    { id: 4, label: "Certifier" },
    { id: 5, label: "Analyser" },
  ],
  en: [
    { id: 0, label: "Define" },
    { id: 1, label: "Generate" },
    { id: 2, label: "Train" },
    { id: 3, label: "Assess" },
    { id: 4, label: "Certify" },
    { id: 5, label: "Analyze" },
  ],
};

interface VideoPlayerProps {
  lang: Locale;
  videoSrc?: string;
}

export default function VideoPlayer({ lang, videoSrc = "/videos/marseille-drone.mp4" }: VideoPlayerProps) {
  const chapters = CHAPTERS[lang === "fr" ? "fr" : "en"];
  const [playing, setPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying((p) => !p);
  }, [playing]);

  const handleChapterClick = (i: number) => {
    if (!videoRef.current) return;
    setActiveChapter(i);
    const chapter = chapters[i];
    if (chapter?.startTime !== undefined) {
      videoRef.current.currentTime = chapter.startTime;
    }
    const pct = (i / (chapters.length - 1)) * 100;
    setProgress(pct);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted((m) => !m);
  };

  return (
    <div
      className="video-player"
      style={{
        position: "relative",
        borderRadius: 32,
        overflow: "hidden",
        aspectRatio: "16/9",
        background: "#0a0a0a",
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoSrc || ""}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        onClick={handlePlay}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        {/* Bottom-left: Play button — circular glass, icon only */}
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
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            borderRadius: 999,
            cursor: "pointer",
            pointerEvents: "auto",
            transition: "background 0.2s ease",
            border: "none",
          }}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Bottom-center: Thumbnail rail */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            pointerEvents: "auto",
          }}
        >
          {chapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => handleChapterClick(i)}
              style={{
                width: 72,
                height: 48,
                borderRadius: 12,
                overflow: "hidden",
                border: activeChapter === i ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0)",
                opacity: activeChapter === i ? 1 : 0.6,
                background: "#1a1a2e",
                cursor: "pointer",
                transition: "all 0.2s ease",
                padding: 0,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: ch.thumbnail
                    ? `url(${ch.thumbnail}) center/cover no-repeat`
                    : "linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%)",
                }}
              >
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 600, textAlign: "center" }}>
                  {ch.thumbnail ? "" : ch.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Top-right: Volume button */}
        <button
          onClick={handleMute}
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            width: 48,
            height: 48,
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            pointerEvents: "auto",
            transition: "background 0.2s ease",
          }}
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          )}
        </button>
      </div>

      <style>{`
        .video-player:hover button.play-btn {
          background: rgba(255,255,255,0.18);
        }
      `}</style>
    </div>
  );
}

interface LearningOSPipelineProps {
  lang: Locale;
}

export function LearningOSPipeline({ lang }: LearningOSPipelineProps) {
  const { ref, visible } = useVisible(0.05);

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
            color: "#777169",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontWeight: 500,
            fontSize: 11,
          }}
        >
          {lang === "fr" ? "PARCOURS COMPLET" : "COMPLETE JOURNEY"}
        </p>
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 48,
            maxWidth: 700,
          }}
        >
          {lang === "fr" ? "Du besoin à la certification, un seul flux." : "From need to certification, a single flow."}
        </h2>

        {/* Video player — full content column width */}
        <div
          style={{
            ...sectionAnim(visible, 0.1),
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 clamp(16px, 3vw, 40px)",
          }}
        >
          <VideoPlayer lang={lang} />
        </div>

        {/* Steps below video */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginTop: 32,
            flexWrap: "wrap",
          }}
          className="learningos-pipeline-steps"
        >
          {(lang === "fr"
            ? [
                { label: "Définir", desc: "Compétences visées, métiers, référentiels internes." },
                { label: "Générer", desc: "Parcours personnalisés avec objectifs et modules." },
                { label: "Former", desc: "Agents IA accompagnent chaque apprenant." },
                { label: "Évaluer", desc: "Quiz, mises en situation, validation des acquis." },
                { label: "Certifier", desc: "Certifications et badges de compétences." },
                { label: "Analyser", desc: "Dashboard, reporting, conformité OPCO." },
              ]
            : [
                { label: "Define", desc: "Target skills, job roles, internal frameworks." },
                { label: "Generate", desc: "Personalized paths with objectives and modules." },
                { label: "Train", desc: "AI agents accompany each learner." },
                { label: "Assess", desc: "Quizzes, simulations, skills validation." },
                { label: "Certify", desc: "Certifications and skill badges." },
                { label: "Analyze", desc: "Dashboard, reporting, OPCO compliance." },
              ]
          ).map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "16px",
                position: "relative",
                borderTop: "2px solid #e5e5e5",
                transition: "border-color 0.3s ease",
              }}
              className="learningos-pipeline-step"
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#0A0A0A",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {i + 1}
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "#000" }}>{s.label}</h4>
                <p style={{ fontSize: 12, lineHeight: 1.5, color: "#777169", margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .learningos-pipeline-step:hover {
          border-top-color: #0A0A0A !important;
        }
      `}</style>
    </section>
  );
}