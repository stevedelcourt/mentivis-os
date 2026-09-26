# Progress : SEO/GEO, Référentiel FR/EN, site statique

Branche : `claude/compassionate-cray-kjww7b` (partie de `main` au commit `1022782`). Rien n'a été poussé sur `main` ni déployé.
Date : 26 septembre 2026.

## Objectifs

1. SEO/GEO impeccable.
2. Indexation Google Search Console sans friction.
3. Design strictement identique au site actuel (le code du dépôt fait référence ; mentivisos.com n'était pas joignable depuis l'environnement de travail).
4. Traductions EN.
5. Un `out/` statique à déposer par FTP.

Sources de la demande, versionnées dans `docs/sources/2026-09/` :
- `piliers-referentiel-mentivisos.md` : 4 pages piliers ;
- `articles-bas-de-tunnel-mentivisos.md` : alternative LMS, coût, financement ;
- 3 articles séparés : adaptive learning, cartographie des compétences, formation IA obligatoire ;
- `Technical-todo.md` : audit technique SEO/GEO en 12 points ;
- `AI_Act_Article_4_Mapping.md` : audit éditorial, clusters, maillage, cannibalisation.

Décisions prises avec Steven :
- `/out` statique avec `proxy.php`, qui relaie `/api/*` vers le serveur Node ;
- rédaction des 3 articles manquants cités par les piliers ;
- auteur nommé « Steven Delcourt » ;
- TalentOS en `noindex`.

## Lot 2 : site 100 % statique, sans Node ni CMS

Demande de Steven : ne plus utiliser le CMS, un `public_html` qui ne contient que le site, formulaires et candidatures en PHP vers HubSpot, suppression du code serveur, bascule de sc4.

### Réalisé

- **Référentiel** : la section des piliers s'appelle « Points clés » (EN : « Key points »). Nouveau texte sous le titre : « Articles factuels sur l'IA dans la formation, l'apprentissage adaptatif et les produits MentivisOS. »
- **Contenu en fichiers** (`lib/content/`) :
  - blog : `content/blog/<slug>.json` ;
  - offres : `content/jobs/<slug>.json` ;
  - optionnels : `content/pricing.json`, `content/pages.json`, `content/seo.json` ;
  - valeurs par défaut dans `lib/content/defaults.ts`.
  Les 2 articles de blog versionnés (anciens « seeds ») sont dans `content/blog/`.
- **Plus aucun appel `/api/`** : blog, sections de la home, carrières, offre, tarifs et textes de hero reçoivent leurs données au build.
- **Formulaires PHP** (`public/forms/`) :
  - `submit.php` : contact, démo, PDF, offre été ;
  - `beta.php` : questionnaire bêta ;
  - `apply.php` : candidature avec CV en PDF, déposé en privé dans HubSpot Files puis relié au contact via `lien_cv`, sans copie sur le serveur ;
  - `_lib.php` : contrôle d'origine, limite par formulaire et par IP, honeypot, relance sans `hutk`.
  - Secrets dans `~/mentivis-config.php`, hors du web.
- **Export du CMS** : `npm run content:export` (`scripts/export-cms-content.mjs`), adapté de `scripts/snapshot-prod-db.js`. Il écrit des JSON et télécharge les images dans `public/uploads/`. Il ne lit ni soumissions, ni candidatures, ni CV.
- **Code supprimé** : `app/api/`, CMS (`app/[lang]/content-management/`, `components/cms/`, hooks CMS), `proxy.ts`, `lib/cms/{db,sqlite,auth,users,utils}.ts`, `lib/rate-limit.ts`, `server.js`, `sql.js.d.ts`, scripts de déploiement Passenger et de synchronisation, `vercel.json`, `.htaccess` racine, dépendances `sql.js`, `bcryptjs`, `@vercel/blob`.
  - Le tag `pre-static-2026-09` a été refusé par le proxy git de l'environnement. L'état d'avant suppression est le commit `c05638c`.
