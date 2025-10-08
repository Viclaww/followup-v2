# 🤖 AI-Driven Development Workflow

## Overview

This project uses an automated AI development workflow that handles the complete development cycle from issue creation to deployment.

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### 2. Configure GitHub Repository

1. **Enable GitHub Actions**

   - Go to Settings → Actions → General
   - Enable "Read and write permissions"
   - Enable "Allow GitHub Actions to create and approve pull requests"

2. **Add GitHub Secrets** (Optional for enhanced AI)

   - Go to Settings → Secrets and variables → Actions
   - Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`

3. **Create Labels**
   - `ai-implement` - Triggers AI implementation
   - `ai-generated` - Marks AI-generated PRs
   - `automated` - Marks automated PRs
   - `ready-for-review` - Marks PRs ready for review

## 📝 How to Use

### Method 1: Create a GitHub Issue

1. **Create an issue** using one of the templates:

   - 🤖 AI Feature Request
   - 🐛 AI Bug Report

2. **Add the `ai-implement` label**

3. **Wait for the magic**:

   - AI creates a branch
   - Implements the feature/fix
   - Generates tests
   - Creates a PR
   - Runs tests
   - Auto-fixes issues
   - Notifies when ready

4. **Review and merge** when all checks pass ✅

### Method 2: Manual Workflow Trigger

1. Go to Actions → "AI Agent - Issue to PR"
2. Click "Run workflow"
3. Enter issue number
4. Click "Run workflow"

## 🔄 Workflow Steps

```
Issue Created
    ↓
AI Analysis
    ↓
Branch Creation (ai/issue-{number}-{title})
    ↓
Code Implementation
    ↓
Test Generation
    ↓
Commit & Push
    ↓
Create Pull Request
    ↓
Run CI/CD Checks
    ├── Linting
    ├── Type Checking
    ├── Build
    └── E2E Tests
    ↓
[If Failed] → Auto-Fix → Commit → Re-run Checks
    ↓
[If Success] → Label: ready-for-review
    ↓
Manual Review
    ↓
Merge to Main
```

## 🧪 Testing

### Run Tests Locally

```bash
# Unit tests
npm run test:unit

# E2E tests (interactive)
npm run test:e2e:ui

# E2E tests (headless)
npm run test:e2e

# All tests
npm test
```

### Test Reports

After running Playwright tests:

- HTML report: `playwright-report/index.html`
- Open with: `npx playwright show-report`

## 📁 Project Structure

```
.github/
├── workflows/
│   ├── issue-to-pr.yml          # Main AI workflow
│   ├── pr-checks.yml            # CI/CD with auto-fix
│   └── README.md                # Workflow documentation
├── scripts/
│   ├── ai-implement.js          # AI code generator
│   ├── generate-tests.js        # Test generator
│   └── ai-autofix.js            # Auto-fix script
└── ISSUE_TEMPLATE/
    ├── ai-feature-request.md    # Feature template
    └── ai-bug-report.md         # Bug template

tests/
├── e2e/                         # Playwright E2E tests
│   └── example.spec.ts
├── unit/                        # Vitest unit tests
│   └── App.test.tsx
└── setup.ts                     # Test setup

playwright.config.ts             # Playwright configuration
vitest.config.ts                 # Vitest configuration
```

## 🎯 Features

### ✅ Implemented

- ✅ GitHub Actions CI/CD
- ✅ Auto-create branch from issue
- ✅ AI code implementation
- ✅ Auto-generate tests
- ✅ Automated PR creation
- ✅ Lint/Type/Build checks
- ✅ Playwright E2E tests
- ✅ Auto-fix on failures
- ✅ PR comments with status

### 🚧 Enhancement Opportunities

- 🔄 Integration with real AI APIs (OpenAI/Anthropic)
- 🔄 More sophisticated code generation
- 🔄 Visual regression testing
- 🔄 Performance testing
- 🔄 Automated deployment
- 🔄 Slack/Discord notifications

## 🔧 Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# AI Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Test Configuration
PLAYWRIGHT_BASE_URL=http://localhost:5173
```

### GitHub Actions Secrets

Add these in repository settings:

| Secret              | Required         | Description             |
| ------------------- | ---------------- | ----------------------- |
| `GITHUB_TOKEN`      | ✅ Auto-provided | GitHub API access       |
| `OPENAI_API_KEY`    | Optional         | OpenAI GPT-4 access     |
| `ANTHROPIC_API_KEY` | Optional         | Anthropic Claude access |

## 📊 CI/CD Pipeline

### On Issue Creation

1. Validates issue has `ai-implement` label
2. Parses issue requirements
3. Analyzes codebase
4. Generates implementation plan
5. Creates code changes
6. Generates tests
7. Creates PR

### On PR Update

1. Runs linting (ESLint)
2. Type checking (TypeScript)
3. Builds project (Vite)
4. Runs E2E tests (Playwright)
5. If failures → Auto-fix → Commit → Re-run
6. If success → Mark ready for review

## 🐛 Troubleshooting

### Workflow Not Triggering

**Problem**: Workflow doesn't run when issue is created

**Solutions**:

- Verify `ai-implement` label exists
- Check GitHub Actions is enabled
- Review workflow permissions in Settings

### Tests Failing

**Problem**: Tests keep failing even after auto-fix

**Solutions**:

1. Check error logs in Actions tab
2. Run tests locally: `npm run test:e2e`
3. Review auto-fix script logs
4. Manual intervention may be needed

### API Key Issues

**Problem**: AI features not working

**Solutions**:

- Verify secrets are set correctly
- Check API key validity
- Review quota limits
- Check script logs for API errors

### Build Errors

**Problem**: Build fails in CI

**Solutions**:

```bash
# Locally test build
npm run build

# Check dependencies
npm ci

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

## 🔐 Security Best Practices

1. **Never commit secrets**

   - Use GitHub Secrets
   - Add `.env` to `.gitignore`

2. **Review AI-generated code**

   - Don't blindly merge
   - Check for security issues
   - Verify logic correctness

3. **Branch protection**

   ```
   Settings → Branches → Add rule:
   - Require PR reviews
   - Require status checks
   - Require branches up to date
   ```

4. **Limit workflow permissions**
   - Only grant necessary permissions
   - Review Actions logs regularly

## 📚 Learn More

### Documentation

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Playwright Docs](https://playwright.dev)
- [Vitest Docs](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)

### AI Integration

- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic Claude](https://docs.anthropic.com)
- [GitHub Copilot](https://github.com/features/copilot)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a PR

## 📄 License

This workflow setup is part of the project and follows the same license.

---

## 🎉 Example Usage

### Creating a New Feature

```markdown
Title: Add dark mode toggle

Description:
Implement a dark mode toggle button in the header.

Requirements:

- Toggle button with sun/moon icon
- Persist preference to localStorage
- Smooth theme transition
- Update all components to support dark mode

Acceptance Criteria:

- [ ] Button visible in header
- [ ] Clicking toggles theme
- [ ] Theme persists on reload
- [ ] All pages respect theme
```

Add label: `ai-implement`

**Result**: AI creates a complete implementation with tests! 🎉

---

**Happy Coding! 🚀🤖**
