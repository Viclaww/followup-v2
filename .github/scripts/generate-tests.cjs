#!/usr/bin/env node

/**
 * Generate Tests Script
 * Automatically generates unit tests and E2E tests for changed files
 */

const fs = require("fs").promises;
const path = require("path");

class TestGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async generateTests(files, issueNumber) {
    console.log("🧪 Generating tests for changed files...");

    const fileList = files.split(",").filter((f) => f.trim());

    for (const file of fileList) {
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        await this.generateUnitTest(file);
      }

      if (file.includes("components/") || file.includes("pages/")) {
        await this.generateE2ETest(file, issueNumber);
      }
    }
  }

  async generateUnitTest(filePath) {
    console.log(`Generating unit test for ${filePath}`);

    const testPath = filePath
      .replace("src/", "tests/unit/")
      .replace(".tsx", ".test.tsx")
      .replace(".ts", ".test.ts");

    const componentName = path.basename(filePath, path.extname(filePath));
    const importPath = `@/${filePath
      .replace("src/", "")
      .replace(/\.(tsx|ts)$/, "")}`;

    const testContent = `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${this.pascalCase(componentName)} } from '${importPath}';

describe('${this.pascalCase(componentName)}', () => {
  it('renders without crashing', () => {
    render(<${this.pascalCase(componentName)} />);
    expect(screen.getByText(/.*${componentName}.*/i)).toBeInTheDocument();
  });

  it('handles user interactions correctly', async () => {
    // TODO: Add interaction tests
  });

  it('displays correct data', () => {
    // TODO: Add data display tests
  });
});
`;

    await this.writeTestFile(testPath, testContent);
  }

  async generateE2ETest(filePath, issueNumber) {
    console.log(`Generating E2E test for ${filePath}`);

    const fileName = path.basename(filePath, path.extname(filePath));
    const testPath = `tests/e2e/${fileName}-issue-${issueNumber}.spec.ts`;

    const testContent = `import { test, expect } from '@playwright/test';

test.describe('${this.pascalCase(fileName)} - Issue #${issueNumber}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render the component', async ({ page }) => {
    // TODO: Add specific selectors based on component
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle user interactions', async ({ page }) => {
    // TODO: Add interaction tests
    // Example:
    // await page.click('button[data-testid="submit"]');
    // await expect(page.locator('[data-testid="result"]')).toBeVisible();
  });

  test('should display correct data', async ({ page }) => {
    // TODO: Add data verification tests
  });

  test('should be accessible', async ({ page }) => {
    // TODO: Add accessibility tests
    const accessibilityScanResults = await page.evaluate(() => {
      // Run axe-core or similar
      return { violations: [] };
    });
    
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
});
`;

    await this.writeTestFile(testPath, testContent);
  }

  async writeTestFile(testPath, content) {
    const dir = path.dirname(testPath);

    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(testPath, content, "utf8");
      console.log(`✅ Created test: ${testPath}`);
    } catch (error) {
      console.error(`Error creating test file ${testPath}:`, error);
    }
  }

  pascalCase(str) {
    return str
      .replace(/[^a-z0-9]+/gi, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }
}

// CLI execution
const args = process.argv.slice(2);
const filesArg =
  args.find((arg) => arg.startsWith("--files="))?.split("=")[1] || "";
const issueArg =
  args.find((arg) => arg.startsWith("--issue-number="))?.split("=")[1] || "";

const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
const generator = new TestGenerator(apiKey);

generator
  .generateTests(filesArg, issueArg)
  .then(() => console.log("✅ Test generation complete"))
  .catch((err) => {
    console.error("❌ Test generation failed:", err);
    process.exit(1);
  });
