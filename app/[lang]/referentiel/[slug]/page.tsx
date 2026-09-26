import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { getReferentielArticles, getReferentielArticle } from "@/lib/cms/db";
import type { ReferentielArticle } from "@/lib/cms/types";
import { renderMarkdown } from "@/lib/markdown";
import { ogImageForArticle } from "@/lib/seo/og-images";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { prepareArticle, plainText, type FaqItem } from "@/lib/referentiel-content";
import { CLUSTERS, PRODUCT_LINKS, isPilier, pilierOf, relatedOf } from "@/lib/cms/referentiel-clusters";
import {
  ARTICLE_AUTHOR, BLOC_COLORS, BLOC_FULL, BLOC_LABELS, CIBLE_COLORS, CIBLE_LABELS,
} from "@/lib/referentiel-labels";
import JsonLd from "@/components/seo/json-ld";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getReferentielArticles();
  return articles.flatMap((a) => [
    { lang: "fr", slug: a.slug },
    { lang: "en", slug: a.slug },
  ]);
}

/** Un article sans contenu n'est pas indexable ; sans traduction, sa version EN non plus. */
function hasContent(a: ReferentielArticle) {
  return Boolean(a.content && a.content.trim());
}
function hasEn(a: ReferentielArticle) {
  return Boolean(a.contentEn && a.contentEn.trim() && a.titleEn);
}

