#!/bin/sh
set -e

DATA_DIR="${APP_DATA_DIR:-/app/data}"
mkdir -p "$DATA_DIR"

ADMIN_USER="${APP_USERNAME:-admin}"

if [ ! -f "$DATA_DIR/runtime.env" ]; then
  GENERATED_PASSWORD=false

  if [ -z "$AUTH_SECRET" ]; then
    AUTH_SECRET=$(openssl rand -hex 32)
  fi

  if [ -z "$APP_PASSWORD" ]; then
    APP_PASSWORD=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 18)
    GENERATED_PASSWORD=true
  fi

  cat > "$DATA_DIR/runtime.env" <<EOF
AUTH_SECRET=${AUTH_SECRET}
APP_USERNAME=${ADMIN_USER}
APP_PASSWORD=${APP_PASSWORD}
EOF

  if [ "$GENERATED_PASSWORD" = true ]; then
    echo ""
    echo "=============================================="
    echo " Orion first-time setup"
    echo " Username: ${ADMIN_USER}"
    echo " Password: ${APP_PASSWORD}"
    echo " Open http://${APP_BIND:-127.0.0.1}:${APP_PORT:-7000}/login"
    echo " Set ORION_ADMIN_PASSWORD in .env to choose your own."
    echo "=============================================="
    echo ""
  else
    echo "[orion] Admin account configured from .env (${ADMIN_USER})"
  fi
fi

# shellcheck disable=SC1091
. "$DATA_DIR/runtime.env"
export AUTH_SECRET APP_USERNAME APP_PASSWORD

OLLAMA_HOST="${OLLAMA_BASE_URL:-http://ollama:11434}"
echo "[orion] Waiting for Ollama at ${OLLAMA_HOST}..."

attempt=0
until curl -sf "${OLLAMA_HOST}/" > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 60 ]; then
    echo "[orion] Warning: Ollama not reachable — chat may fail until it is up."
    break
  fi
  sleep 2
done

if curl -sf "${OLLAMA_HOST}/" > /dev/null 2>&1; then
  echo "[orion] Ollama is ready."
fi

chown -R nextjs:nodejs "$DATA_DIR" 2>/dev/null || true

exec "$@"
