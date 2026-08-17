"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface PdfUnlockProps {
  pdfUrl: string;
  title: string;
  cover?: string;
  lang: string;
  context?: string;
}

const inputStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid #e5e5e5",
  background: "#ffffff",
  fontSize: 14,
  fontFamily: "var(--font-sans)",
  color: "#000000",
  outline: "none",
  width: "100%",
};

function PdfUnlockModal({
  open,
  context,
  onClose,
  onSuccess,
  lang,
}: {
  open: boolean;
  context: string;
  onClose: () => void;
  onSuccess: () => void;
  lang: string;
}) {
  const t = (fr: string, en: string) => (lang === "en" ? en : fr);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!consent) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/demo/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          phone,
          organization: company,
          consent: consent ? "yes" : "",
          honeypot,
          formType: "demo",
          formContext: context,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(t("Une erreur est survenue. Réessayez.", "An error occurred. Try again."));
        return;
      }
      setSuccess(true);
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      if (w.dataLayer) {
        w.dataLayer.push({
          event: "form_submit_success",
          form_name: context,
          form_language: lang,
        });
      }
      onSuccess();
    } catch {
      setError(t("Une erreur est survenue. Réessayez.", "An error occurred. Try again."));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: "36px 32px 32px",
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 20px 60px rgba(16,24,40,0.18)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label={t("Fermer", "Close")}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "#4e4e4e",
            fontSize: 20,
            lineHeight: 1,
            fontFamily: "var(--font-sans)",
          }}
        >
          ×
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 28,
                color: "#2e7d32",
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 500,
                margin: "0 0 10px",
                color: "#000000",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("Accès déverrouillé !", "Access unlocked!")}
            </h3>
            <p
              style={{
                color: "#4e4e4e",
                fontSize: 15,
                lineHeight: 1.5,
                margin: 0,
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("Votre étude s'ouvre dans un nouvel onglet.", "Your study is opening in a new tab.")}
            </p>
          </div>
        ) : (
          <>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 500,
                margin: "0 0 6px",
                color: "#000000",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("Recevez l'étude gratuitement", "Get the study for free")}
            </h3>
            <p
              style={{
                color: "#4e4e4e",
                fontSize: 14,
                lineHeight: 1.5,
                margin: "0 0 22px",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t(
                "Renseignez vos coordonnées pour déverrouiller l'accès au PDF.",
                "Fill in your details to unlock access to the PDF."
              )}
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input
                  type="text"
                  placeholder={t("Prénom", "First name")}
                  required
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder={t("Nom", "Last name")}
                  required
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <input
                type="email"
                placeholder={t("Email professionnel", "Work email")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder={t("Téléphone", "Phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder={t("Organisation", "Organization")}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0 }}
              />
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 13,
                  color: "#4e4e4e",
                  lineHeight: 1.45,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                <span>
                  {t("J'accepte d'être recontacté par Mentivis et j'ai lu la", "I agree to be contacted by Mentivis and I have read the")}{" "}
                  <Link href={`/${lang}/privacy`} style={{ color: "#000000", textDecoration: "underline" }}>
                    {t("politique de confidentialité", "privacy policy")}
                  </Link>
                  .
                </span>
              </label>
              {error && <p style={{ color: "#c62828", fontSize: 13, margin: 0 }}>{error}</p>}
              <button
                type="submit"
                disabled={loading || !consent}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 22px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ffffff",
                  background: loading || !consent ? "#a3a3a3" : "#000000",
                  borderRadius: 12,
                  border: "none",
                  cursor: loading || !consent ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                  fontFamily: "var(--font-sans)",
                  marginTop: 4,
                }}
              >
                {loading ? t("Envoi...", "Sending...") : t("Déverrouiller l'accès", "Unlock access")}
                {!loading && <span aria-hidden>→</span>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function PdfUnlock({ pdfUrl, title, cover, lang, context = "pdf" }: PdfUnlockProps) {
  const t = (fr: string, en: string) => (lang === "en" ? en : fr);
  const storageKey = `mOS_pdf_unlock_${context}`;

  const [unlocked, setUnlocked] = useState(() =>
    typeof window !== "undefined" && sessionStorage.getItem(storageKey) === "1"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNonce, setModalNonce] = useState(0);

  const handleUnlock = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, "1");
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
    setUnlocked(true);
    setModalOpen(false);
  }, [storageKey, pdfUrl]);

  return (
    <>
      <div
        style={{
          marginTop: 56,
          padding: "clamp(24px, 4vw, 40px)",
          borderRadius: 20,
          border: "1px solid #e5e5e5",
          background: "#f5f5f5",
        }}
      >
        <span
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#4e4e4e",
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            display: "block",
            marginBottom: 10,
          }}
        >
          {t("Étude 2026-2030", "2026-2030 Study")}
        </span>
        <h2
          style={{
            fontSize: "clamp(22px, 3vw, 30px)",
            fontWeight: 500,
            color: "#000000",
            margin: "0 0 12px",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            fontFamily: "var(--font-sans)",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: "#4e4e4e",
            fontSize: 15,
            lineHeight: 1.55,
            margin: "0 0 24px",
            fontFamily: "var(--font-sans)",
          }}
        >
          {t("Vous pouvez télécharger gratuitement cette étude :", "You can download this study for free:")}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={title}
              style={{
                width: "100%",
                maxWidth: 200,
                borderRadius: 10,
                display: "block",
              }}
            />
          )}
          {unlocked ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 22px",
                fontSize: 14,
                fontWeight: 600,
                color: "#ffffff",
                background: "#000000",
                borderRadius: 12,
                textDecoration: "none",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("Télécharger le PDF", "Download the PDF")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <button
              onClick={() => {
                setModalNonce((n) => n + 1);
                setModalOpen(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 22px",
                fontSize: 14,
                fontWeight: 600,
                color: "#000000",
                background: "#ffffff",
                border: "1.5px solid #e5e5e5",
                borderRadius: 12,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="2" />
              </svg>
              {t("Déverrouiller", "Unlock")}
            </button>
          )}
        </div>
      </div>

      <PdfUnlockModal
        key={modalNonce}
        open={modalOpen}
        context={context}
        onClose={() => setModalOpen(false)}
        onSuccess={handleUnlock}
        lang={lang}
      />
    </>
  );
}
