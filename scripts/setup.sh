#!/bin/sh
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

prompt_credentials() {
  echo ""
  echo "Create your Orion login"
  echo "-----------------------"

  printf "Username [orion]: "
  read -r username
  username="${username:-orion}"

  while true; do
    printf "Password [orion]: "
    stty -echo 2>/dev/null || true
    read -r password
    stty echo 2>/dev/null || true
    echo ""

    password="${password:-orion}"

    if [ "${#password}" -lt 5 ]; then
      echo "Password must be at least 5 characters."
      continue
    fi

    printf "Confirm password: "
    stty -echo 2>/dev/null || true
    read -r confirm
    stty echo 2>/dev/null || true
    echo ""

    if [ "$password" != "$confirm" ]; then
      echo "Passwords do not match. Try again."
      continue
    fi

    break
  done

  grep -v '^ORION_ADMIN_USER=' .env | grep -v '^ORION_ADMIN_PASSWORD=' > .env.tmp || true
  mv .env.tmp .env
  {
    echo "ORION_ADMIN_USER=${username}"
    echo "ORION_ADMIN_PASSWORD=${password}"
  } >> .env

  echo ""
  echo "Saved credentials for user: ${username}"
}

if [ -t 0 ]; then
  prompt_credentials
else
  echo "Non-interactive shell detected."
  echo "Set ORION_ADMIN_USER and ORION_ADMIN_PASSWORD in .env,"
  echo "or finish setup at http://127.0.0.1:7080/setup after starting."
fi

mkdir -p "${APP_DATA_DIR:-./data}"

echo ""
echo "Starting Orion..."
docker compose up -d --build

echo ""
echo "Orion is starting."
echo "Open http://127.0.0.1:${APP_PORT:-7080}/login"
