// src/App.tsx

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Utility Components
import ErrorBoundary from './components/utility/ErrorBoundary';
import Loading from './components/utility/Loading';

// Route Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

// Lazily-loaded Layouts
const AppLayout = lazy(() => import('./layouts/AppLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));

// Lazily-loaded Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));

// CORRECTED: Added .jsx extension for the non-TypeScript component.
const RegisterPage = lazy(() =>
  import('./pages/auth/RegisterPage.jsx').then((module) => ({
    default: module.RegisterPage,
  }))
);

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <AuthLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          { index: true, element: <HomePage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [{ index: true, element: <DashboardPage /> }],
      },
    ],
  },
]);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
