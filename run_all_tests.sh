#!/bin/bash
# Script tự động chạy tất cả các test lấy Rakuten point apps hàng ngày
# Nếu test failed, retry tối đa 3 lần (lần đầu + 2 lần retry)

PROJECT_DIR="/Users/finbertmds/Documents/1code/receive_rakuten_point"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/run_rakuten_apps_$(date '+%Y%m%d_%H%M%S').log"
RUN_SUMMARY_LOG="$LOG_DIR/run_summary.log"
RUN_ID="$(date '+%Y%m%d_%H%M%S')"
RUN_START_TIME="$(date '+%Y-%m-%d %H:%M:%S')"
RUN_START_EPOCH="$(date '+%s')"
MAX_ATTEMPTS=3
PASS=0
FAIL=0
RUN_STATUS="FAILED"

mkdir -p "$LOG_DIR"

if [ ! -s "$RUN_SUMMARY_LOG" ]; then
  echo "# type | start | end | duration_sec | status | passed | failed | detail_log" >> "$RUN_SUMMARY_LOG"
fi

write_summary_log() {
  local type="rakuten_apps"
  local end_time
  local duration_sec

  end_time="$(date '+%Y-%m-%d %H:%M:%S')"
  duration_sec=$(( $(date '+%s') - RUN_START_EPOCH ))

  if [ "$FAIL" -eq 0 ] && [ "$PASS" -gt 0 ]; then
    RUN_STATUS="SUCCESS"
  elif [ "$FAIL" -eq 0 ] && [ "$PASS" -eq 0 ]; then
    RUN_STATUS="NO_TESTS"
  else
    RUN_STATUS="FAILED"
  fi

  echo "$type | start=$RUN_START_TIME | end=$end_time | duration_sec=$duration_sec | status=$RUN_STATUS | passed=$PASS | failed=$FAIL | detail_log=$LOG_FILE" >> "$RUN_SUMMARY_LOG"
}

trap write_summary_log EXIT

echo "========================================" | tee -a "$LOG_FILE"
echo "Rakuten Apps Run: $RUN_START_TIME" | tee -a "$LOG_FILE"
echo "Summary log: $RUN_SUMMARY_LOG" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

cd "$PROJECT_DIR" || exit 1

yarn install >> "$LOG_FILE" 2>&1

# Start the Android emulator
bash "$PROJECT_DIR/startEmulator.sh" >> "$LOG_FILE" 2>&1

COMMANDS=(
  "yarn test:pointclub"
  "yarn test:superpointscreen"
  "yarn test:toshiru"
)

for COMMAND in "${COMMANDS[@]}"; do
  # Extract the test name from the command, removing the 'yarn test:' prefix and any file extension
  NAME=$(echo "$COMMAND" | sed 's/^yarn test://')
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

    # Run COMMAND in a subshell to capture its exit status
    if $COMMAND >> "$LOG_FILE" 2>&1; then
      echo "✅ PASSED: $NAME (attempt $ATTEMPT) ($(date '+%H:%M:%S'))" | tee -a "$LOG_FILE"
      SUCCESS=true
      ((PASS++))
      break
    else
      echo "  ❌ Failed attempt $ATTEMPT/$MAX_ATTEMPTS: $NAME ($(date '+%H:%M:%S'))" | tee -a "$LOG_FILE"
    fi
  done

  if [ "$SUCCESS" = false ]; then
    echo "❌ FAILED: $NAME (all $MAX_ATTEMPTS attempts exhausted) ($(date '+%H:%M:%S'))" | tee -a "$LOG_FILE"
    ((FAIL++))
  fi
done

echo "" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
echo "SUMMARY: $PASS passed, $FAIL failed" | tee -a "$LOG_FILE"
echo "Finished: $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
