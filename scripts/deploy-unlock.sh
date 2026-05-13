#!/bin/bash
# Auto-unlocks SSH key and runs deploy
# Usage: ./scripts/deploy-unlock.sh

set -e

# Unlock SSH key
export SSH_ASKPASS=/tmp/askpass.sh
export DISPLAY=:0
echo '#!/bin/bash
echo "RoxanStevenMathias2024"' > /tmp/askpass.sh
chmod +x /tmp/askpass.sh
eval "$(ssh-agent -s)" > /dev/null
ssh-add /Users/stv/Documents/zed/OS_sc4/id_rsa_sc4 < /dev/null 2>&1

# Export deploy env vars
if [ -f .env.deploy ]; then
  set -a
  source .env.deploy
  set +a
fi

# Run deploy
./deploy.sh
