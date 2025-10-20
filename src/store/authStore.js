
// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';

const useAuthStore = create((set) => ({
  /**
   * The JWT token string. We initialize it from localStorage to
   * maintain the login state even after a page refresh.
   */
  token: localStorage.getItem('accessToken') || null,

  /**
   * A boolean flag derived from the token's existence.
   * This is the primary value components will use to check for authentication.
   */
  isAuthenticated: !!localStorage.getItem('accessToken'),

  /**
   * Action to be called upon successful login.
   * It performs two critical side-effects:
   * 1. Persists the token to localStorage.
   * 2. Sets the default Authorization header on our shared apiClient.
   */
  setToken: (token) => {
    localStorage.setItem('accessToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ token, isAuthenticated: true });
  },

  /**
   * Action to be called on logout.
   * It clears the token from localStorage and the apiClient instance,
   * effectively logging the user out of the current session.
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    delete apiClient.defaults.headers.common['Authorization'];
    set({ token: null, isAuthenticated: false });
  },
}));

// We also need to initialize the apiClient with the token on app startup,
// in case the user is already logged in from a previous session.
const initialToken = useAuthStore.getState().token;
if (initialToken) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export default useAuthStore;