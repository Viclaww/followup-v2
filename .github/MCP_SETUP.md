# MCP (Model Context Protocol) Configuration

This directory contains MCP server configurations to provide AI agents with better context about your project.

## What is MCP?

Model Context Protocol (MCP) is a standardized way to provide AI models with contextual information about your codebase, tools, and infrastructure.

## Available MCP Servers

### 1. Playwright MCP Server

**Purpose**: Provides context about E2E tests, test configurations, and Playwright setup.

**Capabilities**:

- Access to test files and test structure
- Playwright configuration details
- Test execution history
- Browser automation context

**Package**: `@executeautomation/playwright-mcp-server`

### 2. Filesystem MCP Server

**Purpose**: Gives AI access to project file structure and code.

**Capabilities**:

- Read source files
- Navigate directory structure
- Understand project organization
- Access component/hook/page files

**Package**: `@modelcontextprotocol/server-filesystem`

### 3. Git MCP Server

**Purpose**: Provides version control context.

**Capabilities**:

- Git history
- Branch information
- Commit messages
- Diff analysis

**Package**: `@modelcontextprotocol/server-git`

### 4. GitHub MCP Server

**Purpose**: Integrates with GitHub API for repository context.

**Capabilities**:

- Issue details
- PR information
- Repository metadata
- Workflow status

**Package**: `@modelcontextprotocol/server-github`

## Configuration Files

### `.github/mcp-config.json`

Main MCP configuration for local development and IDE integration.

```json
{
  "inputs": [...],
  "servers": {
    "playwright": {...},
    "filesystem": {...},
    "git": {...},
    "github": {...}
  }
}
```

### `.github/workflows/mcp-config.json`

MCP configuration specifically for GitHub Actions workflows.

## How AI Uses MCP Servers

When the AI agent receives an issue:

1. **Playwright MCP** - Checks existing tests to understand testing patterns
2. **Filesystem MCP** - Scans relevant source files and components
3. **Git MCP** - Reviews recent changes and patterns
4. **GitHub MCP** - Gets issue details and repository context

This provides the AI with:

- ✅ Understanding of existing code patterns
- ✅ Knowledge of test structure
- ✅ Context about recent changes
- ✅ Project organization awareness

## Setup for Local Development

### VS Code Integration

1. Install the MCP extension for VS Code (if available)
2. The `.github/mcp-config.json` will be automatically detected
3. AI assistants (like Copilot) will use these servers for context

### Manual Testing

Test MCP servers locally:

```bash
# Test Playwright MCP
npx -y @executeautomation/playwright-mcp-server@latest

# Test Filesystem MCP
npx -y @modelcontextprotocol/server-filesystem@latest ./src

# Test Git MCP
npx -y @modelcontextprotocol/server-git@latest --repository .

# Test GitHub MCP (requires GITHUB_TOKEN)
export GITHUB_PERSONAL_ACCESS_TOKEN=your_token
npx -y @modelcontextprotocol/server-github@latest
```

## GitHub Actions Integration

The workflow automatically uses MCP servers when:

- An issue is created with `ai-implement` label
- The AI analyzes the codebase
- Code is generated
- Tests are created

### Environment Variables

Set these in GitHub Secrets for enhanced functionality:

```
GITHUB_TOKEN          # Auto-provided by GitHub
OPENAI_API_KEY        # Optional: For GPT-4 integration
ANTHROPIC_API_KEY     # Optional: For Claude integration
```

## Customization

### Adding More MCP Servers

Edit `.github/mcp-config.json`:

```json
{
  "servers": {
    "your-custom-mcp": {
      "command": "npx",
      "args": ["-y", "your-mcp-package@latest", "--your-options"],
      "env": {
        "YOUR_ENV_VAR": "${input:your-input-id}"
      }
    }
  }
}
```

### Restricting File Access

Limit filesystem MCP to specific directories:

```json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem@latest",
        "./src/components",
        "./src/hooks"
      ]
    }
  }
}
```

## Available MCP Servers

### Official MCP Servers

- `@modelcontextprotocol/server-filesystem` - File system access
- `@modelcontextprotocol/server-git` - Git operations
- `@modelcontextprotocol/server-github` - GitHub integration
- `@modelcontextprotocol/server-sqlite` - SQLite database
- `@modelcontextprotocol/server-postgres` - PostgreSQL

### Community MCP Servers

- `@executeautomation/playwright-mcp-server` - Playwright testing
- `@firebase/mcp-server` - Firebase integration (if available)
- Many more at https://github.com/modelcontextprotocol

## Benefits for AI Implementation

### Before MCP:

- AI has limited context about your codebase
- Generic code generation
- May not follow your patterns
- Limited test awareness

### With MCP:

- ✅ AI understands your code structure
- ✅ Follows existing patterns and conventions
- ✅ Generates consistent code style
- ✅ Creates tests matching your patterns
- ✅ Aware of recent changes and history
- ✅ Better error handling and edge cases

## Troubleshooting

### MCP Server Not Found

```bash
# Install globally
npm install -g @modelcontextprotocol/server-filesystem

# Or use npx -y to auto-install
npx -y @modelcontextprotocol/server-filesystem@latest
```

### Permission Issues

```bash
# Ensure npx can execute
chmod +x node_modules/.bin/*

# Or use sudo if needed
sudo npx -y @modelcontextprotocol/server-git@latest
```

### GitHub Token Issues

```bash
# Create a fine-grained token at:
# https://github.com/settings/tokens?type=beta

# Required scopes:
# - repo (all)
# - workflow
```

## Security Considerations

1. **Never commit tokens** to the repository
2. Use GitHub Secrets for sensitive data
3. Limit filesystem MCP to necessary directories only
4. Review MCP server permissions regularly
5. Use read-only access when possible

## Examples

### AI with Full Context

When you create an issue like:

```
Title: Add user authentication component

Requirements:
- Login form with email/password
- OAuth integration
- Remember me functionality
```

The AI will:

1. **Check existing auth patterns** (via Filesystem MCP)
2. **Review similar components** (via Git MCP)
3. **Understand test structure** (via Playwright MCP)
4. **Generate consistent code** matching your style
5. **Create appropriate tests** following your patterns

### Result:

Better, more contextual code that fits seamlessly into your project!

## Learn More

- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Available MCP Servers](https://github.com/modelcontextprotocol)
- [Creating Custom MCP Servers](https://modelcontextprotocol.io/docs/creating-servers)

---

**The AI workflow now has deep context about your project! 🎯**
