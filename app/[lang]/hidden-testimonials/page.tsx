import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Témoignages — MentivisOS" : "Testimonials — MentivisOS",
    robots: { index: false, follow: false },
  };
}

interface Sector {
  id: string;
  labelFr: string;
  labelEn: string;
}

interface Interview {
  id: string;
  sector: string;
  date: string;
  titleFr: string;
  titleEn: string;
  interviewee: string;
  roleFr: string;
  roleEn: string;
  rating: string;
  module: string;
  duration: string;
  questions: { qFr: string; qEn: string; aFr: string; aEn: string }[];
  bioFr: string;
  bioEn: string;
}

const sectors: Sector[] = [
  { id: "sante", labelFr: "Santé", labelEn: "Healthcare" },
];

const interviews: Interview[] = [
  {
    id: "dr-f",
    sector: "sante",
    date: "2026-05-25",
    titleFr: "Un outil qui oblige le manager hospitalier à se confronter à la complexité réelle du terrain",
    titleEn: "A tool that forces hospital managers to confront the real complexity of the field",
    interviewee: "Dr F.",
    roleFr: "Médecin anesthésiste-réanimatrice, centre hospitalo-universitaire",
    roleEn: "Anesthesiologist and intensivist, teaching hospital",
    rating: "8/10",
    module: "Implémentations PROM en Nordiques : analyse comparée",
    duration: "18 heures, 14 sections",
    questions: [
      {
        qFr: "Vous avez parcouru l'intégralité du module. Première réaction ?",
        qEn: "You've gone through the entire module. First reaction?",
        aFr: "La première chose qui frappe, c'est la densité. On est sur 18 heures de formation, 14 sections, avec une progression qui part des fondamentaux instrumentaux, traverse quatre systèmes de santé nationaux, et arrive jusqu'à la simulation d'une stratégie locale d'implémentation. Ce n'est pas un survol. C'est un vrai parcours structuré, avec une logique pédagogique qui tient la route du début à la fin.",
        aEn: "The first thing that strikes you is the density. It's 18 hours of training, 14 sections, with a progression that starts from the instrumental fundamentals, goes through four national healthcare systems, and arrives at the simulation of a local implementation strategy. This is not an overview. It's a real structured program with a pedagogical logic that holds up from start to finish.",
      },
      {
        qFr: "Vous avez vérifié les sources et la bibliographie. Qu'en est-il ?",
        qEn: "You checked the sources and bibliography. What did you find?",
        aFr: "C'est le point qui m'a le plus surprise, franchement. Les sources citées sont correctes. Les références scientifiques existent. La bibliographie est cohérente avec l'état de la littérature sur les PROM. On retrouve les bons instruments, les bonnes agences, les bons acteurs institutionnels. Le SF-36, l'EQ-5D, la Socialstyrelsen, Helsedirektoratet, le THL finlandais, tout cela est factuel. Les mécanismes de gouvernance décrits pour chaque pays nordique correspondent à ce qu'on connaît de ces systèmes. Ce n'est pas de la fiction déguisée en pédagogie.",
        aEn: "That's the point that surprised me most, frankly. The cited sources are correct. The scientific references exist. The bibliography is consistent with the state of the literature on PROMs. The right instruments are there, the right agencies, the right institutional actors. SF-36, EQ-5D, Socialstyrelsen, Helsedirektoratet, the Finnish THL - all factual. The governance mechanisms described for each Nordic country match what we know about these systems. This isn't fiction disguised as pedagogy.",
      },
      {
        qFr: "Quelle note donneriez-vous au module, sur 10 ?",
        qEn: "What score would you give the module, out of 10?",
        aFr: "8 sur 10. Et je ne donne pas 8 facilement.",
        aEn: "8 out of 10. And I don't give out 8s easily.",
      },
      {
        qFr: "Qu'est-ce qui manque pour aller à 9 ou 10 ?",
        qEn: "What's missing to get to 9 or 10?",
        aFr: "Deux choses principalement. D'abord, l'assistant pédagogique intégré au module était initialement trop serré dans ses réponses. Quand un apprenant posait une question qui débordait légèrement du cadre strict de la section, il se refermait au lieu d'accompagner la réflexion. Ça a été corrigé en cours de route, et la version actuelle est beaucoup plus fluide. Ensuite, il manquait certaines fonctionnalités pratiques : la possibilité de prendre des notes directement dans le module et d'exporter ses travaux. Ces deux ajouts ont été implémentés depuis, et ils changent l'expérience d'apprentissage. Avec ces améliorations, on est sur un outil qui commence à rivaliser avec des plateformes professionnelles établies, sauf qu'ici le contenu est généré et adaptatif.",
        aEn: "Two things mainly. First, the integrated pedagogical assistant was initially too tight in its responses. When a learner asked a question slightly outside the strict framework of the section, it would shut down instead of supporting reflection. That was corrected along the way, and the current version is much more fluid. Second, some practical features were missing: the ability to take notes directly in the module and export your work. Both additions have since been implemented, and they change the learning experience. With these improvements, it's a tool that's starting to rival established professional platforms, except here the content is generated and adaptive.",
      },
      {
        qFr: "En tant que médecin ayant exercé des responsabilités en santé publique en région, qu'est-ce qui vous a le plus interpellée dans le contenu ?",
        qEn: "As a physician who held public health responsibilities at a regional level, what struck you most in the content?",
        aFr: "L'analyse comparative des quatre modèles nordiques est remarquablement bien construite. Le module ne se contente pas de décrire chaque pays en silo. Il fait ressortir les mécanismes profonds : pourquoi la Norvège peut imposer et pas la Finlande, pourquoi la Suède réussit par le prestige régional et le benchmarking, pourquoi le Danemark avance par convergence volontaire. Quand on a travaillé sur la pertinence des soins à l'échelle régionale, on reconnaît immédiatement ces dynamiques. Le parallèle avec le contexte français est implicite dans tout le module, et c'est très bien fait. On n'est jamais dans la transposition naïve du type « il faut faire comme la Suède ». On est dans l'analyse des conditions de possibilité.",
        aEn: "The comparative analysis of the four Nordic models is remarkably well constructed. The module doesn't just describe each country in a silo. It brings out the deep mechanisms: why Norway can impose and Finland can't, why Sweden succeeds through regional prestige and benchmarking, why Denmark advances through voluntary convergence. When you've worked on healthcare relevance at a regional level, you immediately recognize these dynamics. The parallel with the French context is implicit throughout the module, and that's very well done. It's never a naive transposition like 'we should do what Sweden does.' It's an analysis of the conditions of possibility.",
      },
      {
        qFr: "Le module est destiné à des médecins managers d'équipe. Est-il adapté à ce public ?",
        qEn: "The module is intended for physician team managers. Is it suited for this audience?",
        aFr: "Oui, et c'est là où le module est fort. Il parle la langue du manager hospitalier, pas celle du chercheur en psychométrie. Les PROM sont présentées comme des outils de pilotage, pas comme des curiosités méthodologiques. Les exercices obligent l'apprenant à se positionner : « Vous êtes directeur clinique, vous recevez ce rapport, que faites-vous ? » C'est exactement le bon niveau de mise en situation. Le cas concret du comté d'Uppsala, par exemple, est très parlant. On voit un taux de complétude qui passe de 25 à 65% en six mois grâce à des ajustements itératifs. C'est réaliste. C'est ce qu'on vit quand on déploie un nouvel outil en milieu hospitalier.",
        aEn: "Yes, and that's where the module excels. It speaks the language of the hospital manager, not the psychometrics researcher. PROMs are presented as management tools, not methodological curiosities. The exercises force the learner to take a position: 'You're a clinical director, you receive this report, what do you do?' That's exactly the right level of scenario. The concrete case of Uppsala County, for example, is very telling. You see completion rates go from 25% to 65% in six months through iterative adjustments. It's realistic. It's what you experience when deploying a new tool in a hospital setting.",
      },
      {
        qFr: "Qu'avez-vous pensé de l'utilisation du modèle de Kotter et de la courbe de Rogers dans le module ?",
        qEn: "What did you think of the use of Kotter's model and Rogers' curve in the module?",
        aFr: "C'est pertinent parce que c'est ancré dans les cas réels. Le module ne plaque pas Kotter sur les PROM comme un exercice académique. Il montre comment chaque étape du modèle s'est concrètement jouée en Suède ou en Norvège. La courbe de Rogers appliquée à un hôpital de 600 cliniciens, avec les chiffres par catégorie d'adoptants, c'est immédiatement opérationnel. Un manager peut se dire : « J'ai 15 innovateurs, 81 early adopters, je commence par eux. » C'est du management du changement concret, pas de la théorie.",
        aEn: "It's relevant because it's anchored in real cases. The module doesn't force Kotter onto PROMs as an academic exercise. It shows how each step of the model actually played out in Sweden or Norway. Rogers' curve applied to a 600-clinician hospital, with numbers by adopter category - that's immediately operational. A manager can think: 'I have 15 innovators, 81 early adopters, I start with them.' That's concrete change management, not theory.",
      },
      {
        qFr: "Un mot sur l'aspect généré par l'IA. Cela change-t-il quelque chose à votre appréciation ?",
        qEn: "A word on the AI-generated aspect. Does it change your assessment?",
        aFr: "Ce qui compte, c'est la qualité du produit final. Qu'il soit généré par une IA ou rédigé par un expert humain, je l'évalue avec les mêmes critères : rigueur factuelle, cohérence pédagogique, pertinence clinique, utilité managériale. Sur ces quatre dimensions, le module tient. L'IA apporte un avantage que l'humain n'a pas dans ce contexte : la capacité à générer un volume pédagogique structuré, adaptatif, et personnalisé à la progression de l'apprenant. Un formateur humain seul ne produirait pas 14 sections de cette densité en un temps comparable. L'IA n'est pas un raccourci ici. C'est un multiplicateur de capacité pédagogique.",
        aEn: "What matters is the quality of the final product. Whether generated by AI or written by a human expert, I evaluate it by the same criteria: factual rigor, pedagogical coherence, clinical relevance, managerial usefulness. On all four dimensions, the module holds up. AI brings an advantage that humans don't have in this context: the ability to generate a structured, adaptive pedagogical volume personalized to the learner's progression. A single human trainer wouldn't produce 14 sections of this density in comparable time. AI isn't a shortcut here. It's a multiplier of pedagogical capacity.",
      },
      {
        qFr: "Recommanderiez-vous ce module à des collègues ?",
        qEn: "Would you recommend this module to colleagues?",
        aFr: "À des médecins managers qui s'intéressent à l'expérience patient mesurée et à la gouvernance de la qualité, oui. Le module donne une culture comparative solide sur les PROM nordiques, des outils d'analyse du changement organisationnel, et une méthodologie pour anticiper les résistances avant de lancer une implémentation. C'est exactement le type de formation qui manque dans le paysage français : pas assez académique pour ennuyer, pas assez superficiel pour décevoir.",
        aEn: "To physician managers interested in measured patient experience and quality governance, yes. The module provides a solid comparative foundation on Nordic PROMs, tools for analyzing organizational change, and a methodology for anticipating resistance before launching an implementation. It's exactly the type of training missing from the French landscape: not academic enough to bore, not superficial enough to disappoint.",
      },
    ],
    bioFr: `Le Dr F. est médecin anesthésiste-réanimatrice, spécialisée en médecine de la douleur, oncologie et santé publique. Elle exerce au sein d'un centre hospitalo-universitaire, au département d'anesthésie et de réanimation polyvalente. Son activité clinique couvre la prise en charge péri-opératoire en chirurgie oncologique, les soins critiques des patients atteints de cancer et l'accompagnement dans la gestion de la douleur cancéreuse.

Titulaire d'une expertise transversale intégrant anesthésie, réanimation, qualité des soins et expérience patient, elle développe une approche centrée sur l'optimisation des parcours de soins, de la phase pré-opératoire au suivi post-interventionnel, en intégrant les protocoles de réhabilitation améliorée après chirurgie (ERAS).

En recherche clinique, elle est premier auteur d'une étude publiée dans une revue internationale de réanimation portant sur l'impact d'un système informatisé d'aide à la décision sur la gestion nutritionnelle chez des patients en soins critiques.

Parallèlement à son activité hospitalière, elle a exercé des responsabilités institutionnelles majeures au sein d'une agence régionale de santé comme médecin référent en chirurgie, virage ambulatoire et soins critiques, et chargée de mission pertinence. Elle est intervenue lors de la première journée régionale sur la pertinence des soins organisée conjointement par l'agence et l'instance régionale compétente.

Son parcours reflète une expertise rare à la croisée de quatre dimensions complémentaires : la médecine clinique de haute intensité en cancérologie, la recherche sur les soins critiques en onco-hématologie, la médecine de la douleur, et la gouvernance des politiques de santé à l'échelle régionale.`,
    bioEn: `Dr F. is an anesthesiologist and intensivist specializing in pain medicine, oncology, and public health. She practices at a teaching hospital within the anesthesiology and intensive care department. Her clinical work covers peri-operative management in oncologic surgery, critical care for cancer patients, and cancer pain management.

With cross-disciplinary expertise integrating anesthesia, intensive care, quality of care, and patient experience, she develops a patient-centered approach optimizing care pathways from pre-operative phase through post-intervention follow-up, integrating enhanced recovery after surgery (ERAS) protocols.

In clinical research, she is first author of a study published in an international critical care journal examining the impact of a clinical decision support system on nutritional management in intensive care patients.

Alongside her hospital work, she held major institutional responsibilities at a regional health agency as Referent Physician for surgery, outpatient care, and critical care, and mission lead for healthcare relevance. She spoke at the first regional conference on healthcare relevance organized jointly by the agency and the competent regional body.

Her career reflects a rare expertise at the intersection of four complementary dimensions: high-intensity clinical medicine in oncology, critical care research in onco-hematology, pain medicine, and regional healthcare policy governance.`,
  },
];

