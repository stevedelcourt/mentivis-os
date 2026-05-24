"use client";

import { Locale } from "@/lib/i18n";

const SECTIONS = [
  { id: "presentation", labelFr: "Présentation", labelEn: "Overview" },
  { id: "debuter", labelFr: "Débuter", labelEn: "Getting Started" },
  { id: "ats", labelFr: "ATS — Recrutement", labelEn: "ATS — Recruitment" },
  { id: "sirh", labelFr: "SIRH / HRIS", labelEn: "HRIS" },
  { id: "pennylane", labelFr: "Pennylane", labelEn: "Pennylane" },
  { id: "webhooks", labelFr: "Webhooks", labelEn: "Webhooks" },
  { id: "sandbox", labelFr: "Sandbox & Test", labelEn: "Sandbox & Test" },
];

const CONTENT: Record<string, { fr: string; en: string }> = {
  presentation: {
    fr: `MentivisOS expose une API RESTful qui permet d'intégrer ses fonctionnalités de formation adaptative, de gestion des compétences et de certification dans vos outils existants.

L'API couvre :
- La gestion des apprenants (création, mise à jour, synchronisation)
- Les parcours de formation adaptatifs et leur déclenchement
- Le suivi des progressions et des résultats
- La délivrance de certificats et badges
- L'export des données de compétences vers vos systèmes cibles

L'API est accessible à l'adresse : https://api.mentivisos.com/v1`,
    en: `MentivisOS exposes a RESTful API that integrates adaptive training, skills management and certification features into your existing tools.

The API covers:
- Learner management (creation, update, sync)
- Adaptive learning paths and their triggering
- Progress and results tracking
- Certificate and badge delivery
- Skills data export to your target systems

The API is available at: https://api.mentivisos.com/v1`,
  },
  debuter: {
    fr: `Authentification

Toutes les requêtes API nécessitent un jeton d'accès (Bearer token) inclus dans l'en-tête Authorization :

Authorization: Bearer <votre_clé_api>

Les clés API sont disponibles depuis votre tableau de bord MentivisOS, rubrique "Développeurs" > "Clés API".

Taux de limites

- 1000 requêtes / heure pour le plan Essential
- 5000 requêtes / heure pour le plan Business
- 20 000 requêtes / heure pour le plan Enterprise

Encodage

Toutes les requêtes et réponses utilisent JSON. Veillez à définir l'en-tête Content-Type: application/json.

Idempotence

Les requêtes de création peuvent inclure un en-tête Idempotency-Key pour éviter les doublons en cas de rejeu.`,
    en: `Authentication

All API requests require a Bearer token in the Authorization header:

Authorization: Bearer <your_api_key>

API keys are available from your MentivisOS dashboard under "Developers" > "API Keys".

Rate Limits

- 1000 requests / hour for Essential plan
- 5000 requests / hour for Business plan
- 20 000 requests / hour for Enterprise plan

Encoding

All requests and responses use JSON. Make sure to set the Content-Type: application/json header.

Idempotency

Creation requests can include an Idempotency-Key header to prevent duplicates on retry.`,
  },
  ats: {
    fr: `L'intégration avec les ATS (Applicant Tracking Systems) permet de synchroniser les données de formation directement dans le parcours candidat.

Taleez

Taleez est un ATS collaboratif français adopté par les PME et ETI. L'intégration avec MentivisOS permet :
- Création automatique d'un parcours de formation adaptatif lorsqu'un candidat atteint un certain statut (ex: "Entretien validé")
- Envoi des résultats de formation vers le profil candidat Taleez via l'API REST de Taleez
- Synchronisation des compétences évaluées dans le référentiel MentivisOS vers les champs personnalisés Taleez

Flatchr

Flatchr propose des fonctionnalités d'IA générative et de multidiffusion. L'intégration MentivisOS :
- Déclenche des modules de pré-embauche (onboarding anticipé) via webhook
- Remonte les taux de complétion et les scores dans le tableau de bord Flatchr
- Alimente le scoring des candidats avec les résultats des évaluations MentivisOS

JobAffinity

JobAffinity est un ATS pour TPE/PME et administrations. L'intégration :
- Carte mentale des compétences synchronisée entre les deux outils
- Import automatique des candidats depuis JobAffinity vers un parcours de pré-qualification
- Export du passeport compétences vers le dossier candidat

HelloWork Recruteur

HelloWork Recruteur (anciennement App Recruteur) est le 1er acteur privé français de l'emploi.
- Publication d'offres jumelée à un lien vers un parcours de découverte MentivisOS
- Réception des résultats des assessments directement dans la base candidats
- Enrichissement du CV avec les compétences validées via MentivisOS`,
    en: `Integration with ATS (Applicant Tracking Systems) enables training data synchronization directly in the candidate journey.

Taleez

Taleez is a collaborative French ATS used by SMBs and mid-market companies. Integration with MentivisOS provides:
- Automatic creation of an adaptive learning path when a candidate reaches a specific status (e.g. "Interview passed")
- Sending training results to the Taleez candidate profile via the Taleez REST API
- Syncing evaluated skills from MentivisOS repository to Taleez custom fields

Flatchr

Flatchr offers AI-powered features and multi-posting. The MentivisOS integration:
- Triggers pre-hire modules (early onboarding) via webhook
- Reports completion rates and scores in the Flatchr dashboard
- Feeds candidate scoring with MentivisOS assessment results

JobAffinity

JobAffinity is an ATS for small businesses and public administrations. Integration:
- Synced skills mind map between both tools
- Automatic import of candidates from JobAffinity to a pre-qualification path
- Skills passport export to the candidate file

HelloWork Recruteur

HelloWork Recruteur (formerly App Recruteur) is France's leading private employment platform.
- Job posting paired with a link to a MentivisOS discovery path
- Assessment results received directly in the candidate database
- CV enrichment with skills validated via MentivisOS`,
  },
  sirh: {
    fr: `L'intégration avec les SIRH permet de maintenir un référentiel compétences à jour et de piloter la formation depuis l'outil RH central.

Eurécia

Eurécia propose une suite RH complète avec module ATS, onboarding et gestion des talents.
- Synchronisation du référentiel de compétences entre Eurécia et MentivisOS
- Déclenchement automatique de parcours après l'entretien professionnel
- Remontée des formations suivies dans le dossier collaborateur Eurécia

Empowill

Empowill est un logiciel RH spécialisé dans la gestion des talents en PME/ETI.
- Plans de développement synchronisés avec les parcours MentivisOS
- Suivi des certifications obligatoires dans le tableau de bord Empowill
- Import des évaluations de compétences post-formation

Kelio

Kelio est un SIRH complet utilisé par les ETI et grands comptes.
- Export des données de formation vers Kelio pour la gestion administrative
- Synchronisation des plannings de formation via API
- Remontée des heures de formation dans le DIF/CPF

Sage RH

Sage RH est déployé dans plus de 40 000 entreprises en France.
- Connecteur dédié pour l'échange de données de formation
- Synchronisation automatique des collaborateurs et de leur matricule
- Alimentation du plan de développement des compétences

Personio

Personio est un SIRH adopté par les PME en hypercroissance.
- Intégration via API REST pour la création et mise à jour des profils
- Synchronisation des attributs personnalisés (compétences, certifications)
- Workflow automatisé déclenchant un parcours d'intégration dès l'embauche`,
    en: `Integration with HRIS keeps the skills repository up to date and enables training management from the central HR tool.

Eurécia

Eurécia offers a complete HR suite with ATS module, onboarding and talent management.
- Skills repository sync between Eurécia and MentivisOS
- Automatic learning path triggering after performance reviews
- Training records pushed to the Eurécia employee file

Empowill

Empowill is an HR solution specialized in talent management for SMBs.
- Development plans synced with MentivisOS learning paths
- Mandatory certification tracking in the Empowill dashboard
- Post-training skills assessment import

Kelio

Kelio is a comprehensive HRIS used by mid-market and enterprise companies.
- Training data export to Kelio for administrative management
- Training schedule sync via API
- Training hours reporting to DIF/CPF

Sage HR

Sage HR is deployed in over 40,000 companies in France.
- Dedicated connector for training data exchange
- Automatic employee sync with their ID
- Skills development plan feeding

Personio

Personio is an HRIS adopted by hyper-growth SMBs.
- REST API integration for profile creation and updates
- Custom attribute sync (skills, certifications)
- Automated workflow triggering an onboarding path upon hire`,
  },
  pennylane: {
    fr: `Pennylane est une plateforme française de gestion financière tout-en-un : facturation, comptabilité, trésorerie, notes de frais et paie.

L'intégration entre MentivisOS et Pennylane permet d'automatiser le volet financier de la formation :

Facturation des formations

- Les sessions de formation validées génèrent automatiquement une facture client dans Pennylane via l'API Company
- Synchronisation des produits et tarifs de formation (catalogue MentivisOS → base produits Pennylane)
- Rattachement des factures aux bons de commande et devis signés

Suivi des coûts

- Les coûts pédagogiques (formateurs, plateforme, ressources) sont synchronisés dans les écritures comptables
- Les notes de frais des formateurs importées depuis Pennylane sont rattachées aux sessions de formation
- Tableaux de bord analytiques : coût par apprenant, par module, par département

Certification OAuth 2.0

- L'intégration utilise le flux OAuth 2.0 Pennylane (Company API)
- Un sandbox de test est disponible dans votre espace Pennylane
- Les webhooks Pennylane notifient MentivisOS des changements de statut de facture (payée, impayée, envoyée)

Référence technique

API Pennylane v2 : https://pennylane.readme.io/
Endpoints clés : /api/external/v2/customer_invoices, /api/external/v2/products,
/api/external/v2/changelogs/customer_invoices`,
    en: `Pennylane is a French all-in-one financial management platform: invoicing, accounting, treasury, expense reports and payroll.

The MentivisOS-Pennylane integration automates the financial side of training:

Training Invoicing

- Validated training sessions automatically generate a customer invoice in Pennylane via the Company API
- Product and training price sync (MentivisOS catalog → Pennylane product base)
- Invoice matching with purchase orders and signed quotes

Cost Tracking

- Training costs (instructors, platform, resources) are synced in accounting entries
- Instructor expense reports from Pennylane are linked to training sessions
- Analytical dashboards: cost per learner, per module, per department

OAuth 2.0 Certification

- Integration uses the Pennylane OAuth 2.0 flow (Company API)
- A test sandbox is available in your Pennylane workspace
- Pennylane webhooks notify MentivisOS of invoice status changes (paid, unpaid, sent)

Technical Reference

Pennylane API v2: https://pennylane.readme.io/
Key endpoints: /api/external/v2/customer_invoices, /api/external/v2/products,
/api/external/v2/changelogs/customer_invoices`,
  },
  webhooks: {
    fr: `Les webhooks permettent à MentivisOS de notifier vos systèmes en temps réel lors d'événements clés.

Événements disponibles

- learning_path.completed — Un apprenant a terminé un parcours
- assessment.passed — Une évaluation a été réussie
- certificate.issued — Un certificat a été délivré
- learner.enrolled — Un apprenant a été inscrit à un parcours
- learner.skill_updated — Les compétences d'un apprenant ont été mises à jour

Configuration

Les webhooks sont configurables depuis le tableau de bord MentivisOS :
1. Rubrique "Développeurs" > "Webhooks"
2. Ajoutez l'URL de votre endpoint
3. Sélectionnez les événements à écouter
4. Validez avec le handshake de vérification

Signature

Chaque payload est signé avec HMAC-SHA256. L'en-tête X-Mentivis-Signature contient la signature à vérifier avec votre secret partagé.

Réponse attendue

Votre endpoint doit répondre en 2 secondes maximum avec un code HTTP 200. En cas d'échec, MentivisOS effectue jusqu'à 5 tentatives avec backoff exponentiel.`,
    en: `Webhooks allow MentivisOS to notify your systems in real-time on key events.

Available Events

- learning_path.completed — A learner has finished a path
- assessment.passed — An assessment has been passed
- certificate.issued — A certificate has been issued
- learner.enrolled — A learner has been enrolled in a path
- learner.skill_updated — A learner's skills have been updated

Configuration

Webhooks are configurable from the MentivisOS dashboard:
1. Go to "Developers" > "Webhooks"
2. Add your endpoint URL
3. Select the events to listen to
4. Validate with the verification handshake

Signature

Each payload is signed with HMAC-SHA256. The X-Mentivis-Signature header contains the signature to verify with your shared secret.

Expected Response

Your endpoint must respond within 2 seconds with HTTP 200. On failure, MentivisOS retries up to 5 times with exponential backoff.`,
  },
  sandbox: {
    fr: `Un environnement de test est disponible pour valider vos intégrations sans impacter la production.

Environnement sandbox

URL de l'API : https://sandbox-api.mentivisos.com/v1
Les données sont réinitialisées chaque semaine.

Création d'un compte sandbox

1. Depuis votre tableau de bord MentivisOS, rubrique "Développeurs"
2. Cliquez sur "Créer un environnement de test"
3. Générez une clé API sandbox distincte de votre clé de production
4. Utilisez les données de démonstration préchargées (apprenants, parcours, modules)

Scénarios de test recommandés

- Création d'un apprenant → inscription à un parcours → suivi de progression
- Simulation d'un webhook entrant depuis votre ATS
- Synchronisation des compétences vers votre SIRH
- Génération de facture de formation vers Pennylane

Limitations sandbox

- 500 requêtes / heure
- Pas d'envoi d'emails réels
- Les webhooks sont simulés (consultables dans les logs)
- Les certificats générés portent la mention "TEST"`,
    en: `A test environment is available to validate your integrations without impacting production.

Sandbox Environment

API URL: https://sandbox-api.mentivisos.com/v1
Data is reset every week.

Creating a Sandbox Account

1. From your MentivisOS dashboard, go to "Developers"
2. Click "Create a test environment"
3. Generate a sandbox API key separate from your production key
4. Use pre-loaded demo data (learners, paths, modules)

Recommended Test Scenarios

- Create a learner → enroll in a path → track progress
- Simulate an incoming webhook from your ATS
- Sync skills to your HRIS
- Generate a training invoice to Pennylane

Sandbox Limitations

- 500 requests / hour
- No real email sending
- Webhooks are simulated (viewable in logs)
- Generated certificates are marked "TEST"`,
  },
};

