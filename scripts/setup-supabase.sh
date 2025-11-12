#!/bin/bash

# Supabase Setup Script for Afromerica Entertainment
# This script automates the initial Supabase setup

set -e

echo "🚀 Afromerica Entertainment - Supabase Setup"
echo "=============================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

echo "✅ Docker is running"

# Check if Supabase CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found"
    echo "Please install Node.js and try again"
    exit 1
fi

echo "✅ npx is available"

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local"
        SKIP_ENV=true
    fi
fi

# Start Supabase
echo ""
echo "📦 Starting Supabase..."
npx supabase start

# Extract credentials
echo ""
echo "📝 Extracting credentials..."

# Store the output
SUPABASE_OUTPUT=$(npx supabase status)

# Extract values using grep and awk
API_URL=$(echo "$SUPABASE_OUTPUT" | grep "API URL" | awk '{print $3}')
ANON_KEY=$(echo "$SUPABASE_OUTPUT" | grep "anon key" | awk '{print $3}')
SERVICE_ROLE_KEY=$(echo "$SUPABASE_OUTPUT" | grep "service_role key" | awk '{print $3}')

# Update .env.local if not skipped
if [ "$SKIP_ENV" != true ]; then
    echo ""
    echo "📄 Creating/updating .env.local..."

    # Copy from example if doesn't exist
    if [ ! -f .env.local ]; then
        cp .env.example .env.local
    fi

    # Update Supabase values
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$API_URL|" .env.local
        sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" .env.local
        sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY|" .env.local
    else
        # Linux
        sed -i "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$API_URL|" .env.local
        sed -i "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" .env.local
        sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY|" .env.local
    fi

    echo "✅ .env.local updated with Supabase credentials"
fi

# Generate TypeScript types
echo ""
echo "🔧 Generating TypeScript types..."
npx supabase gen types typescript --local > types/supabase.ts
echo "✅ Types generated at types/supabase.ts"

# Success message
echo ""
echo "✨ Setup complete!"
echo ""
echo "📊 Supabase Services:"
echo "  - API:         $API_URL"
echo "  - Studio:      http://127.0.0.1:54323"
echo "  - Inbucket:    http://127.0.0.1:54324"
echo ""
echo "🎯 Next steps:"
echo "  1. Start the development server:"
echo "     npm run dev"
echo ""
echo "  2. Open the app:"
echo "     http://localhost:3000"
echo ""
echo "  3. Manage database:"
echo "     http://localhost:54323"
echo ""
echo "📚 Documentation:"
echo "  - Quick Start: docs/QUICK_START.md"
echo "  - Supabase Setup: docs/SUPABASE_SETUP.md"
echo ""