function Sidebar({ sectors, interviews, isFr, activeId }: { sectors: Sector[]; interviews: Interview[]; isFr: boolean; activeId: string }) {
  return (
    <nav style={sidebarStyle}>
      <Link
        href={`/${isFr ? "fr" : "en"}`}
        style={backLinkStyle}
      >
        &larr; {isFr ? "Retour" : "Back"}
      </Link>

      <p style={sidebarTitleStyle}>
        {isFr ? "Témoignages" : "Testimonials"}
      </p>

      {sectors.map((sector) => {
        const sectorInterviews = interviews.filter((i) => i.sector === sector.id);
        if (sectorInterviews.length === 0) return null;
        return (
          <div key={sector.id} style={sectorGroupStyle}>
            <p style={sectorLabelStyle}>
              {isFr ? sector.labelFr : sector.labelEn}
            </p>
            {sectorInterviews.map((interview) => (
              <a
                key={interview.id}
                href={`#${interview.id}`}
                style={{
                  ...caseLinkStyle,
                  ...(activeId === interview.id ? activeCaseLinkStyle : {}),
                }}
              >
                <span style={caseLinkBadgeStyle}>{interview.rating}</span>
                <span>{interview.interviewee}</span>
              </a>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

function InterviewCard({ interview, isFr }: { interview: Interview; isFr: boolean }) {
  return (
    <article id={interview.id} style={interviewCardStyle}>
      <header style={interviewHeaderStyle}>
        <div style={metaRowStyle}>
          <span style={badgeStyle}>{interview.rating}</span>
          <span style={metaStyle}>{isFr ? "Module" : "Module"} : {interview.module}</span>
          <span style={metaStyle}>{interview.duration}</span>
          <span style={metaStyle}>{interview.date}</span>
        </div>
        <p style={subtitleStyle}>
          {isFr ? interview.titleFr : interview.titleEn}
        </p>
        <p style={bylineStyle}>
          {isFr ? "Entretien avec " : "Interview with "}<strong>{interview.interviewee}</strong>
          <br />
          <span style={roleStyle}>{isFr ? interview.roleFr : interview.roleEn}</span>
        </p>
      </header>

      <div style={qaSectionStyle}>
        {interview.questions.map((item, i) => (
          <div key={i} style={qaItemStyle}>
            <p style={qStyle}>
              <strong>{isFr ? "Mentivis" : "Mentivis"} :</strong> {isFr ? item.qFr : item.qEn}
            </p>
            <p style={aStyle}>
              <strong>{interview.interviewee} :</strong> {isFr ? item.aFr : item.aEn}
            </p>
          </div>
        ))}
      </div>

      <details style={bioDetailsStyle}>
        <summary style={bioSummaryStyle}>
          {isFr ? "Biographie" : "Biography"}
        </summary>
        <div style={bioContentStyle}>
          {(isFr ? interview.bioFr : interview.bioEn).split("\n\n").map((p, i) => (
            <p key={i} style={bioPStyle}>{p.trim()}</p>
          ))}
        </div>
      </details>
    </article>
  );
}

export default async function HiddenTestimonialsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <main style={pageStyle}>
      <Sidebar sectors={sectors} interviews={interviews} isFr={isFr} activeId="" />
      <div style={contentStyle}>
        <h1 style={h1Style}>
          {isFr ? "Témoignages" : "Testimonials"}
        </h1>
        <p style={pageDescStyle}>
          {isFr
            ? "Entretiens avec des experts et cliniciens ayant testé des modules générés par l'assistant pédagogique Mentivis."
            : "Interviews with experts and clinicians who tested modules generated by the Mentivis pedagogical assistant."}
        </p>

        {interviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} isFr={isFr} />
        ))}
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  background: "#ffffff",
  minHeight: "100vh",
  display: "flex",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif",
  lineHeight: 1.7,
  color: "#1a1a1a",
};

const sidebarStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  height: "100vh",
  width: 220,
  flexShrink: 0,
  padding: "40px 16px",
  borderRight: "1px solid #eee",
  overflowY: "auto",
};

const backLinkStyle: React.CSSProperties = {
  display: "inline-block",
  marginBottom: 24,
  color: "#888",
  textDecoration: "underline",
  fontSize: 13,
};

const sidebarTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  margin: "0 0 20px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#999",
};

const sectorGroupStyle: React.CSSProperties = {
  marginBottom: 24,
};

const sectorLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#bbb",
  margin: "0 0 8px",
};

const caseLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 8px",
  borderRadius: 6,
  fontSize: 13,
  color: "#444",
  textDecoration: "none",
  transition: "background 0.15s",
};

const activeCaseLinkStyle: React.CSSProperties = {
  background: "#f5f5f5",
  fontWeight: 600,
  color: "#111",
};

const caseLinkBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 18,
  borderRadius: 4,
  background: "#111",
  color: "#fff",
  fontSize: 10,
  fontWeight: 600,
  flexShrink: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  maxWidth: 760,
  padding: "48px 48px 120px",
};

