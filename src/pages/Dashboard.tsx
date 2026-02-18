import React from 'react';
import { KPICard } from '../components/KPICard';
import { LineChart } from '../components/charts/LineChart';
import { useTimeSeries, useLatestValue } from '../hooks/useData';
import { useAppStore } from '../lib/store';
import { downloadJSON } from '../lib/chartExport';
import { getDataProvider } from '../data/adapters';

export function Dashboard() {
  const { dateRange } = useAppStore();

  // Fetch KPI data
  const { value: gdpLatest, loading: gdpLoading } = useLatestValue('gdp_growth_yoy');
  const { value: cpiLatest, loading: cpiLoading } = useLatestValue('cpi_inflation_yoy');
  const { value: policyRateLatest, loading: policyLoading } = useLatestValue('policy_rate');
  const { value: unemploymentLatest, loading: unemploymentLoading } = useLatestValue('unemployment_rate');

  // Fetch chart data
  const { data: gdpData, loading: gdpChartLoading, error: gdpError } = useTimeSeries('gdp_growth_yoy', dateRange);
  const { data: cpiData, loading: cpiChartLoading, error: cpiError } = useTimeSeries('cpi_inflation_yoy', dateRange);
  const { data: policyRateData, loading: policyChartLoading, error: policyError } = useTimeSeries('policy_rate', dateRange);
  const { data: unemploymentData, loading: unemploymentChartLoading, error: unemploymentError } = useTimeSeries('unemployment_rate', dateRange);
  const { data: debtData, loading: debtChartLoading, error: debtError } = useTimeSeries('debt_to_gdp', dateRange);
  const { data: tradeData, loading: tradeChartLoading, error: tradeError } = useTimeSeries('trade_balance', dateRange);
  const { data: currencyData, loading: currencyChartLoading, error: currencyError } = useTimeSeries('currency_index', dateRange);
  const { data: riskData, loading: riskChartLoading, error: riskError } = useTimeSeries('global_risk_index', dateRange);

  const handleDownloadData = async () => {
    const provider = getDataProvider();
    const metrics = await provider.listMetrics();
    const allData: Record<string, unknown> = {};

    for (const metric of metrics) {
      try {
        const series = await provider.getSeries(metric.metric_id, dateRange);
        allData[metric.metric_id] = series;
      } catch (error) {
        console.error(`Failed to fetch ${metric.metric_id}:`, error);
      }
    }

    downloadJSON(allData, 'macro_intelligence_data');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Macro Intelligence</h1>
          <p className="text-gray-600 mt-1">Comprehensive macroeconomic monitoring and analysis</p>
        </div>
        <button
          onClick={handleDownloadData}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
        >
          Download Sample Data
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="GDP Growth"
          value={gdpLatest ?? 0}
          unit="%"
          loading={gdpLoading}
        />
        <KPICard
          title="CPI Inflation"
          value={cpiLatest ?? 0}
          unit="%"
          loading={cpiLoading}
        />
        <KPICard
          title="Policy Rate"
          value={policyRateLatest ?? 0}
          unit="%"
          loading={policyLoading}
        />
        <KPICard
          title="Unemployment"
          value={unemploymentLatest ?? 0}
          unit="%"
          loading={unemploymentLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="GDP Growth Year-over-Year"
          description="Real GDP growth rate measured year-over-year"
          series={gdpData!}
          loading={gdpChartLoading}
          error={gdpError}
        />
        <LineChart
          title="CPI Inflation Year-over-Year"
          description="Consumer price index inflation measured year-over-year"
          series={cpiData!}
          loading={cpiChartLoading}
          error={cpiError}
        />
        <LineChart
          title="Central Bank Policy Rate"
          description="Benchmark policy interest rate set by central bank"
          series={policyRateData!}
          loading={policyChartLoading}
          error={policyError}
        />
        <LineChart
          title="Unemployment Rate"
          description="Unemployment as percentage of total labor force"
          series={unemploymentData!}
          loading={unemploymentChartLoading}
          error={unemploymentError}
        />
        <LineChart
          title="Government Debt to GDP"
          description="Total government debt as percentage of GDP"
          series={debtData!}
          loading={debtChartLoading}
          error={debtError}
        />
        <LineChart
          title="Trade Balance"
          description="Net trade balance (exports minus imports)"
          series={tradeData!}
          loading={tradeChartLoading}
          error={tradeError}
        />
        <LineChart
          title="Currency Index"
          description="Trade-weighted currency basket index"
          series={currencyData!}
          loading={currencyChartLoading}
          error={currencyError}
        />
        <LineChart
          title="Global Risk Index"
          description="Composite measure of global financial market risk"
          series={riskData!}
          loading={riskChartLoading}
          error={riskError}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500 text-center">
          This dashboard demonstrates institutional-grade data architecture and visualization systems.
          Production data pipelines and proprietary datasets are not included.
        </p>
      </div>
    </div>
  );
}
