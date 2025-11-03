// src/store/decisionStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// --- TYPE DEFINITIONS (Blueprint Pillar 9: TypeScript First) ---

/**
 * Represents a single assumption or scenario within a trade idea.
 */
export interface Assumption {
  scenario: string;
  probability: number;
  outcome: number;
}

/**
 * Represents a snapshot of a decision archived in the user's journal.
 */
export interface JournalEntry {
  id: string;
  timestamp: string;
  tradeIdea: string;
  assumptions: Assumption[];
  expectedValue: number;
}

/**
 * Defines the complete shape of the decision store's state and actions.
 */
export interface DecisionState {
  // --- State ---
  tradeIdea: string;
  assumptions: Assumption[];
  expectedValue: number;
  journal: JournalEntry[];

  // --- Actions ---
  setTradeIdea: (idea: string) => void;
  updateAssumption: (
    index: number,
    field: keyof Assumption,
    value: string | number
  ) => void;
  archiveDecision: () => { saved: boolean; message: string };
}

// --- HELPER FUNCTION ---

/**
 * Calculates the Expected Value (EV) from an array of assumptions.
 * @param assumptions - The array of scenarios with probabilities and outcomes.
 * @returns The calculated EV as a number.
 */
const calculateEV = (assumptions: Assumption[]): number => {
  return assumptions.reduce((acc, assumption) => {
    // State should already contain numbers, but Number() provides a safeguard.
    const probability = Number(assumption.probability) || 0;
    const outcome = Number(assumption.outcome) || 0;
    return acc + probability * outcome;
  }, 0);
};

// --- INITIAL STATE ---

const initialAssumptions: Assumption[] = [
  { scenario: 'Base Case', probability: 0.5, outcome: 0 },
  { scenario: 'Best Case', probability: 0.25, outcome: 0 },
  { scenario: 'Worst Case', probability: 0.25, outcome: 0 },
];

// --- ZUSTAND STORE IMPLEMENTATION ---

export const useDecisionStore = create<DecisionState>((set, get) => ({
  // --- State ---
  tradeIdea: '',
  assumptions: [...initialAssumptions],
  expectedValue: 0,
  journal: [],

  // --- Actions ---
  setTradeIdea: (idea) => set({ tradeIdea: idea }),

  updateAssumption: (index, field, value) =>
    set((state) => {
      const newAssumptions = state.assumptions.map((assumption, i) => {
        if (i === index) {
          // Coerce string inputs from forms to numbers for numeric fields.
          const processedValue =
            field === 'probability' || field === 'outcome'
              ? parseFloat(String(value))
              : value;
          return { ...assumption, [field]: processedValue };
        }
        return assumption;
      });

      const newExpectedValue = calculateEV(newAssumptions);

      return {
        assumptions: newAssumptions,
        expectedValue: newExpectedValue,
      };
    }),

  archiveDecision: () => {
    const { tradeIdea, assumptions, expectedValue } = get();

    if (!tradeIdea.trim()) {
      return { saved: false, message: 'Trade Idea cannot be empty.' };
    }

    const newEntry: JournalEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      tradeIdea,
      assumptions,
      expectedValue,
    };

    set((state) => ({
      journal: [newEntry, ...state.journal],
      // Reset the workspace for the next analysis
      tradeIdea: '',
      assumptions: [...initialAssumptions],
      expectedValue: 0,
    }));

    return { saved: true, message: 'Decision saved to journal.' };
  },
}));
