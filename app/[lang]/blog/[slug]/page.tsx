import Link from "next/link";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh" }}>
      <div className="container">
        <Link
          href={`/${lang}/blog`}
          style={{
            fontSize: 14,
            color: "var(--text-tertiary)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 32,
          }}
        >
          ← Retour aux articles
        </Link>

        <article style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1
            className="t-display"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              marginBottom: 24,
              letterSpacing: "-0.02em",
            }}
          >
            Article: {slug}
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
            }}
          >
            Cette page est en cours de developpement. Le contenu complet de l&apos;article sera disponible prochainement.
          </p>
        </article>
      </div>
    </section>
  );
}
