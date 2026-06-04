# Post-MVP Plan: End-to-End IICPC Distributed Benchmarking Platform

**Target Infrastructure:** Kubernetes + Kafka + Rust services + TimescaleDB + WebSocket streaming  
**Global Benchmark:** Enterprise-grade quant research infrastructure (Bloomberg Terminal, AlgoTrader, QuantConnect standards)  
**Plan Scope:** Six post-MVP components to transition from MVP polling prototype to production-ready system

---

## 1. Rust Services for Heavy Computation (Backtesting & Simulation)

### Current State
- MVP has in-process mock execution simulator in TypeScript
- Rust service stubs exist in `services/execution-sim/` and `services/paper-trading/`
- No real historical backtesting logic yet

### Post-MVP Implementation

#### 1.1 Backtesting Engine Service (`services/execution-sim`)
**Purpose:** Execute contestant strategies against historical market data with sub-millisecond latency.

**Responsibilities:**
- Accept submission ID + asset list + historical date range
- Load OHLCV + order book snapshots from TimescaleDB
- Execute contestant-provided strategy code (via strategy-parser library)
- Simulate order fills using realistic market microstructure (bid-ask spreads, partial fills, slippage)
- Record all trades with timestamp precision (nanosecond-level for fairness)
- Output: trade log + performance metrics (Sharpe, max drawdown, entry quality, exit accuracy)
- Horizontal scale: spawn multiple instances on K8s, fan out date ranges across replicas

**Key Dependencies:**
- `libs/strategy-parser` — parses contestant strategy functions
- `libs/eval-algorithms` — backtest scoring logic (entry quality, exit accuracy)
- `libs/kafka-utils` — publishes results to Kafka topic (e.g., `backtest-results`)
- Database: TimescaleDB for historical data and trade recording

**Technology Stack:**
- Rust + Tokio for async task scheduling
- `polars` or `datafusion` for fast OHLCV processing
- `tonic` for gRPC inter-service calls (execution-sim ↔ central orchestrator)
- Metrics export to Prometheus for monitoring

#### 1.2 Paper Trading Engine (`services/paper-trading`)
**Purpose:** Live forward-testing of contestant strategies on real-time market data.

**Responsibilities:**
- Ingest live market data feeds (FIX, REST, WebSocket)
- Execute contestant-submitted strategy on live signals
- Manage virtual order book for each team's paper portfolio (isolated ledger per submission)
- Record fills and P&L in real-time
- Stream paper trading updates to Kafka → frontend WebSocket
- Handle risk controls (max position size, max daily loss, circuit breakers)
- Deterministic order matching for fairness

**Key Dependencies:**
- `libs/platform-types` — trade/order/position types
- `libs/kafka-utils` — stream live fills to Kafka
- Kafka topic: `paper-trading-events` (persisted 30+ days for replay)
- Database: TimescaleDB (ledger writes) + Redis (hot position state)

**Technology Stack:**
- Rust + Tokio
- `tokio-tungstenite` for WebSocket market data ingestion
- `crossbeam` for thread-safe shared position state
- `tracing` + Jaeger for distributed tracing (track order from ingestion to fill)

#### 1.3 Orchestrator / Deterministic Replay Judge (`services/telemetry-judge`)
**Purpose:** Ensure every backtest and paper trade is auditable and reproducible.

**Responsibilities:**
- Log the exact sequence of market events seen by each submission
- Timestamp all state transitions (order arrival, price movement, fill decision)
- On replay request: re-feed the same events in identical order to submission
- Verify that deterministic replay produces identical results
- Expose replay event stream via Kafka for real-time observation
- Store all event logs in TimescaleDB for historical audit

**Key Architecture:**
- Event sourcing pattern: every transaction is an immutable event
- Kafka acts as the distributed transaction log
- Replay: consume events from Kafka starting offset 0, reproduce state
- Audit output: before/after state diffs stored in TimescaleDB with checksums

---

