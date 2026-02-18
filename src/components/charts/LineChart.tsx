import React, { useRef } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeries } from '../../models/timeseries';
import { ChartContainer } from './ChartContainer';

interface LineChartProps {
  title: string;
  description?: string;
  series: TimeSeries | TimeSeries[];
  loading?: boolean;
  error?: Error | null;
}

export function LineChart({ title, description, series, loading, error }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <ChartContainer title={title} description={description}>
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer title={title} description={description}>
        <div className="h-80 flex items-center justify-center">
          <div className="text-red-500 text-sm">{error.message}</div>
        </div>
      </ChartContainer>
    );
  }

  const seriesArray = Array.isArray(series) ? series : [series];
  
  if (seriesArray.length === 0 || seriesArray[0].observations.length === 0) {
    return (
      <ChartContainer title={title} description={description}>
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">No data available</div>
        </div>
      </ChartContainer>
    );
  }

  // Merge data from multiple series
  const mergedData = seriesArray[0].observations.map((obs, index) => {
    const dataPoint: Record<string, string | number> = { date: obs.date };
    seriesArray.forEach((s) => {
      if (s.observations[index]) {
        dataPoint[s.label] = s.observations[index].value;
      }
    });
    return dataPoint;
  });

  const colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <ChartContainer 
      title={title} 
      description={description} 
      source={seriesArray[0].source}
      chartRef={chartRef}
    >
      <div ref={chartRef} className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={mergedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '12px',
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              formatter={(value: number) => [value.toFixed(2), '']}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {seriesArray.map((s, index) => (
              <Line
                key={s.metric_id}
                type="monotone"
                dataKey={s.label}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                name={`${s.label} (${s.unit})`}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
