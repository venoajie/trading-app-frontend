
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
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ token: null, isAuthenticated: false, user: null });
  },

  fetchUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      set({ user: response.data, isLoadingUser: false });
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
  useAuthStore.getState().isLoadingUser = false;
}

export default useAuthStore;