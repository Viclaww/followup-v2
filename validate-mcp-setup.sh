#!/bin/bash

# MCP Setup Validation Script
# Validates that all MCP servers and configurations are properly set up

set -e

echo "🔍 Validating MCP Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track validation status
ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
    else
        echo -e "${RED}✗${NC} Missing: $1"
        ((ERRORS++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1/"
    else
        echo -e "${RED}✗${NC} Missing: $1/"
        ((ERRORS++))
    fi
}

# Function to validate JSON
validate_json() {
    if node -e "JSON.parse(require('fs').readFileSync('$1', 'utf8'))" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Valid JSON: $1"
    else
        echo -e "${RED}✗${NC} Invalid JSON: $1"
        ((ERRORS++))
    fi
}

# Function to check if npm package is needed
check_npm_package() {
    if npm list "$1" &>/dev/null || npm list -g "$1" &>/dev/null; then
        echo -e "${GREEN}✓${NC} Installed: $1"
    else
        echo -e "${YELLOW}⚠${NC} Not installed (will use npx): $1"
        ((WARNINGS++))
    fi
}

echo "📁 Checking MCP Configuration Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file ".github/mcp-config.json"
check_file ".github/workflows/mcp-config.json"
check_file ".vscode/settings.json"
echo ""

echo "🔧 Validating JSON Configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
validate_json ".github/mcp-config.json"
validate_json ".github/workflows/mcp-config.json"
validate_json "package.json"
echo ""

echo "📂 Checking MCP Server Directory..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_dir ".github/mcp-servers"
check_file ".github/mcp-servers/firebase-mcp.js"
check_file ".github/mcp-servers/playwright-mcp.js"
check_file ".github/mcp-servers/project-context-mcp.js"
check_file ".github/mcp-servers/README.md"
echo ""

echo "🎯 Checking MCP Server Implementation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
# Check if custom MCP servers are executable
for server in .github/mcp-servers/*.js; do
    if [ -f "$server" ]; then
        if head -n 1 "$server" | grep -q "#!/usr/bin/env node"; then
            echo -e "${GREEN}✓${NC} Has shebang: $(basename $server)"
        else
            echo -e "${YELLOW}⚠${NC} Missing shebang: $(basename $server)"
            ((WARNINGS++))
        fi
    fi
done
echo ""

echo "📦 Checking MCP Dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_npm_package "@modelcontextprotocol/sdk"
check_npm_package "@executeautomation/playwright-mcp-server"
check_npm_package "@modelcontextprotocol/server-filesystem"
check_npm_package "@modelcontextprotocol/server-git"
check_npm_package "@modelcontextprotocol/server-github"
echo ""

echo "🔌 Checking VS Code MCP Integration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if grep -q '"github.copilot.advanced"' .vscode/settings.json 2>/dev/null; then
    echo -e "${GREEN}✓${NC} GitHub Copilot MCP settings found in .vscode/settings.json"
    
    if grep -q '"mcp.enabled": true' .vscode/settings.json 2>/dev/null; then
        echo -e "${GREEN}✓${NC} MCP enabled in VS Code settings"
    else
        echo -e "${RED}✗${NC} MCP not enabled in VS Code settings"
        ((ERRORS++))
    fi
    
    if grep -q 'mcp-config.json' .vscode/settings.json 2>/dev/null; then
        echo -e "${GREEN}✓${NC} MCP config path set in VS Code settings"
    else
        echo -e "${YELLOW}⚠${NC} MCP config path not found in VS Code settings"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} GitHub Copilot MCP settings not found in .vscode/settings.json"
    ((ERRORS++))
fi
echo ""

echo "🌐 Checking GitHub Actions Integration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if grep -q "mcp-config.json" .github/workflows/issue-to-pr.yml 2>/dev/null; then
    echo -e "${GREEN}✓${NC} MCP config referenced in issue-to-pr.yml"
else
    echo -e "${YELLOW}⚠${NC} MCP config not referenced in workflow"
    ((WARNINGS++))
fi
echo ""

echo "📚 Checking Documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file ".github/MCP_SETUP.md"
check_file ".github/FINAL_SETUP_GUIDE.md"
check_file "DOCS_INDEX.md"
echo ""

echo "🧪 Checking Test Infrastructure..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "playwright.config.ts"
check_file "vitest.config.ts"
check_dir "tests"
check_dir "tests/e2e"
check_dir "tests/unit"
echo ""

echo "🔐 Checking Security Configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if grep -q "mcp-config.json" .gitignore 2>/dev/null; then
    echo -e "${YELLOW}⚠${NC} mcp-config.json is in .gitignore (consider if you need secrets)"
else
    echo -e "${GREEN}✓${NC} mcp-config.json not in .gitignore"
fi

if grep -q ".env" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓${NC} .env files excluded in .gitignore"
else
    echo -e "${RED}✗${NC} .env files not excluded in .gitignore"
    ((ERRORS++))
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ MCP Setup Validation: PASSED${NC}"
    echo ""
    echo "🎉 All MCP servers and configurations are properly set up!"
    echo ""
    echo "Next steps:"
    echo "1. Configure MCP inputs (Firebase Project ID, GitHub PAT)"
    echo "2. Install dependencies: ./setup-ai-workflow.sh"
    echo "3. Test the workflow with a sample issue"
    echo ""
    echo "📖 See .github/FINAL_SETUP_GUIDE.md for detailed instructions"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  MCP Setup Validation: PASSED WITH WARNINGS${NC}"
    echo ""
    echo "Found $WARNINGS warning(s). Review the warnings above."
    echo "The setup should still work, but you may want to address the warnings."
    echo ""
    echo "📖 See .github/FINAL_SETUP_GUIDE.md for troubleshooting"
    exit 0
else
    echo -e "${RED}❌ MCP Setup Validation: FAILED${NC}"
    echo ""
    echo "Found $ERRORS error(s) and $WARNINGS warning(s)."
    echo "Please fix the errors above before proceeding."
    echo ""
    echo "📖 See .github/FINAL_SETUP_GUIDE.md for setup instructions"
    exit 1
fi
