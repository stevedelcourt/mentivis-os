import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Témoignages - MentivisOS" : "Testimonials - MentivisOS",
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
  { id: "droit-conformite", labelFr: "Droit et conformité financière", labelEn: "Financial Law and Compliance" },
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
  {
    id: "me-v",
    sector: "droit-conformite",
    date: "2026-05-20",
    titleFr: "Un module qui oblige le juriste enforcement à penser au-delà de ses réflexes habituels de screening",
    titleEn: "Un module qui oblige le juriste enforcement à penser au-delà de ses réflexes habituels de screening",
    interviewee: "Me V.",
    roleFr: "Legal Adviser, Enforcement Division, Office of Financial Sanctions Implementation (OFSI), HM Treasury, Londres",
    roleEn: "Legal Adviser, Enforcement Division, Office of Financial Sanctions Implementation (OFSI), HM Treasury, Londres",
    rating: "9/10",
    module: "Personnes désignées et régimes de sanctions au Royaume-Uni : cartographie opérationnelle pour l'enforcement",
    duration: "22 heures, 16 sections",
    questions: [
      {
        qFr: "Vous avez parcouru l'intégralité du module. Première réaction ?",
        qEn: "Vous avez parcouru l'intégralité du module. Première réaction ?",
        aFr: "Ce qui frappe d'entrée, c'est l'ampleur du périmètre couvert. On est sur 22 heures de formation, 16 sections, et le module ne se limite pas à la question russe. C'est le premier point que je veux souligner, parce que dans mon quotidien à l'OFSI, depuis 2022, la quasi-totalité de la pression institutionnelle et de l'attention publique se sont concentrées sur le régime Russie. Ce module replace ce régime dans un contexte beaucoup plus large : le contre-terrorisme domestique et international, ISIL et Al-Qaida, les armes chimiques, la non-prolifération nucléaire, la Global Human Rights, la Global Anti-Corruption, le cyber, les migrations irrégulières. Le traitement est systématique. Chaque régime fait l'objet d'une section propre, avec sa base légale dans le Sanctions and Anti-Money Laundering Act 2018, ses statutory instruments, ses mécanismes de désignation, ses critères spécifiques et ses licensing grounds. C'est un vrai parcours structuré, pas une compilation.",
        aEn: "Ce qui frappe d'entrée, c'est l'ampleur du périmètre couvert. On est sur 22 heures de formation, 16 sections, et le module ne se limite pas à la question russe. C'est le premier point que je veux souligner, parce que dans mon quotidien à l'OFSI, depuis 2022, la quasi-totalité de la pression institutionnelle et de l'attention publique se sont concentrées sur le régime Russie. Ce module replace ce régime dans un contexte beaucoup plus large : le contre-terrorisme domestique et international, ISIL et Al-Qaida, les armes chimiques, la non-prolifération nucléaire, la Global Human Rights, la Global Anti-Corruption, le cyber, les migrations irrégulières. Le traitement est systématique. Chaque régime fait l'objet d'une section propre, avec sa base légale dans le Sanctions and Anti-Money Laundering Act 2018, ses statutory instruments, ses mécanismes de désignation, ses critères spécifiques et ses licensing grounds. C'est un vrai parcours structuré, pas une compilation.",
      },
      {
        qFr: "Vous avez vérifié les sources et la bibliographie. Qu'en est-il ?",
        qEn: "Vous avez vérifié les sources et la bibliographie. Qu'en est-il ?",
        aFr: "C'est là que j'ai été le plus exigeante, évidemment. Les textes cités sont corrects. Les statutory instruments correspondent aux bons régimes. La hiérarchie entre les obligations ONU transposées et les régimes autonomes du Royaume-Uni est correctement restituée. On retrouve les bons acteurs institutionnels : OFSI évidemment, mais aussi le FCDO pour les désignations, le NCA pour les enquêtes criminelles, la FCA pour la supervision des firmes régulées. Le module mentionne la transition vers la UK Sanctions List unique depuis janvier 2026 et le retrait de l'OFSI Consolidated List, ce qui prouve une mise à jour très récente. Les références à la cross-government review de mai 2025 et au nouveau cadre enforcement publié en février 2026 par Giles Thomson sont exactes. Ce niveau de précision institutionnelle est rare dans un contenu de formation, a fortiori un contenu généré.",
        aEn: "C'est là que j'ai été le plus exigeante, évidemment. Les textes cités sont corrects. Les statutory instruments correspondent aux bons régimes. La hiérarchie entre les obligations ONU transposées et les régimes autonomes du Royaume-Uni est correctement restituée. On retrouve les bons acteurs institutionnels : OFSI évidemment, mais aussi le FCDO pour les désignations, le NCA pour les enquêtes criminelles, la FCA pour la supervision des firmes régulées. Le module mentionne la transition vers la UK Sanctions List unique depuis janvier 2026 et le retrait de l'OFSI Consolidated List, ce qui prouve une mise à jour très récente. Les références à la cross-government review de mai 2025 et au nouveau cadre enforcement publié en février 2026 par Giles Thomson sont exactes. Ce niveau de précision institutionnelle est rare dans un contenu de formation, a fortiori un contenu généré.",
      },
      {
        qFr: "Quelle note donneriez-vous au module, sur 10 ?",
        qEn: "Quelle note donneriez-vous au module, sur 10 ?",
        aFr: "9 sur 10. Et c'est une note que je donne en tant que praticienne qui passe ses journées dans cette matière.",
        aEn: "9 sur 10. Et c'est une note que je donne en tant que praticienne qui passe ses journées dans cette matière.",
      },
      {
        qFr: "Qu'est-ce qui manque pour aller à 10 ?",
        qEn: "Qu'est-ce qui manque pour aller à 10 ?",
        aFr: "Un seul point, mais il est substantiel. Le module traite remarquablement la cartographie des régimes et les mécanismes de désignation, mais il reste un peu en retrait sur la dimension contentieuse. La judicial review des désignations devant le Upper Tribunal, les procédures de delisting, les recours des personnes désignées contre le gel de leurs avoirs, tout cela mériterait une section complète. C'est un pan entier du travail d'OFSI que les juristes enforcement doivent maîtriser, parce qu'une désignation qui ne résiste pas au contentieux affaiblit tout le régime. L'assistant pédagogique intégré, en revanche, était excellent : quand je posais des questions pointues sur les interactions entre OFSI et le NCA dans les dossiers de contournement via les cryptoactifs, il suivait sans difficulté. C'est un vrai progrès par rapport à ce qu'on voit habituellement dans les outils de e-learning.",
        aEn: "Un seul point, mais il est substantiel. Le module traite remarquablement la cartographie des régimes et les mécanismes de désignation, mais il reste un peu en retrait sur la dimension contentieuse. La judicial review des désignations devant le Upper Tribunal, les procédures de delisting, les recours des personnes désignées contre le gel de leurs avoirs, tout cela mériterait une section complète. C'est un pan entier du travail d'OFSI que les juristes enforcement doivent maîtriser, parce qu'une désignation qui ne résiste pas au contentieux affaiblit tout le régime. L'assistant pédagogique intégré, en revanche, était excellent : quand je posais des questions pointues sur les interactions entre OFSI et le NCA dans les dossiers de contournement via les cryptoactifs, il suivait sans difficulté. C'est un vrai progrès par rapport à ce qu'on voit habituellement dans les outils de e-learning.",
      },
      {
        qFr: "En tant que juriste ayant travaillé directement sur des dossiers d'enforcement à l'OFSI, qu'est-ce qui vous a le plus interpellée dans le contenu ?",
        qEn: "En tant que juriste ayant travaillé directement sur des dossiers d'enforcement à l'OFSI, qu'est-ce qui vous a le plus interpellée dans le contenu ?",
        aFr: "Deux choses. D'abord, la section sur les régimes non russes m'a réellement appris quelque chose, et je ne m'y attendais pas. On travaille tous les jours sur les sanctions, mais la vérité, c'est que la masse du régime Russie absorbe presque toute notre capacité opérationnelle. Le module m'a obligée à revoir en détail la mécanique de la Global Anti-Corruption, par exemple, dont les critères de désignation sont très différents de ceux du régime Russie : on est sur de la « serious corruption » avec un seuil probatoire qui implique un standard of proof plus exigeant pour certaines catégories de personnes. La section sur le régime Chemical Weapons, avec les désignations liées aux attaques de Salisbury, m'a rappelé des mécanismes de preuve circonstancielle que j'avais un peu perdus de vue. Le module fait ressortir que chaque régime a sa propre logique politique et juridique, et que la compétence enforcement ne se transfère pas mécaniquement d'un régime à l'autre. C'est exactement la réalité de mon travail.\n\nEnsuite, la section sur les ownership and control rules m'a impressionnée. Le module explique très clairement la règle des 50% de détention directe ou indirecte par une personne désignée, les mécanismes d'agrégation, et surtout les zones grises que nous rencontrons quotidiennement : les structures opaques, les nominees, les trusts discrétionnaires. L'OFSI vient de lancer un appel à contributions sur ce sujet précis, et le module anticipe exactement les difficultés que l'industrie remonte.",
        aEn: "Deux choses. D'abord, la section sur les régimes non russes m'a réellement appris quelque chose, et je ne m'y attendais pas. On travaille tous les jours sur les sanctions, mais la vérité, c'est que la masse du régime Russie absorbe presque toute notre capacité opérationnelle. Le module m'a obligée à revoir en détail la mécanique de la Global Anti-Corruption, par exemple, dont les critères de désignation sont très différents de ceux du régime Russie : on est sur de la « serious corruption » avec un seuil probatoire qui implique un standard of proof plus exigeant pour certaines catégories de personnes. La section sur le régime Chemical Weapons, avec les désignations liées aux attaques de Salisbury, m'a rappelé des mécanismes de preuve circonstancielle que j'avais un peu perdus de vue. Le module fait ressortir que chaque régime a sa propre logique politique et juridique, et que la compétence enforcement ne se transfère pas mécaniquement d'un régime à l'autre. C'est exactement la réalité de mon travail.\n\nEnsuite, la section sur les ownership and control rules m'a impressionnée. Le module explique très clairement la règle des 50% de détention directe ou indirecte par une personne désignée, les mécanismes d'agrégation, et surtout les zones grises que nous rencontrons quotidiennement : les structures opaques, les nominees, les trusts discrétionnaires. L'OFSI vient de lancer un appel à contributions sur ce sujet précis, et le module anticipe exactement les difficultés que l'industrie remonte.",
      },
      {
        qFr: "Le module est destiné à des juristes et compliance officers travaillant dans l'enforcement des sanctions financières. Est-il adapté à ce public ?",
        qEn: "Le module est destiné à des juristes et compliance officers travaillant dans l'enforcement des sanctions financières. Est-il adapté à ce public ?",
        aFr: "Parfaitement. Il ne parle pas la langue de l'universitaire en droit international public, il parle celle du praticien qui doit qualifier un flux financier, déterminer si un bénéficiaire effectif est une personne désignée, et décider s'il y a matière à ouvrir un dossier ou à émettre un warning letter. Les mises en situation sont très bien calibrées. Il y a un exercice où l'apprenant reçoit un rapport de suspicious breach et doit classer le cas selon la nouvelle grille de sévérité introduite par l'OFSI en février 2026 : fixed penalty à 5 000 livres pour une infraction de reporting, ou escalade vers une monetary penalty proportionnelle au montant en jeu. C'est exactement le type de décision qu'un case officer prend chaque semaine. Un autre exercice simule un dossier de contournement via une entité basée dans une juridiction tierce, avec des flux en cryptoactifs, et demande à l'apprenant de reconstruire la chaîne de propriété pour déterminer si le gel s'applique. C'est opérationnel, c'est réaliste, et c'est le type de formation dont nous avons besoin.",
        aEn: "Parfaitement. Il ne parle pas la langue de l'universitaire en droit international public, il parle celle du praticien qui doit qualifier un flux financier, déterminer si un bénéficiaire effectif est une personne désignée, et décider s'il y a matière à ouvrir un dossier ou à émettre un warning letter. Les mises en situation sont très bien calibrées. Il y a un exercice où l'apprenant reçoit un rapport de suspicious breach et doit classer le cas selon la nouvelle grille de sévérité introduite par l'OFSI en février 2026 : fixed penalty à 5 000 livres pour une infraction de reporting, ou escalade vers une monetary penalty proportionnelle au montant en jeu. C'est exactement le type de décision qu'un case officer prend chaque semaine. Un autre exercice simule un dossier de contournement via une entité basée dans une juridiction tierce, avec des flux en cryptoactifs, et demande à l'apprenant de reconstruire la chaîne de propriété pour déterminer si le gel s'applique. C'est opérationnel, c'est réaliste, et c'est le type de formation dont nous avons besoin.",
      },
      {
        qFr: "Qu'avez-vous pensé de l'approche comparative entre les régimes thématiques du module ?",
        qEn: "Qu'avez-vous pensé de l'approche comparative entre les régimes thématiques du module ?",
        aFr: "C'est la force principale du module. La plupart des formations que j'ai suivies traitent les régimes en silo. Ce module fait quelque chose de très différent : il met en regard les critères de désignation, les licensing grounds et les mécanismes d'enforcement d'un régime à l'autre, ce qui permet de comprendre pourquoi le régime Counter Terrorism a un cadre de licences très restrictif calqué sur les résolutions du Conseil de sécurité, alors que le régime Global Human Rights autorise des dérogations plus larges. Quand on instruit des dossiers complexes qui touchent à plusieurs régimes simultanément, cette vision transversale est indispensable. Et elle n'existe dans aucune autre formation accessible aujourd'hui, du moins pas à ce niveau de granularité.",
        aEn: "C'est la force principale du module. La plupart des formations que j'ai suivies traitent les régimes en silo. Ce module fait quelque chose de très différent : il met en regard les critères de désignation, les licensing grounds et les mécanismes d'enforcement d'un régime à l'autre, ce qui permet de comprendre pourquoi le régime Counter Terrorism a un cadre de licences très restrictif calqué sur les résolutions du Conseil de sécurité, alors que le régime Global Human Rights autorise des dérogations plus larges. Quand on instruit des dossiers complexes qui touchent à plusieurs régimes simultanément, cette vision transversale est indispensable. Et elle n'existe dans aucune autre formation accessible aujourd'hui, du moins pas à ce niveau de granularité.",
      },
      {
        qFr: "Un mot sur l'aspect généré par l'IA. Cela change-t-il quelque chose à votre appréciation ?",
        qEn: "Un mot sur l'aspect généré par l'IA. Cela change-t-il quelque chose à votre appréciation ?",
        aFr: "Ce qui m'intéresse, c'est la fiabilité du contenu et sa pertinence opérationnelle. Sur ces deux critères, le module tient. J'ajouterais même que l'IA apporte un avantage spécifique dans notre domaine : les sanctions sont un corpus vivant. Les listes sont mises à jour plusieurs fois par mois. Les régimes évoluent. Le cross-government review de 2025, la stratégie PERC 2026-2029, les nouveaux fixed penalties, tout cela est très récent. Un formateur humain aurait mis des mois à intégrer ces évolutions dans un parcours pédagogique cohérent. Le module les intègre déjà. Dans un domaine où le retard d'information crée un risque opérationnel direct, cette capacité de mise à jour est un avantage que je qualifierais de structurel.",
        aEn: "Ce qui m'intéresse, c'est la fiabilité du contenu et sa pertinence opérationnelle. Sur ces deux critères, le module tient. J'ajouterais même que l'IA apporte un avantage spécifique dans notre domaine : les sanctions sont un corpus vivant. Les listes sont mises à jour plusieurs fois par mois. Les régimes évoluent. Le cross-government review de 2025, la stratégie PERC 2026-2029, les nouveaux fixed penalties, tout cela est très récent. Un formateur humain aurait mis des mois à intégrer ces évolutions dans un parcours pédagogique cohérent. Le module les intègre déjà. Dans un domaine où le retard d'information crée un risque opérationnel direct, cette capacité de mise à jour est un avantage que je qualifierais de structurel.",
      },
      {
        qFr: "Recommanderiez-vous ce module à des collègues ?",
        qEn: "Recommanderiez-vous ce module à des collègues ?",
        aFr: "Sans hésitation. À des collègues d'OFSI, évidemment, en particulier les nouveaux case officers qui arrivent souvent avec une solide formation juridique mais une connaissance partielle de l'étendue réelle des régimes au-delà de la Russie. À des juristes de la FCA qui travaillent sur les sanctions controls des firmes régulées. À des compliance officers du secteur privé qui doivent comprendre comment l'OFSI raisonne quand il évalue une breach, parce que le module donne exactement cette perspective enforcement qui manque dans les formations conçues par et pour le secteur bancaire. C'est une formation qui comble un vide réel. Trop technique pour les généralistes, trop opérationnelle pour les académiques : c'est précisément le bon positionnement.",
        aEn: "Sans hésitation. À des collègues d'OFSI, évidemment, en particulier les nouveaux case officers qui arrivent souvent avec une solide formation juridique mais une connaissance partielle de l'étendue réelle des régimes au-delà de la Russie. À des juristes de la FCA qui travaillent sur les sanctions controls des firmes régulées. À des compliance officers du secteur privé qui doivent comprendre comment l'OFSI raisonne quand il évalue une breach, parce que le module donne exactement cette perspective enforcement qui manque dans les formations conçues par et pour le secteur bancaire. C'est une formation qui comble un vide réel. Trop technique pour les généralistes, trop opérationnelle pour les académiques : c'est précisément le bon positionnement.",
      },
    ],
    bioFr: `Me V. exerce principalement en droit pénal des affaires et de la finance, ainsi qu'en matière de fraude civile et d'insolvabilité. Elle est avocate au barreau de New York (2009), solicitor en Angleterre et au Pays de Galles (2011), et avocate au barreau de France. Après un double cursus en droit comparé (droit anglais et français), elle a exercé à Londres, Paris et Monaco, acquérant une expérience des systèmes de common law et de droit civil.

Après son stage au sein du cabinet Cleary Gottlieb Steen & Hamilton LLP à Londres, elle a exercé en contentieux et mené des enquêtes dans le secteur de l'assurance chez Clyde & Co LLP. Elle a ensuite rejoint la fonction publique britannique, d'abord comme assistante juridique auprès de Lord Justice Rix, puis comme conseillère juridique auprès de deux chanceliers successifs de la High Court, Etherton et Vos LJJ. Après le ministère de la Justice, elle a rejoint l'OFSI, où elle a travaillé comme juriste spécialisée en renseignement financier, avant de devenir procureure dans plusieurs dossiers de fraude et de corruption internationale. Elle a également travaillé à la Cellule de Renseignements Financiers de Monaco en tant qu'analyste principale, en interaction avec les banques et acteurs locaux, enquêtant et transmettant des dossiers de blanchiment au Parquet général.

Titulaire de deux diplômes en droit de l'Université de Cambridge (St Catharine's College) et de Paris 2-Assas, elle est également titulaire d'une licence avec distinction en sciences politiques et sociologie de l'Université McGill, et d'un Master of Laws (Honors) de l'Université Cornell, où elle était boursière Edmund de Rothschild.

Me V. est citoyenne du Royaume-Uni, des États-Unis et de la France. Elle parle couramment anglais et français, pratique l'allemand intermédiaire et apprend l'arabe.`,
    bioEn: `Me V.'s main area of practice is economic and corporate crime, but includes civil fraud and insolvency. She is a New York Attorney (2009), a solicitor of England & Wales (qualified in 2011), as well as a qualified Avocate in France. Having obtained a comparative law degree in English and French law, and practiced in London, Paris, and Monaco, she has experience under both common and civil law systems.

After completing her training contract with Cleary Gottlieb Steen & Hamilton LLP in London, she practiced litigation and delved into investigatory work in the insurance sphere at Clyde & Co LLP. She then joined the Civil Service, working as a Judicial Assistant to Lord Justice Rix, before serving as Legal Advisor to two successive Chancellors of the High Court, Etherton and Vos LJJ. From the Ministry of Justice, she then went on to the OFSI, where she worked first as a Financial Intelligence Lawyer, before becoming Prosecutor on several fraud and international bribery cases. She also worked at the Monaco Financial Investigations Unit as Lead Analyst, interacting with local banks and stakeholders, and investigating and referring money laundering matters to the General Prosecutor.

In addition to her dual law degrees from the University of Cambridge (St Catharine's College) and Paris 2-Assas, she holds a BA with Distinction in Political Science and Sociology from McGill University, and a Master of Laws (Honors) from Cornell University, where she was an Edmund de Rothschild Fellow.

Me V. is a citizen of the United Kingdom, the United States, and France. She is fluent in English and French, speaks intermediate German, and is learning Arabic.`,
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
    <div style={pageStyle}>
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
    </div>
  );
}

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

