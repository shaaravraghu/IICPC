import { fetchHistoricalData } from "./marketDataFetcher";

export type PaperTradingAsset = {
  assetScoreId: string;
  assetId: string;
  symbol: string;
  sentimentScore?: number | null;
  executionScore?: number | null;
};

export type PaperTradingPosition = {
  assetScoreId: string;
  symbol: string;
  side: "long";
  quantity: number;
  entryPrice: number;
  entryTime: Date;
  exitPrice: number | null;
  exitTime: Date | null;
  pnl: number;
  pnlPct: number;
  status: "open" | "closed";
};

export type PaperTradingMetrics = {
  totalReturnPct: number;
  winRate: number;
  maxDrawdown: number;
  finalEquity: number;
};

export type PaperTradingSimulationResult = {
  paperScore: number;
  metrics: PaperTradingMetrics;
  positions: PaperTradingPosition[];
};

export type PaperTradingOptions = {
  initialCapital: number;
  timeline: string;
  maxPositionPct?: number;
};

export async function simulatePaperTrading(
  assets: PaperTradingAsset[],
  options: PaperTradingOptions
): Promise<PaperTradingSimulationResult> {
  const selectedAssets = assets.filter((asset) => (asset.executionScore ?? 0) > 0);
  const capital = options.initialCapital;
  const maxPositionPct = options.maxPositionPct ?? 0.2;
  const entryTime = new Date();
  const exitTime = options.timeline === "open" ? null : timelineExit(entryTime, options.timeline);
  const totalExecutionScore = selectedAssets.reduce((sum, asset) => sum + (asset.executionScore ?? 0), 0);

  const positions = await Promise.all(
    selectedAssets.map(async (asset, index) => {
      const bars = await fetchHistoricalData(asset.symbol, {
        interval: "daily",
        yearsBack: 1,
        cache: true,
      });
      const entryPrice = latestClose(bars);
      const exitPrice = options.timeline === "open"
        ? simulateForwardPrice(asset.symbol, entryPrice, index, 1)
        : simulateForwardPrice(asset.symbol, entryPrice, index, timelineDays(options.timeline));
      const targetWeight = totalExecutionScore === 0
        ? 1 / selectedAssets.length
        : (asset.executionScore ?? 0) / totalExecutionScore;
      const positionCapital = Math.min(capital * maxPositionPct, capital * targetWeight);
      const quantity = round(positionCapital / entryPrice);
      const pnl = round((exitPrice - entryPrice) * quantity);
      const pnlPct = entryPrice === 0 ? 0 : round(((exitPrice - entryPrice) / entryPrice) * 100);

      return {
        assetScoreId: asset.assetScoreId,
        symbol: asset.symbol,
        side: "long" as const,
        quantity,
        entryPrice: round(entryPrice),
        entryTime,
        exitPrice: round(exitPrice),
        exitTime,
        pnl,
        pnlPct,
        status: options.timeline === "open" ? "open" as const : "closed" as const,
      };
    })
  );

  const metrics = calculatePaperMetrics(capital, positions);
  const paperScore = normalizePaperScore(metrics);

  return {
    paperScore,
    metrics,
    positions,
  };
}

function calculatePaperMetrics(initialCapital: number, positions: PaperTradingPosition[]): PaperTradingMetrics {
  const totalPnl = positions.reduce((sum, position) => sum + position.pnl, 0);
  const finalEquity = initialCapital + totalPnl;
  const winners = positions.filter((position) => position.pnl > 0).length;

  return {
    totalReturnPct: round((totalPnl / initialCapital) * 100),
    winRate: positions.length === 0 ? 0 : round((winners / positions.length) * 100),
    maxDrawdown: calculatePositionDrawdown(initialCapital, positions),
    finalEquity: round(finalEquity),
  };
}

function normalizePaperScore(metrics: PaperTradingMetrics): number {
  const returnScore = clamp(50 + metrics.totalReturnPct * 6, 0, 100);
  const winRateScore = clamp(metrics.winRate, 0, 100);
  const drawdownScore = clamp(100 - Math.abs(metrics.maxDrawdown) * 5, 0, 100);

  return round(returnScore * 0.45 + winRateScore * 0.35 + drawdownScore * 0.2);
}

function calculatePositionDrawdown(initialCapital: number, positions: PaperTradingPosition[]): number {
  let equity = initialCapital;
  let peak = initialCapital;
  let maxDrawdown = 0;

  for (const position of positions) {
    equity += position.pnl;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.min(maxDrawdown, ((equity - peak) / peak) * 100);
  }

  return round(maxDrawdown);
}

function latestClose(bars: Array<{ close: number }>): number {
  return bars.at(-1)?.close ?? 100;
}

function simulateForwardPrice(symbol: string, entryPrice: number, index: number, days: number): number {
  const hash = Array.from(symbol).reduce((sum, char, charIndex) => sum + char.charCodeAt(0) * (charIndex + 17), index);
  const direction = hash % 2 === 0 ? 1 : -1;
  const magnitude = ((hash % 900) / 100) + days * 0.08;
  const boundedMovePct = clamp(direction * magnitude, -18, 24);
  return Math.max(0.01, entryPrice * (1 + boundedMovePct / 100));
}

function timelineExit(start: Date, timeline: string): Date {
  return new Date(start.getTime() + timelineDays(timeline) * 24 * 60 * 60 * 1000);
}

function timelineDays(timeline: string): number {
  const match = /^(\d+)\s*d$/i.exec(timeline.trim());
  if (!match) return 7;
  return Math.max(1, Number(match[1]));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
