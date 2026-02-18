import { create } from 'zustand';

export interface DateRange extends Record<string, string> {
  startDate: string;
  endDate: string;
}

export interface AppState {
  dateRange: DateRange;
  selectedGeography: string;
  isMethodologyOpen: boolean;
  setDateRange: (dateRange: DateRange) => void;
  setSelectedGeography: (geography: string) => void;
  toggleMethodology: () => void;
  setMethodologyOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  dateRange: {
    startDate: '2020-01-01',
    endDate: '2024-12-31',
  },
  selectedGeography: 'Global Aggregate',
  isMethodologyOpen: false,
  setDateRange: (dateRange) => set({ dateRange }),
  setSelectedGeography: (geography) => set({ selectedGeography: geography }),
  toggleMethodology: () => set((state) => ({ isMethodologyOpen: !state.isMethodologyOpen })),
  setMethodologyOpen: (isOpen) => set({ isMethodologyOpen: isOpen }),
}));
