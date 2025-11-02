// src/store/uiStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MantineColorScheme } from '@mantine/core';

// V7 API CHANGE: The local `ColorScheme` type is replaced with the official
// `MantineColorScheme` from the library itself. This ensures our state store
// is always in sync with the library's API, supporting 'light', 'dark', and 'auto'.
// This resolves the type mismatch that caused the build failure.

interface UiState {
  colorScheme: MantineColorScheme;
  setColorScheme: (scheme: MantineColorScheme) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      // The default value is now 'auto', allowing the application to respect
      // the user's OS preference on first load.
      colorScheme: 'auto',
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
    }),
    {
      name: 'ui-storage', // The key for localStorage
    }
  )
);
