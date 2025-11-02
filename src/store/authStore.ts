// src/store/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the shape of the user object for type safety
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the state structure for the auth store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

/**
 * Zustand store for managing authentication state.
 *
 * This store is persisted to localStorage to maintain the user's session
 * across page reloads.
 *
 * @see {@link https://github.com/pmndrs/zustand} for documentation.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      // Only persist the user and token, isAuthenticated is derived
      partialize: (state) => ({ user: state.user, token: state.token }),
      // Rehydrate the isAuthenticated flag based on the presence of a token
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token;
        }
      },
    }
  )
);
