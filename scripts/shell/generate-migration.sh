#!/bin/sh
set -u

# Database schema name
schema=$1;
# Migration file name
filename=$2;

export TYPEORM_CONNECTION="${TYPEORM_CONNECTION:-postgres}"
export TYPEORM_DATABASE="${TYPEORM_DATABASE:-dellingr}"
export TYPEORM_HOST="${TYPEORM_HOST:-localhost}"
export TYPEORM_PASSWORD="${TYPEORM_PASSWORD:-masterkey}"
export TYPEORM_PORT="${TYPEORM_PORT:-5432}"
export TYPEORM_SYNCHRONIZE="${TYPEORM_SYNCHRONIZE:-false}"
export TYPEORM_USERNAME="${TYPEORM_USERNAME:-admin}"
export TYPEORM_SCHEMA="$schema"
export TYPEORM_ENTITIES="${TYPEORM_ENTITIES:-dist/db/entities/*.js}"
export TYPEORM_MIGRATIONS="${TYPEORM_MIGRATIONS:-dist/db/migrations/*.js}"
export TYPEORM_MIGRATIONS_DIR="${TYPEORM_MIGRATIONS_DIR:-src/db/migrations}"
export TYPEORM_MIGRATIONS_RUN="${TYPEORM_MIGRATIONS_RUN:-true}"
export TYPEORM_DROP_SCHEMA="${TYPEORM_DROP_SCHEMA:-true}"
export TYPEORM_USE_WEBPACK="${TYPEORM_USE_WEBPACK:-false}"

wait_time=10

echo "Starting database"
yarn db:start
echo "Waiting $wait_time seconds for the database to start"
sleep $wait_time
echo "yarn db:migration:run $TYPEORM_ENTITIES"
yarn db:migration:run
echo "yarn db:migration:generate $filename"
yarn db:migration:generate "$filename"
