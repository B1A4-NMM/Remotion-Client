# 📱 Responsive Web Implementation Plan

This document outlines the strategy for transforming the current mobile-only application into a fully responsive web application supporting Desktop views.

---

## 📐 Core Strategy: Mobile-First

We utilize Tailwind CSS's utility-first, mobile-first approach.
- **Default classes**: Apply to Mobile view (< 768px).
- **`md:` prefix**: Apply to Tablet/Desktop view (>= 768px).
- **`lg:` prefix**: Apply to Large Desktop view (>= 1024px).

### 🎯 Key Breakpoints
| Prefix | Minimum Width | Device Type | Action |
|--------|--------------|-------------|--------|
| (none) | 0px | Mobile | Default vertical layout |
| `md:` | 768px | Tablet/Small Laptop | Sidebar appears, Grid 2 cols |
| `lg:` | 1024px | Desktop | Grid 3 cols, Expanded spacing |

---

## 📅 Phase 1: Layout Architecture (The Shell)

**Goal**: Unbind the fixed mobile width and establish desktop navigation.

### 1. Global Container (`src/Layout.tsx`)
Remove the hardcoded mobile constraints on Desktop.
```tsx
// Before
<div className="max-w-[430px] mx-auto min-h-screen">

// After
<div className="w-full min-h-screen bg-background md:flex">
  {/* Desktop Sidebar (Hidden on Mobile) */}
  <aside className="hidden md:flex w-64 border-r fixed h-full z-50">
     <Sidebar />
  </aside>

  {/* Main Content Area */}
  <main className="flex-1 md:ml-64 max-w-[430px] md:max-w-screen-xl mx-auto w-full">
     <Outlet />
  </main>
</div>
```

### 2. Navigation Split
- **Mobile**: Keep `BottomNavigation.tsx`. Add `md:hidden` class.
- **Desktop**: Create `src/components/Sidebar.tsx`.
  - Should contain the same links as BottomNavigation.
  - Add "Logout" button and "Profile" summary in the sidebar.

---

## 🧱 Phase 2: Page Layouts (The Content)

**Goal**: Utilize horizontal space effectively.

### 1. Home Feed (`src/pages/Home.tsx`)
Transform the single-column list into a grid.
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-8">
  {diaries.map(diary => (
    <DiaryCard key={diary.id} {...diary} />
  ))}
</div>
```

### 2. Analysis & Stats (`src/pages/Analysis.tsx`)
Move from vertical stacking to a dashboard layout.
- **Top**: Summary cards in a row (Vitality, Stress, etc.).
- **Body**: Charts on the Left (2/3 width), Details on the Right (1/3 width).
```tsx
<div className="flex flex-col md:flex-row gap-6">
  <div className="md:w-2/3"><ChartComponent /></div>
  <div className="md:w-1/3"><DetailPanel /></div>
</div>
```

---

## 🛠 Phase 3: Component Adaptation

**Goal**: Optimize UI patterns for mouse vs. touch.

### 1. Modals: Drawer vs. Dialog
Use `useMediaQuery` to render different components based on screen size.
- **Mobile**: `Drawer` (Slide up from bottom).
- **Desktop**: `Dialog` (Centered modal).

```tsx
import { useMediaQuery } from "@/hooks/use-media-query"

const ResponsiveDialog = ({ children }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  return isDesktop ? (
    <Dialog>{children}</Dialog>
  ) : (
    <Drawer>{children}</Drawer>
  )
}
```

### 2. Interactions
- Add **Hover States** to all interactive elements (Cards, Buttons).
  - `hover:bg-accent`, `hover:shadow-lg`, `hover:scale-105`.
- **Scrollbars**: Ensure custom scrollbars are visible or styled for Desktop webkit.

### 3. Maps
- **Mobile**: Fullscreen absolute positioning.
- **Desktop**: Container with fixed height/aspect-ratio or split-pane view.
  - `h-[calc(100vh-bottom_nav)]` -> `md:h-[600px] md:rounded-xl`.

---

## ✅ Implementation Checklist

- [ ] **Setup**: Update `Layout.tsx` to allow full width on `md:`.
- [ ] **Nav**: Create `Sidebar` component and mount it conditionally.
- [ ] **Nav**: Apply `md:hidden` to `BottomNavigation`.
- [ ] **Home**: Apply Grid system to `DiaryCards`.
- [ ] **UI**: Add hover effects to `Button` and `Card` components.
- [ ] **Map**: Fix map container height for desktop view.
- [ ] **Analysis**: Refactor stats page to use 2-column layout.
- [ ] **Auth**: Ensure Login/Signup pages are centered nicely on large screens.