- **Build** :
  - `npm run build` = export statique + `.htaccess` + contrôle SEO. Le build échoue au moindre problème.
  - `.htaccess` : `/api/*` répond 410 ; fichiers cachés bloqués sauf `.well-known` (certificats) ; plus de relais PHP vers Node.
- **Lien « CMS »** retiré du pied de page. `robots.txt` exclut `/forms/`.
- **Documentation** : `AGENTS.md` réécrit pour l'architecture statique ; `docs/MANUEL-SERVEURS.md`, section 0 (procédure de bascule).

### Vérifications (lot 2)

- `npm run typecheck` : OK.
- `npm test` : 39 tests passent. Les tests en échec de `rate-limit` ont disparu avec le module.
- `npx eslint` : 157 problèmes (contre 286 au départ), tous antérieurs ; aucun dans le code ajouté.
- `npm run build` : 171 pages, contrôle SEO sans erreur (168 pages, 148 URL de sitemap). Aucun `fetch("/api/` dans `out/_next`.
- Apache 2.4 sur `out/` :
  - redirections www, HTTPS, racine et ancien slug ;
  - `/api/*` en 410, `/.well-known/` servi ;
  - `forms/_lib.php`, `forms/.user.ini` et `.htaccess` en 403 ;
  - 404 sur les pages inexistantes.
- PHP 8.4 contre un faux HubSpot local :
  - envoi démo, dont la relance sans `hutk` refusé ;
  - honeypot, champs manquants, origine refusée, méthode GET ;
  - questionnaire bêta ;
  - candidature avec PDF (Files, formulaire, lecture puis mise à jour du contact) ;
  - faux PDF refusé, fichier de 7 Mo refusé (413), 4e candidature dans la minute refusée (429).
- Captures Playwright de `out/` (blog, article, carrières EN, tarifs, contact, Référentiel, à propos) : aucune erreur JavaScript ni ressource en erreur.

### Reste à faire (actions de Steven)

1. **Réconcilier le travail local de la branche `feat/static-export`** (modifications non commitées). Le pousser sur `wip/static-export-local` pour que je le compare.
2. **Lancer `npm run content:export`** avec `CMS_AUTH_SECRET` tant que sc4 tourne encore, puis commiter `content/` et `public/uploads/`. Sans cela, le blog n'a que 2 articles, il n'y a aucune offre, et les tarifs et textes de hero restent ceux du code.
3. **Basculer sc4** selon `docs/MANUEL-SERVEURS.md`, section 0, puis sc10 (`mentivisos.com`) une fois sc4 validé.

## Lot 1 : SEO/GEO, Référentiel FR/EN, premier export

## État des lieux initial (avant modifications)

**Qualité du code**
- `npm run lint` : 286 problèmes (172 erreurs, 114 avertissements), tous antérieurs.
- `npm run typecheck` : OK.
- `npm test` : 3 tests en échec sur 35 (`stripMarkdown` images, et deux tests de `rate-limit`).

**Canonical et hreflang faux sur 20 pages environ**
- Le layout `app/[lang]/layout.tsx` construisait canonical et hreflang à partir de l'en-tête `x-current-path`.
- Or `proxy.ts` posait cet en-tête sur la réponse, pas sur la requête.
- Résultat : about, contact, entreprises, education, tarifs, etc. avaient un canonical pointant vers la home, et un og:title égal à celui de la home.

**Autres constats**
- `<html lang="fr">` codé en dur pour toutes les pages EN.
- Home sans hreflang ni x-default (la page écrasait les `alternates` du layout).
- Articles du Référentiel : pas de FAQPage malgré les FAQ, auteur Organization, titres H1 puis H3, deux BreadcrumbList divergents.
- `llms.txt` exposait l'hébergement, les scripts de déploiement et le CMS, et citait `/learningos` (inexistant).
- `robots.ts` sans Disallow du CMS ni de l'API, et jeton daté `Claude-Web`.
- Sitemap sans x-default, avec `lastModified` égal à la date du build.
- Métadonnées et JSON-LD par défaut désaccentués (« Systeme », « Francois 1er »).
- Meta description de la home centrée sur le recrutement (TalentOS).
- Versions EN du Référentiel condensées (environ 55 % du français), sans FAQ pour la plupart.
- 4 fiches produit du Référentiel (ids 14 à 17) publiées avec un contenu vide.
- Aucun export statique réel : `scripts/build-static.sh` aspirait le site en ligne avec curl, depuis une liste de pages obsolète.
- Point 2 de l'audit (offres 990/2900 dans le JSON-LD) : inexact. `/tarifs` est dans le sitemap et affiche ces prix (`components/tarifs/pricing-data.ts`). Le bloc `offers` est conservé.

