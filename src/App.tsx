// src/App.tsx

import { lazy, Suspense, useEffect } from 'react'; // Import useEffect
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import the store to access the action
import { useUiStore } from './store/uiStore';

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
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

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
        path: '/',
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { index: true, element: <DashboardPage /> },
        ],
      },
    ],
  },
]);

function App() {
  // Re-introduce the logic to set AI availability from environment variables
  const { setAiAssistantAvailability } = useUiStore();

  useEffect(() => {
    const isAiEnabled = import.meta.env.VITE_AI_ASSISTANT_ENABLED === 'true';
    setAiAssistantAvailability(isAiEnabled);
  }, [setAiAssistantAvailability]);

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
