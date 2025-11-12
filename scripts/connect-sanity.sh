#!/bin/bash

# Quick Sanity Connection Helper
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║       ${BOLD}Connect to Sanity Dashboard${NC}${BLUE}                    ║${NC}"
echo -e "${BLUE}║       ${YELLOW}Afromerica Entertainment${NC}${BLUE}                      ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}Your Project ID:${NC} z7tykdlk"
echo ""

# Step 1: Login
echo -e "${BOLD}Step 1: Login to Sanity${NC}"
echo "──────────────────────────────────────────────────────────"
echo "This will open your browser for authentication..."
echo ""
echo -e "Press ${GREEN}Enter${NC} to continue (or Ctrl+C to cancel)"
read -r

npx sanity login

echo ""
echo -e "${GREEN}✓ Login successful!${NC}"
echo ""
sleep 1

# Step 2: Verify
echo -e "${BOLD}Step 2: Verify Connection${NC}"
echo "──────────────────────────────────────────────────────────"
echo "Checking your projects..."
echo ""

if npx sanity projects list | grep -q "z7tykdlk"; then
    echo -e "${GREEN}✓ Project z7tykdlk found!${NC}"
else
    echo -e "${YELLOW}⚠️  Project z7tykdlk not found in your account.${NC}"
    echo ""
    echo "You may need to:"
    echo "  1. Be invited to this project by the owner"
    echo "  2. Or create a new project and update .env.local"
    echo ""
    exit 1
fi

echo ""
sleep 1

# Step 3: API Token
echo -e "${BOLD}Step 3: Create/Get API Token${NC}"
echo "──────────────────────────────────────────────────────────"
echo "Opening Sanity dashboard..."
echo ""
echo -e "${YELLOW}In the browser:${NC}"
echo "  1. Click 'API' in left sidebar"
echo "  2. Click 'Tokens' tab"
echo "  3. Click '+ Add API Token'"
echo "  4. Name: 'Development Token'"
echo "  5. Permissions: 'Editor'"
echo "  6. Click 'Add Token'"
echo "  7. COPY the token (you won't see it again!)"
echo ""
echo -e "Press ${GREEN}Enter${NC} when ready..."
read -r

npx sanity manage &
sleep 2

echo ""
echo -e "${BOLD}Paste your API token here:${NC}"
read -r -s api_token

if [ -z "$api_token" ]; then
    echo ""
    echo -e "${RED}✗ No token provided. Exiting.${NC}"
    exit 1
fi

# Update .env.local
echo ""
echo "Updating .env.local..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|SANITY_API_TOKEN=.*|SANITY_API_TOKEN=$api_token|" .env.local
else
    # Linux
    sed -i "s|SANITY_API_TOKEN=.*|SANITY_API_TOKEN=$api_token|" .env.local
fi

echo -e "${GREEN}✓ API token saved to .env.local${NC}"
echo ""
sleep 1

# Step 4: Test Connection
echo -e "${BOLD}Step 4: Test Connection${NC}"
echo "──────────────────────────────────────────────────────────"
echo "Testing dataset access..."
echo ""

if npx sanity dataset list 2>/dev/null | grep -q "production"; then
    echo -e "${GREEN}✓ Successfully connected to Sanity!${NC}"
    echo ""
    echo "Available datasets:"
    npx sanity dataset list
else
    echo -e "${RED}✗ Connection test failed.${NC}"
    echo "Please check your token and try again."
    exit 1
fi

echo ""
sleep 1

# Step 5: CORS Setup
echo -e "${BOLD}Step 5: Configure CORS${NC}"
echo "──────────────────────────────────────────────────────────"
echo "Adding localhost to allowed origins..."
echo ""

# Add localhost:3000
npx sanity cors add http://localhost:3000 --credentials --no-prompt 2>/dev/null && \
    echo -e "${GREEN}✓ Added http://localhost:3000${NC}" || \
    echo -e "${YELLOW}⚠️  localhost:3000 may already be configured${NC}"

# Add localhost (any port)
npx sanity cors add "http://localhost:*" --credentials --no-prompt 2>/dev/null && \
    echo -e "${GREEN}✓ Added http://localhost:*${NC}" || \
    echo -e "${YELLOW}⚠️  localhost:* may already be configured${NC}"

echo ""
sleep 1

# Success!
clear
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║               ${BOLD}✓ Setup Complete! 🎉${NC}${GREEN}                     ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}What's Next:${NC}"
echo ""
echo -e "${BLUE}1.${NC} Start your dev server:"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo -e "${BLUE}2.${NC} Open Sanity Studio in your browser:"
echo -e "   ${GREEN}http://localhost:3000/admin${NC}"
echo ""
echo -e "${BLUE}3.${NC} Start adding content:"
echo "   → Create a Venue (e.g., 'The Shrine, Lagos')"
echo "   → Create an Artist (e.g., 'Burna Boy')"
echo "   → Create an Event (link venue + artists)"
echo "   → Mark some as 'Featured' for homepage"
echo ""
echo -e "${BOLD}Quick Tips:${NC}"
echo "  • Create venues ${YELLOW}first${NC} (events need venues)"
echo "  • Use the 'Generate' button to create slugs"
echo "  • Click 'Publish' to make content live"
echo "  • Toggle 'Featured' for homepage display"
echo ""
echo -e "${BOLD}Documentation:${NC}"
echo "  • ${BLUE}CONNECT_SANITY_NOW.md${NC} - Quick reference"
echo "  • ${BLUE}SANITY_CONNECTION_GUIDE.md${NC} - Detailed guide"
echo "  • ${BLUE}sanity/SCHEMAS.md${NC} - Schema reference"
echo ""
echo -e "${BOLD}Useful Commands:${NC}"
echo "  ${GREEN}npx sanity manage${NC}       - Open dashboard"
echo "  ${GREEN}npx sanity dataset list${NC} - List datasets"
echo "  ${GREEN}npm run dev${NC}             - Start dev server"
echo ""
echo -e "${GREEN}Happy content creating! ✨${NC}"
echo ""