## 2. Kubernetes Deployment with Kafka Event Streaming

### Current State
- `infrastructure/` directory exists with scaffolding
- No production-grade Kubernetes manifests yet
- Kafka is mentioned in architecture but not wired to services

### Post-MVP Implementation

#### 2.1 Kubernetes Architecture
**Cluster topology:**
```
Ingress (API Gateway) → Load balancer
  ├── api-gateway (Rust, 3 replicas)
  ├── technical-agents (Rust, 5 replicas, HPA)
  ├── fundamental-agents (Rust, 5 replicas, HPA)
  ├── sentiment-agents (Rust, 5 replicas, HPA)
  ├── execution-sim (Rust, 3 replicas, GPU nodes optional)
  ├── paper-trading (Rust, 2 replicas)
  ├── telemetry-judge (Rust, 1 replica, persistent volume)
  └── api-server (TypeScript/Express, 2 replicas)

StatefulSets:
  ├── Kafka broker cluster (3 nodes, Strimzi operator)
  ├── TimescaleDB (1 primary + 1 replica, persistent volume)
  └── Redis (1 master + 1 replica, optional)

Observability:
  ├── Prometheus + Grafana
  ├── Jaeger distributed tracing
  └── Loki log aggregation
```

#### 2.2 Kafka Topic Design
**Topics (persisted, replication factor = 3):**

| Topic | Purpose | Partitions | Retention |
|-------|---------|-----------|-----------|
| `submissions` | Contestant code uploads | 10 | 90 days |
| `market-data` | Real-time price/order book | 50 | 30 days |
| `technical-results` | Stage 1 outputs | 20 | 90 days |
| `fundamental-results` | Stage 2 outputs | 20 | 90 days |
| `sentiment-results` | Stage 3 outputs | 20 | 90 days |
| `backtest-results` | Execution simulator outputs | 20 | 90 days |
| `paper-trading-events` | Live fills and position updates | 20 | 30 days |
| `telemetry-events` | Audit log (every state transition) | 10 | 180 days |
| `leaderboard-updates` | Live leaderboard score changes | 5 | 7 days |

**Event payload schema (Protobuf or Avro):**
- All events include: `timestamp` (nanoseconds), `submission_id`, `event_type`, `data`
- Enables time-travel debugging and exact replay

#### 2.3 Service Configuration (Helm + YAML)
**File structure:**
```
infrastructure/
├── helm/
│   ├── iicpc-platform/
│   │   ├── values.yaml (cluster config, resource limits, scaling)
│   │   ├── Chart.yaml
│   │   ├── templates/
│   │   │   ├── api-gateway-deployment.yaml
│   │   │   ├── kafka-statefulset.yaml
│   │   │   ├── timescaledb-statefulset.yaml
│   │   │   ├── ingress.yaml
│   │   │   ├── configmap-kafka-topics.yaml
│   │   │   └── hpa-agents.yaml (HorizontalPodAutoscaler)
├── scripts/
│   ├── deploy.sh (helm install + post-deploy hooks)
│   ├── migrate-db.sh (TimescaleDB schema setup)
│   └── verify-cluster.sh (health checks)
└── docs/
    ├── DEPLOYMENT.md
    └── SCALING.md
```

**Key configurations:**
- CPU/memory requests per service (e.g., execution-sim needs 2 CPU, 4GB RAM per instance)
- HPA rules: scale technical-agents based on Kafka consumer lag (target lag < 5s)
- PDB (Pod Disruption Budget) to maintain availability during node maintenance
- NetworkPolicy: restrict traffic between services (defense-in-depth)
- Secrets: API keys, Clerk config, Kafka broker addresses (via sealed-secrets or external secret manager)

---

## 3. User Authentication for Paper Trading Results

### Current State
- Clerk is integrated in frontend
- Express API has Clerk middleware
- No per-team ledger for paper trades yet

### Post-MVP Implementation

#### 3.1 Authentication & Authorization Model
**Scope:** Team-level (one user per submission can trade on behalf of team)

