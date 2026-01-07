#!/bin/bash

set -e

# Check if .env exists
if [ ! -f ../.env ]; then
    echo "❌ .env file not found"
    echo "💡 Create .env from .env.example and fill in your values"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' ../.env | xargs)
echo "✅ Environment variables loaded"

# Start the server
echo "🚀 Starting Postgres Server..."

docker compose up -d

echo "⏳ Waiting for database to be ready..."
# Proper PostgreSQL readiness check
MAX_DB_RETRIES=30
DB_RETRY_COUNT=0

until docker compose exec -T postgres-skeleton-nnp-dev pg_isready -U ${DB_USER} -d ${DB_NAME} > /dev/null 2>&1; do
    DB_RETRY_COUNT=$((DB_RETRY_COUNT + 1))
    if [ $DB_RETRY_COUNT -eq $MAX_DB_RETRIES ]; then
        echo "❌ Database failed to start after $MAX_DB_RETRIES attempts"
        docker compose logs skeleton-nnp-db
        exit 1
    fi
    echo "⏳ Waiting for database to be ready... ($DB_RETRY_COUNT/$MAX_DB_RETRIES)"
    sleep 2
done

echo "✅ Database is ready!"