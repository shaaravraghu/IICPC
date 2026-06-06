# IICPC CLAUDE_PLAN.md — Implementation Audit & Additional Milestones

## Audit Summary

After a deep inspection of every file in the repository against the original [CLAUDE_PLAN.md](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/CLAUDE_PLAN.md), the project is in **excellent structural shape** — most of the hard infrastructure work was done correctly. However there are **3 critical functional gaps** that prevent the platform from actually working end-to-end as described in [IDEA.txt](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/IDEA.txt) and [IICPC_Plan_Proposal.md](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/IICPC_Plan_Proposal.md).

---

## ✅ What Was Completed Correctly

| Phase | Item | Status |
|---|---|---|
| **Phase 0** | Git merge conflicts in `platform-types/lib.rs`, `eval-algorithms/lib.rs`, `bot_weights.yaml` | ✅ All resolved |
| **Phase 1** | `Cargo.toml` workspace.dependencies (tokio, serde, rdkafka, axum, etc.) | ✅ All present |
| **Phase 1** | `platform-types` — Serialize/Deserialize on all structs/enums | ✅ Done |
| **Phase 1** | `kafka-utils` — real `KafkaProducer` + `KafkaConsumer` (rdkafka); `InMemoryEventBus` behind `#[cfg(test)]` | ✅ Done |
| **Phase 1** | `libs/db-client/` — new crate with connection pool + typed helpers for all 8 tables | ✅ Done |
| **Phase 2** | `api-gateway` — full Axum HTTP server: `/api/submissions`, `/api/leaderboard`, `/api/pipeline/status`, `/api/functions`, `/ws/leaderboard`, `/ws/pipeline/{id}`, CORS | ✅ Done |
| **Phase 2** | `technical-agents` — real Kafka consumer loop, DB writes, telemetry, health server | ✅ Done |
| **Phase 2** | `telemetry-judge` — composite scoring (0.40/0.35/0.25), leaderboard broadcast to `leaderboard-updates`, full DB writes | ✅ Done |
| **Phase 3** | `kafka/cluster.yaml` — 3-broker Strimzi with persistence + resource limits | ✅ Done |
| **Phase 3** | `kafka/topics.yaml` — all 8 topics including `stage4.execution.out`, `stage5.paper_trading.out`, `leaderboard-updates` | ✅ Done |
| **Phase 3** | `timescale/init.sql` — all 8 tables, TimescaleDB hypertable on `telemetry_points`, all indexes | ✅ Done |
| **Phase 3** | `timescale/statefulset.yaml` — PVC, resource requests/limits, readiness/liveness probes | ✅ Done |
| **Phase 3** | `bots/deployments.yaml` — all 7 services with env vars, probes, resources, configmap mounts | ✅ Done |
| **Phase 3** | `bots/hpa.yaml`, `bots/services.yaml`, `ingress.yaml`, `configmap.yaml` | ✅ All created |
| **Phase 3** | `infrastructure/docker/` — `rust-service.Dockerfile`, `api-server.Dockerfile`, `frontend.Dockerfile`, `nginx.conf` | ✅ Done |
| **Phase 4** | `websocket.ts` — Socket.IO server, room management, Kafka `leaderboard-updates` forwarder | ✅ Done |
| **Phase 4** | `index.ts` — calls `setupWebSocketServer` + `startKafkaLeaderboardForwarder` | ✅ Done |
| **Phase 4** | `app.ts` — CORS configured | ✅ Done |
| **Phase 5** | `useWebSocket.ts` — full Socket.IO client hook with exponential backoff reconnect | ✅ Done |
| **Phase 5** | `editor.tsx` — uses `useSocketEvent` for live pipeline progress | ✅ Done |
| **Phase 6** | `docker-compose.yaml` (root) — Kafka (KRaft mode), TimescaleDB + init.sql, all 7 Rust services, TS api-server, frontend | ✅ Done |
| **Phase 7** | `scripts/test-pipeline.sh` — integration test: submit → poll → verify 3-column leaderboard → check WebSocket | ✅ Done |

---

## ❌ Critical Gaps Found

### Gap 1 — Dual-Backend Disconnect: Frontend Never Touches the Rust Pipeline

> [!CAUTION]
> This is the most serious gap. The entire Rust Kafka pipeline (Phases 0–3) is built but **never exercised by real user traffic**.

