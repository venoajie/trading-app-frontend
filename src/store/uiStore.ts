import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MantineColorScheme } from '@mantine/core';

interface UiState {
  colorScheme: MantineColorScheme;
  setColorScheme: (scheme: MantineColorScheme) => void;
  toggleColorScheme: () => void;
}

/**
 * Zustand store for managing global UI state.
 * The theme preference is persisted to localStorage.
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      // 'auto' will sync with the user's OS preference.
      colorScheme: 'auto',
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      toggleColorScheme: () =>
        set((state) => ({
          // When toggling, we explicitly set light/dark, bypassing 'auto'.
          colorScheme:
            state.colorScheme === 'light' || state.colorScheme === 'auto'
              ? 'dark'
              : 'light',
        })),
    }),
    {
      name: 'ui-storage', // Unique name for the localStorage key.
    }
  )
);
