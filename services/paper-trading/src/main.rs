use axum::{routing::get, Router};
use std::net::SocketAddr;
use std::env;
use std::time::Instant;
use uuid::Uuid;
use serde_json::json;

use platform_types::{
    AssetScore, PipelineMessage, PipelinePayload,
};
use kafka_utils::{KafkaConsumer, KafkaProducer, Topic};
use db_client::DbClient;

async fn healthz() -> &'static str {
    "OK"
}

async fn start_health_server(port: u16) {
    let app = Router::new().route("/healthz", get(healthz));
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    tracing::info!("Health check server listening on {}", addr);
    axum::serve(listener, app).await.unwrap();
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let brokers = env::var("KAFKA_BROKERS").unwrap_or_else(|_| "localhost:9092".to_string());
    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/postgres".to_string());
    let port_str = env::var("PORT").unwrap_or_else(|_| "8085".to_string());
    let port: u16 = port_str.parse().unwrap_or(8085);

    tracing::info!("Starting paper-trading with brokers: {}", brokers);

    tokio::spawn(start_health_server(port));

    let db = DbClient::new(&database_url);
    let producer = KafkaProducer::new(&brokers);
    let consumer = KafkaConsumer::new(
        &brokers,
        "paper-trading-group",
        &[Topic::ExecutionOut],
    );

    tracing::info!("paper-trading consumer started");

    loop {
        match consumer.consume().await {
            Ok((key, mut msg)) => {
                let start_time = Instant::now();
                tracing::info!("Received execution results for run: {}", msg.run_id);

                let client = match db.get_client().await {
                    Ok(c) => c,
                    Err(e) => {
                        tracing::error!("Failed to get DB client: {:?}", e);
                        continue;
                    }
                };

                if let PipelinePayload::ExecutionResults { scored } = msg.payload {
                    let mut paper_scored = Vec::new();

                    for mut asset_score in scored {
                        let symbol = &asset_score.symbol;
                        let execution_score = asset_score.score; // Incoming score is execution score
                        let technical_score = asset_score.details["technical_score"].as_f64().unwrap_or(0.0);
                        let fundamental_score = asset_score.details["fundamental_score"].as_f64().unwrap_or(0.0);
                        let sentiment_score = asset_score.details["sentiment_score"].as_f64().unwrap_or(0.0);

                        let seed = msg.run_id.len();
                        let timeline = "forward-10d";
                        let sim_result = eval_algorithms::deterministic_paper_result(symbol, timeline, seed);

                        asset_score.score = sim_result.risk_adjusted_score;
                        asset_score.layer = "paper".to_string();
                        asset_score.details = json!({
                            "technical": asset_score.details["technical"],
                            "technical_score": technical_score,
                            "fundamental": asset_score.details["fundamental"],
                            "fundamental_score": fundamental_score,
                            "sentiment": asset_score.details["sentiment"],
                            "sentiment_score": sentiment_score,
                            "execution": asset_score.details["execution"],
                            "execution_score": execution_score,
                            "paper": {
                                "pnl_pct": sim_result.pnl_pct,
                                "timeline": sim_result.timeline,
                                "risk_adjusted_score": sim_result.risk_adjusted_score
                            }
                        });

                        let asset_score_id = format!("{}:{}", msg.run_id, symbol);

                        // Save asset score to database
                        if let Err(e) = db.create_or_update_asset_score(
                            &asset_score_id,
                            symbol,
                            symbol,
                            &msg.run_id,
                            1,
                            Some(technical_score),
                            1,
                            Some(fundamental_score),
                            Some(sentiment_score),
                            Some(execution_score),
                            Some(sim_result.risk_adjusted_score),
                            None,
                            None,
                            None,
                        ).await {
                            tracing::error!("Failed to update asset score in DB: {:?}", e);
                        }

                        // Create and close a paper trade position in the DB for logging
                        let position_id = Uuid::new_v4().to_string();
                        let now = chrono::Utc::now();
                        let entry_price = 100.0;
                        let exit_price = entry_price * (1.0 + sim_result.pnl_pct / 100.0);
                        
                        if let Err(e) = db.create_paper_trade_position(
                            &position_id,
                            &msg.run_id,
                            symbol,
                            "long",
                            100.0,
                            entry_price as f32,
                            now - chrono::Duration::days(1),
                        ).await {
                            tracing::error!("Failed to log paper trade position: {:?}", e);
                        }

                        if let Err(e) = db.close_paper_trade_position(
                            &position_id,
                            exit_price as f32,
                            now,
                            (exit_price - entry_price) as f32 * 100.0,
                            sim_result.pnl_pct as f32,
                        ).await {
                            tracing::error!("Failed to close paper trade position: {:?}", e);
                        }

                        // Log bot event for paper trading
                        let bot_event_id = Uuid::new_v4().to_string();
                        if let Err(e) = db.log_bot_event(
                            &bot_event_id,
                            &msg.run_id,
                            "paper-trading-bot",
                            symbol,
                            symbol,
                            "paper-forward-simulation",
                            "paper",
                            "completed",
                            json!(sim_result),
                        ).await {
                            tracing::error!("Failed to log bot event: {:?}", e);
                        }

                        paper_scored.push(asset_score);
                    }

                    let avg_paper_score = if paper_scored.is_empty() {
                        0.0
                    } else {
                        paper_scored.iter().map(|a| a.score).sum::<f64>() / paper_scored.len() as f64
                    };

                    let latency_ms = start_time.elapsed().as_millis() as f64;
                    tracing::info!(
                        "Finished paper trading layer for run {}. Scored: {}. Latency: {}ms",
                        msg.run_id,
                        paper_scored.len(),
                        latency_ms
                    );

                    if let Err(e) = db.insert_telemetry_point(
                        &msg.run_id,
                        "paper",
                        "latency_ms",
                        latency_ms,
                    ).await {
                        tracing::error!("Failed to insert telemetry point: {:?}", e);
                    }

                    let total_assets_row = client.query_one("SELECT assets_total, technical_pass_count, fundamental_pass_count, sentiment_pass_count, execution_avg_score FROM test_runs_detailed WHERE test_run_id = $1", &[&msg.run_id]).await;
                    let (assets_total, tech_pass, fund_pass, sent_pass) = match total_assets_row {
                        Ok(r) => (r.get::<_, i32>(0), r.get::<_, i32>(1), r.get::<_, i32>(2), r.get::<_, i32>(3)),
                        Err(_) => (10, 10, 10, 10),
                    };

                    if let Err(e) = db.update_test_run_progress(
                        &msg.run_id,
                        "judge",
                        "running",
                        98,
                        assets_total,
                        assets_total,
                        tech_pass,
                        fund_pass,
                        sent_pass,
                    ).await {
                        tracing::error!("Failed to update detailed progress: {:?}", e);
                    }

                    if let Err(e) = client.execute(
                        "UPDATE test_runs_detailed SET paper_avg_score = $2 WHERE test_run_id = $1",
                        &[&msg.run_id, &(avg_paper_score as f32)],
                    ).await {
                        tracing::error!("Failed to update detailed paper average score: {:?}", e);
                    }

                    msg.payload = PipelinePayload::PaperTradingResults {
                        scored: paper_scored,
                    };
                    msg.timestamp_ms = chrono::Utc::now().timestamp_millis();

                    if let Err(e) = producer.publish(Topic::PaperTradingOut, &key, &msg).await {
                        tracing::error!("Failed to publish PaperTradingResults to Kafka: {:?}", e);
                    }

                    let telemetry_msg = PipelineMessage {
                        run_id: msg.run_id.clone(),
                        submission_id: msg.submission_id.clone(),
                        timestamp_ms: chrono::Utc::now().timestamp_millis(),
                        payload: PipelinePayload::TelemetryEvent {
                            stage: "paper".to_string(),
                            metric: "latency_ms".to_string(),
                            value: latency_ms,
                        },
                    };
                    if let Err(e) = producer.publish(Topic::TelemetryMetrics, &key, &telemetry_msg).await {
                        tracing::error!("Failed to publish telemetry to Kafka: {:?}", e);
                    }
                } else {
                    tracing::warn!("Received unexpected payload on execution out topic: {:?}", msg.payload);
                }
            }
            Err(e) => {
                tracing::error!("Kafka consume error: {:?}", e);
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            }
        }
    }
}
