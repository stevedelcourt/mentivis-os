"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useVisible } from "@/hooks/use-visible";

const FLIP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ ÉÈÀÂÊÙÎÔ";
const ROTATION_INTERVAL_MS = 2200;
const LETTER_STAGGER_MS = 35;
const FLIP_STEP_MS = 45;
const FLIP_MIN_STEPS = 6;
const FLIP_MAX_EXTRA_STEPS = 4;

export default function EnviesSplitFlap() {
  const [items, setItems] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [displayLetters, setDisplayLetters] = useState<string[]>([]);
  const { ref, visible } = useVisible(0.01);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/envies.txt")
      .then((r) => r.text())
      .then((text) => {
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
        setItems(lines);
        if (lines.length > 0) {
          setCurrentWord(lines[0]);
          setDisplayLetters(lines[0].split(""));
        }
      })
      .catch(() => {});
  }, []);

  const animateWord = useCallback((word: string) => {
    const letters = word.split("");
    const units: string[] = new Array(letters.length).fill("");
    setDisplayLetters([...units]);

    letters.forEach((char, i) => {
      const totalSteps = FLIP_MIN_STEPS + Math.floor(Math.random() * FLIP_MAX_EXTRA_STEPS);
      let step = 0;
      const timer = setInterval(() => {
        if (step < totalSteps - 1) {
          units[i] = FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)];
          setDisplayLetters([...units]);
        } else {
          clearInterval(timer);
          units[i] = char;
          setDisplayLetters([...units]);
        }
        step++;
      }, FLIP_STEP_MS);
    });
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    intervalRef.current = setInterval(() => {
      let next = Math.floor(Math.random() * items.length);
      if (next === indexRef.current && items.length > 1) {
        next = (next + 1) % items.length;
      }
      indexRef.current = next;
      setCurrentWord(items[next]);
      animateWord(items[next]);
    }, ROTATION_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items, animateWord]);

  if (items.length === 0) return null;

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
        marginBottom: 32,
        maxWidth: 720,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
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
      <div
        style={{
          display: "flex",
          gap: 3,
        }}
      >
        {displayLetters.map((char, i) => {
          const isSpace = currentWord[i] === " ";
          return (
            <span
              key={`${i}-${currentWord}`}
              style={{
                position: "relative",
                width: isSpace ? 10 : 24,
                height: 34,
                background: "#f5f5f5",
                border: "0.5px solid #e0e0e0",
                borderRadius: 4,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-sans)",
                fontSize: 18,
                fontWeight: 500,
                color: "#1a1a1a",
                textTransform: "uppercase",
              }}
            >
              {char || ""}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: 1,
                  background: "#e0e0e0",
                  transform: "translateY(-0.5px)",
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
