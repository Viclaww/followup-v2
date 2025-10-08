#!/usr/bin/env node

/**
 * Project Context MCP Server
 * Provides project structure, dependencies, and coding patterns
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

const server = new Server(
  {
    name: "project-context-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_project_structure",
        description: "Get project directory structure and organization",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_dependencies",
        description: "Get project dependencies and their purposes",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_coding_patterns",
        description: "Get established coding patterns and conventions",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_component_patterns",
        description: "Get React component patterns used in the project",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_available_components",
        description: "List all available UI components from shadcn/ui",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Tool execution handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  try {
    switch (name) {
      case "get_project_structure": {
        const structure = {
          "src/": {
            "components/": "React components (feature components and ui/)",
            "components/ui/":
              "shadcn/ui components (Button, Card, Dialog, etc.)",
            "hooks/": "Custom React hooks",
            "lib/": "Utility functions (utils.ts)",
            "pages/": "Route pages (Index.tsx, NotFound.tsx)",
            "screens/": "Screen components (dashboard, analytics, etc.)",
            "types/": "TypeScript type definitions",
          },
          "tests/": {
            "e2e/": "Playwright E2E tests",
            "unit/": "Vitest unit tests",
          },
          ".github/": {
            "workflows/": "GitHub Actions workflows",
            "scripts/": "AI automation scripts",
            "mcp-servers/": "MCP servers for AI context",
          },
        };

        return {
          content: [
            {
              type: "text",
              text: `Project Structure:\n\n${JSON.stringify(
                structure,
                null,
                2
              )}`,
            },
          ],
        };
      }

      case "get_dependencies": {
        const pkg = JSON.parse(
          await fs.readFile(path.join(projectRoot, "package.json"), "utf-8")
        );

        const keyDeps = {
          react: "UI library",
          "react-router-dom": "Client-side routing",
          "@tanstack/react-query": "Data fetching and caching",
          "@radix-ui/*": "Headless UI primitives (for shadcn/ui)",
          tailwindcss: "Utility-first CSS",
          "lucide-react": "Icon library",
          zod: "Schema validation",
          "react-hook-form": "Form management",
          sonner: "Toast notifications",
          "next-themes": "Theme management",
          "date-fns": "Date utilities",
        };

        return {
          content: [
            {
              type: "text",
              text: `Key Dependencies:\n\n${JSON.stringify(
                keyDeps,
                null,
                2
              )}\n\nFull package.json:\n${JSON.stringify(
                pkg.dependencies,
                null,
                2
              )}`,
            },
          ],
        };
      }

      case "get_coding_patterns": {
        const patterns = {
          imports: {
            absolute: "Use @/ for absolute imports (configured in tsconfig)",
            example: `import { Button } from '@/components/ui/button';
import { useFollowups } from '@/hooks/use-followups';`,
          },
          styling: {
            approach: "Tailwind CSS utility classes",
            utilities: "cn() from @/lib/utils for conditional classes",
            example: `<div className={cn('flex gap-4', isActive && 'bg-primary')}>`,
          },
          components: {
            pattern: "Functional components with TypeScript",
            props: "Use interfaces for prop types",
            example: `interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export const Component: FC<ComponentProps> = ({ title, onAction }) => {
  return <div>{title}</div>;
};`,
          },
          stateManagement: {
            local: "useState for local state",
            server: "React Query for server state",
            forms: "react-hook-form with zod validation",
          },
          fileNaming: {
            components: "PascalCase.tsx",
            hooks: "kebab-case.ts (use-hook-name.ts)",
            utils: "camelCase.ts",
          },
        };

        return {
          content: [
            {
              type: "text",
              text: `Coding Patterns:\n\n${JSON.stringify(patterns, null, 2)}`,
            },
          ],
        };
      }

      case "get_component_patterns": {
        const patterns = {
          basicComponent: `import { FC } from 'react';

interface Props {
  title: string;
}

export const MyComponent: FC<Props> = ({ title }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
};`,

          withState: `import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';

export const Counter: FC = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="flex gap-2">
      <Button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </Button>
    </div>
  );
};`,

          withForm: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginForm: FC = () => {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('email')} />
      <Button type="submit">Submit</Button>
    </form>
  );
};`,
        };

        return {
          content: [
            {
              type: "text",
              text: `Component Patterns:\n\n${JSON.stringify(
                patterns,
                null,
                2
              )}`,
            },
          ],
        };
      }

      case "get_available_components": {
        const componentsDir = path.join(projectRoot, "src/components/ui");
        const files = await fs.readdir(componentsDir);
        const components = files
          .filter((f) => f.endsWith(".tsx"))
          .map((f) => f.replace(".tsx", ""));

        const imports = components.map(
          (c) =>
            `import { ${c
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join("")} } from '@/components/ui/${c}';`
        );

        return {
          content: [
            {
              type: "text",
              text: `Available shadcn/ui Components:\n\n${components.join(
                "\n"
              )}\n\nExample Imports:\n${imports
                .slice(0, 10)
                .join("\n")}\n\nTotal: ${components.length} components`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("Project Context MCP Server running on stdio");
