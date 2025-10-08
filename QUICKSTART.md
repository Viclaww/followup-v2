# Quick Start: AI Development Workflow

## 🚀 Installation (5 minutes)

### Step 1: Install Dependencies

```bash
# Install Playwright and testing dependencies
npm install --save-dev @playwright/test vitest @vitest/ui \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom

# Install Playwright browsers
npx playwright install --with-deps
```

Or use the automated setup script:

```bash
chmod +x setup-ai-workflow.sh
./setup-ai-workflow.sh
```

### Step 2: Configure GitHub

1. **Enable GitHub Actions**:

   - Settings → Actions → General
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

2. **Create Labels** (Settings → Labels):

   - `ai-implement` (color: #0E8A16)
   - `ai-generated` (color: #1D76DB)
   - `automated` (color: #FBCA04)
   - `ready-for-review` (color: #0E8A16)

3. **Add Secrets** (Settings → Secrets → Actions) - _Optional_:
   - `OPENAI_API_KEY` for enhanced AI features

## 🎯 Usage (2 steps)

### Create an AI Issue

1. Click **Issues** → **New Issue**
2. Select **🤖 AI Feature Request** template
3. Fill in the details
4. Add label: **`ai-implement`**
5. Click **Submit new issue**

### Watch the Magic ✨

The AI will:

- Create a branch
- Implement the feature
- Generate tests
- Create a PR
- Run all checks
- Auto-fix issues
- Notify when ready

## 📋 Example Issue

```markdown
Title: Add user profile avatar component

Description:
Create a reusable avatar component that displays user profile pictures with a fallback to initials.

Requirements:

- Display circular avatar with image
- Show user initials if no image
- Support multiple sizes (sm, md, lg)
- Support online status indicator

Acceptance Criteria:

- [ ] Component renders with image URL
- [ ] Shows initials when no image
- [ ] Size variants work correctly
- [ ] Status indicator displays properly
- [ ] Accessible with proper ARIA labels
```

Add label: `ai-implement`

## 🧪 Test Locally

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run E2E tests with UI
npm run test:e2e:ui

# Debug specific test
npm run test:e2e:debug
```

## 📊 View Results

### GitHub Actions

- Go to **Actions** tab
- Click on workflow run
- View logs and results

### Playwright Reports

```bash
npx playwright show-report
```

## 🛠️ Troubleshooting

### Workflow doesn't start

- Verify `ai-implement` label exists
- Check Actions is enabled in Settings

### Tests fail locally

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Reinstall Playwright
npx playwright install --force
```

### Need help?

- Read [AI_WORKFLOW.md](./AI_WORKFLOW.md) for details
- Check [ADVANCED_AI_SETUP.md](./ADVANCED_AI_SETUP.md) for advanced features

## 🎉 That's it!

You now have a fully automated AI development workflow. Just create issues and let AI do the work!

---

**Pro Tips:**

- Be specific in issue descriptions
- Include acceptance criteria
- Reference existing components
- Start with simple features
- Review AI-generated code before merging
