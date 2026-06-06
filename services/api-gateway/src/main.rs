use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Path, Query, State,
    },
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use db_client::DbClient;
use kafka_utils::{KafkaProducer, Topic};
use platform_types::{LeaderboardRow, PipelineMessage, StrategyManifest};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{env, net::SocketAddr};
use strategy_parser::{starter_strategy, validate_strategy};
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;

#[derive(Clone)]
struct AppState {
    db: DbClient,
    producer: KafkaProducer,
    default_assets: Vec<String>,
}

type ApiError = (StatusCode, Json<Value>);
type ApiResult<T> = Result<Json<T>, ApiError>;

#[derive(Debug, Deserialize)]
struct SubmissionRequest {
    submission_id: Option<String>,
    run_id: Option<String>,
    user_id: Option<String>,
    username: Option<String>,
    team_name: Option<String>,
    filename: Option<String>,
    strategy_yaml: Option<String>,
    code: Option<String>,
    assets: Option<Vec<String>>,
}

#[derive(Debug, Serialize)]
struct SubmissionResponse {
    submission_id: String,
    run_id: String,
    strategy_id: String,
    owner: String,
    status: String,
    assets: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct PipelineStatusQuery {
    run_id: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let brokers = env::var("KAFKA_BROKERS").unwrap_or_else(|_| "localhost:9092".to_string());
    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/postgres".to_string());
    let port = env::var("PORT")
        .ok()
        .and_then(|value| value.parse::<u16>().ok())
        .unwrap_or(8080);
    let default_assets = env::var("DEFAULT_ASSETS")
        .unwrap_or_else(|_| "AAPL,MSFT,NVDA,AMZN,GOOGL,META,TSLA,AMD,AVGO,JPM".to_string())
        .split(',')
        .map(str::trim)
        .filter(|symbol| !symbol.is_empty())
        .map(ToOwned::to_owned)
        .collect::<Vec<_>>();

    let state = AppState {
        db: DbClient::new(&database_url),
        producer: KafkaProducer::new(&brokers),
        default_assets,
    };

    let app = Router::new()
        .route("/healthz", get(healthz))
        .route("/api/healthz", get(healthz))
        .route("/api/submissions", post(create_submission))
        .route("/api/leaderboard", get(leaderboard))
        .route("/api/functions", get(function_catalog))
        .route("/api/pipeline/status", get(pipeline_status))
        .route("/ws/leaderboard", get(ws_leaderboard))
        .route("/ws/pipeline/{run_id}", get(ws_pipeline))
        .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind api-gateway");
    tracing::info!("api-gateway listening on {}", addr);
    axum::serve(listener, app).await.expect("api-gateway stopped");
}

async fn healthz() -> &'static str {
    "OK"
}

async fn create_submission(
    State(state): State<AppState>,
    Json(request): Json<SubmissionRequest>,
) -> ApiResult<SubmissionResponse> {
    let yaml = request
        .strategy_yaml
        .or(request.code)
        .unwrap_or_else(|| serde_yaml::to_string(&starter_strategy("demo-team")).unwrap());
    let strategy = serde_yaml::from_str::<StrategyManifest>(&yaml)
        .map_err(|error| api_error(StatusCode::BAD_REQUEST, "invalid_strategy_yaml", error))?;
    validate_strategy(&strategy)
        .map_err(|error| api_error(StatusCode::BAD_REQUEST, "invalid_strategy", format!("{error:?}")))?;

    let submission_id = request
        .submission_id
        .unwrap_or_else(|| Uuid::new_v4().to_string());
    let run_id = request.run_id.unwrap_or_else(|| Uuid::new_v4().to_string());
    let username = request.username.unwrap_or_else(|| strategy.owner.clone());
    let user_id = request.user_id.unwrap_or_else(|| username.clone());
    let filename = request
        .filename
        .unwrap_or_else(|| format!("{}.yaml", strategy.id));
    let assets = request.assets.unwrap_or_else(|| state.default_assets.clone());

    state
        .db
        .create_submission(
            &submission_id,
            &user_id,
            &username,
            request.team_name.as_deref(),
            "yaml",
            &filename,
            &yaml,
        )
        .await
        .map_err(|error| api_error(StatusCode::INTERNAL_SERVER_ERROR, "db_submission_insert", error))?;

    state
        .db
        .create_test_run(&run_id, &submission_id)
        .await
        .map_err(|error| api_error(StatusCode::INTERNAL_SERVER_ERROR, "db_test_run_insert", error))?;

    let message = PipelineMessage {
        run_id: run_id.clone(),
        submission_id: submission_id.clone(),
        timestamp_ms: chrono::Utc::now().timestamp_millis(),
        payload: platform_types::PipelinePayload::SubmissionCreated {
            strategy: strategy.clone(),
            assets: assets.clone(),
        },
    };

    state
        .producer
        .publish(Topic::Submissions, &run_id, &message)
        .await
        .map_err(|error| api_error(StatusCode::BAD_GATEWAY, "kafka_publish", error))?;

    Ok(Json(SubmissionResponse {
        submission_id,
        run_id,
        strategy_id: strategy.id,
        owner: strategy.owner,
        status: "queued".to_string(),
        assets,
    }))
}

