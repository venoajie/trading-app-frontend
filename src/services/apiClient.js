
// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1', // Proxied by Nginx in production
});

// Interceptor to add the auth token to every request
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