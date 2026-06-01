---
name: Vite + Tailwind v4 + Clerk CSS layer ordering
description: tailwindcss({ optimize: false }) is required to prevent Clerk CSS layers from being reordered in production builds.
---

## Rule
In `vite.config.ts`, always use `tailwindcss({ optimize: false })` when the project imports `@clerk/themes/*.css`.

**Why:** Tailwind v4's default lightning CSS optimizer reorders `@layer` declarations, which breaks Clerk's theme cascade in production (dev looks fine because optimizer is skipped). Disabling optimization preserves the intended layer order: `theme, base, clerk, components, utilities`.

**How to apply:** Set in vite.config.ts plugins array: `tailwindcss({ optimize: false })`.
