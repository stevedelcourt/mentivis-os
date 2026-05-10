"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { Post, CATEGORIES } from "@/lib/cms/types";
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

const POSTS_PER_PAGE = 6;

interface BlogIndexProps {
  lang: Locale;
}

export default function BlogIndex({ lang }: BlogIndexProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/blog/posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [activeCategory, posts]);

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

  const handleCategoryChange = useCallback((key: CategoryKey) => {
    setActiveCategory(key);
    setPage(1);
  }, []);

  if (loading) {
    return (
      <main className={styles.wrap}>
        <header className={styles.pageHeader}>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#777169", marginBottom: 10 }}>
            Actualites et analyses
          </p>
          <h1 className="t-display" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, lineHeight: 1.35, letterSpacing: "-0.01em", color: "#3E3B38" }}>
            Dernieres publications
          </h1>
        </header>
        <p style={{ textAlign: "center", color: "#777169", padding: 60 }}>Chargement...</p>
      </main>
    );
  }

  return (
    <main className={styles.wrap}>
      <header className={styles.pageHeader}>
        <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#777169", marginBottom: 10 }}>
          Actualites et analyses
        </p>
        <h1 className="t-display" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, lineHeight: 1.35, letterSpacing: "-0.01em", color: "#3E3B38" }}>
          Dernieres publications
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
          <ColorBlock index={post.featured ? 1 : undefined} />
        )}
      </div>
      <div className={styles.featContent}>
        <div>
          <div className={styles.featMeta}>
            <span className={styles.badge}>{categoryLabel}</span>
            <span className={styles.date}>{post.date}</span>
          </div>
          <h2 className={styles.featTitle} dangerouslySetInnerHTML={{ __html: post.title }} />
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
            <ColorBlock index={post.featured ? 1 : undefined} />
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
}

function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const allCategories: { key: CategoryKey; label: string }[] = [
    { key: "all", label: "A la une" },
    ...CATEGORIES,
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
