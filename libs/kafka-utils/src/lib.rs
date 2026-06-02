use std::collections::{HashMap, VecDeque};

use platform_types::PipelineEvent;

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub enum Topic {
    MarketDataLive,
    TechnicalOut,
    FundamentalOut,
    SentimentOut,
    ExecutionOut,
    PaperTradingOut,
    TelemetryMetrics,
}

impl Topic {
    pub fn as_kafka_name(&self) -> &'static str {
        match self {
            Self::MarketDataLive => "sys.market_data.live",
            Self::TechnicalOut => "stage1.technical.out",
            Self::FundamentalOut => "stage2.fundamental.out",
            Self::SentimentOut => "stage3.sentiment.out",
            Self::ExecutionOut => "stage4.execution.out",
            Self::PaperTradingOut => "stage5.paper_trading.out",
            Self::TelemetryMetrics => "sys.telemetry.metrics",
        }
    }
}

#[derive(Debug, Default)]
pub struct InMemoryEventBus {
    queues: HashMap<Topic, VecDeque<PipelineEvent>>,
}

impl InMemoryEventBus {
    pub fn publish(&mut self, topic: Topic, event: PipelineEvent) {
        self.queues.entry(topic).or_default().push_back(event);
    }

    pub fn drain(&mut self, topic: &Topic) -> Vec<PipelineEvent> {
        self.queues
            .remove(topic)
            .map(VecDeque::into_iter)
            .map(Iterator::collect)
            .unwrap_or_default()
    }

    pub fn len(&self, topic: &Topic) -> usize {
        self.queues.get(topic).map(VecDeque::len).unwrap_or_default()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn publishes_and_drains_events() {
        let mut bus = InMemoryEventBus::default();
        bus.publish(
            Topic::TechnicalOut,
            PipelineEvent::StrategySubmitted {
                strategy_id: "s1".to_string(),
            },
        );

        assert_eq!(bus.len(&Topic::TechnicalOut), 1);
        assert_eq!(bus.drain(&Topic::TechnicalOut).len(), 1);
        assert_eq!(bus.len(&Topic::TechnicalOut), 0);
    }
}
