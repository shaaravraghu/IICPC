import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { assetScoresTable, db, paperTradePositionsTable, testRunsDetailedTable } from "@workspace/db";

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

  const allocation = initialCapital / assets.length;
  const positions = assets.map((asset, index) => {
    const entryPrice = priceForSymbol(asset.symbol, 1);
    const exitPrice = priceForSymbol(asset.symbol, 7 + index);
    const quantity = Math.floor((allocation / entryPrice) * 100) / 100;
    const pnl = Math.round((exitPrice - entryPrice) * quantity * 100) / 100;
    const pnlPct = Math.round(((exitPrice - entryPrice) / entryPrice) * 10_000) / 100;

    return {
      id: randomUUID(),
      testRunId,
      assetScoreId: asset.id,
      symbol: asset.symbol,
      side: "long",
      quantity,
      entryPrice,
      entryTime: new Date(),
      exitPrice,
      exitTime: timeline === "open" ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      pnl,
      pnlPct,
      status: timeline === "open" ? "open" : "closed",
    };
  });

  await db.insert(paperTradePositionsTable).values(positions);

  for (const position of positions) {
    const paperScore = Math.max(0, Math.min(100, 50 + position.pnlPct * 2));
    const [asset] = assets.filter((candidate) => candidate.id === position.assetScoreId);
    const compositeScore = average([
      asset?.sentimentScore ?? 0,
      asset?.executionScore ?? 0,
      paperScore,
    ]);

    await db
      .update(assetScoresTable)
      .set({ paperScore, compositeScore, updatedAt: new Date() })
      .where(eq(assetScoresTable.id, position.assetScoreId ?? ""));
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
      paperAvgScore: average(positions.map((position) => Math.max(0, Math.min(100, 50 + position.pnlPct * 2)))),
      updatedAt: new Date(),
    })
    .where(eq(testRunsDetailedTable.testRunId, testRunId));

  res.status(202).json({
    testRunId,
    timeline,
    initialCapital,
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

function priceForSymbol(symbol: string, salt: number): number {
  const hash = Array.from(symbol).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + salt), 0);
  return Math.round((75 + (hash % 120) + Math.sin(hash) * 4) * 100) / 100;
}

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
