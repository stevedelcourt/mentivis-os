import fr from "@/locales/fr.json";
import en from "@/locales/en.json";
import { Locale } from "@/lib/i18n";

export interface FaqItem {
  question: string;
  answer: string;
}

export const learningosFaq: Record<Locale, FaqItem[]> = {
  fr: [
    { question: "Qu'est-ce que LearningOS ?", answer: "LearningOS est le système de formation native IA de Mentivis. Il génère des parcours personnalisés, adapte les contenus automatiquement et pilote la montée en compétences, le tout dans une seule plateforme." },
    { question: "Comment LearningOS crée-t-il des parcours personnalisés ?", answer: "LearningOS analyse les compétences visées, les référentiels métier internes et le profil de chaque apprenant pour générer des parcours sur mesure avec objectifs, modules et évaluations adaptés." },
    { question: "LearningOS est-il compatible avec les financements OPCO ?", answer: "Oui. LearningOS inclut un module OPCO Manager qui simplifie le montage et le suivi des dossiers de financement, avec export des données de conformité directement exploitables." },
    { question: "Puis-je intégrer LearningOS à mes outils existants ?", answer: "Oui. LearningOS expose une API REST complète et des connecteurs prêts à l'emploi pour les principaux SIRH, LMS et CRM." },
    { question: "LearningOS est-il conforme au RGPD ?", answer: "Oui. LearningOS est conforme RGPD, certifié SOC 2 Type II, et propose le chiffrement AES-256 des données au repos et TLS 1.3 en transit." },
    { question: "Quels types de formations puis-je créer avec LearningOS ?", answer: "Formations internes, parcours certifiants, modules d'onboarding, formations réglementaires, programmes de montée en compétences, tout format, tout métier." },
    { question: "Comment les apprenants sont-ils accompagnés ?", answer: "Les agents IA (SkillAgents) accompagnent chaque apprenant 24/7, répondent à ses questions, l'orientent vers les ressources adaptées et adaptent le rythme en temps réel." },
    { question: "LearningOS propose-t-il un support entreprise ?", answer: "Oui. Nous proposons des SLA garantis, un support prioritaire, un accompagnement dédié au déploiement et des services gérés pour les besoins à grande échelle." },
  ],
  en: [
    { question: "What is LearningOS?", answer: "LearningOS is Mentivis's AI-native training system. It generates personalized learning paths, automatically adapts content, and drives skills development, all in a single platform." },
    { question: "How does LearningOS create personalized paths?", answer: "LearningOS analyzes target skills, internal job frameworks, and each learner's profile to generate custom paths with objectives, modules and adapted assessments." },
    { question: "Is LearningOS compatible with OPCO funding?", answer: "Yes. LearningOS includes an OPCO Manager module that simplifies the setup and tracking of funding applications, with exportable compliance data." },
    { question: "Can I integrate LearningOS with my existing tools?", answer: "Yes. LearningOS exposes a complété REST API and ready-to-use connectors for major HRIS, LMS and CRM systems." },
    { question: "Is LearningOS GDPR compliant?", answer: "Yes. LearningOS is GDPR compliant, SOC 2 Type II certified, with AES-256 encryption at rest and TLS 1.3 in transit." },
    { question: "What types of training can I create with LearningOS?", answer: "Internal training, certified programs, onboarding modules, regulatory training, upskilling programs, any format, any profession." },
    { question: "How are learners supported?", answer: "AI agents (SkillAgents) accompany each learner 24/7, answer questions, direct them to relevant resources and adapt the pace in real time." },
    { question: "Does LearningOS offer enterprise support?", answer: "Yes. We offer guaranteed SLAs, priority support, dedicated deployment assistance, and managed services for large-scale needs." },
  ],
};

export const talentosFaq: Record<Locale, FaqItem[]> = {
  fr: [
    { question: "Qu'est-ce que TalentOS ?", answer: "TalentOS est le système de recrutement IA de Mentivis. Il combine un ATS intelligent, un moteur de matching, des tests d'évaluation et des analytics RH dans une seule plateforme." },
    { question: "Comment fonctionne le matching IA ?", answer: "Le moteur analyse sémantiquement les CV et profils candidats, les confronte à vos critères de poste et pondérations, et classe automatiquement les profils par pertinence." },
    { question: "Puis-je intégrer TalentOS à mon SIRH existant ?", answer: "Oui. TalentOS expose une API REST complète avec des connecteurs prêts à l'emploi pour les principaux SIRH, CRM et ATS du marché." },
    { question: "TalentOS est-il adapté aux recrutements multi-recruiters ?", answer: "Oui. La plateforme est conçue pour la collaboration : évaluations partagées, commentaires, grilles de notation et workflows de décision pour des équipes de toute taille." },
    { question: "Quels types de tests puis-je créer ?", answer: "Tests techniques, cas pratiques, mises en situation, questionnaires comportementaux avec correction automatique, grilles d'évaluation personnalisées et comparaison des candidats." },
    { question: "TalentOS est-il conforme au RGPD ?", answer: "Oui. TalentOS est conforme RGPD, certifié SOC 2 Type II, avec chiffrement AES-256 et TLS 1.3, journaux d'audit et gestion des accès par rôle." },
    { question: "Comment TalentOS améliore-t-il l'expérience candidat ?", answer: "Portail candidat dédié, suivi en temps réel des candidatures, communication automatisée, et processus de candidature simplifié sur mobile et desktop." },
    { question: "TalentOS propose-t-il un support entreprise ?", answer: "Oui. SLA garantis, support prioritaire, accompagnement au déploiement et services gérés pour les recrutements à grand volume." },
  ],
  en: [
    { question: "What is TalentOS?", answer: "TalentOS is Mentivis's AI recruitment system. It combines a smart ATS, matching engine, assessment tests and HR analytics in a single platform." },
    { question: "How does AI matching work?", answer: "The engine semantically analyzes CVs and candidate profiles, compares them against your job criteria and weights, and automatically ranks profiles by relevance." },
    { question: "Can I integrate TalentOS with my existing HRIS?", answer: "Yes. TalentOS exposes a complété REST API with ready-to-use connectors for major HRIS, CRM and ATS systems." },
    { question: "Is TalentOS suitable for multi-recruiter hiring?", answer: "Yes. The platform is built for collaboration: shared evaluations, comments, scoring grids and decision workflows for teams of any size." },
    { question: "What types of tests can I create?", answer: "Technical tests, case studies, simulations, behavioral questionnaires with auto-correction, custom scoring grids and candidate comparison." },
    { question: "Is TalentOS GDPR compliant?", answer: "Yes. TalentOS is GDPR compliant, SOC 2 Type II certified, with AES-256 encryption and TLS 1.3, audit logs and role-based access control." },
    { question: "How does TalentOS improve candidate experience?", answer: "Dedicated candidate portal, real-time application tracking, automated communication, and simplified application process on mobile and desktop." },
    { question: "Does TalentOS offer enterprise support?", answer: "Yes. Guaranteed SLAs, priority support, deployment assistance and managed services for high-volume hiring." },
  ],
};

export function getHomepageFaq(lang: Locale): FaqItem[] {
  const locale = lang === "fr" ? fr : en;
  return locale.faq.items.map((item: Record<string, string>) => ({
    question: item.question,
    answer: item.answer,
  }));
}

export function getAmbassadorsFaq(lang: Locale): FaqItem[] {
  const locale = lang === "fr" ? fr : en;
  return locale.ambassadors.faq.items.map((item: Record<string, string>) => ({
    question: item.q,
    answer: item.a,
  }));
}
