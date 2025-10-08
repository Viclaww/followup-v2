# MCP Integration Guide

## What are MCP Servers?

Model Context Protocol (MCP) servers provide structured context to AI systems, enabling them to understand your project's specific patterns, configurations, and conventions.

## Installed MCP Servers

### 1. **Playwright MCP** 🎭

Gives AI context about your E2E testing:

- Test patterns and examples
- Available selectors and page objects
- Test utilities and helpers
- Playwright configuration

### 2. **Firebase MCP** 🔥

Provides Firebase-specific context:

- Firebase configuration and setup
- Firestore schema and collections
- Common Firebase patterns (CRUD operations)
- Custom Firebase hooks

### 3. **Project Context MCP** 📁

Shares project structure and conventions:

- Directory organization
- Coding patterns and conventions
- Available UI components (shadcn/ui)
- Component patterns and examples
- Dependencies and their purposes

### 4. **Filesystem MCP** 📂

Read-only access to:

- `src/` directory
- `tests/` directory

## How AI Uses MCP

When the AI implements features from GitHub issues, it:

1. **Queries MCP servers** for relevant context
2. **Learns your patterns** (naming, structure, styling)
3. **Discovers available components** (shadcn/ui)
4. **Understands test patterns** (Playwright E2E)
5. **Knows Firebase setup** (collections, hooks)
6. **Generates matching code** that fits your project

## Configuration

MCP servers are configured in `mcp.json`:

```json
{
  "mcpServers": {
    "playwright": { ... },
    "firebase": { ... },
    "project-context": { ... },
    "filesystem": { ... }
  }
}
```

## Benefits

### Before MCP:

- ❌ AI generates generic code
- ❌ Doesn't know available components
- ❌ Inconsistent with project patterns
- ❌ Wrong Firebase usage patterns

### With MCP:

- ✅ AI generates project-specific code
- ✅ Uses your shadcn/ui components
- ✅ Follows your coding conventions
- ✅ Correct Firebase patterns
- ✅ Proper test patterns

## Example: AI Implementation with MCP

### Issue: "Add user profile card"

**Without MCP:**

```tsx
// Generic implementation
export function UserProfile({ user }) {
  return (
    <div className="card">
      <img src={user.avatar} />
      <h3>{user.name}</h3>
    </div>
  );
}
```

**With MCP (AI knows your patterns):**

```tsx
// Uses your project's patterns
import { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileProps {
  user: {
    name: string;
    avatar?: string;
  };
}

export const UserProfile: FC<UserProfileProps> = ({ user }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className="text-2xl font-bold">{user.name}</h3>
        </div>
      </CardHeader>
    </Card>
  );
};
```

## Testing MCP Servers

### List available tools:

```bash
# Playwright MCP
node .github/mcp-servers/playwright-mcp.js

# Firebase MCP
node .github/mcp-servers/firebase-mcp.js

# Project Context MCP
node .github/mcp-servers/project-context-mcp.js
```

### Query a tool (example):

```bash
echo '{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_available_components"
  },
  "id": 1
}' | node .github/mcp-servers/project-context-mcp.js
```

## Enhancing AI Implementation

The MCP servers are automatically used by the AI workflow. To manually enhance the AI implementation script:

```javascript
// In .github/scripts/ai-implement.js

// Import MCP client
import { MCPClient } from "@modelcontextprotocol/sdk/client/index.js";

// Query MCP servers
async function gatherContext() {
  const mcpClient = new MCPClient();

  // Get coding patterns
  const patterns = await mcpClient.callTool(
    "project-context",
    "get_coding_patterns"
  );

  // Get available components
  const components = await mcpClient.callTool(
    "project-context",
    "get_available_components"
  );

  // Get Firebase patterns
  const firebasePatterns = await mcpClient.callTool(
    "firebase",
    "get_firebase_patterns"
  );

  // Get test patterns
  const testPatterns = await mcpClient.callTool(
    "playwright",
    "get_test_patterns"
  );

  return { patterns, components, firebasePatterns, testPatterns };
}

// Use in code generation
const context = await gatherContext();
const generatedCode = generateCodeWithContext(issueDescription, context);
```

## Adding More MCP Servers

You can add custom MCP servers for:

- **API Routes**: Document your API endpoints
- **Database Schema**: Share database structure
- **Design System**: Document design tokens
- **Business Logic**: Share domain-specific patterns

See `.github/mcp-servers/README.md` for implementation details.

## Troubleshooting

### MCP server not responding:

```bash
# Check if Node.js can run the server
node .github/mcp-servers/playwright-mcp.js
```

### Missing dependencies:

```bash
# Install MCP SDK
npm install --save-dev @modelcontextprotocol/sdk
```

### Test MCP integration:

```bash
# Run the enhanced AI workflow
node .github/scripts/ai-implement.js --test-mcp
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- [Project MCP Servers](.github/mcp-servers/README.md)
- [AI Workflow Documentation](./AI_WORKFLOW.md)

---

**With MCP, your AI generates code that truly understands your project! 🚀**
