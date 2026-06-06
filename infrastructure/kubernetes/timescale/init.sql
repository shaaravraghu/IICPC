CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  team_name TEXT,
  language TEXT NOT NULL,
  filename TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  speed_score REAL,
  stability_score REAL,
  correctness_score REAL,
  composite_score REAL,
  p50_latency REAL,
  p90_latency REAL,
  p99_latency REAL,
  tps REAL,
  total_orders INTEGER,
  fill_accuracy REAL,
  uptime_pct REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS test_runs (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  current_stage TEXT,
  progress_pct INTEGER,
  technical_bot_count INTEGER DEFAULT 100,
  fundamental_bot_count INTEGER DEFAULT 50,
  sentiment_bot_count INTEGER DEFAULT 50,
  duration_seconds INTEGER DEFAULT 60,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS test_runs_detailed (
  id TEXT PRIMARY KEY,
  test_run_id TEXT NOT NULL,
  submission_id TEXT,
  current_layer TEXT NOT NULL DEFAULT 'queued',
  status TEXT NOT NULL DEFAULT 'queued',
  assets_total INTEGER NOT NULL DEFAULT 0,
  assets_analyzed INTEGER NOT NULL DEFAULT 0,
  technical_pass_count INTEGER NOT NULL DEFAULT 0,
  fundamental_pass_count INTEGER NOT NULL DEFAULT 0,
  sentiment_pass_count INTEGER NOT NULL DEFAULT 0,
  sentiment_avg_score REAL,
  execution_avg_score REAL,
  paper_avg_score REAL,
  progress_pct INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS asset_scores (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  test_run_id TEXT NOT NULL,
  technical_pass INTEGER NOT NULL DEFAULT 0,
  technical_score DOUBLE PRECISION,
  fundamental_pass INTEGER NOT NULL DEFAULT 0,
  fundamental_score DOUBLE PRECISION,
  sentiment_score DOUBLE PRECISION,
  execution_score DOUBLE PRECISION,
  paper_score DOUBLE PRECISION,
  composite_score DOUBLE PRECISION,
  composite_rank INTEGER,
  rejected_at_layer TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bot_events (
  id TEXT PRIMARY KEY,
  test_run_id TEXT NOT NULL,
  bot_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  metric_group_id TEXT NOT NULL,
  layer TEXT NOT NULL,
  status TEXT NOT NULL,
  result_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS historical_prices (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  interval TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  open DOUBLE PRECISION NOT NULL,
  high DOUBLE PRECISION NOT NULL,
  low DOUBLE PRECISION NOT NULL,
  close DOUBLE PRECISION NOT NULL,
  volume DOUBLE PRECISION NOT NULL,
  source TEXT NOT NULL DEFAULT 'unknown',
  cached_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS paper_trade_positions (
  id TEXT PRIMARY KEY,
  test_run_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL,
  quantity DOUBLE PRECISION NOT NULL,
  entry_price DOUBLE PRECISION NOT NULL,
  entry_time TIMESTAMPTZ NOT NULL,
  exit_price DOUBLE PRECISION,
  exit_time TIMESTAMPTZ,
  pnl DOUBLE PRECISION,
  pnl_pct DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS run_scores (
  run_id TEXT PRIMARY KEY,
  strategy_id TEXT NOT NULL,
  owner TEXT NOT NULL,
  signal_score DOUBLE PRECISION NOT NULL,
  execution_score DOUBLE PRECISION NOT NULL,
  paper_trading_score DOUBLE PRECISION NOT NULL,
  composite_score DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  rows JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS telemetry_points (
  run_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  metric TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

SELECT create_hypertable('telemetry_points', 'observed_at', if_not_exists => TRUE);

CREATE INDEX IF NOT EXISTS submissions_status_score_idx ON submissions (status, composite_score DESC);
CREATE INDEX IF NOT EXISTS test_runs_submission_idx ON test_runs (submission_id);
CREATE INDEX IF NOT EXISTS test_runs_detailed_run_idx ON test_runs_detailed (test_run_id);
CREATE INDEX IF NOT EXISTS asset_scores_run_rank_idx ON asset_scores (test_run_id, composite_rank);
CREATE INDEX IF NOT EXISTS bot_events_run_layer_idx ON bot_events (test_run_id, layer, created_at DESC);
CREATE INDEX IF NOT EXISTS historical_prices_symbol_date_idx ON historical_prices (symbol, date DESC);
CREATE INDEX IF NOT EXISTS paper_trade_positions_run_symbol_idx ON paper_trade_positions (test_run_id, symbol);
CREATE INDEX IF NOT EXISTS run_scores_composite_idx ON run_scores (composite_score DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS telemetry_points_run_stage_idx ON telemetry_points (run_id, stage, observed_at DESC);
