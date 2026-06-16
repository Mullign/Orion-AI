#!/bin/sh
set -e

DATA_DIR="${APP_DATA_DIR:-/app/data}"
mkdir -p "$DATA_DIR"

RUNTIME_FILE="$DATA_DIR/runtime.env"
ADMIN_USER="${ORION_ADMIN_USER:-${APP_USERNAME:-orion}}"
ADMIN_PASSWORD="${ORION_ADMIN_PASSWORD:-${APP_PASSWORD:-orion}}"

if [ ! -f "$RUNTIME_FILE" ]; then
  if [ -n "$ADMIN_PASSWORD" ]; then
    AUTH_SECRET="${AUTH_SECRET:-$(openssl rand -hex 32)}"
    cat > "$RUNTIME_FILE" <<EOF
AUTH_SECRET=${AUTH_SECRET}
APP_USERNAME=${ADMIN_USER}
APP_PASSWORD=${ADMIN_PASSWORD}
EOF
    echo "[orion] Admin account configured (${ADMIN_USER})"
  else
    AUTH_SECRET="${AUTH_SECRET:-$(openssl rand -hex 32)}"
    printf 'AUTH_SECRET=%s\n' "$AUTH_SECRET" > "$RUNTIME_FILE"
    echo "[orion] Finish setup at http://${APP_BIND:-127.0.0.1}:${APP_PORT:-7080}/setup"
  fi
fi

# shellcheck disable=SC1091
. "$RUNTIME_FILE"
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
