#!/bin/bash
# Auto-deploy script for SC4 o2switch
# Run this via cPanel cron job every 5-10 minutes
# It checks GitHub for new commits, rebuilds if needed

set -e

APP_DIR="/home/sc4bovu7233/nextapp"
NODE_BIN="/opt/alt/alt-nodejs20/root/usr/bin"
PATH="${NODE_BIN}:${PATH}"

cd "$APP_DIR"

# Fetch latest from GitHub
git fetch origin main 2>/dev/null

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0
fi

echo "$(date): New commit detected: $REMOTE"

# Pull new code
git reset --hard origin/main

# Install dependencies if package-lock changed
if git diff --name-only HEAD~1 HEAD | grep -q "package-lock.json"; then
  echo "$(date): Installing dependencies..."
  npm install
fi

# Build
echo "$(date): Building..."
rm -rf .next "${APP_DIR}/public/_next" "${APP_DIR}/statics" 2>/dev/null || true
ASSET_PREFIX=/statics npx next build --webpack

# Copy static files for Apache
mkdir -p "${APP_DIR}/statics/_next"
cp -r "${APP_DIR}/.next/static" "${APP_DIR}/statics/_next/static"
find "${APP_DIR}/statics" -type f \( -name '8058-*.js' -o -name 'polyfills-*' -o -name 'page-*' \) -exec sed -i '1i void 0;' {} \;

# Restart Passenger
touch "${APP_DIR}/tmp/restart.txt"

echo "$(date): Deploy complete"
