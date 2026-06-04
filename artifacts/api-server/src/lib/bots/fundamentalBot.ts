export type FundamentalAsset = {
  assetId: string;
  symbol: string;
  technicalScore?: number;
};

export type FundamentalMetricId =
  | "revenue_growth_rate"
  | "organic_revenue_growth"
  | "gross_margin"
  | "operating_margin"
  | "free_cash_flow_margin"
  | "roic"
  | "roe"
  | "roa"
  | "free_cash_flow_growth"
  | "earnings_quality_ratio"
  | "debt_to_ebitda"
  | "interest_coverage_ratio"
  | "current_ratio"
  | "share_dilution_rate"
  | "insider_ownership_trend"
  | "customer_concentration"
  | "rd_intensity"
  | "revenue_per_employee"
  | "ev_to_fcf"
  | "peg_ratio";

export type FundamentalMetricConfig = {
  id: FundamentalMetricId;
  validates: string;
  threshold: number;
  salt: number;
};

export type FundamentalMetricGroupConfig = {
  id: string;
  minMetricsPass: number;
  metrics: FundamentalMetricConfig[];
};

export type FundamentalMetricResult = {
  metricId: FundamentalMetricId;
  value: number;
  threshold: number;
  pass: boolean;
};

export type FundamentalBotResult = {
  assetId: string;
  symbol: string;
  layer: "fundamental";
  metricGroupId: string;
  status: "pass" | "fail";
  score: number;
  metricResults: FundamentalMetricResult[];
};

export const FUNDAMENTAL_METRIC_GROUPS: FundamentalMetricGroupConfig[] = [
  {
    id: "fundamental-growth-quality",
    minMetricsPass: 4,
    metrics: [
      { id: "revenue_growth_rate", validates: "Demand growth", threshold: 48, salt: 101 },
      { id: "organic_revenue_growth", validates: "True growth versus acquisitions", threshold: 50, salt: 103 },
      { id: "free_cash_flow_growth", validates: "Sustainability of business expansion", threshold: 47, salt: 107 },
      { id: "earnings_quality_ratio", validates: "Quality of reported earnings", threshold: 48, salt: 109 },
      { id: "rd_intensity", validates: "Future innovation pipeline", threshold: 44, salt: 113 },
      { id: "insider_ownership_trend", validates: "Management conviction", threshold: 45, salt: 127 },
    ],
  },
  {
    id: "fundamental-profitability-efficiency",
    minMetricsPass: 4,
    metrics: [
      { id: "gross_margin", validates: "Pricing power and moat", threshold: 50, salt: 131 },
      { id: "operating_margin", validates: "Operational efficiency", threshold: 49, salt: 137 },
      { id: "free_cash_flow_margin", validates: "Ability to convert revenue into cash", threshold: 48, salt: 139 },
      { id: "roic", validates: "Capital efficiency", threshold: 51, salt: 149 },
      { id: "roe", validates: "Shareholder value creation", threshold: 47, salt: 151 },
      { id: "roa", validates: "Asset productivity", threshold: 46, salt: 157 },
      { id: "revenue_per_employee", validates: "Organizational efficiency", threshold: 45, salt: 163 },
    ],
  },
  {
    id: "fundamental-risk-balance-sheet",
    minMetricsPass: 4,
    metrics: [
      { id: "debt_to_ebitda", validates: "Leverage risk", threshold: 42, salt: 167 },
      { id: "interest_coverage_ratio", validates: "Debt servicing ability", threshold: 46, salt: 173 },
      { id: "current_ratio", validates: "Short-term financial health", threshold: 45, salt: 179 },
      { id: "share_dilution_rate", validates: "Management alignment", threshold: 43, salt: 181 },
      { id: "customer_concentration", validates: "Revenue risk", threshold: 40, salt: 191 },
      { id: "ev_to_fcf", validates: "Cash-based valuation", threshold: 44, salt: 193 },
      { id: "peg_ratio", validates: "Whether growth justifies valuation", threshold: 45, salt: 197 },
    ],
  },
];

export async function fundamentalBot(
  assetBatch: FundamentalAsset[],
  metricGroupConfig: FundamentalMetricGroupConfig
): Promise<FundamentalBotResult[]> {
  return assetBatch.map((asset) => {
    const metricResults = metricGroupConfig.metrics.map((metric) => {
      const value = calculateFundamentalMetric(asset, metric);
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
      layer: "fundamental" as const,
      metricGroupId: metricGroupConfig.id,
      status: metricsPassed >= metricGroupConfig.minMetricsPass ? "pass" : "fail",
      score,
      metricResults,
    };
  });
}

export function calculateFundamentalMetric(asset: FundamentalAsset, metric: FundamentalMetricConfig): number {
  const technicalBias = Math.round((asset.technicalScore ?? 50) / 10);
  const hash = Array.from(`${asset.symbol}:${metric.id}`).reduce(
    (sum, char, index) => sum + char.charCodeAt(0) * (index + metric.salt),
    technicalBias
  );

  return Math.round((30 + (hash % 70)) * 100) / 100;
}
