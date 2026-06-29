#!/bin/bash
# Script tự động chạy tất cả các test lấy Rakuten point hàng ngày
# Nếu test failed, retry tối đa 3 lần (lần đầu + 2 lần retry)

PROJECT_DIR="/Users/finbertmds/Documents/1code/receive_rakuten_point"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/run_$(date '+%Y%m%d_%H%M%S').log"
MAX_ATTEMPTS=3

mkdir -p "$LOG_DIR"

echo "========================================" | tee -a "$LOG_FILE"
echo "Rakuten Point Run: $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

cd "$PROJECT_DIR" || exit 1

yarn install >> "$LOG_FILE" 2>&1

SPECS=(
  "./test/specs/bank.point.e2e.ts"
  "./test/specs/campaign.point.e2e.ts"
  "./test/specs/card.point.e2e.ts"
  "./test/specs/infoseek.point.e2e.ts"
  "./test/specs/kuji.point.e2e.ts"
)

PASS=0
FAIL=0

for SPEC in "${SPECS[@]}"; do
  NAME=$(basename "$SPEC" .e2e.ts)
  echo "" | tee -a "$LOG_FILE"
  echo "--- Running: $NAME ---" | tee -a "$LOG_FILE"

  ATTEMPT=0
  SUCCESS=false

  while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ((ATTEMPT++))
    if [ $ATTEMPT -gt 1 ]; then
      echo "  🔄 Retry $((ATTEMPT - 1))/$((MAX_ATTEMPTS - 1)): $NAME ($(date '+%H:%M:%S'))" | tee -a "$LOG_FILE"
    else
      echo "  ▶ Attempt $ATTEMPT/$MAX_ATTEMPTS: $NAME ($(date '+%H:%M:%S'))" | tee -a "$LOG_FILE"
    fi

    if yarn test --spec "$SPEC" >> "$LOG_FILE" 2>&1; then
      echo "✅ PASSED: $NAME (attempt $ATTEMPT)" | tee -a "$LOG_FILE"
      SUCCESS=true
      ((PASS++))
      break
    else
      echo "  ❌ Failed attempt $ATTEMPT/$MAX_ATTEMPTS: $NAME" | tee -a "$LOG_FILE"
    fi
  done

  if [ "$SUCCESS" = false ]; then
    echo "❌ FAILED: $NAME (all $MAX_ATTEMPTS attempts exhausted)" | tee -a "$LOG_FILE"
    ((FAIL++))
  fi
done

echo "" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
echo "SUMMARY: $PASS passed, $FAIL failed" | tee -a "$LOG_FILE"
echo "Finished: $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
