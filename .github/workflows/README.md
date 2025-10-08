# AI-Driven Development Workflow

This directory contains the automated AI development workflow for the project.

## 🤖 Overview

The AI development workflow automates the entire development cycle from issue creation to PR merge:

1. **Issue Created** → AI analyzes and creates implementation branch
2. **Code Implementation** → AI generates code changes and tests
3. **Pull Request** → Automatically created with changes
4. **CI/CD Tests** → Linting, type checking, E2E tests
5. **Auto-Fix** → AI automatically fixes any failures
6. **Manual Review** → Human reviews and merges when green

## 📁 Workflow Files

### `issue-to-pr.yml`

Triggered when an issue is created or labeled with `ai-implement`. This workflow:

- Creates a new branch named `ai/issue-{number}-{title}`
- Analyzes the issue description
- Generates code implementation using AI
- Creates unit tests and Playwright E2E tests
- Commits changes and creates a Pull Request

### `pr-checks.yml`

Triggered when a PR is opened or updated. This workflow:

- Runs ESLint for code quality
- Performs TypeScript type checking
- Builds the project
- Runs Playwright E2E tests
- If failures occur, triggers auto-fix
- Comments on PR with results

## 🔧 Setup Instructions

### 1. GitHub Secrets

Add the following secrets to your repository (Settings → Secrets and variables → Actions):

#### Required:

- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

#### Optional (for enhanced AI capabilities):

- `OPENAI_API_KEY` - OpenAI API key for GPT-4 based fixes
- `ANTHROPIC_API_KEY` - Anthropic API key for Claude based fixes

### 2. Install Dependencies

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Install Vitest (if you want unit tests)
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 3. Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:unit": "vitest",
    "test": "npm run test:unit && npm run test:e2e"
  }
}
```

### 4. Enable GitHub Actions

1. Go to your repository Settings
2. Navigate to Actions → General
3. Under "Workflow permissions", select:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

## 🚀 Usage

### Creating an AI-Implemented Feature

1. **Create a new issue** using the "🤖 AI Feature Request" template
2. **Add the `ai-implement` label** to trigger the workflow
3. **Wait for the AI** to create a branch and PR
4. **Review the PR** when all checks pass
5. **Merge** when satisfied

### Creating an AI-Fixed Bug

1. **Create a new issue** using the "🐛 AI Bug Report" template
2. **Add the `ai-implement` label** to trigger the workflow
3. **Wait for the AI** to analyze and fix the bug
4. **Review the PR** when all checks pass
5. **Merge** when satisfied

### Manual Trigger

You can also manually trigger the workflow:

1. Go to Actions tab
2. Select "AI Agent - Issue to PR"
3. Click "Run workflow"
4. Enter the issue number

## 🔄 How It Works

### Step 1: Issue Analysis

The AI reads the issue title and description to understand requirements.

### Step 2: Code Generation

Using the codebase context, the AI generates:

- New components or fixes
- TypeScript types
- Styling with Tailwind CSS
- React hooks if needed

### Step 3: Test Generation

The AI creates:

- Unit tests for logic
- E2E tests for user flows
- Accessibility tests

### Step 4: Quality Checks

Automated checks run:

- ESLint for code quality
- TypeScript compiler for type safety
- Playwright for E2E testing

### Step 5: Auto-Fix

If checks fail, the AI:

- Analyzes error messages
- Generates fixes
- Commits and pushes fixes
- Re-runs checks

### Step 6: Ready for Review

When all checks pass:

- PR is labeled "ready-for-review"
- Comment added with summary
- Notification sent to reviewers

## 📊 Monitoring

### View Workflow Runs

- Go to Actions tab to see all workflow runs
- Click on a run to see detailed logs
- Download artifacts (test reports, screenshots)

### Playwright Reports

- HTML reports are uploaded as artifacts
- Access via Actions → Workflow Run → Artifacts
- Download and open `playwright-report/index.html`

### PR Comments

The AI comments on PRs with:

- Implementation summary
- Test results
- Fix attempts
- Final status

## 🛠️ Customization

### Modify AI Prompts

Edit `.github/scripts/ai-implement.js` to customize:

- Code generation templates
- Component patterns
- Naming conventions

### Adjust Test Generation

Edit `.github/scripts/generate-tests.js` to:

- Add more test scenarios
- Change test frameworks
- Customize test templates

### Configure Auto-Fix

Edit `.github/scripts/ai-autofix.js` to:

- Add more fix patterns
- Integrate with AI APIs
- Customize fix logic

## 🔐 Security

- Never commit API keys to the repository
- Use GitHub Secrets for sensitive data
- Review AI-generated code before merging
- Set up branch protection rules

## 🐛 Troubleshooting

### Workflow doesn't trigger

- Check that `ai-implement` label exists
- Verify GitHub Actions is enabled
- Check workflow permissions

### Tests fail repeatedly

- Review error logs in Actions
- Check if manual intervention is needed
- Verify test environment setup

### AI generates incorrect code

- Improve issue description clarity
- Add more context in issue body
- Review and manually fix the PR

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright Documentation](https://playwright.dev)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)

## 🤝 Contributing

To improve the AI workflow:

1. Test changes in a separate branch
2. Update documentation
3. Create a PR with improvements
4. Get review from team

---

**Made with ❤️ and 🤖 AI**
