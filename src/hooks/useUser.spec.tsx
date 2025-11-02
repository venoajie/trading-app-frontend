/** src/hooks/useUser.spec.tsx */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authStore';
import { useUser } from './useUser';

// Create a new QueryClient instance for each test run to ensure isolation
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for testing purposes
      },
    },
  });

// Wrapper component to provide the QueryClient to the hook
const createWrapper = (client: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
const mockToken = 'mock-jwt-token';

describe('useUser', () => {
  beforeEach(() => {
    // Reset auth store before each test
    useAuthStore.getState().logout();
  });

  it('should be disabled and not fetch data when user is not authenticated', () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isPending).toBe(true); // isPending is true because it's disabled
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.status).toBe('pending');
  });

  it('should be enabled and fetch user data when user is authenticated', async () => {
    // Simulate login
    useAuthStore.getState().login(mockUser, mockToken);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(queryClient),
    });

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toEqual(mockUser);
    expect(result.current.status).toBe('success');
  });
});
