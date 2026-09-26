Prompt for coder:



La recherche filesystem ne matche que les noms de fichiers. Je lis la fin des fichiers HTML pour confirmer l'absence (ou présence) de JSON-LD en fin de body.JSON-LD confirmé: Article, BreadcrumbList, SoftwareApplication, LocalBusiness, Organization sont présents. Mais je note déjà l'absence de FAQPage malgré les sections FAQ. Je vérifie trois derniers points: .htaccess (redirections), le noindex des dossiers hors sitemap, et une page produit..htaccess: HTTPS forcé et trailing-slash gérés, mais aucune redirection www vers non-www alors que www est un hôte valide. Je vérifie le noindex d'un dossier hors sitemap (talentos) et la page produit entreprises.Confirmé: `/fr/talentos/` (TalentOS, produit recrutement) est `index, follow`, avec canonical, OG et hreflang complets, mais absent du sitemap et de la navigation. Page orpheline indexable. Je vérifie un dernier dossier au nom sensible.Audit basé sur les fichiers réellement lus (robots.txt, sitemap.xml, llms.txt, .htaccess, home FR, un article du Référentiel avec tous ses JSON-LD, talentos, hidden-testimonials).

## Ce qui est déjà solide

Canonical, hreflang (fr/en/x-default) et OG complets sur toutes les pages vues. JSON-LD présent et varié (Organization, LocalBusiness, SoftwareApplication, BreadcrumbList, Article). Contenu du Référentiel factuel et sourcé (Roediger et Karpicke 2006, Ebbinghaus, Vygotsky, Bloom), ce qui est un atout GEO rare. HTTPS forcé et trailing-slash gérés en 301. Sécurité HTTP correcte (nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy). Le mécanisme `noindex` existe et fonctionne (hidden-testimonials est bien en `noindex, nofollow`).

## Bloquant (à corriger avant tout)

**1. Aucun FAQPage schema alors que le contenu est déjà en questions/réponses.** Chaque article du Référentiel a une section « Questions fréquentes » structurée, mais le JSON-LD n'émet que du `Article`. C'est le levier GEO le plus rentable du site : le FAQPage est précisément ce que Google (rich results) et les moteurs génératifs (ChatGPT, Perplexity, Google AI Overviews) consomment pour citer une réponse. Fait vérifié : j'ai lu la totalité des blocs JSON-LD de l'article adaptatif, aucun `FAQPage`. Action : générer un bloc `FAQPage` par page disposant d'une FAQ, et un `QAPage`/FAQ sur les pages produit.

**2. Incohérence de prix dans le structured data.** Le `SoftwareApplication` déclare `AggregateOffer` `lowPrice 990 / highPrice 2900 EUR`, alors que les pages produit annoncent un tarif « sur demande » et qu'il n'existe pas de page tarifs publique dans le sitemap. Risque : rich result trompeur, ou signalement Google pour données non vérifiables sur la page. Action : soit publier une vraie grille, soit retirer le bloc `offers`.