## Réalisé

### 1. Socle SEO (SSR et statique)

- **`lib/seo/page-metadata.ts`**
  - `pageMetadata()` : title, description, canonical autoréférent, hreflang fr/en/x-default réciproques, Open Graph complet (dont `og:locale:alternate`), Twitter, robots.
  - Utilisé par toutes les pages de `app/[lang]/**`.
  - `en: false` omet le hreflang anglais quand la page n'existe pas en anglais.
- **Layout racine déplacé dans `app/[lang]/layout.tsx`**
  - `<html lang>` correct par langue.
  - `generateStaticParams` fr/en ; plus aucun appel à `headers()`.
  - `metadataBase`.
  - Organization localisée, avec `@id` réutilisé par les autres blocs.
- **404**
  - `app/global-not-found.tsx` (option `experimental.globalNotFound`).
  - Le message de 404 suit la langue de l'URL.
  - `app/layout.tsx`, `app/page.tsx` et `app/not-found.tsx` sont supprimés. `/` est redirigé par `proxy.ts` (SSR) ou par `.htaccess` (statique).
- **GTM et consentement**
  - GTM se charge uniquement sur l'hôte canonique ; le test se fait côté navigateur, donc aussi en statique.
  - Consent Mode v2 à `denied` par défaut (doctrine CNIL). Le bandeau existant (`components/cookie-consent.tsx`) met à jour le consentement.
- **BreadcrumbList unique par page** : `components/seo/breadcrumb-jsonld.tsx` et `lib/breadcrumbs.ts`, le dernier maillon libellé par le titre et sans `item`.
- **Réaccentuation** des SEO et JSON-LD par défaut (`lib/cms/db.ts`). Nouvelle description de la home : « MentivisOS mesure les écarts de compétences, génère des parcours personnalisés et pilote la montée en compétences de vos équipes. »
- **VideoObject de la home** localisé, avec des URL construites depuis `SITE_URL`.
- **Pages en `noindex`** : TalentOS, `/composants`, `/summer`, `/beta-questionnaire`, les pages coquilles, et les articles vides ou sans traduction.
- **`getSeo()`** retombe sur les valeurs par défaut si la base est absente (build statique hors serveur).

### 2. robots, sitemap, llms.txt

- **`app/robots.ts`**
  - Allow `/` ; Disallow `/api/` et `/{fr,en}/content-management/`.
  - Robots IA à jour : GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot.
- **`app/sitemap.ts`**
  - Pages indexables uniquement.
  - x-default partout ; hreflang EN seulement si la version anglaise existe.
  - `lastModified` stable : constante `PAGES_UPDATED` pour les pages statiques, `updatedAt` pour les articles.
  - Ajouts : piliers, nouveaux articles, `developpers`, `modules/*`.
- **`app/llms.txt/route.ts`**
  - Généré à partir des données : produits, 4 piliers avec leurs clusters, liens FR/EN.
  - Aucune donnée d'exploitation. Remplace `public/llms.txt`.

### 3. Référentiel : piliers, articles, maillage (FR et EN)

