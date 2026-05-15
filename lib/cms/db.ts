import { getDb } from "./sqlite";
import { Post, PageContent, PricingContent, SeoContent, FormSubmission, Job, JobApplication, JobType, HeroContent, PageKey, PAGE_KEYS } from "./types";

export { generateSlug } from "./utils";

// ── Posts ──

let postsCache: Post[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5000;

function rowToPost(row: any): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    date: row.date,
    dateISO: row.date_iso,
    imageUrl: row.image_url,
    imageTag: row.image_tag,
    imageCaption: row.image_caption,
    gradientId: row.gradient_id,
    featured: !!row.featured,
    published: !!row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getPostsFromDb(): Promise<Post[]> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM posts ORDER BY date_iso DESC").all();
  return rows.map(rowToPost);
}

async function getPosts(): Promise<Post[]> {
  const now = Date.now();
  if (!postsCache || now - cacheTime > CACHE_TTL) {
    postsCache = await getPostsFromDb();
    cacheTime = now;
  }
  return postsCache;
}

export async function getPostCount(): Promise<{ total: number; published: number; draft: number }> {
  const db = await getDb();
  const total = (db.prepare("SELECT COUNT(*) as c FROM posts").get() as any).c;
  const published = (db.prepare("SELECT COUNT(*) as c FROM posts WHERE published = 1").get() as any).c;
  const draft = total - published;
  return { total, published, draft };
}

export async function getAllPosts(): Promise<Post[]> {
  return getPosts();
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.published);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug);
  return row ? rowToPost(row) : undefined;
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
  return row ? rowToPost(row) : undefined;
}

export async function createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
  const db = await getDb();
  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO posts (slug, title, excerpt, content, category, date, date_iso, image_url, image_tag, image_caption, gradient_id, featured, published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    post.slug, post.title, post.excerpt, post.content, post.category, post.date, post.dateISO,
    post.imageUrl || null, post.imageTag || null, post.imageCaption || null,
    post.gradientId ?? null,
    post.featured ? 1 : 0, post.published ? 1 : 0, now, now
  );
  postsCache = null;
  return { ...post, id: Number(result.lastInsertRowid), createdAt: now, updatedAt: now };
}

export async function updatePost(id: number, updates: Partial<Omit<Post, "id" | "createdAt">>): Promise<Post | null> {
  const db = await getDb();
  const existing = await getPostById(id);
  if (!existing) return null;

  const setParts: string[] = [];
  const values: any[] = [];

  if (updates.slug !== undefined) { setParts.push("slug = ?"); values.push(updates.slug); }
  if (updates.title !== undefined) { setParts.push("title = ?"); values.push(updates.title); }
  if (updates.excerpt !== undefined) { setParts.push("excerpt = ?"); values.push(updates.excerpt); }
  if (updates.content !== undefined) { setParts.push("content = ?"); values.push(updates.content); }
  if (updates.category !== undefined) { setParts.push("category = ?"); values.push(updates.category); }
  if (updates.date !== undefined) { setParts.push("date = ?"); values.push(updates.date); }
  if (updates.dateISO !== undefined) { setParts.push("date_iso = ?"); values.push(updates.dateISO); }
  if (updates.imageUrl !== undefined) { setParts.push("image_url = ?"); values.push(updates.imageUrl); }
  if (updates.imageTag !== undefined) { setParts.push("image_tag = ?"); values.push(updates.imageTag); }
  if (updates.imageCaption !== undefined) { setParts.push("image_caption = ?"); values.push(updates.imageCaption); }
  if (updates.gradientId !== undefined) { setParts.push("gradient_id = ?"); values.push(updates.gradientId); }
  if (updates.featured !== undefined) { setParts.push("featured = ?"); values.push(updates.featured ? 1 : 0); }
  if (updates.published !== undefined) { setParts.push("published = ?"); values.push(updates.published ? 1 : 0); }

  if (setParts.length === 0) return existing;

  const now = new Date().toISOString();
  setParts.push("updated_at = ?");
  values.push(now);
  values.push(id);

  db.prepare(`UPDATE posts SET ${setParts.join(", ")} WHERE id = ?`).run(...values);
  postsCache = null;
  return (await getPostById(id))!;
}

