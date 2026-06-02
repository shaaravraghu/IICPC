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

CREATE TABLE IF NOT EXISTS telemetry_points (
  run_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  metric TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS telemetry_points_run_stage_idx
  ON telemetry_points (run_id, stage, observed_at DESC);
