
// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';
import { notifications } from '@mantine/notifications';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  isLoadingUser: true,
  portfolioId: null,

  // [NEW] The complete, atomic login transaction.
  login: async (email, password) => {
    try {
      // Step 1: Get the token
      const formBody = new URLSearchParams();
      formBody.append('username', email);
      formBody.append('password', password);
      const loginResponse = await apiClient.post('/auth/login', formBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const { access_token } = loginResponse.data;

      // Step 2: Use the new token immediately to fetch the user profile
      const userResponse = await apiClient.get('/users/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const user = userResponse.data;

      // Step 3: Commit the entire successful transaction to the state store
      localStorage.setItem('accessToken', access_token);
      let primaryPortfolioId = null;
      if (user.portfolios && user.portfolios.length > 0) {
        primaryPortfolioId = user.portfolios[0].id;
      }
      set({ token: access_token, user, isAuthenticated: true, portfolioId: primaryPortfolioId, isLoadingUser: false });
      
      return true; // Signal success
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'An unexpected error occurred.';
      notifications.show({
        title: 'Login Failed',
        message: errorMessage,
        color: 'red',
      });
      return false; // Signal failure
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ token: null, isAuthenticated: false, user: null, portfolioId: null });
  },

  // This function is now ONLY for validating a token on app startup/refresh.
  fetchUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      const userData = response.data;
      let primaryPortfolioId = null;
      if (userData.portfolios && userData.portfolios.length > 0) {
        primaryPortfolioId = userData.portfolios[0].id;
      }
      set({ user: userData, portfolioId: primaryPortfolioId, isLoadingUser: false });
    } catch (error) {
      console.error("Session validation failed:", error);
      get().logout();
      set({ isLoadingUser: false });
    }
  },
  setLoadingComplete: () => set({ isLoadingUser: false }),
}));

export default useAuthStore;