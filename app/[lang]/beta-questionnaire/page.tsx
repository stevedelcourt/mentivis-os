"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Section {
  id: string;
  labelFr: string;
  labelEn: string;
}

const sections: Section[] = [
  { id: "general", labelFr: "Informations générales", labelEn: "General Information" },
  { id: "contexte", labelFr: "Contexte actuel", labelEn: "Current Context" },
  { id: "fonctionnalites", labelFr: "Fonctionnalités", labelEn: "Features" },
  { id: "attentes", labelFr: "Attentes", labelEn: "Expectations" },
  { id: "complement", labelFr: "Complément", labelEn: "Additional" },
];

const featuresList = [
  { id: "generation", labelFr: "Génération de contenu pédagogique", labelEn: "Content generation" },
  { id: "adaptatif", labelFr: "Parcours adaptatifs", labelEn: "Adaptive learning paths" },
  { id: "analytique", labelFr: "Analytics et reporting", labelEn: "Analytics & reporting" },
  { id: "multilingue", labelFr: "Support multilingue", labelEn: "Multi-language support" },
  { id: "collaboration", labelFr: "Collaboration d'équipe", labelEn: "Team collaboration" },
  { id: "integration", labelFr: "Intégrations LMS/API", labelEn: "LMS/API integrations" },
];

const timelineOptions = [
  { value: "", labelFr: "Sélectionnez...", labelEn: "Select..." },
  { value: "1-3", labelFr: "1 à 3 mois", labelEn: "1-3 months" },
  { value: "3-6", labelFr: "3 à 6 mois", labelEn: "3-6 months" },
  { value: "6-12", labelFr: "6 à 12 mois", labelEn: "6-12 months" },
  { value: "12+", labelFr: "Plus d'un an", labelEn: "12+ months" },
];

function Sidebar({ activeId, isFr }: { activeId: string; isFr: boolean }) {
  return (
    <nav style={sidebarStyle}>
      <Link
        href={`/${isFr ? "fr" : "en"}`}
        style={backLinkStyle}
      >
        &larr; {isFr ? "Retour" : "Back"}
      </Link>

      <p style={sidebarTitleStyle}>
        {isFr ? "Questionnaire" : "Questionnaire"}
      </p>

      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          style={{
            ...caseLinkStyle,
            ...(activeId === section.id ? activeCaseLinkStyle : {}),
          }}
        >
          <span
            style={{
              ...stepBadgeStyle,
              background: activeId === section.id ? "#1a1a1a" : "#e8e8ed",
              color: activeId === section.id ? "#fff" : "#666",
            }}
          >
            {sections.indexOf(section) + 1}
          </span>
          <span>{isFr ? section.labelFr : section.labelEn}</span>
        </a>
      ))}
    </nav>
  );
}

