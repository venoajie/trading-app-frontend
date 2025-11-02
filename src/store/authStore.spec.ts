// src/store/authStore.spec.ts

import { describe, it, expect, afterEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('useAuthStore', () => {
  // Reset the store to its initial state after each test
  afterEach(() => {
    useAuthStore.getState().logout(); // A simple way to reset state
    useAuthStore.persist.clearStorage(); // Clear persisted state
  });

  it('should have a correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    // --- FIX: Assert against the correct 'isLoadingUser' property ---
    expect(state.isLoadingUser).toBe(false);
  });

  it('should handle logout correctly', () => {
    // Set a logged-in state first
    useAuthStore.setState({
      token: 'fake-token',
      user: { id: '1', email: 'test@test.com', name: 'Test User' },
      isAuthenticated: true,
      isLoadingUser: false,
    });

    // Perform logout
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    // --- FIX: Assert against the correct 'isLoadingUser' property ---
    expect(state.isLoadingUser).toBe(false);
  });

  it('should hydrate the session correctly', () => {
    const sessionData = {
      token: 'hydrated-token',
      user: { id: '2', email: 'hydrate@test.com', name: 'Hydrated User' },
    };

    // Set a loading state before hydrating to test if it gets reset
    useAuthStore.setState({ isLoadingUser: true });

    useAuthStore.getState().hydrateSession(sessionData);

    const state = useAuthStore.getState();
    expect(state.token).toBe(sessionData.token);
    expect(state.user).toEqual(sessionData.user);
    expect(state.isAuthenticated).toBe(true);
    // --- FIX: Assert that hydrateSession resets the loading state ---
    expect(state.isLoadingUser).toBe(false);
  });
});
