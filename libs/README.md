# Shared Rust Libraries

This folder contains the reusable backend crates that every pipeline service depends on.

## What each crate does

| Crate | Role in the platform |
|---|---|
| `platform-types` | Defines the common language of the system: assets, strategies, groups, scores, simulations, telemetry, and events |
| `eval-algorithms` | Holds the predefined metric and scoring functions so logic stays centralized |
| `strategy-parser` | Validates submitted strategy manifests and provides a safe starter strategy |
| `kafka-utils` | Provides topic naming and an in-memory event bus for local execution and tests |

## How to work here

- Add new shared structs to `platform-types` when more than one service needs them.
- Add new scoring or metric logic to `eval-algorithms` instead of embedding formulas in services.
- Keep strategy submission constraints in `strategy-parser`.
- Keep transport-specific helper code in `kafka-utils`.

## Suggested reading order

1. [platform-types/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/platform-types/src/lib.rs)
2. [eval-algorithms/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/eval-algorithms/src/lib.rs)
3. [strategy-parser/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/strategy-parser/src/lib.rs)
4. [kafka-utils/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/kafka-utils/src/lib.rs)