export default function DeveloppersPageClient({ lang }: { lang: Locale }) {
  const isFr = lang === "fr";

  return (
    <>
      <section style={{
        background: "#ffffff",
        padding: "clamp(96px, 12vw, 160px) 0 clamp(64px, 8vw, 96px)",
      }}>
        <div className="container" style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}>
          <p style={{
            marginBottom: 24,
            color: "#4e4e4e",
            textTransform: "uppercase",
            letterSpacing: "0.14px",
            fontWeight: 500,
            fontSize: 12,
          }}>
            {isFr ? "Développeurs" : "Developers"}
          </p>
          <h1 style={{
            marginBottom: 20,
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            fontSize: "clamp(32px, 5vw, 56px)",
          }}>
            {isFr ? "API MentivisOS" : "MentivisOS API"}
          </h1>
          <p style={{
            maxWidth: 560,
            fontSize: 18,
            lineHeight: 1.6,
            color: "#4e4e4e",
            marginBottom: 0,
          }}>
            {isFr
              ? "Documentation technique et guides d'intégration pour connecter vos systèmes."
              : "Technical documentation and integration guides to connect your systems."}
          </p>
        </div>
      </section>

      <div className="wiki-layout" style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "0 clamp(24px, 5vw, 80px) clamp(80px, 10vw, 120px)",
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: 48,
        alignItems: "start",
      }}>
        <nav className="wiki-sidebar" style={{
          position: "sticky",
          top: 100,
        }}>
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            borderLeft: "1px solid #e5e5e5",
          }}>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  style={{
                    display: "block",
                    padding: "8px 16px",
                    fontSize: 13,
                    color: "#4e4e4e",
                    textDecoration: "none",
                    borderLeft: "2px solid transparent",
                    marginLeft: -1,
                    transition: "all 0.15s",
                  }}
                  className="wiki-link"
                >
                  {isFr ? s.labelFr : s.labelEn}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="wiki-content">
          {SECTIONS.map((s) => (
            <article
              key={s.id}
              id={s.id}
              style={{
                marginBottom: 64,
                scrollMarginTop: 100,
              }}
            >
              <h2 style={{
                fontSize: 24,
                fontWeight: 500,
                marginBottom: 20,
                paddingBottom: 12,
                borderBottom: "1px solid #e5e5e5",
              }}>
                {isFr ? s.labelFr : s.labelEn}
              </h2>
              <div style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: "#333",
              }}>
                {(isFr ? CONTENT[s.id].fr : CONTENT[s.id].en).split("\n\n").map((p, i) => {
                  if (p.startsWith("**") && p.includes("**\n")) {
                    const lines = p.split("\n");
                    return (
                      <div key={i} style={{ marginBottom: 16 }}>
                        <strong>{lines[0].replace(/\*\*/g, "")}</strong>
                        {lines.slice(1).map((l, j) => (
                          <p key={j} style={{ margin: "8px 0" }}>{l}</p>
                        ))}
                      </div>
                    );
                  }
                  if (p.startsWith("- ")) {
                    const items = p.split("\n").filter(l => l.startsWith("- "));
                    return (
                      <ul key={i} style={{ margin: "0 0 16px", paddingLeft: 20 }}>
                        {items.map((item, j) => (
                          <li key={j} style={{ marginBottom: 4 }}>{item.replace(/^- /, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i} style={{ margin: "0 0 16px" }}>{p}</p>;
                })}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .wiki-link:hover {
          color: #000 !important;
          border-left-color: #000 !important;
        }
        @media (max-width: 768px) {
          .wiki-layout {
            grid-template-columns: 1fr !important;
          }
          .wiki-sidebar {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
