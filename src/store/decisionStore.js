
// src/store/decisionStore.js
import { create } from 'zustand';

export const useDecisionStore = create((set) => ({
  // --- Left Panel: Inputs ---
  tradeIdea: '',
  assumptions: [
    { scenario: 'Base Case', probability: 0.5, outcome: 0 },
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
    // Here we would also add logic to recalculate expectedValue
    return { assumptions: newAssumptions };
  }),
  // ... other actions to be added later
}));