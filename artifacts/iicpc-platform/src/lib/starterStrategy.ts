export const STARTER_STRATEGY_YAML = `id: starter-momentum-quality-sentiment
owner: demo-team
technical_groups:
  - id: momentum-breakout
    category: Technical
    calls:
      - name: trend_strength_adx
        params:
          period:
            Number: 14
      - name: momentum_rate_of_change
        params:
          period:
            Number: 12
      - name: vwap_distance
        params: {}
    pass_threshold: 62
  - id: trend-confirmation
    category: Technical
    calls:
      - name: market_structure_analysis
        params: {}
      - name: relative_strength_vs_benchmark
        params:
          period:
            Number: 20
    pass_threshold: 55
fundamental_groups:
  - id: quality-compounders
    category: Fundamental
    calls:
      - name: return_on_invested_capital
        params:
          min:
            Number: 12
      - name: free_cash_flow_margin
        params:
          min:
            Number: 8
    pass_threshold: 60
sentiment_dimensions:
  - name: news_sentiment
    weight_pct: 20
    call:
      name: news_sentiment_analysis
      params: {}
  - name: options_sentiment
    weight_pct: 15
    call:
      name: options_market_sentiment
      params: {}
  - name: institutional_flow
    weight_pct: 15
    call:
      name: institutional_fund_flow_analysis
      params: {}
  - name: analyst_sentiment
    weight_pct: 10
    call:
      name: analyst_rating_sentiment
      params: {}
  - name: earnings_call_tone
    weight_pct: 15
    call:
      name: earnings_call_sentiment
      params: {}
  - name: technical_psychology
    weight_pct: 10
    call:
      name: technical_sentiment_indicators
      params: {}
  - name: alternative_data
    weight_pct: 10
    call:
      name: alternative_data_sentiment
      params: {}
  - name: prediction_markets
    weight_pct: 5
    call:
      name: prediction_market_analysis
      params: {}
`;
