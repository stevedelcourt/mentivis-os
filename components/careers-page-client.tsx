"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Locale, getT } from "@/lib/i18n";
import { Job, JobType } from "@/lib/cms/types";
import CTABlock from "@/components/cta-block";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useVisible } from "@/hooks/use-visible";

interface CareersPageProps {
  lang: Locale;
}

const JOB_TYPE_LABELS: Record<string, { fr: string; en: string }> = {
  cdi: { fr: "CDI", en: "Full-time" },
  cdd: { fr: "CDD", en: "Fixed-term" },
  freelance: { fr: "Freelance", en: "Freelance" },
  stage: { fr: "Stage", en: "Internship" },
  alternance: { fr: "Alternance", en: "Work-study" },
};

export default function CareersPageClient({ lang }: CareersPageProps) {
  const t = getT(lang);
  const isMobile = useIsMobile();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const heroV = useVisible(0.2);
  const whyV = useVisible(0.1);
  const listV = useVisible(0.1);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const departments = Array.from(new Set(jobs.map((j) => j.department)));
  const filteredJobs = selectedDept === "all"
    ? jobs
    : jobs.filter((j) => j.department === selectedDept);

  const typeLabel = (type: string) => JOB_TYPE_LABELS[type]?.[lang] || type;

  const scrollToList = () => {
    document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero — Two-column Trial Program layout */}
      <section
        style={{
          padding: isMobile ? "40px 0 60px" : "80px 0 100px",
          marginBottom: 100,
          paddingBottom: 80,
          borderBottom: "1px solid var(--border-light, #e5e5e5)",
        }}
      >
        <div className="container">
          <div
            ref={heroV.ref}
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 60,
              opacity: heroV.visible ? 1 : 0,
              transform: heroV.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {/* Left column */}
            <div style={{ flex: 1, minWidth: 300 }}>
              <p
                style={{
                  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                  fontSize: "var(--text-micro, 12px)",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary, #4e4e4e)",
                  marginBottom: "1.75rem",
                }}
              >
                {t.careers.program.eyebrow}
              </p>
              <h1
                className="t-display"
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 300,
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  color: "var(--text-primary, #0A0A0A)",
                  marginBottom: "1.75rem",
                }}
              >
                {t.careers.program.title}
              </h1>
              <p
                className="t-lead"
                style={{
                  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  color: "var(--text-secondary, #4e4e4e)",
                  maxWidth: "48ch",
                  marginBottom: "1.75rem",
                }}
              >
                {t.careers.program.description}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 1.75rem 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {t.careers.program.features.map((feature: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: "1.0625rem",
                      color: "var(--text-primary, #0A0A0A)",
                      lineHeight: 1.4,
                    }}
                  >
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, color: "var(--text-tertiary, #4e4e4e)" }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={scrollToList}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 20px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#FFFFFF",
                  background: "#0A0A0A",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#222";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0A0A0A";
                }}
              >
                {t.careers.program.cta}
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Right column */}
            <div
              style={{
                flex: isMobile ? "1 1 100%" : "0 0 380px",
                width: isMobile ? "100%" : 380,
                height: isMobile ? "auto" : 380,
                aspectRatio: isMobile ? "2 / 1" : "1 / 1",
                position: "relative",
                order: isMobile ? 2 : 0,
              }}
            >
              <img
                src="/images/team/chat%20window.avif"
                alt="MentivisOS chat interface"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 24,
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section style={{ padding: isMobile ? "40px 0" : "60px 0", background: "#FAFAF8" }}>
        <div className="container">
          <div
            ref={whyV.ref}
            style={{
              opacity: whyV.visible ? 1 : 0,
              transform: whyV.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 300,
                color: "#000000",
                marginBottom: 40,
              }}
            >
              {t.careers.whyJoin.title}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
                gap: 24,
              }}
            >
              {t.careers.whyJoin.cards.map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "24px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 300,
                      color: "#000000",
                      marginBottom: 12,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#4e4e4e", lineHeight: 1.5 }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" style={{ padding: isMobile ? "40px 0" : "80px 0" }}>
        <div className="container">
          <div
            ref={listV.ref}
            style={{
              opacity: listV.visible ? 1 : 0,
              transform: listV.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: 32,
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 300,
                  color: "#000000",
                }}
              >
                {t.careers.list.title}
              </h2>
              {departments.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setSelectedDept("all")}
                    style={{
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      borderRadius: 999,
                      border: "none",
                      cursor: "pointer",
                      background: selectedDept === "all" ? "#0A0A0A" : "#E5E0DA",
                      color: selectedDept === "all" ? "#fff" : "#4e4e4e",
                    }}
                  >
                    {t.careers.list.allDepartments}
                  </button>
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      style={{
                        padding: "8px 16px",
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: 999,
                        border: "none",
                        cursor: "pointer",
                        background: selectedDept === dept ? "#0A0A0A" : "#E5E0DA",
                        color: selectedDept === dept ? "#fff" : "#4e4e4e",
                      }}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <p style={{ textAlign: "center", color: "#4e4e4e", padding: 40 }}>Chargement...</p>
            ) : filteredJobs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  background: "#FAFAF8",
                  borderRadius: 16,
                }}
              >
                <p style={{ color: "#4e4e4e", marginBottom: 16 }}>
                  {t.careers.list.empty}
                </p>
                <Link
                  href={`/${lang}/contact`}
                  style={{
                    color: "#0A0A0A",
                    fontWeight: 500,
                    textDecoration: "underline",
                  }}
                >
                  {t.careers.form.title}
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/${lang}/carrieres/${job.slug}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 16,
                      padding: "24px",
                      background: "#fff",
                      borderRadius: 16,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      textDecoration: "none",
                      transition: "box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 300,
                          color: "#000000",
                          marginBottom: 8,
                        }}
                      >
                        {job.title}
                      </h3>
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
                    <span
                      style={{
                        padding: "10px 20px",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#0A0A0A",
                        background: "#F0F0F0",
                        borderRadius: 10,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.careers.list.readMore}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABlock lang={lang} variant="final" />
    </>
  );
}
