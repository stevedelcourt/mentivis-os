"use client";

import { useState } from "react";
import { getT, Locale } from "@/lib/i18n";

export type ContactFormMode = "contact" | "demo";

interface ContactFormProps {
  lang: Locale;
  mode?: ContactFormMode;
}

export default function ContactForm({ lang, mode = "demo" }: ContactFormProps) {
  const t = getT(lang);
  const isContact = mode === "contact";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 64 }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 480 }}>
          <h2 className="t-display" style={{ fontSize: "var(--text-display)", marginBottom: 24 }}>
            Merci.
          </h2>
          <p className="t-lead">{t.demo.form.success}</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <h1
          className="t-display"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            whiteSpace: "pre-line",
            marginBottom: 24,
          }}
        >
          {isContact ? (t.contact?.title || "Contactez-nous") : t.demo.title}
        </h1>

        <p className="t-lead" style={{ marginBottom: 48 }}>
          {isContact ? (t.contact?.description || "Une question ? Un projet ? Écrivez-nous.") : t.demo.description}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Prénom + Nom */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <FormField label="Prénom" name="firstname" required />
            <FormField label="Nom" name="lastname" required />
          </div>

          {/* Row 2: Organisation + Poste/Role */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <FormField label={t.demo.form.organization} name="organization" required />
            <FormField label={t.demo.form.role} name="role" />
          </div>

          {/* Row 3: Email + Téléphone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <FormField label={t.demo.form.email} name="email" type="email" required />
            <FormField label={t.demo.form.phone} name="phone" type="tel" />
          </div>

          {/* Row 4: Message / Demande */}
          <div style={{ marginBottom: 24 }}>
            <label className="t-caption" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
              {isContact ? "Message" : "Demande de démonstration"}
            </label>
            <textarea
              name="objective"
              required
              maxLength={500}
              placeholder={isContact ? "Votre message..." : "Décrivez votre besoin..."}
              rows={4}
              className="form-textarea"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: `1px solid var(--border-light)`,
                borderRadius: "var(--r-card)",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-body-sm)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                resize: "vertical",
              }}
            />
          </div>

          {/* Consent checkbox */}
          <div style={{ marginBottom: 32 }}>
            <label className="t-caption" style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                name="consent"
                value="yes"
                required
                style={{ marginTop: 2 }}
              />
              <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--text-secondary)" }}>
                Je suis d'accord que Mentivis traite mes données personnelles conformément à la politique de confidentialité.
              </span>
            </label>
          </div>

          <input type="hidden" name="formType" value={mode} />
          <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-pill btn-black"
            style={{
              width: "100%",
              padding: "14px 32px",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "loading" ? 0.6 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {status === "loading" ? "..." : (isContact ? (t.contact?.form?.submit || "Envoyer") : t.demo.form.submit)}
            {status !== "loading" && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {status === "error" && (
            <p className="t-caption" style={{ color: "#c62828", marginTop: 16, textAlign: "center" }}>
              {t.demo.form.error}
            </p>
          )}
        </form>

        <p className="t-caption" style={{ marginTop: 48, textAlign: "center", color: "var(--text-tertiary)" }}>
          {isContact ? (t.contact?.pricing || "Réponse sous 24h ouvrées.") : t.demo.pricing}
        </p>
      </div>

      <style>{`
        .form-select:focus, .form-textarea:focus, .form-input:focus {
          outline: none;
          border-color: var(--text-tertiary);
          box-shadow: 0 0 0 2px var(--focus-ring);
        }
        @media (max-width: 1024px) {
          form > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function FormField({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="t-caption" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="form-input"
        style={{
          width: "100%",
          padding: "12px 16px",
          border: `1px solid var(--border-light)`,
          borderRadius: "var(--r-card)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-body-sm)",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}
