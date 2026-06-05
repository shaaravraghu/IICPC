# IICPC Summer Hackathon 2026 — Team Proposal

**For Panel Review | Seeking Alignment Confirmation**
**Submission Window:** Final week, before June 10, 2026

---

## Proposed Interpretation of the Challenge

The problem statement asks for a **Distributed Benchmarking and Hosting Platform** to evaluate contestant-submitted trading infrastructure. We propose to interpret the "trading infrastructure" being evaluated not as low-level orderbook/matching engine code, but as **trading signal pipelines** — specifically, multi-agent systems that generate, filter, and rank trade candidates using technical, fundamental, and sentiment analysis.

Under this interpretation, our platform:

- Hosts and executes contestant-submitted signal pipeline code
- Subjects each submission to a standardized, reproducible evaluation harness
- Scores submissions across three measurable dimensions (signal quality, backtest performance, and execution simulation)
- Streams results to a live, ranked leaderboard

We are seeking panel confirmation that this interpretation is within scope before proceeding to full implementation.

---

## System Overview

The platform operates as a multi-stage evaluation pipeline. Each stage is handled by a fleet of distributed bots, ensuring parallelism, scalability, and deterministic scoring.

```
Contestant Signal Pipeline Upload
            ↓
   Event Streaming Layer
  (Kafka / Redpanda / NATS)
            ↓
  ┌─────────────────────────────────┐
  │     Multi-Agent Signal Engine   │
  │                                 │
  │  Stage 1: Technical Analysis    │
  │        Bot Groups               │
  │           ↓                     │
  │  Stage 2: Fundamental Analysis  │
  │        Bot Groups               │
  │           ↓                     │
  │  Stage 3: Sentiment Analysis    │
  │        Bot Groups               │
  └──────────────┬──────────────────┘
                 ↓
    Confidence Arbitration Layer
    (Weighted Ensemble Scoring)
                 ↓
   Strategy Execution Simulator
   (Historical data backtesting)
                 ↓
   Deterministic Replay Judge
                 ↓
  Risk-Adjusted Evaluation Engine
                 ↓
  Leaderboard + Live Analytics Dashboard
```

---

## Stage-by-Stage Breakdown

### Stage 1 — Technical Analysis Layer

The first filtering stage. Assets are passed through multiple groups of technical metrics. Each metric group is handled by an independent bot.

**How it works:** Bots apply trigger initiators — sets of technical metrics — to the live asset universe. Assets that satisfy any trigger group are passed forward to Stage 2. Assets that satisfy none are dropped. This filters the largest chunk of the universe down to a focused subset.

**Metric groups cover (20 metrics total):**

| # | Metric | Measures |
|---|---|---|
| 1 | Trend Strength (ADX) | Whether a trend exists and its strength |
| 2 | Relative Strength vs Benchmark | Outperformance / underperformance |
| 3 | Momentum Rate of Change (ROC) | Speed of price movement |
| 4 | RSI Regime Analysis | Persistent buying / selling pressure |
| 5 | MACD Histogram Slope | Momentum acceleration / deceleration |
| 6 | Realized Volatility | Actual market uncertainty |
| 7 | ATR Expansion / Contraction | Volatility regime shifts |
| 8 | Bollinger Band Width | Compression vs expansion phases |
| 9 | Volume Profile | Price levels with highest participation |
| 10 | VWAP Distance | Institutional positioning |
| 11 | On-Balance Volume (OBV) | Whether volume confirms moves |
| 12 | Accumulation / Distribution Line | Smart money accumulation / distribution |
| 13 | Market Breadth | How many assets participate |
| 14 | Advance-Decline Line | Internal market health |
| 15 | New High / New Low Ratio | Leadership strength |
| 16 | Correlation to Market | Independence from index behavior |
| 17 | Beta Stability | Sensitivity to market movements |
| 18 | Drawdown Depth | Downside risk profile |
| 19 | Hurst Exponent | Trending vs mean-reverting nature |
| 20 | Market Structure Analysis | Higher highs / lows and trend integrity |

**What makes it special:** Filters out the largest chunk efficiently, letting the heavier downstream stages focus on a niche candidate set.

---

### Stage 2 — Fundamental Analysis Layer

Validates the technically shortlisted assets. Each asset is passed through multiple groups of fundamental metrics, each group handled by a bot. Assets passing any group proceed to Stage 3.

**How it works:** Unlike Stage 1, this stage does not follow market trend — it verifies potential, consistency, and reliability of the underlying business or asset.

**Metric groups cover (20 metrics total):**

| # | Metric | Validates |
|---|---|---|
| 1 | Revenue Growth Rate | Demand growth |
| 2 | Organic Revenue Growth | True growth vs acquisitions |
| 3 | Gross Margin | Pricing power and moat |
| 4 | Operating Margin | Operational efficiency |
| 5 | Free Cash Flow Margin | Ability to convert revenue into cash |
| 6 | Return on Invested Capital (ROIC) | Capital efficiency |
| 7 | Return on Equity (ROE) | Shareholder value creation |
| 8 | Return on Assets (ROA) | Asset productivity |
| 9 | Free Cash Flow Growth | Sustainability of business expansion |
| 10 | Earnings Quality Ratio | Quality of reported earnings |
| 11 | Debt-to-EBITDA | Leverage risk |
| 12 | Interest Coverage Ratio | Debt servicing ability |
| 13 | Current Ratio | Short-term financial health |
| 14 | Share Dilution Rate | Management alignment |
| 15 | Insider Ownership Trend | Management conviction |
| 16 | Customer Concentration | Revenue risk |
| 17 | R&D Intensity | Future innovation pipeline |
| 18 | Revenue per Employee | Organizational efficiency |
| 19 | EV/FCF Ratio | Cash-based valuation |
| 20 | PEG Ratio | Whether growth justifies valuation |

