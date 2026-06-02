use eval_algorithms::{free_cash_flow_margin, return_on_invested_capital};
use platform_types::{Asset, MetricSignal};

fn main() {
    let roic = return_on_invested_capital(18.0, 120.0);
    let fcf_margin = free_cash_flow_margin(24.0, 180.0);
    let score = (roic * 3.0) + (fcf_margin * 4.0);
    let signal = MetricSignal {
        asset: Asset {
            symbol: "IICPC".to_string(),
            name: "IICPC Demo Asset".to_string(),
            sector: "Technology".to_string(),
        },
        group_id: "quality-compounders".to_string(),
        score,
        passed: score >= 60.0,
        reasons: vec![format!("roic={roic:.2}%"), format!("fcf_margin={fcf_margin:.2}%")],
    };

    println!("fundamental-agents ready");
    println!("group={} symbol={} passed={} score={:.2}", signal.group_id, signal.asset.symbol, signal.passed, signal.score);
}
