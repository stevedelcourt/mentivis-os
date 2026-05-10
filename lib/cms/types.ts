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
