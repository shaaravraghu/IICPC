use eval_algorithms::{composite_score, percentile};
use platform_types::LeaderboardRow;

fn main() {
    let latencies = [1.2, 1.8, 2.5, 4.9, 8.0, 3.1, 2.2, 6.4];
    let p50 = percentile(&latencies, 50.0);
    let p99 = percentile(&latencies, 99.0);
    let row = LeaderboardRow {
        rank: 1,
        strategy_id: "starter-momentum-quality-sentiment".to_string(),
        owner: "demo-team".to_string(),
        signal_score: 86.0,
        execution_score: 79.0,
        paper_trading_score: 73.0,
        composite_score: composite_score(86.0, 79.0, 73.0),
    };

    println!("telemetry-judge ready");
    println!("latency_p50_ms={p50:.2} latency_p99_ms={p99:.2}");
    println!(
        "rank={} strategy={} composite={:.2}",
        row.rank, row.strategy_id, row.composite_score
    );
}
