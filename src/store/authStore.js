
// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';
import { notifications } from '@mantine/notifications'; // Import notifications

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  isLoadingUser: true,
  portfolioId: null,

  setToken: (token) => {
    localStorage.setItem('accessToken', token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ token: null, isAuthenticated: false, user: null, portfolioId: null });
  },

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
      console.error("Failed to fetch user:", error);
      
      // [MODIFIED] Add a user-facing notification
      notifications.show({
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again.',
        color: 'yellow',
      });

      get().logout(); // Log the user out
      set({ isLoadingUser: false });
    }
  },
}));

// Initialize user fetch on app load
const initialToken = useAuthStore.getState().token;
if (initialToken) {
  useAuthStore.getState().fetchUser();
} else {
  useAuthStore.setState({ isLoadingUser: false });
}

export default useAuthStore;