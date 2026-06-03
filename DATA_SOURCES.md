# Analysis Data Sources

This document defines the best place to take in data for technical and fundamental analysis.

The platform should keep these two input streams separate because they have different freshness, shape, and reliability needs.

## Technical Analysis Data

Technical analysis should ingest market data from the live/replay market-data stream.

Primary intake point:

| Source | Topic / Interface | Used For |
|---|---|---|
| Market data feed | `sys.market_data.live` | OHLCV candles, trades, quotes, benchmark prices, market breadth, new highs/lows |

Best data shape:

| Data Type | Fields |
|---|---|
| OHLCV candles | `symbol`, `timestamp`, `open`, `high`, `low`, `close`, `volume` |
| Benchmark series | `benchmark_symbol`, `timestamp`, `close`, `return` |
| Breadth snapshot | `timestamp`, `advancing_assets`, `declining_assets`, `new_highs`, `new_lows` |
| Trade/quote stream | `symbol`, `timestamp`, `price`, `size`, `bid`, `ask` |

Why here:

- Technical metrics are time-sensitive.
- Bot groups need quick replay and live-stream behavior.
- Kafka gives deterministic replay for judging and debugging.

## Fundamental Analysis Data

Fundamental analysis should ingest normalized company data from a dedicated company-fundamentals store, not directly from the market-data stream.

Primary intake point:

| Source | Interface | Used For |
|---|---|---|
| Company fundamentals store | `fundamentals.company_snapshots` table or `/fundamentals/{symbol}` API | Revenue, margins, cash flow, debt, ownership, customer risk, employee count, valuation |

Best data shape:

| Data Type | Fields |
|---|---|
| Income statement | `symbol`, `period`, `revenue`, `gross_profit`, `operating_income`, `ebit`, `ebitda`, `net_income` |
| Cash flow statement | `symbol`, `period`, `operating_cash_flow`, `capital_expenditures`, `free_cash_flow` |
| Balance sheet | `symbol`, `period`, `total_assets`, `current_assets`, `current_liabilities`, `total_debt`, `shareholder_equity` |
| Ownership and governance | `symbol`, `period`, `shares_outstanding`, `insider_ownership_pct` |
| Business quality | `symbol`, `period`, `top_customer_revenue`, `r_and_d_expense`, `employee_count` |
| Valuation | `symbol`, `period`, `enterprise_value`, `price_to_earnings`, `earnings_growth_rate` |

Why here:

- Fundamental metrics change slower than technical market data.
- Statements need normalization across fiscal periods.
- Validation should be reproducible from a known company snapshot.

## Recommended Pipeline Boundary

Technical agents should output only candidate assets and technical evidence.

Fundamental agents should then fetch the latest normalized company snapshot for each candidate symbol.

Suggested flow:

```text
sys.market_data.live
  -> technical-agents
  -> stage1.technical.out
  -> fundamental-agents
  -> fundamentals.company_snapshots lookup
  -> stage2.fundamental.out
```

This keeps Stage 1 fast and stream-driven while Stage 2 stays reliable and statement-driven.

## Sentiment Analysis Data

Sentiment analysis should ingest normalized evidence bundles after fundamental validation.

Primary intake point:

| Source | Interface | Used For |
|---|---|---|
| Sentiment evidence store | `sentiment.evidence_snapshots` table or `/sentiment/evidence/{symbol}` API | News, social, search, options, fund flow, analyst, call transcript, insider, macro, alternative, and prediction-market evidence |

Best data shape:

| Data Type | Fields |
|---|---|
| Evidence snapshot | `symbol`, `method`, `source`, `observed_at`, `lookback_days`, `raw_signal`, `confidence`, `recency_weight`, `source_reliability`, `explanation` |
| Method score | `symbol`, `method`, `score`, `confidence`, `weighted_score`, `rationale` |

Suggested flow:

```text
stage2.fundamental.out
  -> sentiment-agents
  -> sentiment.evidence_snapshots lookup
  -> stage3.sentiment.out
```

This keeps Stage 3 expensive and evidence-driven instead of mixing qualitative analysis into the faster technical and fundamental filters.
