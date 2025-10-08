#!/usr/bin/env node

/**
 * GitHub Issue Template Generator
 * Creates well-structured GitHub issues for AI implementation
 */

const readline = require("readline");
const { execSync } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function generateIssue() {
  console.log("🤖 GitHub Issue Generator for AI Workflow\n");

  const type = await question("Issue type? (feature/bug): ");
  const title = await question("Title: ");
  const description = await question("Description: ");

  let issueBody = "";

  if (type === "feature" || type === "f") {
    const requirements = await question("Requirements (comma separated): ");
    const criteria = await question("Acceptance criteria (comma separated): ");

    issueBody = `## Feature Description
${description}

## Requirements
${requirements
  .split(",")
  .map((r) => `- ${r.trim()}`)
  .join("\n")}

## Acceptance Criteria
${criteria
  .split(",")
  .map((c) => `- [ ] ${c.trim()}`)
  .join("\n")}

## Additional Context
<!-- Add any other context here -->
`;
  } else {
    const steps = await question("Steps to reproduce (comma separated): ");
    const expected = await question("Expected behavior: ");
    const actual = await question("Actual behavior: ");

    issueBody = `## Bug Description
${description}

## Steps to Reproduce
${steps
  .split(",")
  .map((s, i) => `${i + 1}. ${s.trim()}`)
  .join("\n")}

## Expected Behavior
${expected}

## Actual Behavior
${actual}

## Environment
- Browser: 
- OS: 
- Device: 
`;
  }

  console.log("\n📋 Generated Issue:\n");
  console.log(`Title: ${title}`);
  console.log(`\n${issueBody}`);

  const create = await question("\nCreate this issue on GitHub? (yes/no): ");

  if (create.toLowerCase() === "yes" || create.toLowerCase() === "y") {
    try {
      // Create issue using GitHub CLI
      const escapedBody = issueBody.replace(/"/g, '\\"').replace(/\n/g, "\\n");
      const cmd = `gh issue create --title "${title}" --body "${escapedBody}" --label "ai-implement"`;

      const result = execSync(cmd, { encoding: "utf8" });
      console.log("\n✅ Issue created successfully!");
      console.log(result);
    } catch (error) {
      console.error(
        "\n❌ Error creating issue. Make sure GitHub CLI is installed and authenticated."
      );
      console.log("\nYou can install it with: brew install gh");
      console.log("And authenticate with: gh auth login");
      console.log(
        "\nAlternatively, copy the issue content above and create it manually on GitHub."
      );
    }
  }

  rl.close();
}

generateIssue().catch(console.error);
