"use client";

import { useState } from "react";
import { getT, Locale } from "@/lib/i18n";

export default function DemoClient({ lang }: { lang: Locale }) {
  const t = getT(lang);
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

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 56 }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 480 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display)",
              fontWeight: 300,
              color: "var(--color-ink-primary)",
              marginBottom: 24,
            }}
          >
            Merci.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body)",
              color: "var(--color-ink-secondary)",
              lineHeight: 1.7,
            }}
          >
            {t.demo.form.success}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--color-ink-primary)",
            whiteSpace: "pre-line",
            marginBottom: 24,
          }}
        >
          {t.demo.title}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            color: "var(--color-ink-secondary)",
            lineHeight: 1.7,
            marginBottom: 48,
          }}
        >
          {t.demo.description}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <FormField label={t.demo.form.firstName} name="firstname" required />
            <FormField label={t.demo.form.organization} name="organization" required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <FormField label={t.demo.form.role} name="role" />
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-interface)",
                  fontSize: "var(--text-small)",
                  fontWeight: 600,
                  color: "var(--color-ink-secondary)",
                  marginBottom: 8,
                }}
              >
                {t.demo.form.segment}
              </label>
              <select
                name="segment"
                required
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "var(--card-radius)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body)",
                  background: "var(--color-surface-1)",
                  color: "var(--color-ink-primary)",
                  appearance: "none",
                }}
              >
                <option value="">{t.demo.form.segment}</option>
                {t.demo.form.segmentOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-small)",
                fontWeight: 600,
                color: "var(--color-ink-secondary)",
                marginBottom: 8,
              }}
            >
              {t.demo.form.objective}
            </label>
            <textarea
              name="objective"
              required
              maxLength={200}
              placeholder={t.demo.form.objectivePlaceholder}
              rows={3}
              style={{
                width: "100%",
                padding: "13px 16px",
                border: `1px solid var(--color-border)`,
                borderRadius: "var(--card-radius)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-body)",
                background: "var(--color-surface-1)",
                color: "var(--color-ink-primary)",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <FormField label={t.demo.form.email} name="email" type="email" required />
            <FormField label={t.demo.form.phone} name="phone" type="tel" />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-interface)",
                fontSize: "var(--text-small)",
                fontWeight: 600,
                color: "var(--color-ink-secondary)",
                marginBottom: 8,
              }}
            >
              {t.demo.form.preference}
            </label>
            <div style={{ display: "flex", gap: 16 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-small)",
                  color: "var(--color-ink-secondary)",
                  cursor: "pointer",
                }}
              >
                <input type="radio" name="preference" value="visio" defaultChecked />
                {t.demo.form.preferenceVisio}
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-small)",
                  color: "var(--color-ink-secondary)",
                  cursor: "pointer",
                }}
              >
                <input type="radio" name="preference" value="onsite" />
                {t.demo.form.preferenceOnsite}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              background: status === "loading" ? "var(--color-accent-dim)" : "var(--color-accent)",
              color: "var(--color-ground)",
              fontFamily: "var(--font-interface)",
              fontSize: "var(--text-small)",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "14px 32px",
              borderRadius: "var(--button-radius)",
              transition: "background 0.18s ease",
              width: "100%",
              cursor: status === "loading" ? "not-allowed" : "pointer",
            }}
          >
            {status === "loading" ? "..." : t.demo.form.submit}
          </button>

          {status === "error" && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-small)",
                color: "var(--color-signal-red)",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              {t.demo.form.error}
            </p>
          )}
        </form>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-small)",
            color: "var(--color-ink-tertiary)",
            marginTop: 48,
            textAlign: "center",
          }}
        >
          {t.demo.pricing}
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          form > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-interface)",
          fontSize: "var(--text-small)",
          fontWeight: 600,
          color: "var(--color-ink-secondary)",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        style={{
          width: "100%",
          padding: "13px 16px",
          border: `1px solid var(--color-border)`,
          borderRadius: "var(--card-radius)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-body)",
          background: "var(--color-surface-1)",
          color: "var(--color-ink-primary)",
        }}
      />
    </div>
  );
}
