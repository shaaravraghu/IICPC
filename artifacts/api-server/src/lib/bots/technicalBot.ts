export type TechnicalAsset = {
  assetId: string;
  symbol: string;
};

export type TechnicalMetricId =
  | "adx"
  | "relative_strength"
  | "roc"
  | "rsi_regime"
  | "macd_histogram_slope"
  | "realized_volatility"
  | "atr_regime_shift"
  | "bollinger_band_width"
  | "volume_profile"
  | "vwap_distance"
  | "obv"
  | "accumulation_distribution"
  | "market_breadth"
  | "advance_decline_line"
  | "new_high_low_ratio"
  | "market_correlation"
  | "beta_stability"
  | "drawdown_depth"
  | "hurst_exponent"
  | "market_structure";

export type TechnicalMetricConfig = {
  id: TechnicalMetricId;
  measures: string;
  threshold: number;
  salt: number;
};

export type TechnicalMetricGroupConfig = {
  id: string;
  minMetricsPass: number;
  metrics: TechnicalMetricConfig[];
};

export type TechnicalMetricResult = {
  metricId: TechnicalMetricId;
  value: number;
  threshold: number;
  pass: boolean;
};

export type TechnicalBotResult = {
  assetId: string;
  symbol: string;
  layer: "technical";
  metricGroupId: string;
  status: "pass" | "fail";
  score: number;
  metricResults: TechnicalMetricResult[];
};

export const TECHNICAL_METRIC_GROUPS: TechnicalMetricGroupConfig[] = [
  {
    id: "technical-trend-momentum",
    minMetricsPass: 4,
    metrics: [
      { id: "adx", measures: "Trend existence and strength", threshold: 48, salt: 11 },
      { id: "relative_strength", measures: "Outperformance versus benchmark", threshold: 50, salt: 13 },
      { id: "roc", measures: "Speed of price movement", threshold: 47, salt: 17 },
      { id: "rsi_regime", measures: "Persistent buying or selling pressure", threshold: 45, salt: 19 },
      { id: "macd_histogram_slope", measures: "Momentum acceleration or deceleration", threshold: 46, salt: 23 },
      { id: "market_structure", measures: "Higher highs, higher lows, and trend integrity", threshold: 49, salt: 29 },
    ],
  },
  {
    id: "technical-volatility-risk",
    minMetricsPass: 4,
    metrics: [
      { id: "realized_volatility", measures: "Actual market uncertainty", threshold: 44, salt: 31 },
      { id: "atr_regime_shift", measures: "Volatility expansion or contraction", threshold: 47, salt: 37 },
      { id: "bollinger_band_width", measures: "Compression versus expansion phases", threshold: 46, salt: 41 },
      { id: "market_correlation", measures: "Independence from index behavior", threshold: 42, salt: 43 },
      { id: "beta_stability", measures: "Sensitivity stability versus market movements", threshold: 45, salt: 47 },
      { id: "drawdown_depth", measures: "Downside risk profile", threshold: 40, salt: 53 },
      { id: "hurst_exponent", measures: "Trending versus mean-reverting behavior", threshold: 44, salt: 59 },
    ],
  },
  {
    id: "technical-volume-breadth",
    minMetricsPass: 4,
    metrics: [
      { id: "volume_profile", measures: "Price levels with highest participation", threshold: 45, salt: 61 },
      { id: "vwap_distance", measures: "Institutional positioning", threshold: 43, salt: 67 },
      { id: "obv", measures: "Whether volume confirms price moves", threshold: 46, salt: 71 },
      { id: "accumulation_distribution", measures: "Accumulation or distribution pressure", threshold: 45, salt: 73 },
      { id: "market_breadth", measures: "How many assets participate", threshold: 42, salt: 79 },
      { id: "advance_decline_line", measures: "Internal market health", threshold: 43, salt: 83 },
      { id: "new_high_low_ratio", measures: "Leadership strength", threshold: 44, salt: 89 },
    ],
  },
];

export async function technicalBot(
  assetBatch: TechnicalAsset[],
  metricGroupConfig: TechnicalMetricGroupConfig
): Promise<TechnicalBotResult[]> {
  return assetBatch.map((asset) => {
    const metricResults = metricGroupConfig.metrics.map((metric) => {
      const value = calculateTechnicalMetric(asset, metric);
      return {
        metricId: metric.id,
        value,
        threshold: metric.threshold,
        pass: value >= metric.threshold,
      };
    });

    const metricsPassed = metricResults.filter((result) => result.pass).length;
    const score = Math.round((metricsPassed / metricGroupConfig.metrics.length) * 10_000) / 100;

    return {
      assetId: asset.assetId,
      symbol: asset.symbol,
      layer: "technical" as const,
      metricGroupId: metricGroupConfig.id,
      status: metricsPassed >= metricGroupConfig.minMetricsPass ? "pass" : "fail",
      score,
      metricResults,
    };
  });
}

export function calculateTechnicalMetric(asset: TechnicalAsset, metric: TechnicalMetricConfig): number {
  const hash = Array.from(`${asset.symbol}:${metric.id}`).reduce(
    (sum, char, index) => sum + char.charCodeAt(0) * (index + metric.salt),
    0
  );

  return Math.round((30 + (hash % 70)) * 100) / 100;
}
