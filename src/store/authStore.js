
// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  isLoadingUser: true,
  
  // --- [NEW] Add state to hold the user's primary portfolio ID ---
  portfolioId: null,

  setToken: (token) => {
    localStorage.setItem('accessToken', token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    // Clear all user-related state on logout
    set({ token: null, isAuthenticated: false, user: null, portfolioId: null });
  },

  fetchUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      const userData = response.data;
      
      // --- [NEW] Logic to extract the portfolio ID ---
      let primaryPortfolioId = null;
      if (userData.portfolios && userData.portfolios.length > 0) {
        // For now, we assume the first portfolio is the primary one.
        // In the future, we might add a flag or let the user choose.
        primaryPortfolioId = userData.portfolios[0].id;
      }
      
      // Update the state with the user data AND the extracted portfolio ID
      set({ user: userData, portfolioId: primaryPortfolioId, isLoadingUser: false });

    } catch (error) {
      console.error("Failed to fetch user:", error);
      get().logout();
      set({ isLoadingUser: false });
    }
  },
}));

// Initialize user fetch on app load
const initialToken = useAuthStore.getState().token;
if (initialToken) {
  useAuthStore.getState().fetchUser();
} else {
  // Directly set loading to false if there's no token
  useAuthStore.setState({ isLoadingUser: false });
}

export default useAuthStore;