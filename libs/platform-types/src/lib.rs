use std::collections::BTreeMap;

#[derive(Clone, Debug, PartialEq)]
pub struct Asset {
    pub symbol: String,
    pub name: String,
    pub sector: String,
}

#[derive(Clone, Debug, PartialEq)]
pub struct MarketCandle {
    pub timestamp: i64,
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
    pub volume: f64,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum MetricCategory {
    Technical,
    Fundamental,
    Sentiment,
    Execution,
    PaperTrading,
    Utility,
}

#[derive(Clone, Debug, PartialEq)]
pub enum ParamValue {
    Number(f64),
    Integer(i64),
    Text(String),
    Bool(bool),
}

impl ParamValue {
    pub fn as_f64(&self) -> Option<f64> {
        match self {
            Self::Number(value) => Some(*value),
            Self::Integer(value) => Some(*value as f64),
            Self::Text(_) | Self::Bool(_) => None,
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct FunctionCall {
    pub name: String,
    pub params: BTreeMap<String, ParamValue>,
}

impl FunctionCall {
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            params: BTreeMap::new(),
        }
    }

    pub fn with_number(mut self, key: impl Into<String>, value: f64) -> Self {
        self.params.insert(key.into(), ParamValue::Number(value));
        self
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct FunctionParamDef {
    pub name: &'static str,
    pub type_name: &'static str,
    pub description: &'static str,
    pub optional: bool,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TechnicalMetricDefinition {
    pub key: &'static str,
    pub display_name: &'static str,
    pub measures: &'static str,
    pub description: &'static str,
    pub signature: &'static str,
    pub returns: &'static str,
    pub params: &'static [FunctionParamDef],
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct FundamentalMetricDefinition {
    pub key: &'static str,
    pub display_name: &'static str,
    pub validates: &'static str,
    pub description: &'static str,
    pub signature: &'static str,
    pub returns: &'static str,
    pub params: &'static [FunctionParamDef],
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SentimentMetricDefinition {
    pub key: &'static str,
    pub display_name: &'static str,
    pub measures: &'static str,
    pub description: &'static str,
    pub signal_sources: &'static [&'static str],
    pub signature: &'static str,
    pub returns: &'static str,
    pub params: &'static [FunctionParamDef],
}

#[derive(Clone, Debug, PartialEq)]
pub struct MetricGroup {
    pub id: String,
    pub category: MetricCategory,
    pub calls: Vec<FunctionCall>,
    pub pass_threshold: f64,
}

#[derive(Clone, Debug, PartialEq)]
pub struct SentimentDimension {
    pub name: String,
    pub weight_pct: f64,
    pub call: FunctionCall,
}

#[derive(Clone, Debug, PartialEq)]
pub struct StrategyManifest {
    pub id: String,
    pub owner: String,
    pub technical_groups: Vec<MetricGroup>,
    pub fundamental_groups: Vec<MetricGroup>,
    pub sentiment_dimensions: Vec<SentimentDimension>,
}

#[derive(Clone, Debug, PartialEq)]
pub struct MetricSignal {
    pub asset: Asset,
    pub group_id: String,
    pub score: f64,
    pub passed: bool,
    pub reasons: Vec<String>,
}

#[derive(Clone, Debug, PartialEq)]
pub struct RankedAsset {
    pub asset: Asset,
    pub signal_score: f64,
    pub dimensions: Vec<(String, f64)>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TradeHorizon {
    Intraday,
    ShortTerm,
    MediumTerm,
    LongTerm,
}

#[derive(Clone, Debug, PartialEq)]
pub struct TradeSimulationResult {
    pub symbol: String,
    pub horizon: TradeHorizon,
    pub trade_count: usize,
    pub pnl_pct: f64,
    pub max_drawdown_pct: f64,
    pub hit_rate_pct: f64,
    pub score: f64,
}

#[derive(Clone, Debug, PartialEq)]
pub struct PaperTradingResult {
    pub symbol: String,
    pub timeline: String,
    pub pnl_pct: f64,
    pub risk_adjusted_score: f64,
}

#[derive(Clone, Debug, PartialEq)]
pub struct TelemetrySnapshot {
    pub run_id: String,
    pub p50_latency_ms: f64,
    pub p90_latency_ms: f64,
    pub p99_latency_ms: f64,
    pub peak_tps: f64,
    pub fill_accuracy_pct: f64,
    pub uptime_pct: f64,
}

#[derive(Clone, Debug, PartialEq)]
pub struct LeaderboardRow {
    pub rank: usize,
    pub strategy_id: String,
    pub owner: String,
    pub signal_score: f64,
    pub execution_score: f64,
    pub paper_trading_score: f64,
    pub composite_score: f64,
}

#[derive(Clone, Debug, PartialEq)]
pub enum PipelineEvent {
    StrategySubmitted { strategy_id: String },
    TechnicalPassed(MetricSignal),
    FundamentalPassed(MetricSignal),
    SentimentRanked(RankedAsset),
    ExecutionScored(TradeSimulationResult),
    PaperTradingScored(PaperTradingResult),
}
