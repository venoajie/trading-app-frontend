
// src/services/apiClient.js
import axios from 'axios';
import useAuthStore from '../store/authStore'; // [MODIFIED] Import the store

const apiClient = axios.create({
  baseURL: '/api/v1',
});

apiClient.interceptors.request.use(
  (config) => {
    // [MODIFIED] Get the token directly from the Zustand store's state.
    // This is synchronous and avoids all race conditions with localStorage.
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

export default apiClient;