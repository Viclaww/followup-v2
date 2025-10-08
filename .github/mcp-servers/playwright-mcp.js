#!/usr/bin/env node

/**
 * Playwright MCP Server
 * Provides context about E2E tests, patterns, and utilities
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
    name: "playwright-mcp-server",
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
        name: "get_playwright_config",
        description: "Get Playwright configuration and test setup",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "list_e2e_tests",
        description: "List all E2E test files and their descriptions",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_test_patterns",
        description: "Get common E2E test patterns and examples",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_page_objects",
        description: "Get available page objects and selectors",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_test_utils",
        description: "Get custom test utilities and helpers",
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
      case "get_playwright_config": {
        const configPath = path.join(projectRoot, "playwright.config.ts");
        const config = await fs.readFile(configPath, "utf-8");

        return {
          content: [
            {
              type: "text",
              text: `Playwright Configuration:\n\n${config}\n\nKey Features:\n- Multiple browser testing (Chromium, Firefox, WebKit)\n- Mobile viewport testing\n- Screenshots and videos on failure\n- HTML reports\n- Dev server integration`,
            },
          ],
        };
      }

      case "list_e2e_tests": {
        const testsDir = path.join(projectRoot, "tests/e2e");
        const files = await fs.readdir(testsDir, { recursive: true });
        const testFiles = files.filter((f) => f.endsWith(".spec.ts"));

        const testInfo = await Promise.all(
          testFiles.map(async (file) => {
            const content = await fs.readFile(
              path.join(testsDir, file),
              "utf-8"
            );
            const describes =
              content.match(/test\.describe\(['"`](.+?)['"`]/g) || [];
            const tests = content.match(/test\(['"`](.+?)['"`]/g) || [];

            return {
              file,
              describes: describes.map((d) => d.match(/['"`](.+?)['"`]/)[1]),
              tests: tests.map((t) => t.match(/['"`](.+?)['"`]/)[1]),
            };
          })
        );

        return {
          content: [
            {
              type: "text",
              text: `E2E Tests:\n\n${JSON.stringify(
                testInfo,
                null,
                2
              )}\n\nTotal test files: ${testFiles.length}`,
            },
          ],
        };
      }

      case "get_test_patterns": {
        const patterns = {
          basicTest: `test('should render component', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="component"]')).toBeVisible();
});`,
          interactionTest: `test('should handle user interaction', async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-testid="submit"]');
  await expect(page.locator('[data-testid="result"]')).toHaveText('Success');
});`,
          formTest: `test('should submit form', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*dashboard/);
});`,
          mobileTest: `test('should be responsive', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
});`,
          apiMockTest: `test('should mock API', async ({ page }) => {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ users: [] }),
    });
  });
  await page.goto('/');
});`,
        };

        return {
          content: [
            {
              type: "text",
              text: `Common E2E Test Patterns:\n\n${JSON.stringify(
                patterns,
                null,
                2
              )}`,
            },
          ],
        };
      }

      case "get_page_objects": {
        const pageObjects = {
          selectors: {
            "data-testid": "Primary selector pattern (preferred)",
            role: "Accessibility-first selectors",
            text: "Text-based selectors for visible content",
          },
          examples: {
            button: "page.locator('button[data-testid=\"submit\"]')",
            input: "page.locator('input[name=\"email\"]')",
            heading: "page.getByRole('heading', { name: \"Welcome\" })",
            link: "page.getByRole('link', { name: \"Home\" })",
          },
        };

        return {
          content: [
            {
              type: "text",
              text: `Page Objects & Selectors:\n\n${JSON.stringify(
                pageObjects,
                null,
                2
              )}`,
            },
          ],
        };
      }

      case "get_test_utils": {
        const utils = {
          helpers: {
            login: `async function login(page, email, password) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/);
}`,
            waitForData: `async function waitForData(page, selector) {
  await page.waitForSelector(selector);
  await page.waitForLoadState('networkidle');
}`,
            screenshot: `async function takeScreenshot(page, name) {
  await page.screenshot({ path: \`screenshots/\${name}.png\` });
}`,
          },
          fixtures: {
            authenticatedPage: "Custom fixture for authenticated sessions",
            mockApi: "Custom fixture for API mocking",
          },
        };

        return {
          content: [
            {
              type: "text",
              text: `Test Utilities:\n\n${JSON.stringify(utils, null, 2)}`,
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

console.error("Playwright MCP Server running on stdio");
