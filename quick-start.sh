#!/bin/bash

# Quick Start - AI-Driven Development Workflow
# Run this script to get started in under 5 minutes!

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear

echo -e "${BLUE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🚀 AI-Driven Development Workflow - Quick Start 🚀       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${GREEN}This script will help you get started in 5 minutes!${NC}"
echo ""
echo "We'll:"
echo "  1. ✅ Validate your MCP setup"
echo "  2. 📦 Install dependencies"
echo "  3. ⚙️  Configure settings"
echo "  4. 🎯 Create your first AI-implemented feature"
echo ""

read -p "Ready to begin? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Okay, run this script whenever you're ready!"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Step 1: Validating MCP Setup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "./validate-mcp-setup.sh" ]; then
    chmod +x ./validate-mcp-setup.sh
    ./validate-mcp-setup.sh || {
        echo ""
        echo -e "${YELLOW}⚠️  Validation found some issues, but we can continue.${NC}"
        echo "You can fix these later. See .github/FINAL_SETUP_GUIDE.md"
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    }
else
    echo -e "${YELLOW}⚠️  Validation script not found, skipping...${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Step 2: Installing Dependencies${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "./setup-ai-workflow.sh" ]; then
    chmod +x ./setup-ai-workflow.sh
    ./setup-ai-workflow.sh
else
    echo "Installing dependencies manually..."
    npm install
    npx playwright install
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Step 3: Configuration Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Checking MCP configuration..."
if [ -f ".github/mcp-config.json" ]; then
    echo -e "${GREEN}✓${NC} MCP configuration found"
    
    # Check if Firebase project ID is set
    if grep -q '"firebase-project-id"' .github/mcp-config.json; then
        echo -e "${YELLOW}ℹ${NC} Firebase Project ID input is configured"
        echo ""
        read -p "Do you want to set your Firebase Project ID now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Enter your Firebase Project ID: " firebase_id
            echo "You can manually edit .github/mcp-config.json to add this value."
            echo "Or you'll be prompted when first using MCP in VS Code."
        fi
    fi
else
    echo -e "${YELLOW}⚠${NC} MCP configuration not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Step 4: GitHub Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "For the workflow to work, you'll need to:"
echo ""
echo "1. Enable GitHub Actions in your repository"
echo "2. Ensure you have the 'ai-implement' label created"
echo ""
read -p "Have you done this? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "No problem! Here's how to do it:"
    echo ""
    echo "To enable GitHub Actions:"
    echo "  Go to: Settings → Actions → General"
    echo "  Enable 'Allow all actions and reusable workflows'"
    echo ""
    echo "To create the 'ai-implement' label:"
    echo "  Go to: Issues → Labels → New label"
    echo "  Name: ai-implement"
    echo "  Color: #0e8a16 (green)"
    echo ""
    read -p "Press Enter when ready to continue..."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Step 5: Create Your First AI-Implemented Feature${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Let's create a test issue to see the AI workflow in action!"
echo ""
read -p "Would you like to create a test issue now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f ".github/scripts/create-issue.js" ]; then
        node .github/scripts/create-issue.js
    else
        echo ""
        echo "Issue creation script not found."
        echo "You can manually create an issue with:"
        echo "  • Title: Add test feature"
        echo "  • Label: ai-implement"
        echo "  • Description: Add a simple test component"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Quick Start Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 You're all set up!"
echo ""
echo "📚 Next steps:"
echo "   • Read MCP_INTEGRATION_SUMMARY.md for a complete overview"
echo "   • Check .github/FINAL_SETUP_GUIDE.md for detailed instructions"
echo "   • Create issues with 'ai-implement' label to see the magic!"
echo ""
echo "🎮 How to use:"
echo "   1. Create a GitHub issue"
echo "   2. Add 'ai-implement' label"
echo "   3. Wait for the AI to:"
echo "      • Create a branch"
echo "      • Implement the feature using MCP context"
echo "      • Generate tests"
echo "      • Create a PR"
echo ""
echo "🔍 Monitoring:"
echo "   • Check Actions tab: https://github.com/Viclaww/followup-v2/actions"
echo "   • Review generated PRs"
echo "   • See test results"
echo ""
echo -e "${BLUE}Happy AI-powered coding! 🤖✨${NC}"
echo ""
