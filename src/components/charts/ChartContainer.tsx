import { type RefObject } from 'react';
import { exportChartAsPNG } from '../../lib/chartExport';

interface ChartContainerProps {
  title: string;
  description?: string;
  source?: string;
  children: React.ReactNode;
  chartRef?: RefObject<HTMLDivElement | null>;
}

export function ChartContainer({ title, description, source, children, chartRef }: ChartContainerProps) {
  const handleExport = () => {
    if (chartRef?.current) {
      exportChartAsPNG(chartRef.current, title);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <div className="group relative">
                <svg
                  className="w-4 h-4 text-gray-400 cursor-help"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="hidden group-hover:block absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  {description}
                </div>
              </div>
            )}
          </div>
          {source && (
            <p className="text-xs text-gray-500 mt-1">Source: {source}</p>
          )}
        </div>
        {chartRef && (
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Export PNG
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
