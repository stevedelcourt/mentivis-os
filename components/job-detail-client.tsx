"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Locale, getT } from "@/lib/i18n";
import { Job } from "@/lib/cms/types";
import CTABlock from "@/components/cta-block";
import { useIsMobile } from "@/hooks/useMediaQuery";

function renderMarkdown(text: string): string {
  // Detect HTML tags anywhere in content (both full docs and fragments)
  if (/<(h[1-6]|p|ul|ol|li|div|br|b|strong|em|i|a|span|table|blockquote|pre|code|hr)\b[\s\S]*?>/i.test(text)) {
    const sanitized = text
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/<object[\s\S]*?<\/object>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/ on\w+=["'][^"']*["']/gi, "");
    return `<div style="font-size:15px;line-height:1.7;color:#4e4e4e;">${sanitized}</div>`;
  }

  const lines = text.split("\n");
  let html = "";
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trimStart();

    // Heading ##
    if (trimmed.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h3 style="font-size:22px;font-weight:500;color:#0A0A0A;margin:32px 0 16px;line-height:1.3;">${escapeHtml(trimmed.slice(3))}</h3>`;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h2 style="font-size:28px;font-weight:500;color:#0A0A0A;margin:40px 0 20px;line-height:1.2;">${escapeHtml(trimmed.slice(2))}</h2>`;
      continue;
    }

    // Bullet list
    const bulletMatch = trimmed.match(/^(•|\*|\-)\s+(.*)$/);
    if (bulletMatch) {
      if (!inList) { html += '<ul style="margin:8px 0 16px 20px;padding:0;list-style:disc;">'; inList = true; }
      html += `<li style="font-size:15px;line-height:1.7;color:#4e4e4e;margin-bottom:6px;">${escapeHtml(bulletMatch[2])}</li>`;
      continue;
    }

    if (inList) { html += "</ul>"; inList = false; }

    if (trimmed === "") {
      html += '<div style="height:8px;"></div>';
    } else {
      html += `<p style="font-size:15px;line-height:1.7;color:#4e4e4e;margin-bottom:12px;">${escapeHtml(line)}</p>`;
    }
  }

  if (inList) html += "</ul>";
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"description" | "apply">("description");

  const hsFormRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!job || activeTab !== "apply") return;

    const containerId = `hs-form-${job.reference}`;

    const createForm = () => {
      const hbspt = (window as any).hbspt;
      if (!hbspt) return;
      hbspt.forms.create({
        region: "na1",
        portalId: "49558612",
        formId: "78954872-9038-4a85-8420-ae295c46f90b",
        target: `#${containerId}`,
        onFormReady: ($form: HTMLFormElement) => {
          const ref = $form.querySelector('[name="job_reference"]') as HTMLInputElement | null;
          const title = $form.querySelector('[name="job_title"]') as HTMLInputElement | null;
          if (ref) ref.value = job.reference;
          if (title) title.value = job.title;
        },
        onFormSubmitted: () => setFormState("success"),
      });
    };

    const tryCreateForm = (attempts = 0) => {
      const hbspt = (window as any).hbspt;
      if (!hbspt) return;
      if (document.getElementById(containerId)) {
        createForm();
        return;
      }
      if (attempts < 20) setTimeout(() => tryCreateForm(attempts + 1), 150);
    };

    if ((window as any).hbspt) {
      tryCreateForm();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/embed/49558612.js";
    script.defer = true;
    script.onload = () => tryCreateForm();
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [job, activeTab]);

  const typeLabel = (type: string) => JOB_TYPE_LABELS[type]?.[lang] || type;

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#4e4e4e" }}>Chargement...</p>
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
      <section style={{ padding: isMobile ? "50px 0 30px" : "70px 0 40px" }}>
        <div className="container">
          <div
            style={{
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#4e4e4e",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              {job.reference}
            </p>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#000000",
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
                color: "#4e4e4e",
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
          <div>
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 32,
                borderBottom: "1px solid #F0EBE5",
              }}
            >
              <Link
                href={`/${urlLang}/carrieres`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "12px 24px",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#4e4e4e",
                  textDecoration: "none",
                  borderBottom: "2px solid transparent",
                  marginBottom: -1,
                  transition: "color 0.2s ease",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t.careers.detail.back}
              </Link>
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
                    color: activeTab === tab ? "#0A0A0A" : "#4e4e4e",
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
                  <div
                    style={{ fontSize: 15, lineHeight: 1.7, color: "#4e4e4e" }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(job.description) }}
                  />

                  {job.whyJoin && (
                    <>
                      <h2
                        style={{
                          fontSize: 22,
                          fontWeight: 300,
                          color: "#000000",
                          marginTop: 40,
                          marginBottom: 20,
                        }}
                      >
                        {t.careers.detail.whyJoin}
                      </h2>
                      <div
                        style={{ fontSize: 15, lineHeight: 1.7, color: "#4e4e4e" }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(job.whyJoin) }}
                      />
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
                      background: "#ffffff",
                      borderRadius: 16,
                      border: "1px solid #e5e5e5",
                      padding: "24px",
                      position: "sticky",
                      top: 24,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 300,
                        color: "#000000",
                        marginBottom: 20,
                      }}
                    >
                      {t.careers.detail.info}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Department */}
                      <div>
                        <p style={{ fontSize: 12, color: "#4e4e4e", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          {t.careers.detail.department}
                        </p>
                        <p style={{ fontSize: 14, color: "#000000", fontWeight: 500 }}>
                          {job.department}
                        </p>
                      </div>
                      {/* Type */}
                      <div>
                        <p style={{ fontSize: 12, color: "#4e4e4e", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                          {t.careers.detail.type}
                        </p>
                        <p style={{ fontSize: 14, color: "#000000", fontWeight: 500 }}>
                          {typeLabel(job.type)}
                        </p>
                      </div>
                      {/* Location */}
                      <div>
                        <p style={{ fontSize: 12, color: "#4e4e4e", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          {t.careers.detail.location}
                        </p>
                        <p style={{ fontSize: 14, color: "#000000", fontWeight: 500 }}>
                          {job.location}
                        </p>
                      </div>
                      {/* Remote */}
                      <div>
                        <p style={{ fontSize: 12, color: "#4e4e4e", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </svg>
                          {t.careers.detail.remote}
                        </p>
                        <p style={{ fontSize: 14, color: "#000000", fontWeight: 500 }}>
                          {job.remote ? t.careers.detail.remoteYes : t.careers.detail.remoteNo}
                        </p>
                      </div>
                      {/* Reference */}
                      <div>
                        <p style={{ fontSize: 12, color: "#4e4e4e", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
                          </svg>
                          {t.careers.detail.reference}
                        </p>
                        <p style={{ fontSize: 14, color: "#000000", fontWeight: 500 }}>
                          {job.reference}
                        </p>
                      </div>
                    </div>

                    {/* Share */}
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #e5e5e5", display: "flex", gap: 12 }}>
                      <button
                        onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                        title={lang === "fr" ? "Copier le lien" : "Copy link"}
                        style={shareBtnStyle}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </button>
                      <button
                        onClick={() => { window.open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(window.location.href), "_blank", "noopener"); }}
                        title="X"
                        style={shareBtnStyle}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => { window.open("https://linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(window.location.href), "_blank", "noopener"); }}
                        title="LinkedIn"
                        style={shareBtnStyle}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => { window.open("https://facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href), "_blank", "noopener"); }}
                        title="Facebook"
                        style={shareBtnStyle}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <h2
                  style={{
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 300,
                    lineHeight: 1.1,
                    color: "#000000",
                    marginBottom: 12,
                  }}
                >
                  {t.careers.detail.apply}
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#4e4e4e",
                    marginBottom: 40,
                    maxWidth: "56ch",
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
                  <div
                    id={`hs-form-${job.reference}`}
                    ref={hsFormRef}
                    style={{ background: "#fff", padding: "40px", borderRadius: 16, border: "1px solid #e5e5e5" }}
                  />
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
  fontSize: 14,
  fontWeight: 500,
  color: "#000000",
  marginBottom: 8,
  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  fontSize: 15,
  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
  border: "1px solid #e5e5e5",
  borderRadius: 10,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  lineHeight: 1.5,
};

const shareBtnStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #e5e5e5",
  borderRadius: 10,
  background: "transparent",
  cursor: "pointer",
  color: "#4e4e4e",
  transition: "background 0.18s ease, color 0.18s ease",
};
