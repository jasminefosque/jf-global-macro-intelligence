# Metrics Reference

This document provides detailed definitions for all metrics tracked in the Global Macro Intelligence dashboard.

## Growth Indicators

### GDP Growth YoY
- **Metric ID**: `gdp_growth_yoy`
- **Description**: Year-over-year real GDP growth rate
- **Unit**: Percentage (%)
- **Frequency**: Quarterly
- **Geography**: Global Aggregate
- **Calculation**: ((GDP_t - GDP_t-4) / GDP_t-4) × 100
- **Interpretation**: 
  - Positive values indicate economic expansion
  - Negative values indicate economic contraction
  - Typical range: -5% to +8% in normal conditions
  - Values below -2% may indicate recession

## Inflation & Prices

### CPI Inflation YoY
- **Metric ID**: `cpi_inflation_yoy`
- **Description**: Year-over-year change in Consumer Price Index
- **Unit**: Percentage (%)
- **Frequency**: Monthly
- **Geography**: Global Aggregate
- **Calculation**: ((CPI_t - CPI_t-12) / CPI_t-12) × 100
- **Interpretation**:
  - Central bank targets typically 2%
  - Values above 3% may trigger policy tightening
  - Values below 0% indicate deflation
  - Sustained high inflation (>5%) signals overheating

## Monetary Policy

### Policy Rate
- **Metric ID**: `policy_rate`
- **Description**: Central bank benchmark policy interest rate
- **Unit**: Percentage (%)
- **Frequency**: Monthly
- **Geography**: Global Aggregate
- **Calculation**: Weighted average of major central bank policy rates
- **Interpretation**:
  - Higher rates typically slow economic growth and inflation
  - Lower rates stimulate borrowing and economic activity
  - Near-zero rates indicate accommodative policy
  - Rapid increases signal tightening cycle

## Labor Market

### Unemployment Rate
- **Metric ID**: `unemployment_rate`
- **Description**: Unemployment as percentage of total labor force
- **Unit**: Percentage (%)
- **Frequency**: Monthly
- **Geography**: Global Aggregate
- **Calculation**: (Unemployed / Labor Force) × 100
- **Interpretation**:
  - Below 4% typically indicates tight labor market
  - Above 6% suggests slack in labor market
  - Rapid increases often precede or accompany recessions
  - Natural rate estimated around 4-5%

## Fiscal Position

### Debt to GDP
- **Metric ID**: `debt_to_gdp`
- **Description**: Government debt as percentage of GDP
- **Unit**: Percentage (%)
- **Frequency**: Quarterly
- **Geography**: Global Aggregate
- **Calculation**: (Total Government Debt / GDP) × 100
- **Interpretation**:
  - Below 60% considered sustainable (Maastricht criterion)
  - Above 90% may constrain growth
  - Rapid increases indicate fiscal deterioration
  - Sustainability depends on growth rate and interest rates

## Trade & FX

### Trade Balance
- **Metric ID**: `trade_balance`
- **Description**: Net trade balance (exports minus imports)
- **Unit**: USD Billions
- **Frequency**: Monthly
- **Geography**: Global Aggregate
- **Calculation**: Total Exports - Total Imports
- **Interpretation**:
  - Positive values indicate trade surplus
  - Negative values indicate trade deficit
  - Persistent large deficits may pressure currency
  - Seasonal patterns common in trade data

### Currency Index
- **Metric ID**: `currency_index`
- **Description**: Trade-weighted currency basket index
- **Unit**: Index (base = 100)
- **Frequency**: Daily (aggregated to weekly)
- **Geography**: Global Aggregate
- **Calculation**: Weighted average of major currency pairs
- **Interpretation**:
  - Above 100 indicates appreciation vs base period
  - Below 100 indicates depreciation vs base period
  - Volatility indicates FX market stress
  - Trends reflect relative economic performance

## Risk Indicators

### Global Risk Index
- **Metric ID**: `global_risk_index`
- **Description**: Composite measure of global financial market risk
- **Unit**: Index (0-100 scale)
- **Frequency**: Daily (aggregated to weekly)
- **Geography**: Global
- **Calculation**: Synthetic composite of volatility, spreads, and correlation measures
- **Interpretation**:
  - Below 30: Low risk environment
  - 30-50: Moderate risk
  - 50-70: Elevated risk
  - Above 70: High stress conditions
  - Spikes often precede market corrections

## Data Quality Notes

### Synthetic Data Mode
All metrics in synthetic mode are generated using:
- **Base patterns**: Realistic trend and seasonal components
- **Shock events**: Major historical events (COVID-19, geopolitical events, financial stress)
- **Statistical noise**: Random variation matching real-world volatility
- **Regime shifts**: Changes in structural relationships (e.g., monetary policy pivots)

The synthetic data is designed to:
1. Match realistic value ranges for each metric
2. Preserve correlation structures between related metrics
3. Include realistic shock responses
4. Support all chart types and analytical workflows

### Open Data Mode
When connected to open data sources, metrics will be sourced from:
- GDP: World Bank, IMF, OECD national accounts
- CPI: National statistical agencies, IMF IFS
- Policy Rate: Central bank announcements, FRED
- Unemployment: ILO, national labor statistics
- Debt: IMF Fiscal Monitor, national debt offices
- Trade: WTO, national customs data
- Currency: Bloomberg, ECB reference rates
- Risk: Calculated from VIX, credit spreads, correlation metrics

## Usage Guidelines

### Selecting Time Periods
- **Short-term analysis** (< 1 year): Use monthly or higher frequency data
- **Medium-term analysis** (1-3 years): Monthly or quarterly
- **Long-term analysis** (> 3 years): Quarterly or annual

### Comparative Analysis
Metrics can be compared across:
- Time periods (historical vs current)
- Geographies (when implemented)
- Scenarios (different data modes)

### Limitations
- Synthetic data is for demonstration purposes only
- Do not use for actual economic analysis or decision-making
- Real production systems require validated data sources
- Always verify data provenance and quality in production use

## Metric Extensions

The architecture supports adding:
- Additional macro indicators (housing, manufacturing, services)
- Sector-specific metrics
- Regional breakdowns
- Alternative frequencies (daily, weekly, annual)
- Derived metrics (spreads, ratios, indices)

See the main README for guidance on adding new metrics.
