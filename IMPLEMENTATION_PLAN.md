# IICPC Distributed Trading Analysis Platform — 2-Day Implementation Plan

## Overview
Build an end-to-end distributed trading analysis platform where users submit code implementing 3 signal analyses (technical, fundamental, sentiment). These analyses run through a sequential pipeline, generate distributed bot fleets, and produce a real-time 3-column leaderboard ranking assets by composite performance across sentiment, execution simulation, and paper trading.

**Key Decision Summary:**
- Pipeline: Sequential filtering (reject at any stage stops progression)
- Data: Real market data API (Alpha Vantage or Polygon)
- Scoring: Equal weight (33% each layer)
- Execution: In-process simulation with orchestration layer for distributed feel

---

## Architecture Overview

### High-Level Flow
```
User submits code (3 analysis functions)
    ↓
Technical Metrics Layer (bot fleet filters assets)
    ↓ (pass only)
Fundamental Analysis Layer (bot fleet scores)
    ↓ (pass only)
Sentiment Layer (bot fleet adds multi-dimensional points)
    ↓
Execution Simulator (backtests on 5 historical intraday trades + short/medium/long-term)
    ↓
Paper Trading Simulator (simulates live execution with preset timeline)
    ↓
Leaderboard (3 columns: sentiment score | execution score | paper score → composite rank)
```

### Core Components

#### 1. **Signal Analysis Engine** (Backend: Rust + Express)
- **Technical Metrics Groups**: User code defines N metric groups; each group has 1+ metrics, handled by a bot
  - Bot filters assets based on group thresholds
  - Assets that pass all groups proceed to fundamental
  - Assets that fail are marked "rejected at technical"
  
- **Fundamental Analysis Groups**: Similar structure
  - Multi-dimensional scoring per asset
  - Only assets passing technical proceed here
  - Outputs: asset, group_id, score
  
- **Sentiment Layer**: 
  - Receives only assets that passed technical + fundamental
  - Applies multi-dimensional analysis (e.g., news sentiment, momentum, volatility)
  - Outputs: asset, sentiment_score (0-100)

#### 2. **Execution Simulator** (Rust service)
- Takes top-ranked assets from sentiment layer
- Backtests each asset against historical data (5 random intraday, short, medium, long-term trades)
- Detailed scoring: max_return, sharpe_ratio, drawdown, win_rate, profit_factor
- Outputs: asset, execution_score (0-100)

#### 3. **Paper Trading Simulator** (Rust service)
- Virtual trading environment with preset timeline (e.g., next 7 days, next 30 days)
- Users configure: initial capital, max position size, risk per trade
- Simulates live orders based on execution simulator results
- Tracks: total return %, win rate, max drawdown
- Outputs: asset, paper_trading_score (0-100)

#### 4. **Real-Time Leaderboard** (React Frontend + WebSocket/polling)
- 3 columns: sentiment_score | execution_score | paper_trading_score
- Composite score: (sentiment + execution + paper) / 3
- Rank assets high→low by composite score
- Live updates as test runs progress

#### 5. **Bot Fleet Orchestration** (Express + in-process simulation)
- For MVP: orchestrator spawns "virtual bots" (concurrent async tasks) rather than separate containers
- Each bot processes a subset of assets through a metric group
- Tracks: bot_id, asset_id, metric_group_id, result (pass/fail/score)
- Outputs: event log to telemetry ingester

#### 6. **Telemetry & Validation Ingester** (Express route + database)
- Receives bot execution events
- Validates: price-time priority in execution sim, fill accuracy in paper trading
- Stores latency metrics (p50, p90, p99) from bot→exchange roundtrips
- Aggregates into leaderboard scores

#### 7. **Market Data Integration** (Python async worker or Node.js service)
- Fetches real OHLCV data from Alpha Vantage or Polygon
- Caches in Redis or Postgres for execution + paper trading
- Pre-loads 1000s of intraday bars (5+ years of daily data)
- Refresh cadence: daily for backtesting data, real-time for paper trading

---

## Day 1: Foundation & Pipeline Plumbing (Core Architecture)

### Phase 1.1: Database Schema Extensions (1 hour)
**Files to modify:** `lib/db/src/schema/`

Add tables:
- `test_runs_detailed` — tracking per-run metrics (technical_pass_count, fundamental_pass_count, sentiment_avg_score, etc.)
- `asset_scores` — (asset_id, test_run_id, technical_pass, fundamental_score, sentiment_score, execution_score, paper_score, composite_rank)
- `bot_events` — (bot_id, asset_id, metric_group_id, layer, result_json, timestamp)
- `historical_prices` — (symbol, date, open, high, low, close, volume, cached_at)
- `paper_trade_positions` — (test_run_id, symbol, entry_price, entry_time, exit_price, exit_time, pnl, status)

