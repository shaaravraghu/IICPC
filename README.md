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
| [DATA_SOURCES.md](/Users/shaarav/Documents/GitHub_Projects/IICPC/DATA_SOURCES.md) | Data intake boundaries for technical and fundamental analysis |
| [config/bot_weights.yaml](/Users/shaarav/Documents/GitHub_Projects/IICPC/config/bot_weights.yaml) | Group weights and leaderboard scoring weights |
| [config/kafka_topics.yaml](/Users/shaarav/Documents/GitHub_Projects/IICPC/config/kafka_topics.yaml) | Topic topology for the distributed pipeline |
| [infrastructure/scripts/deploy.sh](/Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/scripts/deploy.sh) | Deployment entrypoint for Kubernetes scaffold |

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
