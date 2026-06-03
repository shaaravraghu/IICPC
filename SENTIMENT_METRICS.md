# Market Sentiment Metrics

This document defines the Stage 3 sentiment layer.

Sentiment analysis is the final high-compute validation layer after technical filtering and fundamental validation. It assigns every shortlisted stock a score from `-5` to `+5` per sentiment segment, multiplies each score by that segment's weight, and ranks stocks from high to low.

## Scoring Rule

Each sentiment method returns:

```text
-5 = strongly bearish
 0 = neutral, mixed, or insufficient evidence
+5 = strongly bullish
```

The total neural-network-style weight must equal `100%`.

Composite sentiment score:

```text
S = sum(weight_i / 100 * score_i)
```

The final `S` remains on a `-5` to `+5` scale. Stocks are ranked from highest `S` to lowest `S`.

## Metric List

| # | Function Key | Method | What It Measures |
|---|---|---|---|
| 1 | `news_sentiment_analysis` | News Sentiment Analysis | Positive/negative tone in financial news articles |
| 2 | `social_media_sentiment` | Social Media Sentiment | Public opinion from X, Reddit, LinkedIn, Facebook, etc. |
| 3 | `search_trend_analysis` | Search Trend Analysis | Rising interest using search volume data |
| 4 | `options_market_sentiment` | Options Market Sentiment | Expectations implied by options traders |
| 5 | `institutional_fund_flow_analysis` | Institutional Fund Flow Analysis | Where large investors are moving capital |
| 6 | `analyst_rating_sentiment` | Analyst Rating Sentiment | Upgrades, downgrades, and target-price revisions |
| 7 | `earnings_call_sentiment` | Earnings Call Sentiment | Management confidence and tone during earnings calls |
| 8 | `insider_trading_analysis` | Insider Trading Analysis | Actions of executives and directors |
| 9 | `technical_sentiment_indicators` | Technical Sentiment Indicators | Market psychology reflected in price behavior |
| 10 | `consumer_review_sentiment` | Consumer Review Sentiment | Customer opinions about products/services |
| 11 | `supply_chain_sentiment` | Supply Chain Sentiment | Signals from suppliers, logistics, and manufacturing |
| 12 | `influencer_community_forum_analysis` | Influencer, Community & Forum Analysis | Deep discussions from niche communities |
| 13 | `macroeconomic_sentiment_analysis` | Macroeconomic Sentiment Analysis | Sentiment implied by economic indicators |
| 14 | `alternative_data_sentiment` | Alternative Data Sentiment | Real-world behavioral signals |
| 15 | `prediction_market_analysis` | Prediction Market Analysis | What people are willing to bet on happening |

## Default Weights

The default demo strategy uses a focused subset of high-signal dimensions:

| Function Key | Weight |
|---|---:|
| `news_sentiment_analysis` | 20 |
| `options_market_sentiment` | 15 |
| `institutional_fund_flow_analysis` | 15 |
| `analyst_rating_sentiment` | 10 |
| `earnings_call_sentiment` | 15 |
| `technical_sentiment_indicators` | 10 |
| `alternative_data_sentiment` | 10 |
| `prediction_market_analysis` | 5 |

The full catalog supports all 15 methods, but a strategy does not have to use every method as long as selected weights sum to `100`.

## Data Intake

Sentiment agents should consume shortlisted assets from:

```text
stage2.fundamental.out
```

Then they should gather or read normalized evidence bundles from a sentiment evidence store:

```text
sentiment.evidence_snapshots
```

Best evidence shape:

| Field | Meaning |
|---|---|
| `symbol` | Stock symbol |
| `method` | One of the 15 sentiment function keys |
| `source` | Evidence source, such as news, options, social, analyst, or macro |
| `observed_at` | Evidence timestamp |
| `lookback_days` | Window used for aggregation |
| `raw_signal` | Raw source score or source payload reference |
| `confidence` | Confidence from `0` to `1` |
| `recency_weight` | Recency multiplier from `0` to `1` |
| `source_reliability` | Reliability multiplier from `0` to `1` |
| `explanation` | Short human-readable rationale |

## Evaluation Prompt

Use this prompt whenever a high-compute sentiment worker or LLM-backed evaluator scores a segment.

```text
You are the Stage 3 sentiment evaluator for an IICPC signal pipeline.

Evaluate only the provided stock, method, and evidence. Do not invent facts. If evidence is missing, stale, contradictory, or low-confidence, return a neutral or low-confidence score.

Stock:
{symbol}

Method:
{method_key}

What this method measures:
{method_measure}

Evidence bundle:
{evidence_json}

Return strict JSON:
{
  "symbol": "{symbol}",
  "method": "{method_key}",
  "score": number between -5 and 5,
  "confidence": number between 0 and 1,
  "rationale": "one concise explanation",
  "positive_evidence": ["short bullet"],
  "negative_evidence": ["short bullet"],
  "missing_evidence": ["short bullet"]
}

Scoring guide:
-5 means strongly bearish evidence.
-3 means materially bearish evidence.
0 means neutral, mixed, stale, or insufficient evidence.
+3 means materially bullish evidence.
+5 means strongly bullish evidence.
```

## Worker Actions

Each sentiment worker should follow these actions:

1. Read shortlisted assets from `stage2.fundamental.out`.
2. Load configured sentiment dimensions and confirm total weight is `100`.
3. Fetch normalized evidence for each `(symbol, method)` pair.
4. Score each method from `-5` to `+5`.
5. Attach confidence, rationale, and source references.
6. Multiply each method score by its configured weight.
7. Emit ranked assets to `stage3.sentiment.out`.
8. Send raw method scores, weighted scores, confidence, and rationale to `sys.telemetry.metrics`.

## Source Of Truth

These definitions live in:

- [libs/eval-algorithms/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/eval-algorithms/src/lib.rs): canonical Rust-side catalog
- [scripts/src/seed-functions.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/scripts/src/seed-functions.ts): function-library seed metadata
- [config/bot_weights.yaml](/Users/shaarav/Documents/GitHub_Projects/IICPC/config/bot_weights.yaml): default selected sentiment weights
