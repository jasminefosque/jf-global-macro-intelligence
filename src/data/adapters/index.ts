import { DataProvider } from '../../models/timeseries';
import { SyntheticDataProvider } from './SyntheticDataProvider';
import { OpenDataProvider } from './OpenDataProvider';

export type DataMode = 'synthetic' | 'open';

export function getDataMode(): DataMode {
  const mode = import.meta.env.VITE_DATA_MODE || 'synthetic';
  if (mode !== 'synthetic' && mode !== 'open') {
    console.warn(`Invalid VITE_DATA_MODE: ${mode}. Defaulting to 'synthetic'`);
    return 'synthetic';
  }
  return mode;
}

export function createDataProvider(): DataProvider {
  const mode = getDataMode();

  switch (mode) {
    case 'synthetic':
      return new SyntheticDataProvider();
    case 'open':
      const apiKey = import.meta.env.VITE_OPEN_DATA_API_KEY;
      return new OpenDataProvider(apiKey);
    default:
      return new SyntheticDataProvider();
  }
}

// Singleton instance
let dataProviderInstance: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (!dataProviderInstance) {
    dataProviderInstance = createDataProvider();
  }
  return dataProviderInstance;
}
