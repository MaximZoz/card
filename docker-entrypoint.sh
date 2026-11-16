#!/bin/sh
set -e
attempt=0
until npx prisma migrate deploy; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 15 ]; then
    echo "migrate deploy failed" >&2
    exit 1
  fi
  sleep 2
done
exec node dist/main.js
