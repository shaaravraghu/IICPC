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

fn calculate_sentiment_dimension_score(symbol: &str, dim_name: &str) -> f64 {
    let mut hash = 0u64;
    for (i, c) in format!("{}:{}", symbol, dim_name).chars().enumerate() {
        hash = hash.wrapping_add((c as u64).wrapping_mul(i as u64 + 43));
    }
    let raw_val = (hash % 100) as f64 / 10.0 - 5.0;
    (raw_val * 100.0).round() / 100.0
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let brokers = env::var("KAFKA_BROKERS").unwrap_or_else(|_| "localhost:9092".to_string());
    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/postgres".to_string());
    let port_str = env::var("PORT").unwrap_or_else(|_| "8083".to_string());
    let port: u16 = port_str.parse().unwrap_or(8083);

    tracing::info!("Starting sentiment-agents with brokers: {}", brokers);

    tokio::spawn(start_health_server(port));

    let db = DbClient::new(&database_url);
    let producer = KafkaProducer::new(&brokers);
    let consumer = KafkaConsumer::new(
        &brokers,
        "sentiment-agents-group",
        &[Topic::FundamentalOut],
    );

    tracing::info!("sentiment-agents consumer started");

    loop {
        match consumer.consume().await {
            Ok((key, mut msg)) => {
                let start_time = Instant::now();
                tracing::info!("Received fundamental results for run: {}", msg.run_id);

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
                        tracing::error!("Failed to fetch submission: {:?}", e);
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

                if let PipelinePayload::FundamentalResults { passed, failed } = msg.payload {
                    let mut ranked_assets = Vec::new();

                    for mut asset_score in passed {
                        let symbol = &asset_score.symbol;
                        let fundamental_score = asset_score.score; // Incoming score is fundamental score
                        let technical_score = asset_score.details["technical_score"].as_f64().unwrap_or(0.0);
                        
                        let mut dim_results = Vec::new();
                        let mut weighted_sum = 0.0;

                        for dim in &strategy.sentiment_dimensions {
                            let dim_score = calculate_sentiment_dimension_score(symbol, &dim.name);
                            weighted_sum += (dim.weight_pct / 100.0) * dim_score;

                            dim_results.push(json!({
                                "dimension": dim.name,
                                "weight_pct": dim.weight_pct,
                                "raw_score": dim_score
                            }));

                            let bot_event_id = Uuid::new_v4().to_string();
                            if let Err(e) = db.log_bot_event(
                                &bot_event_id,
                                &msg.run_id,
                                &format!("sentiment-bot-{}", dim.name),
                                symbol,
                                symbol,
                                &dim.name,
                                "sentiment",
                                "completed",
                                json!({ "raw_score": dim_score, "weight_pct": dim.weight_pct }),
                            ).await {
                                tracing::error!("Failed to log bot event: {:?}", e);
                            }
                        }

                        let final_sentiment_score = eval_algorithms::signal_leaderboard_score(weighted_sum);

                        asset_score.score = final_sentiment_score;
                        asset_score.layer = "sentiment".to_string();
                        asset_score.details = json!({
                            "technical": asset_score.details["technical"],
                            "technical_score": technical_score,
                            "fundamental": asset_score.details["fundamental"],
                            "fundamental_score": fundamental_score,
                            "sentiment": dim_results,
                            "raw_weighted_sentiment": weighted_sum
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
                            Some(final_sentiment_score),
                            None,
                            None,
                            None,
                            None,
                            None,
                        ).await {
                            tracing::error!("Failed to update asset score in DB: {:?}", e);
                        }

                        ranked_assets.push(asset_score);
                    }

                    ranked_assets.sort_by(|a, b| {
                        b.score.partial_cmp(&a.score).unwrap_or(std::cmp::Ordering::Equal)
                    });

                    let avg_sentiment_score = if ranked_assets.is_empty() {
                        0.0
                    } else {
                        ranked_assets.iter().map(|a| a.score).sum::<f64>() / ranked_assets.len() as f64
                    };

                    let latency_ms = start_time.elapsed().as_millis() as f64;
                    tracing::info!(
                        "Finished sentiment layer for run {}. Scored: {}. Latency: {}ms",
                        msg.run_id,
                        ranked_assets.len(),
                        latency_ms
                    );

                    if let Err(e) = db.insert_telemetry_point(
                        &msg.run_id,
                        "sentiment",
                        "latency_ms",
                        latency_ms,
                    ).await {
                        tracing::error!("Failed to insert telemetry point: {:?}", e);
                    }

                    let total_assets_row = client.query_one("SELECT assets_total, technical_pass_count, fundamental_pass_count FROM test_runs_detailed WHERE test_run_id = $1", &[&msg.run_id]).await;
                    let (assets_total, tech_pass, fund_pass) = match total_assets_row {
                        Ok(r) => (r.get::<_, i32>(0), r.get::<_, i32>(1), r.get::<_, i32>(2)),
                        Err(_) => (10, 10, 10),
                    };

                    if let Err(e) = db.update_test_run_progress(
                        &msg.run_id,
                        "execution",
                        "running",
                        75,
                        assets_total,
                        assets_total,
                        tech_pass,
                        fund_pass,
                        ranked_assets.len() as i32,
                    ).await {
                        tracing::error!("Failed to update detailed progress: {:?}", e);
                    }

                    if let Err(e) = client.execute(
                        "UPDATE test_runs_detailed SET sentiment_avg_score = $2 WHERE test_run_id = $1",
                        &[&msg.run_id, &(avg_sentiment_score as f32)],
                    ).await {
                        tracing::error!("Failed to update detailed average score: {:?}", e);
                    }

                    msg.payload = PipelinePayload::SentimentResults {
                        ranked: ranked_assets,
                    };
                    msg.timestamp_ms = chrono::Utc::now().timestamp_millis();

                    if let Err(e) = producer.publish(Topic::SentimentOut, &key, &msg).await {
                        tracing::error!("Failed to publish SentimentResults to Kafka: {:?}", e);
                    }

                    let telemetry_msg = PipelineMessage {
                        run_id: msg.run_id.clone(),
                        submission_id: msg.submission_id.clone(),
                        timestamp_ms: chrono::Utc::now().timestamp_millis(),
                        payload: PipelinePayload::TelemetryEvent {
                            stage: "sentiment".to_string(),
                            metric: "latency_ms".to_string(),
                            value: latency_ms,
                        },
                    };
                    if let Err(e) = producer.publish(Topic::TelemetryMetrics, &key, &telemetry_msg).await {
                        tracing::error!("Failed to publish telemetry to Kafka: {:?}", e);
                    }
                } else {
                    tracing::warn!("Received unexpected payload on fundamental out topic: {:?}", msg.payload);
                }
            }
            Err(e) => {
                tracing::error!("Kafka consume error: {:?}", e);
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            }
        }
    }
}
