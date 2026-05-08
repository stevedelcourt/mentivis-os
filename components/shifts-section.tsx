"use client";

import { useEffect, useRef, useState } from "react";
import { getT, Locale } from "@/lib/i18n";

export default function ShiftsSection({ lang }: { lang: Locale }) {
  const t = getT(lang);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shifts = [t.shifts.shift1, t.shifts.shift2, t.shifts.shift3, t.shifts.shift4];

  return (
    <section
      ref={ref}
      style={{
        padding: "var(--section-gap) 0",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="container">
        <h2
          className="t-display"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            marginBottom: 48,
          }}
        >
          {t.shifts.title}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {shifts.map((shift, i) => (
            <div
              key={shift.number}
              style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.4s ${i * 50}ms ease, transform 0.4s ${i * 50}ms ease`,
              }}
            >
              <span
                className="t-caption"
                style={{
                  color: "var(--text-tertiary)",
                  fontWeight: 500,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                {shift.number}
              </span>
              <div>
                <h3
                  className="t-display"
                  style={{
                    fontSize: "var(--text-heading)",
                    marginBottom: 8,
                  }}
                >
                  {shift.title}
                </h3>
                <p className="t-caption" style={{ maxWidth: 640 }}>{shift.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
