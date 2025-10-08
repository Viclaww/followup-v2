# 🎯 AI Workflow Setup Checklist

Use this checklist to ensure your AI-driven development workflow is properly configured.

## ✅ Phase 1: Installation (5 minutes)

### Local Setup

- [ ] Run setup script: `./setup-ai-workflow.sh`
- [ ] Install dependencies: `npm install`
- [ ] Install Playwright browsers: `npx playwright install`
- [ ] Copy environment file: `cp .env.example .env`
- [ ] Test unit tests: `npm run test:unit`
- [ ] Test E2E tests: `npm run test:e2e:ui`

### Verification

```bash
# All these should run without errors:
npm run lint
npm run build
npm run test:unit -- --run
npm run test:e2e
```

---

## ✅ Phase 2: GitHub Configuration (5 minutes)

### Enable GitHub Actions

- [ ] Go to Settings → Actions → General
- [ ] Select "Read and write permissions"
- [ ] Check "Allow GitHub Actions to create and approve pull requests"
- [ ] Click "Save"

### Create Labels

Go to Settings → Labels and create:

- [ ] Label: `ai-implement`

  - Color: `#0E8A16` (green)
  - Description: "Triggers AI implementation workflow"

- [ ] Label: `ai-generated`

  - Color: `#1D76DB` (blue)
  - Description: "Marks AI-generated pull requests"

- [ ] Label: `automated`

  - Color: `#FBCA04` (yellow)
  - Description: "Marks automated workflows"

- [ ] Label: `ready-for-review`
  - Color: `#0E8A16` (green)
  - Description: "Ready for human review"

### Add GitHub Secrets (Optional but Recommended)

- [ ] Go to Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
- [ ] Add `OPENAI_API_KEY` (if using OpenAI)
  - Get from: https://platform.openai.com/api-keys
- [ ] OR add `ANTHROPIC_API_KEY` (if using Anthropic)
  - Get from: https://console.anthropic.com/

### Set Up Branch Protection (Recommended)

- [ ] Go to Settings → Branches
- [ ] Click "Add rule"
- [ ] Branch name pattern: `main`
- [ ] Check "Require a pull request before merging"
- [ ] Check "Require status checks to pass before merging"
- [ ] Check "Require branches to be up to date before merging"
- [ ] Click "Create" or "Save changes"

---

## ✅ Phase 3: Test the Workflow (10 minutes)

### Create Test Issue

- [ ] Go to Issues → New Issue
- [ ] Select "🤖 AI Feature Request" template
- [ ] Fill in test details:

  ```
  Title: Test: Add sample component

  Description:
  Create a simple test component to verify the AI workflow.

  Requirements:
  - Create TestComponent.tsx in src/components/
  - Display "AI Workflow Test" text
  - Add a button with onClick handler

  Acceptance Criteria:
  - [ ] Component renders correctly
  - [ ] Button is clickable
  - [ ] Tests are generated
  ```

- [ ] Add label: `ai-implement`
- [ ] Submit issue

### Monitor Workflow

- [ ] Go to Actions tab
- [ ] Watch "AI Agent - Issue to PR" workflow run
- [ ] Verify workflow completes (should take 5-10 minutes)
- [ ] Check for any errors in logs

### Review Generated PR

- [ ] Go to Pull Requests tab
- [ ] Find PR titled "🤖 AI: Test: Add sample component"
- [ ] Review code changes
- [ ] Check that tests were generated
- [ ] Verify CI/CD checks run
- [ ] Look for "ready-for-review" label

### Verify Auto-Fix (Optional)

- [ ] If tests fail, check Actions tab
- [ ] Verify "PR Checks & Auto-Fix" workflow runs
- [ ] Check that auto-fix commits are pushed
- [ ] Verify checks re-run automatically

---

## ✅ Phase 4: Documentation Review (5 minutes)

### Read Key Documents

- [ ] Read QUICKSTART.md for basic usage
- [ ] Skim AI_WORKFLOW.md for complete documentation
- [ ] Review IMPLEMENTATION.md to understand what was created
- [ ] Bookmark ADVANCED_AI_SETUP.md for future enhancements

