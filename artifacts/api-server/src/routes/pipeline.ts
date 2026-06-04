import { Router, type IRouter } from "express";
import { desc, eq, count } from "drizzle-orm";
import { db, testRunsTable } from "@workspace/db";
import {
  GetPipelineStatusResponse,
  ListPipelineRunsQueryParams,
  ListPipelineRunsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const INFRA_CONFIG = {
  messageTransport: process.env.MESSAGE_TRANSPORT ?? "nats",
  orchestrator: process.env.ORCHESTRATOR ?? "swarm",
};

type ComponentStatus = "healthy" | "degraded" | "down";

function simulatedComponents() {
  const transport = INFRA_CONFIG.messageTransport === "kafka" ? "Kafka" : "NATS";
  const orchestrator = INFRA_CONFIG.orchestrator === "kubernetes" ? "Kubernetes" : "Docker Swarm";
  const db_label = INFRA_CONFIG.orchestrator === "kubernetes" ? "TimescaleDB" : "ClickHouse";
  const bot_label = INFRA_CONFIG.messageTransport === "kafka" ? "Rust Bots" : "Go Bots";

  return [
    { name: transport, status: "healthy" as ComponentStatus, description: "Message broker — order events", latencyMs: 0.4, throughput: 850000 },
    { name: orchestrator, status: "healthy" as ComponentStatus, description: "Container orchestration", latencyMs: 1.2, throughput: null },
    { name: db_label, status: "healthy" as ComponentStatus, description: "Time-series analytics store", latencyMs: 2.1, throughput: 120000 },
    { name: bot_label, status: "healthy" as ComponentStatus, description: "Synthetic market participants", latencyMs: null, throughput: 72000 },
    { name: "Scoring Engine", status: "healthy" as ComponentStatus, description: "Composite score computation", latencyMs: 8.5, throughput: null },
  ];
}

// GET /pipeline/status
router.get("/pipeline/status", async (_req, res): Promise<void> => {
  const [activeRow] = await db
    .select({ active: count() })
    .from(testRunsTable)
    .where(eq(testRunsTable.status, "running"));

  const [queueRow] = await db
    .select({ depth: count() })
    .from(testRunsTable)
    .where(eq(testRunsTable.status, "queued"));

  const components = simulatedComponents();
  const overall: "healthy" | "degraded" | "down" = components.every((c) => c.status === "healthy")
    ? "healthy"
    : components.some((c) => c.status === "down")
    ? "down"
    : "degraded";

  res.json(
    GetPipelineStatusResponse.parse({
      overall,
      components,
      activeRuns: activeRow?.active ?? 0,
      queueDepth: queueRow?.depth ?? 0,
      updatedAt: new Date().toISOString(),
    })
  );
});

// GET /pipeline/runs
router.get("/pipeline/runs", async (req, res): Promise<void> => {
  const parsed = ListPipelineRunsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const runs = await db
    .select()
    .from(testRunsTable)
    .orderBy(desc(testRunsTable.startedAt))
    .limit(parsed.data.limit);

  res.json(
    ListPipelineRunsResponse.parse(
      runs.map((r) => ({
        id: r.id,
        submissionId: r.submissionId,
        status: r.status,
        currentStage: r.currentStage ?? null,
        progressPct: r.progressPct ?? null,
        startedAt: r.startedAt.toISOString(),
        completedAt: r.completedAt?.toISOString() ?? null,
      }))
    )
  );
});

export default router;
