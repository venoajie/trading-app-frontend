
// src/store/authStore.js
import { create } from 'zustand';
import { notifications } from '@mantine/notifications';
// [MODIFIED] We DO NOT import apiClient at the top level to prevent circular dependencies.

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
    // [MODIFIED] Import apiClient here, inside the action.
    const apiClient = (await import('../services/apiClient')).default;
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
      get().logout(); // Logout on failure
      set({ isLoadingUser: false });
    }
  },
  setLoadingComplete: () => set({ isLoadingUser: false }),
}));

export default useAuthStore;