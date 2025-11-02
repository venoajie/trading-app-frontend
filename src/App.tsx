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
// --- FIX: This import now correctly resolves to a module with a default export ---
const AppLayout = lazy(() => import('./layouts/AppLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));

// Lazily-loaded Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const TransactionsPage = lazy(
  () => import('./pages/TransactionsPage/TransactionsPage')
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
        path: '/', // The root for authenticated users
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          // Redirect the base authenticated path to dashboard
          { index: true, element: <DashboardPage /> },
        ],
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
