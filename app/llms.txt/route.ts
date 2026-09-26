import { SITE_URL } from "@/lib/site-url";
import { getReferentielArticles } from "@/lib/cms/db";
import { CLUSTERS, PILIERS } from "@/lib/cms/referentiel-clusters";

export const dynamic = "force-static";

// llms.txt (https://llmstxt.org) : guide de lecture du site pour les assistants IA.
// Contenu public uniquement : aucune information d'hébergement ni d'exploitation.
export async function GET() {
  const articles = (await getReferentielArticles()).filter((a) => a.content && a.content.trim());
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const line = (slug: string) => {
    const a = bySlug.get(slug);
    if (!a) return null;
    const en = a.contentEn && a.titleEn ? ` (EN: ${SITE_URL}/en/referentiel/${a.slug}/)` : "";
    return `- [${a.title}](${SITE_URL}/fr/referentiel/${a.slug}/)${en}: ${a.chapeau.split(". ")[0].replace(/\.$/, "")}.`;
  };

  const clustered = new Set<string>(PILIERS.flatMap((p) => [p, ...CLUSTERS[p]]));
  const others = articles.filter((a) => !clustered.has(a.slug));

  const sections = PILIERS.map((p) => {
    const pilier = bySlug.get(p);
    if (!pilier) return "";
    return [
      `### ${pilier.titleEn || pilier.title}`,
      "",
      line(p),
      ...CLUSTERS[p].map(line).filter(Boolean),
    ].join("\n");
  }).filter(Boolean);

  const body = `# MentivisOS

> MentivisOS is an AI-native training system built by Mentivis (Paris). It measures the gap between the skills a person has and the skills a role requires, generates the individual learning path that closes that gap, and records skill acquisition skill by skill, with traceability usable for management, funders (OPCO, Qualiopi) and AI Act Article 4 compliance. It is not an LMS: an LMS distributes content, MentivisOS generates learning paths and measures acquisition. It can work alongside an existing LMS via API.

The site is bilingual. French is the default language (${SITE_URL}/fr/), English is available at ${SITE_URL}/en/. Every page has a French and an English URL with the same path.

## Products

- [MentivisOS Entreprise](${SITE_URL}/en/entreprises/): AI training system for companies. Skills diagnostic, individual learning paths generated from the measured gap, measurement of acquisition, reporting for HR and training directors.
- [MentivisOS Education](${SITE_URL}/en/education/): for training organisations, apprenticeship centres (CFA) and schools.
- [MentivisOS Open](${SITE_URL}/en/openos/): free personalised learning paths on any topic, for individuals.
- [Pricing](${SITE_URL}/en/tarifs/)
- [Security and data protection](${SITE_URL}/en/security/)
- [Request a demo](${SITE_URL}/en/demo/): demonstrations are run on a real case from the prospect's organisation.

## The Reference (knowledge base)

Factual articles on AI in corporate training, skills measurement, adaptive learning, funding and compliance. Index: ${SITE_URL}/fr/referentiel/ (EN: ${SITE_URL}/en/referentiel/). Articles are organised in four pillars.

${sections.join("\n\n")}
${others.length ? `\n### Other articles\n\n${others.map((a) => line(a.slug)).filter(Boolean).join("\n")}\n` : ""}
## Company

- [About](${SITE_URL}/en/about/)
- [Contact](${SITE_URL}/en/contact/)
- [Careers](${SITE_URL}/en/carrieres/)
- Legal entity: Mentivis, 60 rue François 1er, 75008 Paris, France.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
