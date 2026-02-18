# Customization Guide

This guide explains how to customize and extend the Global Macro Intelligence dashboard for your specific needs.

## Quick Start Customization

### 1. Rename the Repository

If you want to create a different dashboard (e.g., Monetary Shock Monitor, Capital Markets Intelligence):

```bash
# Clone the repository with a new name
git clone https://github.com/jasminefosque/jf-global-macro-intelligence.git jf-monetary-shock-monitor

# Update package.json name
{
  "name": "jf-monetary-shock-monitor",
  ...
}
```

### 2. Customize Brand Colors

Edit `src/index.css`:

```css
@theme {
  /* Change primary brand color */
  --color-primary-600: #your-brand-color;
  --color-primary-700: #your-darker-brand-color;
  
  /* Add additional brand colors */
  --color-secondary-600: #another-color;
}
```

Common institutional color schemes:
- **Financial Blue**: `#0284c7` (current)
- **Professional Green**: `#059669`
- **Corporate Purple**: `#7c3aed`
- **Classic Navy**: `#1e40af`

### 3. Change Typography

Edit `src/index.css`:

```css
@layer base {
  body {
    font-family: 'Your Font', -apple-system, sans-serif;
  }
}
```

Recommended institutional fonts:
- Inter (modern, professional)
- IBM Plex Sans (technical, clean)
- Roboto (neutral, readable)
- SF Pro Display (Apple-like)

Install custom fonts via Google Fonts or hosting locally.

### 4. Update Dashboard Title and Branding

Edit `src/components/layout/Sidebar.tsx`:

```typescript
<h1 className="text-xl font-bold text-gray-900">Your Dashboard</h1>
<h2 className="text-sm text-gray-600">Your Subtitle</h2>
```

Edit `index.html` for page title:

```html
<title>Your Dashboard Name</title>
```

## Adding a New Metric

### Step 1: Define Metadata

Edit `src/data/synthetic/macroMetrics.ts`:

```typescript
export const METRICS_METADATA: Record<string, MetricMetadata> = {
  // ... existing metrics
  
  my_new_metric: {
    metric_id: 'my_new_metric',
    label: 'My New Metric',
    description: 'Description of what this metric measures',
    unit: 'Units (%, USD Bn, Index, etc.)',
    frequency: 'monthly', // or daily, weekly, quarterly
    geography: 'Geographic scope',
    source_type: 'synthetic',
    category: 'Your Category',
  },
};
```

### Step 2: Generate Synthetic Data

In the same file, add to `generateMacroMetrics()`:

```typescript
export function generateMacroMetrics(): Record<string, TimeSeries> {
  const metrics: Record<string, TimeSeries> = {};
  
  // ... existing metrics
  
  // Your new metric
  const myMetricGenerator = new SyntheticDataGenerator({
    startDate: START_DATE,
    endDate: END_DATE,
    frequency: 'monthly',
    baseValue: 100,        // Starting value
    trend: 0.1,           // Growth per period
    seasonalAmplitude: 5,  // Seasonal variation
    seasonalPeriod: 12,    // Period length
    noise: 2,             // Random noise
    shocks: [             // Optional shock events
      { date: '2020-03-15', label: 'Event', intensity: -10 },
    ],
  });

  metrics.my_new_metric = {
    metric_id: 'my_new_metric',
    label: 'My New Metric',
    unit: '%',
    frequency: 'monthly',
    observations: myMetricGenerator.generate(),
    geography: 'Global',
    source: 'Synthetic Data',
  };

  return metrics;
}
```

### Step 3: Add to Dashboard

Edit `src/pages/Dashboard.tsx`:

```typescript
// Add data fetching
const { data: myMetricData, loading: myMetricLoading, error: myMetricError } = 
  useTimeSeries('my_new_metric', dateRange);

// Add KPI card (if needed)
<KPICard
  title="My Metric"
  value={myMetricLatest ?? 0}
  unit="%"
  loading={myMetricLoading}
/>

// Add chart
<LineChart
  title="My New Metric"
  description="Detailed description of the metric"
  series={myMetricData!}
  loading={myMetricLoading}
  error={myMetricError}
/>
```

### Step 4: Update Documentation

Add to `docs/METRICS.md`:

```markdown
### My New Metric
- **Metric ID**: `my_new_metric`
- **Description**: What this metric measures
- **Unit**: %
- **Frequency**: Monthly
- **Interpretation**: How to read the values
```

## Creating Different Chart Types

### Area Chart

Create `src/components/charts/AreaChart.tsx`:

```typescript
import { AreaChart as RechartsAreaChart, Area, ... } from 'recharts';

export function AreaChart({ title, series, ... }: ChartProps) {
  // Similar structure to LineChart but using Area components
  return (
    <ChartContainer title={title} ...>
      <ResponsiveContainer>
        <RechartsAreaChart data={...}>
          <Area type="monotone" dataKey="..." fill="..." stroke="..." />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
```

### Bar Chart

```typescript
import { BarChart as RechartsBarChart, Bar, ... } from 'recharts';

export function BarChart({ title, series, ... }: ChartProps) {
  return (
    <ChartContainer title={title} ...>
      <ResponsiveContainer>
        <RechartsBarChart data={...}>
          <Bar dataKey="..." fill="..." />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
```

