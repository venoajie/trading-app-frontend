
// src/store/decisionStore.js
import { create } from 'zustand';

// Helper function to calculate Expected Value
const calculateEV = (assumptions) => {
  return assumptions.reduce((acc, assumption) => {
    // Ensure values are treated as numbers for calculation
    const probability = parseFloat(assumption.probability) || 0;
    const outcome = parseFloat(assumption.outcome) || 0;
    return acc + (probability * outcome);
  }, 0);
};

export const useDecisionStore = create((set) => ({
  // --- Left Panel: Inputs ---
  tradeIdea: '',
  assumptions: [
    { scenario: 'Base Case', probability: 0.50, outcome: 0 },
    { scenario: 'Best Case', probability: 0.25, outcome: 0 },
    { scenario: 'Worst Case', probability: 0.25, outcome: 0 },
  ],
  // --- Center Panel: Analysis ---
  expectedValue: 0,
  // --- Right Panel: Coaching ---
  coachingThread: [],

  // --- Actions ---
  setTradeIdea: (idea) => set({ tradeIdea: idea }),
  updateAssumption: (index, field, value) => set((state) => {
    const newAssumptions = [...state.assumptions];
    newAssumptions[index][field] = value;

    // Recalculate and update the EV
    const newExpectedValue = calculateEV(newAssumptions);

    return { 
      assumptions: newAssumptions,
      expectedValue: newExpectedValue 
    };
  }),
}));