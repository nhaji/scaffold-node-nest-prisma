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

# Create necessary directories on the host if they don't exist
mkdir -p ${SCHEMATHESIS_TEST_REPORTS_DIR}
chmod -R 777 ${SCHEMATHESIS_TEST_REPORTS_DIR}

# Start the server
echo "🚀 Starting SCHEMATHESIS Test..."

docker compose up -d

echo "✅ SCHEMATHESIS Test started successfully"
echo "📊 Check status: docker compose ps"
echo "📝 View logs: docker compose logs -f api-tests"
echo "🧹 Clean up: ./stop.sh"