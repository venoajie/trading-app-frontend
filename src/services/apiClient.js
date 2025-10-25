
// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
});

// This interceptor is now ONLY for validating sessions on page refresh.
// The login flow will handle the initial token injection manually.
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