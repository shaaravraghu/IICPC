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
