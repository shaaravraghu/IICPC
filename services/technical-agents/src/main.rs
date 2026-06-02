use eval_algorithms::{relative_strength_index, simple_moving_average};
use platform_types::{Asset, MetricSignal};

fn main() {
    let prices = [101.0, 102.5, 103.2, 102.8, 104.0, 105.6, 106.1];
    let rsi = relative_strength_index(&prices, 14);
    let sma = simple_moving_average(&prices, 5);
    let score = (rsi * 0.7) + ((prices.last().copied().unwrap_or_default() / sma) * 30.0);
    let signal = MetricSignal {
        asset: Asset {
            symbol: "IICPC".to_string(),
            name: "IICPC Demo Asset".to_string(),
            sector: "Technology".to_string(),
        },
        group_id: "momentum-breakout".to_string(),
        score,
        passed: score >= 62.0,
        reasons: vec![format!("rsi={rsi:.2}"), format!("sma={sma:.2}")],
    };

    println!("technical-agents ready");
    println!("group={} symbol={} passed={} score={:.2}", signal.group_id, signal.asset.symbol, signal.passed, signal.score);
}