const sectorGroupStyle: React.CSSProperties = {
  marginBottom: 32,
};

const sectorLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#ccc",
  margin: "0 0 8px",
  paddingLeft: 4,
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

const caseLinkBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 28,
  height: 20,
  borderRadius: 6,
  background: "#e8e8ed",
  color: "#666",
  fontSize: 10,
  fontWeight: 700,
  flexShrink: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  maxWidth: 800,
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
  margin: "0 0 48px",
  lineHeight: 1.6,
};

const interviewCardStyle: React.CSSProperties = {
  marginBottom: 48,
  paddingTop: 8,
};

const interviewHeaderStyle: React.CSSProperties = {
  marginBottom: 32,
};

const metaRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
  marginBottom: 16,
  fontSize: 12,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "#1a1a1a",
  color: "#fff",
  padding: "2px 10px",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 12,
};

const metaStyle: React.CSSProperties = {
  color: "#aaa",
  fontSize: 12,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  lineHeight: 1.35,
  margin: "0 0 12px",
  letterSpacing: "-0.01em",
  color: "#1a1a1a",
};

const bylineStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#666",
  margin: 0,
  lineHeight: 1.6,
};

const roleStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#aaa",
};

const qaSectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

const qaItemStyle: React.CSSProperties = {
  padding: "20px 24px",
  background: "#ffffff",
  borderRadius: 14,
  marginBottom: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  border: "1px solid #eee",
};

const qStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#888",
};

const aStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.7,
  color: "#333",
};

const bioDetailsStyle: React.CSSProperties = {
  marginTop: 32,
};

const bioSummaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: 500,
  fontSize: 13,
  color: "#aaa",
  userSelect: "none",
  padding: "6px 0",
};

const bioContentStyle: React.CSSProperties = {
  marginTop: 16,
  padding: "20px 24px",
  background: "#ffffff",
  borderRadius: 14,
  border: "1px solid #eee",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const bioPStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#555",
  margin: "0 0 12px",
};
