use platform_types::{
    FunctionCall, MetricCategory, MetricGroup, SentimentDimension, StrategyManifest,
};

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum StrategyError {
    EmptyStrategy,
    MissingTechnicalGroups,
    MissingFundamentalGroups,
    MissingSentimentDimensions,
    InvalidGroupThreshold(String),
    EmptyFunctionCall(String),
    InvalidSentimentWeight,
}

pub fn validate_strategy(strategy: &StrategyManifest) -> Result<(), StrategyError> {
    if strategy.id.trim().is_empty() || strategy.owner.trim().is_empty() {
        return Err(StrategyError::EmptyStrategy);
    }

    if strategy.technical_groups.is_empty() {
        return Err(StrategyError::MissingTechnicalGroups);
    }

    if strategy.fundamental_groups.is_empty() {
        return Err(StrategyError::MissingFundamentalGroups);
    }

    if strategy.sentiment_dimensions.is_empty() {
        return Err(StrategyError::MissingSentimentDimensions);
    }

    validate_groups(&strategy.technical_groups, MetricCategory::Technical)?;
    validate_groups(&strategy.fundamental_groups, MetricCategory::Fundamental)?;
    validate_sentiment_dimensions(&strategy.sentiment_dimensions)?;

    Ok(())
}

fn validate_groups(groups: &[MetricGroup], category: MetricCategory) -> Result<(), StrategyError> {
    for group in groups {
        if group.category != category {
            return Err(StrategyError::EmptyFunctionCall(group.id.clone()));
        }
        if !(0.0..=100.0).contains(&group.pass_threshold) {
            return Err(StrategyError::InvalidGroupThreshold(group.id.clone()));
        }
        validate_calls(&group.id, &group.calls)?;
    }

    Ok(())
}

fn validate_calls(group_id: &str, calls: &[FunctionCall]) -> Result<(), StrategyError> {
    if calls.is_empty() {
        return Err(StrategyError::EmptyFunctionCall(group_id.to_string()));
    }

    for call in calls {
        if call.name.trim().is_empty() {
            return Err(StrategyError::EmptyFunctionCall(group_id.to_string()));
        }
    }

    Ok(())
}

fn validate_sentiment_dimensions(dimensions: &[SentimentDimension]) -> Result<(), StrategyError> {
    let total_weight = dimensions.iter().map(|dimension| dimension.weight_pct).sum::<f64>();
    if (total_weight - 100.0).abs() > 0.001 {
        return Err(StrategyError::InvalidSentimentWeight);
    }

    for dimension in dimensions {
        if dimension.name.trim().is_empty() || dimension.call.name.trim().is_empty() {
            return Err(StrategyError::EmptyFunctionCall("sentiment".to_string()));
        }
    }

    Ok(())
}

pub fn starter_strategy(owner: impl Into<String>) -> StrategyManifest {
    StrategyManifest {
        id: "starter-momentum-quality-sentiment".to_string(),
        owner: owner.into(),
        technical_groups: vec![
            MetricGroup {
                id: "momentum-breakout".to_string(),
                category: MetricCategory::Technical,
                calls: vec![
                    FunctionCall::new("trend_strength_adx").with_number("period", 14.0),
                    FunctionCall::new("momentum_rate_of_change").with_number("period", 12.0),
                    FunctionCall::new("vwap_distance"),
                ],
                pass_threshold: 62.0,
            },
            MetricGroup {
                id: "trend-confirmation".to_string(),
                category: MetricCategory::Technical,
                calls: vec![
                    FunctionCall::new("market_structure_analysis"),
                    FunctionCall::new("relative_strength_vs_benchmark").with_number("period", 20.0),
                ],
                pass_threshold: 55.0,
            },
        ],
        fundamental_groups: vec![MetricGroup {
            id: "quality-compounders".to_string(),
            category: MetricCategory::Fundamental,
            calls: vec![
                FunctionCall::new("return_on_invested_capital").with_number("min", 12.0),
                FunctionCall::new("free_cash_flow_margin").with_number("min", 8.0),
            ],
            pass_threshold: 60.0,
        }],
        sentiment_dimensions: vec![
            SentimentDimension {
                name: "news_reaction".to_string(),
                weight_pct: 35.0,
                call: FunctionCall::new("news_sentiment_score"),
            },
            SentimentDimension {
                name: "market_breadth".to_string(),
                weight_pct: 30.0,
                call: FunctionCall::new("breadth_sentiment"),
            },
            SentimentDimension {
                name: "volatility_regime".to_string(),
                weight_pct: 35.0,
                call: FunctionCall::new("fear_greed_index"),
            },
        ],
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn starter_strategy_is_valid() {
        let strategy = starter_strategy("team-alpha");
        assert_eq!(validate_strategy(&strategy), Ok(()));
    }

    #[test]
    fn rejects_bad_sentiment_weights() {
        let mut strategy = starter_strategy("team-alpha");
        strategy.sentiment_dimensions[0].weight_pct = 20.0;
        assert_eq!(validate_strategy(&strategy), Err(StrategyError::InvalidSentimentWeight));
    }
}
