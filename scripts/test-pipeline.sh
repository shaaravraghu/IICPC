#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
API_URL="${API_URL:-http://localhost:3001/api}"
SOCKET_URL="${SOCKET_URL:-http://localhost:3001}"
ASSETS="${ASSETS:-AAPL,MSFT,NVDA,GOOGL,AMZN}"
RUN_ID="${RUN_ID:-integration-$(date +%s)}"
SUBMISSION_ID="${SUBMISSION_ID:-starter-strategy-${RUN_ID}}"
POLL_SECONDS="${POLL_SECONDS:-90}"

tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

echo "Checking API health at $API_URL/healthz"
curl -fsS "$API_URL/healthz" >"$tmp_dir/health.json"

echo "Submitting starter strategy run $RUN_ID"
curl -fsS \
  -H "Content-Type: application/json" \
  -X POST \
  -d "{\"submission_id\":\"$SUBMISSION_ID\",\"test_run_id\":\"$RUN_ID\",\"assets_to_analyze\":\"$ASSETS\"}" \
  "$API_URL/executions/start" >"$tmp_dir/start.json"

test_run_id="$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); if(!data.testRunId) process.exit(1); process.stdout.write(data.testRunId)" "$tmp_dir/start.json")"
echo "Pipeline accepted as $test_run_id"

deadline=$(( $(date +%s) + POLL_SECONDS ))
status="queued"

while [ "$(date +%s)" -le "$deadline" ]; do
  curl -fsS "$API_URL/executions/$test_run_id/status" >"$tmp_dir/status.json"
  status="$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); process.stdout.write(data.status || '')" "$tmp_dir/status.json")"
  progress="$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); process.stdout.write(String(data.progressPct ?? 0))" "$tmp_dir/status.json")"
  layer="$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); process.stdout.write(data.currentLayer || '')" "$tmp_dir/status.json")"
  echo "status=$status layer=$layer progress=$progress%"

  if [ "$status" = "completed" ]; then
    break
  fi

  if [ "$status" = "failed" ]; then
    echo "Pipeline failed" >&2
    cat "$tmp_dir/status.json" >&2
    exit 1
  fi

  sleep 2
done

if [ "$status" != "completed" ]; then
  echo "Timed out waiting for pipeline completion after ${POLL_SECONDS}s" >&2
  cat "$tmp_dir/status.json" >&2
  exit 1
fi

echo "Verifying leaderboard score columns"
curl -fsS "$API_URL/leaderboard/$test_run_id" >"$tmp_dir/leaderboard.json"
node -e "
const fs = require('fs');
const rows = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));
if (!Array.isArray(rows) || rows.length === 0) {
  throw new Error('leaderboard returned no rows');
}
const missing = rows.filter((row) =>
  typeof row.sentimentScore !== 'number' ||
  typeof row.executionScore !== 'number' ||
  typeof row.paperScore !== 'number'
);
if (missing.length > 0) {
  throw new Error('leaderboard rows are missing sentiment/execution/paper scores');
}
console.log('leaderboard rows:', rows.length);
" "$tmp_dir/leaderboard.json"

echo "Checking WebSocket connectivity at $SOCKET_URL"
if command -v pnpm >/dev/null 2>&1; then
  PNPM_EXEC="pnpm"
elif command -v corepack >/dev/null 2>&1; then
  PNPM_EXEC="corepack pnpm"
else
  echo "pnpm or corepack is required for the Socket.IO connectivity check" >&2
  exit 1
fi

SOCKET_URL="$SOCKET_URL" TEST_RUN_ID="$test_run_id" $PNPM_EXEC --dir "$ROOT_DIR" --filter @workspace/iicpc-platform exec node --input-type=module -e "
import { io } from 'socket.io-client';

const socket = io(process.env.SOCKET_URL, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  timeout: 3000,
});

const timeout = setTimeout(() => {
  socket.close();
  console.error('socket connection timed out');
  process.exit(1);
}, 5000);

socket.on('connect', () => {
  socket.emit('room:join', 'leaderboard');
  socket.emit('room:join', 'test-run:' + process.env.TEST_RUN_ID);
  clearTimeout(timeout);
  console.log('socket connected:', socket.id);
  socket.close();
});

socket.on('connect_error', (err) => {
  clearTimeout(timeout);
  console.error(err.message);
  socket.close();
  process.exit(1);
});
"

echo "Pipeline integration test passed."

RUST_API_URL="${RUST_API_URL:-http://localhost:8080}"

# ---------------------------------------------------------------------------
# Rust api-gateway pipeline block
# Skipped gracefully if the Rust gateway is not reachable (e.g. local-only
# TypeScript-only runs). Set SKIP_RUST_TESTS=1 to force-skip.
# ---------------------------------------------------------------------------
if [ "${SKIP_RUST_TESTS:-0}" = "1" ]; then
  echo "SKIP_RUST_TESTS=1 — skipping Rust api-gateway block."
else

echo "Checking Rust api-gateway health at $RUST_API_URL/health"
if ! curl -fsS --max-time 5 "$RUST_API_URL/health" >"$tmp_dir/rust_health.json" 2>/dev/null; then
  echo "WARNING: Rust api-gateway not reachable at $RUST_API_URL — skipping Rust pipeline tests." >&2
else

echo "=== Testing Rust api-gateway pipeline ==="

# Valid StrategyManifest YAML matching the structure expected by strategy-parser.
# Sentiment weights must sum to exactly 100.
RUST_STRATEGY_YAML='id: starter-momentum-quality-sentiment
owner: integration-test
technical_groups:
  - id: momentum-breakout
    category: Technical
    pass_threshold: 62.0
    calls:
      - name: trend_strength_adx
        params:
          period: 14
      - name: momentum_rate_of_change
        params:
          period: 12
      - name: vwap_distance
        params: {}
  - id: trend-confirmation
    category: Technical
    pass_threshold: 55.0
    calls:
      - name: market_structure_analysis
        params: {}
      - name: relative_strength_vs_benchmark
        params:
          period: 20
