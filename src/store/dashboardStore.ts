// src/store/dashboardStore.ts
import { create } from 'zustand';

// --- Data shape for KPIs ---
interface Kpis {
  totalValue: number;
  ytdReturn: number;
  ytdReturnPct: number;
  netLiquidity: number; // Added for PortfolioTab
  buyingPower: number; // Added for PortfolioTab
}

// --- Data shape for the performance chart ---
interface PerformanceDataPoint {
  date: string;
  value: number;
}

// --- Data shape for the risk map ---
interface RiskExposureDataPoint {
  sector: string;
  exposure: number;
}

interface DashboardState {
  kpis: Kpis;
  performanceData: PerformanceDataPoint[]; // Added for PerformanceTab
  riskExposureData: RiskExposureDataPoint[]; // Added for PortfolioTab
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

// --- Dummy Data Generation ---
const generateDummyPerformanceData = (): PerformanceDataPoint[] => {
  const data = [];
  let value = 100000;
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value += Math.random() * 2000 - 1000; // Fluctuate value
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    });
  }
  return data;
};

const dummyRiskData: RiskExposureDataPoint[] = [
  { sector: 'Technology', exposure: 0.35 },
  { sector: 'Healthcare', exposure: 0.2 },
  { sector: 'Financials', exposure: 0.15 },
  { sector: 'Consumer Cyclical', exposure: 0.12 },
  { sector: 'Industrials', exposure: 0.1 },
  { sector: 'Other', exposure: 0.08 },
];

const useDashboardStore = create<DashboardState>((set) => ({
  kpis: {
    totalValue: 0,
    ytdReturn: 0,
    ytdReturnPct: 0,
    netLiquidity: 0,
    buyingPower: 0,
  },
  performanceData: [],
  riskExposureData: [],
  isLoading: true,
  error: null,
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const performanceData = generateDummyPerformanceData();
    const latestValue =
      performanceData[performanceData.length - 1]?.value || 125430;

    set({
      kpis: {
        totalValue: latestValue,
        ytdReturn: 8345,
        ytdReturnPct: 0.071,
        netLiquidity: 85210,
        buyingPower: 45300,
      },
      performanceData,
      riskExposureData: dummyRiskData,
      isLoading: false,
    });
  },
}));

export default useDashboardStore;
