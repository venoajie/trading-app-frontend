
// src/store/uiStore.js
import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // State and action for AI Assistant availability
  isAiAssistantAvailable: true, // Default to true to prevent breaking if env is not set
  setAiAssistantAvailability: (isAvailable) => set({ isAiAssistantAvailable: isAvailable }),
}));