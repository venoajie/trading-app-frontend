
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
    // Also update the default header for all future requests from the interceptor
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    // Clear the default header on logout
    delete apiClient.defaults.headers.common['Authorization'];
    set({ token: null, isAuthenticated: false, user: null, portfolioId: null });
  },

  // [MODIFIED] fetchUser now accepts the token directly
  fetchUser: async (token) => {
    try {
      // [MODIFIED] We pass the token directly in the headers for this specific request.
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