#!/usr/bin/env bash
set -euo pipefail

run_step() {
  local label="$1"
  shift
  echo "[start] $label"
  "$@"
}

trap 'echo "Startup failed. Check DATABASE_URL, ensure Postgres is running, and verify LM Studio API is reachable." >&2' ERR

run_step "Checking database connectivity" npm run test:db
run_step "Running migrations and verifying chat_log" npx tsx server/scripts/run-migrations-check.ts
run_step "Checking LM Studio connectivity" npm run test:lmstudio

# Start the server in this same terminal/session (no background process, no new window).
echo "[start] Starting API server"
exec npx tsx server/src/index.ts
