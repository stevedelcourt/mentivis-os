#!/usr/bin/env node
// Add English (content_en) translations for remaining blog articles.
// Usage: DATA_DIR=/path/to/data node scripts/translate-blog.js

const fs = require("fs");
const path = require("path");
const sql = require("sql.js");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "mentivis.db");

const TRANSLATIONS = {

  "mentivis-conseil": {
    titleEn: "Mentivis Conseil — Operational Consulting for Training Organizations",
    excerptEn: "Mentivis is not a software publisher — it's an operator embedded in the real operations of training organizations. The team has built institutions from scratch, written competency frameworks, led digital transformations, and negotiated with funders. This proximity to ground reality produces a rare asset: a lived map of where training organizations actually break down.",
    contentEn: `Most tools designed for training organizations were built by software publishers. They cover isolated functions, manage what is measurable well, and leave the rest to the organization. The rest is precisely where institutions lose time, money, and learners.

Mentivis is not a publisher. It is an operator, positioned close to organizations and their real problems. The team has created institutions from scratch, written competency frameworks, restructured offerings, built acquisition strategies, negotiated with funders, and led digital transformations in organizations with no digital culture. This work has been conducted across projects of very different natures, in regulatory, pedagogical and commercial contexts that bear no resemblance to one another.

This proximity to the field produces something rare: a precise, lived map of the real breaking points of a training organization. What blocks an accreditation. What drives a prospect away mid-journey. What makes a program unfundable. What exhausts a pedagogical director managing too many things across too many tools. These frictions are not visible from outside the sector. They are not found in market studies or benchmarks. They are acquired through operational immersion, in daily contact with teams, decision-makers, learners, and the systemic constraints that structure their reality.

#### It is in this context that MentivisOS was not decided. It imposed itself.

By intervening at every layer of an institution's operations, repeating the same diagnoses across different organizations, and observing that the same problems recurred despite different contexts, the question was no longer whether an integrated system was useful. It was why it did not already exist. MentivisOS is the direct answer to that question. Not a product vision built on hypotheses, but a logical consequence of accumulated practice, translated into architecture.

Every module reflects a real situation. Every flow was designed for an organization with small teams, broad responsibilities, and immediate performance stakes. Nothing was designed by analogy with another sector or by imitation of an existing tool.

#### **Key benefits**

- Complete coverage of an institution's lifecycle, from initial strategy to pedagogical and commercial management
- Learner acquisition and nurturing structured within the same environment as pedagogical management
- Drastic reduction in administrative processing time and cross-tool lead loss
- Immediate operational deployment, no lengthy configuration phase
- Designed for small teams with broad responsibilities
- Architecture born from the field, not from a product logic

**[mentivis.com](https://mentivis.com)**`,
  },

  "mentivisos-est-la---la-formation-professionnelle-vient-de-changer-de-logiciel": {
    titleEn: "MentivisOS Is Here — Professional Training Just Changed Its Operating System",
    excerptEn: "Professional training has suffered from the same structural flaw for too long: systems built by stacking, never by design. MentivisOS changes this by operating at the infrastructure level, not the application level. It is not a new tool — it is a new architecture.",
    contentEn: `## What MentivisOS Changes, and Why It Matters Now

Professional training has suffered from the same structural flaw for too long: systems built by stacking, never by design. One provider for instructional engineering. Another for the platform. A third for compliance tracking. A fourth for candidate management. Each tool solves one problem. Together, they create a meta-problem — the friction between them — that consumes more energy than the problems they were supposed to solve.

MentivisOS does not add a new layer. It replaces the stack.

## Why the stack is the problem

When a learner moves from acquisition to enrollment to training to certification, their data moves across systems that do not speak to each other. Each transfer point is a point of information loss, a duplication of effort, or an administrative delay. For a training organization, this translates into hours spent re-entering data, reconciling spreadsheets, and chasing information across platforms.

MentivisOS was designed as a single environment covering the entire learner lifecycle: from the first contact and enrollment to pedagogical delivery, assessment, certification, and post-training analytics. There is no middleware. There is no export-import between platforms. Information lives in one place and is accessed by those who need it, when they need it.

## Designed for the real size of training organizations

Most training organizations in France and Europe do not have the internal resources needed to absorb a complex deployment. They operate with small teams covering multiple functions. MentivisOS was designed for this reality. The system becomes operational without a lengthy configuration phase, because the intelligence about what needs to be set up is already embedded in the system.

This is not a stripped-down version of a complex product. It is a different architectural choice: a system that assumes the organization does not have a dedicated IT team, does not have months to configure, and cannot afford to lose data between tools.

## What this means in practice

For a training organization, MentivisOS means: one environment for managing prospects, enrollments, learners, programs, assessments, certifications, and compliance documentation. Data entered once is available everywhere. Administrative time is reduced. Lead loss between tools is eliminated. The pedagogical team focuses on pedagogy, not on reconciling systems.

For a company: one view of workforce skills, from gap analysis to training completion to certification tracking.

For a learner: a continuous journey from enrollment to certification, without administrative friction.

## MentivisOS is a new category

This is why MentivisOS is not an LMS, not an ERP, not a CRM. It is a pedagogical operating system — the first environment designed to operate the full cycle of training, not a single function within it. That is the difference between a tool and an infrastructure.

**[Discover MentivisOS](https://mentivisos.com)**`,
  },

  "comment-mentivisos-change-la-formation-en-entreprise": {
    titleEn: "How MentivisOS Is Changing Corporate Training",
    excerptEn: "The real problem is not the training budget — it's that current systems produce content but not competence. MentivisOS changes the logic by measuring real acquisition, not just completion, and by generating personalized paths at scale.",
    contentEn: `## The real problem is not the training budget

French and European companies spend billions of euros every year on professional training. Skills development plans grow larger. Module catalogs get longer. LMS platforms multiply. Yet the question that should be asked is rarely answered: are people actually acquiring the skills they need?

Most training systems measure what is easy to measure: hours spent, modules completed, satisfaction scores. What they do not measure is what matters: whether a competency has actually been acquired, whether it can be applied in a professional context, and whether the gap between current and required skills has been closed.

## The gap between training and competence

A learner completes a module. The LMS records a completion. The manager sees a green checkmark. But the module measured attendance, not acquisition. The learner may have clicked through without retaining anything. Or they may have already mastered the content before starting. Neither situation is detected.

This is not a failure of the learner or the manager. It is a structural limitation of the tools used today. Most training technology was designed to distribute content and track completions — not to measure whether learning actually occurred.

## How MentivisOS addresses this

MentivisOS measures skill acquisition at the individual competency level, not at the course level. Each assessment is mapped to one or more competencies from the target framework. After each module, the system knows — with precision — what has been acquired, what remains to be learned, and what needs to be adapted.

This measurement is not a report generated at the end of a program. It is continuous. After each assessment, the learner's skill vector is updated, the path is recalculated, and the next module is adapted to their actual level. If a skill is mastered, the path moves forward. If a gap remains, new content is generated to address it.

## What this changes for the organization

For the training manager: visibility into real skill levels across the organization, not just completion rates. For the HR director: data that connects training investment to actual capability. For the learner: a path that adapts to their actual level, not a one-size-fits-all sequence.

MentivisOS does not replace the LMS — it operates at a different level. The LMS distributes content. MentivisOS generates, adapts, and measures the acquisition of that content. The LMS tells you who showed up. MentivisOS tells you who learned.

## From fixed programs to continuous adaptation

Traditional training is a batch process: design a program, deploy it, measure results at the end, and start over. MentivisOS makes training a continuous process: assess, generate, deploy, measure, adapt. The loop runs constantly, adjusting to each learner's progress in real time.

This is the difference between training as an event and training as a system. One is episodic. The other is continuous. One measures input. The other measures output.

**[Discover MentivisOS](https://mentivisos.com)**`,
  },

  "MentivisOS s'associe à l'ICIA pour structurer l'acculturation à l'IA à l'échelle nationale": {
    titleEn: "MentivisOS Partners with ICIA to Structure AI Acculturation at National Scale",
    excerptEn: "Artificial intelligence is deeply reshaping labor markets, organizations and civic practices. The question is no longer whether this transformation will happen, but who will be able to support it methodically, at scale, and without leaving any audience behind.",
    contentEn: `Artificial intelligence is deeply reshaping labor markets, organizations and civic practices. The question is no longer whether this transformation will happen, but who will be able to support it methodically, at scale, and without leaving any audience behind.

MentivisOS announces its partnership with the Interministerial Committee for Artificial Intelligence (ICIA) to design and deploy a national AI acculturation program. The initiative aims to equip public servants, economic actors and citizens with the foundational knowledge needed to understand, use and supervise AI systems in their respective contexts.

## A structured approach to AI acculturation

The partnership combines ICIA's institutional mandate with MentivisOS's pedagogical generation engine to produce training content that is both rigorous in its technical foundation and accessible to non-specialist audiences. The program is structured around three levels: discovery (understanding what AI is and what it changes), application (using AI tools in professional contexts), and governance (supervising AI systems within a regulatory framework).

Each level includes generated learning paths, contextualized assessments, and certification of acquired competencies. The system adapts the content to each learner's sector, role and prior knowledge, ensuring that a civil servant, a small business owner and a student each receive a path aligned with their needs.

## Why this partnership matters

AI acculturation cannot be reduced to a catalog of online modules. It requires a systemic approach: content that evolves as fast as the technology, paths that adapt to highly diverse audiences, and measurement that verifies actual understanding, not just content consumption.

MentivisOS brings to this partnership its capacity to generate pedagogical content automatically from any framework, to adapt it in real time to each learner's level, and to measure acquisition at the competency level. The ICIA brings its institutional reach and its understanding of the challenges specific to the French public sector.

## First deployments

The first deployments will target public administration audiences, with a focus on decision-makers and managers who need to understand AI's implications for their organizations. The program will then be extended to economic actors and the general public.

**[Discover MentivisOS](https://mentivisos.com)**`,
  },

  "mentivisos-sassocie-a-marius-ia-pour-deployer-une-solution-dapprentissage-entier": {
    titleEn: "MentivisOS Partners with Marius IA to Deploy a Fully AI-Driven Learning Solution",
    excerptEn: "Professional training has accumulated a structural deficit for years: abundant content, underserved learners, and systems unable to adapt in real time. MentivisOS was designed to fix this. This partnership takes it a step further.",
    contentEn: `Professional training has accumulated a structural deficit for years: abundant content, underserved learners, and systems unable to adapt in real time to the reality of each learning path. MentivisOS was designed to fix this. This partnership takes it a step further.

MentivisOS announces its partnership with Marius IA, a French AI consulting and deployment firm specializing in artificial intelligence solutions for businesses and public institutions. Together, they deploy a fully AI-piloted learning solution combining Marius IA's expertise in AI deployment with MentivisOS's pedagogical generation engine.

## What the partnership enables

The integrated solution covers the full cycle: skills diagnosis, automatic generation of personalized learning paths, deployment through multiple channels, continuous assessment, and real-time adaptation. Marius IA contributes its field expertise in AI deployment and its understanding of enterprise transformation challenges. MentivisOS contributes its capacity to generate pedagogical content automatically from any competency framework.

## For whom

The solution targets companies and public institutions undergoing AI transformation. The first deployments focus on organizations that need to train large numbers of employees in AI-related skills — data literacy, AI tool usage, prompt engineering, AI governance — and need a solution that adapts to heterogeneous audiences.

## The integration

MentivisOS and Marius IA have integrated their respective platforms to create a seamless experience from diagnosis to certification. Skills gaps identified during the diagnostic phase are automatically translated into personalized learning paths by MentivisOS. Training is deployed, assessed and certified within the same environment. Results feed back into the skills map for continuous tracking.

**[Discover MentivisOS](https://mentivisos.com)**`,
  },
};

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error("DB not found at", DB_PATH);
    process.exit(1);
  }

  const SQL = await sql();
  const buf = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(new Uint8Array(buf));

  let count = 0;
  for (const [slug, data] of Object.entries(TRANSLATIONS)) {
    const existing = db.prepare("SELECT content_en FROM posts WHERE slug = ?").get([slug]);
    if (existing && existing[0]) {
      console.log(`  SKIP (already translated): ${slug}`);
      continue;
    }
    db.prepare("UPDATE posts SET title_en = ?, excerpt_en = ?, content_en = ? WHERE slug = ?").run([data.titleEn, data.excerptEn, data.contentEn, slug]);
    console.log(`  OK: ${slug}`);
    count++;
  }

  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  console.log(`\nDone. ${count} articles translated.`);
}

main().catch(console.error);
