import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import {
  assetScoresTable,
  botEventsTable,
  db,
  testRunsDetailedTable,
  testRunsTable,
} from "@workspace/db";

export const DEFAULT_ASSETS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "GOOGL",
  "AMZN",
  "META",
  "TSLA",
  "JPM",
  "UNH",
  "V",
];

type PipelineLayer = "technical" | "fundamental" | "sentiment" | "execution" | "paper";
type BotLayer = "technical" | "fundamental" | "sentiment";
type AssetCandidate = {
  assetId: string;
  symbol: string;
  technicalScore?: number;
  fundamentalScore?: number;
  sentimentScore?: number;
  executionScore?: number;
};
type MetricGroupConfig = {
  id: string;
  threshold: number;
  salt: number;
};
type BotResult = {
  assetId: string;
  symbol: string;
  layer: BotLayer;
  metricGroupId: string;
  score: number;
  status: "pass" | "fail";
};

const LAYER_GROUPS: Record<BotLayer, MetricGroupConfig[]> = {
  technical: [
    { id: "technical-trend-momentum", threshold: 45, salt: 11 },
    { id: "technical-volatility-volume", threshold: 50, salt: 17 },
    { id: "technical-market-structure", threshold: 52, salt: 19 },
  ],
  fundamental: [
    { id: "fundamental-growth-quality", threshold: 50, salt: 23 },
    { id: "fundamental-profitability-balance-sheet", threshold: 54, salt: 29 },
    { id: "fundamental-valuation-alignment", threshold: 56, salt: 31 },
  ],
  sentiment: [
    { id: "sentiment-news-social", threshold: 0, salt: 37 },
    { id: "sentiment-options-flow", threshold: 0, salt: 41 },
    { id: "sentiment-alternative-macro", threshold: 0, salt: 43 },
  ],
};

export async function initializeExecutionRun(
  testRunId: string,
  submissionId: string,
  assetsTotal: number
): Promise<void> {
  const [existingRun] = await db.select().from(testRunsTable).where(eq(testRunsTable.id, testRunId));
  if (!existingRun) {
    await db.insert(testRunsTable).values({
      id: testRunId,
      submissionId,
      status: "queued",
      currentStage: "technical",
      progressPct: 0,
    });
  } else {
    await db
      .update(testRunsTable)
      .set({ status: "queued", currentStage: "technical", progressPct: 0, completedAt: null })
      .where(eq(testRunsTable.id, testRunId));
  }

  await db.delete(assetScoresTable).where(eq(assetScoresTable.testRunId, testRunId));
  await db.delete(botEventsTable).where(eq(botEventsTable.testRunId, testRunId));

  const [existingDetailedRun] = await db
    .select()
    .from(testRunsDetailedTable)
    .where(eq(testRunsDetailedTable.testRunId, testRunId));

  if (!existingDetailedRun) {
    await db.insert(testRunsDetailedTable).values({
      id: randomUUID(),
      testRunId,
      submissionId,
      currentLayer: "technical",
      status: "queued",
      assetsTotal,
      progressPct: 0,
    });
    return;
  }

  await db
    .update(testRunsDetailedTable)
    .set({
      submissionId,
      currentLayer: "technical",
      status: "queued",
      assetsTotal,
      assetsAnalyzed: 0,
      technicalPassCount: 0,
      fundamentalPassCount: 0,
      sentimentPassCount: 0,
      sentimentAvgScore: null,
      executionAvgScore: null,
      paperAvgScore: null,
      progressPct: 0,
      updatedAt: new Date(),
      completedAt: null,
    })
    .where(eq(testRunsDetailedTable.testRunId, testRunId));
}

export async function runPipeline(testRunId: string, assets: string[]): Promise<AssetCandidate[]> {
  const candidates = assets.map((symbol) => ({ assetId: symbol, symbol }));

  try {
    await markRunLayer(testRunId, "technical", 10);
    const technicalPassed = await technicalLayer(testRunId, candidates);

    await markRunLayer(testRunId, "fundamental", 35);
    const fundamentalPassed = await fundamentalLayer(testRunId, technicalPassed);

    await markRunLayer(testRunId, "sentiment", 60);
    const sentimentRanked = await sentimentLayer(testRunId, fundamentalPassed);

    await markRunLayer(testRunId, "execution", 80);
    const executionRanked = await executionLayer(testRunId, sentimentRanked);

    await markRunLayer(testRunId, "paper", 98);
    await completeRun(testRunId);

    return executionRanked;
  } catch (err) {
    await failRun(testRunId, err);
    throw err;
  }
}

