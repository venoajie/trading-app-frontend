
// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
// ... other page imports
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { DecisionWorkspacePage } from './pages/DecisionWorkspacePage/DecisionWorkspacePage';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  useEffect(() => {
    // Initial load check
    const token = useAuthStore.getState().token;
    if (token) {
      useAuthStore.getState().fetchUserOnLoad();
    } else {
      useAuthStore.getState().setLoadingComplete();
    }

    // Cross-tab synchronization listener
    const handleStorageChange = (event) => {
      if (event.key === 'accessToken') {
        if (event.newValue) { // A token was set in another tab
          window.location.reload(); // Easiest way to re-sync the whole app state
        } else { // The token was removed in another tab
          useAuthStore.getState().logout();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* ... other standalone routes */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        {/* ... other public routes */}
        <Route path="portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
        <Route path="transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
        <Route path="decision-workspace" element={<ProtectedRoute><DecisionWorkspacePage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;