- **Contenus**
  - 13 nouvelles entrées : les 4 piliers, les 6 articles fournis, et 3 articles rédigés.
  - Articles rédigés : `le-lms-ne-suffit-plus-ce-quun-systeme-de-formation-ia-fait-de-plus`, `lms-lxp-adaptive-learning-moteur-de-formation-ia-comment-les-distinguer` (avec tableau comparatif), `comment-lia-adapte-lapprentissage-a-chaque-individu`.
  - Sources éditables : `content/referentiel/2026-09/{fr,en}/*.md`. Le fichier `lib/cms/referentiel-2026-09.ts` est généré par `npm run referentiel:import`.
- **Nettoyage des sources**
  - Suppression du H2 répété et du chapô dupliqué en tête de corps.
  - Section « Les articles de ce pilier » générée automatiquement.
  - Slug obsolète `comment-lia-personnalise-un-parcours-de-formation` corrigé.
  - « Checklist AI Act (slug à confirmer) » reliée à `ai-act-article-4-ce-que-votre-entreprise-doit-avoir-mis-en-place-en-matiere-de-f`.
- **Maillage** (`lib/cms/referentiel-clusters.ts`)
  - Chaque article non vide est rattaché à un pilier (test automatique).
  - Chaque article affiche « Pilier : … », « À lire aussi » et « Produits concernés ».
  - Paires anti-cannibalisation interliées : checklist AI Act et preuve article 4, adaptatif définition et critique, « Mon LMS ne sert à rien » et « Le LMS ne suffit plus », deux guides financement.
  - Liens vers MentivisOS Entreprise, Education et Open ajoutés dans les nouveaux articles.
- **Gabarit article** (`app/[lang]/referentiel/[slug]/page.tsx`)
  - Même design qu'avant : tokens, Inter, alignement à gauche.
  - FAQ extraite du markdown (`lib/referentiel-content.ts`), affichée en accordéon et émise en FAQPage. Cela vaut aussi pour les 42 articles historiques, dont le champ `faq` était vide.
  - Corps rendu à partir de h2.
  - Liens internes localisés avec slash final.
  - Tableaux stylés et défilants sur mobile.
  - Tiret cadratin retiré de l'étiquette de bloc.
- **JSON-LD Article**
  - `author` Person « Steven Delcourt » avec `worksFor` l'Organization.
  - `isPartOf` le pilier ; `hasPart` sur les piliers.
  - `about`, `articleSection`, `speakable` (h1 et chapô), `inLanguage`.
- **Index** (`app/[lang]/referentiel/page.tsx`)
  - Section « Les 4 piliers » en tête.
  - Filtres bloc et public passés côté navigateur : même URL canonique, compatible statique.
  - Ancien lien `?article=` redirigé.
  - Articles vides exclus.
- **Traduction EN**
  - Les 13 nouveaux contenus sont traduits.
  - Les 38 articles historiques non vides sont retraduits intégralement (`content/referentiel/en-retranslation/*.md`, générés dans `lib/cms/referentiel-en-overrides.ts`). Ces versions remplacent les versions condensées.
  - Les tirets cadratins sont retirés des contenus publiés (test automatique).

### 4. Traductions EN de l'interface et corrections

- **Nouvelles clés `ui.*`** dans `locales/fr.json` et `en.json` :
  - consentement RGPD du formulaire ;
  - sous-titre et bouton mobiles de `page-hero` ;
  - titres des cartes produit ;
  - accroche de la section articles.
- **Page article de blog**
  - Libellés FR/EN.
  - JSON-LD Article et fil d'Ariane rendus côté serveur (ils ne dépendent plus de `window.location`).
  - hreflang EN seulement si `content_en` existe.
- **Métadonnées EN** ajoutées pour blog, modules, composants et summer.
- **Liens CTA** `/demo` et `/contact` localisés (`localizeHref` dans `lib/i18n.ts`), ce qui supprime une redirection par clic.
- **Nommage** « MentivisOS » soudé dans les eyebrows (« MENTIVISOS ENTREPRISE », « MENTIVISOS OPEN »).
- **`stripMarkdown`** : les images sont retirées avant les liens (le test en échec passe).

### 5. Export statique `out/` pour FTP (remplacé au lot 2 : plus de proxy.php ni de serveur Node)