**3. Page orpheline indexable : `/fr/talentos/` (et `/en/talentos/`).** Elle est en `index, follow`, avec canonical, OG et hreflang complets, mais absente du sitemap et de la navigation. La home la « annonce » pourtant (meta description : « gere vos recrutements »). Deux options, aucune neutre : soit assumer TalentOS (l'ajouter au sitemap + nav + llms.txt), soit la passer en `noindex` tant qu'elle n'est pas lancée. À trancher, car en l'état c'est un signal produit contradictoire pour Google et les IA.

**4. llms.txt expose de l'infrastructure et liste des routes fantômes.** Il contient le chemin d'hébergement (`/home/sc4bovu7233/data/`), les scripts de déploiement, le CMS `/content-management` en « god role », et référence `/learningos`, `/talentos`, `/tarifs` qui ne correspondent pas au sitemap (`/openos`, `/entreprises`, `/education`). Un llms.txt public doit guider les IA vers le contenu, pas documenter le devops. Action : réécrire un llms.txt orienté contenu, aligné sur l'architecture réelle des 3 produits et sur le Référentiel, sans aucune donnée d'exploitation.

## Fort impact

**5. Accents supprimés dans les métadonnées de la home et dans du JSON-LD.** Titre home « systeme », description « gere », « montee en competences » ; `SoftwareApplication.description` « Systeme » ; `LocalBusiness` « 60 Rue Francois 1er ». Le site sait afficher les accents (les titres d'articles les ont). Sur un site FR, des métadonnées désaccentuées nuisent à la lisibilité SERP et à la cohérence de marque. Action : réaccentuer toutes les chaînes de meta et de JSON-LD.

**6. Pas de redirection www vers non-www.** Le .htaccess force HTTPS mais préserve l'hôte (`https://%{HTTP_HOST}`). Or `www.mentivisos.com` est traité comme hôte valide (JS de consentement et robots.txt le mentionnent) alors que tous les canonicals pointent vers `mentivisos.com`. Fait : la redirection est absente. Hypothèse à vérifier : si `www` résout en DNS et sert le site, vous avez du contenu dupliqué sur deux hôtes. Action : ajouter une 301 `www` vers non-www en tête de .htaccess.

**7. Deux BreadcrumbList divergents dans la même page.** Le bloc SSR (dans `<div hidden id="S:0">`) nomme le dernier maillon par le slug brut (`quest-ce-que-lapprentissage-adaptatif-...`) et lui laisse un `item`, tandis que la version hydratée utilise le titre propre et omet l'`item` du dernier élément (conforme aux recommandations Google). Un crawler peut lire la version « slug ». Action : générer un seul fil d'Ariane, avec libellé = titre et sans `item` sur le dernier maillon.

**8. Cohérence du message produit sur la home.** La description met en avant le recrutement (« gere vos recrutements »), qui renvoie à TalentOS, absent de l'architecture visible (Open/Entreprise/Education, tous formation). Action : aligner la meta description de la home sur l'offre réellement exposée, ou réintégrer TalentOS proprement (cf. point 3).

## Finitions (GEO « de la mort »)

**9. Enrichir le schema Article pour l'E-E-A-T et la citabilité.** Aujourd'hui `author` = Organization « MentivisOS ». Ajouts à fort rendement pour les moteurs génératifs : un `author` nommé avec `Person`/`jobTitle`, un champ `citation` reprenant les sources déjà présentes en prose (Roediger et Karpicke, Ebbinghaus, Bloom), `about`/`keywords`, et un bloc `speakable`. Ces éléments augmentent la probabilité d'être cité comme source par une IA.

**10. Hiérarchie de titres.** Les articles passent de `H1` directement à `H3` (le corps commence par `<h3>`). Action : réintroduire un niveau `H2` pour les sections principales.

**11. robots.txt.** L'allowlist AI-bots est cosmétique puisque `User-Agent: * Allow: /` autorise déjà tout ; « Claude-Web » est par ailleurs un jeton daté (à vérifier : les crawlers Anthropic actuels sont plutôt `ClaudeBot` et `Claude-SearchBot`). Ce n'est pas bloquant, mais si vous gardez des blocs nommés, autant les tenir à jour.

**12. Point non-SEO à signaler.** Le Consent Mode est initialisé `default` à `granted` pour `ad_storage`, `analytics_storage`, `ad_personalization`, etc. Sur un site FR, la doctrine CNIL attend un `denied` par défaut avant recueil du consentement. Je ne suis pas juriste : à faire valider, mais le risque de conformité est réel et vous êtes en charge Brand & Marketing.

## Ordre d'exécution proposé

FAQPage (1) et correction du bloc offers (2) d'abord, car meilleur rendement GEO/SEO immédiat. Puis arbitrage TalentOS (3) et réécriture llms.txt (4). Ensuite accents (5), 301 www (6), fil d'Ariane unique (7). Le reste en itération.







La recherche filesystem ne matche que les noms de fichiers. Je lis la fin des fichiers HTML pour confirmer l'absence (ou présence) de JSON-LD en fin de body.JSON-LD confirmé: Article, BreadcrumbList, SoftwareApplication, LocalBusiness, Organization sont présents. Mais je note déjà l'absence de FAQPage malgré les sections FAQ. Je vérifie trois derniers points: .htaccess (redirections), le noindex des dossiers hors sitemap, et une page produit..htaccess: HTTPS forcé et trailing-slash gérés, mais aucune redirection www vers non-www alors que www est un hôte valide. Je vérifie le noindex d'un dossier hors sitemap (talentos) et la page produit entreprises.Confirmé: `/fr/talentos/` (TalentOS, produit recrutement) est `index, follow`, avec canonical, OG et hreflang complets, mais absent du sitemap et de la navigation. Page orpheline indexable. Je vérifie un dernier dossier au nom sensible.Audit basé sur les fichiers réellement lus (robots.txt, sitemap.xml, llms.txt, .htaccess, home FR, un article du Référentiel avec tous ses JSON-LD, talentos, hidden-testimonials).

## Ce qui est déjà solide

Canonical, hreflang (fr/en/x-default) et OG complets sur toutes les pages vues. JSON-LD présent et varié (Organization, LocalBusiness, SoftwareApplication, BreadcrumbList, Article). Contenu du Référentiel factuel et sourcé (Roediger et Karpicke 2006, Ebbinghaus, Vygotsky, Bloom), ce qui est un atout GEO rare. HTTPS forcé et trailing-slash gérés en 301. Sécurité HTTP correcte (nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy). Le mécanisme `noindex` existe et fonctionne (hidden-testimonials est bien en `noindex, nofollow`).

## Bloquant (à corriger avant tout)

**1. Aucun FAQPage schema alors que le contenu est déjà en questions/réponses.** Chaque article du Référentiel a une section « Questions fréquentes » structurée, mais le JSON-LD n'émet que du `Article`. C'est le levier GEO le plus rentable du site : le FAQPage est précisément ce que Google (rich results) et les moteurs génératifs (ChatGPT, Perplexity, Google AI Overviews) consomment pour citer une réponse. Fait vérifié : j'ai lu la totalité des blocs JSON-LD de l'article adaptatif, aucun `FAQPage`. Action : générer un bloc `FAQPage` par page disposant d'une FAQ, et un `QAPage`/FAQ sur les pages produit.

**2. Incohérence de prix dans le structured data.** Le `SoftwareApplication` déclare `AggregateOffer` `lowPrice 990 / highPrice 2900 EUR`, alors que les pages produit annoncent un tarif « sur demande » et qu'il n'existe pas de page tarifs publique dans le sitemap. Risque : rich result trompeur, ou signalement Google pour données non vérifiables sur la page. Action : soit publier une vraie grille, soit retirer le bloc `offers`.

**3. Page orpheline indexable : `/fr/talentos/` (et `/en/talentos/`).** Elle est en `index, follow`, avec canonical, OG et hreflang complets, mais absente du sitemap et de la navigation. La home la « annonce » pourtant (meta description : « gere vos recrutements »). Deux options, aucune neutre : soit assumer TalentOS (l'ajouter au sitemap + nav + llms.txt), soit la passer en `noindex` tant qu'elle n'est pas lancée. À trancher, car en l'état c'est un signal produit contradictoire pour Google et les IA.

**4. llms.txt expose de l'infrastructure et liste des routes fantômes.** Il contient le chemin d'hébergement (`/home/sc4bovu7233/data/`), les scripts de déploiement, le CMS `/content-management` en « god role », et référence `/learningos`, `/talentos`, `/tarifs` qui ne correspondent pas au sitemap (`/openos`, `/entreprises`, `/education`). Un llms.txt public doit guider les IA vers le contenu, pas documenter le devops. Action : réécrire un llms.txt orienté contenu, aligné sur l'architecture réelle des 3 produits et sur le Référentiel, sans aucune donnée d'exploitation.

## Fort impact

**5. Accents supprimés dans les métadonnées de la home et dans du JSON-LD.** Titre home « systeme », description « gere », « montee en competences » ; `SoftwareApplication.description` « Systeme » ; `LocalBusiness` « 60 Rue Francois 1er ». Le site sait afficher les accents (les titres d'articles les ont). Sur un site FR, des métadonnées désaccentuées nuisent à la lisibilité SERP et à la cohérence de marque. Action : réaccentuer toutes les chaînes de meta et de JSON-LD.

**6. Pas de redirection www vers non-www.** Le .htaccess force HTTPS mais préserve l'hôte (`https://%{HTTP_HOST}`). Or `www.mentivisos.com` est traité comme hôte valide (JS de consentement et robots.txt le mentionnent) alors que tous les canonicals pointent vers `mentivisos.com`. Fait : la redirection est absente. Hypothèse à vérifier : si `www` résout en DNS et sert le site, vous avez du contenu dupliqué sur deux hôtes. Action : ajouter une 301 `www` vers non-www en tête de .htaccess.

**7. Deux BreadcrumbList divergents dans la même page.** Le bloc SSR (dans `<div hidden id="S:0">`) nomme le dernier maillon par le slug brut (`quest-ce-que-lapprentissage-adaptatif-...`) et lui laisse un `item`, tandis que la version hydratée utilise le titre propre et omet l'`item` du dernier élément (conforme aux recommandations Google). Un crawler peut lire la version « slug ». Action : générer un seul fil d'Ariane, avec libellé = titre et sans `item` sur le dernier maillon.

**8. Cohérence du message produit sur la home.** La description met en avant le recrutement (« gere vos recrutements »), qui renvoie à TalentOS, absent de l'architecture visible (Open/Entreprise/Education, tous formation). Action : aligner la meta description de la home sur l'offre réellement exposée, ou réintégrer TalentOS proprement (cf. point 3).

## Finitions (GEO « de la mort »)

**9. Enrichir le schema Article pour l'E-E-A-T et la citabilité.** Aujourd'hui `author` = Organization « MentivisOS ». Ajouts à fort rendement pour les moteurs génératifs : un `author` nommé avec `Person`/`jobTitle`, un champ `citation` reprenant les sources déjà présentes en prose (Roediger et Karpicke, Ebbinghaus, Bloom), `about`/`keywords`, et un bloc `speakable`. Ces éléments augmentent la probabilité d'être cité comme source par une IA.

**10. Hiérarchie de titres.** Les articles passent de `H1` directement à `H3` (le corps commence par `<h3>`). Action : réintroduire un niveau `H2` pour les sections principales.

**11. robots.txt.** L'allowlist AI-bots est cosmétique puisque `User-Agent: * Allow: /` autorise déjà tout ; « Claude-Web » est par ailleurs un jeton daté (à vérifier : les crawlers Anthropic actuels sont plutôt `ClaudeBot` et `Claude-SearchBot`). Ce n'est pas bloquant, mais si vous gardez des blocs nommés, autant les tenir à jour.

**12. Point non-SEO à signaler.** Le Consent Mode est initialisé `default` à `granted` pour `ad_storage`, `analytics_storage`, `ad_personalization`, etc. Sur un site FR, la doctrine CNIL attend un `denied` par défaut avant recueil du consentement. Je ne suis pas juriste : à faire valider, mais le risque de conformité est réel et vous êtes en charge Brand & Marketing.

## Ordre d'exécution proposé

FAQPage (1) et correction du bloc offers (2) d'abord, car meilleur rendement GEO/SEO immédiat. Puis arbitrage TalentOS (3) et réécriture llms.txt (4). Ensuite accents (5), 301 www (6), fil d'Ariane unique (7). Le reste en itération.

Je peux produire directement les correctifs : le générateur de bloc `FAQPage` + `Article` enrichi (à brancher dans le template `[slug]`), un llms.txt réécrit, et le patch .htaccess. Dis-moi par lequel commencer.