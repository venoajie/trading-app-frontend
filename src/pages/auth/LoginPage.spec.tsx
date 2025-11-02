// src/pages/auth/LoginPage.spec.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from './LoginPage';
import useAuthStore from '../../store/authStore';

// Mock the canonical auth store to isolate the component for testing.
vi.mock('../../store/authStore');

// Define a reusable initial state for the mock store.
const mockInitialState = {
  login: vi.fn(),
  isLoading: false,
};

describe('LoginPage', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure test isolation.
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue(mockInitialState);
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  };

  it('renders the login form with all fields', () => {
    renderComponent();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('displays a validation error for an invalid email format', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText('Invalid email address')
    ).toBeInTheDocument();
    expect(mockInitialState.login).not.toHaveBeenCalled();
  });

  it('displays a validation error for an empty password', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText('Password cannot be empty')
    ).toBeInTheDocument();
    expect(mockInitialState.login).not.toHaveBeenCalled();
  });

  it('calls the login action from auth store on successful submission', async () => {
    const user = userEvent.setup();
    // Simulate a successful login action to test the complete flow.
    mockInitialState.login.mockResolvedValue(true);
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockInitialState.login).toHaveBeenCalledTimes(1);
      expect(mockInitialState.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
