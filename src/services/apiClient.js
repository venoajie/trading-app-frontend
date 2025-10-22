
// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  // By making the baseURL relative, it will automatically inherit the
  // protocol (http vs https) and domain from the main window location.
  // This solves all Mixed Content errors.
  baseURL: '/api/v1',
});

// This interceptor is correct and should remain.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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