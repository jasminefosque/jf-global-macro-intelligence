import { useAppStore } from '../../lib/store';
import { getDataMode } from '../../data/adapters';

export function MethodologyDrawer() {
  const { isMethodologyOpen, setMethodologyOpen } = useAppStore();
  const dataMode = getDataMode();

  if (!isMethodologyOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setMethodologyOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Methodology</h2>
            <button
              onClick={() => setMethodologyOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Architecture</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This dashboard demonstrates a clean, layered data architecture designed for
                institutional-grade macroeconomic intelligence systems.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Mode</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">
                  {dataMode === 'synthetic' ? 'Synthetic Data Mode' : 'Open Data Mode'}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {dataMode === 'synthetic'
                    ? 'Using generated datasets for portfolio demonstration'
                    : 'Connected to open data sources'}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Provider Interface</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                All data access goes through a standardized DataProvider interface with these methods:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li><code className="text-xs bg-gray-100 px-1 py-0.5 rounded">getSeries()</code> - Fetch time series data</li>
                <li><code className="text-xs bg-gray-100 px-1 py-0.5 rounded">getLatest()</code> - Get most recent value</li>
                <li><code className="text-xs bg-gray-100 px-1 py-0.5 rounded">getMetadata()</code> - Retrieve metric definitions</li>
                <li><code className="text-xs bg-gray-100 px-1 py-0.5 rounded">listMetrics()</code> - List available metrics</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Schema Validation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                All time series data is validated using Zod schemas to ensure type safety and
                data integrity. Each observation contains an ISO date string and a numeric value.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Synthetic Data Generation</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                The synthetic data provider generates realistic macroeconomic patterns including:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Long-term trends</li>
                <li>Seasonal patterns</li>
                <li>Shock events and regime shifts</li>
                <li>Statistical noise</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Swapping Data Sources</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                To connect this dashboard to real open data sources:
              </p>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Implement the OpenDataProvider methods</li>
                <li>Map metric IDs to external source identifiers</li>
                <li>Transform external formats to TimeSeries schema</li>
                <li>Set VITE_DATA_MODE=open in .env</li>
              </ol>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                The entire application will work seamlessly with the new data source without
                requiring changes to charts, components, or application logic.
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
                This portfolio repository demonstrates dashboard architecture and engineering
                capability without exposing proprietary data pipelines or production systems.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