**What's happening:**
- The frontend ([editor.tsx](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/iicpc-platform/src/pages/editor.tsx)) calls the **TypeScript `api-server`** on port 3001 — specifically `/api/executions/start`, `/api/executions/:id/status`, etc.
- The TS `api-server` has its **own in-process orchestrator** ([orchestrator.ts](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/orchestrator.ts)) and bots ([technicalBot.ts](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/bots), [fundamentalBot.ts](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/bots), [sentimentBot.ts](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/bots)) — a full parallel implementation
- The **Rust `api-gateway`** runs on port 8080 and receives submissions at `/api/submissions`, but the **frontend never calls this endpoint**
- No bridge exists between the TS API and the Rust pipeline
- **Effect:** A user submitting via the frontend goes through the TS orchestrator only. The Kafka pipeline, all 7 Rust services, the real distributed scoring — all sit idle.

### Gap 2 — Editor Shows the Wrong Concept

> [!CAUTION]
> [editor.tsx](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/iicpc-platform/src/pages/editor.tsx) `STARTER_CODE` shows C++/Rust/Go **orderbook matching engine** code — completely the wrong concept.

**What's happening:**
- [IDEA.txt](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/IDEA.txt) says: *"People write code to use the 3 analysis of signals which are saved as function calls"* — the submission is a **strategy manifest** (YAML with grouped metric function calls), not an orderbook implementation
- The Rust `api-gateway` expects a `StrategyManifest` YAML (`technical_groups`, `fundamental_groups`, `sentiment_dimensions`)
- `strategy-parser` validates and provides a working `starter_strategy()` function
- But the editor UI shows C++/Rust/Go code and asks contestants to write matching engines
- The TS API's `createSubmission` stores raw `code` — it never parses a YAML strategy manifest

### Gap 3 — Rust api-gateway WebSocket is One-Shot (Not Live)

> [!WARNING]
> The Rust WebSocket endpoints send one snapshot and then wait passively — they do not stream live updates.

**What's happening:**
- `ws_leaderboard` → sends one `leaderboard_snapshot` JSON payload, then enters a passive loop
- `ws_pipeline/{run_id}` → sends one `pipeline_snapshot`, then goes passive
- The plan required these to **subscribe to Kafka** and push updates to connected clients in real-time
- Live Kafka→WebSocket bridging only exists in the TS `api-server` (via Socket.IO), not in the Rust gateway

---

## ⚠️ Secondary Gaps

### Gap 4 — `bot_weights.yaml` Only Has 8/15 Sentiment Dimensions

[IICPC_Plan_Proposal.md](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/IICPC_Plan_Proposal.md) defines **15 sentiment dimensions** but [bot_weights.yaml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/config/bot_weights.yaml) only has 8. Missing:

| Missing Dimension |
|---|
| `social_media_sentiment` |
| `search_trend_analysis` |
| `insider_trading_analysis` |
| `consumer_review_sentiment` |
| `supply_chain_sentiment` |
| `influencer_community_forum_analysis` |
| `macroeconomic_sentiment_analysis` |

### Gap 5 — `test-pipeline.sh` Only Tests the TS API

[test-pipeline.sh](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/scripts/test-pipeline.sh) targets `API_URL=http://localhost:3001/api` (TS api-server) only. The Rust `api-gateway` at port 8080 is never verified automatically.

### Gap 6 — `README.md` Is Stale

[README.md](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/README.md) still says `kafka-utils` is *"In-memory event-bus abstraction"* — incorrect since Phase 1. The dual-stack architecture is not documented.

### Gap 7 — No Paper Trading UI for Contestants

[IDEA.txt](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/IDEA.txt) says *"Allow people to make paper trades with preset timelines and a 3rd column on the leaderboard for this."* The backend route (`/api/paper-trading/execute`) and Rust service exist, but **there is no frontend page** where contestants can initiate paper trades, choose a timeline, or track P&L.

---

## Additional Milestones

---

### Milestone A — `[CRITICAL]` Bridge Frontend to Rust Pipeline

**Goal:** Make the TS api-server forward submissions to the Rust api-gateway so the real Kafka pipeline runs.

**Rationale:** TS API = auth layer + storage. Rust pipeline = evaluation engine. They need to be wired together.

#### [NEW] `artifacts/api-server/src/lib/rustPipelineBridge.ts`
- `submitToRustPipeline(runId, submissionId, strategyYaml, assets[])` — HTTP POST to Rust api-gateway
- Reads `RUST_PIPELINE_URL` env var (e.g. `http://localhost:8080` locally, `http://api-gateway:8080` in Docker)
- Returns `{ ok: boolean; error?: string }` — errors are logged but do not fail the TS response (graceful degradation)
- If `RUST_PIPELINE_URL` is unset, skip silently and let TS orchestrator run as fallback

#### [MODIFY] [executions.ts](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/routes/executions.ts)
- After creating the test run in DB, call `submitToRustPipeline(runId, submissionId, strategyYaml, assets)`
- The frontend `run_id` now flows into both the TS orchestrator and the Rust pipeline
- The DB is shared so both pipelines write to the same `test_runs`, `asset_scores`, `run_scores` tables