async fn leaderboard(State(state): State<AppState>) -> ApiResult<Vec<LeaderboardRow>> {
    let rows = state
        .db
        .fetch_leaderboard()
        .await
        .map_err(|error| api_error(StatusCode::INTERNAL_SERVER_ERROR, "db_leaderboard", error))?;

    Ok(Json(
        rows.into_iter()
            .enumerate()
            .map(|(index, (_run_id, strategy_id, owner, signal, execution, paper, composite))| {
                LeaderboardRow {
                    rank: index + 1,
                    strategy_id,
                    owner,
                    signal_score: signal,
                    execution_score: execution,
                    paper_trading_score: paper,
                    composite_score: composite,
                }
            })
            .collect(),
    ))
}

async fn function_catalog() -> Json<Value> {
    Json(json!({
        "technical": eval_algorithms::technical_metric_catalog(),
        "fundamental": eval_algorithms::fundamental_metric_catalog(),
        "sentiment": eval_algorithms::sentiment_metric_catalog(),
    }))
}

async fn pipeline_status(
    State(state): State<AppState>,
    Query(query): Query<PipelineStatusQuery>,
) -> ApiResult<Value> {
    pipeline_status_value(&state, &query.run_id).await.map(Json)
}

async fn pipeline_status_value(state: &AppState, run_id: &str) -> Result<Value, ApiError> {
    let client = state
        .db
        .get_client()
        .await
        .map_err(|error| api_error(StatusCode::INTERNAL_SERVER_ERROR, "db_pool", error))?;

    let run = client
        .query_one(
            "SELECT status, current_stage, progress_pct FROM test_runs WHERE id = $1",
            &[&run_id],
        )
        .await
        .map_err(|error| api_error(StatusCode::NOT_FOUND, "run_not_found", error))?;

    let detailed = client
        .query_opt(
            "SELECT current_layer, assets_total, assets_analyzed, technical_pass_count,
                    fundamental_pass_count, sentiment_pass_count, sentiment_avg_score,
                    execution_avg_score, paper_avg_score
             FROM test_runs_detailed WHERE test_run_id = $1",
            &[&run_id],
        )
        .await
        .map_err(|error| api_error(StatusCode::INTERNAL_SERVER_ERROR, "db_pipeline_detail", error))?;

    let status: String = run.get(0);
    let current_stage: Option<String> = run.get(1);
    let progress_pct: Option<i32> = run.get(2);

    let detail = detailed.map(|row| {
        json!({
            "current_layer": row.get::<_, String>(0),
            "assets_total": row.get::<_, i32>(1),
            "assets_analyzed": row.get::<_, i32>(2),
            "technical_pass_count": row.get::<_, i32>(3),
            "fundamental_pass_count": row.get::<_, i32>(4),
            "sentiment_pass_count": row.get::<_, i32>(5),
            "sentiment_avg_score": row.get::<_, Option<f32>>(6),
            "execution_avg_score": row.get::<_, Option<f32>>(7),
            "paper_avg_score": row.get::<_, Option<f32>>(8),
        })
    });

    Ok(json!({
        "run_id": run_id,
        "status": status,
        "current_stage": current_stage,
        "progress_pct": progress_pct,
        "detail": detail,
    }))
}

async fn ws_leaderboard(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| websocket_leaderboard_snapshot(socket, state))
}

async fn ws_pipeline(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
    Path(run_id): Path<String>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| websocket_pipeline_snapshot(socket, state, run_id))
}

async fn websocket_leaderboard_snapshot(mut socket: WebSocket, state: AppState) {
    let payload = match state.db.fetch_leaderboard().await {
        Ok(rows) => json!({
            "type": "leaderboard_snapshot",
            "rows": rows.into_iter().enumerate().map(
                |(index, (_run_id, strategy_id, owner, signal, execution, paper, composite))| LeaderboardRow {
                    rank: index + 1,
                    strategy_id,
                    owner,
                    signal_score: signal,
                    execution_score: execution,
                    paper_trading_score: paper,
                    composite_score: composite,
                }
            ).collect::<Vec<_>>()
        }),
        Err(error) => json!({ "type": "error", "code": "db_leaderboard", "message": error }),
    };

    let _ = socket.send(Message::Text(payload.to_string())).await;
    while socket.recv().await.is_some() {}
}

async fn websocket_pipeline_snapshot(mut socket: WebSocket, state: AppState, run_id: String) {
    let payload = match pipeline_status_value(&state, &run_id).await {
        Ok(status) => json!({ "type": "pipeline_snapshot", "status": status }),
        Err((_status, Json(error))) => json!({ "type": "error", "error": error }),
    };

    let _ = socket.send(Message::Text(payload.to_string())).await;
    while socket.recv().await.is_some() {}
}

fn api_error(status: StatusCode, code: &str, message: impl ToString) -> ApiError {
    (
        status,
        Json(json!({
            "error": code,
            "message": message.to_string(),
        })),
    )
}
