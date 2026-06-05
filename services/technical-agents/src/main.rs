use axum::{routing::get, Router};
use std::net::SocketAddr;
use std::env;
use std::time::Instant;
use uuid::Uuid;
use serde_json::json;

use platform_types::{
    AssetScore, PipelineMessage, PipelinePayload, StrategyManifest,
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

fn calculate_metric_score(symbol: &str, func_name: &str) -> f64 {
    let mut hash = 0u64;
    for (i, c) in format!("{}:{}", symbol, func_name).chars().enumerate() {
        hash = hash.wrapping_add((c as u64).wrapping_mul(i as u64 + 17));
    }
    let raw_val = 30.0 + (hash % 70) as f64;
    (raw_val * 100.0).round() / 100.0
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let brokers = env::var("KAFKA_BROKERS").unwrap_or_else(|_| "localhost:9092".to_string());
    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/postgres".to_string());
    let port_str = env::var("PORT").unwrap_or_else(|_| "8081".to_string());
    let port: u16 = port_str.parse().unwrap_or(8081);

    tracing::info!("Starting technical-agents with brokers: {}", brokers);

    tokio::spawn(start_health_server(port));

    let db = DbClient::new(&database_url);
    let producer = KafkaProducer::new(&brokers);
    let consumer = KafkaConsumer::new(
        &brokers,
        "technical-agents-group",
        &[Topic::Submissions],
    );

    tracing::info!("technical-agents consumer started");

    loop {
        match consumer.consume().await {
            Ok((key, mut msg)) => {
                let start_time = Instant::now();
                tracing::info!("Received submission for run: {}", msg.run_id);

                if let PipelinePayload::SubmissionCreated { strategy, assets } = msg.payload {
                    if let Err(e) = db.update_test_run_progress(
                        &msg.run_id,
                        "technical",
                        "running",
                        10,
                        assets.len() as i32,
                        0,
                        0,
                        0,
                        0,
                    ).await {
                        tracing::error!("Failed to update run progress in DB: {:?}", e);
                    }

                    let mut passed_assets = Vec::new();
                    let mut failed_assets = Vec::new();

                    for symbol in &assets {
                        let mut group_scores = Vec::new();
                        let mut all_groups_pass = true;

                        for group in &strategy.technical_groups {
                            let mut call_results = Vec::new();
                            let mut passed_calls_count = 0;

                            for call in &group.calls {
                                let score = calculate_metric_score(symbol, &call.name);
                                let threshold = 50.0;
                                let pass = score >= threshold;
                                if pass {
                                    passed_calls_count += 1;
                                }

                                call_results.push(json!({
                                    "metric": call.name,
                                    "score": score,
                                    "threshold": threshold,
                                    "pass": pass
                                }));
                            }

                            let group_score = if group.calls.is_empty() {
                                0.0
                            } else {
                                (passed_calls_count as f64 / group.calls.len() as f64) * 100.0
                            };

                            let group_pass = group_score >= group.pass_threshold;
                            if !group_pass {
                                all_groups_pass = false;
                            }

                            group_scores.push(json!({
                                "group_id": group.id,
                                "score": group_score,
                                "pass_threshold": group.pass_threshold,
                                "passed": group_pass,
                                "calls": call_results
                            }));

                            let bot_event_id = Uuid::new_v4().to_string();
                            if let Err(e) = db.log_bot_event(
                                &bot_event_id,
                                &msg.run_id,
                                &format!("technical-bot-{}", group.id),
                                symbol,
                                symbol,
                                &group.id,
                                "technical",
                                if group_pass { "pass" } else { "fail" },
                                json!({ "score": group_score, "calls": call_results }),
                            ).await {
                                tracing::error!("Failed to log bot event: {:?}", e);
                            }
                        }

                        let final_technical_score = if group_scores.is_empty() {
                            0.0
                        } else {
                            group_scores.iter()
                                .map(|g| g["score"].as_f64().unwrap_or(0.0))
                                .sum::<f64>() / group_scores.len() as f64
                        };

                        let asset_score = AssetScore {
                            symbol: symbol.clone(),
                            score: final_technical_score,
                            passed: all_groups_pass,
                            layer: "technical".to_string(),
                            details: json!(group_scores),
                        };

                        let asset_score_id = format!("{}:{}", msg.run_id, symbol);

                        if let Err(e) = db.create_or_update_asset_score(
                            &asset_score_id,
                            symbol,
                            symbol,
                            &msg.run_id,
                            if all_groups_pass { 1 } else { 0 },
                            Some(final_technical_score),
                            0,
                            None,
                            None,
                            None,
                            None,
                            None,
                            if all_groups_pass { None } else { Some("technical") },
                            if all_groups_pass { None } else { Some("Technical validation did not meet pass threshold") },
                        ).await {
                            tracing::error!("Failed to create asset score in DB: {:?}", e);
                        }

                        if all_groups_pass {
                            passed_assets.push(asset_score);
                        } else {
                            failed_assets.push(asset_score);
                        }
                    }

                    let latency_ms = start_time.elapsed().as_millis() as f64;
                    tracing::info!(
                        "Finished technical layer for run {}. Passed: {}, Failed: {}. Latency: {}ms",
                        msg.run_id,
                        passed_assets.len(),
                        failed_assets.len(),
                        latency_ms
                    );

                    if let Err(e) = db.insert_telemetry_point(
                        &msg.run_id,
                        "technical",
                        "latency_ms",
                        latency_ms,
                    ).await {
                        tracing::error!("Failed to insert telemetry point: {:?}", e);
                    }

                    if let Err(e) = db.update_test_run_progress(
                        &msg.run_id,
                        "fundamental",
                        "running",
                        35,
                        assets.len() as i32,
                        assets.len() as i32,
                        passed_assets.len() as i32,
                        0,
                        0,
                    ).await {
                        tracing::error!("Failed to update detailed progress: {:?}", e);
                    }

                    msg.payload = PipelinePayload::TechnicalResults {
                        passed: passed_assets,
                        failed: failed_assets,
                    };
                    msg.timestamp_ms = chrono::Utc::now().timestamp_millis();

                    if let Err(e) = producer.publish(Topic::TechnicalOut, &key, &msg).await {
                        tracing::error!("Failed to publish TechnicalResults to Kafka: {:?}", e);
                    }

                    let telemetry_msg = PipelineMessage {
                        run_id: msg.run_id.clone(),
                        submission_id: msg.submission_id.clone(),
                        timestamp_ms: chrono::Utc::now().timestamp_millis(),
                        payload: PipelinePayload::TelemetryEvent {
                            stage: "technical".to_string(),
                            metric: "latency_ms".to_string(),
                            value: latency_ms,
                        },
                    };
                    if let Err(e) = producer.publish(Topic::TelemetryMetrics, &key, &telemetry_msg).await {
                        tracing::error!("Failed to publish telemetry to Kafka: {:?}", e);
                    }
                } else {
                    tracing::warn!("Received unexpected payload on submissions topic: {:?}", msg.payload);
                }
            }
            Err(e) => {
                tracing::error!("Kafka consume error: {:?}", e);
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            }
        }
    }
}
