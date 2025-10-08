#!/bin/bash

# AI Workflow Setup Script
# This script sets up the complete AI-driven development workflow

echo "🤖 Setting up AI-Driven Development Workflow..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install --save-dev \
  @playwright/test \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom

echo ""
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Install Playwright browsers
echo -e "${BLUE}🎭 Installing Playwright browsers...${NC}"
npx playwright install --with-deps

echo ""
echo -e "${GREEN}✅ Playwright browsers installed${NC}"
echo ""

# Step 3: Create necessary directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p tests/e2e
mkdir -p tests/unit
mkdir -p .github/workflows
mkdir -p .github/scripts
mkdir -p .github/ISSUE_TEMPLATE

echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Step 4: Set permissions for scripts
echo -e "${BLUE}🔐 Setting script permissions...${NC}"
chmod +x .github/scripts/*.cjs

echo -e "${GREEN}✅ Permissions set${NC}"
echo ""

# Step 5: Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}⚙️  Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update .env with your API keys${NC}"
else
    echo -e "${YELLOW}ℹ️  .env file already exists${NC}"
fi

echo ""

# Step 6: GitHub setup instructions
echo -e "${BLUE}📋 GitHub Setup Checklist:${NC}"
echo ""
echo "1. Enable GitHub Actions:"
echo "   - Go to Settings → Actions → General"
echo "   - Enable 'Read and write permissions'"
echo "   - Enable 'Allow GitHub Actions to create and approve pull requests'"
echo ""
echo "2. Add GitHub Secrets (optional for enhanced AI):"
echo "   - Go to Settings → Secrets and variables → Actions"
echo "   - Add: OPENAI_API_KEY (for GPT-4)"
echo "   - Or add: ANTHROPIC_API_KEY (for Claude)"
echo ""
echo "3. Create Labels:"
echo "   - ai-implement (triggers AI workflow)"
echo "   - ai-generated (marks AI PRs)"
echo "   - automated (marks automated PRs)"
echo "   - ready-for-review (marks ready PRs)"
echo ""
echo "4. Set up Branch Protection (recommended):"
echo "   - Go to Settings → Branches"
echo "   - Add rule for 'main' branch"
echo "   - Enable 'Require status checks to pass'"
echo ""

# Step 7: Test setup
echo -e "${BLUE}🧪 Testing setup...${NC}"
echo ""

# Run a simple test
echo "Running test check..."
npm run test:unit -- --run --reporter=verbose 2>&1 | head -20

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}📚 Next steps:${NC}"
echo "1. Configure your .env file with API keys"
echo "2. Complete GitHub setup steps above"
echo "3. Create an issue with the 'ai-implement' label"
echo "4. Watch the AI work its magic! 🎉"
echo ""
echo -e "${YELLOW}📖 Read AI_WORKFLOW.md for detailed documentation${NC}"
echo ""
