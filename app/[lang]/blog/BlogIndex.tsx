"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import styles from "./blog.module.css";

export type CategoryKey =
  | "all"
  | "strategie"
  | "ia"
  | "ingenierie"
  | "institutions"
  | "entreprises"
  | "international"
  | "cas";

export interface Category {
  key: CategoryKey;
  label: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: Exclude<CategoryKey, "all">;
  date: string;
  dateISO: string;
  featured?: boolean;
  colorIndex?: number;
  imageUrl?: string;
}

const CATEGORIES: Category[] = [
  { key: "all", label: "A la une" },
  { key: "strategie", label: "Strategie" },
  { key: "ia", label: "IA & Formation" },
  { key: "ingenierie", label: "Ingenierie pedagogique" },
  { key: "institutions", label: "Institutions" },
  { key: "entreprises", label: "Entreprises" },
  { key: "international", label: "International" },
  { key: "cas", label: "Etudes de cas" },
];

const POSTS: Post[] = [
  {
    id: "1",
    slug: "creer-institution-enseignement-superieur",
    title: "Creer une institution d'enseignement superieur de zero: les etapes que personne ne vous dit",
    excerpt: "Accreditations, ingenierie des maquettes pedagogiques, referencement Qualiopi, recrutement du corps professoral: la liste est longue. Mentivis revient sur les 12 a 18 mois critiques qui precedent l'ouverture.",
    category: "strategie",
    date: "8 mai 2026",
    dateISO: "2026-05-08",
    featured: true,
    colorIndex: 1,
  },
  {
    id: "2",
    slug: "opco-atlas-ia-generative-organismes-formation",
    title: "OPCO Atlas et l'IA generative: ce que les organismes de formation doivent anticiper",
    excerpt: "Le cadre reglementaire bouge. Les criteres d'evaluation Qualiopi evoluent. Les outils IA entrent dans les dispositifs. Ce que cela change concretement pour les OF.",
    category: "ia",
    date: "2 mai 2026",
    dateISO: "2026-05-02",
    colorIndex: 2,
  },
  {
    id: "3",
    slug: "au-dela-du-powerpoint-grands-cabinets-implementation",
    title: "Au-dela du PowerPoint: pourquoi les grands cabinets ratent l'implementation",
    excerpt: "Livrable depose, mission terminee. Ce modele ne resiste plus a l'ere de l'IA. Analyse de la disruption des boutiques specialisees face aux grands acteurs traditionnels.",
    category: "strategie",
    date: "24 avr. 2026",
    dateISO: "2026-04-24",
    colorIndex: 3,
  },
  {
    id: "4",
    slug: "la-boite-immo-campus-10000-professionnels",
    title: "La Boite Immo Campus: former 10 000 professionnels sur dix ans",
    excerpt: "Retour sur la construction d'un reseau de formation immobiliere hybride, entre ecoles propres et franchises, avec une montee en charge progressive.",
    category: "cas",
    date: "15 avr. 2026",
    dateISO: "2026-04-15",
    colorIndex: 4,
  },
  {
    id: "5",
    slug: "modele-diplome-franco-etranger",
    title: "Le modele diplome franco-etranger: mode d'emploi pour les universites partenaires",
    excerpt: "Etudiants qui etudient a l'etranger puis viennent en France pour valider un diplome francais. Structure juridique, partenariats, accreditations: les modalites.",
    category: "international",
    date: "7 avr. 2026",
    dateISO: "2026-04-07",
    colorIndex: 5,
  },
  {
    id: "6",
    slug: "remuneration-variable-formation-aligner-interets",
    title: "Remuneration variable en formation: aligner les interets entre operateur et client",
    excerpt: "Un modele ou Mentivis est remunere sur les resultats, pas sur les livrables. Ce que cela implique pour la contractualisation et la relation client.",
    category: "entreprises",
    date: "29 mars 2026",
    dateISO: "2026-03-29",
    colorIndex: 6,
  },
  {
    id: "7",
    slug: "agents-generatifs-simulation-marche-education",
    title: "Agents generatifs et simulation de marche: un nouveau terrain d'analyse en education",
    excerpt: "Comment utiliser des agents IA pour simuler des comportements de cohortes, tester des hypotheses de positionnement et anticiper les dynamiques d'un marche educatif.",
    category: "ia",
    date: "18 mars 2026",
    dateISO: "2026-03-18",
    colorIndex: 7,
  },
  {
    id: "8",
    slug: "ingenierie-pedagogique-travail-realite",
    title: "L'ingenierie pedagogique au travail: ce que les clients ne voient jamais",
    excerpt: "Sequencage des apprentissages, alignement constructif, evaluation formative: les decisions invisibles qui determinant si une formation tient sur la duree.",
    category: "ingenierie",
    date: "5 mars 2026",
    dateISO: "2026-03-05",
    colorIndex: 8,
  },
  {
    id: "9",
    slug: "transformer-une-universite-en-12-mois",
    title: "Transformer une universite en 12 mois: ce que la mission Mentivis a vraiment produit",
    excerpt: "Nouvelle offre de formation, refonte du systeme d'information pedagogique, recrutement d'une equipe de direction. Retour d'experience sans filtre.",
    category: "institutions",
    date: "19 fevr. 2026",
    dateISO: "2026-02-19",
    colorIndex: 9,
  },
];

