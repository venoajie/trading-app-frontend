// src/styles/colorSchemeManager.ts
import { ColorSchemeManager } from '@mantine/core';
import { useUiStore } from '@/store/uiStore';

/**
 * This object is the bridge between Mantine's theme management and our Zustand store.
 * It provides Mantine with the functions it needs to read, write, and subscribe to
 * our application's color scheme state.
 */
export const colorSchemeManager: ColorSchemeManager = {
  /**
   * `get` is called by Mantine to read the initial color scheme.
   */
  get: () => useUiStore.getState().colorScheme,

  /**
   * `set` is called by Mantine's hooks (like `toggleColorScheme`) when the theme
   * needs to be changed. We use it to update our Zustand store.
   */
  set: (value) => {
    useUiStore.getState().setColorScheme(value as 'light' | 'dark');
  },

  /**
   * `subscribe` allows Mantine to listen for changes that happen outside of its
   * own hooks, for example, if the state changes in another browser tab.
   * Zustand's `subscribe` method is a perfect fit for this.
   */
  subscribe: (callback) => {
    return useUiStore.subscribe((state) => callback(state.colorScheme));
  },

  /**
   * `clear` is called to reset the manager to its default state.
   */
  clear: () => useUiStore.getState().setColorScheme('light'),
};
