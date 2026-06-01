import { db, functionsTable } from "@workspace/db";
import { randomUUID } from "crypto";

const functions = [
  // Technical Analysis
  {
    id: randomUUID(),
    name: "rsi",
    category: "technical",
    description: "Relative Strength Index — momentum oscillator measuring speed and magnitude of price changes.",
    signature: "rsi(prices: number[], period?: number): number",
    codeExample: `const prices = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.10, 45.15];
const result = rsi(prices, 14);
// result => 70.46 (overbought territory)`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Array of closing prices" },
      { name: "period", type: "number", description: "Lookback period", optional: true },
    ]),
    returns: "RSI value between 0 and 100",
    tagsJson: JSON.stringify(["momentum", "oscillator", "overbought", "oversold"]),
  },
  {
    id: randomUUID(),
    name: "sma",
    category: "technical",
    description: "Simple Moving Average — arithmetic mean of a given set of prices over a specific period.",
    signature: "sma(prices: number[], period: number): number",
    codeExample: `const prices = [10, 20, 30, 40, 50];
const result = sma(prices, 5);
// result => 30`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Array of prices" },
      { name: "period", type: "number", description: "Averaging period" },
    ]),
    returns: "Moving average value",
    tagsJson: JSON.stringify(["average", "trend", "filter"]),
  },
  {
    id: randomUUID(),
    name: "ema",
    category: "technical",
    description: "Exponential Moving Average — weighted moving average that gives more weight to recent prices.",
    signature: "ema(prices: number[], period: number): number",
    codeExample: `const prices = [22.27, 22.19, 22.08, 22.17, 22.18, 22.13];
const result = ema(prices, 10);
// result => 22.22`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Historical prices" },
      { name: "period", type: "number", description: "EMA span" },
    ]),
    returns: "EMA value",
    tagsJson: JSON.stringify(["average", "trend", "weighted"]),
  },
  {
    id: randomUUID(),
    name: "macd",
    category: "technical",
    description: "Moving Average Convergence Divergence — trend-following momentum indicator.",
    signature: "macd(prices: number[], fast?: number, slow?: number, signal?: number): { macd: number; signal: number; histogram: number }",
    codeExample: `const { macd: m, signal: s, histogram: h } = macd(prices, 12, 26, 9);
if (m > s) console.log('Bullish crossover');`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Closing prices" },
      { name: "fast", type: "number", description: "Fast EMA period (default 12)", optional: true },
      { name: "slow", type: "number", description: "Slow EMA period (default 26)", optional: true },
      { name: "signal", type: "number", description: "Signal line period (default 9)", optional: true },
    ]),
    returns: "Object with macd, signal, and histogram values",
    tagsJson: JSON.stringify(["momentum", "trend", "crossover"]),
  },
  {
    id: randomUUID(),
    name: "bollinger_bands",
    category: "technical",
    description: "Bollinger Bands — volatility bands placed above and below a moving average.",
    signature: "bollinger_bands(prices: number[], period?: number, stdDev?: number): { upper: number; middle: number; lower: number }",
    codeExample: `const { upper, middle, lower } = bollinger_bands(prices, 20, 2);
const bandwidth = (upper - lower) / middle;`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Price series" },
      { name: "period", type: "number", description: "Period for middle band (default 20)", optional: true },
      { name: "stdDev", type: "number", description: "Standard deviation multiplier (default 2)", optional: true },
    ]),
    returns: "Object with upper, middle, lower band values",
    tagsJson: JSON.stringify(["volatility", "bands", "mean-reversion"]),
  },
  {
    id: randomUUID(),
    name: "vwap",
    category: "technical",
    description: "Volume-Weighted Average Price — average price weighted by volume, used as benchmark.",
    signature: "vwap(candles: Array<{ high: number; low: number; close: number; volume: number }>): number",
    codeExample: `const candles = [
  { high: 48.70, low: 47.79, close: 48.16, volume: 1120000 },
  { high: 48.72, low: 47.97, close: 48.61, volume: 1560000 },
];
const result = vwap(candles); // => 48.40`,
    parametersJson: JSON.stringify([
      { name: "candles", type: "Array<Candle>", description: "Array of OHLCV candle objects" },
    ]),
    returns: "VWAP value",
    tagsJson: JSON.stringify(["volume", "price", "benchmark", "institutional"]),
  },

  // Fundamental Analysis
  {
    id: randomUUID(),
    name: "z_score",
    category: "fundamental",
    description: "Statistical Z-score — measures how many standard deviations a value is from the mean.",
    signature: "z_score(value: number, series: number[]): number",
    codeExample: `const series = [2.1, 2.3, 2.0, 2.5, 1.9, 2.2];
const score = z_score(3.1, series); // => 2.87 (outlier)`,
    parametersJson: JSON.stringify([
      { name: "value", type: "number", description: "Value to score" },
      { name: "series", type: "number[]", description: "Historical series for mean/std computation" },
    ]),
    returns: "Z-score (signed)",
    tagsJson: JSON.stringify(["statistics", "normalization", "outlier"]),
  },
  {
    id: randomUUID(),
    name: "sharpe_ratio",
    category: "fundamental",
    description: "Sharpe Ratio — risk-adjusted return metric comparing excess return to standard deviation.",
    signature: "sharpe_ratio(returns: number[], riskFreeRate?: number): number",
    codeExample: `const monthly_returns = [0.05, -0.02, 0.07, 0.03, -0.01, 0.06];
const ratio = sharpe_ratio(monthly_returns, 0.001);
// ratio => 1.42`,
    parametersJson: JSON.stringify([
      { name: "returns", type: "number[]", description: "Array of periodic returns" },
      { name: "riskFreeRate", type: "number", description: "Risk-free rate per period (default 0)", optional: true },
    ]),
    returns: "Sharpe ratio",
    tagsJson: JSON.stringify(["risk", "performance", "return"]),
  },
  {
    id: randomUUID(),
    name: "correlation",
    category: "fundamental",
    description: "Pearson correlation coefficient between two time series.",
    signature: "correlation(seriesA: number[], seriesB: number[]): number",
    codeExample: `const corr = correlation(priceA, priceB);
if (Math.abs(corr) > 0.8) console.log('Highly correlated');`,
    parametersJson: JSON.stringify([
      { name: "seriesA", type: "number[]", description: "First series" },
      { name: "seriesB", type: "number[]", description: "Second series" },
    ]),
    returns: "Correlation coefficient between -1 and 1",
    tagsJson: JSON.stringify(["statistics", "pairs-trading", "relationship"]),
  },

  // Sentiment
  {
    id: randomUUID(),
    name: "fear_greed_index",
    category: "sentiment",
    description: "Composite market sentiment score derived from volatility, momentum, breadth, and put/call ratio.",
    signature: "fear_greed_index(inputs: { vix: number; momentum: number; breadth: number; putCallRatio: number }): number",
    codeExample: `const score = fear_greed_index({
  vix: 18.5,
  momentum: 0.62,
  breadth: 0.71,
  putCallRatio: 0.82,
});
// score => 68 (Greed)`,
    parametersJson: JSON.stringify([
      { name: "inputs.vix", type: "number", description: "VIX volatility index" },
      { name: "inputs.momentum", type: "number", description: "Price momentum 0-1" },
      { name: "inputs.breadth", type: "number", description: "Market breadth 0-1" },
      { name: "inputs.putCallRatio", type: "number", description: "Put/call ratio" },
    ]),
    returns: "Score 0-100 (0=extreme fear, 100=extreme greed)",
    tagsJson: JSON.stringify(["sentiment", "composite", "vix"]),
  },
  {
    id: randomUUID(),
    name: "news_sentiment_score",
    category: "sentiment",
    description: "Aggregate sentiment score from a list of news headlines using VADER-style lexical analysis.",
    signature: "news_sentiment_score(headlines: string[]): { score: number; label: 'bearish' | 'neutral' | 'bullish' }",
    codeExample: `const result = news_sentiment_score([
  'Fed signals rate cut ahead',
  'Earnings beat expectations significantly',
]);
// result => { score: 0.72, label: 'bullish' }`,
    parametersJson: JSON.stringify([
      { name: "headlines", type: "string[]", description: "Array of news headline strings" },
    ]),
    returns: "Object with numeric score and categorical label",
    tagsJson: JSON.stringify(["nlp", "news", "sentiment", "text"]),
  },

  // Orderbook
  {
    id: randomUUID(),
    name: "order_imbalance",
    category: "orderbook",
    description: "Measures the imbalance between bid and ask volume at the top N levels of the orderbook.",
    signature: "order_imbalance(bids: Array<[price: number, qty: number]>, asks: Array<[price: number, qty: number]>, levels?: number): number",
    codeExample: `const bids = [[100.0, 500], [99.9, 300], [99.8, 200]];
const asks = [[100.1, 400], [100.2, 600], [100.3, 100]];
const oi = order_imbalance(bids, asks, 3);
// oi => 0.09 (slight buy pressure)`,
    parametersJson: JSON.stringify([
      { name: "bids", type: "Array<[number, number]>", description: "Bid levels [price, qty]" },
      { name: "asks", type: "Array<[number, number]>", description: "Ask levels [price, qty]" },
      { name: "levels", type: "number", description: "Number of levels to consider (default 5)", optional: true },
    ]),
    returns: "Imbalance ratio in range [-1, 1]",
    tagsJson: JSON.stringify(["orderbook", "microstructure", "pressure", "L2"]),
  },
  {
    id: randomUUID(),
    name: "mid_price",
    category: "orderbook",
    description: "Computes the mid-price as the arithmetic mean of best bid and ask.",
    signature: "mid_price(bestBid: number, bestAsk: number): number",
    codeExample: `const mid = mid_price(100.0, 100.1); // => 100.05`,
    parametersJson: JSON.stringify([
      { name: "bestBid", type: "number", description: "Best bid price" },
      { name: "bestAsk", type: "number", description: "Best ask price" },
    ]),
    returns: "Mid price",
    tagsJson: JSON.stringify(["orderbook", "price", "spread"]),
  },
  {
    id: randomUUID(),
    name: "spread_bps",
    category: "orderbook",
    description: "Calculates the bid-ask spread in basis points relative to mid price.",
    signature: "spread_bps(bestBid: number, bestAsk: number): number",
    codeExample: `const bps = spread_bps(100.0, 100.1);
// bps => 1.0 (1 basis point)`,
    parametersJson: JSON.stringify([
      { name: "bestBid", type: "number", description: "Best bid price" },
      { name: "bestAsk", type: "number", description: "Best ask price" },
    ]),
    returns: "Spread in basis points",
    tagsJson: JSON.stringify(["orderbook", "spread", "liquidity", "cost"]),
  },
  {
    id: randomUUID(),
    name: "book_depth",
    category: "orderbook",
    description: "Computes cumulative volume at each price level within a tick range from mid.",
    signature: "book_depth(side: 'bid' | 'ask', levels: Array<[price: number, qty: number]>, maxTicksFromMid: number): number",
    codeExample: `const depth = book_depth('bid', bidLevels, 10);
// depth => 15000 (cumulative bid volume within 10 ticks)`,
    parametersJson: JSON.stringify([
      { name: "side", type: "'bid' | 'ask'", description: "Which side to measure" },
      { name: "levels", type: "Array<[number, number]>", description: "Price levels" },
      { name: "maxTicksFromMid", type: "number", description: "Depth range in ticks" },
    ]),
    returns: "Cumulative volume",
    tagsJson: JSON.stringify(["orderbook", "depth", "liquidity", "L2"]),
  },

  // Utility
  {
    id: randomUUID(),
    name: "clamp",
    category: "utility",
    description: "Clamps a numeric value to a specified [min, max] range.",
    signature: "clamp(value: number, min: number, max: number): number",
    codeExample: `clamp(150, 0, 100); // => 100
clamp(-5, 0, 100);  // => 0
clamp(42, 0, 100);  // => 42`,
    parametersJson: JSON.stringify([
      { name: "value", type: "number", description: "Input value" },
      { name: "min", type: "number", description: "Minimum bound" },
      { name: "max", type: "number", description: "Maximum bound" },
    ]),
    returns: "Clamped value",
    tagsJson: JSON.stringify(["math", "bounds", "normalization"]),
  },
  {
    id: randomUUID(),
    name: "round_tick",
    category: "utility",
    description: "Rounds a price to the nearest valid tick size.",
    signature: "round_tick(price: number, tickSize: number): number",
    codeExample: `round_tick(100.037, 0.05); // => 100.05
round_tick(99.963, 0.05); // => 99.95`,
    parametersJson: JSON.stringify([
      { name: "price", type: "number", description: "Raw price" },
      { name: "tickSize", type: "number", description: "Minimum price increment" },
    ]),
    returns: "Price rounded to nearest tick",
    tagsJson: JSON.stringify(["price", "tick", "exchange", "precision"]),
  },
];

async function seed() {
  console.log(`Seeding ${functions.length} functions...`);

  for (const fn of functions) {
    await db
      .insert(functionsTable)
      .values(fn)
      .onConflictDoNothing();
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
