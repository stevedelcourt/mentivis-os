export interface Post {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
  category: string;
  date: string;
  dateISO: string;
  imageUrl: string;
  imageTag: string;
  imageCaption: string;
  gradientId: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategoryKey =
  | "strategie"
  | "ia"
  | "annonces"
  | "cas"
  | "clients"
  | "partenariat";

export const CATEGORIES: { key: CategoryKey; labelFr: string; labelEn: string }[] = [
  { key: "strategie", labelFr: "Strategie", labelEn: "Strategy" },
  { key: "ia", labelFr: "IA & Formation", labelEn: "AI & Training" },
  { key: "annonces", labelFr: "Annonces", labelEn: "Announcements" },
  { key: "cas", labelFr: "Etudes de cas", labelEn: "Case Studies" },
  { key: "clients", labelFr: "Clients", labelEn: "Clients" },
  { key: "partenariat", labelFr: "Partenariats", labelEn: "Partnerships" },
];

// ── Homepage Hero ──

export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
  proof: string;
}

export type PageKey = "homepage" | "learningos" | "talentos" | "about" | "security" | "ambassadors";

export const PAGE_KEYS: PageKey[] = ["homepage", "learningos", "talentos", "about", "security", "ambassadors"];

export interface PageContent {
  fr: Record<PageKey, { hero: HeroContent }>;
  en: Record<PageKey, { hero: HeroContent }>;
}

// ── Pricing ──

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  originalPrice: number | null;
  setupFee: number | null;
  cta: string;
  ctaLink: string;
  gradient: string;
  previousPlan: string | null;
  features: string[];
  creditLimit: string;
  popular: boolean;
}

export interface PricingContent {
  learningos: PricingPlan[];
  pipelineos: PricingPlan[];
  api: PricingPlan[];
}

// ── SEO / JSON-LD ──

export interface SeoPageData {
  title: string;
  description: string;
  jsonLd: Record<string, unknown>;
}

export interface SeoContent {
  fr: Record<string, SeoPageData>;
  en: Record<string, SeoPageData>;
}

// ── Form Submissions ──

export interface FormSubmission {
  id: number;
  formType: "demo" | "contact" | "beta";
  data: Record<string, string | boolean | number | null>;
  email: string;
  createdAt: string;
  read: boolean;
  notes?: string;
}

// ── Users & Roles ──

export interface ReferentielArticle {
  id: number;
  slug: string;
  title: string;
  content: string;
  contentEn: string;
  position: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "god" | "editorial" | "tarifs";

export interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

// ── Jobs ──

export type JobType = "cdi" | "cdd" | "freelance" | "stage" | "alternance";

export interface Job {
  id: number;
  slug: string;
  reference: string;
  title: string;
  titleEn: string;
  location: string;
  locationEn: string;
  remote: boolean;
  type: JobType;
  department: string;
  departmentEn: string;
  description: string;
  descriptionEn: string;
  whyJoin: string;
  whyJoinEn: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: number;
  jobReference: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin: string;
  message: string;
  cvUrl?: string;
  createdAt: string;
  read: boolean;
  notes?: string;
}
