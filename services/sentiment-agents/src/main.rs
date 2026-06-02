use eval_algorithms::{rank_assets, signal_leaderboard_score, weighted_sentiment_score};
use platform_types::{Asset, RankedAsset};

fn main() {
    let raw = weighted_sentiment_score(&[(35.0, 4.2), (30.0, 2.0), (35.0, 3.4)]);
    let score = signal_leaderboard_score(raw);
    let ranked = rank_assets(vec![RankedAsset {
        asset: Asset {
            symbol: "IICPC".to_string(),
            name: "IICPC Demo Asset".to_string(),
            sector: "Technology".to_string(),
        },
        signal_score: score,
        dimensions: vec![
            ("news_reaction".to_string(), 4.2),
            ("market_breadth".to_string(), 2.0),
            ("volatility_regime".to_string(), 3.4),
        ],
    }]);

    println!("sentiment-agents ready");
    for (rank, asset) in ranked.iter().enumerate() {
        println!("rank={} symbol={} signal_score={:.2}", rank + 1, asset.asset.symbol, asset.signal_score);
    }
}
