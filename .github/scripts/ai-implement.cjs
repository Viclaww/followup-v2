/**
 * AI Implementation Script
 * Uses AI to generate code changes based on GitHub issue description
 */

const fs = require("fs").promises;
const path = require("path");

class AIImplementer {
  constructor(apiKey, provider = "openai") {
    this.apiKey = apiKey;
    this.provider = provider;
  }

  async implement({ issueTitle, issueBody, workspace }) {
    console.log("🤖 Starting AI implementation...");
    console.log(`Issue: ${issueTitle}`);

    const filesChanged = [];
    const summary = [];

    try {
      // Parse issue to understand requirements
      const requirements = await this.parseRequirements(issueTitle, issueBody);

      // Analyze existing codebase
      const codebaseContext = await this.analyzeCodebase(workspace);

      // Generate implementation plan
      const plan = await this.generateImplementationPlan(
        requirements,
        codebaseContext
      );

      // Execute plan
      for (const task of plan.tasks) {
        console.log(`Executing: ${task.description}`);

        if (task.type === "create") {
          await this.createFile(workspace, task.file, task.content);
          filesChanged.push(task.file);
          summary.push(`✨ Created ${task.file}`);
        } else if (task.type === "modify") {
          await this.modifyFile(workspace, task.file, task.changes);
          filesChanged.push(task.file);
          summary.push(`📝 Modified ${task.file}`);
        } else if (task.type === "delete") {
          await this.deleteFile(workspace, task.file);
          summary.push(`🗑️ Deleted ${task.file}`);
        }
      }

      return {
        filesChanged,
        summary: summary.join("\n"),
        success: true,
      };
    } catch (error) {
      console.error("Error during implementation:", error);
      return {
        filesChanged: [],
        summary: `Failed to implement: ${error.message}`,
        success: false,
      };
    }
  }

  async parseRequirements(title, body) {
    // In production, this would call AI API
    // For now, basic parsing
    return {
      title,
      description: body,
      type: this.detectIssueType(title, body),
      complexity: this.estimateComplexity(body),
    };
  }

  detectIssueType(title, body) {
    const text = `${title} ${body}`.toLowerCase();

    if (
      text.includes("bug") ||
      text.includes("fix") ||
      text.includes("error")
    ) {
      return "bugfix";
    } else if (
      text.includes("feature") ||
      text.includes("add") ||
      text.includes("implement")
    ) {
      return "feature";
    } else if (text.includes("refactor") || text.includes("improve")) {
      return "refactor";
    } else if (text.includes("test")) {
      return "test";
    }

    return "other";
  }

  estimateComplexity(body) {
    const length = body?.length || 0;
    if (length < 200) return "simple";
    if (length < 500) return "medium";
    return "complex";
  }

  async analyzeCodebase(workspace) {
    const context = {
      components: [],
      hooks: [],
      pages: [],
      types: [],
    };

    try {
      // Scan components
      const componentsDir = path.join(workspace, "src/components");
      const components = await fs.readdir(componentsDir, { recursive: true });
      context.components = components.filter(
        (f) => f.endsWith(".tsx") || f.endsWith(".ts")
      );

      // Scan hooks
      const hooksDir = path.join(workspace, "src/hooks");
      const hooks = await fs.readdir(hooksDir);
      context.hooks = hooks.filter(
        (f) => f.endsWith(".ts") || f.endsWith(".tsx")
      );

      // Scan pages
      const pagesDir = path.join(workspace, "src/pages");
      const pages = await fs.readdir(pagesDir);
      context.pages = pages.filter((f) => f.endsWith(".tsx"));
    } catch (error) {
      console.log("Error analyzing codebase:", error.message);
    }

    return context;
  }

  async generateImplementationPlan(requirements, context) {
    // This is a simplified version
    // In production, this would use AI to generate a detailed plan

    const plan = {
      tasks: [],
    };

    if (requirements.type === "feature") {
      // Example: Add new component
      plan.tasks.push({
        type: "create",
        file: `src/components/${this.kebabCase(requirements.title)}.tsx`,
        content: this.generateComponentTemplate(requirements.title),
        description: `Create new component for ${requirements.title}`,
      });
    } else if (requirements.type === "bugfix") {
      // Identify files to fix based on requirements
      // This would use AI to determine affected files
      plan.tasks.push({
        type: "modify",
        file: "src/App.tsx", // Placeholder
        changes: [],
        description: "Fix identified issue",
      });
    }

    return plan;
  }

  generateComponentTemplate(name) {
    const componentName = this.pascalCase(name);

    return `import { FC } from 'react';

interface ${componentName}Props {
  // TODO: Define props
}

export const ${componentName}: FC<${componentName}Props> = (props) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">${componentName}</h2>
      {/* TODO: Implement component */}
    </div>
  );
};
`;
  }

  async createFile(workspace, filePath, content) {
    const fullPath = path.join(workspace, filePath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, content, "utf8");

    console.log(`✅ Created ${filePath}`);
  }

  async modifyFile(workspace, filePath, changes) {
    const fullPath = path.join(workspace, filePath);

    try {
      let content = await fs.readFile(fullPath, "utf8");

      // Apply changes (simplified)
      for (const change of changes) {
        content = content.replace(change.old, change.new);
      }

      await fs.writeFile(fullPath, content, "utf8");
      console.log(`✅ Modified ${filePath}`);
    } catch (error) {
      console.error(`Error modifying ${filePath}:`, error);
    }
  }

  async deleteFile(workspace, filePath) {
    const fullPath = path.join(workspace, filePath);
    await fs.unlink(fullPath);
    console.log(`✅ Deleted ${filePath}`);
  }

  kebabCase(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  pascalCase(str) {
    return str
      .replace(/[^a-z0-9]+/gi, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }
}

module.exports = {
  implement: async (options) => {
    const implementer = new AIImplementer(options.apiKey);
    return await implementer.implement(options);
  },
};

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const arg = args.find((a) => a.startsWith(`--${name}=`));
    return arg ? arg.split("=")[1] : "";
  };

  const options = {
    issueNumber: getArg("issue-number"),
    issueTitle: getArg("issue-title"),
    issueBody: getArg("issue-body"),
    workspace: process.env.GITHUB_WORKSPACE || process.cwd(),
    apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
    mcpConfigPath: process.env.MCP_CONFIG_PATH,
  };

  (async () => {
    try {
      const implementer = new AIImplementer(options.apiKey);
      const result = await implementer.implement(options);
      
      // Output results for GitHub Actions (using GITHUB_OUTPUT)
      const fs = require("fs");
      if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `files_changed=${result.filesChanged.join(',')}\n`
        );
        
        // Handle summary as either string or array
        const summaryText = Array.isArray(result.summary) 
          ? result.summary.join('\\n') 
          : result.summary;
        
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `implementation_summary=${summaryText}\n`
        );
      }
      
      console.log("\n✅ Implementation complete!");
      console.log(`Files changed: ${result.filesChanged.join(', ')}`);
      process.exit(0);
    } catch (error) {
      console.error("❌ Implementation failed:", error.message);
      process.exit(1);
    }
  })();
}
