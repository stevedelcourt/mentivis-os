"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Locale, getT } from "@/lib/i18n";
import { Job, JobType } from "@/lib/cms/types";
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
      {/* Hero */}
      <section style={{ padding: isMobile ? "40px 0 60px" : "80px 0 100px" }}>
        <div className="container">
          <div
            ref={heroV.ref}
            style={{
              maxWidth: 800,
              margin: "0 auto",
              textAlign: "center",
              opacity: heroV.visible ? 1 : 0,
              transform: heroV.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#777169",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 16,
              }}
            >
              {t.careers.hero.eyebrow}
            </p>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 500,
                lineHeight: 1.15,
                color: "#0A0A0A",
                marginBottom: 20,
              }}
            >
              {t.careers.hero.headline}
            </h1>
            <p
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "#777169",
                lineHeight: 1.5,
                marginBottom: 32,
              }}
            >
              {t.careers.hero.subheadline}
            </p>
            <button
              onClick={scrollToList}
              style={{
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 500,
                color: "#fff",
                background: "#0A0A0A",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              {t.careers.hero.cta}
            </button>
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
                fontWeight: 500,
                color: "#0A0A0A",
                marginBottom: 40,
                textAlign: "center",
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
                      fontWeight: 500,
                      color: "#0A0A0A",
                      marginBottom: 12,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#777169", lineHeight: 1.5 }}>
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
                  fontWeight: 500,
                  color: "#0A0A0A",
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
                      color: selectedDept === "all" ? "#fff" : "#3E3B38",
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
                        color: selectedDept === dept ? "#fff" : "#3E3B38",
                      }}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <p style={{ textAlign: "center", color: "#777169", padding: 40 }}>Chargement...</p>
            ) : filteredJobs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  background: "#FAFAF8",
                  borderRadius: 16,
                }}
              >
                <p style={{ color: "#777169", marginBottom: 16 }}>
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
                          fontWeight: 500,
                          color: "#0A0A0A",
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
                          color: "#777169",
                        }}
                      >
                        <span>{job.department}</span>
                        <span>{job.location}</span>
                        <span>{typeLabel(job.type)}</span>
                        <span>{job.salary}</span>
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
