#!/bin/sh
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

mkdir -p "${APP_DATA_DIR:-./data}"

echo "Starting Orion..."
docker compose up -d --build

echo ""
echo "Orion is starting. Watch for your login credentials:"
echo "  docker compose logs -f orion"
echo ""
echo "Then open http://127.0.0.1:${APP_PORT:-7000}/login"
