#!/usr/bin/env node

/**
 * GitHub Copilot/Models Implementation Script
 * Uses GitHub Models API (free for Actions) to generate code
 */

const fs = require("fs").promises;
const path = require("path");
const { execSync } = require("child_process");

class GitHubCopilotImplementer {
  constructor(githubToken) {
    this.githubToken = githubToken;
    this.apiUrl = "https://models.inference.ai.azure.com";
  }

  async implement({ issueTitle, issueBody, workspace }) {
    console.log("🤖 Starting GitHub Copilot implementation...");
    console.log(`Issue: ${issueTitle}`);

    try {
      // Get project context
      const projectContext = await this.getProjectContext(workspace);
      
      // Use GitHub Models API (GPT-4o or similar)
      const implementation = await this.generateWithCopilot({
        issueTitle,
        issueBody,
        projectContext
      });

      // Apply changes
      const filesChanged = [];
      const summary = [];

      for (const change of implementation.changes) {
        const filePath = path.join(workspace, change.file);
        
        if (change.action === "create") {
          await fs.mkdir(path.dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, change.content);
          filesChanged.push(change.file);
          summary.push(`✨ Created ${change.file}`);
          console.log(`✅ Created ${change.file}`);
        } else if (change.action === "modify") {
          const existing = await fs.readFile(filePath, "utf-8");
          const updated = this.applyChanges(existing, change.modifications);
          await fs.writeFile(filePath, updated);
          filesChanged.push(change.file);
          summary.push(`📝 Modified ${change.file}`);
          console.log(`✅ Modified ${change.file}`);
        }
      }

      return {
        filesChanged,
        summary: summary.join("\n"),
        success: true,
      };
    } catch (error) {
      console.error("❌ Implementation failed:", error.message);
      return {
        filesChanged: [],
        summary: `Failed: ${error.message}`,
        success: false,
      };
    }
  }

