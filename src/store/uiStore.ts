import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ColorScheme = 'light' | 'dark';

interface UiState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      // The default value before hydration. Mantine's `defaultColorScheme` prop
      // will handle the initial OS detection.
      colorScheme: 'light',
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
