// src/store/uiStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MantineColorScheme } from '@mantine/core';

interface UiState {
  colorScheme: MantineColorScheme;
  isAiSidebarVisible: boolean;
  isAiAssistantAvailable: boolean;
  setColorScheme: (scheme: MantineColorScheme) => void;
  toggleColorScheme: () => void;
  toggleAiSidebar: () => void;
  // Add the missing action signature
  setAiAssistantAvailability: (isAvailable: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      colorScheme: 'auto',
      isAiSidebarVisible: true,
      isAiAssistantAvailable: true,

      setColorScheme: (scheme) => set({ colorScheme: scheme }),

      toggleColorScheme: () => {
        const currentScheme = get().colorScheme;
        set({ colorScheme: currentScheme === 'dark' ? 'light' : 'dark' });
      },

      toggleAiSidebar: () =>
        set((state) => ({
          isAiSidebarVisible: !state.isAiSidebarVisible,
        })),

      // Add the missing action implementation
      setAiAssistantAvailability: (isAvailable) =>
        set({ isAiAssistantAvailable: isAvailable }),
    }),
    {
      name: 'ui-storage',
      // It is also advisable to persist only specific UI settings to prevent
      // feature flag states from becoming stuck in localStorage.
      partialize: (state) => ({
        colorScheme: state.colorScheme,
        isAiSidebarVisible: state.isAiSidebarVisible,
      }),
    }
  )
);