async function technicalLayer(testRunId: string, assets: AssetCandidate[]): Promise<AssetCandidate[]> {
  const results = await orchestrateLayer(testRunId, "technical", assets);
  const aggregated = aggregateLayerResults(results);

  if (aggregated.length > 0) {
    await db.insert(assetScoresTable).values(
      aggregated.map((asset) => ({
        id: randomUUID(),
        assetId: asset.assetId,
        symbol: asset.symbol,
        testRunId,
        technicalPass: asset.status === "pass" ? 1 : 0,
        technicalScore: asset.score,
        rejectedAtLayer: asset.status === "pass" ? null : "technical",
        rejectionReason: asset.status === "pass" ? null : "Technical metric groups did not meet pass threshold",
      }))
    );
  }

  const passed = aggregated
    .filter((asset) => asset.status === "pass")
    .map((asset) => ({
      assetId: asset.assetId,
      symbol: asset.symbol,
      technicalScore: asset.score,
    }));

  await updateDetailedRun(testRunId, {
    assetsAnalyzed: assets.length,
    technicalPassCount: passed.length,
    progressPct: 30,
  });

  return passed;
}

async function fundamentalLayer(testRunId: string, assets: AssetCandidate[]): Promise<AssetCandidate[]> {
  const results = await orchestrateLayer(testRunId, "fundamental", assets);
  const aggregated = aggregateLayerResults(results);

  for (const asset of aggregated) {
    await db
      .update(assetScoresTable)
      .set({
        fundamentalPass: asset.status === "pass" ? 1 : 0,
        fundamentalScore: asset.score,
        rejectedAtLayer: asset.status === "pass" ? null : "fundamental",
        rejectionReason: asset.status === "pass" ? null : "Fundamental validation did not meet pass threshold",
        updatedAt: new Date(),
      })
      .where(and(eq(assetScoresTable.testRunId, testRunId), eq(assetScoresTable.assetId, asset.assetId)));
  }

  const passed = aggregated
    .filter((asset) => asset.status === "pass")
    .map((asset) => ({
      assetId: asset.assetId,
      symbol: asset.symbol,
      technicalScore: assets.find((candidate) => candidate.assetId === asset.assetId)?.technicalScore,
      fundamentalScore: asset.score,
    }));

  await updateDetailedRun(testRunId, {
    fundamentalPassCount: passed.length,
    progressPct: 55,
  });

  return passed;
}

async function sentimentLayer(testRunId: string, assets: AssetCandidate[]): Promise<AssetCandidate[]> {
  const results = await orchestrateLayer(testRunId, "sentiment", assets);
  const aggregated = aggregateLayerResults(results);

  for (const asset of aggregated) {
    await db
      .update(assetScoresTable)
      .set({
        sentimentScore: asset.score,
        updatedAt: new Date(),
      })
      .where(and(eq(assetScoresTable.testRunId, testRunId), eq(assetScoresTable.assetId, asset.assetId)));
  }

  const ranked = aggregated
    .sort((a, b) => b.score - a.score)
    .map((asset) => ({
      assetId: asset.assetId,
      symbol: asset.symbol,
      technicalScore: assets.find((candidate) => candidate.assetId === asset.assetId)?.technicalScore,
      fundamentalScore: assets.find((candidate) => candidate.assetId === asset.assetId)?.fundamentalScore,
      sentimentScore: asset.score,
    }));

  await updateDetailedRun(testRunId, {
    sentimentPassCount: ranked.length,
    sentimentAvgScore: average(ranked.map((asset) => asset.sentimentScore ?? 0)),
    progressPct: 75,
  });

  return ranked;
}

async function executionLayer(testRunId: string, assets: AssetCandidate[]): Promise<AssetCandidate[]> {
  const scored = assets.map((asset) => ({
    ...asset,
    executionScore: scoreSymbol(asset.symbol, 53),
  }));

  const ranked = scored
    .map((asset) => ({
      ...asset,
      compositeScore: average([asset.sentimentScore ?? 0, asset.executionScore ?? 0]),
    }))
    .sort((a, b) => b.compositeScore - a.compositeScore);

  for (const [index, asset] of ranked.entries()) {
    await db
      .update(assetScoresTable)
      .set({
        executionScore: asset.executionScore,
        compositeScore: asset.compositeScore,
        compositeRank: index + 1,
        updatedAt: new Date(),
      })
      .where(and(eq(assetScoresTable.testRunId, testRunId), eq(assetScoresTable.assetId, asset.assetId)));
  }

  await updateDetailedRun(testRunId, {
    executionAvgScore: average(scored.map((asset) => asset.executionScore ?? 0)),
    progressPct: 95,
  });

  return ranked;
}

