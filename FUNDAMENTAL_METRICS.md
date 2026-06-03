# Fundamental Metrics

This document defines the 20 fundamental-analysis functions intended for the Stage 2 validation layer.

Fundamental analysis does not chase the current market trend. It validates whether technically triggered assets have real business quality, consistency, reliability, and valuation support before they move to sentiment scoring.

## Metric List

| # | Function Key | Display Name | What It Validates |
|---|---|---|---|
| 1 | `revenue_growth_rate` | Revenue Growth Rate | Demand growth |
| 2 | `organic_revenue_growth` | Organic Revenue Growth | True growth vs acquisitions |
| 3 | `gross_margin` | Gross Margin | Pricing power and moat |
| 4 | `operating_margin` | Operating Margin | Operational efficiency |
| 5 | `free_cash_flow_margin` | Free Cash Flow Margin | Ability to convert revenue into cash |
| 6 | `return_on_invested_capital` | Return on Invested Capital (ROIC) | Capital efficiency |
| 7 | `return_on_equity` | Return on Equity (ROE) | Shareholder value creation |
| 8 | `return_on_assets` | Return on Assets (ROA) | Asset productivity |
| 9 | `free_cash_flow_growth` | Free Cash Flow Growth | Sustainability of business expansion |
| 10 | `earnings_quality_ratio` | Earnings Quality Ratio | Quality of reported earnings |
| 11 | `debt_to_ebitda` | Debt-to-EBITDA | Leverage risk |
| 12 | `interest_coverage_ratio` | Interest Coverage Ratio | Debt servicing ability |
| 13 | `current_ratio` | Current Ratio | Short-term financial health |
| 14 | `share_dilution_rate` | Share Dilution Rate | Management alignment |
| 15 | `insider_ownership_trend` | Insider Ownership Trend | Management conviction |
| 16 | `customer_concentration` | Customer Concentration | Revenue risk |
| 17 | `research_and_development_intensity` | R&D Intensity | Future innovation pipeline |
| 18 | `revenue_per_employee` | Revenue per Employee | Organizational efficiency |
| 19 | `enterprise_value_to_free_cash_flow` | EV/FCF Ratio | Cash-based valuation |
| 20 | `peg_ratio` | PEG Ratio | Whether growth justifies valuation |

## How Stage 2 Uses These Metrics

Technical analysis produces candidate assets. Fundamental analysis then validates those assets through grouped checks.

Examples:

- A growth-quality group might combine `revenue_growth_rate`, `organic_revenue_growth`, `gross_margin`, and `free_cash_flow_margin`.
- A reliability group might combine `earnings_quality_ratio`, `debt_to_ebitda`, `interest_coverage_ratio`, and `current_ratio`.
- A valuation group might combine `enterprise_value_to_free_cash_flow`, `peg_ratio`, and `return_on_invested_capital`.

An asset only needs to pass one configured fundamental group to move forward to sentiment scoring.

## Source Of Truth

These definitions live in two places:

- [libs/eval-algorithms/src/lib.rs](/Users/shaarav/Documents/GitHub_Projects/IICPC/libs/eval-algorithms/src/lib.rs): canonical Rust-side catalog used by the backend
- [scripts/src/seed-functions.ts](/Users/shaarav/Documents/GitHub_Projects/IICPC/scripts/src/seed-functions.ts): metadata used to seed the functions library surfaced to users

## Current Status

- All 20 fundamental metrics are now explicitly named and described.
- Each metric has a clear function key, signature, parameters, return value, and validation purpose.
- The function library now reflects the intended Stage 2 validation layer instead of generic statistical helpers.

## Still To Implement

- Full numerical implementations for every metric in `eval-algorithms`
- Per-metric unit tests using representative financial statement inputs
- Fundamental bot groups that evaluate real metric outputs against thresholds
