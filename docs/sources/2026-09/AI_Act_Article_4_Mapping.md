# A. Audit éditorial

## Ce qui fonctionne

Le Référentiel a une vraie qualité rare dans ce marché. Chaque article ouvre par une définition dense (le chapô), structure claire, et une section « Questions fréquentes ». Ce format « définition d'abord + FAQ » est exactement ce que les moteurs et les IA génératives extraient pour répondre. Le ton factuel et sans emphase est un atout différenciant : les concurrents saturent leurs pages de « révolutionne », « infini », « sur mesure » (Lefebvre Dalloz parle d'un potentiel « infini », Cegos de formation qui « révolutionne »), or les IA privilégient les réponses précises et sourcées. Le contenu cite de vraies références (Roediger et Karpicke 2006, Ebbinghaus, Vygotsky, Bloom), ce qui renforce la citabilité.

## Problèmes éditoriaux (faits constatés)

1. **Duplication interne dans les sources.** Dans les fichiers markdown du projet, le chapô est répété tel quel en premier paragraphe, et la FAQ apparaît deux fois (inline puis en section « Questions fréquentes »). La page rendue de l'article adaptatif, elle, déduplique et enrichit le corps. Action : vérifier que toutes les pages rendues dédupliquent comme celle-ci, sinon contenu mince dupliqué.
2. **Tout le Référentiel est en haut de tunnel, définitionnel.** Les titres sont « Qu'est-ce que… », « Comment… ». Or les requêtes qui convertissent dans ce marché sont commerciales et comparatives : « meilleur LMS 2026 », « comparatif », « alternative à », « logiciel de gestion des compétences ». Il manque tout l'étage intercepteur (comparaison, alternative, prix, vs).
3. **Structure plate, pas de clusters.** 40 articles en liste. Le frontmatter porte des blocs M/N/P mais aucune arborescence de piliers n'est exposée. L'autorité SEO se disperse au lieu de se concentrer sur quelques pages piliers.
4. **E-E-A-T faible.** Tous les articles sont signés « MentivisOS » (Organization). Sur des sujets à autorité (pédagogie, AI Act, RGPD, financement OPCO), un auteur nommé avec fonction augmente confiance et probabilité de citation par une IA.
5. **Incohérence de nommage produit.** « MentivisOS Open », « Mentivis OS Entreprise », « Mentivis OS Education » cohabitent (espace variable). Nuit à la reconnaissance d'entité.
6. **À vérifier (hypothèse) : les pages /en/.** Le sitemap déclare des versions EN pour chaque article, mais les slugs restent français. Si /en/ sert du contenu français, c'est un problème hreflang et une opportunité EN gâchée. Je n'ai pas lu de page EN, donc à contrôler.

# B. Stratégie de captation

## Le constat stratégique

Personne ne cherche « système de formation native IA » ni « moteur pédagogique ». La catégorie de MentivisOS n'a pas de volume. Toute la stratégie consiste donc à intercepter la demande adjacente existante (LMS, adaptive learning, cartographie des compétences, AI Act, financement), puis à convertir vers la nouvelle catégorie sur la page. Je ne dispose pas des volumes exacts (limite signalée) ; je classe par intensité de concurrence observée et par intention.

## Clusters à cibler