### Phase 1.2: Express API Routes (2 hours)
**Files to create/modify:** `artifacts/api-server/src/routes/`

New routes:
- `POST /api/executions/start` — triggers full pipeline: technical → fundamental → sentiment → execution → paper
  - Input: submission_id, test_run_id, assets_to_analyze (CSV or list)
  - Output: test_run_id, estimated_duration
  - Starts async job that processes all layers sequentially
  
- `GET /api/executions/:testRunId/status` — real-time progress
  - Returns: current_layer, progress_pct, assets_analyzed, assets_passed
  
- `GET /api/leaderboard/:testRunId` — fetch ranked results
  - Returns: sorted asset list with all 3 scores and composite rank
  
- `POST /api/market-data/fetch` — trigger data fetch
  - Input: symbol_list, date_range
  - Caches in historical_prices table
  
- `POST /api/paper-trading/execute` — simulate paper trades
  - Input: test_run_id, execution_scores, initial_capital, timeline
  - Simulates orders based on top-ranked assets

### Phase 1.3: Core Pipeline Orchestrator (2 hours)
**File to create:** `artifacts/api-server/src/lib/orchestrator.ts`

Responsible for:
- Sequential execution: `await technicalLayer() → await fundamentalLayer() → await sentimentLayer()`
- Each layer returns filtered asset list → passed to next layer
- Each layer spawns N concurrent "virtual bots" (async Promise.all)
- Each bot processes batch of assets against metric groups
- Bot results logged to bot_events table
- Errors handled gracefully; assets rejected logged with reason

Pseudo-code structure:
```
runPipeline(testRunId, assets):
  passed_assets = assets
  
  for layer in [technical, fundamental, sentiment]:
    results = await orchestrateLayer(layer, passed_assets)
    # Save results
    passed_assets = results.filter(r => r.status === "pass")
    updateTestRunStatus(testRunId, layer, passed_assets.length)
  
  return passed_assets
```

### Phase 1.4: Technical Metrics Bot (1.5 hours)
**File to create:** `artifacts/api-server/src/lib/bots/technicalBot.ts`

Pseudo-code:
```
async function technicalBot(assetBatch, metricGroupConfig):
  results = []
  for asset in assetBatch:
    score = 0
    for metric in metricGroupConfig.metrics:
      value = calculateMetric(asset, metric)
      if value > metricGroupConfig.threshold:
        score += 1
    
    results.push({
      asset_id: asset.id,
      group_id: metricGroupConfig.id,
      pass: (score >= metricGroupConfig.minMetricsPass),
      score: (score / metricGroupConfig.metrics.length) * 100
    })
  
  return results
```

### Phase 1.5: Schema & Zod Updates (1 hour)
**Files to modify:**
- `lib/api-spec/openapi.yaml` — add new endpoint schemas
- `lib/api-zod/src/generated/*` — regenerate schemas
- `lib/api-client-react/` — regenerate React Query hooks

---

## Day 2: Features & Leaderboard Integration (User-Facing)

### Phase 2.1: Fundamental + Sentiment Bots (2 hours)
**Files to create:**
- `artifacts/api-server/src/lib/bots/fundamentalBot.ts`
- `artifacts/api-server/src/lib/bots/sentimentBot.ts`

Fundamental Bot:
- Receives assets that passed technical layer
- For each metric group: scores asset across dimensions (debt ratio, eps growth, dividend yield, etc.)
- Assets scoring ≥ threshold pass to sentiment
- Output: asset_id, fundamental_score (0-100)

Sentiment Bot:
- Receives assets from fundamental
- Multi-dimensional sentiment: news_sentiment + momentum + volatility_percentile + correlation
- Assigns sentiment_score (0-100)
- **This becomes Column 1 of the leaderboard**

### Phase 2.2: Market Data Fetcher (1.5 hours)
**Files to create:** `artifacts/api-server/src/lib/marketDataFetcher.ts`

Use Alpha Vantage or Polygon API:
```
async fetchHistoricalData(symbol, yearsBack=5):
  # Fetch 5 years of daily + intraday (5-min bars)
  # Cache in historical_prices table
  # Return: { symbol, dates, ohlcv[] }
```

Seed data on startup for top 100 stocks (pre-populate cache to avoid rate limits during demo).

### Phase 2.3: Execution Simulator (2 hours)
**File to create:** `artifacts/api-server/src/lib/executionSimulator.ts`

For each asset from sentiment layer:
```
async function simulateExecution(asset, historicalData):
  # Pick 5 random intraday trades (1h, 4h, 1d)
  # Pick 1 short-term (5-day), medium-term (20-day), long-term (60-day)
  # For each trade: calculate entry/exit prices from historical data
  
  scores = {
    max_return: (bestTrade.pnl / initial_capital) * 100,
    sharpe_ratio: (mean_return / std_dev),
    max_drawdown: (worst_loss / peak_equity),
    win_rate: (winning_trades / total_trades),
    profit_factor: (sum_winners / sum_losers)
  }
  
  execution_score = normalize(scores) # 0-100 weighted average
  return { asset_id, execution_score }
```

