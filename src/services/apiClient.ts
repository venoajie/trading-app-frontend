// src/services/apiClient.ts

import axios from 'axios';

/**
 * The base Axios instance for all standard API communications.
 * It is configured to match the proven behavior of the legacy application,
 * sending requests to root-relative paths.
 */
const apiClient = axios.create({
  // The baseURL is set to an empty string to align with the
  // legacy application's actual, functional implementation.
  // This will cause requests to be sent to paths like '/auth/login'.
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

// Re-export the isAxiosError type guard for use in stores and components.
export { isAxiosError } from 'axios';