#### [MODIFY] [docker-compose.yaml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/docker-compose.yaml)
- Add `RUST_PIPELINE_URL: http://api-gateway:8080` to the `api-server` environment block
- Expose port `8080:8080` on `api-gateway` service for direct local testing
- Make `api-server` `depends_on: api-gateway: condition: service_started`

**Verification:** Submit via frontend → `docker logs iicpc-technical-agents-1` shows Kafka consumption logs → leaderboard updates via Rust telemetry-judge.

---

### Milestone B — `[CRITICAL]` Replace Orderbook Code Editor with Strategy Manifest Editor

**Goal:** The editor must let contestants compose a `StrategyManifest` YAML, not write orderbook code.

#### [MODIFY] [editor.tsx](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/iicpc-platform/src/pages/editor.tsx)
- Remove `STARTER_CODE` (C++/Rust/Go blocks) and the language selector dropdown
- Replace the raw `<textarea>` with a **YAML strategy editor** panel:
  - Default content: hardcoded starter `StrategyManifest` YAML (see `starterStrategy.ts` below)
  - Optionally: fetch the live starter from `GET /api/functions/starter` on the Rust gateway
- Add a collapsible **Function Catalog** panel on the right side (from `FunctionCatalog.tsx` below)
- Update `handleSubmit` to:
  - POST `{ strategy_yaml: editorContent, assets: assetUniverse }` directly to Rust `api-gateway` `/api/submissions` (or via Milestone A bridge on the TS API)
  - Store the returned `run_id` as `activeTestRunId` for WebSocket progress tracking

#### [NEW] `artifacts/iicpc-platform/src/components/FunctionCatalog.tsx`
- Fetches `GET /api/functions` from the Rust api-gateway (via `VITE_RUST_API_URL` env var)
- Accordion grouped by category: Technical (20), Fundamental (20), Sentiment (15)
- Each metric: key, display name, description, parameters with types
- Click-to-copy button that inserts a YAML function call snippet into the editor

#### [NEW] `artifacts/iicpc-platform/src/lib/starterStrategy.ts`
- Exports `STARTER_STRATEGY_YAML`: a valid hardcoded `StrategyManifest` YAML string that passes `validate_strategy()` in `strategy-parser`
- Includes at least 1 technical group, 1 fundamental group, 2 sentiment dimensions
- Used as the editor default content

**Verification:** User opens editor → sees YAML strategy → browses catalog → clicks a metric → YAML updates → submits → Rust pipeline evaluates it.

---

### Milestone C — `[HIGH]` Rust api-gateway WebSocket — Real Kafka-Backed Live Streaming

**Goal:** Replace one-shot snapshot WebSocket handlers with real Kafka-subscribed streaming.

#### [MODIFY] [main.rs](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/services/api-gateway/src/main.rs)

**`websocket_leaderboard_snapshot` → `websocket_leaderboard_stream`:**
- Send initial snapshot immediately on connect (keep current behavior as first message)
- Spawn a `tokio::task` that creates a `KafkaConsumer` on `Topic::LeaderboardUpdates` with a unique group ID: `format!("ws-leaderboard-{}", Uuid::new_v4())`
- Each message received from Kafka: serialize to JSON, send to WebSocket via `socket.send(Message::Text(...))`
- Select between WebSocket `recv()` and Kafka consumer: abort Kafka task on WebSocket close

**`websocket_pipeline_snapshot` → `websocket_pipeline_stream`:**
- Send initial snapshot immediately
- Poll `pipeline_status_value(&state, &run_id)` every 2 seconds
- Push a JSON update on every poll result, stop when `status == "completed"` or `"failed"`
- Also subscribe `Topic::TelemetryMetrics` filtered by `run_id` to forward raw telemetry events

> [!IMPORTANT]
> Each WebSocket connection **must** use a unique Kafka consumer group ID to avoid group rebalancing across connections. Use `format!("ws-lb-{}", Uuid::new_v4())`.

---

### Milestone D — `[MEDIUM]` Complete `bot_weights.yaml` — All 15 Sentiment Dimensions

#### [MODIFY] [bot_weights.yaml](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/config/bot_weights.yaml)

Add the 7 missing dimensions. Weights must sum to 100:

```yaml
sentiment:
  news_sentiment_analysis: 12
  social_media_sentiment: 8           # ADD
  search_trend_analysis: 5            # ADD
  options_market_sentiment: 12
  institutional_fund_flow_analysis: 10
  analyst_rating_sentiment: 8
  earnings_call_sentiment: 10
  insider_trading_analysis: 6         # ADD
  technical_sentiment_indicators: 8
  consumer_review_sentiment: 4        # ADD
  supply_chain_sentiment: 4           # ADD
  influencer_community_forum_analysis: 4  # ADD
  macroeconomic_sentiment_analysis: 5 # ADD
  alternative_data_sentiment: 9
  prediction_market_analysis: 5       # Total = 110, adjust others to sum to 100
```