**This becomes Column 2 of the leaderboard**

### Phase 2.4: Paper Trading Simulator (1.5 hours)
**File to create:** `artifacts/api-server/src/lib/paperTradingSimulator.ts`

Simulates live trading over preset timeline (e.g., 7 days from now):
```
async function simulatePaperTrading(asset, execution_scores, timeline):
  # Fetch current price + simulate 7 days of price movement
  # Use execution_scores to size positions (higher score = larger position)
  # Track: entry_price, exit_price, pnl, unrealized_pnl
  
  metrics = {
    total_return_pct: (final_equity - initial_capital) / initial_capital,
    win_rate: winning_trades / total_trades,
    max_drawdown: worst_loss / peak_equity
  }
  
  paper_score = normalize(metrics) # 0-100
  return { asset_id, paper_score, positions[] }
```

**This becomes Column 3 of the leaderboard**

### Phase 2.5: Leaderboard Aggregation & Rendering (2 hours)
**Files to modify/create:**
- `artifacts/api-server/src/routes/leaderboard.ts` — add detailed endpoint
- `artifacts/iicpc-platform/src/pages/leaderboard.tsx` — update to show 3-column scores + composite

**Express endpoint:**
```
GET /api/leaderboard/:testRunId
  Returns: [
    {
      rank: 1,
      symbol: "AAPL",
      sentiment_score: 85,
      execution_score: 78,
      paper_score: 82,
      composite_score: 81.67,
      team: "Team A",
      timestamp: "2026-06-04T..."
    },
    ...
  ]
  Sorted by composite_score DESC
```

**React component updates:**
- Fetch from `/api/leaderboard/:testRunId`
- 3 main columns: sentiment | execution | paper
- 4th derived column: composite (auto-calculated)
- Real-time polling every 2 seconds (or WebSocket for smooth updates)
- Charts: Recharts to show score distributions, top performers over time

### Phase 2.6: Frontend Integration (2 hours)
**Files to modify:**
- `artifacts/iicpc-platform/src/pages/editor.tsx`
  - "Run Analysis" button → triggers `/api/executions/start`
  - Real-time progress bar showing: technical → fundamental → sentiment → execution → paper
  
- `artifacts/iicpc-platform/src/pages/leaderboard.tsx`
  - 3-column table with live updates
  - Sorting by each column or composite rank
  - Filter by asset type, team, date range
  
- `artifacts/iicpc-platform/src/components/layout/`
  - Add live status widget showing current test runs

### Phase 2.7: Error Handling & Validation (1 hour)
- Graceful failures if market data fetch fails (fallback to cached data)
- Asset validation: reject nulls, invalid prices, missing OHLCV data
- Latency monitoring: track p50/p90/p99 for each layer
- Comprehensive logging for debugging

---

## Testing & Demo Flow

### MVP Validation Checklist
- [ ] Submit code with 3 signal functions
- [ ] Technical layer filters assets (visual: X assets → Y passed)
- [ ] Fundamental layer scores remaining assets (visual: Y assets → Z passed)
- [ ] Sentiment layer scores final assets (visual: Z assets, sentiment_score populated)
- [ ] Execution simulator backtests (visual: execution_score populated)
- [ ] Paper trading simulates (visual: paper_score populated)
- [ ] Leaderboard shows 3 columns + composite rank
- [ ] Real-time polling updates scores as test runs progress
- [ ] Top-ranked assets visible in leaderboard

### Demo Scenario (5 min walkthrough)
1. Show Editor: submit pre-built strategy code
2. Click "Run Analysis"
3. Watch progress bar: technical (30s) → fundamental (30s) → sentiment (30s) → execution (45s) → paper (45s)
4. Leaderboard populates live with sentiment, execution, paper scores
5. Show composite ranking changes as paper trading scores finalize
6. Filter/sort leaderboard by column

---

## Tech Implementation Details

