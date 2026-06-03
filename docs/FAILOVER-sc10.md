# MentivisOS.com

## Procédure de basculement sc10 → Mirror

Quand le serveur principal (Passenger) ne répond plus, basculer le domaine
principal vers le miroir statique.

---

## Prérequis

- Serveur : `sc10bovu7233.universe.wf`
- Clé SSH : `/Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10` (pas de passphrase)
- Mirror : `https://mirror.sc10bovu7233.universe.wf`

## 1. Vérifier que le site principal est down

```bash
curl -sfk https://sc10bovu7233.universe.wf/api/health/
```

Si pas de réponse ou 500, le site principal est down.

---

## 2. Basculer le domaine principal vers le mirror

On remplace le `.htaccess` de `public_html` par une redirection
vers le mirror :

```bash
ssh -i /Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10 \
  sc10bovu7233@terre.o2switch.net \
  "cat > /home/sc10bovu7233/public_html/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteRule ^(.*)$ https://mirror.sc10bovu7233.universe.wf/\$1 [L,R=302]
EOF"
```

Le site principal redirige désormais vers le mirror.

---

## 3. Revenir au site principal quand Passenger est rétabli

```bash
ssh -i /Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10 \
  sc10bovu7233@terre.o2switch.net \
  "rm /home/sc10bovu7233/public_html/.htaccess && \
   touch /home/sc10bovu7233/nextapp/tmp/restart.txt"
```

Le `.htaccess` sera regénéré automatiquement par cPanel au prochain
redémarrage de l'app Node.js.

Si besoin de le recréer manuellement :

```bash
ssh -i /Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10 \
  sc10bovu7233@terre.o2switch.net \
  "cat > /home/sc10bovu7233/public_html/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot \"/home/sc10bovu7233/nextapp\"
PassengerBaseURI \"/\"
PassengerNodejs \"/home/sc10bovu7233/nodevenv/nextapp/20/bin/node\"
PassengerAppType node
PassengerStartupFile server.js
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
EOF"
```

---

## 4. Mettre à jour le mirror (après changement de contenu CMS)

```bash
cd /Users/stv/Documents/zed/DeployOS-sc10/mentivis-os

# S'assurer d'avoir le dernier code
git pull

# Construire le mirror
SOURCE_URL=https://sc10bovu7233.universe.wf \
API_PROXY=https://sc10bovu7233.universe.wf \
SITE_URL=https://mirror.sc10bovu7233.universe.wf \
bash scripts/build-static.sh

# Uploader vers le mirror
rsync -avz --delete -e "ssh -i /Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10" \
  out/ sc10bovu7233@terre.o2switch.net:/home/sc10bovu7233/public_html/mirror/
```

---

## Infos serveur

| Information | Valeur |
|---|---|
| SSH Host | `terre.o2switch.net` |
| SSH User | `sc10bovu7233` |
| SSH Key | `/Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10` |
| App Root | `/home/sc10bovu7233/nextapp` |
| Mirror Root | `/home/sc10bovu7233/public_html/mirror` |
| Site Principal | `https://sc10bovu7233.universe.wf` |
| Mirror | `https://mirror.sc10bovu7233.universe.wf` |
| Node.js | v20.20.2 |
