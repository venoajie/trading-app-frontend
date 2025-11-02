// src/components/auth/ProtectedRoute.tsx */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactElement;
}

/**
 * A route guard that protects routes from unauthenticated access.
 * If the user is not authenticated, they are redirected to the specified path.
 * Renders an <Outlet> by default to support nested routes.
 */
function ProtectedRoute({ redirectPath = '/', children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
