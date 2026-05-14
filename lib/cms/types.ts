export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  dateISO: string;
  imageUrl?: string;
  imageTag?: string;
  imageCaption?: string;
  gradientId?: number;
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

export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "strategie", label: "Strategie" },
  { key: "ia", label: "IA & Formation" },
  { key: "annonces", label: "Annonces" },
  { key: "cas", label: "Etudes de cas" },
  { key: "clients", label: "Clients" },
  { key: "partenariat", label: "Partenariats" },
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

export interface PageContent {
  fr: { hero: HeroContent };
  en: { hero: HeroContent };
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
  formType: "demo" | "contact";
  data: Record<string, string | boolean | number | null>;
  email: string;
  createdAt: string;
  read: boolean;
  notes?: string;
}

// ── Users & Roles ──

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
  location: string;
  remote: boolean;
  type: JobType;
  department: string;
  description: string;
  whyJoin: string;
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
