use eval_algorithms::composite_score;
use strategy_parser::{starter_strategy, validate_strategy};

fn main() {
    let strategy = starter_strategy("demo-team");
    let status = validate_strategy(&strategy)
        .map(|_| "valid")
        .unwrap_or("invalid");
    let composite = composite_score(86.0, 79.0, 73.0);

    println!("api-gateway ready");
    println!("strategy_id={}", strategy.id);
    println!("strategy_status={status}");
    println!("demo_composite_score={composite:.2}");
    println!("routes=/api/healthz,/api/submissions,/api/leaderboard,/api/functions,/api/pipeline/status");
}
