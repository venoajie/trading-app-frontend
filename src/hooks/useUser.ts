/** src/hooks/useUser.ts */

import { useQuery } from '@tanstack/react-query';
// import apiClient from '@/services/apiClient'; // Removed as it's unused in the mock
import { useAuthStore } from '@/store/authStore';

interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Mock API fetcher for user data. In a real application, this would
 * make a request to an endpoint like `/api/users/me`.
 */
const fetchUserData = async (): Promise<User> => {
  // For this milestone, we use the user data stored in Zustand
  // to simulate a successful API response.
  const user = useAuthStore.getState().user;
  if (!user) {
    throw new Error('User not found');
  }
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Promise.resolve(user);
};

/**
 * A TanStack Query hook for fetching the current authenticated user's data.
 *
 * This hook is enabled only when the user is authenticated. It will automatically
 * refetch data based on the query client's configuration.
 *
 * @returns The result of the useQuery hook.
 */
export const useUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<User, Error>({
    queryKey: ['user', 'me'],
    queryFn: fetchUserData,
    // The query will not execute until the user is authenticated
    enabled: isAuthenticated,
    // Optional: Configure stale time to avoid refetching on every mount
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
