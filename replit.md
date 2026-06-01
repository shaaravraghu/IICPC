# IICPC Benchmarking Platform

A distributed exchange engine benchmarking platform for the IICPC Summer Hackathon 2026. Participants submit C++/Rust/Go orderbook implementations, which are stress-tested by synthetic market bots and scored on speed, stability, and correctness.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed-functions` — seed the functions library
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind v4, shadcn/ui, Wouter, TanStack Query
- Auth: Clerk (`@clerk/react`, `@clerk/themes`)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas (don't edit)
- `lib/api-client-react/src/generated/` — generated TanStack Query hooks (don't edit)
- `lib/db/src/schema/` — Drizzle ORM table definitions
- `artifacts/api-server/src/routes/` — Express route handlers (profile, submissions, leaderboard, pipeline, functions, botfleet)
- `artifacts/iicpc-platform/src/pages/` — React pages (home, editor, leaderboard, learn, profile)
- `artifacts/iicpc-platform/src/components/layout/app-sidebar.tsx` — side navigation

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → Zod validators + React Query hooks
- Auth is cookie-based (Clerk). No Bearer tokens on the web app.
- Test runs are simulated locally (no actual Docker Swarm/NATS in dev): `simulateRun()` in submissions.ts drives a 7s state machine and writes realistic scores to the DB
- Functions library is a static seed (`scripts/src/seed-functions.ts`), not editable by users
- Infra config (NATS vs Kafka, Swarm vs K8s) is driven by `MESSAGE_TRANSPORT` / `ORCHESTRATOR` env vars; defaults to NATS + Docker Swarm

## Product

- **Monitor** — live pipeline health (NATS/Kafka, Swarm/K8s, ClickHouse/TimescaleDB, bots, scoring engine) + bot fleet cards
- **Editor** — split-screen code editor + results pane; submit Go/Rust/C++ code, watch 7-stage pipeline progress, see composite score + latency/TPS charts
- **Leaderboard** — live ranked table with expandable telemetry detail per submission
- **Learn** — searchable functions library (17 primitives: RSI, VWAP, MACD, order imbalance, etc.) with full docs in a slide-out sheet
- **Profile** — editable user profile + full submission history

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `@clerk/themes` CSS import (`@import "@clerk/themes/shadcn.css"`) requires the package to be installed in the frontend artifact's own node_modules, not just the workspace root
- Vite must use `tailwindcss({ optimize: false })` or Clerk theme CSS layers get reordered in prod builds
- Express 5 wildcard routes must be named: `/{*splat}` not `*`
- `FunctionDef` DB table uses `parametersJson`/`tagsJson` (text) — routes parse to `parameters`/`tags` arrays before responding; Zod strips the raw strings

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
