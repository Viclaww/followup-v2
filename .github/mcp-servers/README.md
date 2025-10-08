# MCP Servers for AI Workflow

This directory contains Model Context Protocol (MCP) servers that provide rich context to the AI during code implementation.

## Available MCP Servers

### 1. Playwright MCP Server

**File:** `playwright-mcp.js`  
**Purpose:** Provides context about E2E testing patterns

**Tools:**

- `get_playwright_config` - Returns Playwright configuration
- `list_e2e_tests` - Lists all E2E test files
- `get_test_patterns` - Common test patterns and examples
- `get_page_objects` - Available selectors and page objects
- `get_test_utils` - Custom test utilities

### 2. Firebase MCP Server

**File:** `firebase-mcp.js`  
**Purpose:** Provides context about Firebase setup and patterns

**Tools:**

- `get_firebase_config` - Firebase configuration and setup
- `get_firestore_schema` - Firestore collections and schema
- `get_firebase_patterns` - Common Firebase usage patterns
- `get_firebase_hooks` - Custom Firebase hooks

### 3. Project Context MCP Server

**File:** `project-context-mcp.js`  
**Purpose:** Provides project structure and coding conventions

**Tools:**

- `get_project_structure` - Project directory organization
- `get_dependencies` - Dependencies and their purposes
- `get_coding_patterns` - Coding conventions and patterns
- `get_component_patterns` - React component patterns
- `get_available_components` - List of shadcn/ui components

### 4. Filesystem MCP Server

**Package:** `@modelcontextprotocol/server-filesystem`  
**Purpose:** Read-only access to src/ and tests/ directories

## Configuration

MCP servers are configured in `mcp.json` at the project root:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": [".github/mcp-servers/playwright-mcp.js"]
    },
    "firebase": {
      "command": "node",
      "args": [".github/mcp-servers/firebase-mcp.js"]
    },
    "project-context": {
      "command": "node",
      "args": [".github/mcp-servers/project-context-mcp.js"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "./src",
        "./tests"
      ]
    }
  }
}
```

## How It Works

1. **AI Implementation Phase**: When the AI analyzes an issue, it can query MCP servers for context
2. **Context Gathering**: MCP servers provide project-specific information (patterns, configs, dependencies)
3. **Code Generation**: AI uses this context to generate code that matches your project conventions
4. **Test Generation**: AI uses Playwright MCP to create appropriate E2E tests

## Integration with AI Workflow

The AI implementation script (`.github/scripts/ai-implement.cjs`) can be enhanced to use MCP servers:

```javascript
// Query MCP for project context
const projectContext = await mcpClient.callTool(
  "project-context",
  "get_coding_patterns"
);
const availableComponents = await mcpClient.callTool(
  "project-context",
  "get_available_components"
);
const testPatterns = await mcpClient.callTool(
  "playwright",
  "get_test_patterns"
);

// Use context in code generation
const code = generateCode({
  context: projectContext,
  components: availableComponents,
  patterns: testPatterns,
});
```

## Benefits

1. **Accurate Code Generation**: AI knows your project's patterns and conventions
2. **Consistent Style**: Generated code matches existing codebase
3. **Better Tests**: AI generates tests using your established patterns
4. **Firebase Integration**: AI understands your data models and Firebase setup
5. **Component Awareness**: AI knows available shadcn/ui components

## Running MCP Servers

MCP servers are automatically started by GitHub Actions workflows when needed. For local development:

```bash
# Test individual MCP server
node .github/mcp-servers/playwright-mcp.js

# MCP servers communicate via stdio
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node .github/mcp-servers/playwright-mcp.js
```

## Adding Custom MCP Servers

To add a new MCP server:

1. Create a new file in `.github/mcp-servers/`
2. Implement the MCP server protocol
3. Add configuration to `mcp.json`
4. Update this README

Example template:

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: { tools: {} },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "my_tool",
        description: "Does something useful",
        inputSchema: { type: "object", properties: {} },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Implementation
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Playwright Docs](https://playwright.dev)
- [Firebase Docs](https://firebase.google.com/docs)
