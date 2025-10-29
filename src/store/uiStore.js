
// src/store/uiStore.js
import { create } from 'zustand';

/**
 * Manages global, non-domain-specific UI state.
 * This store controls aspects of the application shell, such as sidebar visibility.
 */
export const useUiStore = create((set) => ({
  // Controls the visibility of the main navigation sidebar.
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Controls the visibility of the AI Assistant sidebar. Default to true for desktop.
  isAiSidebarVisible: true,
  toggleAiSidebar: () => set((state) => ({ isAiSidebarVisible: !state.isAiSidebarVisible })),

  // A flag set on startup based on environment variables.
  isAiAssistantAvailable: false,
  setAiAssistantAvailability: (isAvailable) => set({ isAiAssistantAvailable: isAvailable }),
}));