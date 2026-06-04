export type SentimentAsset = {
  assetId: string;
  symbol: string;
  technicalScore?: number;
  fundamentalScore?: number;
};

export type SentimentMethodId =
  | "news_sentiment"
  | "social_media_sentiment"
  | "search_trend"
  | "options_market_sentiment"
  | "institutional_fund_flow"
  | "analyst_rating_sentiment"
  | "earnings_call_sentiment"
  | "insider_trading"
  | "technical_sentiment"
  | "consumer_review_sentiment"
  | "supply_chain_sentiment"
  | "influencer_community_forum"
  | "macroeconomic_sentiment"
  | "alternative_data_sentiment"
  | "prediction_market";

export type SentimentMethodConfig = {
  id: SentimentMethodId;
  measures: string;
  weightPct: number;
  salt: number;
};

export type SentimentMethodGroupConfig = {
  id: string;
  methods: SentimentMethodConfig[];
};

export type SentimentMethodResult = {
  methodId: SentimentMethodId;
  rating: number;
  weightPct: number;
  weightedContribution: number;
};

export type SentimentBotResult = {
  assetId: string;
  symbol: string;
  layer: "sentiment";
  metricGroupId: string;
  status: "pass";
  score: number;
  rawWeightedScore: number;
  methodResults: SentimentMethodResult[];
};

export const SENTIMENT_METHOD_GROUPS: SentimentMethodGroupConfig[] = [
  {
    id: "sentiment-public-narrative",
    methods: [
      { id: "news_sentiment", measures: "Tone in financial news articles", weightPct: 10, salt: 211 },
      { id: "social_media_sentiment", measures: "Public opinion across social platforms", weightPct: 8, salt: 223 },
      { id: "search_trend", measures: "Rising public interest from search volume", weightPct: 6, salt: 227 },
      { id: "influencer_community_forum", measures: "Depth and quality of niche community discussion", weightPct: 6, salt: 229 },
      { id: "consumer_review_sentiment", measures: "Customer opinions about products and services", weightPct: 5, salt: 233 },
    ],
  },
  {
    id: "sentiment-market-positioning",
    methods: [
      { id: "options_market_sentiment", measures: "Options-implied expectations", weightPct: 9, salt: 239 },
      { id: "institutional_fund_flow", measures: "Large investor capital movement", weightPct: 9, salt: 241 },
      { id: "analyst_rating_sentiment", measures: "Upgrades, downgrades, and target revisions", weightPct: 7, salt: 251 },
      { id: "insider_trading", measures: "Executive and director trading behavior", weightPct: 6, salt: 257 },
      { id: "prediction_market", measures: "Crowd-implied probabilities from betting markets", weightPct: 4, salt: 263 },
    ],
  },
  {
    id: "sentiment-operating-context",
    methods: [
      { id: "earnings_call_sentiment", measures: "Management confidence and earnings-call tone", weightPct: 8, salt: 269 },
      { id: "technical_sentiment", measures: "Market psychology reflected in price action", weightPct: 7, salt: 271 },
      { id: "supply_chain_sentiment", measures: "Supplier, logistics, and manufacturing signals", weightPct: 5, salt: 277 },
      { id: "macroeconomic_sentiment", measures: "Sentiment implied by economic indicators", weightPct: 5, salt: 281 },
      { id: "alternative_data_sentiment", measures: "Real-world behavioral alternative data", weightPct: 5, salt: 283 },
    ],
  },
];

export async function sentimentBot(
  assetBatch: SentimentAsset[],
  methodGroupConfig: SentimentMethodGroupConfig
): Promise<SentimentBotResult[]> {
  return assetBatch.map((asset) => {
    const methodResults = methodGroupConfig.methods.map((method) => {
      const rating = calculateSentimentRating(asset, method);
      const weightedContribution = Math.round(rating * (method.weightPct / 100) * 100) / 100;
      return {
        methodId: method.id,
        rating,
        weightPct: method.weightPct,
        weightedContribution,
      };
    });

    const groupWeight = methodGroupConfig.methods.reduce((sum, method) => sum + method.weightPct, 0);
    const rawWeightedScore = Math.round(methodResults.reduce((sum, result) => sum + result.weightedContribution, 0) * 100) / 100;
    const normalizedGroupScore = groupWeight === 0 ? 50 : ((rawWeightedScore / (groupWeight / 100)) + 5) * 10;

    return {
      assetId: asset.assetId,
      symbol: asset.symbol,
      layer: "sentiment" as const,
      metricGroupId: methodGroupConfig.id,
      status: "pass" as const,
      score: Math.max(0, Math.min(100, Math.round(normalizedGroupScore * 100) / 100)),
      rawWeightedScore,
      methodResults,
    };
  });
}

export function calculateSentimentRating(asset: SentimentAsset, method: SentimentMethodConfig): number {
  const qualityBias = Math.round(((asset.technicalScore ?? 50) + (asset.fundamentalScore ?? 50)) / 25);
  const hash = Array.from(`${asset.symbol}:${method.id}`).reduce(
    (sum, char, index) => sum + char.charCodeAt(0) * (index + method.salt),
    qualityBias
  );

  return Math.round((((hash % 101) / 10) - 5) * 100) / 100;
}
