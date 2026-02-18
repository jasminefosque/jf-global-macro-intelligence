import { useState, useEffect } from 'react';
import { TimeSeries, MetricMetadata } from '../models/timeseries';
import { getDataProvider } from '../data/adapters';

export function useTimeSeries(metricId: string, params?: Record<string, unknown>) {
  const [data, setData] = useState<TimeSeries | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const provider = getDataProvider();
        const series = await provider.getSeries(metricId, params);
        if (isMounted) {
          setData(series);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [metricId, JSON.stringify(params)]);

  return { data, loading, error };
}

export function useLatestValue(metricId: string, params?: Record<string, unknown>) {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const provider = getDataProvider();
        const latest = await provider.getLatest(metricId, params);
        if (isMounted) {
          setValue(latest);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setValue(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [metricId, JSON.stringify(params)]);

  return { value, loading, error };
}

export function useMetadata(metricId: string) {
  const [metadata, setMetadata] = useState<MetricMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const provider = getDataProvider();
        const meta = await provider.getMetadata(metricId);
        if (isMounted) {
          setMetadata(meta);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setMetadata(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [metricId]);

  return { metadata, loading, error };
}
