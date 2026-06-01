# IICPC Summer Hackathon 2026 — Revised Architecture Plan

**Team Submission Document | For Panel Review**
**Date:** June 1, 2026

---

## Executive Summary

We propose a **Distributed Benchmarking and Hosting Platform** that evaluates contestant-submitted trading infrastructure (orderbooks, matching engines) by subjecting them to a fleet of intelligent, multi-dimensional synthetic market participants. Rather than random order spam, our bot fleet models realistic market behavior — technical momentum traders, fundamentals-driven institutional buyers, and sentiment-reactive panic sellers — producing a stress test that is both high-fidelity and measurably fair.

The platform covers the full pipeline:

> **Code Upload → Sandboxed Containerized Deployment → Multi-Class Bot Stress Test → Real-Time Telemetry → Composite Leaderboard**

---

## Problem Statement Alignment

| Requirement (from PDF) | Our Implementation |
|---|---|
| Submission & Sandboxing Engine | OCI container build + gVisor/seccomp isolation, CPU pinning, cgroup memory limits |
| Distributed Load Generator (Bot Fleet) | Three classes of bots (Technical, Fundamental, Sentiment), each spawned as independent distributed agents |
| Telemetry & Validation Ingester | p50/p90/p99 latency tracking, TPS measurement, shadow orderbook for price-time priority validation |
| Real-Time Leaderboard & Analytics | WebSocket-streamed composite scores across three scoring dimensions |

---

## Core Architectural Philosophy

The central insight of this design is that **bot behavior should mirror real market participant archetypes**, not random noise. This makes the stress test representative of actual production load, and it gives the composite scoring system genuine signal.

We model three classes of market participants:

### Class 1 — Technical Bots (Momentum & Structure)
Simulate traders driven by price action signals. These bots:
- Send orders in trending bursts (ADX-driven order flow)
- Alternate between accumulation and distribution phases
- Test the exchange's ability to handle high-velocity limit order sequences
- Trigger cancel-replace storms during simulated volatility regime shifts

**What they stress:** Order throughput, cancel-replace latency, queue depth management.

### Class 2 — Fundamental Bots (Institutional Simulation)
Simulate slow, large-order institutional participants. These bots:
- Place iceberg and large block orders over time
- Probe for price impact and slippage
- Test fill accuracy on partial fills and queue priority

**What they stress:** Price-time priority correctness, partial fill accuracy, large order handling.

### Class 3 — Sentiment Bots (Reactive & Panic-Driven)
Simulate news-driven or sentiment-reactive participants. These bots:
- Fire sudden burst cancellations (simulating panic)
- Send aggressive market orders in rapid succession
- Introduce order bursts with non-uniform inter-arrival timing

**What they stress:** Peak load resilience, latency under spike conditions, correctness under race conditions.

---

## System Architecture

```
Contestant Code Upload
        ↓
Submission & Sandboxing Engine
(OCI Build → gVisor Container → CPU Pin + cgroup limits)
        ↓
Deployment Orchestrator
(Exposes REST / WebSocket / FIX endpoints for the contestant's exchange)
        ↓
Bot Fleet Coordinator
┌─────────────────────┬──────────────────────┬─────────────────────┐
│  Technical Bots     │  Fundamental Bots    │  Sentiment Bots     │
│  (Momentum class)   │  (Institutional)     │  (Panic/Burst)      │
└──────────┬──────────┴──────────┬───────────┴──────────┬──────────┘
           └────────────────────┬┘──────────────────────┘
                                ↓
             Telemetry & Validation Ingester
       (p50/p90/p99 latency | TPS | Shadow Orderbook)
                                ↓
              Deterministic Replay Judge
          (Replays order sequence, validates fills)
                                ↓
         Risk-Adjusted Evaluation & Scoring Engine
                                ↓
         Real-Time Leaderboard + Live Analytics Dashboard
```

---

## Component Breakdown

### 1. Submission & Sandboxing Engine

- Accepts source code (C++, Rust, Go) or pre-compiled binaries via a REST upload API
- Builds OCI-compliant containers from submitted source
- Runs containers under **gVisor (runsc)** for syscall-level isolation
- Enforces strict resource constraints: CPU pinning, cgroup memory limits, network namespace isolation
- Assigns each submission a unique UUID, tracked across all downstream components

### 2. Bot Fleet Coordinator

- Orchestrates spawning of all three bot classes against a live submission
- Each bot class runs as an independent distributed service, horizontally scalable
- Bots are **stateful**: they track order IDs, fill states, and open positions to enable correctness validation downstream
- Bot behavior parameters (burst intensity, order size distribution, cancel rate) are configurable per test run
- Inter-bot coordination via a message bus to avoid thundering herd artifacts

