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

fn calculate_metric_score(symbol: &str, func_name: &str) -> f64 {
    let mut hash = 0u64;
    for (i, c) in format!("{}:{}", symbol, func_name).chars().enumerate() {
        hash = hash.wrapping_add((c as u64).wrapping_mul(i as u64 + 31));
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
    let port_str = env::var("PORT").unwrap_or_else(|_| "8082".to_string());
    let port: u16 = port_str.parse().unwrap_or(8082);

    tracing::info!("Starting fundamental-agents with brokers: {}", brokers);

    tokio::spawn(start_health_server(port));

    let db = DbClient::new(&database_url);
    let producer = KafkaProducer::new(&brokers);
    let consumer = KafkaConsumer::new(
        &brokers,
        "fundamental-agents-group",
        &[Topic::TechnicalOut],
    );

    tracing::info!("fundamental-agents consumer started");

    loop {
        match consumer.consume().await {
            Ok((key, mut msg)) => {
                let start_time = Instant::now();
                tracing::info!("Received technical results for run: {}", msg.run_id);

                let client = match db.get_client().await {
                    Ok(c) => c,
                    Err(e) => {
                        tracing::error!("Failed to get DB client: {:?}", e);
                        continue;
                    }
                };

                let row = match client.query_one("SELECT code FROM submissions WHERE id = $1", &[&msg.submission_id]).await {
                    Ok(r) => r,
                    Err(e) => {
                        tracing::error!("Failed to fetch submission from DB: {:?}", e);
                        continue;
                    }
                };
                let code_str: String = row.get(0);
                
                let strategy = match serde_yaml::from_str::<platform_types::StrategyManifest>(&code_str) {
                    Ok(strat) => strat,
                    Err(_) => {
                        strategy_parser::starter_strategy("fallback-user")
                    }
                };

                if let PipelinePayload::TechnicalResults { passed, mut failed } = msg.payload {
                    let mut passed_fundamental = Vec::new();
                    let mut failed_fundamental = Vec::new();

                    for mut asset_score in passed {
                        let symbol = &asset_score.symbol;
                        let technical_score = asset_score.score; // The incoming score is the technical score
                        let mut group_scores = Vec::new();
                        let mut all_groups_pass = true;

                        for group in &strategy.fundamental_groups {
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
                                &format!("fundamental-bot-{}", group.id),
                                symbol,
                                symbol,
                                &group.id,
                                "fundamental",
                                if group_pass { "pass" } else { "fail" },
                                json!({ "score": group_score, "calls": call_results }),
                            ).await {
                                tracing::error!("Failed to log bot event: {:?}", e);
                            }
                        }

                        let final_fundamental_score = if group_scores.is_empty() {
                            0.0
                        } else {
                            group_scores.iter()
                                .map(|g| g["score"].as_f64().unwrap_or(0.0))
                                .sum::<f64>() / group_scores.len() as f64
                        };

                        asset_score.score = final_fundamental_score;
                        asset_score.layer = "fundamental".to_string();
                        asset_score.details = json!({
                            "technical": asset_score.details,
                            "technical_score": technical_score,
                            "fundamental": group_scores
                        });

                        let asset_score_id = format!("{}:{}", msg.run_id, symbol);

                        if let Err(e) = db.create_or_update_asset_score(
                            &asset_score_id,
                            symbol,
                            symbol,
                            &msg.run_id,
                            1,
                            Some(technical_score),
                            if all_groups_pass { 1 } else { 0 },
                            Some(final_fundamental_score),
                            None,
                            None,
                            None,
                            None,
                            if all_groups_pass { None } else { Some("fundamental") },
                            if all_groups_pass { None } else { Some("Fundamental validation did not meet pass threshold") },
                        ).await {
                            tracing::error!("Failed to update asset score in DB: {:?}", e);
                        }

                        if all_groups_pass {
                            asset_score.passed = true;
                            passed_fundamental.push(asset_score);
                        } else {
                            asset_score.passed = false;
                            failed_fundamental.push(asset_score);
                        }
                    }

                    for asset in failed_fundamental {
                        failed.push(asset);
                    }

                    let latency_ms = start_time.elapsed().as_millis() as f64;
                    tracing::info!(
                        "Finished fundamental layer for run {}. Passed: {}, Total Failed: {}. Latency: {}ms",
                        msg.run_id,
                        passed_fundamental.len(),
                        failed.len(),
                        latency_ms
                    );

                    if let Err(e) = db.insert_telemetry_point(
                        &msg.run_id,
                        "fundamental",
                        "latency_ms",
                        latency_ms,
                    ).await {
                        tracing::error!("Failed to insert telemetry point: {:?}", e);
                    }

                    let total_assets_row = client.query_one("SELECT assets_total, technical_pass_count FROM test_runs_detailed WHERE test_run_id = $1", &[&msg.run_id]).await;
                    let (assets_total, tech_pass) = match total_assets_row {
                        Ok(r) => (r.get::<_, i32>(0), r.get::<_, i32>(1)),
                        Err(_) => (10, 10),
                    };

                    if let Err(e) = db.update_test_run_progress(
                        &msg.run_id,
                        "sentiment",
                        "running",
                        55,
                        assets_total,
                        assets_total,
                        tech_pass,
                        passed_fundamental.len() as i32,
                        0,
                    ).await {
                        tracing::error!("Failed to update detailed progress: {:?}", e);
                    }

                    msg.payload = PipelinePayload::FundamentalResults {
                        passed: passed_fundamental,
                        failed,
                    };
                    msg.timestamp_ms = chrono::Utc::now().timestamp_millis();

                    if let Err(e) = producer.publish(Topic::FundamentalOut, &key, &msg).await {
                        tracing::error!("Failed to publish FundamentalResults to Kafka: {:?}", e);
                    }

                    let telemetry_msg = PipelineMessage {
                        run_id: msg.run_id.clone(),
                        submission_id: msg.submission_id.clone(),
                        timestamp_ms: chrono::Utc::now().timestamp_millis(),
                        payload: PipelinePayload::TelemetryEvent {
                            stage: "fundamental".to_string(),
                            metric: "latency_ms".to_string(),
                            value: latency_ms,
                        },
                    };
                    if let Err(e) = producer.publish(Topic::TelemetryMetrics, &key, &telemetry_msg).await {
                        tracing::error!("Failed to publish telemetry to Kafka: {:?}", e);
                    }
                } else {
                    tracing::warn!("Received unexpected payload on technical out topic: {:?}", msg.payload);
                }
            }
            Err(e) => {
                tracing::error!("Kafka consume error: {:?}", e);
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            }
        }
    }
}
