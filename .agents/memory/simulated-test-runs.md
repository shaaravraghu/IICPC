---
name: Simulated test runs
description: Test runs are simulated with a 7s async state machine in the submissions route — no real infra needed in dev.
---

## Rule
`simulateRun(submissionId, runId)` in `artifacts/api-server/src/routes/submissions.ts` drives the full pipeline simulation:
1. 2s → status: `running`, stage: "Load Test", progress: 30%
2. 4s → stage: "Scoring", progress: 80%
3. 1s → generates random-but-realistic scores, writes `completed` to both `submissions` and `test_runs` tables.

**Why:** The platform design targets Docker Swarm + NATS + Go Bots, none of which exist in the dev environment. Simulation lets the UI's pipeline progress, charts, and leaderboard all work end-to-end without any infra.

**How to apply:** When extending to real infra, replace `simulateRun()` with a webhook/polling mechanism from the actual scoring service. Keep the same DB column writes so the frontend requires no changes.
