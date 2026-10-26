#!/bin/sh
set -e

echo "=== GENERATING PRISMA CLIENT ==="
DISABLE_ERD=true pnpm exec prisma generate

echo "=== SYNCING DATABASE SCHEMA ==="
pnpm exec prisma db push

echo "=== STARTING API ==="
echo ">>> API em http://localhost:${PORT:-3000}  (docs: http://localhost:${PORT:-3000}/api/docs)"
exec pnpm start:dev

