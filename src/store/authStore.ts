// src/store/authStore.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import apiClient, { isAxiosError } from '../services/apiClient';
import { notifications } from '@mantine/notifications';

// This is the canonical User interface for the entire application.
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

            // CORRECTED: Call the exact endpoint from the API contract: POST /login
            const loginResponse = await apiClient.post('/login', formBody, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const { access_token } = loginResponse.data;

            set({ token: access_token });

            // NOTE: The /users/me endpoint is not in the contract you provided.
            // Assuming it exists at /api/v1/users/me or similar and is handled correctly by the default apiClient baseURL.
            // If this call fails, its path also needs to be corrected.
            const userResponse = await apiClient.get('/users/me');
            const user = userResponse.data;

            set({
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
            // CORRECTED: Call the exact endpoint from the API contract: POST /register
            await apiClient.post('/register', credentials);
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
