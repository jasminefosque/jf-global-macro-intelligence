interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  loading?: boolean;
}

export function KPICard({ title, value, unit, change, changeLabel, loading }: KPICardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const changeColor = change && change > 0 ? 'text-green-600' : change && change < 0 ? 'text-red-600' : 'text-gray-600';
  const changeIcon = change && change > 0 ? '↑' : change && change < 0 ? '↓' : '';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="text-sm font-medium text-gray-600 mb-2">{title}</div>
      <div className="flex items-baseline space-x-2">
        <div className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </div>
        {unit && <div className="text-lg text-gray-600">{unit}</div>}
      </div>
      {change !== undefined && (
        <div className={`text-sm font-medium mt-2 ${changeColor}`}>
          {changeIcon} {Math.abs(change).toFixed(2)}% {changeLabel || 'vs previous'}
        </div>
      )}
    </div>
  );
}
