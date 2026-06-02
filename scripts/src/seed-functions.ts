import { db, functionsTable } from "@workspace/db";
import { randomUUID } from "crypto";

const functions = [
  // Technical Analysis
  {
    id: randomUUID(),
    name: "trend_strength_adx",
    category: "technical",
    description: "Average Directional Index used to determine whether a trend exists and how strong it is.",
    signature: "trend_strength_adx(highs: number[], lows: number[], closes: number[], period?: number): number",
    codeExample: `const adx = trend_strength_adx(highs, lows, closes, 14);
if (adx > 25) console.log("Strong trend");`,
    parametersJson: JSON.stringify([
      { name: "highs", type: "number[]", description: "High-price series" },
      { name: "lows", type: "number[]", description: "Low-price series" },
      { name: "closes", type: "number[]", description: "Close-price series" },
      { name: "period", type: "number", description: "Lookback period", optional: true },
    ]),
    returns: "ADX value between 0 and 100",
    tagsJson: JSON.stringify(["trend", "strength", "directional-movement"]),
  },
  {
    id: randomUUID(),
    name: "relative_strength_vs_benchmark",
    category: "technical",
    description: "Measures whether the asset is outperforming or underperforming a benchmark over the same lookback period.",
    signature: "relative_strength_vs_benchmark(prices: number[], benchmarkPrices: number[], period?: number): number",
    codeExample: `const spread = relative_strength_vs_benchmark(assetPrices, indexPrices, 20);
if (spread > 0) console.log("Outperforming benchmark");`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Asset close-price series" },
      { name: "benchmarkPrices", type: "number[]", description: "Benchmark close-price series" },
      { name: "period", type: "number", description: "Relative-strength lookback", optional: true },
    ]),
    returns: "Relative performance spread in percentage points",
    tagsJson: JSON.stringify(["relative-strength", "benchmark", "leadership"]),
  },
  {
    id: randomUUID(),
    name: "momentum_rate_of_change",
    category: "technical",
    description: "Measures the speed of price movement by comparing current price with price N periods ago.",
    signature: "momentum_rate_of_change(prices: number[], period?: number): number",
    codeExample: `const roc = momentum_rate_of_change(prices, 12);
if (roc > 0) console.log("Positive momentum");`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Ordered price series" },
      { name: "period", type: "number", description: "ROC lookback", optional: true },
    ]),
    returns: "Percentage rate of change",
    tagsJson: JSON.stringify(["momentum", "velocity", "roc"]),
  },
  {
    id: randomUUID(),
    name: "rsi_regime_analysis",
    category: "technical",
    description: "Uses RSI persistence rather than a single snapshot to detect sustained buying or selling pressure.",
    signature: "rsi_regime_analysis(prices: number[], period?: number): number",
    codeExample: `const regime = rsi_regime_analysis(prices, 14);
if (regime >= 60) console.log("Bullish RSI regime");`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Close-price series" },
      { name: "period", type: "number", description: "RSI lookback", optional: true },
    ]),
    returns: "Regime score between 0 and 100",
    tagsJson: JSON.stringify(["rsi", "regime", "pressure"]),
  },
  {
    id: randomUUID(),
    name: "macd_histogram_slope",
    category: "technical",
    description: "Measures momentum acceleration or deceleration by observing the slope of the MACD histogram.",
    signature: "macd_histogram_slope(prices: number[], fast?: number, slow?: number, signal?: number): number",
    codeExample: `const slope = macd_histogram_slope(prices, 12, 26, 9);
if (slope > 0) console.log("Momentum is accelerating");`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Close-price series" },
      { name: "fast", type: "number", description: "Fast EMA period", optional: true },
      { name: "slow", type: "number", description: "Slow EMA period", optional: true },
      { name: "signal", type: "number", description: "Signal EMA period", optional: true },
    ]),
    returns: "Signed slope value",
    tagsJson: JSON.stringify(["macd", "momentum", "acceleration"]),
  },
  {
    id: randomUUID(),
    name: "realized_volatility",
    category: "technical",
    description: "Computes observed market uncertainty from the standard deviation of actual realized returns.",
    signature: "realized_volatility(returns: number[], annualizationFactor?: number): number",
    codeExample: `const vol = realized_volatility(dailyReturns, 252);
if (vol > 30) console.log("High realized volatility");`,
    parametersJson: JSON.stringify([
      { name: "returns", type: "number[]", description: "Periodic return series" },
      { name: "annualizationFactor", type: "number", description: "Annualization factor such as 252", optional: true },
    ]),
    returns: "Annualized volatility percentage",
    tagsJson: JSON.stringify(["volatility", "risk", "realized"]),
  },
  {
    id: randomUUID(),
    name: "atr_expansion_contraction",
    category: "technical",
    description: "Detects volatility regime shifts by measuring whether Average True Range is expanding or contracting.",
    signature: "atr_expansion_contraction(highs: number[], lows: number[], closes: number[], period?: number): number",
    codeExample: `const regimeShift = atr_expansion_contraction(highs, lows, closes, 14);
if (regimeShift > 0) console.log("ATR expansion underway");`,
    parametersJson: JSON.stringify([
      { name: "highs", type: "number[]", description: "High-price series" },
      { name: "lows", type: "number[]", description: "Low-price series" },
      { name: "closes", type: "number[]", description: "Close-price series" },
      { name: "period", type: "number", description: "ATR lookback", optional: true },
    ]),
    returns: "Signed regime-shift score",
    tagsJson: JSON.stringify(["atr", "volatility", "regime"]),
  },
  {
    id: randomUUID(),
    name: "bollinger_band_width",
    category: "technical",
    description: "Measures compression and expansion phases using the width between upper and lower Bollinger Bands.",
    signature: "bollinger_band_width(prices: number[], period?: number, stdDev?: number): number",
    codeExample: `const width = bollinger_band_width(prices, 20, 2);
if (width < 0.05) console.log("Compression setup");`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Price series" },
      { name: "period", type: "number", description: "Band lookback", optional: true },
      { name: "stdDev", type: "number", description: "Standard deviation multiplier", optional: true },
    ]),
    returns: "Normalized band width ratio",
    tagsJson: JSON.stringify(["bollinger", "volatility", "compression"]),
  },
  {
    id: randomUUID(),
    name: "volume_profile",
    category: "technical",
    description: "Locates price levels that attracted the highest participation by distributing volume across price zones.",
    signature: "volume_profile(candles: Array<{ high: number; low: number; close: number; volume: number }>, levels?: number): Array<{ price: number; volume: number }>",
    codeExample: `const profile = volume_profile(candles, 12);
const poc = profile.sort((a, b) => b.volume - a.volume)[0];`,
    parametersJson: JSON.stringify([
      { name: "candles", type: "Array<Candle>", description: "OHLCV candle objects" },
      { name: "levels", type: "number", description: "Number of price bins", optional: true },
    ]),
    returns: "Array of price-volume buckets",
    tagsJson: JSON.stringify(["volume", "profile", "participation"]),
  },
  {
    id: randomUUID(),
    name: "vwap_distance",
    category: "technical",
    description: "Measures how far current price is trading from VWAP to estimate institutional positioning.",
    signature: "vwap_distance(candles: Array<{ high: number; low: number; close: number; volume: number }>): number",
    codeExample: `const distance = vwap_distance(sessionCandles);
if (distance > 1.5) console.log("Extended above VWAP");`,
    parametersJson: JSON.stringify([
      { name: "candles", type: "Array<Candle>", description: "Intraday or session candles" },
    ]),
    returns: "Percentage distance from VWAP",
    tagsJson: JSON.stringify(["vwap", "institutional", "extension"]),
  },
  {
    id: randomUUID(),
    name: "on_balance_volume",
    category: "technical",
    description: "Checks whether volume confirms the move by cumulatively adding or subtracting volume on up and down closes.",
    signature: "on_balance_volume(prices: number[], volumes: number[]): number",
    codeExample: `const obv = on_balance_volume(prices, volumes);
if (obv > previousObv) console.log("Volume confirms upside");`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Close-price series" },
      { name: "volumes", type: "number[]", description: "Volume series" },
    ]),
    returns: "Cumulative OBV value",
    tagsJson: JSON.stringify(["obv", "volume", "confirmation"]),
  },
  {
    id: randomUUID(),
    name: "accumulation_distribution_line",
    category: "technical",
    description: "Estimates accumulation or distribution by combining close location value with volume.",
    signature: "accumulation_distribution_line(highs: number[], lows: number[], closes: number[], volumes: number[]): number",
    codeExample: `const adLine = accumulation_distribution_line(highs, lows, closes, volumes);
if (adLine > 0) console.log("Accumulation bias");`,
    parametersJson: JSON.stringify([
      { name: "highs", type: "number[]", description: "High-price series" },
      { name: "lows", type: "number[]", description: "Low-price series" },
      { name: "closes", type: "number[]", description: "Close-price series" },
      { name: "volumes", type: "number[]", description: "Volume series" },
    ]),
    returns: "Cumulative accumulation/distribution value",
    tagsJson: JSON.stringify(["smart-money", "volume", "distribution"]),
  },
  {
    id: randomUUID(),
    name: "market_breadth",
    category: "technical",
    description: "Measures how many assets are participating in the move by comparing advancers and decliners.",
    signature: "market_breadth(advancingAssets: number, decliningAssets: number): number",
    codeExample: `const breadth = market_breadth(320, 180);
if (breadth > 0.6) console.log("Broad participation");`,
    parametersJson: JSON.stringify([
      { name: "advancingAssets", type: "number", description: "Count of advancing assets" },
      { name: "decliningAssets", type: "number", description: "Count of declining assets" },
    ]),
    returns: "Breadth ratio between 0 and 1",
    tagsJson: JSON.stringify(["breadth", "participation", "internals"]),
  },
  {
    id: randomUUID(),
    name: "advance_decline_line",
    category: "technical",
    description: "Tracks cumulative net advances to evaluate internal market health over time.",
    signature: "advance_decline_line(netAdvances: number[]): number",
    codeExample: `const adLine = advance_decline_line([120, 85, -40, 140, 60]);
console.log(adLine);`,
    parametersJson: JSON.stringify([
      { name: "netAdvances", type: "number[]", description: "Series of advances minus declines" },
    ]),
    returns: "Cumulative advance-decline line value",
    tagsJson: JSON.stringify(["advance-decline", "breadth", "internals"]),
  },
  {
    id: randomUUID(),
    name: "new_high_new_low_ratio",
    category: "technical",
    description: "Measures leadership strength by comparing new highs against new lows.",
    signature: "new_high_new_low_ratio(newHighs: number, newLows: number): number",
    codeExample: `const ratio = new_high_new_low_ratio(75, 12);
if (ratio > 3) console.log("Strong leadership");`,
    parametersJson: JSON.stringify([
      { name: "newHighs", type: "number", description: "Count of new highs" },
      { name: "newLows", type: "number", description: "Count of new lows" },
    ]),
    returns: "New-high to new-low ratio",
    tagsJson: JSON.stringify(["leadership", "highs-lows", "strength"]),
  },
  {
    id: randomUUID(),
    name: "correlation_to_market",
    category: "technical",
    description: "Measures how independent the asset is from the index by calculating correlation to the market.",
    signature: "correlation_to_market(assetReturns: number[], benchmarkReturns: number[]): number",
    codeExample: `const corr = correlation_to_market(assetReturns, benchmarkReturns);
if (Math.abs(corr) < 0.3) console.log("Low market dependence");`,
    parametersJson: JSON.stringify([
      { name: "assetReturns", type: "number[]", description: "Asset return series" },
      { name: "benchmarkReturns", type: "number[]", description: "Benchmark return series" },
    ]),
    returns: "Correlation coefficient between -1 and 1",
    tagsJson: JSON.stringify(["correlation", "market", "independence"]),
  },
  {
    id: randomUUID(),
    name: "beta_stability",
    category: "technical",
    description: "Measures whether beta remains stable across rolling windows instead of swinging violently.",
    signature: "beta_stability(assetReturns: number[], benchmarkReturns: number[], window?: number): number",
    codeExample: `const stability = beta_stability(assetReturns, benchmarkReturns, 20);
if (stability > 70) console.log("Stable beta profile");`,
    parametersJson: JSON.stringify([
      { name: "assetReturns", type: "number[]", description: "Asset return series" },
      { name: "benchmarkReturns", type: "number[]", description: "Benchmark return series" },
      { name: "window", type: "number", description: "Rolling beta window", optional: true },
    ]),
    returns: "Beta stability score",
    tagsJson: JSON.stringify(["beta", "stability", "market-sensitivity"]),
  },
  {
    id: randomUUID(),
    name: "drawdown_depth",
    category: "technical",
    description: "Measures downside risk by finding the deepest peak-to-trough fall in the lookback period.",
    signature: "drawdown_depth(prices: number[]): number",
    codeExample: `const maxDrawdown = drawdown_depth(prices);
if (maxDrawdown < -15) console.log("Risk profile deteriorating");`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Close-price series" },
    ]),
    returns: "Maximum drawdown percentage",
    tagsJson: JSON.stringify(["drawdown", "risk", "downside"]),
  },
  {
    id: randomUUID(),
    name: "hurst_exponent",
    category: "technical",
    description: "Estimates whether the asset behaves more like a trending series or a mean-reverting one.",
    signature: "hurst_exponent(prices: number[]): number",
    codeExample: `const hurst = hurst_exponent(prices);
if (hurst > 0.5) console.log("Trending character");`,
    parametersJson: JSON.stringify([
      { name: "prices", type: "number[]", description: "Close-price series" },
    ]),
    returns: "Hurst exponent value",
    tagsJson: JSON.stringify(["hurst", "trend", "mean-reversion"]),
  },
  {
    id: randomUUID(),
    name: "market_structure_analysis",
    category: "technical",
    description: "Evaluates higher highs, higher lows, lower highs, and lower lows to judge trend integrity.",
    signature: "market_structure_analysis(highs: number[], lows: number[]): number",
    codeExample: `const structure = market_structure_analysis(swingHighs, swingLows);
if (structure > 70) console.log("Trend structure intact");`,
    parametersJson: JSON.stringify([
      { name: "highs", type: "number[]", description: "Swing highs or candle highs" },
      { name: "lows", type: "number[]", description: "Swing lows or candle lows" },
    ]),
    returns: "Structure integrity score between 0 and 100",
    tagsJson: JSON.stringify(["structure", "trend", "swing-analysis"]),
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
