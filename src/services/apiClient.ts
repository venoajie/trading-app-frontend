// src/services/apiClient.ts

import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

/**
 * The base Axios instance for all standard API communications.
 *
 * It is configured with a request interceptor that automatically attaches
 * the JWT token from the `useAuthStore` to the Authorization header of
 * every outgoing request.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Use environment variable or a sensible default
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
