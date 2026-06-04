# IICPC Signal Platform

This repository contains the scaffold for a distributed signal-analysis platform built for the IICPC Summer Hackathon.

Participants define signal strategies as **predefined function calls with parameters**. The platform executes those strategies through distributed analysis layers, ranks assets, simulates historical execution, and produces leaderboard scores.

## Product Flow

The current architecture follows this pipeline:

1. **Strategy submission**
   Participants submit a strategy manifest built from predefined technical, fundamental, and sentiment functions.
2. **Technical analysis**
   Technical bot groups scan live or mock market data and push triggered assets forward.
3. **Fundamental validation**
   Fundamental bot groups validate those assets using grouped quality and financial metrics.
4. **Sentiment scoring**
   Sentiment bots assign weighted multi-dimensional scores and rank assets from highest to lowest.
5. **Execution simulation**
   Ranked assets are tested against historical trade scenarios across intraday, short-term, medium-term, and long-term horizons.
6. **Paper trading**
   Preset timeline simulations generate the third leaderboard column for future-facing strategy evaluation.
7. **Telemetry and judging**
   The judge calculates leaderboard-ready scores and tracks pipeline health.

## Repository Map

| Path | Purpose |
|---|---|
| `Cargo.toml` | Rust workspace manifest for shared crates and backend services |
| `libs/` | Shared domain types, scoring logic, strategy validation, and event-bus utilities |
| `services/` | Rust service binaries for each pipeline stage |
| `infrastructure/` | Kubernetes manifests and deployment helpers |
| `config/` | Topic definitions, metric weights, and scoring configuration |
| `artifacts/` | Existing frontend and API prototypes from the TypeScript app |
| `lib/` | Existing TypeScript shared libraries, schemas, and generated client code |
| `architecture.txt` | Original architecture direction and hackathon-aligned design notes |

## Rust Workspace

The Rust workspace is the backend foundation for the signal platform.

### Shared crates

| Crate | Responsibility |
|---|---|
| `platform-types` | Shared structs and enums for strategies, assets, scores, telemetry, and pipeline events |
| `eval-algorithms` | Predefined metric functions and scoring formulas used throughout the pipeline |
| `strategy-parser` | Validation and starter-manifest logic for constrained strategy submissions |
| `kafka-utils` | In-memory event-bus abstraction with Kafka topic naming compatibility |

### Services

| Service | Responsibility |
|---|---|
| `api-gateway` | Front-door API surface for strategy submission, runs, leaderboard, and platform status |
| `technical-agents` | Stage 1 metric-group bots that filter assets based on technical triggers |
| `fundamental-agents` | Stage 2 bots that validate assets against grouped financial criteria |
| `sentiment-agents` | Stage 3 bots that compute weighted sentiment and rank assets |
| `execution-sim` | Historical trade simulator used for execution scoring |
| `paper-trading` | Preset-timeline simulation for the third leaderboard column |
| `telemetry-judge` | Score aggregation, percentile calculations, and leaderboard row generation |

## Key Files

| File | Why it matters |
|---|---|
| [libs/platform-types/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/platform-types/src/lib.rs) | Core shared data model for the entire backend |
| [libs/eval-algorithms/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/eval-algorithms/src/lib.rs) | Predefined metrics and score formulas |
| [libs/strategy-parser/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/strategy-parser/src/lib.rs) | Strategy validation and starter strategy definition |
| [libs/kafka-utils/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/kafka-utils/src/lib.rs) | Event transport abstraction used between stages |
| [TECHNICAL_METRICS.md](/Users/shaarav/Documents/GitHub_Projects/IICPC/TECHNICAL_METRICS.md) | Stage 1 technical metric definitions |
| [FUNDAMENTAL_METRICS.md](/Users/shaarav/Documents/GitHub_Projects/IICPC/FUNDAMENTAL_METRICS.md) | Stage 2 fundamental validation metric definitions |
| [SENTIMENT_METRICS.md](/Users/shaarav/Documents/GitHub_Projects/IICPC/SENTIMENT_METRICS.md) | Stage 3 sentiment scoring methods, prompt, and worker actions |
| [DATA_SOURCES.md](/Users/shaarav/Documents/GitHub_Projects/IICPC/DATA_SOURCES.md) | Data intake boundaries for technical and fundamental analysis |
| [config/bot_weights.yaml](/Users/shaarav/Documents/GitHub_Projects/IICPC/config/bot_weights.yaml) | Group weights and leaderboard scoring weights |
| [config/kafka_topics.yaml](/Users/shaarav/Documents/GitHub_Projects/IICPC/config/kafka_topics.yaml) | Topic topology for the distributed pipeline |
| [infrastructure/scripts/deploy.sh](/Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/scripts/deploy.sh) | Deployment entrypoint for Kubernetes scaffold |
| [artifacts/api-server/src/routes/executions.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/routes/executions.ts) | Phase 1.2 execution lifecycle, status, and per-run leaderboard routes |
| [artifacts/api-server/src/lib/orchestrator.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/orchestrator.ts) | Phase 1.3 in-process pipeline orchestrator and virtual bot group runner |
| [artifacts/api-server/src/lib/bots/technicalBot.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/bots/technicalBot.ts) | Phase 1.4 technical metric bot with 20 grouped technical metrics |
| [artifacts/api-server/src/lib/bots/fundamentalBot.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/bots/fundamentalBot.ts) | Phase 2.1 fundamental validation bot with 20 grouped business metrics |
| [artifacts/api-server/src/lib/bots/sentimentBot.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/bots/sentimentBot.ts) | Phase 2.1 weighted sentiment bot with 15 qualitative methods |
| [artifacts/api-server/src/lib/marketDataFetcher.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/marketDataFetcher.ts) | Phase 2.2 Alpha Vantage/Polygon/synthetic OHLCV fetcher and cache seeder |
| [artifacts/api-server/src/routes/marketData.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/routes/marketData.ts) | Phase 1.2 market-data cache trigger route |
| [artifacts/api-server/src/routes/paperTrading.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/routes/paperTrading.ts) | Phase 1.2 paper-trading simulation route |

