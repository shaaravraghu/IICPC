# IICPC Full-Stack Production Implementation Plan

## Codebase Audit Summary

After scanning every file in the repository, here is the **true state** of the project:

### What's Real Code
| Component | State | Notes |
|---|---|---|
| **Rust shared crates** (`libs/`) | ✅ Functional but broken | `platform-types`, `eval-algorithms`, `strategy-parser`, `kafka-utils` all have real logic. **Critical: 15+ git merge conflicts (`<<<<<<<`) scattered across `platform-types/lib.rs`, `eval-algorithms/lib.rs`, `bot_weights.yaml`** |
| **Rust services** (`services/`) | ❌ Stub `main()` only | All 7 services are print-and-exit demos — no HTTP server, no Kafka consumer, no actual processing |
| **TypeScript API** (`artifacts/api-server/`) | ✅ Substantial | Orchestrator, 3 bots, execution simulator, market data fetcher, paper trading sim, routes — all have real business logic |
| **React frontend** (`artifacts/iicpc-platform/`) | ✅ Substantial | Editor with pipeline progress, leaderboard with 3-column scoring, layout with sidebar widgets |
| **DB schema** (`lib/db/`) | ✅ Functional | Drizzle ORM schemas for all tables exist |
| **K8s manifests** (`infrastructure/kubernetes/`) | ⚠️ Minimal scaffold | Namespace, RBAC, stub Strimzi topic CRDs, basic TimescaleDB StatefulSet, bot deployments without env/ports/resources |
| **Kafka** | ⚠️ In-memory only | `kafka-utils` is an `InMemoryEventBus` — no actual Kafka client |
| **Config** | ⚠️ Broken | `bot_weights.yaml` has merge conflicts |

### Critical Blockers
1. **Git merge conflicts** — 15+ unresolved `<<<<<<<`/`>>>>>>>` markers in `platform-types/lib.rs`, `eval-algorithms/lib.rs`, `bot_weights.yaml`. `cargo build` and `cargo test` will fail.
2. **Rust services are stubs** — no HTTP servers, no Kafka producers/consumers, just `println!` demos
3. **No real Kafka integration** — `kafka-utils` is an in-memory HashMap queue
4. **Frontend-backend integration gap** — frontend calls `/api/*` with relative URLs but no proxy/CORS configured, and the API server may not even run (DB not migrated)
5. **K8s manifests are skeletal** — no Kafka cluster manifest (only topics), no resource limits, no env vars, no HPA, no ingress
6. **TimescaleDB init.sql is minimal** — only 2 tables vs. the 6+ the Drizzle schema defines

---

## Proposed Changes

### Phase 0: Fix Git Merge Conflicts (Prerequisite)

Must be done first — nothing compiles until these are resolved.

#### [MODIFY] [lib.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/libs/platform-types/src/lib.rs)
- Resolve all `<<<<<<<`/`=======`/`>>>>>>>` markers
- Keep ALL struct definitions: `FundamentalMetricDefinition`, `SentimentMetricDefinition`, plus all existing types
- Result: clean file with all types that both branches introduced

#### [MODIFY] [lib.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/libs/eval-algorithms/src/lib.rs)
- Resolve ~10 merge conflict blocks
- Keep all catalog functions: `technical_metric_catalog()`, `fundamental_metric_catalog()`, `sentiment_metric_catalog()` (keep the cleaner deduplicated version)
- Keep all scoring/utility functions
- Remove the duplicate `sentiment_metric_catalog()` (lines 745-898 are a duplicate of lines 900-1055)
- Result: single clean file with one copy of each function

#### [MODIFY] [bot_weights.yaml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/config/bot_weights.yaml)
- Resolve merge conflicts
- Keep the complete version with leaderboard weights section

---

### Phase 1: Rust Crate Foundation — Serde + Kafka Client + TimescaleDB Client

Add real dependencies to all Rust crates so services can serialize data, talk to Kafka, and read/write TimescaleDB.

#### [MODIFY] [Cargo.toml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/Cargo.toml)
- Add `[workspace.dependencies]` section with shared versions for: `serde`, `serde_json`, `tokio`, `rdkafka`, `tokio-postgres`, `axum`, `tower-http`, `tracing`, `tracing-subscriber`, `uuid`, `chrono`

#### [MODIFY] [Cargo.toml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/libs/platform-types/Cargo.toml)
- Add `serde` + `serde_json` dependencies
- Add `#[derive(Serialize, Deserialize)]` to all public types so they can transit over Kafka