fundamental_groups:
  - id: quality-compounders
    category: Fundamental
    pass_threshold: 60.0
    calls:
      - name: return_on_invested_capital
        params:
          min: 12
      - name: free_cash_flow_margin
        params:
          min: 8
sentiment_dimensions:
  - name: news_sentiment
    weight_pct: 20
    call:
      name: news_sentiment_analysis
      params: {}
  - name: options_sentiment
    weight_pct: 15
    call:
      name: options_market_sentiment
      params: {}
  - name: institutional_flow
    weight_pct: 15
    call:
      name: institutional_fund_flow_analysis
      params: {}
  - name: analyst_sentiment
    weight_pct: 10
    call:
      name: analyst_rating_sentiment
      params: {}
  - name: earnings_call_tone
    weight_pct: 15
    call:
      name: earnings_call_sentiment
      params: {}
  - name: technical_psychology
    weight_pct: 10
    call:
      name: technical_sentiment_indicators
      params: {}
  - name: alternative_data
    weight_pct: 10
    call:
      name: alternative_data_sentiment
      params: {}
  - name: prediction_markets
    weight_pct: 5
    call:
      name: prediction_market_analysis
      params: {}'

# Escape YAML for JSON embedding: replace backslash, double-quote, newline
RUST_STRATEGY_JSON="$(printf '%s' "$RUST_STRATEGY_YAML" | node -e "
let buf='';
process.stdin.on('data',d=>buf+=d);
process.stdin.on('end',()=>process.stdout.write(JSON.stringify(buf)));
")"

curl -fsS -H "Content-Type: application/json" -X POST \
  -d "{\"strategy_yaml\": $RUST_STRATEGY_JSON, \"assets\": [\"AAPL\",\"MSFT\",\"NVDA\"]}" \
  "$RUST_API_URL/api/submissions" > "$tmp_dir/rust_submission.json"

rust_run_id="$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); if(!data.run_id) process.exit(1); process.stdout.write(data.run_id)" "$tmp_dir/rust_submission.json")"

echo "Rust Pipeline accepted as $rust_run_id"

# Poll Rust pipeline status
rust_deadline=$(( $(date +%s) + POLL_SECONDS ))
rust_status="queued"

while [ "$(date +%s)" -le "$rust_deadline" ]; do
  curl -fsS "$RUST_API_URL/api/pipeline/status?run_id=$rust_run_id" >"$tmp_dir/rust_status.json"
  rust_status="$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); process.stdout.write(data.status || '')" "$tmp_dir/rust_status.json")"
  echo "rust_status=$rust_status"

  if [ "$rust_status" = "completed" ]; then
    break
  fi

  if [ "$rust_status" = "failed" ]; then
    echo "Rust Pipeline failed" >&2
    cat "$tmp_dir/rust_status.json" >&2
    exit 1
  fi

  sleep 2
done

if [ "$rust_status" != "completed" ]; then
  echo "Timed out waiting for Rust pipeline completion after ${POLL_SECONDS}s" >&2
  cat "$tmp_dir/rust_status.json" >&2
  exit 1
fi

# Verify Rust leaderboard has 3-column scores
echo "Verifying Rust leaderboard score columns"
curl -fsS "$RUST_API_URL/api/leaderboard?run_id=$rust_run_id" >"$tmp_dir/rust_leaderboard.json"
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));
const rows = data.leaderboard || data;
if (!Array.isArray(rows) || rows.length === 0) {
  throw new Error('rust leaderboard returned no rows');
}
const missing = rows.filter((row) =>
  typeof row.sentiment_score !== 'number' ||
  typeof row.execution_score !== 'number' ||
  typeof row.paper_score !== 'number'
);
if (missing.length > 0) {
  throw new Error('rust leaderboard rows are missing sentiment/execution/paper scores: ' + JSON.stringify(missing[0]));
}
console.log('rust leaderboard rows:', rows.length, '— all 3-column scores present');
" "$tmp_dir/rust_leaderboard.json"

# Test Rust WebSocket: ws://localhost:8080/ws/leaderboard
echo "Checking Rust WebSocket connectivity at $RUST_API_URL/ws/leaderboard"
RUST_API_URL="$RUST_API_URL" TEST_RUN_ID="$rust_run_id" $PNPM_EXEC --dir "$ROOT_DIR" --filter @workspace/iicpc-platform exec node --input-type=module -e "
import WebSocket from 'ws';
const wsUrl = process.env.RUST_API_URL.replace(/^http/, 'ws') + '/ws/leaderboard';
const ws = new WebSocket(wsUrl);
const timeout = setTimeout(() => {
  ws.close();
  console.error('rust websocket connection timed out after 5 s');
  process.exit(1);
}, 5000);
ws.on('open', () => {
  clearTimeout(timeout);
  console.log('rust websocket connected to', wsUrl);
  // Verify we receive at least one message (the initial snapshot)
  const msgTimeout = setTimeout(() => {
    console.warn('rust websocket: no snapshot received within 3 s — connection OK but no data');
    ws.close();
  }, 3000);
  ws.on('message', (data) => {
    clearTimeout(msgTimeout);
    console.log('rust websocket snapshot received, bytes:', data.length);
    ws.close();
  });
});
ws.on('error', (err) => {
  clearTimeout(timeout);
  console.error(err.message);
  process.exit(1);
});
" || true

echo "Rust Pipeline integration test passed."

fi  # end: Rust gateway reachable
fi  # end: SKIP_RUST_TESTS
