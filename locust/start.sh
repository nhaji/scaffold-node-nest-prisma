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
echo "🚀 Starting LOCUST Test..."

docker compose up -d --scale locust-worker=4

echo "✅ LOCUST Test started successfully"
echo "📊 Check status: docker compose ps"
echo "📝 View logs: docker compose logs -f locust-master"
echo "🌐 Open Locust UI: http://localhost:8089"
echo "🧹 Clean up: ./stop.sh"