# Pipeline Services

This folder contains one Rust binary per major stage of the signal platform.

## Service map

| Service | Stage |
|---|---|
| `api-gateway` | Entry point for submissions, runs, leaderboard, functions, and status |
| `technical-agents` | Stage 1 technical trigger evaluation |
| `fundamental-agents` | Stage 2 fundamental validation |
| `sentiment-agents` | Stage 3 weighted sentiment scoring and ranking |
| `execution-sim` | Stage 4 historical execution simulation |
| `paper-trading` | Stage 5 preset timeline paper-trading simulation |
| `telemetry-judge` | Final score aggregation and telemetry interpretation |

## What to expect in each service

Each service currently contains:

- A `Cargo.toml` manifest
- A `src/main.rs` entrypoint
- Basic compile-ready code that demonstrates the service's role in the pipeline

## Where to add future work

- Add API handlers and integration logic inside `api-gateway`
- Add real bot orchestration and Kafka consumers/producers in the agent services
- Add historical data ingestion and run orchestration in `execution-sim`
- Add TimescaleDB persistence and leaderboard materialization in `telemetry-judge`
