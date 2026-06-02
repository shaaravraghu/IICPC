# Technical Metrics

This document defines the 20 technical-analysis functions currently intended for the Stage 1 bot fleet.

Each metric should be treated as a **predefined function** that a strategy author can call with parameters. These are the technical building blocks for asset filtering before the fundamental and sentiment layers.

## Metric List

| # | Function Key | Display Name | Measures |
|---|---|---|---|
| 1 | `trend_strength_adx` | Trend Strength (ADX) | Whether a trend exists and how strong it is |
| 2 | `relative_strength_vs_benchmark` | Relative Strength vs Benchmark | Outperformance/underperformance |
| 3 | `momentum_rate_of_change` | Momentum Rate of Change (ROC) | Speed of price movement |
| 4 | `rsi_regime_analysis` | RSI Regime Analysis | Persistent buying/selling pressure |
| 5 | `macd_histogram_slope` | MACD Histogram Slope | Momentum acceleration/deceleration |
| 6 | `realized_volatility` | Realized Volatility | Actual market uncertainty |
| 7 | `atr_expansion_contraction` | ATR Expansion/Contraction | Volatility regime shifts |
| 8 | `bollinger_band_width` | Bollinger Band Width | Compression vs expansion phases |
| 9 | `volume_profile` | Volume Profile | Price levels with highest participation |
| 10 | `vwap_distance` | VWAP Distance | Institutional positioning |
| 11 | `on_balance_volume` | On-Balance Volume (OBV) | Whether volume confirms moves |
| 12 | `accumulation_distribution_line` | Accumulation/Distribution Line | Smart money accumulation/distribution |
| 13 | `market_breadth` | Market Breadth | How many assets participate |
| 14 | `advance_decline_line` | Advance-Decline Line | Internal market health |
| 15 | `new_high_new_low_ratio` | New High/New Low Ratio | Leadership strength |
| 16 | `correlation_to_market` | Correlation to Market | Independence from index behavior |
| 17 | `beta_stability` | Beta Stability | Sensitivity to market movements |
| 18 | `drawdown_depth` | Drawdown Depth | Downside risk profile |
| 19 | `hurst_exponent` | Hurst Exponent | Trending vs mean-reverting nature |
| 20 | `market_structure_analysis` | Market Structure Analysis | Higher highs/lows and trend integrity |

## Source Of Truth

These definitions now live in two places:

- [libs/eval-algorithms/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/eval-algorithms/src/lib.rs): canonical Rust-side catalog used by the backend
- [scripts/src/seed-functions.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/scripts/src/seed-functions.ts): metadata used to seed the functions library surfaced to users

## Current Status

- All 20 technical metrics are now explicitly named and described.
- Each metric has a clear function key, signature, parameters, and return shape in the seeded function metadata.
- The starter strategy in [libs/strategy-parser/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/strategy-parser/src/lib.rs) now references the updated technical catalog names.

## Important Note

These metrics are now clearly **defined**, but not all of them are fully implemented as executable numeric algorithms yet.

Right now:

- The catalog and signatures are explicit.
- The strategy layer can refer to them consistently.
- The function library can present them clearly to users.

Still to do in a later pass:

- Implement the full numerical logic for every metric inside `eval-algorithms`
- Add per-metric unit tests with representative market data
- Wire technical bot groups to evaluate real metric outputs instead of placeholder scoring
