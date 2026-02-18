import { z } from 'zod';

export const FrequencySchema = z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annual']);
export type Frequency = z.infer<typeof FrequencySchema>;

export const ObservationSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid ISO date string',
  }),
  value: z.number(),
});
export type Observation = z.infer<typeof ObservationSchema>;

export const TimeSeriesSchema = z.object({
  metric_id: z.string(),
  label: z.string(),
  unit: z.string(),
  frequency: FrequencySchema,
  observations: z.array(ObservationSchema),
  geography: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
});
export type TimeSeries = z.infer<typeof TimeSeriesSchema>;

export const MetricMetadataSchema = z.object({
  metric_id: z.string(),
  label: z.string(),
  description: z.string(),
  unit: z.string(),
  frequency: FrequencySchema,
  geography: z.string().optional(),
  source_type: z.enum(['synthetic', 'open', 'proprietary']),
  category: z.string().optional(),
});
export type MetricMetadata = z.infer<typeof MetricMetadataSchema>;

export interface DataProvider {
  getSeries(metricId: string, params?: Record<string, unknown>): Promise<TimeSeries>;
  getLatest(metricId: string, params?: Record<string, unknown>): Promise<number | null>;
  getMetadata(metricId: string): Promise<MetricMetadata>;
  listMetrics(): Promise<MetricMetadata[]>;
}

export interface ShockEvent {
  date: string;
  label: string;
  intensity: number;
}