  async generateWithCopilot({ issueTitle, issueBody, projectContext }) {
    // Check if we have GitHub token for Models API
    if (!this.githubToken) {
      console.log("⚠️  No GitHub token - using template fallback");
      return this.templateFallback({ issueTitle, issueBody, projectContext });
    }

    try {
      // Call GitHub Models API
      // Note: Using GitHub's API endpoint for models marketplace
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.githubToken}`,
          "api-key": this.githubToken, // Azure-style header as fallback
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(projectContext),
            },
            {
              role: "user",
              content: this.getUserPrompt(issueTitle, issueBody),
            },
          ],
          model: "gpt-4o",
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub Models API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Parse AI response to extract file changes
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.log(`⚠️  API call failed: ${error.message}, using template fallback`);
      return this.templateFallback({ issueTitle, issueBody, projectContext });
    }
  }

  async loadContextFiles() {
    const contextDir = path.join(__dirname, "..", "copilot-rules");
    const contextFiles = [];
    
    try {
      const files = await fs.readdir(contextDir);
      
      for (const file of files) {
        if (file.endsWith(".md")) {
          const content = await fs.readFile(path.join(contextDir, file), "utf-8");
          contextFiles.push({
            name: file,
            content: content,
          });
        }
      }
      
      console.log(`📚 Loaded ${contextFiles.length} context files`);
    } catch (error) {
      console.log("⚠️  No context files found, using basic prompts");
    }
    
    return contextFiles;
  }

  async getSystemPrompt(projectContext) {
    // Load context files (like Windsurf Rules)
    const contextFiles = await this.loadContextFiles();
    
    let contextSection = "";
    if (contextFiles.length > 0) {
      contextSection = "\n\n## Project Context & Best Practices\n\n";
      for (const file of contextFiles) {
        contextSection += `### From ${file.name}\n${file.content}\n\n---\n\n`;
      }
    }
    
    return `You are an expert React/TypeScript developer. Generate code changes for the following project:

Project Stack:
${projectContext.stack}

Available Components:
${projectContext.components.join(", ")}
${contextSection}

Return your response as a JSON object with this structure:
{
  "changes": [
    {
      "file": "relative/path/to/file.tsx",
      "action": "create" | "modify",
      "content": "full file content for create",
      "modifications": "description of changes for modify"
    }
  ],
  "explanation": "Brief explanation of changes"
}

CRITICAL: Follow ALL patterns from the context files above. Use existing components, follow exact TypeScript patterns, and implement tests as specified.`;
  }

  getUserPrompt(issueTitle, issueBody) {
    return `Implement the following feature:

Title: ${issueTitle}

${issueBody}

Generate the necessary React components and TypeScript code.`;
  }

  async getProjectContext(workspace) {
    try {
      // Read package.json for dependencies
      const packageJson = JSON.parse(
        await fs.readFile(path.join(workspace, "package.json"), "utf-8")
      );

      // List shadcn/ui components
      const componentsDir = path.join(workspace, "src/components/ui");
      let components = [];
      try {
        components = await fs.readdir(componentsDir);
        components = components.map((f) => f.replace(".tsx", ""));
      } catch (e) {
        // Components dir might not exist
      }

      return {
        stack: `React ${packageJson.dependencies?.react || "18"}, TypeScript, Vite, Tailwind CSS, shadcn/ui`,
        components,
        dependencies: Object.keys(packageJson.dependencies || {}),
      };
    } catch (error) {
      return {
        stack: "React, TypeScript, Vite, Tailwind CSS",
        components: ["button", "card", "dialog"],
        dependencies: [],
      };
    }
  }

  parseAIResponse(aiResponse) {
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) ||
                       aiResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }

      throw new Error("No valid JSON found in AI response");
    } catch (error) {
      console.log("Failed to parse AI response, using fallback");
      return this.templateFallback({ issueTitle: "", issueBody: "", projectContext: {} });
    }
  }

  templateFallback({ issueTitle, issueBody, projectContext }) {
    // Basic template implementation when API is unavailable
    const componentName = this.extractComponentName(issueTitle);
    const fileName = `src/components/${componentName}.tsx`;

    return {
      changes: [
        {
          file: fileName,
          action: "create",
          content: this.generateBasicComponent(componentName, issueBody),
        },
      ],
      explanation: `Created basic ${componentName} component`,
    };
  }

  extractComponentName(title) {
    // Extract component name from title like "Add CustomerCareButton"
    const match = title.match(/add\s+(\w+)/i);
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
    return "NewComponent";
  }

  generateBasicComponent(name, description) {
    return `import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * ${name}
 * ${description.split('\n')[0] || 'Component description'}
 */
export function ${name}() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button>
        ${name}
      </Button>
    </div>
  );
}
`;
  }

  applyChanges(existing, modifications) {
    // For now, just return existing content
    // In a real implementation, this would apply specific modifications
    return existing + `\n// TODO: ${modifications}\n`;
  }
}

// CLI Interface
if (require.main === module) {
  const getArg = (name) => {
    const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
    return arg ? arg.split("=")[1] : "";
  };

  const options = {
    issueNumber: getArg("issue-number"),
    issueTitle: getArg("issue-title"),
    issueBody: getArg("issue-body"),
    workspace: process.env.GITHUB_WORKSPACE || process.cwd(),
    githubToken: process.env.GITHUB_TOKEN,
  };

  (async () => {
    try {
      const implementer = new GitHubCopilotImplementer(options.githubToken);
      const result = await implementer.implement(options);

      // Output for GitHub Actions
      if (process.env.GITHUB_OUTPUT) {
        const fs = require("fs");
        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `files_changed=${result.filesChanged.join(",")}\n`
        );

        const summaryText = Array.isArray(result.summary)
          ? result.summary.join("\\n")
          : result.summary;

        fs.appendFileSync(
          process.env.GITHUB_OUTPUT,
          `implementation_summary=${summaryText}\n`
        );
      }

      console.log("\n✅ Implementation complete!");
      console.log(`Files changed: ${result.filesChanged.join(", ")}`);
      process.exit(0);
    } catch (error) {
      console.error("❌ Implementation failed:", error.message);
      process.exit(1);
    }
  })();
}

module.exports = { GitHubCopilotImplementer };
