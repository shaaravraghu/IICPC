#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
TARGET="${1:-local}"

usage() {
  cat <<'EOF'
Usage: infrastructure/scripts/deploy.sh [local|k8s]

local  Start the Docker Compose development stack.
k8s    Apply Kubernetes manifests from infrastructure/kubernetes.
EOF
}

case "$TARGET" in
  local)
    cd "$ROOT_DIR"
    docker compose up -d
    echo "IICPC local stack started."
    echo "Frontend: http://localhost:3000"
    echo "API:      http://localhost:3001/api/healthz"
    ;;
  k8s|kubernetes)
    kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/base/namespace.yaml"
    kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/base/rbac.yaml"
    kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/kafka/topics.yaml"
    kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/timescale/statefulset.yaml"
    kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/bots/deployments.yaml"
    echo "IICPC platform manifests applied."
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac
