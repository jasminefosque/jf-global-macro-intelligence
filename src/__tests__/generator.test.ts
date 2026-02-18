import { describe, it, expect } from 'vitest';
import { SyntheticDataGenerator } from '../data/synthetic/generator';

describe('SyntheticDataGenerator', () => {
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2020-12-31');

  it('generates correct number of monthly observations', () => {
    const generator = new SyntheticDataGenerator({
      startDate,
      endDate,
      frequency: 'monthly',
      baseValue: 100,
    });

    const data = generator.generate();
    expect(data.length).toBe(12); // Jan 2020 to Dec 2020
  });

  it('generates correct number of quarterly observations', () => {
    const generator = new SyntheticDataGenerator({
      startDate,
      endDate,
      frequency: 'quarterly',
      baseValue: 100,
    });

    const data = generator.generate();
    expect(data.length).toBe(4); // Q1 2020 to Q4 2020
  });

  it('applies trend correctly', () => {
    const generator = new SyntheticDataGenerator({
      startDate,
      endDate,
      frequency: 'monthly',
      baseValue: 100,
      trend: 1,
      noise: 0, // No noise for predictable test
    });

    const data = generator.generate();
    // First value should be near baseValue
    expect(data[0].value).toBeCloseTo(100, 0);
    // Last value should be higher due to positive trend
    expect(data[data.length - 1].value).toBeGreaterThan(100);
  });

  it('generates valid date strings', () => {
    const generator = new SyntheticDataGenerator({
      startDate,
      endDate,
      frequency: 'monthly',
      baseValue: 100,
    });

    const data = generator.generate();
    data.forEach((obs) => {
      expect(Date.parse(obs.date)).not.toBeNaN();
      expect(obs.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('generates numeric values', () => {
    const generator = new SyntheticDataGenerator({
      startDate,
      endDate,
      frequency: 'monthly',
      baseValue: 100,
    });

    const data = generator.generate();
    data.forEach((obs) => {
      expect(typeof obs.value).toBe('number');
      expect(isNaN(obs.value)).toBe(false);
      expect(isFinite(obs.value)).toBe(true);
    });
  });

  it('applies shocks correctly', () => {
    const generator = new SyntheticDataGenerator({
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-06-01'),
      frequency: 'monthly',
      baseValue: 100,
      trend: 0,
      noise: 0,
      seasonalAmplitude: 0,
      shocks: [
        { date: '2020-03-01', label: 'Test Shock', intensity: 10 },
      ],
    });

    const data = generator.generate();
    const shockIndex = data.findIndex((obs) => obs.date === '2020-03-01');
    
    if (shockIndex > 0) {
      // Value at shock should be higher than base
      expect(data[shockIndex].value).toBeGreaterThan(100);
    }
  });

  it('generateRandomWalk creates varying values', () => {
    const data = SyntheticDataGenerator.generateRandomWalk(
      startDate,
      endDate,
      'monthly',
      100,
      0.05
    );

    expect(data.length).toBeGreaterThan(0);
    
    // Check that values vary (not all the same)
    const uniqueValues = new Set(data.map((obs) => obs.value));
    expect(uniqueValues.size).toBeGreaterThan(1);
  });
});
