use platform_types::{
    FunctionParamDef, MarketCandle, PaperTradingResult, RankedAsset, TechnicalMetricDefinition,
    TradeHorizon, TradeSimulationResult,
};

const PRICE_SERIES_PARAM: FunctionParamDef = FunctionParamDef {
    name: "prices",
    type_name: "&[f64]",
    description: "Ordered close-price series for the asset under analysis",
    optional: false,
};

const HIGH_SERIES_PARAM: FunctionParamDef = FunctionParamDef {
    name: "highs",
    type_name: "&[f64]",
    description: "Ordered high-price series",
    optional: false,
};

const LOW_SERIES_PARAM: FunctionParamDef = FunctionParamDef {
    name: "lows",
    type_name: "&[f64]",
    description: "Ordered low-price series",
    optional: false,
};

const VOLUME_SERIES_PARAM: FunctionParamDef = FunctionParamDef {
    name: "volumes",
    type_name: "&[f64]",
    description: "Ordered traded-volume series",
    optional: false,
};

const BENCHMARK_PARAM: FunctionParamDef = FunctionParamDef {
    name: "benchmark_prices",
    type_name: "&[f64]",
    description: "Reference index or benchmark close-price series",
    optional: false,
};

const PERIOD_PARAM: FunctionParamDef = FunctionParamDef {
    name: "period",
    type_name: "usize",
    description: "Lookback period used by the metric",
    optional: true,
};

const STD_DEV_PARAM: FunctionParamDef = FunctionParamDef {
    name: "std_dev_multiplier",
    type_name: "f64",
    description: "Standard deviation multiplier for band calculations",
    optional: true,
};

const LEVELS_PARAM: FunctionParamDef = FunctionParamDef {
    name: "levels",
    type_name: "usize",
    description: "Number of price levels or bins to inspect",
    optional: true,
};

const RETURNS_PARAM: FunctionParamDef = FunctionParamDef {
    name: "returns",
    type_name: "&[f64]",
    description: "Periodic return series for the asset",
    optional: false,
};

const ADVANCES_PARAM: FunctionParamDef = FunctionParamDef {
    name: "advancing_assets",
    type_name: "usize",
    description: "Count of assets closing higher in the session",
    optional: false,
};

const DECLINES_PARAM: FunctionParamDef = FunctionParamDef {
    name: "declining_assets",
    type_name: "usize",
    description: "Count of assets closing lower in the session",
    optional: false,
};

const NEW_HIGHS_PARAM: FunctionParamDef = FunctionParamDef {
    name: "new_highs",
    type_name: "usize",
    description: "Count of assets making new highs",
    optional: false,
};

const NEW_LOWS_PARAM: FunctionParamDef = FunctionParamDef {
    name: "new_lows",
    type_name: "usize",
    description: "Count of assets making new lows",
    optional: false,
};

