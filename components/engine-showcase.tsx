"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";

interface OrbItem {
  title: string;
  desc: string;
  gradient: string;
}

interface ProductTab {
  id: string;
  label: string;
  subtitle: string;
  orbs: OrbItem[];
}

const TABS_FR: ProductTab[] = [
  {
    id: "os",
    label: "MentivisOS",
    subtitle: "Former",
    orbs: [
      { title: "Profil et objectif", desc: "Profil, situation actuelle, contraintes de temps, référentiel visé.", gradient: "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed 55%, #4c1d95)" },
      { title: "Diagnostic IA", desc: "Score de couverture, risque résiduel, durée estimée. Moins d'une minute.", gradient: "radial-gradient(circle at 30% 30%, #fcd34d, #d97706 55%, #92400e)" },
      { title: "Modules générés", desc: "Découpage, ordonnancement critique, profondeur ajustée au profil.", gradient: "radial-gradient(circle at 30% 30%, #fda4af, #e11d48 55%, #9f1239)" },
      { title: "Programme calibré", desc: "Théorie, projet pratique, évaluation. Module par module.", gradient: "radial-gradient(circle at 30% 30%, #93c5fd, #2563eb 55%, #1e40af)" },
      { title: "Assistant embarqué", desc: "Accompagnement intégré qui ne sort jamais du sujet.", gradient: "radial-gradient(circle at 30% 30%, #5eead4, #0d9488 55%, #115e59)" },
      { title: "Bilan d'impact", desc: "Mesure des acquis, ajustement continu, reporting clair.", gradient: "radial-gradient(circle at 30% 30%, #cbd5e1, #475569 55%, #1e293b)" },
    ],
  },
  {
    id: "talent",
    label: "TalentOS",
    subtitle: "Recruter",
    orbs: [
      { title: "Profil candidat", desc: "Compétences, expérience, objectifs de carrière.", gradient: "radial-gradient(circle at 30% 30%, #93c5fd, #2563eb 55%, #1e40af)" },
      { title: "Fiche de poste", desc: "Référentiel métier, exigences techniques, culture d'équipe.", gradient: "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed 55%, #4c1d95)" },
      { title: "Tests métier", desc: "Cas pratiques, scoring technique, mesure des acquis.", gradient: "radial-gradient(circle at 30% 30%, #fcd34d, #d97706 55%, #92400e)" },
      { title: "Adéquation générée", desc: "Score de fit, risque d'erreur, temps d'intégration estimé.", gradient: "radial-gradient(circle at 30% 30%, #fda4af, #e11d48 55%, #9f1239)" },
      { title: "Pipeline structuré", desc: "Ordonnancement des étapes, suivi par profil, décision data.", gradient: "radial-gradient(circle at 30% 30%, #5eead4, #0d9488 55%, #115e59)" },
      { title: "Onboarding ciblé", desc: "Parcours d'intégration personnalisé selon les écarts identifiés.", gradient: "radial-gradient(circle at 30% 30%, #cbd5e1, #475569 55%, #1e293b)" },
    ],
  },
  {
    id: "api",
    label: "Mentivis API",
    subtitle: "Intégrer",
    orbs: [
      { title: "Connexion système", desc: "SIRH, ERP, ATS. Sans refonte d'organisation.", gradient: "radial-gradient(circle at 30% 30%, #cbd5e1, #475569 55%, #1e293b)" },
      { title: "Flux de données", desc: "Profils, parcours, résultats. Unifié en temps réel.", gradient: "radial-gradient(circle at 30% 30%, #93c5fd, #2563eb 55%, #1e40af)" },
      { title: "Automatisation", desc: "Déclencheurs métier, workflows personnalisés.", gradient: "radial-gradient(circle at 30% 30%, #5eead4, #0d9488 55%, #115e59)" },
      { title: "Certification & OPCO", desc: "Conformité Qualiopi, justificatifs financiers générés.", gradient: "radial-gradient(circle at 30% 30%, #fcd34d, #d97706 55%, #92400e)" },
      { title: "Agents intégrés", desc: "Agents IA métier connectés à vos outils existants.", gradient: "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed 55%, #4c1d95)" },
      { title: "Évolutivité", desc: "API documentée, versioning stable, support technique.", gradient: "radial-gradient(circle at 30% 30%, #fda4af, #e11d48 55%, #9f1239)" },
    ],
  },
];

