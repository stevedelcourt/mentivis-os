#!/usr/bin/env node
// Add English (content_en) translations for all referentiel articles.
// Usage: DATA_DIR=/path/to/data node scripts/translate-referentiel.js

const fs = require("fs");
const path = require("path");
const sql = require("sql.js");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "mentivis.db");

const TRANSLATIONS = {
  "quest-ce-que-mentivisos-et-en-quoi-est-ce-different-dun-lms": `## What is MentivisOS and how is it different from an LMS

MentivisOS is an AI-native pedagogical operating system. While an LMS distributes existing content and records completions, MentivisOS diagnoses the skills gap, generates the exact learning path to close it, adapts it skill by skill, and measures real acquisition from framework to certification. The difference is structural, not a matter of features: an LMS distributes, MentivisOS produces.

## A system, not a library

An LMS is a library — it stores, distributes and tracks content produced elsewhere. Its value depends entirely on what you put in it. MentivisOS reverses this logic: it doesn't assume content exists, it generates it from a need and a framework. Content is no longer a prerequisite — it's an output of the system.

## From diagnosis to measurement

MentivisOS runs a complete flow. It defines the need and target framework, generates the program and materials, deploys training, assesses skills, certifies and analyzes results. Each step feeds the next. An LMS only covers deployment and tracking — it has neither upstream diagnosis nor content generation.

## What this means

The training bottleneck is no longer distribution, but the production of accurate, up-to-date, aligned content. By handling this production, MentivisOS shifts human effort to diagnosis and management — where real value lies. MentivisOS doesn't just replace an LMS — it addresses a problem the LMS never solved.

## Key takeaways

- MentivisOS is an AI-native pedagogical OS, not an LMS.
- An LMS distributes existing content; MentivisOS generates it.
- It runs a complete flow from needs diagnosis to results analysis.
- Content is no longer a prerequisite but a system output.
- It shifts human effort toward diagnosis and management.`,

  "quest-ce-quun-systeme-dexploitation-pedagogique": `## What is a pedagogical operating system

A pedagogical operating system is the foundational software layer that orchestrates all training activities within an organization — from skills diagnosis to content generation, deployment, assessment and certification. Unlike an LMS which is a tool you use, a pedagogical OS is the infrastructure on which everything runs. This distinction determines how an organization scales its training.

## The OS analogy

An operating system manages hardware resources and enables applications to run. A pedagogical OS does the same for training: it manages pedagogical resources (needs, goals, skills, content, assessments) and enables training processes to operate. Without it, each training action is an isolated project.

## What an OS makes possible

A pedagogical OS knows what the organization needs, what each person must learn, and whether they have learned it. It generates the content automatically, adapts the path in real time, and provides a unified dashboard for all stakeholders. It is the difference between managing training and operating a skills system.

## Key takeaways

- A pedagogical OS is the infrastructure layer for all training activities.
- It orchestrates the full cycle: diagnosis, generation, deployment, assessment.
- It manages skills as a continuous flow, not discrete actions.
- It enables scaling without multiplying human effort.`,

  "pourquoi-un-lms-ne-suffit-plus": `## Why an LMS is no longer enough

An LMS solves a logistics problem: distribute content and track completions. But the challenges of modern training are no longer logistical. They are pedagogical, analytical and generative. Organizations need to produce personalized content at scale, measure actual skill acquisition, not just presence, and adapt learning paths in real time. No LMS was designed for this.

## The limits of an LMS

An LMS works well when content is stable, homogeneous and produced externally. But today, the shelf life of skills is shrinking, and content must be continuously updated. An LMS has no engine to generate or adapt content — it can only organize what it receives. The more content an LMS contains, the harder it is to navigate.

## What has changed

Training expectations have shifted: personalization at scale, continuous adaptation, integration with HR systems, real-time analytics, regulatory compliance embedded by design. These are not add-ons to an LMS — they require a fundamentally different architecture. A pedagogical OS, not a content library.

## Key takeaways

- LMS solves logistics; current challenges are pedagogical and generative.
- LMS has no engine to create or adapt content.
- Personalization, continuous adaptation and integration require OS-level architecture.
- An LMS remains useful as a distribution channel within a broader OS.`,

  "comment-mentivisos-genere-une-formation-a-partir-dun-referentiel": `## How MentivisOS generates training from a framework

MentivisOS generates training content automatically from a target framework and a skills diagnosis. At no point does a human need to write a module, create slides or structure a course outline. The system produces a complete program: objectives, sequenced modules, methods, materials, assessments — aligned with the target framework and tailored to each learner's profile.

## Input: a framework and a diagnosis

The process starts with a skills framework (RNCP, internal competency grid, Qualiopi requirements) and a diagnosis of the learner's current level. These two inputs are sufficient for MentivisOS to produce the optimal learning path.

## Output: a complete program

The generated program includes measurable objectives, a structured sequence, pedagogical methods, supporting materials, assessment modalities and success criteria. Each component is aligned with the framework and adapted to the learner's starting point.

## What this changes

Instead of designing training from scratch for each need, the organization defines the framework and the profile — MentivisOS produces the program. This reduces production time from weeks to minutes and ensures that every program is both certified-aligned and personalized.

## Key takeaways

- MentivisOS generates complete programs from a framework + diagnosis.
- No human content writing is required for program generation.
- Output includes objectives, sequencing, methods, materials, assessments.
- Production time drops from weeks to minutes.
- Every program is simultaneously framework-aligned and personalized.`,

  "comment-mentivisos-adapte-un-parcours-competence-par-competence": `## How MentivisOS adapts a learning path skill by skill

MentivisOS adapts learning paths at the skill level, not the course level. After each module or assessment, the system measures what was actually acquired and compares it to the target level. If a skill is mastered, the path skips ahead. If a gap remains, additional content is generated to address it. This happens automatically, without human intervention.

## Course-level vs skill-level adaptation

A traditional LMS adapts at the course level: prerequisites, completions, time spent. MentivisOS adapts at the skill level: for each competency in the framework, the system knows whether it has been acquired, partially acquired, or not yet started. Adaptation is granular and precise.

## How the system decides

After each assessment, MentivisOS recalculates the learner's skill vector and compares it to the target. Gaps trigger automatic content generation. Mastery unlocks the next skill. The path evolves in real time based on actual performance, not assumptions.

## Key takeaways

- Adaptation happens at the skill level, not the course level.
- After each assessment, the path is recalculated.
- Mastered skills are skipped; gaps trigger new content.
- No human intervention required for path adjustments.
- Precision is made possible by the skill-by-skill measurement engine.`,

  "comment-mentivisos-mesure-lacquisition-reelle-des-competences": `## How MentivisOS measures real skill acquisition

MentivisOS measures skill acquisition through targeted assessments embedded in each learning module, not through time spent or content consumed. Each assessment is mapped to one or more competencies in the target framework. The result is a skill vector for each learner that shows, for every competency, whether it has been acquired, partially acquired or not yet started.

## Assessment design

Each assessment is designed to test a specific skill from the framework. Question types, scenarios and success thresholds are aligned with the target level. This ensures that what is measured corresponds to what needs to be acquired.

## From measurement to decision

The measurement feeds directly into the path adaptation engine. If the assessment shows a gap, the system generates additional content. If the skill is mastered, the learner moves to the next. The same measurement data is also available as a dashboard for managers and trainers.

## Key takeaways

- Measurement is skill-level, not time-based.
- Each assessment targets specific framework competencies.
- Results update a skill vector per learner.
- Measurement data drives automatic path adaptation.
- Dashboards make skill data visible to all stakeholders.`,

  "comment-mentivisos-securise-la-conformite-qualiopi-des-contenus": `## How MentivisOS secures Qualiopi compliance for generated content

MentivisOS generates content that is compliant with the National Quality Framework (RNQ) criteria by design. Each program, module and assessment is produced within a compliance architecture that aligns content structure with audit expectations. The system does not add compliance as an afterthought — it is built into the generation engine.

## Compliance by design

The target framework for each program includes Qualiopi requirements. When MentivisOS generates a program, it produces the exact documents auditors expect: a pedagogical outline linking needs analysis, objectives formulated as measurable skills, sequenced content and aligned assessments. These documents satisfy the requirements of indicator 2 of the RNQ.

## Audit-ready outputs

The generated program includes: needs analysis documentation, skill-based objectives, structured content outline, assessment modalities, and learner positioning at entry. Each element is dated, versioned and traceable — the type of evidence auditors prioritize during certification audits.

## Key takeaways

- Qualiopi compliance is embedded in the generation engine, not added later.
- Generated programs include all documents expected for criterion 2 of the RNQ.
- Each output is dated, versioned and traceable for audit purposes.
- The system reduces the risk of non-conformity during certification audits.`,

  "mentivisos-remplace-t-il-mon-lms-ou-sy-ajoute-t-il": `## Does MentivisOS replace my LMS or complement it?

MentivisOS complements an existing LMS rather than replacing it. The LMS continues to serve as the distribution and tracking layer for content, while MentivisOS handles what the LMS cannot: skills diagnosis, content generation, skill-by-skill adaptation and real-time measurement. The two systems operate at different levels of the training stack.

## The training stack

An LMS operates at the content level: it organizes, distributes and tracks modules. MentivisOS operates at the structural level: it generates the content, adapts it, measures acquisition and manages the skills framework. The LMS is a distribution channel within the MentivisOS ecosystem.

## Typical integration

A learner accesses training through the LMS interface or directly through MentivisOS. Content generated by MentivisOS is pushed to the LMS for distribution. Completion data flows back for tracking. The learner and manager experience a unified system, while the underlying architecture separates content management from content generation.

## Key takeaways

- MentivisOS complements your LMS, does not replace it.
- LMS handles distribution and tracking; MentivisOS handles generation and adaptation.
- Content flows from MentivisOS to the LMS automatically.
- The user experience is unified, the architecture is distributed.
- Migration is gradual, not a rip-and-replace.`,

  "quest-ce-que-talentos-dans-la-suite-mentivisos": `## What is TalentOS in the MentivisOS suite

TalentOS is the talent management component of the MentivisOS suite. While MentivisOS handles training (generation, adaptation, measurement), TalentOS handles the skills framework itself: mapping existing skills across the organization, tracking individual trajectories over time, and linking skills strategy directly to training programs. The two systems share the same competency data.

## The relationship between the two systems

MentivisOS generates training to close skill gaps. TalentOS identifies and tracks those gaps at the organizational level. Together, they create a closed loop: TalentOS identifies what is needed, MentivisOS generates the training, and the measurement data flows back to update the skills map.

## What TalentOS adds

TalentOS provides a real-time skills map of the organization: who has which skills, at what level, and what the gaps are. This data feeds strategic decisions: recruitment, internal mobility, training investments. When combined with MentivisOS, each identified gap automatically triggers the right training.

## Key takeaways

- TalentOS is the skills framework layer of the MentivisOS suite.
- It maps, tracks and analyzes organizational competencies.
- Data flows both ways with MentivisOS for closed-loop skills management.
- It enables evidence-based decisions on recruitment, mobility and training.`,

  "comment-talentos-relie-la-strategie-de-competences-a-la-formation": `## How TalentOS links skills strategy to training

TalentOS connects organizational skills strategy to training execution by maintaining a unified competency framework that serves both strategic planning and daily learning operations. When the organization decides to develop a new capability, TalentOS models the target skills, identifies current gaps, and automatically triggers the corresponding training programs in MentivisOS.

## From strategy to execution

Strategic decisions — entering a new market, adopting a new technology, meeting a regulatory requirement — translate into new competency requirements. TalentOS models these requirements, compares them to the current workforce profile, and produces a gap analysis. Each gap becomes a training need that MentivisOS can fulfill.

## Closing the loop

After training is completed, TalentOS updates the skills map with the new acquisition data. Progress is visible at the individual, team and organizational levels. The loop closes: strategy drives training, training results update strategy.

## Key takeaways

- TalentOS bridges strategic planning and training execution.
- Strategic decisions become competency requirements and gap analyses.
- Each gap automatically triggers targeted training.
- After training, the skills map is updated with new data.
- Progress is visible at individual, team and organizational levels.`,

  "learningos-et-talentos-quelle-difference": `## LearningOS and TalentOS: what's the difference

LearningOS and TalentOS are two components of the MentivisOS suite that operate at different levels of the skills management cycle. LearningOS handles training — generating, adapting, and assessing learning paths. TalentOS handles the skills framework — mapping, tracking, and analyzing competencies across the organization. They share the same data and work in sequence.

## The functional split

LearningOS is a training generation and delivery system. It takes a target framework and a learner profile and produces a personalized learning path. TalentOS is a skills management system. It maintains the organizational competency map, identifies gaps, and tracks progress over time.

## How they work together

TalentOS identifies that your sales team needs consultative selling skills — it models the target profile, assesses current levels, and produces a gap analysis. It sends this to LearningOS, which generates a customized training program for each team member. After training, LearningOS sends back the acquisition data, and TalentOS updates the skills map.

## Key takeaways

- LearningOS: training generation and delivery.
- TalentOS: skills framework and gap analysis.
- They share the same competency data and work in sequence.
- The cycle: TalentOS identifies gaps → LearningOS trains → TalentOS updates.`,

  "comment-talentos-cartographie-les-competences-dune-organisation": `## How TalentOS maps an organization's skills

TalentOS builds a skills map by importing data from multiple sources: HRIS, performance reviews, certifications, self-assessments, and the training history from LearningOS. Each source contributes information about who has which skills at what level. The system merges this data into a unified competency map that is continuously updated.

## Import sources

TalentOS connects to your HRIS to import job descriptions, role requirements, and employee data. It can also import certification records, external assessment results, and historical training data. Managers can perform team assessments directly in TalentOS, and individuals can self-assess their own skills.

## The unified map

All this data is combined into a single skills map where each person has a skill profile showing their current level for each competency from the organizational framework. Gaps are identified by comparing current profiles against target profiles defined by roles or strategic objectives.

## Key takeaways

- TalentOS imports data from HRIS, certifications, assessments, and training history.
- Multiple sources are merged into a unified competency map.
- Each person has a skill profile showing current levels per competency.
- Gaps are identified by comparing current vs target profiles.`,

  "comment-talentos-suit-les-parcours-individuels-dans-le-temps": `## How TalentOS tracks individual paths over time

TalentOS tracks each individual's competency development over time by maintaining a historical log of their skill profile at each assessment point. Every time a person completes training in LearningOS or undergoes an assessment, their profile is updated with the new data. The system can show progression curves, highlight stagnating skills, and predict future levels.

## The historical record

Each skill measurement event — whether from training, assessment, or manager review — creates a data point. These points are aggregated into a progression curve for each competency. The system can show what a person knew six months ago, what they know now, and at what rate they are acquiring new skills.

## Predictive analytics

Based on the progression data, TalentOS can predict when a person will reach a target skill level, identify who is at risk of falling behind, and recommend interventions before a gap becomes critical. These predictions support proactive talent management.

## Key takeaways

- Each assessment creates a historical data point per skill.
- Progression curves show development over time.
- Predictions identify who will reach targets and who needs intervention.
- Historical data supports evidence-based talent decisions.`,

  "comment-un-organisme-de-formation-utilise-talentos-pour-ses-clients": `## How a training organization uses TalentOS for its clients

A training organization can use TalentOS as a service platform for its client companies. Each client gets its own skills framework, employee profiles, and gap analysis. TalentOS identifies the training needs for each client, and LearningOS generates the corresponding programs. The training organization manages everything through a single dashboard.

## The service model

The training organization configures TalentOS with the client's competency framework and employee data. TalentOS performs an initial skills audit, identifies gaps, and recommends training actions. LearningOS generates the training, which the organization delivers. After training, TalentOS measures the skill improvement and reports results to the client.

## Multi-client management

TalentOS supports multiple clients within a single instance. Each client's data is isolated, and the training organization has a consolidated view of all client activities, billing, and outcomes.

## Key takeaways

- TalentOS can serve multiple client organizations from one instance.
- Each client gets their own skills framework and employee profiles.
- The cycle: audit → identify gaps → generate training → measure → report.
- Provides a single dashboard for multi-client management.`,

  "comment-lapi-de-mentivisos-sintegre-a-vos-outils-existants": `## How MentivisOS API integrates with your existing tools

MentivisOS exposes a comprehensive REST API that allows your existing tools — LMS, HRIS, CRM, custom applications — to interact with the system programmatically. All MentivisOS capabilities, from skills diagnosis to training generation to assessment data, are accessible via authenticated API endpoints.

## What the API provides

The API covers: skills framework management, learner profile management, training generation requests, program delivery, assessment submission and results retrieval, analytics, and user management. Everything you can do through the MentivisOS interface can be done through the API.

## Integration patterns

Typical integrations include: connecting an LMS as a distribution channel where MentivisOS-generated programs are pushed automatically, synchronizing learner data from an HRIS like Workday or SAP SuccessFactors, embedding MentivisOS training in a custom learning portal, and building custom dashboards that combine data from multiple sources.

## Key takeaways

- MentivisOS has a full REST API for all system capabilities.
- The API covers skills management, training generation, assessment, and analytics.
- Common integrations: LMS, HRIS, custom portals, BI tools.
- All tools and languages that support REST can integrate.`,

  "comment-integrer-mentivisos-a-un-sirh-workday-sap": `## How to integrate MentivisOS with an HRIS (Workday, SAP)

Integrating MentivisOS with an HRIS like Workday or SAP SuccessFactors synchronizes employee data, job roles, organizational structure, and competency frameworks between the two systems. This enables TalentOS to map skills based on real organizational data and for training to be assigned based on role requirements.

## What is synchronized

The integration typically synchronizes: employees and their organizational assignments, job roles and associated competency requirements, organizational hierarchy, certification records, and training history. The flow is bidirectional: role definitions and employee data come from the HRIS; skill assessments and training records flow back.

## Technical approach

The integration is done via the MentivisOS REST API and the HRIS's own API. A connector script runs on a schedule (daily or on-demand) to sync data. MentivisOS provides ready-to-use connector templates for Workday, SAP SuccessFactors, and other major HRIS platforms.

## Key takeaways

- Integration with HRIS syncs employee data, roles, skills, and training history.
- Data flows both ways: role definitions in → skill assessments out.
- Connector templates are available for major HRIS platforms.
- Custom integrations are supported via the REST API.`,

  "comment-integrer-mentivisos-a-un-lms-existent": `## How to integrate MentivisOS with an existing LMS

The LMS integration connects MentivisOS as a content generation layer upstream of your existing LMS. The LMS continues to serve as the distribution and tracking interface while MentivisOS handles skills diagnosis, content generation, and adaptation. Generated programs are pushed to the LMS automatically.

## Integration flow

MentivisOS generates a complete training program from a skills framework and learner profile. The program, including all materials and assessments, is packaged and sent to the LMS via API. The LMS makes it available to learners. Completion and assessment data flow back to MentivisOS for skill measurement and path adaptation.

## Which LMS platforms are supported

MentivisOS integrates with any LMS that exposes a content import API: Moodle, Docebo, 360Learning, Rise Up, Cornerstone, SAP SuccessFactors Learning, and custom-built platforms. The integration uses standard content packaging formats (SCORM, xAPI) and REST APIs.

## Key takeaways

- MentivisOS acts as a content generation layer upstream of your LMS.
- The LMS continues to serve as the distribution interface.
- Generated programs are pushed to the LMS automatically.
- Supports any LMS with content import API via SCORM, xAPI, or REST.`,

  "pourquoi-lhebergement-souverain-et-le-rgpd-comptent-pour-mentivisos": `## Why sovereign hosting and GDPR matter for MentivisOS

MentivisOS is hosted on sovereign European infrastructure, with data stored exclusively within the European Union. This is not a marketing feature but a structural requirement for organizations handling sensitive employee data, especially public institutions, healthcare organizations, and companies subject to strict data governance policies.

## Data sovereignty

All MentivisOS data — learner profiles, assessment results, organizational skills maps — is stored on servers located in France. No data leaves the European Economic Area. This means the system is compliant with the strictest interpretions of GDPR data transfer requirements.

## Security architecture

MentivisOS uses AES-256 encryption at rest, TLS 1.3 in transit, role-based access control, and full audit logging. The platform is SOC 2 Type II certified. These security measures are built into the architecture, not added as an afterthought.

## Why this matters for training

Employee skill data is among the most sensitive HR data. It reveals not just who knows what, but who doesn't know what, who is at risk of obsolescence, and who the organization considers critical. Using non-European infrastructure for this data carries legal and strategic risks that sovereign hosting eliminates.

## Key takeaways

- MentivisOS is hosted on sovereign European infrastructure.
- All data is stored exclusively within the European Union.
- AES-256, TLS 1.3, RBAC, audit logging, SOC 2 Type II.
- Sovereign hosting eliminates legal and strategic risks for sensitive employee data.`,

  "mentivisos-pour-les-organismes-de-formation-et-les-cfa": `## MentivisOS for training organizations and CFA

Training organizations and CFA (apprenticeship training centers) use MentivisOS to automate the production of certified training programs, ensure Qualiopi compliance, manage client relationships through TalentOS, and generate verifiable evidence for certification audits. The system handles the pedagogical engineering that previously required specialized instructional designers.

## What changes for training organizations

Instead of designing each program from scratch, the training organization defines the target certification framework and learner profiles. MentivisOS generates the complete program: pedagogical sequence, materials, assessments, and compliance documentation. The organization focuses on delivery and client relationships, not content production.

## Multi-client delivery

TalentOS enables the organization to manage multiple client skills frameworks simultaneously. Each client's data is isolated, and the organization can report on skill acquisition, certification rates, and compliance for each client individually.

## Key takeaways

- MentivisOS automates pedagogical engineering for training organizations.
- Programs are generated from frameworks and learner profiles.
- Compliance documentation is produced automatically.
- TalentOS enables multi-client skills management with isolated data.`,

  "mentivisos-pour-les-entreprises": `## MentivisOS for companies

Companies use MentivisOS to close skills gaps at scale, reduce training production costs, ensure regulatory compliance, and maintain a real-time competency map of their workforce. The system replaces the manual, fragmented approach to training with automated, integrated, data-driven skills management.

## What changes for companies

Instead of managing training as a series of disconnected projects — a compliance module here, a manager request there, an annual training plan — the company adopts a continuous skills management model. TalentOS maintains the skills map, identifies gaps automatically, and LearningOS generates the training to close them. The result is a closed-loop skills system.

## ROI drivers

MentivisOS reduces content production costs by automating program generation, improves compliance by embedding requirements into the generation engine, accelerates onboarding through personalized learning paths, and provides visibility into workforce capabilities that previously required manual audits.

## Key takeaways

- Replaces fragmented training management with continuous skills management.
- TalentOS identifies gaps; LearningOS generates training automatically.
- Reduces content production costs, improves compliance, accelerates onboarding.
- Provides real-time visibility into workforce capabilities.`,
};

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error("DB not found at", DB_PATH);
    process.exit(1);
  }

  const SQL = await sql();
  const buf = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(new Uint8Array(buf));

  const stmt = db.prepare("UPDATE referentiel_articles SET content_en = ? WHERE slug = ?");
  let count = 0;
  for (const [slug, contentEn] of Object.entries(TRANSLATIONS)) {
    const existing = db.prepare("SELECT content_en FROM referentiel_articles WHERE slug = ?").get([slug]);
    if (existing && existing[0]) {
      console.log(`  SKIP (already translated): ${slug}`);
      continue;
    }
    stmt.run([contentEn, slug]);
    console.log(`  OK: ${slug}`);
    count++;
  }

  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  console.log(`\nDone. ${count} articles translated.`);
}

main().catch(console.error);
