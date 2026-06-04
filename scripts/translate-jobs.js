#!/usr/bin/env node
// Add English translations for all jobs.
// Usage: DATA_DIR=/path/to/data node scripts/translate-jobs.js

const fs = require("fs");
const path = require("path");
const sql = require("sql.js");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "mentivis.db");

const WHY_JOIN_EN = `## About Mentivis & MentivisOS

MentivisOS is an AI-native operating system for education, training, and skills transformation.

Created by Mentivis, a consulting and engineering firm specializing in pedagogical transformation, technology, and business development, MentivisOS was built from years of hands-on experience designing and operating training institutions.

We are convinced that AI will deeply transform how organizations develop their activities, skills, and training ecosystems. Our team works at the intersection of education and technology, alongside leading institutions.

Every project at Mentivis is an opportunity to invent what training looks like when designed for real people, real constraints, and real outcomes.

**Join us to build the future of training.**

---

*Mentivis is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.*`;

const TRANSLATIONS = {
  "1cfeylniookgpyvdnrhz9v9f": {
    titleEn: "Accounts Receivable Lead",
    locationEn: "Paris",
    departmentEn: "Operations",
    descriptionEn: `With the growth of MentivisOS among institutions, enterprises, and training organizations, rigorous management of financial operations and the billing cycle has become essential. We are looking for an Accounts Receivable Lead to structure, monitor, and optimize the billing and collection processes.

## Your Responsibilities

### Billing Management
- Manage the complete billing cycle: issuing invoices, tracking payments, managing reminders and collection procedures.
- Ensure compliance with applicable regulations (Qualiopi, OPCO, CPF).
- Maintain and update customer records in the ERP and CRM systems.

### Monitoring and Reporting
- Track key accounts receivable indicators: DSO, aging, collection rate.
- Produce weekly and monthly reports for management.
- Identify payment incidents and propose corrective actions.

### Process Optimization
- Improve and automate accounts receivable workflows.
- Contribute to tool selection and implementation (ERP, payment platforms).
- Collaborate with the finance, sales, and operations teams to reduce payment times.

### Customer Relations
- Serve as the primary contact for customer billing inquiries.
- Handle dispute resolution and payment negotiations.
- Maintain professional relationships with institutional clients, OPCOs, and corporate accounts.`,
  },
  "4a8fbj1tkyh3b96mco9yb6ki": {
    titleEn: "Full-Stack Engineer",
    locationEn: "Marseille",
    departmentEn: "Engineering & Product",
    descriptionEn: `We are looking for Full-Stack Engineers capable of developing and maintaining the front-end and back-end components of the MentivisOS ecosystem.

## Your Responsibilities
- Design, develop, and maintain web applications (Next.js, TypeScript, React).
- Build and optimize REST APIs and backend services (Node.js, SQLite).
- Participate in architecture discussions and technical design.
- Write and maintain tests, documentation, and CI/CD pipelines.
- Collaborate with product, design, and operations teams.
- Ensure code quality, security, and performance.

## Preferred Experience
- 3+ years of experience in full-stack development.
- Strong proficiency in TypeScript, React, and Node.js.
- Experience with SQL databases and API design.
- Familiarity with Git, CI/CD, and agile methodologies.
- Interest in the education/training sector is a plus.

## Location
Marseille office with partial remote work possible.`,
  },
  "yrxbtmujei48q36t56dnhbu7": {
    titleEn: "Automations Engineer",
    locationEn: "Paris",
    departmentEn: "Engineering & Product",
    descriptionEn: `We believe AI will deeply transform how organizations develop their activities, skills, and training ecosystems. As an AI Automation Engineer at MentivisOS, you will design, build, and deploy AI-powered automation systems that streamline pedagogical and administrative processes.

## Your Responsibilities
- Design and implement AI agents and automation pipelines for training operations (content generation, assessment, learner path adaptation).
- Integrate LLM APIs and AI services into the MentivisOS platform.
- Develop internal tools to automate repetitive tasks across departments.
- Monitor and optimize the performance, cost, and reliability of AI systems.
- Collaborate with product, engineering, and operations to identify automation opportunities.

## Preferred Experience
- 3+ years in software engineering with a focus on automation or AI.
- Experience with LLM APIs (OpenAI, Anthropic, open-source models).
- Strong Python or TypeScript skills.
- Understanding of prompt engineering, RAG, and agent architectures.
- Familiarity with NLP, document parsing, or workflow automation tools.
- Interest in education technology is a strong plus.

## Location
Paris office with partial remote work possible.`,
  },
  "oy37uyjg2n6c5l1jsjrh7vdx": {
    titleEn: "B2B Marketing Growth Lead Germany",
    locationEn: "Berlin",
    departmentEn: "Growth",
    descriptionEn: `## Your Responsibilities

### Driving B2B Growth
- Develop MentivisOS's growth strategy in Germany, with a focus on Berlin and the tech, education, and AI ecosystem.
- Build and execute a lead generation plan targeting training organizations, enterprises, and institutions.
- Manage the full sales cycle: prospecting, qualification, product demos, negotiation, closing.

### Local Market Development
- Establish MentivisOS's presence in the German market by identifying strategic partners, events, and channels.
- Adapt marketing and sales materials for the German audience while maintaining brand consistency.
- Represent MentivisOS at German industry events and conferences.

### Performance Tracking
- Monitor KPIs: pipeline value, conversion rates, CAC, LTV.
- Provide weekly sales forecasts and market intelligence.
- Collaborate with the French team to align strategy and share best practices.

## Preferred Experience
- 5+ years in B2B sales or business development, ideally in EdTech, HR Tech, or SaaS.
- Deep understanding of the German professional training ecosystem.
- Fluent German and English; French is a plus.
- Proven track record of meeting or exceeding revenue targets.
- Existing network in the German training or education sector.

## Location
Berlin-based role with regular travel within Germany and occasional travel to Paris.`,
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
    const existing = db.prepare("SELECT title_en FROM jobs WHERE slug = ?").get([slug]);
    if (existing && existing[0]) {
      console.log(`  SKIP (already translated): ${slug}`);
      continue;
    }
    db.prepare("UPDATE jobs SET title_en = ?, description_en = ?, why_join_en = ?, location_en = ?, department_en = ? WHERE slug = ?")
      .run([data.titleEn, data.descriptionEn, WHY_JOIN_EN, data.locationEn, data.departmentEn, slug]);
    console.log(`  OK: ${slug}`);
    count++;
  }

  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  console.log(`\nDone. ${count} jobs translated.`);
}

main().catch(console.error);