#### [MODIFY] [lib.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/libs/platform-types/src/lib.rs)
- Add `use serde::{Serialize, Deserialize}` 
- Add `#[derive(Serialize, Deserialize)]` to every struct/enum

#### [MODIFY] [Cargo.toml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/libs/kafka-utils/Cargo.toml)
- Add `rdkafka` (librdkafka wrapper), `tokio`, `serde_json`, `tracing`

#### [MODIFY] [lib.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/libs/kafka-utils/src/lib.rs)
- Replace `InMemoryEventBus` with real `KafkaProducer` and `KafkaConsumer` wrappers
- Add `KafkaConfig` struct (broker list, client ID, group ID)
- Keep `InMemoryEventBus` behind `#[cfg(test)]` for unit tests
- Implement `publish()` → `rdkafka::producer::FutureProducer`
- Implement `subscribe()` → `rdkafka::consumer::StreamConsumer`
- Add serialization: events → JSON → Kafka message bytes

#### [NEW] `libs/db-client/` — shared TimescaleDB client crate
- `Cargo.toml` with `tokio-postgres`, `deadpool-postgres`, `serde_json`
- Connection pool management
- Typed query helpers for `run_scores`, `telemetry_points`, and the extended schema
- Used by all services that write to TimescaleDB

---

### Phase 2: Real Rust Services — Axum HTTP + Kafka Consumer/Producer

Transform every stub service into a real async service with an HTTP health endpoint, Kafka consumer loop, and business logic.

#### [MODIFY] All service `Cargo.toml` files
Add common dependencies: `axum`, `tokio`, `tower-http`, `tracing`, `tracing-subscriber`, `serde`, `serde_json`, `rdkafka` (via kafka-utils), `tokio-postgres` (via db-client)

---

#### [MODIFY] [main.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/services/api-gateway/src/main.rs)
Full rewrite: Axum HTTP server that:
- Serves `POST /api/submissions` — receive strategy manifest YAML, validate via `strategy-parser`, publish to Kafka `submissions` topic
- Serves `GET /api/leaderboard` — query TimescaleDB `run_scores`, return ranked JSON
- Serves `GET /api/pipeline/status` — query current pipeline state
- Serves `GET /api/healthz` — health check
- WebSocket endpoint `GET /ws/leaderboard` — subscribe to live leaderboard updates from Kafka `leaderboard-updates` topic
- WebSocket endpoint `GET /ws/pipeline/:runId` — subscribe to live pipeline progress
- Configurable via env vars: `KAFKA_BROKERS`, `DATABASE_URL`, `PORT`

#### [MODIFY] [main.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/services/technical-agents/src/main.rs)
Full rewrite: Kafka consumer that:
- Consumes from `submissions` topic (gets strategy + asset list)
- For each asset batch: runs the 20 technical metrics from `eval-algorithms`
- Publishes pass/fail results to `stage1.technical.out` topic
- Publishes telemetry events to `sys.telemetry.metrics`
- Writes bot events to TimescaleDB
- HTTP health endpoint on configurable port
- Horizontally scalable (Kafka consumer group handles partitioning)

#### [MODIFY] [main.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/services/fundamental-agents/src/main.rs)
Full rewrite: Kafka consumer that:
- Consumes from `stage1.technical.out` (only assets that passed technical)
- Runs 20 fundamental metrics
- Publishes to `stage2.fundamental.out`
- Same pattern as technical-agents

#### [MODIFY] [main.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/services/sentiment-agents/src/main.rs)
Full rewrite: Kafka consumer that:
- Consumes from `stage2.fundamental.out`
- Runs 15 weighted sentiment methods
- Publishes ranked assets with sentiment scores to `stage3.sentiment.out`
- Same pattern

#### [MODIFY] [main.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/services/execution-sim/src/main.rs)
Full rewrite: Kafka consumer that:
- Consumes from `stage3.sentiment.out`
- Fetches OHLCV data from TimescaleDB `historical_prices` (or synthetic fallback)
- Runs backtesting: 5 intraday + short/medium/long trades per asset
- Calculates Sharpe, drawdown, win rate, profit factor
- Publishes to `stage4.execution.out`
- Writes trade records to TimescaleDB

