# GitHub Copilot Agentic Workflow Guide

## Overview
This workflow implements an agentic AI system similar to Elliot Graebert's approach at Skydio, but using GitHub Copilot/Actions instead of Windsurf/Coder Tasks.

## Architecture

```
Issue Created with "ai-implement" label
    ↓
GitHub Actions Workflow Triggered
    ↓
1. Read Issue (via GitHub MCP)
2. Analyze Project Context
3. Generate Implementation (via Copilot)
4. Run Tests in Browser (via Playwright MCP)
5. Auto-fix if needed
6. Create Pull Request
    ↓
Vercel Preview Deploy
    ↓
AI Tests Preview & Iterates
    ↓
Ready for Human Review
```

## Key Components

### 1. Context Files (Windsurf Rules equivalent)
Located in `.github/copilot-rules/`:
- `typescript-best-practices.md` - Code standards
- `component-patterns.md` - React patterns
- `testing-guidelines.md` - Test requirements

These are automatically injected into AI prompts.

### 2. MCP Servers (AI Integrations)
Configured in `.github/mcp-config.json`:
- **GitHub MCP**: Read issues, create PRs, add comments
- **Playwright MCP**: Browser automation for testing
- **Filesystem MCP**: Read project structure
- **Git MCP**: Manage branches and commits
- **Custom Firebase MCP**: Firebase-specific operations
- **Custom Project Context MCP**: Project-specific knowledge

### 3. GitHub Actions Workflows

#### Main Workflow: `issue-to-pr.yml`
Triggered by: Issues labeled with "ai-implement"
Steps:
1. Create feature branch
2. Load context files
3. Call GitHub Copilot to generate code
4. Generate tests
5. Run tests with Playwright
6. Auto-fix failures
7. Create PR with preview link

#### PR Checks: `pr-checks.yml`
Triggered by: Pull requests
Steps:
1. Run TypeScript checks
2. Run unit tests
3. Run E2E tests
4. Auto-fix if tests fail

### 4. AI Implementation Scripts

#### `copilot-implement.cjs`
- Main implementation engine
- Uses GitHub Models API (free for Actions)
- Falls back to templates if API unavailable
- Injects context from `.github/copilot-rules/`

#### `generate-tests.cjs`
- Auto-generates unit and E2E tests
- Uses existing test patterns
- Creates Playwright tests with browser verification

#### `ai-autofix.cjs`
- Analyzes test failures
- Generates fixes
- Runs tests again (up to 3 attempts)

## Usage

### For Simple Tasks (Like Elliot's "Vibe Coding")
1. Create GitHub issue with clear description
2. Add label `ai-implement`
3. Wait for PR (usually 1-3 minutes)
4. Review Vercel preview
5. Approve or request changes

### For Complex Tasks (Agentic Approach)
1. Create detailed issue with:
   - Clear acceptance criteria
   - Screenshots/mockups if UI change
   - References to existing patterns
   - Testing requirements
2. Add label `ai-implement`
3. AI will:
   - Read context files
   - Analyze similar components
   - Generate implementation
   - Test in browser
   - Auto-fix issues
   - Create PR when ready
4. Review when Vercel preview is ready

### For Batch Tasks (10x Workflow)
1. Create multiple issues at once
2. Label all with `ai-implement`
3. GitHub Actions runs them in parallel
4. Review all PRs when complete

Example: Migrate 12 filters to new component
```bash
# Create issues programmatically
for filter in "UserFilter" "DateFilter" "StatusFilter" ...; do
  gh issue create \
    --title "Migrate $filter to new FilterComponent" \
    --body "Update $filter to use new FilterComponent pattern from #123" \
    --label "ai-implement"
done
```

## Iteration Workflow

### If AI Gets It Wrong (Feedback Loop)
1. **Option A: Comment on PR**
   ```
   @ai-bot The button should be red, not blue.
   Use variant="destructive" on the Button component.
   ```
   - AI reads comment via GitHub MCP
   - Makes update
   - Pushes new commit

2. **Option B: Edit Context Files**
   - Update `.github/copilot-rules/component-patterns.md`
   - Add specific pattern for this case
   - Close PR and create new issue
   - AI will use updated context

