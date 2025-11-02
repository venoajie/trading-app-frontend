// src/store/uiStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MantineColorScheme } from '@mantine/core';

// --- BLUEPRINT ALIGNMENT ---
// The state interface is expanded to manage all global UI concerns as required
// by AppLayout, including AI sidebar visibility and a convenience toggle for
// the color scheme. This makes the store the single source of truth for UI state.

interface UiState {
  colorScheme: MantineColorScheme;
  isAiSidebarVisible: boolean;
  isAiAssistantAvailable: boolean; // Placeholder for feature flagging
  setColorScheme: (scheme: MantineColorScheme) => void;
  toggleColorScheme: () => void;
  toggleAiSidebar: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      // The default value is now 'auto', allowing the application to respect
      // the user's OS preference on first load.
      colorScheme: 'auto',
      isAiSidebarVisible: true,
      isAiAssistantAvailable: true, // Enabled by default for development

      setColorScheme: (scheme) => set({ colorScheme: scheme }),

      // The toggle function provides a simple API for components, abstracting
      // the 'light'/'dark' logic away from the UI.
      toggleColorScheme: () => {
        const currentScheme = get().colorScheme;
        // If current is 'auto', default to toggling to 'dark'
        set({ colorScheme: currentScheme === 'dark' ? 'light' : 'dark' });
      },

      toggleAiSidebar: () =>
        set((state) => ({
          isAiSidebarVisible: !state.isAiSidebarVisible,
        })),
    }),
    {
      name: 'ui-storage', // The key for localStorage
    }
  )
);
