#!/usr/bin/env bash
# Basic post-deploy smoke tests. Hits the endpoints that matter most and
# fails loudly (non-zero exit) if anything looks wrong, so the calling
# workflow can trigger a rollback.
set -euo pipefail

TARGET_URL="${1:?Usage: smoke-test.sh <base-url>}"
MAX_RETRIES=5
RETRY_DELAY=5

check_endpoint() {
  local path="$1"
  local expected_status="$2"
  local url="${TARGET_URL}${path}"
  local attempt=1

  while [ "$attempt" -le "$MAX_RETRIES" ]; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    if [ "$status" = "$expected_status" ]; then
      echo "OK  $url -> $status"
      return 0
    fi
    echo "Attempt $attempt/$MAX_RETRIES: $url returned $status, expected $expected_status"
    attempt=$((attempt + 1))
    sleep "$RETRY_DELAY"
  done

  echo "FAILED  $url did not return $expected_status after $MAX_RETRIES attempts"
  return 1
}

echo "Running smoke tests against $TARGET_URL"

check_endpoint "/health" "200"
check_endpoint "/" "200"

echo "All smoke tests passed."