pub fn technical_metric_catalog() -> Vec<TechnicalMetricDefinition> {
    vec![
        TechnicalMetricDefinition {
            key: "trend_strength_adx",
            display_name: "Trend Strength (ADX)",
            measures: "Whether a trend exists and how strong it is",
            description: "Calculates the Average Directional Index to determine whether price action is trending or range-bound.",
            signature: "trend_strength_adx(highs: &[f64], lows: &[f64], prices: &[f64], period?: usize) -> f64",
            returns: "ADX value on a 0-100 scale",
            params: &[HIGH_SERIES_PARAM, LOW_SERIES_PARAM, PRICE_SERIES_PARAM, PERIOD_PARAM],
        },
        TechnicalMetricDefinition {
            key: "relative_strength_vs_benchmark",
            display_name: "Relative Strength vs Benchmark",
            measures: "Outperformance/underperformance",
            description: "Compares asset return over a lookback window against a benchmark return over the same period.",
            signature: "relative_strength_vs_benchmark(prices: &[f64], benchmark_prices: &[f64], period?: usize) -> f64",
            returns: "Relative performance spread in percentage points",
            params: &[PRICE_SERIES_PARAM, BENCHMARK_PARAM, PERIOD_PARAM],
        },
        TechnicalMetricDefinition {
            key: "momentum_rate_of_change",
            display_name: "Momentum Rate of Change (ROC)",
            measures: "Speed of price movement",
            description: "Measures percentage price change over a configurable lookback window.",
            signature: "momentum_rate_of_change(prices: &[f64], period?: usize) -> f64",
            returns: "Percentage rate of change",
            params: &[PRICE_SERIES_PARAM, PERIOD_PARAM],
        },
        TechnicalMetricDefinition {
            key: "rsi_regime_analysis",
            display_name: "RSI Regime Analysis",
            measures: "Persistent buying/selling pressure",
            description: "Evaluates whether RSI remains in bullish, neutral, or bearish territory across consecutive observations.",
            signature: "rsi_regime_analysis(prices: &[f64], period?: usize) -> f64",
            returns: "Regime score normalized to 0-100",
            params: &[PRICE_SERIES_PARAM, PERIOD_PARAM],
        },
        TechnicalMetricDefinition {
            key: "macd_histogram_slope",
            display_name: "MACD Histogram Slope",
            measures: "Momentum acceleration/deceleration",
            description: "Measures the slope of the MACD histogram to detect increasing or weakening momentum.",
            signature: "macd_histogram_slope(prices: &[f64], fast?: usize, slow?: usize, signal?: usize) -> f64",
            returns: "Signed slope value where positive implies acceleration",
            params: &[PRICE_SERIES_PARAM],
        },
        TechnicalMetricDefinition {
            key: "realized_volatility",
            display_name: "Realized Volatility",
            measures: "Actual market uncertainty",
            description: "Computes standard deviation of periodic returns to quantify observed volatility.",
            signature: "realized_volatility(returns: &[f64], annualization_factor?: f64) -> f64",
            returns: "Volatility as a percentage",
            params: &[RETURNS_PARAM],
        },
        TechnicalMetricDefinition {
            key: "atr_expansion_contraction",
            display_name: "ATR Expansion/Contraction",
            measures: "Volatility regime shifts",
            description: "Tracks whether Average True Range is expanding or contracting relative to recent history.",
            signature: "atr_expansion_contraction(highs: &[f64], lows: &[f64], prices: &[f64], period?: usize) -> f64",
            returns: "Signed regime-change score",
            params: &[HIGH_SERIES_PARAM, LOW_SERIES_PARAM, PRICE_SERIES_PARAM, PERIOD_PARAM],
        },
        TechnicalMetricDefinition {
            key: "bollinger_band_width",
            display_name: "Bollinger Band Width",
            measures: "Compression vs expansion phases",
            description: "Measures the width between upper and lower Bollinger Bands relative to the middle band.",
            signature: "bollinger_band_width(prices: &[f64], period?: usize, std_dev_multiplier?: f64) -> f64",
            returns: "Normalized band-width ratio",
            params: &[PRICE_SERIES_PARAM, PERIOD_PARAM, STD_DEV_PARAM],
        },
        TechnicalMetricDefinition {
            key: "volume_profile",
            display_name: "Volume Profile",
            measures: "Price levels with highest participation",
            description: "Builds a coarse distribution of traded volume by price region to locate high-participation zones.",
            signature: "volume_profile(candles: &[MarketCandle], levels?: usize) -> Vec<(f64, f64)>",
            returns: "Price-volume buckets ordered by price",
            params: &[LEVELS_PARAM],
        },
        TechnicalMetricDefinition {
            key: "vwap_distance",
            display_name: "VWAP Distance",
            measures: "Institutional positioning",
            description: "Measures current price distance from VWAP to estimate whether the asset is extended above or below institutional average execution.",
            signature: "vwap_distance(candles: &[MarketCandle]) -> f64",
            returns: "Percentage distance from VWAP",
            params: &[],
        },
        TechnicalMetricDefinition {
            key: "on_balance_volume",
            display_name: "On-Balance Volume (OBV)",
            measures: "Whether volume confirms moves",
            description: "Cumulates volume based on up and down closes to judge whether volume confirms trend direction.",
            signature: "on_balance_volume(prices: &[f64], volumes: &[f64]) -> f64",
            returns: "Cumulative OBV value",
            params: &[PRICE_SERIES_PARAM, VOLUME_SERIES_PARAM],
        },
        TechnicalMetricDefinition {
            key: "accumulation_distribution_line",
            display_name: "Accumulation/Distribution Line",
            measures: "Smart money accumulation/distribution",
            description: "Uses close location value and volume to estimate whether money is accumulating into or distributing out of the asset.",
            signature: "accumulation_distribution_line(highs: &[f64], lows: &[f64], prices: &[f64], volumes: &[f64]) -> f64",
            returns: "Cumulative accumulation/distribution value",
            params: &[HIGH_SERIES_PARAM, LOW_SERIES_PARAM, PRICE_SERIES_PARAM, VOLUME_SERIES_PARAM],
        },
        TechnicalMetricDefinition {
            key: "market_breadth",
            display_name: "Market Breadth",
            measures: "How many assets participate",
            description: "Measures participation strength by comparing the number of advancing assets against decliners.",
            signature: "market_breadth(advancing_assets: usize, declining_assets: usize) -> f64",
            returns: "Breadth ratio in the range 0-1",
            params: &[ADVANCES_PARAM, DECLINES_PARAM],
        },
        TechnicalMetricDefinition {
            key: "advance_decline_line",
            display_name: "Advance-Decline Line",
            measures: "Internal market health",
            description: "Tracks cumulative net advances over time to judge whether market internals support the move.",
            signature: "advance_decline_line(net_advances: &[i64]) -> i64",
            returns: "Cumulative advance-decline value",
            params: &[FunctionParamDef {
                name: "net_advances",
                type_name: "&[i64]",
                description: "Time-ordered series of advances minus declines",
                optional: false,
            }],
        },
        TechnicalMetricDefinition {
            key: "new_high_new_low_ratio",
            display_name: "New High/New Low Ratio",
            measures: "Leadership strength",
            description: "Compares the number of assets making new highs against those making new lows.",
            signature: "new_high_new_low_ratio(new_highs: usize, new_lows: usize) -> f64",
            returns: "Leadership ratio where values above 1 imply strength",
            params: &[NEW_HIGHS_PARAM, NEW_LOWS_PARAM],
        },
        TechnicalMetricDefinition {
            key: "correlation_to_market",
            display_name: "Correlation to Market",
            measures: "Independence from index behavior",
            description: "Computes rolling correlation between asset returns and benchmark returns.",
            signature: "correlation_to_market(returns: &[f64], benchmark_returns: &[f64]) -> f64",
            returns: "Pearson correlation coefficient in the range -1 to 1",
            params: &[
                RETURNS_PARAM,
                FunctionParamDef {
                    name: "benchmark_returns",
                    type_name: "&[f64]",
                    description: "Periodic return series for the benchmark",
                    optional: false,
                },
            ],
        },
        TechnicalMetricDefinition {
            key: "beta_stability",
            display_name: "Beta Stability",
            measures: "Sensitivity to market movements",
            description: "Measures how stable the asset's beta remains across rolling windows instead of treating beta as a single point estimate.",
            signature: "beta_stability(returns: &[f64], benchmark_returns: &[f64], window?: usize) -> f64",
            returns: "Stability score where higher implies more stable beta behavior",
            params: &[RETURNS_PARAM],
        },
        TechnicalMetricDefinition {
            key: "drawdown_depth",
            display_name: "Drawdown Depth",
            measures: "Downside risk profile",
            description: "Measures the largest peak-to-trough loss across a lookback window.",
            signature: "drawdown_depth(prices: &[f64]) -> f64",
            returns: "Maximum drawdown as a negative percentage",
            params: &[PRICE_SERIES_PARAM],
        },
        TechnicalMetricDefinition {
            key: "hurst_exponent",
            display_name: "Hurst Exponent",
            measures: "Trending vs mean-reverting nature",
            description: "Estimates long-memory characteristics to distinguish persistent, random, and mean-reverting price behavior.",
            signature: "hurst_exponent(prices: &[f64]) -> f64",
            returns: "Exponent where >0.5 trends and <0.5 mean reverts",
            params: &[PRICE_SERIES_PARAM],
        },
        TechnicalMetricDefinition {
            key: "market_structure_analysis",
            display_name: "Market Structure Analysis",
            measures: "Higher highs/lows and trend integrity",
            description: "Evaluates whether a sequence of swing highs and lows preserves bullish or bearish trend structure.",
            signature: "market_structure_analysis(highs: &[f64], lows: &[f64]) -> f64",
            returns: "Structure integrity score normalized to 0-100",
            params: &[HIGH_SERIES_PARAM, LOW_SERIES_PARAM],
        },
    ]
}

