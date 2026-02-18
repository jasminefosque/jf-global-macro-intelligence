import { describe, it, expect } from 'vitest';
import { TimeSeriesSchema, MetricMetadataSchema } from '../models/timeseries';

describe('Zod Schemas', () => {
  describe('TimeSeriesSchema', () => {
    it('validates correct time series data', () => {
      const validData = {
        metric_id: 'gdp_growth',
        label: 'GDP Growth',
        unit: '%',
        frequency: 'quarterly' as const,
        observations: [
          { date: '2020-01-01', value: 2.5 },
          { date: '2020-04-01', value: 3.0 },
        ],
        geography: 'US',
        source: 'Test Source',
      };

      const result = TimeSeriesSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid frequency', () => {
      const invalidData = {
        metric_id: 'gdp_growth',
        label: 'GDP Growth',
        unit: '%',
        frequency: 'invalid_frequency',
        observations: [],
      };

      const result = TimeSeriesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid date format', () => {
      const invalidData = {
        metric_id: 'gdp_growth',
        label: 'GDP Growth',
        unit: '%',
        frequency: 'monthly' as const,
        observations: [
          { date: 'not-a-date', value: 2.5 },
        ],
      };

      const result = TimeSeriesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts optional fields', () => {
      const minimalData = {
        metric_id: 'test',
        label: 'Test',
        unit: '%',
        frequency: 'monthly' as const,
        observations: [],
      };

      const result = TimeSeriesSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe('MetricMetadataSchema', () => {
    it('validates correct metadata', () => {
      const validData = {
        metric_id: 'gdp_growth',
        label: 'GDP Growth',
        description: 'Year-over-year GDP growth rate',
        unit: '%',
        frequency: 'quarterly' as const,
        geography: 'US',
        source_type: 'synthetic' as const,
        category: 'Growth',
      };

      const result = MetricMetadataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid source_type', () => {
      const invalidData = {
        metric_id: 'gdp_growth',
        label: 'GDP Growth',
        description: 'Test',
        unit: '%',
        frequency: 'quarterly' as const,
        source_type: 'invalid_type',
      };

      const result = MetricMetadataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
