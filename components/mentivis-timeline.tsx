"use client";

import { useState } from "react";
import { getT, Locale } from "@/lib/i18n";

interface MentivisTimelineProps {
  lang: Locale;
}

const N = 8;

const TICK_BG =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 9 9\'%3E%3Crect width=\'0.5\' height=\'9\' fill=\'%231A1616\' opacity=\'0.15\'/%3E%3Crect width=\'0.5\' x=\'8.5\' height=\'9\' fill=\'%231A1616\' opacity=\'0.15\'/%3E%3C/svg%3E") center top / 9px 9px';

export default function MentivisTimeline({ lang }: MentivisTimelineProps) {
  const t = getT(lang);
  const events = t.timeline.events;
  const [current, setCurrent] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);

  const navigate = (delta: number): void => {
    const next = current + delta;
    if (next < 0 || next >= N) return;
    setFade(false);
    setTimeout(() => {
      setCurrent(next);
      setFade(true);
    }, 160);
  };

  const jumpTo = (i: number): void => {
    if (i === current) return;
    setFade(false);
    setTimeout(() => {
      setCurrent(i);
      setFade(true);
    }, 160);
  };

  const aboveStyle: React.CSSProperties = {
    opacity: fade ? 1 : 0,
    transform: fade ? "translateY(0)" : "translateY(-5px)",
    transition: "opacity 160ms ease, transform 160ms ease",
  };

  const belowStyle: React.CSSProperties = {
    opacity: fade ? 1 : 0,
    transform: fade ? "translateY(0)" : "translateY(5px)",
    transition: "opacity 160ms ease, transform 160ms ease",
  };

  return (
    <section style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        <p
          className="t-caption"
          style={{
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 12,
          }}
        >
          {t.timeline.eyebrow}
        </p>
        <div
          style={{
            background: "#f5f3f1",
            borderRadius: 24,
            padding: "3.25rem 2rem 2.75rem",
            minHeight: "27rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            position: "relative",
            boxShadow: "inset 0 0 0 0.5px rgba(26,22,22,0.1)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <div style={{ ...aboveStyle, textAlign: "center", minHeight: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.35rem",
                fontWeight: 600,
                color: "#1A1616",
                margin: 0,
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
              }}
            >
              {events[current].title}
            </h3>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              width: "100%",
              maxWidth: "50rem",
            }}
          >
            <button
              onClick={() => navigate(-1)}
              disabled={current === 0}
              aria-label={lang === "fr" ? "Précédent" : "Previous"}
              style={{
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: "50%",
                border: "none",
                background: "#ffffff",
                boxShadow: "0 0 0 1px rgba(26,22,22,0.08), 0 1px 2px rgba(26,22,22,0.05)",
                cursor: current === 0 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A1616",
                transition: "background 180ms ease, color 180ms ease, opacity 180ms ease",
                opacity: current === 0 ? 0.25 : 1,
              }}
              onMouseEnter={(e) => {
                if (current !== 0) {
                  (e.currentTarget as HTMLButtonElement).style.background = "#1A1616";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f5f3f1";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                (e.currentTarget as HTMLButtonElement).style.color = "#1A1616";
              }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" d="M10 4 6 8l4 4" />
              </svg>
            </button>

            <div style={{ flex: 1, position: "relative", height: 9, overflow: "visible" }}>
              <div style={{ position: "absolute", inset: 0, background: TICK_BG }} />
              {events.map((e, i) => (
                <button
                  key={i}
                  onClick={() => jumpTo(i)}
                  aria-label={`${e.title}, ${e.date}`}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${(i / (N - 1)) * 100}%`,
                    width: 1,
                    height: 9,
                    marginTop: -4.5,
                    background: "#1A1616",
                    border: "none",
                    padding: 0,
                    cursor: i === current ? "default" : "pointer",
                    transformOrigin: "center center",
                    transform: i === current ? "translateX(-50%) scaleY(14)" : "translateX(-50%) scaleY(1)",
                    opacity: i === current ? 1 : 0.3,
                    transition: "transform 340ms cubic-bezier(0.34, 1.18, 0.64, 1), opacity 220ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (i !== current) {
                      (e.currentTarget as HTMLButtonElement).style.opacity = "0.65";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateX(-50%) scaleY(3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (i !== current) {
                      (e.currentTarget as HTMLButtonElement).style.opacity = "0.3";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateX(-50%) scaleY(1)";
                    }
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(1)}
              disabled={current === N - 1}
              aria-label={lang === "fr" ? "Suivant" : "Next"}
              style={{
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: "50%",
                border: "none",
                background: "#ffffff",
                boxShadow: "0 0 0 1px rgba(26,22,22,0.08), 0 1px 2px rgba(26,22,22,0.05)",
                cursor: current === N - 1 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A1616",
                transition: "background 180ms ease, color 180ms ease, opacity 180ms ease",
                opacity: current === N - 1 ? 0.25 : 1,
              }}
              onMouseEnter={(e) => {
                if (current !== N - 1) {
                  (e.currentTarget as HTMLButtonElement).style.background = "#1A1616";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f5f3f1";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                (e.currentTarget as HTMLButtonElement).style.color = "#1A1616";
              }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" d="m6 12 4-4-4-4" />
              </svg>
            </button>
          </div>

          <div
            style={{
              ...belowStyle,
              textAlign: "center",
              maxWidth: "32rem",
              minHeight: "5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                fontWeight: 300,
                color: "#1A1616",
                lineHeight: 1.65,
                margin: "0 0 0.65rem",
              }}
            >
              {events[current].desc}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                fontWeight: 500,
                color: "#8A7D70",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {events[current].date}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