### Backend Stack
- **Express + TypeScript** for orchestration & API
- **PostgreSQL + Drizzle** for persistence (asset_scores, bot_events, historical_prices, test_runs_detailed)
- **Redis** (optional) for caching historical price data & real-time leaderboard
- **Alpha Vantage or Polygon API** for market data
- **Node async/Promise.all** for concurrent bot spawning (MVP doesn't require distributed Kubernetes)

### Frontend Stack
- **React 19 + Vite** (already in place)
- **TanStack Query** for API data fetching + polling
- **Wouter** for routing (already in place)
- **Recharts** for charts (already in place)
- **Tailwind + shadcn components** for styling (already in place)

### Database Migrations
- Use `drizzle-kit` to apply new schema changes
- No manual SQL; schema-first approach

### API Contract
- Update `lib/api-spec/openapi.yaml` with new endpoints
- Regenerate `lib/api-zod` and `lib/api-client-react` using Orval/codegen
- Ensures frontend and backend stay in sync

---

## Critical Dependencies & Gotchas

### Real Market Data
- Alpha Vantage free tier: 5 calls/min, 500/day
- Polygon free tier: 5 calls/min
- **Solution**: Pre-load top 100 stocks on startup, cache aggressively, or upgrade to paid tier for testing

### Concurrent Bot Simulation
- MVP uses async/Promise.all (no separate containers)
- Scales to ~1000 concurrent bots in Node.js
- If 10k bots needed, refactor to Kubernetes (out of MVP scope)

### Historical Data Accuracy
- Use clean OHLCV data; validate for splits/dividends
- Polygon provides adjusted data; Alpha Vantage may not
- **Recommendation**: Use Polygon for accuracy if possible

### Paper Trading Timeline
- Simulate 7-30 days from "now" (use mock clock if needed for testing)
- Ensure price movements are realistic (use real market data for backtesting)

---

## Deliverables Summary

### By End of Day 2
1. **Working Infrastructure**
   - Code upload → sequential pipeline → 3-layer bot execution → execution sim → paper trading
   - Live leaderboard with 3 scoring columns + composite rank
   
2. **Database Schema**
   - asset_scores, bot_events, historical_prices, test_runs_detailed, paper_trade_positions tables
   
3. **Express API**
   - `/api/executions/start`, `/api/executions/:id/status`, `/api/leaderboard/:id`, `/api/market-data/fetch`, `/api/paper-trading/execute`
   
4. **Bot Orchestration**
   - Technical, fundamental, sentiment, execution, paper-trading bots
   - Sequential filtering: pass lists flow through layers
   
5. **React Frontend**
   - Editor with "Run Analysis" button
   - Real-time leaderboard with 3-column scoring + live updates
   - Progress tracking UI
   
6. **Market Data Integration**
   - Alpha Vantage or Polygon API integration
   - Caching strategy in place
   
7. **Demo-Ready**
   - Pre-built strategy code for testing
   - Realistic backtesting scenarios (5 intraday + 3 term trades)
   - Paper trading simulation over 7-day window

---

## Next Steps (Post-MVP)

If time permits on Day 2:
- Add Rust services for heavy computation (backtesting, simulation)
- Deploy to Kubernetes with Kafka event streaming
- Add user authentication for paper trading results
- Historical leaderboard archival & replay
- Custom metric library interface
- Streaming WebSocket instead of polling

---

## File Manifest (To Be Created/Modified)

### Database
- `lib/db/src/schema/assetScores.ts` (new)
- `lib/db/src/schema/botEvents.ts` (new)
- `lib/db/src/schema/historicalPrices.ts` (new)
- `lib/db/src/schema/paperTradePositions.ts` (new)
- `lib/db/src/schema/testRunsDetailed.ts` (new)

### Backend API
- `artifacts/api-server/src/routes/executions.ts` (new)
- `artifacts/api-server/src/routes/leaderboard.ts` (modify)
- `artifacts/api-server/src/routes/paper-trading.ts` (new)
- `artifacts/api-server/src/lib/orchestrator.ts` (new)
- `artifacts/api-server/src/lib/bots/technicalBot.ts` (new)
- `artifacts/api-server/src/lib/bots/fundamentalBot.ts` (new)
- `artifacts/api-server/src/lib/bots/sentimentBot.ts` (new)
- `artifacts/api-server/src/lib/executionSimulator.ts` (new)
- `artifacts/api-server/src/lib/paperTradingSimulator.ts` (new)
- `artifacts/api-server/src/lib/marketDataFetcher.ts` (new)

### Frontend
- `artifacts/iicpc-platform/src/pages/editor.tsx` (modify)
- `artifacts/iicpc-platform/src/pages/leaderboard.tsx` (modify)
- `artifacts/iicpc-platform/src/components/ExecutionProgress.tsx` (new)
- `artifacts/iicpc-platform/src/components/LeaderboardTable.tsx` (new)

### OpenAPI & Codegen
- `lib/api-spec/openapi.yaml` (modify)
- Regenerate `lib/api-zod/` and `lib/api-client-react/`

---

## Success Metrics
- ✅ Submit code → full pipeline executes in <5 min
- ✅ Leaderboard shows 3 scoring columns + composite rank
- ✅ Real-time updates visible as test runs progress
- ✅ All assets that pass filters appear in final leaderboard
- ✅ Scores are deterministic & reproducible (same code = same scores)
