use deadpool_postgres::{Config, ManagerConfig, Pool, RecyclingMethod, Runtime};
use tokio_postgres::NoTls;
use chrono::{DateTime, Utc};
use serde_json::Value;

pub struct DbClient {
    pool: Pool,
}

impl DbClient {
    pub fn new(database_url: &str) -> Self {
        let mut cfg = Config::new();
        cfg.url = Some(database_url.to_string());
        cfg.manager = Some(ManagerConfig {
            recycling_method: RecyclingMethod::Fast,
        });
        
        let pool = cfg
            .create_pool(Some(Runtime::Tokio1), NoTls)
            .expect("Failed to create postgres pool");
            
        Self { pool }
    }

    pub async fn get_client(&self) -> Result<deadpool_postgres::Client, String> {
        self.pool.get().await.map_err(|e| e.to_string())
    }

    // --- SUBMISSIONS & TEST RUNS ---

    pub async fn create_submission(
        &self,
        id: &str,
        user_id: &str,
        username: &str,
        team_name: Option<&str>,
        language: &str,
        filename: &str,
        code: &str,
    ) -> Result<(), String> {
        let client = self.get_client().await?;
        
        client
            .execute(
                "INSERT INTO submissions (id, user_id, username, team_name, language, filename, code, status, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', now())
                 ON CONFLICT (id) DO NOTHING",
                &[&id, &user_id, &username, &team_name, &language, &filename, &code],
            )
            .await
            .map_err(|e| e.to_string())?;
        Ok(())
    }

