"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

const PARADIGM_FR = [
  { trad: "Logique traditionnelle", menti: "Logique MentivisOS", items: [
    "Le contenu est figé, l'apprenant s'adapte",
    "On mesure la complétion",
    "Un programme unique pour tous",
  ]},
  { trad: "Logique traditionnelle", menti: "Logique MentivisOS", items: [
    "Le parcours s'adapte à chaque apprenant",
    "On mesure l'acquisition réelle, compétence par compétence",
    "Un programme individuel, recalculé à chaque étape",
  ]},
];

const PARADIGM_EN = [
  { trad: "Traditional logic", menti: "MentivisOS logic", items: [
    "Content is fixed, the learner adapts",
    "Completion is measured",
    "One program for all",
  ]},
  { trad: "Traditional logic", menti: "MentivisOS logic", items: [
    "The path adapts to each learner",
    "Real acquisition is measured, skill by skill",
    "An individual program, recalculated at each step",
  ]},
];

const PAIN_POINTS_FR = [
  { title: "Individualisation à grande échelle.", body: "Différencier un parcours pour des centaines d'apprenants, avec des équipes limitées, est impossible sans IA native. MentivisOS automatise le diagnostic, la construction et l'ajustement du parcours." },
  { title: "Décrochage en formation.", body: "En calibrant chaque parcours sur le niveau réel d'entrée, MentivisOS réduit l'écart entre rythme imposé et capacité de l'apprenant." },
  { title: "Preuve de l'acquisition de compétences.", body: "Les financeurs (OPCO, France Compétences, Régions) exigent une traçabilité fine, au-delà du simple taux de complétion. MentivisOS la produit nativement, compétence par compétence." },
  { title: "Charge des équipes pédagogiques.", body: "L'IA prend en charge la génération et l'ajustement des parcours, vos formateurs se concentrent sur l'accompagnement." },
];

const PAIN_POINTS_EN = [
  { title: "Individualization at scale.", body: "Differentiating paths for hundreds of learners with limited teams is impossible without native AI. MentivisOS automates diagnosis, construction and path adjustment." },
  { title: "Dropout in training.", body: "By calibrating each path to the real entry level, MentivisOS reduces the gap between imposed pace and learner capacity." },
  { title: "Proof of skill acquisition.", body: "Funders require fine-grained traceability beyond simple completion rates. MentivisOS produces it natively, skill by skill." },
  { title: "Teaching team workload.", body: "AI handles path generation and adjustment; your trainers focus on accompaniment." },
];

const DEPLOYMENT_FR = {
  title: "Déploiement en un mois maximum",
  body: "Setup mené en 15 jours calendaires : cadrage, configuration de l'instance et de votre identité visuelle, tests et recette conjointe, mise en production et formation des équipes. Aucune intégration technique lourde côté organisme.",
};

const DEPLOYMENT_EN = {
  title: "Deployment in one month maximum",
  body: "Setup completed in 15 calendar days: scoping, instance configuration and your visual identity, tests and joint acceptance, production deployment and team training. No heavy technical integration on your side.",
};

const INSTANCE_FR = {
  title: "Une instance dédiée",
  body: "Votre logo et votre identité visuelle sur l'ensemble des interfaces. Espace d'administration dédié pour votre équipe. Tableau de bord de suivi par apprenant et par cohorte. Intégration de vos référentiels de compétences et connecteurs avec vos outils existants.",
};

const INSTANCE_EN = {
  title: "A dedicated instance",
  body: "Your logo and visual identity across all interfaces. Dedicated admin space for your team. Dashboard per learner and per cohort. Integration of your skills frameworks and connectors to your existing tools.",
};

