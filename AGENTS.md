# AGENTS.md

Codebase guidelines for agentic coding operations.

---

## Build & Test Commands

```bash
# Development
npm run dev           # Start Vite dev server (port 5173)

# Build
npm run build         # Production build

# Linting & Formatting
npm run lint          # Run ESLint
npm run preview       # Preview production build
```

**Note**: No test framework is configured. Tests directory exists but contains only utility scripts.

---

## Project Configuration

- **TypeScript**: 5.8.3, strict mode enabled
- **React**: 19.1.0
- **Bundler**: Vite 6.3.5
- **State Management**: Zustand (client), TanStack Query (server)
- **Styling**: Tailwind CSS 3.4.3 with Shadcn UI components
- **Path Alias**: `@/*` → `src/*`

---

## Code Style Guidelines

### Imports

```tsx
// External libraries first
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Type imports (use import type)
import type { HomeResponse } from "@/types/diary";

// Local imports (use @ alias for src, relative for same directory)
import { getHomeData } from "@/api/services/home";
import DiaryCards from "../components/home/DiaryCards";
```

### Formatting (Prettier)

- **Semicolons**: Required (`semi: true`)
- **Quotes**: Double quotes (`singleQuote: false`)
- **Width**: 100 chars (`printWidth: 100`)
- **Indent**: 2 spaces
- **Trailing commas**: ES5 (`trailingComma: "es5"`)
- **Arrow parens**: Avoid when possible (`arrowParens: "avoid"`)

### Naming Conventions

```tsx
// Components: PascalCase
const Home = () => {};
const DiaryCards = () => {};

// Hooks: camelCase with 'use' prefix
export const useAuth = () => {};
export const useGetHomeData = (token: string) => {};

// API queries: useGet[Resource], use[Action][Resource]
(useGetHomeData, useDeleteDiary, useCreateTodo);

// Services: camelCase, descriptive verbs
(getHomeData, createTodo, updateTodoContent);

// Types/Interfaces: PascalCase
interface HomeResponse {}
interface ApiTodo {}

// Zustand stores: use[StoreName]
const useUserStore = create<AuthStore>(() => {});
const useTodoStore = create<TodoStore>(() => {});

// Constants: PascalCase (in constants/)
const EMOTION_COLORS = { happy: "#FF6B6B" };
```

---

## React Query Patterns

```tsx
// Query hooks: useQuery with enabled condition
export const useGetHomeData = (token: string) => {
  return useQuery<HomeResponse>({
    queryKey: ["homeData", token],
    queryFn: () => getHomeData(token),
    enabled: !!token, // Don't fetch without token
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

// Mutation hooks: useMutation with callbacks
export const useDeleteDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ diaryId }: { diaryId: string }) => deleteDiary(diaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      toast.success("Success message");
    },
    onError: (error: any) => {
      console.error("Operation failed:", error);
      toast.error("Error message");
    },
  });
};
```

---

## Error Handling

```tsx
// API interceptors (axios.ts) handle:
// - 401: Automatic token refresh via refresh endpoint
// - Failed refresh: Show logout modal, redirect to /login
// - 500+: Log to console

// Service layer: Try-catch with console.error and re-throw
export const createTodo = async ({ content, date }) => {
  try {
    const response = await api.post("/todos/calendar", { content, date });
    return response.data;
  } catch (error) {
    console.error("❌ createTodo error:", error);
    throw error;
  }
};

// Mutation layer: toast notifications for UX
onError: (error: any) => {
  console.error("Error:", error);
  toast.error("Operation failed", { description: "Please try again" });
};
```

---

## Component Guidelines

```tsx
// Shadcn UI components with cn() for className merging
import { cn } from "@/lib/utils";

const Button = ({ className, variant, size, ...props }) => {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
};

// Props interface for TypeScript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

// React.forwardRef for ref forwarding
const Component = React.forwardRef<HTMLDivElement, Props>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("base-styles", className)} {...props} />;
});
```

---

## ESLint Rules (Key Rules)

- `unused-imports/no-unused-imports: "error"` - Auto-remove unused imports
- `noUnusedLocals: true` - TypeScript rule
- `noUnusedParameters: true` - TypeScript rule
- `react-refresh/only-export-components: "warn"` - Vite HMR optimization

---

## Key Patterns

1. **Authentication**: JWT in localStorage, refresh via HTTP-only cookie
2. **Route Protection**: `<ProtectedRoute>` wrapper component
3. **Toast Notifications**: Use `sonner` for success/error messages
4. **Dark Mode**: Class-based dark mode with Tailwind
5. **Utility Functions**: Use `cn()` from `@/lib/utils` for className merging
6. **Query Keys**: Consistent naming like `["homeData", token]`, `["diaries"]`

---

## Before Committing

1. Run `npm run lint` - Fix all errors
2. Check TypeScript types - No `any` types unless absolutely necessary
3. Remove unused imports - ESLint will auto-fix
4. Verify error handling - Ensure try-catch and toast notifications
5. Test authentication flows - Check 401 handling and logout behavior
