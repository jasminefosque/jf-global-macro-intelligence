# Architecture Documentation

This document describes the technical architecture of the Global Macro Intelligence dashboard.

## System Overview

The dashboard follows a clean, layered architecture designed for:
- **Maintainability**: Clear separation of concerns
- **Testability**: Pure functions and dependency injection
- **Scalability**: Modular design supporting growth
- **Flexibility**: Easy to swap data sources

## Architecture Layers

### 1. Presentation Layer
**Location**: `src/components/`, `src/pages/`

Responsible for UI rendering and user interaction.

**Components**:
- **Layout Components**: AppLayout, Sidebar, TopBar, MethodologyDrawer
- **Chart Components**: LineChart, BarChart, ChartContainer
- **UI Components**: KPICard, ErrorBoundary
- **Pages**: Dashboard

**Design Principles**:
- Functional components with hooks
- Props-based configuration
- Controlled components
- Responsive design with Tailwind CSS

### 2. State Management Layer
**Location**: `src/lib/store.ts`, `src/hooks/`

Manages application state and side effects.

**Implementation**:
- **Zustand** for global state (filters, UI state)
- **React hooks** for component-local state
- **Custom hooks** for data fetching (`useTimeSeries`, `useLatestValue`)

**State Structure**:
```typescript
interface AppState {
  dateRange: { startDate: string; endDate: string };
  selectedGeography: string;
  isMethodologyOpen: boolean;
}
```

### 3. Data Access Layer
**Location**: `src/data/adapters/`

Provides unified interface to different data sources.

**Core Interface**:
```typescript
interface DataProvider {
  getSeries(metricId: string, params?: Record<string, unknown>): Promise<TimeSeries>;
  getLatest(metricId: string, params?: Record<string, unknown>): Promise<number | null>;
  getMetadata(metricId: string): Promise<MetricMetadata>;
  listMetrics(): Promise<MetricMetadata[]>;
}
```

**Implementations**:
1. **SyntheticDataProvider** - Complete implementation using generated data
2. **OpenDataProvider** - Stub for connecting to open data sources

**Factory Pattern**:
```typescript
function createDataProvider(): DataProvider {
  const mode = getDataMode();
  return mode === 'synthetic' 
    ? new SyntheticDataProvider() 
    : new OpenDataProvider();
}
```

### 4. Data Generation Layer
**Location**: `src/data/synthetic/`

Generates realistic macroeconomic time series.

**Components**:
- **SyntheticDataGenerator**: Core generator with configurable patterns
- **macroMetrics**: Domain-specific metric generation

**Features**:
- Trend generation (linear, exponential)
- Seasonal patterns (configurable period and amplitude)
- Shock events with exponential decay
- Statistical noise
- Regime shifts

**Example**:
```typescript
const generator = new SyntheticDataGenerator({
  startDate: new Date('2020-01-01'),
  endDate: new Date('2024-12-31'),
  frequency: 'monthly',
  baseValue: 2.5,
  trend: 0.01,
  seasonalAmplitude: 0.3,
  noise: 0.05,
  shocks: [
    { date: '2020-03-15', label: 'Pandemic', intensity: -5 }
  ],
});
```

### 5. Schema Validation Layer
**Location**: `src/models/`

Ensures type safety and data integrity.

**Technology**: Zod schemas

**Core Schemas**:
```typescript
const TimeSeriesSchema = z.object({
  metric_id: z.string(),
  label: z.string(),
  unit: z.string(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
  observations: z.array(z.object({
    date: z.string(),
    value: z.number(),
  })),
  geography: z.string().optional(),
  source: z.string().optional(),
});
```

**Validation Points**:
- Data provider responses
- User input
- External API responses (when implemented)

## Data Flow

### Read Path
```
User Action
    ↓
Component State Change
    ↓
Custom Hook (useTimeSeries)
    ↓
Data Provider Interface
    ↓
Concrete Provider (Synthetic or Open)
    ↓
Data Generation / API Call
    ↓
Zod Validation
    ↓
Component Re-render
```

### Filter Path
```
User Changes Filter (Date/Geography)
    ↓
Zustand Store Update
    ↓
Hooks Re-execute with New Params
    ↓
Data Re-fetched
    ↓
Charts Update
```

## Chart Architecture

### ChartContainer Pattern
All charts are wrapped in `ChartContainer` which provides:
- Title and description
- Tooltip with definitions
- Source attribution
- Export button
- Consistent styling

### Chart Types
**Current**:
- LineChart (time series)

**Extensible To**:
- BarChart (comparisons)
- AreaChart (cumulative values)
- ScatterPlot (correlations)
- Heatmap (correlation matrices)

