#!/usr/bin/env bash
# Run this directly on the deploy server (staging or prod box) as a last
# resort if GitHub Actions is unreachable and you need to roll back right
# now. Normally use the "Manual Rollback" GitHub Actions workflow instead,
# since it also re-runs smoke tests and logs who did it.
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: ./rollback.sh <image-tag>"
  echo "Example: ./rollback.sh sha-abc1234"
  exit 1
fi

IMAGE_TAG="$1"
APP_DIR="/opt/app"

echo "Rolling back to image tag: $IMAGE_TAG"
cd "$APP_DIR"

export IMAGE_TAG
docker compose pull
docker compose up -d --remove-orphans
echo "$IMAGE_TAG" > current-tag.txt

echo "Rollback complete. Verify manually with:"
echo "  curl -i http://localhost:4000/health"
echo "  curl -i http://localhost:8080/"