export async function deletePost(id: number): Promise<boolean> {
  const db = await getDb();
  const result = db.prepare("DELETE FROM posts WHERE id = ?").run(id);
  postsCache = null;
  return result.changes > 0;
}

export async function searchPosts(query: string): Promise<Post[]> {
  const db = await getDb();
  try {
    const rows = db.prepare(`
      SELECT posts.* FROM posts
      JOIN posts_fts ON posts.id = posts_fts.rowid
      WHERE posts_fts MATCH ?
      ORDER BY rank
    `).all(query);
    return rows.map(rowToPost);
  } catch {
    const like = `%${query}%`;
    const rows = db.prepare("SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY date_iso DESC").all(like, like);
    return rows.map(rowToPost);
  }
}

// ── Generic JSON helpers (backward compatibility) ──

export function readJsonFile<T>(filePath: string, fallback: T): T {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

export function writeJsonFile<T>(filePath: string, data: T) {
  const fs = require("fs");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ── Pages (CMS Heroes) ──

const DEFAULT_HERO_FR: Record<string, HeroContent> = {
  homepage: {
    eyebrow: "Mentivis OS",
    headline: "MentivisOS forme vos collaborateurs, gere vos recrutements et pilote la montee en competences de vos equipes.",
    subheadline: "Un seul systeme qui dispense les formations, analyse les profils candidats, orchestre les recrutements et suit chaque parcours upskilling. Connecte a vos outils via la Mentivis API. Operationnel immediatement, sans refonte de votre organisation.",
    ctaPrimary: "Demarrer gratuitement",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contacter l'equipe",
    ctaSecondaryLink: "/fr/contact",
    proof: "Utilise par les directions de la formation, les CFA, les campus d'entreprise.",
  },
  learningos: {
    eyebrow: "LearningOS",
    headline: "Le systeme de formation native IA\nqui transforme vos collaborateurs en talents.",
    subheadline: "Generez des parcours personnalises, adaptez les contenus automatiquement\net pilotez la montee en competences de vos equipes — le tout dans un seul systeme.",
    ctaPrimary: "Demarrer gratuitement",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contacter l'equipe",
    ctaSecondaryLink: "/contact",
    proof: "Utilise par les directions de la formation, les CFA, les campus d'entreprise.",
  },
  talentos: {
    eyebrow: "TalentOS",
    headline: "Recruter devient un systeme.",
    subheadline: "ATS intelligent, matching de profils, tests & cas pratiques, et pilotage de vos recrutements — le tout dans un seul systeme connecte a vos outils RH.",
    ctaPrimary: "Demarrer gratuitement",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contacter l'equipe",
    ctaSecondaryLink: "/contact",
    proof: "Utilise par les directions RH, les cabinets de recrutement, les CFA.",
  },
  about: {
    eyebrow: "A propos",
    headline: "MentivisOS est le systeme de formation native IA concu par Mentivis",
    subheadline: "De la strategie au deploiement operationnel. Un seul OS pour former, certifier et faire grandir les talents.",
    ctaPrimary: "",
    ctaPrimaryLink: "",
    ctaSecondary: "",
    ctaSecondaryLink: "",
    proof: "",
  },
  security: {
    eyebrow: "Securite",
    headline: "L'IA pedagogique pour transformer la formation,\navec confidentialite et protections integrees.",
    subheadline: "",
    ctaPrimary: "",
    ctaPrimaryLink: "",
    ctaSecondary: "",
    ctaSecondaryLink: "",
    proof: "",
  },
  ambassadors: {
    eyebrow: "Programme Affiliation & Ambassadeur",
    headline: "Recommandez MentivisOS\net developpez votre activite.",
    subheadline: "Un programme concu pour les professionnels de la formation, du recrutement et du conseil qui souhaitent recommander MentivisOS a leur reseau.",
    ctaPrimary: "Rejoindre le programme",
    ctaPrimaryLink: "/contact",
    ctaSecondary: "Demander une presentation",
    ctaSecondaryLink: "/demo",
    proof: "",
  },
};

const DEFAULT_HERO_EN: Record<string, HeroContent> = {
  homepage: {
    eyebrow: "Mentivis OS",
    headline: "MentivisOS trains your employees, manages your recruitment and drives your teams' skill development.",
    subheadline: "A single system that delivers training, analyzes candidate profiles, orchestrates recruitment and tracks every upskilling journey. Connected to your tools via the Mentivis API. Operational immediately, without restructuring your organization.",
    ctaPrimary: "Start for free",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contact the team",
    ctaSecondaryLink: "/en/contact",
    proof: "Used by training departments, CFAs, corporate campuses.",
  },
  learningos: {
    eyebrow: "LearningOS",
    headline: "The AI-native training system\nthat turns your employees into talents.",
    subheadline: "Generate personalized learning paths, automatically adapt content,\nand drive your teams' skill development — all in a single system.",
    ctaPrimary: "Start for free",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contact the team",
    ctaSecondaryLink: "/contact",
    proof: "Used by training departments, CFAs, corporate campuses.",
  },
  talentos: {
    eyebrow: "TalentOS",
    headline: "Recruiting becomes a system.",
    subheadline: "Smart ATS, profile matching, tests & case studies, and recruitment pipeline management — all in a single system connected to your HR tools.",
    ctaPrimary: "Start for free",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contact the team",
    ctaSecondaryLink: "/contact",
    proof: "Used by HR departments, recruitment firms, CFAs.",
  },
  about: {
    eyebrow: "About",
    headline: "MentivisOS is the native AI training system built by Mentivis",
    subheadline: "From strategy to operational deployment. A single OS to train, certify, and grow talent.",
    ctaPrimary: "",
    ctaPrimaryLink: "",
    ctaSecondary: "",
    ctaSecondaryLink: "",
    proof: "",
  },
  security: {
    eyebrow: "Security",
    headline: "AI-powered pedagogy to transform training,\nwith built-in confidentiality and protections.",
    subheadline: "",
    ctaPrimary: "",
    ctaPrimaryLink: "",
    ctaSecondary: "",
    ctaSecondaryLink: "",
    proof: "",
  },
  ambassadors: {
    eyebrow: "Affiliation & Ambassador Program",
    headline: "Recommend MentivisOS\nand grow your business.",
    subheadline: "A program designed for training, recruitment and consulting professionals who want to recommend MentivisOS to their network.",
    ctaPrimary: "Join the program",
    ctaPrimaryLink: "/contact",
    ctaSecondary: "Request a presentation",
    ctaSecondaryLink: "/demo",
    proof: "",
  },
};

const DEFAULT_PAGES: PageContent = {
  fr: Object.fromEntries(Object.entries(DEFAULT_HERO_FR).map(([k, v]) => [k, { hero: v }])) as PageContent["fr"],
  en: Object.fromEntries(Object.entries(DEFAULT_HERO_EN).map(([k, v]) => [k, { hero: v }])) as PageContent["en"],
};

async function seedDefaultPageHeroes(db: any) {
  // Seed all pages for both languages if the table is empty
  const count = db.prepare("SELECT COUNT(*) as c FROM pages").get() as any;
  if (count.c > 0) return;

  const now = new Date().toISOString();
  const stmt = db.prepare("INSERT OR IGNORE INTO pages (lang, page, hero_json, updated_at) VALUES (?, ?, ?, ?)");
  for (const lang of ["fr", "en"] as const) {
    const heroes = lang === "fr" ? DEFAULT_HERO_FR : DEFAULT_HERO_EN;
    for (const page of PAGE_KEYS) {
      stmt.run(lang, page, JSON.stringify(heroes[page]), now);
    }
  }
}

function emptyHero(): HeroContent {
  return { eyebrow: "", headline: "", subheadline: "", ctaPrimary: "", ctaPrimaryLink: "", ctaSecondary: "", ctaSecondaryLink: "", proof: "" };
}

export async function getPages(): Promise<PageContent> {
  const db = await getDb();
  await seedDefaultPageHeroes(db);

  const rows = db.prepare("SELECT * FROM pages").all() as any[];

  const result: PageContent = {
    fr: {} as Record<PageKey, { hero: HeroContent }>,
    en: {} as Record<PageKey, { hero: HeroContent }>,
  };
  for (const pk of PAGE_KEYS) {
    result.fr[pk] = { hero: { ...DEFAULT_HERO_FR[pk] } };
    result.en[pk] = { hero: { ...DEFAULT_HERO_EN[pk] } };
  }

  for (const row of rows) {
    const lang = row.lang as "fr" | "en";
    const page = row.page as string;
    if (PAGE_KEYS.includes(page as PageKey)) {
      try {
        const hero = JSON.parse(row.hero_json);
        result[lang][page as PageKey] = { hero };
      } catch { /* keep default */ }
    }
  }
  return result;
}

export async function getPage(page: PageKey): Promise<{ fr: { hero: HeroContent }; en: { hero: HeroContent } }> {
  const pages = await getPages();
  return {
    fr: pages.fr[page] || { hero: { ...DEFAULT_HERO_FR[page] } },
    en: pages.en[page] || { hero: { ...DEFAULT_HERO_EN[page] } },
  };
}

export async function savePages(data: PageContent) {
  const db = await getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO pages (lang, page, hero_json, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(lang, page) DO UPDATE SET hero_json = excluded.hero_json, updated_at = excluded.updated_at
  `);
  for (const lang of ["fr", "en"] as const) {
    for (const page of PAGE_KEYS) {
      const hero = data[lang]?.[page]?.hero;
      if (hero) {
        stmt.run(lang, page, JSON.stringify(hero), now);
      }
    }
  }
}

export async function savePage(page: PageKey, lang: "fr" | "en", hero: HeroContent) {
  const db = await getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO pages (lang, page, hero_json, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(lang, page) DO UPDATE SET hero_json = excluded.hero_json, updated_at = excluded.updated_at
  `).run(lang, page, JSON.stringify(hero), now);
}

// ── Pricing ──

const DEFAULT_PRICING: PricingContent = {
  learningos: [
    {
      name: "Starter",
      description: "Pour structurer rapidement une academie interne pilotee par IA.",
      monthlyPrice: 990,
      yearlyPrice: 950,
      originalPrice: 990,
      setupFee: 3500,
      cta: "Choisir Starter",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--module-grad-2)",
      previousPlan: null,
      features: [
        "Generation automatique de parcours de formation personnalises",
        "Adaptation des contenus selon vos metiers et referentiels internes",
        "Agents IA conversationnels pour accompagner les collaborateurs",
        "Suivi des competences et progression en temps reel",
        "Espace entreprise securise",
        "Deploiement rapide sans equipe pedagogique interne",
        "Compatible financement OPCO",
      ],
      creditLimit: "100 apprenants",
      popular: false,
    },
    {
      name: "Growth",
      description: "Pour industrialiser la montee en competences a l'echelle d'une equipe ou d'un reseau.",
      monthlyPrice: 2900,
      yearlyPrice: 2700,
      originalPrice: 2900,
      setupFee: 8500,
      cta: "Choisir Growth",
      ctaLink: "/demo",
      gradient: "var(--module-grad-3)",
      previousPlan: "Starter",
      features: [
        "Tout Starter",
        "Generation avancee de parcours certifiants",
        "Adaptation automatique selon les postes, niveaux et objectifs",
        "Bibliotheque metier dynamique alimentee par IA",
        "Tableaux de pilotage RH et competences",
        "Workflows de validation manageriale",
        "Reporting conformite et tracabilite formation",
        "Assistance au montage des financements publics et OPCO",
        "API et integrations SIRH",
      ],
      creditLimit: "500 utilisateurs",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Pour construire une veritable infrastructure de formation autonome et certifiante.",
      monthlyPrice: null,
      yearlyPrice: null,
      originalPrice: null,
      setupFee: 15000,
      cta: "Contacter l'equipe",
      ctaLink: "/contact",
      gradient: "var(--module-grad-4)",
      previousPlan: "Growth",
      features: [
        "Tout Growth",
        "Generateur de certifications et referentiels internes",
        "Modele pedagogique proprietaire adapte a vos metiers",
        "Ingenierie pedagogique dediee et accompagnement continu",
        "Integrations avancees SIRH, LMS, CRM",
        "Deploiement multi-sites et multi-pays",
        "SLA garanti et support prioritaire",
        "Conformite RGPD, ISO 27001, accessibilite",
        "Audit Qualiopi et accompagnement certification",
      ],
      creditLimit: "Illimite",
      popular: false,
    },
  ],
  pipelineos: [
    {
      name: "Starter",
      description: "ATS, pipeline candidats, matching simple, dashboard RH, workflows recrutement, automatisations basiques.",
      monthlyPrice: 1490,
      yearlyPrice: 1400,
      originalPrice: 1490,
      setupFee: 5000,
      cta: "Choisir Starter",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--module-grad-2)",
      previousPlan: null,
      features: [
        "ATS complet",
        "Pipeline candidats",
        "Matching simple",
        "Dashboard RH",
        "Workflows recrutement",
        "Automatisations basiques",
      ],
      creditLimit: "Illimite",
      popular: false,
    },
    {
      name: "Growth",
      description: "IA matching, scoring, multi-recruteurs, portail candidats, automatisations avancees, analytics RH, onboarding sync LearningOS.",
      monthlyPrice: 4900,
      yearlyPrice: 4600,
      originalPrice: 4900,
      setupFee: 12000,
      cta: "Choisir Growth",
      ctaLink: "/demo",
      gradient: "var(--module-grad-3)",
      previousPlan: "Starter",
      features: [
        "IA matching avance",
        "Scoring candidats",
        "Multi-recruteurs",
        "Portail candidats",
        "Automatisations avancees",
        "Analytics RH",
        "Onboarding sync LearningOS",
      ],
      creditLimit: "Illimite",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Orchestration recrutement, copilots RH, workflows IA, API RH, integration SI RH, multi-filiales, gouvernance, architecture dediee.",
      monthlyPrice: null,
      yearlyPrice: null,
      originalPrice: null,
      setupFee: null,
      cta: "Contacter l'equipe",
      ctaLink: "/contact",
      gradient: "var(--module-grad-5)",
      previousPlan: "Growth",
      features: [
        "Orchestration recrutement",
        "Copilots RH",
        "Workflows IA",
        "API RH complete",
        "Integration SI RH",
        "Multi-filiales",
        "Gouvernance",
        "Architecture dediee",
      ],
      creditLimit: "Illimite",
      popular: false,
    },
  ],
  api: [
    {
      name: "Build",
      description: "500k requetes, auth, workflows, embeddings, analytics basiques, rate limiting. Usage IA en supplement.",
      monthlyPrice: 990,
      yearlyPrice: 950,
      originalPrice: 990,
      setupFee: 0,
      cta: "Commencer",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--integration-grad-1)",
      previousPlan: null,
      features: [
        "500k requetes/mois",
        "Authentification",
        "Workflows",
        "Embeddings",
        "Analytics basiques",
        "Rate limiting",
        "Usage IA payant",
      ],
      creditLimit: "500k requetes",
      popular: false,
    },
    {
      name: "Scale",
      description: "5M requetes, orchestration agents, webhooks, multi-workspaces, monitoring, observabilite, support prioritaire. Usage IA en supplement.",
      monthlyPrice: 3900,
      yearlyPrice: 3700,
      originalPrice: 3900,
      setupFee: 0,
      cta: "Choisir Scale",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--integration-grad-2)",
      previousPlan: "Build",
      features: [
        "5M requetes/mois",
        "Orchestration agents",
        "Webhooks",
        "Multi-workspaces",
        "Monitoring",
        "Observabilite",
        "Support prioritaire",
        "Usage IA payant",
      ],
      creditLimit: "5M requetes",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Infrastructure dediee, SLA, private deployment, orchestration IA, gouvernance, conformite, audit logs, acces avance API.",
      monthlyPrice: null,
      yearlyPrice: null,
      originalPrice: null,
      setupFee: null,
      cta: "Contacter l'equipe",
      ctaLink: "/contact",
      gradient: "var(--integration-grad-3)",
      previousPlan: "Scale",
      features: [
        "Infrastructure dediee",
        "SLA garanti",
        "Private deployment",
        "Orchestration IA",
        "Gouvernance",
        "Conformite",
        "Audit logs",
        "Acces avance API",
      ],
      creditLimit: "Illimite",
      popular: false,
    },
  ],
};

