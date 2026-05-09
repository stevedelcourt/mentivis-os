"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "../blog.module.css";

const POSTS: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  content: string[];
}> = {
  "creer-institution-enseignement-superieur": {
    title: "Créer une institution d'enseignement supérieur de zéro : les étapes que personne ne vous dit",
    excerpt: "Accréditations, ingénierie des maquettes pédagogiques, référencement Qualiopi, recrutement du corps professoral : la liste est longue. Mentivis revient sur les 12 à 18 mois critiques qui précèdent l'ouverture.",
    category: "Stratégie",
    date: "8 mai 2026",
    content: [
      "La création d'une institution d'enseignement supérieur représente l'un des projets les plus complexes dans le paysage éducatif français. Entre les contraintes réglementaires, les exigences qualité et la nécessité de bâtir une offre pédagogique différenciante, les obstacles sont nombreux.",

      "## La phase d'accréditation : un parcours de 6 à 9 mois",

      "La première étape consiste à obtenir les accréditations nécessaires auprès du Ministère de l'Enseignement Supérieur et de la Recherche. Ce processus implique la constitution d'un dossier détaillé présentant le projet pédagogique, les équipes encadrantes, les infrastructures et le modèle économique.",

      "Les inspections pédagogiques jouent un rôle déterminant dans cette phase. Elles évaluent la cohérence du projet, l'adéquation entre les objectifs affichés et les moyens mis en œuvre, ainsi que la faisabilité du calendrier de déploiement.",

      "## L'ingénierie des maquettes pédagogiques",

      "Une fois l'accréditation obtenue, vient le temps de concevoir les maquettes pédagogiques. Cette phase technique exige une expertise pointue en ingénierie de formation. Chaque parcours doit être pensé en termes d'objectifs d'apprentissage, de séquençage des contenus, d'évaluation des acquis et d'adéquation avec les référentiels métiers visés.",

      "La construction d'une maquette pédagogique valide nécessite généralement entre 3 et 6 mois de travail pour un programme de formation standard. Ce délai peut s'étendre significativement pour des formations plus complexes ou innovantes.",

      "## Le référencement Qualiopi : un passage obligé",

      "Le référencement Qualiopi constitue une étape cruciale pour toute institution souhaitant proposer des formations éligibles au financement par les OPCO ou les CPF. Ce processus d'audit évalue l'organisation sur 7 critères essentiels :",

      "• La définition et l'adéquation des objectifs de la prestation\n• L'adaptation aux publics en situation de handicap\n• L'information des stagiaires\n• La prise en compte des acquis et de l'expérience\n• La qualification des personnels\n• L'accompagnement des stagiaires\n• L'évaluation et l'amélioration continue",

      "## Le recrutement du corps professoral",

      "Constituer une équipe pédagogique qualifiée représente souvent le défi le plus conséquent. Le marché des professeurs et formateurs en enseignement supérieur est particulièrement tendu, notamment dans les disciplines techniques et scientifiques.",

      "Une stratégie de recrutement efficace doit s'appuyer sur une définition précise des profils recherchés, une présence active sur les réseaux professionnels spécialisés et une proposition de valeur attractive (rémunération, conditions d'exercice, opportunités de développement professionnel).",

      "## Les 12 à 18 mois de mise en place",

      "Entre la conception initiale et l'ouverture effective, il faut compter 12 à 18 mois de travail intensif. Cette période comprend :",

      "• Mois 1-3 : Constitution du projet et premières démarches administratives\n• Mois 4-9 : Procédures d'accréditation et développement des maquettes\n• Mois 10-12 : Référencement Qualiopi et recrutement des équipes\n• Mois 13-18 : Mise en place des infrastructures, test des processus et lancement marketing",

      "## Conclusion",

      "La création d'une institution d'enseignement supérieur est un projet de longue haleine qui exige rigueur, patience et expertise multidisciplinaire. L'accompagnement par des professionnels expérimentés peut significativement réduire les risques et accélérertimeline de mise en œuvre."
    ]
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const lang = params.lang as string;
  const slug = params.slug as string;
  
  const post = POSTS[slug];
  
  if (!post) {
    return (
      <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh" }}>
        <div className="container">
          <Link
            href={`/${lang}/blog`}
            className={styles.featCta}
            style={{ marginBottom: 32, display: "inline-flex" }}
          >
            ← Retour aux articles
          </Link>
          <p>Article non trouvé</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="container">
        <Link
          href={`/${lang}/blog`}
          className={styles.featCta}
          style={{ marginBottom: 32, display: "inline-flex" }}
        >
          ← Retour aux articles
        </Link>

        <article style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <span className={styles.badge} style={{ marginRight: 12 }}>
              {post.category}
            </span>
            <span className={styles.date}>{post.date}</span>
          </div>

          <h1
            className="t-display"
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              marginBottom: 32,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontSize: 20,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              marginBottom: 48,
              fontStyle: "italic",
            }}
          >
            {post.excerpt}
          </p>

          <div
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: "var(--text-primary)",
            }}
          >
            {post.content.map((paragraph, idx) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    style={{
                      fontSize: 24,
                      fontWeight: 500,
                      marginTop: 48,
                      marginBottom: 24,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("• ")) {
                return (
                  <ul key={idx} style={{ marginBottom: 24, paddingLeft: 24 }}>
                    {paragraph.split("\n").map((item, i) => (
                      <li
                        key={i}
                        style={{
                          marginBottom: 8,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.replace("• ", "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={idx}
                  style={{
                    marginBottom: 24,
                    color: paragraph.includes("Conclusion") 
                      ? "var(--text-primary)" 
                      : "var(--text-secondary)",
                    fontWeight: paragraph.includes("Conclusion") ? 500 : 400,
                  }}
                >
                  {paragraph}
                </p>
              );
            })}
          </div>

          <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--border-light)" }}>
            <p style={{ fontSize: 14, color: "var(--text-tertiary)" }}>
              Cet article a été publié le {post.date} dans la catégorie {post.category}.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
