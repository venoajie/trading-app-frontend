
// src/store/uiStore.js
import { create } from 'zustand';

export const useUiStore = create((set) => ({
  // Existing state for the main navigation sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Existing state for AI Assistant feature availability
  isAiAssistantAvailable: true, // Default to true to prevent breaking if env is not set
  setAiAssistantAvailability: (isAvailable) => set({ isAiAssistantAvailable: isAvailable }),

  // State and action for the AI Assistant sidebar visibility
  isAiSidebarVisible: true, // Default to visible on desktop
  toggleAiSidebar: () => set((state) => ({ isAiSidebarVisible: !state.isAiSidebarVisible })),
}));