    pub async fn create_test_run(
        &self,
        run_id: &str,
        submission_id: &str,
    ) -> Result<(), String> {
        let client = self.get_client().await?;
        
        client
            .execute(
                "INSERT INTO test_runs (id, submission_id, status, current_stage, progress_pct, started_at)
                 VALUES ($1, $2, 'running', 'queued', 0, now())
                 ON CONFLICT (id) DO NOTHING",
                &[&run_id, &submission_id],
            )
            .await
            .map_err(|e| e.to_string())?;

        client
            .execute(
                "INSERT INTO test_runs_detailed (id, test_run_id, submission_id, current_layer, status, progress_pct, started_at, updated_at)
                 VALUES ($1, $1, $2, 'queued', 'running', 0, now(), now())
                 ON CONFLICT (id) DO NOTHING",
                &[&run_id, &submission_id],
            )
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    pub async fn update_test_run_progress(
        &self,
        run_id: &str,
        layer: &str,
        status: &str,
        progress_pct: i32,
        assets_total: i32,
        assets_analyzed: i32,
        tech_pass: i32,
        fund_pass: i32,
        sent_pass: i32,
    ) -> Result<(), String> {
        let client = self.get_client().await?;

        client
            .execute(
                "UPDATE test_runs 
                 SET status = $2, current_stage = $3, progress_pct = $4, completed_at = CASE WHEN $2 = 'completed' OR $2 = 'failed' THEN now() ELSE completed_at END
                 WHERE id = $1",
                &[&run_id, &status, &layer, &progress_pct],
            )
            .await
            .map_err(|e| e.to_string())?;

        client
            .execute(
                "UPDATE test_runs_detailed
                 SET current_layer = $2, status = $3, progress_pct = $4,
                     assets_total = $5, assets_analyzed = $6,
                     technical_pass_count = $7, fundamental_pass_count = $8, sentiment_pass_count = $9,
                     updated_at = now(), completed_at = CASE WHEN $3 = 'completed' OR $3 = 'failed' THEN now() ELSE completed_at END
                 WHERE test_run_id = $1",
                &[
                    &run_id,
                    &layer,
                    &status,
                    &progress_pct,
                    &assets_total,
                    &assets_analyzed,
                    &tech_pass,
                    &fund_pass,
                    &sent_pass,
                ],
            )
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    // --- ASSET SCORES ---

    pub async fn create_or_update_asset_score(
        &self,
        id: &str,
        asset_id: &str,
        symbol: &str,
        test_run_id: &str,
        technical_pass: i32,
        technical_score: Option<f64>,
        fundamental_pass: i32,
        fundamental_score: Option<f64>,
        sentiment_score: Option<f64>,
        execution_score: Option<f64>,
        paper_score: Option<f64>,
        composite_score: Option<f64>,
        rejected_at_layer: Option<&str>,
        rejection_reason: Option<&str>,
    ) -> Result<(), String> {
        let client = self.get_client().await?;

        client
            .execute(
                "INSERT INTO asset_scores (
                    id, asset_id, symbol, test_run_id,
                    technical_pass, technical_score,
                    fundamental_pass, fundamental_score,
                    sentiment_score, execution_score, paper_score,
                    composite_score, rejected_at_layer, rejection_reason,
                    created_at, updated_at
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now(), now())
                 ON CONFLICT (id) DO UPDATE SET
                    technical_pass = EXCLUDED.technical_pass,
                    technical_score = COALESCE(EXCLUDED.technical_score, asset_scores.technical_score),
                    fundamental_pass = EXCLUDED.fundamental_pass,
                    fundamental_score = COALESCE(EXCLUDED.fundamental_score, asset_scores.fundamental_score),
                    sentiment_score = COALESCE(EXCLUDED.sentiment_score, asset_scores.sentiment_score),
                    execution_score = COALESCE(EXCLUDED.execution_score, asset_scores.execution_score),
                    paper_score = COALESCE(EXCLUDED.paper_score, asset_scores.paper_score),
                    composite_score = COALESCE(EXCLUDED.composite_score, asset_scores.composite_score),
                    rejected_at_layer = COALESCE(EXCLUDED.rejected_at_layer, asset_scores.rejected_at_layer),
                    rejection_reason = COALESCE(EXCLUDED.rejection_reason, asset_scores.rejection_reason),
                    updated_at = now()",
                &[
                    &id,
                    &asset_id,
                    &symbol,
                    &test_run_id,
                    &technical_pass,
                    &technical_score,
                    &fundamental_pass,
                    &fundamental_score,
                    &sentiment_score,
                    &execution_score,
                    &paper_score,
                    &composite_score,
                    &rejected_at_layer,
                    &rejection_reason,
                ],
            )
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    // --- BOT EVENTS ---

    pub async fn log_bot_event(
        &self,
        id: &str,
        test_run_id: &str,
        bot_id: &str,
        asset_id: &str,
        symbol: &str,
        metric_group_id: &str,
        layer: &str,
        status: &str,
        result_json: Value,
    ) -> Result<(), String> {
        let client = self.get_client().await?;

        client
            .execute(
                "INSERT INTO bot_events (id, test_run_id, bot_id, asset_id, symbol, metric_group_id, layer, status, result_json, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())",
                &[
                    &id,
                    &test_run_id,
                    &bot_id,
                    &asset_id,
                    &symbol,
                    &metric_group_id,
                    &layer,
                    &status,
                    &result_json,
                ],
            )
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    // --- TELEMETRY ---

    pub async fn insert_telemetry_point(
        &self,
        run_id: &str,
        stage: &str,
        metric: &str,
        value: f64,
    ) -> Result<(), String> {
        let client = self.get_client().await?;

        client
            .execute(
                "INSERT INTO telemetry_points (run_id, stage, metric, value, observed_at)
                 VALUES ($1, $2, $3, $4, now())",
                &[&run_id, &stage, &metric, &value],
            )
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    // --- HISTORICAL PRICES ---

    pub async fn fetch_historical_prices(
        &self,
        symbol: &str,
    ) -> Result<Vec<(DateTime<Utc>, f32, f32, f32, f32, f32)>, String> {
        let client = self.get_client().await?;

        let rows = client
            .query(
                "SELECT date, open, high, low, close, volume 
                 FROM historical_prices 
                 WHERE symbol = $1 
                 ORDER BY date ASC",
                &[&symbol],
            )
            .await
            .map_err(|e| e.to_string())?;

        let mut prices = Vec::new();
        for row in rows {
            let date: DateTime<Utc> = row.get(0);
            let open: f32 = row.get(1);
            let high: f32 = row.get(2);
            let low: f32 = row.get(3);
            let close: f32 = row.get(4);
            let volume: f32 = row.get(5);
            prices.push((date, open, high, low, close, volume));
        }

        Ok(prices)
    }

    pub async fn insert_historical_price(
        &self,
        id: &str,
        symbol: &str,
        interval: &str,
        date: DateTime<Utc>,
        open: f32,
        high: f32,
        low: f32,
        close: f32,
        volume: f32,
    ) -> Result<(), String> {
        let client = self.get_client().await?;

        client
            .execute(
                "INSERT INTO historical_prices (id, symbol, interval, date, open, high, low, close, volume, source, cached_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'simulated', now())
                 ON CONFLICT (id) DO NOTHING",
                &[
                    &id,
                    &symbol,
                    &interval,
                    &date,
                    &(open as f64),
                    &(high as f64),
                    &(low as f64),
                    &(close as f64),
                    &(volume as f64),
                ],
            )
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    // --- PAPER TRADING POSITIONS ---

    pub async fn create_paper_trade_position(
        &self,
        id: &str,
        test_run_id: &str,
        symbol: &str,
        side: &str,
        quantity: f32,
        entry_price: f32,
        entry_time: DateTime<Utc>,
    ) -> Result<(), String> {
        let client = self.get_client().await?;

        client
            .execute(
                "INSERT INTO paper_trade_positions (id, test_run_id, symbol, side, quantity, entry_price, entry_time, status, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'open', now(), now())",
                &[
                    &id,
                    &test_run_id,
                    &symbol,
                    &side,
                    &(quantity as f64),
                    &(entry_price as f64),
                    &entry_time,
                ],
            )
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    pub async fn close_paper_trade_position(
        &self,
        id: &str,
        exit_price: f32,
        exit_time: DateTime<Utc>,
        pnl: f32,
        pnl_pct: f32,
    ) -> Result<(), String> {
        let client = self.get_client().await?;

        client
            .execute(
                "UPDATE paper_trade_positions
                 SET exit_price = $2, exit_time = $3, pnl = $4, pnl_pct = $5, status = 'closed', updated_at = now()
                 WHERE id = $1",
                &[
                    &id,
                    &(exit_price as f64),
                    &exit_time,
                    &(pnl as f64),
                    &(pnl_pct as f64),
                ],
            )
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    // --- LEADERBOARD & FINAL RUN SCORES ---

    pub async fn insert_run_score(
        &self,
        run_id: &str,
        strategy_id: &str,
        owner: &str,
        signal_score: f64,
        execution_score: f64,
        paper_trading_score: f64,
        composite_score: f64,
    ) -> Result<(), String> {
        let client = self.get_client().await?;

        client
            .execute(
                "INSERT INTO run_scores (run_id, strategy_id, owner, signal_score, execution_score, paper_trading_score, composite_score, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, now())
                 ON CONFLICT (run_id) DO UPDATE SET
                    signal_score = EXCLUDED.signal_score,
                    execution_score = EXCLUDED.execution_score,
                    paper_trading_score = EXCLUDED.paper_trading_score,
                    composite_score = EXCLUDED.composite_score",
                &[
                    &run_id,
                    &strategy_id,
                    &owner,
                    &signal_score,
                    &execution_score,
                    &paper_trading_score,
                    &composite_score,
                ],
            )
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    pub async fn fetch_leaderboard(&self) -> Result<Vec<(String, String, String, f64, f64, f64, f64)>, String> {
        let client = self.get_client().await?;

        let rows = client
            .query(
                "SELECT run_id, strategy_id, owner, signal_score, execution_score, paper_trading_score, composite_score
                 FROM run_scores
                 ORDER BY composite_score DESC, created_at DESC",
                &[],
            )
            .await
            .map_err(|e| e.to_string())?;

        let mut leaderboard = Vec::new();
        for row in rows {
            let run_id: String = row.get(0);
            let strategy_id: String = row.get(1);
            let owner: String = row.get(2);
            let signal_score: f64 = row.get(3);
            let execution_score: f64 = row.get(4);
            let paper_trading_score: f64 = row.get(5);
            let composite_score: f64 = row.get(6);
            leaderboard.push((
                run_id,
                strategy_id,
                owner,
                signal_score,
                execution_score,
                paper_trading_score,
                composite_score,
            ));
        }

        Ok(leaderboard)
    }
}