> [!IMPORTANT]
> Also verify that `services/sentiment-agents/src/main.rs` actually reads weights from `/app/config/bot_weights.yaml` at startup rather than hardcoding them. If it hardcodes — add YAML parsing with `serde_yaml` and the `bot_weights.yaml` file path from env.

---

### Milestone E — `[MEDIUM]` Paper Trading UI Page

**Goal:** Fulfil [IDEA.txt](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/IDEA.txt): *"Allow people to make paper trades with preset timelines and a 3rd column on the leaderboard for this."*

#### [NEW] `artifacts/iicpc-platform/src/pages/paper-trading.tsx`
- **Timeline selector**: 7d / 30d / 90d buttons (maps to `timeline` param in `POST /api/paper-trading/execute`)
- **Capital input**: default `$100,000` initial capital
- **Start Paper Trade button**: calls TS API `POST /api/paper-trading/execute` with `test_run_id` + `timeline` + `initial_capital`
- **Positions table**: symbol | side | entry price | current price | P&L | P&L % | status
- **Score card**: current paper trading score (Column 3), contribution to composite
- **Live P&L**: uses `useSocketEvent('leaderboard_update', 'leaderboard')` to refresh score when new data arrives

#### [MODIFY] [App.tsx](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/iicpc-platform/src/App.tsx)
- Add `/paper-trading` route
- Add "Paper Trading" entry in the sidebar navigation (after Leaderboard)

---

### Milestone F — `[MEDIUM]` Integration Test Covers the Rust Pipeline

#### [MODIFY] [test-pipeline.sh](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/scripts/test-pipeline.sh)

Add a second test block:
```sh
RUST_API_URL="${RUST_API_URL:-http://localhost:8080}"

echo "=== Testing Rust api-gateway pipeline ==="
# Submit starter strategy YAML
curl -fsS -H "Content-Type: application/json" -X POST \
  -d "{\"strategy_yaml\": \"...\", \"assets\": [\"AAPL\",\"MSFT\"]}" \
  "$RUST_API_URL/api/submissions" > "$tmp_dir/rust_submission.json"

rust_run_id="$(node -e "..."  "$tmp_dir/rust_submission.json")"

# Poll Rust pipeline status
# Verify Rust leaderboard has 3-column scores
# Test Rust WebSocket: ws://localhost:8080/ws/leaderboard
```

---

### Milestone G — `[LOW]` README.md Update

#### [MODIFY] [README.md](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/README.md)
- Update `kafka-utils` row: *"Real Kafka producer/consumer (rdkafka); InMemoryEventBus behind `#[cfg(test)]`"*
- Add **Dual-Stack Architecture** section explaining the two backends and their relationship
- Update `kafka-utils` crate description in the Shared crates table
- Add `docker-compose up` quick-start instructions to **Run And Verify**
- Add env var reference table: `RUST_PIPELINE_URL`, `KAFKA_BROKERS`, `DATABASE_URL`, `POLYGON_API_KEY`

---

## Execution Order

| Priority | Milestone | Effort | Dependency |
|---|---|---|---|
| 🔴 P0 | **A: Frontend→Rust Bridge** | 2 hours | None |
| 🔴 P0 | **B: Strategy Manifest Editor** | 3 hours | A |
| 🟠 P1 | **C: Real-time Rust WebSocket** | 2 hours | None |
| 🟠 P1 | **D: bot_weights.yaml completeness** | 30 min | None |
| 🟡 P2 | **E: Paper Trading UI** | 2 hours | A |
| 🟡 P2 | **F: Integration test for Rust pipeline** | 1 hour | A |
| 🟢 P3 | **G: README update** | 30 min | None |

---

## Full End-to-End Verification (After All Milestones)

1. `docker-compose up -d` — all services start, health checks pass
2. Open `http://localhost:3000` → log in
3. Navigate to **Editor** → see YAML strategy manifest (not C++ code)
4. Browse **Function Catalog** → copy a metric → paste into YAML → click **Run Analysis**
5. Watch pipeline stages animate: Technical → Fundamental → Sentiment → Execution → Paper → Done
6. Navigate to **Leaderboard** → see 3 score columns updated live
7. Navigate to **Paper Trading** → select 7d timeline → click **Start Paper Trade** → watch P&L
8. Run `scripts/test-pipeline.sh` → all checks pass including Rust api-gateway block
9. Check `docker logs iicpc-technical-agents-1` → Kafka consumption logs visible
