"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { Post, CATEGORIES, sortPostsLatestFirst } from "@/lib/cms/types";
import { GRADIENT_PATTERNS } from "@/lib/cms/gradient-patterns";
import { stripMarkdown } from "@/lib/markdown";
import styles from "./blog.module.css";

export type CategoryKey =
  | "all"
  | "strategie"
  | "ia"
  | "annonces"
  | "cas"
  | "clients"
  | "partenariat";

// Tient le catalogue actuel (une douzaine d'articles) sur une page ; la pagination
// revient d'elle-même quand le catalogue dépasse ce nombre.
const POSTS_PER_PAGE = 12;

interface BlogIndexProps {
  lang: Locale;
  /** Articles déjà localisés, fournis au build. */
  posts: Post[];
}

export default function BlogIndex({ lang, posts }: BlogIndexProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [page, setPage] = useState(1);

  // ?category= est lu côté client après le rendu : sans useSearchParams, la liste complète
  // des articles est présente dans le HTML statique (liens explorables par les robots).
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get("category");
    if (cat && ["strategie", "ia", "annonces", "cas", "clients", "partenariat"].includes(cat)) {
      setActiveCategory(cat as CategoryKey);
    }
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory !== "all") {
      // Correspondance tolérante : les catégories héritées du CMS peuvent porter
      // majuscules, espaces ou pluriel ("Partenariats", " IA ").
      const norm = (s: string) => s.trim().toLowerCase().replace(/s$/, "");
      const want = norm(activeCategory);
      result = posts.filter((p) => (p.category || "").split(",").some((c) => norm(c) === want));
    }
    // Du plus récent au plus ancien, sans épingler les articles « featured ».
    return sortPostsLatestFirst(result);
  }, [activeCategory, posts]);

  // Featured post is the first one (API already sorts featured first, but we re-sort for categories)
  const featuredPost = filteredPosts[0];

  const gridPosts = filteredPosts.slice(1);

  const totalPages = Math.ceil(gridPosts.length / POSTS_PER_PAGE);
  const pagedPosts = gridPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const handleCategoryChange = useCallback((key: CategoryKey) => {
    setActiveCategory(key);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <main className={styles.wrap}>
      <header className={styles.pageHeader}>
        <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4e4e4e", marginBottom: 10 }}>
          {lang === "en" ? "News & Analysis" : "Actualités et analyses"}
        </p>
        <h1 className="t-display" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, lineHeight: 1.35, letterSpacing: "-0.01em", color: "#4e4e4e" }}>
          {lang === "en" ? "Latest Publications" : "Dernières publications"}
        </h1>
      </header>

      <CategoryFilter active={activeCategory} onChange={handleCategoryChange} lang={lang} />

      {featuredPost && <FeaturedCard post={featuredPost} lang={lang} />}

      {pagedPosts.length > 0 && (
        <section>
          <p className={styles.sectionLabel}>{lang === "en" ? "Latest articles" : "Derniers articles"}</p>
          <div className={styles.grid}>
            {pagedPosts.map((post) => (
              <ArticleCard key={post.id} post={post} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <Pagination current={page} total={totalPages} onChange={handlePageChange} />
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

function getGradientCss(post: Post): string | undefined {
  if (post.gradientId) return GRADIENT_PATTERNS.find(g => g.id === Number(post.gradientId))?.css;
  return undefined;
}

function FeaturedCard({ post, lang }: FeaturedCardProps) {
  const categoryLabel =
    CATEGORIES.find((c) => c.key === post.category.split(",")[0])?.[lang === "en" ? "labelEn" : "labelFr"] ?? post.category.split(",")[0];
  const gradCss = getGradientCss(post);

  return (
    <article className={styles.featured}>
      <div className={styles.featImg} style={{ position: "relative" }}>
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} className={styles.featImgEl} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: gradCss ?? "var(--bg-warm)" }} />
        )}
        {post.imageTag && (
          <span className={styles.imageTag}>
            {post.imageTag}
          </span>
        )}
      </div>
      <div className={styles.featContent}>
        <div>
          <div className={styles.featMeta}>
            <span className={styles.badge}>{categoryLabel}</span>
            <span className={styles.date}>{post.date}</span>
          </div>
          <h2 className={styles.featTitle} dangerouslySetInnerHTML={{ __html: post.title }} />
          <p className={styles.featExcerpt}>{stripMarkdown(post.excerpt)}</p>
        </div>
        <Link href={`/${lang}/blog/${post.slug}`} className={styles.featCta}>
          {lang === "en" ? "Read article" : "Lire l'article"}
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
    CATEGORIES.find((c) => c.key === post.category.split(",")[0])?.[lang === "en" ? "labelEn" : "labelFr"] ?? post.category.split(",")[0];
  const gradCss = getGradientCss(post);

  return (
    <article className={styles.card}>
      <Link href={`/${lang}/blog/${post.slug}`} className={styles.cardLink}>
        <div className={styles.cardImg} style={{ position: "relative" }}>
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} className={styles.cardImgEl} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: gradCss ?? "var(--bg-warm)" }} />
          )}
          {post.imageTag && (
            <span className={styles.imageTag}>
              {post.imageTag}
            </span>
          )}
        </div>
        <div className={styles.cardMeta}>
          <span className={styles.cardBadge}>{categoryLabel}</span>
          <span className={styles.date}>{post.date}</span>
        </div>
        <h3 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: post.title }} />
        <div className={styles.cardSep} />
      </Link>
    </article>
  );
}

interface CategoryFilterProps {
  active: CategoryKey;
  onChange: (key: CategoryKey) => void;
  lang: string;
}

function CategoryFilter({ active, onChange, lang }: CategoryFilterProps) {
  const allCategories: { key: CategoryKey; label: string }[] = [
    { key: "all", label: lang === "en" ? "Featured" : "A la une" },
    ...CATEGORIES.map((c) => ({ key: c.key, label: lang === "en" ? c.labelEn : c.labelFr })),
  ];

  return (
    <nav className={styles.cats} aria-label="Filtrer par categorie">
      {allCategories.map((cat) => (
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