#### [MODIFY] [main.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/services/paper-trading/src/main.rs)
Full rewrite: Kafka consumer that:
- Consumes from `stage4.execution.out`
- Simulates forward paper trades over configurable timeline
- Tracks positions, P&L, risk metrics
- Publishes to `stage5.paper_trading.out`
- Writes positions to TimescaleDB

#### [MODIFY] [main.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/services/telemetry-judge/src/main.rs)
Full rewrite: Kafka consumer that:
- Consumes from ALL stage output topics + `sys.telemetry.metrics`
- Aggregates final composite scores: `signal * 0.40 + execution * 0.35 + paper * 0.25`
- Writes completed `LeaderboardRow` to TimescaleDB `run_scores`
- Publishes to `leaderboard-updates` topic (consumed by API gateway WebSocket)
- Tracks latency percentiles (p50/p90/p99) per layer
- Verifies deterministic scoring

---

### Phase 3: Kubernetes Manifests — Production-Grade

#### [MODIFY] [namespace.yaml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/kubernetes/base/namespace.yaml)
- Add labels for monitoring

#### [NEW] `infrastructure/kubernetes/kafka/cluster.yaml`
- Strimzi `Kafka` CR with 3 broker replicas, ZooKeeper (or KRaft), persistence, resource limits
- This is the **missing piece** — topic CRDs exist but no cluster to create them on

#### [MODIFY] [topics.yaml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/kubernetes/kafka/topics.yaml)
- Add missing topics: `stage4.execution.out`, `stage5.paper_trading.out`, `submissions`, `leaderboard-updates`
- Add retention configs

#### [MODIFY] [statefulset.yaml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/kubernetes/timescale/statefulset.yaml)
- Add persistent volume claim (data survives pod restarts)
- Add resource requests/limits
- Add readiness/liveness probes
- Mount `init.sql` via ConfigMap

#### [MODIFY] [init.sql](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/kubernetes/timescale/init.sql)
- Extend to create all required tables: `run_scores`, `telemetry_points`, `asset_scores`, `bot_events`, `historical_prices`, `paper_trade_positions`, `leaderboard_snapshots`
- Add TimescaleDB hypertable for `telemetry_points` (time-series optimization)
- Add indexes

#### [MODIFY] [deployments.yaml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/kubernetes/bots/deployments.yaml)
- Add all 7 services (currently only has 3)
- Add env vars: `KAFKA_BROKERS`, `DATABASE_URL`, `RUST_LOG`
- Add resource requests/limits
- Add readiness/liveness probes (`/healthz`)
- Add proper port configs

#### [NEW] `infrastructure/kubernetes/bots/hpa.yaml`
- HorizontalPodAutoscaler for technical-agents, fundamental-agents, sentiment-agents
- Scale based on CPU utilization or Kafka consumer lag

#### [NEW] `infrastructure/kubernetes/bots/services.yaml`
- ClusterIP services for each Rust service (for internal HTTP health checks)

#### [NEW] `infrastructure/kubernetes/ingress.yaml`
- Ingress resource for API gateway (external access)
- Path routing: `/api/*` → api-gateway service
- WebSocket upgrade support for `/ws/*`

#### [NEW] `infrastructure/kubernetes/configmap.yaml`
- ConfigMap with `bot_weights.yaml` and `kafka_topics.yaml` mounted into services

#### [NEW] `infrastructure/docker/`
- Multi-stage `Dockerfile` for Rust services (build + slim runtime)
- `Dockerfile` for TypeScript API server
- `Dockerfile` for React frontend (nginx static serve)
- `docker-compose.yaml` for local development (Kafka + TimescaleDB + all services)

---

### Phase 4: TypeScript API — WebSocket + Backend-Frontend Integration

#### [MODIFY] [app.ts](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/app.ts)
- Add CORS middleware (allow frontend origin)
- Add Socket.IO server setup alongside Express
- Add WebSocket event handlers for `subscribe_test_run` and `subscribe_leaderboard`

#### [NEW] `artifacts/api-server/src/lib/websocket.ts`
- Socket.IO server configuration
- Room management for test run subscriptions
- Kafka consumer that forwards `leaderboard-updates` topic messages to connected WebSocket clients
- Pipeline progress broadcasting

#### [MODIFY] [executions.ts](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/routes/executions.ts)
- When pipeline state changes, emit WebSocket event to room `test-run:{testRunId}`
- Broadcast execution progress in real-time instead of requiring polling

#### [MODIFY] [leaderboard.ts](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/routes/leaderboard.ts)
- When scores update, emit WebSocket event to room `leaderboard`
- Add endpoint for historical snapshots