**Flow:**
1. User logs in via Clerk (SSO or email)
2. On submission creation, first uploader becomes "team lead"
3. Team lead can invite other users via email to collaboratively manage paper trades
4. All paper trades for a submission are recorded under that team's ledger
5. Only authenticated team members can access paper trading dashboard for their submission

**Implementation:**
- Extend Clerk user metadata: `{team_id, submission_id, role: "lead"|"member"}`
- Express API: add authorization middleware to check team membership before accessing paper-trading endpoints
- Database: add `team_members` table linking (user_id, submission_id, role)

**Key Routes (Express):**
```typescript
// POST /api/submissions/:submissionId/invite
// Invite user by email to manage team's paper trades

// POST /api/paper-trading/orders
// Only team members can place orders for their submission

// GET /api/paper-trading/ledger/:submissionId
// Fetch team's ledger (fills, P&L, open positions)
```

#### 3.2 Paper Trading Ledger (TimescaleDB)
**Schema:**
```sql
CREATE TABLE paper_trading_ledger (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL,
  team_id UUID NOT NULL,
  order_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  side ENUM('BUY', 'SELL'),
  quantity NUMERIC NOT NULL,
  entry_price NUMERIC NOT NULL,
  current_price NUMERIC NOT NULL,
  exit_price NUMERIC,
  status ENUM('OPEN', 'FILLED', 'CLOSED'),
  fill_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE paper_trading_positions (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  avg_entry_price NUMERIC NOT NULL,
  current_unrealized_pnl NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_paper_trading_submission ON paper_trading_ledger(submission_id);
CREATE INDEX idx_paper_trading_positions_submission ON paper_trading_positions(submission_id);
```

**Live updates:** Paper trading service publishes fills to Kafka `paper-trading-events` topic, which frontend consumes via WebSocket.

---

## 4. Historical Leaderboard Archival & Replay

### Current State
- MVP leaderboard is computed on-the-fly from current execution state
- No archival of past scores
- No replay functionality

### Post-MVP Implementation

#### 4.1 Leaderboard Archival Strategy
**Archive per submission:**
- Every 5 minutes during active testing: snapshot leaderboard state to TimescaleDB `leaderboard_snapshots` table
- Capture: submission_id, score_columns (sentiment, backtest, paper_trading), composite rank, timestamp
- Compress old snapshots to cold storage (S3) after 30 days

**Schema:**
```sql
CREATE TABLE leaderboard_snapshots (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL,
  test_run_id UUID NOT NULL,
  sentiment_score NUMERIC,
  backtest_score NUMERIC,
  paper_trading_score NUMERIC,
  composite_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_leaderboard_snapshots_run ON leaderboard_snapshots(test_run_id, created_at);
```

#### 4.2 Streaming Replay Capability
**Replay endpoint (gRPC service in telemetry-judge):**
```protobuf
service ReplayService {
  rpc StreamReplay(ReplayRequest) returns (stream ReplayEvent);
}

message ReplayRequest {
  string submission_id = 1;
  string test_run_id = 2;
  int64 start_timestamp_nanos = 3;
  int64 end_timestamp_nanos = 4;
}

message ReplayEvent {
  int64 timestamp_nanos = 1;
  string event_type = 2;  // "order_received", "price_update", "fill", "state_changed"
  bytes data = 3;  // Protobuf-serialized event
}
```

**How it works:**
1. Frontend user clicks "Replay test run from 14:32:00 UTC"
2. API calls `telemetry-judge` gRPC endpoint with submission_id + timestamp range
3. Judge service consumes events from Kafka `telemetry-events` topic (starting at that offset)
4. Events streamed back to frontend in real-time
5. Frontend renders event log (order received, price ticks, fills) for debugging
6. Concurrent background: execution-sim re-runs strategy against the replayed events, verifies determinism

**Audit verification:**
- If replay produces different results → flag determinism violation
- Store checksums: `hash(event_sequence) == hash(original_run)` ensures integrity

