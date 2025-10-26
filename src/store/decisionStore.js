
// src/store/decisionStore.js
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Helper function to calculate Expected Value
const calculateEV = (assumptions) => {
  return assumptions.reduce((acc, assumption) => {
    const probability = parseFloat(assumption.probability) || 0;
    const outcome = parseFloat(assumption.outcome) || 0;
    return acc + (probability * outcome);
  }, 0);
};

const initialAssumptions = [
  { scenario: 'Base Case', probability: 0.50, outcome: 0 },
  { scenario: 'Best Case', probability: 0.25, outcome: 0 },
  { scenario: 'Worst Case', probability: 0.25, outcome: 0 },
];

export const useDecisionStore = create((set, get) => ({
  // --- Inputs ---
  tradeIdea: '',
  assumptions: [...initialAssumptions],
  // --- Analysis ---
  expectedValue: 0,
  // --- NEW: Journal ---
  journal: [],

  // --- Actions ---
  setTradeIdea: (idea) => set({ tradeIdea: idea }),
  updateAssumption: (index, field, value) => set((state) => {
    const newAssumptions = state.assumptions.map((assumption, i) => {
      if (i === index) {
        return { ...assumption, [field]: value };
      }
      return assumption;
    });

    const newExpectedValue = calculateEV(newAssumptions);

    return {
      assumptions: newAssumptions,
      expectedValue: newExpectedValue,
    };
  }),

  // --- NEW: Action to save the current decision to the journal ---
  archiveDecision: () => {
    const { tradeIdea, assumptions, expectedValue } = get();
    
    if (!tradeIdea) {
      // Prevent saving an empty decision
      return { saved: false, message: 'Trade Idea cannot be empty.' };
    }

    const newEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      tradeIdea,
      assumptions,
      expectedValue,
    };

    set((state) => ({
      journal: [newEntry, ...state.journal], // Add new entry to the top of the list
      // Reset the workspace for the next analysis
      tradeIdea: '',
      assumptions: [...initialAssumptions],
      expectedValue: 0,
    }));
    
    return { saved: true, message: 'Decision saved to journal.' };
  },
}));