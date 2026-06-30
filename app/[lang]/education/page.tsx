import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "MentivisOS Education - MentivisOS",
    description: "MentivisOS pour les organismes de formation, CFA et écoles. Former autrement. Performer durablement.",
    robots: lang !== "fr" ? { index: false } : undefined,
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.25, marginBottom: 32 }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default async function EcolesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      {/* Hero */}
      <section style={{ padding: "120px 0 80px", background: "var(--bg-secondary)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <p style={{ fontSize: "var(--text-micro)", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 16 }}>MentivisOS Education</p>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
            Former autrement.<br />Performer durablement.
          </h1>
          <p style={{ fontSize: "var(--text-body-lg)", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 600 }}>
            MentivisOS pour les organismes de formation, CFA et écoles.
          </p>
        </div>
      </section>

      {/* Changement de paradigme */}
      <Section title="Un changement de paradigme">
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 32 }}>
          Les dispositifs de formation actuels diffusent le même contenu, dans le même ordre, au même rythme, à des apprenants qui n&rsquo;ont ni les mêmes acquis, ni les mêmes objectifs, ni le même temps disponible.
        </p>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 40 }}>
          MentivisOS renverse cette logique. Ce n&rsquo;est pas le programme qui est figé et l&rsquo;apprenant qui s&rsquo;y adapte, c&rsquo;est le parcours qui se construit autour de chaque individu.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border-light)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "var(--bg-primary)", padding: 20 }}>
            <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 4 }}>Logique traditionnelle</p>
            <p style={{ fontSize: "var(--text-caption)", color: "var(--text-tertiary)", lineHeight: 1.5 }}>Le contenu est figé, l'apprenant s'adapte</p>
          </div>
          <div style={{ background: "var(--bg-primary)", padding: 20 }}>
            <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 4 }}>Logique MentivisOS</p>
            <p style={{ fontSize: "var(--text-caption)", color: "var(--text-tertiary)", lineHeight: 1.5 }}>Le parcours s'adapte à chaque apprenant</p>
          </div>
          <div style={{ background: "var(--bg-primary)", padding: 20 }}>
            <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 4 }}>Logique traditionnelle</p>
            <p style={{ fontSize: "var(--text-caption)", color: "var(--text-tertiary)", lineHeight: 1.5 }}>On mesure la complétion</p>
          </div>
          <div style={{ background: "var(--bg-primary)", padding: 20 }}>
            <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 4 }}>Logique MentivisOS</p>
            <p style={{ fontSize: "var(--text-caption)", color: "var(--text-tertiary)", lineHeight: 1.5 }}>On mesure l'acquisition réelle, compétence par compétence</p>
          </div>
          <div style={{ background: "var(--bg-primary)", padding: 20 }}>
            <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 4 }}>Logique traditionnelle</p>
            <p style={{ fontSize: "var(--text-caption)", color: "var(--text-tertiary)", lineHeight: 1.5 }}>Un programme unique pour tous</p>
          </div>
          <div style={{ background: "var(--bg-primary)", padding: 20 }}>
            <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 4 }}>Logique MentivisOS</p>
            <p style={{ fontSize: "var(--text-caption)", color: "var(--text-tertiary)", lineHeight: 1.5 }}>Un programme individuel, recalculé à chaque étape</p>
          </div>
        </div>
      </Section>

      {/* Ce à quoi MentivisOS répond */}
      <Section title="Ce à quoi MentivisOS répond">
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {[
            { title: "Individualisation à grande échelle.", body: "Différencier un parcours pour des centaines d'apprenants, avec des équipes limitées, est impossible sans IA native. MentivisOS automatise le diagnostic, la construction et l'ajustement du parcours." },
            { title: "Décrochage en formation.", body: "En calibrant chaque parcours sur le niveau réel d'entrée, MentivisOS réduit l'écart entre rythme imposé et capacité de l'apprenant." },
            { title: "Preuve de l'acquisition de compétences.", body: "Les financeurs (OPCO, France Compétences, Régions) exigent une traçabilité fine, au-delà du simple taux de complétion. MentivisOS la produit nativement, compétence par compétence." },
            { title: "Charge des équipes pédagogiques.", body: "L'IA prend en charge la génération et l'ajustement des parcours, vos formateurs se concentrent sur l'accompagnement." },
          ].map((item) => (
            <div key={item.title}>
              <p style={{ fontWeight: 600, fontSize: "var(--text-body-sm)", marginBottom: 8 }}>{item.title}</p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Avantages */}
      <Section title="Les avantages pour votre organisme">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            "Différenciation concurrentielle face aux autres organismes",
            "Réduction du taux de décrochage",
            "Gain de temps pédagogique pour vos équipes",
            "Image de marque renforcée, organisme natif IA",
            "Données de progression exploitables pour le pilotage",
          ].map((item) => (
            <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10" stroke="var(--text-tertiary)" strokeWidth="1.5" />
                <path d="M9 12l2 2 4-4" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Déploiement */}
      <Section title="Déploiement en un mois maximum">
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Setup mené en 15 jours calendaires : cadrage, configuration de l&rsquo;instance et de votre identité visuelle, tests et recette conjointe, mise en production et formation des équipes. Aucune intégration technique lourde côté organisme.
        </p>
      </Section>

      {/* Instance dédiée */}
      <Section title="Une instance dédiée">
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Votre logo et votre identité visuelle sur l&rsquo;ensemble des interfaces. Espace d&rsquo;administration dédié pour votre équipe. Tableau de bord de suivi par apprenant et par cohorte. Intégration de vos référentiels de compétences et connecteurs avec vos outils existants.
        </p>
      </Section>

      {/* CTA */}
      <section style={{ padding: "80px 0", background: "var(--bg-secondary)" }}>
        <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 32 }}>
            Vous voulez en savoir plus ?
          </h2>
          <Link
            href={`/${lang}/contact`}
            className="btn-pill btn-black"
            style={{ padding: "14px 32px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
          >
            Contactez-nous
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
