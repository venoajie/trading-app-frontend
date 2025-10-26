
// src/store/goalsStore.js
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Initial mock data to demonstrate functionality
const initialGoals = [
  { id: uuidv4(), goal: 'Retirement (2050)', progress: 75, strategy: 'Long-Term Growth', effectiveness: 'High' },
  { id: uuidv4(), goal: 'Home Down Payment (2028)', progress: 40, strategy: 'Balanced Growth', effectiveness: 'Medium' },
];

export const useGoalsStore = create((set) => ({
  goals: initialGoals,
  editingGoal: null, // Holds the goal object being edited, or null for a new goal

  setEditingGoal: (goal) => set({ editingGoal: goal }),

  addGoal: (newGoal) => set((state) => ({
    goals: [...state.goals, { ...newGoal, id: uuidv4() }],
  })),

  updateGoal: (updatedGoal) => set((state) => ({
    goals: state.goals.map((goal) => 
      goal.id === updatedGoal.id ? { ...goal, ...updatedGoal } : goal
    ),
  })),

  deleteGoal: (goalId) => set((state) => ({
    goals: state.goals.filter((goal) => goal.id !== goalId),
  })),
}));