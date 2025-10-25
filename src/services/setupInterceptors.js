
// src/services/setupInterceptors.js
import apiClient from './apiClient';
import useAuthStore from '../store/authStore';

const setupInterceptors = () => {
  apiClient.interceptors.request.use(
    (config) => {
      // Get the token directly from the Zustand store's state in memory.
      // This is synchronous and always has the latest value.
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;