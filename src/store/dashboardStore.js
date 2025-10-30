
// src/store/dashboardStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient'; // For future API integration

// --- Mock Data Generation ---
// This simulates realistic data for the UI while the API is being developed.
const generateMockPerformanceData = () => {
  const data = [];
  let value = 100000;
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value += (Math.random() - 0.48) * 1500; // Simulate daily fluctuations
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    });
  }
  return data;
};

const mockPerformanceData = generateMockPerformanceData();
const latestValue = mockPerformanceData[mockPerformanceData.length - 1].value;

const useDashboardStore = create((set) => ({
  // State Schema
  kpis: {
    totalValue: 0,
    ytdReturn: 0,
    ytdReturnPct: '0.00%',
    netLiquidity: 0,
    buyingPower: 0,
  },
  riskExposureData: [],
  performanceData: [],
  isLoading: true,

  // Actions
  fetchDashboardData: async () => {
    set({ isLoading: true });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, this would be an API call, e.g.:
    // const response = await apiClient.get('/dashboard-summary');
    // const data = response.data;
    // set({ kpis: data.kpis, ... });

    set({
      kpis: {
        totalValue: latestValue, // Use the last value from performance data
        ytdReturn: -1770.00,
        ytdReturnPct: '-1.77%',
        netLiquidity: 12500,
        buyingPower: 8500,
      },
      riskExposureData: [
        { name: 'US Equities', value: 45000, color: '#4c6ef5' },
        { name: 'Intl Equities', value: 25000, color: '#4dabf7' },
        { name: 'Fixed Income', value: 15000, color: '#63e6be' },
        { name: 'Commodities', value: 10000, color: '#ffd43b' },
        { name: 'Cash', value: 5000, color: '#ced4da' },
        { name: 'Real Estate', value: 7500, color: '#845ef7' },
        { name: 'Alternatives', value: 2500, color: '#f783ac' },
      ],
      performanceData: mockPerformanceData,
      isLoading: false,
    });
  },
}));

export default useDashboardStore;
