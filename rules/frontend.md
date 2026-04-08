---
name: frontend
description: Rules for frontend code — React components, hooks, state management, styling
globs: ["src/components/**", "src/pages/**", "src/hooks/**", "src/store/**", "frontend/src/**"]
---

# Frontend Rules

## Components
- Functional components only — no class components
- Props interface defined inline or co-located, not in a shared types barrel
- No direct DOM manipulation — use refs when necessary
- Components under 200 lines; extract sub-components when exceeding

## Hooks
- Custom hooks prefixed with `use`
- useEffect dependency arrays must be complete — no eslint-disable for exhaustive-deps
- No useEffect for derived state — use useMemo instead
- Cleanup functions required for subscriptions, timers, event listeners

## State
- Local state (useState) for UI-only state
- Zustand/store for shared state across components
- No prop drilling deeper than 2 levels — lift to store or use context

## Styling
- Tailwind utility classes preferred over custom CSS
- No inline style objects unless dynamic values require it
- Responsive: mobile-first (sm → md → lg)

## Performance
- React.memo only when measured — not by default
- Virtualize lists over 50 items (react-window, tanstack-virtual)
- Lazy load routes and heavy components with React.lazy + Suspense
- Images: explicit width/height, lazy loading, WebP/AVIF when possible

## No-go
- No `any` in props or state types
- No `console.log` in committed code (use a logger utility)
- No `index` as key in dynamic lists
- No direct fetch in components — use a service/api layer
