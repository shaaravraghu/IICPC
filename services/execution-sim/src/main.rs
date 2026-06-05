use axum::{routing::get, Router};
use std::net::SocketAddr;
use std::env;
use std::time::Instant;
use uuid::Uuid;
use serde_json::json;

use platform_types::{
    AssetScore, PipelineMessage, PipelinePayload, TradeHorizon,
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
    let port_str = env::var("PORT").unwrap_or_else(|_| "8084".to_string());
    let port: u16 = port_str.parse().unwrap_or(8084);

    tracing::info!("Starting execution-sim with brokers: {}", brokers);

    tokio::spawn(start_health_server(port));

    let db = DbClient::new(&database_url);
    let producer = KafkaProducer::new(&brokers);
    let consumer = KafkaConsumer::new(
        &brokers,
        "execution-sim-group",
        &[Topic::SentimentOut],
    );

    tracing::info!("execution-sim consumer started");

    loop {
        match consumer.consume().await {
            Ok((key, mut msg)) => {
                let start_time = Instant::now();
                tracing::info!("Received sentiment results for run: {}", msg.run_id);

                let client = match db.get_client().await {
                    Ok(c) => c,
                    Err(e) => {
                        tracing::error!("Failed to get DB client: {:?}", e);
                        continue;
                    }
                };

                if let PipelinePayload::SentimentResults { ranked } = msg.payload {
                    let mut execution_scored = Vec::new();

                    for mut asset_score in ranked {
                        let symbol = &asset_score.symbol;
                        let sentiment_score = asset_score.score; // Incoming score is sentiment score
                        let technical_score = asset_score.details["technical_score"].as_f64().unwrap_or(0.0);
                        let fundamental_score = asset_score.details["fundamental_score"].as_f64().unwrap_or(0.0);

                        let _historical = db.fetch_historical_prices(symbol).await.unwrap_or_default();

                        let seed = msg.run_id.len();
                        let sim_result = eval_algorithms::deterministic_execution_result(symbol, TradeHorizon::ShortTerm, seed);

                        asset_score.score = sim_result.score;
                        asset_score.layer = "execution".to_string();
                        asset_score.details = json!({
                            "technical": asset_score.details["technical"],
                            "technical_score": technical_score,
                            "fundamental": asset_score.details["fundamental"],
                            "fundamental_score": fundamental_score,
                            "sentiment": asset_score.details["sentiment"],
                            "sentiment_score": sentiment_score,
                            "execution": {
                                "pnl_pct": sim_result.pnl_pct,
                                "max_drawdown_pct": sim_result.max_drawdown_pct,
                                "hit_rate_pct": sim_result.hit_rate_pct,
                                "trade_count": sim_result.trade_count,
                                "score": sim_result.score
                            }
                        });

                        let asset_score_id = format!("{}:{}", msg.run_id, symbol);

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
                            Some(sim_result.score),
                            None,
                            None,
                            None,
                            None,
                        ).await {
                            tracing::error!("Failed to update asset score in DB: {:?}", e);
                        }

                        let bot_event_id = Uuid::new_v4().to_string();
                        if let Err(e) = db.log_bot_event(
                            &bot_event_id,
                            &msg.run_id,
                            "execution-sim-bot",
                            symbol,
                            symbol,
                            "execution-historical-simulation",
                            "execution",
                            "completed",
                            json!(sim_result),
                        ).await {
                            tracing::error!("Failed to log bot event: {:?}", e);
                        }

                        execution_scored.push(asset_score);
                    }

                    let avg_execution_score = if execution_scored.is_empty() {
                        0.0
                    } else {
                        execution_scored.iter().map(|a| a.score).sum::<f64>() / execution_scored.len() as f64
                    };

                    let latency_ms = start_time.elapsed().as_millis() as f64;
                    tracing::info!(
                        "Finished execution layer for run {}. Scored: {}. Latency: {}ms",
                        msg.run_id,
                        execution_scored.len(),
                        latency_ms
                    );

                    if let Err(e) = db.insert_telemetry_point(
                        &msg.run_id,
                        "execution",
                        "latency_ms",
                        latency_ms,
                    ).await {
                        tracing::error!("Failed to insert telemetry point: {:?}", e);
                    }

                    let total_assets_row = client.query_one("SELECT assets_total, technical_pass_count, fundamental_pass_count, sentiment_pass_count FROM test_runs_detailed WHERE test_run_id = $1", &[&msg.run_id]).await;
                    let (assets_total, tech_pass, fund_pass, sent_pass) = match total_assets_row {
                        Ok(r) => (r.get::<_, i32>(0), r.get::<_, i32>(1), r.get::<_, i32>(2), r.get::<_, i32>(3)),
                        Err(_) => (10, 10, 10, 10),
                    };

                    if let Err(e) = db.update_test_run_progress(
                        &msg.run_id,
                        "paper",
                        "running",
                        80, // execution layer sets progress to 80% (stage4)
                        assets_total,
                        assets_total,
                        tech_pass,
                        fund_pass,
                        sent_pass,
                    ).await {
                        tracing::error!("Failed to update detailed progress: {:?}", e);
                    }

                    if let Err(e) = client.execute(
                        "UPDATE test_runs_detailed SET execution_avg_score = $2 WHERE test_run_id = $1",
                        &[&msg.run_id, &(avg_execution_score as f32)],
                    ).await {
                        tracing::error!("Failed to update detailed execution average score: {:?}", e);
                    }

                    msg.payload = PipelinePayload::ExecutionResults {
                        scored: execution_scored,
                    };
                    msg.timestamp_ms = chrono::Utc::now().timestamp_millis();

                    if let Err(e) = producer.publish(Topic::ExecutionOut, &key, &msg).await {
                        tracing::error!("Failed to publish ExecutionResults to Kafka: {:?}", e);
                    }

                    let telemetry_msg = PipelineMessage {
                        run_id: msg.run_id.clone(),
                        submission_id: msg.submission_id.clone(),
                        timestamp_ms: chrono::Utc::now().timestamp_millis(),
                        payload: PipelinePayload::TelemetryEvent {
                            stage: "execution".to_string(),
                            metric: "latency_ms".to_string(),
                            value: latency_ms,
                        },
                    };
                    if let Err(e) = producer.publish(Topic::TelemetryMetrics, &key, &telemetry_msg).await {
                        tracing::error!("Failed to publish telemetry to Kafka: {:?}", e);
                    }
                } else {
                    tracing::warn!("Received unexpected payload on sentiment out topic: {:?}", msg.payload);
                }
            }
            Err(e) => {
                tracing::error!("Kafka consume error: {:?}", e);
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            }
        }
    }
}