function localized(a: ReferentielArticle, isFr: boolean) {
  return {
    title: isFr ? a.title : (a.titleEn || a.title),
    chapeau: isFr ? a.chapeau : (a.chapeauEn || a.chapeau || ""),
    content: isFr ? a.content : (a.contentEn || a.content),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = await getReferentielArticle(slug);
  if (!article) return { title: "Not Found" };
  const isFr = lang === "fr";
  const { title, chapeau } = localized(article, isFr);
  const indexable = hasContent(article) && (isFr || hasEn(article));
  return pageMetadata({
    lang,
    path: `referentiel/${slug}`,
    title: `${title} | ${isFr ? "Le Référentiel - MentivisOS" : "The Reference - MentivisOS"}`,
    description: chapeau,
    ogImage: ogImageForArticle(article),
    type: "article",
    publishedTime: article.createdAt,
    modifiedTime: article.updatedAt,
    noindex: !indexable,
    en: hasEn(article),
  });
}

export default async function ReferentielArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const article = await getReferentielArticle(slug);
  if (!article) notFound();

  const isFr = lang === "fr";
  const L = (v: { fr: string; en: string } | undefined, fallback = "") => (v ? (isFr ? v.fr : v.en) : fallback);
  const { title, chapeau, content } = localized(article, isFr);
  const prepared = prepareArticle(content || "", lang);
  const html = renderMarkdown(prepared.body);

  let faqs: FaqItem[] = prepared.faqs;
  if (faqs.length === 0) {
    try {
      faqs = JSON.parse((isFr ? article.faq : (article.faqEn || article.faq)) || "[]");
    } catch {}
  }

  const all = await getReferentielArticles();
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  const pick = (slugs: string[]) =>
    slugs.map((s) => bySlug.get(s)).filter((a): a is ReferentielArticle => Boolean(a && hasContent(a)));

  const pilierPage = isPilier(slug);
  const cluster = pilierPage ? pick(CLUSTERS[slug]) : [];
  const parentSlug = pilierPage ? undefined : pilierOf(slug);
  const parent = parentSlug ? bySlug.get(parentSlug) : undefined;
  const related = pilierPage ? [] : pick(relatedOf(slug));
  const products = pilierPage ? PRODUCT_LINKS[slug] : parentSlug ? PRODUCT_LINKS[parentSlug] : [];

  // Navigation précédent / suivant dans le bloc
  const siblings = all
    .filter((a) => a.bloc === article.bloc && hasContent(a))
    .sort((a, b) => a.positionInBloc - b.positionInBloc);
  const idx = siblings.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const dateFmt = (d: string) =>
    new Date(d).toLocaleDateString(isFr ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
  const url = `${SITE_URL}/${lang}/referentiel/${slug}/`;
  const blocLabel = L(BLOC_LABELS[article.bloc], article.bloc);
  const cardTitle = (a: ReferentielArticle) => localized(a, isFr).title;

  const listStyle = { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" as const, gap: 10 };
  const linkStyle = { fontSize: 15, lineHeight: 1.5, color: "#0A0A0A", textDecoration: "underline", textUnderlineOffset: 3 };
  const sectionTitle = { fontSize: 20, fontWeight: 300, margin: "0 0 20px", color: "#0A0A0A" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", padding: "80px 24px 80px" }}>
        <Link href={`/${lang}/referentiel/`}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#888",
            textDecoration: "none", marginBottom: 24,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {isFr ? "Tous les articles" : "All articles"}
        </Link>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {article.bloc && (
            <span style={{
              display: "inline-block", padding: "3px 12px", borderRadius: 4,
              fontSize: 12, fontWeight: 600, color: "#fff",
              background: BLOC_COLORS[article.bloc] || "#888",
            }}>
              {article.bloc === "PILIER" ? blocLabel : `${article.bloc} · ${blocLabel}`}
            </span>
          )}
          {article.cible && (
            <span style={{
              display: "inline-block", padding: "3px 12px", borderRadius: 4,
              fontSize: 12, fontWeight: 400, color: CIBLE_COLORS[article.cible] || "#888",
              background: `${CIBLE_COLORS[article.cible] || "#888"}1a`,
            }}>
              {L(CIBLE_LABELS[article.cible], article.cible)}
            </span>
          )}
        </div>

        <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px" }}>
          {isFr
            ? `Publié le ${dateFmt(article.createdAt)} · Mis à jour le ${dateFmt(article.updatedAt)} · Par ${ARTICLE_AUTHOR.name}, MentivisOS`
            : `Published ${dateFmt(article.createdAt)} · Updated ${dateFmt(article.updatedAt)} · By ${ARTICLE_AUTHOR.name}, MentivisOS`}
        </p>

        <h1 style={{ fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 300, lineHeight: 1.2, color: "#0A0A0A", margin: "0 0 16px" }}>
          {title}
        </h1>

        {chapeau && (
          <p className="referentiel-chapeau" style={{ fontSize: 17, lineHeight: 1.6, color: "#555", margin: "0 0 32px", fontStyle: "italic" }}>
            {chapeau}
          </p>
        )}

        {parent && (
          <p style={{ fontSize: 14, color: "#4e4e4e", margin: "0 0 32px" }}>
            {isFr ? "Pilier : " : "Pillar: "}
            <Link href={`/${lang}/referentiel/${parent.slug}/`} style={{ color: "#0A0A0A", textDecoration: "underline", textUnderlineOffset: 3 }}>
              {cardTitle(parent)}
            </Link>
          </p>
        )}

        <div
          className="referentiel-content"
          style={{ fontSize: 16, lineHeight: 1.8, color: "#333" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {cluster.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #e4e4e4" }}>
            <h2 style={sectionTitle}>{isFr ? "Les articles de ce pilier" : "Articles in this pillar"}</h2>
            <ul style={listStyle}>
              {cluster.map((a) => (
                <li key={a.slug}>
                  <Link href={`/${lang}/referentiel/${a.slug}/`} style={linkStyle}>{cardTitle(a)}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {faqs.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #e4e4e4" }}>
            <h2 style={sectionTitle}>
              {isFr ? "Questions fréquentes" : "Frequently asked questions"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {faqs.map((faq, i) => (
                <details key={i} style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
                  <summary style={{
                    padding: "14px 18px", fontSize: 15, fontWeight: 500, color: "#0A0A0A",
                    cursor: "pointer", background: "#fafafa",
                  }}>
                    {faq.q}
                  </summary>
                  <div
                    className="referentiel-content"
                    style={{ padding: "14px 18px", fontSize: 15, lineHeight: 1.6, color: "#555" }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(faq.a) }}
                  />
                </details>
              ))}
            </div>
          </div>
        )}

        {(related.length > 0 || (products && products.length > 0)) && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #e4e4e4" }}>
            {related.length > 0 && (
              <>
                <h2 style={sectionTitle}>{isFr ? "À lire aussi" : "Further reading"}</h2>
                <ul style={listStyle}>
                  {related.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/${lang}/referentiel/${a.slug}/`} style={linkStyle}>{cardTitle(a)}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {products && products.length > 0 && (
              <p style={{ fontSize: 14, color: "#4e4e4e", margin: related.length > 0 ? "24px 0 0" : 0 }}>
                {isFr ? "Produits concernés : " : "Related products: "}
                {products.map((p, i) => (
                  <span key={p.path}>
                    {i > 0 && ", "}
                    <Link href={`/${lang}/${p.path}/`} style={{ color: "#0A0A0A", textDecoration: "underline", textUnderlineOffset: 3 }}>
                      {isFr ? p.fr : p.en}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}

        {/* Navigation précédent / suivant */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginTop: 48, paddingTop: 24, borderTop: "1px solid #e4e4e4" }}>
          <div>
            {prev && (
              <Link href={`/${lang}/referentiel/${prev.slug}/`}
                style={{ fontSize: 14, color: "#0A0A0A", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                {cardTitle(prev)}
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link href={`/${lang}/referentiel/${next.slug}/`}
                style={{ fontSize: 14, color: "#0A0A0A", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, textAlign: "right" }}>
                {cardTitle(next)}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: chapeau || plainText(content || "").substring(0, 160),
          url,
          inLanguage: isFr ? "fr-FR" : "en-GB",
          image: `${SITE_URL}${ogImageForArticle(article)}`,
          datePublished: article.createdAt,
          dateModified: article.updatedAt,
          author: {
            "@type": "Person",
            name: ARTICLE_AUTHOR.name,
            worksFor: { "@id": `${SITE_URL}/#organization` },
          },
          publisher: {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "MentivisOS",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/images/MentivisOS/mentivisos-logo-wordmark-noir.svg`, width: 200, height: 50 },
          },
          articleSection: L(BLOC_FULL[article.bloc], article.bloc),
          ...(parent ? { isPartOf: { "@type": "WebPage", "@id": `${SITE_URL}/${lang}/referentiel/${parent.slug}/`, name: cardTitle(parent) } } : {}),
          ...(cluster.length > 0 ? { hasPart: cluster.map((a) => ({ "@type": "Article", "@id": `${SITE_URL}/${lang}/referentiel/${a.slug}/`, headline: cardTitle(a) })) } : {}),
          about: parent ? cardTitle(parent) : title,
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".referentiel-chapeau"] },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
        }}
      />
      {faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
            })),
          }}
        />
      )}
      <BreadcrumbJsonLd lang={lang} path={`referentiel/${slug}`} title={title} />

      <style>{`
        .referentiel-content h1, .referentiel-content h2, .referentiel-content h3 {
          font-weight: 300;
          line-height: 1.3;
          margin-top: 32px;
          margin-bottom: 12px;
        }
        .referentiel-content h1 { font-size: 24px; }
        .referentiel-content h2 { font-size: 20px; }
        .referentiel-content h3 { font-size: 17px; }
        .referentiel-content p { margin-bottom: 16px; }
        .referentiel-content details p:last-child, details .referentiel-content p:last-child { margin-bottom: 0; }
        .referentiel-content ul, .referentiel-content ol { padding-left: 24px; margin-bottom: 16px; }
        .referentiel-content li { margin-bottom: 6px; }
        .referentiel-content a { color: #0A0A0A; text-decoration: underline; }
        .referentiel-content strong { font-weight: 500; }
        .referentiel-content hr { border: none; border-top: 1px solid #e4e4e4; margin: 32px 0; }
        .referentiel-content table { width: 100%; border-collapse: collapse; margin: 8px 0 24px; font-size: 14px; line-height: 1.5; display: block; overflow-x: auto; }
        .referentiel-content th, .referentiel-content td { text-align: left; vertical-align: top; padding: 10px 12px; border-bottom: 1px solid #e4e4e4; }
        .referentiel-content th { font-weight: 500; color: #0A0A0A; background: #fafafa; }
        details { transition: all 0.2s; }
        details[open] { border-color: #ddd; }
        details[open] summary { border-bottom: 1px solid #eee; }
      `}</style>
    </div>
  );
}