export default function EducationPipeline({ lang }: { lang: string }) {
  const { ref, visible } = useVisible(0.05);
  const isFr = lang === "fr";
  const paradigm = isFr ? PARADIGM_FR : PARADIGM_EN;
  const painPoints = isFr ? PAIN_POINTS_FR : PAIN_POINTS_EN;
  const deployment = isFr ? DEPLOYMENT_FR : DEPLOYMENT_EN;
  const instance = isFr ? INSTANCE_FR : INSTANCE_EN;

  return (
    <>
      {/* Paradigm change */}
      <section ref={ref} style={{ background: "#ffffff", padding: "clamp(96px, 12vw, 160px) 0" }}>
        <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <p
            style={{
              ...sectionAnim(visible, 0),
              marginBottom: 12,
              color: "#4e4e4e",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontWeight: 500,
              fontSize: 11,
            }}
          >
            {isFr ? "CHANGEMENT DE PARADIGME" : "PARADIGM SHIFT"}
          </p>
          <h2
            style={{
              ...sectionAnim(visible, 0.05),
              fontWeight: 300,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 24,
              maxWidth: 600,
            }}
          >
            {isFr ? "Un changement de paradigme" : "A paradigm shift"}
          </h2>
          <p
            style={{
              ...sectionAnim(visible, 0.1),
              color: "#4e4e4e",
              fontSize: 16,
              lineHeight: 1.7,
              maxWidth: 640,
              marginBottom: 40,
            }}
          >
            {isFr
              ? "Les dispositifs de formation actuels diffusent le même contenu, dans le même ordre, au même rythme, à des apprenants qui n'ont ni les mêmes acquis, ni les mêmes objectifs, ni le même temps disponible. MentivisOS renverse cette logique."
              : "Current training systems deliver the same content, in the same order, at the same pace, to learners who don't share the same background, goals, or available time. MentivisOS reverses this logic."}
          </p>
          <div
            style={{
              ...sectionAnim(visible, 0.15),
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: "var(--border-light)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {paradigm[0].items.map((item, i) => (
              <div key={`t-${i}`} style={{ background: "var(--bg-primary)", padding: 20 }}>
                <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 4 }}>{paradigm[0].trad}</p>
                <p style={{ fontSize: "var(--text-caption)", color: "var(--text-tertiary)", lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
            {paradigm[1].items.map((item, i) => (
              <div key={`m-${i}`} style={{ background: "var(--bg-primary)", padding: 20 }}>
                <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 4 }}>{paradigm[1].menti}</p>
                <p style={{ fontSize: "var(--text-caption)", color: "var(--text-tertiary)", lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section style={{ background: "#f8f8f8", padding: "clamp(96px, 12vw, 160px) 0" }}>
        <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <p
            style={{
              marginBottom: 12,
              color: "#4e4e4e",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontWeight: 500,
              fontSize: 11,
            }}
          >
            {isFr ? "CE À QUOI MENTIVISOS RÉPOND" : "WHAT MENTIVISOS ADDRESSES"}
          </p>
          <h2
            style={{
              fontWeight: 300,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 48,
              maxWidth: 600,
            }}
          >
            {isFr ? "Ce à quoi MentivisOS répond" : "What MentivisOS addresses"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {painPoints.map((item) => (
              <div key={item.title}>
                <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 8 }}>{item.title}</p>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment */}
      <section style={{ background: "#ffffff", padding: "clamp(96px, 12vw, 160px) 0" }}>
        <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <h2
            style={{
              fontWeight: 300,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 24,
              maxWidth: 600,
            }}
          >
            {deployment.title}
          </h2>
          <p style={{ color: "#4e4e4e", fontSize: 16, lineHeight: 1.7, maxWidth: 640 }}>{deployment.body}</p>
        </div>
      </section>

      {/* Dedicated instance */}
      <section style={{ background: "#f8f8f8", padding: "clamp(96px, 12vw, 160px) 0" }}>
        <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <h2
            style={{
              fontWeight: 300,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 24,
              maxWidth: 600,
            }}
          >
            {instance.title}
          </h2>
          <p style={{ color: "#4e4e4e", fontSize: 16, lineHeight: 1.7, maxWidth: 640 }}>{instance.body}</p>
        </div>
      </section>
    </>
  );
}
