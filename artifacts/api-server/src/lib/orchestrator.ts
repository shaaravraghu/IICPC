import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import {
  assetScoresTable,
  botEventsTable,
  db,
  testRunsDetailedTable,
  testRunsTable,
} from "@workspace/db";
import {
  TECHNICAL_METRIC_GROUPS,
  technicalBot,
  type TechnicalBotResult,
} from "./bots/technicalBot";
import {
  FUNDAMENTAL_METRIC_GROUPS,
  fundamentalBot,
  type FundamentalBotResult,
} from "./bots/fundamentalBot";
import {
  SENTIMENT_METHOD_GROUPS,
  sentimentBot,
  type SentimentBotResult,
} from "./bots/sentimentBot";
import { simulateExecution } from "./executionSimulator";
import { logger } from "./logger";

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
type AssetCandidate = {
  assetId: string;
  symbol: string;
  technicalScore?: number;
  fundamentalScore?: number;
  sentimentScore?: number;
  executionScore?: number;
};
type LayerBotResult = TechnicalBotResult | FundamentalBotResult | SentimentBotResult;
type AggregatedLayerResult = {
  assetId: string;
  symbol: string;
  layer: LayerBotResult["layer"];
  metricGroupId: string;
  score: number;
  status: "pass" | "fail";
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
  const validSymbols = assets.map((symbol) => symbol.trim().toUpperCase()).filter(isValidAssetSymbol);
  if (validSymbols.length === 0) {
    throw new Error("No valid assets provided for execution pipeline");
  }
  const candidates = validSymbols.map((symbol) => ({ assetId: symbol, symbol }));

  try {
    await markRunLayer(testRunId, "technical", 10);
    const technicalPassed = await measureLayer(testRunId, "technical", () => technicalLayer(testRunId, candidates));

    await markRunLayer(testRunId, "fundamental", 35);
    const fundamentalPassed = await measureLayer(testRunId, "fundamental", () => fundamentalLayer(testRunId, technicalPassed));

    await markRunLayer(testRunId, "sentiment", 60);
    const sentimentRanked = await measureLayer(testRunId, "sentiment", () => sentimentLayer(testRunId, fundamentalPassed));

    await markRunLayer(testRunId, "execution", 80);
    const executionRanked = await measureLayer(testRunId, "execution", () => executionLayer(testRunId, sentimentRanked));

    await markRunLayer(testRunId, "paper", 98);
    await completeRun(testRunId);

    return executionRanked;
  } catch (err) {
    await failRun(testRunId, err);
    throw err;
  }
}

