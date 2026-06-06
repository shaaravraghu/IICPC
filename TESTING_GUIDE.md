# IICPC Platform — Testing Phase Guide

> [!IMPORTANT]
> Complete all steps in **Section 1 (Prerequisites)** before running any tests.
> The Rust services take ~5–10 minutes to compile on first launch.

---

## Section 1 — Prerequisites

### 1.1 Required Tools

| Tool | Minimum Version | Check Command |
|---|---|---|
| Docker Desktop | 24.x | `docker --version` |
| Docker Compose | v2.x (bundled) | `docker compose version` |
| Node.js | 20.x | `node --version` |
| pnpm | 8.x | `pnpm --version` |
| Rust toolchain | 1.82+ | `rustc --version` |
| `curl` | any | `curl --version` |

### 1.2 Environment Variables

Create a `.env` file in the **project root** (`/Users/shaarav/Documents/GitHub_Projects/IICPC/`):

```sh
# Required for authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Optional — leave blank for local testing without auth enforcement
VITE_CLERK_PROXY_URL=

# Optional — real market data (leave blank; platform uses mock data when absent)
POLYGON_API_KEY=
```

> [!TIP]
> For purely local testing, you can leave all Clerk keys blank. The frontend will render with a mock auth context and all pipeline features will still work.

---

## Section 2 — Starting the Platform

### 2.1 First-Time Setup (Compile & Pull)

```sh
cd /Users/shaarav/Documents/GitHub_Projects/IICPC

# Pull all Docker base images in parallel
docker compose pull kafka timescaledb

# Start infrastructure only first — let DB and Kafka become healthy before Rust compiles
docker compose up -d kafka timescaledb
```

Wait for both to become healthy (~30 s):

```sh
docker compose ps kafka timescaledb
# Both should show: (healthy)
```

### 2.2 Start All Services

```sh
# Launch all 9 services
docker compose up -d

# Watch startup logs (Ctrl+C safe — services keep running)
docker compose logs -f --tail=50
```

**Expected startup order and healthy indicators:**

| Service | Port | Healthy When |
|---|---|---|
| `kafka` | 9092, 29092 | `(healthy)` in `docker compose ps` |
| `timescaledb` | 5432 | `(healthy)` in `docker compose ps` |
| `api-gateway` | 8080 | `Listening on 0.0.0.0:8080` in logs |
| `technical-agents` | 8081 | `Kafka consumer started` in logs |
| `fundamental-agents` | 8082 | `Kafka consumer started` in logs |
| `sentiment-agents` | 8083 | `Kafka consumer started` in logs |
| `execution-sim` | 8084 | `Kafka consumer started` in logs |
| `paper-trading` | 8085 | `Kafka consumer started` in logs |
| `telemetry-judge` | 8086 | `Kafka consumer started` in logs |
| `api-server` | 3001 | `API server listening on port 3001` in logs |
| `frontend` | 3000 | `Local: http://localhost:3000` in logs |

> [!NOTE]
> Rust services compile from source on first run. Expect **5–10 minutes** for the first `docker compose up`. Subsequent restarts use the `target-cache` volume and are near-instant.

---

## Section 3 — Health Verification (Run These First)

Run each check before proceeding to functional tests.

### 3.1 TypeScript API Server

```sh
curl -s http://localhost:3001/api/healthz | jq .
# Expected: { "status": "ok", "db": "connected", "kafka": "connected" }
```

### 3.2 Rust API Gateway

```sh
curl -s http://localhost:8080/api/health | jq .
# Expected: { "status": "ok" }
```

### 3.3 Database Schema

```sh
docker compose exec timescaledb psql -U postgres -d iicpc -c "\dt"
# Expected: 8 tables — submissions, test_runs, asset_scores, run_scores,
#           telemetry_points, paper_trade_positions, leaderboard_entries, users
```

### 3.4 Kafka Topics

```sh
docker compose exec kafka kafka-topics \
  --bootstrap-server kafka:9092 \
  --list
# Expected topics include:
#   stage1.technical.in, stage1.technical.out
#   stage2.fundamental.in, stage2.fundamental.out
#   stage3.sentiment.in, stage3.sentiment.out
#   stage4.execution.in, stage4.execution.out
#   stage5.paper_trading.in, stage5.paper_trading.out
#   leaderboard-updates, telemetry-metrics
```

### 3.5 Frontend

