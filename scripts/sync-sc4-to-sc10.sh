#!/bin/bash
set -e

# ── Configuration ──
SC4_KEY="/Users/stv/Documents/zed/OS_sc4/id_rsa_sc4"
SC10_KEY="/Users/stv/Documents/zed/DeployOS-sc10/id_rsa_sc10"
SC4_USER="sc4bovu7233"
SC10_USER="sc10bovu7233"
SSH_HOST="terre.o2switch.net"
SC4_DB_PATH="/home/${SC4_USER}/data/mentivis.db"
SC10_DB_PATH="/home/${SC10_USER}/data/mentivis.db"
SC4_UPLOADS_PATH="/home/${SC4_USER}/data/uploads"
SC10_UPLOADS_PATH="/home/${SC10_USER}/data/uploads"
LIVE_URL="https://sc10bovu7233.universe.wf"
MIRROR_URL="https://mirror.sc10bovu7233.universe.wf"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Sync sc4 → sc10 + mirror ==="
echo ""

# ── 1. Unlock sc4 SSH key ──
echo "--- 1/6  Unlocking sc4 SSH key ---"
eval "$(ssh-agent -s)" > /dev/null
echo "RoxanStevenMathias2024" | ssh-add "$SC4_KEY"

# ── 2. Save sc10 pricing (to restore after DB copy) ──
echo "--- 2/6  Saving sc10 pricing ---"
SC10_PRICING=$(ssh -i "${SC10_KEY}" -o StrictHostKeyChecking=no \
  "${SC10_USER}@${SSH_HOST}" \
  "export PATH=/opt/alt/alt-nodejs20/root/usr/bin:\$PATH && cd /home/${SC10_USER}/nextapp && node -e '
const s=require(\"sql.js\"),f=require(\"fs\"),p=\"/home/${SC10_USER}/data/mentivis.db\";
if(!f.existsSync(p)){console.log(\"[]\");process.exit();}
s().then(S=>{const d=new S.Database(new Uint8Array(f.readFileSync(p)));
const st=d.prepare(\"SELECT product,plans_json FROM pricing\");
const r=[];while(st.step())r.push(st.getAsObject());st.free();console.log(JSON.stringify(r));});
'")
echo "  OK  sc10 pricing saved (${SC10_PRICING:-empty})"

# ── 3. Copy database sc4 → sc10 ──
echo "--- 3/6  Copying database sc4 → sc10 ---"
ssh -o StrictHostKeyChecking=no "${SC4_USER}@${SSH_HOST}" \
  "cat ${SC4_DB_PATH}" | ssh -i "${SC10_KEY}" \
  -o StrictHostKeyChecking=no "${SC10_USER}@${SSH_HOST}" \
  "cat > ${SC10_DB_PATH}"
echo "  OK  mentivis.db copied (sc4 → sc10)"

# ── 3b. Restore sc10 pricing after DB copy ──
if [ "$SC10_PRICING" != "[]" ] && [ -n "$SC10_PRICING" ]; then
  echo "--- 3b/6  Restoring sc10 pricing ---"
  ssh -i "${SC10_KEY}" -o StrictHostKeyChecking=no \
    "${SC10_USER}@${SSH_HOST}" \
    "export PATH=/opt/alt/alt-nodejs20/root/usr/bin:\$PATH && cd /home/${SC10_USER}/nextapp && node -e '
const s=require(\"sql.js\"),f=require(\"fs\"),p=\"/home/${SC10_USER}/data/mentivis.db\";
const data='"${SC10_PRICING}"';
s().then(S=>{const d=new S.Database(new Uint8Array(f.readFileSync(p)));
data.forEach(row=>{const st=d.prepare(\"INSERT OR REPLACE INTO pricing(product,plans_json,updated_at) VALUES(?,?,datetime('now'))\");
st.run([row.product,row.plans_json]);st.free();});
f.writeFileSync(p,Buffer.from(d.export()));console.log(\"Pricing restored:\",data.length,\"products\");});
'"
  echo "  OK  sc10 pricing restored"
fi

# ── 3. Copy uploads sc4 → sc10 ──
echo "--- 3/6  Copying CMS uploads sc4 → sc10 ---"
ssh -o StrictHostKeyChecking=no "${SC4_USER}@${SSH_HOST}" \
  "cd ${SC4_UPLOADS_PATH} && tar czf - ." | \
  ssh -i "${SC10_KEY}" \
  -o StrictHostKeyChecking=no "${SC10_USER}@${SSH_HOST}" \
  "cd ${SC10_UPLOADS_PATH} && tar xzf -"
echo "  OK  uploads copied (sc4 → sc10)"

# ── 5. Restart Passenger on sc10 ──
echo "--- 5/7  Restarting Passenger on sc10 ---"
ssh -i "${SC10_KEY}" -o StrictHostKeyChecking=no \
  "${SC10_USER}@${SSH_HOST}" \
  "touch /home/${SC10_USER}/nextapp/tmp/restart.txt"
echo "  OK  Passenger restarted"

# ── 6. Wait for restart + health check ──
echo "--- 6/7  Health check ---"
HEALTH_OK=0
for i in 1 2 3 4 5; do
  sleep 2
  if curl -sfk "${LIVE_URL}/api/health/" > /dev/null 2>&1; then
    echo "  OK  sc10 healthy (attempt $i)"
    HEALTH_OK=1
    break
  fi
  echo "  Health check attempt $i failed, retrying..."
done
if [ "$HEALTH_OK" -eq 0 ]; then
  echo "  WARNING: health check failed, continuing anyway"
fi

# ── 7. Rebuild + upload mirror ──
echo "--- 7/7  Rebuilding mirror ---"
cd "$REPO_DIR"
SOURCE_URL="${LIVE_URL}" \
API_PROXY="${LIVE_URL}" \
SITE_URL="${MIRROR_URL}" \
bash scripts/build-static.sh

echo "--- Uploading mirror ---"
rsync -avz --delete -e "ssh -i ${SC10_KEY}" \
  out/ "${SC10_USER}@${SSH_HOST}:/home/${SC10_USER}/public_html/mirror/"

echo ""
echo "=== Sync complete ==="
echo "  sc10:  ${LIVE_URL}"
echo "  mirror: ${MIRROR_URL}"