export default function BetaQuestionnairePage() {
  const params = useParams();
  const lang = params.lang as string;
  const isFr = lang === "fr";

  const [activeId, setActiveId] = useState("general");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    currentTools: "",
    challenges: "",
    heardAbout: "",
    features: [] as string[],
    priority: "",
    expectedOutcomes: "",
    timeline: "",
    teamSize: "",
    additionalInfo: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    contexte: false,
    fonctionnalites: false,
    attentes: false,
    complement: false,
  });

  const rafId = useRef<number | null>(null);

  useEffect(() => {
    let lastActiveId = "";
    const onScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        let current = sections[0].id;
        for (const section of sections) {
          const el = document.getElementById(section.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150) {
              current = section.id;
            }
          }
        }
        if (current !== lastActiveId) {
          lastActiveId = current;
          setActiveId(current);
        }
        rafId.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const update = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleFeature = (id: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter((f) => f !== id)
        : [...prev.features, id],
    }));
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = isFr ? "Requis" : "Required";
    if (!form.email.trim()) errs.email = isFr ? "Requis" : "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = isFr ? "Email invalide" : "Invalid email";
    if (!form.consent) errs.consent = isFr ? "Consentement requis" : "Consent required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setError("");

    try {
      const payload: Record<string, string> = {};
      Object.entries(form).forEach(([k, v]) => { payload[k] = String(v); });
      payload.features = form.features.join(", ");
      payload.honeypot = "";
      payload._t = Date.now().toString();
      const res = await fetch(`/api/beta-questionnaire?${new URLSearchParams(payload)}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error || (isFr ? "Erreur d'envoi" : "Submission error"));
        return;
      }
      setSubmitted(true);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "form_lead", form_type: "beta" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(isFr ? "Erreur réseau" : "Network error");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div style={pageStyle}>
        <Sidebar activeId="" isFr={isFr} />
        <div style={contentStyle}>
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
            <h1 style={h1Style}>
              {isFr ? "Merci !" : "Thank you!"}
            </h1>
            <p style={{ color: "#999", fontSize: 16, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              {isFr
                ? "Votre questionnaire a bien été envoyé. Nous vous recontacterons rapidement pour la suite du processus de sélection des bêta-testeurs."
                : "Your questionnaire has been submitted. We will get back to you shortly regarding the next steps in the beta tester selection process."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Sidebar activeId={activeId} isFr={isFr} />
      <form onSubmit={handleSubmit} style={contentStyle as React.CSSProperties}>
        <h1 style={h1Style}>
          {isFr ? "Questionnaire bêta-testeur" : "Beta Tester Questionnaire"}
        </h1>
        <p style={pageDescStyle}>
          {isFr
            ? "Devenir bêta-testeur MentivisOS - répondez à ce questionnaire pour nous aider à comprendre votre contexte et vos besoins."
            : "Become a MentivisOS beta tester - fill out this questionnaire to help us understand your context and needs."}
        </p>

        {error && (
          <div style={{ padding: "12px 16px", background: "#FEF2F0", borderRadius: 10, marginBottom: 24, color: "#c45c4a", fontSize: 14 }}>
            {error}
          </div>
        )}

        {sections.map((section, idx) => (
          <div key={section.id} id={section.id} style={{ marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              style={accordionHeaderStyle}
            >
              <span style={accordionNumberStyle}>{idx + 1}</span>
              <span style={{ flex: 1, textAlign: "left" }}>
                {isFr ? section.labelFr : section.labelEn}
              </span>
              <span style={{ fontSize: 18, color: "#999", transition: "transform 0.2s", transform: openSections[section.id] ? "rotate(180deg)" : "rotate(0deg)" }}>
                &#9660;
              </span>
            </button>

            {openSections[section.id] && (
              <div style={accordionBodyStyle}>
                {section.id === "general" && (
                  <>
                    <Field label={isFr ? "Nom complet *" : "Full Name *"} error={errors.fullName}>
                      <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} style={fieldInputStyle(errors.fullName)} />
                    </Field>
                    <Field label={isFr ? "Email professionnel *" : "Professional Email *"} error={errors.email}>
                      <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} style={fieldInputStyle(errors.email)} autoComplete="email" />
                    </Field>
                    <Field label={isFr ? "Entreprise / Organisation" : "Company / Organization"}>
                      <input type="text" value={form.company} onChange={(e) => update("company", e.target.value)} style={fieldInputStyle()} />
                    </Field>
                    <Field label={isFr ? "Poste / Rôle" : "Job Title / Role"}>
                      <input type="text" value={form.role} onChange={(e) => update("role", e.target.value)} style={fieldInputStyle()} />
                    </Field>
                  </>
                )}

                {section.id === "contexte" && (
                  <>
                    <Field label={isFr ? "Quels outils utilisez-vous actuellement pour la formation ?" : "What tools are you currently using for training?"}>
                      <textarea value={form.currentTools} onChange={(e) => update("currentTools", e.target.value)} style={fieldTextareaStyle} rows={3} />
                    </Field>
                    <Field label={isFr ? "Quels sont vos principaux défis en matière de formation ?" : "What are your main training challenges?"}>
                      <textarea value={form.challenges} onChange={(e) => update("challenges", e.target.value)} style={fieldTextareaStyle} rows={3} />
                    </Field>
                    <Field label={isFr ? "Comment avez-vous entendu parler de MentivisOS ?" : "How did you hear about MentivisOS?"}>
                      <input type="text" value={form.heardAbout} onChange={(e) => update("heardAbout", e.target.value)} style={fieldInputStyle()} />
                    </Field>
                  </>
                )}

                {section.id === "fonctionnalites" && (
                  <>
                    <Field label={isFr ? "Quelles fonctionnalités vous intéressent le plus ?" : "Which features interest you most?"}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {featuresList.map((f) => (
                          <label key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#555" }}>
                            <input type="checkbox" checked={form.features.includes(f.id)} onChange={() => toggleFeature(f.id)} style={{ width: 18, height: 18, cursor: "pointer" }} />
                            {isFr ? f.labelFr : f.labelEn}
                          </label>
                        ))}
                      </div>
                    </Field>
                    <Field label={isFr ? "Quelle serait votre priorité absolue ?" : "What would be your top priority?"}>
                      <textarea value={form.priority} onChange={(e) => update("priority", e.target.value)} style={fieldTextareaStyle} rows={3} />
                    </Field>
                  </>
                )}

                {section.id === "attentes" && (
                  <>
                    <Field label={isFr ? "Quels résultats attendez-vous de MentivisOS ?" : "What outcomes do you expect from MentivisOS?"}>
                      <textarea value={form.expectedOutcomes} onChange={(e) => update("expectedOutcomes", e.target.value)} style={fieldTextareaStyle} rows={3} />
                    </Field>
                    <Field label={isFr ? "Horizon de déploiement envisagé" : "Expected deployment timeline"}>
                      <select value={form.timeline} onChange={(e) => update("timeline", e.target.value)} style={fieldInputStyle()}>
                        {timelineOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{isFr ? opt.labelFr : opt.labelEn}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label={isFr ? "Combien d'utilisateurs pour commencer ?" : "How many users to start with?"}>
                      <input type="text" value={form.teamSize} onChange={(e) => update("teamSize", e.target.value)} style={fieldInputStyle()} placeholder={isFr ? "Ex: 50" : "e.g. 50"} />
                    </Field>
                  </>
                )}

                {section.id === "complement" && (
                  <>
                    <Field label={isFr ? "Avez-vous d'autres informations à partager ?" : "Anything else you'd like to share?"}>
                      <textarea value={form.additionalInfo} onChange={(e) => update("additionalInfo", e.target.value)} style={fieldTextareaStyle} rows={4} />
                    </Field>
                    <Field error={errors.consent}>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 14, color: "#555", lineHeight: 1.5 }}>
                        <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer", marginTop: 2, flexShrink: 0 }} />
                        {isFr
                          ? "J'accepte d'être contacté par Mentivis dans le cadre du programme bêta et de la sélection des participants. *"
                          : "I consent to being contacted by Mentivis regarding the beta program and participant selection. *"}
                      </label>
                    </Field>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <button
            type="submit"
            disabled={sending}
            style={{
              padding: "14px 48px",
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 12,
              border: "none",
              cursor: sending ? "not-allowed" : "pointer",
              background: sending ? "#ccc" : "#1a1a1a",
              color: "#fff",
              transition: "background 0.2s",
            }}
          >
            {sending
              ? (isFr ? "Envoi..." : "Sending...")
              : (isFr ? "Envoyer le questionnaire" : "Submit Questionnaire")}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label?: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 500, color: error ? "#c45c4a" : "#888" }}>
          {label}
        </p>
      )}
      {children}
      {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#c45c4a" }}>{error}</p>}
    </div>
  );
}

function fieldInputStyle(error?: string): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    border: `1px solid ${error ? "#c45c4a" : "#ddd"}`,
    borderRadius: 10,
    outline: "none",
    boxSizing: "border-box",
    color: "#333",
    background: "#fff",
  };
}

const fieldTextareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  border: "1px solid #ddd",
  borderRadius: 10,
  outline: "none",
  boxSizing: "border-box",
  color: "#333",
  background: "#fff",
  fontFamily: "inherit",
  resize: "vertical",
};

const accordionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "16px 20px",
  border: "1px solid #eee",
  borderRadius: 12,
  background: "#fff",
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 600,
  color: "#1a1a1a",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};

const accordionNumberStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "50%",
  background: "#1a1a1a",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  flexShrink: 0,
};

const accordionBodyStyle: React.CSSProperties = {
  padding: "20px 24px",
  background: "#fff",
  borderRadius: "0 0 12px 12px",
  border: "1px solid #eee",
  borderTop: "none",
  marginTop: -12,
};

// ── Shared layout styles (matching hidden-testimonials) ──

const pageStyle: React.CSSProperties = {
  background: "#f5f5f7",
  minHeight: "100vh",
  display: "flex",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif",
  lineHeight: 1.7,
  color: "#1a1a1a",
};

const sidebarStyle: React.CSSProperties = {
  position: "fixed",
  top: 64,
  left: 0,
  width: 240,
  height: "calc(100vh - 64px)",
  padding: "48px 24px",
  overflowY: "auto",
};

const backLinkStyle: React.CSSProperties = {
  display: "inline-block",
  marginBottom: 32,
  color: "#999",
  textDecoration: "none",
  fontSize: 13,
};

const sidebarTitleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  margin: "0 0 24px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#bbb",
};

const caseLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  borderRadius: 10,
  fontSize: 13,
  color: "#555",
  textDecoration: "none",
  transition: "all 0.15s",
  marginBottom: 2,
};

const activeCaseLinkStyle: React.CSSProperties = {
  background: "#ffffff",
  fontWeight: 600,
  color: "#111",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const stepBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 22,
  height: 22,
  borderRadius: "50%",
  fontSize: 11,
  fontWeight: 700,
  flexShrink: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  maxWidth: 720,
  marginLeft: 240,
  padding: "48px 64px 120px",
};

const h1Style: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  margin: "0 0 6px",
  letterSpacing: "-0.02em",
  color: "#1a1a1a",
};

const pageDescStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#999",
  margin: "0 0 40px",
  lineHeight: 1.6,
};
