use eval_algorithms::{rank_assets, signal_leaderboard_score, weighted_sentiment_score};
use platform_types::{Asset, RankedAsset};

fn main() {
    let raw = weighted_sentiment_score(&[(20.0, 4.2), (15.0, 2.0), (15.0, 3.4), (10.0, 1.6), (15.0, 3.8), (10.0, 2.7), (10.0, 1.1), (5.0, 0.8)]);
    let score = signal_leaderboard_score(raw);
    let ranked = rank_assets(vec![RankedAsset {
        asset: Asset {
            symbol: "IICPC".to_string(),
            name: "IICPC Demo Asset".to_string(),
            sector: "Technology".to_string(),
        },
        signal_score: score,
        dimensions: vec![
            ("news_sentiment_analysis".to_string(), 4.2),
            ("options_market_sentiment".to_string(), 2.0),
            ("institutional_fund_flow_analysis".to_string(), 3.4),
            ("analyst_rating_sentiment".to_string(), 1.6),
            ("earnings_call_sentiment".to_string(), 3.8),
            ("technical_sentiment_indicators".to_string(), 2.7),
            ("alternative_data_sentiment".to_string(), 1.1),
            ("prediction_market_analysis".to_string(), 0.8),
        ],
    }]);

    println!("sentiment-agents ready");
    for (rank, asset) in ranked.iter().enumerate() {
        println!("rank={} symbol={} signal_score={:.2}", rank + 1, asset.asset.symbol, asset.signal_score);
    }
}
