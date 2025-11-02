import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// The store is now simple and only deals with the two explicit states.
type ColorScheme = 'light' | 'dark';

interface UiState {
  // It starts as `null` so we can detect the first-ever load.
  colorScheme: ColorScheme | null;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      colorScheme: null,
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      // The toggle logic is now foolproof.
      toggleColorScheme: () =>
        set((state) => ({
          colorScheme: state.colorScheme === 'dark' ? 'light' : 'dark',
        })),
    }),
    {
      name: 'ui-storage', // The key for localStorage.
    }
  )
);
