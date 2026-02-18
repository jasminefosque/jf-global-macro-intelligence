import type { TimeSeries, MetricMetadata, ShockEvent } from '../../models/timeseries';
import { SyntheticDataGenerator } from './generator';

const START_DATE = new Date('2019-01-01');
const END_DATE = new Date('2024-12-31');

const SHOCK_EVENTS: ShockEvent[] = [
  { date: '2020-03-15', label: 'COVID-19 Pandemic', intensity: -5 },
  { date: '2022-02-24', label: 'Geopolitical Event', intensity: -2 },
  { date: '2023-03-10', label: 'Banking Stress', intensity: -1.5 },
];

export const METRICS_METADATA: Record<string, MetricMetadata> = {
  gdp_growth_yoy: {
    metric_id: 'gdp_growth_yoy',
    label: 'GDP Growth YoY',
    description: 'Year-over-year real GDP growth rate',
    unit: '%',
    frequency: 'quarterly',
    geography: 'Global Aggregate',
    source_type: 'synthetic',
    category: 'Growth',
  },
  cpi_inflation_yoy: {
    metric_id: 'cpi_inflation_yoy',
    label: 'CPI Inflation YoY',
    description: 'Year-over-year consumer price index inflation',
    unit: '%',
    frequency: 'monthly',
    geography: 'Global Aggregate',
    source_type: 'synthetic',
    category: 'Inflation',
  },
  policy_rate: {
    metric_id: 'policy_rate',
    label: 'Policy Rate',
    description: 'Central bank policy interest rate',
    unit: '%',
    frequency: 'monthly',
    geography: 'Global Aggregate',
    source_type: 'synthetic',
    category: 'Monetary Policy',
  },
  unemployment_rate: {
    metric_id: 'unemployment_rate',
    label: 'Unemployment Rate',
    description: 'Unemployment rate as percentage of labor force',
    unit: '%',
    frequency: 'monthly',
    geography: 'Global Aggregate',
    source_type: 'synthetic',
    category: 'Labor Market',
  },
  debt_to_gdp: {
    metric_id: 'debt_to_gdp',
    label: 'Debt to GDP',
    description: 'Government debt as percentage of GDP',
    unit: '%',
    frequency: 'quarterly',
    geography: 'Global Aggregate',
    source_type: 'synthetic',
    category: 'Fiscal',
  },
  trade_balance: {
    metric_id: 'trade_balance',
    label: 'Trade Balance',
    description: 'Trade balance (exports minus imports)',
    unit: 'USD Bn',
    frequency: 'monthly',
    geography: 'Global Aggregate',
    source_type: 'synthetic',
    category: 'Trade',
  },
  currency_index: {
    metric_id: 'currency_index',
    label: 'Currency Index',
    description: 'Trade-weighted currency index',
    unit: 'Index',
    frequency: 'daily',
    geography: 'Global Aggregate',
    source_type: 'synthetic',
    category: 'FX',
  },
  global_risk_index: {
    metric_id: 'global_risk_index',
    label: 'Global Risk Index',
    description: 'Composite measure of global financial risk',
    unit: 'Index',
    frequency: 'daily',
    geography: 'Global',
    source_type: 'synthetic',
    category: 'Risk',
  },
};

