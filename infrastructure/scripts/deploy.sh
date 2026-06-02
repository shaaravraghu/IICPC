#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"

kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/base/namespace.yaml"
kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/base/rbac.yaml"
kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/kafka/topics.yaml"
kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/timescale/statefulset.yaml"
kubectl apply -f "$ROOT_DIR/infrastructure/kubernetes/bots/deployments.yaml"

echo "IICPC platform manifests applied."