Commande : `npm run build:static` (script `scripts/build-static-export.mjs`).

- **Fonctionnement**
  - Le script écarte temporairement ce qui exige Node (`app/api`, le CMS, `proxy.ts`), lance `next build` avec `STATIC_EXPORT=1` (`output: "export"`, images non optimisées), puis restaure les fichiers dans tous les cas.
  - Il écrit ensuite :
    - `out/.htaccess` : www vers apex, HTTPS (compatible Cloudflare via `X-Forwarded-Proto`), `/` et chemins sans langue vers `/fr/`, ancien slug, slash final, pages coquilles blog et offres, 404, en-têtes de sécurité, `X-Robots-Tag: noindex` hors hôte canonique, cache ;
    - `out/proxy.php` : relais `/api/*` vers `API_ORIGIN`, avec TLS vérifié, paramètres de requête et corps transmis, en-têtes utiles, limite de 12 Mo ;
    - `out/index.html` : repli sans mod_rewrite.
- **Variables d'environnement**
  - `SITE_URL` : par défaut `https://mentivisos.com`.
  - `API_ORIGIN` : par défaut `https://sc10bovu7233.universe.wf`.
  - `DATA_DIR` : pointer vers une copie de la base pour prérendre blog et offres.
- **Blog et offres**
  - Prérendus au build depuis la base disponible.
  - Une page coquille `_` rendue côté client sert les contenus publiés après le build.
- **Contrôle** : `node scripts/check-static-export.mjs` vérifie :
  - `lang`, canonical et hreflang réciproques ;
  - validité du JSON-LD ;
  - un seul BreadcrumbList ;
  - FAQPage, Article et hiérarchie h1/h2 ;
  - URL du sitemap présentes et indexables ;
  - liens internes.
