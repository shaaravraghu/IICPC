# Infrastructure

This folder contains the deployability scaffold for the Rust backend.

## Layout

| Path | Purpose |
|---|---|
| `kubernetes/base` | Namespace and RBAC resources shared by the platform |
| `kubernetes/kafka` | Kafka topic manifests for pipeline communication |
| `kubernetes/timescale` | TimescaleDB manifests and SQL initialization |
| `kubernetes/bots` | Deployments for the distributed bot services |
| `scripts/deploy.sh` | Simple script to apply the current Kubernetes manifests |

## Intent

The infrastructure here is meant to show how the platform will be deployed and scaled:

- Kafka topics move assets and telemetry between stages
- TimescaleDB stores telemetry and scoreboard data
- Bot services run as independent workloads
- RBAC and namespace setup provide a clean cluster boundary

## First files to inspect

1. [kubernetes/base/namespace.yaml](/Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/kubernetes/base/namespace.yaml)
2. [kubernetes/kafka/topics.yaml](/Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/kubernetes/kafka/topics.yaml)
3. [kubernetes/timescale/statefulset.yaml](/Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/kubernetes/timescale/statefulset.yaml)
4. [scripts/deploy.sh](/Users/shaarav/Documents/GitHub_Projects/IICPC/infrastructure/scripts/deploy.sh)