const TABS_EN: ProductTab[] = [
  {
    id: "os",
    label: "MentivisOS",
    subtitle: "Train",
    orbs: TABS_FR[0].orbs.map((o, i) => ({
      ...o,
      title: ["Profile & objective", "AI diagnostic", "Generated modules", "Calibrated program", "Embedded assistant", "Impact review"][i],
      desc: ["Profile, current situation, time constraints, target framework.", "Coverage score, residual risk, estimated duration. Under a minute.", "Breakdown, critical ordering, depth adjusted to profile.", "Theory, practical project, assessment. Module by module.", "Built-in coaching that never leaves the subject.", "Measured gains, continuous adjustment, clear reporting."][i],
    })),
  },
  {
    id: "talent",
    label: "TalentOS",
    subtitle: "Recruit",
    orbs: TABS_FR[1].orbs.map((o, i) => ({
      ...o,
      title: ["Candidate profile", "Job framework", "Skills testing", "Generated fit", "Structured pipeline", "Targeted onboarding"][i],
      desc: ["Skills, experience, career objectives.", "Job framework, technical requirements, team culture.", "Practical cases, technical scoring, skill measurement.", "Fit score, hiring risk, estimated integration time.", "Step ordering, per-profile tracking, data-driven decisions.", "Personalized integration path based on identified gaps."][i],
    })),
  },
  {
    id: "api",
    label: "Mentivis API",
    subtitle: "Integrate",
    orbs: TABS_FR[2].orbs.map((o, i) => ({
      ...o,
      title: ["System connection", "Data flows", "Automation", "Certification & OPCO", "Integrated agents", "Scalability"][i],
      desc: ["HRIS, ERP, ATS. No organizational overhaul.", "Profiles, paths, results. Unified in real time.", "Business triggers, customized workflows.", "Qualiopi compliance, financial evidence generated.", "Business AI agents connected to your existing tools.", "Documented API, stable versioning, technical support."][i],
    })),
  },
];

const FEATURES_FR = ["Diagnostic IA", "Programme adaptatif", "Assistant pédagogique", "Conformité Qualiopi", "Tableau de bord"];
const FEATURES_EN = ["AI Diagnostic", "Adaptive Program", "Pedagogical Assistant", "Qualiopi Compliance", "Dashboard"];

function circDist(a: number, b: number, n: number) {
  const d = Math.abs(a - b);
  return Math.min(d, n - d);
}
function circDir(a: number, b: number, n: number) {
  const d = a - b;
  const alt = d > 0 ? d - n : d + n;
  return Math.abs(d) <= Math.abs(alt) ? Math.sign(d) : Math.sign(alt);
}