### Chart Configuration
```typescript
interface ChartProps {
  title: string;
  description?: string;
  series: TimeSeries | TimeSeries[];
  loading?: boolean;
  error?: Error | null;
}
```

## Export System

### Chart Export (PNG)
**Library**: html2canvas

**Flow**:
1. User clicks "Export PNG"
2. html2canvas captures chart DOM element
3. Converts to canvas and PNG data URL
4. Triggers browser download

**Implementation**:
```typescript
async function exportChartAsPNG(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element);
  const dataUrl = canvas.toDataURL('image/png');
  // Trigger download
}
```

### Data Export (JSON)
**Flow**:
1. User clicks "Download Sample Data"
2. Fetch all metrics from data provider
3. Serialize to JSON
4. Trigger browser download

## Error Handling

### Error Boundary
Catches React component errors and displays fallback UI.

**Location**: `src/components/ErrorBoundary.tsx`

**Features**:
- User-friendly error messages
- Reload button
- Console logging for debugging

### Loading States
All data-fetching hooks return:
```typescript
{
  data: T | null;
  loading: boolean;
  error: Error | null;
}
```

Components display:
- Skeleton loaders during fetch
- Error messages on failure
- Empty states for no data

## Performance Optimizations

### Data Caching
- SyntheticDataProvider caches generated metrics
- Single generation per session
- Lazy initialization

### Chart Optimization
- Daily data aggregated to weekly for display
- Recharts handles virtualization
- ResponsiveContainer for adaptive sizing

### Code Splitting
- React.lazy for route-based splitting (future)
- Dynamic imports for heavy libraries

## Testing Strategy

### Unit Tests
**Target**: Pure functions and utilities
- Synthetic data generator
- Schema validation
- Chart export utilities

**Example**:
```typescript
describe('SyntheticDataGenerator', () => {
  it('generates correct number of observations', () => {
    const generator = new SyntheticDataGenerator({...});
    const data = generator.generate();
    expect(data.length).toBe(expectedCount);
  });
});
```

### Integration Tests
**Target**: Data provider interface
- Mock API responses
- Test data transformations
- Validate schema compliance

### Component Tests
**Target**: UI components
- Render with loading state
- Render with data
- Render with error
- User interactions

## Security Considerations

### No Sensitive Data
- No API keys in code
- No production endpoints
- No database credentials
- Environment variables in .gitignore

### Input Validation
- Zod schemas validate all external data
- Date range validation
- Parameter sanitization

### XSS Prevention
- React escapes by default
- No dangerouslySetInnerHTML
- Sanitized user inputs

## Deployment

### Build Process
```bash
npm run build
```
Outputs to `dist/` directory.

### Environment Variables
Required in production:
```
VITE_DATA_MODE=synthetic|open
VITE_OPEN_DATA_API_KEY=xxx  # If using open mode
```

### Static Hosting
Compatible with:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static host

## Extension Points

### Adding New Data Source
1. Implement `DataProvider` interface
2. Add to factory in `src/data/adapters/index.ts`
3. Add mode to environment configuration

### Adding New Chart Type
1. Create component in `src/components/charts/`
2. Use `ChartContainer` wrapper
3. Accept `TimeSeries` prop
4. Handle loading/error states

### Adding New Metric
1. Add metadata to `METRICS_METADATA`
2. Implement generation in `generateMacroMetrics()`
3. Add chart to Dashboard page
4. Update documentation

### Adding New Geography
1. Extend `selectedGeography` state
2. Implement geography filtering in providers
3. Generate region-specific data
4. Update UI geography selector

## Technology Decisions

### Why Zustand over Redux?
- Simpler API
- Less boilerplate
- Sufficient for dashboard state
- Easy to test

### Why Recharts over D3?
- React-friendly API
- Built-in responsiveness
- Adequate for standard charts
- Lower learning curve

### Why Zod over Yup?
- Better TypeScript integration
- Type inference
- Composable schemas
- Active maintenance

### Why Vite over CRA?
- Faster dev server
- Better build performance
- Modern defaults
- Active ecosystem

## Monitoring & Observability

### Console Logging
- Error logs for failures
- Warnings for invalid configs
- Info logs for mode switches

### Future Enhancements
- Error tracking (Sentry)
- Analytics (Google Analytics, Mixpanel)
- Performance monitoring (Web Vitals)
- User session replay

## Maintenance

### Dependency Updates
```bash
npm outdated
npm update
```

### Security Audits
```bash
npm audit
npm audit fix
```

### Code Quality
```bash
npm run lint
npm run build  # Type checking
```

## Further Reading

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
