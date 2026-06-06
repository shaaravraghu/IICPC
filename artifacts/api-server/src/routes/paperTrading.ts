import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { assetScoresTable, db, paperTradePositionsTable, testRunsDetailedTable } from "@workspace/db";
import { simulatePaperTrading } from "../lib/paperTradingSimulator";

const router: IRouter = Router();

type ExecutePaperTradingRequest = {
  test_run_id?: string;
  testRunId?: string;
  initial_capital?: number;
  initialCapital?: number;
  timeline?: string;
};

// POST /paper-trading/execute
router.post("/paper-trading/execute", async (req, res): Promise<void> => {
  const parsed = parseExecutePaperTradingBody(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const testRunId = parsed.data.test_run_id ?? parsed.data.testRunId;
  if (!testRunId) {
    res.status(400).json({ error: "test_run_id is required" });
    return;
  }

  const initialCapital = parsed.data.initial_capital ?? parsed.data.initialCapital ?? 100_000;
  const timeline = parsed.data.timeline ?? "7d";

  const assets = await db
    .select()
    .from(assetScoresTable)
    .where(eq(assetScoresTable.testRunId, testRunId))
    .orderBy(desc(assetScoresTable.compositeScore))
    .limit(10);

  if (assets.length === 0) {
    res.status(404).json({ error: "No ranked assets found for test_run_id" });
    return;
  }

  const simulation = await simulatePaperTrading(
    assets.map((asset) => ({
      assetScoreId: asset.id,
      assetId: asset.assetId,
      symbol: asset.symbol,
      sentimentScore: asset.sentimentScore,
      executionScore: asset.executionScore,
    })),
    { initialCapital, timeline }
  );

  const positions = simulation.positions.map((position) => ({
    id: randomUUID(),
    testRunId,
    ...position,
  }));

  if (positions.length > 0) {
    await db.insert(paperTradePositionsTable).values(positions);
  }

  for (const position of simulation.positions) {
    const [asset] = assets.filter((candidate) => candidate.id === position.assetScoreId);
    const compositeScore = average([
      asset?.sentimentScore ?? 0,
      asset?.executionScore ?? 0,
      simulation.paperScore,
    ]);

    await db
      .update(assetScoresTable)
      .set({ paperScore: simulation.paperScore, compositeScore, updatedAt: new Date() })
      .where(eq(assetScoresTable.id, position.assetScoreId));
  }

  const refreshedAssets = await db
    .select()
    .from(assetScoresTable)
    .where(eq(assetScoresTable.testRunId, testRunId))
    .orderBy(desc(assetScoresTable.compositeScore));

  for (const [index, asset] of refreshedAssets.entries()) {
    await db
      .update(assetScoresTable)
      .set({ compositeRank: index + 1, updatedAt: new Date() })
      .where(eq(assetScoresTable.id, asset.id));
  }

  await db
    .update(testRunsDetailedTable)
    .set({
      paperAvgScore: simulation.paperScore,
      updatedAt: new Date(),
    })
    .where(eq(testRunsDetailedTable.testRunId, testRunId));

  res.status(202).json({
    testRunId,
    timeline,
    initialCapital,
    paperScore: simulation.paperScore,
    metrics: simulation.metrics,
    positions: simulation.positions.map((position) => ({
      symbol: position.symbol,
      side: position.side,
      quantity: position.quantity,
      entryPrice: position.entryPrice,
      exitPrice: position.exitPrice,
      pnl: position.pnl,
      pnlPct: position.pnlPct,
      status: position.status,
    })),
  });
});

// GET /paper-trading/:testRunId/positions
router.get("/paper-trading/:testRunId/positions", async (req, res): Promise<void> => {
  const testRunId = req.params["testRunId"];
  if (!testRunId) {
    res.status(400).json({ error: "testRunId is required" });
    return;
  }

  const positions = await db
    .select()
    .from(paperTradePositionsTable)
    .where(eq(paperTradePositionsTable.testRunId, testRunId))
    .orderBy(desc(paperTradePositionsTable.createdAt));

  res.json({
    testRunId,
    positions: positions.map((position) => ({
      symbol: position.symbol,
      side: position.side,
      quantity: position.quantity,
      entryPrice: position.entryPrice,
      exitPrice: position.exitPrice,
      pnl: position.pnl,
      pnlPct: position.pnlPct,
      status: position.status,
    })),
  });
});

function parseExecutePaperTradingBody(
  body: unknown
): { ok: true; data: ExecutePaperTradingRequest } | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be an object" };
  }

  const data: ExecutePaperTradingRequest = {};
  for (const key of ["test_run_id", "testRunId", "timeline"] as const) {
    const value = body[key];
    if (value !== undefined && typeof value !== "string") {
      return { ok: false, error: `${key} must be a string` };
    }
    data[key] = value;
  }

  for (const key of ["initial_capital", "initialCapital"] as const) {
    const value = body[key];
    if (value !== undefined && (typeof value !== "number" || value <= 0)) {
      return { ok: false, error: `${key} must be a positive number` };
    }
    data[key] = value;
  }

  return { ok: true, data };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}

export default router;
