
// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient'; // We can import this safely at the top again.
import { notifications } from '@mantine/notifications';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  isLoadingUser: true,
  portfolioId: null,

  // [NEW] This is our new atomic action for a successful login.
  loginSuccess: ({ token, user }) => {
    localStorage.setItem('accessToken', token);
    let primaryPortfolioId = null;
    if (user.portfolios && user.portfolios.length > 0) {
      primaryPortfolioId = user.portfolios[0].id;
    }
    set({ token, user, isAuthenticated: true, portfolioId: primaryPortfolioId, isLoadingUser: false });
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