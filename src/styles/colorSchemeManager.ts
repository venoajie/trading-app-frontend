// src/styles/colorSchemeManager.ts

import { ColorScheme } from '@mantine/core';
import { useUiStore } from '@/store/uiStore';

// Define the manager type explicitly for type safety, as it is no longer
// exported directly from '@mantine/core' in v7.
export interface ColorSchemeManager {
  get: (defaultValue: ColorScheme) => ColorScheme;
  set: (value: ColorScheme) => void;
  subscribe: (callback: (value: ColorScheme) => void) => () => void;
  clear: () => void;
}

export const colorSchemeManager: ColorSchemeManager = {
  get: () => useUiStore.getState().colorScheme,

  set: (value: ColorScheme) => {
    useUiStore.getState().setColorScheme(value);
  },

  subscribe: (callback: (value: ColorScheme) => void) => {
    return useUiStore.subscribe((state) => callback(state.colorScheme));
  },

  clear: () => useUiStore.getState().setColorScheme('auto'),
};
