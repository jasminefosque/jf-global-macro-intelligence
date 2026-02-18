import type { DataProvider, TimeSeries, MetricMetadata } from '../../models/timeseries';

/**
 * OpenDataProvider - Stub implementation for connecting to open data sources
 * 
 * TODO: Implement adapters for specific open data sources such as:
 * - FRED (Federal Reserve Economic Data) - completely free, no API key required
 * - World Bank Open Data API
 * - IMF Data API
 * - OECD Data API
 * 
 * Implementation guidance:
 * 1. Map metric_ids to external source identifiers
 * 2. Transform external data formats to TimeSeries schema
 * 3. Handle rate limiting and caching
 * 4. Validate with Zod schemas before returning
 */
export class OpenDataProvider implements DataProvider {
  constructor(_apiKey?: string) {
    // API key parameter reserved for future use
  }

  async getSeries(
    metricId: string,
    params?: Record<string, unknown>
  ): Promise<TimeSeries> {
    // TODO: Implement actual data fetching from open sources
    // Example: fetch from FRED API
    // const response = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${this.apiKey}`);
    
    throw new Error(
      `OpenDataProvider not implemented. To use open data mode:\n` +
      `1. Implement the getSeries method for your chosen data source\n` +
      `2. Add API configuration to .env (if required)\n` +
      `3. Map metric IDs to external source identifiers\n` +
      `Current metric_id: ${metricId}, params: ${JSON.stringify(params)}`
    );
  }

  async getLatest(
    metricId: string,
    _params?: Record<string, unknown>
  ): Promise<number | null> {
    // TODO: Implement latest value fetching
    throw new Error(
      `OpenDataProvider.getLatest not implemented for metric: ${metricId}`
    );
  }

  async getMetadata(metricId: string): Promise<MetricMetadata> {
    // TODO: Implement metadata fetching or define static mappings
    throw new Error(
      `OpenDataProvider.getMetadata not implemented for metric: ${metricId}`
    );
  }

  async listMetrics(): Promise<MetricMetadata[]> {
    // TODO: Return list of available metrics from open sources
    throw new Error('OpenDataProvider.listMetrics not implemented');
  }
}
