use eval_algorithms::deterministic_paper_result;

fn main() {
    println!("paper-trading ready");
    for (seed, timeline) in ["market-open", "earnings-week", "volatility-spike"].into_iter().enumerate() {
        let result = deterministic_paper_result("IICPC", timeline, seed);
        println!(
            "symbol={} timeline={} pnl={:.2}% score={:.2}",
            result.symbol, result.timeline, result.pnl_pct, result.risk_adjusted_score
        );
    }
}