export async function getPricing(): Promise<PricingContent> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM pricing").all() as any[];
  if (rows.length === 0) return DEFAULT_PRICING;
  const result: any = {};
  for (const row of rows) {
    result[row.product] = JSON.parse(row.plans_json);
  }
  return result as PricingContent;
}

export async function savePricing(data: PricingContent) {
  const db = await getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO pricing (product, plans_json, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(product) DO UPDATE SET plans_json = excluded.plans_json, updated_at = excluded.updated_at
  `);
  for (const product of ["learningos", "pipelineos", "api"] as const) {
    if (data[product]) {
      stmt.run(product, JSON.stringify(data[product]), now);
    }
  }
}

// ── SEO / JSON-LD ──

const DEFAULT_SEO: SeoContent = {
  fr: {
    homepage: {
      title: "MentivisOS — Le systeme de formation native IA",
      description: "MentivisOS forme vos collaborateurs, gere vos recrutements et pilote la montee en competences de vos equipes.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "MentivisOS",
        applicationCategory: "EducationApplication",
        description: "Systeme de formation native IA pour entreprises et institutions.",
        url: "https://sc4bovu7233.universe.wf",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "990",
          highPrice: "2900",
          priceCurrency: "EUR",
        },
      },
    },
    tarifs: {
      title: "Tarifs — MentivisOS",
      description: "Des solutions adaptees a chaque etape de votre croissance, de l'apprenant individuel au deploiement enterprise.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "MentivisOS",
        description: "Systeme de formation native IA pour entreprises.",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "990",
          highPrice: "2900",
          priceCurrency: "EUR",
        },
      },
    },
    blog: {
      title: "News — MentivisOS",
      description: "Actualites, insights et points de vue sur la formation et l'IA.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "News MentivisOS",
        description: "Actualites et analyses sur la formation et l'IA.",
      },
    },
  },
  en: {
    homepage: {
      title: "MentivisOS — The AI-native training system",
      description: "MentivisOS trains your employees, manages your recruitment and drives your teams' skill development.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "MentivisOS",
        applicationCategory: "EducationApplication",
        description: "AI-native training system for enterprises and institutions.",
        url: "https://sc4bovu7233.universe.wf",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "990",
          highPrice: "2900",
          priceCurrency: "EUR",
        },
      },
    },
    tarifs: {
      title: "Pricing — MentivisOS",
      description: "Solutions adapted to every stage of your growth, from individual learner to enterprise deployment.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "MentivisOS",
        description: "AI-native training system for enterprises.",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "990",
          highPrice: "2900",
          priceCurrency: "EUR",
        },
      },
    },
    blog: {
      title: "News — MentivisOS",
      description: "News, insights and perspectives on training and AI.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "MentivisOS News",
        description: "News and analysis on training and AI.",
      },
    },
  },
};

export async function getSeo(): Promise<SeoContent> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM seo").all() as any[];
  if (rows.length === 0) return DEFAULT_SEO;
  const result: any = { fr: {}, en: {} };
  for (const row of rows) {
    if (!result[row.lang]) result[row.lang] = {};
    result[row.lang][row.page] = {
      title: row.title,
      description: row.description,
      jsonLd: JSON.parse(row.json_ld),
    };
  }
  return result as SeoContent;
}

export async function saveSeo(data: SeoContent) {
  const db = await getDb();
  const stmt = db.prepare(`
    INSERT INTO seo (lang, page, title, description, json_ld) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(lang, page) DO UPDATE SET title = excluded.title, description = excluded.description, json_ld = excluded.json_ld
  `);
  for (const lang of ["fr", "en"] as const) {
    for (const page of ["homepage", "tarifs", "blog"] as const) {
      const pageData = data[lang]?.[page];
      if (pageData) {
        stmt.run(lang, page, pageData.title, pageData.description, JSON.stringify(pageData.jsonLd));
      }
    }
  }
}

// ── Form Submissions ──

function rowToSubmission(row: any): FormSubmission {
  return {
    id: row.id,
    formType: row.form_type,
    data: JSON.parse(row.data),
    email: row.email,
    createdAt: row.created_at,
    read: !!row.read,
    notes: row.notes,
  };
}

export async function getSubmissionCount(): Promise<{ total: number; unread: number }> {
  const db = await getDb();
  const total = (db.prepare("SELECT COUNT(*) as c FROM submissions").get() as any).c;
  const unread = (db.prepare("SELECT COUNT(*) as c FROM submissions WHERE read = 0").get() as any).c;
  return { total, unread };
}

export async function getAllSubmissions(): Promise<FormSubmission[]> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM submissions ORDER BY created_at DESC").all();
  return rows.map(rowToSubmission);
}

export async function createSubmission(
  submission: Omit<FormSubmission, "id" | "createdAt">
): Promise<FormSubmission> {
  const db = await getDb();
  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO submissions (form_type, data, email, created_at, read, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(submission.formType, JSON.stringify(submission.data), submission.email, now, submission.read ? 1 : 0, submission.notes || null);
  return { ...submission, id: Number(result.lastInsertRowid), createdAt: now };
}

export async function updateSubmission(
  id: number,
  updates: Partial<FormSubmission>
): Promise<FormSubmission | null> {
  const db = await getDb();
  const existing = db.prepare("SELECT * FROM submissions WHERE id = ?").get(id) as any;
  if (!existing) return null;

  const setParts: string[] = [];
  const values: any[] = [];

  if (updates.formType !== undefined) { setParts.push("form_type = ?"); values.push(updates.formType); }
  if (updates.data !== undefined) { setParts.push("data = ?"); values.push(JSON.stringify(updates.data)); }
  if (updates.email !== undefined) { setParts.push("email = ?"); values.push(updates.email); }
  if (updates.read !== undefined) { setParts.push("read = ?"); values.push(updates.read ? 1 : 0); }
  if (updates.notes !== undefined) { setParts.push("notes = ?"); values.push(updates.notes); }

  if (setParts.length === 0) return rowToSubmission(existing);

  values.push(id);
  db.prepare(`UPDATE submissions SET ${setParts.join(", ")} WHERE id = ?`).run(...values);
  return rowToSubmission(db.prepare("SELECT * FROM submissions WHERE id = ?").get(id));
}

export async function deleteSubmission(id: number): Promise<boolean> {
  const db = await getDb();
  const result = db.prepare("DELETE FROM submissions WHERE id = ?").run(id);
  return result.changes > 0;
}

// ── Jobs ──

function rowToJob(row: any): Job {
  return {
    id: row.id,
    slug: row.slug,
    reference: row.reference,
    title: row.title,
    location: row.location,
    remote: !!row.remote,
    type: row.type as JobType,
    department: row.department,
    description: row.description,
    whyJoin: row.why_join,
    published: !!row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getJobCount(): Promise<{ total: number; published: number; draft: number }> {
  const db = await getDb();
  const total = (db.prepare("SELECT COUNT(*) as c FROM jobs").get() as any).c;
  const published = (db.prepare("SELECT COUNT(*) as c FROM jobs WHERE published = 1").get() as any).c;
  const draft = total - published;
  return { total, published, draft };
}

export async function getAllJobs(): Promise<Job[]> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM jobs ORDER BY created_at DESC").all();
  return rows.map(rowToJob);
}

export async function getPublishedJobs(): Promise<Job[]> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM jobs WHERE published = 1 ORDER BY created_at DESC").all();
  return rows.map(rowToJob);
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM jobs WHERE slug = ?").get(slug);
  return row ? rowToJob(row) : undefined;
}

export async function getJobById(id: number): Promise<Job | undefined> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(id);
  return row ? rowToJob(row) : undefined;
}

export async function getNextJobReference(): Promise<string> {
  const db = await getDb();
  const row = db.prepare("SELECT reference FROM jobs ORDER BY id DESC LIMIT 1").get() as { reference: string } | undefined;
  if (!row) return "REF-2026-001";
  const match = row.reference.match(/REF-(\d+)-(\d+)/);
  if (!match) return "REF-2026-001";
  const year = match[1];
  const num = parseInt(match[2], 10);
  const currentYear = new Date().getFullYear().toString();
  if (year !== currentYear) return `REF-${currentYear}-001`;
  return `REF-${currentYear}-${String(num + 1).padStart(3, "0")}`;
}

export async function createJob(job: Omit<Job, "id" | "reference" | "createdAt" | "updatedAt">): Promise<Job> {
  const db = await getDb();
  const now = new Date().toISOString();
  const reference = await getNextJobReference();
  const result = db.prepare(`
    INSERT INTO jobs (slug, reference, title, location, remote, type, department, description, why_join, published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    job.slug, reference, job.title, job.location, job.remote ? 1 : 0, job.type, job.department,
    job.description, job.whyJoin, job.published ? 1 : 0, now, now
  );
  return { ...job, id: Number(result.lastInsertRowid), reference, createdAt: now, updatedAt: now };
}

export async function updateJob(id: number, updates: Partial<Omit<Job, "id" | "reference" | "createdAt">>): Promise<Job | null> {
  const db = await getDb();
  const existing = await getJobById(id);
  if (!existing) return null;

  const setParts: string[] = [];
  const values: any[] = [];

  if (updates.slug !== undefined) { setParts.push("slug = ?"); values.push(updates.slug); }
  if (updates.title !== undefined) { setParts.push("title = ?"); values.push(updates.title); }
  if (updates.location !== undefined) { setParts.push("location = ?"); values.push(updates.location); }
  if (updates.remote !== undefined) { setParts.push("remote = ?"); values.push(updates.remote ? 1 : 0); }
  if (updates.type !== undefined) { setParts.push("type = ?"); values.push(updates.type); }
  if (updates.department !== undefined) { setParts.push("department = ?"); values.push(updates.department); }
  if (updates.description !== undefined) { setParts.push("description = ?"); values.push(updates.description); }
  if (updates.whyJoin !== undefined) { setParts.push("why_join = ?"); values.push(updates.whyJoin); }
  if (updates.published !== undefined) { setParts.push("published = ?"); values.push(updates.published ? 1 : 0); }

  if (setParts.length === 0) return existing;

  const now = new Date().toISOString();
  setParts.push("updated_at = ?");
  values.push(now);
  values.push(id);

  db.prepare(`UPDATE jobs SET ${setParts.join(", ")} WHERE id = ?`).run(...values);
  return (await getJobById(id))!;
}

export async function deleteJob(id: number): Promise<boolean> {
  const db = await getDb();
  const result = db.prepare("DELETE FROM jobs WHERE id = ?").run(id);
  return result.changes > 0;
}

// ── Job Applications ──

function rowToJobApplication(row: any): JobApplication {
  return {
    id: row.id,
    jobReference: row.job_reference,
    jobTitle: row.job_title,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    linkedin: row.linkedin,
    message: row.message,
    cvUrl: row.cv_url || undefined,
    createdAt: row.created_at,
    read: !!row.read,
    notes: row.notes,
  };
}

export async function getAllJobApplications(): Promise<JobApplication[]> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM job_applications ORDER BY created_at DESC").all();
  return rows.map(rowToJobApplication);
}