async function technicalLayer(testRunId: string, assets: AssetCandidate[]): Promise<AssetCandidate[]> {
  const results = (
    await Promise.all(
      TECHNICAL_METRIC_GROUPS.map(async (group, groupIndex) => {
        const botResults = await technicalBot(assets, group);
        await insertBotResults(testRunId, `technical-bot-${groupIndex + 1}`, botResults);
        return botResults;
      })
    )
  ).flat();
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
  const results = (
    await Promise.all(
      FUNDAMENTAL_METRIC_GROUPS.map(async (group, groupIndex) => {
        const botResults = await fundamentalBot(assets, group);
        await insertBotResults(testRunId, `fundamental-bot-${groupIndex + 1}`, botResults);
        return botResults;
      })
    )
  ).flat();
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
  const results = (
    await Promise.all(
      SENTIMENT_METHOD_GROUPS.map(async (group, groupIndex) => {
        const botResults = await sentimentBot(assets, group);
        await insertBotResults(testRunId, `sentiment-bot-${groupIndex + 1}`, botResults);
        return botResults;
      })
    )
  ).flat();
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
  const simulations = await Promise.all(
    assets.map((asset) =>
      simulateExecution({
        assetId: asset.assetId,
        symbol: asset.symbol,
        sentimentScore: asset.sentimentScore,
      })
    )
  );
  await insertExecutionEvents(testRunId, simulations);

  const scored = assets.map((asset) => {
    const simulation = simulations.find((result) => result.assetId === asset.assetId);
    return {
      ...asset,
      executionScore: simulation?.executionScore ?? 0,
      executionMetrics: simulation?.metrics,
      executionTrades: simulation?.trades ?? [],
    };
  });

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

async function insertExecutionEvents(
  testRunId: string,
  simulations: Array<Awaited<ReturnType<typeof simulateExecution>>>
): Promise<void> {
  if (simulations.length === 0) return;

  await db.insert(botEventsTable).values(
    simulations.map((simulation, index) => ({
      id: randomUUID(),
      testRunId,
      botId: `execution-sim-${index + 1}`,
      assetId: simulation.assetId,
      symbol: simulation.symbol,
      metricGroupId: "execution-historical-simulation",
      layer: "execution",
      status: "completed",
      resultJson: {
        score: simulation.executionScore,
        metrics: simulation.metrics,
        trades: simulation.trades,
        evaluatedAt: new Date().toISOString(),
      },
    }))
  );
}

async function measureLayer<T>(testRunId: string, layer: PipelineLayer, work: () => Promise<T>): Promise<T> {
  const startedAt = performance.now();
  try {
    const result = await work();
    const latencyMs = Math.round((performance.now() - startedAt) * 100) / 100;
    await insertLayerTelemetryEvent(testRunId, layer, "completed", latencyMs);
    logger.info({ testRunId, layer, latencyMs }, "Pipeline layer completed");
    return result;
  } catch (err) {
    const latencyMs = Math.round((performance.now() - startedAt) * 100) / 100;
    await insertLayerTelemetryEvent(testRunId, layer, "failed", latencyMs);
    logger.error({ err, testRunId, layer, latencyMs }, "Pipeline layer failed");
    throw err;
  }
}

async function insertLayerTelemetryEvent(
  testRunId: string,
  layer: PipelineLayer,
  status: "completed" | "failed",
  latencyMs: number
): Promise<void> {
  await db.insert(botEventsTable).values({
    id: randomUUID(),
    testRunId,
    botId: `${layer}-latency-monitor`,
    assetId: "pipeline",
    symbol: null,
    metricGroupId: `${layer}-latency`,
    layer,
    status,
    resultJson: {
      latencyMs,
      p50LatencyMs: latencyMs,
      p90LatencyMs: latencyMs,
      p99LatencyMs: latencyMs,
      measuredAt: new Date().toISOString(),
    },
  });
}

async function insertBotResults(testRunId: string, botId: string, results: LayerBotResult[]): Promise<void> {
  if (results.length === 0) return;

  await db.insert(botEventsTable).values(
    results.map((result) => ({
      id: randomUUID(),
      testRunId,
      botId,
      assetId: result.assetId,
      symbol: result.symbol,
      metricGroupId: result.metricGroupId,
      layer: result.layer,
      status: result.status,
      resultJson: {
        layer: result.layer,
        symbol: result.symbol,
        score: result.score,
        metricResults: "metricResults" in result ? result.metricResults : undefined,
        methodResults: "methodResults" in result ? result.methodResults : undefined,
        rawWeightedScore: "rawWeightedScore" in result ? result.rawWeightedScore : undefined,
        evaluatedAt: new Date().toISOString(),
      },
    }))
  );
}

function aggregateLayerResults(results: LayerBotResult[]): AggregatedLayerResult[] {
  const byAsset = new Map<string, LayerBotResult[]>();
  for (const result of results) {
    const current = byAsset.get(result.assetId) ?? [];
    current.push(result);
    byAsset.set(result.assetId, current);
  }

  return Array.from(byAsset.values()).map((assetResults) => {
    const best = assetResults.reduce((winner, result) => (result.score > winner.score ? result : winner));
    const passed = assetResults.some((result) => result.status === "pass");
    return {
      assetId: best.assetId,
      symbol: best.symbol,
      layer: best.layer,
      metricGroupId: best.metricGroupId,
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
  logger.error({ err, testRunId }, "Execution pipeline failed");
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

function isValidAssetSymbol(symbol: string): boolean {
  return /^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}
