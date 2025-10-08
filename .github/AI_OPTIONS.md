# AI Implementation Options for GitHub Actions

> **Update**: This project now follows an **Agentic AI workflow** inspired by [Elliot Graebert's approach at Skydio](https://medium.com/@elliotgraebert/agentic-ai-has-changed-my-career-2c6e3dd29708). See [AGENTIC_WORKFLOW.md](./AGENTIC_WORKFLOW.md) for the complete guide.

## What We're Using: GitHub Copilot + Context Files

This implementation replaces tools like **Windsurf/Cursor** with **GitHub Actions + Copilot**, achieving the same agentic AI workflow but fully automated in CI/CD.

### How It Works

1. **Context Files** (like Windsurf Rules)
   - Located in `.github/copilot-rules/`
   - Auto-injected into every AI prompt
   - Contains best practices, patterns, anti-patterns
   - Iteratively improved when AI makes mistakes

2. **MCP Servers** (AI Integrations)
   - GitHub MCP: Read issues, create PRs
   - Playwright MCP: Browser testing & verification
   - Git/Filesystem: Code management
   - Custom MCPs: Firebase, project-specific knowledge

3. **Automated Workflow**
   ```
   Issue with "ai-implement" label
   → AI reads context files
   → Generates code following patterns
   → Tests in browser (Playwright)
   → Auto-fixes if needed
   → Creates PR
   → You review Vercel preview
   ```

4. **Learning Loop**
   - AI makes mistake → Document correct pattern in context files
   - Next issue → AI uses updated context → Solves correctly ✅

## Comparison with Other Approaches

| Feature | Our Approach (GitHub Copilot + Context) | Windsurf/Coder | OpenAI Direct | Template Only |
|---------|---------------------------|----------------|---------------|---------------|
| **Cost** | FREE (GitHub Actions) | $10-30/month | ~$0.05/feature | FREE |
| **Automation** | Fully automated in CI/CD | Manual IDE work | API calls needed | Fully automated |
| **Context** | Context files + MCPs | .windsurf/rules | Manual prompts | Predefined |
| **Learning** | Improves over time | Improves over time | No learning | No learning |
| **Testing** | Playwright auto-test | Manual testing | Manual testing | Manual testing |
| **Speed** | 1-3 min to PR | Real-time | 30s-1min | 10-30s |
| **Quality** | High (with good context) | Very High | Variable | Basic |
| **Team** | Everyone can use | Developers only | Developers only | Everyone can use |

## Why This Approach? (Lessons from Elliot's Article)

### Key Insights:
1. **"Context is King"**: The better your context files, the better the AI performs
2. **"Automate Feedback"**: Playwright MCP lets AI verify its own work
3. **"Scale with Batch"**: Create 10 issues at once, get 10 PRs back
4. **"Everyone Can Contribute"**: Designers, PMs can create issues and get working PRs

### Our Implementation:

#### Phase 1: Basic Automation ✅
- Issue → AI implementation → PR
- Template fallback for reliability
- Basic context injection

#### Phase 2: Context-Driven (Current)
- Context files define patterns
- AI follows project-specific standards
- Learning from mistakes

#### Phase 3: Self-Testing (Next)
- Playwright verifies changes in browser
- Screenshots for visual verification  
- Auto-fix based on test results

#### Phase 4: Agentic Scale (Future)
- Parallel task execution
- Multi-step workflows
- Cross-PR learning
- Automated code reviews

## Quick Start

### For Simple Tasks (1x Speed):
```bash
gh issue create \
  --title "Add customer care button" \
  --body "Floating button bottom-right with MessageCircle icon" \
  --label "ai-implement"

# Wait 1-3 minutes → PR ready for review
```

### For Better Results (Context-Driven):
1. Check `.github/copilot-rules/` for patterns
2. Reference similar components in issue
3. Be specific about behavior
```bash
gh issue create \
  --title "Add customer care dialog" \
  --body "Floating button with MessageCircle icon (see component-patterns.md #6)
  
  Opens Sheet on mobile, Dialog on desktop (pattern #1)
  Use existing Button and Dialog components
  Position: fixed bottom-20 right-4 (mobile), bottom-4 (desktop)
  
  Should include:
  - Contact form with name, email, message fields
  - Use Form components from ui/form.tsx (pattern #4)
  - Toast notification on submit" \
  --label "ai-implement"
```

### For Batch Work (10x Speed):
```bash
# Migrate 12 components to new pattern
for component in "UserCard" "StatusBadge" "DatePicker" ...; do
  gh issue create \
    --title "Migrate $component to new pattern" \
    --body "Update per component-patterns.md #3" \
    --label "ai-implement"
done

# All PRs ready in ~5 minutes
```

## Context File Strategy

### Building Effective Context:
1. **Start with basics** (we've created initial files)
2. **Iterate on failures**:
   ```
   AI uses wrong pattern → Document correct pattern
   → Close PR, create new issue → AI gets it right ✅
   ```
3. **Extract successful patterns**:
   ```
   PR merged successfully → Extract pattern → Add to context
   → Next similar issue → AI reuses pattern ✅
   ```

### Our Context Files:
- `typescript-best-practices.md`: Code style, imports, types
- `component-patterns.md`: React patterns, UI components
- `testing-guidelines.md`: (Coming soon) Test requirements

### Example Evolution:
```markdown
## Iteration 1: AI creates custom button
❌ Result: `<button className="...">`

## Iteration 2: Add to context
Added to component-patterns.md:
"Always use Shadcn Button, never <button>"

## Iteration 3: AI uses Button correctly
✅ Result: `<Button variant="default">`
```

## Alternative Options (If Needed)

### Option 1: Add OpenAI API Key (Paid, Better Quality)
```bash
# Add to GitHub Secrets
gh secret set OPENAI_API_KEY --body "sk-..."

# Workflow automatically uses it
# Cost: ~$0.05 per feature
# Quality: Higher than template, on par with Copilot
```

### Option 2: Use Anthropic Claude (Paid, Best Quality)
```bash
gh secret set ANTHROPIC_API_KEY --body "sk-ant-..."

# Cost: ~$0.10 per feature
# Quality: Best reasoning, complex tasks
```

### Option 3: Keep Template (Free, Basic)
- Already works as fallback
- Uses context files for patterns
- Good for simple, repetitive tasks
- Improves as you add more context

## Measuring Success

### Metrics (inspired by Elliot's article):
- **Time to PR**: Target < 3 min
- **First-time success**: PRs that pass review without changes
- **Context effectiveness**: Success rate after context updates
- **Throughput**: PRs per hour (Elliot achieved 10/hour!)

### Current Performance:
- Time to PR: ~2-3 minutes ✅
- Template quality: Basic but functional
- With context: Should improve significantly
- Next: Add Playwright for self-testing

## What's Different from Windsurf/Coder?

| Windsurf/Coder Approach | Our GitHub Actions Approach |
|-------------------------|----------------------------|
| `.windsurf/rules/*.md` | `.github/copilot-rules/*.md` |
| Coder Tasks | GitHub Actions workflows |
| Manual IDE iteration | Automated CI/CD |
| Developer-only | Everyone on team |
| Local dev environment | Cloud runners |
| Pay per seat | Free (Actions minutes) |
| Real-time feedback | Async (1-3 min) |

## Next Steps

1. **Add more context files** as you discover patterns
2. **Enable Playwright MCP** for browser testing (Phase 3)
3. **Batch common tasks** to test parallel execution
4. **Measure and iterate** on context file quality
5. **(Optional)** Add paid API for complex tasks

## Resources

- [Agentic Workflow Guide](./AGENTIC_WORKFLOW.md) - Complete implementation guide
- [MCP Integration](./MCP_INTEGRATION_SUMMARY.md) - MCP server details
- [Original Article](https://medium.com/@elliotgraebert/agentic-ai-has-changed-my-career-2c6e3dd29708) - Elliot's Skydio story
- [Context Files](./copilot-rules/) - Best practices & patterns

---

**TL;DR**: We're using GitHub Copilot + Context Files (like Windsurf Rules) + GitHub Actions (like Coder Tasks) to achieve the same agentic AI workflow Elliot used at Skydio, but completely free and automated in CI/CD.
