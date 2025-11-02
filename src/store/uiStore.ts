import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MantineColorScheme } from '@mantine/core';

interface UiState {
  colorScheme: MantineColorScheme;
  setColorScheme: (scheme: MantineColorScheme) => void;
  // The toggle function now accepts the currently resolved scheme.
  toggleColorScheme: (currentScheme: 'light' | 'dark') => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      colorScheme: 'auto',
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      // The logic is now a simple, unambiguous flip.
      toggleColorScheme: (currentScheme) =>
        set({
          colorScheme: currentScheme === 'dark' ? 'light' : 'dark',
        }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
