// src/store/authStore.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import apiClient, { isAxiosError } from '../services/apiClient';
import { notifications } from '@mantine/notifications';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hydrateSession: (session: { token: string; user: User }) => void;
  login: (credentials: AuthCredentials) => Promise<boolean>;
  register: (credentials: AuthCredentials) => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        hydrateSession: (session) =>
          set({
            token: session.token,
            user: session.user,
            isAuthenticated: true,
            isLoading: false,
          }),
        login: async (credentials) => {
          set({ isLoading: true });
          try {
            const formBody = new URLSearchParams();
            formBody.append('username', credentials.email);
            formBody.append('password', credentials.password);

            const loginResponse = await apiClient.post(
              '/auth/login',
              formBody,
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            );
            const { access_token } = loginResponse.data;

            // --- ARCHITECTURAL FIX: RESTORE TRANSACTIONAL INTEGRITY ---
            // Manually inject the token for the immediate next call, just as the legacy code did.
            // This eliminates the race condition.
            const userResponse = await apiClient.get('/users/me', {
              headers: { Authorization: `Bearer ${access_token}` },
            });
            const user = userResponse.data;

            // Now that the entire transaction has succeeded, commit the final state.
            // The `subscribe` mechanism will still run, but it is no longer critical for this specific action.
            set({
              token: access_token,
              user,
              isAuthenticated: true,
              isLoading: false,
            });

            notifications.show({
              title: 'Login Successful',
              message: 'Redirecting to your dashboard...',
              color: 'green',
            });
            return true;
          } catch (error: unknown) {
            set({ isLoading: false, token: null });
            let errorMessage = 'An unexpected error occurred.';
            if (isAxiosError(error) && error.response?.data?.detail) {
              errorMessage = error.response.data.detail;
            }
            notifications.show({
              title: 'Login Failed',
              message: errorMessage,
              color: 'red',
            });
            return false;
          }
        },
        register: async (credentials) => {
          set({ isLoading: true });
          try {
            await apiClient.post('/auth/register', credentials);
            notifications.show({
              title: 'Registration Successful',
              message: 'Your account has been created. Please log in.',
              color: 'green',
            });
            set({ isLoading: false });
            return true;
          } catch (error: unknown) {
            let errorMessage = 'An unexpected error occurred.';
            if (isAxiosError(error) && error.response?.data?.detail) {
              errorMessage = error.response.data.detail;
            }
            notifications.show({
              title: 'Registration Failed',
              message: errorMessage,
              color: 'red',
            });
            set({ isLoading: false });
            return false;
          }
        },
        logout: () => {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          notifications.show({
            title: 'Logged Out',
            message: 'You have been successfully logged out.',
            color: 'blue',
          });
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);

// --- ARCHITECTURAL ENFORCEMENT ---
// This subscription is still valuable for all *other* API calls
// that happen outside of the login transaction.

const initialToken = useAuthStore.getState().token;
if (initialToken) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

let currentToken = initialToken;
useAuthStore.subscribe((state) => {
  if (state.token !== currentToken) {
    currentToken = state.token;
    if (state.token) {
      apiClient.defaults.headers.common['Authorization'] =
        `Bearer ${state.token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }
});

export { useAuthStore };
