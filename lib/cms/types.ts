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
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategoryKey =
  | "strategie"
  | "ia"
  | "annonces"
  | "institutions"
  | "entreprises"
  | "international"
  | "cas";

export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "strategie", label: "Strategie" },
  { key: "ia", label: "IA & Formation" },
  { key: "annonces", label: "Annonces" },
  { key: "institutions", label: "Institutions" },
  { key: "entreprises", label: "Entreprises" },
  { key: "international", label: "International" },
  { key: "cas", label: "Etudes de cas" },
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