| Cluster                        | Requêtes types                                               | Concurrence SERP                                    | Angle MentivisOS                                             |
| ------------------------------ | ------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------ |
| AI Act article 4 formation     | « formation IA obligatoire », « AI Act article 4 entreprise », « plan de formation IA modèle » | Forte mais fraîche, très commerciale                | Prouver la littératie IA compétence par compétence avec traçabilité pour l'auditeur, pas seulement « former » |
| Mesure et écart de compétences | « cartographie des compétences », « logiciel gestion des compétences », « identifier écart de compétences », « GPEC logiciel » | Forte (GPEC/SIRH)                                   | Boucler ce que la GPEC laisse ouvert : de la mesure de l'écart à la génération du parcours qui le comble |
| LMS: alternative et limites    | « alternative à [360Learning/Docebo/Moodle] », « LMS ne suffit plus », « LMS avec IA générative » | Très forte sur la tête, faible sur la longue traîne | Ne pas se dire « meilleur LMS » mais « autre catégorie » ; intercepter « au-delà du LMS » |
| Adaptive learning              | « adaptive learning entreprise », « outil apprentissage adaptatif », « adaptive learning vs LMS » | Saturée (Cegos, Rise Up, Lefebvre Dalloz)           | Article existant à renforcer (FAQPage, auteur, sources, maillage) |
| Financement                    | « financement formation IA OPCO », « formation IA finançable CPF » | Moyenne, bas de tunnel                              | Guide existant fort, à interlier vers pages produit          |
| Niche possédée                 | « diagnostic écart compétences POEI », « aide à la décision conseiller France Travail » | Quasi nulle                                         | Cas d'usage réel de MentivisOS, à posséder                   |

## Priorités

Priorité 1 : AI Act article 4 et Mesure/écart de compétences. Ce sont les deux endroits où MentivisOS a un angle propre que les concurrents ne peuvent pas tenir. L'AI Act est une obligation légale à échéance active, avec réécriture récente du texte le 27 juillet 2026 (l'obligation ne vise plus « un niveau suffisant » de maîtrise mais demeure une obligation d'agir) : l'article existant doit être mis à jour pour rester exact. La cartographie des compétences est portée par les outils GPEC (HRMAPS génère des diagrammes pour identifier le « GAP des compétences » et les besoins en formation) qui s'arrêtent au diagnostic ; MentivisOS enchaîne sur la génération du parcours, ce qu'aucun ne fait.

Priorité 2 : contenus intercepteurs LMS. Publier des formats « alternative à » et « le LMS ne suffit plus », en s'appuyant sur l'aveu récurrent des concurrents eux-mêmes : un LMS ne suffit pas à lui seul à répondre aux exigences Qualiopi, et le LMS montre ses limites sur la personnalisation avancée et la gestion fine des compétences. Ne pas viser la tête « meilleur LMS », inaccessible face aux listicles des éditeurs.

Priorité 3 : renforcer l'existant (adaptive learning, financement) et corriger la structure en clusters.

## Munitions citables à réutiliser (à revérifier avant publication)

Des chiffres présents dans les SERP renforceraient la citabilité des articles : budget France Compétences 2026 de 12,078 milliards d'euros, en baisse de 10,4 %, ce qui appuie l'argument du pilotage efficace ; obsolescence des compétences estimée à 40 % d'ici 2030 selon le Forum économique mondial. À sourcer directement à l'origine avant usage, pas depuis ces pages.

## Tactiques GEO transverses

Le décideur demande de plus en plus à ChatGPT ou Perplexity « quel outil pour mesurer les compétences » ou « comment être conforme à l'AI Act ». Pour être cité : garder les paragraphes définitionnels en tête d'article (déjà fait), ajouter le FAQPage schema (cf. audit technique précédent), insérer des tableaux comparatifs (les IA les extraient volontiers), signer par un auteur nommé, et sourcer chaque chiffre. Ce sont ces éléments, plus que les balises classiques, qui font remonter MentivisOS dans les réponses génératives.

# Plan d'action éditorial proposé

1. Créer 4 pages piliers (AI Act, Mesure des compétences, Au-delà du LMS, Adaptive learning) et rattacher les 40 articles existants en clusters sous elles, avec maillage interne.
2. Produire 6 à 8 articles intercepteurs bas et milieu de tunnel (alternatives LMS, comparatifs, prix, vs), reliés aux pages produit.
3. Mettre à jour l'article AI Act article 4 (réécriture du 27 juillet 2026) et lui ajouter l'angle traçabilité/preuve.
4. Ajouter auteur nommé + sources + FAQPage sur tout le Référentiel.
5. Vérifier et, si besoin, traduire réellement les pages EN.