### 3. Telemetry & Validation Ingester

- Captures **send timestamp** (bot side) and **acknowledgment timestamp** (exchange response) for every order
- Computes p50, p90, p99 latency across the full order lifecycle
- Tracks TPS at 1-second granularity; detects the degradation point
- A **Shadow Orderbook** runs in parallel — it receives the same order stream and computes expected fills deterministically
- Fills from the contestant's exchange are compared against the shadow orderbook to validate price-time priority

### 4. Deterministic Replay Judge

- Takes the full recorded order sequence from a test run and replays it against a known-correct reference matching engine
- Diffs actual fills vs. expected fills
- Outputs a correctness score: percentage of fills that match price-time priority exactly
- Flags specific failure modes: incorrect priority, phantom fills, missed fills, incorrect quantities

### 5. Scoring Engine

The composite score has three columns on the leaderboard:

| Column | Metric | Weight |
|---|---|---|
| **Speed** | Weighted p99 latency + TPS at peak load | 40% |
| **Stability** | Uptime during stress, graceful degradation behavior | 30% |
| **Correctness** | Fill accuracy vs. shadow orderbook (price-time priority) | 30% |

Each column is scored 0–100. The composite score is a weighted sum. Ties are broken by p99 latency.

### 6. Real-Time Leaderboard & Analytics Dashboard

- WebSocket-streamed live updates as tests run
- Shows all three score columns per contestant, updating in real time
- Drill-down view per submission: latency percentile chart, TPS over time, correctness breakdown
- Historical comparison: performance across multiple test runs if resubmission is allowed

---

## Future Extensions (Post-Hackathon Roadmap)

- **Paper Trading Column:** Allow contestants to deploy their signal strategies against a live paper trading environment with preset timelines. This adds a third competitive dimension — not just infrastructure performance, but trading *strategy* quality.
- **Replay-on-demand:** Let contestants trigger a replay of their worst-performing test run with enhanced telemetry for debugging.
- **Custom Bot Profiles:** Let contestants configure the bot fleet archetype mix before a test run (e.g., 80% sentiment bots to simulate a high-volatility market open).

---

## Proposed Tech Stack (Recommended: Option A)

### Option A — Docker Swarm + NATS + Go Bots + ClickHouse *(Recommended)*

| Layer | Technology | Rationale |
|---|---|---|
| Sandboxing | Docker + seccomp + AppArmor | Simpler ops than K8s; sufficient isolation for hackathon scope |
| Bot Fleet | Go (goroutines) | Cheap concurrency, fast to write, scales well per node |
| Message Bus | NATS JetStream | Sub-millisecond latency, lower ops overhead than Kafka |
| Time-Series Store | ClickHouse | Columnar, blazing fast for p99 latency aggregation queries |
| Leaderboard Frontend | React + WebSockets + Redis sorted sets | Live ranking with minimal latency |
| IaC | Docker Swarm manifests + shell provisioning | Fast to demo, reproducible |

**Pros:** Fast to build, operationally simple, Go bots achieve high TPS.
**Cons:** Docker Swarm is less impressive on paper than K8s; weaker sandboxing story than gVisor.

### Option B — Kubernetes + Kafka + Rust Bots + TimescaleDB

Best for raw performance and judge credibility. Higher ops complexity; recommended only if the team has K8s experience.

### Option C — K8s + Kata Containers + Python Bots + Prometheus/Grafana

Strongest sandboxing story (VM-level isolation). Python bots limit max TPS. Grafana gives a free, polished leaderboard dashboard.

### Option D — Fly.io + Redpanda + Rust Bots + QuestDB

Most differentiated stack (Firecracker microVMs, QuestDB for financial time-series). Highest risk for hackathon demo reliability.

---

## Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Sandboxed containers escape or consume host resources | cgroup hard limits + network namespace isolation + read-only root filesystem |
| Clock skew across distributed bots distorts latency measurements | NTP sync across all bot nodes; timestamp on send and receive independently |
| Shadow orderbook diverges from contestant exchange under concurrent load | Replay judge uses a single-threaded deterministic reference implementation |
| Demo instability during judging | Freeze a stable build 48 hours before submission; keep a recorded demo as fallback |

---

## Deliverables Checklist

- [x] Architecture Blueprint (this document)
- [ ] Working Infrastructure Prototype (Code Upload → Containerized Deploy → Load Test → Scoring)
- [ ] Infrastructure as Code (Docker Swarm manifests or Helm charts for one-command spin-up)
- [ ] Live Leaderboard Demo

---

*This document is intended for panel review. Feedback on architectural alignment with the problem statement is welcome before implementation begins.*