### Share with Team

- [ ] Share QUICKSTART.md with team
- [ ] Explain how to create issues
- [ ] Show example of successful PR
- [ ] Set expectations for code review

---

## ✅ Phase 5: Customization (Optional)

### Customize Templates

- [ ] Review `.github/ISSUE_TEMPLATE/ai-feature-request.md`
- [ ] Modify to match your team's needs
- [ ] Update `.github/ISSUE_TEMPLATE/ai-bug-report.md`
- [ ] Test with new template

### Adjust AI Behavior

- [ ] Review `.github/scripts/ai-implement.cjs`
- [ ] Customize code generation templates
- [ ] Adjust naming conventions
- [ ] Update file structure patterns

### Configure Tests

- [ ] Review `tests/e2e/example.spec.ts`
- [ ] Add project-specific test scenarios
- [ ] Update `playwright.config.ts` if needed
- [ ] Customize `vitest.config.ts` coverage settings

---

## ✅ Phase 6: Production Readiness (Optional)

### Security

- [ ] Never commit `.env` file (already in `.gitignore`)
- [ ] Rotate API keys regularly
- [ ] Review workflow permissions
- [ ] Set up code scanning (GitHub Advanced Security)
- [ ] Enable Dependabot alerts

### Monitoring

- [ ] Set up notifications for failed workflows
- [ ] Monitor GitHub Actions usage/quota
- [ ] Track API costs (if using paid AI services)
- [ ] Create dashboard for workflow metrics

### Team Training

- [ ] Conduct team demo of AI workflow
- [ ] Create video tutorial (optional)
- [ ] Set up regular review sessions
- [ ] Establish code review guidelines for AI PRs

---

## 📊 Success Criteria

You're ready to go when:

- ✅ All Phase 1 items complete (installation works)
- ✅ All Phase 2 items complete (GitHub configured)
- ✅ Test issue creates a PR successfully
- ✅ CI/CD checks run on PR
- ✅ Team knows how to use the workflow

---

## 🆘 Troubleshooting Checklist

If something doesn't work:

### Workflow Not Starting

- [ ] Verify `ai-implement` label exists
- [ ] Check GitHub Actions is enabled
- [ ] Confirm workflow permissions are correct
- [ ] Look for errors in Actions tab

### Tests Failing Locally

- [ ] Delete `node_modules` and reinstall
- [ ] Reinstall Playwright browsers
- [ ] Check Node.js version (should be 18+)
- [ ] Verify all dependencies installed

### PR Not Created

- [ ] Check workflow logs in Actions tab
- [ ] Verify GitHub token has correct permissions
- [ ] Ensure branch naming doesn't conflict
- [ ] Check rate limits not exceeded

### Auto-Fix Not Working

- [ ] Verify error logs are captured
- [ ] Check auto-fix script has permissions
- [ ] Review git configuration in workflow
- [ ] Ensure no merge conflicts

---

## 📈 Next Steps After Setup

### Week 1

- [ ] Create 2-3 simple test issues
- [ ] Review generated code quality
- [ ] Fine-tune templates based on results
- [ ] Gather team feedback

### Week 2-4

- [ ] Start using for real features
- [ ] Monitor success rate
- [ ] Adjust AI prompts if needed
- [ ] Document patterns that work well

### Month 2+

- [ ] Consider adding AI API integration
- [ ] Implement advanced features (see ADVANCED_AI_SETUP.md)
- [ ] Set up analytics/monitoring
- [ ] Optimize based on metrics

---

## 🎉 Completion

When all checkboxes are marked, you have a fully functional AI-driven development workflow!

**Estimated Total Setup Time**: 25-30 minutes

**Time Saved Per Feature**: 2-4 hours → 5-10 minutes

**ROI**: Massive! 🚀

---

## 📝 Notes

Use this section for your own notes during setup:

```
Date completed: _______________

Issues encountered:
-
-
-

Solutions:
-
-
-

Team feedback:
-
-
-

Next improvements:
-
-
-
```

---

**Ready to start? Begin with Phase 1! 🚀**
