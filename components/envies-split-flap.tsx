"use client";

import { useState, useEffect, useRef } from "react";

const FLIP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ ÉÈÀÂÊÙÎÔ";
const ROTATION_INTERVAL_MS = 2800;
const LETTER_STAGGER_MS = 30;
const FLIP_STEP_MS = 50;
const FLIP_MIN_STEPS = 5;
const FLIP_MAX_EXTRA_STEPS = 3;

export default function EnviesSplitFlap() {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const wordRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const rotRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spansRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    fetch("/envies.txt")
      .then((r) => r.text())
      .then((text) => {
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
        setItems(lines);
        if (lines.length > 0) buildSpans(lines[0]);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  function buildSpans(word: string) {
    const container = wordRef.current;
    if (!container) return;
    container.innerHTML = "";
    spansRef.current = [];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < word.length; i++) {
      const isSpace = word[i] === " ";
      const span = document.createElement("span");
      span.style.cssText = `
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
        width:${isSpace ? 10 : 24}px;
        height:34px;
        background:#f5f5f5;
        border:0.5px solid #e0e0e0;
        border-radius:4px;
        overflow:hidden;
        font-family:var(--font-sans);
        font-size:18px;
        font-weight:500;
        color:#1a1a1a;
        text-transform:uppercase;
      `;
      const divider = document.createElement("span");
      divider.style.cssText = `
        position:absolute;left:0;right:0;top:50%;height:1px;
        background:#e0e0e0;transform:translateY(-0.5px);
      `;
      span.appendChild(divider);
      frag.appendChild(span);
      spansRef.current.push(span);
    }
    container.appendChild(frag);
  }

  function flipTo(word: string) {
    const letterCount = word.length;
    const currentSpanCount = spansRef.current.length;

    if (letterCount !== currentSpanCount) buildSpans(word);

    for (let i = 0; i < letterCount; i++) {
      const char = word[i];
      const span = spansRef.current[i];
      if (!span) continue;
      const totalSteps = FLIP_MIN_STEPS + Math.floor(Math.random() * FLIP_MAX_EXTRA_STEPS);
      let step = 0;
      setTimeout(() => {
        span.textContent = "";
        const timer = setInterval(() => {
          if (step < totalSteps - 1) {
            span.textContent = FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)];
            span.style.transform = "scaleY(0.85)";
            setTimeout(() => { span.style.transform = "scaleY(1)"; }, 30);
          } else {
            clearInterval(timer);
            span.textContent = char === " " ? "" : char;
          }
          step++;
        }, FLIP_STEP_MS);
      }, i * LETTER_STAGGER_MS);
    }
  }

  useEffect(() => {
    if (items.length === 0) return;
    rotRef.current = setInterval(() => {
      let next = Math.floor(Math.random() * items.length);
      if (next === indexRef.current && items.length > 1) next = (next + 1) % items.length;
      indexRef.current = next;
      flipTo(items[next]);
    }, ROTATION_INTERVAL_MS);
    return () => { if (rotRef.current) clearInterval(rotRef.current); };
  }, [items]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
        marginBottom: 32,
        maxWidth: 720,
        minHeight: ready ? "auto" : 34,
        opacity: ready ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          fontWeight: 500,
          color: "#4e4e4e",
          whiteSpace: "nowrap",
        }}
      >
        Les envies :
      </span>
      <div ref={wordRef} style={{ display: "flex", gap: 3 }} />
    </div>
  );
}
