
// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '../services/apiClient';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  isLoadingUser: true,

  setToken: (token) => {
    localStorage.setItem('accessToken', token);
    // The apiClient interceptor will handle adding the header, so no need to set defaults here.
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ token: null, isAuthenticated: false, user: null });
  },

  fetchUser: async () => {
    // This function now has its own robust error handling.
    try {
      // The path should be relative to the baseURL ('/api/v1').
      // The full path for this endpoint is /api/v1/users/me.
      const response = await apiClient.get('/users/me');
      set({ user: response.data, isLoadingUser: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If fetching the user fails, the token is likely invalid. Log the user out.
      get().logout();
      set({ isLoadingUser: false });
    }
  },
}));

// Initialize user fetch on app load
const initialToken = useAuthStore.getState().token;
if (initialToken) {
  // The apiClient interceptor will automatically use this token
  useAuthStore.getState().fetchUser();
} else {
  useAuthStore.getState().isLoadingUser = false;
}

export default useAuthStore;