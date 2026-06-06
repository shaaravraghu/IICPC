import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import {
  assetScoresTable,
  db,
  testRunsDetailedTable,
} from "@workspace/db";
import { DEFAULT_ASSETS, initializeExecutionRun, runPipeline } from "../lib/orchestrator";
import { emitPipelineProgress } from "../lib/websocket";

const router: IRouter = Router();

type AssetInput = string | string[] | undefined;
type StartExecutionRequest = {
  submission_id?: string;
  submissionId?: string;
  test_run_id?: string;
  testRunId?: string;
  assets_to_analyze?: AssetInput;
  assetsToAnalyze?: AssetInput;
};

// POST /executions/start
router.post("/executions/start", async (req, res): Promise<void> => {
  const parsed = parseStartExecutionBody(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const submissionId = parsed.data.submission_id ?? parsed.data.submissionId;
  if (!submissionId) {
    res.status(400).json({ error: "submission_id is required" });
    return;
  }

  const testRunId = parsed.data.test_run_id ?? parsed.data.testRunId ?? randomUUID();
  const assets = normalizeAssets(parsed.data.assets_to_analyze ?? parsed.data.assetsToAnalyze);
  const invalidAssets = assets.filter((asset) => !isValidAssetSymbol(asset));
  if (invalidAssets.length > 0) {
    res.status(400).json({ error: `Invalid asset symbols: ${invalidAssets.join(", ")}` });
    return;
  }

  await initializeExecutionRun(testRunId, submissionId, assets.length);
  emitPipelineProgress({
    testRunId,
    submissionId,
    status: "queued",
    currentLayer: "technical",
    progressPct: 0,
    assetsTotal: assets.length,
    assetsAnalyzed: 0,
  });

  runPipeline(testRunId, assets).catch((err: unknown) => {
    console.error("execution pipeline failed", err);
  });

  res.status(202).json({
    testRunId,
    submissionId,
    status: "queued",
    currentLayer: "technical",
    assetsToAnalyze: assets.length,
    estimatedDurationSeconds: 45,
  });
});

// GET /executions/:testRunId/status
router.get("/executions/:testRunId/status", async (req, res): Promise<void> => {
  const testRunId = req.params["testRunId"];
  if (!testRunId) {
    res.status(400).json({ error: "testRunId is required" });
    return;
  }

  const [run] = await db
    .select()
    .from(testRunsDetailedTable)
    .where(eq(testRunsDetailedTable.testRunId, testRunId));

  if (!run) {
    res.status(404).json({ error: "Execution run not found" });
    return;
  }

  res.json({
    testRunId: run.testRunId,
    submissionId: run.submissionId,
    status: run.status,
    currentLayer: run.currentLayer,
    progressPct: run.progressPct,
    assetsTotal: run.assetsTotal,
    assetsAnalyzed: run.assetsAnalyzed,
    technicalPassCount: run.technicalPassCount,
    fundamentalPassCount: run.fundamentalPassCount,
    sentimentPassCount: run.sentimentPassCount,
    sentimentAvgScore: run.sentimentAvgScore,
    executionAvgScore: run.executionAvgScore,
    paperAvgScore: run.paperAvgScore,
    startedAt: run.startedAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
  });
});

// GET /leaderboard/:testRunId
router.get("/leaderboard/:testRunId", async (req, res): Promise<void> => {
  const testRunId = req.params["testRunId"];
  if (!testRunId) {
    res.status(400).json({ error: "testRunId is required" });
    return;
  }

  const rows = await db
    .select()
    .from(assetScoresTable)
    .where(eq(assetScoresTable.testRunId, testRunId))
    .orderBy(desc(assetScoresTable.compositeScore));

  res.json({
    testRunId,
    assets: rows.map((row, index) => ({
      rank: row.compositeRank ?? index + 1,
      assetId: row.assetId,
      symbol: row.symbol,
      technicalPass: row.technicalPass === 1,
      technicalScore: row.technicalScore,
      fundamentalPass: row.fundamentalPass === 1,
      fundamentalScore: row.fundamentalScore,
      sentimentScore: row.sentimentScore,
      executionScore: row.executionScore,
      paperScore: row.paperScore,
      compositeScore: row.compositeScore,
      rejectedAtLayer: row.rejectedAtLayer,
      rejectionReason: row.rejectionReason,
    })),
  });
});

function normalizeAssets(rawAssets: string | string[] | undefined): string[] {
  if (!rawAssets) return DEFAULT_ASSETS;

  const values = Array.isArray(rawAssets) ? rawAssets : rawAssets.split(",");
  const assets = values
    .map((asset) => asset.trim().toUpperCase())
    .filter((asset) => asset.length > 0);

  return assets.length > 0 ? Array.from(new Set(assets)) : DEFAULT_ASSETS;
}

function parseStartExecutionBody(body: unknown): { ok: true; data: StartExecutionRequest } | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be an object" };
  }

  const data: StartExecutionRequest = {};
  for (const key of ["submission_id", "submissionId", "test_run_id", "testRunId"] as const) {
    const value = body[key];
    if (value !== undefined && typeof value !== "string") {
      return { ok: false, error: `${key} must be a string` };
    }
    data[key] = value;
  }

  for (const key of ["assets_to_analyze", "assetsToAnalyze"] as const) {
    const value = body[key];
    if (value !== undefined && typeof value !== "string" && !isStringArray(value)) {
      return { ok: false, error: `${key} must be a CSV string or string array` };
    }
    data[key] = value;
  }

  return { ok: true, data };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isValidAssetSymbol(symbol: string): boolean {
  return /^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol);
}

export default router;