pub fn clamp(value: f64, min: f64, max: f64) -> f64 {
    value.max(min).min(max)
}

pub fn mean(values: &[f64]) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    values.iter().sum::<f64>() / values.len() as f64
}

pub fn percentile(values: &[f64], pct: f64) -> f64 {
    if values.is_empty() {
        return 0.0;
    }

    let mut sorted = values.to_vec();
    sorted.sort_by(|left, right| left.total_cmp(right));
    let pct = clamp(pct, 0.0, 100.0);
    let rank = (pct / 100.0) * (sorted.len().saturating_sub(1) as f64);
    let lower = rank.floor() as usize;
    let upper = rank.ceil() as usize;

    if lower == upper {
        sorted[lower]
    } else {
        let weight = rank - lower as f64;
        sorted[lower] * (1.0 - weight) + sorted[upper] * weight
    }
}

pub fn simple_moving_average(prices: &[f64], period: usize) -> f64 {
    if period == 0 || prices.is_empty() {
        return 0.0;
    }
    let start = prices.len().saturating_sub(period);
    mean(&prices[start..])
}

pub fn relative_strength_index(prices: &[f64], period: usize) -> f64 {
    if prices.len() < 2 || period == 0 {
        return 50.0;
    }

    let start = prices.len().saturating_sub(period + 1);
    let mut gains = 0.0;
    let mut losses = 0.0;

    for pair in prices[start..].windows(2) {
        let delta = pair[1] - pair[0];
        if delta >= 0.0 {
            gains += delta;
        } else {
            losses += delta.abs();
        }
    }

    if losses == 0.0 {
        return 100.0;
    }

    let rs = gains / losses;
    100.0 - (100.0 / (1.0 + rs))
}

