
// src/store/uiStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      // State for the color scheme (theme)
      colorScheme: 'light', // Default to 'light'
      toggleColorScheme: (value) =>
        set((state) => ({
          colorScheme: value || (state.colorScheme === 'dark' ? 'light' : 'dark'),
        })),

      // --- Existing state ---
      isSidebarOpen: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      openSidebar: () => set({ isSidebarOpen: true }),
      closeSidebar: () => set({ isSidebarOpen: false }),

      isAiAssistantAvailable: true,
      setAiAssistantAvailability: (isAvailable) => set({ isAiAssistantAvailable: isAvailable }),

      isAiSidebarVisible: true,
      toggleAiSidebar: () => set((state) => ({ isAiSidebarVisible: !state.isAiSidebarVisible })),
    }),
    {
      name: 'ui-storage', // Name for the localStorage key
      partialize: (state) => ({ colorScheme: state.colorScheme }), // Only persist the colorScheme
    }
  )
);