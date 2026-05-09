#!/bin/bash
set -e

SSH_KEY="/Users/stv/Documents/zed/OS_sc4/id_rsa_sc4"
SSH_HOST="terre.o2switch.net"
SSH_USER="sc4bovu7233"
APP_DIR="/home/${SSH_USER}/nextapp"
NODE_BIN="/opt/alt/alt-nodejs20/root/usr/bin"

chmod 600 "$SSH_KEY"

echo "=== Pushing to GitHub ==="
git push

echo "=== Deploying to o2switch ==="
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${SSH_USER}@${SSH_HOST}" << EOF
  set -e

  export PATH="${NODE_BIN}:\$PATH"

  echo "--- Node version ---"
  node --version

  if [ ! -d "${APP_DIR}/.git" ]; then
    echo "--- Cloning repo ---"
    mkdir -p ${APP_DIR}
    git clone https://github.com/stevedelcourt/mentivis-os.git ${APP_DIR}
  fi

  cd ${APP_DIR}
  git pull origin main

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
  fi

  echo "--- Restarting Passenger ---"
  mkdir -p tmp
  touch tmp/restart.txt

  echo "--- Done ---"
EOF

echo "=== Deploy complete ==="
