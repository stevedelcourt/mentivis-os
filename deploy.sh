#!/bin/bash
set -e

# ── Configuration ──
SSH_KEY="${DEPLOY_SSH_KEY:-/Users/stv/Documents/zed/OS_sc4/id_rsa_sc4}"
SSH_HOST="${DEPLOY_SSH_HOST:-terre.o2switch.net}"
SSH_USER="${DEPLOY_SSH_USER:-sc4bovu7233}"
APP_DIR="/home/${SSH_USER}/nextapp"
NODE_BIN="/opt/alt/alt-nodejs20/root/usr/bin"
LIVE_URL="https://sc4bovu7233.universe.wf"

# ── Secrets (must be set in local environment) ──
: "${INTERNAL_TOKEN:?Environment variable INTERNAL_TOKEN is required}"
: "${CMS_AUTH_SECRET:?Environment variable CMS_AUTH_SECRET is required}"
: "${HUBSPOT_PORTAL_ID:?Environment variable HUBSPOT_PORTAL_ID is required}"
: "${HUBSPOT_FORM_ID:?Environment variable HUBSPOT_FORM_ID is required}"
: "${HUBSPOT_ACCESS_TOKEN:?Environment variable HUBSPOT_ACCESS_TOKEN is required}"
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
  mkdir -p /home/${SSH_USER}/data/uploads

  echo "--- Pre-deploy database backup ---"
  BACKUP_TS=\$(date +%Y%m%d_%H%M%S)
  if [ -f /home/${SSH_USER}/data/mentivis.db ]; then
    cp /home/${SSH_USER}/data/mentivis.db /home/${SSH_USER}/data/mentivis.db.backup.\${BACKUP_TS}
    echo "Backed up mentivis.db -> mentivis.db.backup.\${BACKUP_TS}"
  fi
  # Keep only last 10 backups
  ls -t /home/${SSH_USER}/data/mentivis.db.backup.* 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true

  echo "--- Writing .env.local ---"
  cat > ${APP_DIR}/.env.local << ENVEOF
INTERNAL_TOKEN=${INTERNAL_TOKEN}
CMS_AUTH_SECRET=${CMS_AUTH_SECRET}
HUBSPOT_PORTAL_ID=${HUBSPOT_PORTAL_ID}
HUBSPOT_FORM_ID=${HUBSPOT_FORM_ID}
HUBSPOT_ACCESS_TOKEN=${HUBSPOT_ACCESS_TOKEN}
ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
SITE_URL=${SITE_URL}
PORT=3001
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

  # Check if dependencies changed
  if git diff --name-only HEAD~1 HEAD | grep -q "package-lock.json"; then
    echo "--- Installing dependencies ---"
    npm install
  else
    echo "--- Skipping npm install (no dependency changes) ---"
  fi

  echo "--- Building Next.js ---"
  # Fix any broken permissions from previous deploys (644 on dirs removes x bit)
  find .next -type d -exec chmod 755 {} \; 2>/dev/null || true
  chmod -R u+rw .next 2>/dev/null || true
  rm -rf .next
  npx next build --webpack

  echo "--- Staging new build ---"
  if [ -d ".next/standalone" ]; then
    rm -rf .next/standalone-new
    cp -a .next/standalone .next/standalone-new
    echo "Copied standalone -> standalone-new"
  else
    echo "ERROR: .next/standalone not found after build"
    exit 1
  fi

  echo "--- Atomic swap ---"
  rm -rf .next/standalone-old
  if [ -d ".next/standalone" ]; then
    mv .next/standalone .next/standalone-old
  fi
  mv .next/standalone-new .next/standalone
  echo "Swapped standalone-new -> standalone (old preserved as standalone-old)"

  echo "--- Copying static assets to standalone ---"
  mkdir -p .next/standalone/public
  cp -a public/. .next/standalone/public/
  # Copy static into standalone (atomic rsync-delete if available)
  if command -v rsync &> /dev/null; then
    rsync -a --delete .next/static/ .next/standalone/.next/static/
  else
    rm -rf .next/standalone/.next/static
    cp -a .next/static .next/standalone/.next/static
  fi
  cp .env.local .next/standalone/.env.local
  echo "Copied static assets to standalone"

  echo "--- Restarting Passenger ---"
  mkdir -p tmp
  touch tmp/restart.txt

  echo "--- Health check ---"
  HEALTH_OK=0
  for i in 1 2 3 4 5; do
    sleep 2
    if curl -sfk "${LIVE_URL}/api/health/" > /dev/null 2>&1; then
      echo "Health check passed (attempt \$i)"
      HEALTH_OK=1
      break
    fi
    echo "Health check attempt \$i failed, retrying..."
  done

  if [ "\$HEALTH_OK" -eq 1 ]; then
    echo "--- Cleaning up old build ---"
    rm -rf .next/standalone-old
    echo "Deploy successful"
  else
    echo "!!! HEALTH CHECK FAILED !!!"
    echo "Rolling back to previous build..."
    rm -rf .next/standalone
    mv .next/standalone-old .next/standalone
    touch tmp/restart.txt
    echo "Rollback complete. Investigate and retry."
    exit 1
  fi
EOF

echo "=== Deploy complete ==="

# ── Rollback Instructions ──
# If deploy fails and you need manual rollback:
# ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST}
# cd /home/sc4bovu7233/nextapp
# rm -rf .next/standalone
# mv .next/standalone-old .next/standalone
# touch tmp/restart.txt
#
# To restore database from backup:
# cp /home/sc4bovu7233/data/mentivis.db.backup.YYYYMMDD_HHMMSS /home/sc4bovu7233/data/mentivis.db
# touch tmp/restart.txt
