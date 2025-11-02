// src/store/dashboardStore.ts
import { create } from 'zustand';

interface Kpis {
  totalValue: number;
  ytdReturn: number;
  ytdReturnPct: number;
}

interface DashboardState {
  kpis: Kpis;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

const useDashboardStore = create<DashboardState>((set) => ({
  kpis: {
    totalValue: 0,
    ytdReturn: 0,
    ytdReturnPct: 0,
  },
  isLoading: false,
  error: null,
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({
      kpis: {
        totalValue: 125430,
        ytdReturn: 8345,
        ytdReturnPct: 0.071,
      },
      isLoading: false,
    });
  },
}));

export default useDashboardStore;
