
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
    // Create a new array using .map for a guaranteed immutable update
    const newAssumptions = state.assumptions.map((assumption, i) => {
      if (i === index) {
        // If this is the item we want to update, return a *new* object
        return { ...assumption, [field]: value };
      }
      // Otherwise, return the original, unchanged item
      return assumption;
    });

    const newExpectedValue = calculateEV(newAssumptions);

    return {
      assumptions: newAssumptions,
      expectedValue: newExpectedValue,
    };
  }),
}));