async function orchestrateLayer(
  testRunId: string,
  layer: BotLayer,
  assets: AssetCandidate[]
): Promise<BotResult[]> {
  const groups = LAYER_GROUPS[layer];
  const botPromises = groups.map((group, groupIndex) =>
    runVirtualBot({
      testRunId,
      botId: `${layer}-bot-${groupIndex + 1}`,
      layer,
      metricGroup: group,
      assets,
    })
  );

  return (await Promise.all(botPromises)).flat();
}

async function runVirtualBot(options: {
  testRunId: string;
  botId: string;
  layer: BotLayer;
  metricGroup: MetricGroupConfig;
  assets: AssetCandidate[];
}): Promise<BotResult[]> {
  const results = options.assets.map((asset) => {
    const score = scoreSymbol(asset.symbol, options.metricGroup.salt);
    return {
      assetId: asset.assetId,
      symbol: asset.symbol,
      layer: options.layer,
      metricGroupId: options.metricGroup.id,
      score,
      status: score >= options.metricGroup.threshold ? ("pass" as const) : ("fail" as const),
    };
  });

  if (results.length > 0) {
    await db.insert(botEventsTable).values(
      results.map((result) => ({
        id: randomUUID(),
        testRunId: options.testRunId,
        botId: options.botId,
        assetId: result.assetId,
        symbol: result.symbol,
        metricGroupId: result.metricGroupId,
        layer: options.layer,
        status: result.status,
        resultJson: {
          layer: result.layer,
          symbol: result.symbol,
          score: result.score,
          threshold: options.metricGroup.threshold,
          evaluatedAt: new Date().toISOString(),
        },
      }))
    );
  }

  return results;
}

function aggregateLayerResults(results: BotResult[]): Array<BotResult & { status: "pass" | "fail" }> {
  const byAsset = new Map<string, BotResult[]>();
  for (const result of results) {
    const current = byAsset.get(result.assetId) ?? [];
    current.push(result);
    byAsset.set(result.assetId, current);
  }

  return Array.from(byAsset.values()).map((assetResults) => {
    const best = assetResults.reduce((winner, result) => (result.score > winner.score ? result : winner));
    const passed = assetResults.some((result) => result.status === "pass");
    return {
      ...best,
      status: passed ? "pass" : "fail",
      score: average(assetResults.map((result) => result.score)),
    };
  });
}

async function markRunLayer(testRunId: string, layer: PipelineLayer, progressPct: number): Promise<void> {
  await updateDetailedRun(testRunId, {
    status: "running",
    currentLayer: layer,
    progressPct,
  });
  await db
    .update(testRunsTable)
    .set({ status: "running", currentStage: layer, progressPct })
    .where(eq(testRunsTable.id, testRunId));
}

async function updateDetailedRun(
  testRunId: string,
  values: Partial<typeof testRunsDetailedTable.$inferInsert>
): Promise<void> {
  await db
    .update(testRunsDetailedTable)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(testRunsDetailedTable.testRunId, testRunId));
}

async function completeRun(testRunId: string): Promise<void> {
  const completedAt = new Date();
  await updateDetailedRun(testRunId, {
    paperAvgScore: null,
    status: "completed",
    currentLayer: "completed",
    progressPct: 100,
    completedAt,
  });
  await db
    .update(testRunsTable)
    .set({ status: "completed", currentStage: "completed", progressPct: 100, completedAt })
    .where(eq(testRunsTable.id, testRunId));
}

async function failRun(testRunId: string, err: unknown): Promise<void> {
  const message = err instanceof Error ? err.message : "Unknown pipeline error";
  await updateDetailedRun(testRunId, {
    status: "failed",
    currentLayer: "failed",
    progressPct: 100,
    completedAt: new Date(),
  });
  await db
    .update(testRunsTable)
    .set({ status: "failed", currentStage: `failed: ${message}`, completedAt: new Date() })
    .where(eq(testRunsTable.id, testRunId));
}

function scoreSymbol(symbol: string, salt: number): number {
  const hash = Array.from(symbol).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + salt), 0);
  return Math.round(30 + (hash % 70));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}
