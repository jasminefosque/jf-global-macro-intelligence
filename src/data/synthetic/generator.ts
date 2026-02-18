import type { Observation, ShockEvent } from '../../models/timeseries';

interface GeneratorConfig {
  startDate: Date;
  endDate: Date;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  baseValue: number;
  trend?: number;
  seasonalAmplitude?: number;
  seasonalPeriod?: number;
  noise?: number;
  shocks?: ShockEvent[];
}

export class SyntheticDataGenerator {
  private config: GeneratorConfig;

  constructor(config: GeneratorConfig) {
    this.config = {
      trend: 0,
      seasonalAmplitude: 0,
      seasonalPeriod: 12,
      noise: 0.02,
      ...config,
    };
  }

  generate(): Observation[] {
    const observations: Observation[] = [];
    const dates = this.generateDateRange();
    
    dates.forEach((date, index) => {
      const trendComponent = this.config.trend! * index;
      const seasonalComponent = this.config.seasonalAmplitude! * 
        Math.sin((2 * Math.PI * index) / this.config.seasonalPeriod!);
      const noiseComponent = (Math.random() - 0.5) * 2 * this.config.noise! * this.config.baseValue;
      const shockComponent = this.getShockEffect(date);
      
      const value = this.config.baseValue + trendComponent + seasonalComponent + noiseComponent + shockComponent;
      
      observations.push({
        date: date.toISOString().split('T')[0],
        value: parseFloat(value.toFixed(4)),
      });
    });

    return observations;
  }

  private generateDateRange(): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(this.config.startDate);
    
    while (currentDate <= this.config.endDate) {
      dates.push(new Date(currentDate));
      currentDate = this.incrementDate(currentDate);
    }
    
    return dates;
  }

  private incrementDate(date: Date): Date {
    const newDate = new Date(date);
    
    switch (this.config.frequency) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'quarterly':
        newDate.setMonth(newDate.getMonth() + 3);
        break;
    }
    
    return newDate;
  }

  private getShockEffect(date: Date): number {
    if (!this.config.shocks || this.config.shocks.length === 0) {
      return 0;
    }

    let totalEffect = 0;
    const currentTime = date.getTime();

    for (const shock of this.config.shocks) {
      const shockDate = new Date(shock.date);
      const shockTime = shockDate.getTime();
      const daysSinceShock = (currentTime - shockTime) / (1000 * 60 * 60 * 24);

      if (daysSinceShock >= 0) {
        // Exponential decay of shock effect
        const decayRate = 0.02;
        const effect = shock.intensity * Math.exp(-decayRate * daysSinceShock);
        totalEffect += effect;
      }
    }

    return totalEffect;
  }

  static generateRandomWalk(
    startDate: Date,
    endDate: Date,
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly',
    initialValue: number,
    volatility: number = 0.01
  ): Observation[] {
    const generator = new SyntheticDataGenerator({
      startDate,
      endDate,
      frequency,
      baseValue: initialValue,
      trend: 0,
      seasonalAmplitude: 0,
      noise: volatility,
    });

    const observations = generator.generate();
    
    // Convert to random walk
    for (let i = 1; i < observations.length; i++) {
      observations[i].value = observations[i - 1].value * (1 + (Math.random() - 0.5) * volatility * 2);
      observations[i].value = parseFloat(observations[i].value.toFixed(4));
    }

    return observations;
  }
}
