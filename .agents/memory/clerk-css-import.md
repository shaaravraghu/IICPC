---
name: Clerk CSS import quirk
description: @clerk/themes/shadcn.css must be installed in the artifact's own devDeps, not just the workspace root.
---

## Rule
Always run `pnpm --filter @workspace/<artifact> add @clerk/react @clerk/themes` — installing at the workspace root is not enough for Vite to resolve the CSS import.

**Why:** Vite's CSS `@import` resolver looks in the artifact's own `node_modules`, not the hoisted workspace root. If the package is only at the root, the import fails at dev-server startup with "Can't resolve '@clerk/themes/shadcn.css'".

**How to apply:** When setting up Clerk on any new artifact, add both `@clerk/react` and `@clerk/themes` to that artifact's dependencies via the filter flag.
