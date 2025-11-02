/** src/components/auth/PublicRoute.spec.tsx */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import { useAuth } from '../../hooks/useAuth';

// Mock the useAuth hook
vi.mock('../../hooks/useAuth');

describe('PublicRoute', () => {
  it('renders child component when user is not authenticated', () => {
    (useAuth as Mock).mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div>Login Page Content</div>
              </PublicRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page Content')).toBeInTheDocument();
  });

  it('redirects to the specified path when user is authenticated', () => {
    (useAuth as Mock).mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={<PublicRoute redirectPath="/dashboard" />}
          />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page Content')).not.toBeInTheDocument();
  });
});
