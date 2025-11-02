// src/services/apiClient.ts

import axios from 'axios';

/**
 * The base Axios instance for all standard API communications.
 * It is configured to prefix all requests with the versioned API path,
 * aligning it with the production Nginx routing architecture.
 */
const apiClient = axios.create({
  // CORRECTED: The baseURL is set to the versioned API path.
  // This will cause requests to be sent to paths like '/api/v1/auth/login'.
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

// Re-export the isAxiosError type guard for use in stores and components.
export { isAxiosError } from 'axios';
