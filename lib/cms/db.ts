import fs from "fs";
import path from "path";
import { Post, PageContent, PricingContent, SeoContent } from "./types";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readPosts(): Post[] {
  ensureDir();
  if (!fs.existsSync(POSTS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(POSTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writePosts(posts: Post[]) {
  ensureDir();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

let postsCache: Post[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

function getPosts(): Post[] {
  const now = Date.now();
  if (!postsCache || now - cacheTime > CACHE_TTL) {
    postsCache = readPosts();
    cacheTime = now;
  }
  return postsCache;
}

export function getAllPosts(): Post[] {
  return getPosts();
}

export function getPublishedPosts(): Post[] {
  return getPosts().filter((p) => p.published);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getPostById(id: number): Post | undefined {
  return getPosts().find((p) => p.id === id);
}

export function createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Post {
  const posts = readPosts();
  const newPost: Post = {
    ...post,
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.push(newPost);
  writePosts(posts);
  postsCache = null;
  return newPost;
}

export function updatePost(id: number, updates: Partial<Omit<Post, "id" | "createdAt">>): Post | null {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  posts[idx] = {
    ...posts[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writePosts(posts);
  postsCache = null;
  return posts[idx];
}

export function deletePost(id: number): boolean {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  posts.splice(idx, 1);
  writePosts(posts);
  postsCache = null;
  return true;
}

export { generateSlug } from "./utils";

// ── Generic JSON file helpers ──

function readJsonFile<T>(filePath: string, fallback: T): T {
  ensureDir();
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T) {
  ensureDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ── Pages (Homepage Hero) ──

const PAGES_FILE = path.join(DATA_DIR, "pages.json");

const DEFAULT_PAGES: PageContent = {
  fr: {
    hero: {
      eyebrow: "Mentivis OS",
      headline: "MentivisOS forme vos collaborateurs, gere vos recrutements et pilote la montee en competences de vos equipes.",
      subheadline: "Un seul systeme qui dispense les formations, analyse les profils candidats, orchestre les recrutements et suit chaque parcours upskilling. Connecte a vos outils via la Mentivis API. Operationnel immediatement, sans refonte de votre organisation.",
      ctaPrimary: "Demarrer gratuitement",
      ctaPrimaryLink: "https://app.mentivisOS.com",
      ctaSecondary: "Contacter l'equipe",
      ctaSecondaryLink: "/fr/contact",
      proof: "Utilise par les directions de la formation, les CFA, les campus d'entreprise.",
    },
  },
  en: {
    hero: {
      eyebrow: "Mentivis OS",
      headline: "MentivisOS trains your employees, manages your recruitment and drives your teams' skill development.",
      subheadline: "A single system that delivers training, analyzes candidate profiles, orchestrates recruitment and tracks every upskilling journey. Connected to your tools via the Mentivis API. Operational immediately, without restructuring your organization.",
      ctaPrimary: "Start for free",
      ctaPrimaryLink: "https://app.mentivisOS.com",
      ctaSecondary: "Contact the team",
      ctaSecondaryLink: "/en/contact",
      proof: "Used by training departments, CFAs, corporate campuses.",
    },
  },
};

export function getPages(): PageContent {
  return readJsonFile<PageContent>(PAGES_FILE, DEFAULT_PAGES);
}

export function savePages(data: PageContent) {
  writeJsonFile(PAGES_FILE, data);
}

// ── Pricing ──

const PRICING_FILE = path.join(DATA_DIR, "pricing.json");

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
  pipelineos: [],
  api: [],
};

export function getPricing(): PricingContent {
  return readJsonFile<PricingContent>(PRICING_FILE, DEFAULT_PRICING);
}

export function savePricing(data: PricingContent) {
  writeJsonFile(PRICING_FILE, data);
}

// ── SEO / JSON-LD ──

const SEO_FILE = path.join(DATA_DIR, "seo.json");

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

export function getSeo(): SeoContent {
  return readJsonFile<SeoContent>(SEO_FILE, DEFAULT_SEO);
}

export function saveSeo(data: SeoContent) {
  writeJsonFile(SEO_FILE, data);
}
