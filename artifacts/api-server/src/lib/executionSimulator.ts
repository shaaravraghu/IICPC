import { fetchHistoricalData, type HistoricalBar } from "./marketDataFetcher";

export type ExecutionAsset = {
  assetId: string;
  symbol: string;
  sentimentScore?: number;
};

export type SimulatedTrade = {
  horizon: "intraday" | "short" | "medium" | "long";
  label: string;
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  returnPct: number;
  pnl: number;
};

export type ExecutionMetrics = {
  maxReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
};

export type ExecutionSimulationResult = {
  assetId: string;
  symbol: string;
  executionScore: number;
  metrics: ExecutionMetrics;
  trades: SimulatedTrade[];
};

const INITIAL_CAPITAL = 10_000;

export async function simulateExecution(asset: ExecutionAsset): Promise<ExecutionSimulationResult> {
  const [dailyBars, intradayBars] = await Promise.all([
    fetchHistoricalData(asset.symbol, { interval: "daily", yearsBack: 5, cache: true }),
    fetchHistoricalData(asset.symbol, { interval: "5min", yearsBack: 1, cache: true }),
  ]);

  const trades = [
    ...sampleIntradayTrades(asset.symbol, intradayBars.length > 20 ? intradayBars : dailyBars),
    ...sampleTermTrades(dailyBars),
  ];
  const metrics = calculateExecutionMetrics(trades);
  const executionScore = normalizeExecutionScore(metrics, asset.sentimentScore);

  return {
    assetId: asset.assetId,
    symbol: asset.symbol,
    executionScore,
    metrics,
    trades,
  };
}

function sampleIntradayTrades(symbol: string, bars: HistoricalBar[]): SimulatedTrade[] {
  const windows = [
    { label: "intraday-1h", bars: 12 },
    { label: "intraday-4h", bars: 48 },
    { label: "intraday-1d", bars: 78 },
    { label: "intraday-random-a", bars: 24 },
    { label: "intraday-random-b", bars: 36 },
  ];

  return windows.map((window, index) => {
    const maxStart = Math.max(0, bars.length - window.bars - 1);
    const start = maxStart === 0 ? 0 : seededIndex(symbol, index + 301, maxStart);
    return createTrade("intraday", window.label, bars, start, Math.min(start + window.bars, bars.length - 1));
  });
}

function sampleTermTrades(bars: HistoricalBar[]): SimulatedTrade[] {
  const windows = [
    { horizon: "short" as const, label: "short-5d", days: 5 },
    { horizon: "medium" as const, label: "medium-20d", days: 20 },
    { horizon: "long" as const, label: "long-60d", days: 60 },
  ];

  return windows.map((window, index) => {
    const maxStart = Math.max(0, bars.length - window.days - 1);
    const start = maxStart === 0 ? 0 : seededIndex(`${bars[0]?.symbol ?? "asset"}:${window.label}`, index + 401, maxStart);
    return createTrade(window.horizon, window.label, bars, start, Math.min(start + window.days, bars.length - 1));
  });
}

function createTrade(
  horizon: SimulatedTrade["horizon"],
  label: string,
  bars: HistoricalBar[],
  start: number,
  end: number
): SimulatedTrade {
  const entry = bars[start] ?? fallbackBar();
  const exit = bars[end] ?? entry;
  const returnPct = entry.close === 0 ? 0 : ((exit.close - entry.close) / entry.close) * 100;
  const pnl = (returnPct / 100) * INITIAL_CAPITAL;

  return {
    horizon,
    label,
    entryTime: entry.date.toISOString(),
    exitTime: exit.date.toISOString(),
    entryPrice: round(entry.close),
    exitPrice: round(exit.close),
    returnPct: round(returnPct),
    pnl: round(pnl),
  };
}

function calculateExecutionMetrics(trades: SimulatedTrade[]): ExecutionMetrics {
  if (trades.length === 0) {
    return {
      maxReturn: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      winRate: 0,
      profitFactor: 0,
    };
  }

  const returns = trades.map((trade) => trade.returnPct);
  const winners = trades.filter((trade) => trade.pnl > 0);
  const losers = trades.filter((trade) => trade.pnl < 0);
  const grossProfit = winners.reduce((sum, trade) => sum + trade.pnl, 0);
  const grossLoss = Math.abs(losers.reduce((sum, trade) => sum + trade.pnl, 0));
  const mean = average(returns);
  const standardDeviation = stddev(returns, mean);

  return {
    maxReturn: round(Math.max(...returns)),
    sharpeRatio: round(standardDeviation === 0 ? 0 : mean / standardDeviation),
    maxDrawdown: round(calculateMaxDrawdown(trades)),
    winRate: round((winners.length / trades.length) * 100),
    profitFactor: round(grossLoss === 0 ? (grossProfit > 0 ? 4 : 0) : grossProfit / grossLoss),
  };
}

function normalizeExecutionScore(metrics: ExecutionMetrics, sentimentScore = 50): number {
  const maxReturnScore = clamp(50 + metrics.maxReturn * 5, 0, 100);
  const sharpeScore = clamp(50 + metrics.sharpeRatio * 20, 0, 100);
  const drawdownScore = clamp(100 - Math.abs(metrics.maxDrawdown) * 4, 0, 100);
  const winRateScore = clamp(metrics.winRate, 0, 100);
  const profitFactorScore = clamp(metrics.profitFactor * 25, 0, 100);
  const sentimentStabilityBonus = clamp((sentimentScore - 50) * 0.1, -5, 5);

  return round(
    maxReturnScore * 0.25 +
      sharpeScore * 0.2 +
      drawdownScore * 0.2 +
      winRateScore * 0.2 +
      profitFactorScore * 0.15 +
      sentimentStabilityBonus
  );
}

function calculateMaxDrawdown(trades: SimulatedTrade[]): number {
  let equity = INITIAL_CAPITAL;
  let peak = INITIAL_CAPITAL;
  let maxDrawdown = 0;

  for (const trade of trades) {
    equity += trade.pnl;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.min(maxDrawdown, ((equity - peak) / peak) * 100);
  }

  return maxDrawdown;
}

function seededIndex(seed: string, salt: number, maxExclusive: number): number {
  const hash = Array.from(seed).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + salt), 0);
  return hash % Math.max(1, maxExclusive);
}

function fallbackBar(): HistoricalBar {
  return {
    symbol: "UNKNOWN",
    interval: "daily",
    date: new Date(),
    open: 100,
    high: 100,
    low: 100,
    close: 100,
    volume: 0,
    source: "fallback",
  };
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stddev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