export function generateMacroMetrics(): Record<string, TimeSeries> {
  const metrics: Record<string, TimeSeries> = {};

  // GDP Growth YoY - quarterly with trend and shocks
  const gdpGenerator = new SyntheticDataGenerator({
    startDate: START_DATE,
    endDate: END_DATE,
    frequency: 'quarterly',
    baseValue: 2.5,
    trend: 0.005,
    seasonalAmplitude: 0.3,
    seasonalPeriod: 4,
    noise: 0.5,
    shocks: SHOCK_EVENTS,
  });

  metrics.gdp_growth_yoy = {
    metric_id: 'gdp_growth_yoy',
    label: 'GDP Growth YoY',
    unit: '%',
    frequency: 'quarterly',
    observations: gdpGenerator.generate(),
    geography: 'Global Aggregate',
    source: 'Synthetic Data',
  };

  // CPI Inflation YoY - monthly with seasonality
  const cpiGenerator = new SyntheticDataGenerator({
    startDate: START_DATE,
    endDate: END_DATE,
    frequency: 'monthly',
    baseValue: 2.0,
    trend: 0.015,
    seasonalAmplitude: 0.4,
    seasonalPeriod: 12,
    noise: 0.3,
    shocks: [
      { date: '2021-06-01', label: 'Supply Chain Disruption', intensity: 3 },
      { date: '2022-03-01', label: 'Energy Shock', intensity: 2.5 },
    ],
  });

  metrics.cpi_inflation_yoy = {
    metric_id: 'cpi_inflation_yoy',
    label: 'CPI Inflation YoY',
    unit: '%',
    frequency: 'monthly',
    observations: cpiGenerator.generate(),
    geography: 'Global Aggregate',
    source: 'Synthetic Data',
  };

  // Policy Rate - monthly with regime shifts
  const policyRateObs = SyntheticDataGenerator.generateRandomWalk(
    START_DATE,
    END_DATE,
    'monthly',
    2.0,
    0.05
  );
  // Add regime shift in 2022
  const shift2022Index = policyRateObs.findIndex(obs => obs.date >= '2022-03-01');
  for (let i = shift2022Index; i < policyRateObs.length; i++) {
    policyRateObs[i].value += 2.5 * ((i - shift2022Index) / 20);
    if (policyRateObs[i].value > 5.5) policyRateObs[i].value = 5.5;
  }

  metrics.policy_rate = {
    metric_id: 'policy_rate',
    label: 'Policy Rate',
    unit: '%',
    frequency: 'monthly',
    observations: policyRateObs,
    geography: 'Global Aggregate',
    source: 'Synthetic Data',
  };

  // Unemployment Rate - monthly with shocks
  const unemploymentGenerator = new SyntheticDataGenerator({
    startDate: START_DATE,
    endDate: END_DATE,
    frequency: 'monthly',
    baseValue: 5.5,
    trend: -0.008,
    seasonalAmplitude: 0.2,
    seasonalPeriod: 12,
    noise: 0.1,
    shocks: [
      { date: '2020-04-01', label: 'Pandemic Shock', intensity: 8 },
    ],
  });

  metrics.unemployment_rate = {
    metric_id: 'unemployment_rate',
    label: 'Unemployment Rate',
    unit: '%',
    frequency: 'monthly',
    observations: unemploymentGenerator.generate(),
    geography: 'Global Aggregate',
    source: 'Synthetic Data',
  };

  // Debt to GDP - quarterly with upward trend
  const debtGenerator = new SyntheticDataGenerator({
    startDate: START_DATE,
    endDate: END_DATE,
    frequency: 'quarterly',
    baseValue: 85,
    trend: 0.3,
    seasonalAmplitude: 0,
    noise: 1.5,
    shocks: [
      { date: '2020-06-01', label: 'Fiscal Expansion', intensity: 15 },
    ],
  });

  metrics.debt_to_gdp = {
    metric_id: 'debt_to_gdp',
    label: 'Debt to GDP',
    unit: '%',
    frequency: 'quarterly',
    observations: debtGenerator.generate(),
    geography: 'Global Aggregate',
    source: 'Synthetic Data',
  };

  // Trade Balance - monthly with cycles
  const tradeGenerator = new SyntheticDataGenerator({
    startDate: START_DATE,
    endDate: END_DATE,
    frequency: 'monthly',
    baseValue: -50,
    trend: 0.2,
    seasonalAmplitude: 15,
    seasonalPeriod: 12,
    noise: 8,
  });

  metrics.trade_balance = {
    metric_id: 'trade_balance',
    label: 'Trade Balance',
    unit: 'USD Bn',
    frequency: 'monthly',
    observations: tradeGenerator.generate(),
    geography: 'Global Aggregate',
    source: 'Synthetic Data',
  };

  // Currency Index - daily random walk
  const currencyObs = SyntheticDataGenerator.generateRandomWalk(
    START_DATE,
    END_DATE,
    'daily',
    100,
    0.01
  );

  metrics.currency_index = {
    metric_id: 'currency_index',
    label: 'Currency Index',
    unit: 'Index',
    frequency: 'daily',
    observations: currencyObs.filter((_, i) => i % 7 === 0), // Weekly for performance
    geography: 'Global Aggregate',
    source: 'Synthetic Data',
  };

  // Global Risk Index - daily with volatility clustering
  const riskGenerator = new SyntheticDataGenerator({
    startDate: START_DATE,
    endDate: END_DATE,
    frequency: 'daily',
    baseValue: 50,
    trend: 0,
    seasonalAmplitude: 5,
    seasonalPeriod: 252,
    noise: 3,
    shocks: SHOCK_EVENTS.map(s => ({ ...s, intensity: s.intensity * 5 })),
  });

  metrics.global_risk_index = {
    metric_id: 'global_risk_index',
    label: 'Global Risk Index',
    unit: 'Index',
    frequency: 'daily',
    observations: riskGenerator.generate().filter((_, i) => i % 7 === 0), // Weekly for performance
    geography: 'Global',
    source: 'Synthetic Data',
  };

  return metrics;
}
