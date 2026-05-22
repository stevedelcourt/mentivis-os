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
  # Clean stale artifacts from previous deploys
  rm -rf .next ${APP_DIR}/public/_next 2>/dev/null || true
  sed -i '/RewriteRule.*_next\/static/d' ${APP_DIR}/.htaccess 2>/dev/null || true
  npx next build --webpack

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
    echo "Deploy successful"
  else
    echo "!!! HEALTH CHECK FAILED !!!"
    echo "Previous build remains in place. Investigate and retry."
    exit 1
  fi
EOF

echo "=== Deploy complete ==="

# ── Rollback Instructions ──
# To restore database from backup:
# ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST}
# cp /home/sc4bovu7233/data/mentivis.db.backup.YYYYMMDD_HHMMSS /home/sc4bovu7233/data/mentivis.db
# touch ~/nextapp/tmp/restart.txt
