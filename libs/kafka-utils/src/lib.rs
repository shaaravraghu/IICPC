use rdkafka::config::ClientConfig;
use rdkafka::producer::{FutureProducer, FutureRecord};
use rdkafka::consumer::{StreamConsumer, Consumer};
use rdkafka::message::Message;
use std::time::Duration;
use platform_types::PipelineMessage;

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

pub struct KafkaProducer {
    producer: FutureProducer,
}

impl KafkaProducer {
    pub fn new(brokers: &str) -> Self {
        let producer: FutureProducer = ClientConfig::new()
            .set("bootstrap.servers", brokers)
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
        let consumer: StreamConsumer = ClientConfig::new()
            .set("bootstrap.servers", brokers)
            .set("group.id", group_id)
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