Open [http://localhost:3000](http://localhost:3000) in a browser. You should see the IICPC platform home page.

---

## Section 4 — Automated Integration Test

The [`scripts/test-pipeline.sh`](file:///Users/shaarav/Documents/GitHub_Projects/IICPC/scripts/test-pipeline.sh) script tests the full TS API → Rust pipeline → leaderboard flow automatically.

### 4.1 Run the Test

```sh
cd /Users/shaarav/Documents/GitHub_Projects/IICPC

# Default: targets TS api-server on port 3001
bash scripts/test-pipeline.sh

# Full output with custom timeout (seconds)
POLL_SECONDS=120 bash scripts/test-pipeline.sh
```

**What the script validates:**
1. `GET /api/healthz` — TS API is alive
2. `POST /api/executions/start` — pipeline accepted, returns `testRunId`
3. Polls `GET /api/executions/:id/status` until `status = "completed"`
4. `GET /api/leaderboard/:id` — verifies all 3 score columns present (`sentimentScore`, `executionScore`, `paperScore`)
5. Socket.IO WebSocket connectivity — joins `leaderboard` and `test-run:*` rooms

### 4.2 Test Against Rust API Gateway Directly

```sh
# Submit a strategy YAML directly to Rust gateway (bypasses TS API)
curl -s -X POST http://localhost:8080/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "test-direct-001",
    "run_id": "rust-test-run-001",
    "strategy_yaml": "technical_groups:\n  - name: momentum\n    metrics:\n      - function: rsi\n        parameters:\n          period: 14\nfundamental_groups:\n  - name: value\n    metrics:\n      - function: pe_ratio\nsentiment_dimensions:\n  news_sentiment_analysis: 30\n  social_media_sentiment: 20\n  options_market_sentiment: 50\n",
    "assets": ["AAPL", "MSFT", "NVDA"]
  }' | jq .

# Check status
curl -s http://localhost:8080/api/pipeline/status/rust-test-run-001 | jq .

# Check leaderboard
curl -s http://localhost:8080/api/leaderboard | jq .
```

---

## Section 5 — Manual End-to-End Test Flow

Follow these steps to verify the full user journey:

### Step 1 — Open the Editor

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Sign in (or use the mock auth context if Clerk keys are blank)
3. Click **Editor** in the left sidebar

**Expected:** The editor panel shows a YAML strategy manifest (not C++ code). A collapsible **Function Catalog** panel should be visible on the right side.

### Step 2 — Explore the Function Catalog

1. Open the **Function Catalog** accordion
2. Expand the **Technical** category — verify ~20 metrics are listed
3. Expand **Fundamental** — verify ~20 metrics
4. Expand **Sentiment** — verify 15 dimensions

**Expected:** Each metric shows its key, description, and parameters. Clicking a metric inserts a YAML snippet into the editor.

### Step 3 — Submit a Strategy

1. Edit the strategy YAML (or use the default starter)
2. Ensure sentiment weights sum to 100%
3. Click **Run Analysis**

**Expected:**
- A pipeline progress bar appears at the bottom of the editor
- Pipeline stages animate: `Technical → Fundamental → Sentiment → Execution → Paper → Done`
- The WebSocket connection indicator (top-right) stays green

### Step 4 — Verify Leaderboard

1. Click **Leaderboard** in the sidebar
2. Your submission should appear within ~15–30 seconds of pipeline completion

**Expected:** The leaderboard table shows **3 score columns**:
- **Technical/Fundamental Score** (composite of stages 1–2)
- **Execution Score** (stage 4)
- **Paper Trading Score** (stage 5)

### Step 5 — Paper Trading Simulation

1. Click **Paper Trading** in the sidebar
2. Select a timeline: `7d`, `30d`, or `90d`
3. Set initial capital (default `$100,000`)
4. Click **Start Paper Trade**

**Expected:**
- A positions table populates with simulated trades
- The score card shows your Paper Trading Score (Column 3)
- P&L values update live via WebSocket

---

## Section 6 — Real-Time Monitoring

### 6.1 Watch Kafka Message Flow

Open two terminals to observe the pipeline processing messages:

```sh
# Terminal 1 — Watch technical analysis stage output
docker compose exec kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic stage1.technical.out \
  --from-beginning

# Terminal 2 — Watch leaderboard update events
docker compose exec kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic leaderboard-updates \
  --from-beginning
```

### 6.2 Watch Service Logs

```sh
# Watch all Rust agents process a submission
docker compose logs -f technical-agents fundamental-agents sentiment-agents

# Watch the judge compute and broadcast scores
docker compose logs -f telemetry-judge

# Watch the TS API bridge calls to Rust
docker compose logs -f api-server | grep -E "Rust pipeline|submission"
```

### 6.3 Inspect Database State

```sh
# Connect to database
docker compose exec timescaledb psql -U postgres -d iicpc

# Check test runs
SELECT id, status, created_at FROM test_runs ORDER BY created_at DESC LIMIT 10;

# Check scores for a run
SELECT asset_ticker, technical_score, fundamental_score, sentiment_score
FROM asset_scores
WHERE run_id = '<your-run-id>';

# Check composite leaderboard scores
SELECT run_id, technical_fundamental_score, execution_score, paper_trading_score
FROM run_scores
ORDER BY composite_score DESC LIMIT 10;

# Check telemetry data points
SELECT time, metric_name, value FROM telemetry_points
WHERE run_id = '<your-run-id>'
ORDER BY time DESC LIMIT 20;
```

### 6.4 Test WebSocket Streams Directly

```sh
# Install wscat if needed
npm install -g wscat

# Connect to Rust leaderboard WebSocket
wscat -c ws://localhost:8080/ws/leaderboard
# Expected: receives JSON snapshot, then live updates

# Connect to Rust pipeline status WebSocket
wscat -c ws://localhost:8080/ws/pipeline/<your-run-id>
# Expected: receives pipeline status updates every 2s until completed
```

---

## Section 7 — Troubleshooting

### Services Won't Start

```sh
# Check for port conflicts
lsof -i :3000 -i :3001 -i :8080 -i :9092 -i :5432

# Reset all containers and volumes (destructive — wipes DB data)
docker compose down -v
docker compose up -d
```

### Rust Services Fail to Compile

```sh
# Check compilation errors
docker compose logs api-gateway

# Common fix: missing system libraries (cmake, openssl)
# These are installed automatically in the docker-compose command — check logs for apt errors
```

### `test-pipeline.sh` Times Out

```sh
# Increase poll timeout
POLL_SECONDS=180 bash scripts/test-pipeline.sh

# Check if Rust agents are consuming from Kafka
docker compose logs technical-agents | grep -E "consumed|error|panic"

# Verify RUST_PIPELINE_URL is set in api-server
docker compose exec api-server env | grep RUST_PIPELINE_URL
# Expected: RUST_PIPELINE_URL=http://api-gateway:8080
```

### Leaderboard Shows No Scores

```sh
# Check if telemetry-judge received events
docker compose logs telemetry-judge | tail -30

# Check if topics have messages
docker compose exec kafka kafka-consumer-groups \
  --bootstrap-server kafka:9092 \
  --describe \
  --group telemetry-judge-group
```

### Frontend Fails to Connect to WebSocket

```sh
# Check VITE_API_URL is set correctly
docker compose exec frontend env | grep VITE_API_URL
# Expected: VITE_API_URL=http://localhost:3001

# Check Socket.IO server is running
curl -s http://localhost:3001/socket.io/?EIO=4&transport=polling
```

### Paper Trading Shows No Positions

```sh
# Verify the paper-trading service is running
docker compose logs paper-trading | tail -20

# Check DB for positions
docker compose exec timescaledb psql -U postgres -d iicpc \
  -c "SELECT * FROM paper_trade_positions LIMIT 5;"
```

---

## Section 8 — Test Checklist

Use this checklist to sign off on the testing phase:

- [ ] All 11 services show `(healthy)` or `running` in `docker compose ps`
- [ ] `GET /api/healthz` returns `{ "status": "ok" }`
- [ ] `GET http://localhost:8080/api/health` returns `{ "status": "ok" }`
- [ ] All 12 Kafka topics are present in `kafka-topics --list`
- [ ] All 8 database tables are present in `\dt`
- [ ] `test-pipeline.sh` passes all 5 checks with exit code 0
- [ ] Direct Rust gateway submission creates a `run_id` and reaches `completed` status
- [ ] Frontend Editor shows YAML strategy manifest (not C++ code)
- [ ] Function Catalog loads with Technical / Fundamental / Sentiment categories
- [ ] Submitting a strategy shows animated pipeline progress in the editor
- [ ] Leaderboard shows 3 score columns after pipeline completes
- [ ] Paper Trading page starts a simulation and shows positions
- [ ] WebSocket streams (`/ws/leaderboard`, `/ws/pipeline/:id`) deliver live JSON
- [ ] `docker compose logs technical-agents` shows Kafka consumption logs after a submission

---

## Quick Reference — Key Endpoints

| Layer | Endpoint | Purpose |
|---|---|---|
| **TS API** | `POST http://localhost:3001/api/executions/start` | Submit via TS bridge (recommended for UI) |
| **TS API** | `GET http://localhost:3001/api/executions/:id/status` | Poll pipeline status |
| **TS API** | `GET http://localhost:3001/api/leaderboard/:id` | Fetch leaderboard row |
| **TS API** | `POST http://localhost:3001/api/paper-trading/execute` | Start paper trade simulation |
| **TS API** | `GET http://localhost:3001/api/paper-trading/:id/positions` | Fetch trade positions |
| **Rust GW** | `POST http://localhost:8080/api/submissions` | Direct Rust pipeline submission |
| **Rust GW** | `GET http://localhost:8080/api/pipeline/status/:id` | Rust pipeline status |
| **Rust GW** | `GET http://localhost:8080/api/leaderboard` | Rust leaderboard |
| **Rust GW** | `GET http://localhost:8080/api/functions` | Function catalog metadata |
| **Rust GW** | `WS ws://localhost:8080/ws/leaderboard` | Live leaderboard stream |
| **Rust GW** | `WS ws://localhost:8080/ws/pipeline/:id` | Live pipeline progress stream |
| **Socket.IO** | `ws://localhost:3001/socket.io` | Frontend real-time updates |
