// src/styles/colorSchemeManager.ts

// V7 API CHANGE: The manager must now conform to the official `MantineColorSchemeManager` type.
// The `ColorScheme` type is now `MantineColorScheme` and includes 'auto'.
import { MantineColorScheme, MantineColorSchemeManager } from '@mantine/core';
import { useUiStore } from '@/store/uiStore';

// This is the definitive, architecturally-compliant color scheme manager for Mantine v7.
export const colorSchemeManager: MantineColorSchemeManager = {
  // `get` returns the current value from the Zustand store.
  get: () => useUiStore.getState().colorScheme,

  // `set` updates the Zustand store when Mantine requests a change.
  set: (value: MantineColorScheme) => {
    useUiStore.getState().setColorScheme(value);
  },

  // `subscribe` connects Mantine to Zustand's subscription model.
  subscribe: (callback: (value: MantineColorScheme) => void) => {
    const unsubscribe = useUiStore.subscribe((state) =>
      callback(state.colorScheme)
    );
    return unsubscribe;
  },

  // `unsubscribe` is required by the v7 API to clean up the subscription.
  unsubscribe: () => {
    // Zustand's `subscribe` method returns the unsubscribe function directly,
    // which is handled by the `subscribe` implementation above.
    // This method can be a no-op as the cleanup is managed by the return value of subscribe.
  },

  // `clear` resets the scheme to its default state.
  clear: () => useUiStore.getState().setColorScheme('auto'),
};
