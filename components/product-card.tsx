import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

interface ProductCardProps {
  lang: Locale;
}

export default function ProductCard({ lang }: ProductCardProps) {
  const t = getT(lang);
  const products = [
    { ...t.products.atelier, path: "/produit" },
    { ...t.products.operate, path: "/produit" },
    { ...t.products.intel, path: "/produit" },
  ];

  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--grid-gutter)",
          }}
        >
          {products.map((product) => (
            <Link
              key={product.number}
              href={`/${lang}${product.path}`}
              className="product-card"
              style={{
                background: "var(--color-surface-1)",
                border: `1px solid var(--color-border)`,
                borderRadius: "var(--card-radius)",
                padding: 32,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 180,
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 120,
                  height: 120,
                  background: "radial-gradient(circle at top right, rgba(200, 169, 110, 0.08), transparent 70%)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-interface)",
                  fontSize: "var(--text-micro)",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                  letterSpacing: "0.08em",
                }}
              >
                {product.number}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-interface)",
                    fontSize: "var(--text-small)",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-ink-primary)",
                    marginBottom: 8,
                  }}
                >
                  {product.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-small)",
                    color: "var(--color-ink-secondary)",
                  }}
                >
                  {product.descriptor}
                </p>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-interface)",
                  fontSize: "var(--text-small)",
                  color: "var(--color-accent)",
                  marginTop: 16,
                }}
              >
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .product-card:hover {
          border-color: rgba(200, 169, 110, 0.3) !important;
        }
        .product-card:hover > div:first-of-type {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .product-card > div:first-of-type { display: none; }
        }
      `}</style>
    </section>
  );
}
