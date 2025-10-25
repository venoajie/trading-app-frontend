
// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';
import { notifications } from '@mantine/notifications';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  isLoadingUser: true, // Start with true
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
    // [MODIFICATION] We no longer set isLoadingUser to true here, it's set on init.
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
      
      notifications.show({
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again.',
        color: 'yellow',
      });

      get().logout();
      set({ isLoadingUser: false });
    }
  },
  // [NEW] Add a simple action to handle the no-token case
  setLoadingComplete: () => set({ isLoadingUser: false }),
}));

// [REMOVED] The entire block that was here is being moved to App.jsx
// const initialToken = useAuthStore.getState().token;
// if (initialToken) {
//   useAuthStore.getState().fetchUser();
// } else {
//   useAuthStore.setState({ isLoadingUser: false });
// }

export default useAuthStore;