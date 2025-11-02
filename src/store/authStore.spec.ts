// src/store/authStore.spec.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useAuthStore } from './authStore';

// Mock user data for testing
const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
const mockToken = 'mock-jwt-token';

describe('useAuthStore', () => {
  // Reset the store to its initial state before each test
  beforeEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState());
  });

  // Clear localStorage after tests to avoid side-effects
  afterEach(() => {
    localStorage.clear();
  });

  it('should have a correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should update state correctly on login', () => {
    const { login } = useAuthStore.getState();
    login(mockUser, mockToken);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear state correctly on logout', () => {
    // First, set a logged-in state
    useAuthStore.setState({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
    });

    // Then, call the logout action
    const { logout } = useAuthStore.getState();
    logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