const POSTS_PER_PAGE = 6;

interface BlogIndexProps {
  lang: Locale;
}

export default function BlogIndex({ lang }: BlogIndexProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return POSTS;
    return POSTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const featuredPost =
    activeCategory === "all"
      ? (filteredPosts.find((p) => p.featured) ?? filteredPosts[0])
      : filteredPosts[0];

  const gridPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  const totalPages = Math.ceil(gridPosts.length / POSTS_PER_PAGE);
  const pagedPosts = gridPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  function handleCategoryChange(key: CategoryKey) {
    setActiveCategory(key);
    setPage(1);
  }

  return (
    <main className={styles.wrap}>
      <header className={styles.pageHeader}>
        <h1 className="t-display" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
          News & <em style={{ fontStyle: "italic", color: "var(--text-tertiary)" }}>points de vue</em>
        </h1>
      </header>

      <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />

      {featuredPost && <FeaturedCard post={featuredPost} lang={lang} />}

      {pagedPosts.length > 0 && (
        <section>
          <p className={styles.sectionLabel}>Derniers articles</p>
          <div className={styles.grid}>
            {pagedPosts.map((post) => (
              <ArticleCard key={post.id} post={post} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <Pagination current={page} total={totalPages} onChange={setPage} />
    </main>
  );
}

function ColorBlock({ index }: { index?: number }) {
  return <div className={`${styles.colorBlock} ${styles[`c${index ?? 1}`]}`} />;
}

interface FeaturedCardProps {
  post: Post;
  lang: Locale;
}

function FeaturedCard({ post, lang }: FeaturedCardProps) {
  const categoryLabel =
    CATEGORIES.find((c) => c.key === post.category)?.label ?? post.category;

  return (
    <article className={styles.featured}>
      <div className={styles.featImg}>
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} className={styles.featImgEl} />
        ) : (
          <ColorBlock index={post.colorIndex} />
        )}
      </div>
      <div className={styles.featContent}>
        <div>
          <div className={styles.featMeta}>
            <span className={styles.badge}>{categoryLabel}</span>
            <span className={styles.date}>{post.date}</span>
          </div>
          <h2
            className={styles.featTitle}
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <p className={styles.featExcerpt}>{post.excerpt}</p>
        </div>
        <Link href={`/${lang}/blog/${post.slug}`} className={styles.featCta}>
          Lire l&apos;article
        </Link>
      </div>
    </article>
  );
}

interface ArticleCardProps {
  post: Post;
  lang: Locale;
}

function ArticleCard({ post, lang }: ArticleCardProps) {
  const categoryLabel =
    CATEGORIES.find((c) => c.key === post.category)?.label ?? post.category;

  return (
    <article className={styles.card}>
      <Link href={`/${lang}/blog/${post.slug}`} className={styles.cardLink}>
        <div className={styles.cardImg}>
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} className={styles.cardImgEl} />
          ) : (
            <ColorBlock index={post.colorIndex} />
          )}
        </div>
        <div className={styles.cardMeta}>
          <span className={styles.cardBadge}>{categoryLabel}</span>
          <span className={styles.date}>{post.date}</span>
        </div>
        <h3
          className={styles.cardTitle}
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div className={styles.cardSep} />
      </Link>
    </article>
  );
}

interface CategoryFilterProps {
  active: CategoryKey;
  onChange: (key: CategoryKey) => void;
}

function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <nav className={styles.cats} aria-label="Filtrer par categorie">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          className={`${styles.catPill} ${active === cat.key ? styles.catPillActive : ""}`}
          onClick={() => onChange(cat.key)}
          aria-pressed={active === cat.key}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, 2);
    if (current > 4) pages.push("ellipsis");
    for (
      let i = Math.max(3, current - 1);
      i <= Math.min(total - 2, current + 1);
      i++
    )
      pages.push(i);
    if (current < total - 3) pages.push("ellipsis");
    pages.push(total - 1, total);
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <span key={`el-${idx}`} className={`${styles.pageBtn} ${styles.pageDots}`}>
            …
          </span>
        ) : (
          <button
            key={p}
            className={`${styles.pageBtn} ${current === p ? styles.pageBtnActive : ""}`}
            onClick={() => onChange(p)}
            aria-current={current === p ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}
    </nav>
  );
}