## TypeScript API Prototype

Phase 1.2 adds an Express API surface under `artifacts/api-server/src/routes/`.

Phase 1.3 adds [orchestrator.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/orchestrator.ts), which runs the route-triggered pipeline as sequential layers. Each technical, fundamental, and sentiment layer starts multiple virtual bot groups concurrently, stores bot events, aggregates pass/fail results by asset, and updates the detailed run state before passing surviving assets to the next layer.

Phase 1.4 adds [technicalBot.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/bots/technicalBot.ts), which defines the 20 technical analysis metrics in grouped bot configs. The current evaluator is deterministic and data-shape-ready, so real OHLCV-backed calculations can replace the scoring function without changing the orchestrator contract.

Phase 2.1 adds [fundamentalBot.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/bots/fundamentalBot.ts) and [sentimentBot.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/bots/sentimentBot.ts). Fundamental bots filter technically approved assets through 20 validation metrics. Sentiment bots score the surviving assets with 15 weighted methods; the normalized sentiment score is the first leaderboard score column.

Phase 2.2 adds [marketDataFetcher.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/artifacts/api-server/src/lib/marketDataFetcher.ts). It fetches and caches OHLCV bars from Polygon when `POLYGON_API_KEY` is set, Alpha Vantage when `ALPHA_VANTAGE_API_KEY` is set, and otherwise falls back to deterministic synthetic data for local demos. It supports daily and intraday-style intervals such as `5min`, and exposes a top-100 stock seed helper.

| Endpoint | File | Purpose |
|---|---|---|
| `POST /api/executions/start` | `executions.ts` | Creates or resets a detailed run, seeds asset scores, and starts the current route-level pipeline simulation |
| `GET /api/executions/:testRunId/status` | `executions.ts` | Returns current layer, progress, pass counts, and average scores |
| `GET /api/leaderboard/:testRunId` | `executions.ts` | Returns per-asset technical, fundamental, sentiment, execution, paper, and composite ranking fields |
| `POST /api/market-data/fetch` | `marketData.ts` | Fetches provider or synthetic OHLCV bars and stores them in `historical_prices` |
| `POST /api/market-data/seed` | `marketData.ts` | Preloads top-stock OHLCV data for demo/backtest readiness |
| `POST /api/paper-trading/execute` | `paperTrading.ts` | Creates simulated paper-trade positions and updates paper/composite leaderboard scores |

Example request bodies:

```json
{
  "submission_id": "submission-123",
  "assets_to_analyze": ["AAPL", "MSFT", "NVDA"]
}
```

```json
{
  "symbol_list": "AAPL,MSFT,NVDA",
  "date_range": { "start": "2026-01-01", "end": "2026-01-31" },
  "interval": "daily"
}
```

```json
{
  "test_run_id": "run-123",
  "initial_capital": 100000,
  "timeline": "7d"
}
```

Before running these routes locally, set `DATABASE_URL` and push the Drizzle schema so the Phase 1.1 tables exist in Postgres.

## How To Read The Code

If you are new to this repository, read in this order:

1. [README.md](/Users/shaarav/Documents/GitHub_Projects/IICPC/README.md)
2. [libs/platform-types/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/platform-types/src/lib.rs)
3. [libs/eval-algorithms/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/eval-algorithms/src/lib.rs)
4. [libs/strategy-parser/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/strategy-parser/src/lib.rs)
5. Any service under [services](/Users/shaarav/Documents/GitHub_Projects/IICPC/services) depending on the pipeline stage you want to work on
6. Infrastructure files under [infrastructure/kubernetes](/Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/kubernetes)

## Run And Verify

Current local verification:

```bash
cargo test --workspace
```

Useful commands:

```bash
cargo run -p api-gateway
cargo run -p technical-agents
cargo run -p telemetry-judge
```

Note:
`cargo fmt --check` currently requires `rustfmt` to be installed on the local Rust toolchain.
