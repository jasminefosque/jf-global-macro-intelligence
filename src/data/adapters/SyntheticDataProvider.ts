import { DataProvider, TimeSeries, MetricMetadata } from '../../models/timeseries';
import { generateMacroMetrics, METRICS_METADATA } from './macroMetrics';

export class SyntheticDataProvider implements DataProvider {
  private metricsCache: Record<string, TimeSeries> | null = null;

  private getMetricsCache(): Record<string, TimeSeries> {
    if (!this.metricsCache) {
      this.metricsCache = generateMacroMetrics();
    }
    return this.metricsCache;
  }

  async getSeries(
    metricId: string,
    params?: Record<string, unknown>
  ): Promise<TimeSeries> {
    const metrics = this.getMetricsCache();
    const series = metrics[metricId];

    if (!series) {
      throw new Error(`Metric not found: ${metricId}`);
    }

    // Apply date filtering if provided
    if (params?.startDate || params?.endDate) {
      const startDate = params.startDate as string | undefined;
      const endDate = params.endDate as string | undefined;

      const filteredObservations = series.observations.filter((obs) => {
        if (startDate && obs.date < startDate) return false;
        if (endDate && obs.date > endDate) return false;
        return true;
      });

      return {
        ...series,
        observations: filteredObservations,
      };
    }

    return series;
  }

  async getLatest(
    metricId: string,
    params?: Record<string, unknown>
  ): Promise<number | null> {
    const series = await this.getSeries(metricId, params);
    
    if (series.observations.length === 0) {
      return null;
    }

    return series.observations[series.observations.length - 1].value;
  }

  async getMetadata(metricId: string): Promise<MetricMetadata> {
    const metadata = METRICS_METADATA[metricId];

    if (!metadata) {
      throw new Error(`Metadata not found: ${metricId}`);
    }

    return metadata;
  }

  async listMetrics(): Promise<MetricMetadata[]> {
    return Object.values(METRICS_METADATA);
  }
}
