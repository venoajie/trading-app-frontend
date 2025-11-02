/** src/components/auth/PublicRoute.tsx */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PublicRouteProps {
  redirectPath?: string;
  children?: React.ReactElement;
}

/**
 * A route guard for public routes (e.g., login, register).
 * If the user is already authenticated, they are redirected away from these pages.
 * Renders an <Outlet> by default to support nested routes.
 */
function PublicRoute({
  redirectPath = '/dashboard',
  children,
}: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
}

export default PublicRoute;
