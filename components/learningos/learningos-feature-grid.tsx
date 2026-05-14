"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const FEATURES = {
  fr: [
    { title: "Parcours personnalisés", desc: "Générez des parcours de formation adaptés à chaque profil, poste et objectif professionnel.", icon: "01" },
    { title: "Agents pédagogiques IA", desc: "Des agents conversationnels qui accompagnent les apprenants et répondent à leurs questions en temps réel.", icon: "02" },
    { title: "Formations certifiantes", desc: "Créez et gérez des parcours certifiants avec suivi de progression et validation des acquis.", icon: "03" },
    { title: "Dashboard compétences", desc: "Visualisez en temps réel les compétences acquises, les progrès et les écarts à combler.", icon: "04" },
    { title: "Adaptation automatique", desc: "Les contenus s'adaptent automatiquement au niveau et au rythme de chaque apprenant.", icon: "05" },
    { title: "Bibliothèque dynamique", desc: "Une bibliothèque métier alimentée par IA qui s'enrichit et se structure automatiquement.", icon: "06" },
    { title: "Reporting conformité", desc: "Générez les rapports de conformité pour vos financeurs et organismes de contrôle.", icon: "07" },
    { title: "OPCO Manager", desc: "Simplifiez le montage et le suivi de vos dossiers de financement OPCO.", icon: "08" },
  ],
  en: [
    { title: "Personalized paths", desc: "Generate training paths tailored to each profile, position, and professional goal.", icon: "01" },
    { title: "AI teaching agents", desc: "Conversational agents that accompany learners and answer their questions in real time.", icon: "02" },
    { title: "Certified training", desc: "Create and manage certified training programs with progress tracking.", icon: "03" },
    { title: "Skills dashboard", desc: "Visualize acquired skills, progress, and gaps in real time.", icon: "04" },
    { title: "Automatic adaptation", desc: "Content automatically adapts to each learner's level and pace.", icon: "05" },
    { title: "Dynamic library", desc: "An AI-powered business library that enriches and structures itself automatically.", icon: "06" },
    { title: "Compliance reporting", desc: "Generate compliance reports for your funders and oversight bodies.", icon: "07" },
    { title: "OPCO Manager", desc: "Simplify the setup and tracking of your OPCO funding applications.", icon: "08" },
  ],
};

export default function LearningOSFeatureGrid({ lang }: { lang: Locale }) {
  const features = FEATURES[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(96px, 12vw, 160px) 0",
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p
          style={{
            ...sectionAnim(visible, 0),
            marginBottom: 12,
            color: "#777169",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontWeight: 500,
            fontSize: 11,
          }}
        >
          Capacités
        </p>
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 48,
            maxWidth: 600,
          }}
        >
          {lang === "fr" ? "Tout ce dont vous avez besoin pour former à l'échelle." : "Everything you need to train at scale."}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
          className="learningos-feature-grid"
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.04),
                background: "#f5f5f5",
                borderRadius: 22,
                padding: "28px 24px 24px",
                display: "flex",
                flexDirection: "column",
                aspectRatio: "1/1",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="learningos-feature-card"
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: "auto",
                }}
              >
                {f.icon}
              </div>
              <div style={{ marginTop: "auto" }}>
                <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 8, color: "#000" }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#777169", margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .learningos-feature-card:hover {
          transform: translateY(-4px);
        }
        @media (max-width: 1024px) {
          .learningos-feature-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .learningos-feature-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
