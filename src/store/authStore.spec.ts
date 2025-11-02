/** src/store/authStore.spec.ts */

import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
const mockToken = 'mock-jwt-token';

// Get the initial state from the store definition for resetting
const initialState = useAuthStore.getState();

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    useAuthStore.setState(initialState);
  });

  it('should have a correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('should correctly hydrate the session on successful login simulation', () => {
    // CORRECTED: Call `hydrateSession` with a single session object.
    // This is the correct way to test the state transition.
    useAuthStore
      .getState()
      .hydrateSession({ user: mockUser, token: mockToken });

    const state = useAuthStore.getState();
    expect(state.token).toBe(mockToken);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false); // hydrateSession should also reset loading state
  });

  it('should clear user and token data on logout', () => {
    // First, set an authenticated state
    useAuthStore
      .getState()
      .hydrateSession({ user: mockUser, token: mockToken });
    let state = useAuthStore.getState();
    expect(state.token).toBe(mockToken); // Verify initial setup

    // Now, call logout
    useAuthStore.getState().logout();
    state = useAuthStore.getState();

    // Verify the state has been cleared
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