Je peux enchaîner sur les briefs rédactionnels des 4 piliers et des articles intercepteurs (titre, intention, plan, requêtes visées, sources, maillage), ou sur une cartographie complète requêtes vers URL. Dis-moi lequel des deux d'abord.

## Cartographie requête vers URL

| Article                                                   | Cluster intercepté                                           | Intention                               | Angle propre                                         |
| --------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------- | ---------------------------------------------------- |
| Formation IA obligatoire, prouver la conformité article 4 | « formation IA obligatoire », « AI Act article 4 entreprise » | Décision, obligation légale active      | Prouver, pas seulement former, plus financement OPCO |
| Cartographie des compétences, de la mesure au parcours    | « cartographie des compétences », « logiciel gestion des compétences », « écart de compétences » | Milieu de tunnel, DRH                   | Boucler ce que la GPEC laisse ouvert                 |
| Le LMS ne suffit plus                                     | « alternative LMS », « LMS ne suffit plus », « LMS avec IA » | Décision, remise en cause de l'existant | Changement de catégorie, pas meilleur LMS            |
| LMS, LXP, adaptive learning, moteur IA                    | « différence LMS LXP », « types de plateformes formation »   | Comparaison, clarification              | Tableau de catégories, place MentivisOS              |
| Adaptive learning, ce qui marche vraiment                 | « adaptive learning entreprise », « outil apprentissage adaptatif » | Informationnel saturé                   | Angle preuve, tri du réel et du marketing            |

## Points de vigilance cannibalisation (à traiter à la publication)

Trois recoupements avec l'existant, à arbitrer pour ne pas se concurrencer soi-même. L'article AI Act ci-dessus complète, sans le remplacer, votre `ai-act-article-4-ce-que-votre-entreprise-doit-avoir-mis-en-place` : l'existant est la checklist, le nouveau est la preuve et le financement. Interliez-les et gardez des angles distincts. Le nouvel « adaptive learning, ce qui marche vraiment » se distingue du définitionnel `quest-ce-que-lapprentissage-adaptatif` : le premier est critique et décisionnel, le second est la définition. Le « LMS ne suffit plus » se distingue de `mon-lms-ne-sert-a-rien` (celui-ci porte sur les taux de complétion, le nouveau sur le changement de catégorie). Interliez chaque paire plutôt que de les laisser se disputer la même requête.

## Adaptations de wording recommandées (hors articles)

Sur la home, la meta description met en avant « gere vos recrutements » (TalentOS), absent de l'architecture visible. Alignez-la sur l'offre exposée, par exemple : « MentivisOS mesure les écarts de compétences, génère des parcours personnalisés et pilote la montée en compétences de vos équipes. » Réaccentuez toutes les métadonnées désaccentuées (système, gère, compétences). Uniformisez le nommage en « MentivisOS » soudé partout (nav et footer écrivent « Mentivis OS Entreprise » et « Mentivis OS Education » avec une espace variable), pour la reconnaissance d'entité.

## Maillage à mettre en place

Depuis chaque nouvel article, lien vers la page produit pertinente (MentivisOS Entreprise pour les quatre articles décideurs, MentivisOS Education là où l'organisme de formation est concerné) et vers le guide financement existant depuis l'article AI Act. Créez à terme quatre pages piliers (AI Act, Mesure des compétences, Au-delà du LMS, Adaptive learning) qui agrègent les clusters, pour concentrer l'autorité au lieu de la disperser sur 45 articles à plat.

Je peux enchaîner sur les versions anglaises de ces 5 articles, sur 3 à 4 articles bas de tunnel supplémentaires (comparatifs nommés, prix, financement dédié), ou sur les 4 pages piliers avec leur maillage. Dis-moi la suite.