**What makes it special:** Provides a reality check on technically interesting assets — removes noise that looks good on a chart but has weak fundamentals.

---

### Stage 3 — Sentiment Analysis Layer

The final filtering and scoring stage. Assets that survive Stages 1 and 2 are assigned a sentiment score between **-5 and +5** across 15 sentiment dimensions. Each dimension is weighted; the total neural network weight across all dimensions is 100%.

**How it works:** Each shortlisted asset receives a per-dimension score. Scores are multiplied by their respective weights and summed. Assets are then ranked high-to-low — this ranked list forms **Column 1 of the leaderboard**.

**Sentiment dimensions (15 total):**

| # | Method | What It Measures |
|---|---|---|
| 1 | News Sentiment Analysis | Positive / negative tone in financial news |
| 2 | Social Media Sentiment | Public opinion from X, Reddit, LinkedIn, etc. |
| 3 | Search Trend Analysis | Rising interest via search volume data |
| 4 | Options Market Sentiment | Expectations implied by options traders |
| 5 | Institutional Fund Flow Analysis | Where large investors are moving capital |
| 6 | Analyst Rating Sentiment | Upgrades, downgrades, target-price revisions |
| 7 | Earnings Call Sentiment | Management confidence during earnings calls |
| 8 | Insider Trading Analysis | Actions of executives and directors |
| 9 | Technical Sentiment Indicators | Market psychology in price behavior |
| 10 | Consumer Review Sentiment | Customer opinions about products / services |
| 11 | Supply Chain Sentiment | Signals from suppliers and logistics |
| 12 | Influencer, Community & Forum Analysis | Deep discussions from niche communities |
| 13 | Macroeconomic Sentiment Analysis | Sentiment implied by economic indicators |
| 14 | Alternative Data Sentiment | Real-world behavioral signals |
| 15 | Prediction Market Analysis | What people are willing to bet on |

**What makes it special:** Provides qualitative, multi-dimensional understanding that technical and fundamental analysis alone cannot capture. Acts as a final breakthrough layer for edge cases that earlier stages may have borderlined.

---

### Stage 4 — Strategy Execution Simulator

Assets from Stage 3 are now backtested to evaluate how a strategy based on these signals would have performed historically.

**How it works:** Each asset is tested against historical data across **four time horizons**, with **5 randomly sampled trades per horizon**:

| Horizon | Trade Type | Description |
|---|---|---|
| Intra-day | Short-duration | Same-session entry and exit |
| Short-term | Days to weeks | Swing trade simulation |
| Medium-term | Weeks to months | Positional trade simulation |
| Long-term | Months to year+ | Macro trend simulation |

Each trade is scored on a detailed point system covering entry quality, exit accuracy, drawdown during the trade, and final P&L relative to benchmark. This forms **Column 2 of the leaderboard**.

---

### Leaderboard Structure

| Column 1 | Column 2 | Column 3 *(Future)* |
|---|---|---|
| Sentiment Score (Stage 3 weighted ranking) | Backtest Performance Score (Stage 4 simulation) | Paper Trading Score (live forward-test with preset timelines) |

The composite leaderboard ranks contestants by a weighted combination of Column 1 and Column 2 scores. Column 3 will be added in the post-hackathon roadmap.

---

## Distributed Architecture

Each stage is decomposed into independent bot groups, each deployed as a scalable distributed service:

- **Bot-per-metric-group pattern:** Each group of related metrics is handled by a dedicated bot service, enabling parallel evaluation across the asset universe
- **Event-driven handoff:** Stages communicate via an event streaming layer (Kafka / Redpanda / NATS), ensuring loose coupling and replay capability
- **Deterministic Replay Judge:** The full order of operations is logged and replayable, enabling auditable, reproducible scoring
- **Live feed ingestion:** The pipeline connects to live news and market data feeds at the top of the stack, ensuring signal freshness

---

## Scoring Philosophy

> A stock gets a score between -5 and +5 on each sentiment parameter. Each score is multiplied by the parameter's weight. The weighted scores are summed. Assets are ranked high-to-low.

The same weighted scoring philosophy extends to the backtest layer — each trade result contributes a partial score, and the aggregate forms the Column 2 ranking. This keeps the scoring system consistent, interpretable, and defensible to judges.

---

## Future Roadmap

- **Paper Trading Column (Column 3):** Allow contestants to make live paper trades with preset timelines. Scores update in real time as the market moves, adding a forward-looking competitive dimension beyond historical backtesting.
- **Replay-on-demand:** Let contestants re-run their pipeline against a different historical window for debugging and iteration.
- **Custom weight configuration:** Allow contestants to tune sentiment parameter weights and observe the effect on their leaderboard ranking.

---

## Open Question for Panel

> Does this interpretation — evaluating contestant-submitted **trading signal pipelines** rather than low-level orderbook/matching engine code — fall within the intended scope of the challenge?

We believe the core engineering requirements are met: the platform is distributed, benchmarks submitted code, uses a bot fleet for evaluation, and streams results to a live leaderboard. We are seeking confirmation before committing to full implementation.

---

*Prepared for panel review. All feedback welcome.*