#### 4.3 Historical Leaderboard API
**REST endpoints:**
```
GET /api/leaderboard/historical/:testRunId
  → Returns time-series of leaderboard snapshots for that test run

GET /api/leaderboard/snapshot/:testRunId/:timestamp
  → Returns exact leaderboard state at that point in time

GET /api/submissions/:submissionId/replay
  → Initiates streaming replay of that submission's execution
```

---

## 5. Custom Metric Library Interface

### Current State
- 20 technical metrics and 20 fundamental metrics are hardcoded in Rust libraries
- No way for contestants to extend or compose metrics

### Post-MVP Implementation

#### 5.1 Metric Library API (Rust + WebAssembly)
**Design:** Contestants use existing metrics as predefined functions (no arbitrary code execution).

**Metric function library (in `libs/eval-algorithms`):**
```rust
// Each metric is a pure function: (price_series, volume, etc.) -> bool (pass/fail)
pub fn trend_strength_adx(prices: &[f64], window: usize) -> bool { ... }
pub fn relative_strength_vs_benchmark(prices: &[f64], benchmark: &[f64]) -> bool { ... }
pub fn momentum_roc(prices: &[f64], period: usize) -> bool { ... }
// ... 20 total technical metrics
// ... 20 total fundamental metrics
// ... 15 total sentiment functions
```

**Contestant strategy file (YAML or JSON):**
```yaml
name: "momentum_strategy"
description: "Combine momentum + RSI trend confirmation"
stages:
  technical:
    pass_if_any:
      - trend_strength_adx: {window: 14, threshold: 25}
      - momentum_roc: {period: 12, threshold: 0.05}
  fundamental:
    pass_if_any:
      - revenue_growth_rate: {min: 0.15}
      - free_cash_flow_growth: {min: 0.20}
  sentiment:
    weights:
      - news_sentiment: 0.20
      - social_media_sentiment: 0.15
      - options_market_sentiment: 0.30
      - analyst_upgrades: 0.35
```

**Validation flow:**
1. Contestant uploads strategy config
2. Parser validates: all metric names exist, weights sum to 1.0
3. No arbitrary code execution → safe evaluation
4. Config is stored in TimescaleDB; passed to appropriate agent services

#### 5.2 Metric Configuration Management UI
**Frontend component** (`artifacts/iicpc-platform/src/pages/metric-builder.tsx`):
- Drag-and-drop metric selection
- Configure threshold/window parameters for each metric
- Weight sliders for sentiment dimensions
- Real-time validation feedback
- Preview: how this config would have scored past assets
- Save as template for iteration

**Backend** (Express route):
```typescript
POST /api/submissions/:submissionId/strategy
  Request: { metrics_config: { ... } }
  Response: { validation_status, parsed_rules, estimated_assets_pass }
```

#### 5.3 Metric Extension Point (Future)
- Predefined functions cover 80% of quant use cases
- Power users can request custom metrics → engineering team evaluates + adds to library
- Requires security audit (metric code runs inside privileged service)

---

## 6. Streaming WebSocket Instead of Polling

### Current State
- Frontend polls `/api/executions/:testRunId/status` every 2 seconds
- Leaderboard polls `/api/leaderboard/:testRunId` every 3 seconds
- Unnecessary latency and server load

### Post-MVP Implementation

#### 6.1 WebSocket Architecture
**Technology:** Socket.IO for fallback compatibility, with option to use raw WebSocket

**Server-side (Express):**
```typescript
import { Server } from 'socket.io';

const io = new Server(app, {
  cors: { origin: process.env.FRONTEND_URL },
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket) => {
  // Subscribe to test run updates
  socket.on('subscribe_test_run', (testRunId: string) => {
    socket.join(`test-run:${testRunId}`);
  });

  // Subscribe to paper trading updates
  socket.on('subscribe_paper_trading', (submissionId: string) => {
    socket.join(`paper-trading:${submissionId}`);
  });
});
```