---

### Phase 5: Frontend — WebSocket + Polish

#### [NEW] `artifacts/iicpc-platform/src/hooks/useWebSocket.ts`
- Custom React hook wrapping Socket.IO client
- Auto-reconnect with exponential backoff
- Room subscription management
- Returns reactive state that updates on server push

#### [MODIFY] [editor.tsx](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/iicpc-platform/src/pages/editor.tsx)
- Replace `useQuery` polling with `useWebSocket` for real-time pipeline progress
- Fix API base URL to use `VITE_API_URL` env var (currently hardcoded relative paths)
- Fallback to polling if WebSocket disconnects

#### [MODIFY] [leaderboard.tsx](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/iicpc-platform/src/pages/leaderboard.tsx)
- Replace polling with WebSocket subscription for live score updates
- Add smooth animations when scores change (row reordering, score counter)
- Fix API base URL

#### [MODIFY] [App.tsx](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/iicpc-platform/src/App.tsx)
- Ensure env-based API URL configuration
- Add WebSocket provider context

---

### Phase 6: Docker Compose for Local Development

#### [NEW] `docker-compose.yaml` (project root)
Full local development stack:
```yaml
services:
  kafka:        # Confluent/Strimzi single-node
  timescaledb:  # TimescaleDB with init.sql
  api-gateway:  # Rust binary
  technical-agents:
  fundamental-agents:
  sentiment-agents:
  execution-sim:
  paper-trading:
  telemetry-judge:
  api-server:   # Express TypeScript
  frontend:     # Vite dev server
```

#### [NEW] `infrastructure/scripts/deploy.sh` (rewrite existing stub)
- `docker-compose up -d` for local
- `kubectl apply` workflow for K8s

---

### Phase 7: Integration Testing & Verification

#### [NEW] `scripts/test-pipeline.sh`
- Submits a starter strategy via `curl` to API gateway
- Polls pipeline status until completion
- Verifies leaderboard has 3-column scores
- Checks WebSocket connectivity

---

## Open Questions

> [!IMPORTANT]
> **Kafka client choice**: `rdkafka` requires `librdkafka` (C library) installed. This adds build complexity but is the industry standard Rust Kafka client. Alternative: `rskafka` (pure Rust, simpler build, fewer features). Which do you prefer?

> [!IMPORTANT]
> **Docker registry**: Where will Docker images be pushed? Local `minikube` registry, Docker Hub, or a cloud registry (GCR/ECR)? This affects the Dockerfile image tag and K8s deployment image references.

> [!IMPORTANT]
> **Deployment target**: Are you deploying to a real K8s cluster (GKE/EKS/AKS), or is `minikube`/`kind` for local demo sufficient for the hackathon?

> [!WARNING]
> **The git merge conflicts MUST be resolved first**. Nothing in the Rust workspace compiles. I recommend resolving these immediately before starting any other phase.

---

## Verification Plan

### Automated Tests
1. `cargo test --workspace` — all Rust unit tests pass (after merge conflict resolution)
2. `cargo build --workspace` — all services compile
3. `docker-compose up` — all services start and connect to Kafka + TimescaleDB
4. `scripts/test-pipeline.sh` — end-to-end pipeline test
5. Frontend builds: `cd artifacts/iicpc-platform && pnpm build`

### Manual Verification
- Submit strategy in editor → see pipeline progress in real-time via WebSocket
- Leaderboard updates live as scores arrive
- `kubectl get pods -n iicpc-platform` shows all services running
- Kafka topics have messages flowing through the pipeline

---

## Execution Order

| Priority | Phase | Estimated Effort | Dependency |
|---|---|---|---|
| 🔴 P0 | Phase 0: Fix merge conflicts | 30 min | None |
| 🔴 P0 | Phase 1: Rust crate foundation | 2 hours | Phase 0 |
| 🟠 P1 | Phase 2: Real Rust services | 4 hours | Phase 1 |
| 🟠 P1 | Phase 3: K8s manifests | 2 hours | Phase 2 |
| 🟡 P2 | Phase 4: TS API WebSocket | 1.5 hours | Phase 2 |
| 🟡 P2 | Phase 5: Frontend WebSocket | 1 hour | Phase 4 |
| 🟢 P3 | Phase 6: Docker Compose | 1 hour | Phases 2-5 |
| 🟢 P3 | Phase 7: Integration tests | 1 hour | Phase 6 |
