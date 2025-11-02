/** src/hooks/useUser.spec.tsx */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authStore';
import { useUser } from './useUser';

/**
 * Creates a new QueryClient instance for each test run to ensure isolation.
 * Disabling retries is a standard practice for testing to prevent timeouts
 * and make tests more deterministic.
 */
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

/**
 * Creates a React component wrapper that provides the QueryClient context.
 * This is the standard pattern for testing any hook that relies on
 * a context provider, which `useQuery` does.
 */
const createWrapper = (client: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

// Define mock data for consistent testing.
const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
const mockToken = 'mock-jwt-token';

describe('useUser', () => {
  beforeEach(() => {
    // Reset auth store to a clean, logged-out state before each test.
    useAuthStore.getState().logout();
  });

  it('should be disabled and not fetch data when user is not authenticated', () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(queryClient),
    });

    // For a disabled query, `isPending` is true, but it is not `isFetching`.
    expect(result.current.isPending).toBe(true);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.status).toBe('pending');
  });

  it('should be enabled and fetch user data when user is authenticated', async () => {
    // Use `hydrateSession` to set up the authenticated state for the test.
    // This correctly simulates a logged-in user session.
    useAuthStore
      .getState()
      .hydrateSession({ token: mockToken, user: mockUser });

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(queryClient),
    });

    // Wait for the asynchronous query to complete successfully.
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toEqual(mockUser);
    expect(result.current.status).toBe('success');
  });
});
