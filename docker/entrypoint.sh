#!/bin/sh
set -eu

# Apply pending SQL, then serve. No DATABASE_URL → migrate no-ops (PGLite).
node scripts/migrate.mjs

export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-8080}"
export NITRO_HOST="${NITRO_HOST:-$HOST}"
export NITRO_PORT="${NITRO_PORT:-$PORT}"

exec node .output/server/index.mjs
