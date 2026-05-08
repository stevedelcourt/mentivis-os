import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import VisualOrb from "@/components/visual-orb";

interface ProductCardProps {
  lang: Locale;
}

export default function ProductCard({ lang }: ProductCardProps) {
  const t = getT(lang);
  const products = [
    { ...t.products.atelier, path: "/produit", orb: "ember" as const },
    { ...t.products.operate, path: "/produit", orb: "sage" as const },
    { ...t.products.intel, path: "/produit", orb: "periwinkle" as const },
  ];

  return (
    <section className="section-sm" style={{ paddingBottom: 0 }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {products.map((product) => (
            <Link
              key={product.number}
              href={`/${lang}${product.path}`}
              className="card product-card"
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 220,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span
                  className="t-caption"
                  style={{
                    color: "var(--text-tertiary)",
                    fontWeight: 500,
                  }}
                >
                  {product.number}
                </span>
                <VisualOrb variant={product.orb} size="sm" />
              </div>
              <div>
                <h3
                  className="t-display"
                  style={{
                    fontSize: "var(--text-heading)",
                    marginBottom: 8,
                  }}
                >
                  {product.name}
                </h3>
                <p className="t-caption">
                  {product.descriptor}
                </p>
              </div>
              <span
                className="t-caption"
                style={{
                  color: "var(--text-tertiary)",
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
          box-shadow: var(--shadow-card-full), var(--shadow-soft) !important;
        }
        @media (max-width: 1024px) {
          section > .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
