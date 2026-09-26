# Manuel serveurs MentivisOS — SC4, sc10, o2switch

Document opérationnel : comment le système fonctionne sur les deux serveurs,
comment o2switch est réglé, et comment tout transférer sur un autre serveur.
En français. Complète `docs/infrastructure.md` (référence technique en anglais).

État de référence à la rédaction : SC4 et sc10 servent le même code (`main`),
buildés chacun avec leur préfixe d'assets. Ne jamais synchroniser la base
dans le sens sc10 → sc4 sans consigne explicite.

---

## 0. Depuis le 26 septembre 2026 : site 100 % statique

Le site n'utilise plus Node, Passenger, le CMS ni la base SQLite. Les sections 1 à 9
décrivent l'ancienne architecture ; elles restent utiles pour la bascule et l'historique.

**Construire** (sur le Mac) :

```bash
npm install
npm run build        # produit out/ et vérifie le SEO ; échoue au moindre problème
```

**Déployer** sur un serveur o2switch (sc4 d'abord, sc10 ensuite) :

1. Sauvegarder `public_html/` et `~/data/`. `~/data/` contient la base, les
   soumissions et les CV : données personnelles, à garder hors ligne puis à supprimer
   selon la politique RGPD.
2. cPanel, « Setup Node.js App » : arrêter puis supprimer l'application du domaine.
   Passenger s'arrête ; rien d'autre à couper à la main.
3. Vider `public_html/` en gardant `.well-known/`, puis y déposer **tout** le contenu
   de `out/`, fichiers cachés compris (`.htaccess`, `forms/.htaccess`, `forms/.user.ini`).
4. Sur le Mac, `npm run config` : génère `mentivis-config.php` à la racine du dépôt à partir
   de `docs/env.hubspot.md` (sinon `.env.deploy`, ou un chemin passé après `--`). Les deux
   fichiers sont ignorés par git. Déposer `mentivis-config.php` par FTP dans le dossier qui
   contient `public_html` (`~/mentivis-config.php`), jamais dedans.
5. Tester : `/`, `/fr/`, `/en/`, une page pilier, un envoi de démo (contact visible dans
   HubSpot), une candidature avec CV en PDF.

**Mettre à jour le contenu** : modifier les fichiers de `content/` (ou `locales/`),
`npm run build`, redéposer `out/`.

**Anciennes URL** : `/api/*` répond 410, `/fr/content-management/` n'existe plus.

---

## 1. Vue d'ensemble et rôles

| Élément | SC4 | sc10 |
|---|---|---|
| Hébergeur | o2switch (mutualisé) | o2switch (mutualisé) |
| Serveur SSH | `terre.o2switch.net` | `terre.o2switch.net` |
| Utilisateur SSH | `sc4bovu7233` | `sc10bovu7233` |
| Clé SSH locale | `OS_sc4/id_rsa_sc4` (chiffrée, passphrase requise) | `DeployOS-sc10/id_rsa_sc10` (sans passphrase) |
| URL directe | `https://sc4bovu7233.universe.wf` | `https://sc10bovu7233.universe.wf` |
| Rôle | Travail, CMS, prévisualisation des branches | Production publique + héberge le miroir statique |
| `ASSET_PREFIX` au build | `/statics` | `/s` |
| Dossier assets servis par Apache | `~/nextapp/statics/` | `~/nextapp/s/` |
| `DATA_DIR` | `/home/sc4bovu7233/data` | `/home/sc10bovu7233/data` |
| Base SQLite | `/home/sc4bovu7233/data/mentivis.db` (référence CMS) | `/home/sc10bovu7233/data/mentivis.db` (reçoit la synchro) |

Trafic public :
- `https://mentivisos.com` passe par Cloudflare et son origine est **sc10**
  (constaté : quand sc10 est en panne, `mentivisos.com` répond 504 alors que
  SC4 répond 200 ; après rebuild sc10, `mentivisos.com` repart).
- Un `git push` sur `main` déclenche aussi un déploiement Vercel automatique,
  mais le domaine Vercel du projet ne sert pas le site public. Vercel n'est
  donc pas sur le chemin critique du trafic.
- Miroir statique de secours : `https://mirror.sc10bovu7233.universe.wf`
  (voir section 5).

Règle d'or : SC4 montre ce qu'on teste, sc10 montre ce qui est en production.
Les deux doivent servir le même commit `main` sauf pendant une prévisualisation
explicite sur SC4 (branche dédiée, jamais mergée par accident vers `main`).

---

## 2. L'application telle qu'elle tourne

- **Stack** : Next.js 16.2.6, build **Webpack uniquement**
  (`next build --webpack`, jamais Turbopack), React 19, TypeScript.
- **Entrée Passenger** : `server.js` à la racine du dépôt. Il force
  `PORT=3001`, `HOSTNAME=0.0.0.0`, `NODE_ENV=production`.
- **Base de données** : SQLite via `sql.js` (100 % JS/WASM, aucun module natif,
  car o2switch n'a ni gcc ni la glibc requise par `better-sqlite3`).
  Le fichier `mentivis.db` vit **hors du dépôt** dans `DATA_DIR`.
  Chaque écriture réexporte tout le fichier sur disque.
  Contenu : articles, pages CMS, SEO, candidatures, soumissions, utilisateurs,
  uploads (dossier `data/uploads/`).
- **Variables d'environnement** (écrites dans `~/nextapp/.env.local` par les
  scripts de déploiement, jamais commitées) :
  `INTERNAL_TOKEN`, `CMS_AUTH_SECRET`, `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_ID`,
  `HUBSPOT_ACCESS_TOKEN`, `ALLOWED_ORIGINS`, `SITE_URL`,
  `NEXT_PUBLIC_SITE_URL`, `DATA_DIR`, `PORT`, `ASSET_PREFIX`.
  Modèle à copier : `.env.deploy.example`. Valeurs réelles : `.env.deploy`
  local (gitignoré, ne jamais committer).
- **Formulaires** : toutes les soumissions navigateur partent en `PUT`
  (jamais `POST`, qui serait redirigé 307 par Cloudflare vers l'origine brute).
  Seules exceptions : les appels serveur vers serveur (Node vers HubSpot).
- **Images OG** : générées en JPG 1200x630 dans `public/images/og/` par
  `npm run og` (déclenché automatiquement à chaque build via `prebuild`),
  d'après `lib/seo/og-manifest.json`. Jamais d'AVIF dans les balises `og:image`.
- **Santé** : `GET /api/health/` doit répondre 200. C'est le juge de paix de
  chaque déploiement.

---

## 3. Configuration o2switch (réglages en place)

### 3.1 Passenger (CloudLinux)

`~/public_html/.htaccess` (ne pas toucher le bloc Passenger) :

```apache
PassengerAppRoot "/home/<user>/nextapp"
PassengerBaseURI "/"
PassengerNodejs "/home/<user>/nodevenv/nextapp/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
```

Notes :
- Le Node de **build** est `/opt/alt/alt-nodejs20/root/usr/bin` (v20.20.2),
  mis en tête de `PATH` dans les scripts. Le Node d'**exécution** Passenger
  est celui du `nodevenv`. Les deux sont en v20.
- Redémarrage applicatif : `touch ~/nextapp/tmp/restart.txt`.
  Le redémarrage est progressif : d'anciens workers peuvent servir l'ancien
  build quelques dizaines de secondes. Attendre ~60 s avant de conclure.
- Build plafonné à 2 CPU (`experimental.cpus: 2` dans `next.config.ts`)
  pour éviter le OOM sur l'hébergement mutualisé.

### 3.2 Tiger-Protect et les préfixes d'assets

Le pare-feu applicatif o2switch (Tiger-Protect) bloque les URL en
`/_next/static/`. Contournement en place, à conserver tel quel :
- `next.config.ts` : `assetPrefix = ASSET_PREFIX` (`/statics` sur SC4,
  `/s` sur sc10, rien sur Vercel grâce au garde `process.env.VERCEL`).
- Après le build, copie de `.next/static` vers `statics/_next/static/`
  (SC4) ou `s/_next/static/` (sc10), servis directement par Apache.
- Trois familles de chunks bloquées par leur contenu reçoivent `void 0;`
  en première ligne (`8058-*.js`, `polyfills-*.js`, `page-*.js`).
- Les deux serveurs doivent impérativement être buildés **avec leur propre
  préfixe**. Un build `/s` servi comme `/statics` (ou l'inverse) donne une
  page sans CSS ni JS. En cas de doute : `rm -rf .next statics s`,
  rebuild avec le bon préfixe, `restart.txt`, attendre, vérifier chaque asset.

### 3.3 Fichiers `.htaccess`

- `~/public_html/.htaccess` : redirection HTTP vers HTTPS, règle de bypass
  `_next/static/` direct depuis `public_html`, bloc Passenger, ErrorDocument
  502/503 vers `/maintenance.html`.
- `~/nextapp/.htaccess` : HTTPS forcé, masquage version serveur, protection
  des fichiers sensibles (`.env`, `.git/`, `node_modules/`, `data/`),
  en-têtes de sécurité, cache long des assets (`Expires`), compression.
- Les en-têtes de sécurité applicatifs sont aussi posés par `next.config.ts`
  (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS,
  `Permissions-Policy`).

### 3.4 Données et sauvegardes

- Chaque déploiement (`deploy.sh`, `deploy-sc10.sh`) sauvegarde
  `mentivis.db` vers `mentivis.db.backup.AAAAMMJJ_HHMMSS` avant de toucher
  au code. Seules les 10 dernières sauvegardes sont gardées.
- Restauration base :
  `cp ~/data/mentivis.db.backup.AAAAMMJJ_HHMMSS ~/data/mentivis.db`
  puis `touch ~/nextapp/tmp/restart.txt`.
- Restauration code : `git reset --hard <commit|tag>` + rebuild + restart.

### 3.5 SSH et accès

- Hôte unique `terre.o2switch.net`, port 22, un utilisateur par serveur.
- Clé SC4 chiffrée : la passphrase est fournie via l'environnement
  (`INTERNAL_TOKEN` dans `.env.deploy`), jamais en dur dans une commande.
  Clé sc10 sans passphrase.
- `StrictHostKeyChecking=no` est utilisé par les scripts (pratique existante).
- Le port 22 est souvent filtré côté client (partages mobiles, certains FAI)
  et le serveur bannit après des échecs répétés (`fail2ban`).
  En cas de `Operation timed out` persistant : passer par le **Terminal cPanel**
  (qui fonctionne en 443), ou déclarer son IP dans l'outil cPanel
  **Exception pare-feu → Autorisation SSH** (liste blanche port 22, 5 exceptions
  max). Ne jamais saisir son IP dans le **Bloqueur d'adresses IP** (cela
  bloque l'accès web au lieu de le réparer).
- Ne pas lancer de tentatives SSH en boucle pendant un ban : chaque essai
  peut le prolonger.

---

## 4. Workflows opérationnels

### Déploiement standard (production)

```bash
cd /Users/stv/Documents/zed/OS_sc4/mentivis-os
set -a && source .env.deploy && set +a
./deploy.sh        # SC4 (fait aussi le git push)
./deploy-sc10.sh   # sc10 (ne pousse pas, suppose main déjà poussé)
```

Séquence de chaque script : push (SC4), backup base, écriture `.env.local`,
`git fetch` + `reset --hard origin/main`, `npm install` seulement si
`package-lock.json` a changé, build propre avec le bon `ASSET_PREFIX`,
copie des statics + correctif `void 0;`, `restart.txt`, boucle de health check.

### Prévisualisation sur SC4 (sans toucher la prod)

Travailler sur une branche dédiée (ex. `seo/xxx`), la pousser, puis sur SC4 :
`git fetch origin <branche> && git checkout -B <branche> origin/<branche>`
+ rebuild avec `/statics` + restart. `main`, sc10 et Vercel restent intacts.
Tag de sauvegarde recommandé avant toute expérimentation.

### Synchronisation du contenu sc4 → sc10

`scripts/sync-sc4-to-sc10.sh` : copie `mentivis.db` + `uploads/` de SC4 vers
sc10 (en préservant les tarifs sc10), restart Passenger sc10, rebuild et
upload du miroir. Sens unique : jamais de sc10 vers SC4 sans consigne.

### Vérifications post-déploiement (recette minimale)

```bash
curl -sk -o /dev/null -w "%{http_code}\n" https://<hote>/fr/
curl -sk "https://<hote>/api/health/"
curl -skL "https://<hote>/api/referentiel?lang=fr" | python3 -c "import json,sys;print(len(json.load(sys.stdin)['articles']))"
```

- `/fr/` doit répondre 200 vite (< 3 s).
- Tous les `src=`/`href=` de la page doivent partager le préfixe du serveur
  (`/statics/` sur SC4, `/s/` sur sc10) et répondre 200 un par un.
  Un mélange `/s/` + `/statics/` dans le même document = build redéployé
  avec le mauvais préfixe, ou workers Passenger anciens + fichiers nouveaux :
  refaire un rebuild propre + `restart.txt` + attendre 60 s.
- `sitemap.xml` doit lister les 84 URL du référentiel (42 FR + 42 EN).
- Tester une soumission de formulaire (PUT vers `/api/demo`) et une connexion
  CMS.

---

## 5. Miroir statique de secours

- Construit par `scripts/build-static.sh` : aspire ~41 pages depuis sc10,
  génère `out/` (HTML + `proxy.php` qui relaie `/api/*` vers le serveur live,
  `.htaccess` avec trailing slash), puis `rsync` vers
  `~/public_html/mirror/` sur sc10.
- URL : `https://mirror.sc10bovu7233.universe.wf`.
- Bascule en cas de panne Passenger : réécrire le `.htaccess` de
  `public_html` pour rediriger vers le miroir (voir `docs/FAILOVER-sc10.md`),
  puis restaurer après réparation.

---

## 6. Transfert vers un autre serveur — mode d'emploi détaillé

Paragraphe de synthèse : pour déménager l'application, il faut reproduire
ailleurs ce triptyque : le code (via git), les données (fichier SQLite +
uploads, hors dépôt), et l'environnement (Node 20, variables, préfixe
d'assets adapté au nouvel hébergeur). Tout le reste — build, health check,
DNS — découle de ces trois blocs. La liste détaillée ci-dessous donne l'ordre
exact, avec les points de vigilance tirés de l'exploitation réelle.

### 6.1 Préparation (côté actuel, avant de toucher au nouveau serveur)

1. Figer une version saine : `git status` propre sur `main`, noter le hash
   du commit déployé (`git log --oneline -1` sur chaque serveur, doit être
   identique).
2. Sauvegarder les données : copier `/home/<user>/data/mentivis.db` et
   `/home/<user>/data/uploads/` vers un stockage sûr, avec la date dans le
   nom. Garder aussi la liste des 10 dernières sauvegardes automatiques.
3. Exporter la configuration : contenu de `~/nextapp/.env.local` (sans le
   diffuser), contenu des deux `.htaccess` (`public_html` et `nextapp`),
   version exacte de Node (`node --version`), capture des variables DNS
   actuelles (enregistrements A/CNAME, proxys type Cloudflare) et de leur TTL.
4. Baisser le TTL DNS à 300 s au moins 48 h avant la bascule, pour pouvoir
   revenir vite en arrière.
5. Lister les intégrations externes à rebrancher : HubSpot (portal + formulaires
   + token), Google Tag Manager, Search Console, sauvegardes éventuelles.

### 6.2 Prérequis du nouveau serveur

6. Choisir le mode d'exécution :
   - ** Mutualisé type o2switch ** : refaire la même architecture (Passenger +
     Apache + `.htaccess`). Aller directement à 6.3.
   - ** VPS/dédié ** : Node 20.x LTS, un gestionnaire de processus
     (`systemd` ou PM2), un reverse proxy (nginx ou Caddy) avec HTTPS
     (Let's Encrypt), `git`, `curl`, `rsync`, `python3` (scripts d'exploitation).
     Pas besoin de gcc : aucune dépendance native (`sql.js` et `bcryptjs`
     sont 100 % JS).
7. Exigences minimales constatées : 2 CPU, 2 Go RAM libres pendant le build,
   2 Go de disque pour `node_modules` + `.next` + `data` (+ vidéos ~200 Mo
   si le miroir est reconstruit). Port 3001 libre en local (modifiable dans
   `server.js` + variable `PORT`).
8. Accès : SSH avec clé (port 22 joignable depuis le poste d'exploitation ;
   sinon prévoir l'équivalent du Terminal web de l'hébergeur), et un moyen
   de redémarrer l'application (équivalent de `tmp/restart.txt` si Passenger,
   `systemctl restart` ou `pm2 restart` sinon).

### 6.3 Installation de l'application

9. Cloner le dépôt (branche `main`, tag de release si existant) dans le
   dossier applicatif (ex. `/home/<user>/nextapp` ou `/opt/mentivis-os`).
10. Installer les dépendances : `npm ci` de préférence (reproductible via
    `package-lock.json`). Ne pas installer `better-sqlite3` ni `sharp` :
    incompatibles avec les libc anciennes et inutiles ici.
11. Recréer `.env.local` d'après `.env.deploy.example`, avec les valeurs du
    nouvel environnement. Correspondances obligatoires :
    | Variable | Ancienne valeur (o2switch) | Nouvelle valeur |
    |---|---|---|
    | `DATA_DIR` | `/home/<user>/data` | chemin persistant **hors dépôt** sur le nouveau serveur |
    | `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | `https://mentivisos.com` | domaine définitif (ou temporaire pendant les tests) |
    | `ALLOWED_ORIGINS` | liste o2switch + vercel + localhost | remplacer les `*.universe.wf` par le nouveau domaine |
    | `ASSET_PREFIX` | `/statics` (SC4) / `/s` (sc10) | voir point 12 |
    | `PORT` | `3001` | port local choisi |
    | secrets (`INTERNAL_TOKEN`, `CMS_AUTH_SECRET`, HubSpot) | à régénérer, voir 6.6 | nouvelles valeurs |
12. Décider du préfixe d'assets : **uniquement si l'hébergeur filtre les URL
    en `/_next/`** (cas Tiger-Protect d'o2switch). Sinon, ne définir aucun
    `ASSET_PREFIX` (ni en variable ni au build) et servir `/_next/` en
    standard. Si filtrage il y a : choisir un préfixe (ex. `/statics`),
    builder avec `ASSET_PREFIX=/statics`, copier `.next/static` vers
    `<prefix>/_next/static` servi directement par le frontal, et vérifier
    chaque asset en 200. Règle absolue : le préfixe du build, celui de
    `.env.local` et celui des URL servies doivent être identiques, sinon
    page sans CSS ni JS.
13. Restaurer les données : copier `mentivis.db` et `uploads/` dans le nouveau
    `DATA_DIR` **avant** le premier démarrage (l'application auto-initialise
    sinon une base vide). Permissions lecture/écriture pour l'utilisateur
    applicatif.
14. Builder en production : `rm -rf .next && ASSET_PREFIX=<prefix>`
    `npx next build --webpack` (Webpack obligatoire, jamais Turbopack).
    Sur petit serveur, garder `experimental.cpus: 2`.
15. Démarrer via le gestionnaire choisi et tester en local d'abord
    (`curl http://127.0.0.1:3001/api/health/` doit répondre 200),
    **avant** d'exposer le port au frontal.

### 6.4 Frontal web et domaine

16. Reproduire l'équivalent des `.htaccess` : redirection HTTP vers HTTPS,
    en-têtes de sécurité (`next.config.ts` les pose déjà au niveau applicatif,
    vérifier qu'aucun frontal ne les supprime), protection des chemins
    sensibles (`.env`, `.git/`, `node_modules/`, `data/`), pas de proxy
    indexé inutilement.
17. Brancher le domaine de test (sous-domaine temporaire), vérifier le
    certificat TLS de bout en bout, puis seulement basculer le DNS du domaine
    définitif (TTL bas grâce à l'étape 4).
18. Mettre à jour `SITE_URL`/`NEXT_PUBLIC_SITE_URL` avec le domaine définitif,
    rebuild + restart (ces valeurs sont figées dans le HTML : canonical,
    `og:image`, JSON-LD, sitemap).
19. Re-soumettre `sitemap.xml` dans la Search Console et vérifier `robots.txt`,
    `llms.txt`, les canoniques et le `hreflang`.

### 6.5 Recette de migration (ne rien basculer avant que tout soit vert)

20. Pages : `/`, `/fr/`, une page produit, `/fr/referentiel/` (doit afficher
    42 articles), un article, un article de blog, `/fr/contact`, sitemap (84
    URL référentiel : 42 FR + 42 EN).
21. Assets : chaque `src=`/`href=` du HTML doit partager le même préfixe et
    répondre 200 un par un (script de boucle `curl` de la section 4).
22. Formulaires : une soumission réelle sur chaque formulaire public (PUT
    vers `/api/demo`, candidature, beta) jusqu'à HubSpot, puis supprimer les
    soumissions de test dans le CMS.
23. CMS : connexion, lecture/écriture d'un brouillon, upload d'image.
24. Miroir (si conservé) : rebuild `build-static.sh` + `rsync`, tester
    `proxy.php` sur un appel `/api/`.
25. Charge minimale : redémarrer le processus et vérifier qu'il remonte seul
    (`restart.txt` ou équivalent), puis refaire la boucle santé.

### 6.6 Sécurité pendant le transfert (obligatoire)

26. **Régénérer tous les secrets** sur le nouveau serveur
    (`INTERNAL_TOKEN`, `CMS_AUTH_SECRET`, tokens HubSpot si exposés) : les
    anciennes valeurs ont circulé dans des scripts, des sauvegardes et
    l'historique git. Ne jamais recopier tel quel un `.env.local` d'une
    machine à l'autre sans rotation.
27. Changer les mots de passe CMS dans la base copiée avant ouverture.
28. Vérifier qu'aucun fichier sensible ne part dans git (`.env*`, `data/`,
    clés SSH) : contrôler avec `git status` et le `.gitignore` avant chaque
    commit.
29. Révoquer les anciennes clés SSH et accès devenus inutiles après
    décommission de l'ancien serveur.

### 6.7 Bascule et repli

30. Basculer le DNS (ou le proxy Cloudflare) vers le nouveau serveur en
    heures creuses, surveiller `/api/health/` et les codes HTTP pendant 1 h.
31. Garder l'ancien serveur intact **1 à 2 semaines** (code + base + dernière
    sauvegarde) comme repli instantané : un simple retour DNS suffit.
32. Après 2 semaines vertes : exporter une dernière sauvegarde, arrêter
    l'application, supprimer les secrets, résilier.
33. Mettre à jour ce manuel (tableau section 1, chemins, préfixe) et
    `docs/infrastructure.md` avec la nouvelle topologie.

---

## 7. Pannes déjà rencontrées (mémoire d'exploitation)

| Symptôme | Cause constatée | Correctif appliqué |
|---|---|---|
| Page sans CSS/JS, HTML mélangeant `/s/` et `/statics/`, quelques assets en 404 | Rebuild fait avec le mauvais préfixe, ou processus Passenger anciens + fichiers nouveaux | Rebuild propre avec le bon préfixe (`rm -rf .next statics s`), copie des statics, `restart.txt`, attendre 60 s, vérifier chaque asset |
| `mentivisos.com` en 504 `upstream_timeout` partout, y compris statics | Origine sc10 en panne après un build interrompu en cours de Terminal | Rebuild complet sc10 + restart ; la prod suit sc10 |
| `Operation timed out` sur le port 22 | Filtrage réseau client ou ban `fail2ban` après échecs | Terminal cPanel (443), ou liste blanche via **Exception pare-feu → Autorisation SSH** (jamais le Bloqueur d'IP) |
| Health check OK mais pages cassées | `restart.txt` touché trop tôt / workers non recyclés | Attendre, re-toucher, vérifier l'âge des processus et le contenu réellement servi |
| Dépendance qui casse le build mutualisé | Module natif (ex. `better-sqlite3`, `sharp`) | Rester sur du 100 % JS (`sql.js`, `sips` local + JPG commités) |

---

## 8. Ce que ce manuel ne couvre pas (volontairement)

- Les secrets eux-mêmes : ils vivent dans `.env.deploy` local (gitignoré) et
  le gestionnaire de mots de passe, jamais dans ce dépôt.
- Le contenu éditorial (articles, tarifs, SEO) : géré dans le CMS ou le code
  selon les collections, pas au niveau serveur.
- La configuration Cloudflare/DNS détaillée : à documenter côté compte
  Cloudflare au moment du transfert (étape 17).