export async function getJobApplicationById(id: number): Promise<JobApplication | undefined> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM job_applications WHERE id = ?").get(id);
  return row ? rowToJobApplication(row) : undefined;
}

export async function createJobApplication(
  application: Omit<JobApplication, "id" | "createdAt">
): Promise<JobApplication> {
  const db = await getDb();
  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO job_applications (job_reference, job_title, first_name, last_name, email, phone, linkedin, message, cv_url, created_at, read, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    application.jobReference, application.jobTitle, application.firstName, application.lastName,
    application.email, application.phone || null, application.linkedin || null, application.message,
    application.cvUrl || null, now, application.read ? 1 : 0, application.notes || null
  );
  return { ...application, id: Number(result.lastInsertRowid), createdAt: now };
}

export async function updateJobApplication(
  id: number,
  updates: Partial<JobApplication>
): Promise<JobApplication | null> {
  const db = await getDb();
  const existing = db.prepare("SELECT * FROM job_applications WHERE id = ?").get(id) as any;
  if (!existing) return null;

  const setParts: string[] = [];
  const values: any[] = [];

  if (updates.read !== undefined) { setParts.push("read = ?"); values.push(updates.read ? 1 : 0); }
  if (updates.notes !== undefined) { setParts.push("notes = ?"); values.push(updates.notes); }

  if (setParts.length === 0) return rowToJobApplication(existing);

  values.push(id);
  db.prepare(`UPDATE job_applications SET ${setParts.join(", ")} WHERE id = ?`).run(...values);
  return rowToJobApplication(db.prepare("SELECT * FROM job_applications WHERE id = ?").get(id));
}

export async function deleteJobApplication(id: number): Promise<boolean> {
  const db = await getDb();
  const result = db.prepare("DELETE FROM job_applications WHERE id = ?").run(id);
  return result.changes > 0;
}
