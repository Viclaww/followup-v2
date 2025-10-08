#!/bin/bash

# Verify AI Workflow Setup
# Run this script to check if everything is configured correctly

echo "🔍 Verifying AI Workflow Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    ERRORS=$((ERRORS + 1))
fi

# Check dependencies
echo ""
echo "Checking dependencies..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
else
    echo -e "${RED}✗${NC} node_modules not found - run: npm install"
    ERRORS=$((ERRORS + 1))
fi

# Check Playwright
if [ -d "node_modules/@playwright" ]; then
    echo -e "${GREEN}✓${NC} Playwright installed"
else
    echo -e "${RED}✗${NC} Playwright not installed - run: npm install @playwright/test"
    ERRORS=$((ERRORS + 1))
fi

# Check Vitest
if [ -d "node_modules/vitest" ]; then
    echo -e "${GREEN}✓${NC} Vitest installed"
else
    echo -e "${YELLOW}⚠${NC} Vitest not installed - run: npm install vitest"
    WARNINGS=$((WARNINGS + 1))
fi

# Check workflow files
echo ""
echo "Checking GitHub Actions workflows..."

if [ -f ".github/workflows/issue-to-pr.yml" ]; then
    echo -e "${GREEN}✓${NC} issue-to-pr.yml exists"
else
    echo -e "${RED}✗${NC} issue-to-pr.yml not found"
    ERRORS=$((ERRORS + 1))
fi

if [ -f ".github/workflows/pr-checks.yml" ]; then
    echo -e "${GREEN}✓${NC} pr-checks.yml exists"
else
    echo -e "${RED}✗${NC} pr-checks.yml not found"
    ERRORS=$((ERRORS + 1))
fi

# Check scripts
echo ""
echo "Checking AI scripts..."

if [ -f ".github/scripts/ai-implement.cjs" ]; then
    echo -e "${GREEN}✓${NC} ai-implement.js exists"
else
    echo -e "${RED}✗${NC} ai-implement.js not found"
    ERRORS=$((ERRORS + 1))
fi

if [ -f ".github/scripts/generate-tests.cjs" ]; then
    echo -e "${GREEN}✓${NC} generate-tests.js exists"
else
    echo -e "${RED}✗${NC} generate-tests.js not found"
    ERRORS=$((ERRORS + 1))
fi

if [ -f ".github/scripts/ai-autofix.cjs" ]; then
    echo -e "${GREEN}✓${NC} ai-autofix.js exists"
else
    echo -e "${RED}✗${NC} ai-autofix.js not found"
    ERRORS=$((ERRORS + 1))
fi

# Check config files
echo ""
echo "Checking configuration files..."

if [ -f "playwright.config.ts" ]; then
    echo -e "${GREEN}✓${NC} playwright.config.ts exists"
else
    echo -e "${RED}✗${NC} playwright.config.ts not found"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "vitest.config.ts" ]; then
    echo -e "${GREEN}✓${NC} vitest.config.ts exists"
else
    echo -e "${YELLOW}⚠${NC} vitest.config.ts not found"
    WARNINGS=$((WARNINGS + 1))
fi

# Check test directories
echo ""
echo "Checking test directories..."

if [ -d "tests/e2e" ]; then
    echo -e "${GREEN}✓${NC} tests/e2e exists"
else
    echo -e "${YELLOW}⚠${NC} tests/e2e not found"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "tests/unit" ]; then
    echo -e "${GREEN}✓${NC} tests/unit exists"
else
    echo -e "${YELLOW}⚠${NC} tests/unit not found"
    WARNINGS=$((WARNINGS + 1))
fi

# Check environment
echo ""
echo "Checking environment..."

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example exists"
else
    echo -e "${YELLOW}⚠${NC} .env.example not found"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env exists"
else
    echo -e "${YELLOW}⚠${NC} .env not found - copy from .env.example"
    WARNINGS=$((WARNINGS + 1))
fi

# Check issue templates
echo ""
echo "Checking issue templates..."

if [ -f ".github/ISSUE_TEMPLATE/ai-feature-request.md" ]; then
    echo -e "${GREEN}✓${NC} AI feature request template exists"
else
    echo -e "${RED}✗${NC} AI feature request template not found"
    ERRORS=$((ERRORS + 1))
fi

if [ -f ".github/ISSUE_TEMPLATE/ai-bug-report.md" ]; then
    echo -e "${GREEN}✓${NC} AI bug report template exists"
else
    echo -e "${RED}✗${NC} AI bug report template not found"
    ERRORS=$((ERRORS + 1))
fi

# Check documentation
echo ""
echo "Checking documentation..."

DOCS=(
    "AI_WORKFLOW.md"
    "QUICKSTART.md"
    "IMPLEMENTATION.md"
    "ADVANCED_AI_SETUP.md"
    "SETUP_CHECKLIST.md"
    "ARCHITECTURE.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc exists"
    else
        echo -e "${YELLOW}⚠${NC} $doc not found"
        WARNINGS=$((WARNINGS + 1))
    fi
done

# Test commands
echo ""
echo "Testing npm scripts..."

if npm run lint --help &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm run lint is configured"
else
    echo -e "${RED}✗${NC} npm run lint not configured"
    ERRORS=$((ERRORS + 1))
fi

if npm run test:unit --help &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm run test:unit is configured"
else
    echo -e "${YELLOW}⚠${NC} npm run test:unit not configured"
    WARNINGS=$((WARNINGS + 1))
fi

if npm run test:e2e --help &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm run test:e2e is configured"
else
    echo -e "${YELLOW}⚠${NC} npm run test:e2e not configured"
    WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ Perfect! Everything is set up correctly.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure GitHub settings (see SETUP_CHECKLIST.md)"
    echo "2. Create a test issue with 'ai-implement' label"
    echo "3. Watch the AI workflow in action!"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup is mostly complete with $WARNINGS warnings.${NC}"
    echo "Review the warnings above and fix if needed."
else
    echo -e "${RED}✗ Setup incomplete. Found $ERRORS errors and $WARNINGS warnings.${NC}"
    echo "Please fix the errors above before proceeding."
fi

echo ""
echo "For detailed setup instructions, see:"
echo "  • QUICKSTART.md - Quick start guide"
echo "  • SETUP_CHECKLIST.md - Complete setup checklist"
echo "  • IMPLEMENTATION.md - What has been created"

exit $ERRORS
