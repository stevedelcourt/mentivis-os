"use client";

export default function CookieButton({ label, className, style }: { label: string; className?: string; style?: React.CSSProperties }) {
  const openCookiePrefs = () => {
    if (typeof window !== "undefined") {
      const w = window as unknown as { CookieConsent?: { showPreferences: () => void } };
      if (w.CookieConsent) {
        w.CookieConsent.showPreferences();
      }
    }
  };

  return (
    <button
      onClick={openCookiePrefs}
      className={className}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        ...style,
      }}
    >
      {label}
    </button>
  );
}