pub fn volume_weighted_average_price(candles: &[MarketCandle]) -> f64 {
    let volume = candles.iter().map(|candle| candle.volume).sum::<f64>();
    if volume == 0.0 {
        return candles.last().map(|candle| candle.close).unwrap_or_default();
    }

    candles
        .iter()
        .map(|candle| ((candle.high + candle.low + candle.close) / 3.0) * candle.volume)
        .sum::<f64>()
        / volume
}

pub fn return_on_invested_capital(nopat: f64, invested_capital: f64) -> f64 {
    if invested_capital == 0.0 {
        return 0.0;
    }
    (nopat / invested_capital) * 100.0
}

pub fn free_cash_flow_margin(free_cash_flow: f64, revenue: f64) -> f64 {
    if revenue == 0.0 {
        return 0.0;
    }
    (free_cash_flow / revenue) * 100.0
}

pub fn weighted_sentiment_score(dimensions: &[(f64, f64)]) -> f64 {
    let total_weight = dimensions.iter().map(|(weight, _)| *weight).sum::<f64>();
    if total_weight == 0.0 {
        return 0.0;
    }

    let weighted = dimensions
        .iter()
        .map(|(weight_pct, score)| (weight_pct / total_weight) * clamp(*score, -5.0, 5.0))
        .sum::<f64>();

    clamp(weighted, -5.0, 5.0)
}

pub fn signal_leaderboard_score(sentiment_score: f64) -> f64 {
    clamp(((sentiment_score + 5.0) / 10.0) * 100.0, 0.0, 100.0)
}

pub fn execution_score(pnl_pct: f64, max_drawdown_pct: f64, hit_rate_pct: f64) -> f64 {
    let pnl_component = clamp(50.0 + pnl_pct * 2.0, 0.0, 100.0) * 0.45;
    let drawdown_component = clamp(100.0 - max_drawdown_pct * 4.0, 0.0, 100.0) * 0.25;
    let hit_component = clamp(hit_rate_pct, 0.0, 100.0) * 0.30;
    pnl_component + drawdown_component + hit_component
}