const h1Style: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  margin: "0 0 8px",
  letterSpacing: "-0.02em",
};

const pageDescStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#666",
  margin: "0 0 48px",
  lineHeight: 1.6,
};

const interviewCardStyle: React.CSSProperties = {
  marginBottom: 80,
  paddingBottom: 56,
};

const interviewHeaderStyle: React.CSSProperties = {
  marginBottom: 40,
};

const metaRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  alignItems: "center",
  marginBottom: 20,
  fontSize: 13,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "#111",
  color: "#fff",
  padding: "2px 10px",
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 13,
};

const metaStyle: React.CSSProperties = {
  color: "#888",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  lineHeight: 1.4,
  margin: "0 0 12px",
  letterSpacing: "-0.01em",
};

const bylineStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#555",
  margin: 0,
  lineHeight: 1.6,
};

const roleStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#888",
};

const qaSectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 32,
};

const qaItemStyle: React.CSSProperties = {
  borderLeft: "2px solid #e5e5e5",
  paddingLeft: 20,
};

const qStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: 14,
  lineHeight: 1.6,
};

const aStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.7,
  color: "#333",
};

const bioDetailsStyle: React.CSSProperties = {
  marginTop: 40,
  borderTop: "1px solid #eee",
  paddingTop: 20,
};

const bioSummaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
  color: "#555",
  userSelect: "none",
};

const bioContentStyle: React.CSSProperties = {
  marginTop: 16,
};

const bioPStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#555",
  margin: "0 0 12px",
};
