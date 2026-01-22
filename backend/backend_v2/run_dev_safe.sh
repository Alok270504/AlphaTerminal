#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi
: "${PRICE_PROVIDER:=stooq}"
: "${ALLOW_MOCK_DATA:=1}"
export PRICE_PROVIDER ALLOW_MOCK_DATA

if [ -f .venv/bin/activate ]; then
  source .venv/bin/activate
fi

exec uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
