use platform_types::{MarketCandle, PaperTradingResult, RankedAsset, TradeHorizon, TradeSimulationResult};

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
}