## Adding Real Open Data Sources

### Example: Federal Reserve Economic Data (FRED)

FRED is completely free and doesn't require an API key for basic access.

Edit `src/data/adapters/OpenDataProvider.ts`:

```typescript
export class OpenDataProvider implements DataProvider {
  async getSeries(metricId: string, params?: Record<string, unknown>): Promise<TimeSeries> {
    // Map your metric IDs to FRED series IDs
    const FRED_MAPPING: Record<string, string> = {
      'gdp_growth_yoy': 'A191RL1Q225SBEA',
      'cpi_inflation_yoy': 'CPIAUCSL',
      'policy_rate': 'FEDFUNDS',
      'unemployment_rate': 'UNRATE',
    };

    const fredSeriesId = FRED_MAPPING[metricId];
    if (!fredSeriesId) {
      throw new Error(`No FRED mapping for metric: ${metricId}`);
    }

    // Fetch from FRED (no API key needed for recent data)
    const response = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${fredSeriesId}&file_type=json`
    );
    
    const data = await response.json();

    // Transform FRED format to TimeSeries schema
    const observations = data.observations.map((obs: any) => ({
      date: obs.date,
      value: parseFloat(obs.value),
    }));

    const timeSeries: TimeSeries = {
      metric_id: metricId,
      label: this.getLabel(metricId),
      unit: this.getUnit(metricId),
      frequency: 'monthly',
      observations,
      source: 'FRED',
    };

    // Validate with Zod
    return TimeSeriesSchema.parse(timeSeries);
  }

  private getLabel(metricId: string): string {
    // Return appropriate labels
  }
  
  private getUnit(metricId: string): string {
    // Return appropriate units
  }
}
```

### Example: World Bank API

```typescript
async getSeries(metricId: string): Promise<TimeSeries> {
  const WB_MAPPING: Record<string, string> = {
    'gdp_growth_yoy': 'NY.GDP.MKTP.KD.ZG',
    'debt_to_gdp': 'GC.DOD.TOTL.GD.ZS',
  };

  const indicator = WB_MAPPING[metricId];
  const response = await fetch(
    `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&date=2015:2024`
  );

  const [metadata, data] = await response.json();

  const observations = data.map((item: any) => ({
    date: `${item.date}-01-01`,
    value: item.value,
  })).filter((obs: any) => obs.value !== null);

  // Transform and validate...
}
```

## Deployment

### Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables:
   ```
   VITE_DATA_MODE=synthetic
   ```
4. Deploy

### Netlify

1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Set environment variables in Netlify UI
3. Deploy

### Custom Static Host

```bash
npm run build
# Upload dist/ folder to your web server
```

## Advanced Customizations

### Adding Authentication

Use authentication providers like:
- Supabase Auth
- Auth0
- Firebase Auth
- Clerk

Example with Supabase:

```typescript
// src/lib/auth.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export { supabase };
```

### Adding User Preferences

Use Zustand to persist user preferences:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePreferencesStore = create(
  persist(
    (set) => ({
      theme: 'light',
      defaultDateRange: 'ytd',
      favoriteMetrics: [],
      setTheme: (theme) => set({ theme }),
      // ...
    }),
    { name: 'user-preferences' }
  )
);
```

### Adding Dark Mode

Add theme toggle in `src/index.css`:

```css
@theme {
  /* Light mode */
  --color-background: #ffffff;
  --color-text: #111827;
  
  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    --color-background: #111827;
    --color-text: #f9fafb;
  }
}
```

### Multi-Geography Support

Extend the data provider to support geography filtering:

```typescript
async getSeries(metricId: string, params?: { geography?: string }): Promise<TimeSeries> {
  const geography = params?.geography || 'global';
  
  // Generate or fetch geography-specific data
  // ...
}
```

## Performance Optimization

### Code Splitting

Use React.lazy for route-based splitting:

```typescript
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Data Caching

Implement caching in data provider:

```typescript
private cache = new Map<string, { data: TimeSeries; timestamp: number }>();
private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async getSeries(metricId: string): Promise<TimeSeries> {
  const cached = this.cache.get(metricId);
  if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
    return cached.data;
  }

  const data = await this.fetchSeries(metricId);
  this.cache.set(metricId, { data, timestamp: Date.now() });
  return data;
}
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Tailwind Styles Not Applied

Check that `src/index.css` is imported in `main.tsx` and postcss.config.js is correct.

### Charts Not Rendering

Ensure Recharts peer dependencies are installed:
```bash
npm install react react-dom
```

### Environment Variables Not Loading

Vite requires `VITE_` prefix:
```
VITE_MY_VAR=value  # ✅ Works
MY_VAR=value       # ❌ Won't work
```

## Getting Help

- Check docs/ folder for detailed documentation
- Review existing implementations for patterns
- TypeScript types will guide you
- Use ESLint to catch issues early

## Contributing

If you build something useful based on this template, consider:
- Documenting your customizations
- Sharing back improvements
- Creating reusable components

---

**Remember**: This is a portfolio demonstration template. Always implement proper security, testing, and data validation for production use.
