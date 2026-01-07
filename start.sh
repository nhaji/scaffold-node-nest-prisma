#!/bin/bash

set -e

# --- Dependency Check ---
if ! command -v curl &> /dev/null; then
    echo "❌ Error: curl is not installed. Please install it to continue."
    echo "   On Debian/Ubuntu: sudo apt-get install curl"
    echo "   On macOS: brew install curl"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo "💡 Create .env from .env.example and fill in your values"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)
echo "✅ Environment variables loaded"

# Create necessary directories on the host if they don't exist
mkdir -p ${LOG_DIR}
chmod -R 777 ${LOG_DIR}

# Start the server
echo "🚀 Starting Business Server..."

# Start only the database service first
echo "📦 Starting database container..."
docker compose up -d skeleton-nnp-db

echo "⏳ Waiting for database to be ready..."
# Proper PostgreSQL readiness check
MAX_DB_RETRIES=30
DB_RETRY_COUNT=0

until docker compose exec -T skeleton-nnp-db pg_isready -U ${DB_USER} -d ${DB_NAME} > /dev/null 2>&1; do
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


# Run Prisma migrations in a temporary app container
echo "🔄 Applying Prisma migrations..."
docker compose run --rm skeleton-nnp-server npx prisma migrate deploy

echo "📦 Starting application server container..."
docker compose up -d skeleton-nnp-server

echo "⏳ Waiting for app to start..."
sleep 10

# Health check with retries
echo "🔍 Performing health check..."
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:${EXPOSED_PORT}${HEALTH_CHECK_ENDPOINT} > /dev/null; then
        echo "✅ Business server is healthy"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Waiting for server... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 3
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Health check failed after $MAX_RETRIES attempts"
    docker compose logs skeleton-nnp-server
    exit 1
fi

echo ""
echo "🎉 Business Server Started Successfully!"
echo "📍 http://localhost:${EXPOSED_PORT}"
echo ""
echo "🔧 Test endpoints:"
echo "   Health:    curl http://localhost:${EXPOSED_PORT}${HEALTH_CHECK_ENDPOINT}"