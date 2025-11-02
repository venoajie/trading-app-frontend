/** src/hooks/useUser.ts */

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
// Import the canonical User type from the store
import type { AuthState } from '@/store/authStore';

type User = NonNullable<AuthState['user']>;

const fetchUserData = async (): Promise<User> => {
  const user = useAuthStore.getState().user;
  if (!user) {
    throw new Error('User not found');
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Ensure the returned object matches the canonical User interface.
  // The store's user object is now the single source of truth.
  return Promise.resolve(user);
};

export const useUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<User, Error>({
    queryKey: ['user', 'me'],
    queryFn: fetchUserData,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
};
