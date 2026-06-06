use rdkafka::config::ClientConfig;
use rdkafka::consumer::{Consumer, StreamConsumer};
use rdkafka::message::Message;
use rdkafka::producer::{FutureProducer, FutureRecord};
use platform_types::PipelineMessage;
use std::time::Duration;

#[cfg(test)]
use std::collections::{HashMap, VecDeque};
#[cfg(test)]
use std::sync::{Arc, Mutex};

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub enum Topic {
    Submissions,
    TechnicalOut,
    FundamentalOut,
    SentimentOut,
    ExecutionOut,
    PaperTradingOut,
    TelemetryMetrics,
    LeaderboardUpdates,
}

impl Topic {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Submissions => "submissions",
            Self::TechnicalOut => "stage1.technical.out",
            Self::FundamentalOut => "stage2.fundamental.out",
            Self::SentimentOut => "stage3.sentiment.out",
            Self::ExecutionOut => "stage4.execution.out",
            Self::PaperTradingOut => "stage5.paper_trading.out",
            Self::TelemetryMetrics => "sys.telemetry.metrics",
            Self::LeaderboardUpdates => "leaderboard-updates",
        }
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct KafkaConfig {
    pub brokers: String,
    pub client_id: String,
    pub group_id: Option<String>,
}

impl KafkaConfig {
    pub fn producer(brokers: impl Into<String>, client_id: impl Into<String>) -> Self {
        Self {
            brokers: brokers.into(),
            client_id: client_id.into(),
            group_id: None,
        }
    }

    pub fn consumer(
        brokers: impl Into<String>,
        client_id: impl Into<String>,
        group_id: impl Into<String>,
    ) -> Self {
        Self {
            brokers: brokers.into(),
            client_id: client_id.into(),
            group_id: Some(group_id.into()),
        }
    }

    pub fn from_env(default_client_id: impl Into<String>, default_group_id: Option<String>) -> Self {
        Self {
            brokers: std::env::var("KAFKA_BROKERS")
                .unwrap_or_else(|_| "localhost:9092".to_string()),
            client_id: std::env::var("KAFKA_CLIENT_ID")
                .unwrap_or_else(|_| default_client_id.into()),
            group_id: std::env::var("KAFKA_GROUP_ID").ok().or(default_group_id),
        }
    }
}

#[derive(Clone)]
pub struct KafkaProducer {
    producer: FutureProducer,
}

impl KafkaProducer {
    pub fn new(brokers: &str) -> Self {
        Self::with_config(&KafkaConfig::producer(brokers, "iicpc-producer"))
    }

    pub fn with_config(config: &KafkaConfig) -> Self {
        let producer: FutureProducer = ClientConfig::new()
            .set("bootstrap.servers", config.brokers.as_str())
            .set("client.id", config.client_id.as_str())
            .set("message.timeout.ms", "5000")
            .create()
            .expect("Producer creation error");
        Self { producer }
    }

    pub async fn publish(&self, topic: Topic, key: &str, message: &PipelineMessage) -> Result<(), String> {
        let payload = serde_json::to_string(message)
            .map_err(|e| format!("Failed to serialize message: {:?}", e))?;
            
        let record = FutureRecord::to(topic.as_str())
            .payload(&payload)
            .key(key);
            
        self.producer
            .send(record, Duration::from_secs(5))
            .await
            .map_err(|(e, _)| format!("Kafka send error: {:?}", e))?;
            
        Ok(())
    }
}

pub struct KafkaConsumer {
    consumer: StreamConsumer,
}

impl KafkaConsumer {
    pub fn new(brokers: &str, group_id: &str, topics: &[Topic]) -> Self {
        Self::with_config(
            &KafkaConfig::consumer(brokers, format!("iicpc-{group_id}"), group_id),
            topics,
        )
    }

    pub fn with_config(config: &KafkaConfig, topics: &[Topic]) -> Self {
        let consumer: StreamConsumer = ClientConfig::new()
            .set("bootstrap.servers", config.brokers.as_str())
            .set("client.id", config.client_id.as_str())
            .set(
                "group.id",
                config
                    .group_id
                    .as_deref()
                    .expect("Kafka consumer config requires a group_id"),
            )
            .set("enable.partition.eof", "false")
            .set("session.timeout.ms", "6000")
            .set("enable.auto.commit", "true")
            .set("auto.offset.reset", "earliest")
            .create()
            .expect("Consumer creation failed");

        let topic_strs: Vec<&str> = topics.iter().map(|t| t.as_str()).collect();
        consumer.subscribe(&topic_strs).expect("Failed to subscribe to topics");
        
        Self { consumer }
    }

    pub async fn consume(&self) -> Result<(String, PipelineMessage), String> {
        match self.consumer.recv().await {
            Ok(borrowed_message) => {
                let key = borrowed_message
                    .key_view::<str>()
                    .unwrap_or(Ok(""))
                    .map_err(|e| format!("Error decoding key: {:?}", e))?;
                    
                let payload_str = borrowed_message
                    .payload_view::<str>()
                    .ok_or_else(|| "Empty payload".to_string())?
                    .map_err(|e| format!("Error decoding payload: {:?}", e))?;
                    
                let message: PipelineMessage = serde_json::from_str(payload_str)
                    .map_err(|e| format!("Failed to parse JSON message: {:?}", e))?;
                    
                Ok((key.to_string(), message))
            }
            Err(e) => Err(format!("Kafka consume error: {:?}", e)),
        }
    }
}

#[cfg(test)]
#[derive(Clone, Default)]
pub struct InMemoryEventBus {
    topics: Arc<Mutex<HashMap<Topic, VecDeque<PipelineMessage>>>>,
}

#[cfg(test)]
impl InMemoryEventBus {
    pub fn publish(&self, topic: Topic, message: PipelineMessage) {
        let mut topics = self.topics.lock().expect("in-memory event bus lock poisoned");
        topics.entry(topic).or_default().push_back(message);
    }

    pub fn consume(&self, topic: Topic) -> Option<PipelineMessage> {
        let mut topics = self.topics.lock().expect("in-memory event bus lock poisoned");
        topics.get_mut(&topic).and_then(VecDeque::pop_front)
    }

    pub fn len(&self, topic: Topic) -> usize {
        let topics = self.topics.lock().expect("in-memory event bus lock poisoned");
        topics.get(&topic).map_or(0, VecDeque::len)
    }
}
