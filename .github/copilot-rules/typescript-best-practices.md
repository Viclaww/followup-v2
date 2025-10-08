# TypeScript Best Practices for Followup-v2

## Project Context
This is a React + TypeScript application using:
- React 18.3.1 with TypeScript 5.8.3
- Vite 5.4.19 for build tooling
- Shadcn/ui components built on Radix UI
- Tailwind CSS 3.4.17 for styling
- React Router for navigation

## Code Style & Patterns

### Component Structure
- Use functional components with TypeScript
- Export components as named exports
- Use proper TypeScript interfaces for props
- Keep components in `src/components/` for shared UI, `src/screens/` for pages

### State Management
- Use React hooks (useState, useEffect, useContext)
- Custom hooks go in `src/hooks/`
- Type all hook return values and parameters

### Styling
- Use Tailwind CSS utility classes
- Use Shadcn/ui components from `src/components/ui/`
- Follow mobile-first responsive design
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes

### TypeScript Guidelines
- Always define interfaces for component props
- Use type imports: `import type { ComponentProps } from 'react'`
- Avoid `any` - use `unknown` or specific types
- Export types alongside components

### Available UI Components
Always use these Shadcn/ui components instead of creating new ones:
- Button, Card, Dialog, Sheet, Drawer
- Input, Textarea, Select, Checkbox, Switch
- Alert, AlertDialog, Toast
- Avatar, Badge, Separator
- Accordion, Tabs, Collapsible
- Calendar, Popover, Dropdown Menu
- Bottom Navigation (mobile)
- Mobile Header (mobile)

### Icons
- Use `lucide-react` for all icons
- Common icons: Menu, X, ChevronRight, MessageCircle, Check, AlertCircle

### Forms
- Use react-hook-form for form handling
- Validate with zod schemas
- Use Form components from `src/components/ui/form.tsx`

### Mobile Considerations
- This is a mobile-first PWA
- Use Bottom Navigation for mobile nav
- Use Sheet/Drawer for mobile overlays instead of Dialog
- Test with `use-mobile` hook from `src/hooks/use-mobile.tsx`

## Testing Requirements

### Unit Tests (Vitest)
- Create tests in `tests/unit/` matching source structure
- Test component rendering, props, and user interactions
- Use `@testing-library/react` for component tests
- Mock external dependencies

### E2E Tests (Playwright)
- Create tests in `tests/e2e/`
- Test full user workflows
- Use page object pattern
- Test on mobile viewport (375x667)

## Common Anti-Patterns to Avoid

### ❌ Don't Do This:
```typescript
// Don't use inline styles
<div style={{ color: 'red' }}>

// Don't create custom buttons
<button className="...">

// Don't use any
const data: any = fetchData();

// Don't use default exports
export default MyComponent;
```

### ✅ Do This Instead:
```typescript
// Use Tailwind classes
<div className="text-red-500">

// Use Shadcn Button
import { Button } from "@/components/ui/button";
<Button variant="destructive">

// Use proper types
const data: User[] = await fetchData();

// Use named exports
export const MyComponent: React.FC<Props> = ({ ... }) => {
```

## File Naming Conventions
- Components: PascalCase (e.g., `CustomerCare.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `use-followups.ts`)
- Utilities: kebab-case (e.g., `utils.ts`)
- Types: kebab-case (e.g., `followup.ts`)

## Commands to Run

### Development
```bash
npm run dev              # Start dev server
npm run build           # Build for production
```

### Testing
```bash
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:e2e        # E2E tests only
npm run test:e2e:ui     # E2E tests with UI
npm run typecheck       # TypeScript checking
```

### Linting & Formatting
```bash
npm run lint            # Run ESLint
npm run format          # Format with Prettier (if configured)
```

## Implementation Checklist

When implementing a new feature:
- [ ] Create TypeScript interface/type for data structures
- [ ] Use existing Shadcn/ui components
- [ ] Follow Tailwind CSS for styling
- [ ] Add proper TypeScript types to props
- [ ] Test on mobile viewport
- [ ] Create unit test for component logic
- [ ] Create E2E test for user workflow
- [ ] Run typecheck before committing
- [ ] Ensure ESLint passes

## Debugging Tips

### If imports fail:
- Use `@/` alias for src imports: `import { Button } from "@/components/ui/button"`
- Check `tsconfig.json` paths configuration

### If styles don't apply:
- Ensure Tailwind classes are valid
- Check `tailwind.config.ts` for custom theme
- Use `cn()` for conditional classes

### If types are wrong:
- Check `src/types/` for existing type definitions
- Import types separately: `import type { ... }`
- Run `npm run typecheck` to verify