pub fn paper_trading_score(pnl_pct: f64, volatility_pct: f64, adherence_pct: f64) -> f64 {
    let return_component = clamp(50.0 + pnl_pct * 1.5, 0.0, 100.0) * 0.40;
    let risk_component = clamp(100.0 - volatility_pct * 3.0, 0.0, 100.0) * 0.30;
    let adherence_component = clamp(adherence_pct, 0.0, 100.0) * 0.30;
    return_component + risk_component + adherence_component
}

pub fn composite_score(signal: f64, execution: f64, paper: f64) -> f64 {
    signal * 0.40 + execution * 0.35 + paper * 0.25
}

pub fn rank_assets(mut assets: Vec<RankedAsset>) -> Vec<RankedAsset> {
    assets.sort_by(|left, right| right.signal_score.total_cmp(&left.signal_score));
    assets
}

pub fn deterministic_execution_result(symbol: &str, horizon: TradeHorizon, seed: usize) -> TradeSimulationResult {
    let horizon_factor = match horizon {
        TradeHorizon::Intraday => 0.8,
        TradeHorizon::ShortTerm => 1.0,
        TradeHorizon::MediumTerm => 1.2,
        TradeHorizon::LongTerm => 1.5,
    };
    let base = symbol.bytes().map(|byte| byte as usize).sum::<usize>() + seed * 17;
    let pnl_pct = ((base % 220) as f64 / 10.0 - 8.0) * horizon_factor;
    let max_drawdown_pct = 2.0 + (base % 40) as f64 / 5.0;
    let hit_rate_pct = 45.0 + (base % 35) as f64;
    let score = execution_score(pnl_pct, max_drawdown_pct, hit_rate_pct);

    TradeSimulationResult {
        symbol: symbol.to_string(),
        horizon,
        trade_count: 5,
        pnl_pct,
        max_drawdown_pct,
        hit_rate_pct,
        score,
    }
}

pub fn deterministic_paper_result(symbol: &str, timeline: &str, seed: usize) -> PaperTradingResult {
    let base = symbol.bytes().map(|byte| byte as usize).sum::<usize>() + timeline.len() + seed * 11;
    let pnl_pct = (base % 180) as f64 / 10.0 - 6.0;
    let volatility_pct = 5.0 + (base % 25) as f64 / 3.0;
    let adherence_pct = 70.0 + (base % 25) as f64;
    let risk_adjusted_score = paper_trading_score(pnl_pct, volatility_pct, adherence_pct);

    PaperTradingResult {
        symbol: symbol.to_string(),
        timeline: timeline.to_string(),
        pnl_pct,
        risk_adjusted_score,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn calculates_percentiles() {
        let values = [1.0, 10.0, 5.0, 3.0, 8.0];
        assert_eq!(percentile(&values, 0.0), 1.0);
        assert_eq!(percentile(&values, 50.0), 5.0);
        assert_eq!(percentile(&values, 100.0), 10.0);
    }

    #[test]
    fn normalizes_sentiment_to_signal_score() {
        assert_eq!(signal_leaderboard_score(-5.0), 0.0);
        assert_eq!(signal_leaderboard_score(0.0), 50.0);
        assert_eq!(signal_leaderboard_score(5.0), 100.0);
    }

    #[test]
    fn computes_weighted_sentiment() {
        let score = weighted_sentiment_score(&[(60.0, 5.0), (40.0, -5.0)]);
        assert!((score - 1.0).abs() < 0.0001);
    }

    #[test]
    fn composite_uses_three_leaderboard_columns() {
        let score = composite_score(90.0, 80.0, 70.0);
        assert!((score - 81.5).abs() < 0.0001);
    }

    #[test]
    fn technical_catalog_contains_all_expected_metrics() {
        let catalog = technical_metric_catalog();
        assert_eq!(catalog.len(), 20);
        assert!(catalog.iter().any(|metric| metric.key == "trend_strength_adx"));
        assert!(catalog.iter().any(|metric| metric.key == "market_structure_analysis"));
    }
}