**Kafka consumer (Rust service):**
```rust
// In api-gateway or dedicated socket-relay service
let consumer = create_kafka_consumer(&["leaderboard-updates", "paper-trading-events"]);
loop {
  if let Ok(msg) = consumer.recv() {
    let topic = msg.topic();
    match topic {
      "leaderboard-updates" => {
        // Deserialize leaderboard_score_update
        // Broadcast to all clients subscribed to that test_run
        io.to(format!("test-run:{}", test_run_id)).emit("leaderboard_update", update);
      },
      "paper-trading-events" => {
        // Emit fill notification, position update, P&L change
        io.to(format!("paper-trading:{}", submission_id)).emit("trading_update", event);
      },
      _ => {}
    }
  }
}
```

**Client-side (React):**
```typescript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function Leaderboard({ testRunId }) {
  const [leaderboard, setLeaderboard] = useState([]);
  
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    
    socket.emit('subscribe_test_run', testRunId);
    
    socket.on('leaderboard_update', (update) => {
      setLeaderboard((prev) =>
        prev.map((row) =>
          row.id === update.submission_id ? { ...row, ...update } : row
        )
      );
    });
    
    return () => socket.disconnect();
  }, [testRunId]);
  
  return (
    <table>
      <tbody>
        {leaderboard.map((row) => (
          <tr key={row.id}>
            <td>{row.rank}</td>
            <td>{row.team_name}</td>
            <td>{row.sentiment_score.toFixed(2)}</td>
            <td>{row.backtest_score.toFixed(2)}</td>
            <td>{row.paper_trading_score.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

#### 6.2 Performance Implications
**Latency reduction:**
- Polling @ 2s interval: ~1-2s delay on average
- WebSocket push: <100ms delay (sub-human perception)
- Server CPU savings: ~70% reduction in HTTP requests

**Scalability:**
- 1000 concurrent users polling: 500 req/s
- 1000 concurrent users on WebSocket: <10 msg/s (batched, event-driven)
- Kafka handles the broadcasting (decouples API servers from subscribers)

#### 6.3 Fallback & Reliability
- Socket.IO includes automatic reconnection with exponential backoff
- If WebSocket unavailable → HTTP long-polling
- Kafka acts as the source of truth; missed updates are caught on reconnect

---

## Deployment Checklist & Quality Standards

### Phase 1: Infrastructure Setup (Weeks 1-2)
- [ ] Provision Kubernetes cluster (GCP/AWS/Azure)
- [ ] Deploy Strimzi Kafka operator
- [ ] Deploy TimescaleDB Helm chart
- [ ] Configure persistent volumes (backup strategy, replication)
- [ ] Set up Prometheus + Grafana monitoring
- [ ] Implement Jaeger distributed tracing

### Phase 2: Service Implementation (Weeks 3-6)
- [ ] Implement `execution-sim` Rust service (backtesting engine)
- [ ] Implement `paper-trading` Rust service with ledger management
- [ ] Enhance `telemetry-judge` for event sourcing + replay
- [ ] Wire all services to Kafka topics
- [ ] Add gRPC endpoints for inter-service communication
- [ ] Unit tests: >80% coverage for critical paths (order matching, fill calculation)

### Phase 3: Authentication & APIs (Weeks 7-8)
- [ ] Extend Clerk auth for team membership management
- [ ] Implement paper trading authorization checks
- [ ] Add REST endpoints for leaderboard, ledger, replay
- [ ] Database migrations: add ledger + snapshot tables
- [ ] Integration tests: auth flows, team member access control

### Phase 4: Frontend & WebSocket (Weeks 9-10)
- [ ] Implement WebSocket subscription logic
- [ ] Metric builder UI (drag-drop metric selection)
- [ ] Paper trading dashboard (live positions, P&L, order history)
- [ ] Historical leaderboard viewer (time-series snapshots)
- [ ] Replay debugger UI (event log viewer, determinism verification)
- [ ] E2E tests: full flow from submission → live leaderboard → paper trade

### Phase 5: Observability & Hardening (Weeks 11-12)
- [ ] SLO dashboards (target: 99.9% availability during test runs, <200ms leaderboard update latency)
- [ ] Load testing: 10,000 concurrent users, 500 active test runs
- [ ] Security audit: RBAC, secrets rotation, network policies
- [ ] Disaster recovery drill: Kafka rebalance, DB failover, node failure
- [ ] Documentation: runbooks, scaling guide, troubleshooting

### Quality Standards (Enterprise/Quant Research Grade)
- **Correctness:** Deterministic replay must produce identical results 100% of the time
- **Latency:** Leaderboard updates < 200ms, paper trade fills < 500ms
- **Durability:** Zero data loss on Kafka (replication=3, min_insync_replicas=2)
- **Auditability:** Every transaction immutable in event log, checksummed
- **Scalability:** Support 1000+ concurrent submissions, 100k+ assets per test run
- **Observability:** Full tracing (Jaeger), metrics (Prometheus), logs (Loki)

---

## Architecture Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React)                          │
│  ┌──────────────┬─────────────────┬──────────────┬────────────┐ │
│  │   Editor     │  Live Monitor   │  Leaderboard │ Paper Trade│ │
│  └──────────────┴─────────────────┴──────────────┴────────────┘ │
│                              ▲                                    │
│                              │ WebSocket (Socket.IO)              │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   API Gateway       │
                    │  (Express + Clerk)  │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        ┌───────▼──────┐ ┌────▼────┐ ┌──────▼─────┐
        │ Submission   │ │ Paper    │ │ Telemetry │
        │ Processing   │ │ Trading  │ │ & Replay  │
        │ (Rust)       │ │ (Rust)   │ │ (Rust)    │
        └───────┬──────┘ └────┬────┘ └──────┬─────┘
                │              │             │
                └──────────────┼─────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Kafka Event Bus    │
                    │ (Persistence Log)   │
                    └────┬────────┬───────┘
                         │        │
          ┌─────────────-┴┐      ┌┴──────────────┐
          │               │      │               │
     ┌─────▼──────┐  ┌────▼──┐  ┌┴────┐     ┌────▼──────┐
     │ Technical  │  │ Fund.  │ │Sent.│     │ Execution │
     │ Agents     │  │ Agents │ │Agts │     │ Simulator │
     │ (5x Rust)  │  │(5xRust)│ │(5xR)│     │ (3xRust)  │
     └─────┬──────┘  └────┬──┘  └┬────┘     └────┬──────┘
           │               │     │              │
           └───────────────┼─────┼──────────────┘
                          │     │
                    ┌─────▼─────▼────┐
                    │  TimescaleDB   │
                    │ (Metrics Data) │
                    │ (Ledgers)      │
                    │ (Snapshots)    │
                    └────────────────┘

Historical Data:
  ┌─────────────────────────┐
  │ Market Data (OHLCV)     │
  │ Stored in TimescaleDB   │
  └─────────────────────────┘
```

---

## Success Criteria

1. **Deterministic Replay:** 100% of replayed test runs match original results (verified via checksum)
2. **WebSocket Latency:** Leaderboard updates delivered <200ms from event to frontend
3. **Paper Trading Scale:** Support 1000+ concurrent live trades with sub-500ms fill latency
4. **Historical Query Performance:** Fetch leaderboard snapshot from any timestamp in <100ms
5. **Kubernetes Autoscaling:** Agents auto-scale from 3→15 replicas based on consumer lag; settle in <5 minutes
6. **Audit Trail Completeness:** 100% of transactions logged in telemetry-events topic with cryptographic checksums
7. **Team Authentication:** Zero unauthorized access to paper trading ledgers (all requests validated via Clerk + team membership)
8. **Custom Metric Safety:** All metric compositions validated before execution; no runtime errors due to invalid configs