#!/bin/bash

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo "💡 Create .env from .env.example and fill in your values"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)
echo "✅ Environment variables loaded"

echo "🚀 Building Business Server..."

# Check if package.json exists
if [ ! -f package.json ]; then
    echo "❌ package.json not found"
    exit 1
fi

# Build the Docker image
echo "🐳 Building Docker image..."
docker compose build --no-cache skeleton-nnp-server

# Check the exit status of the last command (docker compose build)
if [ $? -eq 0 ]; then
   echo ""
   echo "🎉 Business Server Built Successfully!"
else
    echo ""
    echo "❌ Business Server Build Failed!"
    exit 1 # Exit with a non-zero status to indicate failure
fi