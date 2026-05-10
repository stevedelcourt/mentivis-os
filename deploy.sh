#!/bin/bash
set -e

# ── Configuration ──
SSH_KEY="${DEPLOY_SSH_KEY:-/Users/stv/Documents/zed/OS_sc4/id_rsa_sc4}"
SSH_HOST="${DEPLOY_SSH_HOST:-terre.o2switch.net}"
SSH_USER="${DEPLOY_SSH_USER:-sc4bovu7233}"
APP_DIR="/home/${SSH_USER}/nextapp"
NODE_BIN="/opt/alt/alt-nodejs20/root/usr/bin"

# ── Secrets (must be set in local environment) ──
: "${INTERNAL_TOKEN:?Environment variable INTERNAL_TOKEN is required}"
: "${CMS_AUTH_SECRET:?Environment variable CMS_AUTH_SECRET is required}"
: "${HUBSPOT_PORTAL_ID:?Environment variable HUBSPOT_PORTAL_ID is required}"
: "${HUBSPOT_FORM_ID:?Environment variable HUBSPOT_FORM_ID is required}"
: "${ALLOWED_ORIGINS:?Environment variable ALLOWED_ORIGINS is required}"

chmod 600 "$SSH_KEY"

echo "=== Pushing to GitHub ==="
git push

echo "=== Deploying to o2switch ==="
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${SSH_USER}@${SSH_HOST}" << EOF
  set -e

  export PATH="${NODE_BIN}:\$PATH"

  echo "--- Node version ---"
  node --version

  echo "--- Ensuring persistent data directory ---"
  mkdir -p /home/sc4bovu7233/data/uploads

  echo "--- Writing .env.local ---"
  cat > ${APP_DIR}/.env.local << ENVEOF
INTERNAL_TOKEN=${INTERNAL_TOKEN}
CMS_AUTH_SECRET=${CMS_AUTH_SECRET}
HUBSPOT_PORTAL_ID=${HUBSPOT_PORTAL_ID}
HUBSPOT_FORM_ID=${HUBSPOT_FORM_ID}
ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
ENVEOF
  echo "Written .env.local"

  if [ ! -d "${APP_DIR}/.git" ]; then
    echo "--- Cloning repo ---"
    mkdir -p ${APP_DIR}
    git clone https://github.com/stevedelcourt/mentivis-os.git ${APP_DIR}
  fi

  cd ${APP_DIR}
  git fetch origin main
  git reset --hard origin/main

  echo "--- Installing dependencies ---"
  npm install

  echo "--- Building Next.js ---"
  npx next build --webpack

  echo "--- Copying static assets to standalone ---"
  if [ -d ".next/standalone" ]; then
    mkdir -p .next/standalone/public
    cp -r public/* .next/standalone/public/
    mkdir -p .next/standalone/.next/static
    cp -r .next/static/* .next/standalone/.next/static/
    cp .env.local .next/standalone/.env.local
    echo "Copied .env.local to standalone"
  fi

  echo "--- Restarting Passenger ---"
  mkdir -p tmp
  touch tmp/restart.txt

  echo "--- Done ---"
EOF

echo "=== Deploy complete ==="
