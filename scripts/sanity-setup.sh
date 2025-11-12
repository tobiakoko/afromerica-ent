#!/bin/bash

# Sanity Connection Setup Script
# This script helps you connect to Sanity.io step by step

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     Afromerica Entertainment - Sanity Setup              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
    echo ""
fi

echo "Step 1: Login to Sanity"
echo "───────────────────────────────────────────────────────────"
echo "This will open your browser for authentication..."
echo ""

npx sanity login

echo ""
echo -e "${GREEN}✓ Successfully logged in to Sanity${NC}"
echo ""

echo "Step 2: List Your Projects"
echo "───────────────────────────────────────────────────────────"
echo ""

npx sanity projects list

echo ""
echo "Do you have an existing Sanity project you want to use? (y/n)"
read -r has_project

if [ "$has_project" = "n" ] || [ "$has_project" = "N" ]; then
    echo ""
    echo "Creating a new Sanity project..."
    echo "───────────────────────────────────────────────────────────"
    npx sanity init --project-plan free
    echo ""
    echo -e "${GREEN}✓ Project created${NC}"
else
    echo ""
    echo "Great! Let's configure your existing project."
fi

echo ""
echo "Step 3: Get Your Project ID"
echo "───────────────────────────────────────────────────────────"
echo ""
npx sanity projects list
echo ""
echo "Enter your Sanity Project ID (from the list above):"
read -r project_id

# Update .env.local with project ID
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/NEXT_PUBLIC_SANITY_PROJECT_ID=.*/NEXT_PUBLIC_SANITY_PROJECT_ID=$project_id/" .env.local
else
    # Linux
    sed -i "s/NEXT_PUBLIC_SANITY_PROJECT_ID=.*/NEXT_PUBLIC_SANITY_PROJECT_ID=$project_id/" .env.local
fi

echo -e "${GREEN}✓ Project ID saved to .env.local${NC}"
echo ""

echo "Step 4: Create API Token"
echo "───────────────────────────────────────────────────────────"
echo "Opening Sanity dashboard to create an API token..."
echo ""
echo "Please:"
echo "  1. Go to API → Tokens"
echo "  2. Click 'Add API Token'"
echo "  3. Name it 'Development Token'"
echo "  4. Set permissions to 'Editor'"
echo "  5. Copy the token"
echo ""
echo "Press Enter when ready to continue..."
read -r

npx sanity manage

echo ""
echo "Enter your Sanity API Token:"
read -r -s api_token

# Update .env.local with API token
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/SANITY_API_TOKEN=.*/SANITY_API_TOKEN=$api_token/" .env.local
else
    sed -i "s/SANITY_API_TOKEN=.*/SANITY_API_TOKEN=$api_token/" .env.local
fi

echo ""
echo -e "${GREEN}✓ API Token saved to .env.local${NC}"
echo ""

echo "Step 5: Verify Connection"
echo "───────────────────────────────────────────────────────────"
echo "Testing connection..."
echo ""

# Test dataset access
if npx sanity dataset list > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Successfully connected to Sanity!${NC}"
else
    echo -e "${RED}✗ Connection failed. Please check your credentials.${NC}"
    exit 1
fi

echo ""
echo "Step 6: Check Datasets"
echo "───────────────────────────────────────────────────────────"
npx sanity dataset list

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                  Setup Complete! 🎉                       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "  1. Start your dev server:"
echo "     ${GREEN}npm run dev${NC}"
echo ""
echo "  2. Open Sanity Studio:"
echo "     ${GREEN}http://localhost:3000/admin${NC}"
echo ""
echo "  3. Start adding content:"
echo "     - Create venues"
echo "     - Create artists"
echo "     - Create events"
echo ""
echo "📚 Documentation:"
echo "   - Connection Guide: SANITY_CONNECTION_GUIDE.md"
echo "   - Setup Guide: SANITY_SETUP.md"
echo "   - Schema Reference: sanity/SCHEMAS.md"
echo ""
echo "Happy content creating! ✨"