- **Résultat** : 173 pages HTML, 212 Mo (dont 138 Mo de vidéos et 39 Mo d'images).

### Upload FTP (procédure du lot 1 ; la procédure actuelle est dans `docs/MANUEL-SERVEURS.md`, section 0)

1. `npm install` puis `npm run build:static`. Optionnel : `DATA_DIR=/chemin/copie/data` pour le blog et les offres.
2. `node scripts/check-static-export.mjs` doit afficher « Aucune erreur ».
3. Déposer **tout** le contenu de `out/`, y compris `.htaccess` (fichier caché), à la racine du site. L'hébergeur doit avoir PHP avec curl (pour `proxy.php`), `mod_rewrite` et `mod_headers`.
4. Sur le serveur Node visé par `API_ORIGIN`, l'hôte statique doit figurer dans `ALLOWED_ORIGINS` si ce n'est pas `mentivisos.com` (candidatures).
5. Search Console : soumettre `https://mentivisos.com/sitemap.xml`, puis inspecter quelques URL (home FR et EN, un pilier, un article EN).

## Vérifications effectuées

- `npm run typecheck` : OK.
- `npm test` : 52 tests passent, dont 20 nouveaux (`lib/referentiel-content.test.ts`, `lib/seo/page-metadata.test.ts`, `lib/cms/referentiel-clusters.test.ts`). 3 échecs de `lib/rate-limit.test.ts`, antérieurs et sans lien avec ces changements.
- `npx eslint` : 282 problèmes contre 286 avant ; aucun nouveau problème dans les fichiers ajoutés.
- `npm run build` (SSR) : OK. `next start` testé :
  - `/` renvoie 308 vers `/fr/` ;
  - pages FR et EN, `/api/health/`, sitemap, robots, llms.txt : 200 ;
  - ancien slug : 308.
- `npm run build:static` : OK. `check-static-export.mjs` : 166 pages, 148 URL de sitemap, aucune erreur.
- Apache 2.4 local sur `out/` avec le `.htaccess` généré :
  - redirections www et HTTPS, `/` vers `/fr/`, `/about/` vers `/fr/about/`, ancien slug : toutes en 301 ;
  - 404 sur les pages inexistantes, page coquille blog en 200 ;
  - `noindex` sur un hôte non canonique.
- `proxy.php` testé avec PHP 8.4 contre le serveur Node local :
  - GET avec `?lang=en`, PUT JSON, statut 400 relayé ;
  - chemin avec `..` refusé.
- Captures Playwright (desktop et mobile) du SSR, du dev et de l'export statique : design identique, aucune erreur JavaScript ni ressource en 4xx.

## Points ouverts, à valider par Steven

1. **Auteur** : `jobTitle` de Steven Delcourt non renseigné (non fourni). À ajouter dans `lib/referentiel-labels.ts` (`ARTICLE_AUTHOR`) puis dans le JSON-LD.
2. **Consent Mode à `denied` par défaut** : conforme à la doctrine CNIL, mais les volumes GA4 et Ads baisseront pour les visiteurs qui ne consentent pas. À valider juridiquement et côté marketing.
3. **AI Act** : le document de cadrage mentionne une réécriture du texte le 27 juillet 2026. Cette date n'a pas pu être vérifiée. Les nouveaux articles reprennent la formulation fournie (« précisé en 2026 »). L'article checklist existant n'a pas été réécrit.
4. **Valeurs SEO de l'ancien CMS** : après `npm run content:export`, vérifier dans `content/seo.json` que titres, descriptions et adresse sont accentués (« 60 rue François 1er »). Même remarque pour les textes de hero dans `content/pages.json`.
5. **4 fiches produit vides du Référentiel** (ids 14 à 17, bloc P) : actuellement `noindex` et masquées. À rédiger ou à dépublier.
6. **Fichiers publics orphelins, indexables et copiés dans `out/`** : `airport.html`, `envie.html`, `maintenance.html`, `referentiel-mentivisos-2026.md`. Je recommande de les supprimer ; je ne l'ai pas fait sans accord. (`envies.txt` est utilisé par `components/envies-split-flap.tsx`, à garder.)
7. **Sécurité** : `docs/infrastructure.md` contient une passphrase SSH en clair dans un fichier versionné (déjà signalé par `docs/MANUEL-SERVEURS.md`). Rotation recommandée.
8. **Relecture des traductions EN** : choix signalés par les traducteurs :
   - « maîtrise » rendu par « proficiency » ;
   - GPEC glosé ;
   - sigles CACES, SST, FIMO, FCO, CNAPS explicités entre parenthèses ;
   - « RGPD » conservé dans un titre EN, le corps disant « GDPR ».
   Les 3 nouveaux articles rédigés sont à relire avant publication.
9. **Traductions non faites** : page `summer` (contenu FR uniquement, `noindex`, offre qui se termine le 30 septembre 2026) et module interactif de `/composants` (`noindex`).
10. **Images OG des piliers** : image par défaut. Pour des images dédiées, ajouter des entrées dans `lib/seo/og-manifest.json` puis lancer `npm run og` sur macOS (le script utilise `sips`).
11. **CMS** : supprimé au lot 2. Le contenu se modifie dans `content/` puis `npm run build`.
12. **Tarifs** : `recommendedPlan` dans `components/tarifs-client.tsx` compare des noms de plans qui n'existent pas (« Essentiel », « Équipe »). Code mort, non modifié.

## Fichiers principaux

- **SEO** : `lib/seo/page-metadata.ts`, `components/seo/*`, `lib/breadcrumbs.ts`, `app/[lang]/layout.tsx`, `app/global-not-found.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts`.
- **Référentiel** : `content/referentiel/**`, `lib/cms/referentiel-2026-09.ts`, `lib/cms/referentiel-en-overrides.ts`, `lib/cms/referentiel-clusters.ts`, `lib/referentiel-content.ts`, `lib/referentiel-labels.ts`, `app/[lang]/referentiel/**`, `scripts/import-referentiel-2026-09.mjs`.
- **Export statique** : `next.config.ts`, `scripts/build-static-export.mjs`, `scripts/static-export/{htaccess,proxy.php}`, `scripts/check-static-export.mjs`.
