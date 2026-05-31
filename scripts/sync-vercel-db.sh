#!/usr/bin/env bash
# sync-vercel-db.sh — Copies production DB from o2switch, commits to vercel branch
#
# Usage: ./scripts/sync-vercel-db.sh
#
# Prerequisites:
#   - SSH key at /Users/stv/Documents/zed/OS_sc4/id_rsa_sc4 (or set SSH_KEY_PATH)
#   - Passphrase: RoxanStevenMathias2024 (or set SSH_PASSPHRASE)
#   - Must be run from the mentivis-os repo root
#   - Must be on the vercel branch
#
# GitHub Actions setup:
#   Secrets needed: SSH_KEY, SSH_HOST, SSH_USER, SSH_PASSPHRASE
#   Add the private key contents (not path) as SSH_KEY secret.

set -euo pipefail

SSH_KEY="${SSH_KEY_PATH:-/Users/stv/Documents/zed/OS_sc4/id_rsa_sc4}"
SSH_PASS="${SSH_PASSPHRASE:-RoxanStevenMathias2024}"
SSH_HOST="${SSH_HOST:-terre.o2switch.net}"
SSH_USER="${SSH_USER:-sc4bovu7233}"
REMOTE_DB="/home/${SSH_USER}/data/mentivis.db"
LOCAL_DB="data/mentivis.db"

echo "=== Syncing production DB to vercel branch ==="

BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "vercel" ]; then
  echo "ERROR: Must be on vercel branch. Current: $BRANCH"
  exit 1
fi

WORKING_CLEAN=$(git status --porcelain | grep -v "data/mentivis.db" || true)
if [ -n "$WORKING_CLEAN" ]; then
  echo "ERROR: Working tree has uncommitted changes (excluding DB):"
  echo "$WORKING_CLEAN"
  exit 1
fi

echo "--- Fetching DB from production ($SSH_USER@$SSH_HOST) ---"

if [ -n "${GITHUB_ACTIONS:-}" ]; then
  # Running in GitHub Actions: write key from secret
  SSH_KEY_FILE=$(mktemp)
  echo "$SSH_KEY" > "$SSH_KEY_FILE"
  chmod 600 "$SSH_KEY_FILE"
  
  # Install expect if not present
  command -v expect >/dev/null 2>&1 || sudo apt-get install -y -qq expect >/dev/null 2>&1
  
  expect -c "
    set timeout 30
    spawn scp -o StrictHostKeyChecking=accept-new -i \"$SSH_KEY_FILE\" \"$SSH_USER@$SSH_HOST:$REMOTE_DB\" \"$LOCAL_DB\"
    expect -re {passphrase|Password}
    send \"$SSH_PASS\r\"
    expect eof
  "

  expect -c "
    set timeout 30
    spawn scp -o StrictHostKeyChecking=accept-new -i \"$SSH_KEY_FILE\" \"$SSH_USER@$SSH_HOST:${REMOTE_DB%/*}/uploads/*\" \"${LOCAL_DB%/*}/uploads/\"
    expect -re {passphrase|Password}
    send \"$SSH_PASS\r\"
    expect eof
  "
  
  rm -f "$SSH_KEY_FILE"
else
  # Running locally
  expect -c "
    set timeout 30
    spawn scp -o StrictHostKeyChecking=accept-new -i \"$SSH_KEY\" \"$SSH_USER@$SSH_HOST:$REMOTE_DB\" \"$LOCAL_DB\"
    expect \"Enter passphrase for key\"
    send \"$SSH_PASS\r\"
    expect eof
  "

  expect -c "
    set timeout 30
    spawn scp -o StrictHostKeyChecking=accept-new -i \"$SSH_KEY\" \"$SSH_USER@$SSH_HOST:${REMOTE_DB%/*}/uploads/*\" \"${LOCAL_DB%/*}/uploads/\"
    expect \"Enter passphrase for key\"
    send \"$SSH_PASS\r\"
    expect eof
  "
fi

DB_SIZE=$(ls -lh "$LOCAL_DB" | awk '{print $5}')
echo "--- DB downloaded ($DB_SIZE) ---"

if git diff --quiet -- "data/mentivis.db"; then
  echo "=== No DB changes detected. Nothing to commit. ==="
  exit 0
fi

echo "--- Changes detected, committing ---"
git add data/mentivis.db
git commit -m "sync: production DB snapshot ($(date +%Y-%m-%d_%H:%M))" -- data/mentivis.db

echo "--- Pushing to vercel branch ---"
git push origin vercel

echo "=== Sync complete. Vercel will auto-deploy. ==="
