// src/services/apiClient.ts

import axios from 'axios';

/**
 * The base Axios instance for all standard API communications.
 * It is a "dumb" client. Authentication headers are managed externally
 * by the authStore to enforce separation of concerns.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

// Re-export the isAxiosError type guard for use in stores and components.
export { isAxiosError } from 'axios';
