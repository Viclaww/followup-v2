# Component Patterns for Followup-v2

## Project-Specific Patterns

### 1. Modal/Dialog Components
Always use Shadcn Dialog or Sheet components for overlays:

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// For mobile, prefer Sheet (drawer from bottom)
export const MyModal = ({ open, onClose }: Props) => {
  const isMobile = useMobile();
  
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="bottom">
          {/* content */}
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        {/* content */}
      </DialogContent>
    </Dialog>
  );
};
```

### 2. Floating Action Buttons
For floating buttons (like customer care):

```typescript
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const FloatingButton = () => {
  return (
    <Button
      className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg md:bottom-4"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};
```

Note: `bottom-20` on mobile accounts for bottom navigation (h-16)

### 3. Card Components
Use Card component for content containers:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ContentCard = ({ title, children }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
```

### 4. Form Components
Always use react-hook-form with zod:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const MyForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
```

### 5. Navigation Components

#### Bottom Navigation (Mobile)
```typescript
import { BottomNav } from "@/components/ui/bottom-nav";
import { Home, Calendar, BarChart, History } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Quick Add", href: "/quick-add" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: History, label: "History", href: "/history" },
];

// In your app layout
<BottomNav items={navItems} />
```

#### Mobile Header
```typescript
import { MobileHeader } from "@/components/ui/mobile-header";

<MobileHeader 
  title="Page Title"
  showBack={true}
  actions={<Button>Action</Button>}
/>
```

### 6. Data Fetching Pattern
Use custom hooks for data:

```typescript
// In src/hooks/use-my-data.ts
export const useMyData = () => {
  const [data, setData] = useState<MyType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // fetch data
  }, []);
  
  return { data, loading };
};

// In component
const { data, loading } = useMyData();
```

### 7. Toast Notifications
```typescript
import { useToast } from "@/hooks/use-toast";

export const MyComponent = () => {
  const { toast } = useToast();
  
  const handleAction = () => {
    toast({
      title: "Success!",
      description: "Action completed",
    });
  };
};
```

### 8. Responsive Design Pattern
```typescript
import { useMobile } from "@/hooks/use-mobile";

export const MyComponent = () => {
  const isMobile = useMobile();
  
  return (
    <div className={cn(
      "p-4",
      isMobile ? "pb-20" : "pb-4" // Account for bottom nav on mobile
    )}>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
};
```

## Component File Structure

```typescript
// 1. Imports
import { useState } from "react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction 
}) => {
  // 4. Hooks
  const [state, setState] = useState(false);
  
  // 5. Handlers
  const handleClick = () => {
    setState(true);
    onAction();
  };
  
  // 6. Render
  return (
    <div className="p-4">
      <h2>{title}</h2>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
};
```

## Testing Patterns

### Unit Test Pattern
```typescript
// tests/unit/components/MyComponent.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  it("renders title", () => {
    render(<MyComponent title="Test" onAction={() => {}} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
  
  it("calls onAction when clicked", () => {
    const onAction = vi.fn();
    render(<MyComponent title="Test" onAction={onAction} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onAction).toHaveBeenCalled();
  });
});
```

### E2E Test Pattern
```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from "@playwright/test";

test.describe("My Feature", () => {
  test("completes user workflow", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Action");
    await expect(page.locator("text=Success")).toBeVisible();
  });
});
```

## Common Scenarios

### Scenario: Add a floating support button
1. Create `src/components/customer-care.tsx`
2. Use MessageCircle icon from lucide-react
3. Use Sheet component for mobile, Dialog for desktop
4. Position fixed bottom-20 right-4 (mobile) or bottom-4 (desktop)
5. Add to main layout or app component

### Scenario: Add a new screen/page
1. Create file in `src/screens/my-screen.tsx`
2. Add route in routing configuration
3. Add navigation item to BottomNav if needed
4. Create E2E test in `tests/e2e/my-screen.spec.ts`

### Scenario: Add form functionality
1. Define zod schema for validation
2. Use react-hook-form with zodResolver
3. Use Form components from ui/form.tsx
4. Show toast on success/error
5. Add unit tests for validation logic

### Scenario: Add data display
1. Create custom hook in `src/hooks/use-my-data.ts`
2. Use Card components for layout
3. Show loading state
4. Handle error states with Alert component
5. Add unit tests for hook logic
