# Runtime Configuration

This folder contains small configuration files that describe how the distributed pipeline is wired.

## Files

| File | Purpose |
|---|---|
| `kafka_topics.yaml` | Declares the topic topology, partitions, and replication settings |
| `bot_weights.yaml` | Defines technical, fundamental, sentiment, and leaderboard weights |

## How these files are used

- `kafka_topics.yaml` documents the message flow between pipeline stages.
- `bot_weights.yaml` documents how grouped metrics and leaderboard columns should be weighted.

When new pipeline stages or scoring dimensions are introduced, update these files first so the behavior stays discoverable.
