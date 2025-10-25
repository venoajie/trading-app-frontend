
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

  setToken: (token) => {
    localStorage.setItem('accessToken', token);
    // [REVERTED] We no longer manipulate the apiClient instance here.
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    // [REVERTED] We no longer manipulate the apiClient instance here.
    set({ token: null, isAuthenticated: false, user: null, portfolioId: null });
  },

  // fetchUser still accepts the token directly, which is the robust part of the fix.
  fetchUser: async (token) => {
    try {
      // We pass the token directly in the headers for this specific request.
      // This is the most reliable method and bypasses any interceptor race conditions.
      const response = await apiClient.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      
      let primaryPortfolioId = null;
      if (userData.portfolios && userData.portfolios.length > 0) {
        primaryPortfolioId = userData.portfolios[0].id;
      }
      
      set({ user: userData, portfolioId: primaryPortfolioId, isLoadingUser: false });

    } catch (error) {
      console.error("Failed to fetch user:", error);
      notifications.show({
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again.',
        color: 'yellow',
      });
      get().logout();
      set({ isLoadingUser: false });
    }
  },
  setLoadingComplete: () => set({ isLoadingUser: false }),
}));

export default useAuthStore;