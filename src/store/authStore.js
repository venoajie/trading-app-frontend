
// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  isLoadingUser: true,
  portfolioId: null,

  hydrateSession: ({ token, user }) => {
    localStorage.setItem('accessToken', token);
    let primaryPortfolioId = null;
    if (user.portfolios && user.portfolios.length > 0) {
      primaryPortfolioId = user.portfolios[0].id;
    }
    set({ token, user, isAuthenticated: true, portfolioId: primaryPortfolioId, isLoadingUser: false });
  },

  logout: () => {
    const oldToken = localStorage.getItem('accessToken');
    localStorage.removeItem('accessToken');
    set({ token: null, isAuthenticated: false, user: null, portfolioId: null });
    // This helps the storage event listener fire reliably
    if (oldToken) {
      window.dispatchEvent(new StorageEvent('storage', { key: 'accessToken', oldValue: oldToken, newValue: null }));
    }
  },

  fetchUserOnLoad: async () => {
    try {
      const response = await apiClient.get('/users/me');
      const user = response.data;
      const token = get().token;
      get().hydrateSession({ token, user });
    } catch (error) {
      console.error("Session validation failed:", error);
      get().logout();
      set({ isLoadingUser: false });
    }
  },
  setLoadingComplete: () => set({ isLoadingUser: false }),
}));

export default useAuthStore;