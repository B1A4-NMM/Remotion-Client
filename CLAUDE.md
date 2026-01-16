# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Remotion is an emotion-based relationship visualization app (감정 기반 관계도 앱) built with React 19 and TypeScript. It helps users track and visualize their emotions through diary entries, relationship diagrams, and mental health assessments.

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start Vite dev server (port 5173)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- **React 19** + **TypeScript 5.8** (strict mode)
- **Vite 6** for bundling and dev server
- **Tailwind CSS 3.4** + **Shadcn UI** for styling (v4.x downgraded due to issues)
- **Zustand** for client-side state management
- **TanStack React Query** for server state/caching
- **Axios** with JWT interceptors for API calls
- **React Router DOM 7** for routing

### State Management Pattern
- **Zustand stores** (`src/store/`): Client state (auth, todos, calendar, notifications)
- **React Query hooks** (`src/api/queries/`): Server state with caching and automatic refetching

### API Layer Structure
```
src/api/
├── axios.ts           # HTTP client with JWT refresh interceptors
├── services/          # API functions (getHomeData, createTodo, etc.)
└── queries/           # React Query hooks organized by feature
    ├── auth/
    ├── diary/
    ├── home/
    ├── todo/
    └── ...
```

### Query Hook Patterns
```tsx
// Read operations: useGet{Resource}
export const useGetHomeData = (token: string) => useQuery({...});

// Write operations: use{Action}{Resource}
export const useDeleteDiary = () => useMutation({...});
```

### Authentication Flow
1. JWT stored in localStorage (`accessToken`)
2. Axios interceptor attaches `Bearer {token}` header
3. On 401 response, auto-refresh via `/auth/refresh` endpoint
4. Token expiry warning shows 10 minutes before expiration

### Routing
Routes defined in `src/routes.tsx`. All routes wrapped with `<ProtectedRoute>` except `/login` and `/getAccess`.

### Responsive Design
- **Mobile**: Max-width 414px with `<BottomNavigation>`
- **Desktop**: `<Sidebar>` component
- Layout logic in `src/Layout.tsx`
- Tailwind breakpoint: `md:` (768px) for desktop styles

## Code Style

### Prettier Config
- Double quotes, semicolons required
- 100 char width, 2 space indent
- Trailing commas: ES5 style
- Arrow parens: avoid when possible

### ESLint Rules (Flat Config)
- Unused imports are **errors** (auto-removed)
- React hooks rules enforced
- Prefix unused variables with `_` to ignore

### Import Conventions
```tsx
// External libraries first
import { useQuery } from "@tanstack/react-query";

// Type imports use 'import type'
import type { HomeResponse } from "@/types/diary";

// Local imports use @ alias
import { getHomeData } from "@/api/services/home";
```

### Naming Conventions
- Components: `PascalCase`
- Hooks: `use{Name}` (e.g., `useAuth`, `useGetHomeData`)
- Zustand stores: `use{StoreName}` (e.g., `useUserStore`)
- API services: `camelCase` (e.g., `getHomeData`, `createTodo`)

### Utility Function
Use `cn()` from `@/lib/utils` for merging Tailwind classes:
```tsx
import { cn } from "@/lib/utils";
<div className={cn("base-class", condition && "conditional-class")} />
```

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app with Routes, Providers, Modals |
| `src/Layout.tsx` | Responsive layout with nav/sidebar |
| `src/routes.tsx` | Route definitions with ProtectedRoute |
| `src/api/axios.ts` | HTTP client with JWT interceptors |
| `src/store/userStore.ts` | Auth state + token expiry |
| `src/components/ProtectedRoute.tsx` | Route auth guard |

## Environment Variables

Required in `.env`:
```
VITE_SOCIAL_AUTH_URL=https://api.remotion.online
VITE_GOOGLE_MAPS_API_KEY=<key>
VITE_VAPID_PUBLIC_KEY=<push notification key>
```
