"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Locale, getT } from "@/lib/i18n";
import { Job } from "@/lib/cms/types";
import CTABlock from "@/components/cta-block";
import { useIsMobile } from "@/hooks/useMediaQuery";

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

interface JobDetailProps {
  lang: Locale;
  slug: string;
}

const JOB_TYPE_LABELS: Record<string, { fr: string; en: string }> = {
  cdi: { fr: "CDI", en: "Full-time" },
  cdd: { fr: "CDD", en: "Fixed-term" },
  freelance: { fr: "Freelance", en: "Freelance" },
  stage: { fr: "Stage", en: "Internship" },
  alternance: { fr: "Alternance", en: "Work-study" },
};

export default function JobDetailClient({ lang, slug }: JobDetailProps) {
  const t = getT(lang);
  const isMobile = useIsMobile();
  const params = useParams();
  const urlLang = (params.lang as string) || lang;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");
  const [activeTab, setActiveTab] = useState<"description" | "apply">("description");

  const heroV = useVisible(0.2);
  const contentV = useVisible(0.1);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${slug}`);
        if (res.status === 404) {
          setError("notFound");
          return;
        }
        const data = await res.json();
        if (data.job) {
          setJob(data.job);
        } else {
          setError("notFound");
        }
      } catch {
        setError("error");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [slug]);

  const typeLabel = (type: string) => JOB_TYPE_LABELS[type]?.[lang] || type;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || honeypot) return;
    setFormState("loading");

    try {
      const res = await fetch("/api/job-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobReference: job.reference,
          jobTitle: job.title,
          firstName,
          lastName,
          email,
          phone,
          linkedin,
          message,
        }),
      });
      if (res.ok) {
        setFormState("success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setLinkedin("");
        setMessage("");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#777169" }}>Chargement...</p>
      </div>
    );
  }

  if (error === "notFound" || !job) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>
            {lang === "fr" ? "Offre introuvable" : "Position not found"}
          </h1>
          <Link
            href={`/${urlLang}/carrieres`}
            style={{ color: "#0A0A0A", textDecoration: "underline" }}
          >
            {t.careers.detail.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section style={{ padding: isMobile ? "40px 0 30px" : "60px 0 40px" }}>
        <div className="container">
          <div
            ref={heroV.ref}
            style={{
              maxWidth: 800,
              opacity: heroV.visible ? 1 : 0,
              transform: heroV.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <Link
              href={`/${urlLang}/carrieres`}
              style={{
                fontSize: 14,
                color: "#777169",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginBottom: 24,
              }}
            >
              {t.careers.detail.back}
            </Link>

            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#777169",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              {job.reference}
            </p>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 500,
                lineHeight: 1.2,
                color: "#0A0A0A",
                marginBottom: 20,
              }}
            >
              {job.title}
            </h1>
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                fontSize: 14,
                color: "#777169",
              }}
            >
              <span>{job.department}</span>
              <span>{job.location}</span>
              <span>{typeLabel(job.type)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section style={{ padding: "20px 0 40px" }}>
        <div className="container">
          <div
            ref={contentV.ref}
            style={{
              opacity: contentV.visible ? 1 : 0,
              transform: contentV.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 32,
                borderBottom: "1px solid #F0EBE5",
              }}
            >
              {(["description", "apply"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "12px 24px",
                    fontSize: 15,
                    fontWeight: 500,
                    border: "none",
                    borderBottom: activeTab === tab ? "2px solid #0A0A0A" : "2px solid transparent",
                    background: "transparent",
                    color: activeTab === tab ? "#0A0A0A" : "#777169",
                    cursor: "pointer",
                    marginBottom: -1,
                    transition: "color 0.2s ease",
                  }}
                >
                  {tab === "description" ? t.careers.tabs.description : t.careers.tabs.apply}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "description" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
                  gap: 48,
                }}
              >
                {/* Left: Description */}
                <div>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 500,
                      color: "#0A0A0A",
                      marginBottom: 20,
                    }}
                  >
                    {t.careers.detail.about}
                  </h2>
                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "#3E3B38",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {job.description}
                  </div>

                  {job.whyJoin && (
                    <>
                      <h2
                        style={{
                          fontSize: 22,
                          fontWeight: 500,
                          color: "#0A0A0A",
                          marginTop: 40,
                          marginBottom: 20,
                        }}
                      >
                        {t.careers.detail.whyJoin}
                      </h2>
                      <div
                        style={{
                          fontSize: 15,
                          lineHeight: 1.7,
                          color: "#3E3B38",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {job.whyJoin}
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => setActiveTab("apply")}
                    style={{
                      marginTop: 32,
                      padding: "14px 28px",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#fff",
                      background: "#0A0A0A",
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                    }}
                  >
                    {t.careers.detail.apply}
                  </button>
                </div>

                {/* Right: Info box */}
                <div>
                  <div
                    style={{
                      background: "#FAFAF8",
                      borderRadius: 16,
                      padding: "24px",
                      position: "sticky",
                      top: 24,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#0A0A0A",
                        marginBottom: 20,
                      }}
                    >
                      {t.careers.detail.info}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 4 }}>
                          {t.careers.detail.department}
                        </p>
                        <p style={{ fontSize: 14, color: "#3E3B38", fontWeight: 500 }}>
                          {job.department}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 4 }}>
                          {t.careers.detail.type}
                        </p>
                        <p style={{ fontSize: 14, color: "#3E3B38", fontWeight: 500 }}>
                          {typeLabel(job.type)}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 4 }}>
                          {t.careers.detail.location}
                        </p>
                        <p style={{ fontSize: 14, color: "#3E3B38", fontWeight: 500 }}>
                          {job.location}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 4 }}>
                          {t.careers.detail.reference}
                        </p>
                        <p style={{ fontSize: 14, color: "#3E3B38", fontWeight: 500 }}>
                          {job.reference}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: "#0A0A0A",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  {t.careers.detail.apply}
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "#777169",
                    marginBottom: 32,
                    textAlign: "center",
                  }}
                >
                  {t.careers.form.subtitle}
                </p>

                {formState === "success" ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 24px",
                      background: "#fff",
                      borderRadius: 16,
                    }}
                  >
                    <p style={{ fontSize: 18, color: "#0A0A0A", marginBottom: 8 }}>
                      {t.careers.form.success}
                    </p>
                    <Link
                      href={`/${urlLang}/carrieres`}
                      style={{
                        color: "#0A0A0A",
                        textDecoration: "underline",
                        fontSize: 14,
                      }}
                    >
                      {t.careers.detail.back}
                    </Link>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    style={{ background: "#fff", padding: "32px", borderRadius: 16 }}
                  >
                    {/* Honeypot */}
                    <div style={{ display: "none" }}>
                      <input
                        type="text"
                        name="honeypot"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>{t.careers.form.firstName}</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>{t.careers.form.lastName}</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>{t.careers.form.email}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>{t.careers.form.phone}</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>{t.careers.form.linkedin}</label>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        style={inputStyle}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={labelStyle}>{t.careers.form.message}</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        style={{ ...inputStyle, resize: "vertical" }}
                        placeholder={t.careers.form.messagePlaceholder}
                      />
                    </div>

                    {formState === "error" && (
                      <p style={{ color: "#c45c4a", fontSize: 14, marginBottom: 16 }}>
                        {t.careers.form.error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={formState === "loading"}
                      style={{
                        width: "100%",
                        padding: "14px",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#fff",
                        background: "#0A0A0A",
                        border: "none",
                        borderRadius: 10,
                        cursor: formState === "loading" ? "not-allowed" : "pointer",
                        opacity: formState === "loading" ? 0.6 : 1,
                      }}
                    >
                      {formState === "loading"
                        ? "Envoi..."
                        : t.careers.form.submit}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <CTABlock lang={lang} variant="final" />
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#3E3B38",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  border: "1px solid #E5E0DA",
  borderRadius: 10,
  background: "#FAFAF8",
  outline: "none",
  boxSizing: "border-box",
};
