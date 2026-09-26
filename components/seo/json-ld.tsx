/** Bloc JSON-LD rendu côté serveur. Échappe `<` pour éviter toute fermeture de balise. */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
