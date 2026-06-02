use eval_algorithms::deterministic_execution_result;
use platform_types::TradeHorizon;

fn main() {
    println!("execution-sim ready");
    for (seed, horizon) in [
        TradeHorizon::Intraday,
        TradeHorizon::ShortTerm,
        TradeHorizon::MediumTerm,
        TradeHorizon::LongTerm,
    ]
    .into_iter()
    .enumerate()
    {
        let result = deterministic_execution_result("IICPC", horizon, seed);
        println!(
            "symbol={} horizon={:?} trades={} pnl={:.2}% score={:.2}",
            result.symbol, result.horizon, result.trade_count, result.pnl_pct, result.score
        );
    }
}