3. **Option C: Manual Fix + Update Context**
   - Fix the PR manually
   - Document pattern in context files
   - Next AI implementation will be correct

## Context File Strategy (from Elliot's Approach)

### Building Effective Context
1. **Start Small**: Basic patterns first
2. **Iterate**: When AI fails, ask it what would have helped
3. **Document**: Add that insight to context files
4. **Test**: Create new issue with same requirements
5. **Verify**: AI should solve it correctly now

### Example Iteration:
```markdown
## Issue: AI used custom button instead of Shadcn Button

### What Happened:
AI generated: `<button className="...">`

### What Should Happen:
AI should use: `<Button variant="..." />`

### Context Added:
In component-patterns.md:
"Always use Shadcn Button component, never raw <button>"

### Result:
Next issue → AI uses Button correctly ✅
```

## Measuring Success

### Metrics to Track:
- **Time to PR**: Issue created → PR ready (target: < 5 min)
- **First-time Success Rate**: PRs that pass review without changes
- **Context Effectiveness**: Issues solved correctly after context update
- **Throughput**: PRs per hour (Elliot achieved 10/hour)

### Quality Checklist:
- [ ] Uses existing Shadcn components
- [ ] Follows TypeScript patterns
- [ ] Includes unit tests
- [ ] Includes E2E tests
- [ ] Mobile responsive
- [ ] Passes all checks
- [ ] Vercel preview works

## Advanced Patterns

### Self-Testing Workflow (Playwright MCP)
The AI can verify its own work:
```javascript
// In generate-tests.cjs
// AI generates test that:
1. Starts dev server
2. Navigates to feature
3. Tests functionality
4. Takes screenshot
5. Compares to expected behavior
```

### Multi-Step Workflows
For complex features:
1. **Issue 1**: Create component structure
2. **Issue 2**: Add functionality (depends on #1)
3. **Issue 3**: Add tests (depends on #2)
4. **Issue 4**: Add documentation (depends on #3)

### Pattern Learning
When AI implements successfully:
1. Extract the pattern
2. Document in context files
3. Reference in future issues
4. Build pattern library over time

## Troubleshooting

### If AI Uses Wrong Pattern:
- Check context files are being loaded
- Add more specific examples
- Reference successful PRs in issue

### If Tests Fail:
- AI auto-fix will try 3 times
- Check Playwright screenshots in PR
- Manually fix and update context

### If API Quota Exceeded:
- Workflow falls back to templates
- Templates use documented patterns
- Still creates working code

## Team Collaboration

### For Non-Developers (Designers, PMs):
1. Create issue with clear description
2. Add mockup/screenshot
3. Label `ai-implement`
4. Review Vercel preview
5. Give feedback in PR comments

### For Developers:
1. Review AI-generated PRs
2. Update context files when patterns emerge
3. Handle complex logic AI struggles with
4. Maintain context file quality

## Best Practices (from Elliot's Lessons)

1. **Clear Prompts**: Be specific in issue descriptions
2. **Context is King**: Invest time in context files
3. **Iterate Context**: Update when AI fails
4. **Batch Work**: Process multiple issues in parallel
5. **Trust but Verify**: Always review Vercel preview
6. **Pattern Library**: Build reusable patterns over time
7. **Automate Feedback**: Use Playwright for self-verification
8. **Measure Progress**: Track success rate and improve

## Next Steps

### Phase 1: Basic Automation ✅
- [x] Issue to PR workflow
- [x] Context files created
- [x] MCP servers configured

### Phase 2: Self-Testing (In Progress)
- [ ] Playwright browser automation
- [ ] Screenshot comparison
- [ ] Auto-fix with browser feedback

### Phase 3: Advanced Agentic
- [ ] Multi-step workflows
- [ ] Pattern extraction
- [ ] Learning from PRs
- [ ] Team collaboration features

### Phase 4: Scale
- [ ] Parallel task execution
- [ ] Cross-repo patterns
- [ ] AI-driven code reviews
- [ ] Automated documentation