export default function EngineShowcase({ lang }: { lang: Locale }) {
  const isFr = lang === "fr";
  const tabs = isFr ? TABS_FR : TABS_EN;
  const features = isFr ? FEATURES_FR : FEATURES_EN;
  const router = useRouter();

  const [tabIdx, setTabIdx] = useState(0);
  const [orbIdx, setOrbIdx] = useState(0);
  const [entered, setEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hovering, setHovering] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Entry observer */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setEntered(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Mobile detection */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Auto-advance */
  useEffect(() => {
    if (hovering) return;
    autoTimer.current = setInterval(() => {
      setOrbIdx((prev) => (prev + 1) % 6);
    }, 4000);
    return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
  }, [tabIdx, hovering]);

  const activeTab = tabs[tabIdx];
  const activeOrb = activeTab.orbs[orbIdx];

  const goTab = useCallback((i: number) => {
    setTabIdx(i);
    setOrbIdx(0);
  }, []);

  const goOrb = useCallback((i: number) => {
    setOrbIdx(i);
  }, []);

  const prevOrb = useCallback(() => setOrbIdx((p) => (p - 1 + 6) % 6), []);
  const nextOrb = useCallback(() => setOrbIdx((p) => (p + 1) % 6), []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#f2eee7",
        position: "relative",
        overflow: "hidden",
        padding: "48px 0 56px",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Noise filter SVG */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="orbNoise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feComponentTransfer in="grayNoise" result="alphaNoise">
              <feFuncA type="linear" slope="0.12" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="alphaNoise" mode="overlay" />
          </filter>
        </defs>
      </svg>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 28,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.35)",
              marginBottom: 10,
            }}
          >
            {isFr ? "ARCHITECTURE SYSTÈME" : "SYSTEM ARCHITECTURE"}
          </p>
          <h2
            className="t-display"
            style={{
              fontSize: "clamp(26px, 3.5vw, 40px)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#1a1a1a",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            {isFr ? "Un seul moteur. Trois modules. Un seul référentiel." : "One engine. Three modules. One framework."}
          </h2>
        </div>

        {/* ── Tabs ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginBottom: 36,
            opacity: entered ? 1 : 0,
            transition: "opacity 0.5s ease 0.1s",
            flexWrap: "wrap",
          }}
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => goTab(i)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: tabIdx === i ? 500 : 400,
                letterSpacing: "0.04em",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1.5px solid",
                borderColor: tabIdx === i ? "#1a1a1a" : "rgba(0,0,0,0.12)",
                background: tabIdx === i ? "#1a1a1a" : "transparent",
                color: tabIdx === i ? "#f2eee7" : "rgba(0,0,0,0.6)",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                transform: tabIdx === i ? "scale(1.03)" : "scale(1)",
              }}
            >
              {t.label}
              <span style={{ opacity: 0.5, marginLeft: 6, fontSize: 11, fontWeight: 300 }}>{t.subtitle}</span>
            </button>
          ))}
        </div>

        {/* ── Carousel ── */}
        <div
          style={{
            position: "relative",
            maxWidth: 720,
            margin: "0 auto 32px",
            height: isMobile ? 340 : 280,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }}
        >
          {!isMobile && (
            <>
              {/* Arrows */}
              <button
                onClick={prevOrb}
                aria-label={isFr ? "Précédent" : "Previous"}
                style={{
                  position: "absolute",
                  left: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.25s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                onClick={nextOrb}
                aria-label={isFr ? "Suivant" : "Next"}
                style={{
                  position: "absolute",
                  right: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.25s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>

              {/* 3D perspective orbs */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  perspective: "1200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {activeTab.orbs.map((orb, idx) => {
                  const dist = circDist(idx, orbIdx, 6);
                  const dir = circDir(idx, orbIdx, 6);
                  const isActive = dist === 0;

                  const tx = dist === 0 ? 0 : dist === 3 ? 0 : dir * (dist === 1 ? 100 : dist === 2 ? 190 : 0);
                  const tz = dist === 0 ? 60 : dist === 1 ? 25 : dist === 2 ? -15 : dist === 3 ? -60 : 0;
                  const sc = dist === 0 ? 1.15 : dist === 1 ? 0.9 : dist === 2 ? 0.74 : dist === 3 ? 0.6 : 0.55;
                  const op = dist === 0 ? 1 : dist === 1 ? 0.8 : dist === 2 ? 0.45 : dist === 3 ? 0.2 : 0.15;
                  const zIndex = dist === 0 ? 10 : dist === 1 ? 8 : dist === 2 ? 6 : dist === 3 ? 4 : 2;

                  return (
                    <button
                      key={`${tabIdx}-${idx}`}
                      onClick={() => goOrb(idx)}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        marginLeft: -60,
                        marginTop: -60,
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        background: "transparent",
                        transform: `translateX(${tx}px) translateZ(${tz}px) scale(${sc})`,
                        opacity: op,
                        zIndex,
                        transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      {/* Float wrapper + orb visual */}
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          background: orb.gradient,
                          filter: "url(#orbNoise)",
                          animation: `orbFloat 4s ease-in-out infinite`,
                          animationDelay: `${idx * 0.4}s`,
                          boxShadow: isActive
                            ? "0 0 0 4px rgba(255,255,255,0.4), 0 12px 40px rgba(0,0,0,0.15), inset 0 0 20px rgba(255,255,255,0.2)"
                            : "0 8px 24px rgba(0,0,0,0.1)",
                          position: "relative",
                        }}
                      >
                        {isActive && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: "50%",
                              animation: "orbPulse 2.5s ease-in-out infinite",
                            }}
                          />
                        )}
                        {isActive && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.95)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1a1a"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Mobile horizontal scroll */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                padding: "20px 24px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {activeTab.orbs.map((orb, idx) => (
                <button
                  key={`${tabIdx}-${idx}`}
                  onClick={() => goOrb(idx)}
                  style={{
                    flex: "0 0 140px",
                    scrollSnapAlign: "center",
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    background: "transparent",
                    position: "relative",
                    transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                    transform: orbIdx === idx ? "scale(1.08)" : "scale(0.95)",
                    opacity: orbIdx === idx ? 1 : 0.6,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: orb.gradient,
                      filter: "url(#orbNoise)",
                      animation: `orbFloat 4s ease-in-out infinite`,
                      animationDelay: `${idx * 0.4}s`,
                      boxShadow: orbIdx === idx
                        ? "0 0 0 3px rgba(255,255,255,0.5), 0 10px 30px rgba(0,0,0,0.12)"
                        : "0 6px 18px rgba(0,0,0,0.08)",
                      position: "relative",
                    }}
                  >
                    {orbIdx === idx && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          animation: "orbPulse 2.5s ease-in-out infinite",
                        }}
                      />
                    )}
                    {orbIdx === idx && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(0,0,0,0.12)" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#1a1a1a"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Active orb info ── */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 420,
            margin: "0 auto 36px",
            minHeight: 80,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease 0.35s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.35s",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 17,
              fontWeight: 500,
              color: "#1a1a1a",
              marginBottom: 8,
              transition: "opacity 0.35s ease",
            }}
          >
            {activeOrb.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 300,
              lineHeight: 1.6,
              color: "rgba(0,0,0,0.55)",
              transition: "opacity 0.35s ease",
            }}
          >
            {activeOrb.desc}
          </p>
        </div>

        {/* ── Feature nav ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 36,
            flexWrap: "wrap",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          {features.map((f, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.45)",
                padding: "7px 14px",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(0,0,0,0.02)",
                transition: "all 0.25s ease",
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* ── CTA ── */}
        <div
          style={{
            textAlign: "center",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.6s ease 0.6s",
          }}
        >
          <button
            onClick={() => router.push(`/${lang}/demo`)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.02em",
              padding: "14px 32px",
              borderRadius: 999,
              border: "none",
              background: "#1a1a1a",
              color: "#f2eee7",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isFr ? "Demander une démo" : "Request a demo"}
          </button>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes orbPulse {
          0%, 100% { box-shadow: 0 0 0 0px rgba(255,255,255,0); }
          50% { box-shadow: 0 0 0 12px rgba(255,255,255,0.15); }
        }
      `}</style>
    </section>
  );
}
